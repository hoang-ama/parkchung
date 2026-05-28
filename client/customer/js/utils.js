// File: client/customer/js/utils.js

/**
 * Chuyển đổi chuỗi ngày giờ từ định dạng "dd/mm/yyyy HH:ii" sang đối tượng Date.
 * @param {string} dateString - Chuỗi ngày giờ cần chuyển đổi.
 * @returns {Date|null} - Đối tượng Date hợp lệ hoặc null nếu thất bại.
 */
function parseVietnameseDateString(dateString) {
    if (!dateString) return null;
    
    // First try standard Date parsing if it already looks like an ISO/UTC format
    if (dateString.includes && dateString.includes('T') && dateString.includes('-')) {
        const standardDate = new Date(dateString);
        if (!isNaN(standardDate.getTime())) {
            return standardDate;
        }
    }
    
    // Custom regex matching dd/mm/yyyy HH:MM, dd.mm.yyyy HH:MM, dd-mm-yyyy HH:MM
    const parts = dateString.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\s+(\d{1,2}):(\d{2})/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10);
        let year = parseInt(parts[3], 10);
        const hours = parseInt(parts[4], 10);
        const minutes = parseInt(parts[5], 10);
        if (parts[3].length === 2) {
            year = 2000 + year;
        }
        const d = new Date(year, month - 1, day, hours, minutes, 0);
        if (!isNaN(d.getTime())) return d;
    }
    
    // Fallback to native constructor if anything else is parseable
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
        return fallbackDate;
    }
    
    return null;
}