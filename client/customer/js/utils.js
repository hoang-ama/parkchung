// File: client/customer/js/utils.js

/**
 * Chuyển đổi chuỗi ngày giờ từ định dạng "dd/mm/yyyy HH:ii" sang đối tượng Date.
 * @param {string} dateString - Chuỗi ngày giờ cần chuyển đổi.
 * @returns {Date|null} - Đối tượng Date hợp lệ hoặc null nếu thất bại.
 */
function parseVietnameseDateString(dateString) {
    if (!dateString) return null;
    const parts = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
    if (!parts) return null;
    const day = parts[1], month = parts[2], year = parts[3], hours = parts[4], minutes = parts[5];
    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    return new Date(isoString);
}