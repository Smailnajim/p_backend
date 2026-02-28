const express = require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseur.controller');
const auth = require('../middleware/auth.middleware');

// Create a new fournisseur
router.post('/', auth, fournisseurController.createFournisseur);

// Get all fournisseurs
router.get('/', auth, fournisseurController.getAllFournisseurs);

// Get fournisseur by ID
router.get('/:id', auth, fournisseurController.getFournisseurById);

// Update fournisseur
router.put('/:id', auth, fournisseurController.updateFournisseur);

// Delete fournisseur
router.delete('/:id', auth, fournisseurController.deleteFournisseur);

module.exports = router;
