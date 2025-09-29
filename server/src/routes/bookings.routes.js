const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings,estimatePrice  } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');
router.post('/estimate-price', estimatePrice); // <-- Đã xóa 'protect'
router.use(protect); // Tất cả các route sau dòng này đều yêu cầu token
router.route('/')
    .post(protect, createBooking);
router.route('/mybookings')
    .get(protect, getMyBookings);

module.exports = router;