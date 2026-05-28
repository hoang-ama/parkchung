// File: server/src/controllers/auth.controller.js
const User = require('../models/user.model');
const HostProfile = require('../models/hostProfile.model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const brevoService = require('../services/brevo.service');
const {
    normalizePhoneNumber,
    isValidEmail,
    isValidVietnamPhoneNumber,
} = require('../utils/validation');

// JWT token generator
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '30d' });
};

const getValidationErrorMessage = (error) => {
    if (error?.name !== 'ValidationError') {
        return '';
    }

    return Object.values(error.errors)
        .map(({ message }) => message)
        .join(' ');
};

const validateContactFields = ({ email, phone }) => {
    if (!isValidEmail(email)) {
        return 'Please provide a valid email address.';
    }

    if (phone && !isValidVietnamPhoneNumber(phone)) {
        return 'Phone number must be a valid Vietnamese number (0xxxxxxxxx or +84xxxxxxxxx).';
    }

    return '';
};

/**
 * @desc    Register a new user (customer)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email, and password are required.' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone ? normalizePhoneNumber(phone) : undefined;
        const contactValidationMessage = validateContactFields({
            email: normalizedEmail,
            phone: normalizedPhone,
        });

        if (contactValidationMessage) {
            return res.status(400).json({ message: contactValidationMessage });
        }

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            if (userExists.role === 'host' || userExists.role === 'admin') {
                return res.status(400).json({ message: 'This email is already registered as a Host/Partner. You can login to Customer Portal with the same account.' });
            }
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password,
            phone: normalizedPhone,
        });

        if (user) {
            // Link existing guest bookings with this email
            try {
                const Booking = require('../models/booking.model');
                await Booking.updateMany(
                    { guestEmail: normalizedEmail, $or: [{ user: { $exists: false } }, { user: null }] },
                    { $set: { user: user._id } }
                );
            } catch (linkErr) {
                console.error('Failed to link guest bookings on registration:', linkErr);
            }

            // Send registration confirmation email (non-blocking)
            brevoService.sendRegistrationEmail({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            }, 'userregisemail').catch(err => {
                console.error('Failed to send user registration email:', err);
            });

            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        const validationErrorMessage = getValidationErrorMessage(error);
        if (validationErrorMessage) {
            return res.status(400).json({ message: validationErrorMessage });
        }

        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            // Link existing guest bookings with this email just in case they booked as guest while logged out
            try {
                const Booking = require('../models/booking.model');
                await Booking.updateMany(
                    { guestEmail: user.email, $or: [{ user: { $exists: false } }, { user: null }] },
                    { $set: { user: user._id } }
                );
            } catch (linkErr) {
                console.error('Failed to link guest bookings on login:', linkErr);
            }

            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

/**
 * @desc    Register a new Host/Partner
 * @route   POST /api/auth/register-host
 * @access  Public
 */
exports.registerHost = async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    try {
        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Missing required fields: fullName, email, and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone ? normalizePhoneNumber(phone) : undefined;
        const contactValidationMessage = validateContactFields({
            email: normalizedEmail,
            phone: normalizedPhone,
        });

        if (contactValidationMessage) {
            return res.status(400).json({ message: contactValidationMessage });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            // If already a host or admin, reject
            if (existingUser.role === 'host' || existingUser.role === 'admin') {
                return res.status(400).json({ message: 'Email already in use' });
            }

            // If existing user is a customer, upgrade to host
            existingUser.role = 'host';
            existingUser.fullName = fullName.trim();
            if (normalizedPhone) existingUser.phone = normalizedPhone;
            await existingUser.save();

            // Create HostProfile if not exists
            let hostProfile = await HostProfile.findOne({ user: existingUser._id });
            if (!hostProfile) {
                hostProfile = await HostProfile.create({
                    user: existingUser._id,
                    kycStatus: 'pending'
                });
            }

            const token = generateToken(existingUser._id, existingUser.role);

            // Send registration email (non-blocking)
            brevoService.sendRegistrationEmail({
                fullName: existingUser.fullName,
                email: existingUser.email,
                phone: existingUser.phone
            }, 'partnerregisemail').catch(err => {
                console.error('Failed to send partner registration email:', err);
            });

            return res.status(201).json({
                message: 'Account upgraded to Host successfully',
                user: {
                    id: existingUser._id,
                    fullName: existingUser.fullName,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    role: existingUser.role
                },
                hostProfile: {
                    id: hostProfile._id,
                    kycStatus: hostProfile.kycStatus,
                    companyName: hostProfile.companyName,
                    address: hostProfile.address
                },
                token
            });
        }

        // Create new user with 'host' role
        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password,
            phone: normalizedPhone,
            role: 'host'
        });

        // Create associated HostProfile
        const hostProfile = await HostProfile.create({
            user: user._id,
            kycStatus: 'pending'
        });

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        // Send registration confirmation email to partner (non-blocking)
        brevoService.sendRegistrationEmail({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
        }, 'partnerregisemail').catch(err => {
            console.error('Failed to send partner registration email:', err);
        });

        // Return success response
        res.status(201).json({
            message: 'Host account created successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            hostProfile: {
                id: hostProfile._id,
                kycStatus: hostProfile.kycStatus,
                companyName: hostProfile.companyName,
                address: hostProfile.address
            },
            token
        });

    } catch (error) {
        const validationErrorMessage = getValidationErrorMessage(error);
        if (validationErrorMessage) {
            return res.status(400).json({ message: validationErrorMessage });
        }

        console.error('Host registration error:', error);
        res.status(500).json({
            message: 'Server error during host registration',
            error: error.message
        });
    }
};

// ==================== PROFILE ENDPOINTS ====================

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            vehicleLicensePlate: user.vehicleLicensePlate || '',
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update user profile (phone, vehicleLicensePlate)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const { phone, vehicleLicensePlate } = req.body;
        const normalizedPhone = phone !== undefined ? normalizePhoneNumber(phone) : undefined;

        if (normalizedPhone && !isValidVietnamPhoneNumber(normalizedPhone)) {
            return res.status(400).json({
                message: 'Phone number must be a valid Vietnamese number (0xxxxxxxxx or +84xxxxxxxxx).'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    phone: phone !== undefined ? normalizedPhone : undefined,
                    vehicleLicensePlate: vehicleLicensePlate !== undefined ? vehicleLicensePlate : undefined
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                vehicleLicensePlate: updatedUser.vehicleLicensePlate || '',
                role: updatedUser.role
            }
        });
    } catch (error) {
        const validationErrorMessage = getValidationErrorMessage(error);
        if (validationErrorMessage) {
            return res.status(400).json({ message: validationErrorMessage });
        }

        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password (the pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/account
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password confirmation is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }

        // Delete associated bookings
        const Booking = require('../models/booking.model');
        await Booking.deleteMany({ user: req.user.id });

        // Delete HostProfile if exists
        await HostProfile.deleteMany({ user: req.user.id });

        // Delete the user
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
