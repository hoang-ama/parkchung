const isAdmin = (req, res, next) => {
    // This middleware must run AFTER the `protect` middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
};

module.exports = { isAdmin };