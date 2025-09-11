const express = require('express');
const path = require('path');
const app = express();

// Middleware để xử lý JSON và form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình phục vụ các file tĩnh từ thư mục gốc của dự án (nơi có index.html)
app.use(express.static(path.join(__dirname, '..')));

// Cho phép truy cập từ client
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Mock data (thay thế cho database)
const parkingSpots = [
  {
    id: 'spot-001',
    address: 'BK Alumni House, Hanoi',
    details: 'Spacious parking, 24/7 security.',
    price: 40000, // VND
    available: true,
  },
  {
    id: 'spot-002',
    address: 'Hanoi University of Science and Technology',
    details: 'Near university main gate, convenient for students.',
    price: 50000,
    available: true,
  }
];

// Routes
app.get('/api/spots', (req, res) => {
  // Logic tìm kiếm chỗ trống
  const { location, startDateTime, endDateTime } = req.query;
  const filteredSpots = parkingSpots.filter(spot => spot.available && spot.address.includes(location));
  res.json(filteredSpots);
});

app.get('/api/spots/:id', (req, res) => {
  const spotId = req.params.id;
  const spot = parkingSpots.find(s => s.id === spotId);
  if (spot) {
    res.json(spot);
  } else {
    res.status(404).send('Parking spot not found.');
  }
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  // TODO: Implement logic to save booking to database and send email
  console.log('New booking:', booking);
  res.status(201).json({ message: 'Booking completed successfully.', bookingId: 'bk-001' });
});

module.exports = app;