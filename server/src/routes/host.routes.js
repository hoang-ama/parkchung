// File: server/src/routes/host.routes.js
const express = require('express');
const router = express.Router();
const { protect, hostOnly } = require('../middlewares/auth.middleware');

// Import host controllers
const {
    getHostMe,
    getMySpots,
    createSpot,
    updateSpot,
    updateHostProfile
} = require('../controllers/host.controller');

const {
    getHostBookings,
    cancelHostBooking,
    getHostBookingById
} = require('../controllers/hostBooking.controller');

const {
    getHostAnalyticsOverview,
    getRevenueBySpot,
    getBookingTrends
} = require('../controllers/hostAnalytics.controller');

// Apply authentication middleware to all routes
router.use(protect);
router.use(hostOnly);

// ============ Host Profile Routes ============
router.get('/me', getHostMe);
router.put('/profile', updateHostProfile);

const upload = require('../middlewares/upload.middleware');

// ============ Host Spots Routes ============
router.get('/spots', getMySpots);
router.post('/spots', upload.array('images', 5), createSpot);
router.put('/spots/:id', upload.array('images', 5), updateSpot);

// ============ Host Bookings Routes ============
router.get('/bookings', getHostBookings);
router.get('/bookings/:id', getHostBookingById);
router.put('/bookings/:id/cancel', cancelHostBooking);

// ============ Host Analytics Routes ============
router.get('/analytics/overview', getHostAnalyticsOverview);
router.get('/analytics/revenue-by-spot', getRevenueBySpot);
router.get('/analytics/booking-trends', getBookingTrends);

module.exports = router;
