const { getTemplateId, sendMail } = require('./brevo.service.js');
const { getAddressFromCoordinates } = require('../google/googleMaps.service.js');

const LIST = {
    DEFAULT : 2,
}

async function sendBookingConfirmEmail(booking) {
    const templateId = getTemplateId('bookingConfirm');
    const params = await getParamsSendEmail(booking);

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

async function sendBookingCancelEmail(booking) {
    const templateId = getTemplateId('bookingCancel');
    const params = await getParamsSendEmail(booking);

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

async function getParamsSendEmail(booking) {
    
    const startTimeObj = parseDateTime(booking.startTime);
    const endTimeObj = parseDateTime(booking.endTime);

    const spot = booking.spot;
    const spotAddress = await getAddressFromCoordinates(spot.location.coordinates[1], spot.location.coordinates[0]);

    let params = {
        guestName: booking.guestFullName,
        guestMail: booking.guestEmail,
        guestPhone: booking.guestPhoneNumber,
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

module.exports = { sendBookingConfirmEmail, sendBookingCancelEmail };