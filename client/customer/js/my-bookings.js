// File: client/customer/js/my-bookings.js

const translations = {
    en: {
        my_bookings: 'My Bookings',
        my_profile: 'My Profile',
        back_home: 'Back to Home',
        becomeHost: 'Host',
        welcome: 'Welcome',
        logout: 'Logout',
        logo_slogan: 'Seamless Smart Parking, Safe & Easy',
        loading: 'Loading your bookings...',
        login_required: 'Please log in to view your bookings.',
        no_bookings_title: 'No bookings found',
        no_bookings_desc: 'You have not made any bookings yet.',
        start_booking: 'Start Booking',
        error_loading_title: 'Error loading bookings',
        retry: 'Retry',
        previous: 'Previous',
        next: 'Next',
        customer: 'Customer',
        email: 'Email',
        phone: 'Phone',
        from: 'From',
        to: 'To',
        order_time: 'Order Time',
        booking_status: 'Booking Status',
        payment_method: 'Payment Method',
        payment_status: 'Payment Status',
        payment_total: 'Payment Total',
        unknown_location: 'Unknown Location',
        not_available: 'N/A',
        cancel_booking: 'Cancel Booking',
        pay_now: 'Pay Now',
        cancelling: 'Cancelling...',
        processing: 'Processing...',
        cancel_confirm: 'Are you sure you want to cancel this booking? This action cannot be undone.',
        cancel_success: 'Booking cancelled successfully!',
        cancel_failed: 'Failed to cancel booking',
        pay_login_required: 'Please log in to complete payment.',
        pay_init_failed: 'Failed to initiate payment',
        no_payment_url: 'No payment URL received',
        failed_to_fetch: 'Failed to fetch bookings',
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
        paid: 'Paid',
        refunded: 'Refunded',
        cash: 'Cash',
        paypal: 'PayPal',
    },
    vi: {
        my_bookings: 'Đặt chỗ của tôi',
        my_profile: 'Hồ sơ của tôi',
        back_home: 'Về Trang chủ',
        becomeHost: 'Đăng bãi',
        welcome: 'Xin chào',
        logout: 'Đăng xuất',
        logo_slogan: 'Bãi đỗ thông minh, an toàn và dễ dàng',
        loading: 'Đang tải danh sách đặt chỗ...',
        login_required: 'Vui lòng đăng nhập để xem danh sách đặt chỗ.',
        no_bookings_title: 'Chưa có đặt chỗ nào',
        no_bookings_desc: 'Bạn chưa thực hiện đặt chỗ nào.',
        start_booking: 'Bắt đầu đặt chỗ',
        error_loading_title: 'Lỗi khi tải danh sách đặt chỗ',
        retry: 'Thử lại',
        previous: 'Trước',
        next: 'Tiếp',
        customer: 'Khách hàng',
        email: 'Email',
        phone: 'Số điện thoại',
        from: 'Từ',
        to: 'Đến',
        order_time: 'Thời gian đặt',
        booking_status: 'Trạng thái đặt chỗ',
        payment_method: 'Phương thức thanh toán',
        payment_status: 'Trạng thái thanh toán',
        payment_total: 'Tổng thanh toán',
        unknown_location: 'Chưa có địa điểm',
        not_available: 'Không có',
        cancel_booking: 'Hủy đặt chỗ',
        pay_now: 'Thanh toán ngay',
        cancelling: 'Đang hủy...',
        processing: 'Đang xử lý...',
        cancel_confirm: 'Bạn có chắc muốn hủy đặt chỗ này không? Hành động này không thể hoàn tác.',
        cancel_success: 'Hủy đặt chỗ thành công!',
        cancel_failed: 'Không thể hủy đặt chỗ',
        pay_login_required: 'Vui lòng đăng nhập để thanh toán.',
        pay_init_failed: 'Không thể khởi tạo thanh toán',
        no_payment_url: 'Không nhận được đường dẫn thanh toán',
        failed_to_fetch: 'Không thể tải danh sách đặt chỗ',
        confirmed: 'Đã xác nhận',
        pending: 'Đang chờ',
        cancelled: 'Đã hủy',
        completed: 'Hoàn thành',
        paid: 'Đã thanh toán',
        refunded: 'Đã hoàn tiền',
        cash: 'Tiền mặt',
        paypal: 'PayPal',
    },
};

let currentLang = localStorage.getItem('lang') || 'vi';
let allBookings = [];
let currentPage = 1;
let pageState = 'loading';
let lastErrorMessage = '';
const bookingsPerPage = 3;

function getTranslation(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function getDateLocale() {
    return currentLang === 'vi' ? 'vi-VN' : 'en-GB';
}

function getUserDisplayName() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || 'null');
        return userData?.fullName?.trim() || '';
    } catch (error) {
        console.warn('Unable to read userData from localStorage:', error);
        return '';
    }
}

function applyTranslations() {
    document.title = `${getTranslation('my_bookings')} | Parkchung`;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getTranslation(key);
    });

    const welcomeElement = document.getElementById('user-welcome');
    if (welcomeElement) {
        const fullName = getUserDisplayName();
        welcomeElement.textContent = fullName
            ? `${getTranslation('welcome')}, ${fullName}!`
            : getTranslation('welcome');
    }

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

function formatDateTime(value) {
    if (!value) {
        return getTranslation('not_available');
    }

    return new Intl.DateTimeFormat(getDateLocale(), {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value));
}

function formatCurrency(amount) {
    return `${Number(amount || 0).toLocaleString('vi-VN')} VND`;
}

function getBookingStatusLabel(status) {
    const normalizedStatus = String(status || '').toLowerCase();
    return getTranslation(normalizedStatus) || status || getTranslation('not_available');
}

function getPaymentStatusLabel(status) {
    const normalizedStatus = String(status || '').toLowerCase();
    return getTranslation(normalizedStatus) || status || getTranslation('not_available');
}

function getPaymentMethodLabel(method) {
    const normalizedMethod = String(method || '').toLowerCase();

    if (normalizedMethod === 'cash') {
        return getTranslation('cash');
    }

    if (normalizedMethod === 'paypal') {
        return getTranslation('paypal');
    }

    return method || getTranslation('not_available');
}

function renderLoadingState() {
    const bookingListContainer = document.querySelector('.booking-list');
    if (!bookingListContainer) return;

    pageState = 'loading';
    bookingListContainer.innerHTML = `<p style="text-align: center; color: white; font-size: 18px;">${getTranslation('loading')}</p>`;
}

function renderEmptyState() {
    const bookingListContainer = document.querySelector('.booking-list');
    if (!bookingListContainer) return;

    pageState = 'empty';
    bookingListContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">${getTranslation('no_bookings_title')}</h2>
            <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 30px;">${getTranslation('no_bookings_desc')}</p>
            <a href="index.html" style="display: inline-block; padding: 12px 28px; background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50px; text-decoration: none; font-weight: 600;">${getTranslation('start_booking')}</a>
        </div>
    `;
}

function renderErrorState(errorMessage = '') {
    const bookingListContainer = document.querySelector('.booking-list');
    if (!bookingListContainer) return;

    pageState = 'error';
    lastErrorMessage = errorMessage;
    bookingListContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: white; font-size: 24px; margin-bottom: 20px;">${getTranslation('error_loading_title')}</h2>
            <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 30px;">${errorMessage}</p>
            <button id="retry-bookings-btn" type="button" style="padding: 12px 28px; background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50px; font-weight: 600; cursor: pointer;">${getTranslation('retry')}</button>
        </div>
    `;

    document.getElementById('retry-bookings-btn')?.addEventListener('click', () => {
        window.location.reload();
    });
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    currentLang = lang;
    applyTranslations();

    if (pageState === 'list') {
        displayBookings();
        return;
    }

    if (pageState === 'empty') {
        renderEmptyState();
        return;
    }

    if (pageState === 'error') {
        renderErrorState(lastErrorMessage);
        return;
    }

    renderLoadingState();
}

function displayBookings() {
    const bookingListContainer = document.querySelector('.booking-list');
    if (!bookingListContainer) return;

    pageState = 'list';
    bookingListContainer.innerHTML = '';

    const totalPages = Math.ceil(allBookings.length / bookingsPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const startIndex = (currentPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    const bookingsToDisplay = allBookings.slice(startIndex, endIndex);

    bookingsToDisplay.forEach((booking) => {
        bookingListContainer.appendChild(createBookingCard(booking));
    });

    if (totalPages > 1) {
        bookingListContainer.appendChild(createPaginationControls(totalPages));
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

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = `← ${getTranslation('previous')}`;
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
        if (currentPage === 1) return;
        currentPage -= 1;
        displayBookings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.style.cssText = `
        display: flex;
        gap: 8px;
        align-items: center;
    `;

    for (let i = 1; i <= totalPages; i += 1) {
        const pageButton = document.createElement('button');
        pageButton.type = 'button';
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
        pageNumbersDiv.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = `${getTranslation('next')} →`;
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
        if (currentPage === totalPages) return;
        currentPage += 1;
        displayBookings();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageNumbersDiv);
    paginationDiv.appendChild(nextButton);
    return paginationDiv;
}

function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.dataset.bookingId = booking._id;

    const canCancel = booking.status?.toLowerCase() === 'confirmed' && new Date(booking.startTime) > new Date();
    const paymentStatus = String(booking.paymentStatus || '').toLowerCase();
    const shouldShowPayNow = paymentStatus === 'pending' && booking.status?.toLowerCase() !== 'cancelled';

    const getBadgeStyle = (status) => {
        switch (String(status || '').toLowerCase()) {
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

    const getPaymentBadgeStyle = (status) => {
        switch (String(status || '').toLowerCase()) {
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

    card.innerHTML = `
        <div class="card-icon-col">
            <div class="parking-icon">P</div>
        </div>
        <div class="card-details-col">
            <h2 class="parking-name">${booking.spot?.address || getTranslation('unknown_location')}</h2>
            <div class="details-grid">
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('customer')}:</span>
                    <span class="detail-value">${booking.user?.fullName || booking.guestFullName || getTranslation('not_available')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('email')}:</span>
                    <span class="detail-value">${booking.user?.email || booking.guestEmail || getTranslation('not_available')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('phone')}:</span>
                    <span class="detail-value">${booking.phoneNumber || booking.guestPhoneNumber || getTranslation('not_available')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('from')}:</span>
                    <span class="detail-value">${formatDateTime(booking.startTime)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('to')}:</span>
                    <span class="detail-value">${formatDateTime(booking.endTime)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('order_time')}:</span>
                    <span class="detail-value">${formatDateTime(booking.createdAt)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('booking_status')}:</span>
                    <span class="detail-value">
                        <span class="badge" style="${getBadgeStyle(booking.status)}">${getBookingStatusLabel(booking.status)}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('payment_method')}:</span>
                    <span class="detail-value">${getPaymentMethodLabel(booking.paymentMethod)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('payment_status')}:</span>
                    <span class="detail-value">
                        <span class="badge" style="${getPaymentBadgeStyle(booking.paymentStatus)}">${getPaymentStatusLabel(booking.paymentStatus)}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">${getTranslation('payment_total')}:</span>
                    <span class="detail-value">${formatCurrency(booking.totalPrice)}</span>
                </div>
                ${canCancel ? `
                <div class="detail-row" style="margin-top: 15px; border-top: 2px solid rgba(0,0,0,0.1); padding-top: 15px;">
                    <button class="cancel-booking-btn" data-booking-id="${booking._id}" type="button" style="
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
                        ${getTranslation('cancel_booking')}
                    </button>
                </div>
                ` : ''}
                ${shouldShowPayNow ? `
                <div class="detail-row" style="margin-top: 15px; border-top: 2px solid rgba(0,0,0,0.1); padding-top: 15px;">
                    <button class="pay-now-btn" data-booking-id="${booking._id}" type="button" style="
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
                        ${getTranslation('pay_now')}
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    card.querySelector('.cancel-booking-btn')?.addEventListener('click', () => handleCancelBooking(booking._id));
    card.querySelector('.pay-now-btn')?.addEventListener('click', () => handlePayNow(booking._id));
    return card;
}

async function loadBookings() {
    const token = localStorage.getItem('userToken');

    if (!token) {
        alert(getTranslation('login_required'));
        window.location.href = 'login.html';
        return;
    }

    renderLoadingState();

    try {
        const response = await fetch(`${API_URL}/bookings/mybookings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(getTranslation('failed_to_fetch'));
        }

        const bookings = await response.json();
        allBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (allBookings.length === 0) {
            renderEmptyState();
            return;
        }

        displayBookings();
    } catch (error) {
        console.error('Error loading bookings:', error);
        renderErrorState(error.message);
    }
}

async function handleCancelBooking(bookingId) {
    const confirmed = window.confirm(getTranslation('cancel_confirm'));
    if (!confirmed) return;

    const token = localStorage.getItem('userToken');
    const cancelButton = document.querySelector(`.cancel-booking-btn[data-booking-id="${bookingId}"]`);

    if (cancelButton) {
        cancelButton.disabled = true;
        cancelButton.textContent = getTranslation('cancelling');
    }

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || getTranslation('cancel_failed'));
        }

        alert(getTranslation('cancel_success'));
        await loadBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(`${getTranslation('cancel_failed')}: ${error.message}`);

        if (cancelButton) {
            cancelButton.disabled = false;
            cancelButton.textContent = getTranslation('cancel_booking');
        }
    }
}

async function handlePayNow(bookingId) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert(getTranslation('pay_login_required'));
        window.location.href = 'login.html';
        return;
    }

    const payNowButton = document.querySelector(`.pay-now-btn[data-booking-id="${bookingId}"]`);

    if (payNowButton) {
        payNowButton.disabled = true;
        payNowButton.textContent = getTranslation('processing');
    }

    try {
        const response = await fetch(`${API_URL}/payments/paypal/retry`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || getTranslation('pay_init_failed'));
        }

        const data = await response.json();
        if (!data.redirectUrl) {
            throw new Error(getTranslation('no_payment_url'));
        }

        window.open(data.redirectUrl, '_blank');
    } catch (error) {
        console.error('Error initiating payment:', error);
        alert(`${getTranslation('pay_init_failed')}: ${error.message}`);

        if (payNowButton) {
            payNowButton.disabled = false;
            payNowButton.textContent = getTranslation('pay_now');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const hostLink = document.getElementById('host-link');
    if (hostLink && window.HOST_URL) {
        hostLink.href = `${window.HOST_URL}/login`;
    }

    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-vi')?.addEventListener('click', () => setLanguage('vi'));

    applyTranslations();
    await loadBookings();
});
