import { api } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
   // --- Get DOM elements ---
    const createSpotForm = document.getElementById('create-spot-form');
    if (!createSpotForm) {
        return;
    }

    const errorMessage = document.getElementById('error-message');
    const submitButton = createSpotForm.querySelector('button[type="submit"]');
    const getLocationBtn = document.getElementById('get-location-btn');
    const longitudeInput = document.getElementById('longitude');
    const latitudeInput = document.getElementById('latitude');

   // check login
    if (!localStorage.getItem('userToken')) {
        alert('You must be logged in to list a spot.');
        window.location.href = `login.html?redirect=create-spot.html`;
        return;
    }

    // logic get current location
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
    // --- 3. SUBMIT FORM PROCESSING LOGIC ---
        createSpotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const imageFile = e.target.spotImage.files[0];

        // Validation cơ bản
        if (!imageFile) {
            alert("Please select an image for your spot.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Compressing image...';

        // --- PHẦN MỚI: NÉN ẢNH TRƯỚC KHI UPLOAD ---
        const options = {
            maxSizeMB: 1,          // Kích thước file tối đa sau khi nén (1MB)
            maxWidthOrHeight: 1920,  // Chiều rộng hoặc chiều cao tối đa của ảnh
            useWebWorker: true,    // Sử dụng Web Worker để nén mà không làm treo giao diện
        }

        try {
            console.log(`Original file size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
            
            // Gọi hàm nén ảnh từ thư viện
            const compressedFile = await imageCompression(imageFile, options);
            
            console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
            submitButton.textContent = 'Submitting...';

            // --- KẾT THÚC PHẦN NÉN ẢNH ---

            // Tạo đối tượng FormData để gửi cả text và file đã nén
            const formData = new FormData();
            formData.append('address', e.target.address.value);
            formData.append('longitude', e.target.longitude.value);
            formData.append('latitude', e.target.latitude.value);
            formData.append('hourlyRate', e.target.hourlyRate.value);
            formData.append('spotImage', compressedFile, compressedFile.name); // Gửi file đã nén

            // Gọi API
            await api.createSpot(formData);
            
            alert('Spot submitted successfully! It will be visible after admin approval.');
            window.location.href = 'index.html';

        } catch (error) {
            console.error(error);
            errorMessage.textContent = `Error: ${error.message}`;
            // Kích hoạt lại nút nếu có lỗi
            submitButton.disabled = false;
            submitButton.textContent = 'Submit for Review';
        }
    });
});