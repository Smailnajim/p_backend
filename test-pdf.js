const fs = require('fs');
const path = require('path');
const pdfService = require('./src/services/pdf.service');

const sampleInvoice = {
    invoiceNumber: 'INV-2023-001',
    createdAt: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    clientName: 'Jane Doe',
    clientEmail: 'jane.doe@example.com',
    clientAddress: '123 Main St, Anytown, CA 12345',
    items: [
        { description: 'Web Design Service', quantity: 1, unitPrice: 1500, total: 1500 },
        { description: 'Hosting (Annual)', quantity: 1, unitPrice: 120, total: 120 },
        { description: 'Domain Registration', quantity: 2, unitPrice: 15, total: 30 }
    ],
    subtotal: 1650,
    taxRate: 20,
    taxAmount: 330,
    total: 1980,
    notes: 'Please pay within 30 days. Thank you for your business!'
};

async function generateTestPDF() {
    try {
        console.log('Generating PDF...');
        const pdfBuffer = await pdfService.generateInvoicePDF(sampleInvoice);
        const outputPath = path.join(__dirname, 'test-invoice.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`PDF generated successfully at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

generateTestPDF();
