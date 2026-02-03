const productService = require('../services/product.service');

const productController = {
    // Create new product
    createProduct: (req, res) => {
        try {
            const productData = req.body;
            const newProduct = productService.createProduct(productData);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all products
    getAllProducts: (req, res) => {
        try {
            const products = productService.getAllProducts();
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get product by ID
    getProductById: (req, res) => {
        try {
            const { id } = req.params;
            const product = productService.getProductById(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Update product
    updateProduct: (req, res) => {
        try {
            const { id } = req.params;
            const productData = req.body;
            const updatedProduct = productService.updateProduct(id, productData);

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete product
    deleteProduct: (req, res) => {
        try {
            const { id } = req.params;
            const deleted = productService.deleteProduct(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = productController;
