// Biến sẽ được sử dụng trên toàn bộ frontend
let API_URL;

// Kiểm tra xem trang web đang chạy ở môi trường nào
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Môi trường Local (Phát triển)
    API_URL = 'http://localhost:5000/api';
} else {
    // Môi trường Production (Khi đã deploy lên EC2)
    // Hãy thay thế bằng địa chỉ API thật của bạn
    API_URL = 'https://parkchung.com/api';
}

// Biến điều hướng Host Portal (gắn vào window để module có thể truy cập)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Môi trường Local: Host chạy trên port riêng (Vite: 5174 vì 5173 đang được sử dụng)
    window.HOST_URL = 'http://localhost:5174/host';
} else {
    // Môi trường Production (EC2)
    window.HOST_URL = 'https://parkchung.com/host';
}
