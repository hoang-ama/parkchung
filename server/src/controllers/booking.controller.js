const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');
const Lead = require('../models/lead.model');
const Payment = require('../models/payment.model');
const {
    PAYMENT_METHODS,
    BOOKING_PAYMENT_STATUS,
} = require('../constants/payment');
const { calculatePrice } = require('../utils/pricing');
const brevoService = require('../services/brevo.service');
const { isValidVNPhone, VN_PHONE_ERROR_MSG } = require('../utils/validation.util');

// Helper functions for email sending
const ensureBookingPopulated = async (booking) => {
    if (!booking.spot || !booking.spot.owner || (!booking.user && !booking.guestEmail)) {
        await booking.populate([
            { path: 'spot', populate: { path: 'owner' } },
            { path: 'user' }
        ]);
    }
    return booking;
};

const prepareBookingData = (booking) => {
    const customerName = booking.user ? booking.user.fullName : booking.guestFullName;
    const customerEmail = booking.user ? booking.user.email : booking.guestEmail;

    // Safely access partner info
    const partner = booking.spot && booking.spot.owner;
    const partnerName = partner ? partner.fullName : 'Partner';
    const partnerEmail = partner ? partner.email : null;

    return {
        customerName,
        customerEmail,
        partnerName,
        partnerEmail,
        bookingId: booking._id,
        spotAddress: booking.spot ? booking.spot.address : 'Unknown Address',
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalPrice: booking.totalPrice,
        ...booking.toObject()
    };
};

/**
 * @desc    Create booking as guest (no login required)
 * @route   POST /api/bookings/guest
 * @access  Public
 */
exports.createGuestBooking = async (req, res) => {
    const { spot, startTime, endTime, fullName, email, phoneNumber, paymentMethod } = req.body;

    if (!fullName || !email || !phoneNumber) {
        return res.status(400).json({ message: 'Full name, email and phone number are required.' });
    }

    if (!isValidVNPhone(phoneNumber)) {
        return res.status(400).json({ message: VN_PHONE_ERROR_MSG });
    }

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    // Only allow booking approved spots
    if (parkingSpot.status !== 'approved') {
        return res.status(400).json({ message: 'This parking spot is not available for booking.' });
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

    // Check overlap with confirmed bookings only (pending bookings don't reserve the spot)
    const conflictingBookings = await Booking.find({
        spot: spot,
        status: 'confirmed',
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
        // Create booking with guest fields (same as logged-in user but with guest info instead of user ref)
        const bookingData = {
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            status: 'pending',
            guestFullName: fullName,
            guestEmail: email,
            guestPhoneNumber: phoneNumber,
            phoneNumber: phoneNumber,
            paymentMethod: paymentMethod === PAYMENT_METHODS.CASH ? PAYMENT_METHODS.CASH : PAYMENT_METHODS.CASH,
            paymentStatus: BOOKING_PAYMENT_STATUS.UNPAID,
        };

        // Handle Cash Payment for Guest - confirm immediately
        if (paymentMethod === PAYMENT_METHODS.CASH) {
            bookingData.status = 'confirmed';
        }

        const booking = new Booking(bookingData);
        const createdBooking = await booking.save();

        // Send Emails if Confirmed (Cash)
        if (createdBooking.status === 'confirmed') {
            try {
                await ensureBookingPopulated(createdBooking);
                const emailData = prepareBookingData(createdBooking);

                // Send Customer Confirmation
                await brevoService.sendBookingEmail(emailData, 'bookingConfirm');

                // Send Partner Confirmation
                if (emailData.partnerEmail) {
                    await brevoService.sendEmailPartner(emailData, 'partnerConfirm');
                }

                // Schedule Review Email
                const bookingEndTime = new Date(createdBooking.endTime);
                const now = new Date();
                const delayMs = bookingEndTime.getTime() - now.getTime();

                if (delayMs > 0) {
                    setTimeout(async () => {
                        try {
                            await brevoService.sendReviewEmail(emailData);
                        } catch (e) { console.error(e); }
                    }, delayMs);
                } else {
                    try { await brevoService.sendReviewEmail(emailData); } catch (e) { console.error(e); }
                }

            } catch (emailError) {
                console.error('Failed to send confirmation emails for guest cash booking:', emailError);
            }
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get guest lead status by ID
 * @route   GET /api/bookings/leads/:leadId
 * @access  Public
 */
exports.getLeadStatus = async (req, res) => {
    const { leadId } = req.params;
    try {
        const lead = await Lead.findById(leadId).populate('spot', 'address');
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Return lead info in a format similar to booking for consistency
        return res.json({
            lead: {
                _id: lead._id,
                status: lead.status,
                paymentStatus: lead.status === 'confirmed' ? 'UNPAID' : 'PENDING',
                paymentMethod: lead.paymentMethod || 'CASH',
                spot: lead.spot,
                startTime: lead.startTime,
                endTime: lead.endTime,
                totalPrice: lead.totalPrice,
                fullName: lead.fullName,
                email: lead.email,
                phoneNumber: lead.phoneNumber,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch lead status', error: error.message });
    }
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
    const { spot, startTime, endTime, phoneNumber } = req.body;

    if (phoneNumber && !isValidVNPhone(phoneNumber)) {
        return res.status(400).json({ message: VN_PHONE_ERROR_MSG });
    }

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    // Only allow booking approved spots
    if (parkingSpot.status !== 'approved') {
        return res.status(400).json({ message: 'This parking spot is not available for booking.' });
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

    // 2. Check for overlapping confirmed bookings only (pending bookings don't reserve the spot)
    const conflictingBookings = await Booking.find({
        spot: spot,
        status: 'confirmed', // Only check confirmed bookings
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
        const booking = new Booking({
            user: req.user._id,
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            phoneNumber,
            status: 'confirmed', // Cash bookings are confirmed immediately
            paymentStatus: BOOKING_PAYMENT_STATUS.UNPAID,
            paymentMethod: PAYMENT_METHODS.CASH,
        });

        const createdBooking = await booking.save();

        // Send Emails for Cash Payment (Confirmed status)
        if (booking.status === 'confirmed' && booking.paymentMethod === PAYMENT_METHODS.CASH) {
            try {
                await ensureBookingPopulated(createdBooking);
                const bookingData = prepareBookingData(createdBooking);

                // Send Customer Confirmation
                await brevoService.sendBookingEmail(bookingData, 'bookingConfirm');

                // Send Partner Confirmation
                if (bookingData.partnerEmail) {
                    await brevoService.sendEmailPartner(bookingData, 'partnerConfirm');
                } else {
                    console.warn(`Skipping partner email for booking ${createdBooking._id}: Partner email not found.`);
                }

                // Schedule Review Email
                const endTime = new Date(booking.endTime);
                const now = new Date();
                const delayMs = endTime.getTime() - now.getTime();

                if (delayMs > 0) {
                    setTimeout(async () => {
                        try {
                            console.log(`Sending scheduled review email for booking ${createdBooking._id} after parking duration ended...`);
                            await brevoService.sendReviewEmail(bookingData);
                        } catch (reviewError) {
                            console.error(`Failed to send scheduled review email for booking ${createdBooking._id}:`, reviewError);
                        }
                    }, delayMs);
                    console.log(`Review email scheduled for booking ${createdBooking._id} at ${endTime.toISOString()}`);
                } else {
                    // If booking ended (e.g. testing with past time or very short duration), send immediately
                    try {
                        await brevoService.sendReviewEmail(bookingData);
                    } catch (reviewError) {
                        console.error(`Failed to send immediate review email for booking ${createdBooking._id}:`, reviewError);
                    }
                }

            } catch (emailError) {
                console.error('Failed to send confirmation emails for cash booking:', emailError);
                // Don't fail the request if email fails, just log it
            }
        }

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

        // Auto-cancel pending bookings with past start times
        const now = new Date();
        const updatePromises = [];

        for (const booking of bookings) {
            if (booking.status === 'pending' &&
                booking.paymentStatus === BOOKING_PAYMENT_STATUS.PENDING &&
                new Date(booking.startTime) < now) {

                booking.status = 'cancelled';
                booking.paymentStatus = BOOKING_PAYMENT_STATUS.FAILED;
                updatePromises.push(booking.save());
            }
        }

        // Wait for all updates to complete
        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
        }

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
