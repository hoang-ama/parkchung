// File: client/customer/js/spot-details.js



document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy nếu đang ở trang spot-details.html
    if (!document.querySelector('.booking-grid')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id');

    if (!spotId) {
        alert('Spot ID not found. Redirecting...');
        window.location.href = 'results.html';
    } else {
        initializeSpotBookingPage(spotId);
    }
});

async function initializeSpotBookingPage(spotId) {
    let currentSpotData = null; // Để lưu dữ liệu spot hiện tại
    let arrivalFlatpickr, leavingFlatpickr; // Biến cho Flatpickr instances
    let countdownInterval; // Biến cho bộ đếm ngược

    const spotMainImage = document.getElementById('spot-main-image');
    const imageCounter = document.getElementById('spot-image-counter');
    const prevImageBtn = document.querySelector('.spot-image-nav-btn.prev-btn');
    const nextImageBtn = document.querySelector('.spot-image-nav-btn.next-btn');
    let currentImageIndex = 0;

    const bookingArrivalDateInput = document.getElementById('booking-arrival-date-input');
    const bookingLeavingDateInput = document.getElementById('booking-leaving-date-input');
    const bookingDuration = document.getElementById('booking-duration');
    const phoneNumberInput = document.getElementById('phone-number-input');
    const payAndReserveBtn = document.getElementById('pay-and-reserve-btn');
    const spotAddressDisplay = document.getElementById('spot-address');
    const summaryParkingFee = document.getElementById('summary-parking-fee');
    const summaryTransactionFee = document.getElementById('summary-transaction-fee');
    const summaryFinalPrice = document.getElementById('summary-final-price');
    const recheckedTimeDisplay = document.getElementById('rechecked-time');
    const timerDisplay = document.getElementById('timer-display');

    // --- CÁC HÀM TIỆN ÍCH ---

    function formatCurrency(amount) {
        return `${parseInt(amount).toLocaleString('vi-VN')} VND`;
    }

    function calculateDuration(start, end) {
        if (!start || !end || start >= end) {
            return '--';
        }
        const diffMs = end.getTime() - start.getTime();
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        if (hours === 0 && minutes === 0) return '--';

        let durationText = '';
        if (hours > 0) durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) durationText += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;

        return durationText.trim();
    }

    async function updatePriceSummary() {
        const startTime = arrivalFlatpickr.selectedDates[0];
        const endTime = leavingFlatpickr.selectedDates[0];

        // Lấy các element mới
        const summaryUnitPrice = document.getElementById('summary-unit-price');
        const summaryDuration = document.getElementById('summary-duration');
        // Các element khác đã được lấy ở trên

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            // Reset về trạng thái mặc định
            summaryUnitPrice.textContent = '-- VND / hour';
            summaryDuration.textContent = '-- hours';
            summaryFinalPrice.textContent = formatCurrency(0);
            payAndReserveBtn.textContent = 'Pay Now and Reserve';
            payAndReserveBtn.disabled = true;
            bookingDuration.textContent = '--';
            return;
        }

        const totalHours = Math.ceil(Math.abs(endTime - startTime) / 36e5);

        // Cập nhật giao diện với thông tin mới
        summaryUnitPrice.textContent = `${currentSpotData.hourlyRate.toLocaleString('vi-VN')} VND / hour`;
        summaryDuration.textContent = `${totalHours} hour${totalHours > 1 ? 's' : ''}`;
        bookingDuration.textContent = calculateDuration(startTime, endTime);

        try {
            // Gọi API để lấy tổng giá cuối cùng (đã bao gồm logic tính tiền phức tạp)
            const response = await fetch(`${API_URL}/bookings/estimate-price`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spotId: spotId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to estimate price.');
            }

            const data = await response.json();
            const estimatedPrice = data.estimatedPrice;

            // Cập nhật tổng giá
            summaryFinalPrice.textContent = formatCurrency(estimatedPrice);
            payAndReserveBtn.textContent = `Pay ${formatCurrency(estimatedPrice)} and Reserve`;
            payAndReserveBtn.disabled = false;
        } catch (error) {
            console.error('Error updating price:', error.message);
            alert(`Could not calculate price: ${error.message}`);
            summaryFinalPrice.textContent = 'Error';
            payAndReserveBtn.disabled = true;
        }
    }

    // --- LOGIC HIỂN THỊ ẢNH ---
    function updateSpotImageDisplay() {
        if (currentSpotData && currentSpotData.images && currentSpotData.images.length > 0) {
            spotMainImage.src = currentSpotData.images[currentImageIndex];
            imageCounter.textContent = `${currentImageIndex + 1}/${currentSpotData.images.length}`;
            prevImageBtn.disabled = currentImageIndex === 0;
            nextImageBtn.disabled = currentImageIndex === currentSpotData.images.length - 1;
        } else {
            spotMainImage.src = '../assets/image/parking-area.jpg'; // Ảnh mặc định
            imageCounter.textContent = '1/1';
            prevImageBtn.disabled = true;
            nextImageBtn.disabled = true;
        }
    }

    prevImageBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateSpotImageDisplay();
        }
    });

    nextImageBtn.addEventListener('click', () => {
        if (currentSpotData && currentImageIndex < currentSpotData.images.length - 1) {
            currentImageIndex++;
            updateSpotImageDisplay();
        }
    });

    // --- HELPER FUNCTION FOR FLATPICKR BUTTONS ---

    /**
     * Adds Confirm and Cancel buttons to a Flatpickr instance
     * @param {Object} fp - The Flatpickr instance
     */
    function addConfirmCancelButtons(fp) {
        let previousValue = fp.input.value;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flatpickr-button-container';

        // Create Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'flatpickr-confirm-btn';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.addEventListener('click', () => {
            previousValue = fp.input.value;
            fp.close();
        });

        // Create Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'flatpickr-cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            if (previousValue) {
                fp.input.value = previousValue;
                // Parse the altFormat to restore the date
                const parsedDate = fp.parseDate(previousValue, fp.config.altFormat);
                if (parsedDate) {
                    fp.setDate(parsedDate, false);
                }
            }
            fp.close();
        });

        // Append buttons to container
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);

        // Append container to calendar
        fp.calendarContainer.appendChild(buttonContainer);

        // Store previous value when picker opens
        fp.config.onOpen.push(() => {
            previousValue = fp.input.value;
        });
    }

    // --- KHỞI TẠO FLATPCKR VÀ XỬ LÝ SỰ KIỆN ---

    const commonFlatpickrOptions = {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        altInput: true,
        altFormat: "F j, Y h:i K", // VD: September 10, 2024 03:30 PM
        time_24hr: false,
        onChange: updatePriceSummary,
        onReady: function (selectedDates, dateStr, instance) {
            addConfirmCancelButtons(instance);
        },
        onOpen: [],
        onClose: function (selectedDates, dateStr, instance) {
            if (instance === arrivalFlatpickr && selectedDates.length > 0) {
                leavingFlatpickr.set('minDate', selectedDates[0]);
                if (leavingFlatpickr.selectedDates[0] && leavingFlatpickr.selectedDates[0] <= selectedDates[0]) {
                    leavingFlatpickr.setDate(new Date(selectedDates[0].getTime() + 60 * 60 * 1000), true);
                }
            } else if (instance === leavingFlatpickr && selectedDates.length > 0) {
                arrivalFlatpickr.set('maxDate', selectedDates[0]);
                if (arrivalFlatpickr.selectedDates[0] && arrivalFlatpickr.selectedDates[0] >= selectedDates[0]) {
                    arrivalFlatpickr.setDate(new Date(selectedDates[0].getTime() - 60 * 60 * 1000), true);
                }
            }
            updatePriceSummary();
        }
    };

    arrivalFlatpickr = flatpickr(bookingArrivalDateInput, {
        ...commonFlatpickrOptions,
        placeholder: "Select arrival date and time"
    });

    leavingFlatpickr = flatpickr(bookingLeavingDateInput, {
        ...commonFlatpickrOptions,
        placeholder: "Select leaving date and time"
    });

    // --- BỘ ĐẾM NGƯỢC THỜI GIAN THANH TOÁN ---
    let timeRemaining = 15 * 60; // 15 phút tính bằng giây

    function startCountdown() {
        clearInterval(countdownInterval);
        timeRemaining = 15 * 60;

        countdownInterval = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            recheckedTimeDisplay.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = '00:00';
                alert('Time to complete booking has expired. Please refresh the page to try again.');
                payAndReserveBtn.disabled = true;
            }
            timeRemaining--;
        }, 1000);
    }

    // --- TẢI DỮ LIỆU SPOT VÀ HIỂN THỊ ---

    async function loadSpotDetails() {
        try {
            const response = await fetch(`${API_URL}/spots/${spotId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch spot details.');
            }
            currentSpotData = await response.json();

            spotAddressDisplay.textContent = currentSpotData.address;

            updateSpotImageDisplay();

            const queryParams = new URLSearchParams(window.location.search);
            const arrivalQuery = queryParams.get('arrival');
            const leavingQuery = queryParams.get('leaving');


            if (arrivalQuery && leavingQuery) {
                arrivalFlatpickr.setDate(new Date(arrivalQuery), true);
                leavingFlatpickr.setDate(new Date(leavingQuery), true);
            } else {
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                arrivalFlatpickr.setDate(now, true);
                leavingFlatpickr.setDate(oneHourLater, true);
            }

            startCountdown();

        } catch (error) {
            console.error('Error loading spot details:', error);
            alert(`Error loading spot details: ${error.message}`);
        }
    }

    // --- HELPER FUNCTIONS ---
    function updateButtonText(button, text) {
        if (!button) return;
        const btnText = button.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = text;
        } else {
            button.textContent = text;
        }
    }

    async function initiatePaypalCheckout({ payload, token, triggerButton, defaultButtonText = 'Pay Now and Reserve' }) {
        let success = false;
        try {
            if (triggerButton) {
                triggerButton.disabled = true;
                triggerButton.classList.add('loading');
                updateButtonText(triggerButton, 'Redirecting to PayPal...');
            }

            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/payments/paypal/checkout`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Unable to start PayPal checkout.');
            }

            const data = await response.json();
            if (!data.redirectUrl) {
                throw new Error('Missing PayPal approval link.');
            }

            window.location.href = data.redirectUrl;
            success = true;
            return true;
        } catch (error) {
            console.error('PayPal checkout error:', error);
            alert(error.message);
            return false;
        } finally {
            if (triggerButton && !success) {
                triggerButton.disabled = false;
                triggerButton.classList.remove('loading');
                updateButtonText(triggerButton, defaultButtonText);
                updatePriceSummary();
            }
        }
    }

    // --- XỬ LÝ ĐẶT CHỖ ---

    payAndReserveBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('userToken');
        const startTime = arrivalFlatpickr.selectedDates[0];
        const endTime = leavingFlatpickr.selectedDates[0];
        if (!startTime || !endTime || startTime >= endTime) {
            alert('Please select valid arrival and leaving times.');
            return;
        }

        const basePayload = {
            spot: spotId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        // If not logged in, open guest modal and handle guest booking flow
        if (!token) {
            const modal = document.getElementById('leadModal');
            const fullNameEl = document.getElementById('guest-fullname');
            const emailEl = document.getElementById('guest-email');
            const phoneEl = document.getElementById('guest-phone');
            const cancelBtn = document.getElementById('guest-cancel');
            const cancelBtnSecondary = document.getElementById('guest-cancel-secondary');
            const submitBtn = document.getElementById('guest-submit');

            // Set selected times preview
            const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            const fromEl = document.getElementById('pc-time-from');
            const toEl = document.getElementById('pc-time-to');
            if (fromEl) fromEl.textContent = new Date(startTime).toLocaleString('vi-VN', options);
            if (toEl) toEl.textContent = new Date(endTime).toLocaleString('vi-VN', options);

            // Open modal via class for CSS animations
            modal.classList.add('is-open');
            if (fullNameEl) { try { fullNameEl.focus(); } catch (e) { /* ignore */ } }

            const closeModal = () => { modal.classList.remove('is-open'); };
            cancelBtn.onclick = closeModal;
            if (cancelBtnSecondary) cancelBtnSecondary.onclick = closeModal;
            modal.onclick = (e) => { if (e.target === modal) closeModal(); };
            const escHandler = (e) => { if (e.key === 'Escape') { closeModal(); window.removeEventListener('keydown', escHandler); } };
            window.addEventListener('keydown', escHandler);

            submitBtn.onclick = async () => {
                const fullName = (fullNameEl.value || '').trim();
                const email = (emailEl.value || '').trim();
                const phoneNumber = (phoneEl.value || '').trim();
                if (!fullName || !email || !phoneNumber) {
                    alert('Please fill in full name, email and phone number.');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                const success = await initiatePaypalCheckout({
                    payload: {
                        ...basePayload,
                        fullName,
                        email,
                        phoneNumber,
                        guestPhoneNumber: phoneNumber,
                    },
                    triggerButton: submitBtn,
                    defaultButtonText: 'Complete Booking',
                });
                if (success) {
                    closeModal();
                }
            };
            return; // Stop further processing
        }

        const phoneNumber = phoneNumberInput.value.trim();
        if (!phoneNumber) {
            alert('Please enter your phone number.');
            return;
        }

        await initiatePaypalCheckout({
            payload: {
                ...basePayload,
                phoneNumber,
            },
            token,
            triggerButton: payAndReserveBtn,
        });
    });

    loadSpotDetails(); // Gọi khi initializeSpotBookingPage được gọi
}