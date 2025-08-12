const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true
        },
        courseName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    paymentMethod: {
        type: String,
        default: 'Razorpay'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('invoice', invoiceSchema);