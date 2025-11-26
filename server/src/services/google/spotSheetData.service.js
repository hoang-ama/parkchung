const { formatGGSheetData, updateSheetData, RECORD_STATUS, updateSheetBatchData } = require('./googleSheet.service.js');
const ParkingSpot = require('../../models/parkingSpot.model.js');
const User = require('../../models/user.model.js');
const MyUtils = require('../../utils/MyUtils.js');
const mongoose = require('mongoose');

async function addNewSpotSheetData(sheetId, sheetTitle) {
    // const ownerMap = {};
    const spots = [];  
    const users = [];
    const updatedData = [];
    const dataRanges = [];
    
    const formattedData = await formatGGSheetData(sheetId, sheetTitle);
    const newSpots = formattedData.newSpots;
    
    let start = Number(newSpots[0]['record_index']);
    let prev = start;
    
    for (let i = 0; i < newSpots.length; i++) {
        // let ownerEmail = newSpots[i]['email_1'] || newSpots[i]['email_2'] || `${MyUtils.generateUniqueString()}@example.com`;
        // ownerEmail = String(ownerEmail).trim().toLowerCase();
        const currentIndex = Number(newSpots[i]['record_index']);

        // // Nếu user đã được tạo rồi -> dùng userId luôn
        // if (!ownerMap[ownerEmail]) {
        //     // push user vao danh sach user de insert sau
            
        //     ownerMap[ownerEmail] = userMapper._id;
        // }
        const userMapper = mapUserData(newSpots[i]);
        users.push(userMapper);

        // Gắn userId vào spot
        const spotdata = mapSpotSheetData(userMapper._id, newSpots[i]);
        spots.push(spotdata);

        if (i === 0) {
            prev = currentIndex;
        } else {
            if (currentIndex === prev + 1) {
                // tiếp tục đoạn liên tiếp
                prev = currentIndex;
            } else {
                // gap -> đóng đoạn trước
                for (let j = start; j <= prev; j++) {
                    updatedData.push([RECORD_STATUS.UPDATED]);
                }
                dataRanges.push({
                    range: `${sheetTitle}!C${start}:C${prev}`,
                    values: [...updatedData]
                })
                updatedData.length = 0;
                // bắt đầu đoạn mới
                start = currentIndex;
                prev = currentIndex;
            }
        }
    }
    
    for (let j = start; j <= prev; j++) {
        updatedData.push([RECORD_STATUS.UPDATED]);
    }
    dataRanges.push({
        range: `${sheetTitle}!C${start}:C${prev}`,
        values: [...updatedData]
    })

    await insertBulkData(users, User);
    await insertBulkData(spots, ParkingSpot);
    // // Cap nhat lai trang thai o google sheet
    await updateSheetBatchData(dataRanges, sheetId, sheetTitle);
}

const updateSpotSheetData = async (sheetId, sheetTitle) => {
    const formattedData = await formatGGSheetData(sheetId, sheetTitle);
    const updateSpots = formattedData.updateSpots;

    for (const row of updateSpots) {
        const spotId = row['spot_id'];
        if (!spotId) {
            console.warn(`Skipping update for row without spot_id: ${JSON.stringify(row)}`);
            continue;
        }

        const spot = await ParkingSpot.findById(spotId);
        if (!spot) {
            console.warn(`No parking spot found with ID: ${spotId}`);
            continue;
        }

        let owner = await User.findById(row["ownerId"]);
        if (!owner) {
            console.warn(`No user found with ID: ${spot.owner}`);
            owner = await User.findOne({ email: row['email_1'] || row['email_2'] });
        }

        // const ownerData = {
        //     fullName: row['owner_title'] || owner.fullName,
        //     phone: row['phone'] ? MyUtils.formatPhoneNumber(row['phone']) : owner.phone,
        //     email: row['email_1'] || row['email_2'] || owner.email,
        // }
        // await User.updateOne({ _id: owner._id }, ownerData);

        const spotMapper = mapSpotSheetData(owner._id, row);
        await ParkingSpot.updateOne({ _id: spotId }, spotMapper);
        
        const range = `C${Number(row['record_index'])}`;
        await updateSheetData(range, [[RECORD_STATUS.UPDATED]], sheetId, sheetTitle);
    }
}

async function insertBulkData(datas, collectionName) {
    const total = datas.length;
    const batchSize = 1000;

    for (let i = 0; i < total; i += batchSize) {
        const batch = datas.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        
        try {
            await collectionName.insertMany(batch, { ordered: false });
            console.log(`Batch ${batchNum} inserted.`);
        } catch (err) {
            console.error(`Batch ${batchNum} error:`, err.message);
        }
    }
}

const mapSpotSheetData = (ownerId, row) => {
    const spot = {
        _id: new mongoose.Types.ObjectId(row['spot_id']) || new mongoose.Types.ObjectId(),
        owner: ownerId,
        nameAddress: row['name'] || 'Unnamed Spot',
        address: row['full_address'] || 'No Address Provided',
        spotQuery: row['query'] || '',
        spotCategory: row['category'] || '',
        spotType: row['type'] || '',
        spotPhone: row['phone'] ? MyUtils.formatPhoneNumber(row['phone']) : '',
        workingHours: row['working_hours'] || '',
        otherHours: row['other_hours'] || '',
        location: {
            type: "Point",
            coordinates: [
                parseFloat(row['longitude']) || 0,
                parseFloat(row['latitude']) || 0
            ]
        },
        images: [
            row['photo'],
            row['street_view']
        ],
        hourlyRate: parseFloat(row['hourly_rate']) || parseFloat(row['prices']) || 0,
        monthlyRate: parseFloat(row['monthly_rate']) || 0,
        status: 'pending'
    };
    return spot;
}

const mapUserData = (row) => {
    
    const user = {
        _id: new mongoose.Types.ObjectId(row["ownerId"]) || new mongoose.Types.ObjectId(),
        fullName: row['owner_title'] || 'No Name',
        email: row['email_1'] || row['email_2'] || `${MyUtils.generateUniqueString()}@example.com`,
        password: 'Parkchung@123',
        role: 'user',
        phone: row['phone'] ? MyUtils.formatPhoneNumber(row['phone']) : 0,
    }    
    return user;
}

module.exports = { addNewSpotSheetData, updateSpotSheetData };