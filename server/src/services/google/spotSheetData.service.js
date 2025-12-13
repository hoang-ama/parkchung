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

    const defaultPassword = await MyUtils.generateHashPassword("Parkchung@123")
    
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
        const emailFormat = newSpots[i]['Email'] || `${MyUtils.generateUniqueString()}@example.com`
        const userMapper = mapUserData(newSpots[i], emailFormat, defaultPassword);
        users.push(userMapper);

        // Gắn userId vào spot
        const spotdata = mapSpotSheetData(userMapper._id, newSpots[i], emailFormat);
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

    await insertBulkData(users, User, spots);
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
            owner = await User.findOne({ email: row["Email"]});
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

async function insertBulkData(datas, collectionName, parkingDatas) {
    const total = datas.length;
    const batchSize = 1000;
    let allDuplicateEmails = [];

    for (let i = 0; i < total; i += batchSize) {
        const batch = datas.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        
        try {
            await collectionName.insertMany(batch, { ordered: false });
            console.log(`Batch ${batchNum} inserted.`);
        } catch (err) {
            console.error(`Batch ${batchNum} error:`, err.message);

            if (collectionName === User && err.writeErrors) {
                const emails = err.writeErrors
                    .map(e => e.err.op.email)
                    .filter(Boolean);

                allDuplicateEmails.push(...emails);
            }
        }
    }

    if (collectionName === User && parkingDatas) {
        for (let i = 0; i < allDuplicateEmails.length; i++){
            const ownerExisted = await User.findOne({ email: allDuplicateEmails[i]});
            for (let j = 0; j < parkingDatas.length; j++){
                if (parkingDatas[j]?.email === allDuplicateEmails[i])
                    parkingDatas[j].owner = ownerExisted._id;
            }
        }
    }
}

const mapSpotSheetData = (ownerId, row, emailFormat) => {
    const spot = {
        _id: new mongoose.Types.ObjectId(row['spot_id']) || new mongoose.Types.ObjectId(),
        owner: ownerId,
        name: row['Ward'] ? (`Bãi đỗ xe ${row["Ward"]}`) : 'Unnamed Spot',
        phone: row['Phone'] ? MyUtils.formatPhoneNumber(row['Phone']) : '',
        address: row['Full_address'] || 'No Address Provided',
        ward: row['Ward'] || "",
        street: row['Street'] || "",
        city: row['City'] || "",
        district: row['District'] || "",
        country: row['Country'] || "",
        location: {
            type: "Point",
            coordinates: [
                parseFloat(row['Longitude']) || 0,
                parseFloat(row['Latitude']) || 0
            ]
        },
        ggRating: row['Rating'] || 0,
        // openTime: row['Open time'] || '',
        openTime: '',
        // description: row['Discription'] || '',
        description: '',
        images: [
            row['Photo'],
        ],
        mapsView: row['Maps view'] || "",
        email: emailFormat,
        hourlyRate: parseFloat(row['hourly_rate']) || parseFloat(row['prices']) || 0,
        monthlyRate: parseFloat(row['monthly_rate']) || 0,
        hasRoof: row['hasRoof'] || false,
        // vehicleTypes: row['vehicle type'] || [],
        vehicleTypes: ['car'],
        numberOfSlots: row["numberOfSlots"] || 1,
        paymentMethods: ['cash'],
        status: 'approved',
    };
    return spot;
}

const mapUserData = (row, emailFormat, defaultPassword) => {
    
    const user = {
        _id: new mongoose.Types.ObjectId(row["ownerId"]) || new mongoose.Types.ObjectId(),
        fullName: row['Ward'] ? (`Bãi đỗ xe ${row["Ward"]}`) : 'Unnamed User',
        email: emailFormat,
        password: defaultPassword,
        role: 'user',
        phone: row['Phone'] ? MyUtils.formatPhoneNumber(row['Phone']) : 0,
    }    
    return user;
}

module.exports = { addNewSpotSheetData, updateSpotSheetData };