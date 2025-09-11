const express = require('express');
const cors = require('cors');
const config = require('./config');
const allRoutes = require('./routes/index');

const app = express();

// Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json()); // Để parse JSON body
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.send('ParkChung API is running...');
});

app.use('/api', allRoutes);

// Middleware xử lý lỗi (nên đặt cuối cùng)
// app.use(require('./middlewares/error.middleware'));

module.exports = app;