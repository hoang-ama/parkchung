// File: client/host/src/i18n/translations-extended.ts
// Extended translations with all missing keys from Host Portal pages

export type Language = 'en' | 'vi';

export interface Translations {
    // Layout & Navigation
    dashboard: string;
    mySpots: string;
    bookings: string;
    earnings: string;
    hostAccount: string;
    backToParkchung: string;
    signOut: string;

    // Login Page
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    loginButton: string;
    noAccount: string;
    registerHere: string;
    forgotPassword: string;
    loginError: string;

    // Register Page
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    phone: string;
    confirmPassword: string;
    registerButton: string;
    haveAccount: string;
    loginHere: string;
    agreeToTerms: string;
    termsAndConditions: string;
    privacyPolicy: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    phoneRequired: string;
    phoneInvalid: string;
    fullNameRequired: string;
    mustAgreeToTerms: string;
    registrationSuccess: string;
    registrationError: string;
    accountCreated: string;
    redirectingToLogin: string;

    // Dashboard
    welcomeHost: string;
    dashboardTitle: string;
    totalSpots: string;
    activeBookings: string;
    totalEarnings: string;
    pendingApproval: string;
    recentActivity: string;
    viewAll: string;
    thisMonth: string;
    occupancyRate: string;
    recentBookings: string;
    noRecentBookings: string;
    loadingDashboard: string;
    failedToLoadData: string;
    refresh: string;

    // My Spots
    mySpotsTitle: string;
    addNewSpot: string;
    noSpotsYet: string;
    createFirstSpot: string;
    editDetails: string;
    viewBookings: string;
    deleteSpot: string;
    deleteSpotConfirmTitle: string;
    deleteSpotConfirmMessage: string;
    deleteSpotSuccess: string;
    deleteSpotError: string;
    activate: string;
    deactivate: string;
    inactive: string;
    activateSuccess: string;
    deactivateSuccess: string;
    toggleActiveError: string;
    spotStatus: string;
    statusApproved: string;
    statusPending: string;
    statusRejected: string;
    statusArchived: string;
    hourlyRate: string;
    monthlyRate: string;
    slots: string;
    loadingSpots: string;
    failedToLoadSpots: string;
    covered: string;
    uncovered: string;

    // Create/Edit Spot
    createSpotTitle: string;
    editSpotTitle: string;
    basicInfo: string;
    spotName: string;
    address: string;
    contactPhone: string;
    description: string;
    images: string;
    location: string;
    latitude: string;
    longitude: string;
    pricingCapacity: string;
    numberOfSlots: string;
    operatingHours: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    open: string;
    closed: string;
    copyToAll: string;
    scheduleNotes: string;
    notesPlaceholder: string;
    presetWeekdays: string;
    presetEveryday: string;
    preset247: string;
    presetCustom: string;
    addTimeSlot: string;
    removeSlot: string;
    maxSlotsReached: string;
    hasRoof: string;
    vehicleTypes: string;
    bookingMethods: string;
    paymentMethods: string;
    addOnServices: string;
    saveChanges: string;
    submitForReview: string;
    back: string;
    car: string;
    motorbike: string;
    bicycle: string;
    truck: string;
    onlineBooking: string;
    callBooking: string;
    cash: string;
    paypal: string;
    valetParking: string;
    carWashing: string;
    evCharging: string;
    uploadImages: string;
    dragDropImages: string;
    clickToUpload: string;
    maxImages: string;
    removeImage: string;
    spotNameRequired: string;
    addressRequired: string;
    hourlyRateRequired: string;
    slotsRequired: string;
    selectAtLeastOne: string;
    savingChanges: string;
    submittingForReview: string;
    spotCreated: string;
    spotUpdated: string;
    errorCreatingSpot: string;
    errorUpdatingSpot: string;
    loadingSpotDetails: string;
    spotNotFound: string;

    // Bookings
    bookingsTitle: string;
    noBookingsYet: string;
    customer: string;
    spot: string;
    dateTime: string;
    duration: string;
    amount: string;
    status: string;
    confirmed: string;
    pending: string;
    cancelled: string;
    completed: string;
    filterByStatus: string;
    filterBySpot: string;
    allStatuses: string;
    allSpots: string;
    applyFilters: string;
    clearFilters: string;
    searchBookings: string;
    loadingBookings: string;
    failedToLoadBookings: string;
    noBookingsFound: string;
    cancelBooking: string;
    cancelReason: string;
    confirmCancellation: string;
    cancelling: string;
    bookingCancelled: string;
    errorCancellingBooking: string;
    paymentStatus: string;
    paid: string;
    unpaid: string;
    refunded: string;
    paymentFailed: string;
    customerEmail: string;
    bookingId: string;
    createdAt: string;
    actions: string;
    viewDetails: string;
    page: string;
    of: string;
    previous: string;
    next: string;
    showing: string;
    to: string;
    results: string;

    // Earnings
    earningsTitle: string;
    earningsComingSoon: string;

    // Common
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    save: string;
    required: string;
    vndPerHour: string;
    vndPerMonth: string;
    yes: string;
    no: string;
    close: string;
    submit: string;
    reset: string;
    search: string;
    filter: string;
    sort: string;
    export: string;
    print: string;
    download: string;
    upload: string;
    selectAll: string;
    deselectAll: string;
    noDataAvailable: string;
    tryAgain: string;
    goBack: string;
    hours: string;
    minutes: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
}

export const translations: Record<Language, Translations> = {
    en: {
        // Layout & Navigation
        dashboard: 'Dashboard',
        mySpots: 'My Spots',
        bookings: 'Bookings',
        earnings: 'Earnings',
        hostAccount: 'Host Account',
        backToParkchung: 'Back to Parkchung',
        signOut: 'Sign Out',

        // Login Page
        loginTitle: 'Host Portal Login',
        loginSubtitle: 'Sign in to manage your parking spots',
        email: 'Email',
        password: 'Password',
        loginButton: 'Sign In',
        noAccount: "Don't have an account?",
        registerHere: 'Register here',
        forgotPassword: 'Forgot password?',
        loginError: 'Invalid email or password',

        // Register Page
        registerTitle: 'Become a Host',
        registerSubtitle: 'Create your host account to start earning',
        fullName: 'Full Name',
        phone: 'Phone Number',
        confirmPassword: 'Confirm Password',
        registerButton: 'Create Account',
        haveAccount: 'Already have an account?',
        loginHere: 'Login here',
        agreeToTerms: 'I agree to the',
        termsAndConditions: 'Terms and Conditions',
        privacyPolicy: 'Privacy Policy',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 6 characters',
        passwordsDoNotMatch: 'Passwords do not match',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid phone number',
        fullNameRequired: 'Full name is required',
        mustAgreeToTerms: 'You must agree to the terms and conditions',
        registrationSuccess: 'Registration successful!',
        registrationError: 'Registration failed. Please try again.',
        accountCreated: 'Your account has been created successfully',
        redirectingToLogin: 'Redirecting to login...',

        // Dashboard
        welcomeHost: 'Welcome back',
        dashboardTitle: 'Dashboard Overview',
        totalSpots: 'Total Spots',
        activeBookings: 'Active Bookings',
        totalEarnings: 'Total Earnings',
        pendingApproval: 'Pending Approval',
        recentActivity: 'Recent Activity',
        viewAll: 'View All',
        thisMonth: 'This Month',
        occupancyRate: 'Occupancy Rate',
        recentBookings: 'Recent Bookings',
        noRecentBookings: 'No recent bookings',
        loadingDashboard: 'Loading dashboard...',
        failedToLoadData: 'Failed to load data',
        refresh: 'Refresh',

        // My Spots
        mySpotsTitle: 'My Parking Spots',
        addNewSpot: 'Add New Spot',
        noSpotsYet: 'No spots yet',
        createFirstSpot: 'Create your first parking spot',
        editDetails: 'Edit Details',
        viewBookings: 'View Bookings',
        deleteSpot: 'Delete',
        deleteSpotConfirmTitle: 'Delete Parking Spot?',
        deleteSpotConfirmMessage: 'Are you sure you want to delete this parking spot? This action cannot be undone.',
        deleteSpotSuccess: 'Parking spot deleted successfully',
        deleteSpotError: 'Failed to delete parking spot',
        activate: 'Activate',
        deactivate: 'Deactivate',
        inactive: 'Inactive',
        activateSuccess: 'Spot activated successfully',
        deactivateSuccess: 'Spot deactivated successfully',
        toggleActiveError: 'Failed to toggle spot status',
        spotStatus: 'Status',
        statusApproved: 'Approved',
        statusPending: 'Pending',
        statusRejected: 'Rejected',
        statusArchived: 'Archived',
        hourlyRate: 'Hourly Rate',
        monthlyRate: 'Monthly Rate',
        slots: 'Slots',
        loadingSpots: 'Loading spots...',
        failedToLoadSpots: 'Failed to load spots',
        covered: 'Covered',
        uncovered: 'Uncovered',

        // Create/Edit Spot
        createSpotTitle: 'Create New Parking Spot',
        editSpotTitle: 'Edit Parking Spot',
        basicInfo: 'Basic Information',
        spotName: 'Spot Name',
        address: 'Address',
        contactPhone: 'Contact Phone',
        description: 'Description',
        images: 'Images',
        location: 'Location',
        latitude: 'Latitude',
        longitude: 'Longitude',
        pricingCapacity: 'Pricing & Capacity',
        numberOfSlots: 'Number of Slots',
        operatingHours: 'Operating Hours',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
        open: 'Open',
        closed: 'Closed',
        copyToAll: 'Copy Mon → All',
        scheduleNotes: 'Notes',
        notesPlaceholder: 'e.g. Closed on public holidays, gate code: 1234...',
        presetWeekdays: 'Weekdays 8–22',
        presetEveryday: 'Everyday 8–22',
        preset247: '24/7',
        presetCustom: 'Custom',
        addTimeSlot: '+ Add time slot',
        removeSlot: 'Remove',
        maxSlotsReached: 'Max 3 slots per day',
        hasRoof: 'This spot has a roof (covered parking)',
        vehicleTypes: 'Vehicle Types',
        bookingMethods: 'Booking Methods',
        paymentMethods: 'Payment Methods',
        addOnServices: 'Add-on Services',
        saveChanges: 'Save Changes',
        submitForReview: 'Submit for Review',
        back: 'Back',
        car: 'Car',
        motorbike: 'Motorbike',
        bicycle: 'Bicycle',
        truck: 'Truck / Large Vehicle',
        onlineBooking: 'Online Booking',
        callBooking: 'Call Booking',
        cash: 'Cash',
        paypal: 'PayPal',
        valetParking: 'Valet Parking',
        carWashing: 'Car Washing',
        evCharging: 'EV Charging',
        uploadImages: 'Upload Images',
        dragDropImages: 'Drag and drop images here',
        clickToUpload: 'or click to upload',
        maxImages: 'Maximum 5 images',
        removeImage: 'Remove image',
        spotNameRequired: 'Spot name is required',
        addressRequired: 'Address is required',
        hourlyRateRequired: 'Hourly rate is required',
        slotsRequired: 'Number of slots is required',
        selectAtLeastOne: 'Please select at least one option',
        savingChanges: 'Saving changes...',
        submittingForReview: 'Submitting for review...',
        spotCreated: 'Parking spot created successfully!',
        spotUpdated: 'Parking spot updated successfully!',
        errorCreatingSpot: 'Error creating parking spot',
        errorUpdatingSpot: 'Error updating parking spot',
        loadingSpotDetails: 'Loading spot details...',
        spotNotFound: 'Parking spot not found',

        // Bookings
        bookingsTitle: 'Booking Management',
        noBookingsYet: 'No bookings yet',
        customer: 'Customer',
        spot: 'Spot',
        dateTime: 'Date & Time',
        duration: 'Duration',
        amount: 'Amount',
        status: 'Status',
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
        filterByStatus: 'Filter by Status',
        filterBySpot: 'Filter by Spot',
        allStatuses: 'All Statuses',
        allSpots: 'All Spots',
        applyFilters: 'Apply Filters',
        clearFilters: 'Clear Filters',
        searchBookings: 'Search bookings...',
        loadingBookings: 'Loading bookings...',
        failedToLoadBookings: 'Failed to load bookings',
        noBookingsFound: 'No bookings found',
        cancelBooking: 'Cancel Booking',
        cancelReason: 'Cancellation Reason',
        confirmCancellation: 'Confirm Cancellation',
        cancelling: 'Cancelling...',
        bookingCancelled: 'Booking cancelled successfully',
        errorCancellingBooking: 'Error cancelling booking',
        paymentStatus: 'Payment Status',
        paid: 'Paid',
        unpaid: 'Unpaid',
        refunded: 'Refunded',
        paymentFailed: 'Payment Failed',
        customerEmail: 'Customer Email',
        bookingId: 'Booking ID',
        createdAt: 'Created At',
        actions: 'Actions',
        viewDetails: 'View Details',
        page: 'Page',
        of: 'of',
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing',
        to: 'to',
        results: 'results',

        // Earnings
        earningsTitle: 'Payouts & Earnings',
        earningsComingSoon: 'Earnings dashboard coming soon...',

        // Common
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        save: 'Save',
        required: 'Required',
        vndPerHour: 'VND/hour',
        vndPerMonth: 'VND/month',
        yes: 'Yes',
        no: 'No',
        close: 'Close',
        submit: 'Submit',
        reset: 'Reset',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        export: 'Export',
        print: 'Print',
        download: 'Download',
        upload: 'Upload',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        noDataAvailable: 'No data available',
        tryAgain: 'Try Again',
        goBack: 'Go Back',
        hours: 'hours',
        minutes: 'minutes',
        days: 'days',
        weeks: 'weeks',
        months: 'months',
        years: 'years',
    },
    vi: {
        // Layout & Navigation
        dashboard: 'Bảng điều khiển',
        mySpots: 'Bãi đỗ của tôi',
        bookings: 'Đặt chỗ',
        earnings: 'Thu nhập',
        hostAccount: 'Tài khoản Chủ bãi',
        backToParkchung: 'Về trang Parkchung',
        signOut: 'Đăng xuất',

        // Login Page
        loginTitle: 'Đăng nhập Chủ bãi',
        loginSubtitle: 'Đăng nhập để quản lý bãi đỗ xe của bạn',
        email: 'Email',
        password: 'Mật khẩu',
        loginButton: 'Đăng nhập',
        noAccount: 'Chưa có tài khoản?',
        registerHere: 'Đăng ký tại đây',
        forgotPassword: 'Quên mật khẩu?',
        loginError: 'Email hoặc mật khẩu không đúng',

        // Register Page
        registerTitle: 'Trở thành Chủ bãi',
        registerSubtitle: 'Tạo tài khoản để bắt đầu kiếm thu nhập',
        fullName: 'Họ và tên',
        phone: 'Số điện thoại',
        confirmPassword: 'Xác nhận mật khẩu',
        registerButton: 'Tạo tài khoản',
        haveAccount: 'Đã có tài khoản?',
        loginHere: 'Đăng nhập tại đây',
        agreeToTerms: 'Tôi đồng ý với',
        termsAndConditions: 'Điều khoản và Điều kiện',
        privacyPolicy: 'Chính sách Bảo mật',
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Vui lòng nhập địa chỉ email hợp lệ',
        passwordRequired: 'Mật khẩu là bắt buộc',
        passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
        passwordsDoNotMatch: 'Mật khẩu không khớp',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Vui lòng nhập số điện thoại hợp lệ',
        fullNameRequired: 'Họ và tên là bắt buộc',
        mustAgreeToTerms: 'Bạn phải đồng ý với điều khoản và điều kiện',
        registrationSuccess: 'Đăng ký thành công!',
        registrationError: 'Đăng ký thất bại. Vui lòng thử lại.',
        accountCreated: 'Tài khoản của bạn đã được tạo thành công',
        redirectingToLogin: 'Đang chuyển đến trang đăng nhập...',

        // Dashboard
        welcomeHost: 'Chào mừng trở lại',
        dashboardTitle: 'Tổng quan',
        totalSpots: 'Tổng số bãi',
        activeBookings: 'Đặt chỗ đang hoạt động',
        totalEarnings: 'Tổng thu nhập',
        pendingApproval: 'Chờ duyệt',
        recentActivity: 'Hoạt động gần đây',
        viewAll: 'Xem tất cả',
        thisMonth: 'Tháng này',
        occupancyRate: 'Tỷ lệ lấp đầy',
        recentBookings: 'Đặt chỗ gần đây',
        noRecentBookings: 'Không có đặt chỗ gần đây',
        loadingDashboard: 'Đang tải bảng điều khiển...',
        failedToLoadData: 'Không thể tải dữ liệu',
        refresh: 'Làm mới',

        // My Spots
        mySpotsTitle: 'Bãi đỗ xe của tôi',
        addNewSpot: 'Thêm bãi mới',
        noSpotsYet: 'Chưa có bãi đỗ',
        createFirstSpot: 'Tạo bãi đỗ đầu tiên',
        editDetails: 'Chỉnh sửa',
        viewBookings: 'Xem đặt chỗ',
        deleteSpot: 'Xóa',
        deleteSpotConfirmTitle: 'Xóa bãi đỗ xe?',
        deleteSpotConfirmMessage: 'Bạn có chắc chắn muốn xóa bãi đỗ này? Hành động này không thể hoàn tác.',
        deleteSpotSuccess: 'Xóa bãi đỗ thành công',
        deleteSpotError: 'Không thể xóa bãi đỗ',
        activate: 'Kích hoạt',
        deactivate: 'Vô hiệu hóa',
        inactive: 'Không hoạt động',
        activateSuccess: 'Kích hoạt bãi đỗ thành công',
        deactivateSuccess: 'Vô hiệu hóa bãi đỗ thành công',
        toggleActiveError: 'Không thể thay đổi trạng thái bãi đỗ',
        spotStatus: 'Trạng thái',
        statusApproved: 'Đã duyệt',
        statusPending: 'Đang chờ',
        statusRejected: 'Từ chối',
        statusArchived: 'Đã lưu trữ',
        hourlyRate: 'Giá theo giờ',
        monthlyRate: 'Giá theo tháng',
        slots: 'Chỗ',
        loadingSpots: 'Đang tải bãi đỗ...',
        failedToLoadSpots: 'Không thể tải bãi đỗ',
        covered: 'Có mái che',
        uncovered: 'Không mái che',

        // Create/Edit Spot
        createSpotTitle: 'Tạo bãi đỗ mới',
        editSpotTitle: 'Chỉnh sửa bãi đỗ',
        basicInfo: 'Thông tin cơ bản',
        spotName: 'Tên bãi đỗ',
        address: 'Địa chỉ',
        contactPhone: 'Số điện thoại',
        description: 'Mô tả',
        images: 'Hình ảnh',
        location: 'Vị trí',
        latitude: 'Vĩ độ',
        longitude: 'Kinh độ',
        pricingCapacity: 'Giá & Sức chứa',
        numberOfSlots: 'Số chỗ',
        operatingHours: 'Giờ hoạt động',
        monday: 'Thứ Hai',
        tuesday: 'Thứ Ba',
        wednesday: 'Thứ Tư',
        thursday: 'Thứ Năm',
        friday: 'Thứ Sáu',
        saturday: 'Thứ Bảy',
        sunday: 'Chủ Nhật',
        open: 'Mở cửa',
        closed: 'Đóng cửa',
        copyToAll: 'Áp dụng T2 → Tất cả',
        scheduleNotes: 'Ghi chú',
        notesPlaceholder: 'VD: Đóng cửa ngày lễ, mã cổng: 1234...',
        presetWeekdays: 'Ngày thường 8–22',
        presetEveryday: 'Hàng ngày 8–22',
        preset247: '24/7',
        presetCustom: 'Tùy chỉnh',
        addTimeSlot: '+ Thêm khung giờ',
        removeSlot: 'Xóa',
        maxSlotsReached: 'Tối đa 3 khung giờ/ngày',
        hasRoof: 'Bãi đỗ có mái che',
        vehicleTypes: 'Loại phương tiện',
        bookingMethods: 'Phương thức đặt chỗ',
        paymentMethods: 'Phương thức thanh toán',
        addOnServices: 'Dịch vụ bổ sung',
        saveChanges: 'Lưu thay đổi',
        submitForReview: 'Gửi duyệt',
        back: 'Quay lại',
        car: 'Ô tô',
        motorbike: 'Xe máy',
        bicycle: 'Xe đạp',
        truck: 'Xe tải / Xe lớn',
        onlineBooking: 'Đặt trực tuyến',
        callBooking: 'Đặt qua điện thoại',
        cash: 'Tiền mặt',
        paypal: 'PayPal',
        valetParking: 'Đỗ xe hộ',
        carWashing: 'Rửa xe',
        evCharging: 'Sạc xe điện',
        uploadImages: 'Tải ảnh lên',
        dragDropImages: 'Kéo thả ảnh vào đây',
        clickToUpload: 'hoặc nhấn để tải lên',
        maxImages: 'Tối đa 5 ảnh',
        removeImage: 'Xóa ảnh',
        spotNameRequired: 'Tên bãi đỗ là bắt buộc',
        addressRequired: 'Địa chỉ là bắt buộc',
        hourlyRateRequired: 'Giá theo giờ là bắt buộc',
        slotsRequired: 'Số chỗ là bắt buộc',
        selectAtLeastOne: 'Vui lòng chọn ít nhất một tùy chọn',
        savingChanges: 'Đang lưu thay đổi...',
        submittingForReview: 'Đang gửi duyệt...',
        spotCreated: 'Tạo bãi đỗ thành công!',
        spotUpdated: 'Cập nhật bãi đỗ thành công!',
        errorCreatingSpot: 'Lỗi khi tạo bãi đỗ',
        errorUpdatingSpot: 'Lỗi khi cập nhật bãi đỗ',
        loadingSpotDetails: 'Đang tải thông tin bãi đỗ...',
        spotNotFound: 'Không tìm thấy bãi đỗ',

        // Bookings
        bookingsTitle: 'Quản lý đặt chỗ',
        noBookingsYet: 'Chưa có đặt chỗ',
        customer: 'Khách hàng',
        spot: 'Bãi đỗ',
        dateTime: 'Ngày & Giờ',
        duration: 'Thời lượng',
        amount: 'Số tiền',
        status: 'Trạng thái',
        confirmed: 'Đã xác nhận',
        pending: 'Đang chờ',
        cancelled: 'Đã hủy',
        completed: 'Hoàn thành',
        filterByStatus: 'Lọc theo trạng thái',
        filterBySpot: 'Lọc theo bãi đỗ',
        allStatuses: 'Tất cả trạng thái',
        allSpots: 'Tất cả bãi đỗ',
        applyFilters: 'Áp dụng bộ lọc',
        clearFilters: 'Xóa bộ lọc',
        searchBookings: 'Tìm kiếm đặt chỗ...',
        loadingBookings: 'Đang tải đặt chỗ...',
        failedToLoadBookings: 'Không thể tải đặt chỗ',
        noBookingsFound: 'Không tìm thấy đặt chỗ',
        cancelBooking: 'Hủy đặt chỗ',
        cancelReason: 'Lý do hủy',
        confirmCancellation: 'Xác nhận hủy',
        cancelling: 'Đang hủy...',
        bookingCancelled: 'Hủy đặt chỗ thành công',
        errorCancellingBooking: 'Lỗi khi hủy đặt chỗ',
        paymentStatus: 'Trạng thái thanh toán',
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
        refunded: 'Đã hoàn tiền',
        paymentFailed: 'Thanh toán thất bại',
        customerEmail: 'Email khách hàng',
        bookingId: 'Mã đặt chỗ',
        createdAt: 'Ngày tạo',
        actions: 'Thao tác',
        viewDetails: 'Xem chi tiết',
        page: 'Trang',
        of: 'của',
        previous: 'Trước',
        next: 'Sau',
        showing: 'Hiển thị',
        to: 'đến',
        results: 'kết quả',

        // Earnings
        earningsTitle: 'Thu nhập & Thanh toán',
        earningsComingSoon: 'Trang thu nhập sẽ ra mắt sớm...',

        // Common
        loading: 'Đang tải...',
        error: 'Đã xảy ra lỗi',
        success: 'Thành công!',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        delete: 'Xóa',
        edit: 'Sửa',
        save: 'Lưu',
        required: 'Bắt buộc',
        vndPerHour: 'VND/giờ',
        vndPerMonth: 'VND/tháng',
        yes: 'Có',
        no: 'Không',
        close: 'Đóng',
        submit: 'Gửi',
        reset: 'Đặt lại',
        search: 'Tìm kiếm',
        filter: 'Lọc',
        sort: 'Sắp xếp',
        export: 'Xuất',
        print: 'In',
        download: 'Tải xuống',
        upload: 'Tải lên',
        selectAll: 'Chọn tất cả',
        deselectAll: 'Bỏ chọn tất cả',
        noDataAvailable: 'Không có dữ liệu',
        tryAgain: 'Thử lại',
        goBack: 'Quay lại',
        hours: 'giờ',
        minutes: 'phút',
        days: 'ngày',
        weeks: 'tuần',
        months: 'tháng',
        years: 'năm',
    }
};
