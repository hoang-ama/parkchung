const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
};

module.exports = connectDB;