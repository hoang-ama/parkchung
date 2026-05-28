const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const spotRoutes = require('./spots.routes');
const bookingRoutes = require('./bookings.routes');
const adminRoutes = require('./admin.routes');
const paymentRoutes = require('./payment');
const hostRoutes = require('./host.routes');
const reviewRoutes = require('./review.routes');

router.use('/auth', authRoutes);
router.use('/spots', spotRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/host', hostRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;