document.addEventListener('DOMContentLoaded', function() {
  const popupOverlay = document.getElementById('popup-overlay');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('close-popup');
  const popupForm = document.forms['popup-form'];
  const scriptURL = 'https://script.google.com/macros/s/AKfycbw3v7HA2uQ5anB9WByDtgZe2fa7cRm3WGG5ZFmblTwd8MyHg4nv5u7POLVZ4ZrdGcMLdg/exec';

  // Function to show the popup
  function showPopup() {
    popupOverlay.style.display = 'flex';
  }

  // Check if popup has been shown
  const popupShown = localStorage.getItem('popupShown');
  if (!popupShown) {
    // Show popup after 60 seconds if not shown before
    setTimeout(function() {
        showPopup();
        localStorage.setItem('popupShown', 'true');
    }, 60000);
  }

  // ... Rest of the JavaScript logic for closing and submitting the popup ...
  
});

// Get form HTML
const formHTML = `
      <div class="popup-left">
        </div>
      <div class="popup-right">
        </div>  
  </div>    
`;

// Insert form HTML into popup
document.getElementById('popup').innerHTML += formHTML;