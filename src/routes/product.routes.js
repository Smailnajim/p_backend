const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');

// Create a new product
router.post('/', auth, productController.createProduct);

// Get all products
router.get('/', auth, productController.getAllProducts);

// Get product by ID
router.get('/:id', auth, productController.getProductById);

// Update product
router.put('/:id', auth, productController.updateProduct);

// Delete product
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
