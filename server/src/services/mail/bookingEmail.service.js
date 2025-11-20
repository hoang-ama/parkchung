const { getTemplateId, sendMail } = require('./brevo.service.js');
const { getAddressFromCoordinates } = require('../google/googleMaps.service.js');
const ParkingSpot = require('../../models/parkingSpot.model.js');
const User = require('../../models/user.model.js');

const LIST = {
    DEFAULT : 2,
}

const RECEIVER_TYPE = {
    CUSTOMER: 'CUSTOMER',
    PARTNER: 'PARTNER',
}

async function sendBookingEmail(booking, templateName) {
    const templateId = getTemplateId(templateName);
    const params = await getParamsSendEmail(booking, RECEIVER_TYPE.CUSTOMER);

    const bookingEmailBody = {
        to: [
            {
                email: booking.guestEmail,
                name: booking.guestFullName,
            }
        ],
        templateId: templateId,
        params: params,
    };

    await sendMail(bookingEmailBody, {
        name: booking.guestFullName,
        email: booking.guestEmail,
        phone: booking.guestPhoneNumber,
        ids: [LIST.DEFAULT],
    })
}

async function sendEmailPartner(booking, templateName) {
    const templateId = getTemplateId(templateName);
    const params = await getParamsSendEmail(booking, RECEIVER_TYPE.PARTNER);

    const bookingEmailBody = {
        to: [
            {
                email: booking.guestEmail,
                name: booking.guestFullName,
            }
        ],
        templateId: templateId,
        params: params,
    };

    await sendMail(bookingEmailBody, {
        name: booking.guestFullName,
        email: booking.guestEmail,
        phone: booking.guestPhoneNumber,
        ids: [LIST.DEFAULT],
    })
}

async function getParamsSendEmail(booking, receiverType) {
    
    const startTimeObj = parseDateTime(booking.startTime);
    const endTimeObj = parseDateTime(booking.endTime);

    const spotId = booking.spot;

    const spot = await ParkingSpot.findById(spotId);
    const spotAddress = await getAddressFromCoordinates(spot.location.coordinates[1], spot.location.coordinates[0]);

    let params = {
        receiverName: booking.guestFullName,
        receiverMail: booking.guestEmail,
        receiverPhone: booking.guestPhoneNumber,
        senderMail: 'contact@parkchung.com',
        startDay: startTimeObj.day,
        startMonth: startTimeObj.month,
        startYear: startTimeObj.year,
        startHour: startTimeObj.hour,
        startMinute: startTimeObj.minute,
        endDay: endTimeObj.day,
        endMonth: endTimeObj.month,
        endYear: endTimeObj.year,
        endHour: endTimeObj.hour,
        endMinute: endTimeObj.minute,
        spotName: spot.address,
        spotAddress: spotAddress,
        bookingId: String(booking._id),
        bookingTotal: String(formatCurrency(booking.totalPrice)),
    }

    if (receiverType === RECEIVER_TYPE.PARTNER) {
        const partner = await User.findById(spot.owner);
        params['partnerName'] = partner.fullName;
        params['partnerMail'] = partner.email;
    }

    return params;
}

function parseDateTime(dateString) {
    const date = new Date(dateString);

    return {
        day: String(date.getUTCDate()).padStart(2, '0'),
        month: String(date.getUTCMonth() + 1).padStart(2, '0'),
        year: date.getUTCFullYear(),
        hour: String(date.getUTCHours()).padStart(2, '0'),
        minute: String(date.getUTCMinutes()).padStart(2, '0')
    };
}

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

module.exports = { sendBookingEmail, sendEmailPartner };