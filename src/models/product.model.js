const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    type: {
        type: String,
        enum: ['product', 'service'],
        default: 'product'
    },
    fournisseur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        default: null
    },
    paiementEffectue: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for id
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Product', productSchema);
