// File: server/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const allRoutes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// --- CẤU HÌNH CORS NÂNG CAO ---
// Lấy danh sách các domain được phép từ file .env
const allowedOrigins = config.corsOrigin ? config.corsOrigin.split(',') : [];
allowedOrigins.push('http://localhost:3000'); // Customer portal dev
allowedOrigins.push('http://localhost:5173'); // Host portal dev (Vite)
allowedOrigins.push('http://localhost:5174'); // Host portal dev (Vite - alternate port)

const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép các request không có origin (ví dụ: Postman, mobile apps)
        if (!origin) return callback(null, true);

        // Kiểm tra xem origin của request có nằm trong danh sách trắng không
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

// Sử dụng cors với cấu hình mới
app.use(cors(corsOptions));
// --- KẾT THÚC CẤU HÌNH CORS ---


app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf?.toString();
    },
}));
app.use(express.urlencoded({ extended: true }));

// Public thư mục 'public'
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/', (req, res) => {
    res.send('Welcome to ParkChung API!');
});
app.use('/api', allRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);
module.exports = app;