// File: client/admin/js/admin-scripts.js

// --- HÀM XỬ LÝ HÀNH ĐỘNG (ĐẶT Ở GLOBAL SCOPE) ---

/**
 * Xử lý các hành động Approve, Reject, Delete cho một điểm đỗ xe.
 * @param {string} spotId - ID của điểm đỗ xe.
 * @param {'approve' | 'reject' | 'delete'} action - Hành động cần thực hiện.
 */
async function handleSpotAction(spotId, action) {
    const API_URL = 'http://localhost:3001/api';
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
            // Tải lại danh sách để cập nhật
            document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}

/**
 * Bật/tắt chế độ chỉnh sửa cho một hàng trong bảng.
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
        
        // Lưu HTML của các nút cũ vào một thuộc tính data để có thể khôi phục
        actionsCell.setAttribute('data-original-actions', actionsCell.innerHTML);
        actionsCell.innerHTML = `
            <button class="action-btn btn-approve" onclick="saveSpotChanges('${spotId}')">Save</button>
            <button class="action-btn btn-reject" onclick="toggleEditMode('${spotId}', false)">Cancel</button>
        `;
    } else {
        // Thoát chế độ chỉnh sửa, tải lại dữ liệu để khôi phục trạng thái ban đầu
        document.querySelector('.sidebar-nav .nav-item[data-section="spots"]').click();
    }
}

/**
 * Lưu các thay đổi sau khi chỉnh sửa.
 * @param {string} spotId - ID của điểm đỗ xe.
 */
async function saveSpotChanges(spotId) {
    const row = document.getElementById(`spot-${spotId}`);
    const API_URL = 'http://localhost:3001/api';
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
        toggleEditMode(spotId, false); // Tắt chế độ chỉnh sửa

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
    
    /**
     * Hàm renderTable được tối ưu để nhận trực tiếp chuỗi HTML cho các hàng.
     * @param {Array<string>} headers - Mảng chứa các tiêu đề cột.
     * @param {string} rowsHtml - Chuỗi HTML của các hàng (đã được định dạng sẵn).
     */
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
                const headers = ['Address', 'Hourly Rate', 'Status', 'Actions'];
                const rowsHtml = spots.map(s => {
                    let actionsHtml = `<button class="action-btn btn-edit" onclick="toggleEditMode('${s._id}', true)">Edit</button>`;
                    if (s.status === 'pending') {
                        actionsHtml += `
                            <button class="action-btn btn-approve" onclick="handleSpotAction('${s._id}', 'approve')">Approve</button>
                            <button class="action-btn btn-reject" onclick="handleSpotAction('${s._id}', 'reject')">Reject</button>
                        `;
                    }
                    actionsHtml += `<button class="action-btn btn-delete" onclick="handleSpotAction('${s._id}', 'delete')">Delete</button>`;
                    
                    return `
                        <tr id="spot-${s._id}">
                            <td class="editable-address">${s.address}</td>
                            <td class="editable-rate">${s.hourlyRate ? s.hourlyRate.toLocaleString('vi-VN') + ' VND' : 'N/A'}</td>
                            <td><span class="status-${s.status}">${s.status}</span></td>
                            <td><div class="action-buttons">${actionsHtml}</div></td>
                        </tr>
                    `;
                }).join('');
                tableHtml = renderTable(headers, rowsHtml);
            } else if (sectionName === 'bookings') {
                const bookings = await fetchAdminData('bookings');
                const headers = ['Spot Address', 'User', 'Start Time', 'End Time', 'Total Price', 'Status'];
                const rowsHtml = bookings.map(b => {
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    return `
                        <tr>
                            <td>${b.spot ? b.spot.address : 'N/A'}</td>
                            <td>${b.user ? b.user.email : 'N/A'}</td>
                            <td>${new Date(b.startTime).toLocaleString('vi-VN', options)}</td>
                            <td>${new Date(b.endTime).toLocaleString('vi-VN', options)}</td>
                            <td>${b.totalPrice.toLocaleString('vi-VN')} VND</td>
                            <td><span class="status-${b.status}">${b.status}</span></td>
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
            // Đảm bảo chỉ có một nav-item có class 'active'
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

    // Tải dashboard khi mới vào trang
    loadSection('dashboard');
}

// --- LOGIC CHÍNH ĐỂ CHẠY TRANG KHI DOM ĐÃ TẢI XONG ---
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api';
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