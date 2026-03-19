const VN_PHONE_REGEX = /^(84|0[3|5|7|8|9])+([0-9]{8})\b/;

const VN_PHONE_ERROR_MSG = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (VD: 0901234567 hoặc 84901234567).';

const isValidVNPhone = (phone) => {
    if (!phone) return true;
    return VN_PHONE_REGEX.test(phone);
};

module.exports = {
    VN_PHONE_REGEX,
    VN_PHONE_ERROR_MSG,
    isValidVNPhone,
};
