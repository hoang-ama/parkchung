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
    // Variables cleaned up

    const spotMainImage = document.getElementById('spot-main-image');
    const imageCounter = document.getElementById('spot-image-counter');
    const prevImageBtn = document.querySelector('.spot-image-nav-btn.prev-btn');
    const nextImageBtn = document.querySelector('.spot-image-nav-btn.next-btn');
    let currentImageIndex = 0;

    const reserveNowBtn = document.getElementById('reserve-now-btn');

    // --- UTILITY FUNCTIONS REMOVED ---

    // --- LOGIC HIỂN THỊ ẢNH ---
    function updateSpotImageDisplay() {
        if (currentSpotData && currentSpotData.images && currentSpotData.images.length > 0) {
            spotMainImage.src = currentSpotData.images[currentImageIndex];
            spotMainImage.onerror = function () { this.onerror = null; this.src = '../assets/image/Spot Image Coming Soon.png'; };
            imageCounter.textContent = `${currentImageIndex + 1}/${currentSpotData.images.length}`;
            prevImageBtn.disabled = currentImageIndex === 0;
            nextImageBtn.disabled = currentImageIndex === currentSpotData.images.length - 1;
        } else {
            spotMainImage.src = '../assets/image/Spot Image Coming Soon.png'; // Ảnh mặc định
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

    // --- DATE & PAYMENT LOGIC REMOVED ---

    // --- POPULATE SPOT INFO SECTIONS ---
    function populateSpotInfo(spot) {
        // Spot Name
        const spotNameEl = document.getElementById('spot-name');
        if (spotNameEl) spotNameEl.textContent = spot.name || 'Bãi đỗ xe';

        // Address (full display)
        const spotAddressFull = document.getElementById('spot-address-full');
        if (spotAddressFull) spotAddressFull.innerHTML = `<span class="icon">📍</span> ${spot.address || 'Địa chỉ chưa có'}`;

        // Description
        const spotDescEl = document.getElementById('spot-description');
        if (spotDescEl) spotDescEl.textContent = spot.description || 'Chưa có mô tả cho bãi đỗ xe này.';

        // Operating Hours (structured operatingHours or legacy openTime fallback)
        const spotOpenTimeEl = document.getElementById('spot-open-time');
        const statusBadgeEl = document.getElementById('spot-status-badge');
        if (spotOpenTimeEl) {
            if (spot.operatingHours && spot.operatingHours.schedule && spot.operatingHours.schedule.length > 0) {
                // Render structured schedule (multi-slot compatible)
                const dayLabels = {
                    monday: 'Thứ 2', tuesday: 'Thứ 3', wednesday: 'Thứ 4',
                    thursday: 'Thứ 5', friday: 'Thứ 6', saturday: 'Thứ 7', sunday: 'Chủ nhật'
                };
                const jsDayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

                let html = '<div class="schedule-list">';
                spot.operatingHours.schedule.forEach(item => {
                    const label = dayLabels[item.day] || item.day;
                    if (item.isOpen) {
                        // Multi-slot: item.slots is an array, or fallback to legacy openAt/closeAt
                        let timeStr = '';
                        if (item.slots && Array.isArray(item.slots) && item.slots.length > 0) {
                            timeStr = item.slots.map(s => `${s.openAt} – ${s.closeAt}`).join(', ');
                        } else if (item.openAt && item.closeAt) {
                            timeStr = `${item.openAt} – ${item.closeAt}`;
                        }
                        html += `<div class="schedule-row"><span class="schedule-day">${label}</span><span class="schedule-time">${timeStr}</span></div>`;
                    } else {
                        html += `<div class="schedule-row schedule-closed"><span class="schedule-day">${label}</span><span class="schedule-time closed-label">Đóng cửa</span></div>`;
                    }
                });
                html += '</div>';
                if (spot.operatingHours.notes && spot.operatingHours.notes.trim()) {
                    html += `<div class="schedule-notes"><strong>📝 Ghi chú:</strong> ${spot.operatingHours.notes}</div>`;
                }
                spotOpenTimeEl.innerHTML = html;

                // Open Now / Closed Now badge
                if (statusBadgeEl) {
                    const now = new Date();
                    const todayKey = jsDayMap[now.getDay()];
                    const todaySchedule = spot.operatingHours.schedule.find(s => s.day === todayKey);
                    let isOpenNow = false;

                    if (todaySchedule && todaySchedule.isOpen) {
                        const currentMinutes = now.getHours() * 60 + now.getMinutes();
                        const slots = (todaySchedule.slots && Array.isArray(todaySchedule.slots))
                            ? todaySchedule.slots
                            : [{ openAt: todaySchedule.openAt, closeAt: todaySchedule.closeAt }];

                        isOpenNow = slots.some(slot => {
                            const [oh, om] = (slot.openAt || '00:00').split(':').map(Number);
                            const [ch, cm] = (slot.closeAt || '23:59').split(':').map(Number);
                            return currentMinutes >= (oh * 60 + om) && currentMinutes <= (ch * 60 + cm);
                        });
                    }

                    statusBadgeEl.textContent = isOpenNow ? '🟢 Đang mở' : '🔴 Đóng cửa';
                    statusBadgeEl.className = `schedule-status-badge ${isOpenNow ? 'status-open' : 'status-closed'}`;
                }
            } else if (spot.openTime && spot.openTime.trim()) {
                // Legacy: plain text fallback
                const formattedHours = spot.openTime
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map(line => `<p class="hours-line">${line}</p>`)
                    .join('');
                spotOpenTimeEl.innerHTML = formattedHours || '<p>Chưa có giờ hoạt động.</p>';
                if (statusBadgeEl) statusBadgeEl.style.display = 'none';
            } else {
                spotOpenTimeEl.innerHTML = '<p>Chưa có giờ hoạt động.</p>';
                if (statusBadgeEl) statusBadgeEl.style.display = 'none';
            }
        }

        // Rating (dynamic from API data)
        const ratingValueEl = document.getElementById('spot-rating-value');
        const ratingStarsEl = document.getElementById('spot-rating-stars');
        if (ratingValueEl && ratingStarsEl) {
            const rating = spot.ggRating || 0;
            ratingValueEl.textContent = rating > 0 ? rating.toFixed(1) : 'N/A';

            // Generate star visualization (full ★, half ☆, empty ☆)
            const fullStars = Math.floor(rating);
            const hasHalfStar = (rating % 1) >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            let starsHTML = '★'.repeat(fullStars);
            if (hasHalfStar) starsHTML += '⯨'; // Half star
            starsHTML += '☆'.repeat(emptyStars);

            ratingStarsEl.textContent = starsHTML;
        }

        // Location Map (OpenStreetMap embed)
        if (spot.location && spot.location.coordinates) {
            const [lng, lat] = spot.location.coordinates;
            const mapIframe = document.getElementById('spot-map-iframe');
            const mapLink = document.getElementById('spot-map-link');

            if (mapIframe && lat && lng) {
                // OpenStreetMap embed
                const bbox = `${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}`;
                mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
            }

            if (mapLink && lat && lng) {
                mapLink.href = `https://www.google.com/maps?q=${lat},${lng}`;
            }
        }

        // Hourly Rate
        const hourlyRateEl = document.getElementById('spot-hourly-rate');
        if (hourlyRateEl) {
            hourlyRateEl.textContent = spot.hourlyRate
                ? `${spot.hourlyRate.toLocaleString('vi-VN')} VND/giờ`
                : 'Liên hệ để biết giá';
        }

        // Monthly Rate
        const monthlyRateEl = document.getElementById('spot-monthly-rate');
        if (monthlyRateEl) {
            monthlyRateEl.textContent = spot.monthlyRate
                ? `${spot.monthlyRate.toLocaleString('vi-VN')} VND/tháng`
                : 'Không có';
        }

        // Number of Slots
        const slotsEl = document.getElementById('spot-slots');
        if (slotsEl) {
            slotsEl.textContent = 'Chưa xác định';
        }

        // Vehicle Types
        const vehicleTypesContainer = document.getElementById('vehicle-types-container');
        if (vehicleTypesContainer && spot.vehicleTypes) {
            const vehicleIcons = {
                'car': '🚗',
                'motorbike': '🏍️',
                'truck': '🚚'
            };
            const vehicleLabels = {
                'car': 'Ô tô',
                'motorbike': 'Xe máy',
                'truck': 'Xe tải nhỏ'
            };

            vehicleTypesContainer.innerHTML = spot.vehicleTypes.map(type => `
                <div class="vehicle-type-badge">
                    <span class="icon">${vehicleIcons[type] || '🚙'}</span>
                    <span>${vehicleLabels[type] || type}</span>
                </div>
            `).join('');
        }

        // Payment Methods
        const paymentMethodsContainer = document.getElementById('payment-methods-container');
        if (paymentMethodsContainer && spot.paymentMethods) {
            const paymentInfo = {
                'cash': { icon: '💵', name: 'Tiền mặt', desc: 'Thanh toán tại bãi' },
                'paypal': { icon: '💳', name: 'PayPal', desc: 'Thanh toán trực tuyến' }
            };

            paymentMethodsContainer.innerHTML = spot.paymentMethods.map(method => {
                const info = paymentInfo[method] || { icon: '💰', name: method, desc: '' };
                return `
                    <div class="payment-method-badge">
                        <span class="icon">${info.icon}</span>
                        <div class="badge-text">
                            <span class="badge-name">${info.name}</span>
                            <span class="badge-desc">${info.desc}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Services (from addOnServices field)
        const servicesContainer = document.getElementById('spot-services-container');
        if (servicesContainer) {
            const serviceInfo = {
                'valet': { icon: '🚗', label: 'Valet Parking' },
                'carwash': { icon: '🧼', label: 'Car Washing' },
                'ev_charging': { icon: '⚡', label: 'Electric Vehicle Charging' }
            };

            if (spot.addOnServices && spot.addOnServices.length > 0) {
                servicesContainer.innerHTML = spot.addOnServices.map(service => {
                    const info = serviceInfo[service] || { icon: '✓', label: service };
                    return `
                        <div class="service-badge">
                            <span class="icon">${info.icon}</span>
                            <span>${info.label}</span>
                        </div>
                    `;
                }).join('');
            } else {
                servicesContainer.innerHTML = `
                    <p class="no-services">No additional services available</p>
                `;
            }
        }
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

            // Populate all spot information sections
            populateSpotInfo(currentSpotData);

            updateSpotImageDisplay();

            // --- CONDITIONAL BUTTON DISPLAY ---
            // Check booking type: 'call' = call only, 'online' = website only, 'both' = both options

            // Check if spot has a price (hourlyRate)
            const hasPrice = currentSpotData.hourlyRate && currentSpotData.hourlyRate > 0;
            const bookingType = currentSpotData.bookingType || 'online'; // Default to online if not set

            // Force call-only if explicitly set to 'call' OR if NO PRICE is available
            const isCallOnly = bookingType === 'call' || !hasPrice;

            const allowsOnline = (bookingType === 'online' || bookingType === 'both') && hasPrice;
            const allowsCall = bookingType === 'call' || bookingType === 'both' || !hasPrice;

            const callToBookBtn = document.getElementById('call-to-book-btn');
            const callPhoneDisplay = document.getElementById('call-phone-display');
            const bookingFormSection = document.querySelector('.booking-form-section');
            const priceSummary = document.querySelector('.price-breakdown');

            // Get phone number: prefer contactPhone, then owner.phone
            const phoneNumber = currentSpotData.contactPhone || currentSpotData.owner?.phone || '';
            const isLoggedIn = !!localStorage.getItem('userToken');

            if (isCallOnly) {
                // CALL-ONLY SPOT: Show only Call button, hide online booking UI
                reserveNowBtn.style.display = 'none';

                if (callToBookBtn && phoneNumber) {
                    if (isLoggedIn) {
                        // LOGGED IN: Show full phone number and enable call
                        callToBookBtn.href = `tel:${phoneNumber}`;
                        if (callPhoneDisplay) {
                            callPhoneDisplay.textContent = `Call ${phoneNumber}`;
                        }
                    } else {
                        // NOT LOGGED IN: Mask phone number (show first 3 digits + xxxxxx)
                        const maskedPhone = phoneNumber.length > 3
                            ? phoneNumber.substring(0, 3) + 'xxxxxx'
                            : phoneNumber + 'xxxxxx';

                        if (callPhoneDisplay) {
                            callPhoneDisplay.textContent = `Call ${maskedPhone}`;
                        }
                        // Disable actual call - redirect to login
                        callToBookBtn.href = '#';
                        callToBookBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (confirm('Vui lòng đăng nhập để xem số điện thoại đầy đủ. Bạn có muốn đăng nhập ngay?')) {
                                window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
                            }
                        });
                    }
                    callToBookBtn.style.display = 'block';
                } else if (callToBookBtn) {
                    // No phone available - show a placeholder
                    if (callPhoneDisplay) callPhoneDisplay.textContent = 'Liên hệ để đặt chỗ';
                    callToBookBtn.style.display = 'block';
                    callToBookBtn.href = '#';
                    callToBookBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            alert('Vui lòng liên hệ chủ bãi để đặt chỗ.');
                        });
                }

                // Hide booking date pickers and price summary for call-only spots
                if (bookingFormSection) bookingFormSection.style.display = 'none';
                if (priceSummary) priceSummary.style.display = 'none';

                // Update unit price display to show "Call for price"
                const summaryUnitPrice = document.getElementById('summary-unit-price');
                if (summaryUnitPrice) summaryUnitPrice.textContent = 'Call for pricing';

            } else {
                // ONLINE BOOKING ALLOWED: Show Reserve button
                reserveNowBtn.style.display = 'block';
                reserveNowBtn.disabled = false; // Always enabled now
                if (callToBookBtn) callToBookBtn.style.display = 'none';
            }

            // Countdown removed

        } catch (error) {
            console.error('Error loading spot details:', error);
            alert(`Error loading spot details: ${error.message}`);
        }
    }

    // --- HELPER FUNCTIONS REMOVED ---

    // --- NAVIGATE TO BOOKING CONFIG PAGE ---

    reserveNowBtn.addEventListener('click', async () => {
        // Navigate to booking configuration page with spot ID and time parameters
        // Read the arrival/leaving times from URL params (passed from results page)
        const urlParams = new URLSearchParams(window.location.search);
        const arrivalParam = urlParams.get('arrival');
        const leavingParam = urlParams.get('leaving');
        const isValet = urlParams.get('type') === 'valet';

        const params = new URLSearchParams({
            id: spotId
        });

        // Pass along the arrival and leaving times if they exist
        if (arrivalParam) {
            params.set('arrival', arrivalParam);
        }
        if (leavingParam) {
            params.set('leaving', leavingParam);
        }
        if (isValet) {
            params.set('type', 'valet');
            params.set('dropoff', urlParams.get('dropoff') || '');
            params.set('pickup', urlParams.get('pickup') || '');
        }

        window.location.href = `booking-config.html?${params.toString()}`;
    });

    loadSpotDetails(); // Gọi khi initializeSpotBookingPage được gọi
}
