// File: server/src/controllers/host.controller.js
const User = require('../models/user.model');
const HostProfile = require('../models/hostProfile.model');
const ParkingSpot = require('../models/parkingSpot.model');

/**
 * @desc    Get current host's profile and user info
 * @route   GET /api/host/me
 * @access  Private (Host only)
 */
exports.getHostMe = async (req, res) => {
    try {
        // Get user info (password already excluded by protect middleware)
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get host profile
        const hostProfile = await HostProfile.findOne({ user: req.user._id });
        if (!hostProfile) {
            return res.status(404).json({ message: 'Host profile not found' });
        }

        res.json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            hostProfile: {
                id: hostProfile._id,
                companyName: hostProfile.companyName,
                taxCode: hostProfile.taxCode,
                address: hostProfile.address,
                bankAccount: hostProfile.bankAccount,
                bankName: hostProfile.bankName,
                kycStatus: hostProfile.kycStatus,
                documentImages: hostProfile.documentImages,
                createdAt: hostProfile.createdAt,
                updatedAt: hostProfile.updatedAt
            }
        });

    } catch (error) {
        console.error('Get host profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get host's parking spots with pagination and filtering
 * @route   GET /api/host/spots
 * @access  Private (Host only)
 */
exports.getMySpots = async (req, res) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;

        // Build query
        const query = {
            owner: req.user._id,
            status: { $ne: 'archived' } // Exclude archived spots by default
        };

        // Add status filter if provided
        if (status && ['pending', 'approved', 'rejected', 'archived'].includes(status)) {
            query.status = status;
        }

        // Calculate pagination
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const [spots, total] = await Promise.all([
            ParkingSpot.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            ParkingSpot.countDocuments(query)
        ]);

        res.json({
            data: spots,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('Get my spots error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new parking spot
 * @route   POST /api/host/spots
 * @access  Private (Host only)
 */
exports.createSpot = async (req, res) => {
    try {
        const {
            name,
            address,
            latitude,
            longitude,
            hourlyRate,
            monthlyRate,
            description,
            hasRoof,
            vehicleTypes,
            numberOfSlots,
            paymentMethods
        } = req.body;

        // Process uploaded images (Cloudinary URLs from multer-storage-cloudinary)
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // multer-storage-cloudinary provides full Cloudinary URL in file.path
            imageUrls = req.files.map(file => file.path);
        } else if (req.body.images) {
            // Handle case where images might be passed as strings
            imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        if (imageUrls.length === 0) {
            // Use Cloudinary placeholder or keep empty for frontend to handle
            imageUrls = [];
        }

        // Validate required fields
        const errors = [];
        if (!name || !name.trim()) errors.push('name is required');
        if (!address || !address.trim()) errors.push('address is required');
        if (latitude === undefined || latitude === null) errors.push('latitude is required');
        if (longitude === undefined || longitude === null) errors.push('longitude is required');
        if (!hourlyRate || hourlyRate <= 0) errors.push('hourlyRate must be greater than 0');
        if (!numberOfSlots || numberOfSlots <= 0) errors.push('numberOfSlots must be greater than 0');

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        // Validate coordinate ranges
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || lat < -90 || lat > 90) {
            return res.status(400).json({
                message: 'latitude must be a number between -90 and 90'
            });
        }

        if (isNaN(lng) || lng < -180 || lng > 180) {
            return res.status(400).json({
                message: 'longitude must be a number between -180 and 180'
            });
        }

        // Helper to ensure array
        const toArray = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return [val];
        };

        // Create the parking spot
        const spot = await ParkingSpot.create({
            owner: req.user._id,
            name: name.trim(),
            address: address.trim(),
            location: {
                type: 'Point',
                coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
            },
            hourlyRate: parseFloat(hourlyRate),
            monthlyRate: monthlyRate ? parseFloat(monthlyRate) : undefined,
            description: description ? description.trim() : undefined,
            hasRoof: Boolean(hasRoof),
            vehicleTypes: toArray(vehicleTypes),
            numberOfSlots: parseInt(numberOfSlots, 10),
            paymentMethods: (() => {
                const methods = toArray(paymentMethods);
                return methods.length > 0 ? methods : ['cash'];
            })(),
            images: imageUrls,
            status: 'pending' // New spots are pending admin approval
        });

        res.status(201).json({
            message: 'Parking spot created successfully. It is pending admin approval.',
            spot
        });

    } catch (error) {
        console.error('Create spot error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a parking spot
 * @route   PUT /api/host/spots/:id
 * @access  Private (Host only)
 */
exports.updateSpot = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the spot
        const spot = await ParkingSpot.findById(id);

        if (!spot) {
            return res.status(404).json({ message: 'Parking spot not found' });
        }

        // Verify ownership
        if (spot.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this spot' });
        }

        // Build update object first (fix: declare before using)
        const updates = {};

        // Define allowed fields for update
        const allowedFields = [
            'name',
            'address',
            'hourlyRate',
            'monthlyRate',
            'description',
            'hasRoof',
            'vehicleTypes',
            'numberOfSlots',
            'paymentMethods',
            'contactPhone',
            'openTime',
            'bookingTypes',
            'addOnServices'
        ];

        // Build update object with only allowed fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }


        // Process new images if uploaded (Cloudinary URLs from multer-storage-cloudinary)
        if (req.files && req.files.length > 0) {
            // multer-storage-cloudinary provides full Cloudinary URL in file.path
            const newImageUrls = req.files.map(file => file.path);
            // Replace images with new ones
            updates.images = newImageUrls;
        } else if (req.body.existingImages) {
            // If existingImages are passed (as JSON string or array), keep them
            try {
                const existingImages = typeof req.body.existingImages === 'string'
                    ? JSON.parse(req.body.existingImages)
                    : req.body.existingImages;
                if (Array.isArray(existingImages)) {
                    updates.images = existingImages;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        // Handle location update separately if latitude/longitude provided
        if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
            const lat = parseFloat(req.body.latitude);
            const lng = parseFloat(req.body.longitude);

            if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                updates.location = {
                    type: 'Point',
                    coordinates: [lng, lat]
                };
            }
        }

        // Validate hourlyRate if being updated
        if (updates.hourlyRate !== undefined && updates.hourlyRate <= 0) {
            return res.status(400).json({ message: 'hourlyRate must be greater than 0' });
        }

        // Validate numberOfSlots if being updated
        if (updates.numberOfSlots !== undefined && updates.numberOfSlots <= 0) {
            return res.status(400).json({ message: 'numberOfSlots must be greater than 0' });
        }

        // Apply updates
        Object.assign(spot, updates);
        await spot.save();

        res.json({
            message: 'Parking spot updated successfully',
            spot
        });

    } catch (error) {
        console.error('Update spot error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a single parking spot by ID (for host editing)
 * @route   GET /api/host/spots/:id
 * @access  Private (Host only)
 */
exports.getSpotById = async (req, res) => {
    try {
        const { id } = req.params;

        const spot = await ParkingSpot.findById(id);

        if (!spot) {
            return res.status(404).json({ message: 'Parking spot not found' });
        }

        // Verify ownership
        if (spot.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this spot' });
        }

        res.json(spot);

    } catch (error) {
        console.error('Get spot by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get host's analytics overview
 * @route   GET /api/host/analytics/overview
 * @access  Private (Host only)
 */
exports.getAnalyticsOverview = async (req, res) => {
    try {
        // Get count of host's spots
        const spotsCount = await ParkingSpot.countDocuments({
            owner: req.user._id,
            status: 'approved'
        });

        // For now, return mock analytics data
        // In production, this would aggregate booking data
        const overview = {
            totalRevenueMonth: 0,
            totalBookingsMonth: 0,
            occupancyRate: 0,
            spotsCount
        };

        // TODO: Calculate real revenue and bookings from Booking model
        // const startOfMonth = new Date();
        // startOfMonth.setDate(1);
        // startOfMonth.setHours(0, 0, 0, 0);
        // ... aggregate bookings

        res.json(overview);

    } catch (error) {
        console.error('Get analytics overview error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get host's recent bookings
 * @route   GET /api/host/bookings
 * @access  Private (Host only)
 */
exports.getHostBookings = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 50);

        // Get host's spot IDs
        const spots = await ParkingSpot.find({ owner: req.user._id }).select('_id');
        const spotIds = spots.map(s => s._id);

        // For now, return empty array since Booking model integration is needed
        // In production, this would query the Booking model
        const bookings = [];

        // TODO: Query actual bookings
        // const Booking = require('../models/booking.model');
        // const bookings = await Booking.find({ spot: { $in: spotIds } })
        //     .populate('spot', 'name address')
        //     .populate('user', 'fullName')
        //     .sort({ createdAt: -1 })
        //     .limit(limitNum);

        res.json(bookings);

    } catch (error) {
        console.error('Get host bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update host profile
 * @route   PUT /api/host/profile
 * @access  Private (Host only)
 */
exports.updateHostProfile = async (req, res) => {
    try {
        const { companyName, taxCode, address, bankAccount, bankName } = req.body;

        const hostProfile = await HostProfile.findOne({ user: req.user._id });
        if (!hostProfile) {
            return res.status(404).json({ message: 'Host profile not found' });
        }

        // Update fields if provided
        if (companyName !== undefined) hostProfile.companyName = companyName;
        if (taxCode !== undefined) hostProfile.taxCode = taxCode;
        if (address !== undefined) hostProfile.address = address;
        if (bankAccount !== undefined) hostProfile.bankAccount = bankAccount;
        if (bankName !== undefined) hostProfile.bankName = bankName;

        await hostProfile.save();

        res.json({
            message: 'Host profile updated successfully',
            hostProfile
        });

    } catch (error) {
        console.error('Update host profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
