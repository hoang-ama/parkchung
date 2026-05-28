// File: server/src/scripts/check-cloudinary.js
const fetch = require('node-fetch');

const urls = [
    'https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/noibai_parking.jpg',
    'https://res.cloudinary.com/db14dkbsv/image/upload/v1685456789/parkchung/noibai_parking.jpg',
    'https://res.cloudinary.com/db14dkbsv/image/upload/v1758822688/parkchung_spots/vum5vyxa912icbwpkodo.jpg',
    'https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/tansonnhat_parking.jpg',
    'https://res.cloudinary.com/db14dkbsv/image/upload/v1685456789/parkchung/tansonnhat_parking.jpg'
];

async function run() {
    for (const url of urls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            console.log(`[${res.status}] ${url}`);
        } catch (e) {
            console.log(`[ERROR] ${url}: ${e.message}`);
        }
    }
}
run();
