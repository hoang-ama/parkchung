ParkChung is the online parking space marketplace (platform) where individuals or businesses can list and rent out their available parking spots.

📋 Cấu trúc file và thư mục đầy đủ:
parkchung/
├── client/                     # Thư mục chứa toàn bộ code frontend
│   ├── assets/                 # Các file tĩnh như hình ảnh, font, v.v.
│   │   ├── images/
│   │   ├── logos/
│   │   └── fonts/
│   │
│   ├── customer/               # Code frontend cho trang khách hàng
│   │   ├── css/                # Style sheets
│   │   │   └── main.css
│   │   │
│   │   ├── js/                 # JavaScript logic
│   │   │   ├── scripts.js
│   │   │   └── popup-script.js
│   │   │
│   │   └── html/               # Các trang HTML
│   │       ├── index.html
│   │       ├── results.html        # Trang hiển thị kết quả tìm kiếm
│   │       └── spot-details.html   # Trang chi tiết chỗ đậu xe
│   │
│   └── admin/                  # Code frontend cho trang admin
│       ├── css/
│       │   └── admin.css
│       │
│       ├── js/
│       │   └── admin-scripts.js
│       │
│       └── html/
│           ├── login.html
│           └── dashboard.html      # Trang chính của Admin
│
├── server/                     # Thư mục chứa toàn bộ code backend (Node.js)
│   ├── src/                    # Thư mục chính của source code
│   │   ├── config/             # Cấu hình dự án
│   │   │   └── index.js
│   │   │
│   │   ├── controllers/        # Logic xử lý chính cho các routes
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingsController.js
│   │   │   └── spotsController.js
│   │   │
│   │   ├── models/             # Định nghĩa các schema cho cơ sở dữ liệu
│   │   │   ├── Booking.js
│   │   │   ├── ParkingSpot.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/             # Định nghĩa các API endpoints
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingsRoutes.js
│   │   │   └── spotsRoutes.js
│   │   │
│   │   ├── services/           # Logic nghiệp vụ phức tạp
│   │   │   ├── emailService.js
│   │   │   └── paymentService.js
│   │   │
│   │   ├── utils/              # Các hàm tiện ích dùng chung
│   │   │   └── helpers.js
│   │   │
│   │   └── app.js              # File chính để khởi tạo ứng dụng Express
│   │
│   ├── .env                    # File chứa các biến môi trường
│   ├── .gitignore              # File để bỏ qua các thư mục và file không cần thiết
│   ├── package.json            # Danh sách các dependencies và scripts
│   └── server.js               # File khởi động server
│
├── .gitignore                  # File .gitignore ở root để bỏ qua cả node_modules của frontend và backend
└── README.md