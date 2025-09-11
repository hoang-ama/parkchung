
// Đảm bảo rằng đoạn mã này được thực thi sau khi DOM (Document Object Model) đã được tải xong. 
// Nếu script chạy trước khi các phần tử HTML được tạo, document.getElementById('close-popup') có thể trả về null.


document.addEventListener('DOMContentLoaded', function() {
  const popupOverlay = document.getElementById('popup-overlay');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('close-popup');
  const popupForm = document.forms['popup-form'];
  const scriptURL = 'https://script.google.com/macros/s/AKfycbw3v7HA2uQ5anB9WByDtgZe2fa7cRm3WGG5ZFmblTwd8MyHg4nv5u7POLVZ4ZrdGcMLdg/exec';


  // Function to show the popup
  function showPopup() {
    popupOverlay.style.display = 'flex'; // Show overlay
  }
  //  Check if popup has been shown
  const popupShown = localStorage.getItem('popupShown');
  if (!popupShown) {
    //  Show popup after 60 seconds if not shown before
    setTimeout(function() {
        showPopup();
        localStorage.setItem('popupShown', 'true');
    }, 60000);
   }
// Close popup when clicking the close button
if (closePopup && popup) {
    closePopup.addEventListener('click', function() {
        popupOverlay.style.display = 'none';   
    });
  }
 // Close popup when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target !== popup && !popup.contains(event.target)) {
        popupOverlay.style.display = 'none';
    }
});
// Handle popup form submission
if (popupForm) {
  popupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(popupForm);
    data.append('sheetName', 'Popup'); // Specify sheet for popup form data
    fetch(scriptURL, { method: 'POST', body: data })
      .then(response => {
        console.log('Popup Form Success!', response);
        alert('Yêu cầu của bạn đã được gửi! Chúng tôi sẽ liên hệ sớm.');
        popupForm.reset();
        popupOverlay.style.display = 'none'; // Close popup after submission
      })
      .catch(error => {
        console.error('Popup Form Error!', error.message);
        alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
      });
  });
}

// Reset timer on user activity
let timer;
function resetTimer() {
  if (!localStorage.getItem('popupShown')) {
    clearTimeout(timer);
    timer = setTimeout(showPopup, 60000);
  }
}

document.addEventListener('mousemove', resetTimer);
document.addEventListener('keydown', resetTimer);
document.addEventListener('click', resetTimer);

});





// Get form HTML
const formHTML = `
      <div class="popup-left">
        <h2>Gửi yêu cầu ngay cho Parkchung khi:</h2>
        <ul>
          <li>Bạn không tìm được chỗ đậu xe mình cần</li>
          <li>Yêu cầu khác</li>
        </ul>
        <p><strong>Hãy gửi yêu cầu cho chúng tôi!</strong></p>
      </div>
      <div class="popup-right">
        <p>Cần hỗ trợ? Hãy gửi yêu cầu cho chúng tôi!</p>
          <form name="popup-form">
          <input type="text" name="name" placeholder="Họ tên" required />
          <input type="tel" name="phone" placeholder="Số điện thoại" required />
          <input type="email" name="email" placeholder="Email" />
          <input type="text" name="address" placeholder="Địa chỉ" />
          <textarea name="request" placeholder="Yêu cầu"></textarea>
          <button type="submit">Gửi yêu cầu</button>
        </form>
      </div>  
  </div>    
`;

// Insert form HTML into popup
document.getElementById('popup').innerHTML += formHTML;