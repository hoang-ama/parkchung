// File: client/customer/js/results.js

import { api } from './apiService.js';

// Pagination state
let allSpots = [];
let filteredSpots = []; // Spots after filtering
let currentPage = 1;
const spotsPerPage = 6;

// Filter state
let activeFilters = {
    vehicleTypes: [],
    bookingTypes: [],
    paymentMethods: []
};

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
    setupFilterListeners();
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
        filteredSpots = spots; // Initially, all spots are shown

        // Update results count
        updateResultsCount();

        // Display first page
        displaySpots(params);

        // Apply i18n if available
        if (window.__applyI18n) window.__applyI18n();

    } catch (error) {
        container.innerHTML = `<p class="no-results" style="color: red;">Error: ${error.message}</p>`;
        console.error('Error loading spots:', error);
    }
}

// Setup filter event listeners
function setupFilterListeners() {
    // Vehicle type filters
    document.querySelectorAll('input[name="vehicleType"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.vehicleTypes.push(e.target.value);
            } else {
                activeFilters.vehicleTypes = activeFilters.vehicleTypes.filter(v => v !== e.target.value);
            }
            applyFilters();
        });
    });

    // Booking type filters
    document.querySelectorAll('input[name="bookingType"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.bookingTypes.push(e.target.value);
            } else {
                activeFilters.bookingTypes = activeFilters.bookingTypes.filter(v => v !== e.target.value);
            }
            applyFilters();
        });
    });

    // Payment method filters
    document.querySelectorAll('input[name="paymentMethod"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.paymentMethods.push(e.target.value);
            } else {
                activeFilters.paymentMethods = activeFilters.paymentMethods.filter(v => v !== e.target.value);
            }
            applyFilters();
        });
    });

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Uncheck all checkboxes
            document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // Reset filters
            activeFilters = {
                vehicleTypes: [],
                bookingTypes: [],
                paymentMethods: []
            };

            applyFilters();
        });
    }
}

// Apply filters to spots
function applyFilters() {
    filteredSpots = allSpots.filter(spot => {
        // Vehicle type filter
        if (activeFilters.vehicleTypes.length > 0) {
            const hasMatchingVehicle = activeFilters.vehicleTypes.some(type =>
                spot.vehicleTypes && spot.vehicleTypes.includes(type)
            );
            if (!hasMatchingVehicle) return false;
        }

        // Booking type filter
        if (activeFilters.bookingTypes.length > 0) {
            const hasMatchingBookingType = activeFilters.bookingTypes.some(type =>
                spot.bookingTypes && spot.bookingTypes.includes(type)
            );
            if (!hasMatchingBookingType) return false;
        }

        // Payment method filter
        if (activeFilters.paymentMethods.length > 0) {
            const hasMatchingPayment = activeFilters.paymentMethods.some(method =>
                spot.paymentMethods && spot.paymentMethods.includes(method)
            );
            if (!hasMatchingPayment) return false;
        }

        return true;
    });

    // Reset to first page when filters change
    currentPage = 1;

    // Update results count
    updateResultsCount();

    // Re-display spots
    const params = new URLSearchParams(window.location.search);
    displaySpots(params);
}

// Update results count display
function updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (countEl) {
        const total = allSpots.length;
        const filtered = filteredSpots.length;

        if (filtered === total) {
            countEl.textContent = `Showing ${total} parking spot${total !== 1 ? 's' : ''}`;
        } else {
            countEl.textContent = `Showing ${filtered} of ${total} parking spot${total !== 1 ? 's' : ''}`;
        }
    }
}

function displaySpots(params) {
    const resultsGrid = document.getElementById('results-grid');
    resultsGrid.innerHTML = '';

    // Check if there are any filtered spots
    if (filteredSpots.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results">No parking spots match your selected filters.</p>';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredSpots.length / spotsPerPage);
    const startIndex = (currentPage - 1) * spotsPerPage;
    const endIndex = startIndex + spotsPerPage;
    const spotsToDisplay = filteredSpots.slice(startIndex, endIndex);

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
            : '/assets/image/Spot Image Coming Soon.png';

        spotCard.innerHTML = `
            <img src="${imageUrl}" alt="${spot.address}" class="spot-card__image" onerror="this.onerror=null; this.src='/assets/image/Spot Image Coming Soon.png';">
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

    // Helper function to create page button
    const createPageButton = (pageNum) => {
        const pageButton = document.createElement('button');
        pageButton.textContent = pageNum;
        pageButton.style.cssText = `
            width: 40px;
            height: 40px;
            padding: 8px;
            background: ${pageNum === currentPage ? 'var(--primary)' : '#f0f0f0'};
            color: ${pageNum === currentPage ? 'white' : '#333'};
            border: 2px solid ${pageNum === currentPage ? 'var(--primary)' : '#ddd'};
            border-radius: 50%;
            font-weight: ${pageNum === currentPage ? '700' : '600'};
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            box-shadow: ${pageNum === currentPage ? '0 4px 15px rgba(19, 180, 126, 0.3)' : 'none'};
        `;
        pageButton.addEventListener('click', () => {
            currentPage = pageNum;
            displaySpots(params);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        if (pageNum !== currentPage) {
            pageButton.addEventListener('mouseenter', (e) => {
                e.target.style.background = '#e0e0e0';
                e.target.style.transform = 'scale(1.1)';
            });
            pageButton.addEventListener('mouseleave', (e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.transform = 'scale(1)';
            });
        }
        return pageButton;
    };

    // Helper function to create ellipsis
    const createEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.cssText = `
            padding: 0 8px;
            color: #666;
            font-weight: 600;
            font-size: 14px;
        `;
        return ellipsis;
    };

    // Truncated pagination logic
    const showPages = new Set();

    // Always show first 3 pages
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
        showPages.add(i);
    }

    // Always show last 3 pages
    for (let i = Math.max(1, totalPages - 2); i <= totalPages; i++) {
        showPages.add(i);
    }

    // Show current page and neighbors (current - 1, current, current + 1)
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        showPages.add(i);
    }

    // Convert to sorted array and render with ellipsis
    const sortedPages = Array.from(showPages).sort((a, b) => a - b);

    sortedPages.forEach((pageNum, index) => {
        // Add ellipsis if there's a gap
        if (index > 0 && pageNum - sortedPages[index - 1] > 1) {
            pageNumbersDiv.appendChild(createEllipsis());
        }
        pageNumbersDiv.appendChild(createPageButton(pageNum));
    });

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