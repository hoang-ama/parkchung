const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getAllSpots,
    approveSpot,
    getAllBookings,
    rejectSpot,
    deleteSpot,
    updateSpot,
    updateSpotImage,
    toggleSpotActive,
    createAdminBooking,
    updateAdminBooking,
    deleteAdminBooking,
    bulkDeleteBookings,
    bulkApproveSpots,
    bulkRejectSpots,
    bulkDeleteSpots
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/spots', getAllSpots);
router.put('/spots/:id/approve', approveSpot);
router.put('/spots/:id/reject', rejectSpot);
router.patch('/spots/:id/toggle-active', toggleSpotActive);
router.delete('/spots/:id', deleteSpot);
router.put('/spots/:id', updateSpot);
router.post('/spots/:id/image', upload.single('spotImage'), updateSpotImage);
// Bulk spot operations
router.post('/spots/bulk-approve', bulkApproveSpots);
router.post('/spots/bulk-reject', bulkRejectSpots);
router.post('/spots/bulk-delete', bulkDeleteSpots);
router.get('/bookings', getAllBookings);
router.post('/bookings', createAdminBooking);
router.put('/bookings/:id', updateAdminBooking);
router.delete('/bookings/:id', deleteAdminBooking);
router.post('/bookings/bulk-delete', bulkDeleteBookings);

module.exports = router;