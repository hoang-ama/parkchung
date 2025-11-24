require('dotenv').config();

const paypalMode = process.env.PAYPAL_MODE || 'sandbox';

const config = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN,
    clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME, // cloudinary process
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        webhookId: process.env.PAYPAL_WEBHOOK_ID,
        mode: paypalMode,
        baseUrl: process.env.PAYPAL_BASE_URL || (paypalMode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'),
        returnUrl: process.env.PAYPAL_RETURN_URL,
        cancelUrl: process.env.PAYPAL_CANCEL_URL,
        convertVndToUsdUrl: process.env.CONVERT_VND_TO_USD_URL,
        usdExchangeRate: Number(process.env.PAYPAL_USD_EXCHANGE_RATE) || 24000,
    },
};

module.exports = config;