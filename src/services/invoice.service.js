const Invoice = require('../models/invoice.model');

const invoiceService = {
    // Create new invoice
    createInvoice: async (data) => {
        const { clientName, clientEmail, clientAddress, items, notes, dueDate, taxRate = 0 } = data;

        if (!clientName || !items || items.length === 0) {
            throw new Error('Le nom du client et au moins un article sont requis');
        }

        // Calculate totals
        const calculatedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));

        const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        // Generate invoice number
        const invoiceNumber = await Invoice.generateInvoiceNumber();

        const invoice = new Invoice({
            invoiceNumber,
            clientName,
            clientEmail: clientEmail || '',
            clientAddress: clientAddress || '',
            items: calculatedItems,
            subtotal,
            taxRate,
            taxAmount,
            total,
            notes: notes || '',
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending'
        });

        await invoice.save();
        return invoice;
    },

    // Get all invoices
    getAllInvoices: async () => {
        return await Invoice.find().sort({ createdAt: -1 });
    },

    // Get invoice by ID
    getInvoiceById: async (id) => {
        return await Invoice.findById(id);
    },

    // Delete invoice
    deleteInvoice: async (id) => {
        const result = await Invoice.findByIdAndDelete(id);
        return !!result;
    },

    // Update invoice status
    updateInvoiceStatus: async (id, status) => {
        return await Invoice.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
    },

    // Update full invoice
    updateInvoice: async (id, data) => {
        const { clientName, clientEmail, clientAddress, items, notes, dueDate, taxRate = 0 } = data;

        if (!clientName || !items || items.length === 0) {
            throw new Error('Le nom du client et au moins un article sont requis');
        }

        const calculatedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice
        }));

        const subtotal = calculatedItems.reduce((sum, item) => sum + item.total, 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        return await Invoice.findByIdAndUpdate(
            id,
            {
                clientName, clientEmail: clientEmail || '', clientAddress: clientAddress || '',
                items: calculatedItems, subtotal, taxRate, taxAmount, total,
                notes: notes || '', dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            { new: true }
        );
    }
};

module.exports = invoiceService;
