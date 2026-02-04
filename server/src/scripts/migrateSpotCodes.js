// File: server/src/scripts/migrateSpotCodes.js
// One-time migration script to generate spotCode for existing parking spots

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const ParkingSpot = require('../models/parkingSpot.model');
const { generateSpotCode } = require('../utils/provinceCode.util');

async function migrateSpotCodes() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkchung';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Find all spots without spotCode
        const spotsWithoutCode = await ParkingSpot.find({
            $or: [
                { spotCode: { $exists: false } },
                { spotCode: null },
                { spotCode: '' }
            ]
        });

        console.log(`Found ${spotsWithoutCode.length} spots without spotCode`);

        if (spotsWithoutCode.length === 0) {
            console.log('No spots to migrate. All spots already have spotCode.');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const spot of spotsWithoutCode) {
            try {
                const newSpotCode = await generateSpotCode(spot.address);
                // Use findByIdAndUpdate to bypass validation for legacy spots
                await ParkingSpot.findByIdAndUpdate(
                    spot._id,
                    { spotCode: newSpotCode },
                    { runValidators: false }
                );
                console.log(`✓ Spot "${spot.name || spot.address}" (${spot._id}): ${newSpotCode}`);
                successCount++;
            } catch (err) {
                console.error(`✗ Failed to update spot "${spot.name || spot.address}" (${spot._id}):`, err.message);
                errorCount++;
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total spots processed: ${spotsWithoutCode.length}`);
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run migration
migrateSpotCodes();
