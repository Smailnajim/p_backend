const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let invoices = [];

const invoiceService = {
    // Generate invoice number
    generateInvoiceNumber: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `INV-${year}${month}-${random}`;
    },

    // Create new invoice
    createInvoice: (data) => {
        const { clientName, clientEmail, clientAddress, items, notes, dueDate } = data;

        if (!clientName || !items || items.length === 0) {
            throw new Error('Client name and at least one item are required');
        }

        // Calculate totals
        const calculatedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));

        const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
        const taxRate = data.taxRate || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        const invoice = {
            id: uuidv4(),
            invoiceNumber: invoiceService.generateInvoiceNumber(),
            clientName,
            clientEmail: clientEmail || '',
            clientAddress: clientAddress || '',
            items: calculatedItems,
            subtotal,
            taxRate,
            taxAmount,
            total,
            notes: notes || '',
            createdAt: new Date().toISOString(),
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending'
        };

        invoices.push(invoice);
        return invoice;
    },

    // Get all invoices
    getAllInvoices: () => {
        return invoices;
    },

    // Get invoice by ID
    getInvoiceById: (id) => {
        return invoices.find(inv => inv.id === id);
    },

    // Delete invoice
    deleteInvoice: (id) => {
        const index = invoices.findIndex(inv => inv.id === id);
        if (index === -1) return false;
        invoices.splice(index, 1);
        return true;
    },

    // Update invoice status
    updateInvoiceStatus: (id, status) => {
        const invoice = invoices.find(inv => inv.id === id);
        if (!invoice) return null;
        invoice.status = status;
        return invoice;
    }
};

module.exports = invoiceService;
