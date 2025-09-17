// File: client/customer/js/apiService.js

const API_URL = 'http://localhost:3001/api'; // Sử dụng port backend của bạn

// Hàm trợ giúp để xử lý các phản hồi từ API
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
    }
    return data;
};

// Hàm trợ giúp để thực hiện các yêu cầu fetch
const request = async (endpoint, options = {}, isFormData = false) => {
    const token = localStorage.getItem('userToken');
    const headers = {
        ...options.headers,
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    return handleResponse(response);
};

// Định nghĩa các hàm gọi API cụ thể
export const api = {
    login: (email, password) => {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    register: (fullName, email, password) => {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, password }),
        });
    },
    searchSpots: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return request(`/spots/search?${queryParams}`);
    },
    // HÀM MỚI: Lấy thông tin chi tiết của một điểm đỗ xe
    getSpotById: (spotId) => {
        return request(`/spots/${spotId}`);
    },

    // HÀM MỚI: Tạo một lượt đặt chỗ mới (yêu cầu đăng nhập)
    createBooking: (bookingData) => {
        return request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData), // bookingData = { spotId, startTime, endTime }
        });
    },

    // HÀM MỚI: Lấy danh sách các lượt đặt của người dùng hiện tại
    getMyBookings: () => {
        return request('/bookings/mybookings');
    },
    // HÀM MỚI: Tạo một điểm đỗ xe mới (gửi FormData)
    createSpot: (formData) => {
        // Khi gửi FormData, chúng ta không set Content-Type header
        // Trình duyệt sẽ tự động làm điều đó
        return request('/spots', {
            method: 'POST',
            body: formData,
        }, true); // Thêm một tham số để báo hiệu là không set Content-Type
    },
};