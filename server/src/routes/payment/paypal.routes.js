const express = require('express');
const router = express.Router();
const paypalController = require('../../controllers/payment/paypal.controller');
const { optionalAuth, protect } = require('../../middlewares/auth.middleware');

router.post('/checkout', optionalAuth, paypalController.checkout);
router.post('/webhook', paypalController.webhook);
router.post('/cancel', paypalController.cancelCheckout);
router.post('/capture', paypalController.captureOrder);
router.post('/retry', protect, paypalController.retryPayment);

module.exports = router;

