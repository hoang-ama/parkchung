// File: client/customer/js/payment-result.js

const statusHeadingEl = document.getElementById('payment-status-heading');
const statusDescriptionEl = document.getElementById('payment-status-description');
const summaryEl = document.getElementById('payment-booking-summary');
const refreshBtn = document.getElementById('refresh-status');
const bookingsBtn = document.getElementById('view-bookings');
const iconBoxEl = document.getElementById('result-icon-box');
const iconEl = document.getElementById('result-icon');

const params = new URLSearchParams(window.location.search);
const bookingId = params.get('bookingId');
const paymentId = params.get('paymentId');
const paypalToken = params.get('token');
const isGuest = params.get('isGuest') === 'true';
const paymentMethodParam = params.get('paymentMethod');

const PAYMENT_METHOD_NAMES = {
    'CASH': 'Tiền mặt (Thanh toán tại bãi)',
    'BANK_TRANSFER': 'Chuyển khoản QR ngân hàng',
    'DOMESTIC_CARD': 'Thẻ tín dụng nội địa',
    'VNPAY': 'Visa, Master Card (qua VNPAY)',
    'MOMO': 'Ví Momo',
    'PAY_LATER': 'Trả sau (Nợ ghi sổ)',
    'PAYPAL': 'PayPal'
};

const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}) : 'Không có';

const formatCurrency = (amount) => amount ? `${Number(amount).toLocaleString('vi-VN')}đ` : '0đ';

const setViewBookings = () => {
    if (bookingsBtn) {
        const userToken = localStorage.getItem('userToken');
        const isLoggedIn = Boolean(userToken);
        if (!isLoggedIn) {
            bookingsBtn.innerHTML = 'Đăng nhập để xem vé của bạn →';
            bookingsBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        } else {
            bookingsBtn.innerHTML = 'Xem chi tiết vé xe →';
            bookingsBtn.addEventListener('click', () => {
                if (bookingId) {
                    window.location.href = `ticket-details.html?id=${bookingId}`;
                } else {
                    window.location.href = 'my-bookings.html';
                }
            });
        }
    }
};

function setUIStatus(type) {
    if (!iconBoxEl || !iconEl) return;
    iconBoxEl.className = 'result-icon-container ' + type;
    if (type === 'success') {
        iconEl.className = 'fas fa-check';
    } else if (type === 'pending') {
        iconEl.className = 'fas fa-spinner fa-spin';
    } else {
        iconEl.className = 'fas fa-times';
    }
}

const buildSummaryHtml = (booking) => {
    const statusText = booking.status === 'confirmed' ? 'Đã xác nhận' : 
                       booking.status === 'pending' ? 'Đang xử lý' : 
                       booking.status === 'cancelled' ? 'Đã hủy' : 'Đã hoàn thành';
    const statusClass = (booking.status || 'pending').toLowerCase();
    
    const payStatusText = booking.paymentStatus === 'PAID' ? 'Đã thanh toán' :
                          booking.paymentStatus === 'PENDING' ? 'Đang xử lý' : 'Chưa thanh toán';
    const payStatusClass = (booking.paymentStatus || 'unpaid').toLowerCase();

    const methodLabel = PAYMENT_METHOD_NAMES[booking.paymentMethod] || booking.paymentMethod || 'Không xác định';

    const customerName = booking.fullName || booking.guestFullName || 'Khách hàng';
    const email = booking.email || booking.guestEmail || 'Không có';
    const phone = booking.phoneNumber || booking.guestPhoneNumber || 'Không có';

    return `
        <div class="summary-item">
            <span class="summary-item-label">Mã đặt chỗ</span>
            <span class="summary-item-value">${booking._id}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Bãi đỗ xe</span>
            <span class="summary-item-value">${booking.spot?.name || booking.spot?.address || 'Bãi đỗ xe'}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Khách hàng</span>
            <span class="summary-item-value">${customerName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Số điện thoại</span>
            <span class="summary-item-value">${phone}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Email</span>
            <span class="summary-item-value">${email}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Nhận xe</span>
            <span class="summary-item-value">${formatDate(booking.startTime)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Trả xe</span>
            <span class="summary-item-value">${formatDate(booking.endTime)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Phương thức</span>
            <span class="summary-item-value">${methodLabel}</span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Trạng thái đặt chỗ</span>
            <span class="summary-item-value"><span class="status-badge ${statusClass}">${statusText}</span></span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Trạng thái thanh toán</span>
            <span class="summary-item-value"><span class="status-badge ${payStatusClass}">${payStatusText}</span></span>
        </div>
        <div class="summary-item">
            <span class="summary-item-label">Tổng tiền</span>
            <span class="summary-item-value price">${formatCurrency(booking.totalPrice)}</span>
        </div>
    `;
};

const fetchStatus = async () => {
    if (!bookingId) {
        statusHeadingEl.textContent = 'Thiếu thông tin đặt chỗ';
        statusDescriptionEl.textContent = 'Không tìm thấy ID đặt chỗ trong địa chỉ trang.';
        setUIStatus('failed');
        return;
    }

    // Try to load from sessionStorage first for rapid load
    const storedData = sessionStorage.getItem('guestBookingData');
    if (storedData) {
        try {
            const guestData = JSON.parse(storedData);
            if (guestData._id === bookingId) {
                const isInstant = ['CASH', 'BANK_TRANSFER', 'DOMESTIC_CARD', 'VNPAY', 'MOMO', 'PAY_LATER'].includes(guestData.paymentMethod);
                if (isInstant) {
                    setUIStatus('success');
                    
                    const isPrepaid = ['BANK_TRANSFER', 'DOMESTIC_CARD', 'VNPAY', 'MOMO'].includes(guestData.paymentMethod);
                    statusHeadingEl.textContent = isPrepaid ? 'Thanh toán thành công!' : 'Đặt chỗ thành công!';
                    statusDescriptionEl.textContent = isPrepaid 
                        ? 'Cảm ơn bạn! Đơn đặt chỗ đã được thanh toán thành công qua chuyển khoản/ví. Bạn đã sẵn sàng để gửi xe.' 
                        : 'Yêu cầu đặt chỗ của bạn đã được xác nhận. Vui lòng thanh toán trực tiếp hoặc ghi sổ khi giao xe.';

                    summaryEl.innerHTML = buildSummaryHtml({
                        _id: guestData._id,
                        spot: { name: guestData.spotName, address: guestData.spotAddress },
                        guestFullName: guestData.customerName,
                        guestEmail: guestData.customerEmail,
                        guestPhoneNumber: guestData.customerPhone,
                        startTime: guestData.startTime,
                        endTime: guestData.endTime,
                        paymentMethod: guestData.paymentMethod,
                        paymentStatus: isPrepaid ? 'PAID' : 'UNPAID',
                        status: guestData.bookingStatus || 'confirmed',
                        totalPrice: guestData.totalPrice
                    });
                    
                    sessionStorage.removeItem('guestBookingData');
                    return;
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    try {
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = 'Đang tải...';
        }
        
        const headers = {};
        const authToken = localStorage.getItem('userToken');
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        // If paypal token exists, capture it first
        if (paypalToken) {
            statusHeadingEl.textContent = 'Đang xác nhận thanh toán PayPal...';
            statusDescriptionEl.textContent = 'Vui lòng chờ giây lát để chúng tôi xử lý giao dịch.';
            setUIStatus('pending');

            try {
                await fetch(`${API_URL}/payments/paypal/capture`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify({ token: paypalToken })
                });
            } catch (err) {
                console.error('Capture error', err);
            }

            // Remove token from URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('token');
            newUrl.searchParams.delete('PayerID');
            window.history.replaceState({}, '', newUrl);
        }

        let booking = null;
        if (paymentId) {
            // PayPal flow
            const res = await fetch(`${API_URL}/bookings/${bookingId}/payments/${paymentId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                booking = data.booking;
            }
        } else {
            // General status flow
            const res = await fetch(`${API_URL}/bookings/${bookingId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                booking = data.booking;
            }
        }

        if (!booking) {
            throw new Error('Không tìm thấy thông tin đơn hàng trên máy chủ.');
        }

        const isPrepaid = ['BANK_TRANSFER', 'DOMESTIC_CARD', 'VNPAY', 'MOMO', 'PAYPAL'].includes(booking.paymentMethod);

        if (booking.status === 'confirmed' || booking.status === 'completed') {
            setUIStatus('success');
            statusHeadingEl.textContent = isPrepaid ? 'Thanh toán thành công!' : 'Đặt chỗ thành công!';
            statusDescriptionEl.textContent = isPrepaid 
                ? 'Đơn đặt chỗ đã được thanh toán và xác nhận hoàn tất. Bạn đã sẵn sàng để gửi xe!'
                : 'Đặt chỗ của bạn đã được xác nhận thành công. Vui lòng thanh toán trực tiếp hoặc ghi sổ khi giao xe.';
        } else if (booking.status === 'pending') {
            setUIStatus('pending');
            statusHeadingEl.textContent = 'Đang chờ xử lý...';
            statusDescriptionEl.textContent = 'Đơn đặt chỗ đang chờ xác nhận hoặc xử lý giao dịch. Vui lòng tải lại trang sau vài phút.';
            if (refreshBtn) refreshBtn.style.display = 'inline-flex';
        } else {
            setUIStatus('failed');
            statusHeadingEl.textContent = 'Đặt chỗ đã bị hủy';
            statusDescriptionEl.textContent = 'Đơn đặt chỗ này đã bị hủy hoặc không thể xử lý.';
        }

        summaryEl.innerHTML = buildSummaryHtml(booking);

    } catch (error) {
        console.error(error);
        setUIStatus('failed');
        statusHeadingEl.textContent = 'Lỗi tải thông tin';
        statusDescriptionEl.textContent = error.message || 'Không thể lấy thông tin chi tiết đặt chỗ từ hệ thống.';
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Tải lại trạng thái';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setViewBookings();
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchStatus);
    }
    fetchStatus();
});
