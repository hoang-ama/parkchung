const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const VIETNAM_PHONE_REGEX = /^(?:0\d{9}|\+84\d{9})$/;

function normalizePhoneNumber(phoneNumber = '') {
    if (typeof phoneNumber !== 'string') {
        return phoneNumber;
    }

    const trimmedPhoneNumber = phoneNumber.trim();
    if (!trimmedPhoneNumber) {
        return '';
    }

    return trimmedPhoneNumber.replace(/[\s().-]/g, '');
}

function isValidEmail(email = '') {
    return EMAIL_REGEX.test(String(email).trim().toLowerCase());
}

function isValidVietnamPhoneNumber(phoneNumber = '') {
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
    return VIETNAM_PHONE_REGEX.test(normalizedPhoneNumber);
}

module.exports = {
    normalizePhoneNumber,
    isValidEmail,
    isValidVietnamPhoneNumber,
};
