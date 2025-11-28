// File: client/customer/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;

    const locationInput = document.getElementById('location');
    const suggestionsBox = document.getElementById('suggestions-box');
    const startInput = document.getElementById('start-datetime');
    const endInput = document.getElementById('end-datetime');
    let debounceTimer;
    let startPicker, endPicker;

    // --- CÁC HÀM XỬ LÝ ---

    /**
     * Rounds the current time to the next 30-minute or hour mark
     * Rules:
     * - If minutes are 0-30: round to :30 of current hour
     * - If minutes are 31-59: round to :00 of next hour
     */
    function roundTimeToNext30Minutes(date) {
        const rounded = new Date(date);
        const minutes = rounded.getMinutes();

        if (minutes <= 30) {
            // Round to :30 of current hour
            rounded.setMinutes(30);
        } else {
            // Round to :00 of next hour
            rounded.setHours(rounded.getHours() + 1);
            rounded.setMinutes(0);
        }

        rounded.setSeconds(0);
        rounded.setMilliseconds(0);

        return rounded;
    }

    function setStartToNowIfNeeded(forceIfPast = true) {
        const now = new Date();
        const roundedNow = roundTimeToNext30Minutes(now);
        const current = parseVietnameseDateString(startInput.value);

        if (!current) {
            startPicker.setDate(roundedNow, true);
            return;
        }
        if (forceIfPast && current < now) {
            startPicker.setDate(roundedNow, true);
        }
    }

    function displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        suggestionsBox.innerHTML = '';

        // Group suggestions
        const standardSpots = suggestions.filter(s => s.type === 'standard');
        const airportSpots = suggestions.filter(s => s.type === 'airport');

        // Helper to render items
        const renderItems = (items) => {
            items.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.address;
                div.className = 'suggestion-item';
                // Use onmousedown instead of onclick to prevent race condition with blur event
                // mousedown fires BEFORE blur, ensuring navigation happens before suggestions are hidden
                div.onmousedown = (e) => {
                    e.preventDefault(); // Prevent blur from interfering
                    // Redirect directly to spot details page with the spot ID
                    // This allows users to select arrival/departure times on the details page
                    // Note: spot-details.js expects the parameter to be named 'id'
                    window.location.href = `spot-details.html?id=${item.id}`;
                };
                suggestionsBox.appendChild(div);
            });
        };

        // Render Standard Category
        if (standardSpots.length > 0) {
            const header = document.createElement('div');
            header.innerHTML = "<b><i class=\"fa-solid fa-location-dot\"></i> Địa điểm</b>";
            header.className = 'suggestion-category-header';
            suggestionsBox.appendChild(header);
            renderItems(standardSpots);
        }

        // Render Airport Category
        if (airportSpots.length > 0) {
            const header = document.createElement('div');
            header.innerHTML = "<b><i class=\"fa-solid fa-plane\"></i>Bãi đỗ sân bay</b>";
            header.className = 'suggestion-category-header';
            suggestionsBox.appendChild(header);
            renderItems(airportSpots);
        }

        suggestionsBox.style.display = 'block';
    }

    // --- GẮN SỰ KIỆN ---

    // Prevent Enter key from submitting form when typing in location input
    locationInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            suggestionsBox.style.display = 'none';
        }
    });

    locationInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = locationInput.value;
        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/spots/autocomplete?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();
                displaySuggestions(suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }, 300);
    });

    locationInput.addEventListener('blur', () => {
        // Thêm một khoảng trễ nhỏ trước khi ẩn hộp gợi ý.
        // Điều này cho phép sự kiện 'click' trên một mục gợi ý có đủ thời gian để thực thi.
        setTimeout(() => {
            suggestionsBox.style.display = 'none';
        }, 200); // 200 milliseconds delay

        // Vẫn giữ lại logic tự động điền thời gian
        if (locationInput.value.trim()) {
            setStartToNowIfNeeded();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const locationText = locationInput.value.trim();
        const startVal = startInput.value;
        const endVal = endInput.value;

        if (!locationText || !startVal || !endVal) {
            return alert('Please fill in all search fields.');
        }

        const startDate = parseVietnameseDateString(startVal);
        const endDate = parseVietnameseDateString(endVal);
        const now = new Date();

        if (!startDate || !endDate) {
            return alert('The date and time format is invalid. Please use the date picker.');
        }

        if (startDate < new Date(now.getTime() - 60000)) { // Trừ 1 phút để tránh lỗi do độ trễ
            alert('Arrival time must be in the present or future.');
            startPicker.setDate(now, true);
            return;
        }

        if (startDate >= endDate) {
            return alert('End time must be after the start time.');
        }

        const queryParams = new URLSearchParams({
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            q: locationText
        });
        window.location.href = `results.html?${queryParams.toString()}`;
    });

    // Cấu hình Flatpickr

    // Helper function to add Confirm/Cancel buttons to Flatpickr
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
                const parsedDate = parseVietnameseDateString(previousValue);
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

    startPicker = flatpickr("#start-datetime", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        time_24hr: true,
        minDate: "today",
        onChange: function (selectedDates) {
            if (selectedDates[0]) {
                endPicker.set('minDate', selectedDates[0]);
            }
        },
        onReady: function (selectedDates, dateStr, instance) {
            addConfirmCancelButtons(instance);
        },
        onOpen: []
    });

    endPicker = flatpickr("#end-datetime", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        time_24hr: true,
        minDate: "today",
        onReady: function (selectedDates, dateStr, instance) {
            addConfirmCancelButtons(instance);
        },
        onOpen: []
    });
});
