const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllSpots, approveSpot } = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/admin.middleware');

// All admin routes are protected and require admin role
router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/spots', getAllSpots);
router.put('/spots/:id/approve', approveSpot);

module.exports = router;