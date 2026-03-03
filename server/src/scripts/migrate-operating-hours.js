/**
 * Migration Script: Convert operatingHours from single-slot to multi-slot format
 *
 * Old format: { day, isOpen, openAt, closeAt }
 * New format: { day, isOpen, slots: [{ openAt, closeAt }] }
 *
 * Safe to run multiple times (idempotent).
 *
 * Usage: node server/src/scripts/migrate-operating-hours.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function migrate() {
    if (!MONGO_URI) {
        console.error('❌ No MONGODB_URI or MONGO_URI found in environment variables.');
        process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const db = mongoose.connection.db;
    const collection = db.collection('parkingspots');

    // Find spots with old format (schedule items that have openAt directly, not inside slots)
    const cursor = collection.find({
        'operatingHours.schedule': { $exists: true },
        'operatingHours.schedule.openAt': { $exists: true },
        'operatingHours.schedule.slots': { $exists: false }
    });

    let migrated = 0;
    let skipped = 0;

    for await (const spot of cursor) {
        const schedule = spot.operatingHours?.schedule;
        if (!schedule || !Array.isArray(schedule)) {
            skipped++;
            continue;
        }

        // Check if already migrated (first item has slots)
        if (schedule[0]?.slots) {
            skipped++;
            continue;
        }

        const newSchedule = schedule.map(item => ({
            day: item.day,
            isOpen: item.isOpen !== undefined ? item.isOpen : true,
            slots: [{
                openAt: item.openAt || '08:00',
                closeAt: item.closeAt || '22:00'
            }]
        }));

        await collection.updateOne(
            { _id: spot._id },
            { $set: { 'operatingHours.schedule': newSchedule } }
        );

        migrated++;
        console.log(`  ✅ Migrated: ${spot.name} (${spot._id})`);
    }

    console.log(`\n🏁 Migration complete: ${migrated} migrated, ${skipped} skipped.`);
    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch(err => {
    console.error('❌ Migration error:', err);
    process.exit(1);
});
