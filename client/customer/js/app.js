document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('header nav');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // If the user is logged in, show the full menu
        nav.innerHTML = `
            <a href="create-spot.html" style="text-decoration: none; color: #13b47e; font-weight: 500;">Become a Host</a>
            <a href="my-bookings.html" style="text-decoration: none; color: #13b47e; font-weight: 500; margin-left: 15px;">My Bookings</a>
            <span style="margin: 0 15px;">|</span>
            <span>Welcome, ${userData.fullName}!</span>
            <a href="#" id="logout-btn" style="margin-left: 15px; text-decoration: none; color: #e74c3c; font-weight: 500;">Logout</a>
        `;
        
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        
        });
    } else {
       // If not logged in, show default menu
        nav.innerHTML = `
            <a href="register.html">Become a Host / Register</a>
            <a href="login.html">Login</a>
        `;
    }
});