// File: server/src/models/hostProfile.model.js
const mongoose = require('mongoose');

const hostProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        trim: true
    },
    taxCode: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    bankAccount: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    kycStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    documentImages: [{
        type: String // URLs of uploaded KYC documents
    }]
}, { timestamps: true });

const HostProfile = mongoose.model('HostProfile', hostProfileSchema);
module.exports = HostProfile;
