// File: server/src/controllers/hostBooking.controller.js
const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');

/**
 * @desc    Get paginated list of bookings for host's spots
 * @route   GET /api/host/bookings
 * @access  Private (Host only)
 */
exports.getHostBookings = async (req, res) => {
    try {
        const hostId = req.user._id;
        const {
            status,
            from,
            to,
            spotId,
            page = 1,
            limit = 20
        } = req.query;

        // Get all spots owned by this host
        const hostSpots = await ParkingSpot.find({ owner: hostId }).select('_id');
        const hostSpotIds = hostSpots.map(spot => spot._id);

        // If host has no spots, return empty result
        if (hostSpotIds.length === 0) {
            return res.json({
                data: [],
                pagination: {
                    page: parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    total: 0,
                    totalPages: 0
                }
            });
        }

        // Build filter object
        const filter = {
            spot: { $in: hostSpotIds }
        };

        // Filter by status if provided
        if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            filter.status = status;
        }

        // Filter by date range if provided
        if (from) {
            const fromDate = new Date(from);
            if (!isNaN(fromDate.getTime())) {
                filter.startTime = filter.startTime || {};
                filter.startTime.$gte = fromDate;
            }
        }

        if (to) {
            const toDate = new Date(to);
            if (!isNaN(toDate.getTime())) {
                filter.startTime = filter.startTime || {};
                filter.startTime.$lt = toDate;
            }
        }

        // Filter by specific spot if provided (but ensure host owns it)
        if (spotId) {
            const spotOwned = hostSpotIds.some(id => id.toString() === spotId);
            if (spotOwned) {
                filter.spot = spotId;
            } else {
                // spotId doesn't belong to host, return empty
                return res.json({
                    data: [],
                    pagination: {
                        page: parseInt(page, 10),
                        limit: parseInt(limit, 10),
                        total: 0,
                        totalPages: 0
                    }
                });
            }
        }

        // Calculate pagination
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const [bookings, total] = await Promise.all([
            Booking.find(filter)
                .populate('spot', 'name address')
                .populate('user', 'fullName email phone')
                .sort({ startTime: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Booking.countDocuments(filter)
        ]);

        // Map bookings to simplified JSON
        const mappedBookings = bookings.map(booking => ({
            id: booking._id,
            spotId: booking.spot?._id,
            spotName: booking.spot?.name,
            spotAddress: booking.spot?.address,
            customerName: booking.user?.fullName || booking.guestFullName || 'Guest',
            customerEmail: booking.user?.email || booking.guestEmail,
            customerPhone: booking.user?.phone || booking.guestPhoneNumber || booking.phoneNumber,
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            createdAt: booking.createdAt
        }));

        res.json({
            data: mappedBookings,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error('Get host bookings error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Cancel a booking on host's spot
 * @route   PUT /api/host/bookings/:id/cancel
 * @access  Private (Host only)
 */
exports.cancelHostBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const { cancellationReason } = req.body;
        const hostId = req.user._id;

        // Load booking with spot populated
        const booking = await Booking.findById(bookingId)
            .populate('spot', 'owner name address');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check ownership - ensure the spot belongs to this host
        if (!booking.spot || booking.spot.owner.toString() !== hostId.toString()) {
            return res.status(403).json({ message: 'You are not allowed to modify this booking' });
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'This booking is already cancelled' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }

        // Apply cancellation
        booking.status = 'cancelled';
        if (cancellationReason) {
            booking.cancellationReason = cancellationReason;
        }

        await booking.save();

        // Return updated booking
        res.json({
            message: 'Booking cancelled successfully',
            booking: {
                id: booking._id,
                spotId: booking.spot._id,
                spotName: booking.spot.name,
                status: booking.status,
                cancellationReason: booking.cancellationReason,
                startTime: booking.startTime,
                endTime: booking.endTime,
                totalPrice: booking.totalPrice
            }
        });

    } catch (error) {
        console.error('Cancel host booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get single booking details for host
 * @route   GET /api/host/bookings/:id
 * @access  Private (Host only)
 */
exports.getHostBookingById = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const hostId = req.user._id;

        // Load booking with related data
        const booking = await Booking.findById(bookingId)
            .populate('spot', 'owner name address hourlyRate')
            .populate('user', 'fullName email phone');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check ownership
        if (!booking.spot || booking.spot.owner.toString() !== hostId.toString()) {
            return res.status(403).json({ message: 'You are not allowed to view this booking' });
        }

        res.json({
            id: booking._id,
            spot: {
                id: booking.spot._id,
                name: booking.spot.name,
                address: booking.spot.address,
                hourlyRate: booking.spot.hourlyRate
            },
            customer: booking.user ? {
                id: booking.user._id,
                fullName: booking.user.fullName,
                email: booking.user.email,
                phone: booking.user.phone
            } : {
                fullName: booking.guestFullName,
                email: booking.guestEmail,
                phone: booking.guestPhoneNumber
            },
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            cancellationReason: booking.cancellationReason,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        });

    } catch (error) {
        console.error('Get host booking by ID error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Mark a cash booking as paid
 * @route   PUT /api/host/bookings/:id/mark-paid
 * @access  Private (Host only)
 */
exports.markBookingAsPaid = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const hostId = req.user._id;

        const booking = await Booking.findById(bookingId).populate('spot', 'owner');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check ownership
        if (!booking.spot || booking.spot.owner.toString() !== hostId.toString()) {
            return res.status(403).json({ message: 'You are not allowed to modify this booking' });
        }

        // Validate conditions for marking as paid
        if (String(booking.paymentMethod).toUpperCase() !== 'CASH') {
            return res.status(400).json({ message: 'Only cash bookings can be manually marked as paid' });
        }
        if (String(booking.paymentStatus).toUpperCase() === 'PAID') {
            return res.status(400).json({ message: 'Booking is already paid' });
        }
        if (String(booking.status).toUpperCase() === 'CANCELLED') {
            return res.status(400).json({ message: 'Cannot update payment status of a cancelled booking' });
        }

        booking.paymentStatus = 'PAID';
        await booking.save();

        res.json({
            message: 'Booking marked as paid successfully',
            paymentStatus: booking.paymentStatus,
        });
    } catch (error) {
        console.error('Mark booking as paid error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

