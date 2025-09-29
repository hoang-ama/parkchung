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
    function setStartToNowIfNeeded(forceIfPast = true) {
        const now = new Date();
        const current = parseVietnameseDateString(startInput.value);

        if (!current) {
            startPicker.setDate(now, true);
            return;
        }
        if (forceIfPast && current < now) {
            startPicker.setDate(now, true);
        }
    }

    function displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        suggestionsBox.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.className = 'suggestion-item';
            div.onclick = () => {
                locationInput.value = suggestion;
                suggestionsBox.style.display = 'none';
                setStartToNowIfNeeded(true);
            };
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    }

    // --- GẮN SỰ KIỆN ---
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
    startPicker = flatpickr("#start-datetime", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        time_24hr: true,
        minDate: "today",
        onChange: function(selectedDates) {
            if (selectedDates[0]) {
                endPicker.set('minDate', selectedDates[0]);
            }
        }
    });

    endPicker = flatpickr("#end-datetime", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        time_24hr: true,
        minDate: "today"
    });
});
