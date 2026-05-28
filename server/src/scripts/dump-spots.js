// File: server/src/scripts/dump-spots.js
const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS to Google public DNS to resolve Atlas SRV correctly
dns.setServers(['8.8.8.8']);

const MONGODB_URI = 'mongodb+srv://parkchung:00akXpySfQEt90Yi@cluster0.1yzl5bb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const ParkingSpot = mongoose.model('ParkingSpot', new mongoose.Schema({
            name: String,
            address: String,
            images: [String],
            status: String
        }, { collection: 'parkingspots' }));

        console.log('Fetching spots...');
        // Find 10 spots that have images defined
        const spots = await ParkingSpot.find({ 
            status: 'approved',
            images: { $exists: true, $not: { $size: 0 } }
        }).limit(15);
        
        console.log(`Found ${spots.length} approved spots with images:`);
        spots.forEach((s, idx) => {
            console.log(`\n[SPOT ${idx + 1}]`);
            console.log(`ID: ${s._id}`);
            console.log(`Name: ${s.name}`);
            console.log(`Address: ${s.address}`);
            console.log(`Images:`, s.images);
        });

    } catch (err) {
        console.error('Error during DB query:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
run();
