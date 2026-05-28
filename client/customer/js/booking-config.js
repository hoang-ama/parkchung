// File: client/customer/js/booking-config.js

const BOOKING_UI_TEXT = {
    en: {
        missingSpotId: 'Spot ID not found. Redirecting...',
        perHour: 'hour',
        hour: 'hour',
        hours: 'hours',
        minute: 'minute',
        minutes: 'minutes',
        payNow: 'Book now',
        reserveNow: 'Book now',
        confirm: 'Confirm',
        cancel: 'Cancel',
        errorLabel: 'Error',
        failedEstimate: 'Failed to estimate price.',
        unableToCalculate: 'Could not calculate price',
        timeExpired: 'Time to complete booking has expired. Please refresh the page to try again.',
        errorLoadingSpot: 'Error loading spot details',
        redirectingPaypal: 'Redirecting to PayPal...',
        unableToStartPaypal: 'Unable to start PayPal checkout.',
        missingPaypalLink: 'Missing PayPal approval link.',
        selectValidTimes: 'Please select valid arrival and leaving times.',
        selectPaymentMethod: 'Please select a payment method.',
        enterFullName: 'Please enter your full name.',
        enterEmail: 'Please enter your email address.',
        invalidEmail: 'Please enter a valid email address.',
        enterPhone: 'Please enter your phone number.',
        enterVehicleRegistration: 'Please enter your vehicle registration.',
        completeBooking: 'Book now',
        creatingBooking: 'Creating booking...',
        bookingCreatedEmail: 'Booking created successfully! You will receive a confirmation email.',
        bookingCreatedCash: 'Booking created successfully! You can pay at the parking spot.',
        failedCreateBooking: 'Failed to create booking.',
        failedCreateBookingRetry: 'Failed to create booking. Please try again.',
        notAvailable: 'N/A',
        parkingSpot: 'Parking Spot',
    },
    vi: {
        missingSpotId: 'Không tìm thấy ID bãi đỗ. Đang chuyển hướng...',
        perHour: 'giờ',
        hour: 'giờ',
        hours: 'giờ',
        minute: 'phút',
        minutes: 'phút',
        payNow: 'Đặt ngay',
        reserveNow: 'Đặt ngay',
        confirm: 'Xác nhận',
        cancel: 'Hủy',
        errorLabel: 'Lỗi',
        failedEstimate: 'Không thể ước tính giá.',
        unableToCalculate: 'Không thể tính giá',
        timeExpired: 'Đã hết thời gian hoàn tất đặt chỗ. Vui lòng tải lại trang để thử lại.',
        errorLoadingSpot: 'Lỗi khi tải thông tin bãi đỗ',
        redirectingPaypal: 'Đang chuyển đến PayPal...',
        unableToStartPaypal: 'Không thể khởi tạo thanh toán PayPal.',
        missingPaypalLink: 'Không nhận được liên kết xác nhận PayPal.',
        selectValidTimes: 'Vui lòng chọn thời gian đến và rời đi hợp lệ.',
        selectPaymentMethod: 'Vui lòng chọn phương thức thanh toán.',
        enterFullName: 'Vui lòng nhập họ và tên.',
        enterEmail: 'Vui lòng nhập địa chỉ email.',
        invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ.',
        enterPhone: 'Vui lòng nhập số điện thoại.',
        enterVehicleRegistration: 'Vui lòng nhập biển số xe.',
        completeBooking: 'Đặt ngay',
        creatingBooking: 'Đang tạo đặt chỗ...',
        bookingCreatedEmail: 'Tạo đặt chỗ thành công! Bạn sẽ nhận được email xác nhận.',
        bookingCreatedCash: 'Tạo đặt chỗ thành công! Bạn có thể thanh toán tại bãi đỗ.',
        failedCreateBooking: 'Không thể tạo đặt chỗ.',
        failedCreateBookingRetry: 'Không thể tạo đặt chỗ. Vui lòng thử lại.',
        notAvailable: 'Không có',
        parkingSpot: 'Bãi đỗ xe',
    },
};

function getCurrentBookingLang() {
    return localStorage.getItem('lang') || 'vi';
}

function getBookingText() {
    return BOOKING_UI_TEXT[getCurrentBookingLang()] || BOOKING_UI_TEXT.en;
}

function getFlatpickrAltFormat() {
    return getCurrentBookingLang() === 'vi' ? 'H:i - d/m/Y' : 'F j, Y h:i K';
}

function uses24HourClock() {
    return getCurrentBookingLang() === 'vi';
}

function formatCurrency(amount) {
    return `${Number(amount || 0).toLocaleString('vi-VN')} VND`;
}

function formatBillableHours(totalHours) {
    const text = getBookingText();
    if (getCurrentBookingLang() === 'vi') {
        return `${totalHours} ${text.hours}`;
    }

    return `${totalHours} ${totalHours === 1 ? text.hour : text.hours}`;
}

function formatExactDuration(hours, minutes) {
    const text = getBookingText();
    const segments = [];

    if (hours > 0) {
        segments.push(`${hours} ${hours === 1 ? text.hour : text.hours}`);
    }

    if (minutes > 0) {
        segments.push(`${minutes} ${minutes === 1 ? text.minute : text.minutes}`);
    }

    if (segments.length === 0) {
        return `0 ${text.minutes}`;
    }

    return segments.join(' ');
}

function setRatingDisplay(valueElement, starsElement, rating) {
    const text = getBookingText();
    const safeRating = Number(rating || 0);

    valueElement.textContent = safeRating > 0 ? safeRating.toFixed(1) : text.notAvailable;

    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starText = '★'.repeat(fullStars);
    if (hasHalfStar) {
        starText += '⯨';
    }
    starText += '☆'.repeat(emptyStars);
    starsElement.textContent = starText;
}

function addConfirmCancelButtons(flatpickrInstance) {
    let previousValue = flatpickrInstance.input.value;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flatpickr-button-container';

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'flatpickr-confirm-btn';
    confirmButton.textContent = getBookingText().confirm;
    confirmButton.addEventListener('click', () => {
        previousValue = flatpickrInstance.input.value;
        flatpickrInstance.close();
    });

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'flatpickr-cancel-btn';
    cancelButton.textContent = getBookingText().cancel;
    cancelButton.addEventListener('click', () => {
        if (previousValue) {
            flatpickrInstance.input.value = previousValue;
            const parsedDate = flatpickrInstance.parseDate(previousValue, flatpickrInstance.config.altFormat);
            if (parsedDate) {
                flatpickrInstance.setDate(parsedDate, false);
            }
        }
        flatpickrInstance.close();
    });

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    flatpickrInstance.calendarContainer.appendChild(buttonContainer);

    flatpickrInstance.config.onOpen.push(() => {
        previousValue = flatpickrInstance.input.value;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.booking-grid') || !window.location.pathname.includes('booking-config')) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id') || urlParams.get('spotId');
    const arrivalParam = urlParams.get('arrival') || urlParams.get('startTime');
    const leavingParam = urlParams.get('leaving') || urlParams.get('endTime');

    if (!spotId) {
        alert(getBookingText().missingSpotId);
        window.location.href = 'results.html';
        return;
    }

    initializeBookingConfigPage({ spotId, arrivalParam, leavingParam });
});

async function initializeBookingConfigPage({ spotId, arrivalParam, leavingParam }) {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    const dropoffParam = urlParams.get('dropoff');
    const pickupParam = urlParams.get('pickup');
    const isValet = typeParam === 'valet';

    let currentSpotData = null;
    let arrivalFlatpickr = null;
    let leavingFlatpickr = null;
    let countdownInterval = null;
    let timeRemaining = 15 * 60;

    const bookingArrivalDateInput = document.getElementById('booking-arrival-date-input');
    const bookingLeavingDateInput = document.getElementById('booking-leaving-date-input');
    const bookingDuration = document.getElementById('booking-duration');
    const billedHoursElement = document.getElementById('booking-billed-hours');
    const phoneNumberInput = document.getElementById('phone-number-input');
    const vehicleRegInput = document.getElementById('vehicle-reg-input');
    const payAndReserveBtn = document.getElementById('pay-and-reserve-btn');
    const spotAddressDisplay = document.getElementById('spot-address');
    const summaryFinalPrice = document.getElementById('summary-final-price');
    const summaryUnitPrice = document.getElementById('summary-unit-price');
    const summaryDuration = document.getElementById('summary-duration');
    const recheckedTimeDisplay = document.getElementById('rechecked-time');
    const timerDisplay = document.getElementById('timer-display');
    const spotThumbnail = document.getElementById('spot-thumbnail');
    const spotNameDisplay = document.getElementById('spot-name');
    const spotAddressTextDisplay = document.getElementById('spot-address-display');
    const guestFullnameInput = document.getElementById('guest-fullname-input');
    const guestEmailInput = document.getElementById('guest-email-input');
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');

    const selectedServices = [];

    const userToken = localStorage.getItem('userToken');
    const isLoggedIn = Boolean(userToken);

    if (isValet) {
        // Hide service card selector
        const servicesCard = document.querySelector('.services-card');
        if (servicesCard) {
            servicesCard.style.display = 'none';
        }

        // Show back button and assign behavior
        const btnBackToOffer = document.getElementById('btn-back-to-offer');
        if (btnBackToOffer) {
            btnBackToOffer.style.display = 'flex';
            btnBackToOffer.addEventListener('click', () => {
                const currentUrl = new URL(window.location.href);
                window.location.href = `valet-offer.html?${currentUrl.searchParams.toString()}`;
            });
        }

        // Read selected services from sessionStorage
        try {
            const stored = sessionStorage.getItem('selectedServices');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    parsed.forEach(s => selectedServices.push(s));
                }
            }
        } catch (e) {
            console.warn('Failed to parse selectedServices from sessionStorage:', e);
        }
    } else {
        // Setup service selection listeners
        document.querySelectorAll('.service-item-card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.getAttribute('data-service-id');
                const serviceName = card.getAttribute('data-service-name');
                const servicePrice = parseInt(card.getAttribute('data-service-price'), 10) || 0;

                const existingIndex = selectedServices.findIndex(s => s.id === serviceId);

                const addBtn = card.querySelector('.service-add-btn');
                const checkBtn = card.querySelector('.service-check-btn');
                const priceEl = card.querySelector('.service-price');

                if (existingIndex > -1) {
                    // Deselect
                    selectedServices.splice(existingIndex, 1);
                    card.classList.remove('selected');
                    if (addBtn) addBtn.style.display = 'flex';
                    if (checkBtn) checkBtn.style.display = 'none';
                    if (priceEl) priceEl.textContent = servicePrice.toLocaleString('vi-VN') + 'đ';
                } else {
                    // Select
                    selectedServices.push({ id: serviceId, name: serviceName, price: servicePrice });
                    card.classList.add('selected');
                    if (addBtn) addBtn.style.display = 'none';
                    if (checkBtn) checkBtn.style.display = 'flex';
                    if (priceEl) priceEl.textContent = 'Đã thêm';
                }

                updatePriceSummary();
            });
        });
    }

    function formatDateTimeFigma(date) {
        if (!date) return '--';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
    }

    function updateTimeline() {
        const dropoffInput = document.getElementById('top-dropoff-input');
        const pickupInput = document.getElementById('top-pickup-input');
        
        const summaryDropoffAddr = document.getElementById('summary-dropoff-addr');
        const summaryPickupAddr = document.getElementById('summary-pickup-addr');
        
        const summaryDropoffTime = document.getElementById('summary-dropoff-time');
        const summaryPickupTime = document.getElementById('summary-pickup-time');

        if (summaryDropoffAddr && dropoffInput) {
            summaryDropoffAddr.textContent = dropoffInput.value || '--';
        }
        if (summaryPickupAddr && pickupInput) {
            summaryPickupAddr.textContent = pickupInput.value || '--';
        }

        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        if (summaryDropoffTime && startTime) {
            summaryDropoffTime.textContent = formatDateTimeFigma(startTime);
        }
        if (summaryPickupTime && endTime) {
            summaryPickupTime.textContent = formatDateTimeFigma(endTime);
        }
    }

    function updatePayButtonText() {
        const payLaterChecked = document.getElementById('pay-later')?.checked;
        const text = getBookingText();

        const buttonTextLabel = payLaterChecked ? text.reserveNow : text.payNow;

        payAndReserveBtn.textContent = buttonTextLabel;
    }
    window.triggerUpdatePayButtonText = updatePayButtonText;

    function resetDurationDisplay() {
        if (summaryUnitPrice) summaryUnitPrice.textContent = `-- VND / ${getBookingText().perHour}`;
        if (summaryDuration) summaryDuration.textContent = getCurrentBookingLang() === 'vi' ? '-- giờ' : '-- hours';
        summaryFinalPrice.textContent = formatCurrency(0);
        if (bookingDuration) bookingDuration.textContent = '--';
        if (billedHoursElement) {
            billedHoursElement.textContent = getCurrentBookingLang() === 'vi' ? '-- giờ' : '-- hours';
        }

        const valetDaysEl = document.getElementById('summary-valet-days');
        if (valetDaysEl) valetDaysEl.textContent = '--';
        const valetPriceEl = document.getElementById('summary-valet-price');
        if (valetPriceEl) valetPriceEl.textContent = '0 VND';
        const servicesTotalEl = document.getElementById('summary-services-total-price');
        if (servicesTotalEl) servicesTotalEl.textContent = '0 VND';

        payAndReserveBtn.disabled = true;
        updatePayButtonText();
    }

    async function updatePriceSummary() {
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        updateTimeline();

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            resetDurationDisplay();
            return;
        }

        const totalHours = Math.ceil(Math.abs(endTime - startTime) / 36e5);
        const diffMinutes = Math.floor(Math.abs(endTime - startTime) / 60000);
        const exactHours = Math.floor(diffMinutes / 60);
        const exactMinutes = diffMinutes % 60;

        if (summaryUnitPrice) {
            summaryUnitPrice.textContent = `${Number(currentSpotData.hourlyRate || 0).toLocaleString('vi-VN')} VND / ${getBookingText().perHour}`;
        }
        if (summaryDuration) {
            summaryDuration.textContent = formatBillableHours(totalHours);
        }
        if (bookingDuration) {
            bookingDuration.textContent = formatExactDuration(exactHours, exactMinutes);
        }
        if (billedHoursElement) {
            billedHoursElement.textContent = formatBillableHours(totalHours);
        }

        try {
            let response;
            let basePrice = 0;

            if (isValet) {
                // Call valet price API
                response = await fetch(`${API_URL}/spots/valet-price?spotId=${spotId}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || getBookingText().failedEstimate);
                }
                const data = await response.json();
                basePrice = data.totalPrice;

                // Update summary text
                const currentLang = getCurrentBookingLang();
                if (summaryUnitPrice) {
                    summaryUnitPrice.textContent = `${Number(data.rate || 30000).toLocaleString('vi-VN')} VND / ${currentLang === 'vi' ? 'ngày' : 'day'} (Valet Flat Rate)`;
                }
                if (summaryDuration) {
                    summaryDuration.textContent = `${data.days} ${currentLang === 'vi' ? 'ngày' : 'day'}${data.days !== 1 && currentLang !== 'vi' ? 's' : ''}`;
                }

                const valetDaysEl = document.getElementById('summary-valet-days');
                if (valetDaysEl) valetDaysEl.textContent = data.days;
                const valetPriceEl = document.getElementById('summary-valet-price');
                if (valetPriceEl) valetPriceEl.textContent = formatCurrency(basePrice);

                const durationLabel = document.getElementById('summary-parking-duration-label');
                if (durationLabel) {
                    durationLabel.innerHTML = `Phí đỗ xe + valet (<span id="summary-valet-days">${data.days}</span> ngày)`;
                }
            } else {
                // Call standard spot estimate price API
                response = await fetch(`${API_URL}/bookings/estimate-price`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        spotId,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || getBookingText().failedEstimate);
                }
                const data = await response.json();
                basePrice = data.estimatedPrice;

                if (summaryUnitPrice) {
                    summaryUnitPrice.textContent = `${Number(currentSpotData.hourlyRate || 0).toLocaleString('vi-VN')} VND / ${getBookingText().perHour}`;
                }
                if (summaryDuration) {
                    summaryDuration.textContent = formatBillableHours(totalHours);
                }

                const valetDaysEl = document.getElementById('summary-valet-days');
                if (valetDaysEl) valetDaysEl.textContent = totalHours;
                const valetPriceEl = document.getElementById('summary-valet-price');
                if (valetPriceEl) valetPriceEl.textContent = formatCurrency(basePrice);

                const durationLabel = document.getElementById('summary-parking-duration-label');
                if (durationLabel) {
                    durationLabel.innerHTML = `Phí đỗ xe (<span id="summary-valet-days">${totalHours}</span> giờ)`;
                }
            }

            // Calculate services price
            const servicesPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
            const servicesTotalEl = document.getElementById('summary-services-total-price');
            if (servicesTotalEl) servicesTotalEl.textContent = formatCurrency(servicesPrice);

            const finalPrice = basePrice + servicesPrice;
            summaryFinalPrice.textContent = formatCurrency(finalPrice);

            // Update selected services summary list
            const servicesListContainer = document.getElementById('summary-selected-services-list');
            const summaryServicesSec = document.getElementById('summary-services-section');
            if (summaryServicesSec) {
                summaryServicesSec.style.display = selectedServices.length > 0 ? 'block' : 'none';
            }
            if (servicesListContainer) {
                servicesListContainer.innerHTML = '';
                if (selectedServices.length === 0) {
                    servicesListContainer.innerHTML = '<li class="no-services-placeholder" style="font-size: 13px; color: #9ca3af; text-align: center; padding: 10px 0;">Chưa chọn dịch vụ nào</li>';
                } else {
                    selectedServices.forEach(s => {
                        const li = document.createElement('li');
                        li.style.cssText = 'display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #f3f4f6;';
                        li.innerHTML = `<span>${s.name}</span><span style="color:#13b47e;font-weight:600;">${s.price.toLocaleString('vi-VN')}đ</span>`;
                        servicesListContainer.appendChild(li);
                    });
                }
            }

            const breakdownTextEl = document.getElementById('summary-breakdown-text');
            if (breakdownTextEl) {
                if (selectedServices.length === 0) {
                    breakdownTextEl.textContent = isValet ? 'Bãi đỗ + đỗ xe hộ' : 'Phí đỗ xe';
                } else {
                    const serviceNames = selectedServices.map(s => s.name.toLowerCase()).join(', ');
                    breakdownTextEl.textContent = (isValet ? 'Bãi đỗ + đỗ xe hộ + ' : 'Phí đỗ xe + ') + serviceNames;
                }
            }

            payAndReserveBtn.disabled = false;
            updatePayButtonText();
        } catch (error) {
            console.error('Error updating price:', error.message);
            alert(`${getBookingText().unableToCalculate}: ${error.message}`);
            summaryFinalPrice.textContent = getBookingText().errorLabel;
            payAndReserveBtn.disabled = true;
        }
    }

    function applyDynamicLanguageState() {
        document.querySelectorAll('.flatpickr-confirm-btn').forEach((button) => {
            button.textContent = getBookingText().confirm;
        });
        document.querySelectorAll('.flatpickr-cancel-btn').forEach((button) => {
            button.textContent = getBookingText().cancel;
        });

        if (arrivalFlatpickr) {
            arrivalFlatpickr.set('altFormat', getFlatpickrAltFormat());
            arrivalFlatpickr.set('time_24hr', uses24HourClock());
            if (arrivalFlatpickr.selectedDates[0]) {
                arrivalFlatpickr.setDate(arrivalFlatpickr.selectedDates[0], false);
            }
        }

        if (leavingFlatpickr) {
            leavingFlatpickr.set('altFormat', getFlatpickrAltFormat());
            leavingFlatpickr.set('time_24hr', uses24HourClock());
            if (leavingFlatpickr.selectedDates[0]) {
                leavingFlatpickr.setDate(leavingFlatpickr.selectedDates[0], false);
            }
        }

        const timeStr = new Date().toLocaleTimeString(getCurrentBookingLang() === 'vi' ? 'vi-VN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
        if (recheckedTimeDisplay) recheckedTimeDisplay.textContent = timeStr;
        const recheckedVisible = document.getElementById('rechecked-time-visible');
        if (recheckedVisible) recheckedVisible.textContent = timeStr;

        updatePriceSummary();
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        timeRemaining = 15 * 60;

        countdownInterval = window.setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            const timeStr = new Date().toLocaleTimeString(getCurrentBookingLang() === 'vi' ? 'vi-VN' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
            if (recheckedTimeDisplay) recheckedTimeDisplay.textContent = timeStr;
            const recheckedVisible = document.getElementById('rechecked-time-visible');
            if (recheckedVisible) recheckedVisible.textContent = timeStr;

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                if (timerDisplay) timerDisplay.textContent = '00:00';
                payAndReserveBtn.disabled = true;
                alert(getBookingText().timeExpired);
            }

            timeRemaining -= 1;
        }, 1000);
    }

    async function loadSpotDetails() {
        try {
            const response = await fetch(`${API_URL}/spots/${spotId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getBookingText().errorLoadingSpot);
            }

            currentSpotData = await response.json();
            if (spotAddressDisplay) spotAddressDisplay.textContent = currentSpotData.address;
            if (spotNameDisplay) {
                spotNameDisplay.textContent = currentSpotData.name || currentSpotData.address;
            }
            if (spotAddressTextDisplay) {
                spotAddressTextDisplay.textContent = currentSpotData.address;
            }

            if (spotThumbnail) {
                let imageUrl = '/assets/image/Spot Image Coming Soon.png';
                if (currentSpotData.images?.length && currentSpotData.images[0]) {
                    const firstImage = currentSpotData.images[0];
                    imageUrl = firstImage.startsWith('http') || firstImage.startsWith('/')
                        ? firstImage
                        : `${API_URL.replace('/api', '')}${firstImage}`;
                }

                spotThumbnail.src = imageUrl;
                spotThumbnail.onerror = function onImageError() {
                    this.src = '/assets/image/Spot Image Coming Soon.png';
                };
            }

            const configRatingValueEl = document.getElementById('config-rating-value');
            const configRatingStarsEl = document.getElementById('config-rating-stars');
            if (configRatingValueEl && configRatingStarsEl && currentSpotData.ggRating !== undefined) {
                setRatingDisplay(configRatingValueEl, configRatingStarsEl, currentSpotData.ggRating);
            }

            if (arrivalParam && leavingParam) {
                arrivalFlatpickr.setDate(new Date(arrivalParam), true);
                leavingFlatpickr.setDate(new Date(leavingParam), true);
            } else {
                const now = new Date();
                const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                arrivalFlatpickr.setDate(now, true);
                leavingFlatpickr.setDate(oneHourLater, true);
            }

            startCountdown();
            applyDynamicLanguageState();
        } catch (error) {
            console.error('Error loading spot details:', error);
            alert(`${getBookingText().errorLoadingSpot}: ${error.message}`);
        }
    }

    function updateButtonText(button, text) {
        if (!button) return;
        const buttonText = button.querySelector('.btn-text');
        if (buttonText) {
            buttonText.textContent = text;
            return;
        }

        button.textContent = text;
    }

    async function initiatePaypalCheckout({ payload, token, triggerButton, defaultButtonText }) {
        let success = false;

        try {
            if (triggerButton) {
                triggerButton.disabled = true;
                triggerButton.classList.add('loading');
                updateButtonText(triggerButton, getBookingText().redirectingPaypal);
            }

            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/payments/paypal/checkout`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getBookingText().unableToStartPaypal);
            }

            const data = await response.json();
            if (!data.redirectUrl) {
                throw new Error(getBookingText().missingPaypalLink);
            }

            window.open(data.redirectUrl, '_blank');
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

    function validateInlineFields() {
        const text = getBookingText();
        const fullName = (guestFullnameInput?.value || '').trim();
        const email = (guestEmailInput?.value || '').trim();
        const phoneNumber = (phoneNumberInput?.value || '').trim();
        const vehicleRegistration = (vehicleRegInput?.value || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

        if (!fullName) {
            alert(text.enterFullName);
            guestFullnameInput?.focus();
            return null;
        }

        if (!email) {
            alert(text.enterEmail);
            guestEmailInput?.focus();
            return null;
        }

        if (!emailRegex.test(email)) {
            alert(text.invalidEmail);
            guestEmailInput?.focus();
            return null;
        }

        if (!phoneNumber) {
            alert(text.enterPhone);
            phoneNumberInput?.focus();
            return null;
        }

        if (!vehicleRegistration) {
            alert(text.enterVehicleRegistration);
            vehicleRegInput?.focus();
            return null;
        }

        return {
            fullName,
            email,
            phoneNumber,
            vehicleRegistration,
        };
    }

    async function createGuestBooking(basePayload, inlineValues, paymentMethod) {
        payAndReserveBtn.disabled = true;
        updateButtonText(payAndReserveBtn, getBookingText().creatingBooking);

        try {
            const response = await fetch(`${API_URL}/bookings/guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...basePayload,
                    fullName: inlineValues.fullName,
                    email: inlineValues.email,
                    phoneNumber: inlineValues.phoneNumber,
                    vehicleRegistration: inlineValues.vehicleRegistration,
                    paymentMethod: paymentMethod.toUpperCase(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getBookingText().failedCreateBooking);
            }

            const data = await response.json();
            const guestBookingData = {
                _id: data._id,
                spotName: currentSpotData?.name || getBookingText().parkingSpot,
                spotAddress: currentSpotData?.address || getBookingText().notAvailable,
                customerName: inlineValues.fullName,
                customerEmail: inlineValues.email,
                customerPhone: inlineValues.phoneNumber,
                vehicleRegistration: inlineValues.vehicleRegistration,
                startTime: basePayload.startTime,
                endTime: basePayload.endTime,
                orderTime: new Date().toISOString(),
                bookingStatus: data.status || 'confirmed',
                paymentMethod: paymentMethod.toUpperCase(),
                paymentStatus: data.paymentStatus || 'UNPAID',
                totalPrice: data.totalPrice || 0,
            };
            sessionStorage.setItem('guestBookingData', JSON.stringify(guestBookingData));

            if (paymentMethod === 'bank_transfer') {
                window.location.href = `bank-transfer.html?bookingId=${data._id}&isGuest=true&paymentMethod=BANK_TRANSFER`;
            } else {
                window.location.href = `payment-result.html?success=true&bookingId=${data._id}&isGuest=true&paymentMethod=${paymentMethod.toUpperCase()}`;
            }
        } catch (error) {
            console.error('Guest booking error:', error);
            alert(error.message);
        } finally {
            payAndReserveBtn.disabled = false;
            updatePayButtonText();
        }
    }

    async function createLoggedInBooking(basePayload, inlineValues, paymentMethod) {
        payAndReserveBtn.disabled = true;
        payAndReserveBtn.classList.add('loading');
        updateButtonText(payAndReserveBtn, getBookingText().creatingBooking);

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    ...basePayload,
                    phoneNumber: inlineValues.phoneNumber,
                    vehicleRegistration: inlineValues.vehicleRegistration,
                    paymentMethod: paymentMethod.toUpperCase(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getBookingText().failedCreateBooking);
            }

            const data = await response.json();
            if (paymentMethod === 'bank_transfer') {
                window.location.href = `bank-transfer.html?bookingId=${data._id}&paymentMethod=BANK_TRANSFER`;
            } else {
                window.location.href = `payment-result.html?success=true&bookingId=${data._id}&paymentMethod=${paymentMethod.toUpperCase()}`;
            }
        } catch (error) {
            console.error('Logged in booking error:', error);
            alert(error.message || getBookingText().failedCreateBookingRetry);
            payAndReserveBtn.disabled = false;
            payAndReserveBtn.classList.remove('loading');
            updatePayButtonText();
        }
    }

    async function handleBookingSubmission() {
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        if (!startTime || !endTime || startTime >= endTime) {
            alert(getBookingText().selectValidTimes);
            return;
        }

        const payLaterChecked = document.getElementById('pay-later')?.checked;
        let selectedPaymentMethod = payLaterChecked ? 'pay_later' : document.querySelector('input[name="paymentMethod"]:checked')?.value;

        if (!selectedPaymentMethod) {
            alert(getBookingText().selectPaymentMethod);
            return;
        }

        const inlineValues = validateInlineFields();
        if (!inlineValues) {
            return;
        }

        const activeDropoff = document.getElementById('top-dropoff-input')?.value || dropoffParam || '';
        const activePickup = document.getElementById('top-pickup-input')?.value || pickupParam || activeDropoff;

        const basePayload = {
            spot: spotId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            bookingType: isValet ? 'valet' : 'standard',
            valetDetails: isValet ? {
                dropoffAddress: activeDropoff,
                pickupAddress: activePickup
            } : undefined,
            services: selectedServices.map(s => ({ name: s.name, price: s.price }))
        };

        if (!isLoggedIn) {
            if (selectedPaymentMethod === 'paypal') {
                await initiatePaypalCheckout({
                    payload: {
                        ...basePayload,
                        fullName: inlineValues.fullName,
                        email: inlineValues.email,
                        phoneNumber: inlineValues.phoneNumber,
                        guestPhoneNumber: inlineValues.phoneNumber,
                        vehicleRegistration: inlineValues.vehicleRegistration,
                    },
                    triggerButton: payAndReserveBtn,
                    defaultButtonText: getBookingText().completeBooking,
                });
                return;
            }

            await createGuestBooking(basePayload, inlineValues, selectedPaymentMethod);
            return;
        }

        if (selectedPaymentMethod === 'paypal') {
            await initiatePaypalCheckout({
                payload: {
                    ...basePayload,
                    phoneNumber: inlineValues.phoneNumber,
                    vehicleRegistration: inlineValues.vehicleRegistration,
                },
                token: userToken,
                triggerButton: payAndReserveBtn,
                defaultButtonText: getBookingText().payNow,
            });
            return;
        }

        await createLoggedInBooking(basePayload, inlineValues, selectedPaymentMethod);
    }

    // Autocomplete logic for top bar inputs
    function setupAutocomplete(inputEl, suggestionsBoxEl, urlParamName) {
        let debounceTimer;

        inputEl.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = inputEl.value.trim();

            if (!query) {
                suggestionsBoxEl.innerHTML = '';
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const response = await fetch(`${API_URL}/spots/autocomplete?q=${encodeURIComponent(query)}`);
                    if (!response.ok) return;

                    const suggestions = await response.json();
                    suggestionsBoxEl.innerHTML = '';

                    if (suggestions.length === 0) {
                        const noSuggest = document.createElement('div');
                        noSuggest.className = 'autocomplete-suggestion';
                        noSuggest.textContent = 'Không tìm thấy địa điểm';
                        suggestionsBoxEl.appendChild(noSuggest);
                        return;
                    }

                    suggestions.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'autocomplete-suggestion';
                        div.textContent = item.name || item.address;
                        div.addEventListener('click', () => {
                            inputEl.value = item.name || item.address;
                            suggestionsBoxEl.innerHTML = '';

                            const currentUrl = new URL(window.location.href);
                            currentUrl.searchParams.set(urlParamName, inputEl.value);

                            if (urlParamName === 'dropoff' && (item._id || item.id)) {
                                const newSpotId = item._id || item.id;
                                currentUrl.searchParams.set('id', newSpotId);
                                window.history.replaceState({}, '', currentUrl.toString());
                                spotId = newSpotId;
                                loadSpotDetails();
                            } else {
                                window.history.replaceState({}, '', currentUrl.toString());
                            }

                            updateTimeline();
                            updatePriceSummary();
                        });
                        suggestionsBoxEl.appendChild(div);
                    });
                } catch (err) {
                    console.error('Autocomplete fetch error:', err);
                }
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (e.target !== inputEl && !suggestionsBoxEl.contains(e.target)) {
                suggestionsBoxEl.innerHTML = '';
            }
        });
    }

    const topDropoffInput = document.getElementById('top-dropoff-input');
    const topPickupInput = document.getElementById('top-pickup-input');
    const topDropoffSuggestions = document.getElementById('top-dropoff-suggestions');
    const topPickupSuggestions = document.getElementById('top-pickup-suggestions');

    if (topDropoffInput && topDropoffSuggestions) {
        topDropoffInput.value = dropoffParam || '';
        setupAutocomplete(topDropoffInput, topDropoffSuggestions, 'dropoff');
        topDropoffInput.addEventListener('change', updateTimeline);
    }

    if (topPickupInput && topPickupSuggestions) {
        topPickupInput.value = pickupParam || dropoffParam || '';
        setupAutocomplete(topPickupInput, topPickupSuggestions, 'pickup');
        topPickupInput.addEventListener('change', updateTimeline);
    }

    if (isLoggedIn) {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (userData.fullName && guestFullnameInput) {
                guestFullnameInput.value = userData.fullName;
                guestFullnameInput.readOnly = true;
                guestFullnameInput.style.backgroundColor = '#f5f5f5';
                guestFullnameInput.style.cursor = 'not-allowed';
            }

            if (userData.email && guestEmailInput) {
                guestEmailInput.value = userData.email;
                guestEmailInput.readOnly = true;
                guestEmailInput.style.backgroundColor = '#f5f5f5';
                guestEmailInput.style.cursor = 'not-allowed';
            }

            if (userData.phone && phoneNumberInput) {
                phoneNumberInput.value = userData.phone;
            }
        } catch (error) {
            console.warn('Could not parse userData from localStorage:', error);
        }
    }

    paymentMethodRadios.forEach((radio) => {
        radio.addEventListener('change', updatePayButtonText);
    });

    const commonFlatpickrOptions = {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        minDate: 'today',
        altInput: true,
        altFormat: getFlatpickrAltFormat(),
        time_24hr: uses24HourClock(),
        disableMobile: true,
        onChange: updatePriceSummary,
        onReady(selectedDates, dateStr, instance) {
            addConfirmCancelButtons(instance);
        },
        onOpen: [],
        onClose(selectedDates, dateStr, instance) {
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
        },
    };

    arrivalFlatpickr = flatpickr(bookingArrivalDateInput, {
        ...commonFlatpickrOptions,
        placeholder: 'Select arrival date and time',
    });

    leavingFlatpickr = flatpickr(bookingLeavingDateInput, {
        ...commonFlatpickrOptions,
        placeholder: 'Select leaving date and time',
    });

    bookingArrivalDateInput.closest('.top-bar-field')?.addEventListener('click', (event) => {
        if (event.target !== bookingArrivalDateInput) {
            arrivalFlatpickr.open();
        }
    });
    bookingLeavingDateInput.closest('.top-bar-field')?.addEventListener('click', (event) => {
        if (event.target !== bookingLeavingDateInput) {
            leavingFlatpickr.open();
        }
    });

    payAndReserveBtn.addEventListener('click', handleBookingSubmission);

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#lang-en, #lang-vi')) {
            return;
        }

        window.setTimeout(() => {
            applyDynamicLanguageState();
        }, 0);
    });

    resetDurationDisplay();
    await loadSpotDetails();
}

window.selectPaymentRadio = function(id) {
    const radio = document.getElementById(id);
    if (!radio) return;
    radio.checked = true;

    const payLaterCheckbox = document.getElementById('pay-later');
    if (payLaterCheckbox) {
        payLaterCheckbox.checked = false;
    }

    document.querySelectorAll('.payment-option-row').forEach(row => {
        row.classList.remove('selected');
        const r = row.querySelector('input[type="radio"]');
        if (r && r.checked) {
            row.classList.add('selected');
        }
    });

    if (typeof window.triggerUpdatePayButtonText === 'function') {
        window.triggerUpdatePayButtonText();
    }
};

window.togglePayLaterCheckbox = function() {
    const payLaterCheckbox = document.getElementById('pay-later');
    if (!payLaterCheckbox) return;

    if (window.event && window.event.target.tagName === 'INPUT') {
        // Let natural checking happen
    } else {
        payLaterCheckbox.checked = !payLaterCheckbox.checked;
    }

    if (payLaterCheckbox.checked) {
        document.querySelectorAll('input[name="paymentMethod"]').forEach(r => {
            r.checked = false;
        });
        document.querySelectorAll('.payment-option-row').forEach(row => {
            row.classList.remove('selected');
        });
    } else {
        const bankRadio = document.getElementById('pay-bank-transfer');
        if (bankRadio) {
            bankRadio.checked = true;
            const parentRow = bankRadio.closest('.payment-option-row');
            if (parentRow) parentRow.classList.add('selected');
        }
    }

    if (typeof window.triggerUpdatePayButtonText === 'function') {
        window.triggerUpdatePayButtonText();
    }
};
