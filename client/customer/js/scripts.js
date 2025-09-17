// File: client/customer/js/scripts.js

/**
 * Chuyển đổi chuỗi ngày giờ từ định dạng "dd/mm/yyyy HH:ii" sang đối tượng Date.
 * @param {string} dateString - Chuỗi ngày giờ cần chuyển đổi.
 * @returns {Date|null} - Đối tượng Date hợp lệ hoặc null nếu thất bại.
 */
function parseVietnameseDateString(dateString) {
    const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
    if (!parts) return null;

    const day = parts[1];
    const month = parts[2];
    const year = parts[3];
    const hours = parts[4];
    const minutes = parts[5];

    // Tạo lại chuỗi theo định dạng chuẩn ISO (YYYY-MM-DDTHH:mm:ss)
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    return new Date(isoString);
}


document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api'; // Sử dụng port backend của bạn
    const searchForm = document.getElementById('searchForm');
    const locationInput = document.getElementById('location');
    const suggestionsBox = document.getElementById('suggestions-box');
    let debounceTimer;

    // --- 1. LOGIC GỢI Ý (AUTOCOMPLETE) ---
    if (locationInput && suggestionsBox) {
        locationInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = locationInput.value;

            if (query.length < 2) {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
                return;
            }

            // Kỹ thuật Debounce: Chờ 300ms sau khi người dùng ngừng gõ mới gửi request
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

        // Ẩn hộp gợi ý khi click ra ngoài
        document.addEventListener('click', function(event) {
            if (!locationInput.contains(event.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
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
            div.addEventListener('click', () => {
                locationInput.value = suggestion;
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    }

    // --- 2. LOGIC TÌM KIẾM KHI SUBMIT FORM ---
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const locationText = locationInput.value.trim();
            const startDateTimeValue = document.getElementById('start-datetime').value;
            const endDateTimeValue = document.getElementById('end-datetime').value;

            // Validation
            if (!locationText || !startDateTimeValue || !endDateTimeValue) {
                alert('Please fill in all search fields.');
                return;
            }

            const startDate = parseVietnameseDateString(startDateTimeValue);
            const endDate = parseVietnameseDateString(endDateTimeValue);

            if (!startDate || !endDate) {
                alert('The date and time format is invalid. Please use the date picker.');
                return;
            }

            if (startDate >= endDate) {
                alert('End time must be after the start time.');
                return;
            }

            // Tạo query params chỉ với các thông tin cần thiết
            const queryParams = new URLSearchParams({
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                q: locationText
            });

            window.location.href = `results.html?${queryParams.toString()}`;
        });
    }

    // --- 3. CẤU HÌNH LỊCH CHỌN NGÀY GIỜ (FLATPICKR) ---
    const datePickerOptions = {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
        time_24hr: true,
        minDate: "today" // Ngăn người dùng chọn ngày trong quá khứ
    };

    flatpickr("#start-datetime", datePickerOptions);
    flatpickr("#end-datetime", datePickerOptions);
});