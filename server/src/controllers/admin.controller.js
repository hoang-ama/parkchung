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

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'fullName email').populate('spot', 'address');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};