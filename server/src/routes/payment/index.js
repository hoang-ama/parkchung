const express = require('express');

const callbackRoutes = require('./callback.routes');
const paypalRoutes = require('./paypal.routes');

const router = express.Router(); 
router.use("/callback", callbackRoutes);
router.use("/paypal", paypalRoutes);

module.exports = router;