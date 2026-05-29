// auth-register.js - Dedicated registration handler for new Figma-accurate form
import { api } from './apiService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const VIETNAM_PHONE_REGEX = /^(?:0\d{9}|\+84\d{9})$/;

function normalizePhone(phoneNumber) {
    return phoneNumber.replace(/[\s().-]/g, '').trim();
}

function setFieldError(input, errorElement, message) {
    if (!input) return;
    input.classList.toggle('input-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorElement) errorElement.textContent = message;
}

function validateEmail(emailInput, errorElement) {
    const email = emailInput.value.trim();
    if (!email) {
        setFieldError(emailInput, errorElement, '');
        return { isValid: true, value: email };
    }
    if (!EMAIL_REGEX.test(email)) {
        setFieldError(emailInput, errorElement, 'Email phải có tên miền hợp lệ, ví dụ name@example.com.');
        return { isValid: false, value: email };
    }
    setFieldError(emailInput, errorElement, '');
    return { isValid: true, value: email.toLowerCase() };
}

function validatePhone(phoneInput, errorElement) {
    const raw = phoneInput.value.trim();
    if (!raw) {
        setFieldError(phoneInput, errorElement, '');
        return { isValid: true, value: '' };
    }
    const normalized = normalizePhone(raw);
    if (!VIETNAM_PHONE_REGEX.test(normalized)) {
        setFieldError(phoneInput, errorElement, 'Số điện thoại phải đúng định dạng Việt Nam như 0912345678 hoặc +84912345678.');
        return { isValid: false, value: normalized };
    }
    setFieldError(phoneInput, errorElement, '');
    return { isValid: true, value: normalized };
}

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    const firstNameInput = registerForm.querySelector('#firstName');
    const lastNameInput = registerForm.querySelector('#lastName');
    const emailInput = registerForm.querySelector('#email');
    const phoneInput = registerForm.querySelector('#phone');
    const passwordInput = registerForm.querySelector('#password');
    const confirmPasswordInput = registerForm.querySelector('#confirmPassword');
    const emailError = registerForm.querySelector('#email-error');
    const phoneError = registerForm.querySelector('#phone-error');
    const passwordError = registerForm.querySelector('#password-error');
    const formErrorBanner = registerForm.querySelector('#register-error') || document.getElementById('register-error');
    const submitBtn = document.getElementById('register-submit-btn');

    function clearFormError() {
        if (formErrorBanner) {
            formErrorBanner.textContent = '';
            formErrorBanner.classList.remove('visible');
        }
    }

    function showFormError(message) {
        if (formErrorBanner) {
            formErrorBanner.textContent = message;
            formErrorBanner.classList.add('visible');
        }
    }

    // Live validation
    emailInput?.addEventListener('input', () => {
        validateEmail(emailInput, emailError);
        clearFormError();
    });

    phoneInput?.addEventListener('input', () => {
        validatePhone(phoneInput, phoneError);
        clearFormError();
    });

    confirmPasswordInput?.addEventListener('input', () => {
        if (passwordInput && confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
            setFieldError(confirmPasswordInput, passwordError, 'Mật khẩu xác nhận không khớp.');
        } else {
            setFieldError(confirmPasswordInput, passwordError, '');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFormError();

        // Validate
        const firstName = firstNameInput?.value.trim() || '';
        const lastName = lastNameInput?.value.trim() || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const password = passwordInput?.value || '';
        const confirmPassword = confirmPasswordInput?.value || '';

        if (!fullName) {
            showFormError('Vui lòng nhập họ và tên của bạn.');
            firstNameInput?.focus();
            return;
        }

        const emailState = validateEmail(emailInput, emailError);
        if (!emailState.isValid || !emailState.value) {
            if (!emailState.value) {
                setFieldError(emailInput, emailError, 'Vui lòng nhập địa chỉ email.');
            }
            emailInput?.focus();
            return;
        }

        const phoneState = validatePhone(phoneInput, phoneError);
        if (!phoneState.isValid) {
            phoneInput?.focus();
            return;
        }

        if (!password) {
            showFormError('Vui lòng nhập mật khẩu.');
            passwordInput?.focus();
            return;
        }

        if (password.length < 6) {
            showFormError('Mật khẩu phải có ít nhất 6 ký tự.');
            passwordInput?.focus();
            return;
        }

        if (confirmPassword && confirmPassword !== password) {
            setFieldError(confirmPasswordInput, passwordError, 'Mật khẩu xác nhận không khớp.');
            confirmPasswordInput?.focus();
            return;
        }

        // Submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang tạo tài khoản...';

        try {
            await api.register(fullName, emailState.value, password, phoneState.value || undefined);

            if (window.customModal) {
                await window.customModal.success(
                    'Tạo tài khoản thành công! Vui lòng đăng nhập bằng tài khoản mới của bạn.',
                    'Đăng ký thành công'
                );
            }
            window.location.href = 'login.html?registered=true';
        } catch (error) {
            showFormError(`Đăng ký thất bại: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Tạo tài khoản';
        }
    });
});
