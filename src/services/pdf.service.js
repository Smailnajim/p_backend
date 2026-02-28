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
                    primary: '#d4af37', // Metallic Gold
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

                doc.fontSize(16).fillColor(Colors.primary).font('Helvetica-Bold')
                    .text('TOUHAMI DECOR', 120, 50);

                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica')
                    .text('Interior Design & Decoration', 120, 75)
                    .text('touhamidecor@gmail.com', 120, 90);

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

                // --- Status Badge ---
                const statusConfig = {
                    pending: { label: 'En attente', color: '#f59e0b', bgColor: '#fef3c7' },
                    paid: { label: 'Payé', color: '#10b981', bgColor: '#d1fae5' },
                    overdue: { label: 'En retard', color: '#ef4444', bgColor: '#fee2e2' },
                    cancelled: { label: 'Annulé', color: '#6b7280', bgColor: '#f3f4f6' }
                };
                const currentStatus = statusConfig[invoice.status] || statusConfig.pending;
                const statusLabel = `Statut: ${currentStatus.label}`;
                const statusY = 118;
                const statusTextWidth = doc.font('Helvetica-Bold').fontSize(9).widthOfString(statusLabel);
                const statusBadgeWidth = statusTextWidth + 16;
                const statusBadgeX = rightColX + rightColWidth - statusBadgeWidth;

                // Badge background
                doc.roundedRect(statusBadgeX, statusY - 2, statusBadgeWidth, 18, 4).fill(currentStatus.bgColor);
                // Badge text
                doc.font('Helvetica-Bold').fontSize(9).fillColor(currentStatus.color)
                    .text(statusLabel, statusBadgeX + 8, statusY + 2);


                // --- Client Info (Bill To) ---
                const billToTop = 180;

                // Section title with underline
                doc.fontSize(10).fillColor(Colors.primary).font('Helvetica-Bold')
                    .text('FACTURER À', 50, billToTop);
                doc.moveTo(50, billToTop + 16).lineTo(200, billToTop + 16)
                    .strokeColor(Colors.primary).lineWidth(1.5).stroke();

                // Client name
                let infoY = billToTop + 24;
                doc.fontSize(11).fillColor(Colors.text).font('Helvetica-Bold')
                    .text(invoice.clientName, 50, infoY);
                infoY += 18;

                // Email
                if (invoice.clientEmail) {
                    doc.fontSize(9).font('Helvetica')
                        .fillColor(Colors.secondary).text('Email: ', 50, infoY, { continued: true })
                        .fillColor(Colors.text).text(invoice.clientEmail);
                    infoY += 15;
                }

                // Address
                if (invoice.clientAddress) {
                    doc.fontSize(9).font('Helvetica')
                        .fillColor(Colors.secondary).text('Adresse: ', 50, infoY, { continued: true })
                        .fillColor(Colors.text).text(invoice.clientAddress, { width: 250 });
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
    },

    generateDevisPDF: (devis) => {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const buffers = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                const Colors = {
                    primary: '#d4af37',
                    secondary: '#64748b',
                    text: '#1e293b',
                    background: '#f8fafc',
                    white: '#ffffff',
                    border: '#e2e8f0'
                };

                // --- Header Background ---
                doc.rect(0, 0, doc.page.width, 160).fill(Colors.background);

                // --- Logo & Company Info ---
                const logoPath = path.join(__dirname, '..', '..', 'logo.png');
                try {
                    doc.image(logoPath, 50, 40, { width: 60 });
                } catch (e) {
                    console.warn('Logo file not found, skipping logo rendering.');
                }

                doc.fontSize(16).fillColor(Colors.primary).font('Helvetica-Bold')
                    .text('TOUHAMI DECOR', 120, 50);

                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica')
                    .text('Interior Design & Decoration', 120, 75)
                    .text('touhamidecor@gmail.com', 120, 90);

                // --- Devis Details (Top Right) ---
                const rightColX = 345;
                const rightColWidth = 200;

                doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica-Bold')
                    .text('DEVIS', rightColX, 50, { align: 'right', width: rightColWidth });

                doc.fontSize(10).font('Helvetica')
                    .text(`# ${devis.devisNumber}`, rightColX, 65, { align: 'right', width: rightColWidth });

                doc.text(`Date: ${new Date(devis.createdAt).toLocaleDateString('fr-FR')}`, rightColX, 85, { align: 'right', width: rightColWidth });
                doc.text(`Valide jusqu'au: ${new Date(devis.validUntil).toLocaleDateString('fr-FR')}`, rightColX, 100, { align: 'right', width: rightColWidth });

                // --- Status Badge ---
                const statusConfig = {
                    draft: { label: 'Brouillon', color: '#6b7280', bgColor: '#f3f4f6' },
                    sent: { label: 'Envoyé', color: '#3b82f6', bgColor: '#dbeafe' },
                    accepted: { label: 'Accepté', color: '#10b981', bgColor: '#d1fae5' },
                    rejected: { label: 'Refusé', color: '#ef4444', bgColor: '#fee2e2' }
                };
                const currentStatus = statusConfig[devis.status] || statusConfig.draft;
                const statusLabel = `Statut: ${currentStatus.label}`;
                const statusY = 118;
                const statusTextWidth = doc.font('Helvetica-Bold').fontSize(9).widthOfString(statusLabel);
                const statusBadgeWidth = statusTextWidth + 16;
                const statusBadgeX = rightColX + rightColWidth - statusBadgeWidth;

                doc.roundedRect(statusBadgeX, statusY - 2, statusBadgeWidth, 18, 4).fill(currentStatus.bgColor);
                doc.font('Helvetica-Bold').fontSize(9).fillColor(currentStatus.color)
                    .text(statusLabel, statusBadgeX + 8, statusY + 2);

                // --- Client Info ---
                const billToTop = 180;
                doc.fontSize(10).fillColor(Colors.primary).font('Helvetica-Bold')
                    .text('DEVIS POUR', 50, billToTop);
                doc.moveTo(50, billToTop + 16).lineTo(200, billToTop + 16)
                    .strokeColor(Colors.primary).lineWidth(1.5).stroke();

                let infoY = billToTop + 24;
                doc.fontSize(11).fillColor(Colors.text).font('Helvetica-Bold')
                    .text(devis.clientName, 50, infoY);
                infoY += 18;

                if (devis.clientEmail) {
                    doc.fontSize(9).font('Helvetica')
                        .fillColor(Colors.secondary).text('Email: ', 50, infoY, { continued: true })
                        .fillColor(Colors.text).text(devis.clientEmail);
                    infoY += 15;
                }
                if (devis.clientAddress) {
                    doc.fontSize(9).font('Helvetica')
                        .fillColor(Colors.secondary).text('Adresse: ', 50, infoY, { continued: true })
                        .fillColor(Colors.text).text(devis.clientAddress, { width: 250 });
                }

                // --- Items Table ---
                const tableTop = 280;
                const itemX = 50;
                const qtyX = 350;
                const priceX = 420;
                const totalX = 500;

                doc.rect(50, tableTop, 500, 25).fill(Colors.primary);
                doc.fillColor(Colors.white).font('Helvetica-Bold').fontSize(9);
                doc.text('DESCRIPTION', itemX + 10, tableTop + 8);
                doc.text('QTÉ', qtyX, tableTop + 8, { width: 40, align: 'center' });
                doc.text('PRIX UNIT.', priceX, tableTop + 8, { width: 60, align: 'right' });
                doc.text('TOTAL', totalX, tableTop + 8, { width: 50, align: 'right' });

                let y = tableTop + 35;
                doc.font('Helvetica').fontSize(9).fillColor(Colors.text);

                devis.items.forEach((item, i) => {
                    const rowHeight = 25;
                    if (i % 2 === 0) {
                        doc.rect(50, y - 5, 500, rowHeight).fill(Colors.background);
                    }
                    doc.fillColor(Colors.text);
                    doc.text(item.description, itemX + 10, y, { width: 280 });
                    doc.text(item.quantity.toString(), qtyX, y, { width: 40, align: 'center' });
                    doc.text(item.unitPrice.toFixed(2), priceX, y, { width: 60, align: 'right' });
                    doc.text(`${item.total.toFixed(2)} DH`, totalX, y, { width: 50, align: 'right' });
                    y += rowHeight;
                });

                doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor(Colors.border).stroke();

                // --- Totals ---
                y += 20;
                const totalsLabelX = 350;
                const totalsValueX = 500;

                doc.font('Helvetica').fontSize(10).fillColor(Colors.secondary);
                doc.text('Sous-total', totalsLabelX, y, { align: 'right', width: 100 });
                doc.text(`${devis.subtotal.toFixed(2)} DH`, totalsValueX, y, { align: 'right', width: 50 });

                if (devis.taxRate > 0) {
                    y += 30;
                    doc.text(`TVA (${devis.taxRate}%)`, totalsLabelX, y, { align: 'right', width: 100 });
                    doc.text(`${devis.taxAmount.toFixed(2)} DH`, totalsValueX, y, { align: 'right', width: 50 });
                }

                y += 40;
                doc.rect(totalsLabelX, y, 200, 25).fill(Colors.primary);
                doc.fillColor(Colors.white).font('Helvetica-Bold').fontSize(11);
                doc.text('TOTAL ESTIMÉ', totalsLabelX + 10, y + 7);
                doc.text(`${devis.total.toFixed(2)} DH`, totalsValueX - 30, y + 7, { align: 'right', width: 80 });

                // --- Notes ---
                if (devis.notes) {
                    y += 40;
                    if (y > 700) {
                        doc.addPage();
                        y = 50;
                    }
                    doc.fontSize(10).fillColor(Colors.secondary).font('Helvetica-Bold');
                    doc.text('NOTES :', 50, y);
                    doc.fontSize(9).fillColor(Colors.text).font('Helvetica');
                    doc.text(devis.notes, 50, y + 15, { width: 300 });
                }

                // --- Footer ---
                const footerY = 750;
                doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor(Colors.border).stroke();

                doc.font('Helvetica').fontSize(8).fillColor(Colors.secondary).text(
                    'Ce devis est valable pour la durée indiquée. Merci de votre confiance.',
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
