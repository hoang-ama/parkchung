// File: client/customer/js/my-bookings.js

document.addEventListener('DOMContentLoaded', async () => {
    const bookingListContainer = document.querySelector('.booking-list');
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert('Please login to view your bookings');
        window.location.href = 'login.html';
        return;
    }

    // Show loading state
    bookingListContainer.innerHTML = '<p style="text-align: center; color: white; font-size: 18px;">Loading your bookings...</p>';

    try {
        // Fetch user's bookings
        const response = await fetch(`${API_URL}/bookings/mybookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const bookings = await response.json();

        if (bookings.length === 0) {
            bookingListContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">No bookings found</h2>
                    <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 30px;">You haven't made any bookings yet.</p>
                    <a href="index.html" style="display: inline-block; padding: 12px 28px; background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50px; text-decoration: none; font-weight: 600;">Start Booking</a>
                </div>
            `;
            return;
        }

        // Display bookings
        bookingListContainer.innerHTML = '';
        bookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            bookingListContainer.appendChild(bookingCard);
        });

    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingListContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">Error loading bookings</h2>
                <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 30px;">${error.message}</p>
                <button onclick="location.reload()" style="padding: 12px 28px; background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50px; font-weight: 600; cursor: pointer;">Retry</button>
            </div>
        `;
    }
});

function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.dataset.bookingId = booking._id;

    // Format dates
    const startDate = new Date(booking.startTime).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const endDate = new Date(booking.endTime).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const orderDate = new Date(booking.createdAt).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Get badge color based on status
    const getBadgeStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'background: linear-gradient(135deg, #13b47e 0%, #1f6f35 100%);';
            case 'cancelled':
                return 'background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);';
            case 'completed':
                return 'background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);';
            default:
                return 'background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);';
        }
    };

    // Get payment status badge style
    const getPaymentBadgeStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'background: linear-gradient(135deg, #13b47e 0%, #1f6f35 100%);';
            case 'pending':
                return 'background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);';
            case 'refunded':
                return 'background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);';
            default:
                return 'background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);';
        }
    };

    // Determine if cancel button should be shown
    const canCancel = booking.status.toLowerCase() === 'confirmed' && new Date(booking.startTime) > new Date();

    card.innerHTML = `
        <div class="card-icon-col">
            <div class="parking-icon">P</div>
        </div>
        <div class="card-details-col">
            <h2 class="parking-name">${booking.spot?.address || 'Unknown Location'}</h2>
            <div class="details-grid">
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${booking.user?.fullName || booking.guestFullName || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${booking.user?.email || booking.guestEmail || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${booking.phoneNumber || booking.guestPhoneNumber || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">From:</span>
                    <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">To:</span>
                    <span class="detail-value">${endDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Time:</span>
                    <span class="detail-value">${orderDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Status:</span>
                    <span class="detail-value">
                        <span class="badge" style="${getBadgeStyle(booking.status)}">${booking.status}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${booking.paymentMethod || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Status:</span>
                    <span class="detail-value">
                        <span class="badge" style="${getPaymentBadgeStyle(booking.paymentStatus)}">${booking.paymentStatus}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Total:</span>
                    <span class="detail-value">${booking.totalPrice?.toLocaleString('vi-VN')} VND</span>
                </div>
                ${canCancel ? `
                <div class="detail-row" style="margin-top: 15px; border-top: 2px solid rgba(0,0,0,0.1); padding-top: 15px;">
                    <button class="cancel-booking-btn" data-booking-id="${booking._id}" style="
                        width: 100%;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                    ">
                        Cancel Booking
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add cancel button event listener
    if (canCancel) {
        const cancelBtn = card.querySelector('.cancel-booking-btn');
        cancelBtn.addEventListener('click', () => handleCancelBooking(booking._id));
        cancelBtn.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.4)';
        });
        cancelBtn.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
        });
    }

    return card;
}

async function handleCancelBooking(bookingId) {
    const confirmed = confirm('Are you sure you want to cancel this booking? This action cannot be undone.');

    if (!confirmed) return;

    const token = localStorage.getItem('userToken');
    const cancelBtn = document.querySelector(`[data-booking-id="${bookingId}"]`);

    if (cancelBtn) {
        cancelBtn.disabled = true;
        cancelBtn.textContent = 'Cancelling...';
    }

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to cancel booking');
        }

        alert('Booking cancelled successfully!');
        // Reload the page to show updated bookings
        location.reload();

    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(`Failed to cancel booking: ${error.message}`);

        if (cancelBtn) {
            cancelBtn.disabled = false;
            cancelBtn.textContent = 'Cancel Booking';
        }
    }
}
