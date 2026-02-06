const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
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

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
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
    items: [invoiceItemSchema],
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
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Virtual for id
invoiceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

invoiceSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

// Static method to generate invoice number
invoiceSchema.statics.generateInvoiceNumber = async function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.countDocuments();
    const number = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${number}`;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
