const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const auth = require('../middleware/auth.middleware');

// Create a new client
router.post('/', auth, clientController.createClient);

// Get all clients
router.get('/', auth, clientController.getAllClients);

// Get client by ID
router.get('/:id', auth, clientController.getClientById);

// Update client
router.put('/:id', auth, clientController.updateClient);

// Delete client
router.delete('/:id', auth, clientController.deleteClient);

module.exports = router;
