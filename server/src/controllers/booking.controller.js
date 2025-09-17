const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
    const { spotId, startTime, endTime } = req.body;
    const userId = req.user._id;

    try {
        const spot = await ParkingSpot.findById(spotId);
        if (!spot) {
            return res.status(404).json({ message: 'Parking spot not found' });
        }

        // Check again to see if there are any duplicates
        const existingBooking = await Booking.findOne({
            spot: spotId,
            status: 'confirmed',
            $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Spot is not available for the selected time' });
        }

       // billing logic
        const start = new Date(startTime);
        const end = new Date(endTime);
        const totalHours = Math.ceil(Math.abs(end - start) / 36e5); // Before 6 hours is the unit price; after 6 hours, each hour is x2 price
        let totalPrice = 0;

        if (totalHours <= 6) {
            totalPrice = totalHours * spot.hourlyRate;
        } else {
            const priceForFirst6Hours = 6 * spot.hourlyRate;
            const remainingHours = totalHours - 6;
            const priceForRemainingHours = remainingHours * (spot.hourlyRate * 2); 
            totalPrice = priceForFirst6Hours + priceForRemainingHours;
        }

        const booking = new Booking({
            user: userId,
            spot: spotId,
            startTime,
            endTime,
            totalPrice, 
            status: 'confirmed'
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating booking', error: error.message });
    }
};

/**
 * @desc    Get bookings for the logged-in user
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('spot', 'address');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching bookings', error: error.message });
    }
};