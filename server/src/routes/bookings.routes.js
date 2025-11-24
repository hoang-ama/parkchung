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
} = require('../controllers/booking.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
router.post('/estimate-price', estimatePrice); // Route ước tính giá không cần xác thực
router.post('/guest', createGuestBooking); // Public guest booking
router.get('/:bookingId/payments/:paymentId', optionalAuth, getBookingPaymentStatus);
router.use(protect); // Tất cả các route sau dòng này đều yêu cầu token
router.route('/')
    .post(protect, createBooking);
router.route('/mybookings')
    .get(protect, getMyBookings);
router.put('/:bookingId/cancel', protect, cancelBooking);
router.post('/:bookingId/request-review', protect, requestReview);

module.exports = router;