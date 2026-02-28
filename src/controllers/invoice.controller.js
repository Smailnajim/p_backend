const invoiceService = require('../services/invoice.service');
const pdfService = require('../services/pdf.service');

const invoiceController = {
    // Create new invoice
    createInvoice: async (req, res) => {
        try {
            const invoiceData = req.body;
            const newInvoice = await invoiceService.createInvoice(invoiceData);
            res.json({
                success: true,
                message: 'Facture créée avec succès',
                data: newInvoice
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all invoices
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await invoiceService.getAllInvoices();
            res.json({
                success: true,
                data: invoices
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get invoice by ID
    getInvoiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await invoiceService.getInvoiceById(id);
            if (!invoice) {
                return res.json({
                    success: false,
                    message: 'Facture non trouvée'
                });
            }
            res.json({
                success: true,
                data: invoice
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Generate PDF for invoice
    generateInvoicePDF: async (req, res) => {
        try {
            const { id } = req.params;
            const invoice = await invoiceService.getInvoiceById(id);

            if (!invoice) {
                return res.json({
                    success: false,
                    message: 'Facture non trouvée'
                });
            }

            const pdfBuffer = await pdfService.generateInvoicePDF(invoice);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete invoice
    deleteInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await invoiceService.deleteInvoice(id);

            if (!deleted) {
                return res.json({
                    success: false,
                    message: 'Facture non trouvée'
                });
            }

            res.json({
                success: true,
                message: 'Facture supprimée avec succès'
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update invoice status
    updateInvoiceStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'paid', 'cancelled', 'overdue'];
            if (!validStatuses.includes(status)) {
                return res.json({
                    success: false,
                    message: `Statut invalide. Doit être l'un des suivants : ${validStatuses.join(', ')}`
                });
            }

            const updatedInvoice = await invoiceService.updateInvoiceStatus(id, status);

            if (!updatedInvoice) {
                return res.json({
                    success: false,
                    message: 'Facture non trouvée'
                });
            }

            res.json({
                success: true,
                message: 'Statut de la facture mis à jour avec succès',
                data: updatedInvoice
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update full invoice
    updateInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedInvoice = await invoiceService.updateInvoice(id, req.body);
            if (!updatedInvoice) {
                return res.json({ success: false, message: 'Facture non trouvée' });
            }
            res.json({ success: true, message: 'Facture mise à jour avec succès', data: updatedInvoice });
        } catch (error) {
            res.json({ success: false, message: error.message });
        }
    }
};

module.exports = invoiceController;
