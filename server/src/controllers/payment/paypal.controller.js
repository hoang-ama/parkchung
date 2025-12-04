const Booking = require('../../models/booking.model');
const ParkingSpot = require('../../models/parkingSpot.model');
const Payment = require('../../models/payment.model');
const config = require('../../config');
const {
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
    BOOKING_PAYMENT_STATUS,
} = require('../../constants/payment');
const { calculatePrice } = require('../../utils/pricing');
const paypalService = require('../../services/payment/paypal.service');

const validateTimeRange = (startTime, endTime) => {
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
        throw new Error('Invalid start or end time.');
    }
    if (parsedStartTime >= parsedEndTime) {
        throw new Error('End time must be after start time.');
    }
    if (parsedStartTime < new Date()) {
        throw new Error('Start time cannot be in the past.');
    }
    return { parsedStartTime, parsedEndTime };
};

exports.checkout = async (req, res) => {
    let booking;
    let payment;
    try {
        const {
            spot,
            startTime,
            endTime,
            phoneNumber,
            fullName,
            email,
            guestPhoneNumber,
        } = req.body;

        if (!spot || !startTime || !endTime || !phoneNumber) {
            return res.status(400).json({ message: 'Spot, startTime, endTime and phoneNumber are required.' });
        }

        const isAuthenticated = Boolean(req.user);
        const guestContactPhone = guestPhoneNumber || phoneNumber;
        if (!isAuthenticated && (!fullName || !email || !guestContactPhone)) {
            return res.status(400).json({ message: 'Full name, email and phone number are required for guest checkout.' });
        }

        const parkingSpot = await ParkingSpot.findById(spot);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found.' });
        }

        const { parsedStartTime, parsedEndTime } = validateTimeRange(startTime, endTime);

        // Only check for confirmed bookings (pending bookings don't reserve the spot)
        const conflictingBookings = await Booking.find({
            spot,
            status: 'confirmed',
            $or: [
                {
                    startTime: { $lt: parsedEndTime },
                    endTime: { $gt: parsedStartTime },
                },
            ],
        });

        if (conflictingBookings.length > 0) {
            return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
        }

        const totalPriceVnd = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);
        if (totalPriceVnd <= 0) {
            return res.status(400).json({ message: 'Calculated price must be greater than zero.' });
        }

        const amountUsd = paypalService.convertVndToUsd(totalPriceVnd);
        if (amountUsd <= 0) {
            return res.status(500).json({ message: 'Unable to convert amount to USD. Please try again later.' });
        }

        booking = new Booking({
            user: req.user ? req.user._id : undefined,
            guestFullName: !isAuthenticated ? fullName : undefined,
            guestEmail: !isAuthenticated ? email : undefined,
            guestPhoneNumber: !isAuthenticated ? guestContactPhone : undefined,
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice: totalPriceVnd,
            phoneNumber,
            status: 'pending',
            paymentStatus: BOOKING_PAYMENT_STATUS.PENDING,
            paymentMethod: PAYMENT_METHODS.PAYPAL,
        });
        await booking.save();

        payment = new Payment({
            booking: booking._id,
            method: PAYMENT_METHODS.PAYPAL,
            status: PAYMENT_STATUSES.INITIATED,
            amountVnd: totalPriceVnd,
            amountUsd,
            currency: 'USD',
        });
        await payment.save();

        booking.payment = payment._id;
        await booking.save();

        const successBaseUrl = config.paypal.returnUrl || `${config.clientBaseUrl}payment-result.html`;
        const cancelBaseUrl = config.paypal.cancelUrl || `${config.clientBaseUrl}payment-cancel.html`;

        const returnUrl = paypalService.buildReturnUrl(successBaseUrl, booking._id, payment._id);
        const cancelUrl = paypalService.buildReturnUrl(cancelBaseUrl, booking._id, payment._id);

        const description = `Parking booking for spot ${parkingSpot.address || parkingSpot._id} (${parsedStartTime.toISOString()} - ${parsedEndTime.toISOString()})`;

        const order = await paypalService.createPaypalOrder({
            booking,
            payment,
            amountUsd,
            description,
            returnUrl,
            cancelUrl,
        });

        return res.status(200).json({
            bookingId: booking._id,
            paymentId: payment._id,
            redirectUrl: order.approvalUrl,
            orderId: order.orderId,
        });
    } catch (error) {
        console.error('PayPal checkout error', error);
        if (payment && payment._id) {
            payment.status = PAYMENT_STATUSES.FAILED;
            await payment.save();
        }
        if (booking && booking._id) {
            booking.paymentStatus = BOOKING_PAYMENT_STATUS.FAILED;
            booking.status = 'cancelled';
            await booking.save();
        }
        return res.status(500).json({ message: error.message || 'Unable to initiate PayPal checkout.' });
    }
};

exports.webhook = async (req, res) => {
    try {
        await paypalService.handleWebhookEvent(req.headers, req.body);
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('PayPal webhook error', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};

exports.cancelCheckout = async (req, res) => {
    const { bookingId, paymentId } = req.body;
    if (!bookingId || !paymentId) {
        return res.status(400).json({ message: 'bookingId and paymentId are required' });
    }

    try {
        const booking = await Booking.findById(bookingId);
        const payment = await Payment.findOne({ _id: paymentId, booking: bookingId });

        if (!booking || !payment) {
            return res.status(404).json({ message: 'Booking or payment not found' });
        }

        if (payment.status === PAYMENT_STATUSES.COMPLETED) {
            return res.status(200).json({ booking, payment });
        }

        payment.status = PAYMENT_STATUSES.CANCELLED;
        payment.rawResponse = {
            ...(payment.rawResponse || {}),
            cancelReason: 'USER_CANCELLED',
            cancelledAt: new Date().toISOString(),
        };
        await payment.save();

        booking.paymentStatus = BOOKING_PAYMENT_STATUS.FAILED;
        booking.status = 'cancelled';
        await booking.save();

        return res.json({ booking, payment });
    } catch (error) {
        console.error('Cancel checkout error', error);
        return res.status(500).json({ message: 'Failed to cancel booking' });
    }
};

exports.captureOrder = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token (Order ID) is required' });
    }

    try {
        const { booking, payment } = await paypalService.capturePaypalOrder(token);
        return res.status(200).json({ booking, payment });
    } catch (error) {
        console.error('Capture order error', error);
        return res.status(500).json({ message: error.message || 'Failed to capture PayPal order' });
    }
};

/**
 * @desc    Retry payment for a pending booking
 * @route   POST /api/payments/paypal/retry
 * @access  Private
 */
exports.retryPayment = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'bookingId is required.' });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId).populate('spot');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Verify ownership (authenticated users only)
        if (req.user && booking.user && booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to access this booking.' });
        }

        // Check if booking is still pending
        if (booking.status !== 'pending' || booking.paymentStatus !== BOOKING_PAYMENT_STATUS.PENDING) {
            return res.status(400).json({
                message: 'This booking is not pending payment. Current status: ' + booking.status
            });
        }

        // Re-validate time range
        const now = new Date();
        if (new Date(booking.startTime) < now) {
            return res.status(400).json({ message: 'Booking start time has passed. Cannot process payment.' });
        }

        // Re-check spot availability (only confirmed bookings)
        const conflictingBookings = await Booking.find({
            spot: booking.spot._id,
            status: 'confirmed',
            _id: { $ne: bookingId }, // Exclude current booking
            $or: [
                {
                    startTime: { $lt: new Date(booking.endTime) },
                    endTime: { $gt: new Date(booking.startTime) },
                },
            ],
        });

        if (conflictingBookings.length > 0) {
            // Mark booking as cancelled since spot is no longer available
            booking.status = 'cancelled';
            booking.paymentStatus = BOOKING_PAYMENT_STATUS.FAILED;
            await booking.save();

            return res.status(409).json({
                message: 'This parking spot is no longer available for the selected time slot. Your booking has been cancelled.'
            });
        }

        // Get existing payment or create new one
        let payment = await Payment.findOne({ booking: bookingId });

        const totalPriceVnd = booking.totalPrice;
        const amountUsd = paypalService.convertVndToUsd(totalPriceVnd);

        if (amountUsd <= 0) {
            return res.status(500).json({ message: 'Unable to convert amount to USD. Please try again later.' });
        }

        // Update or create payment record
        if (!payment) {
            payment = new Payment({
                booking: booking._id,
                method: PAYMENT_METHODS.PAYPAL,
                status: PAYMENT_STATUSES.INITIATED,
                amountVnd: totalPriceVnd,
                amountUsd,
                currency: 'USD',
            });
        } else {
            // Reset payment to initiated state for retry
            payment.status = PAYMENT_STATUSES.INITIATED;
            payment.amountVnd = totalPriceVnd;
            payment.amountUsd = amountUsd;
        }
        await payment.save();

        // Update booking payment reference
        booking.payment = payment._id;
        booking.paymentMethod = PAYMENT_METHODS.PAYPAL;
        await booking.save();

        // Create PayPal order
        const successBaseUrl = config.paypal.returnUrl || `${config.clientBaseUrl}/customer/payment-result.html`;
        const cancelBaseUrl = config.paypal.cancelUrl || `${config.clientBaseUrl}/customer/payment-cancel.html`;

        const returnUrl = paypalService.buildReturnUrl(successBaseUrl, booking._id, payment._id);
        const cancelUrl = paypalService.buildReturnUrl(cancelBaseUrl, booking._id, payment._id);

        const description = `Parking booking retry for spot ${booking.spot.address || booking.spot._id} (${new Date(booking.startTime).toISOString()} - ${new Date(booking.endTime).toISOString()})`;

        const order = await paypalService.createPaypalOrder({
            booking,
            payment,
            amountUsd,
            description,
            returnUrl,
            cancelUrl,
        });

        return res.status(200).json({
            bookingId: booking._id,
            paymentId: payment._id,
            redirectUrl: order.approvalUrl,
            orderId: order.orderId,
        });
    } catch (error) {
        console.error('Retry payment error', error);
        return res.status(500).json({ message: error.message || 'Unable to retry payment.' });
    }
};


