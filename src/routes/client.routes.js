const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

// Create a new client
router.post('/', clientController.createClient);

// Get all clients
router.get('/', clientController.getAllClients);

// Get client by ID
router.get('/:id', clientController.getClientById);

// Update client
router.put('/:id', clientController.updateClient);

// Delete client
router.delete('/:id', clientController.deleteClient);

module.exports = router;
