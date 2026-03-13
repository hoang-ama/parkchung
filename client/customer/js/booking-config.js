// File: client/customer/js/booking-config.js

const BOOKING_UI_TEXT = {
    en: {
        missingSpotId: 'Spot ID not found. Redirecting...',
        perHour: 'hour',
        hour: 'hour',
        hours: 'hours',
        minute: 'minute',
        minutes: 'minutes',
        payNow: 'Pay now and reserve',
        reserveNow: 'Reserve now, pay later',
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
        completeBooking: 'Complete Booking',
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
        payNow: 'Thanh toán và giữ chỗ',
        reserveNow: 'Đặt trước, thanh toán sau',
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
        completeBooking: 'Hoàn tất đặt chỗ',
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
    return getCurrentBookingLang() === 'vi' ? 'd/m/Y H:i' : 'F j, Y h:i K';
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
    const spotId = urlParams.get('id');
    const arrivalParam = urlParams.get('arrival');
    const leavingParam = urlParams.get('leaving');

    if (!spotId) {
        alert(getBookingText().missingSpotId);
        window.location.href = 'results.html';
        return;
    }

    initializeBookingConfigPage({ spotId, arrivalParam, leavingParam });
});

async function initializeBookingConfigPage({ spotId, arrivalParam, leavingParam }) {
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

    const userToken = localStorage.getItem('userToken');
    const isLoggedIn = Boolean(userToken);

    function updatePayButtonText() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];
        const text = getBookingText();

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            payAndReserveBtn.textContent = selectedMethod === 'cash' ? text.reserveNow : text.payNow;
            return;
        }

        const priceText = summaryFinalPrice.textContent;
        payAndReserveBtn.textContent = selectedMethod === 'cash'
            ? `${priceText} - ${text.reserveNow}`
            : `${priceText} - ${text.payNow}`;
    }

    function resetDurationDisplay() {
        summaryUnitPrice.textContent = `-- VND / ${getBookingText().perHour}`;
        summaryDuration.textContent = getCurrentBookingLang() === 'vi' ? '-- giờ' : '-- hours';
        summaryFinalPrice.textContent = formatCurrency(0);
        bookingDuration.textContent = '--';
        if (billedHoursElement) {
            billedHoursElement.textContent = getCurrentBookingLang() === 'vi' ? '-- giờ' : '-- hours';
        }
        payAndReserveBtn.disabled = true;
        updatePayButtonText();
    }

    async function updatePriceSummary() {
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            resetDurationDisplay();
            return;
        }

        const totalHours = Math.ceil(Math.abs(endTime - startTime) / 36e5);
        const diffMinutes = Math.floor(Math.abs(endTime - startTime) / 60000);
        const exactHours = Math.floor(diffMinutes / 60);
        const exactMinutes = diffMinutes % 60;

        summaryUnitPrice.textContent = `${Number(currentSpotData.hourlyRate || 0).toLocaleString('vi-VN')} VND / ${getBookingText().perHour}`;
        summaryDuration.textContent = formatBillableHours(totalHours);
        bookingDuration.textContent = formatExactDuration(exactHours, exactMinutes);
        if (billedHoursElement) {
            billedHoursElement.textContent = formatBillableHours(totalHours);
        }

        try {
            const response = await fetch(`${API_URL}/bookings/estimate-price`, {
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
            summaryFinalPrice.textContent = formatCurrency(data.estimatedPrice);
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

        recheckedTimeDisplay.textContent = new Date().toLocaleTimeString(getCurrentBookingLang() === 'vi' ? 'vi-VN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });

        updatePriceSummary();
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        timeRemaining = 15 * 60;

        countdownInterval = window.setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            recheckedTimeDisplay.textContent = new Date().toLocaleTimeString(getCurrentBookingLang() === 'vi' ? 'vi-VN' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = '00:00';
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
            spotAddressDisplay.textContent = currentSpotData.address;
            if (spotNameDisplay) {
                spotNameDisplay.textContent = currentSpotData.name || currentSpotData.address;
            }
            if (spotAddressTextDisplay) {
                spotAddressTextDisplay.textContent = currentSpotData.address;
            }

            if (spotThumbnail) {
                let imageUrl = '/assets/image/Spot Image Coming Soon.png';
                if (currentSpotData.images?.length) {
                    const firstImage = currentSpotData.images[0];
                    imageUrl = firstImage.startsWith('http')
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

            const trustpilotRatingValueEl = document.getElementById('trustpilot-rating-value');
            const trustpilotRatingStarsEl = document.getElementById('trustpilot-rating-stars');
            if (trustpilotRatingValueEl && trustpilotRatingStarsEl && currentSpotData.ggRating !== undefined) {
                setRatingDisplay(trustpilotRatingValueEl, trustpilotRatingStarsEl, currentSpotData.ggRating);
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

    async function createGuestCashBooking(basePayload, inlineValues) {
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
                    paymentMethod: 'CASH',
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
                paymentMethod: 'CASH',
                paymentStatus: data.paymentStatus || 'UNPAID',
                totalPrice: data.totalPrice || 0,
            };
            sessionStorage.setItem('guestBookingData', JSON.stringify(guestBookingData));

            alert(getBookingText().bookingCreatedEmail);
            window.location.href = `payment-result.html?success=true&bookingId=${data._id}&isGuest=true&paymentMethod=CASH`;
        } catch (error) {
            console.error('Cash booking error:', error);
            alert(error.message);
        } finally {
            payAndReserveBtn.disabled = false;
            updatePayButtonText();
        }
    }

    async function createLoggedInCashBooking(basePayload, inlineValues) {
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
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getBookingText().failedCreateBooking);
            }

            await response.json();
            alert(getBookingText().bookingCreatedCash);
            window.location.href = 'my-bookings.html';
        } catch (error) {
            console.error('Cash booking error:', error);
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

        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if (!selectedPaymentMethod) {
            alert(getBookingText().selectPaymentMethod);
            return;
        }

        const inlineValues = validateInlineFields();
        if (!inlineValues) {
            return;
        }

        const basePayload = {
            spot: spotId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
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

            await createGuestCashBooking(basePayload, inlineValues);
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

        await createLoggedInCashBooking(basePayload, inlineValues);
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

    bookingArrivalDateInput.closest('.booking-info-item')?.addEventListener('click', (event) => {
        if (event.target !== bookingArrivalDateInput) {
            arrivalFlatpickr.open();
        }
    });
    bookingLeavingDateInput.closest('.booking-info-item')?.addEventListener('click', (event) => {
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
