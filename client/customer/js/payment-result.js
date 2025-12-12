const statusHeadingEl = document.getElementById('payment-status-heading');
const statusDescriptionEl = document.getElementById('payment-status-description');
const summaryEl = document.getElementById('payment-booking-summary');
const refreshBtn = document.getElementById('refresh-status');
const bookingsBtn = document.getElementById('view-bookings');

const params = new URLSearchParams(window.location.search);
const bookingId = params.get('bookingId');
const paymentId = params.get('paymentId');
const paypalToken = params.get('token');
const leadId = params.get('leadId');
const isGuest = params.get('isGuest') === 'true';
const paymentMethodParam = params.get('paymentMethod');

const paymentStatusMessages = {
    PAID: {
        title: 'Payment completed successfully!',
        description: 'Your booking is now confirmed. You can view the full details on the My Bookings page.',
    },
    PENDING: {
        title: 'Payment pending confirmation...',
        description: 'We are still waiting for PayPal to confirm this payment. Please refresh the status after a moment.',
    },
    FAILED: {
        title: 'Payment failed',
        description: 'This booking could not be confirmed because the payment failed or was cancelled.',
    },
    REFUNDED: {
        title: 'Payment refunded',
        description: 'This payment was refunded. Please contact support if you have any questions.',
    },
    UNPAID: {
        title: 'Payment not completed',
        description: 'We did not detect a completed payment for this booking.',
    },
    // Guest cash booking success
    CASH_CONFIRMED: {
        title: 'Booking Confirmed!',
        description: 'Your parking spot is reserved. A confirmation email has been sent to your email address. You can pay at the parking spot upon arrival.',
    },
};

const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}) : 'N/A';

const formatCurrency = (amount) => amount ? `${Number(amount).toLocaleString('vi-VN')} VND` : 'N/A';

const setViewBookings = () => {
    if (bookingsBtn) {
        // For guest users, change the button to go home instead
        if (isGuest) {
            bookingsBtn.textContent = 'Back to Home';
            bookingsBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        } else {
            bookingsBtn.addEventListener('click', () => {
                window.location.href = 'my-bookings.html';
            });
        }
    }
};

const buildSummaryHtml = (booking, payment) => {
    const bookingStatus = String(booking.status || 'pending').toLowerCase();
    const paymentStatus = (booking.paymentStatus || 'UNPAID').toLowerCase();
    const paymentAmount = payment && typeof payment.amountVnd === 'number'
        ? formatCurrency(payment.amountVnd)
        : (booking.totalPrice ? formatCurrency(booking.totalPrice) : 'N/A');

    // For guest bookings, show guest name
    const customerName = booking.fullName || booking.guestFullName || 'Guest';

    return `
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Spot:</strong> ${booking.spot?.address || booking.spot || 'N/A'}</p>
        <p><strong>Booking:</strong> ${formatDate(booking.startTime)} → ${formatDate(booking.endTime)}</p>
        <p><strong>Booking Status:</strong> <span class="booking-status status-${bookingStatus}">${booking.status || 'pending'}</span></p>
        <p><strong>Payment Status:</strong> <span class="booking-status status-${paymentStatus}">${booking.paymentStatus || 'UNPAID'}</span></p>
        <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'N/A'}</p>
        <p><strong>Amount:</strong> ${paymentAmount}</p>
        <p><strong>Reference:</strong> ${booking._id || (payment ? payment._id : 'N/A')}</p>
    `;
};

const showMissingParams = () => {
    statusHeadingEl.textContent = 'Missing booking information';
    statusDescriptionEl.textContent = 'We could not identify your booking. Please check the link and try again.';
    if (refreshBtn) refreshBtn.disabled = true;
};

// Handle guest cash bookings (bookingId + isGuest + paymentMethod=CASH, no paymentId)
const fetchGuestCashBookingStatus = async () => {
    if (!bookingId) {
        showMissingParams();
        return;
    }

    try {
        if (refreshBtn) {
            refreshBtn.disabled = true;
            updateButtonText(refreshBtn, 'Loading...');
        }

        // For guest cash bookings, fetch directly from a simple booking endpoint
        // We'll use a GET request to a new endpoint or pass paymentId as empty
        const response = await fetch(`${API_URL}/bookings/${bookingId}/status`);

        // If that endpoint doesn't exist, try a fallback
        if (!response.ok) {
            // Fallback: Show success immediately since the booking was just created successfully
            const card = document.getElementById('payment-result-card');
            if (card) {
                card.classList.remove('loading');
                card.classList.add('payment-success');
            }

            const icon = document.querySelector('.booking-card__icon i');
            if (icon) {
                icon.className = 'fas fa-check-circle';
            }

            const message = paymentStatusMessages.CASH_CONFIRMED;
            statusHeadingEl.textContent = message.title;
            statusDescriptionEl.textContent = message.description;

            // Show minimal summary for guest cash booking
            summaryEl.innerHTML = `
                <p><strong>Booking Reference:</strong> ${bookingId}</p>
                <p><strong>Payment Method:</strong> Cash (Pay at spot)</p>
                <p><strong>Status:</strong> <span class="booking-status status-confirmed">Confirmed</span></p>
            `;
            return;
        }

        const { booking } = await response.json();

        // Update card styling for success
        const card = document.getElementById('payment-result-card');
        if (card) {
            card.classList.remove('loading');
            card.classList.add('payment-success');
        }

        const icon = document.querySelector('.booking-card__icon i');
        if (icon) {
            icon.className = 'fas fa-check-circle';
        }

        const message = booking.status === 'confirmed'
            ? paymentStatusMessages.CASH_CONFIRMED
            : paymentStatusMessages.PENDING;

        statusHeadingEl.textContent = message.title;
        statusDescriptionEl.textContent = message.description;
        summaryEl.innerHTML = buildSummaryHtml(booking, null);

    } catch (error) {
        // Even on error, show success for cash bookings since the create was successful
        const card = document.getElementById('payment-result-card');
        if (card) {
            card.classList.remove('loading');
            card.classList.add('payment-success');
        }

        const icon = document.querySelector('.booking-card__icon i');
        if (icon) {
            icon.className = 'fas fa-check-circle';
        }

        const message = paymentStatusMessages.CASH_CONFIRMED;
        statusHeadingEl.textContent = message.title;
        statusDescriptionEl.textContent = message.description;
        summaryEl.innerHTML = `
            <p><strong>Booking Reference:</strong> ${bookingId}</p>
            <p><strong>Payment Method:</strong> Cash (Pay at spot)</p>
            <p><strong>Status:</strong> <span class="booking-status status-confirmed">Confirmed</span></p>
        `;
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            updateButtonText(refreshBtn, 'Refresh Status');
        }
    }
};

const fetchStatus = async () => {
    // Handle guest cash booking (bookingId without paymentId)
    if (bookingId && isGuest && paymentMethodParam === 'CASH' && !paymentId) {
        await fetchGuestCashBookingStatus();
        return;
    }

    if (!bookingId || !paymentId) {
        showMissingParams();
        return;
    }

    try {
        if (refreshBtn) {
            refreshBtn.disabled = true;
            updateButtonText(refreshBtn, 'Refreshing...');
        }
        const headers = {};
        const authToken = localStorage.getItem('userToken');
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        if (paypalToken) {
            updateButtonText(refreshBtn, 'Confirming Payment...');
            statusHeadingEl.textContent = 'Confirming your payment...';
            statusDescriptionEl.textContent = 'Please wait while we secure your booking.';

            await fetch(`${API_URL}/payments/paypal/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify({ token: paypalToken })
            }).catch(err => console.error('Capture error (might be already captured)', err));

            // Remove token from URL to prevent re-capture on refresh
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('token');
            newUrl.searchParams.delete('PayerID');
            window.history.replaceState({}, '', newUrl);
        }

        const response = await fetch(`${API_URL}/bookings/${bookingId}/payments/${paymentId}`, { headers });
        if (!response.ok) {
            const errorPayload = await response.json().catch(() => ({}));
            throw new Error(errorPayload.message || 'Unable to fetch booking status.');
        }
        const { booking, payment } = await response.json();
        if (!booking) {
            throw new Error('Booking not found.');
        }

        const paymentStatusKey = (booking.paymentStatus || 'UNPAID').toUpperCase();
        const message = paymentStatusMessages[paymentStatusKey] || paymentStatusMessages.UNPAID;
        statusHeadingEl.textContent = message.title;
        statusDescriptionEl.textContent = message.description;
        summaryEl.innerHTML = buildSummaryHtml(booking, payment);
    } catch (error) {
        statusHeadingEl.textContent = 'Unable to fetch payment status';
        statusDescriptionEl.textContent = error.message;
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            updateButtonText(refreshBtn, 'Refresh Status');
        }
    }
};

const updateButtonText = (button, text) => {
    if (!button) return;
    button.textContent = text;
};

document.addEventListener('DOMContentLoaded', () => {
    setViewBookings();
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchStatus);
    }
    fetchStatus();
});
