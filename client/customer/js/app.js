document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('header nav');
    const userData = JSON.parse(localStorage.getItem('userData'));
    let currentLang = localStorage.getItem('lang') || 'en';

    const t = {
        en: {
            becomeHost: 'Host',
            registerText: 'Register',
            myBookings: 'My Bookings',
            welcome: 'Welcome',
            logout: 'Logout',
            login: 'Login',
            tagline: 'Save time. Save money. Save Earth',
            nav_home: 'Home',
            nav_available: 'Available Spots',
            tab_hourly: 'Hourly/Daily',
            tab_monthly: 'Monthly',
            tab_airport: 'Airport',
            label_park_at: 'Park at',
            label_from: 'From',
            label_until: 'Until',
            btn_show_spaces: 'Show parking spaces',
            why_title: 'Why Parkchung',
            benefit_time_title: 'Save Time',
            benefit_time_desc: 'Book your parking spot in advance, no more endless searching.',
            benefit_price_title: 'Transparent Pricing',
            benefit_price_desc: 'Clear pricing, no surprises when you book.',
            benefit_safe_title: 'Safe Parking',
            benefit_safe_desc: 'Secure spots monitored with security systems.',
            locations_title: 'Featured Locations',
            loc_airports: 'Airports',
            loc_city: 'City Centers',
            loc_homes: 'Private Homes',
            rent_title: 'Rent out your parking or EV charging space',
            rent_desc: 'Make easy tax free money by renting out your parking or EV charging space. It‘s free to list and only takes a few minutes to get up and running.',
            rent_cta: 'Learn how to earn today',
            carpark_title: 'Car park management',
            carpark_desc: 'Maximise yield from underused car parks and vacant land, or transform payments with the favourite parking app.',
            carpark_cta: 'Learn about our solutions',
            press_title: 'The press talks about us',
            footer_contact: 'CONTACT',
            footer_brand: 'Parkchung, online parking platform',
            footer_intro: 'INTRODUCTION',
            footer_subscribe_text: 'Subscribe to receive promotions',
            ph_email: 'Enter your email...',
            btn_signup: 'Sign-up',
            footer_policies: 'POLICIES',
            pol_privacy: 'Privacy Policy',
            pol_terms: 'Service Regulations',
            pol_incidents: 'Incidents & Complaints',
            pol_host: 'Become a Host',
            footer_support: 'SUPPORT',
            sup_booking: 'Parking Booking Guide',
            sup_listing: 'Parking Listing Guide',
            sup_faq: 'FAQs',
            sup_blog: 'Blog',
            footer_copy: 'Copyright © 2025 by Parkchung. All rights reserved.',
            ph_location: 'Enter a place or postcode',
            results_title: 'Available Parking Spots',
            results_desc: 'Choose the best spot for you and book in seconds.',
            no_results: 'Sorry, no available parking spots were found for your criteria.',
            book_now: 'Book Now',
            login_title: 'Login to Your Account',
            register_title: 'Create Your Account',
            email: 'Email',
            password: 'Password',
            full_name: 'Full Name',
            phone: 'Phone',
            register: 'Register',
            no_account: "Don't have an account?",
            register_here: 'Register here',
            have_account: 'Already have an account?',
            login_here: 'Login here',
            my_bookings: 'My Bookings',
            back_home: '← Back to Home',
            loading: 'Loading your bookings...',
            host_hero_title: 'Earn Money with Your Parking Space',
            host_hero_desc: "Join our community of hosts and turn your unused parking spot into a source of income. It's simple, secure, and free to list.",
            host_benefit_price: 'Set your own price',
            host_benefit_avail: 'Control your availability',
            host_benefit_secure: 'Secure and easy payments',
            host_form_title: 'List Your Spot',
            host_form_note: 'Your spot will be reviewed by an admin before being published.',
            address: 'Address',
            get_location: 'Get Location',
            coords_hint: "We'll try to get your coordinates automatically. You can adjust them manually if needed.",
            longitude: 'Longitude',
            latitude: 'Latitude',
            hourly_rate: 'Hourly Rate (VND)',
            spot_image: 'Image of Your Spot',
            click_upload: 'Click to Upload Image',
            no_file: 'No file chosen',
            submit_review: 'Submit for Review',
            details_title: 'Spot Details',
            details_subtitle: "You're almost done! Just a few more details to confirm your booking.",
            details_section_title: 'Booking details',
            arriving_on: 'Arriving on',
            leaving_on: 'Leaving on',
            ph_select_datetime: 'Select Date/Time',
            duration: 'Duration',
            contact_title: "Customer's information",
            contact_phone_label: 'Phone Number',
            contact_hint: 'We\'ll use this to contact you about your booking',
            vehicle_title: 'Vehicle Information',
            vehicle_reg_label: 'Vehicle Registration',
            vehicle_desc: 'Your vehicle registration will be shared with the parking operator',
            ph_vehicle_reg: 'Enter your vehicle registration',
            payment_title: 'Payment Information',
            payment_desc: 'All payments are secure and encrypted with bank-level security',
            payment_secure: '256-bit SSL encryption',
            payment_methods: 'All major cards accepted',
            spot_loading: 'Loading Address...',
            unit_price: 'Unit Price',
            parking_duration: 'Parking Duration',
            total_price: 'Total Price',
            rechecked: 'Availability rechecked in',
            time_to_complete: 'Time to complete booking:',
            btn_pay_reserve: 'Pay now and reserve',
            trust_transparent_pricing: 'Transparent pricing shown before you confirm',
            trust_verified_hosts: 'Verified hosts & clear listing rules',
            trust_flexible_payment: 'Flexible payment options: online (eligible listings) or cash on arrival',
            trust_free_cancel: 'Free cancellation on eligible bookings — see the listing',
            trust_support: 'Fast, reliable customer support when you need help',
            trust_excellent: 'Excellent',
            popup_title: 'Complete Your Booking',
            popup_booking_summary: 'Booking Summary',
            popup_from: 'From',
            popup_to: 'To',
            popup_contact_info: 'Contact Information',
            popup_contact_desc: 'We\'ll use this information to confirm your booking',
            popup_fullname: 'Full Name',
            popup_email: 'Email Address',
            popup_phone: 'Phone Number',
            popup_cancel: 'Cancel',
            popup_send: 'Complete Booking',
            // Booking config page
            becomeHostRegister: 'Become a Host / Register',
            config_title: 'Complete Your Booking',
            config_subtitle: 'Just a few more details to confirm your reservation.',
            contact_fullname_label: 'Full Name',
            contact_email_label: 'Email Address',
            ph_fullname: 'Enter your full name',
            terms: 'Clicking below indicates that you have read and accept the Terms & Conditions',
            btn_reserve: 'Reserve Now',
            // Filter sidebar
            filter_title: 'Filters',
            filter_clear: 'Clear All',
            filter_vehicle_type: 'Vehicle Type',
            filter_car: 'Car',
            filter_motorbike: 'Motorbike',
            filter_bicycle: 'Bicycle',
            filter_truck: 'Truck / Large Vehicle',
            filter_booking_type: 'Booking Type',
            filter_online: 'Online Booking',
            filter_call: 'Call Booking',
            filter_payment: 'Payment Methods',
            filter_cash: 'Cash',
            filter_paypal: 'PayPal',
            // Spot Details page
            by_google_rating: 'By GoogleRating',
            spot_description: 'Description',
            no_description: 'No description available for this parking spot.',
            spot_location: 'Location',
            view_on_maps: 'View on Google Maps',
            pricing_capacity: 'Pricing & Capacity',
            hourly_rate_label: 'Hourly Rate',
            vnd_per_hour: 'VND/hour',
            monthly_rate_label: 'Monthly Rate',
            not_available: 'Not available',
            available_slots: 'Available Slots',
            unknown: 'Unknown',
            vehicle_types_accepted: 'Vehicle Types Accepted',
            accepted_payment_methods: 'Accepted Payment Methods',
            services_title: 'Services',
            no_services: 'No additional services available',
            call_to_book: 'Call to Book',
            // Payment method labels
            payment_method_title: 'Payment Method',
            pay_securely_online: 'Pay securely online',
            cash_pay_later: 'Cash / Pay Later',
            pay_at_spot: 'Pay at parking spot',
            badge_instant: 'Instant',
            badge_flexible: 'Flexible'
        },
        vi: {
            becomeHost: 'Đăng bãi',
            registerText: 'Đăng ký',
            myBookings: 'Đặt chỗ của tôi',
            welcome: 'Xin chào',
            logout: 'Đăng xuất',
            login: 'Đăng nhập',
            tagline: 'Tiết kiệm thời gian. Tiết kiệm chi phí. Bảo vệ Trái Đất',
            nav_home: 'Trang chủ',
            nav_available: 'Chỗ trống',
            tab_hourly: 'Theo giờ/Ngày',
            tab_monthly: 'Theo tháng',
            tab_airport: 'Sân bay',
            label_park_at: 'Đỗ tại',
            label_from: 'Từ',
            label_until: 'Đến',
            btn_show_spaces: 'Hiển thị chỗ đỗ',
            why_title: 'Vì sao chọn Parkchung',
            benefit_time_title: 'Tiết kiệm thời gian',
            benefit_time_desc: 'Đặt chỗ trước, không còn mất công tìm kiếm.',
            benefit_price_title: 'Giá minh bạch',
            benefit_price_desc: 'Giá rõ ràng, không phụ phí bất ngờ.',
            benefit_safe_title: 'Bãi đỗ an toàn',
            benefit_safe_desc: 'Khu đỗ an ninh, được giám sát.',
            locations_title: 'Địa điểm nổi bật',
            loc_airports: 'Sân bay',
            loc_city: 'Trung tâm thành phố',
            loc_homes: 'Nhà riêng',
            rent_title: 'Cho thuê chỗ đỗ hoặc điểm sạc EV của bạn',
            rent_desc: 'Tạo thu nhập dễ dàng, miễn thuế từ chỗ đỗ/điểm sạc của bạn. Đăng tin miễn phí và chỉ mất vài phút để bắt đầu.',
            rent_cta: 'Tìm hiểu cách kiếm tiền ngay',
            carpark_title: 'Quản lý bãi đỗ xe',
            carpark_desc: 'Tối đa hóa công suất bãi đỗ và tối ưu thanh toán với ứng dụng ưa thích.',
            carpark_cta: 'Tìm hiểu giải pháp',
            press_title: 'Báo chí nói về chúng tôi',
            footer_contact: 'LIÊN HỆ',
            footer_brand: 'Parkchung, nền tảng đặt chỗ đỗ xe trực tuyến',
            footer_intro: 'GIỚI THIỆU',
            footer_subscribe_text: 'Đăng ký nhận khuyến mãi',
            ph_email: 'Nhập email của bạn...',
            btn_signup: 'Đăng ký',
            footer_policies: 'CHÍNH SÁCH',
            pol_privacy: 'Chính sách bảo mật',
            pol_terms: 'Quy định dịch vụ',
            pol_incidents: 'Sự cố & Khiếu nại',
            pol_host: 'Trở thành Chủ bãi',
            footer_support: 'HỖ TRỢ',
            sup_booking: 'Hướng dẫn đặt chỗ',
            sup_listing: 'Hướng dẫn đăng bãi',
            sup_faq: 'Câu hỏi thường gặp',
            sup_blog: 'Blog',
            footer_copy: 'Bản quyền © 2025 thuộc Parkchung. Bảo lưu mọi quyền.',
            ph_location: 'Nhập địa điểm hoặc mã bưu chính',
            results_title: 'Chỗ đỗ xe khả dụng',
            results_desc: 'Chọn chỗ phù hợp và đặt trong vài giây.',
            no_results: 'Rất tiếc, không tìm thấy chỗ đỗ phù hợp với tiêu chí của bạn.',
            book_now: 'Đặt ngay',
            login_title: 'Đăng nhập tài khoản',
            register_title: 'Tạo tài khoản',
            email: 'Email',
            password: 'Mật khẩu',
            full_name: 'Họ và tên',
            phone: 'Số điện thoại',
            register: 'Đăng ký',
            no_account: 'Chưa có tài khoản?',
            register_here: 'Đăng ký tại đây',
            have_account: 'Đã có tài khoản?',
            login_here: 'Đăng nhập tại đây',
            my_bookings: 'Đặt chỗ của tôi',
            back_home: '← Về Trang chủ',
            loading: 'Đang tải danh sách đặt chỗ...',
            host_hero_title: 'Kiếm tiền với chỗ đỗ xe của bạn',
            host_hero_desc: 'Tham gia cộng đồng chủ bãi và biến chỗ đỗ trống thành thu nhập. Đơn giản, an toàn và miễn phí đăng tin.',
            host_benefit_price: 'Tự đặt giá',
            host_benefit_avail: 'Chủ động lịch trống',
            host_benefit_secure: 'Thanh toán an toàn, dễ dàng',
            host_form_title: 'Đăng tin chỗ đỗ',
            host_form_note: 'Tin sẽ được quản trị viên duyệt trước khi hiển thị.',
            address: 'Địa chỉ',
            get_location: 'Lấy vị trí',
            coords_hint: 'Chúng tôi sẽ cố gắng lấy tọa độ tự động. Bạn có thể chỉnh thủ công nếu cần.',
            longitude: 'Kinh độ',
            latitude: 'Vĩ độ',
            hourly_rate: 'Giá theo giờ (VND)',
            spot_image: 'Hình ảnh chỗ đỗ',
            click_upload: 'Nhấn để tải ảnh lên',
            no_file: 'Chưa chọn tệp',
            submit_review: 'Gửi duyệt',
            details_title: 'CHI TIẾT ĐẶT CHỖ',
            details_subtitle: 'Bạn sắp hoàn tất! Vui lòng điền vài thông tin để xác nhận.',
            details_section_title: 'Chi tiết đặt chỗ',
            arriving_on: 'Thời gian đến',
            leaving_on: 'Thời gian rời đi',
            ph_select_datetime: 'Chọn ngày/giờ',
            duration: 'Số giờ đặt chỗ',
            contact_title: 'Số điện thoại',
            contact_phone_label: 'Số Điện Thoại',
            contact_hint: 'Chúng tôi sẽ sử dụng thông tin này để liên hệ với bạn về đặt chỗ',
            vehicle_title: 'Thông Tin Phương Tiện',
            vehicle_reg_label: 'Biển Số Xe',
            vehicle_desc: 'Biển số xe của bạn sẽ được chia sẻ với đơn vị vận hành bãi đỗ',
            ph_vehicle_reg: 'Nhập biển số xe của bạn',
            payment_title: 'Thông Tin Thanh Toán',
            payment_desc: 'Tất cả thanh toán đều được mã hóa và bảo mật ở mức ngân hàng',
            payment_secure: 'Mã hóa SSL 256-bit',
            payment_methods: 'Chấp nhận tất cả thẻ chính',
            spot_loading: 'Đang tải địa chỉ...',
            unit_price: 'Đơn giá',
            parking_duration: 'Thời lượng đỗ',
            total_price: 'Tổng tiền',
            rechecked: 'Kiểm tra lại khả dụng lúc',
            time_to_complete: 'Thời gian hoàn tất đặt chỗ:',
            btn_pay_reserve: 'Thanh toán và giữ chỗ',
            trust_transparent_pricing: 'Giá minh bạch được hiển thị trước khi xác nhận',
            trust_verified_hosts: 'Chủ bãi đã xác minh & quy định rõ ràng',
            trust_flexible_payment: 'Tùy chọn thanh toán linh hoạt: trực tuyến (danh sách đủ điều kiện) hoặc tiền mặt khi đến',
            trust_free_cancel: 'Hủy miễn phí cho đặt chỗ đủ điều kiện — xem danh sách',
            trust_support: 'Hỗ trợ khách hàng nhanh chóng, đáng tin cậy khi bạn cần',
            trust_excellent: 'Xuất sắc',
            popup_title: 'Hoàn Tất Đặt Chỗ',
            popup_booking_summary: 'Tóm Tắt Đặt Chỗ',
            popup_from: 'Từ',
            popup_to: 'Đến',
            popup_contact_info: 'Thông Tin Liên Hệ',
            popup_contact_desc: 'Chúng tôi sẽ sử dụng thông tin này để xác nhận đặt chỗ của bạn',
            popup_fullname: 'Họ và Tên',
            popup_email: 'Địa Chỉ Email',
            popup_phone: 'Số Điện Thoại',
            popup_cancel: 'Hủy',
            popup_send: 'Hoàn Tất Đặt Chỗ',
            // Trang cấu hình đặt chỗ
            becomeHostRegister: 'Trở thành Chủ bãi / Đăng ký',
            config_title: 'Hoàn Tất Đặt Chỗ',
            config_subtitle: 'Chỉ cần vài thông tin nữa để xác nhận đặt chỗ của bạn.',
            contact_fullname_label: 'Họ và Tên',
            contact_email_label: 'Địa chỉ Email',
            ph_fullname: 'Nhập họ và tên của bạn',
            terms: 'Nhấn bên dưới nghĩa là bạn đã đọc và chấp nhận Điều khoản & Điều kiện',
            btn_reserve: 'Đặt Ngay',
            // Bộ lọc
            filter_title: 'Bộ lọc',
            filter_clear: 'Xóa tất cả',
            filter_vehicle_type: 'Loại phương tiện',
            filter_car: 'Ô tô',
            filter_motorbike: 'Xe máy',
            filter_bicycle: 'Xe đạp',
            filter_truck: 'Xe tải / Xe lớn',
            filter_booking_type: 'Loại đặt chỗ',
            filter_online: 'Đặt trực tuyến',
            filter_call: 'Đặt qua điện thoại',
            filter_payment: 'Phương thức thanh toán',
            filter_cash: 'Tiền mặt',
            filter_paypal: 'PayPal',
            // Trang chi tiết chỗ đỗ
            by_google_rating: 'Theo GoogleRating',
            spot_description: 'Mô tả',
            no_description: 'Không có mô tả cho chỗ đỗ xe này.',
            spot_location: 'Vị trí',
            view_on_maps: 'Xem trên Google Maps',
            pricing_capacity: 'Giá & Chỗ trống',
            hourly_rate_label: 'Giá theo giờ',
            vnd_per_hour: 'VND/giờ',
            monthly_rate_label: 'Giá theo tháng',
            not_available: 'Không khả dụng',
            available_slots: 'Chỗ trống',
            unknown: 'Không rõ',
            vehicle_types_accepted: 'Loại phương tiện được chấp nhận',
            accepted_payment_methods: 'Phương thức thanh toán được chấp nhận',
            services_title: 'Dịch vụ',
            no_services: 'Không có dịch vụ bổ sung',
            call_to_book: 'Gọi để đặt chỗ',
            // Nhãn phương thức thanh toán
            payment_method_title: 'Phương thức thanh toán',
            pay_securely_online: 'Thanh toán an toàn trực tuyến',
            cash_pay_later: 'Tiền mặt / Thanh toán sau',
            pay_at_spot: 'Thanh toán tại bãi đỗ',
            badge_instant: 'Ngay lập tức',
            badge_flexible: 'Linh hoạt'
        }
    };

    function renderNav() {
        const dict = t[currentLang] || t.en;
        const langSwitcher = `
            <span style="margin: 0 10px;">|</span>
            <button id="lang-en" style="background:none;border:none;color:${currentLang === 'en' ? '#13b47e' : '#555'};font-weight:${currentLang === 'en' ? '700' : '500'};cursor:pointer;">EN</button>
            <span style="color:#aaa;">/</span>
            <button id="lang-vi" style="background:none;border:none;color:${currentLang === 'vi' ? '#13b47e' : '#555'};font-weight:${currentLang === 'vi' ? '700' : '500'};cursor:pointer;">VI</button>
        `;

        if (userData) {
            nav.innerHTML = `
            <a href="${window.HOST_URL}/login" style="text-decoration: none; color: #13b47e; font-weight: 500;">${dict.becomeHost}</a>
            <a href="my-bookings.html" style="text-decoration: none; color: #13b47e; font-weight: 500; margin-left: 15px;">${dict.myBookings}</a>
            <a href="my-profile.html" style="text-decoration: none; color: #13b47e; font-weight: 500; margin-left: 15px;">My Profile</a>
            <span style="margin: 0 15px;">|</span>
            <span>${dict.welcome}, ${userData.fullName}!</span>
            <a href="#" id="logout-btn" style="margin-left: 15px; text-decoration: none; color: #e74c3c; font-weight: 500;">${dict.logout}</a>
            ${langSwitcher}
            `;
        } else {
            nav.innerHTML = `
            <a href="${window.HOST_URL}/login">${dict.becomeHost}</a>
            <a href="register.html">${dict.registerText}</a>
            <a href="login.html">${dict.login}</a>
            ${langSwitcher}
            `;
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            });
        }

        const langEnBtn = document.getElementById('lang-en');
        const langViBtn = document.getElementById('lang-vi');
        if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
        if (langViBtn) langViBtn.addEventListener('click', () => setLanguage('vi'));

        applyTranslations(dict);
        window.__applyI18n = () => applyTranslations(t[currentLang] || t.en);
    }

    function setLanguage(lang) {
        localStorage.setItem('lang', lang);
        currentLang = lang;
        renderNav();
    }

    function applyTranslations(dict) {
        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) el.setAttribute('placeholder', dict[key]);
        });
    }

    renderNav();
});