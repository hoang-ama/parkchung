const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const spotRoutes = require('./spots.routes');
const bookingRoutes = require('./bookings.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/spots', spotRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;