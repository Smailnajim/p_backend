const Devis = require('../models/devis.model');
const Invoice = require('../models/invoice.model');

const devisService = {
    // Create new devis
    createDevis: async (data) => {
        const { clientName, clientEmail, clientAddress, items, notes, validUntil, taxRate = 0 } = data;

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

        const devisNumber = await Devis.generateDevisNumber();

        const devis = new Devis({
            devisNumber,
            clientName,
            clientEmail: clientEmail || '',
            clientAddress: clientAddress || '',
            items: calculatedItems,
            subtotal,
            taxRate,
            taxAmount,
            total,
            notes: notes || '',
            validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'draft'
        });

        await devis.save();
        return devis;
    },

    // Get all devis
    getAllDevis: async () => {
        return await Devis.find().sort({ createdAt: -1 });
    },

    // Get devis by ID
    getDevisById: async (id) => {
        return await Devis.findById(id);
    },

    // Delete devis
    deleteDevis: async (id) => {
        const result = await Devis.findByIdAndDelete(id);
        return !!result;
    },

    // Update devis status
    updateDevisStatus: async (id, status) => {
        return await Devis.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
    },

    // Convert devis to invoice
    convertToInvoice: async (devisId) => {
        const devis = await Devis.findById(devisId);
        if (!devis) {
            throw new Error('Devis non trouvé');
        }

        if (devis.convertedToInvoice) {
            throw new Error('Ce devis a déjà été converti en facture');
        }

        const invoiceNumber = await Invoice.generateInvoiceNumber();

        const invoice = new Invoice({
            invoiceNumber,
            clientName: devis.clientName,
            clientEmail: devis.clientEmail,
            clientAddress: devis.clientAddress,
            items: devis.items,
            subtotal: devis.subtotal,
            taxRate: devis.taxRate,
            taxAmount: devis.taxAmount,
            total: devis.total,
            notes: devis.notes,
            dueDate: devis.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending'
        });

        await invoice.save();

        // Mark devis as accepted and link to invoice
        devis.status = 'accepted';
        devis.convertedToInvoice = invoice._id;
        await devis.save();

        return { devis, invoice };
    }
};

module.exports = devisService;
