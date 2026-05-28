// File: client/customer/js/valet-offer.js

const OFFER_UI_TEXT = {
    en: {
        missingSpotId: 'Spot ID not found. Redirecting...',
        perDay: 'day',
        day: 'day',
        days: 'days',
        confirm: 'Confirm',
        cancel: 'Cancel',
        errorLabel: 'Error',
        failedEstimate: 'Failed to estimate price.',
        unableToCalculate: 'Could not calculate price',
        errorLoadingSpot: 'Error loading spot details',
        notAvailable: 'N/A',
        noServices: 'No services selected',
        parkingSpot: 'Parking Spot',
    },
    vi: {
        missingSpotId: 'Không tìm thấy ID bãi đỗ. Đang chuyển hướng...',
        perDay: 'ngày',
        day: 'ngày',
        days: 'ngày',
        confirm: 'Xác nhận',
        cancel: 'Hủy',
        errorLabel: 'Lỗi',
        failedEstimate: 'Không thể ước tính giá.',
        unableToCalculate: 'Không thể tính giá',
        errorLoadingSpot: 'Lỗi khi tải thông tin bãi đỗ',
        notAvailable: 'Không có',
        noServices: 'Chưa chọn dịch vụ nào',
        parkingSpot: 'Bãi đỗ xe',
    },
};

function getCurrentLang() {
    return localStorage.getItem('lang') || 'vi';
}

function getOfferText() {
    return OFFER_UI_TEXT[getCurrentLang()] || OFFER_UI_TEXT.en;
}

function getFlatpickrAltFormat() {
    return getCurrentLang() === 'vi' ? 'H:i - d/m/Y' : 'F j, Y h:i K';
}

function uses24HourClock() {
    return getCurrentLang() === 'vi';
}

function formatCurrency(amount) {
    return `${Number(amount || 0).toLocaleString('vi-VN')} VND`;
}

function addConfirmCancelButtons(flatpickrInstance) {
    let previousValue = flatpickrInstance.input.value;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flatpickr-button-container';

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'flatpickr-confirm-btn';
    confirmButton.textContent = getOfferText().confirm;
    confirmButton.addEventListener('click', () => {
        previousValue = flatpickrInstance.input.value;
        flatpickrInstance.close();
    });

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'flatpickr-cancel-btn';
    cancelButton.textContent = getOfferText().cancel;
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

function setRatingDisplay(valueElement, starsElement, rating) {
    const text = getOfferText();
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

document.addEventListener('DOMContentLoaded', () => {
    // Only run on valet-offer page
    if (!document.querySelector('.services-grid') || !window.location.pathname.includes('valet-offer')) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('id');
    const arrivalParam = urlParams.get('arrival');
    const leavingParam = urlParams.get('leaving');

    if (!spotId) {
        alert(getOfferText().missingSpotId);
        window.location.href = 'index.html';
        return;
    }

    initializeValetOfferPage({ spotId, arrivalParam, leavingParam });
});

async function initializeValetOfferPage({ spotId, arrivalParam, leavingParam }) {
    const urlParams = new URLSearchParams(window.location.search);
    const dropoffParam = urlParams.get('dropoff');
    const pickupParam = urlParams.get('pickup');

    let currentSpotData = null;
    let arrivalFlatpickr = null;
    let leavingFlatpickr = null;
    const selectedServices = [];

    // Load initial selection from sessionStorage if any
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

    const bookingArrivalDateInput = document.getElementById('booking-arrival-date-input');
    const bookingLeavingDateInput = document.getElementById('booking-leaving-date-input');
    const spotNameDisplay = document.getElementById('spot-name');
    const ratingStarsDisplay = document.getElementById('config-rating-stars');
    const ratingValueDisplay = document.getElementById('config-rating-value');
    
    const summaryDropoffAddr = document.getElementById('summary-dropoff-addr');
    const summaryPickupAddr = document.getElementById('summary-pickup-addr');
    const summaryDropoffTime = document.getElementById('summary-dropoff-time');
    const summaryPickupTime = document.getElementById('summary-pickup-time');
    const summaryParkingCost = document.getElementById('summary-parking-cost');
    const summaryFinalPrice = document.getElementById('summary-final-price');
    const summaryBreakdownText = document.getElementById('summary-breakdown-text');
    const btnNextStep = document.getElementById('btn-next-step');

    // Auto-select existing service cards from sessionStorage
    document.querySelectorAll('.service-item-card').forEach(card => {
        const serviceId = card.getAttribute('data-service-id');
        const isAlreadySelected = selectedServices.some(s => s.id === serviceId);

        const addBtn = card.querySelector('.service-add-btn');
        const checkBtn = card.querySelector('.service-check-btn');

        if (isAlreadySelected) {
            card.classList.add('selected');
            if (addBtn) addBtn.style.display = 'none';
            if (checkBtn) checkBtn.style.display = 'flex';
        }

        card.addEventListener('click', () => {
            const serviceName = card.getAttribute('data-service-name');
            const servicePriceVal = parseInt(card.getAttribute('data-service-price'), 10) || 0;
            const existingIndex = selectedServices.findIndex(s => s.id === serviceId);

            if (existingIndex > -1) {
                // Deselect
                selectedServices.splice(existingIndex, 1);
                card.classList.remove('selected');
                if (addBtn) addBtn.style.display = 'flex';
                if (checkBtn) checkBtn.style.display = 'none';
            } else {
                // Select
                selectedServices.push({ id: serviceId, name: serviceName, price: servicePriceVal });
                card.classList.add('selected');
                if (addBtn) addBtn.style.display = 'none';
                if (checkBtn) checkBtn.style.display = 'flex';
            }

            updatePriceSummary();
        });
    });

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

    async function updatePriceSummary() {
        const startTime = arrivalFlatpickr?.selectedDates[0];
        const endTime = leavingFlatpickr?.selectedDates[0];

        updateTimeline();

        if (!startTime || !endTime || startTime >= endTime || !currentSpotData) {
            if (summaryParkingCost) summaryParkingCost.textContent = '--';
            if (summaryFinalPrice) summaryFinalPrice.textContent = '--';
            if (btnNextStep) btnNextStep.disabled = true;
            return;
        }

        try {
            // Fetch valet price
            const response = await fetch(`${API_URL}/spots/valet-price?spotId=${spotId}&startTime=${encodeURIComponent(startTime.toISOString())}&endTime=${encodeURIComponent(endTime.toISOString())}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getOfferText().failedEstimate);
            }
            const data = await response.json();
            const basePrice = data.totalPrice;

            if (summaryParkingCost) {
                summaryParkingCost.textContent = formatCurrency(basePrice);
            }

            // Calculate services price
            const servicesPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
            const finalPrice = basePrice + servicesPrice;

            if (summaryFinalPrice) {
                summaryFinalPrice.textContent = formatCurrency(finalPrice);
            }

            // Update selected services summary list
            const servicesListContainer = document.getElementById('summary-selected-services-list');
            const summaryServicesSec = document.getElementById('summary-services-section');
            if (summaryServicesSec) {
                summaryServicesSec.style.display = selectedServices.length > 0 ? 'block' : 'none';
            }
            if (servicesListContainer) {
                servicesListContainer.innerHTML = '';
                selectedServices.forEach(s => {
                    const item = document.createElement('div');
                    item.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; background: #fff;';
                    item.innerHTML = `<span style="font-size:12px; font-weight:600; color:#1a1a2e;">${s.name}</span><span style="font-size:12px; font-weight:700; color:#4b5563;">${s.price.toLocaleString('vi-VN')}đ</span>`;
                    servicesListContainer.appendChild(item);
                });
            }

            if (summaryBreakdownText) {
                if (selectedServices.length === 0) {
                    summaryBreakdownText.textContent = 'Bãi đỗ + đỗ xe hộ';
                } else {
                    const serviceNames = selectedServices.map(s => s.name.toLowerCase()).join(', ');
                    summaryBreakdownText.textContent = 'Bãi đỗ + đỗ xe hộ + ' + serviceNames;
                }
            }

            if (btnNextStep) btnNextStep.disabled = false;
        } catch (error) {
            console.error('Error updating price:', error.message);
            if (summaryFinalPrice) summaryFinalPrice.textContent = getOfferText().errorLabel;
            if (btnNextStep) btnNextStep.disabled = true;
        }
    }

    async function loadSpotDetails() {
        try {
            const response = await fetch(`${API_URL}/spots/${spotId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || getOfferText().errorLoadingSpot);
            }

            currentSpotData = await response.json();
            if (spotNameDisplay) {
                spotNameDisplay.textContent = currentSpotData.name || currentSpotData.address;
            }

            if (ratingValueDisplay && ratingStarsDisplay && currentSpotData.ggRating !== undefined) {
                setRatingDisplay(ratingValueDisplay, ratingStarsDisplay, currentSpotData.ggRating);
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

            updatePriceSummary();
        } catch (error) {
            console.error('Error loading spot details:', error);
            alert(`${getOfferText().errorLoadingSpot}: ${error.message}`);
        }
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

    const commonFlatpickrOptions = {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        minDate: 'today',
        altInput: true,
        altFormat: getFlatpickrAltFormat(),
        time_24hr: uses24HourClock(),
        disableMobile: true,
        onChange: () => {
            // Update URL params
            const currentUrl = new URL(window.location.href);
            if (arrivalFlatpickr?.selectedDates[0]) {
                currentUrl.searchParams.set('arrival', arrivalFlatpickr.selectedDates[0].toISOString());
            }
            if (leavingFlatpickr?.selectedDates[0]) {
                currentUrl.searchParams.set('leaving', leavingFlatpickr.selectedDates[0].toISOString());
            }
            window.history.replaceState({}, '', currentUrl.toString());

            updatePriceSummary();
        },
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

            // Sync URL params
            const currentUrl = new URL(window.location.href);
            if (arrivalFlatpickr?.selectedDates[0]) {
                currentUrl.searchParams.set('arrival', arrivalFlatpickr.selectedDates[0].toISOString());
            }
            if (leavingFlatpickr?.selectedDates[0]) {
                currentUrl.searchParams.set('leaving', leavingFlatpickr.selectedDates[0].toISOString());
            }
            window.history.replaceState({}, '', currentUrl.toString());

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

    // Handle next step button click
    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            // Save selected services
            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            
            // Redirect to booking-config
            const currentUrl = new URL(window.location.href);
            const configUrl = `booking-config.html?${currentUrl.searchParams.toString()}`;
            window.location.href = configUrl;
        });
    }

    await loadSpotDetails();
}
