const Product = require('../models/product.model');

const productService = {
    // Create new product/service
    createProduct: async (data) => {
        const product = new Product(data);
        await product.save();
        return product;
    },

    // Get all products
    getAllProducts: async () => {
        return await Product.find().populate('fournisseur').sort({ createdAt: -1 });
    },

    // Get product by ID
    getProductById: async (id) => {
        return await Product.findById(id).populate('fournisseur');
    },

    // Update product
    updateProduct: async (id, data) => {
        return await Product.findByIdAndUpdate(
            id,
            { ...data },
            { new: true, runValidators: true }
        );
    },

    // Delete product
    deleteProduct: async (id) => {
        const result = await Product.findByIdAndDelete(id);
        return !!result;
    },
};

module.exports = productService;
