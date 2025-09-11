document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api'; // URL của backend
    const token = localStorage.getItem('adminToken');

    // Kiểm tra xem đang ở trang nào
    if (document.getElementById('login-form')) {
        handleLoginPage();
    } else if (document.querySelector('.admin-panel')) {
        if (!token) {
            window.location.href = 'login.html'; // Nếu chưa đăng nhập, chuyển về trang login
            return;
        }
        handleDashboardPage(token);
    }
});

// Xử lý logic cho trang đăng nhập
function handleLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || data.role !== 'admin') {
                throw new Error(data.message || 'You are not authorized as an admin.');
            }

            localStorage.setItem('adminToken', data.token);
            window.location.href = 'dashboard.html';

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

// Xử lý logic cho trang dashboard
function handleDashboardPage(token) {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const contentArea = document.getElementById('content-area');
    const logoutBtn = document.getElementById('logout-btn');

    // Hàm gọi API với token
    async function fetchAdminData(endpoint) {
        const response = await fetch(`${API_URL}/admin/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
    }

    // Hàm render bảng
    function renderTable(headers, rows) {
        let tableHTML = '<table><thead><tr>';
        headers.forEach(h => tableHTML += `<th>${h}</th>`);
        tableHTML += '</tr></thead><tbody>';
        rows.forEach(row => {
            tableHTML += '<tr>';
            row.forEach(cell => tableHTML += `<td>${cell}</td>`);
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    // Hàm tải nội dung cho từng mục
    async function loadSection(sectionName) {
        contentArea.innerHTML = '<h2>Loading...</h2>';
        try {
            let html = `<h2>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Management</h2>`;
            const data = await fetchAdminData(sectionName); // Ví dụ: /api/admin/users

            if (sectionName === 'users') {
                const headers = ['ID', 'Full Name', 'Email', 'Role'];
                const rows = data.map(u => [u._id, u.fullName, u.email, u.role]);
                html += renderTable(headers, rows);
            } else if (sectionName === 'spots') {
                const headers = ['Address', 'Owner Email', 'Status', 'Actions'];
                const rows = data.map(s => [s.address, s.owner.email, `<span class="status-${s.status}">${s.status}</span>`, s.status === 'pending' ? '<button>Approve</button>' : '']);
                html += renderTable(headers, rows);
            }
            // Thêm các trường hợp khác cho dashboard, bookings...
            
            contentArea.innerHTML = html;
        } catch (error) {
            contentArea.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    // Xử lý sự kiện click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if(item.id === 'logout-btn') return;
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');
            const section = item.getAttribute('data-section');
            if (section) loadSection(section);
        });
    });

    // Xử lý đăng xuất
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    });

    // Tải mục dashboard mặc định
    loadSection('dashboard');
}