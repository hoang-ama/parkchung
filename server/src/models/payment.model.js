const mongoose = require('mongoose');
const {
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
} = require('../constants/payment');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    method: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUSES),
        default: PAYMENT_STATUSES.INITIATED,
    },
    amountVnd: { type: Number, required: false },
    amountUsd: { type: Number, required: false },
    currency: { type: String, default: 'USD' },
    paypalOrderId: { type: String },
    paypalCaptureId: { type: String },
    paypalAuthorizationId: { type: String },
    payerEmail: { type: String },
    rawResponse: { type: mongoose.Schema.Types.Mixed },
    metadata: { type: mongoose.Schema.Types.Mixed },
    lastWebhookEventId: { type: String },
}, {
    timestamps: true,
});

paymentSchema.index({ paypalOrderId: 1 }, { unique: false });
paymentSchema.index({ paypalCaptureId: 1 }, { unique: false });
paymentSchema.index({ booking: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

