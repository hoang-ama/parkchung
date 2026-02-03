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
        type: Number
        // Optional: if not set or 0, spot is "call-only" booking
    },
    contactPhone: {
        type: String,
        trim: true
        // Phone number for spots that only support call booking
    },
    openTime: {
        type: String,
        trim: true
        // Operating hours, e.g., "08:00-22:00" or "24/7"
    },
    bookingTypes: [{
        type: String,
        enum: ['call', 'online']
        // Array: can be ['online'], ['call'], or ['online', 'call']
    }],
    addOnServices: [{
        type: String,
        enum: ['valet', 'carwash', 'ev_charging']
        // Add-on services: valet = Valet Parking (free)
    }],
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
    ggRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
        // Google rating for the parking spot (0-5 stars, can be decimal like 4.9)
    },
    isActive: {
        type: Boolean,
        default: true
        // Host-controlled: false = temporarily deactivated (maintenance, full, etc.)
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'archived'],
        default: 'pending'
        // Admin-controlled approval status
    }
}, { timestamps: true });

// Pre-save hook: Ensure isActive is always defined
// This prevents future documents from being created without the isActive field
parkingSpotSchema.pre('save', function (next) {
    if (this.isActive === undefined || this.isActive === null) {
        this.isActive = true;
    }
    next();
});

// Create 2dsphere index for geo-queries
parkingSpotSchema.index({ location: '2dsphere' });

// Index for faster owner queries
parkingSpotSchema.index({ owner: 1, status: 1 });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;