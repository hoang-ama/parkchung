const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const allRoutes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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