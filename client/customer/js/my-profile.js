// File: client/customer/js/my-profile.js

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Update welcome message
    const userWelcome = document.getElementById('user-welcome');
    if (userWelcome && user.fullName) {
        userWelcome.textContent = `Welcome, ${user.fullName}`;
    }

    // Set up host link
    const hostLink = document.getElementById('host-link');
    if (hostLink && window.HOST_URL) {
        hostLink.href = window.HOST_URL + '/login';
    }

    // Set up logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }

    // Load profile
    loadProfile();
});

/**
 * Load user profile from API
 */
async function loadProfile() {
    const token = localStorage.getItem('userToken');
    const profileContent = document.getElementById('profile-content');

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Failed to load profile');
        }

        const profile = await response.json();
        renderProfile(profile);

    } catch (error) {
        profileContent.innerHTML = `
            <div class="profile-card">
                <p style="color: #e74c3c; text-align: center;">Error loading profile: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * Render profile data to the page
 */
function renderProfile(profile) {
    const profileContent = document.getElementById('profile-content');
    const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    profileContent.innerHTML = `
        <!-- Account Information -->
        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>📋</span> Account Information</h2>
                <div class="profile-row">
                    <span class="profile-label">Full Name</span>
                    <span class="profile-value">${profile.fullName}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">Email (Username)</span>
                    <span class="profile-value">${profile.email}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">Account Type</span>
                    <span class="profile-value" style="text-transform: capitalize;">${profile.role}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">Member Since</span>
                    <span class="member-badge">${memberSince}</span>
                </div>
            </div>
        </div>

        <!-- Editable Information -->
        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>✏️</span> Editable Information</h2>
                <div class="profile-row">
                    <span class="profile-label">Phone Number</span>
                    <div class="profile-value editable">
                        <input type="tel" class="profile-input" id="phone-input" 
                            value="${profile.phone || ''}" placeholder="Enter phone number">
                    </div>
                </div>
                <div class="profile-row">
                    <span class="profile-label">Vehicle License Plate</span>
                    <div class="profile-value editable">
                        <input type="text" class="profile-input" id="license-input" 
                            value="${profile.vehicleLicensePlate || ''}" placeholder="e.g., 30A-12345">
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="saveProfile()">💾 Save Changes</button>
                </div>
            </div>
        </div>

        <!-- Account Actions -->
        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>⚙️</span> Account Actions</h2>
                <div class="action-buttons">
                    <button class="btn btn-outline" onclick="openPasswordModal()">🔐 Change Password</button>
                    <button class="btn btn-danger" onclick="openDeleteModal()">🗑️ Delete Account</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Save profile changes (phone and license plate)
 */
async function saveProfile() {
    const token = localStorage.getItem('userToken');
    const phone = document.getElementById('phone-input').value.trim();
    const vehicleLicensePlate = document.getElementById('license-input').value.trim();

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, vehicleLicensePlate })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update profile');
        }

        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.phone = phone;
        user.vehicleLicensePlate = vehicleLicensePlate;
        localStorage.setItem('user', JSON.stringify(user));

        showMessage('Profile updated successfully!', 'success');

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Open change password modal
 */
function openPasswordModal() {
    document.getElementById('password-modal').classList.add('active');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

/**
 * Close change password modal
 */
function closePasswordModal() {
    document.getElementById('password-modal').classList.remove('active');
}

/**
 * Submit password change
 */
async function submitPasswordChange() {
    const token = localStorage.getItem('userToken');
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('Please fill in all password fields', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to change password');
        }

        closePasswordModal();
        showMessage('Password changed successfully!', 'success');

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Open delete account modal
 */
function openDeleteModal() {
    document.getElementById('delete-modal').classList.add('active');
    document.getElementById('delete-password').value = '';
}

/**
 * Close delete account modal
 */
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}

/**
 * Submit account deletion
 */
async function submitDeleteAccount() {
    const token = localStorage.getItem('userToken');
    const password = document.getElementById('delete-password').value;

    if (!password) {
        showMessage('Please enter your password to confirm deletion', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/account`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete account');
        }

        // Clear storage and redirect
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');

        alert('Your account has been deleted. Goodbye!');
        window.location.href = 'index.html';

    } catch (error) {
        showMessage(error.message, 'error');
    }
}

/**
 * Show message to user
 */
function showMessage(text, type) {
    const container = document.getElementById('message-container');
    container.innerHTML = `<div class="message ${type}">${text}</div>`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

/**
 * Toggle password visibility for a specific input field
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;

    // SVG paths for eye and eye-slash icons
    const eyeIcon = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    const eyeSlashIcon = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = eyeSlashIcon;
    } else {
        input.type = 'password';
        icon.innerHTML = eyeIcon;
    }
}
