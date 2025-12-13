const bcrypt = require('bcryptjs')

function generateUniqueString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function formatPhoneNumber(number) {
    if (number.startsWith('+84'))
        return '0' + number.slice(3).replace(/\s+/g, '');
    else if (number.startsWith('84'))
        return '0' + number.slice(2).replace(/\s+/g, '');

    return number.replace(/\s+/g, '');
}

async function generateHashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}

module.exports = { generateUniqueString, formatPhoneNumber, generateHashPassword, comparePassword };