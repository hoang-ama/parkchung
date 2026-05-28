const express = require('express');
const router = express.Router();
const { createReview, getSpotReviews } = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route to get reviews for a parking spot
router.get('/spot/:spotId', getSpotReviews);

// Protected route to write a review
router.post('/', protect, createReview);

module.exports = router;
