const Fournisseur = require('../models/fournisseur.model');

const fournisseurService = {
    // Create new fournisseur
    createFournisseur: async (data) => {
        const fournisseur = new Fournisseur(data);
        await fournisseur.save();
        return fournisseur;
    },

    // Get all fournisseurs
    getAllFournisseurs: async () => {
        return await Fournisseur.find().sort({ createdAt: -1 });
    },

    // Get fournisseur by ID
    getFournisseurById: async (id) => {
        return await Fournisseur.findById(id);
    },

    // Update fournisseur
    updateFournisseur: async (id, data) => {
        return await Fournisseur.findByIdAndUpdate(
            id,
            { ...data },
            { new: true, runValidators: true }
        );
    },

    // Delete fournisseur
    deleteFournisseur: async (id) => {
        const result = await Fournisseur.findByIdAndDelete(id);
        return !!result;
    },
};

module.exports = fournisseurService;
