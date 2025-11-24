const express = require('express');
const router = express.Router();
const paypalController = require('../../controllers/payment/paypal.controller');
const { optionalAuth } = require('../../middlewares/auth.middleware');

router.post('/checkout', optionalAuth, paypalController.checkout);
router.post('/webhook', paypalController.webhook);
router.post('/cancel', paypalController.cancelCheckout);
router.post('/capture', paypalController.captureOrder);

module.exports = router;

