const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(config.mongodbUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Auto seed categorized spots on startup if empty
        await runSeedOnConnect();
        // Auto seed realistic Noi Bai spots for high fidelity search details
        await seedNoiBaiSpotsOnStartup();
        
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const runSeedOnConnect = async () => {
    try {
        const ParkingSpot = require('../models/parkingSpot.model');
        const User = require('../models/user.model');
        
        const count = await ParkingSpot.countDocuments();
        if (count === 0) {
            console.log('🌱 No parking spots found. Running auto-seeding for categorized spots...');
            
            // Find or create default owner user
            let owner = await User.findOne();
            if (!owner) {
                owner = await User.create({
                    fullName: 'Lê Hoàng Mạnh',
                    email: 'admin@parkchung.com',
                    password: 'password123',
                    role: 'admin',
                    phone: '0987654321'
                });
                console.log(`👤 Created default admin user for seeding: ${owner.email}`);
            }
            
            const { categorizedSpots } = require('../scripts/seedData');
            
            await ParkingSpot.insertMany(
                categorizedSpots.map(spot => ({ ...spot, owner: owner._id }))
            );
            console.log(`🎉 Auto-seeding completed! Added ${categorizedSpots.length} spots.`);
        } else {
            console.log(`ℹ️ Database already has ${count} spots. Skipping auto-seeding.`);
        }
    } catch (err) {
        console.error('❌ Error during auto-seeding:', err.message);
    }
};

const seedNoiBaiSpotsOnStartup = async () => {
    try {
        const ParkingSpot = require('../models/parkingSpot.model');
        const User = require('../models/user.model');

        // Delete existing Noi Bai spots first to force update their images
        await ParkingSpot.deleteMany({
            name: { $in: [
                'Bãi đỗ xe Sân bay Nội Bài (P2)',
                'Bãi đỗ xe Nội Bài giá rẻ Thành An',
                'Bãi gửi xe ô tô qua đêm Hải Nam - Sân bay Nội Bài',
                'Bãi đỗ xe Nhà ga T1 - Sân bay Nội Bài',
                'Bãi gửi xe Sân bay Nội Bài - Anh Thư',
                'Bãi gửi xe 24/7 Trần Anh - Sân bay Nội Bài'
            ] }
        });

        console.log('🌱 Seeding detailed Noi Bai spots with high-quality local images...');
        
        let owner = await User.findOne();
        if (!owner) {
            owner = await User.create({
                fullName: 'Lê Hoàng Mạnh',
                email: 'admin@parkchung.com',
                password: 'password123',
                role: 'admin',
                phone: '0987654321'
            });
        }

        const noiBaiSpots = [
            {
                name: 'Bãi đỗ xe Sân bay Nội Bài (P2)',
                address: 'Nhà ga T2, Sân bay Quốc tế Nội Bài, Phú Minh, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.804817, 21.218715]
                },
                hourlyRate: 25000,
                monthlyRate: 2000000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1764408521/parkchung_spots/nyyj8hiygewyzprzhqy7.jpg'],
                addOnServices: ['valet'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.5,
                numberOfSlots: 15,
                status: 'approved',
                isActive: true,
                owner: owner._id
            },
            {
                name: 'Bãi đỗ xe Nội Bài giá rẻ Thành An',
                address: 'Phú Minh, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.808241, 21.220145]
                },
                hourlyRate: 10000,
                monthlyRate: 900000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1758823037/parkchung_spots/hwj1h2air9xdsgl8mmer.jpg'],
                addOnServices: ['valet'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.8,
                numberOfSlots: 20,
                status: 'approved',
                isActive: true,
                owner: owner._id
            },
            {
                name: 'Bãi gửi xe ô tô qua đêm Hải Nam - Sân bay Nội Bài',
                address: 'Võ Nguyên Giáp, Phú Minh, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.809110, 21.216345]
                },
                hourlyRate: 12000,
                monthlyRate: 1000000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1758878202/parkchung_spots/cxbac6y0crrrj5ts00sm.png'],
                addOnServices: ['valet', 'carwash'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.7,
                numberOfSlots: 25,
                status: 'approved',
                isActive: true,
                owner: owner._id
            },
            {
                name: 'Bãi đỗ xe Nhà ga T1 - Sân bay Nội Bài',
                address: 'Nhà ga T1, Sân bay Nội Bài, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.802110, 21.221145]
                },
                hourlyRate: 20000,
                monthlyRate: 1800000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1758822785/parkchung_spots/wd4w2tkisuuaeilfyrvz.jpg'],
                addOnServices: ['ev_charging'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.6,
                numberOfSlots: 10,
                status: 'approved',
                isActive: true,
                owner: owner._id
            },
            {
                name: 'Bãi gửi xe Sân bay Nội Bài - Anh Thư',
                address: 'Điền Xá, Quang Tiến, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.812310, 21.217345]
                },
                hourlyRate: 15000,
                monthlyRate: 1200000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1773286675/parkchung/spots/spot-1773286674361-613887384-bx3.jpg'],
                addOnServices: ['valet'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.9,
                numberOfSlots: 30,
                status: 'approved',
                isActive: true,
                owner: owner._id
            },
            {
                name: 'Bãi gửi xe 24/7 Trần Anh - Sân bay Nội Bài',
                address: 'Đường vào sân bay, Phú Minh, Sóc Sơn, Hà Nội',
                location: {
                    type: 'Point',
                    coordinates: [105.806110, 21.214145]
                },
                hourlyRate: 12000,
                monthlyRate: 1000000,
                images: ['https://res.cloudinary.com/db14dkbsv/image/upload/v1758826880/parkchung_spots/wvqqdecfqnbfu8xzr3te.webp'],
                addOnServices: ['valet', 'carwash', 'ev_charging'],
                paymentMethods: ['cash', 'paypal'],
                vehicleTypes: ['car', 'motorbike'],
                ggRating: 4.5,
                numberOfSlots: 18,
                status: 'approved',
                isActive: true,
                owner: owner._id
            }
        ];

        await ParkingSpot.insertMany(noiBaiSpots);
        console.log(`🎉 Successfully seeded ${noiBaiSpots.length} detailed Noi Bai spots with Cloudinary images!`);
    } catch (err) {
        console.error('❌ Error seeding detailed Noi Bai spots:', err.message);
    }
};

module.exports = connectDB;