const dotenv = require('dotenv')

dotenv.config();

const config = {
    GGSHEET: {
        sheetId: process.env.SHEET_ID || '',
        sheetTitle: process.env.SHEET_TITLE || '',
    },
    PAYPAL: {
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
        mode: process.env.PAYPAL_MODE || 'sandbox',
        webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
        authUrl: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token' || '',
        createOrderUrl: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders' || '',
        captureOrderUrl: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders' || '',
        stcUrl: process.env.PAYPAL_BASE_URL + '/v1/risk/transaction-contexts' || '',
        verifyWebhookSignatureUrl: process.env.PAYPAL_BASE_URL + '/v1/notifications/verify-webhook-signature' || '',
        refundAndCaptureAuthorizationUrl: process.env.PAYPAL_BASE_URL + '/v2/payments/authorizations' || '',
        getDetailCapture: process.env.PAYPAL_BASE_URL + '/v2/payments/captures' || '',
        convertVndToUsdUrl: process.env.CONVERT_VND_TO_USD_URL || '',
    }
}

module.exports = { config };