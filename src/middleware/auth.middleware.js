const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        if (user.status === 'blocked') {
            return res.status(403).json({ success: false, message: 'Your account is blocked. You cannot continue.' });
        }

        req.user = decoded;
        console.log('decoded **', decoded);
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = auth;
