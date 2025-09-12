const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
    .post(protect, createBooking);

router.route('/mybookings')
    .get(protect, getMyBookings);

module.exports = router;