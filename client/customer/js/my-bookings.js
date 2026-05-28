// File: client/customer/js/my-bookings.js

const translations = {
    en: {
        logo_slogan: 'Seamless Smart Parking, Safe & Easy',
        loading: 'Loading your bookings...',
        login_required: 'Please log in to view your bookings.',
        no_bookings_title: 'No tickets found',
        no_bookings_desc: 'You have not bought any tickets yet. Please book in advance to enjoy stress-free parking.',
        start_booking: 'Find parking spot',
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
        nav_home: 'Home',
        nav_help: 'Help & support',
        my_profile: 'Account',
        my_bookings: 'Manage my tickets',
        btn_view_qr: 'View QR',
        btn_extend: 'Extend now',
        btn_pay_now: 'Pay now',
        btn_details: 'Details',
        btn_use: 'Use ticket',
        btn_rebook: 'Re-book',
        btn_review: 'Review',
        badge_active: 'Active',
        badge_warning: 'Expiring',
        badge_expired: 'Overrun',
        badge_pending_pay: 'Unpaid',
        badge_upcoming_near: 'Due soon',
        badge_upcoming_far: 'Unused ticket',
        badge_completed: 'Completed',
        badge_cancelled: 'Cancelled',
        badge_overdue: 'Overdue',
        fee_label: 'Fee',
        total_label: 'Total',
        penalty_label: 'Penalty',
        due_label: 'Due',
        paid_label: 'Paid',
        prepaid_label: 'Prepaid',
        refund_label: 'Refunded'
    },
    vi: {
        logo_slogan: 'Bãi đỗ thông minh, an toàn và dễ dàng',
        loading: 'Đang tải danh sách đặt chỗ...',
        login_required: 'Vui lòng đăng nhập để xem danh sách đặt chỗ.',
        no_bookings_title: 'Bạn chưa mua vé nào',
        no_bookings_desc: 'Hãy đặt chỗ trước để trải nghiệm đỗ xe thảnh thơi.',
        start_booking: 'Tìm bãi đỗ',
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
        nav_home: 'Trang chủ',
        nav_help: 'Hỗ trợ & trợ giúp',
        my_profile: 'Tài khoản',
        my_bookings: 'Quản lý Vé của tôi',
        btn_view_qr: 'View QR',
        btn_extend: 'Gia hạn ngay',
        btn_pay_now: 'Thanh toán ngay',
        btn_details: 'Chi tiết',
        btn_use: 'Sử dụng',
        btn_rebook: 'Mua lại',
        btn_review: 'Đánh giá',
        badge_active: 'ĐANG DÙNG',
        badge_warning: 'SẮP HẾT GIỜ ĐỖ',
        badge_expired: 'QUÁ GIỜ ĐỖ',
        badge_pending_pay: 'CHỜ THANH TOÁN',
        badge_upcoming_near: 'SẮP ĐẾN HẠN',
        badge_upcoming_far: 'VÉ CHƯA DÙNG',
        badge_completed: 'ĐÃ DÙNG',
        badge_cancelled: 'ĐÃ HỦY',
        badge_overdue: 'VÉ QUÁ HẠN',
        fee_label: 'PHÍ',
        total_label: 'TỔNG',
        penalty_label: 'PHẠT',
        due_label: 'CẦN TRẢ',
        paid_label: 'ĐÃ TRẢ',
        prepaid_label: 'TRẢ TRƯỚC',
        refund_label: 'HOÀN TIỀN'
    }
};

let currentLang = localStorage.getItem('lang') || 'vi';
let allBookings = [];
let currentActiveTab = 'active'; // active, upcoming, past

function getTranslation(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function getUserData() {
    try {
        return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
        return null;
    }
}

function applyTranslations() {
    document.title = `${getTranslation('my_bookings')} | Parkchung`;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = getTranslation(key);
    });

    // Update active state class on language flags
    renderHeaderNav();
}

function renderHeaderNav() {
    const nav = document.getElementById('customer-nav');
    if (!nav) return;

    const userData = getUserData();
    const langFlag = currentLang === 'vi'
        ? 'https://flagcdn.com/w40/vn.png'
        : 'https://flagcdn.com/w40/gb.png';

    const langSwitcher = `
        <div class="lang-switcher" id="lang-switcher-btn">
            <img src="${langFlag}" alt="Flag" class="lang-flag" />
            <span class="lang-arrow">▼</span>
        </div>
    `;

    if (userData) {
        nav.innerHTML = `
            <a href="${window.HOST_URL || '#'}/login" class="become-host-link">
                ${currentLang === 'vi' ? 'Trở thành chủ bãi đậu xe' : 'Become a Partner'} 
                <i class="fas fa-chevron-down" style="font-size: 10px; margin-left: 2px;"></i>
            </a>
            <button class="my-account-btn" onclick="window.location.href='/customer/my-profile.html'">
                <i class="fas fa-user-circle"></i>
                <span>${userData.fullName}</span>
            </button>
            <a href="#" id="logout-btn" class="logout-link">${currentLang === 'vi' ? 'Đăng xuất' : 'Logout'}</a>
            ${langSwitcher}
        `;

        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = '/customer/index.html';
        });
    } else {
        window.location.href = '/customer/login.html';
    }

    document.getElementById('lang-switcher-btn')?.addEventListener('click', () => {
        const nextLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('lang', nextLang);
        currentLang = nextLang;
        applyTranslations();
        filterAndDisplayBookings();
    });
}

function formatDateTime(value) {
    if (!value) return getTranslation('not_available');
    const locale = currentLang === 'vi' ? 'vi-VN' : 'en-GB';
    
    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(value));
}

function formatCurrency(amount) {
    return `${Number(amount || 0).toLocaleString('vi-VN')} VNĐ`;
}

function renderLoadingState() {
    const listContainer = document.querySelector('.booking-list');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="status-container">
            <i class="fas fa-spinner fa-spin status-icon" style="color: var(--primary);"></i>
            <h2 class="status-title">${getTranslation('loading')}</h2>
        </div>
    `;
}

function renderEmptyState() {
    const listContainer = document.querySelector('.booking-list');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="status-container">
            <i class="far fa-frown status-icon"></i>
            <h2 class="status-title">${getTranslation('no_bookings_title')}</h2>
            <p class="status-desc">${getTranslation('no_bookings_desc')}</p>
            <a href="/customer/index.html" class="status-btn">
                <i class="fas fa-search"></i>
                <span>${getTranslation('start_booking')}</span>
            </a>
        </div>
    `;
}

function renderErrorState(message) {
    const listContainer = document.querySelector('.booking-list');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="status-container">
            <i class="fas fa-exclamation-triangle status-icon" style="color: #e53e3e;"></i>
            <h2 class="status-title">${getTranslation('error_loading_title')}</h2>
            <p class="status-desc">${message}</p>
            <button id="retry-btn" class="status-btn" style="background-color: #e53e3e;">
                <i class="fas fa-sync"></i>
                <span>${getTranslation('retry')}</span>
            </button>
        </div>
    `;

    document.getElementById('retry-btn')?.addEventListener('click', () => {
        window.location.reload();
    });
}

/**
 * Filter bookings and render them based on active tab
 */
function filterAndDisplayBookings() {
    const listContainer = document.querySelector('.booking-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const now = new Date();

    const categorized = {
        active: [],
        upcoming: [],
        past: []
    };

    allBookings.forEach(booking => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const status = String(booking.status || '').toLowerCase();
        const paymentStatus = String(booking.paymentStatus || '').toLowerCase();

        // 1. Past Bookings: completed, cancelled, or pending bookings that have expired
        if (status === 'completed' || status === 'cancelled' || (startTime < now && status === 'pending')) {
            categorized.past.push({ booking, cardState: getPastCardState(booking, now) });
        }
        // 2. Upcoming Bookings: future bookings which are confirmed
        else if (startTime > now && status === 'confirmed') {
            categorized.upcoming.push({ booking, cardState: getUpcomingCardState(booking, now) });
        }
        // 3. Active Bookings: currently active or unpaid/pending payment
        else {
            categorized.active.push({ booking, cardState: getActiveCardState(booking, now) });
        }
    });

    const displayList = categorized[currentActiveTab];

    if (displayList.length === 0) {
        renderEmptyState();
        return;
    }

    displayList.forEach(({ booking, cardState }) => {
        listContainer.appendChild(createTicketCard(booking, cardState));
    });
}

function getActiveCardState(booking, now) {
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const paymentStatus = String(booking.paymentStatus || '').toLowerCase();
    const status = String(booking.status || '').toLowerCase();

    // 1. Pending payment (unpaid)
    if (paymentStatus === 'pending' && status !== 'cancelled') {
        return {
            type: 'state-pending-pay',
            badge: getTranslation('badge_pending_pay'),
            icon: 'fa-wallet',
            color: '#3182ce',
            priceLabel: getTranslation('due_label'),
            buttonText: getTranslation('btn_pay_now'),
            action: 'pay'
        };
    }

    // 2. Expired / Overrun
    if (status === 'confirmed' && endTime <= now) {
        return {
            type: 'state-expired',
            badge: getTranslation('badge_expired'),
            icon: 'fa-exclamation-triangle',
            color: '#e53e3e',
            priceLabel: getTranslation('penalty_label'),
            buttonText: getTranslation('btn_pay_now'),
            action: 'pay'
        };
    }

    // 3. Warning (expiring in less than 30 mins)
    const timeLeftMs = endTime - now;
    if (status === 'confirmed' && startTime <= now && endTime > now && timeLeftMs <= 30 * 60 * 1000) {
        return {
            type: 'state-warning',
            badge: getTranslation('badge_warning'),
            icon: 'fa-hourglass-half',
            color: '#f26419',
            priceLabel: getTranslation('total_label'),
            buttonText: getTranslation('btn_extend'),
            action: 'extend'
        };
    }

    // 4. Normal active ticket
    return {
        type: 'state-active',
        badge: getTranslation('badge_active'),
        icon: 'fa-car',
        color: '#2ec988',
        priceLabel: getTranslation('fee_label'),
        buttonText: getTranslation('btn_view_qr'),
        action: 'qr'
    };
}

function getUpcomingCardState(booking, now) {
    const startTime = new Date(booking.startTime);
    const timeToStartMs = startTime - now;

    // 1. Upcoming near (within 2 hours)
    if (timeToStartMs <= 2 * 60 * 60 * 1000) {
        return {
            type: 'state-upcoming-near',
            badge: getTranslation('badge_upcoming_near'),
            icon: 'fa-calendar-alt',
            color: '#dd6b20',
            priceLabel: getTranslation('paid_label'),
            buttonText: getTranslation('btn_details'),
            action: 'details'
        };
    }

    // 2. Upcoming far (unused ticket)
    return {
        type: 'state-upcoming-far',
        badge: getTranslation('badge_upcoming_far'),
        icon: 'fa-parking',
        color: '#319795',
        priceLabel: getTranslation('prepaid_label'),
        buttonText: getTranslation('btn_use'),
        action: 'qr'
    };
}

function getPastCardState(booking, now) {
    const status = String(booking.status || '').toLowerCase();
    const startTime = new Date(booking.startTime);

    if (status === 'completed') {
        return {
            type: 'state-completed',
            badge: getTranslation('badge_completed'),
            icon: 'fa-check-circle',
            color: '#38a169',
            priceLabel: getTranslation('total_label'),
            buttonText: getTranslation('btn_review'),
            action: 'review'
        };
    }

    if (status === 'cancelled') {
        return {
            type: 'state-archived',
            badge: getTranslation('badge_cancelled'),
            icon: 'fa-times-circle',
            color: '#a0aec0',
            priceLabel: getTranslation('refund_label'),
            buttonText: getTranslation('btn_rebook'),
            action: 'rebook'
        };
    }

    // Missed / expired unpaid booking
    return {
        type: 'state-archived',
        badge: getTranslation('badge_overdue'),
        icon: 'fa-times-circle',
        color: '#a0aec0',
        priceLabel: getTranslation('total_label'),
        buttonText: getTranslation('btn_rebook'),
        action: 'rebook'
    };
}

function createTicketCard(booking, state) {
    const card = document.createElement('div');
    card.className = `ticket-card ${state.type}`;
    card.dataset.bookingId = booking._id;

    // Build vehicle representation name from DB details
    const spotName = booking.spot?.name || booking.spot?.address || getTranslation('unknown_location');
    const ticketId = `TIC-${String(booking._id).substring(String(booking._id).length - 5).toUpperCase()}`;

    card.innerHTML = `
        <div class="ticket-icon-col">
            <div class="ticket-icon-circle">
                <i class="fas ${state.icon}"></i>
            </div>
        </div>
        <div class="ticket-details-col">
            <div class="ticket-top-row">
                <span class="ticket-code">#${ticketId}</span>
                <span class="ticket-badge">${state.badge}</span>
            </div>
            <div class="ticket-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${spotName}</span>
            </div>
            <div class="ticket-info-item">
                <i class="far fa-calendar-alt"></i>
                <span>${formatDateTime(booking.startTime)} - ${formatDateTime(booking.endTime)}</span>
            </div>
        </div>
        <div class="ticket-actions-col">
            <span class="ticket-price-label">${state.priceLabel}</span>
            <span class="ticket-price-value">${formatCurrency(booking.totalPrice)}</span>
            <button class="ticket-btn" data-action="${state.action}" data-booking-id="${booking._id}">
                ${state.buttonText}
            </button>
        </div>
    `;

    const button = card.querySelector('.ticket-btn');
    if (button) {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const bId = e.target.dataset.bookingId;

            if (action === 'qr') {
                showQrCodeModal(ticketId);
            } else if (action === 'pay') {
                handlePayNow(bId);
            } else if (action === 'extend') {
                window.location.href = `/customer/index.html`; // Extend redirects to search for booking
            } else if (action === 'details') {
                window.location.href = `/customer/spot-details.html?id=${booking.spot?._id}`;
            } else if (action === 'rebook') {
                window.location.href = `/customer/index.html`;
            } else if (action === 'review') {
                window.location.href = `/customer/review?bookingId=${bId}`;
            }
        });
    }

    return card;
}

/**
 * QR Code modal triggers
 */
function showQrCodeModal(ticketCode) {
    const modal = document.getElementById('qr-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.qr-modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Mã QR Vé: #${ticketCode}`;
    }

    modal.classList.add('active');
}

function closeQrCodeModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function loadBookings() {
    const token = localStorage.getItem('userToken');

    if (!token) {
        window.location.href = '/customer/login.html';
        return;
    }

    renderLoadingState();

    try {
        const response = await fetch(`${API_URL}/bookings/mybookings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(getTranslation('failed_to_fetch'));
        }

        const bookings = await response.json();
        allBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        filterAndDisplayBookings();
    } catch (error) {
        console.error('Error loading bookings:', error);
        renderErrorState(error.message);
    }
}

async function handlePayNow(bookingId) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert(getTranslation('pay_login_required'));
        window.location.href = '/customer/login.html';
        return;
    }

    const payButton = document.querySelector(`.ticket-btn[data-booking-id="${bookingId}"]`);
    if (payButton) {
        payButton.disabled = true;
        payButton.textContent = getTranslation('processing');
    }

    try {
        const response = await fetch(`${API_URL}/payments/paypal/retry`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingId })
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

        if (payButton) {
            payButton.disabled = false;
            payButton.textContent = getTranslation('pay_now');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Tab switching event bindings
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentActiveTab = e.target.dataset.tab;
            filterAndDisplayBookings();
        });
    });

    // Close QR modal triggers
    document.getElementById('qr-close-btn')?.addEventListener('click', closeQrCodeModal);
    document.getElementById('qr-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'qr-modal') {
            closeQrCodeModal();
        }
    });

    // Sidebar support alert trigger
    document.getElementById('sidebar-help')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert(currentLang === 'vi' ? 'Hệ thống hỗ trợ 24/7 đang được hoàn thiện. Vui lòng gọi Hotline: 0903.229.906' : '24/7 Support line is currently being updated. Please call Hotline: 0903.229.906');
    });

    applyTranslations();
    await loadBookings();
});
