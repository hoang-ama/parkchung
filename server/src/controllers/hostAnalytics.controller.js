// File: server/src/controllers/hostAnalytics.controller.js
const ParkingSpot = require('../models/parkingSpot.model');
const Booking = require('../models/booking.model');

/**
 * @desc    Get host analytics overview for dashboard
 * @route   GET /api/host/analytics/overview
 * @access  Private (Host only)
 */
exports.getHostAnalyticsOverview = async (req, res) => {
    try {
        const hostId = req.user._id;

        // Get all non-archived spots for this host
        const spots = await ParkingSpot.find({
            owner: hostId,
            status: { $ne: 'archived' }
        }).select('_id');

        const spotIds = spots.map(spot => spot._id);
        const spotsCount = spots.length;

        // If host has no spots, return zero stats
        if (spotsCount === 0) {
            return res.json({
                totalRevenueMonth: 0,
                totalBookingsMonth: 0,
                occupancyRate: 0,
                spotsCount: 0
            });
        }

        // Calculate current month boundaries
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

        // Build filter for bookings this month
        const bookingFilter = {
            spot: { $in: spotIds },
            startTime: { $gte: startOfMonth, $lt: endOfMonth },
            status: { $in: ['confirmed', 'completed'] }
        };

        // Get all bookings for this month
        const bookings = await Booking.find(bookingFilter).lean();

        // Calculate metrics
        let totalRevenueMonth = 0;
        let occupiedHours = 0;

        for (const booking of bookings) {
            // Sum revenue
            totalRevenueMonth += booking.totalPrice || 0;

            // Calculate occupied hours
            if (booking.startTime && booking.endTime) {
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const durationMs = end.getTime() - start.getTime();
                const durationHours = durationMs / (1000 * 60 * 60);
                occupiedHours += Math.max(0, durationHours);
            }
        }

        const totalBookingsMonth = bookings.length;

        // Calculate occupancy rate
        // monthHours = total hours in the current month
        const monthMs = endOfMonth.getTime() - startOfMonth.getTime();
        const monthHours = monthMs / (1000 * 60 * 60);

        // totalAvailableHours = number of spots × hours in month
        const totalAvailableHours = spotsCount * monthHours;

        // occupancyRate = occupied hours / total available hours
        let occupancyRate = 0;
        if (totalAvailableHours > 0) {
            occupancyRate = Math.min(occupiedHours / totalAvailableHours, 1);
        }

        res.json({
            totalRevenueMonth: Math.round(totalRevenueMonth),
            totalBookingsMonth,
            occupancyRate: parseFloat(occupancyRate.toFixed(4)),
            spotsCount
        });

    } catch (error) {
        console.error('Get host analytics overview error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get host revenue breakdown by spot
 * @route   GET /api/host/analytics/revenue-by-spot
 * @access  Private (Host only)
 */
exports.getRevenueBySpot = async (req, res) => {
    try {
        const hostId = req.user._id;
        const { from, to } = req.query;

        // Get all non-archived spots for this host
        const spots = await ParkingSpot.find({
            owner: hostId,
            status: { $ne: 'archived' }
        }).select('_id name address');

        if (spots.length === 0) {
            return res.json({ data: [] });
        }

        const spotIds = spots.map(spot => spot._id);

        // Build date filter
        let dateFilter = {};
        if (from) {
            dateFilter.$gte = new Date(from);
        }
        if (to) {
            dateFilter.$lt = new Date(to);
        }

        // If no date range specified, default to current month
        if (!from && !to) {
            const now = new Date();
            dateFilter = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            };
        }

        // Aggregate revenue by spot
        const revenueBySpot = await Booking.aggregate([
            {
                $match: {
                    spot: { $in: spotIds },
                    startTime: dateFilter,
                    status: { $in: ['confirmed', 'completed'] }
                }
            },
            {
                $group: {
                    _id: '$spot',
                    totalRevenue: { $sum: '$totalPrice' },
                    bookingsCount: { $sum: 1 }
                }
            }
        ]);

        // Map results with spot names
        const spotMap = new Map(spots.map(s => [s._id.toString(), s]));
        const data = revenueBySpot.map(item => {
            const spot = spotMap.get(item._id.toString());
            return {
                spotId: item._id,
                spotName: spot?.name || 'Unknown',
                spotAddress: spot?.address || '',
                totalRevenue: item.totalRevenue,
                bookingsCount: item.bookingsCount
            };
        });

        // Add spots with zero revenue
        for (const spot of spots) {
            const hasRevenue = data.some(d => d.spotId.toString() === spot._id.toString());
            if (!hasRevenue) {
                data.push({
                    spotId: spot._id,
                    spotName: spot.name,
                    spotAddress: spot.address,
                    totalRevenue: 0,
                    bookingsCount: 0
                });
            }
        }

        res.json({ data });

    } catch (error) {
        console.error('Get revenue by spot error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get booking trends over time
 * @route   GET /api/host/analytics/booking-trends
 * @access  Private (Host only)
 */
exports.getBookingTrends = async (req, res) => {
    try {
        const hostId = req.user._id;
        const { period = 'daily', days = 30 } = req.query;

        // Get all spots for this host
        const spots = await ParkingSpot.find({ owner: hostId }).select('_id');
        const spotIds = spots.map(spot => spot._id);

        if (spotIds.length === 0) {
            return res.json({ data: [] });
        }

        // Calculate date range
        const now = new Date();
        const daysNum = Math.min(parseInt(days, 10) || 30, 365);
        const startDate = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);

        // Aggregate bookings
        const groupFormat = period === 'monthly'
            ? { year: { $year: '$startTime' }, month: { $month: '$startTime' } }
            : { year: { $year: '$startTime' }, month: { $month: '$startTime' }, day: { $dayOfMonth: '$startTime' } };

        const trends = await Booking.aggregate([
            {
                $match: {
                    spot: { $in: spotIds },
                    startTime: { $gte: startDate },
                    status: { $in: ['confirmed', 'completed', 'pending'] }
                }
            },
            {
                $group: {
                    _id: groupFormat,
                    bookingsCount: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Format data
        const data = trends.map(item => ({
            date: period === 'monthly'
                ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
                : `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
            bookingsCount: item.bookingsCount,
            revenue: item.revenue
        }));

        res.json({ data });

    } catch (error) {
        console.error('Get booking trends error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
