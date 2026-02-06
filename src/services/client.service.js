const Client = require('../models/client.model');

const clientService = {
    // Create new client
    createClient: async (data) => {
        const client = new Client(data);
        await client.save();
        return client;
    },

    // Get all clients
    getAllClients: async () => {
        return await Client.find().sort({ createdAt: -1 });
    },

    // Get client by ID
    getClientById: async (id) => {
        return await Client.findById(id);
    },

    // Update client
    updateClient: async (id, data) => {
        return await Client.findByIdAndUpdate(
            id,
            { ...data },
            { new: true, runValidators: true }
        );
    },

    // Delete client
    deleteClient: async (id) => {
        const result = await Client.findByIdAndDelete(id);
        return !!result;
    },
};

module.exports = clientService;
