const User = require('../models/user.model');
const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const spotCount = await ParkingSpot.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const pendingSpots = await ParkingSpot.countDocuments({ status: 'pending' });

        res.json({
            users: userCount,
            spots: spotCount,
            bookings: bookingCount,
            pendingSpots: pendingSpots
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all parking spots
 * @route   GET /api/admin/spots
 * @access  Private/Admin
 */
exports.getAllSpots = async (req, res) => {
    try {
        const spots = await ParkingSpot.find({}).populate('owner', 'email');
        res.json(spots);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Approve a parking spot
 * @route   PUT /api/admin/spots/:id/approve
 * @access  Private/Admin
 */
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
/**
 * @desc    Get all bookings
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'fullName email') 
            .populate('spot', 'address');       
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};