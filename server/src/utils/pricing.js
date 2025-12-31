/**
 * Calculate booking price based on duration and hourly rate.
 * Rounds UP to the nearest hour (minimum 1 hour charge).
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {number} hourlyRate
 * @returns {number}
 */
const calculatePrice = (startTime, endTime, hourlyRate) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs <= 0) return 0;

    // Round UP to the nearest hour (minimum 1 hour)
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const totalPrice = durationHours * hourlyRate;

    return totalPrice;
};


module.exports = { calculatePrice };

