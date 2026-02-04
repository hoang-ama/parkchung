// File: client/admin/js/admin-scripts.js

// --- CONSTANTS ---
const FALLBACK_IMAGE = '/assets/image/parking-area.jpg';

/**
 * Validate and get a proper image URL, returning fallback for invalid URLs.
 * @param {Array} images - Array of image URLs from the spot
 * @returns {string} A valid image URL or fallback
 */
function getValidImageUrl(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return FALLBACK_IMAGE;
    }

    const firstImage = images[0];

    // Check for null, undefined, or empty string
    if (!firstImage || firstImage === 'null' || firstImage === 'undefined') {
        return FALLBACK_IMAGE;
    }

    // Check for server filesystem paths (not valid web URLs)
    if (firstImage.startsWith('/var/') ||
        firstImage.startsWith('/home/') ||
        firstImage.startsWith('C:') ||
        firstImage.startsWith('D:') ||
        firstImage.includes('/server/public/uploads/')) {
        return FALLBACK_IMAGE;
    }

    // Valid URL patterns: http://, https://, or relative paths starting with /
    if (firstImage.startsWith('http://') ||
        firstImage.startsWith('https://') ||
        firstImage.startsWith('/')) {
        return firstImage;
    }

    return FALLBACK_IMAGE;
}

// --- HÀM XỬ LÝ HÀNH ĐỘNG (ĐẶT Ở GLOBAL SCOPE) ---

/**
 * Xử lý các hành động Approve, Reject, Delete cho một điểm đỗ xe.
 * @param {string} spotId - ID của điểm đỗ xe.
 * @param {'approve' | 'reject' | 'delete'} action - Hành động cần thực hiện.
 */
async function handleSpotAction(spotId, action) {
    const token = localStorage.getItem('adminToken');
    let method = 'PUT';
    let endpoint = `/admin/spots/${spotId}/${action}`;
    let confirmationMessage = `Are you sure you want to ${action} this spot?`;

    if (action === 'delete') {
        method = 'DELETE';
        endpoint = `/admin/spots/${spotId}`;
        confirmationMessage = 'WARNING: This will PERMANENTLY delete the spot. Are you sure?';
    }

    if (confirm(confirmationMessage)) {
        try {
            const response = await fetch(API_URL + endpoint, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Failed to ${action} spot`);
            }

            alert(`Spot ${action}d successfully!`);
            document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}

/**
 * Toggle active/inactive status for a parking spot.
 * @param {string} spotId - ID of the parking spot.
 * @param {boolean} currentStatus - Current isActive status.
 */
async function toggleSpotActiveStatus(spotId, currentStatus) {
    const token = localStorage.getItem('adminToken');
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${action} this spot?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/spots/${spotId}/toggle-active`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || `Failed to ${action} spot`);
        }

        const result = await response.json();
        alert(result.message);
        document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Toggle expanded details for a parking spot row.
 * @param {string} spotId - ID of the parking spot.
 */
function toggleSpotDetails(spotId) {
    const detailsRow = document.getElementById(`spot-details-${spotId}`);
    const expandBtn = document.querySelector(`#spot-${spotId} .btn-expand`);

    if (!detailsRow || !expandBtn) return;

    const isExpanded = detailsRow.classList.contains('expanded');

    if (isExpanded) {
        detailsRow.classList.remove('expanded');
        expandBtn.classList.remove('expanded');
        expandBtn.innerHTML = '<span class="expand-icon">▼</span> Details';
    } else {
        detailsRow.classList.add('expanded');
        expandBtn.classList.add('expanded');
        expandBtn.innerHTML = '<span class="expand-icon">▼</span> Hide';
    }
}

/**
 * Render badges for an array of values.
 * @param {Array} items - Array of values to render as badges.
 * @param {string} badgeClass - CSS class for badge styling.
 * @param {Object} labelMap - Optional mapping of values to display labels.
 */
function renderBadges(items, badgeClass, labelMap = {}) {
    if (!items || items.length === 0) return '<span style="color: #999;">N/A</span>';
    return items.map(item => {
        const label = labelMap[item] || item;
        return `<span class="badge ${badgeClass}">${label}</span>`;
    }).join('');
}

/**
 * Render spot details HTML for the expandable row.
 * @param {Object} s - The parking spot object.
 */
function renderSpotDetailsHtml(s) {
    const vehicleTypeLabels = {
        'car': '🚗 Car',
        'motorbike': '🏍️ Motorbike',
        'truck': '🚚 Truck',
        'bicycle': '🚴 Bicycle'
    };

    const bookingTypeLabels = {
        'online': '📲 Online',
        'call': '📞 Call'
    };

    const paymentMethodLabels = {
        'cash': '💵 Cash',
        'paypal': '💳 PayPal'
    };

    const addOnLabels = {
        'valet': '🅿️ Valet',
        'carwash': '🚿 Car Wash',
        'ev_charging': '⚡ EV Charging'
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const renderRating = (rating) => {
        if (!rating && rating !== 0) return '<span style="color: #999;">N/A</span>';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        return `
            <span class="rating-stars">
                ${'★'.repeat(fullStars)}${halfStar ? '½' : ''}${'☆'.repeat(emptyStars)}
            </span>
            <span class="rating-value">${rating.toFixed(1)}</span>
        `;
    };

    return `
        <td colspan="6">
            <div class="spot-details-content">
                <!-- Basic Info Section -->
                <div class="detail-section">
                    <div class="detail-section-title">📋 Basic Information</div>
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${s.name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Contact Phone</span>
                        <span class="detail-value">${s.contactPhone || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Operating Hours</span>
                        <span class="detail-value">${s.openTime || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Google Rating</span>
                        <span class="detail-value">${renderRating(s.ggRating)}</span>
                    </div>
                </div>
                
                <!-- Pricing & Capacity Section -->
                <div class="detail-section">
                    <div class="detail-section-title">💰 Pricing & Capacity</div>
                    <div class="detail-item">
                        <span class="detail-label">Hourly Rate</span>
                        <span class="detail-value">${s.hourlyRate ? s.hourlyRate.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Monthly Rate</span>
                        <span class="detail-value">${s.monthlyRate ? s.monthlyRate.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Number of Slots</span>
                        <span class="detail-value">${s.numberOfSlots || 1}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Has Roof</span>
                        <span class="detail-value"><span class="badge ${s.hasRoof ? 'badge-yes' : 'badge-no'}">${s.hasRoof ? 'Yes' : 'No'}</span></span>
                    </div>
                </div>
                
                <!-- Vehicle & Booking Types Section -->
                <div class="detail-section">
                    <div class="detail-section-title">🚗 Services</div>
                    <div class="detail-item">
                        <span class="detail-label">Vehicle Types</span>
                        <span class="detail-value"><div class="badge-container">${renderBadges(s.vehicleTypes, 'badge-vehicle', vehicleTypeLabels)}</div></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Booking Types</span>
                        <span class="detail-value"><div class="badge-container">${renderBadges(s.bookingTypes, 'badge-booking', bookingTypeLabels)}</div></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Payment Methods</span>
                        <span class="detail-value"><div class="badge-container">${renderBadges(s.paymentMethods, 'badge-payment', paymentMethodLabels)}</div></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Add-on Services</span>
                        <span class="detail-value"><div class="badge-container">${renderBadges(s.addOnServices, 'badge-addon', addOnLabels)}</div></span>
                    </div>
                </div>
                
                <!-- Status & Owner Section -->
                <div class="detail-section">
                    <div class="detail-section-title">👤 Owner & Status</div>
                    <div class="detail-item">
                        <span class="detail-label">Owner</span>
                        <span class="detail-value">${s.owner?.fullName || s.owner?.email || s.owner || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Is Active</span>
                        <span class="detail-value"><span class="badge ${s.isActive !== false ? 'badge-active' : 'badge-inactive'}">${s.isActive !== false ? 'Active' : 'Inactive'}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created</span>
                        <span class="detail-value">${formatDate(s.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Updated</span>
                        <span class="detail-value">${formatDate(s.updatedAt)}</span>
                    </div>
                </div>
                
                <!-- Description Section (full width) -->
                ${s.description ? `
                <div class="detail-description">
                    <div class="detail-section-title">📝 Description</div>
                    <div class="detail-description-text">${s.description}</div>
                </div>
                ` : ''}
            </div>
        </td>
    `;
}

/**
 * Xử lý các hành động Delete cho booking.
 * @param {string} bookingId - ID của booking.
 * @param {'delete'} action - Hành động cần thực hiện.
 */
async function handleBookingAction(bookingId, action) {
    const token = localStorage.getItem('adminToken');

    if (action === 'delete') {
        if (confirm('Are you sure you want to delete this booking?')) {
            try {
                const response = await fetch(`${API_URL}/admin/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Failed to delete booking');
                }

                alert('Booking deleted successfully!');
                document.querySelector('.sidebar-nav .nav-item[data-section="bookings"]').click();
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    }
}

/**
 * Toggle select all checkboxes for bookings
 */
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all-bookings');
    const bookingCheckboxes = document.querySelectorAll('.booking-checkbox');

    bookingCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    updateBulkDeleteButton();
}

/**
 * Update bulk delete button visibility and count
 */
function updateBulkDeleteButton() {
    const selectedCheckboxes = document.querySelectorAll('.booking-checkbox:checked');
    const bulkDeleteBtn = document.getElementById('bulk-delete-btn');

    if (selectedCheckboxes.length > 0) {
        if (!bulkDeleteBtn) {
            const bookingsHeader = document.querySelector('#content-area h2');
            const btnHtml = `<button id="bulk-delete-btn" class="bulk-delete-btn" onclick="handleBulkDelete()">Delete Selected (${selectedCheckboxes.length})</button>`;
            bookingsHeader.insertAdjacentHTML('afterend', btnHtml);
        } else {
            bulkDeleteBtn.textContent = `Delete Selected (${selectedCheckboxes.length})`;
            bulkDeleteBtn.style.display = 'inline-block';
        }
    } else {
        if (bulkDeleteBtn) {
            bulkDeleteBtn.style.display = 'none';
        }
    }
}

/**
 * Get array of selected booking IDs
 */
function getSelectedBookings() {
    const selectedCheckboxes = document.querySelectorAll('.booking-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

/**
 * Handle bulk delete of selected bookings
 */
async function handleBulkDelete() {
    const bookingIds = getSelectedBookings();

    if (bookingIds.length === 0) {
        alert('Please select at least one booking to delete');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${bookingIds.length} booking(s)? This action cannot be undone.`)) {
        return;
    }

    const token = localStorage.getItem('adminToken');

    try {
        const response = await fetch(`${API_URL}/admin/bookings/bulk-delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingIds })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to delete bookings');
        }

        const result = await response.json();
        alert(result.message);

        document.querySelector('.sidebar-nav .nav-item[data-section="bookings"]').click();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// ========== SPOT MULTI-SELECT FUNCTIONS ==========

/**
 * Toggle select all checkboxes for spots
 */
function toggleSelectAllSpots() {
    const selectAllCheckbox = document.getElementById('select-all-spots');
    const spotCheckboxes = document.querySelectorAll('.spot-checkbox');

    spotCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    updateSpotBulkActions();
}

/**
 * Update bulk action buttons visibility and count for spots
 */
function updateSpotBulkActions() {
    const selectedCheckboxes = document.querySelectorAll('.spot-checkbox:checked');
    let bulkActionsContainer = document.getElementById('spot-bulk-actions');

    if (selectedCheckboxes.length > 0) {
        if (!bulkActionsContainer) {
            const spotsHeader = document.querySelector('#content-area h2');
            const actionsHtml = `
                <div id="spot-bulk-actions" class="bulk-actions-container">
                    <span class="bulk-count">${selectedCheckboxes.length} selected</span>
                    <button class="bulk-action-btn bulk-approve" onclick="handleBulkSpotAction('approve')">
                        ✓ Bulk Approve
                    </button>
                    <button class="bulk-action-btn bulk-reject" onclick="handleBulkSpotAction('reject')">
                        ✗ Bulk Reject
                    </button>
                    <button class="bulk-action-btn bulk-delete" onclick="handleBulkSpotAction('delete')">
                        🗑 Bulk Delete
                    </button>
                </div>
            `;
            spotsHeader.insertAdjacentHTML('afterend', actionsHtml);
        } else {
            bulkActionsContainer.querySelector('.bulk-count').textContent = `${selectedCheckboxes.length} selected`;
            bulkActionsContainer.style.display = 'flex';
        }
    } else {
        if (bulkActionsContainer) {
            bulkActionsContainer.style.display = 'none';
        }
    }
}

/**
 * Get array of selected spot IDs
 */
function getSelectedSpots() {
    const selectedCheckboxes = document.querySelectorAll('.spot-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => cb.value);
}

/**
 * Handle bulk actions for selected spots
 * @param {'approve' | 'reject' | 'delete'} action - The action to perform
 */
async function handleBulkSpotAction(action) {
    const spotIds = getSelectedSpots();

    if (spotIds.length === 0) {
        alert('Please select at least one spot');
        return;
    }

    const actionLabels = {
        'approve': 'approve',
        'reject': 'reject',
        'delete': 'permanently DELETE'
    };

    if (!confirm(`Are you sure you want to ${actionLabels[action]} ${spotIds.length} spot(s)?${action === 'delete' ? ' This action cannot be undone.' : ''}`)) {
        return;
    }

    const token = localStorage.getItem('adminToken');
    const endpoint = `/admin/spots/bulk-${action}`;

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ spotIds })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || `Failed to ${action} spots`);
        }

        const result = await response.json();
        alert(result.message);

        // Refresh the spots table
        document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Bật/tắt chế độ chỉnh sửa cho một hàng trong bảng spots.
 * @param {string} spotId - ID của điểm đỗ xe.
 * @param {boolean} isEditing - True để bật chế độ chỉnh sửa, false để tắt.
 */
function toggleEditMode(spotId, isEditing) {
    const row = document.getElementById(`spot-${spotId}`);
    if (!row) return;

    const addressCell = row.querySelector('.editable-address');
    const rateCell = row.querySelector('.editable-rate');
    const actionsCell = row.querySelector('.action-buttons');

    if (isEditing) {
        const currentAddress = addressCell.textContent;
        const currentRate = parseFloat(rateCell.textContent.replace(/[^0-9.-]+/g, ""));

        addressCell.innerHTML = `<input type="text" class="editable-input" value="${currentAddress}">`;
        rateCell.innerHTML = `<input type="number" class="editable-input" value="${currentRate}">`;

        actionsCell.setAttribute('data-original-actions', actionsCell.innerHTML);
        actionsCell.innerHTML = `
            <button class="action-btn btn-approve" onclick="saveSpotChanges('${spotId}')">Save</button>
            <button class="action-btn btn-reject" onclick="toggleEditMode('${spotId}', false)">Cancel</button>
        `;
    } else {
        document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
    }
}

/**
 * Bật/tắt chế độ chỉnh sửa cho booking.
 * @param {string} bookingId - ID của booking.
 * @param {boolean} isEditing - True để bật chế độ chỉnh sửa, false để tắt.
 */
function toggleBookingEditMode(bookingId, isEditing) {
    const row = document.getElementById(`booking-${bookingId}`);
    if (!row) {
        console.error('Booking row not found:', bookingId);
        return;
    }

    const startCell = row.querySelector('.editable-start');
    const endCell = row.querySelector('.editable-end');
    const statusCell = row.querySelector('.editable-status');
    const actionsCell = row.querySelector('.action-buttons');

    if (!startCell || !endCell || !statusCell || !actionsCell) {
        console.error('Required cells not found in booking row');
        return;
    }

    if (isEditing) {
        const startText = startCell.textContent ? startCell.textContent.trim() : '';
        const endText = endCell.textContent ? endCell.textContent.trim() : '';
        const statusSpan = statusCell.querySelector('span');
        const statusText = statusSpan ? statusSpan.textContent.trim() : 'pending';

        const startDate = parseDateFromVietnamese(startText);
        const endDate = parseDateFromVietnamese(endText);

        if (!startDate || !endDate) {
            alert('Error: Could not parse booking dates. Please refresh and try again.');
            return;
        }

        startCell.innerHTML = `<input type="datetime-local" class="editable-input" value="${startDate}">`;
        endCell.innerHTML = `<input type="datetime-local" class="editable-input" value="${endDate}">`;
        statusCell.innerHTML = `
            <select class="editable-input">
                <option value="pending" ${statusText === 'pending' ? 'selected' : ''}>pending</option>
                <option value="confirmed" ${statusText === 'confirmed' ? 'selected' : ''}>confirmed</option>
                <option value="cancelled" ${statusText === 'cancelled' ? 'selected' : ''}>cancelled</option>
                <option value="completed" ${statusText === 'completed' ? 'selected' : ''}>completed</option>
            </select>
        `;

        actionsCell.setAttribute('data-original-actions', actionsCell.innerHTML);
        actionsCell.innerHTML = `
            <button class="action-btn btn-approve" onclick="saveBookingChanges('${bookingId}')">Save</button>
            <button class="action-btn btn-reject" onclick="toggleBookingEditMode('${bookingId}', false)">Cancel</button>
        `;
    } else {
        document.querySelector('.sidebar-nav .nav-item[data-section="bookings"]').click();
    }
}

/**
 * Helper function to parse Vietnamese date format to datetime-local format
 * Handles both "DD/MM/YYYY, HH:MM" and "HH:MM DD/MM/YYYY" formats
 */
function parseDateFromVietnamese(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
        console.error('Invalid date string:', dateStr);
        return '';
    }

    try {
        let year, month, day, hour, minute;

        if (dateStr.includes(', ')) {
            const parts = dateStr.split(', ');
            if (parts.length !== 2) {
                console.error('Date string not in expected format:', dateStr);
                return '';
            }

            const dateParts = parts[0].split('/');
            const timeParts = parts[1].split(':');

            if (dateParts.length !== 3 || timeParts.length !== 2) {
                console.error('Date or time parts invalid:', dateStr);
                return '';
            }

            day = dateParts[0].padStart(2, '0');
            month = dateParts[1].padStart(2, '0');
            year = dateParts[2];
            hour = timeParts[0].padStart(2, '0');
            minute = timeParts[1].padStart(2, '0');
        }
        else if (dateStr.includes(' ')) {
            const parts = dateStr.trim().split(' ');
            if (parts.length !== 2) {
                console.error('Date string not in expected format:', dateStr);
                return '';
            }

            const timeParts = parts[0].split(':');
            const dateParts = parts[1].split('/');

            if (dateParts.length !== 3 || timeParts.length !== 2) {
                console.error('Date or time parts invalid:', dateStr);
                return '';
            }

            day = dateParts[0].padStart(2, '0');
            month = dateParts[1].padStart(2, '0');
            year = dateParts[2];
            hour = timeParts[0].padStart(2, '0');
            minute = timeParts[1].padStart(2, '0');
        } else {
            console.error('Date string format not recognized:', dateStr);
            return '';
        }

        return `${year}-${month}-${day}T${hour}:${minute}`;
    } catch (error) {
        console.error('Error parsing date:', dateStr, error);
        return '';
    }
}

/**
 * Lưu các thay đổi sau khi chỉnh sửa spot.
 * @param {string} spotId - ID của điểm đỗ xe.
 */
async function saveSpotChanges(spotId) {
    const row = document.getElementById(`spot-${spotId}`);
    const token = localStorage.getItem('adminToken');

    const newAddress = row.querySelector('.editable-address input').value;
    const newRate = row.querySelector('.editable-rate input').value;

    try {
        const response = await fetch(`${API_URL}/admin/spots/${spotId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: newAddress, hourlyRate: newRate })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to save changes');
        }
        alert('Spot updated successfully!');
        toggleEditMode(spotId, false);

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * Lưu các thay đổi sau khi chỉnh sửa booking.
 * @param {string} bookingId - ID của booking.
 */
async function saveBookingChanges(bookingId) {
    const row = document.getElementById(`booking-${bookingId}`);
    const token = localStorage.getItem('adminToken');

    const newStartTime = row.querySelector('.editable-start input').value;
    const newEndTime = row.querySelector('.editable-end input').value;
    const newStatus = row.querySelector('.editable-status select').value;

    try {
        const response = await fetch(`${API_URL}/admin/bookings/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startTime: newStartTime,
                endTime: newEndTime,
                status: newStatus
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to save changes');
        }
        alert('Booking updated successfully!');
        toggleBookingEditMode(bookingId, false);

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

/**
 * HÀM MỚI: Kích hoạt cửa sổ chọn file cho một bãi đỗ cụ thể.
 */
function triggerImageUpload(spotId) {
    const fileInput = document.getElementById(`image-upload-${spotId}`);
    fileInput.click();
}

/**
 * HÀM MỚI: Xử lý việc tải ảnh mới lên sau khi người dùng đã chọn file.
 */
async function handleImageUpdate(spotId) {
    const token = localStorage.getItem('adminToken');
    const fileInput = document.getElementById(`image-upload-${spotId}`);
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('spotImage', file);

    try {
        const response = await fetch(`${API_URL}/admin/spots/${spotId}/image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to update image');
        }

        alert('Image updated successfully!');
        document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// --- HÀM XỬ LÝ LOGIC TRANG ---

function handleLoginPage(API_URL) {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const errorMessage = document.getElementById('error-message');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value })
            });
            const data = await response.json();
            if (!response.ok || data.role !== 'admin') throw new Error('Not an admin or invalid credentials.');
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

function handleDashboardPage(API_URL, token) {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentArea = document.getElementById('content-area');
    const logoutBtn = document.getElementById('logout-btn');

    async function fetchAdminData(endpoint) {
        const response = await fetch(`${API_URL}/admin/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) logoutBtn.click();
            const errData = await response.json();
            throw new Error(errData.message);
        }
        return response.json();
    }

    function renderTable(headers, rowsHtml) {
        return `
            <table>
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        `;
    }

    async function loadSection(sectionName) {
        contentArea.innerHTML = '<h2>Loading...</h2>';
        try {
            let title = `<h2>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Management</h2>`;
            let tableHtml = '';

            if (sectionName === 'dashboard') {
                const stats = await fetchAdminData('stats');
                contentArea.innerHTML = `
                    <h2>Dashboard</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Users: ${stats.users}</h3></div>
                        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Spots: ${stats.spots}</h3></div>
                        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Pending Spots: ${stats.pendingSpots}</h3></div>
                        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Bookings: ${stats.bookings}</h3></div>
                    </div>
                `;
                return;
            } else if (sectionName === 'users') {
                const users = await fetchAdminData('users');
                const headers = ['ID', 'Full Name', 'Email', 'Role'];
                const rowsHtml = users.map(u => `<tr><td>${u._id}</td><td>${u.fullName}</td><td>${u.email}</td><td>${u.role}</td></tr>`).join('');
                tableHtml = renderTable(headers, rowsHtml);
            } else if (sectionName === 'spots') {
                const spots = await fetchAdminData('spots');
                const headers = [
                    '<input type="checkbox" id="select-all-spots" onchange="toggleSelectAllSpots()" title="Select All">',
                    'Spot ID', 'Image', 'Address', 'Hourly Rate', 'Status', 'Actions'
                ];
                const rowsHtml = spots.map(s => {
                    // Expand button comes first
                    let actionsHtml = `<button class="action-btn btn-expand" onclick="toggleSpotDetails('${s._id}')"><span class="expand-icon">▼</span> Details</button>`;

                    actionsHtml += `<button class="action-btn btn-edit" onclick="toggleEditMode('${s._id}', true)">Edit</button>`;

                    if (s.status === 'pending') {
                        actionsHtml += `
                            <button class="action-btn btn-approve" onclick="handleSpotAction('${s._id}', 'approve')">Approve</button>
                            <button class="action-btn btn-reject" onclick="handleSpotAction('${s._id}', 'reject')">Reject</button>
                        `;
                    }

                    actionsHtml += `
                        <button class="action-btn btn-image" onclick="triggerImageUpload('${s._id}')">Change Image</button>
                        <input 
                            type="file" 
                            id="image-upload-${s._id}" 
                            style="display: none;" 
                            accept="image/*"
                            onchange="handleImageUpdate('${s._id}')"
                        >
                    `;

                    // Activate/Deactivate toggle button
                    const isActive = s.isActive !== false; // Default to true if undefined
                    const toggleBtnClass = isActive ? 'btn-deactivate' : 'btn-activate';
                    const toggleBtnText = isActive ? '⏸ Deactivate' : '▶ Activate';
                    actionsHtml += `<button class="action-btn ${toggleBtnClass}" onclick="toggleSpotActiveStatus('${s._id}', ${isActive})">${toggleBtnText}</button>`;

                    actionsHtml += `<button class="action-btn btn-delete" onclick="handleSpotAction('${s._id}', 'delete')">Delete</button>`;

                    // Use validated image URL with onerror fallback
                    const imageUrl = getValidImageUrl(s.images);

                    // Main row + expandable details row
                    return `
                        <tr id="spot-${s._id}">
                            <td><input type="checkbox" class="spot-checkbox" value="${s._id}" onchange="updateSpotBulkActions()"></td>
                            <td class="spot-code-column">${s.spotCode ? `<span class="spot-code-badge">${s.spotCode}</span>` : '<span class="spot-code-na">N/A</span>'}</td>
                            <td class="spot-image-column"><img src="${imageUrl}" alt="Spot image" class="spot-thumbnail" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"></td>
                            <td class="editable-address">${s.address}</td>
                            <td class="editable-rate">${s.hourlyRate ? s.hourlyRate.toLocaleString('vi-VN') + ' VND' : 'N/A'}</td>
                            <td><span class="status-${s.status}">${s.status}</span></td>
                            <td><div class="action-buttons">${actionsHtml}</div></td>
                        </tr>
                        <tr id="spot-details-${s._id}" class="spot-details-row">
                            ${renderSpotDetailsHtml(s)}
                        </tr>
                    `;
                }).join('');
                tableHtml = renderTable(headers, rowsHtml);
            } else if (sectionName === 'bookings') {
                const bookings = await fetchAdminData('bookings');
                const headers = [
                    '<input type="checkbox" id="select-all-bookings" onchange="toggleSelectAll()" title="Select All">',
                    'Spot Address',
                    'User',
                    'Start Time',
                    'End Time',
                    'Total Price',
                    'Status',
                    'Actions'
                ];
                const rowsHtml = bookings.map(b => {
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    const userDisplay = b.user ? b.user.email : (b.guestEmail || 'N/A');

                    let actionsHtml = `
                        <button class="action-btn btn-edit" onclick="toggleBookingEditMode('${b._id}', true)">Edit</button>
                        <button class="action-btn btn-delete" onclick="handleBookingAction('${b._id}', 'delete')">Delete</button>
                    `;

                    return `
                        <tr id="booking-${b._id}">
                            <td><input type="checkbox" class="booking-checkbox" value="${b._id}" onchange="updateBulkDeleteButton()"></td>
                            <td class="editable-spot">${b.spot ? b.spot.address : 'N/A'}</td>
                            <td>${userDisplay}</td>
                            <td class="editable-start">${new Date(b.startTime).toLocaleString('vi-VN', options)}</td>
                            <td class="editable-end">${new Date(b.endTime).toLocaleString('vi-VN', options)}</td>
                            <td class="editable-price">${b.totalPrice.toLocaleString('vi-VN')} VND</td>
                            <td class="editable-status"><span class="status-${b.status}">${b.status}</span></td>
                            <td><div class="action-buttons">${actionsHtml}</div></td>
                        </tr>
                    `;
                }).join('');
                tableHtml = renderTable(headers, rowsHtml);
            }

            contentArea.innerHTML = title + tableHtml;
        } catch (error) {
            contentArea.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id === 'logout-btn') return;
            const currentActive = document.querySelector('.sidebar-nav .nav-item.active');
            if (currentActive) currentActive.classList.remove('active');
            item.classList.add('active');
            loadSection(item.getAttribute('data-section'));
        });
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    });

    loadSection('dashboard');
}

// --- LOGIC CHÍNH ĐỂ CHẠY TRANG KHI DOM ĐÃ TẢI XONG ---
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');

    if (document.getElementById('login-form')) {
        handleLoginPage(API_URL);
    } else if (document.querySelector('.admin-panel')) {
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        handleDashboardPage(API_URL, token);
    }
});