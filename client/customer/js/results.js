// File: client/customer/js/results.js

import { api } from './apiService.js';

let mapInstance = null;
let centerMarker = null;
let radiusCircle = null;
let mapMarkers = [];

let searchCoords = null; // { lat, lng } sau khi geocode
let currentRadius = 1000; // Ban đầu 1km
let selectedSpotId = null;

let allSpots = [];
let filteredSpots = [];
let currentPage = 1;
const spotsPerPage = 6;
let currentSort = 'recommend'; // recommend, price, distance
let activeFilters = {
    vehicleTypes: [],
    bookingTypes: [],
    paymentMethods: []
};

// Helper function to get spot image from database or default placeholder
function getSpotImageUrl(spot) {
    if (spot && spot.images && spot.images.length > 0 && spot.images[0]) {
        return spot.images[0];
    }
    return '/assets/image/Spot Image Coming Soon.png';
}
window.getSpotImageUrl = getSpotImageUrl; // Make it available globally for inline onerror calls

document.addEventListener('DOMContentLoaded', async () => {
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl) return; // Chỉ chạy khi ở trang results.html

    // Cấu hình các bộ chọn ngày Flatpickr ở kết quả
    const now = new Date();
    const defaultStart = new Date(Math.ceil(now.getTime() / (30 * 60 * 1000)) * (30 * 60 * 1000));
    const defaultEnd = new Date(defaultStart.getTime() + 24 * 60 * 60 * 1000); // 1 ngày đỗ

    flatpickr("#results-start-time", {
        enableTime: true,
        dateFormat: "d.m.y H:i",
        time_24hr: true,
        defaultDate: defaultStart
    });

    flatpickr("#results-end-time", {
        enableTime: true,
        dateFormat: "d.m.y H:i",
        time_24hr: true,
        defaultDate: defaultEnd
    });

    // 1. Khởi tạo Leaflet Map (Tọa độ mặc định: Hồ Hoàn Kiếm, Hà Nội)
    initLeafletMap(21.0285, 105.8542);

    // 2. Phân tích tham số URL và thực hiện tìm kiếm ban đầu
    const params = new URLSearchParams(window.location.search);
    const locationQuery = params.get('q') || params.get('dropoff') || '';
    const startTime = params.get('startTime') || defaultStart.toISOString();
    const endTime = params.get('endTime') || defaultEnd.toISOString();

    // Điền lại các giá trị vào input
    const locationInput = document.getElementById('results-location-input');
    if (locationInput) locationInput.value = locationQuery;

    // Gán dữ liệu ngày giờ vào picker text
    document.getElementById('results-start-time').value = formatDateToVietnameseString(new Date(startTime));
    document.getElementById('results-end-time').value = formatDateToVietnameseString(new Date(endTime));

    // Thực hiện chu trình tìm kiếm
    if (locationQuery) {
        await executeNewSearch(locationQuery, startTime, endTime);
    } else {
        // Nếu không có địa điểm, hiển thị toàn bộ
        await loadAllSpotsFallback();
    }

    // 3. Đăng ký các trình lắng nghe sự kiện
    setupEventListeners();
    setupFilterListeners();
});

// --- KHỞI TẠO BẢN ĐỒ ---
function initLeafletMap(lat, lng) {
    if (mapInstance) return;
    
    mapInstance = L.map('leaflet-map', {
        zoomControl: false
    }).setView([lat, lng], 14);

    // Dùng cartodb basemaps đơn giản, sáng và hiện đại rất hợp ParkChung
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mapInstance);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
}

// --- THỰC HIỆN TÌM KIẾM MỚI ---
async function executeNewSearch(query, startTime, endTime) {
    try {
        showLoadingState();

        // Bước 1: Gọi API Geocoding để lấy tọa độ
        const geocodeRes = await fetch(`${API_URL}/spots/geocode?q=${encodeURIComponent(query)}`);
        if (!geocodeRes.ok) {
            throw new Error('Không thể phân tích vị trí này');
        }

        const coords = await geocodeRes.json();
        searchCoords = { lat: coords.lat, lng: coords.lng };

        // Di chuyển tâm bản đồ tới điểm tìm kiếm
        mapInstance.setView([searchCoords.lat, searchCoords.lng], 14);

        // Vẽ pin đỏ ở vị trí tâm
        if (centerMarker) mapInstance.removeLayer(centerMarker);
        const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        centerMarker = L.marker([searchCoords.lat, searchCoords.lng], { icon: redIcon }).addTo(mapInstance);

        // Bước 2: Thuật toán tăng bán kính (Radius Expansion)
        currentRadius = 1000; // Khởi đầu 1km
        let spots = [];
        
        while (currentRadius <= 10000) {
            console.log(`[SEARCH] Quét bán kính ${currentRadius}m...`);
            const searchParams = {
                lat: searchCoords.lat,
                lng: searchCoords.lng,
                radius: currentRadius,
                startTime,
                endTime
            };
            
            spots = await api.searchSpots(searchParams);
            if (spots && spots.length > 0) {
                break; // Tìm thấy ít nhất một kết quả, dừng tăng bán kính
            }
            currentRadius += 1000; // Tăng thêm 1km
        }

        allSpots = spots || [];
        
        // Vẽ vòng tròn bán kính trên bản đồ
        if (radiusCircle) mapInstance.removeLayer(radiusCircle);
        radiusCircle = L.circle([searchCoords.lat, searchCoords.lng], {
            radius: currentRadius,
            color: '#00B484',
            fillColor: '#00B484',
            fillOpacity: 0.12,
            weight: 1.5
        }).addTo(mapInstance);

        // Fit bound bản đồ cho khít vòng tròn
        mapInstance.fitBounds(radiusCircle.getBounds(), { padding: [20, 20] });

        // Áp dụng bộ lọc và sắp xếp
        applyFiltersAndSort();

    } catch (err) {
        showErrorState(err.message);
    }
}

// Fallback load all if no query is given
async function loadAllSpotsFallback() {
    try {
        showLoadingState();
        // Lấy tất cả bãi đỗ xe đã phê duyệt
        const spots = await api.searchSpots({
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        allSpots = spots || [];
        applyFiltersAndSort();
    } catch (err) {
        showErrorState(err.message);
    }
}

// --- RENDER BẢN ĐỒ VÀ BONG BÓNG GIÁ ---
function renderMapMarkers() {
    // Xóa các marker cũ
    mapMarkers.forEach(m => mapInstance.removeLayer(m));
    mapMarkers = [];

    filteredSpots.forEach(spot => {
        if (!spot.location || !spot.location.coordinates) return;
        const [lng, lat] = spot.location.coordinates;

        // Custom marker bong bóng giá
        const priceText = spot.hourlyRate ? `${(spot.hourlyRate / 1000).toFixed(0)}k` : 'Call';
        const isActive = spot._id === selectedSpotId;
        const activeClass = isActive ? 'active' : '';

        const bubbleIcon = L.divIcon({
            className: 'custom-leaflet-div-icon',
            html: `<div class="price-marker-bubble ${activeClass}">${priceText}đ</div>`,
            iconSize: [60, 30],
            iconAnchor: [30, 15]
        });

        const marker = L.marker([lat, lng], { icon: bubbleIcon }).addTo(mapInstance);
        marker.on('click', () => {
            selectSpot(spot._id);
        });

        mapMarkers.push(marker);
    });

    if (mapMarkers.length > 0) {
        const group = L.featureGroup(mapMarkers);
        mapInstance.fitBounds(group.getBounds().pad(0.15));
    }
}

// --- RENDER DANH SÁCH CARD TRÁI ---
function renderListPanel() {
    const listContainer = document.getElementById('results-scroll-container');
    listContainer.innerHTML = '';

    if (filteredSpots.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                <i class="fa-solid fa-circle-info" style="font-size: 32px; margin-bottom: 12px; color: #9ca3af;"></i>
                <p style="font-weight: 600;">Không tìm thấy bãi đỗ xe nào phù hợp trong khu vực quét.</p>
            </div>
        `;
        return;
    }

    // Phân trang
    const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);
    const startIndex = (currentPage - 1) * spotsPerPage;
    const endIndex = startIndex + spotsPerPage;
    const spotsToDisplay = filteredSpots.slice(startIndex, endIndex);

    spotsToDisplay.forEach(spot => {
        const distance = calculateHaversineDistance(
            searchCoords ? searchCoords.lat : 21.0285,
            searchCoords ? searchCoords.lng : 105.8542,
            spot.location.coordinates[1],
            spot.location.coordinates[0]
        );
        const walkTime = Math.round(distance * 12);

        const card = document.createElement('div');
        card.className = `spot-card-v3 ${spot._id === selectedSpotId ? 'selected-card' : ''}`;
        
        const imageUrl = getSpotImageUrl(spot);
        const rating = spot.ggRating ? spot.ggRating.toFixed(1) : '5.0';

        card.innerHTML = `
            <div class="spot-card-image-wrapper">
                <img src="${imageUrl}" alt="${spot.name}" onerror="this.onerror=null; this.src='/assets/image/Spot Image Coming Soon.png';">
            </div>
            <div class="spot-card-details-wrapper">
                <div class="spot-card-top-row">
                    <div class="spot-card-rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${rating}</span>
                    </div>
                    <div class="spot-card-price-block">
                        <div class="spot-card-price-value">${spot.hourlyRate.toLocaleString('vi-VN')}đ</div>
                        <div class="spot-card-price-unit">/tiếng</div>
                    </div>
                </div>
                <div class="spot-card-title">${spot.name || spot.address}</div>
                <div class="spot-card-meta-info">
                    <span>🚶 ${walkTime} phút</span>
                    <span>📍 ${distance.toFixed(1)} km</span>
                </div>
                <div class="spot-card-actions">
                    <button class="btn-card-detail" data-id="${spot._id}">Chi tiết</button>
                    <button class="btn-card-book" data-id="${spot._id}">Đặt ngay</button>
                </div>
            </div>
        `;

        // Click vào card để xem chi tiết và zoom bản đồ tới điểm đó
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                selectSpot(spot._id, true);
            }
        });

        // Đăng ký nút Detail và Book
        card.querySelector('.btn-card-detail').addEventListener('click', () => {
            selectSpot(spot._id, true);
        });

        card.querySelector('.btn-card-book').addEventListener('click', () => {
            navigateToBookingConfig(spot._id);
        });

        listContainer.appendChild(card);
    });

    renderPagination(totalPages);
}

// --- RENDER POPUP CHI TIẾT ĐÈ LÊN BẢN ĐỒ ---
function showDetailPopup(spot) {
    const popupPanel = document.getElementById('detail-popup-panel');
    popupPanel.innerHTML = '';

    const pageLayout = document.getElementById('results-page-layout');
    const isGridMode = pageLayout.classList.contains('grid-mode');

    // Manage backdrop overlay for grid mode
    let backdrop = document.getElementById('popup-modal-backdrop');
    if (isGridMode) {
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'popup-modal-backdrop';
            backdrop.className = 'popup-modal-backdrop-v3';
            document.body.appendChild(backdrop);
        }
        backdrop.style.display = 'block';
    } else {
        if (backdrop) backdrop.style.display = 'none';
    }

    const imageUrl = getSpotImageUrl(spot);
    const distance = searchCoords ? calculateHaversineDistance(
        searchCoords.lat, searchCoords.lng, spot.location.coordinates[1], spot.location.coordinates[0]
    ) : 0;
    const walkTime = Math.round(distance * 12);
    
    // Giả sử đỗ 2h để tính dự toán
    const estHours = 2;
    const totalPrice = spot.hourlyRate * estHours;

    popupPanel.innerHTML = `
        <div class="popup-carousel-header">
            <img class="popup-carousel-image" src="${imageUrl}" onerror="this.onerror=null; this.src='/assets/image/Spot Image Coming Soon.png';">
            <div class="popup-slots-badge">Còn ${spot.numberOfSlots || 5} chỗ trống</div>
            <button class="popup-btn-close" id="popup-btn-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="popup-nav-tabs" id="popup-nav-tabs">
            <button class="popup-tab active" data-tab="overview">Tổng quan</button>
            <button class="popup-tab" data-tab="reviews">Đánh giá</button>
        </div>
        <div class="popup-scroll-content" id="popup-scroll-content">
            <!-- Dynamic Content Area -->
        </div>
        <div class="popup-sticky-bottom">
            <button class="btn-popup-book-now" id="btn-popup-book-now">
                <i class="fa-solid fa-circle-check"></i>
                Đặt chỗ ngay
            </button>
        </div>
    `;

    popupPanel.style.display = 'flex';

    const contentArea = document.getElementById('popup-scroll-content');

    // Render Overview Tab Contents
    function renderOverviewTab() {
        const spotName = spot.name || spot.address || 'Bãi đỗ xe';
        const params = new URLSearchParams(window.location.search);
        const startTimeParam = params.get('startTime') || '';
        const endTimeParam = params.get('endTime') || '';
        const startDate = startTimeParam ? new Date(startTimeParam) : new Date();
        const endDate = endTimeParam ? new Date(endTimeParam) : new Date(Date.now() + 2*60*60*1000);
        const durationMs = endDate - startDate;
        const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
        const estimatedTotal = spot.hourlyRate * durationHours;

        contentArea.innerHTML = `
            <div class="popup-title-section">
                <h3>${spotName}</h3>
                <p><i class="fa-solid fa-location-dot font-primary"></i> Cách ${Math.round(distance * 1000)}m · <i class="fa-solid fa-person-walking"></i> ${walkTime} phút đi bộ</p>
            </div>

            <div class="popup-description-box" style="background:#f2f4f6;border-radius:8px;padding:16px 20px;margin:0;">
                <div style="font-size:13px;font-weight:700;color:#191c1e;margin-bottom:6px;font-family:'Manrope',sans-serif;">Giới thiệu</div>
                <p style="font-size:13px;color:#545f73;line-height:1.5;margin:0;">${spot.description || 'Bãi đỗ xe tiêu chuẩn. Có bảo vệ và camera an ninh. Phù hợp với nhiều loại phương tiện.'}</p>
            </div>

            <div class="popup-pricing-section">
                <div style="font-size:16px;font-weight:700;color:#191c1e;margin-bottom:12px;font-family:'Manrope',sans-serif;">Loại xe & Giá vé</div>
                <div class="popup-pricing-grid">
                    <div class="popup-pricing-card" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <i class="fa-solid fa-car" style="color:#00B484;"></i>
                            <span style="font-size:13px;font-weight:700;color:#191c1e;">Ô tô</span>
                        </div>
                        <div style="font-size:20px;font-weight:700;color:#191c1e;">${spot.hourlyRate ? spot.hourlyRate.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</div>
                        <div style="font-size:11px;color:#8e9ca9;">/tiếng</div>
                    </div>
                    <div class="popup-pricing-card" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <i class="fa-solid fa-motorcycle" style="color:#00B484;"></i>
                            <span style="font-size:13px;font-weight:700;color:#191c1e;">Xe máy</span>
                        </div>
                        <div style="font-size:20px;font-weight:700;color:#191c1e;">${spot.hourlyRate ? Math.round(spot.hourlyRate * 0.4).toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</div>
                        <div style="font-size:11px;color:#8e9ca9;">/tiếng</div>
                    </div>
                </div>
            </div>

            <div class="popup-payment-section">
                <div style="font-size:16px;font-weight:700;color:#191c1e;margin-bottom:12px;font-family:'Manrope',sans-serif;">Phương thức thanh toán</div>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border:1px solid #bdc9c1;border-radius:4px;background:#fff;">
                        <i class="fa-solid fa-money-bill-wave" style="color:#545f73;"></i>
                        <span style="font-size:13px;font-weight:600;color:#191c1e;">Tiền mặt</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border:1px solid #bdc9c1;border-radius:4px;background:#fff;">
                        <i class="fa-brands fa-paypal" style="color:#003087;"></i>
                        <span style="font-size:13px;font-weight:600;color:#191c1e;">PayPal</span>
                    </div>
                </div>
            </div>

            <div class="popup-amenities-section">
                <div style="font-size:16px;font-weight:700;color:#191c1e;margin-bottom:12px;font-family:'Manrope',sans-serif;">Dịch vụ đi kèm</div>
                <div class="popup-amenities-grid">
                    <div class="popup-amenity-item" style="padding:10px 16px;border:1px solid #bdc9c1;border-radius:4px;background:#fff;">
                        <div style="width:20px;text-align:center;"><i class="fa-solid fa-bolt" style="color:#545f73;"></i></div>
                        <span class="popup-amenity-text" style="font-size:13px;font-weight:600;color:#191c1e;">Trạm sạc xe điện (EV)</span>
                    </div>
                    <div class="popup-amenity-item" style="padding:10px 16px;border:1px solid #bdc9c1;border-radius:4px;background:#fff;">
                        <div style="width:20px;text-align:center;"><i class="fa-solid fa-car-burst" style="color:#545f73;"></i></div>
                        <span class="popup-amenity-text" style="font-size:13px;font-weight:600;color:#191c1e;">Rửa xe cao cấp</span>
                    </div>
                </div>
            </div>

            <!-- Booking Summary Box (Đơn hàng của bạn) -->
            <div class="popup-booking-summary-box">
                <div style="font-size:14px;font-weight:700;color:#00B484;text-align:center;margin-bottom:16px;letter-spacing:0.5px;">ĐƠN HÀNG CỦA BẠN</div>
                <div style="border:1px solid #8e9ca9;border-radius:4px;padding:16px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span style="font-size:13px;color:#8e9ca9;font-weight:600;">Địa điểm:</span>
                        <span style="font-size:13px;font-weight:700;color:#111;text-align:right;max-width:60%;">${spotName}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span style="font-size:13px;color:#8e9ca9;font-weight:600;">Đỗ từ:</span>
                        <span style="font-size:13px;font-weight:600;color:#111;">${startDate.toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'})}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                        <span style="font-size:13px;color:#8e9ca9;font-weight:600;">Lấy xe:</span>
                        <span style="font-size:13px;font-weight:600;color:#111;">${endDate.toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'})}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #e5e7eb;">
                        <span style="font-size:14px;color:#8e9ca9;font-weight:700;">Bãi đỗ (${durationHours} tiếng)</span>
                        <span style="font-size:15px;font-weight:800;color:#111;">${estimatedTotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
            </div>

            <div class="popup-total-box" style="border:1px solid #8e9ca9;border-radius:4px;padding:12px 16px;">
                <div style="font-size:14px;font-weight:700;color:#00B484;text-align:center;margin-bottom:10px;">TỔNG TIỀN</div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;color:#8e9ca9;font-weight:700;">Bãi đỗ (${durationHours} tiếng)</span>
                    <span style="font-size:18px;font-weight:800;color:#00B484;">${estimatedTotal.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
        `;
    }

    // Render Reviews Tab Contents
    function renderReviewsTab() {
        contentArea.innerHTML = `
            <div class="popup-reviews-header-v3">
                <div class="reviews-rating-big">
                    <span class="rating-big-value">4.5</span>
                    <span class="rating-big-label">trên 5.0</span>
                </div>
                <div class="reviews-rating-details">
                    <span class="rating-count-label">4.5 <i class="fa-solid fa-star" style="color: #2DC989;"></i> (10 lượt đánh giá)</span>
                    <div class="rating-stars-bars">
                        <div class="stars-bar-item"><span>5 <i class="fa-solid fa-star"></i></span><div class="bar-bg"><div class="bar-fill" style="width: 80%;"></div></div></div>
                        <div class="stars-bar-item"><span>4 <i class="fa-solid fa-star"></i></span><div class="bar-bg"><div class="bar-fill" style="width: 15%;"></div></div></div>
                        <div class="stars-bar-item"><span>3 <i class="fa-solid fa-star"></i></span><div class="bar-bg"><div class="bar-fill" style="width: 5%;"></div></div></div>
                    </div>
                </div>
            </div>

            <div class="popup-section-title" style="margin-top: 10px;">Lượt đánh giá</div>

            <div class="reviews-list-container-v3">
                <div class="review-item-v3">
                    <div class="review-item-user-row">
                        <div class="review-user-avatar">MN</div>
                        <div class="review-user-info-v3">
                            <span class="review-user-name">Minh Nguyen</span>
                            <div class="review-stars-row">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                <span class="review-time-v3">hôm qua</span>
                            </div>
                        </div>
                    </div>
                    <p class="review-text-content-v3">Bãi đỗ xe sạch sẽ, bảo vệ nhiệt tình. Dễ tìm thấy chỗ đậu xe vào buổi sáng.</p>
                </div>

                <div class="review-item-v3">
                    <div class="review-item-user-row">
                        <div class="review-user-avatar">MN</div>
                        <div class="review-user-info-v3">
                            <span class="review-user-name">Minh Nguyen</span>
                            <div class="review-stars-row">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                <span class="review-time-v3">2 ngày trước</span>
                            </div>
                        </div>
                    </div>
                    <p class="review-text-content-v3">Bãi đỗ xe sạch sẽ, bảo vệ nhiệt tình. Dễ tìm thấy chỗ đậu xe vào buổi sáng.</p>
                </div>
            </div>
        `;
    }

    // Initial load
    renderOverviewTab();

    // Tab switching event registration
    const tabButtons = document.getElementById('popup-nav-tabs').querySelectorAll('.popup-tab');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const activeTab = btn.dataset.tab;
            if (activeTab === 'reviews') {
                renderReviewsTab();
            } else {
                renderOverviewTab();
            }
        });
    });

    // Close popup
    document.getElementById('popup-btn-close').addEventListener('click', () => {
        popupPanel.style.display = 'none';
        if (backdrop) backdrop.style.display = 'none';
        selectedSpotId = null;
        renderMapMarkers();
        renderListPanel();
    });

    // Bấm đặt chỗ
    document.getElementById('btn-popup-book-now').addEventListener('click', () => {
        if (backdrop) backdrop.style.display = 'none';
        navigateToBookingConfig(spot._id);
    });
}

// --- TIẾN HÀNH CHỌN SPOT ---
function selectSpot(spotId, panTo = false) {
    selectedSpotId = spotId;
    
    // Tìm bãi đỗ tương ứng
    const spot = allSpots.find(s => s._id === spotId);
    if (!spot) return;

    if (panTo && mapInstance) {
        const [lng, lat] = spot.location.coordinates;
        mapInstance.setView([lat, lng], 15);
    }

    renderMapMarkers();
    renderListPanel();
    showDetailPopup(spot);
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {
    // 1. Autocomplete tìm kiếm
    const locationInput = document.getElementById('results-location-input');
    const suggestionsBox = document.getElementById('results-suggestions-box');
    let debounceTimer;

    locationInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = locationInput.value.trim();
        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/spots/autocomplete?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                
                suggestionsBox.innerHTML = '';
                if (data.length === 0) {
                    suggestionsBox.style.display = 'none';
                    return;
                }

                data.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'suggestion-item-v3';
                    itemDiv.textContent = item.address;
                    itemDiv.onmousedown = (e) => {
                        e.preventDefault();
                        locationInput.value = item.name || item.address;
                        suggestionsBox.style.display = 'none';
                        triggerSearchExecution();
                    };
                    suggestionsBox.appendChild(itemDiv);
                });
                suggestionsBox.style.display = 'block';

            } catch (err) {
                console.error('Error autocomplete results:', err);
            }
        }, 300);
    });

    locationInput.addEventListener('blur', () => {
        setTimeout(() => { suggestionsBox.style.display = 'none'; }, 200);
    });

    // 2. Nhấn Enter để execute geocoding và search
    locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            suggestionsBox.style.display = 'none';
            triggerSearchExecution();
        }
    });

    document.getElementById('btn-search-execute').addEventListener('click', triggerSearchExecution);

    // 3. Layout Switcher
    const layoutToggle = document.getElementById('layout-toggle-container');
    const pageLayout = document.getElementById('results-page-layout');
    
    layoutToggle.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            layoutToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const mode = btn.dataset.mode;
            if (mode === 'grid') {
                pageLayout.classList.remove('map-mode');
                pageLayout.classList.add('grid-mode');
            } else {
                pageLayout.classList.remove('grid-mode');
                pageLayout.classList.add('map-mode');
                if (mapInstance) {
                    setTimeout(() => mapInstance.invalidateSize(), 200);
                }
            }
            currentPage = 1;
            renderListPanel();
        });
    });

    // 4. Sắp xếp
    document.querySelectorAll('.sort-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            currentPage = 1;
            applyFiltersAndSort();
        });
    });
}

// Setup sidebar filter listeners
function setupFilterListeners() {
    // Vehicle type filters
    document.querySelectorAll('input[name="vehicleType"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.vehicleTypes.push(e.target.value);
            } else {
                activeFilters.vehicleTypes = activeFilters.vehicleTypes.filter(v => v !== e.target.value);
            }
            currentPage = 1;
            applyFiltersAndSort();
        });
    });

    // Booking type filters
    document.querySelectorAll('input[name="bookingType"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.bookingTypes.push(e.target.value);
            } else {
                activeFilters.bookingTypes = activeFilters.bookingTypes.filter(v => v !== e.target.value);
            }
            currentPage = 1;
            applyFiltersAndSort();
        });
    });

    // Payment method filters
    document.querySelectorAll('input[name="paymentMethod"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.paymentMethods.push(e.target.value);
            } else {
                activeFilters.paymentMethods = activeFilters.paymentMethods.filter(v => v !== e.target.value);
            }
            currentPage = 1;
            applyFiltersAndSort();
        });
    });

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Uncheck all checkboxes
            document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // Reset filters
            activeFilters = {
                vehicleTypes: [],
                bookingTypes: [],
                paymentMethods: []
            };

            currentPage = 1;
            applyFiltersAndSort();
        });
    }
}

function triggerSearchExecution() {
    const query = document.getElementById('results-location-input').value.trim();
    const startTimeStr = document.getElementById('results-start-time').value;
    const endTimeStr = document.getElementById('results-end-time').value;

    const startDate = parseVietnameseDateString(startTimeStr);
    const endDate = parseVietnameseDateString(endTimeStr);

    if (!query || !startDate || !endDate) return;

    executeNewSearch(query, startDate.toISOString(), endDate.toISOString());
}

// --- BỘ LỌC VÀ SẮP XẾP ---
function applyFiltersAndSort() {
    // 1. Lọc bãi đỗ xe theo filter sidebar trước
    let filtered = allSpots.filter(spot => {
        // Vehicle type filter
        if (activeFilters.vehicleTypes.length > 0) {
            const hasMatchingVehicle = activeFilters.vehicleTypes.some(type =>
                spot.vehicleTypes && spot.vehicleTypes.includes(type)
            );
            if (!hasMatchingVehicle) return false;
        }

        // Booking type filter
        if (activeFilters.bookingTypes.length > 0) {
            const hasMatchingBookingType = activeFilters.bookingTypes.some(type =>
                spot.bookingTypes && spot.bookingTypes.includes(type)
            );
            if (!hasMatchingBookingType) return false;
        }

        // Payment method filter
        if (activeFilters.paymentMethods.length > 0) {
            const hasMatchingPayment = activeFilters.paymentMethods.some(method =>
                spot.paymentMethods && spot.paymentMethods.includes(method)
            );
            if (!hasMatchingPayment) return false;
        }

        return true;
    });

    // 2. Áp dụng sắp xếp
    if (currentSort === 'price') {
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (currentSort === 'distance' || currentSort === 'recommend') {
        // Sắp xếp khoảng cách tăng dần
        filtered.sort((a, b) => {
            const distA = searchCoords ? calculateHaversineDistance(
                searchCoords.lat, searchCoords.lng, a.location.coordinates[1], a.location.coordinates[0]
            ) : 0;
            const distB = searchCoords ? calculateHaversineDistance(
                searchCoords.lat, searchCoords.lng, b.location.coordinates[1], b.location.coordinates[0]
            ) : 0;
            return distA - distB;
        });
    }

    filteredSpots = filtered;
    renderMapMarkers();
    renderListPanel();
}

// --- TIỆN ÍCH TÍNH TOÁN ---
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính trái đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Chuyển sang trang booking-config
function navigateToBookingConfig(spotId) {
    const startTimeStr = document.getElementById('results-start-time').value;
    const endTimeStr = document.getElementById('results-end-time').value;
    const startDate = parseVietnameseDateString(startTimeStr);
    const endDate = parseVietnameseDateString(endTimeStr);

    let detailUrl = `booking-config.html?spotId=${spotId}&startTime=${encodeURIComponent(startDate.toISOString())}&endTime=${encodeURIComponent(endDate.toISOString())}`;
    window.location.href = detailUrl;
}

function formatDateToVietnameseString(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).substring(2);
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d}.${m}.${y} ${h}:${min}`;
}

// Hỗ trợ loading state
function showLoadingState() {
    document.getElementById('results-scroll-container').innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 12px; color: #00B484;"></i>
            <p style="font-weight: 600;">Đang quét tìm kiếm bãi đỗ...</p>
        </div>
    `;
}

function showErrorState(msg) {
    document.getElementById('results-scroll-container').innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #dc2626;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 12px;"></i>
            <p style="font-weight: 600;">Lỗi: ${msg}</p>
        </div>
    `;
}

function renderPagination(totalPages) {
    const pag = document.getElementById('results-pagination');
    pag.innerHTML = '';
    if (totalPages <= 1) return;

    pag.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        background: #ffffff;
        border-top: 1px solid #e5e7eb;
    `;

    const prev = document.createElement('button');
    prev.textContent = '←';
    prev.disabled = currentPage === 1;
    prev.style.cssText = 'padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 4px; background: transparent; cursor: pointer;';
    prev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderListPanel();
        }
    });
    pag.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.cssText = `width: 28px; height: 28px; border: 1px solid #e5e7eb; border-radius: 50%; background: ${currentPage === i ? '#00B484' : 'transparent'}; color: ${currentPage === i ? '#ffffff' : '#333333'}; font-weight: 700; cursor: pointer;`;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderListPanel();
        });
        pag.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = '→';
    next.disabled = currentPage === totalPages;
    next.style.cssText = 'padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 4px; background: transparent; cursor: pointer;';
    next.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderListPanel();
        }
    });
    pag.appendChild(next);
}

function parseVietnameseDateString(dateString) {
    if (!dateString) return null;
    
    // First try standard Date parsing if it already looks like an ISO/UTC format
    if (dateString.includes && dateString.includes('T') && dateString.includes('-')) {
        const standardDate = new Date(dateString);
        if (!isNaN(standardDate.getTime())) {
            return standardDate;
        }
    }
    
    // Custom regex matching dd/mm/yyyy HH:MM, dd.mm.yyyy HH:MM, dd-mm-yyyy HH:MM
    const parts = dateString.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\s+(\d{1,2}):(\d{2})/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10);
        let year = parseInt(parts[3], 10);
        const hours = parseInt(parts[4], 10);
        const minutes = parseInt(parts[5], 10);
        if (parts[3].length === 2) {
            year = 2000 + year;
        }
        const d = new Date(year, month - 1, day, hours, minutes, 0);
        if (!isNaN(d.getTime())) return d;
    }
    
    // Fallback to native constructor if anything else is parseable
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate;
    }
    
    return null;
}