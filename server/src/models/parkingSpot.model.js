const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true, trim: true },
    nameAddress: { type: String, required: true, trim: true },
    spotQuery: { type: String, required: false, trim: true },
    spotCategory: { type: String, required: false, trim: true },
    spotType: { type: String, required: false, trim: true },
    spotPhone: { type: String, required: false, trim: true },
    workingHours: { type: String, required: false, trim: true },
    otherHours: { type: String, required: false, trim: true },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    images: [{
        type: String,
        required: false, // Ảnh có thể không bắt buộc lúc tạo, nhưng sẽ được thêm sau
    }],
    hourlyRate: { type: Number, required: true },
    monthlyRate: { type: Number },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    images: [{ type: String }],
}, { timestamps: true });

parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;