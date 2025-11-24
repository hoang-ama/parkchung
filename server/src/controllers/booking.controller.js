const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');
const Lead = require('../models/lead.model');
const Payment = require('../models/payment.model');
const {
    PAYMENT_METHODS,
    BOOKING_PAYMENT_STATUS,
} = require('../constants/payment');
const { calculatePrice } = require('../utils/pricing');

/**
 * @desc    Create booking as guest (no login required)
 * @route   POST /api/bookings/guest
 * @access  Public
 */
exports.createGuestBooking = async (req, res) => {
    const { spot, startTime, endTime, fullName, email, phoneNumber } = req.body;

    if (!fullName || !email || !phoneNumber) {
        return res.status(400).json({ message: 'Full name, email and phone number are required.' });
    }

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
    if (parsedStartTime < new Date()) {
        return res.status(400).json({ message: 'Start time cannot be in the past.' });
    }

    // Check overlap with active bookings
    const conflictingBookings = await Booking.find({
        spot: spot,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
            {
                startTime: { $lt: parsedEndTime },
                endTime: { $gt: parsedStartTime }
            }
        ]
    });
    if (conflictingBookings.length > 0) {
        return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
    }

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);

    try {
        const lead = new Lead({
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            status: 'pending',
            fullName,
            email,
            phoneNumber,
            source: 'guest'
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
    const { spot, startTime, endTime, phoneNumber } = req.body;

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    // 1. Kiểm tra tính hợp lệ của thời gian
    if (parsedStartTime >= parsedEndTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }
    // Đảm bảo thời gian đặt không phải trong quá khứ
    if (parsedStartTime < new Date()) {
        return res.status(400).json({ message: 'Start time cannot be in the past.' });
    }

    // 2. TÍCH HỢP LOGIC KIỂM TRA TRÙNG LẶP THỜI GIAN
    const conflictingBookings = await Booking.find({
        spot: spot, // Chỉ kiểm tra trên bãi đỗ cụ thể này
        status: { $in: ['pending', 'confirmed'] }, // Chỉ quan tâm đến các booking đang chờ hoặc đã xác nhận
        $or: [
            { // Trường hợp 1: Booking mới bắt đầu trong khoảng thời gian của booking hiện có
                startTime: { $lt: parsedEndTime },
                endTime: { $gt: parsedStartTime }
            }
        ]
    });

    if (conflictingBookings.length > 0) {
        return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
    }
    // KẾT THÚC LOGIC KIỂM TRA TRÙNG LẶP THỜI GIAN

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);

    try {
        const booking = new Booking({
            user: req.user._id,
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            phoneNumber,
            status: 'pending',
            paymentStatus: BOOKING_PAYMENT_STATUS.UNPAID,
            paymentMethod: PAYMENT_METHODS.OFFLINE,
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
/**
 * @desc    Estimate booking price
 * @route   POST /api/bookings/estimate-price
 * @access  Public (hoặc Private nếu bạn muốn người dùng phải đăng nhập trước)
 */
exports.estimatePrice = async (req, res) => {
    const { spotId, startTime, endTime } = req.body;

    const parkingSpot = await ParkingSpot.findById(spotId);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (parsedStartTime >= parsedEndTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);
    res.json({ estimatedPrice: totalPrice });
};
/**
 * @desc    Get bookings for the logged-in user
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('spot', 'address')
            .populate('user', 'fullName email')
            .populate('payment');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching bookings', error: error.message });
    }
};

/**
 * @desc    Get booking and payment info (authorized user or guest with paymentId)
 * @route   GET /api/bookings/:bookingId/payments/:paymentId?
 */
exports.getBookingPaymentStatus = async (req, res) => {
    const { bookingId, paymentId } = req.params;
    try {
        const booking = await Booking.findById(bookingId).populate('spot', 'address');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        let payment;
        if (paymentId) {
            payment = await Payment.findOne({ _id: paymentId, booking: bookingId });
            if (!payment) {
                return res.status(404).json({ message: 'Payment not found for this booking' });
            }
        } else {
            if (!req.user || !booking.user || booking.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this booking' });
            }
            payment = booking.payment ? await Payment.findById(booking.payment) : null;
        }

        return res.json({ booking, payment });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch booking payment status', error: error.message });
    }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:bookingId/cancel
 * @access  Private
 */
exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const brevoService = require('../services/brevo.service');

    try {
        // Find booking and populate necessary fields
        const booking = await Booking.findById(bookingId)
            .populate('user')
            .populate({ path: 'spot', populate: { path: 'owner' } });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authorization: User must own the booking or be admin
        if (booking.user && booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.paymentStatus = BOOKING_PAYMENT_STATUS.CANCELLED;
        await booking.save();

        // Update payment if exists
        if (booking.payment) {
            const payment = await Payment.findById(booking.payment);
            if (payment) {
                payment.status = 'CANCELLED';
                await payment.save();
            }
        }

        // Prepare booking data for email
        const customerName = booking.user ? booking.user.fullName : booking.guestFullName;
        const customerEmail = booking.user ? booking.user.email : booking.guestEmail;
        const partner = booking.spot && booking.spot.owner;
        const partnerName = partner ? partner.fullName : 'Partner';
        const partnerEmail = partner ? partner.email : null;

        const bookingData = {
            customerName,
            customerEmail,
            partnerName,
            partnerEmail,
            bookingId: booking._id,
            spotAddress: booking.spot ? booking.spot.address : 'Unknown Address',
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
            phoneNumber: booking.phoneNumber || booking.guestPhoneNumber || ''
        };

        // Send cancellation emails
        try {
            await brevoService.sendBookingEmail(bookingData, 'bookingCancel');
            if (partnerEmail) {
                await brevoService.sendEmailPartner(bookingData, 'partnerCancel');
            }

            // Also send review request email when customer cancels
            await brevoService.sendReviewEmail(bookingData);
        } catch (emailError) {
            console.error('Failed to send cancellation emails:', emailError);
            // Don't fail the cancellation if email fails
        }

        return res.json({
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        return res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
    }
};

/**
 * @desc    Request review for a booking
 * @route   POST /api/bookings/:bookingId/request-review
 * @access  Private
 */
exports.requestReview = async (req, res) => {
    const { bookingId } = req.params;
    const brevoService = require('../services/brevo.service');

    try {
        // Find booking and populate necessary fields
        const booking = await Booking.findById(bookingId)
            .populate('user')
            .populate({ path: 'spot', populate: { path: 'owner' } });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authorization: User must own the booking or be admin
        if (booking.user && booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to request review for this booking' });
        }

        // Check if booking is completed or confirmed
        if (booking.status !== 'confirmed' && booking.status !== 'completed') {
            return res.status(400).json({ message: 'Can only request review for confirmed or completed bookings' });
        }

        // Prepare booking data for email
        const customerName = booking.user ? booking.user.fullName : booking.guestFullName;
        const customerEmail = booking.user ? booking.user.email : booking.guestEmail;

        const bookingData = {
            customerName,
            customerEmail,
            bookingId: booking._id,
            spotAddress: booking.spot ? booking.spot.address : 'Unknown Address',
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
            phoneNumber: booking.phoneNumber || booking.guestPhoneNumber || ''
        };

        // Send review request email
        await brevoService.sendReviewEmail(bookingData);

        return res.json({
            message: 'Review request email sent successfully',
            booking
        });
    } catch (error) {
        console.error('Request review error:', error);
        return res.status(500).json({ message: 'Failed to send review request', error: error.message });
    }
};
