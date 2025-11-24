# 🅿️ ParkChung - Nền tảng Chia sẻ & Đặt chỗ Bãi đỗ xe

**ParkChung** là một ứng dụng web full-stack được xây dựng để giải quyết vấn đề tìm kiếm và quản lý bãi đỗ xe tại các đô thị Việt Nam. Nền tảng cho phép các chủ xe (host) đăng ký và cho thuê các điểm đỗ xe chưa sử dụng, đồng thời giúp người lái xe (user) dễ dàng tìm kiếm, đặt chỗ và thanh toán một cách nhanh chóng.

*Khẩu hiệu: Save time. Save money. Save Earth.*

## ✨ Tính năng nổi bật

### Cho Người tìm chỗ đỗ (User)

  * **Tìm kiếm thông minh:** Tìm kiếm bãi đỗ theo địa chỉ với danh sách gợi ý tự động.
  * **Kết quả trực quan:** Xem danh sách các bãi đỗ có sẵn với hình ảnh, địa chỉ và giá cả rõ ràng.
  * **Đặt chỗ dễ dàng:** Chọn thời gian và xác nhận đặt chỗ chỉ trong vài cú nhấp chuột.
  * **Quản lý lịch sử:** Xem lại tất cả các lượt đặt chỗ đã và đang diễn ra trong trang "My Bookings".
  * **Xác thực an toàn:** Hệ thống đăng ký, đăng nhập bảo mật bằng JWT.

### Cho Chủ xe (Host)

  * **Đăng ký bãi đỗ:** Dễ dàng đăng thông tin bãi đỗ của bạn qua một biểu mẫu thông minh.
  * **Lấy vị trí tự động:** Tự động lấy tọa độ chính xác bằng Geolocation API của trình duyệt.
  * **Tải ảnh:** Tải ảnh bãi đỗ trực tiếp lên dịch vụ cloud (Cloudinary) để tăng tính tin cậy.

### Cho Quản trị viên (Admin)

  * **Dashboard tổng quan:** Theo dõi các chỉ số quan trọng của hệ thống (tổng số người dùng, bãi đỗ, lượt đặt chỗ).
  * **Quản lý toàn diện:** Xem, quản lý danh sách người dùng, bãi đỗ và lịch sử đặt chỗ.
  * **Phê duyệt nội dung:** Kiểm duyệt và phê duyệt các bãi đỗ xe mới do chủ xe đăng lên để đảm bảo chất lượng.

## 🚀 Công nghệ sử dụng

| Hạng mục | Công nghệ |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Flatpickr.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (với Mongoose ODM) |
| **Xác thực** | JSON Web Token (JWT) |
| **Upload Ảnh** | Multer, Cloudinary |

## 🏗️ Cấu trúc Thư mục

Dự án được tổ chức theo cấu trúc client-server rõ ràng, dễ dàng bảo trì và mở rộng.

```
parkchung/
├── client/                     # Mã nguồn Frontend
│   ├── admin/                  # Giao diện trang quản trị
│   └── customer/               # Giao diện cho khách hàng
│       ├── css/
│       ├── js/
│       └── *.html
│   └── assets/                 # Tài nguyên tĩnh (ảnh, logo)
├── server/                     # Mã nguồn Backend (Node.js)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env                    # File biến môi trường
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml          # Cấu hình GitHub Actions cho Frontend
├── .gitignore
└── README.md
```



## 🛠️ Hướng dẫn Cài đặt & Chạy Local

**Yêu cầu:**

  * Node.js (v16 trở lên)
  * npm
  * MongoDB (Cài đặt local hoặc sử dụng tài khoản MongoDB Atlas)
  * VS Code với tiện ích "Live Server"

### 1\. Backend

```bash
# 1. Đi đến thư mục server
cd server/

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo file .env và điền thông tin
# (Xem lại các hướng dẫn trước để có cấu trúc file .env hoàn chỉnh)
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_BASE_URL=http://127.0.0.1:3000

# PayPal sandbox
PAYPAL_CLIENT_ID=AZbVygZyHq1YWlPGE3BANraK3eTwNOj2J4HiwDg6ZBZ8MYpQqZqXTW9B8SAUESMiLfbkDZsWBXMZ6ivq
PAYPAL_CLIENT_SECRET=AZbVygZyHq1YWlPGE3BANraK3eTwNOj2J4HiwDg6ZBZ8MYpQqZqXTW9B8SAUESMiLfbkDZsWBXMZ6ivq
PAYPAL_MODE=sandbox
PAYPAL_RETURN_URL=http://127.0.0.1:3000/customer/payment-result.html
PAYPAL_CANCEL_URL=http://127.0.0.1:3000/customer/payment-cancel.html
PAYPAL_WEBHOOK_ID=7NH13511YE367801D # optional in local dev
PAYPAL_USD_EXCHANGE_RATE=24000

# 4. Chạy server ở chế độ development
npm run dev
```

Server sẽ chạy tại `http://localhost:3001`.

### 2\. Frontend

1.  Mở toàn bộ thư mục `parkchung/` bằng VS Code.
2.  Đi đến tệp `client/customer/index.html`.
3.  Nhấp chuột phải và chọn **"Open with Live Server"**.
4.  Trang web sẽ được mở trong trình duyệt, thường ở địa chỉ `http://127.0.0.1:3000`.

### Ghi chú cấu hình PayPal

- Tạo ứng dụng tại [developer.paypal.com](https://developer.paypal.com/) để lấy `PAYPAL_CLIENT_ID` và `PAYPAL_CLIENT_SECRET`.
- `PAYPAL_RETURN_URL` và `PAYPAL_CANCEL_URL` cần trỏ tới các trang frontend `customer/payment-result.html` và `customer/payment-cancel.html`.
- Đăng ký webhook trong PayPal để lấy `PAYPAL_WEBHOOK_ID`. Bạn có thể bỏ trống khi phát triển local (sẽ bỏ qua bước xác minh chữ ký).
- `PAYPAL_USD_EXCHANGE_RATE` giúp quy đổi VND sang USD khi gửi đơn lên PayPal. Có thể thay bằng API tỷ giá thực tế nếu cần.

## 🔮 Lộ trình Phát triển Tương lai

  * **v1.1:**
      * [ ] Tích hợp Cổng thanh toán (MoMo, VnPay).
      * [ ] Hiển thị kết quả tìm kiếm trên Bản đồ tương tác (Google Maps API).
      * [ ] Xây dựng hệ thống Đánh giá & Bình luận cho các bãi đỗ.
  * **v1.2:**
      * [ ] Cho phép Host quản lý Lịch trống (Availability Calendar).
      * [ ] Thêm Bộ lọc Tìm kiếm Nâng cao (có mái che, loại xe,...).
  * **v2.0:**
      * [ ] Xây dựng Dashboard báo cáo Doanh thu cho Host.
      * [ ] Hoàn thiện quy trình CI/CD để tự động deploy cả backend.
