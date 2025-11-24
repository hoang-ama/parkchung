const express = require('express');
const router = express.Router();
const paypalRoutes = require('./paypal.routes');

router.use('/paypal', paypalRoutes);

module.exports = router;

