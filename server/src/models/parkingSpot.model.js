// File: server/src/models/parkingSpot.model.js
const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
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
    hourlyRate: {
        type: Number,
        required: true
    },
    monthlyRate: {
        type: Number
    },
    description: {
        type: String,
        trim: true
    },
    hasRoof: {
        type: Boolean,
        default: false
    },
    vehicleTypes: [{
        type: String,
        enum: ['car', 'motorbike', 'truck', 'bicycle']
    }],
    numberOfSlots: {
        type: Number,
        default: 1
    },
    paymentMethods: [{
        type: String,
        enum: ['cash', 'paypal']
    }],
    images: [{
        type: String // URLs of spot images
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'archived'],
        default: 'pending'
    }
}, { timestamps: true });

// Create 2dsphere index for geo-queries
parkingSpotSchema.index({ location: '2dsphere' });

// Index for faster owner queries
parkingSpotSchema.index({ owner: 1, status: 1 });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;