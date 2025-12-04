const mongoose = require('mongoose');
const {
    PAYMENT_METHODS,
    BOOKING_PAYMENT_STATUS,
} = require('../constants/payment');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestFullName: { type: String, required: false },
    guestEmail: { type: String, required: false },
    guestPhoneNumber: { type: String, required: false },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    phoneNumber: { type: String, required: false },
    paymentStatus: {
        type: String,
        enum: Object.values(BOOKING_PAYMENT_STATUS),
        default: BOOKING_PAYMENT_STATUS.UNPAID,
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
        default: PAYMENT_METHODS.CASH,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: false,
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;