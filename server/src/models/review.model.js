const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    spot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        default: ''
    },
    highlights: [{
        type: String
    }],
    detailedRating: {
        security: { type: Number, min: 1, max: 5, default: 5 },
        convenience: { type: Number, min: 1, max: 5, default: 5 },
        price: { type: Number, min: 1, max: 5, default: 5 }
    },
    photos: [{
        type: String
    }]
}, { timestamps: true });

// Create indexes for faster lookups
reviewSchema.index({ spot: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
