const PDFDocument = require('pdfkit');

const pdfService = {
    generateInvoicePDF: (invoice) => {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const buffers = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // Header
                doc.fontSize(28).fillColor('#2563eb').text('INVOICE', 50, 50);

                // Invoice Info
                doc.fontSize(10).fillColor('#374151');
                doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 400, 50, { align: 'right' });
                doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 400, 65, { align: 'right' });
                doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 400, 80, { align: 'right' });

                // Divider
                doc.moveTo(50, 110).lineTo(550, 110).strokeColor('#e5e7eb').stroke();

                // Bill To Section
                doc.fontSize(12).fillColor('#2563eb').text('BILL TO:', 50, 130);
                doc.fontSize(11).fillColor('#374151');
                doc.text(invoice.clientName, 50, 150);
                if (invoice.clientEmail) doc.text(invoice.clientEmail, 50, 165);
                if (invoice.clientAddress) doc.text(invoice.clientAddress, 50, 180, { width: 200 });

                // Items Table Header
                const tableTop = 240;
                doc.fillColor('#f3f4f6').rect(50, tableTop, 500, 25).fill();

                doc.fontSize(10).fillColor('#374151');
                doc.text('DESCRIPTION', 60, tableTop + 8);
                doc.text('QTY', 320, tableTop + 8);
                doc.text('UNIT PRICE', 380, tableTop + 8);
                doc.text('TOTAL', 480, tableTop + 8);

                // Items
                let yPosition = tableTop + 35;
                invoice.items.forEach((item, index) => {
                    doc.fillColor('#374151');
                    doc.text(item.description, 60, yPosition, { width: 250 });
                    doc.text(item.quantity.toString(), 320, yPosition);
                    doc.text(`$${item.unitPrice.toFixed(2)}`, 380, yPosition);
                    doc.text(`$${item.total.toFixed(2)}`, 480, yPosition);

                    // Row separator
                    yPosition += 25;
                    doc.moveTo(50, yPosition - 5).lineTo(550, yPosition - 5).strokeColor('#e5e7eb').stroke();
                });

                // Totals Section
                yPosition += 20;
                doc.moveTo(350, yPosition).lineTo(550, yPosition).strokeColor('#e5e7eb').stroke();

                yPosition += 15;
                doc.fontSize(10).fillColor('#6b7280');
                doc.text('Subtotal:', 380, yPosition);
                doc.text(`$${invoice.subtotal.toFixed(2)}`, 480, yPosition);

                if (invoice.taxRate > 0) {
                    yPosition += 20;
                    doc.text(`Tax (${invoice.taxRate}%):`, 380, yPosition);
                    doc.text(`$${invoice.taxAmount.toFixed(2)}`, 480, yPosition);
                }

                yPosition += 25;
                doc.fontSize(14).fillColor('#2563eb').font('Helvetica-Bold');
                doc.text('TOTAL:', 380, yPosition);
                doc.text(`$${invoice.total.toFixed(2)}`, 480, yPosition);

                // Notes Section
                if (invoice.notes) {
                    yPosition += 50;
                    doc.fontSize(10).fillColor('#6b7280').font('Helvetica');
                    doc.text('NOTES:', 50, yPosition);
                    doc.fontSize(9).fillColor('#374151');
                    doc.text(invoice.notes, 50, yPosition + 15, { width: 300 });
                }

                // Footer
                doc.fontSize(8).fillColor('#9ca3af');
                doc.text('Thank you for your business!', 50, 750, { align: 'center', width: 500 });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = pdfService;
