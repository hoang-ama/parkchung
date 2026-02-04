// File: server/src/utils/provinceCode.util.js
// Utility for generating parking spot codes based on Vietnam province license plate codes

const ParkingSpot = require('../models/parkingSpot.model');

/**
 * Vietnam Province License Plate Codes
 * Each province/city has one or more codes - we use the primary (first) code
 */
const PROVINCE_CODES = {
    // Northern Vietnam
    'Hà Nội': '29',
    'Ha Noi': '29',
    'Hanoi': '29',
    'Hải Phòng': '15',
    'Hai Phong': '15',
    'Quảng Ninh': '14',
    'Quang Ninh': '14',
    'Hải Dương': '34',
    'Hai Duong': '34',
    'Hưng Yên': '89',
    'Hung Yen': '89',
    'Thái Bình': '17',
    'Thai Binh': '17',
    'Nam Định': '18',
    'Nam Dinh': '18',
    'Hà Nam': '90',
    'Ha Nam': '90',
    'Ninh Bình': '35',
    'Ninh Binh': '35',
    'Vĩnh Phúc': '88',
    'Vinh Phuc': '88',
    'Phú Thọ': '19',
    'Phu Tho': '19',
    'Bắc Giang': '98',
    'Bac Giang': '98',
    'Bắc Ninh': '99',
    'Bac Ninh': '99',
    'Thái Nguyên': '20',
    'Thai Nguyen': '20',
    'Lạng Sơn': '12',
    'Lang Son': '12',
    'Cao Bằng': '11',
    'Cao Bang': '11',
    'Bắc Kạn': '97',
    'Bac Kan': '97',
    'Tuyên Quang': '22',
    'Tuyen Quang': '22',
    'Hà Giang': '23',
    'Ha Giang': '23',
    'Yên Bái': '21',
    'Yen Bai': '21',
    'Lào Cai': '24',
    'Lao Cai': '24',
    'Điện Biên': '27',
    'Dien Bien': '27',
    'Lai Châu': '25',
    'Lai Chau': '25',
    'Sơn La': '26',
    'Son La': '26',
    'Hòa Bình': '28',
    'Hoa Binh': '28',

    // Central Vietnam
    'Thanh Hóa': '36',
    'Thanh Hoa': '36',
    'Nghệ An': '37',
    'Nghe An': '37',
    'Hà Tĩnh': '38',
    'Ha Tinh': '38',
    'Quảng Bình': '73',
    'Quang Binh': '73',
    'Quảng Trị': '74',
    'Quang Tri': '74',
    'Thừa Thiên Huế': '75',
    'Thua Thien Hue': '75',
    'Huế': '75',
    'Hue': '75',
    'Đà Nẵng': '43',
    'Da Nang': '43',
    'Quảng Nam': '92',
    'Quang Nam': '92',
    'Quảng Ngãi': '76',
    'Quang Ngai': '76',
    'Bình Định': '77',
    'Binh Dinh': '77',
    'Phú Yên': '78',
    'Phu Yen': '78',
    'Khánh Hòa': '79',
    'Khanh Hoa': '79',
    'Nha Trang': '79',
    'Ninh Thuận': '85',
    'Ninh Thuan': '85',
    'Bình Thuận': '86',
    'Binh Thuan': '86',

    // Central Highlands
    'Kon Tum': '82',
    'Gia Lai': '81',
    'Đắk Lắk': '47',
    'Dak Lak': '47',
    'Đắk Nông': '48',
    'Dak Nong': '48',
    'Lâm Đồng': '49',
    'Lam Dong': '49',
    'Đà Lạt': '49',
    'Da Lat': '49',

    // Southern Vietnam
    'Hồ Chí Minh': '50',
    'Ho Chi Minh': '50',
    'TP.HCM': '50',
    'TPHCM': '50',
    'Sài Gòn': '50',
    'Sai Gon': '50',
    'Saigon': '50',
    'Bình Dương': '61',
    'Binh Duong': '61',
    'Bình Phước': '93',
    'Binh Phuoc': '93',
    'Tây Ninh': '70',
    'Tay Ninh': '70',
    'Đồng Nai': '60',
    'Dong Nai': '60',
    'Bà Rịa - Vũng Tàu': '72',
    'Ba Ria Vung Tau': '72',
    'Vũng Tàu': '72',
    'Vung Tau': '72',
    'Long An': '62',
    'Tiền Giang': '63',
    'Tien Giang': '63',
    'Bến Tre': '71',
    'Ben Tre': '71',
    'Trà Vinh': '84',
    'Tra Vinh': '84',
    'Vĩnh Long': '64',
    'Vinh Long': '64',
    'Đồng Tháp': '66',
    'Dong Thap': '66',
    'An Giang': '67',
    'Kiên Giang': '68',
    'Kien Giang': '68',
    'Phú Quốc': '68',
    'Phu Quoc': '68',
    'Cần Thơ': '65',
    'Can Tho': '65',
    'Hậu Giang': '95',
    'Hau Giang': '95',
    'Sóc Trăng': '83',
    'Soc Trang': '83',
    'Bạc Liêu': '94',
    'Bac Lieu': '94',
    'Cà Mau': '69',
    'Ca Mau': '69'
};

// Default code for unknown provinces
const DEFAULT_PROVINCE_CODE = '00';

/**
 * Extract province name from address string
 * @param {string} address - Full address string
 * @returns {string|null} Province name or null if not found
 */
function getProvinceFromAddress(address) {
    if (!address) return null;

    const normalizedAddress = address.trim();

    // Search for province names in the address (case-insensitive)
    for (const provinceName of Object.keys(PROVINCE_CODES)) {
        // Create regex to match province name (word boundary)
        const regex = new RegExp(provinceName, 'i');
        if (regex.test(normalizedAddress)) {
            return provinceName;
        }
    }

    return null;
}

/**
 * Get province code from address
 * @param {string} address - Full address string
 * @returns {string} Province code (2 digits)
 */
function getProvinceCode(address) {
    const province = getProvinceFromAddress(address);
    if (province) {
        // Find the code (case-insensitive match)
        for (const [name, code] of Object.entries(PROVINCE_CODES)) {
            if (name.toLowerCase() === province.toLowerCase()) {
                return code;
            }
        }
    }
    return DEFAULT_PROVINCE_CODE;
}

/**
 * Generate a unique spot code for a parking spot
 * Format: XX-YYY (XX = province code, YYY = sequential number, zero-padded)
 * @param {string} address - Address of the parking spot
 * @returns {Promise<string>} Generated spot code
 */
async function generateSpotCode(address) {
    const provinceCode = getProvinceCode(address);

    // Find the highest existing sequence number for this province
    const pattern = new RegExp(`^${provinceCode}-\\d{3}$`);
    const existingSpots = await ParkingSpot.find({
        spotCode: { $regex: pattern }
    }).select('spotCode').lean();

    let maxSequence = 0;
    for (const spot of existingSpots) {
        const match = spot.spotCode.match(/-(\d{3})$/);
        if (match) {
            const seq = parseInt(match[1], 10);
            if (seq > maxSequence) {
                maxSequence = seq;
            }
        }
    }

    const nextSequence = maxSequence + 1;
    const paddedSequence = String(nextSequence).padStart(3, '0');

    return `${provinceCode}-${paddedSequence}`;
}

module.exports = {
    PROVINCE_CODES,
    DEFAULT_PROVINCE_CODE,
    getProvinceFromAddress,
    getProvinceCode,
    generateSpotCode
};
