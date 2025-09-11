// File: client/customer/js/results-script.js
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get('location');

    if (location) {
        document.querySelector('h2').textContent = `Search results at: ${location}`;
        fetchParkingSpots(location);
    }

    async function fetchParkingSpots(location) {
        try {
            const response = await fetch(`${API_BASE_URL}/spots?location=${encodeURIComponent(location)}`);
            const spots = await response.json();
            displaySpots(spots);
        } catch (error) {
            console.error('Error fetching parking spots:', error);
            document.getElementById('results-list').innerHTML = '<p>Không tìm thấy chỗ đậu xe nào.</p>';
        }
    }

    function displaySpots(spots) {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        if (spots.length === 0) {
            resultsList.innerHTML = '<p>No parking found!</p>';
            return;
        }

        spots.forEach(spot => {
            const spotElement = document.createElement('div');
            spotElement.className = 'spot-item';
            spotElement.innerHTML = `
                <h3>${spot.address}</h3>
                <p>${spot.details}</p>
                <p>Giá: ${spot.price} VND</p>
                <a href="spot-details.html?id=${spot.id}">View details and Book</a>
            `;
            resultsList.appendChild(spotElement);
        });
    }
});