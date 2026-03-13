import { api } from './apiService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const VIETNAM_PHONE_REGEX = /^(?:0\d{9}|\+84\d{9})$/;

function normalizePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[\s().-]/g, '').trim();
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
        setFieldError(emailInput, errorElement, 'Email must include a valid domain, for example name@example.com.');
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
        setFieldError(phoneInput, errorElement, 'Phone must be a valid Vietnamese number like 0912345678 or +84912345678.');
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
                await window.customModal.success('Your account has been created successfully! Please login with your new account.', 'Registration Successful');
                window.location.href = 'login.html';
            } catch (error) {
                if (formError) {
                    formError.textContent = `Registration failed: ${error.message}`;
                }
            }
        });
    }

    // login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            try {
                const data = await api.login(email, password);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify({ fullName: data.fullName, email: data.email, phone: data.phone }));
                await window.customModal.success(`Welcome back, ${data.fullName}! You have successfully logged in to ParkChung.`, 'Login Successful');
                window.location.href = 'index.html';
            } catch (error) {
                alert(`Login failed: ${error.message}`);
            }
        });
    }
});
