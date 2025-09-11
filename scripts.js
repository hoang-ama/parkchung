// File: scripts.js
const googleSheetScriptURL = 'https://script.google.com/macros/s/AKfycbw3v7HA2uQ5anB9WByDtgZe2fa7cRm3WGG5ZFmblTwd8MyHg4nv5u7POLVZ4ZrdGcMLdg/exec'; 
const API_BASE_URL = 'http://localhost:3000/api'; // Đường dẫn đến backend của bạn

document.addEventListener('DOMContentLoaded', () => {
    console.log("Parkchung Script Initializing... DOMContentLoaded.");

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const location = document.getElementById('location').value.trim();
    const startDateTime = document.getElementById('start-datetime').value;
    const endDateTime = document.getElementById('end-datetime').value;
  
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    if (new Date(startDateTime) >= new Date(endDateTime)) {
        alert('End time must be after start time.');
        return;
    }

    // Redirect to results page with search parameters
    window.location.href = `results.html?location=${encodeURIComponent(location)}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
});


// Nhập thông tin subscription và kiểm tra định dạnh email trong footer (email-subscription-form)

     function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
     
      const subscribeForm = document.forms['email-subscription-form'];
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', e => { 
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('#subscriber-email');
            const submitButton = subscribeForm.querySelector('.subscribe-button');
            if (emailInput) {
                const email = emailInput.value.trim();
                if (validateEmail(email)) { 
                    if(submitButton) { submitButton.disabled = true; submitButton.textContent = "Subscribing..."; }
                    sendSubscriptionEmailToGoogleSheet(email, subscribeForm, submitButton);
                } else { alert('Please enter a valid email address (e.g., example@email.com).'); }
            }
        });
    }

    function sendSubscriptionEmailToGoogleSheet(email, form, button) { 
        const data = new FormData(); 
        data.append('timestamp', new Date().toISOString()); data.append('email', email); data.append('sheetName', 'Email'); 
        fetch(googleSheetScriptURL, { method: 'POST', body: data }) 
            .then(response => response.text()) 
            .then(textResponse => {
                console.log('Subscription API Response:', textResponse); alert('Thank you for subscribing!'); if(form) form.reset();
            })
            .catch(error => { console.error('Subscription Error!', error.message); alert('An error occurred. Please try again.'); })
            .finally(() => { if(button) { button.disabled = false; button.textContent = "Sign-up"; }});
    }
    

    // Testimonials slider
  $(function () {
    $('.testimonials-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      dots: true,
      arrows: false
    });
  });
    
});