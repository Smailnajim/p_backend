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
                message: 'Invoice created successfully',
                data: newInvoice
            });
        } catch (error) {
            res.status(400).json({
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
            res.status(500).json({
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
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            res.json({
                success: true,
                data: invoice
            });
        } catch (error) {
            res.status(500).json({
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
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }

            const pdfBuffer = await pdfService.generateInvoicePDF(invoice);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({
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
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }

            res.json({
                success: true,
                message: 'Invoice deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
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
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            const updatedInvoice = await invoiceService.updateInvoiceStatus(id, status);

            if (!updatedInvoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }

            res.json({
                success: true,
                message: 'Invoice status updated successfully',
                data: updatedInvoice
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = invoiceController;
