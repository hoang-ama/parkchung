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