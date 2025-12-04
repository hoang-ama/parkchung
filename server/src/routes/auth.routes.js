// File: server/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerHost } = require('../controllers/auth.controller');

// Customer registration
router.post('/register', registerUser);

// User login (all roles)
router.post('/login', loginUser);

// Host/Partner registration
router.post('/register-host', registerHost);

module.exports = router;