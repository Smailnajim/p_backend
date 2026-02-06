const clientService = require('../services/client.service');

const clientController = {
    // Create new client
    createClient: async (req, res) => {
        try {
            const clientData = req.body;
            const newClient = await clientService.createClient(clientData);
            res.status(201).json({
                success: true,
                message: 'Client created successfully',
                data: newClient
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all clients
    getAllClients: async (req, res) => {
        try {
            const clients = await clientService.getAllClients();
            res.json({
                success: true,
                data: clients
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get client by ID
    getClientById: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await clientService.getClientById(id);
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }
            res.json({
                success: true,
                data: client
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update client
    updateClient: async (req, res) => {
        try {
            const { id } = req.params;
            const clientData = req.body;
            const updatedClient = await clientService.updateClient(id, clientData);

            if (!updatedClient) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.json({
                success: true,
                message: 'Client updated successfully',
                data: updatedClient
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete client
    deleteClient: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await clientService.deleteClient(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            res.json({
                success: true,
                message: 'Client deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = clientController;
