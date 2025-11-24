const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const config = require('../../../config');

const encodeCredentials = () => {
    if (!config.paypal.clientId || !config.paypal.clientSecret) {
        throw new Error('Missing PayPal credentials. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
    }

    return Buffer.from(`${config.paypal.clientId}:${config.paypal.clientSecret}`).toString('base64');
};

const requestAccessToken = async () => {
    const auth = encodeCredentials();
    const url = `${config.paypal.baseUrl}/v1/oauth2/token`;
    const body = new URLSearchParams({ grant_type: 'client_credentials' });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
        },
        body,
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Failed to get PayPal access token: ${response.status} - ${errBody}`);
    }

    const data = await response.json();
    return data.access_token;
};

const paypalRequest = async (path, { method = 'GET', body, accessToken }) => {
    const response = await fetch(`${config.paypal.baseUrl}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(`PayPal API ${method} ${path} failed: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data;
};

const getAccessToken = async () => {
    return requestAccessToken();
};

const createOrder = async ({
    amount,
    currency = 'USD',
    description,
    invoiceId,
    customId,
    returnUrl,
    cancelUrl,
}) => {
    const accessToken = await getAccessToken();
    const payload = {
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: amount.toFixed(2),
                },
                description,
                invoice_id: invoiceId,
                custom_id: customId,
            },
        ],
        application_context: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
            user_action: 'PAY_NOW',
        },
    };

    return paypalRequest('/v2/checkout/orders', {
        method: 'POST',
        body: payload,
        accessToken,
    });
};

const captureOrder = async (orderId) => {
    const accessToken = await getAccessToken();
    return paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        accessToken,
    });
};

const getOrderDetails = async (orderId) => {
    const accessToken = await getAccessToken();
    return paypalRequest(`/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        accessToken,
    });
};

const verifyWebhookSignature = async ({
    transmissionId,
    timestamp,
    webhookId,
    eventBody,
    certUrl,
    authAlgo,
    transmissionSig,
}) => {
    const accessToken = await getAccessToken();
    const payload = {
        transmission_id: transmissionId,
        transmission_time: timestamp,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: eventBody,
    };

    const response = await fetch(`${config.paypal.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Failed to verify PayPal webhook: ${response.status} - ${errBody}`);
    }

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
};

module.exports = {
    getAccessToken,
    createOrder,
    captureOrder,
    getOrderDetails,
    verifyWebhookSignature,
};

