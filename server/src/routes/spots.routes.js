const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spot.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Route to create a new parking spot (logged in users only)
router.post(
    '/', 
    authMiddleware.protect, 
    upload.single('spotImage'), 
    spotController.createSpot
);

// Route to convert search query to lat/lng coordinates
router.get('/geocode', spotController.geocodeAddress);

// Route to get address suggestions (autocomplete)
router.get('/autocomplete', spotController.getAutocompleteSuggestions);

// Route to calculate valet price preview
router.get('/valet-price', spotController.calculateValetPrice);

// Route to find parking spots
router.get('/search', spotController.searchSpots);

// Temporary debug route for production DB inspection
router.get('/db-debug', spotController.debugDb);

// Route to get details of a specific parking spot
router.get('/:id', spotController.getSpotById);

module.exports = router;