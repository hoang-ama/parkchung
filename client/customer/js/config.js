// Biến sẽ được sử dụng trên toàn bộ frontend
let API_URL;

// Kiểm tra xem trang web đang chạy ở môi trường nào
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Môi trường Local (Phát triển)
    API_URL = 'http://localhost:3001/api';
} else {
    // Môi trường Production (Khi đã deploy lên EC2)
    // Hãy thay thế bằng địa chỉ API thật của bạn
    API_URL = 'https://www.parkchung.com/api'; 
}

// In ra để kiểm tra
console.log(`Current API URL: ${API_URL}`);