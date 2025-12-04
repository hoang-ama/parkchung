// File: server/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware for optional authentication - attaches user if token present
 */
const optionalAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Ignore errors for optional auth but log for visibility
            console.warn('Optional auth failed', error.message);
        }
    }
    next();
};

/**
 * Middleware to restrict access to hosts only
 * Must be used after protect middleware
 */
const hostOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // Allow both 'host' and 'admin' roles to access host routes
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Host access only' });
    }

    next();
};

/**
 * Middleware to restrict access to admins only
 * Must be used after protect middleware
 */
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access only' });
    }

    next();
};

module.exports = { protect, optionalAuth, hostOnly, adminOnly };