const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

/**
 * @desc    Search for available parking spots
 * @route   GET /api/spots/search
 * @access  Public
 */
exports.searchSpots = async (req, res) => {
    try {
        const { lng, lat, radius, startTime, endTime, q } = req.query;

        if (!lng || !lat || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required search parameters' });
        }

        const filter = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) || 10000 
                }
            },
            status: 'approved'
        };

        if (q) {
            filter.address = { $regex: q, $options: 'i' };
        }

        const spots = await ParkingSpot.find(filter);

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
    if (!req.body) {
        return res.status(400).json({ message: 'Form data is missing.' });
    }

    const { address, longitude, latitude, hourlyRate, monthlyRate } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ message: 'An image for the spot is required.' });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const newSpot = new ParkingSpot({
            owner: req.user._id,
            address,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            hourlyRate,
            monthlyRate,
            images: [imageUrl]
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

/**
 * @desc    Get parking spot address suggestions for autocomplete
 * @route   GET /api/spots/autocomplete
 * @access  Public
 */
exports.getAutocompleteSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json([]); // return nếu query quá ngắn
        }

        const spots = await ParkingSpot.find(
            { address: { $regex: q.trim(), $options: 'i' } },
            { address: 1 } 
        ).limit(5); 
        const suggestions = spots.map(spot => spot.address);
        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching suggestions', error: error.message });
    }
};

/**
 * @desc    Search for available parking spots (Logic mới: Chỉ tìm theo văn bản)
 * @route   GET /api/spots/search
 * @access  Public
 */
exports.searchSpots = async (req, res) => {
    try {
        const { q, startTime, endTime } = req.query;

        if (!q || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required search parameters (query, start time, end time).' });
        }

        const filter = {
            address: { $regex: q.trim(), $options: 'i' }, 
            status: 'approved'
        };

        const spots = await ParkingSpot.find(filter);

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