const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, require: false, trim: true },
    address: { type: String, required: true, trim: true },
    ward: { type: String, require: false, trim: true },
    street: { type: String, require: false, trim: true },
    city: { type: String, require: false, trim: true },
    district: { type: String, require: false, trim: true },
    country: { type: String, require: false, trim: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    ggRating: { type: Number, require: false},
    openTime: { type: String, require: false, trim: true },
    description: { type: String, trim: true },
    images: [{ type: String }],
    mapsView: { type: String, require: false, trim: true },
    email: { type: String, require: false, trim: true },
    hourlyRate: { type: Number, required: true },
    monthlyRate: { type: Number },
    hasRoof: { type: Boolean, default: false },
    vehicleTypes: [{ type: String, enum: ['car', 'motorbike', 'truck', 'bicycle'] }],
    numberOfSlots: { type: Number, default: 1 },
    paymentMethods: [{ type: String, enum: ['cash', 'paypal'] }],
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'archived'], default: 'pending' }
}, { timestamps: true });

parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;