// File: client/customer/js/my-bookings.js

// Translations for my-bookings page
const translations = {
    en: {
        my_bookings: 'My Bookings',
        back_home: 'Back to Home',
        becomeHost: 'Host',
        logout: 'Logout',
        loading: 'Loading your bookings...',
        no_bookings: 'No bookings found. Start exploring parking spots!',
        explore_spots: 'Explore Spots',
        booking_confirmed: 'Confirmed',
        booking_pending: 'Pending',
        booking_cancelled: 'Cancelled',
        booking_completed: 'Completed',
        arrival: 'Arrival',
        departure: 'Departure',
        duration: 'Duration',
        total: 'Total',
        hours: 'hours',
        view_details: 'View Details',
        cancel_booking: 'Cancel Booking'
    },
    vi: {
        my_bookings: 'Đặt chỗ của tôi',
        back_home: 'Về Trang chủ',
        becomeHost: 'Đăng bãi',
        logout: 'Đăng xuất',
        loading: 'Đang tải danh sách đặt chỗ...',
        no_bookings: 'Không có đặt chỗ nào. Bắt đầu khám phá các bãi đỗ xe!',
        explore_spots: 'Khám phá Bãi đỗ',
        booking_confirmed: 'Đã xác nhận',
        booking_pending: 'Đang chờ',
        booking_cancelled: 'Đã hủy',
        booking_completed: 'Hoàn thành',
        arrival: 'Đến',
        departure: 'Rời đi',
        duration: 'Thời lượng',
        total: 'Tổng cộng',
        hours: 'giờ',
        view_details: 'Xem chi tiết',
        cancel_booking: 'Hủy đặt chỗ'
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function getTranslation(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function applyTranslations() {
    const t = translations[currentLang] || translations.en;

    // Apply data-i18n translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // Update language button styles
    const langEnBtn = document.getElementById('lang-en');
    const langViBtn = document.getElementById('lang-vi');
    if (langEnBtn) {
        langEnBtn.style.color = currentLang === 'en' ? '#13b47e' : '#555';
        langEnBtn.style.fontWeight = currentLang === 'en' ? '700' : '500';
    }
    if (langViBtn) {
        langViBtn.style.color = currentLang === 'vi' ? '#13b47e' : '#555';
        langViBtn.style.fontWeight = currentLang === 'vi' ? '700' : '500';
    }
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    currentLang = lang;
    applyTranslations();
    // Re-render bookings with new language
    if (allBookings.length > 0) {
        renderBookings(allBookings);
    }
}

// Pagination state
let allBookings = [];
let currentPage = 1;
const bookingsPerPage = 3;

document.addEventListener('DOMContentLoaded', async () => {
    const bookingListContainer = document.querySelector('.booking-list');
    const token = localStorage.getItem('userToken');

    // Set Host Portal link from config
    const hostLink = document.getElementById('host-link');
    if (hostLink && window.HOST_URL) {
        hostLink.href = window.HOST_URL + '/login';
    }

    // Setup language switcher
    const langEnBtn = document.getElementById('lang-en');
    const langViBtn = document.getElementById('lang-vi');
    if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
    if (langViBtn) langViBtn.addEventListener('click', () => setLanguage('vi'));

    // Apply initial translations
    applyTranslations();

    if (!token) {
        alert('Please login to view your bookings');
        window.location.href = 'login.html';
        return;
    }

    // Show loading state
    bookingListContainer.innerHTML = `<p style="text-align: center; color: white; font-size: 18px;">${getTranslation('loading')}</p>`;

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

        // Sort bookings by createdAt date (newest first)
        allBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Display first page
        displayBookings();

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

function displayBookings() {
    const bookingListContainer = document.querySelector('.booking-list');
    bookingListContainer.innerHTML = '';

    // Calculate pagination
    const totalPages = Math.ceil(allBookings.length / bookingsPerPage);
    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    const bookingsToDisplay = allBookings.slice(startIndex, endIndex);

    // Display bookings for current page
    bookingsToDisplay.forEach(booking => {
        const bookingCard = createBookingCard(booking);
        bookingListContainer.appendChild(bookingCard);
    });

    // Add pagination controls
    if (totalPages > 1) {
        const paginationContainer = createPaginationControls(totalPages);
        bookingListContainer.appendChild(paginationContainer);
    }
}

function createPaginationControls(totalPages) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-controls';
    paginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 40px;
        padding: 20px;
    `;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.style.cssText = `
        padding: 12px 24px;
        background: ${currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
        transition: all 0.3s ease;
        opacity: ${currentPage === 1 ? '0.5' : '1'};
    `;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayBookings();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    if (currentPage > 1) {
        prevButton.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
        });
        prevButton.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
        });
    }

    // Page numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.style.cssText = `
        display: flex;
        gap: 8px;
        align-items: center;
    `;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.style.cssText = `
            width: 40px;
            height: 40px;
            padding: 8px;
            background: ${i === currentPage ? 'linear-gradient(135deg, #13b47e 0%, #1f6f35 100%)' : 'rgba(255, 255, 255, 0.2)'};
            color: white;
            border: 2px solid ${i === currentPage ? '#13b47e' : 'rgba(255, 255, 255, 0.3)'};
            border-radius: 50%;
            font-weight: ${i === currentPage ? '700' : '600'};
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: ${i === currentPage ? '0 4px 15px rgba(19, 180, 126, 0.3)' : 'none'};
        `;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBookings();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        if (i !== currentPage) {
            pageButton.addEventListener('mouseenter', (e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.1)';
            });
            pageButton.addEventListener('mouseleave', (e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
            });
        }
        pageNumbersDiv.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.style.cssText = `
        padding: 12px 24px;
        background: ${currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
        transition: all 0.3s ease;
        opacity: ${currentPage === totalPages ? '0.5' : '1'};
    `;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayBookings();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    if (currentPage < totalPages) {
        nextButton.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
        });
        nextButton.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(0)';
        });
    }

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageNumbersDiv);
    paginationDiv.appendChild(nextButton);

    return paginationDiv;
}

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
                ${booking.paymentStatus.toLowerCase() === 'pending' ? `
                <div class="detail-row" style="margin-top: 15px; border-top: 2px solid rgba(0,0,0,0.1); padding-top: 15px;">
                    <button class="pay-now-btn" data-booking-id="${booking._id}" style="
                        width: 100%;
                        padding: 12px 24px;
                        background: linear-gradient(135deg, #13b47e 0%, #1f6f35 100%);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(19, 180, 126, 0.3);
                    ">
                        Pay Now
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

    // Add pay now button event listener
    const payNowBtn = card.querySelector('.pay-now-btn');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => handlePayNow(booking._id));
        payNowBtn.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(19, 180, 126, 0.4)';
        });
        payNowBtn.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(19, 180, 126, 0.3)';
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

        // Reload bookings data and refresh the current page
        const bookingsResponse = await fetch(`${API_URL}/bookings/mybookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();
            allBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Adjust current page if needed (in case we deleted the last item on a page)
            const totalPages = Math.ceil(allBookings.length / bookingsPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }

            displayBookings();
        } else {
            location.reload();
        }

    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(`Failed to cancel booking: ${error.message}`);

        if (cancelBtn) {
            cancelBtn.disabled = false;
            cancelBtn.textContent = 'Cancel Booking';
        }
    }
}

async function handlePayNow(bookingId) {
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert('Please login to complete payment');
        window.location.href = 'login.html';
        return;
    }

    const payNowBtn = document.querySelector(`[data-booking-id="${bookingId}"].pay-now-btn`);

    if (payNowBtn) {
        payNowBtn.disabled = true;
        payNowBtn.textContent = 'Processing...';
    }

    try {
        const response = await fetch(`${API_URL}/payments/paypal/retry`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to initiate payment');
        }

        const data = await response.json();

        // Redirect to PayPal checkout
        if (data.redirectUrl) {
            window.open(data.redirectUrl, '_blank');
        } else {
            throw new Error('No payment URL received');
        }

    } catch (error) {
        console.error('Error initiating payment:', error);
        alert(`Failed to initiate payment: ${error.message}`);

        if (payNowBtn) {
            payNowBtn.disabled = false;
            payNowBtn.textContent = 'Pay Now';
        }
    }
}
