// File: server/src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { VN_PHONE_REGEX } = require('../utils/validation.util');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'host', 'admin'], default: 'user' },
    phone: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v || v === '') return true;
                return VN_PHONE_REGEX.test(v);
            },
            message: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (VD: 0901234567 hoặc 84901234567).'
        }
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