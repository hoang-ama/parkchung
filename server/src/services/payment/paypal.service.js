const PayPalAcquirer = require('./acquirer/paypalAcquirer');
const mongoose = require("mongoose");

class PayPalService{

    constructor(){
        this.paypalAcquirer = new PayPalAcquirer();
    }

    async createPaymentUrl(attributes) {
        const params = {
            currency: attributes.currency,
            amount: attributes.amount,
            payment_no: attributes.payment_no,  // Là 1 đoạn code unique hoặc sau này nếu tạo 1 collection chứa thông tin payment thì có thể dùng mã unique của collection payment đó để truyền vào đây
            description: attributes.description,
            invoice_no: attributes.invoice_no,  // Là mã hóa đơn - Có thể truyền vào id hoặc đoạn mã unique của booking
            return_url: attributes.return_url,
            cancel_url: attributes.cancel_url,
        }
        
        let response;
        if(attributes.isAuthorize) // Nếu muốn quản lý tiền của đơn hàng theo cách Authorize & capture thì truyền thêm param isAuthorize
            response = await this.paypalAcquirer.purchase(params, attributes.isAuthorize);
        else 
            response = await this.paypalAcquirer.purchase(params);

        return response;
    }

    async webhook(data) {
        try {
            // Xử lý sự kiện webhook
            if (data.event_type === 'CHECKOUT.ORDER.APPROVED') {
                await this.webhookCreateOrder(data);
            } else if (data.event_type === 'PAYMENT.CAPTURE.PENDING') {
                await this.webhookPendingOrder(data);
            } else if (data.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
                await this.webhookCompleteOrder(data);
            } else if (data.event_type === 'PAYMENT.CAPTURE.DENIED') {
                await this.webhookDeniedOrder(data);
            } else if (data.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
                // await this.webhookCaptureAuthorization(data);
            } else if (data.event_type === 'PAYMENT.AUTHORIZATION.VOIDED') {
                await this.webhookReleaseAuthorization(data);
            } else if (data.event_type === 'PAYMENT.AUTHORIZATION.CREATED') {
                await this.webhookCreateAuthorization(data);
            }
            return 200;
        } catch (error) {
            console.log('Error processing webhook event:', err);
            return 500;
        }
    }

    async webhookCreateOrder(data){
        console.log("PayPal gọi webhook create order: ", data);
        
        const orderId = data.resource.id;
        const intent = data.resource.intent;

        const session = await mongoose.startSession();
        session.startTransaction();
        if (intent === 'CAPTURE') {
            let capture;
            try {
                capture = await this.paypalAcquirer.immediateCapture(orderId);
            } catch (error) {
                await session.abortTransaction();
            }
            const response = this.transformCaptureResponse(capture);
            // Do something

            console.log("Immediate capture response: ", response);
        } else if (intent === "AUTHORIZE"){
            const authorization = await this.paypalAcquirer.authorization(orderId);
            const response = this.transformAuthorizationResponse(authorization);
            // Do something
            
            console.log("Authorize response: ", response);
        }

        await session.commitTransaction();
        session.endSession();
    }

    async webhookPendingOrder(data){
        console.log("PayPal gọi webhook pending order: ", data);
        const invoiceId = data.resource.invoice_id;
        // Do something: Update status .......

    }

    async webhookCompleteOrder(data){
        console.log("PayPal gọi webhook complete order: ", data);
        const invoiceId = data.resource.invoice_id;
        // Do something: Update status .......

    }

    async webhookDeniedOrder(data){
        console.log("PayPal gọi webhook denied order: ", data);
        const invoiceId = data.resource.invoice_id;
        // Do something: Update status .......

    }

    async webhookReleaseAuthorization(data){
        console.log("PayPal gọi webhook authorization order: ", data);
        const invoiceId = data.resource.invoice_id;
        // Do something: Update status .......
        
    }

    async webhookCreateAuthorization(data){
        console.log("PayPal gọi webhook create authorization: ", data);
        const invoiceId = data.resource.invoice_id;
        // Do something: Update status .......
        
    }

    async captureAuthorization(attributes){
        const captureAmount = attributes.amount;
        const authorizationId = attributes.authorizationId; // Lấy authorizationId từ body trong AUTHORIZATION.CREATE
        if (!authorizationId) {
            throw new Error(
                'Authorization ID not found for deposit ID: ' + depositId,
            );
        }
        const params = {
            amount: {
                value: captureAmount,
                currency_code: 'USD'
            },
            final_capture: true
        }
        
        const result = await this.paypalAcquirer.captureAuthorization(authorizationId, params);

        return {
            status: result
        }
    }

    async releaseAuthorization(attributes){
        const authorizationId = attributes.authorizationId; // Lấy authorizationId từ body trong AUTHORIZATION.CREATE
        if (!authorizationId) {
            throw new Error(
                'Authorization ID not found for deposit ID: ' + depositId,
            );
        }

        const result = await this.paypalAcquirer.releaseAuthorization(authorizationId);

        return {
            status: result
        }
    }

    transformCaptureResponse(data) {
        if (!data || !data.purchase_units) return null;

        const capture = data.purchase_units[0]?.payments?.captures?.[0];

        return {
            orderId: data.id,
            intent: data.intent,
            status: data.status,
            captureId: capture?.id,
            amount: {
                value: capture?.amount?.value,
                currency: capture?.amount?.currency_code,
            },
            payer: {
                id: data.payer?.payer_id,
                email: data.payer?.email_address,
            },
            createTime: capture?.create_time,
            updateTime: capture?.update_time,
        };
    }

    transformAuthorizationResponse(data){
        if (!data || !data.purchase_units) return null;

        const auth = data.purchase_units[0]?.payments?.authorizations?.[0];

        return {
            orderId: data.id,
            intent: data.intent,
            status: data.status,
            authorizationId: auth?.id,
            amount: {
                value: auth?.amount?.value,
                currency: auth?.amount?.currency_code,
            },
            payer: {
                id: data.payer?.payer_id,
                email: data.payer?.email_address,
            },
            expirationTime: auth?.expiration_time,
        };
    }
}

module.exports = PayPalService;