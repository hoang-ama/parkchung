const { config } = require('../../config/constant.js');
const PayPalService = require('../../services/payment/paypal.service.js');

class PayPalController {

  constructor() {
    this.paypalService = new PayPalService();
  }

  webhook = async (req, res) => {
    const body = req.body;

    // const request = {
    //   transmission_id: req.header('paypal-transmission-id'),
    //   transmission_time: req.header('paypal-transmission-time'),
    //   cert_url: req.header('paypal-cert-url'),
    //   auth_algo: req.header('paypal-auth-algo'),
    //   transmission_sig: req.header('paypal-transmission-sig'),
    //   webhook_id: config.PAYPAL.webhookId,
    //   webhook_event: body,
    // };

    // const response = await this.paypalService.webhook(request, body);
    const response = await this.paypalService.webhook(body);
    let message;
    if(response === 200)
      message = "webhook received successfully";
    else if(response === 500)
      message = "webhook received failed";

    res.status(response).json({message: message});
  };

  captureAuthorization = async (req, res) => {
    const body = req.body;

    const request = {
      authorizationId: body.authorizationId,
      amount: body.amount,
      note: body.note ? body.note : 'Thu tien coc',
    };

    try {
      const response = await this.paypalService.captureAuthorization(request);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  };

  releaseAuthorization = async (req, res) => {
    const body = req.body;

    const request = {
      authorizationId: body.authorizationId,
      note: body.note,
    };

    try {
      const response = await this.paypalService.releaseAuthorization(request);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  };

  createPaymentUrl = async(req, res) => {
    try {
      const response = await this.paypalService.createPaymentUrl(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }
}

module.exports = PayPalController;