const express = require('express');
const router = express.Router();
const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');
const { protect } = require('../middlewares/auth.middleware');

// API Endpoint chính cho chức năng tìm kiếm
router.get('/search', async (req, res) => {
    try {
        const { lng, lat, radius, startTime, endTime } = req.query;

        // Tìm các điểm đỗ xe trong bán kính (ví dụ: 5000 mét)
        const spots = await ParkingSpot.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) || 5000
                }
            },
            status: 'approved' // Chỉ tìm các điểm đã được duyệt
        });
        
        // Lọc các điểm đã có người đặt trong khoảng thời gian tìm kiếm
        const availableSpots = [];
        for (const spot of spots) {
            const conflictingBooking = await Booking.findOne({
                spot: spot._id,
                status: 'confirmed',
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
                ]
            });

            if (!conflictingBooking) {
                availableSpots.push(spot);
            }
        }

        res.json(availableSpots);
    } catch (error) {
        res.status(500).json({ message: 'Server error during search' });
    }
});


// Tạo một điểm đỗ xe mới (chức năng "Become a Host")
router.post('/', protect, async (req, res) => {
    const { address, longitude, latitude, hourlyRate } = req.body;
    try {
        const newSpot = new ParkingSpot({
            owner: req.user._id,
            address,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            hourlyRate
        });
        const createdSpot = await newSpot.save();
        res.status(201).json(createdSpot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;