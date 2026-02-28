const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Virtual for id
fournisseurSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

fournisseurSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Fournisseur', fournisseurSchema);
