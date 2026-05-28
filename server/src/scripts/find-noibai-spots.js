// File: server/src/scripts/find-noibai-spots.js
const mongoose = require('mongoose');
const dns = require('dns');

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
            location: {
                type: { type: String, enum: ['Point'], default: 'Point' },
                coordinates: [Number]
            },
            images: [String],
            status: String
        }, { collection: 'parkingspots' }));

        console.log('Searching for spots near Noi Bai (21.2187, 105.8048)...');
        // Find spots near Noi Bai coordinates within 20km
        const spots = await ParkingSpot.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [105.804817, 21.218715]
                    },
                    $maxDistance: 20000 // 20km
                }
            },
            status: 'approved'
        }).limit(20);

        console.log(`Found ${spots.length} spots near Noi Bai:`);
        spots.forEach((s, idx) => {
            console.log(`\n[SPOT ${idx + 1}]`);
            console.log(`ID: ${s._id}`);
            console.log(`Name: ${s.name}`);
            console.log(`Address: ${s.address}`);
            console.log(`Coords:`, s.location.coordinates);
            console.log(`Images:`, s.images);
        });

    } catch (err) {
        console.error('Error during query:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
run();
