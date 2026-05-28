// File: server/src/server.js
const dns = require('dns');
// Set Google & Cloudflare DNS to bypass local querySrv ECONNREFUSED errors for Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./app');
const config = require('./config');
const connectDB = require('./config/database');

// Connect to Database
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});