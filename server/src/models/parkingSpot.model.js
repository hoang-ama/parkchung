const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    // Sử dụng cho truy vấn địa lý
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    hourlyRate: { type: Number, required: true },
    monthlyRate: { type: Number },
    // Trạng thái để admin phê duyệt
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    images: [{ type: String }],
}, { timestamps: true });

// Tạo chỉ mục 2dsphere để tối ưu hóa truy vấn vị trí
parkingSpotSchema.index({ location: '2dsphere' });

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
module.exports = ParkingSpot;
