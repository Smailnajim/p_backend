const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

// Create a new invoice
router.post('/', invoiceController.createInvoice);

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Generate PDF for invoice
router.get('/:id/pdf', invoiceController.generateInvoicePDF);

// Update invoice status
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
