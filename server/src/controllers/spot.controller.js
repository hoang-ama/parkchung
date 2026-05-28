const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');
const fetch = require('node-fetch');

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

        const { lng, lat, radius, startTime, endTime, q, dropoff } = req.query;
        const searchVal = q || dropoff || '';
        const escapedSearchVal = searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
                status: 'approved',
                isActive: { $ne: false }  // Only show active spots (or undefined, treating as active by default)
            };

            if (escapedSearchVal) {
                filter.address = { $regex: escapedSearchVal, $options: 'i' };
            }

            const spots = await ParkingSpot.find(filter);
            return res.json(await filterAvailableSpots(spots, startTime, endTime));
        }

        // Fallback to text-only search (the second implementation)
        if (!searchVal || !startTime || !endTime) {
            // If it's just a check or something, but the original code required these.
            // Let's just implement the text search logic here if geo params are missing.
            if (!searchVal && !startTime && !endTime) {
                // If nothing provided, maybe return empty or error?
                // Original code 1 returned 400. Original code 2 returned 400.
                return res.status(400).json({ message: 'Missing required search parameters' });
            }
        }

        const filter = {
            $or: [
                { name: { $regex: escapedSearchVal ? escapedSearchVal.trim() : '', $options: 'i' } },
                { address: { $regex: escapedSearchVal ? escapedSearchVal.trim() : '', $options: 'i' } }
            ],
            status: 'approved',
            isActive: { $ne: false }  // Only show active spots (or undefined)
        };

        console.log('[DEBUG] searchSpots query:', { searchVal, escapedSearchVal, startTime, endTime });
        console.log('[DEBUG] filter:', JSON.stringify(filter));
        const spots = await ParkingSpot.find(filter);
        console.log('[DEBUG] Found spots:', spots.map(s => ({ id: s._id, name: s.name, address: s.address, status: s.status, isActive: s.isActive })));
        const available = await filterAvailableSpots(spots, startTime, endTime);
        console.log('[DEBUG] Available spots:', available.map(s => s._id));
        return res.json(available);

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
        const spot = await ParkingSpot.findById(req.params.id).populate('owner', 'fullName email phone');
        // Only return approved and active spots to customers
        if (spot && spot.status === 'approved' && spot.isActive !== false) {
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
        const { q, type, category } = req.query;
        const activeCategory = category || type;
        const queryObj = {
            status: 'approved',
            isActive: { $ne: false }
        };

        // Filter by category type using regex if requested
        if (activeCategory) {
            if (activeCategory === 'airport') {
                queryObj.$or = [
                    { name: { $regex: 'Sân bay|Airport', $options: 'i' } },
                    { address: { $regex: 'Sân bay|Airport', $options: 'i' } }
                ];
            } else if (activeCategory === 'station') {
                queryObj.$or = [
                    { name: { $regex: 'Ga |Nhà ga|Station', $options: 'i' } },
                    { address: { $regex: 'Ga |Nhà ga|Station', $options: 'i' } }
                ];
            } else if (activeCategory === 'hospital') {
                queryObj.$or = [
                    { name: { $regex: 'Bệnh viện|Hospital', $options: 'i' } },
                    { address: { $regex: 'Bệnh viện|Hospital', $options: 'i' } }
                ];
            } else if (activeCategory === 'other') {
                queryObj.$and = [
                    { name: { $not: { $regex: 'Sân bay|Airport|Ga |Nhà ga|Station|Bệnh viện|Hospital', $options: 'i' } } },
                    { address: { $not: { $regex: 'Sân bay|Airport|Ga |Nhà ga|Station|Bệnh viện|Hospital', $options: 'i' } } }
                ];
            }
        }

        // If query string q is provided, append it to search in address or name
        if (q && q.trim().length >= 2) {
            const searchRegex = { $regex: q.trim(), $options: 'i' };
            if (queryObj.$or) {
                // If we already have $or category filter, we must intersect it
                queryObj.$and = queryObj.$and || [];
                queryObj.$and.push({
                    $or: [
                        { name: searchRegex },
                        { address: searchRegex }
                    ]
                });
            } else {
                queryObj.$or = [
                    { name: searchRegex },
                    { address: searchRegex }
                ];
            }
        }

        const spots = await ParkingSpot.find(
            queryObj,
            { name: 1, address: 1, _id: 1 }
        ).limit(10);

        const suggestions = spots.map(spot => {
            const nameOrAddress = spot.name || spot.address;
            const isAirport = /Sân bay|Airport/i.test(nameOrAddress);
            const isStation = /Ga |Nhà ga|Station/i.test(nameOrAddress);
            const isHospital = /Bệnh viện|Hospital/i.test(nameOrAddress);
            
            let resolvedType = 'standard';
            if (isAirport) resolvedType = 'airport';
            else if (isStation) resolvedType = 'station';
            else if (isHospital) resolvedType = 'hospital';

            return {
                id: spot._id,
                name: spot.name || spot.address.split(',')[0],
                address: spot.address,
                type: resolvedType
            };
        });

        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching suggestions', error: error.message });
    }
};

/**
 * @desc    Calculate valet booking price preview
 * @route   GET /api/spots/valet-price
 * @access  Public
 */
exports.calculateValetPrice = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Missing startTime or endTime query parameters' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid date formats' });
        }

        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Round up to the next full day (e.g. 1 hour is counted as 1 day)
        const msPerDay = 24 * 60 * 60 * 1000;
        const days = Math.max(1, Math.ceil(diffMs / msPerDay));
        const ratePerDay = 30000; // Flat rate of 30,000 VND per day
        const totalPrice = days * ratePerDay;

        res.json({
            status: 'success',
            totalPrice,
            days,
            rate: ratePerDay
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error calculating valet price', error: error.message });
    }
};

/**
 * @desc    Convert search address query to lat/lng coordinates
 * @route   GET /api/spots/geocode
 * @access  Public
 */
exports.geocodeAddress = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ message: 'Địa điểm tìm kiếm không hợp lệ' });
        }

        const query = q.trim();

        // 0. Try local database match first (highly accurate for existing spots)
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const localSpot = await ParkingSpot.findOne({
            $or: [
                { name: { $regex: escapedQuery, $options: 'i' } },
                { address: { $regex: escapedQuery, $options: 'i' } }
            ],
            status: 'approved',
            isActive: { $ne: false }
        });
        if (localSpot && localSpot.location && localSpot.location.coordinates) {
            console.log('[GEOCORDING] Found spot in local database:', localSpot.name);
            return res.json({
                lat: localSpot.location.coordinates[1],
                lng: localSpot.location.coordinates[0],
                formattedAddress: localSpot.address,
                source: 'database'
            });
        }

        // 1. Try Google Maps Geocoding first
        if (process.env.GG_MAPS_API_KEY && process.env.GG_MAPS_API_URL) {
            try {
                const url = `${process.env.GG_MAPS_API_URL}?address=${encodeURIComponent(query)}&key=${process.env.GG_MAPS_API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.status === 'OK' && data.results.length > 0) {
                    const result = data.results[0];
                    const { lat, lng } = result.geometry.location;
                    return res.json({
                        lat,
                        lng,
                        formattedAddress: result.formatted_address,
                        source: 'google'
                    });
                }
            } catch (err) {
                console.warn('[GEOCORDING] Google Maps API error, falling back to OSM:', err.message);
            }
        }

        // 2. Fallback to OpenStreetMap Nominatim API
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'ParkChung-App/1.0 (contact@parkchung.com)'
                }
            });
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                return res.json({
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    formattedAddress: result.display_name,
                    source: 'nominatim'
                });
            }
        } catch (err) {
            console.error('[GEOCORDING] OpenStreetMap Nominatim API error:', err.message);
        }

        return res.status(404).json({ message: 'Không thể tìm thấy tọa độ cho địa điểm này.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server trong quá trình phân tích địa điểm', error: error.message });
    }
};

exports.debugDb = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const ParkingSpot = mongoose.model('ParkingSpot');
        const count = await ParkingSpot.countDocuments();
        const spots = await ParkingSpot.find({}).limit(5);
        res.json({
            connectionHost: mongoose.connection.host,
            databaseName: mongoose.connection.name,
            totalSpots: count,
            firstFiveSpots: spots.map(s => ({ id: s._id, name: s.name, status: s.status, isActive: s.isActive }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};