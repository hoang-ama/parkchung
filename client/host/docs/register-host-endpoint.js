// File: server/src/controllers/auth.controller.js
// Add this handler to the existing auth.controller.js

/**
 * Register a new Host/Partner
 * POST /api/auth/register-host
 */
const registerHost = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                message: 'All fields are required: fullName, email, password, phone'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: 'An account with this email already exists'
            });
        }

        // Create new user with 'host' role
        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password,
            phone,
            role: 'host'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Host account created successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Host registration error:', error);
        res.status(500).json({
            message: 'Failed to create account. Please try again.'
        });
    }
};

// Export: module.exports = { ..., registerHost };
