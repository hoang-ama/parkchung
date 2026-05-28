const translations = {
    en: {
        logo_slogan: 'Seamless Smart Parking, Safe & Easy',
        becomeHost: 'Host',
        my_bookings: 'My Bookings',
        my_profile: 'My Profile',
        welcome: 'Welcome',
        logout: 'Logout',
        profile_page_title: 'My Profile',
        back_home: '← Back to Home',
        loading_profile: 'Loading profile...',
        change_password_title: '🔐 Change Password',
        current_password_placeholder: 'Current Password',
        new_password_placeholder: 'New Password (min 6 chars)',
        confirm_password_placeholder: 'Confirm New Password',
        delete_account_title: '⚠️ Delete Account',
        delete_account_warning: 'This action is permanent and cannot be undone. All your bookings will be deleted.',
        delete_password_placeholder: 'Enter your password to confirm',
        cancel: 'Cancel',
        change_password_cta: 'Change Password',
        delete_account_cta: 'Delete My Account',
        error_loading_profile: 'Error loading profile',
        account_information: 'Account Information',
        full_name: 'Full Name',
        email_username: 'Email (Username)',
        account_type: 'Account Type',
        member_since: 'Member Since',
        editable_information: 'Editable Information',
        phone_number: 'Phone Number',
        vehicle_license_plate: 'Vehicle License Plate',
        phone_placeholder: 'Enter phone number',
        license_placeholder: 'e.g., 30A-12345',
        save_changes: '💾 Save Changes',
        account_actions: 'Account Actions',
        change_password_action: '🔐 Change Password',
        delete_account_action: '🗑️ Delete Account',
        profile_updated_success: 'Profile updated successfully!',
        password_fields_required: 'Please fill in all password fields.',
        password_mismatch: 'New passwords do not match.',
        password_too_short: 'New password must be at least 6 characters.',
        password_changed_success: 'Password changed successfully!',
        delete_password_required: 'Please enter your password to confirm deletion.',
        account_deleted_goodbye: 'Your account has been deleted. Goodbye!',
        failed_to_load_profile: 'Failed to load profile',
        failed_to_update_profile: 'Failed to update profile',
        failed_to_change_password: 'Failed to change password',
        failed_to_delete_account: 'Failed to delete account',
    },
    vi: {
        logo_slogan: 'Bãi đỗ thông minh, an toàn và dễ dàng',
        becomeHost: 'Đăng bãi',
        my_bookings: 'Đặt chỗ của tôi',
        my_profile: 'Hồ sơ của tôi',
        welcome: 'Xin chào',
        logout: 'Đăng xuất',
        profile_page_title: 'Hồ sơ của tôi',
        back_home: '← Về Trang chủ',
        loading_profile: 'Đang tải hồ sơ...',
        change_password_title: '🔐 Đổi mật khẩu',
        current_password_placeholder: 'Mật khẩu hiện tại',
        new_password_placeholder: 'Mật khẩu mới (ít nhất 6 ký tự)',
        confirm_password_placeholder: 'Xác nhận mật khẩu mới',
        delete_account_title: '⚠️ Xóa tài khoản',
        delete_account_warning: 'Hành động này là vĩnh viễn và không thể hoàn tác. Tất cả đặt chỗ của bạn sẽ bị xóa.',
        delete_password_placeholder: 'Nhập mật khẩu để xác nhận',
        cancel: 'Hủy',
        change_password_cta: 'Đổi mật khẩu',
        delete_account_cta: 'Xóa tài khoản của tôi',
        error_loading_profile: 'Lỗi khi tải hồ sơ',
        account_information: 'Thông tin tài khoản',
        full_name: 'Họ và tên',
        email_username: 'Email (Tên đăng nhập)',
        account_type: 'Loại tài khoản',
        member_since: 'Thành viên từ',
        editable_information: 'Thông tin có thể chỉnh sửa',
        phone_number: 'Số điện thoại',
        vehicle_license_plate: 'Biển số xe',
        phone_placeholder: 'Nhập số điện thoại',
        license_placeholder: 'Ví dụ: 30A-12345',
        save_changes: '💾 Lưu thay đổi',
        account_actions: 'Tác vụ tài khoản',
        change_password_action: '🔐 Đổi mật khẩu',
        delete_account_action: '🗑️ Xóa tài khoản',
        profile_updated_success: 'Cập nhật hồ sơ thành công!',
        password_fields_required: 'Vui lòng điền đầy đủ các trường mật khẩu.',
        password_mismatch: 'Mật khẩu mới không khớp.',
        password_too_short: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        password_changed_success: 'Đổi mật khẩu thành công!',
        delete_password_required: 'Vui lòng nhập mật khẩu để xác nhận xóa tài khoản.',
        account_deleted_goodbye: 'Tài khoản của bạn đã được xóa. Tạm biệt!',
        failed_to_load_profile: 'Không thể tải hồ sơ',
        failed_to_update_profile: 'Không thể cập nhật hồ sơ',
        failed_to_change_password: 'Không thể đổi mật khẩu',
        failed_to_delete_account: 'Không thể xóa tài khoản',
    },
};

let currentLang = localStorage.getItem('lang') || 'vi';
let currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
let currentProfile = null;

function getTranslation(key) {
    return translations[currentLang]?.[key] || translations.en[key] || key;
}

function applyStaticTranslations() {
    document.title = `${getTranslation('profile_page_title')} | Parkchung`;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation) {
            element.setAttribute('placeholder', translation);
        }
    });

    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.textContent = getTranslation('back_home');
    }

    const passwordModal = document.getElementById('password-modal');
    if (passwordModal) {
        const modalTitle = passwordModal.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = getTranslation('change_password_title');
    }

    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        const modalTitle = deleteModal.querySelector('.modal-title');
        const warning = deleteModal.querySelector('p');
        if (modalTitle) modalTitle.textContent = getTranslation('delete_account_title');
        if (warning) warning.textContent = getTranslation('delete_account_warning');
    }

    const langEnBtn = document.getElementById('lang-en');
    const langViBtn = document.getElementById('lang-vi');
    if (langEnBtn) {
        langEnBtn.style.color = currentLang === 'en' ? '#13b47e' : '#555';
        langEnBtn.style.fontWeight = currentLang === 'en' ? '700' : '500';
    }
    if (langViBtn) {
        langViBtn.style.color = currentLang === 'vi' ? '#13b47e' : '#555';
        langViBtn.style.fontWeight = currentLang === 'vi' ? '700' : '500';
    }

    const userWelcome = document.getElementById('user-welcome');
    if (userWelcome) {
        userWelcome.textContent = currentUser.fullName
            ? `${getTranslation('welcome')}, ${currentUser.fullName}`
            : getTranslation('welcome');
    }
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    currentLang = lang;
    applyStaticTranslations();

    if (currentProfile) {
        renderProfile(currentProfile);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = '/customer/login.html';
        return;
    }

    const hostLink = document.getElementById('host-link');
    if (hostLink && window.HOST_URL) {
        hostLink.href = `${window.HOST_URL}/login`;
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = '/customer/login.html';
        });
    }

    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-vi')?.addEventListener('click', () => setLanguage('vi'));

    applyStaticTranslations();
    loadProfile();
});

async function loadProfile() {
    const token = localStorage.getItem('userToken');
    const profileContent = document.getElementById('profile-content');

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                window.location.href = '/customer/login.html';
                return;
            }

            throw new Error(getTranslation('failed_to_load_profile'));
        }

        const profile = await response.json();
        currentProfile = profile;
        currentUser = {
            ...currentUser,
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            vehicleLicensePlate: profile.vehicleLicensePlate,
        };
        localStorage.setItem('userData', JSON.stringify(currentUser));
        applyStaticTranslations();
        renderProfile(profile);
    } catch (error) {
        profileContent.innerHTML = `
            <div class="profile-card">
                <p style="color: #e74c3c; text-align: center;">${getTranslation('error_loading_profile')}: ${error.message}</p>
            </div>
        `;
    }
}

function renderProfile(profile) {
    const profileContent = document.getElementById('profile-content');
    const memberSince = new Date(profile.createdAt).toLocaleDateString(
        currentLang === 'vi' ? 'vi-VN' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    profileContent.innerHTML = `
        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>📋</span> ${getTranslation('account_information')}</h2>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('full_name')}</span>
                    <span class="profile-value">${profile.fullName}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('email_username')}</span>
                    <span class="profile-value">${profile.email}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('account_type')}</span>
                    <span class="profile-value" style="text-transform: capitalize;">${profile.role}</span>
                </div>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('member_since')}</span>
                    <span class="member-badge">${memberSince}</span>
                </div>
            </div>
        </div>

        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>✏️</span> ${getTranslation('editable_information')}</h2>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('phone_number')}</span>
                    <div class="profile-value editable">
                        <input
                            type="tel"
                            class="profile-input"
                            id="phone-input"
                            value="${profile.phone || ''}"
                            placeholder="${getTranslation('phone_placeholder')}"
                        >
                    </div>
                </div>
                <div class="profile-row">
                    <span class="profile-label">${getTranslation('vehicle_license_plate')}</span>
                    <div class="profile-value editable">
                        <input
                            type="text"
                            class="profile-input"
                            id="license-input"
                            value="${profile.vehicleLicensePlate || ''}"
                            placeholder="${getTranslation('license_placeholder')}"
                        >
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="saveProfile()">${getTranslation('save_changes')}</button>
                </div>
            </div>
        </div>

        <div class="profile-card">
            <div class="profile-section">
                <h2 class="section-title"><span>⚙️</span> ${getTranslation('account_actions')}</h2>
                <div class="action-buttons">
                    <button class="btn btn-outline" onclick="openPasswordModal()">${getTranslation('change_password_action')}</button>
                    <button class="btn btn-danger" onclick="openDeleteModal()">${getTranslation('delete_account_action')}</button>
                </div>
            </div>
        </div>
    `;
}

async function saveProfile() {
    const token = localStorage.getItem('userToken');
    const phone = document.getElementById('phone-input').value.trim();
    const vehicleLicensePlate = document.getElementById('license-input').value.trim();

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, vehicleLicensePlate }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || getTranslation('failed_to_update_profile'));
        }

        currentProfile = {
            ...currentProfile,
            phone: data.user.phone,
            vehicleLicensePlate: data.user.vehicleLicensePlate,
        };
        currentUser = {
            ...currentUser,
            phone: data.user.phone,
            vehicleLicensePlate: data.user.vehicleLicensePlate,
        };
        localStorage.setItem('userData', JSON.stringify(currentUser));
        applyStaticTranslations();
        renderProfile(currentProfile);
        showMessage(getTranslation('profile_updated_success'), 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function openPasswordModal() {
    document.getElementById('password-modal').classList.add('active');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.remove('active');
}

async function submitPasswordChange() {
    const token = localStorage.getItem('userToken');
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage(getTranslation('password_fields_required'), 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage(getTranslation('password_mismatch'), 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage(getTranslation('password_too_short'), 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || getTranslation('failed_to_change_password'));
        }

        closePasswordModal();
        showMessage(getTranslation('password_changed_success'), 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function openDeleteModal() {
    document.getElementById('delete-modal').classList.add('active');
    document.getElementById('delete-password').value = '';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
}

async function submitDeleteAccount() {
    const token = localStorage.getItem('userToken');
    const password = document.getElementById('delete-password').value;

    if (!password) {
        showMessage(getTranslation('delete_password_required'), 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/account`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || getTranslation('failed_to_delete_account'));
        }

        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        alert(getTranslation('account_deleted_goodbye'));
        window.location.href = '/customer/index.html';
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function showMessage(text, type) {
    const container = document.getElementById('message-container');
    container.innerHTML = `<div class="message ${type}">${text}</div>`;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    const eyeIcon = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    const eyeSlashIcon = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = eyeSlashIcon;
        return;
    }

    input.type = 'password';
    icon.innerHTML = eyeIcon;
}
