const PDFDocument = require('pdfkit');
const path = require('path');

const pdfService = {
    generateInvoicePDF: (invoice) => {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const buffers = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // Colors Configuration
                const Colors = {
                    primary: '#2563eb', // Blue
                    secondary: '#64748b', // Slate
                    text: '#1e293b', // Dark Slate
                    background: '#f8fafc', // Very light blue/gray
                    white: '#ffffff',
                    border: '#e2e8f0'
                };

                // --- Header Background ---
                doc.rect(0, 0, doc.page.width, 160).fill(Colors.background);

                // --- Logo & Company Info ---
                const logoPath = path.join(__dirname, '..', '..', 'logo.png');

                try {
                    // Attempt to load logo if it exists
                    doc.image(logoPath, 50, 40, { width: 60 });
                } catch (e) {
                    console.warn('Logo file not found, skipping logo rendering.');
                }

                doc.fontSize(20).fillColor(Colors.primary).font('Helvetica-Bold')
                    .text('TOUHAMI DECORE', 120, 50);

                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica')
                    .text('Interior Design & Decoration', 120, 75)
                    .text('contact@touhamidecore.com', 120, 90);

                // --- Invoice Details (Top Right) ---
                // We use a fixed width container aligned to the right margin (595 - 50 = 545)
                // Box starts at X=345, width=200
                const rightColX = 345;
                const rightColWidth = 200;

                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica-Bold')
                    .text('FACTURE', rightColX, 50, { align: 'right', width: rightColWidth });

                doc.fontSize(10).font('Helvetica')
                    .text(`# ${invoice.invoiceNumber}`, rightColX, 65, { align: 'right', width: rightColWidth });

                // Date
                const dateY = 85;
                doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('fr-FR')}`, rightColX, 85, { align: 'right', width: rightColWidth });
                doc.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, rightColX, 100, { align: 'right', width: rightColWidth });


                // --- Client Info (Bill To) ---
                const billToTop = 190;
                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica-Bold')
                    .text('FACTURER À', 50, billToTop);

                doc.fontSize(10).fillColor(Colors.text).font('Helvetica')
                    .text(invoice.clientName, 50, billToTop + 15);

                if (invoice.clientEmail) {
                    doc.fillColor(Colors.secondary).text(invoice.clientEmail, 50, billToTop + 30);
                }
                if (invoice.clientAddress) {
                    doc.text(invoice.clientAddress, 50, billToTop + 45, { width: 250 });
                }

                // --- Items Table ---
                const tableTop = 280;
                const itemX = 50;
                const qtyX = 350;
                const priceX = 420;
                const totalX = 500;

                // Headers
                doc.rect(50, tableTop, 500, 25).fill(Colors.primary);
                doc.fillColor(Colors.white).font('Helvetica-Bold').fontSize(9);
                doc.text('DESCRIPTION', itemX + 10, tableTop + 8);
                doc.text('QTÉ', qtyX, tableTop + 8, { width: 40, align: 'center' });
                doc.text('PRIX UNIT.', priceX, tableTop + 8, { width: 60, align: 'right' });
                doc.text('TOTAL', totalX, tableTop + 8, { width: 50, align: 'right' });

                // Rows
                let y = tableTop + 35;
                doc.font('Helvetica').fontSize(9).fillColor(Colors.text);

                invoice.items.forEach((item, i) => {
                    const rowHeight = 25;
                    // Zebra striping
                    if (i % 2 === 0) {
                        doc.rect(50, y - 5, 500, rowHeight).fill(Colors.background);
                    }

                    doc.fillColor(Colors.text);
                    doc.text(item.description, itemX + 10, y, { width: 280 });
                    doc.text(item.quantity.toString(), qtyX, y, { width: 40, align: 'center' });
                    doc.text(item.unitPrice.toFixed(2), priceX, y, { width: 60, align: 'right' });

                    // Improved Currency formatting: Bold amount, normal currency symbol
                    doc.text(`${item.total.toFixed(2)} DH`, totalX, y, { width: 50, align: 'right' });

                    y += rowHeight;
                });

                // Line separator
                doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor(Colors.border).stroke();

                // --- Totals ---
                y += 20;
                const totalsLabelX = 350;
                const totalsValueX = 500; // Alignment point for values

                doc.font('Helvetica').fontSize(10).fillColor(Colors.secondary);

                doc.text('Sous-total', totalsLabelX, y, { align: 'right', width: 100 });
                doc.text(`${invoice.subtotal.toFixed(2)} DH`, totalsValueX, y, { align: 'right', width: 50 });

                if (invoice.taxRate > 0) {
                    y += 30; // Increased spacing for TVA as well
                    doc.text(`TVA (${invoice.taxRate}%)`, totalsLabelX, y, { align: 'right', width: 100 });
                    doc.text(`${invoice.taxAmount.toFixed(2)} DH`, totalsValueX, y, { align: 'right', width: 50 });
                }

                y += 40; // Increased spacing

                // Total Highlight Box
                doc.rect(totalsLabelX, y, 200, 25).fill(Colors.primary);
                doc.fillColor(Colors.white).font('Helvetica-Bold').fontSize(11);
                doc.text('TOTAL À PAYER', totalsLabelX + 10, y + 7);
                // Ensure there is enough width for total + DH
                doc.text(`${invoice.total.toFixed(2)} DH`, totalsValueX - 30, y + 7, { align: 'right', width: 80 });

                // --- Notes Section ---
                if (invoice.notes) {
                    y += 40;
                    if (y > 700) { // Check if we need a new page for notes
                        doc.addPage();
                        y = 50;
                    }
                    doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica-Bold');
                    doc.text('NOTES :', 50, y);
                    doc.fontSize(9).fillColor(Colors.text).font('Helvetica');
                    doc.text(invoice.notes, 50, y + 15, { width: 300 });
                }

                // --- Footer ---
                const footerY = 750;
                doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor(Colors.border).stroke();

                doc.font('Helvetica').fontSize(8).fillColor(Colors.secondary).text(
                    'Merci de votre confiance. Pour toute question, veuillez nous contacter.',
                    50, footerY + 10, { align: 'center', width: 500 }
                );

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = pdfService;
