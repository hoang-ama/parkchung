const express = require('express');
const { sendBookingCancelEmailController, sendBookingConfirmEmailController, sendBookingReviewEmailController,
    sendEmailPartnerBookingCancel, sendEmailPartnerBookingConfirm
 } = require('../../controllers/mail/bookingEmail.controller.js');

const router = express.Router();

router.post('/booking-confirm', sendBookingConfirmEmailController);
router.post('/booking-cancel', sendBookingCancelEmailController);
router.post('/review', sendBookingReviewEmailController);
router.post('/partner-confirm', sendEmailPartnerBookingConfirm);
router.post('/partner-cancel', sendEmailPartnerBookingCancel);

module.exports = router;