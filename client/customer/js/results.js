// File: client/customer/js/results.js

document.addEventListener('DOMContentLoaded', () => {
    const resultsGrid = document.getElementById('results-grid');
    if (!resultsGrid) return; // Chỉ chạy nếu đang ở trang results.html

    const params = new URLSearchParams(window.location.search);
    const criteria = {
        q: params.get('q'),
        startTime: params.get('startTime'),
        endTime: params.get('endTime')
    };
    
    loadAndDisplaySpots(criteria, resultsGrid);
});

async function loadAndDisplaySpots(criteria, container) {
    if (!container) return;
    container.innerHTML = '<p>Loading...</p>';
    try {
        const query = new URLSearchParams(criteria).toString();
        const response = await fetch(`${API_URL}/spots/search?${query}`);
        if (!response.ok) throw new Error(await response.text());
        const spots = await response.json();

        container.innerHTML = '';
        if (spots.length === 0) {
            container.innerHTML = '<p class="no-results">Sorry, no available parking spots were found for your criteria.</p>';
            return;
        }

        spots.forEach((spot, index) => {
            const spotCard = document.createElement('a');
            const spotDetailsUrl = `spot-details.html?id=${spot._id}&arrival=${encodeURIComponent(criteria.startTime)}&leaving=${encodeURIComponent(criteria.endTime)}`;
            spotCard.href = spotDetailsUrl;
            spotCard.className = 'spot-card';
            spotCard.style.animationDelay = `${index * 100}ms`;
            const imageUrl = spot.images && spot.images.length > 0 ? spot.images[0] : '/assets/image/parking-area.jpg';
            spotCard.innerHTML = `
                <img src="${imageUrl}" alt="${spot.address}" class="spot-card__image">
                <div class="spot-card__content">
                    <h3>${spot.address}</h3>
                    <div class="spot-card__info">
                        <span class="spot-card__info-price">${spot.hourlyRate.toLocaleString('vi-VN')} VND / hour</span>
                    </div>
                    <div class="spot-card__cta">Book Now</div>
                </div>
            `;
            container.appendChild(spotCard);
        });
    } catch (error) {
        container.innerHTML = `<p class="no-results" style="color: red;">Error: ${error.message}</p>`;
        console.error('Error loading spots:', error);
    }
}