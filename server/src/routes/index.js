const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const spotRoutes = require('./spots.routes');
const bookingRoutes = require('./bookings.routes');
const adminRoutes = require('./admin.routes');
const googleRoutes = require('./google/google.routes');
const paymentRouter = require('./payment');

router.use('/auth', authRoutes);
router.use('/spots', spotRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/google', googleRoutes);
router.use('/payments', paymentRouter);

module.exports = router;