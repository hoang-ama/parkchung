const { sendBookingEmail, sendEmailPartner } = require('../../services/mail/bookingEmail.service.js');
const { MAIL_TEMPLATE_NAMES } = require('../../services/mail/brevo.service.js')

async function sendBookingConfirmEmailController(req, res) {
    const booking = req.body;
    try {
        await sendBookingEmail(booking, MAIL_TEMPLATE_NAMES.BOOKING_CONFIRM);
        res.status(200).json({ message: 'Booking confirmation email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking confirmation email', error: error.message });
    }
}

async function sendBookingCancelEmailController(req, res) {
    const booking = req.body;
    try {
        await sendBookingEmail(booking, MAIL_TEMPLATE_NAMES.BOOKING_CANCEL);
        res.status(200).json({ message: 'Booking canceled email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking canceled email', error: error.message });
    }
}

async function sendBookingReviewEmailController(req, res) {
    const booking = req.body;
    try {
        await sendBookingEmail(booking, MAIL_TEMPLATE_NAMES.REVIEW);
        res.status(200).json({ message: 'Booking review email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking review email', error: error.message });
    }
}

async function sendEmailPartnerBookingConfirm(req, res) {
    const booking = req.body;
    try {
        await sendEmailPartner(booking, MAIL_TEMPLATE_NAMES.PARTNER_CONFIRM);
        res.status(200).json({ message: 'Partner booking confirmation email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send partner booking confirmation email', error: error.message });
    }
}

async function sendEmailPartnerBookingCancel(req, res) {
    const booking = req.body;
    try {
        await sendEmailPartner(booking, MAIL_TEMPLATE_NAMES.PARTNER_CANCEL);
        res.status(200).json({ message: 'Partner booking cancel email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send partner booking cancel email', error: error.message });
    }
}

module.exports = { sendBookingConfirmEmailController, sendBookingCancelEmailController, sendBookingReviewEmailController,
    sendEmailPartnerBookingConfirm, sendEmailPartnerBookingCancel
 };