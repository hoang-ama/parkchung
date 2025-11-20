const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');
const Lead = require('../models/lead.model');
const { sendBookingEmail, sendEmailPartner } = require('../services/mail/bookingEmail.service.js');
const { MAIL_TEMPLATE_NAMES } = require('../services/mail/brevo.service.js');
/**
 * Hàm trợ giúp để tính toán giá dựa trên thời gian và giá giờ của spot
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {number} hourlyRate
 * @returns {number} totalPrice
 */
const calculatePrice = (startTime, endTime, hourlyRate) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs <= 0) return 0;

    const durationHours = durationMs / (1000 * 60 * 60); // Tổng số giờ
    let totalPrice = durationHours * hourlyRate;

    // Ví dụ: Thêm phí giao dịch 0.99
    const transactionFee = 0.99;
    totalPrice += transactionFee;

    // Ví dụ: Làm tròn lên 2 chữ số thập phân
    return parseFloat(totalPrice.toFixed(2));
};

/**
 * @desc    Create booking as guest (no login required)
 * @route   POST /api/bookings/guest
 * @access  Public
 */
exports.createGuestBooking = async (req, res) => {
    const { spot, startTime, endTime, fullName, email, phoneNumber } = req.body;

    if (!fullName || !email || !phoneNumber) {
        return res.status(400).json({ message: 'Full name, email and phone number are required.' });
    }

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime) || isNaN(parsedEndTime)) {
        return res.status(400).json({ message: 'Invalid start or end time.' });
    }
    if (parsedStartTime >= parsedEndTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }
    if (parsedStartTime < new Date()) {
        return res.status(400).json({ message: 'Start time cannot be in the past.' });
    }

    // Check overlap with active bookings
    const conflictingBookings = await Booking.find({
        spot: spot,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
            {
                startTime: { $lt: parsedEndTime },
                endTime: { $gt: parsedStartTime }
            }
        ]
    });
    if (conflictingBookings.length > 0) {
        return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
    }

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);

    try {
        const lead = new Lead({
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            status: 'pending',
            fullName,
            email,
            phoneNumber,
            source: 'guest'
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
exports.createBooking = async (req, res) => {
    const { spot, startTime, endTime, phoneNumber } = req.body;

    const parkingSpot = await ParkingSpot.findById(spot);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    
    // 1. Kiểm tra tính hợp lệ của thời gian
    if (parsedStartTime >= parsedEndTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }
    // Đảm bảo thời gian đặt không phải trong quá khứ
    if (parsedStartTime < new Date()) {
        return res.status(400).json({ message: 'Start time cannot be in the past.' });
    }

    // 2. TÍCH HỢP LOGIC KIỂM TRA TRÙNG LẶP THỜI GIAN
    const conflictingBookings = await Booking.find({
        spot: spot, // Chỉ kiểm tra trên bãi đỗ cụ thể này
        status: { $in: ['pending', 'confirmed'] }, // Chỉ quan tâm đến các booking đang chờ hoặc đã xác nhận
        $or: [
            { // Trường hợp 1: Booking mới bắt đầu trong khoảng thời gian của booking hiện có
                startTime: { $lt: parsedEndTime },
                endTime: { $gt: parsedStartTime }
            }
        ]
    });

    if (conflictingBookings.length > 0) {
        return res.status(409).json({ message: 'This parking spot is already booked for the selected time slot.' });
    }
    // KẾT THÚC LOGIC KIỂM TRA TRÙNG LẶP THỜI GIAN

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);

    try {
        const booking = new Booking({
            user: req.user._id,
            spot,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            totalPrice,
            phoneNumber,
            status: 'pending'
        });

        const createdBooking = await booking.save();

        // Gửi email xác nhận đặt chỗ
        if (createdBooking) {
            sendBookingEmail(createdBooking, MAIL_TEMPLATE_NAMES.BOOKING_CONFIRM);
            sendEmailPartner(createdBooking, MAIL_TEMPLATE_NAMES.PARTNER_CONFIRM);
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
/**
 * @desc    Estimate booking price
 * @route   POST /api/bookings/estimate-price
 * @access  Public (hoặc Private nếu bạn muốn người dùng phải đăng nhập trước)
 */
exports.estimatePrice = async (req, res) => {
    const { spotId, startTime, endTime } = req.body;

    const parkingSpot = await ParkingSpot.findById(spotId);
    if (!parkingSpot) {
        return res.status(404).json({ message: 'Parking spot not found.' });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (parsedStartTime >= parsedEndTime) {
        return res.status(400).json({ message: 'End time must be after start time.' });
    }

    const totalPrice = calculatePrice(parsedStartTime, parsedEndTime, parkingSpot.hourlyRate);
    res.json({ estimatedPrice: totalPrice });
};
/**
 * @desc    Get bookings for the logged-in user
 * @route   GET /api/bookings/mybookings
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('spot', 'address');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching bookings', error: error.message });
    }
};
