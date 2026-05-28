import { api } from './apiService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const VIETNAM_PHONE_REGEX = /^(?:0\d{9}|\+84\d{9})$/;
const AUTH_TEXT = {
    en: {
        invalidEmail: 'Email must include a valid domain, for example name@example.com.',
        invalidPhone: 'Phone must be a valid Vietnamese number like 0912345678 or +84912345678.',
        registerSuccessMessage: 'Your account has been created successfully! Please login with your new account.',
        registerSuccessTitle: 'Registration Successful',
        registerFailedPrefix: 'Registration failed',
        loginSuccessTitle: 'Login Successful',
        loginSuccessMessage: 'Welcome back, {fullName}! You have successfully logged in to ParkChung.',
        loginFailedPrefix: 'Login failed',
    },
    vi: {
        invalidEmail: 'Email phải có tên miền hợp lệ, ví dụ name@example.com.',
        invalidPhone: 'Số điện thoại phải đúng định dạng Việt Nam như 0912345678 hoặc +84912345678.',
        registerSuccessMessage: 'Tạo tài khoản thành công! Vui lòng đăng nhập bằng tài khoản mới của bạn.',
        registerSuccessTitle: 'Đăng ký thành công',
        registerFailedPrefix: 'Đăng ký thất bại',
        loginSuccessTitle: 'Đăng nhập thành công',
        loginSuccessMessage: 'Chào mừng quay lại, {fullName}! Bạn đã đăng nhập thành công vào ParkChung.',
        loginFailedPrefix: 'Đăng nhập thất bại',
    },
};

function normalizePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[\s().-]/g, '').trim();
}

function getCurrentAuthLang() {
    return localStorage.getItem('lang') || 'vi';
}

function getAuthText(key, replacements = {}) {
    const lang = getCurrentAuthLang();
    const template = AUTH_TEXT[lang]?.[key] || AUTH_TEXT.en[key] || key;
    return Object.entries(replacements).reduce(
        (message, [placeholder, value]) => message.replaceAll(`{${placeholder}}`, value),
        template,
    );
}

function setFieldError(input, errorElement, message) {
    if (!input || !errorElement) return;
    input.classList.toggle('input-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorElement.textContent = message;
}

function validateRegisterEmail(emailInput, errorElement) {
    const email = emailInput.value.trim();
    if (!email) {
        setFieldError(emailInput, errorElement, '');
        return { isValid: true, value: email };
    }

    if (!EMAIL_REGEX.test(email)) {
        setFieldError(emailInput, errorElement, getAuthText('invalidEmail'));
        return { isValid: false, value: email };
    }

    setFieldError(emailInput, errorElement, '');
    return { isValid: true, value: email.toLowerCase() };
}

function validateRegisterPhone(phoneInput, errorElement) {
    const rawPhoneNumber = phoneInput.value.trim();
    if (!rawPhoneNumber) {
        setFieldError(phoneInput, errorElement, '');
        return { isValid: true, value: '' };
    }

    const normalizedPhoneNumber = normalizePhoneNumber(rawPhoneNumber);
    if (!VIETNAM_PHONE_REGEX.test(normalizedPhoneNumber)) {
        setFieldError(phoneInput, errorElement, getAuthText('invalidPhone'));
        return { isValid: false, value: normalizedPhoneNumber };
    }

    setFieldError(phoneInput, errorElement, '');
    return { isValid: true, value: normalizedPhoneNumber };
}

document.addEventListener('DOMContentLoaded', () => {
    // register
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const emailInput = registerForm.querySelector('#email');
        const phoneInput = registerForm.querySelector('#phone');
        const emailError = registerForm.querySelector('#email-error');
        const phoneError = registerForm.querySelector('#phone-error');
        const formError = registerForm.querySelector('#register-form-error');

        emailInput?.addEventListener('input', () => {
            validateRegisterEmail(emailInput, emailError);
            if (formError) formError.textContent = '';
        });

        phoneInput?.addEventListener('input', () => {
            validateRegisterPhone(phoneInput, phoneError);
            if (formError) formError.textContent = '';
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = e.target.fullName.value.trim();
            const password = e.target.password.value;
            const emailState = validateRegisterEmail(emailInput, emailError);
            const phoneState = validateRegisterPhone(phoneInput, phoneError);

            if (formError) formError.textContent = '';

            if (!emailState.isValid) {
                emailInput?.focus();
                return;
            }

            if (!phoneState.isValid) {
                phoneInput?.focus();
                return;
            }

            try {
                await api.register(fullName, emailState.value, password, phoneState.value || undefined);
                await window.customModal.success(
                    getAuthText('registerSuccessMessage'),
                    getAuthText('registerSuccessTitle'),
                );
                window.location.href = '/customer/login.html';
            } catch (error) {
                if (formError) {
                    formError.textContent = `${getAuthText('registerFailedPrefix')}: ${error.message}`;
                }
            }
        });
    }

    // login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const submitBtn = document.getElementById('login-submit-btn');
        const errorBanner = document.getElementById('login-error');

        function showLoginError(message) {
            if (errorBanner) {
                errorBanner.textContent = message;
                errorBanner.classList.add('visible');
            } else {
                alert(message);
            }
        }

        function clearLoginError() {
            if (errorBanner) {
                errorBanner.textContent = '';
                errorBanner.classList.remove('visible');
            }
        }

        loginForm.querySelector('#email')?.addEventListener('input', clearLoginError);
        loginForm.querySelector('#password')?.addEventListener('input', clearLoginError);

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearLoginError();
            const email = e.target.email.value.trim();
            const password = e.target.password.value;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Đang đăng nhập...';
            }

            try {
                const data = await api.login(email, password);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify({ fullName: data.fullName, email: data.email, phone: data.phone }));

                if (window.customModal) {
                    await window.customModal.success(
                        getAuthText('loginSuccessMessage', { fullName: data.fullName }),
                        getAuthText('loginSuccessTitle'),
                    );
                }

                // Redirect back if came from somewhere
                const params = new URLSearchParams(window.location.search);
                const redirectTo = params.get('redirect');
                window.location.href = redirectTo || '/customer/index.html';
            } catch (error) {
                showLoginError(`${getAuthText('loginFailedPrefix')}: ${error.message}`);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Đăng nhập';
                }
            }
        });
    }
});
