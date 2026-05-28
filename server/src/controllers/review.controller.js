const Review = require('../models/review.model');
const Booking = require('../models/booking.model');
const ParkingSpot = require('../models/parkingSpot.model');

/**
 * @desc    Create a new review for a booking
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment, highlights, detailedRating, photos } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({ message: 'Booking ID and rating are required.' });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Verify ownership: booking user must match logged-in user
        // Or if it was a guest booking, but the user is now logged in with the same email
        const isOwner = booking.user && booking.user.toString() === req.user.id;
        const isGuestEmailMatch = booking.guestEmail && booking.guestEmail.toLowerCase() === req.user.email.toLowerCase();

        if (!isOwner && !isGuestEmailMatch) {
            return res.status(403).json({ message: 'You are not authorized to review this booking.' });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'This booking has already been reviewed.' });
        }

        // Create the review
        const review = await Review.create({
            booking: bookingId,
            spot: booking.spot,
            user: req.user.id,
            rating: Number(rating),
            comment: comment || '',
            highlights: highlights || [],
            detailedRating: detailedRating || { security: 5, convenience: 5, price: 5 },
            photos: photos || []
        });

        // Recalculate average rating for the ParkingSpot
        const allReviews = await Review.find({ spot: booking.spot });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0;

        await ParkingSpot.findByIdAndUpdate(booking.spot, {
            ggRating: Number(averageRating)
        });

        res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error creating review', error: error.message });
    }
};

/**
 * @desc    Get all reviews for a specific parking spot
 * @route   GET /api/reviews/spot/:spotId
 * @access  Public
 */
exports.getSpotReviews = async (req, res) => {
    try {
        const { spotId } = req.params;

        const reviews = await Review.find({ spot: spotId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const totalReviews = reviews.length;
        let avgRating = 0;
        let avgSecurity = 0;
        let avgConvenience = 0;
        let avgPrice = 0;
        const highlightCounts = {};

        if (totalReviews > 0) {
            let sumRating = 0;
            let sumSecurity = 0;
            let sumConvenience = 0;
            let sumPrice = 0;

            reviews.forEach(r => {
                sumRating += r.rating;
                sumSecurity += r.detailedRating?.security || 5;
                sumConvenience += r.detailedRating?.convenience || 5;
                sumPrice += r.detailedRating?.price || 5;

                if (Array.isArray(r.highlights)) {
                    r.highlights.forEach(h => {
                        highlightCounts[h] = (highlightCounts[h] || 0) + 1;
                    });
                }
            });

            avgRating = Number((sumRating / totalReviews).toFixed(1));
            avgSecurity = Number((sumSecurity / totalReviews).toFixed(1));
            avgConvenience = Number((sumConvenience / totalReviews).toFixed(1));
            avgPrice = Number((sumPrice / totalReviews).toFixed(1));
        }

        res.json({
            spotId,
            statistics: {
                totalReviews,
                averageRating: avgRating,
                detailedAverage: {
                    security: avgSecurity,
                    convenience: avgConvenience,
                    price: avgPrice
                },
                highlightCounts
            },
            reviews
        });
    } catch (error) {
        console.error('Get spot reviews error:', error);
        res.status(500).json({ message: 'Server error fetching spot reviews', error: error.message });
    }
};
