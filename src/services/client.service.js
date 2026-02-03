const { v4: uuidv4 } = require('uuid');

// In-memory storage
let clients = [];

const clientService = {
    // Create new client
    createClient: (data) => {
        const { name, email, phone, address, company } = data;

        if (!name) {
            throw new Error('Client name is required');
        }

        const client = {
            id: uuidv4(),
            name,
            email: email || '',
            phone: phone || '',
            address: address || '',
            company: company || '',
            createdAt: new Date().toISOString(),
        };

        clients.push(client);
        return client;
    },

    // Get all clients
    getAllClients: () => {
        return clients;
    },

    // Get client by ID
    getClientById: (id) => {
        return clients.find(client => client.id === id);
    },

    // Update client
    updateClient: (id, data) => {
        const index = clients.findIndex(client => client.id === id);
        if (index === -1) return null;

        clients[index] = {
            ...clients[index],
            ...data,
            id: clients[index].id,
            createdAt: clients[index].createdAt,
            updatedAt: new Date().toISOString(),
        };

        return clients[index];
    },

    // Delete client
    deleteClient: (id) => {
        const index = clients.findIndex(client => client.id === id);
        if (index === -1) return false;
        clients.splice(index, 1);
        return true;
    },
};

module.exports = clientService;
