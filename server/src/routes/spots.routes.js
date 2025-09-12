const express = require('express');
const router = express.Router();
const { searchSpots, createSpot, getSpotById } = require('../controllers/spot.controller');
const { protect } = require('../middlewares/auth.middleware');

router.route('/')
    .post(protect, createSpot); // User must be logged in to create a spot

router.get('/search', searchSpots);
router.get('/:id', getSpotById);

module.exports = router;