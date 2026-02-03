const { v4: uuidv4 } = require('uuid');

// In-memory storage
let products = [];

const productService = {
    // Create new product/service
    createProduct: (data) => {
        const { name, description, price, category, type } = data;

        if (!name || price === undefined) {
            throw new Error('Product name and price are required');
        }

        const product = {
            id: uuidv4(),
            name,
            description: description || '',
            price: parseFloat(price),
            category: category || 'General',
            type: type || 'product', // 'product' or 'service'
            createdAt: new Date().toISOString(),
        };

        products.push(product);
        return product;
    },

    // Get all products
    getAllProducts: () => {
        return products;
    },

    // Get product by ID
    getProductById: (id) => {
        return products.find(product => product.id === id);
    },

    // Update product
    updateProduct: (id, data) => {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            ...data,
            price: data.price !== undefined ? parseFloat(data.price) : products[index].price,
            id: products[index].id,
            createdAt: products[index].createdAt,
            updatedAt: new Date().toISOString(),
        };

        return products[index];
    },

    // Delete product
    deleteProduct: (id) => {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return false;
        products.splice(index, 1);
        return true;
    },
};

module.exports = productService;
