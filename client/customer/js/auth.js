import { api } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
   //register
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = e.target.fullName.value;
            const email = e.target.email.value;
            const password = e.target.password.value;

            try {
                await api.register(fullName, email, password);
                alert('Registration successful! Please log in.');
                window.location.href = 'login.html';
            } catch (error) {
                alert(`Registration failed: ${error.message}`);
            }
        });
    }

    //login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            try {
                const data = await api.login(email, password);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify({ fullName: data.fullName, email: data.email }));
                alert('Login successful!');
                window.location.href = 'index.html';
            } catch (error) {
                alert(`Login failed: ${error.message}`);
            }
        });
    }
});