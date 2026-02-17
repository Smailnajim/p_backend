const express = require('express');
const router = express.Router();
const devisController = require('../controllers/devis.controller');
const auth = require('../middleware/auth.middleware');

// Create a new devis
router.post('/', auth, devisController.createDevis);

// Get all devis
router.get('/', auth, devisController.getAllDevis);

// Get devis by ID
router.get('/:id', auth, devisController.getDevisById);

// Generate PDF for devis
router.get('/:id/pdf', auth, devisController.generateDevisPDF);

// Update devis status
router.patch('/:id/status', auth, devisController.updateDevisStatus);

// Convert devis to invoice
router.post('/:id/convert', auth, devisController.convertToInvoice);

// Delete devis
router.delete('/:id', auth, devisController.deleteDevis);

module.exports = router;
