// File: server/src/scripts/seedData.js

const categorizedSpots = [
    // --- AIRPORTS ---
    {
        name: 'Sân bay Quốc tế Nội Bài',
        address: 'Sân bay Quốc tế Nội Bài, Phú Minh, Sóc Sơn, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.804817, 21.218715] // Longitude, Latitude
        },
        hourlyRate: 25000,
        monthlyRate: 2000000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/noibai_parking.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Sân bay Quốc tế Tân Sơn Nhất',
        address: 'Sân bay Quốc tế Tân Sơn Nhất, Trường Sơn, Tân Bình, TP. Hồ Chí Minh',
        location: {
            type: 'Point',
            coordinates: [106.660172, 10.818463]
        },
        hourlyRate: 30000,
        monthlyRate: 2500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/tansonnhat_parking.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Sân bay Quốc tế Đà Nẵng',
        address: 'Sân bay Quốc tế Đà Nẵng, Hải Châu, Đà Nẵng',
        location: {
            type: 'Point',
            coordinates: [108.199379, 16.054407]
        },
        hourlyRate: 20000,
        monthlyRate: 1500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/danang_parking.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Sân bay Quốc tế Cam Ranh',
        address: 'Sân bay Quốc tế Cam Ranh, Cam Nghĩa, Cam Ranh, Khánh Hòa',
        location: {
            type: 'Point',
            coordinates: [109.219375, 11.998093]
        },
        hourlyRate: 15000,
        monthlyRate: 1200000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/camranh_parking.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Sân bay Quốc tế Phú Quốc',
        address: 'Sân bay Quốc tế Phú Quốc, Dương Tơ, Phú Quốc, Kiên Giang',
        location: {
            type: 'Point',
            coordinates: [103.993532, 10.173739]
        },
        hourlyRate: 20000,
        monthlyRate: 1800000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/phuquoc_parking.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },

    // --- STATIONS ---
    {
        name: 'Ga Hà Nội',
        address: 'Ga Hà Nội, 120 Lê Duẩn, Cửa Nam, Hoàn Kiếm, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.841528, 21.025345]
        },
        hourlyRate: 15000,
        monthlyRate: 1200000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/hanoi_station.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Ga Sài Gòn',
        address: 'Ga Sài Gòn, 1 Nguyễn Thông, Phường 9, Quận 3, TP. Hồ Chí Minh',
        location: {
            type: 'Point',
            coordinates: [106.678125, 10.781842]
        },
        hourlyRate: 20000,
        monthlyRate: 1500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/saigon_station.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Ga Đà Nẵng',
        address: 'Ga Đà Nẵng, 202 Hải Phòng, Tân Chính, Thanh Khê, Đà Nẵng',
        location: {
            type: 'Point',
            coordinates: [108.214041, 16.068472]
        },
        hourlyRate: 15000,
        monthlyRate: 1000000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/danang_station.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },

    // --- HOSPITALS ---
    {
        name: 'Bệnh viện Bạch Mai',
        address: 'Bệnh viện Bạch Mai, 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.842792, 21.002823]
        },
        hourlyRate: 20000,
        monthlyRate: 1500000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/bachmai_hospital.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Bệnh viện Hữu nghị Việt Đức',
        address: 'Bệnh viện Hữu nghị Việt Đức, 40 Tràng Thi, Hàng Bông, Hoàn Kiếm, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.847141, 21.028795]
        },
        hourlyRate: 25000,
        monthlyRate: 1800000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/vietduc_hospital.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Bệnh viện Chợ Rẫy',
        address: 'Bệnh viện Chợ Rẫy, 201B Nguyễn Chí Thanh, Phường 12, Quận 5, TP. Hồ Chí Minh',
        location: {
            type: 'Point',
            coordinates: [106.660233, 10.757827]
        },
        hourlyRate: 25000,
        monthlyRate: 1800000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/choray_hospital.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Bệnh viện Trung ương Quân đội 108',
        address: 'Bệnh viện Trung ương Quân đội 108, 1 Trần Hưng Đạo, Bạch Đằng, Hai Bà Trưng, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.861783, 21.018374]
        },
        hourlyRate: 20000,
        monthlyRate: 1600000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/108_hospital.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },

    // --- OTHERS ---
    {
        name: 'Cà phê Thống Nhất',
        address: 'Cà phê Thống Nhất, Công viên Thống Nhất, Lê Duẩn, Lê Đại Hành, Hai Bà Trưng, Hà Nội',
        location: {
            type: 'Point',
            coordinates: [105.845672, 21.015672]
        },
        hourlyRate: 15000,
        monthlyRate: 1000000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/cafe_thongnhat.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    },
    {
        name: 'Công viên Lê Văn Tám',
        address: 'Công viên Lê Văn Tám, Võ Thị Sáu, Đa Kao, Quận 1, TP. Hồ Chí Minh',
        location: {
            type: 'Point',
            coordinates: [106.695345, 10.787652]
        },
        hourlyRate: 15000,
        monthlyRate: 1000000,
        images: ['https://res.cloudinary.com/dpn7tctut/image/upload/v1685456789/parkchung/levantam_park.jpg'],
        addOnServices: ['valet'],
        status: 'approved',
        isActive: true
    }
];

module.exports = { categorizedSpots };
