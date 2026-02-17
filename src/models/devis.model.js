const mongoose = require('mongoose');

const devisItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

const devisSchema = new mongoose.Schema({
    devisNumber: {
        type: String,
        required: true,
        unique: true
    },
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    clientEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    clientAddress: {
        type: String,
        trim: true
    },
    items: [devisItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    validUntil: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        default: 'draft'
    },
    convertedToInvoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        default: null
    }
}, {
    timestamps: true
});

// Virtual for id
devisSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

devisSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

// Static method to generate devis number
devisSchema.statics.generateDevisNumber = async function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `DEV-${year}${month}-`;

    const lastDevis = await this.findOne({
        devisNumber: { $regex: `^${prefix}` }
    }).sort({ devisNumber: -1 });

    let nextNumber = 1;
    if (lastDevis) {
        const lastNumber = parseInt(lastDevis.devisNumber.split('-').pop(), 10);
        nextNumber = lastNumber + 1;
    }

    return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};

module.exports = mongoose.model('Devis', devisSchema);
