const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const auth = require('../middleware/auth.middleware');

// Create a new invoice
router.post('/', auth, invoiceController.createInvoice);

// Get all invoices
router.get('/', auth, invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', auth, invoiceController.getInvoiceById);

// Generate PDF for invoice
router.get('/:id/pdf', auth, invoiceController.generateInvoicePDF);

// Update invoice status
router.patch('/:id/status', auth, invoiceController.updateInvoiceStatus);

// Update full invoice
router.put('/:id', auth, invoiceController.updateInvoice);

// Delete invoice
router.delete('/:id', auth, invoiceController.deleteInvoice);

module.exports = router;
