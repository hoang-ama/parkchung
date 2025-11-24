const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const ParkingSpot = require('../models/parkingSpot.model');
const User = require('../models/user.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const airportSpots = [
    {
        address: 'Sân bay Quốc tế Nội Bài, Phú Minh, Sóc Sơn, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.804817, 21.218715] // Longitude, Latitude
        },
        hourlyRate: 25000,
        monthlyRate: 2000000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/noibai_parking.jpg'],
        status: 'approved'
    },
    {
        address: 'Sân bay Quốc tế Tân Sơn Nhất, Trường Sơn, Tân Bình, TP. Hồ Chí Minh',
        location: {
            type: 'Point',
            coordinates: [106.660172, 10.818463]
        },
        hourlyRate: 30000,
        monthlyRate: 2500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/tansonnhat_parking.jpg'],
        status: 'approved'
    },
    {
        address: 'Sân bay Quốc tế Đà Nẵng, Hải Châu, Đà Nẵng',
        location: {
            type: 'Point',
            coordinates: [108.199379, 16.054407]
        },
        hourlyRate: 20000,
        monthlyRate: 1500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/danang_parking.jpg'],
        status: 'approved'
    },
    {
        address: 'Sân bay Quốc tế Cam Ranh, Cam Nghĩa, Cam Ranh, Khánh Hòa',
        location: {
            type: 'Point',
            coordinates: [109.219375, 11.998093]
        },
        hourlyRate: 15000,
        monthlyRate: 1200000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/camranh_parking.jpg'],
        status: 'approved'
    },
    {
        address: 'Sân bay Quốc tế Phú Quốc, Dương Tơ, Phú Quốc, Kiên Giang',
        location: {
            type: 'Point',
            coordinates: [103.993532, 10.173739]
        },
        hourlyRate: 20000,
        monthlyRate: 1800000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/phuquoc_parking.jpg'],
        status: 'approved'
    }
];

const seedAirports = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Find a user to be the owner
        const owner = await User.findOne();
        if (!owner) {
            console.error('No users found in database. Please register a user first.');
            process.exit(1);
        }
        console.log(`Using user: ${owner.email} as owner for airport spots.`);

        let count = 0;
        for (const spotData of airportSpots) {
            // Check if spot already exists (by address)
            const exists = await ParkingSpot.findOne({ address: spotData.address });
            if (!exists) {
                await ParkingSpot.create({
                    ...spotData,
                    owner: owner._id
                });
                console.log(`Created spot: ${spotData.address}`);
                count++;
            } else {
                console.log(`Spot already exists: ${spotData.address}`);
            }
        }

        console.log(`Seeding completed. Added ${count} new airport spots.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding airports:', error);
        process.exit(1);
    }
};

seedAirports();
