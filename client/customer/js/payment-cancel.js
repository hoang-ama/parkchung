const titleEl = document.getElementById('cancel-message-title');
const bodyEl = document.getElementById('cancel-message-body');
const retryBtn = document.getElementById('retry-booking');
const bookingsBtn = document.getElementById('view-bookings-cancel');

const params = new URLSearchParams(window.location.search);
const bookingId = params.get('bookingId');
const paymentId = params.get('paymentId');

const updateMessage = (title, body) => {
    titleEl.textContent = title;
    bodyEl.textContent = body;
};

const callCancelEndpoint = async () => {
    if (!bookingId || !paymentId) {
        updateMessage('Missing booking details', 'We could not identify the booking to cancel.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/payments/paypal/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, paymentId }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(payload.message || 'Unable to cancel booking.');
        }

        updateMessage('Payment cancelled', 'We have released the booking slot. You can start a new booking when ready.');
    } catch (error) {
        updateMessage('Cancellation issue', error.message);
    }
};

const setupButtons = () => {
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            window.location.href = 'results.html';
        });
    }
    if (bookingsBtn) {
        bookingsBtn.addEventListener('click', () => {
            window.location.href = 'my-bookings.html';
        });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    setupButtons();
    await callCancelEndpoint();
});

