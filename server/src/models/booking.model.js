const mongoose = require('mongoose');
const {
    PAYMENT_METHODS,
    BOOKING_PAYMENT_STATUS,
} = require('../constants/payment');
const { VN_PHONE_REGEX } = require('../utils/validation.util');

const vnPhoneValidator = {
    validator: function (v) {
        if (!v || v === '') return true;
        return VN_PHONE_REGEX.test(v);
    },
    message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (VD: 0901234567 hoặc 84901234567).'
};

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestFullName: { type: String, required: false },
    guestEmail: { type: String, required: false },
    guestPhoneNumber: { type: String, required: false, validate: vnPhoneValidator },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    phoneNumber: { type: String, required: false, validate: vnPhoneValidator },
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