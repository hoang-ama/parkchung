// File: server/src/controllers/admin.controller.js
const User = require('../models/user.model');
const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const spotCount = await ParkingSpot.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const pendingSpots = await ParkingSpot.countDocuments({ status: 'pending' });
        res.json({ users: userCount, spots: spotCount, bookings: bookingCount, pendingSpots: pendingSpots });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllSpots = async (req, res) => {
    try {
        const spots = await ParkingSpot.find({}).populate('owner', 'email');
        res.json(spots);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.approveSpot = async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);
        if (spot) {
            spot.status = 'approved';
            const updatedSpot = await spot.save();
            res.json(updatedSpot);
        } else {
            res.status(404).json({ message: 'Spot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.rejectSpot = async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);
        if (spot) {
            spot.status = 'rejected';
            const updatedSpot = await spot.save();
            res.json(updatedSpot);
        } else {
            res.status(404).json({ message: 'Spot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteSpot = async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);
        if (spot) {
            await spot.deleteOne();
            res.json({ message: 'Parking spot removed' });
        } else {
            res.status(404).json({ message: 'Spot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateSpot = async (req, res) => {
    try {
        const spot = await ParkingSpot.findById(req.params.id);
        if (spot) {
            spot.address = req.body.address || spot.address;
            spot.hourlyRate = req.body.hourlyRate || spot.hourlyRate;
            const updatedSpot = await spot.save();
            res.json(updatedSpot);
        } else {
            res.status(404).json({ message: 'Spot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a parking spot's image
 * @route   POST /api/admin/spots/:id/image
 * @access  Private/Admin
 */
exports.updateSpotImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        const spot = await ParkingSpot.findById(req.params.id);
        if (!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }

        spot.images = [req.file.path];
        const updatedSpot = await spot.save();
        res.json(updatedSpot);

    } catch (error) {
        res.status(500).json({ message: 'Server error while updating image', error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'fullName email').populate('spot', 'address');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create new booking (Admin)
 * @route   POST /api/admin/bookings
 * @access  Private/Admin
 */
exports.createAdminBooking = async (req, res) => {
    const { spot, startTime, endTime, userId, guestFullName, guestEmail, guestPhoneNumber, phoneNumber, status } = req.body;

    try {
        const parkingSpot = await ParkingSpot.findById(spot);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(endTime);

        if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
            return res.status(400).json({ message: 'Invalid start or end time.' });
        }
        if (parsedStartTime >= parsedEndTime) {
            return res.status(400).json({ message: 'End time must be after start time.' });
        }

        const conflictingBookings = await Booking.find({
            spot: spot,
            status: { $in: ['pending', 'confirmed'] },
            $or: [{
                startTime: { $lt: parsedEndTime },
                endTime: { $gt: parsedStartTime }
            }]
        });

        if (conflictingBookings.length > 0) {
            return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
        }

        const { calculatePrice } = require('../utils/pricing');
        const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);

        const bookingData = {
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            status: status || 'confirmed',
            phoneNumber
        };

        if (userId) {
            const User = require('../models/user.model');
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            bookingData.user = userId;
        } else if (guestFullName && guestEmail && guestPhoneNumber) {
            bookingData.guestFullName = guestFullName;
            bookingData.guestEmail = guestEmail;
            bookingData.guestPhoneNumber = guestPhoneNumber;
        } else {
            return res.status(400).json({ message: 'Either userId or guest information (fullName, email, phoneNumber) is required.' });
        }

        const booking = new Booking(bookingData);
        const createdBooking = await booking.save();

        await createdBooking.populate('user', 'fullName email');
        await createdBooking.populate('spot', 'address');

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating booking', error: error.message });
    }
};

/**
 * @desc    Update booking (Admin)
 * @route   PUT /api/admin/bookings/:id
 * @access  Private/Admin
 */
exports.updateAdminBooking = async (req, res) => {
    const { spot, startTime, endTime, status, phoneNumber, totalPrice } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (spot && spot !== booking.spot.toString()) {
            const parkingSpot = await ParkingSpot.findById(spot);
            if (!parkingSpot) {
                return res.status(404).json({ message: 'Parking spot not found.' });
            }
            booking.spot = spot;
        }

        let parsedStartTime = booking.startTime;
        let parsedEndTime = booking.endTime;
        let timesChanged = false;

        if (startTime) {
            parsedStartTime = new Date(startTime);
            if (isNaN(parsedStartTime)) {
                return res.status(400).json({ message: 'Invalid start time.' });
            }
            timesChanged = true;
        }

        if (endTime) {
            parsedEndTime = new Date(endTime);
            if (isNaN(parsedEndTime)) {
                return res.status(400).json({ message: 'Invalid end time.' });
            }
            timesChanged = true;
        }

        if (parsedStartTime >= parsedEndTime) {
            return res.status(400).json({ message: 'End time must be after start time.' });
        }

        if (timesChanged) {
            const conflictingBookings = await Booking.find({
                _id: { $ne: booking._id },
                spot: booking.spot,
                status: { $in: ['pending', 'confirmed'] },
                $or: [{
                    startTime: { $lt: parsedEndTime },
                    endTime: { $gt: parsedStartTime }
                }]
            });

            if (conflictingBookings.length > 0) {
                return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
            }

            booking.startTime = parsedStartTime;
            booking.endTime = parsedEndTime;

            const parkingSpot = await ParkingSpot.findById(booking.spot);
            const { calculatePrice } = require('../utils/pricing');
            booking.totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);
        }

        if (status) booking.status = status;
        if (phoneNumber !== undefined) booking.phoneNumber = phoneNumber;
        if (totalPrice !== undefined && !timesChanged) booking.totalPrice = totalPrice;

        const updatedBooking = await booking.save();

        await updatedBooking.populate('user', 'fullName email');
        await updatedBooking.populate('spot', 'address');

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating booking', error: error.message });
    }
};

/**
 * @desc    Delete booking (Admin)
 * @route   DELETE /api/admin/bookings/:id
 * @access  Private/Admin
 */
exports.deleteAdminBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.payment) {
            const Payment = require('../models/payment.model');
            await Payment.findByIdAndDelete(booking.payment);
        }

        await booking.deleteOne();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting booking', error: error.message });
    }
};

/**
 * @desc    Bulk delete bookings (Admin)
 * @route   POST /api/admin/bookings/bulk-delete
 * @access  Private/Admin
 */
exports.bulkDeleteBookings = async (req, res) => {
    try {
        const { bookingIds } = req.body;

        if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of booking IDs' });
        }

        const bookings = await Booking.find({ _id: { $in: bookingIds } });

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found with provided IDs' });
        }

        const Payment = require('../models/payment.model');
        const paymentIds = bookings
            .filter(b => b.payment)
            .map(b => b.payment);

        if (paymentIds.length > 0) {
            await Payment.deleteMany({ _id: { $in: paymentIds } });
        }

        const result = await Booking.deleteMany({ _id: { $in: bookingIds } });

        res.json({
            message: `Successfully deleted ${result.deletedCount} booking(s)`,
            deletedCount: result.deletedCount,
            requestedCount: bookingIds.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting bookings', error: error.message });
    }
};