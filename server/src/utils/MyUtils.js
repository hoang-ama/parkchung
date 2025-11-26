
function generateUniqueString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function formatPhoneNumber(number) {
    if (number.startsWith('+84')) {
        return '0' + number.slice(3).replace(/\s+/g, '');
    }
    return number.replace(/\s+/g, '');
}

module.exports = { generateUniqueString, formatPhoneNumber };