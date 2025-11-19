const express = require('express');
const { sendBookingCancelEmailController, sendBookingConfirmEmailController } = require('../../controllers/mail/bookingEmail.controller.js');

const router = express.Router();

router.post('/booking-confirm', sendBookingConfirmEmailController);
router.post('/booking-cancel', sendBookingCancelEmailController);

module.exports = router;