require('dotenv').config();
const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Parse TEMPLATE_EMAIL from environment variable
let templates = {};
try {
    if (process.env.TEMPLATE_EMAIL) {
        templates = JSON.parse(process.env.TEMPLATE_EMAIL);
    }
} catch (error) {
    console.error('Error parsing TEMPLATE_EMAIL environment variable:', error);
}

/**
 * Send booking related emails to Customer
 * @param {Object} bookingData - Order details containing customerName and customerEmail
 * @param {string} templateName - Key for the template ID (e.g., 'bookingConfirm', 'bookingCancel', 'review')
 */
const sendBookingEmail = async (bookingData, templateName) => {
    try {
        const templateId = templates[templateName];
        if (!templateId) {
            throw new Error(`Template '${templateName}' not found in configuration.`);
        }

        // Format dates for Vietnamese locale
        const startDate = new Date(bookingData.startTime);
        const endDate = new Date(bookingData.endTime);

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.to = [{ email: bookingData.customerEmail, name: bookingData.customerName }];
        sendSmtpEmail.params = {
            // Date and time fields - START
            startDay: startDate.getDate(),
            startMonth: startDate.getMonth() + 1,
            startYear: startDate.getFullYear(),
            startHour: startDate.getHours().toString().padStart(2, '0'),
            startMinute: startDate.getMinutes().toString().padStart(2, '0'),
            // Date and time fields - END
            endDay: endDate.getDate(),
            endMonth: endDate.getMonth() + 1,
            endYear: endDate.getFullYear(),
            endHour: endDate.getHours().toString().padStart(2, '0'),
            endMinute: endDate.getMinutes().toString().padStart(2, '0'),
            // Spot information
            spotName: bookingData.spotAddress || '',
            spotAddress: bookingData.spotAddress || '',
            // Booking ID
            bookingId: bookingData.bookingId || bookingData._id,
            // Customer/Receiver information
            receiverName: bookingData.customerName,
            receiverPhone: bookingData.phoneNumber || bookingData.guestPhoneNumber || '',
            receiverMail: bookingData.customerEmail,
            // Price
            bookingTotal: bookingData.totalPrice ? bookingData.totalPrice.toLocaleString('vi-VN') : '0'
        };


        console.log(`Sending '${templateName}' email to ${bookingData.customerEmail}...`);
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email '${templateName}' sent successfully. Message ID: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error(`Error sending '${templateName}' email:`, error);
        // Depending on requirements, you might want to rethrow or just log
        // throw error; 
    }
};

/**
 * Send booking related emails to Partner
 * @param {Object} bookingData - Order details containing partnerName and partnerEmail
 * @param {string} templateName - Key for the template ID (e.g., 'partnerConfirm', 'partnerCancel')
 */
const sendEmailPartner = async (bookingData, templateName) => {
    try {
        const templateId = templates[templateName];
        if (!templateId) {
            throw new Error(`Template '${templateName}' not found in configuration.`);
        }

        // Format dates for Vietnamese locale
        const startDate = new Date(bookingData.startTime);
        const endDate = new Date(bookingData.endTime);

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.to = [{ email: bookingData.partnerEmail, name: bookingData.partnerName }];
        sendSmtpEmail.params = {
            // Date and time fields - START
            startDay: startDate.getDate(),
            startMonth: startDate.getMonth() + 1,
            startYear: startDate.getFullYear(),
            startHour: startDate.getHours().toString().padStart(2, '0'),
            startMinute: startDate.getMinutes().toString().padStart(2, '0'),
            // Date and time fields - END
            endDay: endDate.getDate(),
            endMonth: endDate.getMonth() + 1,
            endYear: endDate.getFullYear(),
            endHour: endDate.getHours().toString().padStart(2, '0'),
            endMinute: endDate.getMinutes().toString().padStart(2, '0'),
            // Spot information
            spotName: bookingData.spotAddress || '',
            spotAddress: bookingData.spotAddress || '',
            // Booking ID
            bookingId: bookingData.bookingId || bookingData._id,
            // Customer/Receiver information (customer is the receiver from partner's perspective)
            receiverName: bookingData.customerName,
            receiverPhone: bookingData.phoneNumber || bookingData.guestPhoneNumber || '',
            receiverMail: bookingData.customerEmail,
            // Partner information
            partnerName: bookingData.partnerName,
            // Price
            bookingTotal: bookingData.totalPrice ? bookingData.totalPrice.toLocaleString('vi-VN') : '0'
        };

        console.log(`Sending '${templateName}' email to partner ${bookingData.partnerEmail}...`);
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email '${templateName}' sent successfully to partner. Message ID: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error(`Error sending '${templateName}' email to partner:`, error);
    }
};

/**
 * Send review request email to Customer
 * @param {Object} bookingData - Booking details
 */
const sendReviewEmail = async (bookingData) => {
    try {
        const templateId = templates['review'];
        if (!templateId) {
            throw new Error(`Template 'review' not found in configuration.`);
        }

        // Format dates for Vietnamese locale
        const startDate = new Date(bookingData.startTime);
        const endDate = new Date(bookingData.endTime);

        // Build review form URL with booking ID
        const reviewFormUrl = process.env.REVIEW_FORM_URL || '';
        const reviewLink = reviewFormUrl ? `${reviewFormUrl}?entry.bookingId=${bookingData.bookingId || bookingData._id}` : '';

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.to = [{ email: bookingData.customerEmail, name: bookingData.customerName }];
        sendSmtpEmail.params = {
            // Date and time fields - START
            startDay: startDate.getDate(),
            startMonth: startDate.getMonth() + 1,
            startYear: startDate.getFullYear(),
            startHour: startDate.getHours().toString().padStart(2, '0'),
            startMinute: startDate.getMinutes().toString().padStart(2, '0'),
            // Date and time fields - END
            endDay: endDate.getDate(),
            endMonth: endDate.getMonth() + 1,
            endYear: endDate.getFullYear(),
            endHour: endDate.getHours().toString().padStart(2, '0'),
            endMinute: endDate.getMinutes().toString().padStart(2, '0'),
            // Spot information
            spotName: bookingData.spotAddress || '',
            spotAddress: bookingData.spotAddress || '',
            // Booking ID
            bookingId: bookingData.bookingId || bookingData._id,
            // Customer information
            receiverName: bookingData.customerName,
            receiverPhone: bookingData.phoneNumber || bookingData.guestPhoneNumber || '',
            receiverMail: bookingData.customerEmail,
            // Price
            bookingTotal: bookingData.totalPrice ? bookingData.totalPrice.toLocaleString('vi-VN') : '0',
            // Review link
            reviewLink: reviewLink
        };

        console.log(`Sending review request email to ${bookingData.customerEmail}...`);
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Review email sent successfully. Message ID: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error(`Error sending review email:`, error);
        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendEmailPartner,
    sendReviewEmail
};
