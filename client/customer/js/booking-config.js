// File: client/customer/js/booking-config.js

document.addEventListener('DOMContentLoaded', () => {
    // Only run if on booking-config.html
    if (!document.querySelector('.booking-grid') || !window.location.pathname.includes('booking-config')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id');
    const arrivalParam = urlParams.get('arrival');
    const leavingParam = urlParams.get('leaving');

    if (!spotId) {
        alert('Spot ID not found. Redirecting...');
        window.location.href = 'results.html';
        return;
    }

    initializeBookingConfigPage(spotId, arrivalParam, leavingParam);
});

async function initializeBookingConfigPage(spotId, arrivalParam, leavingParam) {
    let currentSpotData = null;
    let arrivalFlatpickr, leavingFlatpickr;
    let countdownInterval;

    // DOM Elements
    const bookingArrivalDateInput = document.getElementById('booking-arrival-date-input');
    const bookingLeavingDateInput = document.getElementById('booking-leaving-date-input');
    const bookingDuration = document.getElementById('booking-duration');
    const phoneNumberInput = document.getElementById('phone-number-input');
    const vehicleRegInput = document.getElementById('vehicle-reg-input');
    const payAndReserveBtn = document.getElementById('pay-and-reserve-btn');
    const spotAddressDisplay = document.getElementById('spot-address');
    const summaryFinalPrice = document.getElementById('summary-final-price');
    const recheckedTimeDisplay = document.getElementById('rechecked-time');
    const timerDisplay = document.getElementById('timer-display');
    const spotThumbnail = document.getElementById('spot-thumbnail');
    const spotNameDisplay = document.getElementById('spot-name');
    const spotAddressTextDisplay = document.getElementById('spot-address-display');

    // Guest-only fields
    const guestFullnameInput = document.getElementById('guest-fullname-input');
    const guestEmailInput = document.getElementById('guest-email-input');

    // --- LOGIN DETECTION & LAYOUT CONTROL ---
    const userToken = localStorage.getItem('userToken');
    const isLoggedIn = !!userToken;

    // Apply CSS class to body for conditional layout
    if (isLoggedIn) {
        document.body.classList.add('logged-in-layout');
        document.body.classList.remove('guest-layout');
    } else {
        document.body.classList.add('guest-layout');
        document.body.classList.remove('logged-in-layout');
    }

    console.log(`Booking Config - User ${isLoggedIn ? 'logged in' : 'not logged in (guest)'}, layout class applied.`);

    // --- AUTO-FILL USER DATA FOR LOGGED-IN USERS ---
    if (isLoggedIn) {
        try {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            if (userData.phone && phoneNumberInput) {
                phoneNumberInput.value = userData.phone;
                console.log('Auto-filled phone number from user data.');
            }
        } catch (e) {
            console.warn('Could not parse userData from localStorage:', e);
        }
    }

    // --- UTILITY FUNCTIONS ---

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

        const summaryUnitPrice = document.getElementById('summary-unit-price');
        const summaryDuration = document.getElementById('summary-duration');

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            summaryUnitPrice.textContent = '-- VND / hour';
            summaryDuration.textContent = '-- hours';
            summaryFinalPrice.textContent = formatCurrency(0);
            updatePayButtonText();
            payAndReserveBtn.disabled = true;
            bookingDuration.textContent = '--';
            return;
        }

        const totalHours = Math.ceil(Math.abs(endTime - startTime) / 36e5);

        summaryUnitPrice.textContent = `${currentSpotData.hourlyRate.toLocaleString('vi-VN')} VND / hour`;
        summaryDuration.textContent = `${totalHours} hour${totalHours > 1 ? 's' : ''}`;
        // Use the same billable hours on the left side for consistency
        bookingDuration.textContent = `${totalHours} hour${totalHours > 1 ? 's' : ''}`;

        try {
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

            summaryFinalPrice.textContent = formatCurrency(estimatedPrice);
            updatePayButtonText();
            payAndReserveBtn.disabled = false;
        } catch (error) {
            console.error('Error updating price:', error.message);
            alert(`Could not calculate price: ${error.message}`);
            summaryFinalPrice.textContent = 'Error';
            payAndReserveBtn.disabled = true;
        }
    }

    // --- PAYMENT METHOD HANDLING ---
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });

    function handlePaymentMethodChange(e) {
        updatePayButtonText();
    }

    function updatePayButtonText() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            payAndReserveBtn.textContent = selectedMethod === 'cash' ? 'Reserve now, pay later' : 'Pay now and reserve';
            return;
        }

        const priceText = summaryFinalPrice.textContent;

        if (selectedMethod === 'paypal') {
            payAndReserveBtn.textContent = `${priceText} - Pay now and reserve`;
        } else if (selectedMethod === 'cash') {
            payAndReserveBtn.textContent = `${priceText} - Reserve now, pay later`;
        }
    }

    // --- FLATPICKR BUTTONS HELPER ---
    function addConfirmCancelButtons(fp) {
        let previousValue = fp.input.value;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flatpickr-button-container';

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'flatpickr-confirm-btn';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.addEventListener('click', () => {
            previousValue = fp.input.value;
            fp.close();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'flatpickr-cancel-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            if (previousValue) {
                fp.input.value = previousValue;
                const parsedDate = fp.parseDate(previousValue, fp.config.altFormat);
                if (parsedDate) {
                    fp.setDate(parsedDate, false);
                }
            }
            fp.close();
        });

        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        fp.calendarContainer.appendChild(buttonContainer);

        fp.config.onOpen.push(() => {
            previousValue = fp.input.value;
        });
    }

    // --- INITIALIZE FLATPICKR ---
    const commonFlatpickrOptions = {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        altInput: true,
        altFormat: "F j, Y h:i K",
        time_24hr: false,
        disableMobile: true,
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

    // Enhance date picker UX
    const arrivalContainer = bookingArrivalDateInput.closest('.booking-info-item');
    const leavingContainer = bookingLeavingDateInput.closest('.booking-info-item');

    if (arrivalContainer) {
        arrivalContainer.style.cursor = 'pointer';
        arrivalContainer.addEventListener('click', (e) => {
            if (e.target !== bookingArrivalDateInput) {
                arrivalFlatpickr.open();
            }
        });
    }

    if (leavingContainer) {
        leavingContainer.style.cursor = 'pointer';
        leavingContainer.addEventListener('click', (e) => {
            if (e.target !== bookingLeavingDateInput) {
                leavingFlatpickr.open();
            }
        });
    }

    // --- COUNTDOWN TIMER ---
    let timeRemaining = 15 * 60;

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

    // --- LOAD SPOT DETAILS ---
    async function loadSpotDetails() {
        try {
            const response = await fetch(`${API_URL}/spots/${spotId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch spot details.');
            }
            currentSpotData = await response.json();

            // Update displays
            spotAddressDisplay.textContent = currentSpotData.address;
            if (spotNameDisplay) spotNameDisplay.textContent = currentSpotData.name || currentSpotData.address;
            if (spotAddressTextDisplay) spotAddressTextDisplay.textContent = currentSpotData.address;

            // Handle spot thumbnail image
            if (spotThumbnail) {
                let imageUrl = '/assets/image/parking-area.jpg'; // Default fallback

                if (currentSpotData.images && currentSpotData.images.length > 0) {
                    const firstImage = currentSpotData.images[0];
                    // Check if it's a full URL (Cloudinary) or a local path
                    if (firstImage.startsWith('http')) {
                        imageUrl = firstImage;
                    } else {
                        // Local path - prepend API base URL
                        imageUrl = API_URL.replace('/api', '') + firstImage;
                    }
                }

                spotThumbnail.src = imageUrl;

                // Add error handler to show fallback if image fails to load
                spotThumbnail.onerror = function () {
                    this.src = '/assets/image/parking-area.jpg';
                };
            }

            // Rating (dynamic from API data)
            const configRatingValueEl = document.getElementById('config-rating-value');
            const configRatingStarsEl = document.getElementById('config-rating-stars');
            if (configRatingValueEl && configRatingStarsEl && currentSpotData.ggRating !== undefined) {
                const rating = currentSpotData.ggRating || 0;
                configRatingValueEl.textContent = rating > 0 ? rating.toFixed(1) : 'N/A';

                // Generate star visualization
                const fullStars = Math.floor(rating);
                const hasHalfStar = (rating % 1) >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                let starsHTML = '★'.repeat(fullStars);
                if (hasHalfStar) starsHTML += '⯨';
                starsHTML += '☆'.repeat(emptyStars);

                configRatingStarsEl.textContent = starsHTML;
            }

            // Trustpilot rating badge (bottom of page)
            const trustpilotRatingValueEl = document.getElementById('trustpilot-rating-value');
            const trustpilotRatingStarsEl = document.getElementById('trustpilot-rating-stars');
            if (trustpilotRatingValueEl && trustpilotRatingStarsEl && currentSpotData.ggRating !== undefined) {
                const rating = currentSpotData.ggRating || 0;
                trustpilotRatingValueEl.textContent = rating > 0 ? rating.toFixed(1) : 'N/A';

                // Generate star visualization
                const fullStars = Math.floor(rating);
                const hasHalfStar = (rating % 1) >= 0.5;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                let starsHTML = '★'.repeat(fullStars);
                if (hasHalfStar) starsHTML += '⯨';
                starsHTML += '☆'.repeat(emptyStars);

                trustpilotRatingStarsEl.textContent = starsHTML;
            }

            // Set dates from URL params or defaults
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

    // --- BOOKING SUBMISSION ---
    payAndReserveBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('userToken');
        const startTime = arrivalFlatpickr.selectedDates[0];
        const endTime = leavingFlatpickr.selectedDates[0];

        if (!startTime || !endTime || startTime >= endTime) {
            alert('Please select valid arrival and leaving times.');
            return;
        }

        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        const basePayload = {
            spot: spotId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        // Guest checkout flow - Use inline fields instead of modal
        if (!token) {
            // Validate guest inline fields
            const guestFullname = (guestFullnameInput?.value || '').trim();
            const guestEmail = (guestEmailInput?.value || '').trim();
            const guestPhone = (phoneNumberInput?.value || '').trim();
            const vehicleReg = (vehicleRegInput?.value || '').trim();

            if (!guestFullname) {
                alert('Please enter your full name.');
                guestFullnameInput?.focus();
                return;
            }

            if (!guestEmail) {
                alert('Please enter your email address.');
                guestEmailInput?.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestEmail)) {
                alert('Please enter a valid email address.');
                guestEmailInput?.focus();
                return;
            }

            if (!guestPhone) {
                alert('Please enter your phone number.');
                phoneNumberInput?.focus();
                return;
            }

            if (!vehicleReg) {
                alert('Please enter your vehicle registration.');
                vehicleRegInput?.focus();
                return;
            }

            // Guest booking with inline fields
            if (selectedPaymentMethod === 'paypal') {
                await initiatePaypalCheckout({
                    payload: {
                        ...basePayload,
                        fullName: guestFullname,
                        email: guestEmail,
                        phoneNumber: guestPhone,
                        guestPhoneNumber: guestPhone,
                        vehicleRegistration: vehicleReg,
                    },
                    triggerButton: payAndReserveBtn,
                    defaultButtonText: 'Complete Booking',
                });
            } else if (selectedPaymentMethod === 'cash') {
                try {
                    payAndReserveBtn.disabled = true;
                    updateButtonText(payAndReserveBtn, 'Creating booking...');

                    const response = await fetch(`${API_URL}/bookings/guest`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...basePayload,
                            fullName: guestFullname,
                            email: guestEmail,
                            phoneNumber: guestPhone,
                            vehicleRegistration: vehicleReg,
                            paymentMethod: 'CASH',
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to create booking.');
                    }

                    const data = await response.json();

                    // Store guest booking data in sessionStorage for payment-result page
                    const guestBookingData = {
                        _id: data._id,
                        spotName: currentSpotData?.name || 'Parking Spot',
                        spotAddress: currentSpotData?.address || 'N/A',
                        customerName: guestFullname,
                        customerEmail: guestEmail,
                        customerPhone: guestPhone,
                        vehicleRegistration: vehicleReg,
                        startTime: basePayload.startTime,
                        endTime: basePayload.endTime,
                        orderTime: new Date().toISOString(),
                        bookingStatus: data.status || 'confirmed',
                        paymentMethod: 'CASH',
                        paymentStatus: data.paymentStatus || 'UNPAID',
                        totalPrice: data.totalPrice || 0,
                    };
                    sessionStorage.setItem('guestBookingData', JSON.stringify(guestBookingData));

                    alert('Booking created successfully! You will receive a confirmation email.');
                    window.location.href = `payment-result.html?success=true&bookingId=${data._id}&isGuest=true&paymentMethod=CASH`;
                } catch (error) {
                    console.error('Cash booking error:', error);
                    alert(error.message);
                } finally {
                    payAndReserveBtn.disabled = false;
                    updateButtonText(payAndReserveBtn, 'Complete Booking');
                }
            }
            return;
        }

        // Logged-in user flow
        const phoneNumber = phoneNumberInput.value.trim();
        if (!phoneNumber) {
            alert('Please enter your phone number.');
            return;
        }

        if (selectedPaymentMethod === 'paypal') {
            await initiatePaypalCheckout({
                payload: {
                    ...basePayload,
                    phoneNumber,
                },
                token,
                triggerButton: payAndReserveBtn,
            });
        } else if (selectedPaymentMethod === 'cash') {
            try {
                payAndReserveBtn.disabled = true;
                payAndReserveBtn.classList.add('loading');
                updateButtonText(payAndReserveBtn, 'Creating booking...');

                const response = await fetch(`${API_URL}/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...basePayload,
                        phoneNumber,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to create booking.');
                }

                const booking = await response.json();
                alert('Booking created successfully! You can pay at the parking spot.');
                window.location.href = 'my-bookings.html';
            } catch (error) {
                console.error('Cash booking error:', error);
                alert(error.message || 'Failed to create booking. Please try again.');
                payAndReserveBtn.disabled = false;
                payAndReserveBtn.classList.remove('loading');
                updatePayButtonText();
            }
        }
    });

    loadSpotDetails();
}
