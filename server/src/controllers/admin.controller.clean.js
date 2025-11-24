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
        // Middleware 'upload' Ä‘Ã£ xá»­ lÃ½ viá»‡c táº£i file lÃªn Cloudinary
        // vÃ  Ä‘áº·t thÃ´ng tin vÃ o req.file
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        const spot = await ParkingSpot.findById(req.params.id);
        if (!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }

        // TODO (TÃ¹y chá»n nÃ¢ng cao): XÃ³a áº£nh cÅ© trÃªn Cloudinary Ä‘á»ƒ tiáº¿t kiá»‡m dung lÆ°á»£ng
        // if (spot.images && spot.images.length > 0) {
        //     // Láº¥y public_id tá»« URL áº£nh cÅ© vÃ  gá»i Cloudinary API Ä‘á»ƒ xÃ³a
        //     const oldImageUrl = spot.images[0];
        //     const publicId = oldImageUrl.split('/').pop().split('.')[0];
        //     await cloudinary.uploader.destroy(publicId); 
        // }

        // Cáº­p nháº­t máº£ng images vá»›i URL cá»§a áº£nh má»›i
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
