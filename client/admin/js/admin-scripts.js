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

function handleLoginPage(API_URL) {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            if (data.role !== 'admin') throw new Error('Access Denied: You are not an admin.');

            localStorage.setItem('adminToken', data.token);
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}
function renderTable(headers, rows) {
    let tableHTML = '<table><thead><tr>';
    headers.forEach(h => tableHTML += `<th>${h}</th>`);
    tableHTML += '</tr></thead><tbody>';
    rows.forEach(row => {
        tableHTML += '<tr>';
        // mỗi cell đều được chuyển thành chuỗi an toàn
        row.forEach(cell => tableHTML += `<td>${String(cell || '')}</td>`);
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    return tableHTML;
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

    async function updateSpotStatus(spotId, status) {
        // ... (Logic để gọi API approve/reject)
    }
    async function loadSection(sectionName) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<h2>Loading...</h2>';
    
    try {
        let html = `<h2>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Management</h2>`;
        
        if (sectionName === 'dashboard') {
            const stats = await fetchAdminData('stats');
            html = `
                <h2>Dashboard</h2>
                <div style="display: flex; gap: 20px;">
                    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Users: ${stats.users}</h3></div>
                    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Spots: ${stats.spots}</h3></div>
                    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Pending Spots: ${stats.pendingSpots}</h3></div>
                    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;"><h3>Total Bookings: ${stats.bookings}</h3></div>
                </div>
            `;
        } else if (sectionName === 'users') {
            const users = await fetchAdminData('users');
            const headers = ['ID', 'Full Name', 'Email', 'Role'];
            const rows = users.map(u => [u._id, u.fullName, u.email, u.role]);
            html += renderTable(headers, rows);
        } else if (sectionName === 'spots') {
            const spots = await fetchAdminData('spots');
            const headers = ['Address', 'Owner', 'Status', 'Actions'];
            const rows = spots.map(s => [
                s.address,
                s.owner ? s.owner.email : '<span style="color: red;">Owner Not Found</span>',
                `<span class="status-${s.status}">${s.status}</span>`,
                s.status === 'pending' ? `<button onclick="approveSpot('${s._id}')">Approve</button>` : 'Handled'
            ]);
            html += renderTable(headers, rows);
        } else if (sectionName === 'bookings') { // <-- PHẦN MỚI
            const bookings = await fetchAdminData('bookings');
            const headers = ['Spot Address', 'User', 'Start Time', 'End Time', 'Total Price', 'Status'];
            const rows = bookings.map(b => [
                b.spot ? b.spot.address : 'Spot Not Found',
                b.user ? b.user.email : 'User Not Found',
                new Date(b.startTime).toLocaleString('vi-VN'),
                new Date(b.endTime).toLocaleString('vi-VN'),
                b.totalPrice.toLocaleString('vi-VN') + ' VND',
                `<span class="status-${b.status}">${b.status}</span>`
            ]);
            html += renderTable(headers, rows);
        }
        
        contentArea.innerHTML = html;
    } catch (error) {
        contentArea.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}
    
    // Gán hàm approveSpot ra global scope để inline onclick có thể gọi
    window.approveSpot = async (spotId) => {
    // Lấy API_URL và token từ scope của hàm handleDashboardPage
    const API_URL = 'http://localhost:3001/api'; // Hoặc port của bạn
    const token = localStorage.getItem('adminToken');

    if (confirm('Are you sure you want to approve this spot?')) {
        try {
            const response = await fetch(`${API_URL}/admin/spots/${spotId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to approve spot');
            }

            alert('Spot approved successfully!');
            
            // Tự động tải lại danh sách các điểm đỗ xe để cập nhật trạng thái
            const dashboardHandler = document.querySelector('.sidebar-nav .nav-item[data-section="spots"]');
            if(dashboardHandler) dashboardHandler.click();

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
};

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id === 'logout-btn') return;
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');
            loadSection(item.getAttribute('data-section'));
        });
    });

    loadSection('dashboard');
}