/**
 * Calculate booking price based on duration and hourly rate.
 * @param {Date} startTime
 * @param {Date} endTime
 * @param {number} hourlyRate
 * @returns {number}
 */
const calculatePrice = (startTime, endTime, hourlyRate) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs <= 0) return 0;

    const durationHours = durationMs / (1000 * 60 * 60);
    let totalPrice = durationHours * hourlyRate;

    const transactionFee = 0.99;
    totalPrice += transactionFee;

    return parseFloat(totalPrice.toFixed(2));
};

module.exports = { calculatePrice };

