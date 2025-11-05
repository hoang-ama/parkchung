const PayPalController = require('../../controllers/payment/paypal.controller');
const express = require('express');

const router = express.Router();

const paypalController = new PayPalController();

router.post(
  '/webhook',
  express.json({ type: '*/*' }),
  paypalController.webhook,
);

router.post(
  '/capture-authorization',
  // verifyToken,
  paypalController.captureAuthorization,
);

router.post(
  '/release-authorization',
  // verifyToken,
  paypalController.releaseAuthorization,
);

router.post('/', paypalController.createPaymentUrl);

module.exports = router;