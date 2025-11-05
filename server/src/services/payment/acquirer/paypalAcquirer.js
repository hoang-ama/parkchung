const { config } = require("../../../config/constant.js");
const axios = require("axios");

class PayPalAcquirer {
    
    constructor() {
        this.clientId = config.PAYPAL.clientId;
        this.clientSecret = config.PAYPAL.clientSecret;
    }

    async getAccessToken() {
        const authUrl = config.PAYPAL.authUrl;
        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const data = 'grant_type=client_credentials';

        try {

            const response = await axios.post(authUrl, data, {
                headers: {
                Accept: 'application/json',
                'Accept-Language': 'en_US',
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            return response.data?.access_token;
        } catch (error) {
            throw new Error('Failed to fetch PayPal access token');
        }
    }

    async createOrder(params) {
        const createOrderUrl = config.PAYPAL.createOrderUrl;
        const accessToken = await this.getAccessToken();
        try {
            const response = await axios.post(createOrderUrl, params, {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });

            const approveLink = response.data.links.find(
                (link) => link.rel === 'approve',
            ).href;

            return {
                id: response.data.id,
                status: response.data.status,
                rel: 'approve',
                href: approveLink,
            };
        } catch (error) {
            console.log('Error creating PayPal order:', error);
            return null;
        }
    }

    async purchase(attributes, isAuthorize) {
        const accessToken = await this.getAccessToken();

        if(!accessToken)
            throw new Error("Failed to fetch PayPal access token");

        // Chuẩn bị các param để tạo link
        const amount = {
            currency_code: attributes.currency,
            value: attributes.amount.toString(),
        };
 
        const purchaseUnit = {
            reference_id: attributes.payment_no,
            amount: amount,
            description: attributes.description,
            invoice_id: attributes.invoice_no,
        };

        const applicationContext = {
            return_url: attributes.return_url,
            cancel_url: attributes.cancel_url,
            shipping_preference: 'NO_SHIPPING',
        };

        const request = {
            intent: 'CAPTURE',
            purchase_units: [purchaseUnit],
            application_context: applicationContext,
        };

        if (isAuthorize) request.intent = 'AUTHORIZE';

        const response = await this.createOrder(request);

        return {
            // status: ACQUIRER_STATUS_PROCESSING,  Trạng thái xử lý đơn hàng
            status: 0,
            paymentNo: attributes.payment_no,
            redirectUrl: response.href,
            paypalOrderId: response.id,
        };
    }

    async immediateCapture(orderId) {
        const captureOrderUrl = `${config.PAYPAL.captureOrderUrl}/${orderId}/capture`;
        const accessToken = await this.getAccessToken();

        try {
            const response = await axios.post(
                captureOrderUrl,
                {},
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                },
            );

            console.log('Immediate capture: ', response.data);

            return response.data;
        } catch (error) {
            console.log('Error capturing PayPal order:', error);
            return 500;
        }
    }

    async authorization(orderId) {
        const captureOrderUrl = `${config.PAYPAL.captureOrderUrl}/${orderId}/authorize`;
        const accessToken = await this.getAccessToken();

        try {
            const response = await axios.post(
                captureOrderUrl,
                {},
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                },
            );

            console.log('Authorize: ', response.data);

            return response.data;
        } catch (error) {
            console.log('Error capturing PayPal order:', error);
            return 500;
        }
    }

    async captureAuthorization( authorizationId, params) {
        const url = `${config.PAYPAL.refundAndCaptureAuthorizationUrl}/${authorizationId}/capture`;
        const access_token = await this.getAccessToken();
        try {
            const result = await axios.post(url, params, {
                headers: {
                Authorization: `Bearer ${access_token}`,
                },
            });

            console.log('Authorization capture: ', result.data);

            return result.status;
        } catch (error) {
            throw new Error('Failed to capture PayPal authorization');
        }
    }

    async releaseAuthorization(authorizationId) {
        const url = `${config.PAYPAL.refundAndCaptureAuthorizationUrl}/${authorizationId}/void`;
        const access_token = await this.getAccessToken();
        try {
            const response = await axios.post(
                url,
                {},
                {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                },
            );

            console.log('Release authorization: ', response.data);

            return response.status;
        } catch (error) {
            throw new Error('Failed to release PayPal authorization');
        }
    }

    async convertVNDToUSD(vndAmount, fee) {
        const convertMoneyUrl = config.PAYPAL.convertVndToUsdUrl;
        let exchangeRate = 0.00003819; // Tỷ giá VND sang USD mặc định

        // Sử dụng api đổi tiền từ VND sang USD
        try {
            const response = await axios.get(convertMoneyUrl);

            // Update exchange rate theo tỷ giá hiện tại
            exchangeRate = response.data.conversion_rates.USD;
        } catch (error) {
            console.log('Error fetching exchange rate:', error);
            throw new Error('Failed to fetch exchange rate');
        }

        let amountUSD = 0;
        if (fee) amountUSD = (vndAmount + vndAmount * fee) * exchangeRate;
        else amountUSD = vndAmount * exchangeRate;

        return (amountUSD = Number(amountUSD.toFixed(2)));
    }

    async convertUSDToVND(usdAmount, fee) {
        const convertMoneyUrl = config.PAYPAL.convertVndToUsdUrl;
        let exchangeRate = 0.00003819; // Tỷ giá VND sang USD mặc định

        // Sử dụng api đổi tiền từ VND sang USD
        try {
            const response = await axios.get(convertMoneyUrl);

            // Update exchange rate theo tỷ giá hiện tại
            exchangeRate = response.data.conversion_rates.USD;
        } catch (error) {
            console.log('Error fetching exchange rate:', error);
            throw new Error('Failed to fetch exchange rate');
        }

        const rateUSDToVND = 1 / exchangeRate;

        let amountVND = 0;
        if (fee) amountVND = (usdAmount + usdAmount * fee) * rateUSDToVND;
        else amountVND = usdAmount * rateUSDToVND;

        return (amountVND = Math.round(amountVND));
    }

    async getDetailCapture(captureId) {
        const url = config.PAYPAL.getDetailCapture;
        const accessToken = await this.getAccessToken();
        try {
            const response = await axios.get(`${url}/${captureId}`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get detail capture with ${captureId}`);
        }
    }
}

module.exports = PayPalAcquirer;