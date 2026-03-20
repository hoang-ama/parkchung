// File: server/src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
    normalizePhoneNumber,
    isValidEmail,
    isValidVietnamPhoneNumber,
} = require('../utils/validation');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: isValidEmail,
            message: 'Please provide a valid email address.',
        },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'host', 'admin'], default: 'user' },
    phone: {
        type: String,
        required: false,
        trim: true,
        set: normalizePhoneNumber,
        validate: {
            validator: (value) => !value || isValidVietnamPhoneNumber(value),
            message: 'Phone number must be a valid Vietnamese number (0xxxxxxxxx or +84xxxxxxxxx).',
        },
    },
    vehicleLicensePlate: { type: String, required: false, trim: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
