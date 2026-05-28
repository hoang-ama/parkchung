// File: client/customer/js/utils.js

/**
 * Chuyển đổi chuỗi ngày giờ từ định dạng "dd/mm/yyyy HH:ii" sang đối tượng Date.
 * @param {string} dateString - Chuỗi ngày giờ cần chuyển đổi.
 * @returns {Date|null} - Đối tượng Date hợp lệ hoặc null nếu thất bại.
 */
function parseVietnameseDateString(dateString) {
    if (!dateString) return null;
    
    // First try standard Date parsing if it already looks like an ISO/UTC format
    const standardDate = new Date(dateString);
    if (!isNaN(standardDate.getTime()) && dateString.includes('-') && dateString.includes('T')) {
        return standardDate;
    }
    
    // Custom regex matching dd/mm/yyyy HH:MM, dd.mm.yyyy HH:MM, dd-mm-yyyy HH:MM
    const parts = dateString.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})\s+(\d{1,2}):(\d{2})/);
    if (parts) {
        const day = parts[1].padStart(2, '0');
        const month = parts[2].padStart(2, '0');
        let year = parts[3];
        const hours = parts[4].padStart(2, '0');
        const minutes = parts[5].padStart(2, '0');
        if (year.length === 2) {
            year = '20' + year;
        }
        const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
        const d = new Date(isoString);
        if (!isNaN(d.getTime())) return d;
    }
    
    // Fallback to native constructor if anything else is parseable
    if (!isNaN(standardDate.getTime())) {
        return standardDate;
    }
    
    return null;
}