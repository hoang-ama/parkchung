const API_URL = 'http://localhost:3001/api'; 
// Helper function to handle responses from API
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
    }
    return data;
};

// Helper function to perform fetch requests
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

// Define specific API call functions
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
    // function to get details of a parking spot
    getSpotById: (spotId) => {
        return request(`/spots/${spotId}`);
    },

    // function to create a new booking (requires login)
    createBooking: (bookingData) => {
        return request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData), // bookingData = { spotId, startTime, endTime }
        });
    },

    // Function to get list of bookings of current user
    getMyBookings: () => {
        return request('/bookings/mybookings');
    },
    // function to create a new parking spot (send FormData)
    createSpot: (formData) => {
        return request('/spots', {
            method: 'POST',
            body: formData,
        }, true); //Signals that Content-Type is not set
    },
};