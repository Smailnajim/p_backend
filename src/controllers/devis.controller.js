const devisService = require('../services/devis.service');
const pdfService = require('../services/pdf.service');

const devisController = {
    // Create new devis
    createDevis: async (req, res) => {
        try {
            const devisData = req.body;
            const newDevis = await devisService.createDevis(devisData);
            res.json({
                success: true,
                message: 'Devis créé avec succès',
                data: newDevis
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all devis
    getAllDevis: async (req, res) => {
        try {
            const devis = await devisService.getAllDevis();
            res.json({
                success: true,
                data: devis
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get devis by ID
    getDevisById: async (req, res) => {
        try {
            const { id } = req.params;
            const devis = await devisService.getDevisById(id);
            if (!devis) {
                return res.json({
                    success: false,
                    message: 'Devis non trouvé'
                });
            }
            res.json({
                success: true,
                data: devis
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Generate PDF for devis
    generateDevisPDF: async (req, res) => {
        try {
            const { id } = req.params;
            const devis = await devisService.getDevisById(id);

            if (!devis) {
                return res.json({
                    success: false,
                    message: 'Devis non trouvé'
                });
            }

            const pdfBuffer = await pdfService.generateDevisPDF(devis);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=devis-${devis.devisNumber}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete devis
    deleteDevis: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await devisService.deleteDevis(id);

            if (!deleted) {
                return res.json({
                    success: false,
                    message: 'Devis non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Devis supprimé avec succès'
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update devis status
    updateDevisStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.json({
                    success: false,
                    message: `Statut invalide. Doit être l'un des suivants : ${validStatuses.join(', ')}`
                });
            }

            const updatedDevis = await devisService.updateDevisStatus(id, status);

            if (!updatedDevis) {
                return res.json({
                    success: false,
                    message: 'Devis non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Statut du devis mis à jour avec succès',
                data: updatedDevis
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Convert devis to invoice
    convertToInvoice: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await devisService.convertToInvoice(id);

            res.json({
                success: true,
                message: 'Devis converti en facture avec succès',
                data: result
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = devisController;
