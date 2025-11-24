const { URL } = require('url');
const Payment = require('../../models/payment.model');
const Booking = require('../../models/booking.model');
const paypalAcquirer = require('./acquirer/paypalAcquirer');
const config = require('../../config');
const brevoService = require('../brevo.service');
const {
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
    BOOKING_PAYMENT_STATUS,
} = require('../../constants/payment');

const convertVndToUsd = (amountVnd = 0) => {
    if (!amountVnd || amountVnd <= 0) return 0;
    const rate = config.paypal.usdExchangeRate || 24000;
    return Math.max(0.01, parseFloat((amountVnd / rate).toFixed(2)));
};

const buildReturnUrl = (baseUrl, bookingId, paymentId) => {
    const url = new URL(baseUrl);
    url.searchParams.set('bookingId', bookingId);
    url.searchParams.set('paymentId', paymentId);
    return url.toString();
};

const createPaypalOrder = async ({
    booking,
    payment,
    amountUsd,
    description,
    returnUrl,
    cancelUrl,
}) => {
    if (amountUsd <= 0) {
        throw new Error('Amount must be greater than zero');
    }

    const order = await paypalAcquirer.createOrder({
        amount: amountUsd,
        currency: 'USD',
        description,
        invoiceId: booking._id.toString(),
        customId: payment._id.toString(),
        returnUrl,
        cancelUrl,
    });

    const approvalLink = (order.links || []).find((link) => link.rel === 'approve');
    if (!approvalLink) {
        throw new Error('Missing PayPal approval link');
    }

    payment.paypalOrderId = order.id;
    payment.status = PAYMENT_STATUSES.PENDING;
    await payment.save();

    booking.paymentStatus = BOOKING_PAYMENT_STATUS.PENDING;
    booking.paymentMethod = PAYMENT_METHODS.PAYPAL;
    booking.payment = payment._id;
    await booking.save();

    return {
        orderId: order.id,
        approvalUrl: approvalLink.href,
    };
};

const capturePaypalOrder = async (orderId) => {
    let captureData;
    try {
        captureData = await paypalAcquirer.captureOrder(orderId);
    } catch (error) {
        console.warn(`Capture failed for order ${orderId}, checking status...`, error.message);
        try {
            captureData = await paypalAcquirer.getOrderDetails(orderId);
        } catch (fetchError) {
            throw error;
        }
    }

    if (captureData.status !== 'COMPLETED') {
        throw new Error(`PayPal order is not completed. Status: ${captureData.status}`);
    }

    // Extract Capture ID from purchase_units
    const purchaseUnit = captureData.purchase_units && captureData.purchase_units[0];
    const captures = purchaseUnit?.payments?.captures;
    const captureId = captures && captures.length > 0 ? captures[0].id : null;

    if (!captureId) {
        console.warn('No capture ID found in COMPLETED order', JSON.stringify(captureData));
    }

    // Find payment by orderId
    const payment = await Payment.findOne({ paypalOrderId: orderId });
    if (!payment) {
        throw new Error('Payment not found for this order');
    }

    const booking = await Booking.findById(payment.booking);
    if (!booking) {
        throw new Error('Booking not found for this payment');
    }

    if (payment.status === PAYMENT_STATUSES.COMPLETED) {
        return { payment, booking };
    }

    const status = PAYMENT_STATUSES.COMPLETED;
    const bookingPaymentStatus = BOOKING_PAYMENT_STATUS.PAID;
    const bookingStatus = 'confirmed';

    await markPaymentAndBooking({
        payment,
        booking,
        paymentStatus: status,
        bookingStatus,
        bookingPaymentStatus,
        patch: {
            paypalCaptureId: captureId || captureData.id,
            rawResponse: captureData,
        },
    });

    return { payment, booking };
};

const findPaymentFromResource = async (resource = {}) => {
    if (resource.custom_id) {
        return Payment.findById(resource.custom_id);
    }

    const relatedOrderId = resource?.supplementary_data?.related_ids?.order_id;
    if (relatedOrderId) {
        return Payment.findOne({ paypalOrderId: relatedOrderId });
    }

    if (resource.invoice_id) {
        return Payment.findOne({ booking: resource.invoice_id }).sort({ createdAt: -1 });
    }

    if (resource.id) {
        return Payment.findOne({ paypalCaptureId: resource.id });
    }

    return null;
};

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

const markPaymentAndBooking = async ({ payment, booking, paymentStatus, bookingStatus, bookingPaymentStatus, eventId, patch = {} }) => {
    if (!payment || !booking) return;

    if (eventId && payment.lastWebhookEventId === eventId) {
        return;
    }

    payment.status = paymentStatus;
    payment.lastWebhookEventId = eventId;
    Object.assign(payment, patch);
    await payment.save();

    booking.paymentStatus = bookingPaymentStatus;
    if (bookingStatus) {
        booking.status = bookingStatus;
    }
    await booking.save();

    // Send Emails
    try {
        await ensureBookingPopulated(booking);
        const bookingData = prepareBookingData(booking);

        if (bookingStatus === 'confirmed') {
            await brevoService.sendBookingEmail(bookingData, 'bookingConfirm');
            if (bookingData.partnerEmail) {
                await brevoService.sendEmailPartner(bookingData, 'partnerConfirm');
            } else {
                console.warn(`Skipping partner email for booking ${booking._id}: Partner email not found.`);
            }

            // Schedule review email to be sent AFTER the parking duration ends (after endTime)
            const endTime = new Date(booking.endTime);
            const now = new Date();
            const delayMs = endTime.getTime() - now.getTime();

            // Only schedule if endTime is in the future
            if (delayMs > 0) {
                setTimeout(async () => {
                    try {
                        console.log(`Sending scheduled review email for booking ${booking._id} after parking duration ended...`);
                        await brevoService.sendReviewEmail(bookingData);
                    } catch (reviewError) {
                        console.error(`Failed to send scheduled review email for booking ${booking._id}:`, reviewError);
                    }
                }, delayMs);

                console.log(`Review email scheduled for booking ${booking._id} at ${endTime.toISOString()} (in ${Math.round(delayMs / 1000 / 60)} minutes)`);
            } else {
                console.log(`Booking ${booking._id} has already ended. Sending review email immediately.`);
                // If the booking has already ended, send review email immediately
                try {
                    await brevoService.sendReviewEmail(bookingData);
                } catch (reviewError) {
                    console.error(`Failed to send immediate review email for booking ${booking._id}:`, reviewError);
                }
            }

        } else if (bookingStatus === 'cancelled') {
            await brevoService.sendBookingEmail(bookingData, 'bookingCancel');
            if (bookingData.partnerEmail) {
                await brevoService.sendEmailPartner(bookingData, 'partnerCancel');
            }
        }
    } catch (emailError) {
        console.error('Failed to send emails:', emailError);
    }
};

const processCaptureCompleted = async (event) => {
    const resource = event.resource;
    const payment = await findPaymentFromResource(resource);
    if (!payment) {
        console.warn('No payment found for capture completed event');
        return;
    }

    const booking = await Booking.findById(payment.booking);
    if (!booking) {
        console.warn('No booking found for capture completed event');
        return;
    }

    if (payment.status === PAYMENT_STATUSES.COMPLETED) {
        return;
    }

    await markPaymentAndBooking({
        payment,
        booking,
        paymentStatus: PAYMENT_STATUSES.COMPLETED,
        bookingStatus: 'confirmed',
        bookingPaymentStatus: BOOKING_PAYMENT_STATUS.PAID,
        eventId: event.id,
        patch: {
            paypalCaptureId: resource.id,
            payerEmail: resource?.payer?.email_address,
            rawResponse: resource,
        },
    });
};

const processCaptureDenied = async (event, status, bookingPaymentStatus) => {
    const resource = event.resource;
    const payment = await findPaymentFromResource(resource);
    if (!payment) return;

    const booking = await Booking.findById(payment.booking);
    if (!booking) return;

    await markPaymentAndBooking({
        payment,
        booking,
        paymentStatus: status,
        bookingStatus: 'cancelled',
        bookingPaymentStatus,
        eventId: event.id,
        patch: {
            rawResponse: resource,
        },
    });
};

const processOrderApproved = async (event) => {
    const resource = event.resource;
    const payment = await findPaymentFromResource(resource);
    if (!payment) return;
    payment.status = PAYMENT_STATUSES.PENDING;
    payment.lastWebhookEventId = event.id;
    payment.rawResponse = resource;
    await payment.save();
};

const handleWebhookEvent = async (headers, body) => {
    if (!body || !body.event_type) {
        throw new Error('Invalid webhook payload');
    }

    if (config.paypal.webhookId) {
        const isValid = await paypalAcquirer.verifyWebhookSignature({
            transmissionId: headers['paypal-transmission-id'],
            timestamp: headers['paypal-transmission-time'],
            webhookId: config.paypal.webhookId,
            eventBody: body,
            certUrl: headers['paypal-cert-url'],
            authAlgo: headers['paypal-auth-algo'],
            transmissionSig: headers['paypal-transmission-sig'],
        });

        if (!isValid) {
            throw new Error('Invalid PayPal webhook signature');
        }
    } else {
        console.warn('PAYPAL_WEBHOOK_ID is not configured. Skipping signature verification.');
    }

    switch (body.event_type) {
        case 'CHECKOUT.ORDER.APPROVED':
            await processOrderApproved(body);
            break;
        case 'PAYMENT.CAPTURE.COMPLETED':
            await processCaptureCompleted(body);
            break;
        case 'PAYMENT.CAPTURE.DENIED':
        case 'PAYMENT.CAPTURE.REVERSED':
            await processCaptureDenied(body, PAYMENT_STATUSES.FAILED, BOOKING_PAYMENT_STATUS.FAILED);
            break;
        case 'PAYMENT.CAPTURE.REFUNDED':
            await processCaptureDenied(body, PAYMENT_STATUSES.REFUNDED, BOOKING_PAYMENT_STATUS.REFUNDED);
            break;
        default:
            console.log(`Unhandled PayPal event: ${body.event_type}`);
    }
};

module.exports = {
    convertVndToUsd,
    buildReturnUrl,
    createPaypalOrder,
    handleWebhookEvent,
    capturePaypalOrder,
};

