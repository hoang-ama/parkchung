const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    estimatePrice,
    createGuestBooking,
    getBookingPaymentStatus,
    cancelBooking,
    requestReview,
    getLeadStatus,
    getBookingById,
} = require('../controllers/booking.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
router.post('/estimate-price', estimatePrice); // Route ước tính giá không cần xác thực
router.post('/guest', createGuestBooking);     // Public guest booking
router.get('/leads/:leadId', getLeadStatus);   // Public: get guest lead status

// ⚠️ IMPORTANT: /mybookings must be registered BEFORE /:bookingId
// Otherwise Express will treat "mybookings" as a bookingId param value!
router.get('/mybookings', protect, getMyBookings);

router.get('/:bookingId', optionalAuth, getBookingById);
router.get('/:bookingId/payments/:paymentId', optionalAuth, getBookingPaymentStatus);

router.use(protect); // Tất cả các route sau dòng này đều yêu cầu token
router.route('/').post(protect, createBooking);
router.put('/:bookingId/cancel', protect, cancelBooking);
router.post('/:bookingId/request-review', protect, requestReview);

module.exports = router;