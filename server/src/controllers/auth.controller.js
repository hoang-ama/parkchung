// File: server/src/controllers/auth.controller.js
const User = require('../models/user.model');
const HostProfile = require('../models/hostProfile.model');
const jwt = require('jsonwebtoken');
const config = require('../config');

// JWT token generator
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user (customer)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({ fullName, email: email.toLowerCase(), password, phone });

        if (user) {
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

        // Check if email already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create new user with 'host' role
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password,
            phone,
            role: 'host'
        });

        // Create associated HostProfile
        const hostProfile = await HostProfile.create({
            user: user._id,
            kycStatus: 'pending'
        });

        // Generate JWT token
        const token = generateToken(user._id, user.role);

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

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    phone: phone !== undefined ? phone : undefined,
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