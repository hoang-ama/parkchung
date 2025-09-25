const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllSpots, approveSpot, getAllBookings,rejectSpot, deleteSpot, updateSpot,updateSpotImage  } = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');
const upload = require('../middlewares/upload.middleware'); 

router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/spots', getAllSpots);
router.put('/spots/:id/approve', approveSpot);
router.put('/spots/:id/reject', rejectSpot);
router.delete('/spots/:id', deleteSpot);
router.put('/spots/:id', updateSpot);
router.post('/spots/:id/image', upload.single('spotImage'), updateSpotImage);
router.get('/bookings', getAllBookings);

module.exports = router;