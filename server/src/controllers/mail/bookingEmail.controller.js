const { sendBookingCancelEmail, sendBookingConfirmEmail } = require('../../services/mail/bookingEmail.service.js');

async function sendBookingConfirmEmailController(req, res) {
    const booking = req.body;
    try {
        await sendBookingConfirmEmail(booking);
        res.status(200).json({ message: 'Booking confirmation email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking confirmation email', error: error.message });
    }
}

async function sendBookingCancelEmailController(req, res) {
    const booking = req.body;
    try {
        await sendBookingCancelEmail(booking);
        res.status(200).json({ message: 'Booking canceled email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking canceled email', error: error.message });
    }
}

module.exports = { sendBookingConfirmEmailController, sendBookingCancelEmailController };