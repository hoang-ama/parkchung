// File: spot-details-script.js
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const spotId = params.get('id');

    if (spotId) {
        fetchSpotDetails(spotId);
    }

    async function fetchSpotDetails(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/spots/${id}`);
            const spot = await response.json();
            displaySpotDetails(spot);
        } catch (error) {
            console.error('Error fetching spot details:', error);
            document.getElementById('spot-info').innerHTML = '<p>Parking spot details not found.</p>';
        }
    }

    function displaySpotDetails(spot) {
        const spotInfo = document.getElementById('spot-info');
        spotInfo.innerHTML = `
            <h2>${spot.address}</h2>
            <img src="${spot.image}" alt="Image of the parking spot" style="max-width: 100%; height: auto; margin-bottom: 20px;">
            <p><strong>Details:</strong> ${spot.details}</p>
            <p><strong>Price:</strong> ${spot.price} VND/hour</p>
            <p><strong>Status:</strong> ${spot.available ? 'Available' : 'Booked'}</p>
            <p><a href="${spot.googleMapUrl}" target="_blank">View on Google Maps</a></p>
        `;
    }

    document.getElementById('bookingForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const bookingData = {
            spotId,
            name,
            email,
            // Add other data fields like time
        };

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Booking successful! A confirmation email has been sent to you.');
                // Redirect to homepage or confirmation page
            } else {
                alert(`Booking error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('An error occurred. Please try again.');
        }
    });
});