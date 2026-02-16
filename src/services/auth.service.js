const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password) => {
    let user = await User.findOne({ email });
    if (user) {
        throw new Error('L\'utilisateur existe déjà');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

const loginUser = async (email, password) => {
    let user = await User.findOne({ email });
    if (!user) {
        throw new Error('Identifiants invalides');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Identifiants invalides');
    }

    if (user.status !== 'allowed') {
        throw new Error('Compte bloqué. Veuillez attendre l\'approbation.');
    }

    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    return user;
};

const updateUserStatus = async (userId, status) => {
    if (!['blocked', 'allowed'].includes(status)) {
        throw new Error('Statut invalide');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    return user;
};

const getAllUsers = async () => {
    return await User.find().select('-password');
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUserStatus,
    getAllUsers
};
