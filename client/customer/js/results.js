// File: client/customer/js/results.js

import { api } from './apiService.js';

// Pagination state
let allSpots = [];
let currentPage = 1;
const spotsPerPage = 6;

document.addEventListener('DOMContentLoaded', async () => {
    const resultsGrid = document.getElementById('results-grid');
    if (!resultsGrid) return; // Only run if on results.html page

    const params = new URLSearchParams(window.location.search);
    const criteria = {
        q: params.get('q'),
        startTime: params.get('startTime'),
        endTime: params.get('endTime')
    };

    await loadAndDisplaySpots(criteria, resultsGrid, params);
});

async function loadAndDisplaySpots(criteria, container, params) {
    if (!container) return;
    container.innerHTML = '<p>Loading...</p>';

    try {
        const searchParams = Object.fromEntries(params.entries());
        const spots = await api.searchSpots(searchParams);

        container.innerHTML = '';

        if (spots.length === 0) {
            container.innerHTML = '<p class="no-results" data-i18n="no_results">Sorry, no available parking spots were found for your criteria.</p>';
            return;
        }

        // Store all spots in state
        allSpots = spots;

        // Display first page
        displaySpots(params);

        // Apply i18n if available
        if (window.__applyI18n) window.__applyI18n();

    } catch (error) {
        container.innerHTML = `<p class="no-results" style="color: red;">Error: ${error.message}</p>`;
        console.error('Error loading spots:', error);
    }
}

function displaySpots(params) {
    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = '';

    // Calculate pagination
    const totalPages = Math.ceil(allSpots.length / spotsPerPage);
    const startIndex = (currentPage - 1) * spotsPerPage;
    const endIndex = startIndex + spotsPerPage;
    const spotsToDisplay = allSpots.slice(startIndex, endIndex);

    // Display spots for current page
    spotsToDisplay.forEach((spot, index) => {
        const startTime = params.get('startTime');
        const endTime = params.get('endTime');

        const spotCard = document.createElement('a');
        spotCard.href = `spot-details.html?id=${spot._id}&arrival=${encodeURIComponent(startTime)}&leaving=${encodeURIComponent(endTime)}`;
        spotCard.className = 'spot-card';
        spotCard.style.animationDelay = `${index * 100}ms`;

        const imageUrl = spot.images && spot.images.length > 0
            ? spot.images[0]
            : '/assets/image/parking-area.jpg';

        spotCard.innerHTML = `
            <img src="${imageUrl}" alt="${spot.address}" class="spot-card__image">
            <div class="spot-card__content">
                <h3>${spot.address}</h3>
                <div class="spot-card__info">
                    <span class="spot-card__info-price">${spot.hourlyRate.toLocaleString('vi-VN')} VND / hour</span>
                </div>
                <div class="spot-card__cta" data-i18n="book_now">Book Now</div>
            </div>
        `;

        resultsGrid.appendChild(spotCard);
    });

    // Add pagination controls
    if (totalPages > 1) {
        const paginationContainer = createPaginationControls(totalPages, params);
        resultsGrid.appendChild(paginationContainer);
    }

    // Apply i18n if available
    if (window.__applyI18n) window.__applyI18n();
}

function createPaginationControls(totalPages, params) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-controls';
    paginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 40px;
        padding: 20px;
        grid-column: 1 / -1;
    `;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.style.cssText = `
        padding: 12px 24px;
        background: ${currentPage === 1 ? '#e0e0e0' : 'var(--primary)'};
        color: ${currentPage === 1 ? '#999' : 'white'};
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
        transition: all 0.3s ease;
        font-family: 'Montserrat', sans-serif;
    `;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displaySpots(params);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    if (currentPage > 1) {
        prevButton.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'var(--primary-dark)';
            e.target.style.transform = 'translateY(-2px)';
        });
        prevButton.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.transform = 'translateY(0)';
        });
    }

    // Page numbers
    const pageNumbersDiv = document.createElement('div');
    pageNumbersDiv.style.cssText = `
        display: flex;
        gap: 8px;
        align-items: center;
    `;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.style.cssText = `
            width: 40px;
            height: 40px;
            padding: 8px;
            background: ${i === currentPage ? 'var(--primary)' : '#f0f0f0'};
            color: ${i === currentPage ? 'white' : '#333'};
            border: 2px solid ${i === currentPage ? 'var(--primary)' : '#ddd'};
            border-radius: 50%;
            font-weight: ${i === currentPage ? '700' : '600'};
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            box-shadow: ${i === currentPage ? '0 4px 15px rgba(19, 180, 126, 0.3)' : 'none'};
        `;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displaySpots(params);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        if (i !== currentPage) {
            pageButton.addEventListener('mouseenter', (e) => {
                e.target.style.background = '#e0e0e0';
                e.target.style.transform = 'scale(1.1)';
            });
            pageButton.addEventListener('mouseleave', (e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.transform = 'scale(1)';
            });
        }
        pageNumbersDiv.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.disabled = currentPage === totalPages;
    nextButton.style.cssText = `
        padding: 12px 24px;
        background: ${currentPage === totalPages ? '#e0e0e0' : 'var(--primary)'};
        color: ${currentPage === totalPages ? '#999' : 'white'};
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
        transition: all 0.3s ease;
        font-family: 'Montserrat', sans-serif;
    `;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displaySpots(params);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    if (currentPage < totalPages) {
        nextButton.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'var(--primary-dark)';
            e.target.style.transform = 'translateY(-2px)';
        });
        nextButton.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.transform = 'translateY(0)';
        });
    }

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageNumbersDiv);
    paginationDiv.appendChild(nextButton);

    return paginationDiv;
}