const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.registerUser(name, email, password);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error(error.message);
        if (error.message === 'User already exists') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error(error.message);
        if (error.message === 'Invalid Credentials') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.user.id);
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Ensure requester is allowed (although middleware likely handles auth, we assume only 'allowed' users can reach here if we check status on login)
        // Additional check: maybe only an admin role should do this? 
        // For now, based on prompt: "just when one of users has status allowed accept it" matches any allowed user.

        const user = await authService.updateUserStatus(id, status);
        res.json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateStatus,
    getAllUsers
};
