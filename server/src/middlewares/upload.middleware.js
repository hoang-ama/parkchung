const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'parkchung_spots',
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        transformation: [{ width: 1024, height: 768, crop: 'limit' }]
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // File limit 5MB
});

module.exports = upload;