const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

/**
 * @desc    Search for available parking spots
 * @route   GET /api/spots/search
 * @access  Public
 */
exports.searchSpots = async (req, res) => {
    try {
        // Check if this is a text-only search (from the second implementation in original file)
        // or a geo-search. The original file had two searchSpots functions, the second overwriting the first.
        // I will combine them or just use the logic that seems most relevant.
        // However, to be safe and preserve "legacy" behavior if the second one was intended:

        const { lng, lat, radius, startTime, endTime, q } = req.query;

        // If we have geo params, use geo search
        if (lng && lat) {
            if (!startTime || !endTime) {
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
            return res.json(await filterAvailableSpots(spots, startTime, endTime));
        }

        // Fallback to text-only search (the second implementation)
        if (!q || !startTime || !endTime) {
            // If it's just a check or something, but the original code required these.
            // Let's just implement the text search logic here if geo params are missing.
            if (!q && !startTime && !endTime) {
                // If nothing provided, maybe return empty or error?
                // Original code 1 returned 400. Original code 2 returned 400.
                return res.status(400).json({ message: 'Missing required search parameters' });
            }
        }

        const filter = {
            address: { $regex: q ? q.trim() : '', $options: 'i' },
            status: 'approved'
        };

        const spots = await ParkingSpot.find(filter);
        return res.json(await filterAvailableSpots(spots, startTime, endTime));

    } catch (error) {
        res.status(500).json({ message: 'Server error during spot search', error: error.message });
    }
};

// Helper function to filter available spots
async function filterAvailableSpots(spots, startTime, endTime) {
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
    return availableSpots;
}


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

    const imageUrl = req.file.path;

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
            { address: 1, _id: 1 }  // Include _id in the projection
        ).limit(10);

        const suggestions = spots.map(spot => {
            const isAirport = /Sân bay|Airport/i.test(spot.address);
            return {
                id: spot._id,  // Include the spot ID
                address: spot.address,
                type: isAirport ? 'airport' : 'standard'
            };
        });

        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching suggestions', error: error.message });
    }
};