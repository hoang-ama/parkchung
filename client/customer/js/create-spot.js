// File: client/customer/js/create-spot.js
import { api } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Lấy các phần tử DOM ---
    const createSpotForm = document.getElementById('create-spot-form');
    // Kiểm tra xem có đúng là trang create-spot không
    if (!createSpotForm) {
        return;
    }

    const errorMessage = document.getElementById('error-message');
    const submitButton = createSpotForm.querySelector('button[type="submit"]');
    const getLocationBtn = document.getElementById('get-location-btn');
    const longitudeInput = document.getElementById('longitude');
    const latitudeInput = document.getElementById('latitude');

    // --- 1. KIỂM TRA ĐĂNG NHẬP ---
    if (!localStorage.getItem('userToken')) {
        alert('You must be logged in to list a spot.');
        window.location.href = `login.html?redirect=create-spot.html`;
        return;
    }

    // --- 2. LOGIC LẤY VỊ TRÍ HIỆN TẠI ---
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            if (!("geolocation" in navigator)) {
                alert("Geolocation is not supported by your browser. Please enter coordinates manually.");
                return;
            }

            getLocationBtn.textContent = 'Getting...';
            getLocationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitudeInput.value = position.coords.latitude.toFixed(6);
                    longitudeInput.value = position.coords.longitude.toFixed(6);
                    getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Found!';
                    setTimeout(() => {
                        getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Get Location';
                        getLocationBtn.disabled = false;
                    }, 2000);
                },
                (error) => {
                    alert(`Could not get location: ${error.message}`);
                    getLocationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Get Location';
                    getLocationBtn.disabled = false;
                }
            );
        });
    }

    // --- 3. LOGIC XỬ LÝ SUBMIT FORM ---
    createSpotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Tạo đối tượng FormData để gửi cả text và file
            const formData = new FormData();
            formData.append('address', document.getElementById('address').value);
            formData.append('longitude', longitudeInput.value);
            formData.append('latitude', latitudeInput.value);
            formData.append('hourlyRate', document.getElementById('hourlyRate').value);
            
            const imageFile = document.getElementById('spotImage').files[0];
            if (!imageFile) {
                throw new Error("Please select an image for your spot.");
            }
            formData.append('spotImage', imageFile);

            // Gọi API
            await api.createSpot(formData);
            
            alert('Spot submitted successfully! It will be visible after admin approval.');
            window.location.href = 'index.html';

        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            // Kích hoạt lại nút nếu có lỗi
            submitButton.disabled = false;
            submitButton.textContent = 'Submit for Review';
        }
    });
});