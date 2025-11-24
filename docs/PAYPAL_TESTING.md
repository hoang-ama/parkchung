# PayPal Checkout Manual Test Plan

## Prerequisites

1. Set the following environment variables in `server/.env` (see README for more details):
   - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_RETURN_URL`, `PAYPAL_CANCEL_URL`
   - `PAYPAL_WEBHOOK_ID` (optional in local testing)
2. Start the backend with `npm run dev` inside `server/`.
3. Serve the customer frontend (e.g. via VS Code Live Server) so that it is reachable at the URL configured in the PayPal return/cancel env vars.
4. (Optional) Use [ngrok](https://ngrok.com/) to expose the backend webhook endpoint (`/api/payments/paypal/webhook`) when testing real PayPal notifications.

## Happy-path booking

1. Open `client/customer/spot-details.html?id=<spotId>` via the frontend.
2. Select valid start/end times and click **Pay Now and Reserve**.
3. When redirected to PayPal, approve the payment with a sandbox buyer account.
4. After PayPal redirects back to `payment-result.html`, confirm the status eventually changes to **Payment completed**.
5. Open `my-bookings.html` and verify:
   - `bookingStatus` is `confirmed`.
   - `paymentStatus` shows `PAID` / green chip.
   - The booking row includes payment method **PAYPAL** and the amount in VND.

## Guest checkout

1. Repeat the booking flow without logging in.
2. Fill in the guest modal (full name, email, phone) and proceed to PayPal.
3. After approval, confirm that `payment-result.html` shows the guest booking information and the API `GET /api/bookings/:bookingId/payments/:paymentId` returns the booking data without requiring auth.

## Cancelled payment

1. Start a checkout flow and cancel from the PayPal approval screen.
2. Confirm that `payment-cancel.html` loads, the backend `/api/payments/paypal/cancel` endpoint marks the booking/payment as failed, and the `my-bookings` list no longer shows the pending reservation.

## Webhook handling

1. Configure a PayPal webhook pointing to `https://<ngrok-domain>/api/payments/paypal/webhook`.
2. Perform a successful checkout and ensure that PayPal webhook calls transition the payment to `COMPLETED` and the booking to `confirmed/PAID`.
3. From the PayPal dashboard, trigger a refund for the capture and confirm that `paymentStatus` becomes `REFUNDED` and the booking `paymentStatus` reflects the refund.

