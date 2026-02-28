const fournisseurService = require('../services/fournisseur.service');

const fournisseurController = {
    // Create new fournisseur
    createFournisseur: async (req, res) => {
        try {
            const fournisseurData = req.body;
            const newFournisseur = await fournisseurService.createFournisseur(fournisseurData);
            res.json({
                success: true,
                message: 'Fournisseur créé avec succès',
                data: newFournisseur
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all fournisseurs
    getAllFournisseurs: async (req, res) => {
        try {
            const fournisseurs = await fournisseurService.getAllFournisseurs();
            res.json({
                success: true,
                data: fournisseurs
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get fournisseur by ID
    getFournisseurById: async (req, res) => {
        try {
            const { id } = req.params;
            const fournisseur = await fournisseurService.getFournisseurById(id);
            if (!fournisseur) {
                return res.json({
                    success: false,
                    message: 'Fournisseur non trouvé'
                });
            }
            res.json({
                success: true,
                data: fournisseur
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update fournisseur
    updateFournisseur: async (req, res) => {
        try {
            const { id } = req.params;
            const fournisseurData = req.body;
            const updatedFournisseur = await fournisseurService.updateFournisseur(id, fournisseurData);

            if (!updatedFournisseur) {
                return res.json({
                    success: false,
                    message: 'Fournisseur non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Fournisseur mis à jour avec succès',
                data: updatedFournisseur
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete fournisseur
    deleteFournisseur: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await fournisseurService.deleteFournisseur(id);

            if (!deleted) {
                return res.json({
                    success: false,
                    message: 'Fournisseur non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Fournisseur supprimé avec succès'
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = fournisseurController;
