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
    let lastPreviewQuery = '';
    
    // Default dates initialization
    const now = new Date();
    const defaultStart = roundTimeToNext30Minutes(now);
    const defaultEnd = new Date(defaultStart.getTime() + 30 * 60 * 1000); // 30 mins later

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
                    window.location.href = `/customer/spot-details?id=${item.id}`;
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

    // Helper function to fetch and display suggestions
    const fetchAndShowSuggestions = async (query) => {
        try {
            // Use global API_URL from config.js
            const response = await fetch(`${API_URL}/spots/autocomplete?q=${encodeURIComponent(query)}`);
            const suggestions = await response.json();
            displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    locationInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = locationInput.value;
        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        debounceTimer = setTimeout(() => {
            fetchAndShowSuggestions(query);
        }, 300);
    });

    // Fix: Show suggestions when clicking the input if it has value
    locationInput.addEventListener('click', () => {
        const query = locationInput.value;
        if (query.length >= 2) {
            fetchAndShowSuggestions(query);
        }
    });

    // Also handle focus event to show suggestions when tabbing into the field
    locationInput.addEventListener('focus', () => {
        const query = locationInput.value;
        if (query.length >= 2) {
            fetchAndShowSuggestions(query);
        }
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

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const mode = searchForm.getAttribute('data-mode') || 'pre';

        if (mode === 'valet') {
            const valetDropoff = document.getElementById('valet-dropoff');
            const valetPickup = document.getElementById('valet-pickup');
            const valetStart = document.getElementById('valet-start');
            const valetEnd = document.getElementById('valet-end');

            const dropoffText = valetDropoff?.value.trim() || '';
            // Nếu isDifferentReturn = false thì pickup = dropoff (cùng địa điểm)
            const pickupText = isDifferentReturn
                ? (valetPickup?.value.trim() || '')
                : dropoffText;
            const startVal = valetStart?.value || '';
            const endVal = valetEnd?.value || '';

            if (!dropoffText) {
                return alert('Vui lòng nhập địa điểm giao xe.');
            }
            if (isDifferentReturn && !pickupText) {
                return alert('Vui lòng nhập địa điểm trả xe.');
            }
            if (!startVal || !endVal) {
                return alert('Vui lòng chọn thời gian giao xe và trả xe.');
            }

            const startDate = parseVietnameseDateString(startVal);
            const endDate = parseVietnameseDateString(endVal);
            const now = new Date();

            if (!startDate || !endDate) {
                return alert('Định dạng ngày giờ không hợp lệ. Vui lòng dùng bộ chọn ngày.');
            }

            if (startDate < new Date(now.getTime() - 60000)) {
                alert('Thời gian giao xe phải là hiện tại hoặc trong tương lai.');
                return;
            }

            if (startDate >= endDate) {
                return alert('Thời gian kết thúc phải sau thời gian bắt đầu.');
            }

            const currentQuery = `${dropoffText}|${pickupText}|${startVal}|${endVal}`;
            const previewCardVisible = valetPricePreview && valetPricePreview.style.display === 'block';

            if (previewCardVisible && lastPreviewQuery === currentQuery) {
                const queryParams = new URLSearchParams({
                    id: valetDropoff?.dataset.spotId || '',
                    type: 'valet',
                    dropoff: dropoffText,
                    pickup: pickupText,
                    arrival: startDate.toISOString(),
                    leaving: endDate.toISOString()
                });
                window.location.href = `/customer/valet-offer?${queryParams.toString()}`;
            } else {
                await updateValetPricePreview();
                lastPreviewQuery = currentQuery;
            }
        } else {
            const locationText = locationInput.value.trim();
            const startVal = startInput.value;
            const endVal = endInput.value;

            if (!locationText || !startVal || !endVal) {
                return alert('Vui lòng điền đầy đủ địa điểm và thời gian.');
            }

            const startDate = parseVietnameseDateString(startVal);
            const endDate = parseVietnameseDateString(endVal);
            const now = new Date();

            if (!startDate || !endDate) {
                return alert('Định dạng ngày giờ không hợp lệ. Vui lòng dùng bộ chọn ngày.');
            }

            if (startDate < new Date(now.getTime() - 60000)) { // Trừ 1 phút để tránh lỗi do độ trễ
                alert('Thời gian đến phải là hiện tại hoặc trong tương lai.');
                startPicker.setDate(now, true);
                return;
            }

            if (startDate >= endDate) {
                return alert('Thời gian kết thúc phải sau thời gian bắt đầu.');
            }

            const queryParams = new URLSearchParams({
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                q: locationText
            });
            window.location.href = `/customer/results?${queryParams.toString()}`;
        }
    });

    // Cấu hình Flatpickr

    // Helper function to add Confirm button to Flatpickr (matching Figma style)
    function addConfirmCancelButtons(fp) {
        // Create Confirm button
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'flatpickr-confirm-btn';
        confirmBtn.textContent = 'XÁC NHẬN';
        confirmBtn.addEventListener('click', () => {
            fp.close();
            // Trigger price preview calculation if applicable
            if (fp.element.id === 'valet-start' || fp.element.id === 'valet-end') {
                updateValetPricePreview();
            }
        });

        // Append button to calendar
        fp.calendarContainer.appendChild(confirmBtn);
    }

    startPicker = flatpickr("#start-datetime", {
        enableTime: true,
        dateFormat: "d.m.y H:i",
        time_24hr: true,
        minDate: "today",
        defaultDate: defaultStart,
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
        dateFormat: "d.m.y H:i",
        time_24hr: true,
        minDate: "today",
        defaultDate: defaultEnd,
        onReady: function (selectedDates, dateStr, instance) {
            addConfirmCancelButtons(instance);
        },
        onOpen: []
    });

    // ============ V3: BOOKING TAB TOGGLE ============
    const tabPre = document.getElementById('tab-pre');
    const tabValet = document.getElementById('tab-valet');
    const preFields = document.getElementById('pre-fields');
    const valetFields = document.getElementById('valet-fields');
    const heroBg = document.getElementById('hero-bg');
    const bookingForm = document.getElementById('searchForm');

    function switchBookingTab(mode) {
        if (mode === 'valet') {
            tabPre?.classList.remove('active');
            tabValet?.classList.add('active');
            if (preFields) preFields.style.display = 'none';
            if (valetFields) valetFields.style.display = 'flex';
            heroBg?.classList.add('valet-mode');
            if (bookingForm) bookingForm.setAttribute('data-mode', 'valet');
            // Load default autocomplete valet data
            loadValetDropdownData();
        } else {
            tabValet?.classList.remove('active');
            tabPre?.classList.add('active');
            if (valetFields) valetFields.style.display = 'none';
            if (preFields) preFields.style.display = 'flex';
            heroBg?.classList.remove('valet-mode');
            if (bookingForm) bookingForm.setAttribute('data-mode', 'pre');
        }
    }

    tabPre?.addEventListener('click', () => switchBookingTab('pre'));
    tabValet?.addEventListener('click', () => switchBookingTab('valet'));

    // ============ V3: VALET DROPDOWN 2 CỘT & ĐIỂM TRẢ XE TOGGLE ============
    const valetDropoff = document.getElementById('valet-dropoff');
    const valetPickup = document.getElementById('valet-pickup');
    const valetDropoffContainer = document.getElementById('valet-dropoff-container');
    const valetPickupContainer = document.getElementById('valet-pickup-container');
    const toggleReturnLink = document.getElementById('toggle-return-link');
    const valetDropdown = document.getElementById('valet-dropdown');
    
    let isDifferentReturn = false;
    
    if (toggleReturnLink && valetPickupContainer && valetDropoffContainer) {
        toggleReturnLink.addEventListener('click', (e) => {
            e.preventDefault();
            isDifferentReturn = !isDifferentReturn;
            
            const pickupDivider = document.getElementById('pickup-divider');
            
            if (isDifferentReturn) {
                toggleReturnLink.textContent = '- Tôi muốn trả xe ở cùng địa điểm';
                valetPickupContainer.style.display = 'flex';
                valetDropoffContainer.classList.remove('full-width-v3');
                if (pickupDivider) pickupDivider.style.display = 'block';
            } else {
                toggleReturnLink.textContent = '+ Địa điểm trả xe khác';
                valetPickupContainer.style.display = 'none';
                valetDropoffContainer.classList.add('full-width-v3');
                if (pickupDivider) pickupDivider.style.display = 'none';
                if (valetDropoff && valetPickup) {
                    valetPickup.value = valetDropoff.value;
                    valetPickup.dataset.spotId = valetDropoff.dataset.spotId;
                }
            }
            updateValetPricePreview();
        });
    }

    let activeValetCategory = 'airport';
    let valetSearchQuery = '';

    async function loadValetDropdownData() {
        if (!valetDropdown) return;
        const contentBox = valetDropdown.querySelector('.valet-dropdown-content');
        if (!contentBox) return;

        contentBox.innerHTML = '<div class="valet-dropdown-no-data"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>';

        try {
            let url = `${API_URL}/spots/autocomplete?category=${activeValetCategory}`;
            if (valetSearchQuery.trim()) {
                url += `&q=${encodeURIComponent(valetSearchQuery)}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            contentBox.innerHTML = '';
            if (!data || data.length === 0) {
                contentBox.innerHTML = '<div class="valet-dropdown-no-data">Không tìm thấy bãi đỗ xe phù hợp.</div>';
                return;
            }

            data.forEach(spot => {
                const item = document.createElement('div');
                item.className = 'valet-dropdown-item';
                
                const nameOrAddress = spot.name || spot.address || '';
                const isAirport = /Sân bay|Airport/i.test(nameOrAddress);
                const isStation = /Ga |Nhà ga|Station/i.test(nameOrAddress);
                const isHospital = /Bệnh viện|Hospital/i.test(nameOrAddress);
                
                let iconHtml = '<i class="fas fa-car suggestion-item-icon"></i>';
                if (isAirport) iconHtml = '<i class="fas fa-plane suggestion-item-icon"></i>';
                else if (isStation) iconHtml = '<i class="fas fa-train suggestion-item-icon"></i>';
                else if (isHospital) iconHtml = '<i class="fas fa-hospital suggestion-item-icon"></i>';

                item.innerHTML = `
                    ${iconHtml}
                    <div class="valet-item-details">
                        <span class="valet-item-title">${spot.name || spot.address}</span>
                        <span class="valet-item-address">${spot.address}</span>
                    </div>
                `;
                
                item.onmousedown = (e) => {
                    e.preventDefault();
                    
                    const activeInput = document.activeElement;
                    if (activeInput && (activeInput.id === 'valet-dropoff' || activeInput.id === 'valet-pickup')) {
                        activeInput.value = spot.name;
                        activeInput.dataset.spotId = spot.id;
                        activeInput.dataset.hourlyRate = spot.hourlyRate || 20000;
                        
                        if (activeInput.id === 'valet-dropoff' && !isDifferentReturn) {
                            if (valetPickup) {
                                valetPickup.value = spot.name;
                                valetPickup.dataset.spotId = spot.id;
                            }
                        }
                    }
                    valetDropdown.classList.remove('show');
                    updateValetPricePreview();
                };

                contentBox.appendChild(item);
            });

        } catch (error) {
            console.error('Error fetching valet suggestions:', error);
            contentBox.innerHTML = '<div class="valet-dropdown-no-data">Đã xảy ra lỗi khi tải dữ liệu.</div>';
        }
    }

    if (valetDropdown) {
        const tabItems = valetDropdown.querySelectorAll('.valet-tab-item');
        tabItems.forEach(tab => {
            tab.addEventListener('mousedown', (e) => {
                e.preventDefault();
                tabItems.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeValetCategory = tab.dataset.category;
                loadValetDropdownData();
            });
        });
    }

    function setupValetInputEvents(inputEl) {
        if (!inputEl) return;
        
        inputEl.addEventListener('focus', () => {
            if (valetDropdown) {
                inputEl.parentElement.appendChild(valetDropdown);
                valetDropdown.classList.add('show');
                valetSearchQuery = inputEl.value;
                loadValetDropdownData();
            }
        });

        inputEl.addEventListener('blur', () => {
            if (valetDropdown) {
                setTimeout(() => valetDropdown.classList.remove('show'), 200);
            }
        });

        let valetDebounce;
        inputEl.addEventListener('input', () => {
            clearTimeout(valetDebounce);
            valetSearchQuery = inputEl.value;
            valetDebounce = setTimeout(() => {
                loadValetDropdownData();
            }, 300);
        });
    }

    setupValetInputEvents(valetDropoff);
    setupValetInputEvents(valetPickup);

    // ============ V3: BÁO GIÁ XEM TRƯỚC (VALET PRICE PREVIEW) ============
    const valetPricePreview = document.getElementById('valet-price-preview');
    const valetStart = document.getElementById('valet-start');
    const valetEnd = document.getElementById('valet-end');

    async function updateValetPricePreview() {
        if (!valetPricePreview) return;
        
        const spotId = valetDropoff?.dataset.spotId;
        const startTimeStr = valetStart?.value;
        const endTimeStr = valetEnd?.value;
        
        console.log('[DEBUG] updateValetPricePreview called with: spotId=' + spotId + ', start=' + startTimeStr + ', end=' + endTimeStr);

        if (!spotId || !startTimeStr || !endTimeStr) {
            console.log('[DEBUG] Missing parameters, hiding preview');
            valetPricePreview.style.display = 'none';
            return;
        }

        const startDate = parseVietnameseDateString(startTimeStr);
        const endDate = parseVietnameseDateString(endTimeStr);
        
        console.log('[DEBUG] Parsed dates:', { startDate, endDate });

        if (!startDate || !endDate || startDate >= endDate) {
            console.log('[DEBUG] Invalid dates or start >= end, hiding preview');
            valetPricePreview.style.display = 'none';
            return;
        }

        try {
            const url = `${API_URL}/spots/valet-price?spotId=${spotId}&startTime=${encodeURIComponent(startDate.toISOString())}&endTime=${encodeURIComponent(endDate.toISOString())}`;
            console.log('[DEBUG] Fetching price from URL:', url);
            const response = await fetch(url);
            console.log('[DEBUG] Response status:', response.status);
            const result = await response.json();
            console.log('[DEBUG] Response result:', result);

            if (result && result.status === 'success') {
                valetPricePreview.style.display = 'block';
                
                const days = result.days || 1;
                const totalPrice = result.totalPrice;
                const formattedPrice = totalPrice.toLocaleString('vi-VN') + ' đ';

                valetPricePreview.innerHTML = `
                    <div class="valet-price-preview-card">
                        <span class="preview-title">${days} ngày đỗ xe + đỗ xe hộ</span>
                        <span class="preview-amount">${formattedPrice}</span>
                        <span class="preview-average">trung bình 30.000 đ/ngày</span>
                    </div>
                `;
            } else {
                valetPricePreview.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching price preview:', error);
            valetPricePreview.style.display = 'none';
        }
    }

    // ============ V3: VALET DATE PICKERS ============
    let valetStartPicker, valetEndPicker;
    if (valetStart) {
        valetStartPicker = flatpickr(valetStart, {
            enableTime: true,
            dateFormat: "d.m.y H:i",
            time_24hr: true,
            minDate: "today",
            defaultDate: defaultStart,
            onChange: function (selectedDates) {
                if (selectedDates[0]) {
                    valetEndPicker.set('minDate', selectedDates[0]);
                }
                updateValetPricePreview();
            },
            onReady: function (selectedDates, dateStr, instance) {
                addConfirmCancelButtons(instance);
            },
            onOpen: []
        });
    }

    if (valetEnd) {
        valetEndPicker = flatpickr(valetEnd, {
            enableTime: true,
            dateFormat: "d.m.y H:i",
            time_24hr: true,
            minDate: "today",
            defaultDate: defaultEnd,
            onChange: function (selectedDates) {
                updateValetPricePreview();
            },
            onReady: function (selectedDates, dateStr, instance) {
                addConfirmCancelButtons(instance);
            },
            onOpen: []
        });
    }

    // ============ V3: ECOSYSTEM SLIDER ============
    const slides = document.querySelectorAll('.eco-slide');
    const dots = document.querySelectorAll('.eco-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    if (slides.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(parseInt(dot.dataset.index));
                slideInterval = setInterval(nextSlide, 4000);
            });
        });
        slideInterval = setInterval(nextSlide, 4000);
    }
});
