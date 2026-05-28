// File: server/src/clear-bookings.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function clear() {
    try {
        console.log('Connecting to MongoDB using URI:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
        
        const deleteResult = await Booking.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} bookings.`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

clear();
