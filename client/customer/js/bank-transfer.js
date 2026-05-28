// File: client/customer/js/bank-transfer.js

function removeVietnameseDiacritics(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '');
}

function formatDateDDMMYYYY(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}${month}${year}`;
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép thành công!');
    }).catch(err => {
        console.error('Lỗi khi sao chép:', err);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('bookingId');
    const isGuest = params.get('isGuest') === 'true';

    if (!bookingId) {
        alert('Không tìm thấy thông tin đặt chỗ!');
        window.location.href = '/customer/index.html';
        return;
    }

    let bookingData = null;
    const storedData = sessionStorage.getItem('guestBookingData');
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            if (parsed._id === bookingId) {
                bookingData = parsed;
            }
        } catch (e) {
            console.error('Lỗi khi parse guestBookingData từ sessionStorage:', e);
        }
    }

    if (!bookingData) {
        // Fallback: Fetch booking from backend
        try {
            const headers = {};
            const token = localStorage.getItem('userToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const res = await fetch(`${API_URL}/bookings/${bookingId}`, { headers });
            if (res.ok) {
                const data = await res.json();
                const b = data.booking;
                const customerName = b.user ? b.user.fullName : b.guestFullName;
                const customerPhone = b.user ? b.phoneNumber : b.guestPhoneNumber;
                const customerEmail = b.user ? b.user.email : b.guestEmail;
                bookingData = {
                    _id: b._id,
                    customerName,
                    customerPhone,
                    customerEmail,
                    startTime: b.startTime,
                    endTime: b.endTime,
                    totalPrice: b.totalPrice,
                    spotName: b.spot?.name || 'Bãi đỗ xe',
                    paymentMethod: b.paymentMethod || 'BANK_TRANSFER',
                };
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin booking từ API:', err);
        }
    }

    if (!bookingData) {
        alert('Không thể tải thông tin đơn đặt chỗ!');
        window.location.href = '/customer/index.html';
        return;
    }

    // Generate memo message
    const namePart = removeVietnameseDiacritics(bookingData.customerName)
        .split(' ')
        .filter(Boolean)
        .pop() || 'CUSTOMER';
    
    // Clean phone number (keep only digits)
    const phonePart = (bookingData.customerPhone || '').replace(/\D/g, '') || '0924609766';
    
    const startPart = formatDateDDMMYYYY(bookingData.startTime);
    const endPart = formatDateDDMMYYYY(bookingData.endTime);
    const transferMemo = `${namePart} ${phonePart} ${startPart} ${endPart}`;

    // Update HTML
    const amountValEl = document.getElementById('bank-amount-val');
    const messageValEl = document.getElementById('bank-message-val');
    const figmaMessageValEl = document.getElementById('bank-message-val-figma');
    const techcombankQrEl = document.getElementById('techcombank-qr');
    const copyAmountBtn = document.getElementById('copy-amount-btn');
    const copyMessageBtn = document.getElementById('copy-message-btn');
    const btnComplete = document.getElementById('btn-complete');

    if (amountValEl) {
        amountValEl.textContent = `${Number(bookingData.totalPrice).toLocaleString('vi-VN')}đ`;
    }
    if (messageValEl) {
        messageValEl.textContent = transferMemo;
    }
    if (figmaMessageValEl) {
        figmaMessageValEl.innerHTML = `${transferMemo} <i class="far fa-copy"></i>`;
    }

    // Dynamic Techcombank QR generator using VietQR API
    if (techcombankQrEl) {
        techcombankQrEl.src = `https://img.vietqr.io/image/TCB-4001153599999-compact2.png?amount=${bookingData.totalPrice}&addInfo=${encodeURIComponent(transferMemo)}&accountName=CONG%20TY%20CO%20PHAN%20PARKCHUNG`;
    }

    // Set copy actions
    if (copyAmountBtn) {
        copyAmountBtn.addEventListener('click', () => copyText(String(bookingData.totalPrice)));
    }
    if (copyMessageBtn) {
        copyMessageBtn.addEventListener('click', () => copyText(transferMemo));
    }

    window.copyText = copyText;

    // Receipt File Upload logic
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('receipt-file-input');
    const uploadFilename = document.getElementById('upload-filename');

    if (uploadBox && fileInput) {
        uploadBox.addEventListener('click', (e) => {
            // Prevent double opening if click is on button/label which bubbles
            if (e.target.tagName !== 'INPUT') {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (uploadFilename) {
                    uploadFilename.textContent = `Đã chọn: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                    uploadFilename.style.display = 'block';
                }
            }
        });

        // Add drag & drop support
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#0ea36b';
            uploadBox.style.background = '#e6fbf0';
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.borderColor = '#13b47e';
            uploadBox.style.background = '#f0fdf4';
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '#13b47e';
            uploadBox.style.background = '#f0fdf4';
            
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                const file = e.dataTransfer.files[0];
                if (uploadFilename) {
                    uploadFilename.textContent = `Đã chọn: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                    uploadFilename.style.display = 'block';
                }
            }
        });
    }

    if (btnComplete) {
        btnComplete.addEventListener('click', () => {
            // Keep the guestBookingData in sessionStorage for payment-result page to consume
            // We set it back just in case
            sessionStorage.setItem('guestBookingData', JSON.stringify(bookingData));
            
            // Redirect to payment result page
            window.location.href = `/customer/payment-result?success=true&bookingId=${bookingId}&isGuest=${isGuest}&paymentMethod=BANK_TRANSFER`;
        });
    }
});
