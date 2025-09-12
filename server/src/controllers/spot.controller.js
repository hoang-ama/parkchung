const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

/**
 * @desc    Search for available parking spots
 * @route   GET /api/spots/search
 * @access  Public
 */
exports.searchSpots = async (req, res) => {
    try {
        const { lng, lat, radius, startTime, endTime } = req.query;

        if (!lng || !lat || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required search parameters' });
        }

        // 1. Tìm các điểm đỗ xe trong bán kính đã cho và đã được duyệt
        const spots = await ParkingSpot.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) || 5000 // Mặc định 5km
                }
            },
            status: 'approved'
        });

        // 2. Lọc ra các điểm còn trống trong khoảng thời gian yêu cầu
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
        res.status(500).json({ message: 'Server error during spot search', error: error.message });
    }
};

/**
 * @desc    Create a new parking spot
 * @route   POST /api/spots
 * @access  Private (User must be logged in)
 */
exports.createSpot = async (req, res) => {
    const { address, longitude, latitude, hourlyRate, monthlyRate, images } = req.body;
    try {
        const newSpot = new ParkingSpot({
            owner: req.user._id, // Lấy từ middleware `protect`
            address,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            hourlyRate,
            monthlyRate,
            images
        });
        const createdSpot = await newSpot.save();
        res.status(201).json(createdSpot);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create spot', error: error.message });
    }
};

/**
 * @desc    Get a single parking spot by ID
 * @route   GET /api/spots/:id
 * @access  Public
 */
exports.getSpotById = async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id).populate('owner', 'fullName email');
        if (spot) {
            res.json(spot);
        } else {
            res.status(404).json({ message: 'Parking spot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};