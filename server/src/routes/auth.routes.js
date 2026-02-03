// File: server/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerHost,
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Customer registration
router.post('/register', registerUser);

// User login (all roles)
router.post('/login', loginUser);

// Host/Partner registration
router.post('/register-host', registerHost);

// Profile routes (protected)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;