// File: server/src/middlewares/upload.middleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

// Cấu hình Cloudinary bằng các biến môi trường
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

// Cấu hình multer để sử dụng Cloudinary làm nơi lưu trữ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'parkchung_spots',
        // THÊM 'webp' VÀO DANH SÁCH ĐƯỢC PHÉP
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        transformation: [{ width: 1024, height: 768, crop: 'limit' }]
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn file 5MB
});

module.exports = upload;