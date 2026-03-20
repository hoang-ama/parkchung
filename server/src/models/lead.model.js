const mongoose = require('mongoose');
const { VN_PHONE_REGEX } = require('../utils/validation.util');

const leadSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (!v || v === '') return true;
                return VN_PHONE_REGEX.test(v);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (VD: 0901234567 hoặc 84901234567).'
        }
    },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    source: { type: String, default: 'guest' },
    paymentMethod: { type: String, default: 'OFFLINE' }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;


