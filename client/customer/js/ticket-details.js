// File: client/customer/js/ticket-details.js

const translations = {
    en: {
        logo_slogan: 'Seamless Smart Parking, Safe & Easy',
        loading: 'Loading ticket details...',
        login_required: 'Please log in to view your ticket details.',
        error_loading_title: 'Error loading ticket details',
        retry: 'Retry',
        not_available: 'N/A',
        cancel_booking: 'Cancel Booking',
        cancelling: 'Cancelling...',
        cancel_confirm: 'Are you sure you want to cancel this booking? This action cannot be undone.',
        cancel_success: 'Booking cancelled successfully!',
        cancel_failed: 'Failed to cancel booking',
        nav_home: 'Home',
        nav_help: 'Help & support',
        my_profile: 'Account',
        my_bookings: 'Manage my tickets',
        status_upcoming: 'Not started',
        status_active: 'Parking',
        status_completed: 'Used',
        status_cancelled: 'Cancelled',
        btn_cancel: 'Cancel Booking',
        btn_directions: 'Directions',
        btn_review: 'Review',
        btn_rebook: 'Re-book',
        label_total: 'Total Price',
        label_time: 'Parking Time',
        label_plate: 'License Plate'
    },
    vi: {
        logo_slogan: 'Bãi đỗ thông minh, an toàn và dễ dàng',
        loading: 'Đang tải chi tiết vé...',
        login_required: 'Vui lòng đăng nhập để xem chi tiết vé.',
        error_loading_title: 'Lỗi khi tải chi tiết vé',
        retry: 'Thử lại',
        not_available: 'Không có',
        cancel_booking: 'Hủy đặt chỗ',
        cancelling: 'Đang hủy...',
        cancel_confirm: 'Bạn có chắc muốn hủy đặt chỗ này không? Hành động này không thể hoàn tác.',
        cancel_success: 'Hủy đặt chỗ thành công!',
        cancel_failed: 'Không thể hủy đặt chỗ',
        nav_home: 'Trang chủ',
        nav_help: 'Hỗ trợ & trợ giúp',
        my_profile: 'Tài khoản',
        my_bookings: 'Quản lý Vé của tôi',
        status_upcoming: 'Chưa bắt đầu',
        status_active: 'Đang đỗ',
        status_completed: 'Đã sử dụng',
        status_cancelled: 'Đã hủy',
        btn_cancel: 'Hủy đặt chỗ',
        btn_directions: 'Chỉ đường',
        btn_review: 'Đánh giá',
        btn_rebook: 'Mua lại',
        label_total: 'Tổng tiền',
        label_time: 'Thời gian đỗ',
        label_plate: 'Biển số xe'
    }
};

let currentLang = localStorage.getItem('lang') || 'vi';
let bookingData = null;
let miniMap = null;

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
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = getTranslation(key);
    });
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
            <button class="my-account-btn" onclick="window.location.href='my-profile.html'">
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
            window.location.href = 'index.html';
        });
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById('lang-switcher-btn')?.addEventListener('click', () => {
        const nextLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('lang', nextLang);
        currentLang = nextLang;
        applyTranslations();
        if (bookingData) {
            renderTicketUI(bookingData);
        }
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

/**
 * Deterministically generates parking slot coordinates based on the booking ID string.
 * This guarantees the user sees the same parking spot slot code and area every time they refresh.
 */
function getDeterministicSlotPosition(bookingId) {
    if (!bookingId) {
        return { building: 'Tòa nhà A', floor: 'Hầm B1', slot: 'A-10' };
    }

    let hash = 0;
    for (let i = 0; i < bookingId.length; i++) {
        hash = bookingId.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const buildings = ['Tòa nhà A', 'Tòa nhà B', 'Khu vực Đông', 'Khu vực Tây'];
    const floors = ['Hầm B1', 'Hầm B2', 'Tầng G', 'Tầng 1'];
    
    const building = buildings[hash % buildings.length];
    const floor = floors[(hash >> 2) % floors.length];
    
    const zones = ['A', 'B', 'C', 'D', 'E'];
    const zone = zones[(hash >> 4) % zones.length];
    const slotNum = (hash % 20) + 1; // 1 to 20
    const slot = `Vị trí ${zone}-${slotNum.toString().padStart(2, '0')}`;

    return { building, floor, slot };
}

/**
 * Loads ticket details via API
 */
async function loadTicketDetails() {
    const token = localStorage.getItem('userToken');
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('id');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (!bookingId) {
        window.location.href = 'my-bookings.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(getTranslation('error_loading_title'));
        }

        const data = await response.json();
        bookingData = data.booking;

        // Hide loading state
        document.getElementById('loading-state').style.display = 'none';
        
        // Show ticket UI
        document.getElementById('ticket-card-ui').style.display = 'flex';

        // Render ticket details
        renderTicketUI(bookingData);
        
        // Render leaflet map
        initMiniMap(bookingData);

    } catch (error) {
        console.error('Error loading ticket details:', error);
        document.getElementById('loading-state').innerHTML = `
            <div style="color: #e53e3e; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 12px;"></i>
                <h3 style="font-weight: 700;">${getTranslation('error_loading_title')}</h3>
                <p style="font-size: 14px; margin-top: 6px; color: #718096;">${error.message}</p>
                <button onclick="window.location.reload();" class="my-account-btn" style="background:#e53e3e; margin-top: 16px; box-shadow:none;">
                    <i class="fas fa-sync" style="margin-right: 6px;"></i> ${getTranslation('retry')}
                </button>
            </div>
        `;
    }
}

/**
 * Renders HTML elements with ticket data
 */
function renderTicketUI(booking) {
    const ticketId = `TIC-${String(booking._id).substring(String(booking._id).length - 5).toUpperCase()}`;
    const spotName = booking.spot?.name || booking.spot?.address || getTranslation('not_available');
    
    // Set titles
    document.getElementById('ticket-title').innerHTML = `Chi tiết vé <span>#${ticketId}</span>`;
    document.getElementById('ticket-stub-code').textContent = `#${ticketId}`;
    
    // Set details
    document.getElementById('ticket-spot-name').textContent = spotName;
    document.getElementById('ticket-time-range').textContent = `${formatDateTime(booking.startTime)} - ${formatDateTime(booking.endTime)}`;
    document.getElementById('ticket-total-price').textContent = formatCurrency(booking.totalPrice);
    
    // License plate display if available
    const plateBlock = document.getElementById('ticket-car-plate-block');
    const plateVal = document.getElementById('ticket-car-plate');
    if (booking.vehicleRegistration) {
        plateBlock.style.display = 'flex';
        plateVal.textContent = booking.vehicleRegistration;
    } else {
        plateBlock.style.display = 'none';
    }

    // Generate dynamic QR Code using dynamic api qrserver
    const qrImg = document.getElementById('ticket-qr-img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(booking._id)}&color=2DC989`;

    // Parse deterministic slot locations (Building/Floor/Slot)
    const slotPos = getDeterministicSlotPosition(booking._id);
    document.getElementById('ticket-pos-building').textContent = slotPos.building;
    document.getElementById('ticket-pos-floor').textContent = slotPos.floor;
    document.getElementById('ticket-pos-slot').textContent = slotPos.slot;

    // Calculate current ticket status
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const status = String(booking.status || '').toLowerCase();

    const statusBadge = document.getElementById('ticket-status-badge');
    const qrOverlay = document.getElementById('qr-used-overlay');
    const btnPrimary = document.getElementById('btn-primary-action');
    const btnSecondary = document.getElementById('btn-secondary-action');

    // Remove old classes
    statusBadge.className = 'status-badge-header';
    qrOverlay.classList.remove('show');
    btnPrimary.disabled = false;
    btnSecondary.style.display = 'flex';

    if (status === 'cancelled') {
        // --- 1. CANCELLED ---
        statusBadge.textContent = getTranslation('status_cancelled');
        statusBadge.classList.add('state-cancelled');
        qrOverlay.classList.add('show');
        qrOverlay.querySelector('.qr-used-badge').textContent = currentLang === 'vi' ? 'ĐÃ HỦY' : 'CANCELLED';
        qrOverlay.querySelector('.qr-used-badge').style.background = '#e53e3e';
        
        btnPrimary.textContent = getTranslation('btn_rebook');
        btnPrimary.className = 'action-btn action-btn-primary';
        btnPrimary.onclick = () => window.location.href = 'index.html';
        
        btnSecondary.style.display = 'none';
    } 
    else if (status === 'completed' || endTime <= now) {
        // --- 2. COMPLETED / USED ---
        statusBadge.textContent = getTranslation('status_completed');
        statusBadge.classList.add('state-completed');
        qrOverlay.classList.add('show');
        qrOverlay.querySelector('.qr-used-badge').textContent = currentLang === 'vi' ? 'ĐÃ SỬ DỤNG' : 'USED';
        qrOverlay.querySelector('.qr-used-badge').style.background = '#718096';
        
        btnPrimary.textContent = getTranslation('btn_review');
        btnPrimary.className = 'action-btn action-btn-primary';
        btnPrimary.onclick = () => window.location.href = `review.html?bookingId=${booking._id}`;
        
        btnSecondary.textContent = getTranslation('btn_rebook');
        btnSecondary.className = 'action-btn action-btn-secondary';
        btnSecondary.onclick = () => window.location.href = 'index.html';
    } 
    else if (startTime <= now && endTime > now) {
        // --- 3. ACTIVE / PARKING ---
        statusBadge.textContent = getTranslation('status_active');
        statusBadge.classList.add('state-active');
        
        btnPrimary.textContent = getTranslation('btn_cancel');
        btnPrimary.className = 'action-btn action-btn-primary';
        // Confirmed active tickets cannot be cancelled on spot
        btnPrimary.disabled = true; 
        
        btnSecondary.textContent = getTranslation('btn_directions');
        btnSecondary.className = 'action-btn action-btn-secondary';
        btnSecondary.onclick = () => openGoogleMapDirections(booking);
    } 
    else {
        // --- 4. UPCOMING / NOT STARTED ---
        statusBadge.textContent = getTranslation('status_upcoming');
        statusBadge.classList.add('state-upcoming');
        
        btnPrimary.textContent = getTranslation('btn_cancel');
        btnPrimary.className = 'action-btn action-btn-primary';
        btnPrimary.onclick = () => handleCancelBooking(booking._id);
        
        btnSecondary.textContent = getTranslation('btn_directions');
        btnSecondary.className = 'action-btn action-btn-secondary';
        btnSecondary.onclick = () => openGoogleMapDirections(booking);
    }
}

/**
 * Initializes leaflet mini map
 */
function initMiniMap(booking) {
    if (miniMap) return; // Already initialized

    if (!booking.spot || !booking.spot.location || !booking.spot.location.coordinates) {
        document.querySelector('.mini-map-wrapper').style.display = 'none';
        return;
    }

    // Mongo GeoJSON: [longitude, latitude]. Leaflet: [latitude, longitude]
    const [lng, lat] = booking.spot.location.coordinates;

    miniMap = L.map('leaflet-mini-map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(miniMap);

    const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon: greenIcon }).addTo(miniMap);
}

/**
 * Opens Google Maps directions in new tab
 */
function openGoogleMapDirections(booking) {
    if (!booking.spot || !booking.spot.location || !booking.spot.location.coordinates) return;
    const [lng, lat] = booking.spot.location.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
}

/**
 * Invokes cancel API on backend
 */
async function handleCancelBooking(bookingId) {
    const token = localStorage.getItem('userToken');
    const confirmMsg = getTranslation('cancel_confirm');
    
    if (!confirm(confirmMsg)) return;

    const btnPrimary = document.getElementById('btn-primary-action');
    btnPrimary.disabled = true;
    btnPrimary.textContent = getTranslation('cancelling');

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || getTranslation('cancel_failed'));
        }

        alert(getTranslation('cancel_success'));
        window.location.reload();

    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(error.message);
        btnPrimary.disabled = false;
        btnPrimary.textContent = getTranslation('btn_cancel');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Sidebar support Hotline trigger
    document.getElementById('sidebar-help')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert(currentLang === 'vi' ? 'Hỗ trợ 24/7 Hotline: 0903.229.906' : '24/7 Support line Hotline: 0903.229.906');
    });

    applyTranslations();
    await loadTicketDetails();
});
