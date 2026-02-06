const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

// Update user status
router.patch('/status/:id', auth, authController.updateStatus);

// Get all users
router.get('/users', auth, authController.getAllUsers);

module.exports = router;
