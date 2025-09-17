// File: server/src/routes/spots.routes.js
const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spot.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Route để tạo một điểm đỗ xe mới (chỉ user đã đăng nhập)
router.post(
    '/', 
    authMiddleware.protect, 
    upload.single('spotImage'), 
    spotController.createSpot
);

// Route để lấy gợi ý địa chỉ (autocomplete)
router.get('/autocomplete', spotController.getAutocompleteSuggestions);

// Route để tìm kiếm các điểm đỗ xe
router.get('/search', spotController.searchSpots);

// Route để lấy thông tin chi tiết của một điểm đỗ xe cụ thể
router.get('/:id', spotController.getSpotById);

module.exports = router;