const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled','completed'], default: 'pending' },
    source: { type: String, default: 'guest' }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;


