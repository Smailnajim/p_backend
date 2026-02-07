const productService = require('../services/product.service');

const productController = {
    // Create new product
    createProduct: async (req, res) => {
        try {
            const productData = req.body;
            const newProduct = await productService.createProduct(productData);
            res.json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await productService.getAllProducts();
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Get product by ID
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            if (!product) {
                return res.json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Update product
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const productData = req.body;
            const updatedProduct = await productService.updateProduct(id, productData);

            if (!updatedProduct) {
                return res.json({
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
            res.json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete product
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await productService.deleteProduct(id);

            if (!deleted) {
                return res.json({
                    success: false,
                    message: 'Product not found'
                });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = productController;
