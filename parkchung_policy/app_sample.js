document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("header nav");
  const userData = JSON.parse(localStorage.getItem("userData"));
  let currentLang = localStorage.getItem("lang") || "en";

  const t = {
    en: {
      becomeHost: "Become a Host",
      becomeHostRegister: "Become a Host / Register",
      myBookings: "My Bookings",
      welcome: "Welcome",
      logout: "Logout",
      login: "Login",
      tagline: "Save time. Save money. Save Earth",
      nav_home: "Home",
      nav_available: "Available Spots",
      tab_hourly: "Hourly/Daily",
      tab_monthly: "Monthly",
      tab_airport: "Airport",
      label_park_at: "Park at",
      label_from: "From",
      label_until: "Until",
      btn_show_spaces: "Show parking spaces",
      why_title: "Why Parkchung",
      benefit_time_title: "Save Time",
      benefit_time_desc: "Book your parking spot in advance, no more endless searching.",
      benefit_price_title: "Transparent Pricing",
      benefit_price_desc: "Clear pricing, no surprises when you book.",
      benefit_safe_title: "Safe Parking",
      benefit_safe_desc: "Secure spots monitored with security systems.",
      locations_title: "Featured Locations",
      loc_airports: "Airports",
      loc_city: "City Centers",
      loc_homes: "Private Homes",
      rent_title: "Rent out your parking or EV charging space",
      rent_desc:
        "Make easy tax free money by renting out your parking or EV charging space. It‘s free to list and only takes a few minutes to get up and running.",
      rent_cta: "Learn how to earn today",
      carpark_title: "Car park management",
      carpark_desc: "Maximise yield from underused car parks and vacant land, or transform payments with the favourite parking app.",
      carpark_cta: "Learn about our solutions",
      press_title: "The press talks about us",
      press_badge: "PRESS MENTIONS",
      press_subtitle: "Global media highlight how Parkchung is shaping the future of shared mobility in Vietnam.",
      press_article1_source: "UNDP Vietnam · VietChallenge 2019",
      press_article1_title: "Congratulations to 12 startups officially advancing to the deep training phase of the Vietnam - Japan Incubation Program!",
      press_article2_source: "Startup VnExpress",
      press_article2_title: "PROJECT PARKCHUNG",
      press_article3_source: "Cafebiz",
      press_article3_title: "ANNOUNCING 12 STARTUPS - advancing to the deep training round -",
      press_read_article: "Read article",
      footer_contact: "CONTACT",
      footer_brand: "Parkchung, online parking platform",
      footer_intro: "INTRODUCTION",
      footer_subscribe_text: "Subscribe to receive promotions",
      ph_email: "Enter your email...",
      btn_signup: "Sign-up",
      footer_policies: "POLICIES",
      pol_privacy: "Privacy Policy",
      pol_terms_service: "Terms of Service",
      pol_insurance: "Insurance & Liability Policy",
      pol_dispute: "Dispute Resolution Policy",
      pol_security: "Security Policy",
      pol_driver: "Driver Terms & Booking Policies",
      pol_supplier: "Supplier Terms & Policies",
      pol_incidents: "Incidents & Complaints",
      pol_host: "Become a Host",
      terms_page_title: "Parkchung Terms of Service",
      terms_page_subtitle: "Please read these terms carefully before using our services.",
      terms_page_effective: "Effective: [*] / Last updated: 21/11/2025",
      terms_section1_title: "1. Definitions",
      terms_section1_intro: "Unless otherwise stated, the following terms have the meanings set out below:",
      terms_def_company: '<strong>"Company"</strong> means Parkchung (including its operating entity).',
      terms_def_service: '<strong>"Service"</strong> means the online marketplace operated by the Company that provides:',
      terms_def_service_item1: "collection, curation, and publication of parking information;",
      terms_def_service_item2: "online search and reservation of parking spaces; and",
      terms_def_service_item3: "online payment for certain parking spaces, via the website and any other channels designated by the Company.",
      terms_def_driver: '<strong>"Driver"</strong> means any person who searches for, reserves, and/or uses parking spaces through the Service.',
      terms_def_supplier: '<strong>"Supplier"</strong> means any person who lists or provides parking spaces through the Service.',
      terms_def_parking_info:
        '<strong>"Parking Information"</strong> means any information about parking spaces displayed on the Service (including name, address, contact details, fees, operating hours, photos, and usage conditions).',
      terms_def_info_only:
        '<strong>"Information-only Parking"</strong> means a parking space for which the Company only provides Parking Information, based on publicly available sources, and for which no reservation or payment function is provided on the Service.',
      terms_def_bookable:
        '<strong>"Bookable Parking"</strong> means a parking space for which the Supplier has agreed with the Company to enable the reservation function on the Service, allowing Drivers to place reservations online.',
      terms_def_online_payment:
        '<strong>"Online-Payment Parking"</strong> means Bookable Parking for which the Supplier has further agreed with the Company to enable the online payment function on the Service.',
      terms_def_transaction:
        '<strong>"Transaction Amount"</strong> means the total amount (including taxes and applicable fees) payable by a Driver for the use of a parking space reserved through the Service.',
      terms_def_margin:
        '<strong>"Margin"</strong> means the percentage or amount of the Transaction Amount agreed between the Company and the Supplier for each parking space, which the Company deducts when making or receiving payments to/from the Supplier as consideration for the Service.',
      terms_def_settlement:
        '<strong>"Settlement Date"</strong> means the date agreed between the Company and the Supplier on which amounts relating to transactions for the previous period are settled and paid in aggregate.',
      terms_section2_title: "2. Scope and Changes to the Terms",
      terms_section2_item1: "These Terms apply to all users of the Service, including Drivers and Suppliers.",
      terms_section2_item2:
        "The Company may amend these Terms as necessary. In case of material changes, the Company will provide notice in a reasonable manner (such as posting on the website or by email) before or at the time the changes take effect.",
      terms_section2_item3:
        "Unless otherwise specified, amended Terms take effect upon posting on the Company's website, subject to any mandatory provisions of Vietnamese law or other applicable laws.",
      terms_section3_title: "3. Nature of the Service and Role of the Company",
      terms_section3_item1: "The Service is an online marketplace with the following functions:",
      terms_section3_item1_sub1:
        "<strong>Information function:</strong> collecting, curating, and presenting Parking Information (including Information-only Parking) from various sources in an easy-to-browse format.",
      terms_section3_item1_sub2: "<strong>Reservation function:</strong> enabling Drivers to reserve Bookable Parking through the Service.",
      terms_section3_item1_sub3:
        "<strong>Online payment function:</strong> enabling Drivers to pay the Transaction Amount for Online-Payment Parking through the Service.",
      terms_section3_item2:
        "The Company is <strong>not</strong> an operator or bailee of any parking facilities and is <strong>not</strong> a party to any parking contracts between Drivers and Suppliers. For Information-only Parking, the Company only curates and displays information and does not provide reservation or payment services. For Bookable Parking, the Company merely facilitates the conclusion of parking contracts between Drivers and Suppliers.",
      terms_section3_item2_sub1:
        "For Information-only Parking, the Company only curates and displays information and does <strong>not</strong>provide reservation or payment services.",
      terms_section3_item2_sub2:
        "For Bookable Parking, the Company merely facilitates the conclusion of parking contracts between Drivers and Suppliers.",
      terms_section3_item3:
        "For Online-Payment Parking, where a Driver pays through the Service, the Company acts as a <strong>payment agent</strong> of the Supplier, receiving the Transaction Amount on behalf of the Supplier and remitting the net amount to the Supplier on the Settlement Date.",
      terms_section4_title: "4. Information-only Parking",
      terms_section4_item1:
        "The Company may collect and curate Parking Information for Information-only Parking from publicly accessible sources, including:",
      terms_section4_item1_sub1: "online map services;",
      terms_section4_item1_sub2: "websites, blogs, and other online publications of parking operators or third parties;",
      terms_section4_item1_sub3: "social media pages (e.g., business profiles, fan pages); and",
      terms_section4_item1_sub4: "information published by public bodies, media, or other open sources.",
      terms_section4_item2:
        "Even without any prior contract with the parking operator, the Company may, within the scope permitted by applicable laws and the relevant platform terms, compile and edit such publicly accessible information and display it on the Service as a parking information directory.",
      terms_section4_item3:
        "The Company endeavours to keep such information reasonably up to date; however, it does not warrant that the information is complete, accurate, or current.",
      terms_section4_item4:
        "Operators or other rightsholders of Information-only Parking may request corrections, updates, or removal of their Parking Information. The Company will respond within a reasonable scope and timeframe.",
      terms_section4_item5:
        "When a Driver uses Information-only Parking, any reservations, payments, and dispute resolution are handled directly between the Driver and the parking operator. The Company does not participate in such relationships and is not a party to such contracts.",
      terms_section5_title: "5. E-contract Formation and Pre-contract Information",
      terms_section5_item1:
        "Reservations and other offers/consents made through the Service are validly concluded by electronic means such as clicking buttons or similar actions. Contracts generated through automated systems are not invalid solely on that basis.",
      terms_section5_item2:
        "In accordance with Vietnamese e-commerce regulations (including Decree 52), the Company will display key contractual terms (such as fees, duration, cancellation and refund conditions, and penalties) before submission and provide mechanisms enabling users to review and correct their input.",
      terms_section6_title: "6. Accounts and KYC",
      terms_section6_item1: "Users must provide true, accurate, and up-to-date information when registering and must keep such information current.",
      terms_section6_item2:
        "Suppliers represent and warrant that they hold lawful title or authority (ownership, leasehold, management rights, etc.) and all necessary permits and registrations to provide the relevant parking spaces.",
      terms_section6_item3:
        "Suppliers agree to cooperate with the Company’s KYC (know-your-customer), anti-fraud, sanctions, and anti-money laundering checks as required under Vietnamese law.",
      terms_section7_title: "7. Bookings and Payment Methods",
      terms_section7_item1:
        "Drivers may search for Bookable Parking and submit reservation requests by entering desired dates/times, vehicle information, and other required details via the Service.Drivers may search for Bookable Parking and submit reservation requests by entering desired dates/times, vehicle information, and other required details via the Service.",
      terms_section7_item2: "Payment methods for Bookable Parking are as follows:",
      terms_section7_item2_sub1:
        "<strong>Pay at Location (cash or other direct payment):</strong> the Driver pays the Supplier directly at the parking facility on the day of use; and",
      terms_section7_item2_sub2:
        "<strong>Pay Online:</strong> only for Online-Payment Parking, the Driver pays the Transaction Amount through the Service using an e-wallet, card, bank transfer, or other methods enabled by the Company.",
      terms_section7_item3:
        "For each parking space, the booking flow will clearly indicate which payment methods are available (Pay at Location only, Pay Online only, or both).",
      terms_section7_item4:
        "Where Pay Online is selected, the Driver pays the full Transaction Amount to the Company through the Service. The Company receives the funds as payment agent of the Supplier and remits the net amount to the Supplier on the Settlement Date after deducting the Margin and any set-offs. The Driver's payment obligation to the Supplier is deemed discharged upon receipt of the funds by the Company.",
      terms_section7_item5:
        "Where Pay at Location is selected, the Driver pays the Supplier directly at the facility in accordance with the displayed conditions. The Company does not act as payment agent in respect of such payments and is not involved in the handling of cash. The settlement of the Margin between the Company and the Supplier is governed by Clause 9.",
      terms_section7_item6:
        "The Company may cancel or suspend online payments or reservations in accordance with its internal procedures in case of, among others, payment processor rejections.",
      terms_section8_title: "8. Cancellations, Refunds, and Overstay",
      terms_section8_item1:
        "Cancellation, refund, and overstay policies for Bookable Parking will be clearly displayed on each listing page and at checkout.",
      terms_section8_item2:
        "Unless otherwise required by law, no refund will be made for late cancellations or no-shows beyond the specified deadlines.",
      terms_section8_item3:
        "For online payments, any refunds will be processed by the Company in accordance with its prescribed methods and timelines. The timing of receipt may depend on the Driver’s payment method and the relevant payment processor.",
      terms_section8_item4:
        "In case of overstay, the Company may charge additional fees to the registered payment method in accordance with the rules displayed in the listing.",
      terms_section9_title: "9. Supplier Payouts, Settlements, and Set-off",
      terms_section9_sub1_title: "1. Online payments",
      terms_section9_1_item1:
        "For Online-Payment Parking, the Company will deduct the agreed Margin and any set-off items (including chargebacks, refunds, and penalties) from the Transaction Amount and remit the remaining funds to the Supplier in aggregate on the Settlement Date.",
      terms_section9_1_item2:
        "The Company is not liable for delays or failures in payment caused by incorrect bank details or other reasons attributable to the Supplier. Any additional costs for re-transfer shall be borne by the Supplier.",
      terms_section9_sub2_title: "2. Pay at Location (Supplier receives cash directly)",
      terms_section9_2_item1:
        "Where Drivers pay the Supplier directly at the facility, the Supplier must remit to the Company, on the Settlement Date, the aggregate Margin and any set-off items agreed between the Supplier and the Company for such transactions.",
      terms_section9_2_item2:
        "The Supplier shall submit sales reports for such transactions in the manner prescribed by the Company, and the Company may, within a reasonable scope, reconcile such reports with reservation data.",
      terms_section9_2_item3: "Each party is responsible for its own compliance with applicable tax, accounting, and e-invoicing rules.",
      terms_section10_title: "10. Prohibited Conduct",
      terms_section10_intro: "Users must not engage in any of the following when using the Service:",
      terms_section10_item1: "false or misleading registration or impersonation;",
      terms_section10_item2: "listing or accepting reservations for parking spaces without proper authority;",
      terms_section10_item3: "encouraging illegal or unauthorised parking;",
      terms_section10_item4: "bringing hazardous materials or otherwise compromising safety;",
      terms_section10_item5: "causing nuisance to neighbours (noise, littering, etc.);",
      terms_section10_item6: "damaging facilities, equipment, or other vehicles;",
      terms_section10_item7: "unauthorised access to or interference with the Service's systems or networks;",
      terms_section10_item8: "manipulating reviews or submitting fraudulent claims; or",
      terms_section10_item9:
        "any other conduct that violates applicable laws or the Company's policies, or that the Company reasonably deems inappropriate.",
      terms_section11_title: "11. Supplier Obligations",
      terms_section11_item1:
        "Suppliers must ensure that all information displayed about their parking spaces (fees, hours, restrictions, entrance/exit, conditions, cancellation/refund terms, etc.) is accurate and kept up to date.",
      terms_section11_item2:
        "Suppliers must ensure on-site safety and hygiene and comply with all applicable technical, traffic, fire, building, and other regulations.",
      terms_section11_item3:
        "Suppliers are liable for any losses arising from lack of lawful rights, inadequate safety measures, or illegal operation of their parking spaces.",
      terms_section12_title: "12. Driver Obligations",
      terms_section12_item1: "Drivers must comply with posted rules, usage conditions of parking spaces, and all applicable laws.",
      terms_section12_item2:
        "Drivers are liable for repair costs and other losses if they damage parking facilities or other vehicles due to intent or negligence.",
      terms_section12_item3:
        "Drivers are solely responsible for their vehicles and belongings; the Company is not liable for theft, loss, or damage to vehicles or their contents.",
      terms_section13_title: "13. Intellectual Property",
      terms_section13_item1:
        "All intellectual property rights related to the Service (including copyrights, trademarks, and database rights) belong to the Company or its licensors.",
      terms_section13_item2:
        "Users are granted a non-exclusive, non-transferable right to use the Service for its intended purposes only, and are prohibited from copying, modifying, distributing, or publicly transmitting any part of the Service unless expressly permitted by law.",
      terms_section14_title: "14. Personal Data and Privacy",
      terms_section14_item1: "The Company will handle users' personal data in accordance with its Privacy Policy.",
      terms_section14_item2:
        "Users may exercise their rights under Vietnamese personal data protection regulations (including access, correction, deletion, and withdrawal of consent) through the procedures specified in the Privacy Policy.",
      terms_section15_title: "15. Disclaimers and Limitation of Liability",
      terms_section15_item1:
        "The Service is provided on an “as is” basis without any express or implied warranties as to completeness, accuracy, fitness for a particular purpose, or uninterrupted availability.",
      terms_section15_item2:
        "The Company is not liable for any indirect, special, consequential, or incidental damages or loss of profits arising out of or in connection with the use or inability to use the Service.",
      terms_section15_item3:
        "To the extent liability of the Company is established, the total aggregate liability of the Company for a particular transaction shall be limited to the amount of the Margin actually received by the Company for that transaction.",
      terms_section15_item4:
        "This limitation does not apply to the extent that liability cannot be excluded or limited under applicable law, or in cases of the Company's wilful misconduct or gross negligence.",
      terms_section16_title: "16. Force Majeure",
      terms_section16_item1:
        '"Force Majeure" means events that are objective, unforeseeable, and unavoidable despite all necessary measures being taken (including natural disasters, war, riots, terrorism, fire, flood, epidemics, power outages, and government actions).',
      terms_section16_item2: "The Company is not liable for delays or failures in performing the Service to the extent caused by Force Majeure.",
      terms_section17_title: "17. Suspension and Termination",
      terms_section17_item1:
        "If the Company reasonably believes that a user has violated these Terms or has engaged in fraudulent or illegal conduct, the Company may, without prior notice, suspend or remove listings, cancel bookings, or disable the user’s account.",
      terms_section17_item2: "Nothing in this Clause shall prejudice any mandatory consumer rights under applicable consumer protection laws.",
      terms_section18_title: "18. Dispute Resolution",
      terms_section18_item1:
        "Complaints, inquiries, and disputes from users will first be handled through the Company’s internal dispute resolution process as set out in its Dispute Resolution Policy.",
      terms_section18_item2:
        "If not resolved internally, users may escalate matters to competent authorities, consumer protection bodies, alternative dispute resolution mechanisms, or ultimately to the courts.",
      terms_section18_item3: "Consumer users retain any mandatory venue rights granted under applicable consumer protection laws.",
      terms_section19_title: "19. Governing Law, Jurisdiction, and Language",
      terms_section19_item1: "These Terms are governed by the laws of the Socialist Republic of Vietnam, excluding conflict-of-law principles.",
      terms_section19_item2:
        "Any disputes arising out of or in connection with these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in Hanoi, Vietnam, without prejudice to any mandatory consumer venue rights.",
      terms_section19_item3:
        "These Terms are prepared in Japanese, English, and Vietnamese. In case of any inconsistency, the Vietnamese version shall prevail.",
      privacy_header_title: "Parkchung Privacy Policy",
      privacy_header_info: "Effective: [*] / Last updated: 21 November 2025",
      privacy_intro_1:
        "This Privacy Policy (\"Policy\") describes how Parkchung (\"Company\", \"we\", \"us\") collects and processes personal data in connection with the online marketplace services it operates (\"Service\").",
      privacy_intro_2: "Unless otherwise defined herein, capitalised terms have the meanings given in our Terms of Service.",
      privacy_section1_title: "1. Principles & Applicable Law",
      privacy_section1_item1:
        "We process personal data of users (including Drivers, Suppliers, and other users of the Service) in compliance with Vietnam's personal data protection regulations, including Decree 13/2023/ND-CP (\"PDPD\"), and other applicable laws and guidance.",
      privacy_section1_item2:
        "We follow core data protection principles such as purpose limitation, data minimisation, accuracy, storage limitation, security, and transparency, and we process data only to the extent necessary for operating the Service.",
      privacy_section2_title: "2. Data We Collect",
      privacy_section2_intro:
        "We may collect and process the following categories of data, limited to what is necessary for the stated purposes.",
      privacy_data1_title: "<strong>1. Account Data (primarily Drivers and Suppliers)</strong>",
      privacy_data1_item1: "Name, phone number, email address",
      privacy_data1_item2: "Login ID, password",
      privacy_data1_item3: "Language preferences, notification settings, and other account configurations",
      privacy_data2_title: "<strong>2. KYC and Payment Data (primarily Suppliers)</strong>",
      privacy_data2_item1: "ID information (name, address, date of birth, ID number, etc.)",
      privacy_data2_item2: "Bank account details and payment account information",
      privacy_data2_item3: "Documents evidencing rights to operate parking spaces (ownership, lease, management agreements, etc.)",
      privacy_data2_item4: "Information required for invoicing (company name, tax code, registered address, etc.)",
      privacy_data3_title: "<strong>3. Booking, Payment, and Settlement Data</strong>",
      privacy_data3_item1: "Booking ID, date/time, parking location, start/end time, vehicle details",
      privacy_data3_item2: "Online payment details: amounts, methods, statuses, refunds, chargebacks",
      privacy_data3_item3: "Reported cash/onsite sales for Pay-at-Location transactions, sales summaries and details used for Margin settlement with Suppliers",
      privacy_data4_title: "<strong>4. Technical and Log Data</strong>",
      privacy_data4_item1: "Device information, browser and OS details, IP address",
      privacy_data4_item2: "Access logs, error logs, and usage logs",
      privacy_data4_item3: "Identifiers and browsing data obtained through cookies, SDKs, pixels, and similar technologies",
      privacy_data5_title: "<strong>5. Support and Communication Data</strong>",
      privacy_data5_item1: "Contents of inquiries and support requests",
      privacy_data5_item2: "Records of complaints and dispute handling (summaries of calls, chats, emails, etc.)",
      privacy_data6_title: "<strong>6. Parking Information from Public Sources</strong>",
      privacy_data6_item1: "Publicly available parking information (name, address, phone number, website, opening hours, fees, etc.)",
      privacy_data6_item2:
        "Publicly available contact details of parking operators or contact persons (e.g., name, email, phone number as disclosed on business websites or social media profiles)",
      privacy_data6_item3: "To the extent such information relates to an identifiable individual, we treat it as personal data and process it in accordance with this Policy and the PDPD.",
      privacy_section3_title: "3. Legal Bases & Purposes",
      privacy_section3_intro: "1. We use personal data for the following purposes:",
      privacy_purpose1_title: "<strong>Service Operation</strong>",
      privacy_purpose1_item1: "Displaying parking information and providing search functionality",
      privacy_purpose1_item2: "Enabling online booking and sending booking confirmations",
      privacy_purpose1_item3: "Enabling online payment and performing monthly or periodic settlements",
      privacy_purpose1_item4: "Creating and managing user accounts and performing authentication",
      privacy_purpose2_title: "<strong>Supplier Payouts, Accounting, Tax, and Audit</strong>",
      privacy_purpose2_item1: "Settling Margins based on online and onsite (cash) transactions",
      privacy_purpose2_item2: "Maintaining records for bookkeeping, tax filings, and audits",
      privacy_purpose3_title: "<strong>Identity Verification, Fraud Prevention, and Security</strong>",
      privacy_purpose3_item1: "KYC and preventing impersonation",
      privacy_purpose3_item2: "Preventing payment fraud and handling chargebacks",
      privacy_purpose3_item3: "Monitoring systems, analysing access logs, and responding to incidents",
      privacy_purpose4_title: "<strong>Customer Support, Complaints, and Dispute Resolution</strong>",
      privacy_purpose4_item1: "Handling inquiries and troubleshooting",
      privacy_purpose4_item2: "Managing complaints and disputes in line with our Terms of Service and Dispute Resolution Policy",
      privacy_purpose5_title: "<strong>Service Improvement, Analytics, and Product Development</strong>",
      privacy_purpose5_item1: "Analysing usage patterns, improving UI/UX, and developing new features",
      privacy_purpose5_item2: "Primarily using anonymised or aggregated data; where personal data is used, we rely on an appropriate legal basis such as consent or legitimate interests, as permitted by law",
      privacy_purpose6_title: "<strong>Marketing, Advertising, and Measurement</strong>",
      privacy_purpose6_item1: "Sending information about our services, promotions, and campaigns",
      privacy_purpose6_item2: "Measuring advertising performance, attribution by channel, and anti-fraud measures",
      privacy_purpose6_item3: "Where required by law, we obtain prior consent and provide opt-out mechanisms",
      privacy_purpose7_title: "<strong>Legal Compliance and Protection of Rights</strong>",
      privacy_purpose7_item1: "Complying with legal and regulatory obligations and responding to lawful requests",
      privacy_purpose7_item2: "Protecting the rights, property, and safety of the Company, users, and third parties",
      privacy_section3_legal_bases: "2. The main legal bases on which we process personal data include:",
      privacy_legal_basis1: "Performance or preparation of contracts with Drivers and Suppliers (e.g., to provide the Service and handle bookings and settlements);",
      privacy_legal_basis2: "Users' consent, particularly for marketing, certain analytics, and cross-border transfers where required;",
      privacy_legal_basis3: "Compliance with legal obligations (e.g., tax, accounting, regulatory reporting);",
      privacy_legal_basis4: "Protection of vital interests of users or third parties;",
      privacy_legal_basis5: "The Company's legitimate interests, such as operating a safe and efficient marketplace, preventing fraud, and improving the Service, where such interests are balanced against users' rights and freedoms in accordance with the PDPD.",
      privacy_section4_title: "4. Sharing and Processors",
      privacy_section4_item1:
        "We may share or entrust personal data to third parties on a need-to-know basis under appropriate data processing agreements that include purpose limitation, security measures, sub-processor controls, and audit rights. These third parties include:",
      privacy_section4_item2: "<strong>1. Payment, Financial, and KYC Providers:</strong> payment processing, chargeback handling, identity verification;",
      privacy_section4_item3: "<strong>2. IT and Cloud Providers:</strong> system development and maintenance, hosting, backup, monitoring, logging, analytics;",
      privacy_section4_item4: "<strong>3. Marketing and Channel Partners:</strong> referrals and acquisition, joint campaigns, attribution and fraud detection, coordinated customer support;",
      privacy_section4_item5: "<strong>4. Professional Advisors and Authorities:</strong> lawyers, accountants, auditors, and public authorities where disclosure is required by law.",
      privacy_section5_title: "5. Cookies, SDKs, and Pixels",
      privacy_section5_item1:
        "We use cookies, SDKs, pixels, and similar technologies for convenience, fraud prevention, analytics, and advertising/measurement purposes.",
      privacy_section5_item2: "You may disable cookies through your browser or device settings; however, some features of the Service may not function properly if cookies are disabled.",
      privacy_section5_item3:
        "Where required by law, we will obtain consent for the use of such technologies and provide mechanisms for managing preferences and opting out.",
      privacy_section6_title: "6. Cross-Border Transfers",
      privacy_section6_item1:
        "We may transfer personal data to, or store and process personal data in, countries outside Vietnam, for example where our cloud providers or group entities are located.",
      privacy_section6_item2:
        "Where we conduct cross-border transfers, we will comply with the PDPD, including, as applicable:",
      privacy_section6_item2_sub1: "preparing and maintaining data transfer impact assessments;",
      privacy_section6_item2_sub2: "obtaining appropriate consents from data subjects; and",
      privacy_section6_item2_sub3: "implementing contractual safeguards with recipients to ensure adequate protection of personal data.",
      privacy_section7_title: "7. Retention",
      privacy_section7_item1:
        "We retain personal data only for as long as necessary to fulfil the purposes described above or as required by applicable laws (e.g., tax and accounting retention requirements).",
      privacy_section7_item2:
        "When personal data is no longer needed, we will delete or anonymise it using appropriate and secure methods.",
      privacy_section8_title: "8. Data Subject Rights",
      privacy_section8_intro: "1. Under the PDPD and other applicable laws, you may have the following rights:",
      privacy_section8_item1: "the right to be informed;",
      privacy_section8_item2: "the right of access;",
      privacy_section8_item3: "the right to rectification and update;",
      privacy_section8_item4: "the right to deletion;",
      privacy_section8_item5: "the right to restriction or suspension of processing (which we will implement, in principle, within 72 hours);",
      privacy_section8_item6: "the right to request provision or portability of data where applicable;",
      privacy_section8_item7: "the right to object to processing;",
      privacy_section8_item8: "the right to withdraw consent (without affecting the lawfulness of processing before the withdrawal);",
      privacy_section8_item9: "the right to complain, denounce, litigate, claim damages, and otherwise protect your legitimate rights and interests.",
      privacy_section8_note:
        "2. To exercise these rights, please contact us using the details in Clause 11. We will respond in accordance with applicable laws within a reasonable timeframe.",
      privacy_section9_title: "9. Children's Data",
      privacy_section9_item1:
        "Our Service is generally intended for adult users; however, where we process children's personal data, we will apply enhanced safeguards in accordance with the PDPD.",
      privacy_section9_item2:
        "Under Vietnamese law, for children aged 7 or older, processing personal data may require consent from both the child and their parent/guardian.",
      privacy_section10_title: "10. Security Measures",
      privacy_section10_intro: "We implement organisational, technical, and physical safeguards to protect personal data against unauthorised access, loss, destruction, alteration, or disclosure, including:",
      privacy_section10_item1: "access control based on the principle of least privilege;",
      privacy_section10_item2: "encryption of communications and databases where appropriate;",
      privacy_section10_item3: "logging and audit trails, vulnerability management;",
      privacy_section10_item4: "employee and contractor training and confidentiality obligations;",
      privacy_section10_item5: "incident reporting, remediation, and prevention procedures.",
      privacy_section11_title: "11. Data Protection Officer (DPO) / Contact",
      privacy_section11_item1:
        "We have appointed a Data Protection Officer (or equivalent responsible department) to oversee compliance with data protection laws.",
      privacy_section11_item2:
        "For any questions about this Policy or to exercise your rights, please contact:",
      privacy_section11_email: "Email: <strong>contact@parkchung.com</strong> (attn: DPO / Data Protection Team)",
      privacy_section12_title: "12. Changes & Language",
      privacy_section12_item1:
        "We may update this Policy from time to time. Material changes will be communicated in a reasonable manner, and, unless otherwise specified, will take effect upon posting on our website.",
      privacy_section12_item2:
        "This Policy is prepared in Japanese, English, and Vietnamese. In case of any discrepancy among versions, the Vietnamese version shall prevail.",
      privacy_section12_item3:
        "Nothing in this Policy limits any mandatory rights of users under Vietnamese consumer protection or data protection laws.",
      insurance_page_title: "Parkchung Insurance & Liability Policy",
      insurance_page_subtitle: "Information about insurance coverage and liability terms.",
      insurance_header_title: "Parkchung Insurance & Liability Policy",
      insurance_header_info: "Effective: [•] / Last Updated: 21 November 2025",
      insurance_intro_1:
        "This Insurance & Liability Policy (\"Policy\") sets out the basic allocation of risk and responsibilities in connection with the online marketplace operated by Parkchung (\"Company\", \"we\", \"us\").",
      insurance_intro_2: "Unless otherwise defined, capitalised terms have the meanings given in our Terms of Service (including Information-only Parking, Bookable Parking, Online-Payment Parking, Drivers, Suppliers, etc.).",
      insurance_section1_title: "1. Principles, No Bailment, and Role of the Company",
      insurance_section1_item1:
        "The Company operates an <strong>online marketplace</strong> that provides parking information, reservation functionality, and online payments. We are not a parking operator, manager, or bailee/custodian of vehicles.",
      insurance_section1_item2:
        "For <strong>Information-only Parking</strong>, we merely curate and display publicly available parking information. We are not a party to any parking contract; all contractual relations and responsibilities lie directly between the Driver and the parking operator.",
      insurance_section1_item3:
        "For <strong>Bookable Parking</strong> and <strong>Online-Payment Parking</strong>, we act only as an intermediary (and as payment agent for Online-Payment Parking) and do not assume custody or safekeeping obligations for vehicles or belongings.",
      insurance_section1_item4:
        "Except where expressly required by applicable law, the Company is not directly liable for accidents, theft, or damage relating to parking facilities, vehicles, or vehicle contents.",
      insurance_section2_title: "2. Driver Responsibilities",
      insurance_section2_item1:
        "Drivers are <strong>solely responsible</strong> for their vehicles and belongings. The risks of theft, damage, or loss while parked remain with the Driver, who should rely on their own motor insurance or other coverage as appropriate.",
      insurance_section2_item2:
        "If a Driver causes damage to third parties (other users, neighbours, etc.) in connection with parking, the Driver is responsible, at their own cost, for compensating such damage.",
      insurance_section2_item3:
        "Drivers must comply with applicable laws, posted rules and conditions at the parking facility, and any warnings or instructions displayed through the Service. Drivers must not bring hazardous materials, misuse fire, or otherwise compromise safety at or around the parking facility.",
      insurance_section3_title: "3. Supplier Responsibilities",
      insurance_section3_item1:
        "Suppliers represent and warrant that they have the lawful rights and authority (ownership, leasehold, management rights, etc.) and necessary permits/registrations to offer the relevant parking spaces via the Service.",
      insurance_section3_item2: "Suppliers must maintain their parking facilities in a <strong>safe condition</strong>, including:",
      insurance_section3_item2_sub1: "adequate lighting, markings, wheel stops, and entrance/exit signage;",
      insurance_section3_item2_sub2: "compliance with fire prevention and fighting regulations and other applicable building, planning, and traffic rules;",
      insurance_section3_item2_sub3: "adherence to relevant technical standards and codes under Vietnamese law.",
      insurance_section3_item3:
        "Suppliers are liable for losses suffered by Drivers or third parties arising from structural defects, equipment failures, insufficient signage, breaches of safety obligations, lack of lawful rights, or other acts/omissions within their control.",
      insurance_section3_item4:
        "For Information-only Parking, all responsibility for operation, safety, and legal compliance lies with the actual parking operator or rights holder; the Company does not assume responsibility for these matters.",
      insurance_section4_title: "4. Company Liability and Cap",
      insurance_section4_item1:
        "The Company will use reasonable efforts to operate the booking and payment systems securely, but does not warrant uninterrupted or error-free operation of the Service.",
      insurance_section4_item2:
        "The Company may assist in dispute resolution between users (e.g., Drivers and Suppliers) but is not a direct compensating party in such disputes.",
      insurance_section4_item3:
        "Where the Company's liability is established under applicable law, the maximum aggregate liability of the Company for any given transaction is limited to the amount of the commission (Margin) actually received by the Company for that transaction.",
      insurance_section4_item4:
        "This limitation does not apply to liabilities that cannot be excluded or limited under Vietnamese law, nor to losses caused by the Company's wilful misconduct or gross negligence.",
      insurance_section4_item5:
        "With respect to Information-only Parking, the Company's obligation is limited to reasonably reviewing and, where appropriate, correcting or removing clearly inaccurate or inappropriate information once notified.",
      insurance_section5_title: "5. Insurance",
      insurance_section5_item1:
        "At present, the Company does not provide any proprietary insurance products or compensation schemes (such as parking-specific insurance).",
      insurance_section5_item2:
        "Drivers are responsible for maintaining any mandatory motor insurance and reviewing any optional covers they deem appropriate.",
      insurance_section5_item3:
        "Suppliers are responsible for considering and arranging, at their own discretion and cost, appropriate insurance such as facility/public liability insurance, fire insurance, and other relevant policies.",
      insurance_section5_item4:
        "If, in the future, the Company or a partner insurer offers optional insurance products, the specific terms and conditions of such products will prevail over this Policy to the extent of any inconsistency.",
      insurance_section6_title: "6. Force Majeure",
      insurance_section6_item1:
        "\"Force Majeure\" means an event that occurs objectively, is unforeseeable, and cannot be prevented or remedied despite all necessary and reasonable measures being taken (including but not limited to natural disasters, floods, earthquakes, war, riots, terrorism, epidemics, power outages, large-scale network failures, and government actions).",
      insurance_section6_item2:
        "The Company is not liable for delays or failures in providing the Service to the extent caused by Force Majeure events.",
      insurance_section7_title: "7. Indemnities",
      insurance_section7_item1:
        "Drivers shall defend, indemnify, and hold harmless the Company from losses, costs, and claims (including legal fees) arising from the Driver's breach of this Policy or the Terms of Service, or from their wilful misconduct or negligence towards third parties (Suppliers, operators, other users, etc.), to the extent permitted by law.",
      insurance_section7_item2:
        "Suppliers shall likewise defend, indemnify, and hold harmless the Company from losses, costs, and claims arising from their lack of lawful rights, safety breaches, misrepresentations, or other breaches/faults in connection with their parking spaces.",
      insurance_section7_item3:
        "These indemnities apply only to the extent permitted by Vietnamese law and do not prejudice any mandatory consumer rights.",
      insurance_section8_title: "8. Incident Notice (Accidents, Theft, etc.)",
      insurance_section8_item1:
        "In case of accidents, theft, personal injury, or major equipment failures at a parking facility, users should first prioritize safety and, where appropriate, contact the police, emergency services, and/or their insurers.",
      insurance_section8_item2:
        "Users should then notify the Company of the incident as soon as reasonably practicable, preferably within 48 hours, and provide relevant information and evidence (photos, videos, documents, receipts, etc.) to support coordination.",
      insurance_section8_item3:
        "A delay in notification may affect the Company's or other parties' ability to investigate and respond, to the extent not prohibited by law, but such delay does not automatically extinguish any mandatory statutory rights of consumers.",
      insurance_section9_title: "9. Consumer Protection and Severability",
      insurance_section9_item1:
        "Nothing in this Policy overrides or limits any mandatory protections granted to consumers under Vietnamese consumer protection laws or other applicable mandatory rules.",
      insurance_section9_item2:
        "If any provision of this Policy is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.",
      insurance_section10_title: "10. Dispute Resolution",
      insurance_section10_content:
        "Complaints and disputes arising in connection with this Policy shall be handled in accordance with the Company's <strong>Dispute Resolution Policy</strong> and <strong>Terms of Service</strong> (internal resolution → competent authorities/consumer bodies/ADR → courts).",
      dispute_page_title: "Parkchung Dispute Resolution Policy",
      dispute_page_subtitle: "How we handle and resolve disputes between users.",
      dispute_header_title: "Parkchung Dispute Resolution Policy",
      dispute_header_info: "Effective: [•] / Last Updated: 21 November 2025",
      dispute_intro_1:
        "This Dispute Resolution Policy (\"Policy\") sets out how Parkchung (\"Company\", \"we\", \"us\") handles complaints and disputes relating to the online marketplace services it operates (\"Service\").",
      dispute_intro_2: "Unless otherwise defined, capitalised terms have the meanings given in our Terms of Service.",
      dispute_section1_title: "1. Principles",
      dispute_section1_item1:
        "The Company seeks to resolve complaints and disputes involving users (including Drivers and Suppliers) and/or the Company in a <strong>prompt, fair, and transparent</strong> manner.",
      dispute_section1_item2:
        "We prioritise amicable settlement through internal handling and negotiation. If that is not successful, parties may escalate to external bodies and, ultimately, to courts, in accordance with Vietnamese law.",
      dispute_section1_item3:
        "The Company will act in good faith and in accordance with applicable Vietnamese laws and guidance issued by competent authorities.",
      dispute_section2_title: "2. Scope of Complaints and Disputes",
      dispute_section2_item1: "This Policy applies to complaints and disputes including, without limitation:",
      dispute_section2_item1_sub1: "discrepancies between bookings and actual services provided (service levels, prices, etc.);",
      dispute_section2_item1_sub2: "issues relating to cancellations, refunds, and no-shows;",
      dispute_section2_item1_sub3: "disputes over charges, payments, and settlements;",
      dispute_section2_item1_sub4: "objections to incorrect or inappropriate information regarding Information-only Parking;",
      dispute_section2_item1_sub5: "any other complaints or disputes arising out of or in connection with the use of the Service.",
      dispute_section2_item2:
        "Substantive responsibilities regarding the operation, safety, and maintenance of parking facilities rest primarily with Suppliers or parking operators. The Company's role is to support dispute resolution as an intermediary, in line with our Insurance & Liability Policy.",
      dispute_section3_title: "3. Filing and Acknowledgment of Complaints",
      dispute_section3_item1: "Complaints, objections, and related inquiries should be submitted to:",
      dispute_section3_item1_email: "Email: contact@parkchung.com",
      dispute_section3_item2:
        "The Company will acknowledge receipt of a complaint within 3 working days of receipt, in principle.",
      dispute_section3_item3:
        "The Company will commence review and negotiation within 7 working days of receipt and will endeavour to provide a substantive response or interim update within a reasonable period, depending on the complexity of the matter.",
      dispute_section4_title: "4. Resolution Steps",
      dispute_section4_intro:
        "For the purposes of investigation and resolution, the Company may request additional information, including booking IDs, payment details, photos/videos, and records of communications between the parties.",
      dispute_section4_stage1_title: "<strong>Stage 1 – Internal Handling</strong>",
      dispute_section4_stage1_item1:
        "The Company will review the facts, gather information from the Driver, Supplier, and/or other relevant parties, and assess the situation.",
      dispute_section4_stage1_item2:
        "Based on this review, the Company will endeavour to propose a <strong>solution</strong> within a reasonable timeframe, which may include refunds, re-performance, discounts, correction of information, or other remedial measures, as appropriate.",
      dispute_section4_stage2_title: "<strong>Stage 2 – External Authorities and Institutions</strong>",
      dispute_section4_stage2_item1:
        "If the dispute cannot be resolved internally, the parties may refer the matter to Vietnamese consumer protection authorities, recognised mediation bodies, or arbitration institutions in Vietnam.",
      dispute_section4_stage2_item2:
        "The Company will cooperate with such authorities and institutions in accordance with applicable law.",
      dispute_section4_stage3_title: "<strong>Stage 3 – Courts</strong>",
      dispute_section4_stage3_item1:
        "Ultimately, disputes may be brought before competent Vietnamese courts for final resolution.",
      dispute_section4_stage3_item2:
        "The Company and users may seek judicial remedies where they deem it necessary and appropriate.",
      dispute_section5_title: "5. Arbitration and Consumer Rights",
      dispute_section5_item1:
        "In consumer disputes, the use of arbitration requires the explicit consent of the consumer, as required under Vietnamese law.",
      dispute_section5_item2:
        "Even where an arbitration agreement exists, consumers may retain the right to access courts to the extent mandated by mandatory Vietnamese law.",
      dispute_section5_item3:
        "The mode of mediation or arbitration (in person, online, or hybrid) will follow applicable laws and the rules of the relevant institutions.",
      dispute_section6_title: "6. Governing Law and Jurisdiction",
      dispute_section6_item1:
        "This Policy and the dispute resolution procedures set out herein are governed by the laws of Vietnam.",
      dispute_section6_item2:
        "As a general principle, disputes are subject to the jurisdiction of the courts of <strong>Hanoi</strong>, where the Company is based.",
      dispute_section6_item3:
        "This is without prejudice to any mandatory venue rights granted to consumers under Vietnamese consumer protection or other mandatory laws.",
      dispute_section7_title: "7. Role of the Company and Relationship to Other Policies",
      dispute_section7_item1:
        "The Company's role under this Policy is to facilitate and support dispute resolution as an intermediary. Participation in investigations, negotiations, mediation, or arbitration does <strong>not</strong> in itself create additional contractual obligations or liabilities for the Company beyond those set out in the <strong>Terms of Service</strong> and <strong>Insurance & Liability Policy</strong>.",
      dispute_section7_item2:
        "This Policy does not expand or modify the Company's liability limits or allocation of risk as defined in the <strong>Terms of Service</strong> and <strong>Insurance & Liability Policy</strong> and must be interpreted together with those documents.",
      dispute_section8_title: "8. Changes and Language",
      dispute_section8_item1:
        "The Company may amend this Policy from time to time. Material changes will be communicated in a reasonable manner and, unless stated otherwise, will take effect upon posting on our website.",
      dispute_section8_item2:
        "This Policy is prepared in Japanese, English, and Vietnamese. In case of any inconsistency among the language versions, the <strong>Vietnamese</strong> version shall prevail.",
      dispute_section8_item3:
        "Nothing in this Policy limits or prejudices any mandatory rights available to users under Vietnamese consumer protection or data protection laws.",
      security_page_title: "Parkchung Security Policy",
      security_page_subtitle: "Our commitment to information security and data protection.",
      security_header_title: "Parkchung Security Policy",
      security_header_info: "Effective: [•] / Last Updated: 21 November 2025",
      security_intro_1:
        "This Security Policy (\"Policy\") describes how Parkchung (\"Company\", \"we\", \"us\") protects its information assets, systems, and services in connection with the online marketplace it operates (\"Service\").",
      security_intro_2:
        "The specific handling of personal data is governed by our <strong>Privacy Policy</strong>; this Policy focuses on the technical and organisational security measures that support those practices.",
      security_section1_title: "1. Purpose, Scope, and Legal Framework",
      security_section1_item1:
        "The purpose of this Policy is to protect the Company's information assets and the Service against unauthorised access, disclosure, alteration, and destruction, and to operate securely and continuously in line with Vietnamese law and recognised industry practices.",
      security_section1_item2:
        "This Policy applies to all individuals involved in operating or supporting the Service, including officers, employees, interns, contractors, and suppliers (\"Personnel\").",
      security_section1_item3: "In implementing security measures, we take into account, among others:",
      security_section1_item3_sub1: "Vietnam's data protection regulations, including Decree 13/2023 (PDPD);",
      security_section1_item3_sub2: "the Law on Cyberinformation Security, the Law on Cybersecurity, and related decrees (e.g., Decree 53/2022);",
      security_section1_item3_sub3: "internationally recognised security standards and practices (e.g., ISO/IEC 27001/27002, OWASP).",
      security_section2_title: "2. Governance and Roles",
      security_section2_item1:
        "The Company appoints an <strong>Information Security Lead</strong> (CISO-equivalent) responsible for overall security governance, implementation of this Policy, and oversight of major incidents.",
      security_section2_item2:
        "A <strong>Data Protection Officer (DPO)</strong> or equivalent unit is responsible for PDPD-related matters such as data subject rights, cross-border transfer procedures, and regulatory notifications.",
      security_section2_item3:
        "Department heads are responsible for managing access rights, overseeing third-party arrangements, and ensuring training within their areas.",
      security_section2_item4:
        "All Personnel must comply with this Policy and related procedures, maintain confidentiality, and complete at least <strong>annual security and privacy training</strong>.",
      security_section3_title: "3. Compliance with Laws and Standards",
      security_section3_item1:
        "In the event of a personal data breach, the Company will comply with PDPD requirements, including <strong>72-hour notification</strong> to relevant authorities (such as MPS/A05) and, where required, notifications to affected data subjects.",
      security_section3_item2:
        "The Company follows the principles of prompt, accurate, and coordinated incident handling under the Law on Cyberinformation Security and relevant guidance.",
      security_section3_item3:
        "Where cross-border transfers of personal data occur, the Company will prepare and maintain <strong>data transfer impact assessments</strong> and conduct necessary filings with the Ministry of Public Security, as required by PDPD, together with appropriate contractual safeguards.",
      security_section3_item4:
        "If, in the future, the Company becomes subject to data localisation or local presence requirements under the Law on Cybersecurity and related decrees, it will assess and comply with such requirements, including implementing necessary technical and organisational measures.",
      security_section4_title: "4. Risk Management and ISMS",
      security_section4_item1:
        "The Company conducts at least annual risk assessments of its information assets, maintains an asset inventory, and classifies assets by criticality (confidentiality, integrity, availability).",
      security_section4_item2:
        "The Company maintains a security management framework aligned with standards such as ISO/IEC 27001/27002, including policies, procedures, and records, and reviews them regularly.",
      security_section4_item3:
        "Significant risks and incidents are escalated to senior management, with appropriate corrective actions and investment decisions taken as needed.",
      security_section5_title: "5. Access Management",
      security_section5_item1:
        "Access to systems and data is granted on a least-privilege basis, with appropriate separation of duties.",
      security_section5_item2:
        "Multi-factor authentication (MFA) is required for administrative access and for remote management or other sensitive operations, as appropriate.",
      security_section5_item3:
        "User accounts are managed throughout their lifecycle (onboarding, role changes, offboarding), with quarterly reviews of access rights.",
      security_section5_item4:
        "Privileged operations and critical configuration changes are logged, with tamper-resistant storage of audit logs for a defined retention period.",
      security_section6_title: "6. Encryption and Confidential Information",
      security_section6_item1:
        "Data in transit is protected using TLS 1.2 or higher (preferably TLS 1.3), and sensitive information such as passwords and payment-related data is further protected through hashing or encryption.",
      security_section6_item2:
        "Data at rest is encrypted using AES-256 or comparable industry-standard algorithms, or equivalent protective measures.",
      security_section6_item3:
        "Cryptographic keys and certificates are managed separately (e.g., via cloud key management services), with defined rotation and revocation procedures.",
      security_section6_item4:
        "The Company does not store payment card numbers directly and instead relies on <strong>PCI DSS-compliant payment processors</strong> for card transactions.",
      security_section7_title: "7. Secure Development and Cloud Security",
      security_section7_item1:
        "Security is integrated into the software development lifecycle (SSDLC), with security reviews conducted at key stages (requirements, design, implementation, testing, release).",
      security_section7_item2:
        "The Company manages risks associated with open-source and third-party components through software composition analysis (SCA) and uses static and dynamic analysis (SAST/DAST) as appropriate.",
      security_section7_item3:
        "Web applications are designed in line with OWASP Top 10/ASVS guidelines, and the Company aims to perform at least <strong>annual penetration testing</strong> of critical services.",
      security_section7_item4:
        "In cloud environments, the Company applies best-practice configurations, including network segmentation, use of WAF and IDS/IPS, default encryption of storage, and prohibition of unnecessary public exposure (e.g., open buckets).",
      security_section7_item5:
        "Infrastructure configurations are managed as code (IaC) where feasible, with version control and change tracking.",
      security_section8_title: "8. Logging, Monitoring, and Vulnerability Management",
      security_section8_item1:
        "The Company collects and monitors access, activity, and error logs in a centralised manner, with the goal of detecting abnormal or suspicious behaviour.",
      security_section8_item2:
        "Logs are stored with appropriate protections against unauthorised access and tampering and are retained for periods required by law and business needs.",
      security_section8_item3:
        "The Company monitors vulnerability advisories for operating systems, middleware, and applications, and applies patches according to defined <strong>service level agreements (SLAs)</strong> (e.g., Critical vulnerabilities within 7 days, High vulnerabilities within 14 days), with risk-acceptance processes for exceptions.",
      security_section8_item4:
        "Rollback and emergency fix procedures are in place for updates that may impact service stability.",
      security_section9_title: "9. Third-Party and Supplier Management",
      security_section9_item1:
        "When selecting suppliers or processors that handle personal data or critical information, the Company evaluates their security and data protection practices.",
      security_section9_item2:
        "The Company enters into data protection and security clauses (e.g., DPAs) with processors, addressing purpose limitation, confidentiality, security measures, sub-processor controls, and prompt breach notification obligations.",
      security_section9_item3:
        "Processors must promptly notify the Company of any personal data breach or other security incident to enable the Company to meet its 72-hour reporting obligations where applicable.",
      security_section9_item4:
        "Where cross-border transfers are involved, both the Company and its processors must comply with PDPD requirements, including impact assessments, filings, and contractual safeguards.",
      security_section10_title: "10. Incident Response",
      security_section10_item1:
        "The Company maintains documented incident response procedures covering prepare-detect-contain-eradicate-recover-lessons learned, and ensures relevant Personnel are familiar with them.",
      security_section10_item2:
        "Severity levels for incidents are defined, and for major incidents, initial response (including scoping and containment) is initiated within one business day where practicable.",
      security_section10_item3:
        "For incidents involving personal data, the Company will notify competent authorities and, where required, affected users in accordance with PDPD and other applicable laws.",
      security_section10_item4:
        "Incident handling is documented, and root-cause analysis and corrective actions are implemented to prevent recurrence.",
      security_section11_title: "11. Business Continuity and Disaster Recovery",
      security_section11_item1:
        "For critical systems, the Company defines recovery time objectives (RTOs) and recovery point objectives (RPOs), and performs regular backups and at least annual restore tests.",
      security_section11_item2:
        "Cloud infrastructure is designed with redundancy (e.g., across availability zones) to reduce the impact of failures.",
      security_section11_item3:
        "The Company maintains business continuity plans (BCP) that define priorities and procedures for maintaining or restoring essential services in the event of major disruptions.",
      security_section12_title: "12. Physical and Office Security",
      security_section12_item1:
        "The Company relies on the physical security and certifications of its cloud service providers' data centres.",
      security_section12_item2:
        "For offices and other physical locations under the Company's control, appropriate measures such as access control, visitor registration, and secure storage and disposal of documents and media are implemented.",
      security_section13_title: "13. Personnel Security",
      security_section13_item1:
        "Subject to applicable law, the Company may carry out appropriate pre-employment checks and requires employees and contractors to enter into confidentiality agreements (NDAs) upon joining.",
      security_section13_item2:
        "Personnel receive at least annual security and privacy training, and violations may result in disciplinary measures in accordance with internal rules and contracts.",
      security_section13_item3:
        "Access rights are limited to what is necessary for each role, and accounts are promptly disabled and privileges revoked upon termination or contract end.",
      security_section14_title: "14. Data Minimisation, Retention, and Deletion",
      security_section14_item1:
        "The Company collects and processes personal data only to the extent necessary for specified purposes and avoids unnecessary collection or retention (data minimisation).",
      security_section14_item2:
        "Retention periods and deletion procedures are defined in line with the Privacy Policy and applicable laws; when data is no longer needed, it is securely deleted or anonymised.",
      security_section14_item3:
        "Requests from data subjects (e.g., access, correction, deletion, restriction) are handled in accordance with the procedures set out in the Privacy Policy and the PDPD.",
      security_section15_title: "15. Vulnerability Disclosure and Safe Harbor",
      security_section15_item1:
        "The Company welcomes good-faith vulnerability reports from security researchers and users and aims to provide a reasonable safe-harbor approach for such reports.",
      security_section15_item2:
        "However, activities that violate law or our Terms of Service—such as unauthorised access, data exfiltration, data destruction, or service disruption—are not permitted.",
      security_section15_item3: "Vulnerabilities can be reported to:",
      security_section15_item3_email: "Email: <strong>contact@parkchung.com</strong> (please include \"Security\" or \"Vulnerability\" in the subject line).",
      security_section15_item3_note: "Where needed, the Company can receive encrypted reports for sensitive information.",
      security_section16_title: "16. Review and Updates",
      security_section16_item1:
        "The Company reviews this Policy at least annually and whenever there are material changes in law, technology, or business operations, and updates it as necessary.",
      security_section16_item2:
        "The latest version of this Policy is published on the Company's website and generally becomes effective upon posting, unless otherwise stated.",
      security_section16_item3:
        "In case of any inconsistency between this Policy and other Company policies, the <strong>Privacy Policy</strong> governs the processing of personal data, while the <strong>Terms of Service</strong> and <strong>Insurance & Liability Policy</strong> govern allocation and limitation of liability and dispute resolution.",
      driver_page_title: "Parkchung Driver Terms & Booking Policies",
      driver_page_subtitle: "Terms and policies for drivers using our parking booking services.",
      driver_header_title: "Parkchung Driver Terms & Booking Policies",
      driver_header_info: "Effective: [•] / Last Updated: 21 November 2025",
      driver_intro_1:
        "This document complements the Parkchung Terms of Service, Insurance & Liability Policy, Privacy Policy, Dispute Resolution Policy, and Security Policy.",
      driver_intro_2:
        "Capitalised terms (Company, Service, Driver, Supplier, Transaction Amount, Margin, Settlement Date, etc.) have the meanings given in the Terms of Service.",
      driver_sectionA_title: "A. Driver Terms (General) v2.1",
      driver_section1_title: "1. Scope & Acceptance",
      driver_section1_item1:
        'These terms apply to individuals ("Drivers") who use Parkchung ("Company") to view information, place bookings, and use parking spaces via our online marketplace ("Service").',
      driver_section1_item2:
        "By clicking to accept online, you enter into an electronic contract and agree to be bound by these terms and related policies. The contract is not denied validity solely due to its electronic form.",
      driver_section1_item3:
        "Material updates will be communicated in a reasonable manner and generally take effect upon posting, without prejudice to any mandatory consumer protections under Vietnamese law.",
      driver_section2_title: "2. Types of Parking & Role of Parkchung",
      driver_section2_item1: "Parking spaces on the Service are broadly categorised as follows:",
      driver_section2_item1a:
        "<strong>Information-only Parking:</strong> Parkchung publishes information (name, address, contact details, etc.) based on publicly available sources (e.g., Google Maps, websites, Facebook) or information provided by Suppliers. No booking or payment is processed through Parkchung.",
      driver_section2_item1b:
        "<strong>Bookable - Pay at Location / Pay Later Parking:</strong> The Driver places a booking through Parkchung and pays the Transaction Amount directly to the Supplier on-site.",
      driver_section2_item1c:
        "<strong>Bookable - Online Payment (Pay Now) Parking:</strong> The Driver places a booking through Parkchung and prepays all or part of the Transaction Amount online to the Company. The Company acts as Payment Agent (as defined in the Terms of Service), receives the Transaction Amount, and remits the Supplier's share on the Settlement Date.",
      driver_section2_item2:
        "For each listing, the applicable category and available payment methods (Pay at Location / Pay Later and/or Pay Now) are clearly disclosed on the listing page and at checkout.",
      driver_section2_item3:
        "Parkchung operates solely as an intermediary platform and is not a parking facility operator or bailee/custodian. Primary responsibility for the operation, safety, and condition of parking facilities lies with Suppliers or facility operators (as further described in the <strong>Insurance & Liability Policy</strong>).",
      driver_section2_item4:
        "If a Driver contacts and transacts with a Supplier directly based on information displayed on Parkchung, such dealings occur outside Parkchung's booking and payment flows. Parkchung is not a contracting party to those transactions and does not handle the related payments.",
      driver_section3_title: "3. Bookings & Payment Methods",
      driver_section3_item1:
        "For Bookable parking (2.1.2 and 2.1.3), Drivers may choose between Pay at Location / Pay Later and Pay Now, to the extent supported by the relevant listing.",
      driver_section3_item2:
        "Under Pay at Location / Pay Later, the Driver pays the full Transaction Amount directly to the Supplier on-site. Parkchung does not receive the Transaction Amount; instead, the Supplier deducts the agreed Margin and remits it to Parkchung on the Settlement Date in accordance with the Terms of Service.",
      driver_section3_item3:
        "Under Pay Now, the Driver prepays all or part of the Transaction Amount to Parkchung through the Service. Parkchung, acting as Payment Agent, receives the Transaction Amount and remits the Supplier's share on the Settlement Date. Cancellation, refund, and chargeback rules for Pay Now bookings are set out in Clause 7 and the Drivers' Cancellation & Refund Policy.",
      driver_section4_title: "4. Availability & Use Conditions",
      driver_section4_item1:
        "Bookable days/hours, minimum booking units, access restrictions, vehicle limits (height, width, etc.), and other conditions are set by each Supplier and disclosed in the listing and on the checkout page before you submit a booking.",
      driver_section4_item2:
        "Parkchung provides a pre-contract confirmation step, allowing you to review and correct your inputs before final submission, in line with Vietnam's e-commerce regulations.",
      driver_section5_title: "5. Entry & Exit",
      driver_section5_item1:
        "You may enter the parking space on or after the booking start time and must vacate the space by the end time.",
      driver_section5_item2:
        "The specific entry/exit method (staffed gate, automated barrier, QR code, etc.) is determined by the listing conditions and the Supplier's instructions.",
      driver_section6_title: "6. Extensions & Overstay",
      driver_section6_item1:
        "Rules on staying beyond the original booking period are set out in the <strong>Drivers' Extension & Overstay Policy</strong>.",
      driver_section6_item2:
        "Parkchung may or may not provide an online extension function (e.g., an in-app extension button). Where such function is not available, you must consult the Supplier directly on-site to request any extension.",
      driver_section7_title: "7. Cancellations, Refunds & No-shows",
      driver_section7_item1:
        "Cancellations, refunds, and no-shows are governed by the <strong>Drivers' Cancellation & Refund Policy</strong>.",
      driver_section7_item2:
        "For <strong>Pay at Location / Pay Later</strong> bookings, if you cancel after the free cancellation period stated in the listing or fail to show up, you are <strong>contractually obliged</strong> to pay the applicable cancellation fee specified in the listing to the Company, except to the extent prohibited or restricted by Vietnamese consumer protection or other mandatory laws.",
      driver_section7_item3:
        "Due to technical and practical constraints, the Company may not immediately or automatically collect such cancellation fees for Pay at Location / Pay Later bookings. This <strong>does not extinguish your payment obligation</strong>. The Company may pursue reasonable measures for unpaid cancellation fees, including payment requests, limiting future bookings, restricting you to Pay Now bookings only, or suspending your account.",
      driver_section8_title: "8. Prohibited Conduct",
      driver_section8_content:
        "<strong>Unauthorized occupation or blocking of access</strong>, bringing hazardous materials, nuisance, damage to property, review manipulation, system abuse, or any unlawful or abusive conduct in breach of these terms, listing conditions, or applicable law is prohibited.",
      driver_section9_title: "9. Damages & Liability",
      driver_section9_item1:
        "Parkchung is a platform provider and is not a direct compensating party for damage to parking facilities, vehicles, or belongings. Primary liability rests with Drivers or Suppliers, as described in the <strong>Insurance & Liability Policy</strong>.",
      driver_section9_item2:
        "To the extent Parkchung is held liable to a Driver under Vietnamese law, Parkchung's total liability for a booking is capped at the Margin (commission) actually received by Parkchung for that booking, except where such cap cannot be applied under mandatory law or for losses caused by Parkchung's wilful misconduct or gross negligence.",
      driver_section10_title: "10. Privacy",
      driver_section10_content:
        "<strong>Personal data</strong> is processed in accordance with the <strong>Parkchung Privacy Policy</strong> (PDPD-compliant).",
      driver_section11_title: "11. Complaints & Disputes",
      driver_section11_item1: "Complaints and inquiries may be submitted to: contact@parkchung.com.",
      driver_section11_item2:
        "The dispute resolution process follows the <strong>Dispute Resolution Policy</strong> (internal handling → competent authorities/ADR → courts), without prejudice to mandatory consumer rights.",
      driver_section12_title: "12. Governing Law & Language",
      driver_section12_content:
        "These terms are governed by Vietnamese law. In case of discrepancies between language versions, the Vietnamese version prevails.",
      driver_sectionB_title: "B. Drivers' Extension & Overstay Policy v2.0",
      driver_extension_section1_title: "1. Scope",
      driver_extension_section1_content:
        "This Policy applies to all bookings made via Parkchung with a defined start and end time, regardless of payment method (Pay at Location / Pay Later or Pay Now).",
      driver_extension_section2_title: "2. Extension Requests",
      driver_extension_section2_item1:
        "Parkchung may not provide an online extension function (e.g., in-app extension button) for certain listings or at certain times. Where no such function is provided, you must contact the Supplier directly on-site if you wish to stay beyond your original end time.",
      driver_extension_section2_item2:
        "If Parkchung provides an online extension function for a listing, the procedures, unit increments, and fees shown on the Service for that listing will prevail, and this Policy may be updated accordingly.",
      driver_extension_section3_title: "3. Extension Approval & Fees",
      driver_extension_section3_item1:
        "Whether an extension is allowed, and on what terms, is decided by the Supplier based on space availability, operational policies, and other relevant circumstances. Parkchung does not guarantee that any extension request will be approved or that a specific fee level will apply.",
      driver_extension_section3_item2:
        "For <strong>Pay at Location / Pay Later</strong> bookings, if an extension is approved, the extension fee is generally paid directly by the Driver to the Supplier on-site, in addition to the original Transaction Amount.",
      driver_extension_section3_item3:
        "For <strong>Pay Now</strong> bookings, any approved extension fees must be paid via Parkchung's online payment function as an additional charge. The applicable method and timing of such charges (e.g., immediate charge or post-use consolidated charge) are disclosed in the listing and at checkout.",
      driver_extension_section4_title: "4. Overstay (Unauthorized Extension)",
      driver_extension_section4_item1:
        "Remaining in the parking space beyond the booking end time without the Supplier's consent constitutes overstay (unauthorized extension).",
      driver_extension_section4_item2:
        "In case of overstay, the Supplier may take measures in accordance with posted rules and applicable law, including charging additional fees, arranging vehicle relocation, or refusing future use. Such costs and losses are borne by the Driver.",
      driver_extension_section4_item3:
        "Parkchung may suspend or restrict accounts that repeatedly overstay or otherwise misuse the Service.",
      driver_extension_section5_title: "5. System Issues & Force Majeure",
      driver_extension_section5_item1:
        "If system failures, connectivity issues, or other force majeure events affect your ability to process an extension or exit on time, you should contact the Supplier and Parkchung support as soon as reasonably possible and follow any reasonable workaround procedures instructed.",
      driver_extension_section5_item2:
        "The definition of force majeure and Parkchung's liability limits follow the Terms of Service and the Insurance & Liability Policy.",
      driver_sectionC_title: "C. Drivers' Cancellation & Refund Policy v2.1",
      driver_cancellation_section1_title: "1. Scope & Basic Principles",
      driver_cancellation_section1_item1:
        "This Policy governs cancellations, refunds, and no-shows for parking bookings made via Parkchung.",
      driver_cancellation_section1_item2:
        "The mechanisms differ between <strong>Pay at Location / Pay Later</strong> and <strong>Pay Now</strong> bookings. The applicable payment method and conditions for each booking are shown on the listing and at checkout.",
      driver_cancellation_section2_title: "2. Pay at Location / Pay Later Bookings - Cancellations & No-shows",
      driver_cancellation_section2_item1:
        "For <strong>Pay at Location / Pay Later</strong> bookings, Parkchung does not receive the Transaction Amount at the time of booking, so there is generally no 'refund' processed by Parkchung itself.",
      driver_cancellation_section2_item2:
        "Each listing may specify a <strong>free cancellation period</strong> and a <strong>cancellation fee</strong> applicable after that period. These terms are disclosed on the listing page and at checkout.",
      driver_cancellation_section2_item3:
        "If you cancel <strong>within</strong> the free cancellation period, you will normally have no payment obligation for that booking (unless you separately agree otherwise with the Supplier on-site).",
      driver_cancellation_section2_item4:
        "If you cancel <strong>after</strong> the free cancellation period or if you are a <strong>no-show</strong>, you are <strong>contractually obliged</strong> to pay the cancellation fee specified in the listing to the Company, except to the extent prohibited or restricted by Vietnamese consumer protection or other mandatory laws.",
      driver_cancellation_section2_item5:
        "Due to technical and practical constraints, the Company may not immediately or automatically collect such cancellation fees for Pay at Location / Pay Later bookings. This <strong>does not extinguish</strong> your payment obligation. The Company may pursue reasonable measures for unpaid cancellation fees, including requesting online payment, offsetting through future Pay Now transactions where lawful and appropriate, limiting future bookings, restricting you to Pay Now bookings only, or suspending your account.",
      driver_cancellation_section2_item6:
        "Regardless of the above, you should cancel as early as possible once you know you will not use a booking, in order to avoid last-minute cancellations and no-shows.",
      driver_cancellation_section3_title: "3. Pay Now Bookings - Cancellations, Refunds & No-shows",
      driver_cancellation_section3_item1:
        "For Pay Now bookings, each listing discloses the applicable cancellation deadline, cancellation fee, and no-show treatment.",
      driver_cancellation_section3_item2:
        "If you cancel within the free cancellation period (if any), Parkchung will normally refund the <strong>full Transaction Amount</strong> to your original payment method.",
      driver_cancellation_section3_item3:
        "If you cancel <strong>after</strong> the free cancellation period, the cancellation fee (e.g., all or part of the Transaction Amount) disclosed in the listing will apply. Parkchung will refund any remaining amount (if applicable) to your original payment method.",
      driver_cancellation_section3_item4:
        "For <strong>no-shows</strong> (failure to appear without cancellation), refunds are generally not provided, and Parkchung may apply the full Transaction Amount towards payments to the Supplier and Parkchung's Margin, to the extent permitted by law.",
      driver_cancellation_section3_item5:
        "Where a refund is due, Parkchung will process the refund to the original payment method within a reasonable timeframe. Actual crediting times may vary depending on the payment processor and system conditions.",
      driver_cancellation_section4_title: "4. Supplier- or Platform-caused Cancellations",
      driver_cancellation_section4_item1:
        'If a Supplier cannot provide a booked space due to their own reasons, the Driver is not obligated to pay, and for "Pay Now" bookings, Parkchung will typically issue a full refund.',
      driver_cancellation_section4_item2:
        "If Parkchung's system error leads to an improperly formed booking or duplicate charges, Parkchung will fully refund any erroneous or duplicate transaction amounts.",
      driver_cancellation_section4_item3:
        'For "Pay at Location / Pay Later" bookings where the Supplier collected payment but couldn\'t provide the space, Parkchung will collaborate with the Supplier to facilitate appropriate refunds to the Driver.',
      driver_cancellation_section5_title: "5. Chargebacks & Fraud",
      driver_cancellation_section5_content:
        '"Pay Now" bookings involving suspected fraud, stolen cards, or similar issues are managed according to the payment processor\'s rules, including chargebacks. If a transaction amount is not ultimately settled to Parkchung and/or the Supplier due to a chargeback or reversal, neither Parkchung nor the Supplier is obligated to make or maintain payments to the Driver for that booking, unless legally required.',
      driver_cancellation_section6_title: "6. Consumer Protection",
      driver_cancellation_section6_content:
        "Nothing in this Policy restricts any rights granted to Drivers under Vietnamese consumer protection laws or other mandatory legal provisions.",
      supplier_page_title: "Parkchung Supplier Terms, Listing & Settlement Policies",
      supplier_page_subtitle: "Terms and policies for suppliers listing parking spaces on our platform.",
      supplier_header_title: "Parkchung Supplier Terms, Listing & Settlement Policies",
      supplier_header_info: "Effective: [•] / Last Updated: 21 November 2025",
      supplier_intro_1:
        "This document works together with the Parkchung Terms of Service, Insurance & Liability Policy, Privacy Policy, Dispute Resolution Policy, and Security Policy.",
      supplier_intro_2:
        "Capitalised terms (Company, Service, Driver, Supplier, Transaction Amount, Margin, Settlement Date, etc.) have the meanings given in the Terms of Service.",
      supplier_sectionA_title: "A. Supplier Terms (General) v2.0",
      supplier_section1_title: "1. Applicability & Hierarchy",
      supplier_section1_item1:
        'These terms apply to each Supplier who has entered into a written or otherwise executed Supplier Agreement with Parkchung ("Company").',
      supplier_section1_item2:
        "In case of any inconsistency between the Supplier Agreement and these Supplier Terms, the Supplier Agreement prevails, followed by these Supplier Terms and the Company's common policies (Terms of Service, Insurance & Liability Policy, Privacy Policy, Dispute Resolution Policy, Security Policy), unless expressly agreed otherwise.",
      supplier_section2_title: "2. Definitions & Cross-reference",
      supplier_section2_intro:
        "Unless otherwise defined here, capitalised terms follow the definitions in the Parkchung Terms of Service. In particular:",
      supplier_section2_item1: "<strong>Service:</strong> the online parking marketplace operated by the Company.",
      supplier_section2_item2:
        "<strong>Transaction Amount:</strong> the total amount a Driver pays for a booking, either directly to the Supplier (cash/on-site) or online to the Company.",
      supplier_section2_item3:
        "<strong>Margin:</strong> the agreed commission rate by which the Company is remunerated (e.g., 15%).",
      supplier_section2_item4:
        "<strong>Settlement Date:</strong> the date on which the Company pays to the Supplier (or the Supplier pays to the Company) the net amounts for the previous month, after deducting/applying the Margin and any agreed offsets.",
      supplier_section3_title: "3. Types of Parking & Role of Parkchung",
      supplier_section3_item1: "Parking spaces on the Service are broadly categorised as:",
      supplier_section3_item1a:
        "<strong>Information-only Parking:</strong> The Company publishes information (name, address, contact details, etc.) based on public sources (Google Maps, websites, Facebook, etc.) or Supplier-provided information. No booking or payment function is provided via Parkchung.",
      supplier_section3_item1b:
        "<strong>Bookable - Pay at Location / Pay Later Parking:</strong> The Driver places a booking through Parkchung, and pays the Transaction Amount directly to the Supplier on-site at the time of use.",
      supplier_section3_item1c:
        "<strong>Bookable - Online Payment (Pay Now) Parking:</strong> The Driver places a booking through Parkchung and prepays all or part of the Transaction Amount online to the Company. The Company acts as Payment Agent, receives the Transaction Amount, and remits the Supplier's share on the Settlement Date.",
      supplier_section3_item2:
        "For each listing, the applicable category and supported payment methods (Pay at Location / Pay Later and/or Pay Now) must be clearly indicated on the listing page and at checkout, in accordance with the Service's UI and the Supplier's responsibility for accuracy.",
      supplier_section3_item3:
        "The Company acts solely as an intermediary platform and is not a parking facility operator or bailee/custodian. Primary responsibility for legal compliance, safety, and condition of parking facilities lies with the Supplier and facility operator (as further described in the Insurance & Liability Policy).",
      supplier_section3_item4:
        "For Information-only Parking, if a Driver contacts and transacts with a Supplier directly based on information displayed on Parkchung, such dealings occur outside Parkchung's booking/payment flows. The Company is not a contracting party to those transactions and does not handle the related payments.",
      supplier_section4_title: "4. Supplier Eligibility & KYC",
      supplier_section4_item1:
        "The Supplier represents and warrants that it holds valid legal rights (ownership, lease, management rights, etc.) to offer the listed parking spaces and possesses necessary licences/permits under applicable laws (parking regulations, fire safety, construction/urban planning, etc.).",
      supplier_section4_item2:
        "Upon the Company's request, the Supplier must provide accurate and up-to-date KYC information, proof of rights, bank account details, invoicing/tax information, and other required documents.",
      supplier_section4_item3:
        "The Supplier shall cooperate with the Company's reasonable checks related to sanctions, anti-money laundering, fraud prevention, and legal compliance.",
      supplier_section5_title: "5. Listing Conditions, On-site Operations & Prohibited Conduct",
      supplier_section5_item1:
        "The Supplier must accurately disclose pricing, available hours, minimum booking units, vehicle restrictions, house rules, cancellation terms, and other listing conditions, and to update them promptly upon any change.",
      supplier_section5_item2:
        "The Supplier must implement reasonable safety measures, including lighting, markings, entrance/exit signage, and posting on-site rules, while complying with applicable laws and technical codes (e.g., fire safety codes, QCVN standards).",
      supplier_section5_item3:
        "The Supplier must not engage in opaque or off-platform monetary arrangements, such as hidden surcharges or unfair side payments that contradict the listing.",
      supplier_section5_item4:
        'Without the Company\'s prior approval, the Supplier must not improperly steer Drivers away from "Parkchung" to alternative payment channels (e.g., off-platform transfers) that circumvent agreed flows.',
      supplier_section5_item5:
        "The Supplier must notify the Company at least 24 hours in advance (where reasonably feasible) of any anticipated temporary closure, unavailability, or material change of a space, and to cooperate with adjustments or cancellations of existing bookings, except in emergencies.",
      supplier_section6_title: "6. Relationship with Driver-side Policies (Booking, Extensions, Cancellations)",
      supplier_section6_item1:
        'Bookings made via the Service are primarily governed by the "Driver Terms (General)," the "Drivers\' Extension & Overstay Policy," and the "Drivers\' Cancellation & Refund Policy."',
      supplier_section6_item2:
        "The Supplier must configure its listing conditions to avoid conflict with driver-side policies or Vietnamese mandatory laws. In case of conflict, the Company's policies and mandatory laws prevail.",
      supplier_section6_item3:
        'The Supplier\'s obligations and rights regarding extensions/overstay and cancellations are further detailed in "section B (Supplier Listing, Payment & Settlement Policy)" and in the driver-side policies.',
      supplier_section7_title: "7. Transaction Amounts, Margin & Settlement",
      supplier_section7_content:
        "The rules for Transaction Amounts, Margin, and Settlement are set out in section B (Supplier Listing, Payment & Settlement Policy).",
      supplier_section8_title: "8. Insurance & Liability Allocation",
      supplier_section8_item1:
        "The Supplier's safety obligations and responsibility allocation are governed by the Parkchung Insurance & Liability Policy and section C (Supplier Risk & Liability Policy).",
      supplier_section8_item2:
        "For the avoidance of doubt, and as specified in the Insurance & Liability Policy, the Company's total liability towards any party for a given transaction is capped at the Margin actually received by the Company for that transaction, except for liabilities that cannot be excluded under law and for losses caused by the Company's wilful misconduct or gross negligence.",
      supplier_section9_title: "9. Confidentiality & Data",
      supplier_section9_item1:
        "The Supplier shall treat all non-public information about the Company, other Suppliers, and Drivers obtained through the relationship as confidential, and shall not disclose it to third parties except as required by law or authorised by the Company.",
      supplier_section9_item2:
        "The Company may use anonymised and aggregated data for analytics, service improvement, and reporting, while personal data is handled under the Privacy Policy.",
      supplier_section10_title: "10. Suspension & Termination",
      supplier_section10_content:
        "In case of breaches of these Supplier Terms, the Supplier Agreement, applicable law, or Company policies, or in case of fraud, persistent complaints, or repeated service failures, the Company may, with prior notice or, where urgent, without prior notice, suspend or delist the Supplier, restrict new bookings, or terminate the Supplier Agreement.",
      supplier_section11_title: "11. Governing Law & Dispute Resolution",
      supplier_section11_content:
        "These Supplier Terms are governed by Vietnamese law. Disputes are handled in accordance with the Company's Dispute Resolution Policy (internal handling → competent authorities/ADR → courts).",
      supplier_sectionB_title: "B. Supplier Listing, Payment & Settlement Policy v2.0",
      supplier_settlement_section1_title: "1. Scope",
      supplier_settlement_section1_content:
        "This Policy governs pricing, Transaction Amount flows, Margin, settlement, and reconciliation/objections for all bookable parking spaces listed via Parkchung (both Pay at Location / Pay Later and Pay Now).",
      supplier_settlement_section2_title: "2. Pricing & Listing Conditions",
      supplier_settlement_section2_item1:
        "The Supplier sets base rates (per hour/day, etc.), minimum booking units, cancellation terms, extension/overstay pricing, and other charges in accordance with the Service's defined fields.",
      supplier_settlement_section2_item2:
        "The Supplier is responsible for ensuring compliance with applicable pricing and consumer protection regulations and must avoid misleading price displays (e.g., hidden mandatory fees, deceptive discounting).",
      supplier_settlement_section2_item3:
        "For promotions, coupons, or campaigns affecting prices, the cost-sharing mechanism (Supplier-borne, Company-borne, or shared) is determined in the Supplier Agreement or a separate written agreement.",
      supplier_settlement_section3_title: "3. Pay Now Bookings - Online Payment & Settlement",
      supplier_settlement_section3_item1:
        "For Pay Now bookings, the Driver prepays all or part of the Transaction Amount to the Company through the Service. The Company, acting as Payment Agent, receives the Transaction Amount and remits the Supplier's share on the Settlement Date.",
      supplier_settlement_section3_item2:
        "For Pay Now bookings completed by the end of a calendar month, the Company will, on the agreed <strong>Settlement Date</strong>, remit to the Supplier's designated bank account the net amount after deducting:",
      supplier_settlement_section3_item2a: "the agreed <strong>Margin</strong> (commission);",
      supplier_settlement_section3_item2b:
        "adjustments for refunds, cancellations, no-shows, and any related fees within that period;",
      supplier_settlement_section3_item2c:
        "chargebacks, failed payments, or payment-processor deductions; and",
      supplier_settlement_section3_item2d:
        "penalties or costs reasonably incurred by the Company due to the Supplier's breach, to the extent notified to the Supplier.",
      supplier_settlement_section3_item3:
        "The Company will provide the Supplier with a monthly electronic statement summarising transactions, deductions, and net remittances. The Supplier may raise reasonable objections within <strong>7 days</strong> of receipt. Absent objections within this period, the statement is deemed final for that period.",
      supplier_settlement_section4_title: "4. Treatment of refunds, cancellation fees, and no-show charges for Pay Now bookings",
      supplier_settlement_section4_content:
        'The treatment of refunds, cancellation fees, and no-show charges for "Pay Now" bookings follows the "Drivers\' Cancellation & Refund Policy" and any terms set out in the "Supplier Agreement."',
      supplier_settlement_section5_title: "5. Pay at Location / Pay Later Bookings - On-site Payment & Settlement",
      supplier_settlement_section5_item1:
        'For "Pay at Location / Pay Later" bookings, the Driver pays the full Transaction Amount directly to the Supplier on-site. The Company does not receive the Transaction Amount at the time of booking.',
      supplier_settlement_section5_item2:
        'The Supplier must calculate, based on its records and the Company\'s booking data, the total Transaction Amount it has collected on-site for "Pay at Location / Pay Later" bookings in each month, and determine the amounts payable to the Company (Margin and any other agreed items).',
      supplier_settlement_section5_item3:
        'The Supplier shall pay to the Company, on the agreed "Settlement Date," the aggregate Margin and any other agreed amounts for the previous month, by transferring such sums to the bank account designated by the Company.',
      supplier_settlement_section5_item4:
        "The Company may generate monthly reconciliation statements based on its booking records and the Supplier's reports. The Supplier must review and may raise objections within 7 days of receipt; failing such, the statement is deemed accepted for settlement purposes.",
      supplier_settlement_section5_item5:
        'For "Pay at Location / Pay Later" bookings where the Driver cancels after the free cancellation period or no-shows, and the Company successfully collects a cancellation fee from the Driver, the allocation of such fee between the Company and the Supplier shall be as agreed in the "Supplier Agreement" or other written arrangements.',
      supplier_settlement_section6_title: "6. Tax & Invoicing",
      supplier_settlement_section6_item1:
        "The Supplier is solely responsible for complying with all applicable tax obligations (including VAT, corporate income tax, and any withholding obligations) and must issue appropriate invoices/receipts to Drivers and/or to the Company where required by law.",
      supplier_settlement_section6_item2:
        "The Company is responsible for its own tax obligations relating to the Margin and other amounts it receives, in accordance with Vietnamese law.",
      supplier_settlement_section6_item3:
        "Any special tax arrangements between the Supplier and the Company (e.g., invoicing flows, withholding) must be set out in the Supplier Agreement.",
      supplier_settlement_section7_title: "7. Dashboard & Reporting",
      supplier_settlement_section7_item1:
        "The Company may provide a Supplier dashboard showing booking history, revenue information, and settlement details.",
      supplier_settlement_section7_item2:
        "In the initial stages, the Company may not provide CSV/PDF export features or may provide only limited reporting functionality. The Company will announce any significant changes to such tools on its website or via email.",
      supplier_sectionC_title: "C. Supplier Risk & Liability Policy v2.0",
      supplier_risk_section1_title: "1. Safety Management & Compliance",
      supplier_risk_section1_item1:
        "The Supplier must implement reasonable measures to keep parking spaces safe and usable, including lighting, markings, entrance/exit signage, on-site rules, and removal of hazards.",
      supplier_risk_section1_item2:
        "The Supplier must comply with land/building use rights, fire prevention and fighting requirements, construction rules, urban planning, lawful price display obligations, and any other applicable regulations.",
      supplier_risk_section2_title: "2. Incidents, Theft & Damages",
      supplier_risk_section2_item1:
        "Where damage or loss to Drivers or third parties arises from structural defects, equipment failures, operational shortcomings, breach of safety duties, or lack of legal rights attributable to the Supplier, the Supplier bears responsibility for such losses.",
      supplier_risk_section2_item2:
        "The Company may support dispute resolution as an intermediary but is not, in principle, a direct compensating party, as specified in the Insurance & Liability Policy.",
      supplier_risk_section3_title: "3. Insurance",
      supplier_risk_section3_item1: "The Company does not currently provide its own insurance product.",
      supplier_risk_section3_item2:
        "The Supplier is responsible for arranging, at its own cost, appropriate insurance coverage (e.g., facility/public liability insurance) where necessary.",
      supplier_risk_section4_title: "4. Company Liability Cap",
      supplier_risk_section4_content:
        "The Company's liability is governed by the Insurance & Liability Policy and the Terms of Service. Even where the Company is held liable under Vietnamese law, the Company's total liability per transaction is capped at the <strong>Margin actually received by the Company for that transaction</strong>, except for liabilities that cannot be excluded under law and for losses caused by the Company's wilful misconduct or gross negligence.",
      supplier_risk_section5_title: "5. Indemnity",
      supplier_risk_section5_item1:
        "To the extent permitted by law, the Supplier shall defend and indemnify the Company against third-party claims and losses arising from the Supplier's breach, negligence, or lack of rights in relation to the parking spaces.",
      supplier_risk_section5_item2:
        "This Policy does not limit any mandatory rights of Drivers under Vietnamese consumer protection or other mandatory laws.",
      footer_support: "SUPPORT",
      sup_booking: "Parking Booking Guide",
      sup_listing: "Parking Listing Guide",
      sup_faq: "FAQs",
      sup_blog: "Blog",
      footer_copy: "Copyright © 2025 A product of",
      ph_location: "Enter a place or postcode",
      results_title: "Available Parking Spots",
      results_desc: "Choose the best spot for you and book in seconds.",
      no_results: "Sorry, no available parking spots were found for your criteria.",
      book_now: "Book Now",
      login_title: "Login to Your Account",
      register_title: "Create Your Account",
      email: "Email",
      password: "Password",
      full_name: "Full Name",
      phone: "Phone",
      register: "Register",
      no_account: "Don't have an account?",
      register_here: "Register here",
      have_account: "Already have an account?",
      login_here: "Login here",
      my_bookings: "My Bookings",
      back_home: "← Back to Home",
      loading: "Loading your bookings...",
      host_hero_title: "Earn Money with Your Parking Space",
      host_hero_desc: "Join our community of hosts and turn your unused parking spot into a source of income. It's simple, secure, and free to list.",
      host_benefit_price: "Set your own price",
      host_benefit_avail: "Control your availability",
      host_benefit_secure: "Secure and easy payments",
      host_form_title: "List Your Spot",
      host_form_note: "Your spot will be reviewed by an admin before being published.",
      address: "Address",
      get_location: "Get Location",
      coords_hint: "We'll try to get your coordinates automatically. You can adjust them manually if needed.",
      longitude: "Longitude",
      latitude: "Latitude",
      hourly_rate: "Hourly Rate (VND)",
      spot_image: "Image of Your Spot",
      click_upload: "Click to Upload Image",
      no_file: "No file chosen",
      submit_review: "Submit for Review",
      details_title: "Parkchung Booking Details",
      details_subtitle: "You're almost done! Just a few more details to confirm your booking.",
      details_section_title: "Booking details",
      arriving_on: "Arriving on",
      leaving_on: "Leaving on",
      ph_select_datetime: "Select Date/Time",
      duration: "Duration",
      contact_title: "Let's get started",
      contact_phone_label: "Phone Number",
      contact_hint: "We'll use this to contact you about your booking",
      vehicle_title: "Vehicle Information",
      vehicle_reg_label: "Vehicle Registration",
      vehicle_desc: "Your vehicle registration will be shared with the parking operator",
      ph_vehicle_reg: "Enter your vehicle registration",
      payment_title: "Payment Information",
      payment_desc: "All payments are secure and encrypted with bank-level security",
      payment_secure: "256-bit SSL encryption",
      payment_methods: "All major cards accepted",
      spot_loading: "Loading Address...",
      unit_price: "Unit Price",
      parking_duration: "Parking Duration",
      total_price: "Total Price",
      rechecked: "Availability rechecked in",
      time_to_complete: "Time to complete booking:",
      btn_pay_reserve: "Pay now and reserve",
      trust_best_price: "Best Price Guaranteed",
      trust_reviews: "163,000+ reviews",
      trust_trusted: "Trusted by 10m drivers",
      trust_free_cancel: "Free cancellation up to 24 hours before arrival",
      trust_award: "Award-winning customer service",
      trust_excellent: "Excellent",
      popup_title: "Complete Your Booking",
      popup_booking_summary: "Booking Summary",
      popup_from: "From",
      popup_to: "To",
      popup_contact_info: "Contact Information",
      popup_contact_desc: "We'll use this information to confirm your booking",
      popup_fullname: "Full Name",
      popup_email: "Email Address",
      popup_phone: "Phone Number",
      popup_cancel: "Cancel",
      popup_send: "Complete Booking",
      policy_page_title: "PRIVACY POLICY",
      policy_page_subtitle: "How we collect, protect, and use your personal data on Parkchung.",
      policy_collect_title: "Purpose and scope of collection",
      policy_collect_intro: "Customer personal data is only used for the following purposes:",
      policy_collect_item1: "Support vehicle booking and provide vehicles to customers.",
      policy_collect_item2: "Contact customers to introduce promotions and marketing programs of the Company.",
      policy_collect_item3: "Improve service quality and support customers.",
      policy_collect_item4: "Resolve disputes and issues arising from the use of services on the platform.",
      policy_collect_item5: "Provide information to competent authorities when required by law.",
      policy_collect_member_intro: "When members register an account on chungxe.vn, we may collect the following information:",
      policy_collect_member_item1: "Registered name and phone number.",
      policy_collect_member_item2: "Email address.",
      policy_collect_member_item3: "Address.",
      policy_collect_member_item4: "Tax code or ID/Passport number.",
      policy_use_title: "Scope of information use",
      policy_use_intro: "We use customer information for the following purposes:",
      policy_use_item1: "Send notifications about transactions and activities between customers and the Company.",
      policy_use_item2: "Prevent account destruction and impersonation or fraud against customers.",
      policy_use_item3: "Contact and work with customers in special cases.",
      policy_use_item4:
        "Do not use customer personal data for any purpose other than verification and contact related to bookings and vehicle provision.",
      policy_use_item5:
        "Cooperate with judicial authorities (Procuracy, Court, Police, etc.) when there is a lawful request regarding customer violations. No one else is allowed to access customer personal data.",
      policy_retention_title: "Retention period",
      policy_retention_desc:
        "Personal data is retained for as long as your account is active or until you request deletion, except when longer retention is required to comply with laws and dispute resolution.",
      policy_access_title: "Parties allowed to access the information",
      policy_access_intro: "Your data is only shared with the following parties when necessary:",
      policy_access_item1: "Parkchung staff directly responsible for serving the customer.",
      policy_access_item2: "Service providers supporting booking, payment, and communications under confidentiality terms.",
      policy_access_item3: "Competent authorities with legal mandates.",
      policy_access_item4: "Partners explicitly authorized by the customer.",
      policy_access_notice: "We notify you as soon as possible if there is any unusual access or data breach.",
      policy_address_title: "Contact of the collecting organization",
      policy_address_company: "PARKCHUNG JOINT STOCK COMPANY",
      policy_address_location: "Address: Floor 5, 166 Pho Hue, Nguyen Du Ward, Hai Ba Trung, Ha Noi.",
      policy_address_email: "Email: contact@parkchung.com",
      policy_user_rights_title: "How users can access and update their data",
      policy_user_rights_intro1: "Members can review and edit their personal information directly inside their Parkchung account dashboard.",
      policy_user_rights_intro2:
        "If you believe your information has been misused, please send us a request and we will respond within three working days.",
      policy_user_rights_contact: "Email: contact@parkchung.com",
      policy_user_rights_address: "Address: Floor 5, 166 Pho Hue, Nguyen Du Ward, Hai Ba Trung, Ha Noi.",
      policy_commitment_title: "Commitment to protecting customers' personal data",
      policy_commitment_intro1:
        "Members' personal data on parkchung.com is strictly protected in accordance with the Company's data protection policy.",
      policy_commitment_intro2:
        "We do not use, transfer, or disclose personal data to any third party without the member's consent, except where required by law.",
      policy_commitment_intro3:
        "If the server is attacked by hackers leading to data loss, parkchung.com will promptly notify competent authorities for investigation and inform affected members. All online transaction information (invoices, accounting records, etc.) is securely stored in high‑security data centers of parkchung.com.",
      policy_commitment_intro4:
        "When registering/purchasing, members must provide accurate personal information (full name, contact address, email, phone, etc.) and are legally responsible for that information. Parkchung will not be liable for complaints related to member rights if the personal data provided at registration is inaccurate.",
      policy_complaint_title: "Mechanism for receiving and resolving complaints related to personal data",
      policy_complaint_intro:
        "Members may send complaints about data leaks to third parties to the parkchung.com administrators at the Company's address or via email.",
      policy_complaint_contact: "Email: contact@parkchung.com",
      policy_complaint_resolution: "The Company is responsible for applying technical and operational measures to verify the reported content.",
      policy_complaint_resolution1:
        "The time to handle complaints related to personal data for members using e‑commerce services is up to 10 working days.",
      complaint_page_title: "COMPLAINT HANDLING PROCESS",
      complaint_page_subtitle: "Our procedures for receiving, processing, and resolving customer complaints and disputes.",
      complaint_info_title: "Service Information",
      complaint_info_intro:
        "All information about services, quality policy, and pricing on the Website is publicly displayed and updated regularly. Customers can access this information before making any booking or transaction.",
      complaint_process_title: "Complaint Resolution Process",
      complaint_process_intro: "When a dispute or complaint arises, we follow the following steps:",
      complaint_step1_title: "Step 1: Complaint Submission",
      complaint_step1_desc: "Customers can submit complaints through the following channels:",
      complaint_step1_item1: "Email: contact@parkchung.com",
      complaint_step1_item2: "Mail to: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      complaint_step1_item3: "Phone: 0903.229.906 (8:00 AM - 9:00 PM)",
      complaint_step1_note:
        "Please provide detailed information including: booking reference, issue description, supporting documents (if any), and your contact information.",
      complaint_step2_title: "Step 2: Complaint Review and Verification",
      complaint_step2_desc: "Upon receiving your complaint, we will:",
      complaint_step2_item1: "Acknowledge receipt within 24 hours",
      complaint_step2_item2: "Review and verify the information provided",
      complaint_step2_item3: "Contact relevant parties (customers, hosts, service providers) to gather additional information",
      complaint_step2_item4: "Investigate the matter thoroughly",
      complaint_step3_title: "Step 3: Resolution and Response",
      complaint_step3_desc: "After completing the investigation, we will:",
      complaint_step3_item1: "Provide a detailed response explaining our findings",
      complaint_step3_item2: "Propose a solution or compensation (if applicable)",
      complaint_step3_item3: "Implement corrective measures to prevent similar issues",
      complaint_step3_item4: "Follow up to ensure customer satisfaction",
      complaint_timeline_title: "Processing Timeline",
      complaint_timeline_desc: "We commit to processing complaints within the following timeframes:",
      complaint_timeline_item1: "Acknowledgment: Within 24 hours of receipt",
      complaint_timeline_item2: "Initial response: Within 3 working days",
      complaint_timeline_item3: "Full resolution: Within 5 working days for standard complaints",
      complaint_timeline_item4: "Complex cases: Up to 10 working days with regular updates",
      complaint_contact_title: "Contact Information for Complaints",
      complaint_contact_company: "PARKCHUNG JOINT STOCK COMPANY",
      complaint_contact_address: "Address: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      complaint_contact_email: "Email: contact@parkchung.com",
      complaint_contact_phone: "Phone: 0903.229.906 (8:00 AM - 9:00 PM)",
      complaint_commitment_title: "Our Commitment",
      complaint_commitment_intro1:
        "We are committed to protecting user rights and ensuring fair resolution of all disputes. All complaints are handled with confidentiality and professionalism.",
      complaint_commitment_intro2:
        "Customers are responsible for providing accurate and complete information when submitting complaints. False or misleading information may delay the resolution process.",
      complaint_commitment_intro3:
        "We reserve the right to request additional documentation or information to properly investigate and resolve complaints.",
      complaint_after_title: "After Dispute Resolution",
      complaint_after_intro: "Once a dispute is resolved:",
      complaint_after_item1: "All parties will be notified of the resolution",
      complaint_after_item2:
        "If a service provider is found to be non-compliant, appropriate actions will be taken, including warnings, suspension, or termination of services",
      complaint_after_item3: "We will implement measures to prevent similar issues from recurring",
      complaint_after_item4: "Customers may request a written summary of the resolution for their records",
      complaint_legal_title: "Legal Recourse",
      complaint_legal_desc: "If an agreement cannot be reached through our internal complaint process, customers have the right to:",
      complaint_legal_item1: "File a complaint with relevant consumer protection authorities",
      complaint_legal_item2: "Seek mediation through third-party dispute resolution services",
      complaint_legal_item3: "Pursue legal action through competent courts in accordance with Vietnamese law",
      complaint_legal_note: "We will fully cooperate with any legal proceedings and provide all necessary documentation as required by law.",
      faq_support_label: "Support",
      faq_page_title: "Frequently Asked Questions",
      faq_page_subtitle: "Step-by-step instructions and answers to the most common booking questions.",
      faq_steps_title: "How to rent a parking spot",
      faq_step1_title: "Find a spot",
      faq_step1_desc: "Access the Parkchung website or app. Select the time and location you need.",
      faq_step2_title: "Reserve",
      faq_step2_desc: "Compare available listings, pick the most suitable spot, and send your booking request.",
      faq_step3_title: "Collect",
      faq_step3_desc: "Complete the paperwork, receive the confirmation, and meet the host or Parkchung representative.",
      faq_step4_title: "Return",
      faq_step4_desc: "Return the vehicle/spot after your session and rate the service to help us improve.",
      faq_questions_title: "Frequently asked questions",
      faq_q1_q: "What documents do I need to rent a motorbike?",
      faq_q1_a:
        "Bring your original ID/passport, driving license, and deposit (if applicable). We will verify all documents before handing over the keys.",
      faq_q2_q: "What documents do I need to rent a self-drive car?",
      faq_q2_a: "You need your ID/passport, a valid car driving license, and a deposit or guarantee as required by the listing owner.",
      faq_q3_q: "How do I check the vehicle before pickup?",
      faq_q3_a:
        "Inspect the vehicle with the host, take photos of the odometer, fuel level, scratches, and sign the handover note together to avoid later disputes.",
      faq_q4_q: "Can I book on behalf of someone else?",
      faq_q4_a: "Yes, but please provide the driver’s information accurately and ensure they meet the requirements listed in the booking terms.",
      faq_q5_q: "Are there any additional fees?",
      faq_q5_a:
        "The booking price includes the base rental fee. Extra fees (fuel, overtime, tolls) will be listed in the listing details or agreed with the host.",
      faq_q6_q: "What types of vehicles are available on Parkchung?",
      faq_q6_a: "We offer cars, motorbikes, EV charging spots, and private parking spaces. Availability depends on the selected city and time.",
      faq_q7_q: "Are the vehicles new and in good condition?",
      faq_q7_a: "Each listing is reviewed and maintained regularly. Hosts must ensure vehicles are clean, safe, and roadworthy before every rental.",
      faq_q8_q: "Which payment methods are supported?",
      faq_q8_a: "You can pay by bank transfer, credit/debit card, or cash depending on the selected listing. Details are provided during checkout.",
      about_page_title: "ABOUT US",
      about_intro_para1:
        "Parkchung is a pioneering startup developing an online platform for self-driving car and motorbike rental and sharing in Vietnam.",
      about_intro_para2:
        "Parkchung connects customers needing to rent self-driving vehicles (cars, motorbikes) with rental units and individuals with idle vehicles nationwide via its website or mobile app, allowing easy and quick searching, comparing, and renting.",
      about_intro_para3:
        "Parkchung's mission is to provide a modern technology platform for fast, safe, and economical vehicle rental and sharing, aiming for a civilized and environmentally friendly community for vehicle sharing.",
      about_why_title: "Why do we do it?",
      about_why_item1: "Currently, in Vietnam, there is no online platform for renting and sharing motorbikes, self-driving cars.",
      about_why_item2:
        "Car renters face many difficulties in renting a self-driving car as desired, while individuals with idle cars or self-driving car rental units do not have good enough technology to manage and optimize their assets.",
      about_why_item3:
        "With the explosion of the 4.0 technology trend, the conveniences of booking transportation services via online/mobile channels as well as car-sharing technology are increasingly developing and becoming popular.",
      about_why_item4: "Vehicle sharing is gradually becoming the main trend in the world, replacing vehicle ownership.",
      about_how_title: "How do we do it?",
      about_how_para1:
        "Even the most complex problems have a suitable solution. Parkchung doesn't just rent cars; it creates innovative products within the existing ecosystem.",
      about_how_para2:
        "We leverage technology to provide a comprehensive travel solution by connecting customers with self-drive car rental service providers. Parkchung's mission is to offer a platform where customers can easily rent their desired car, while car owners can attract customers and conduct business conveniently.",
      about_how_para3:
        "The company focuses on simplifying the car rental process, offering transaction support tools from price comparison to online payment, car rental insurance, reduced procedures, and many other utilities for both customers and car-providing partners.",
      footer_about: "About Us",
    },
    vi: {
      becomeHost: "Trở thành Chủ bãi",
      becomeHostRegister: "Trở thành Chủ bãi / Đăng ký",
      myBookings: "Đặt chỗ của tôi",
      welcome: "Xin chào",
      logout: "Đăng xuất",
      login: "Đăng nhập",
      tagline: "Tiết kiệm thời gian. Tiết kiệm chi phí. Bảo vệ Trái Đất",
      nav_home: "Trang chủ",
      nav_available: "Chỗ trống",
      tab_hourly: "Theo giờ/Ngày",
      tab_monthly: "Theo tháng",
      tab_airport: "Sân bay",
      label_park_at: "Đỗ tại",
      label_from: "Từ",
      label_until: "Đến",
      btn_show_spaces: "Hiển thị chỗ đỗ",
      why_title: "Vì sao chọn Parkchung",
      benefit_time_title: "Tiết kiệm thời gian",
      benefit_time_desc: "Đặt chỗ trước, không còn mất công tìm kiếm.",
      benefit_price_title: "Giá minh bạch",
      benefit_price_desc: "Giá rõ ràng, không phụ phí bất ngờ.",
      benefit_safe_title: "Bãi đỗ an toàn",
      benefit_safe_desc: "Khu đỗ an ninh, được giám sát.",
      locations_title: "Địa điểm nổi bật",
      loc_airports: "Sân bay",
      loc_city: "Trung tâm thành phố",
      loc_homes: "Nhà riêng",
      rent_title: "Cho thuê chỗ đỗ hoặc điểm sạc EV của bạn",
      rent_desc: "Tạo thu nhập dễ dàng, miễn thuế từ chỗ đỗ/điểm sạc của bạn. Đăng tin miễn phí và chỉ mất vài phút để bắt đầu.",
      rent_cta: "Tìm hiểu cách kiếm tiền ngay",
      carpark_title: "Quản lý bãi đỗ xe",
      carpark_desc: "Tối đa hóa công suất bãi đỗ và tối ưu thanh toán với ứng dụng ưa thích.",
      carpark_cta: "Tìm hiểu giải pháp",
      press_title: "Báo chí nói về chúng tôi",
      press_badge: "ĐƯỢC NHẮC ĐẾN",
      press_subtitle: "Các phương tiện truyền thông toàn cầu nêu bật cách Parkchung đang định hình tương lai của giao thông chia sẻ tại Việt Nam.",
      press_article1_source: "UNDP Vietnam · VietChallenge 2019",
      press_article1_title: "Chúc mừng 12 startup chính thức bước tiếp vào giai đoạn huấn luyện chuyên sâu của Chương trình Ươm tạo Việt Nam – Nhật Bản!",
      press_article2_source: "Startup VnExpress",
      press_article2_title: "DỰ ÁN/PROJECT PARKCHUNG",
      press_article3_source: "Cafebiz",
      press_article3_title: "CÔNG BỐ 12 STARTUP -tiến vào vòng huấn luyện chuyên sâu-",
      press_read_article: "Đọc bài viết",
      footer_contact: "LIÊN HỆ",
      footer_brand: "Parkchung, nền tảng đặt chỗ đỗ xe trực tuyến",
      footer_intro: "GIỚI THIỆU",
      footer_subscribe_text: "Đăng ký nhận khuyến mãi",
      ph_email: "Nhập email của bạn...",
      btn_signup: "Đăng ký",
      footer_policies: "CHÍNH SÁCH",
      pol_privacy: "Chính sách bảo mật",
      pol_terms_service: "Điều Khoản Sử Dụng Parkchung",
      pol_insurance: "Chính Sách Bảo Hiểm & Trách Nhiệm Parkchung",
      pol_dispute: "Chính Sách Giải Quyết Tranh Chấp Parkchung",
      pol_security: "Chính Sách An Ninh Thông Tin Parkchung",
      pol_driver: "Điều Khoản & Chính Sách Đặt Chỗ cho Người Lái Xe Parkchung",
      pol_supplier: "Điều Khoản & Chính Sách Dành Cho Nhà Cung Cấp Parkchung",
      pol_incidents: "Sự cố & Khiếu nại",
      pol_host: "Trở thành Chủ bãi",
      terms_page_title: "Điều Khoản Sử Dụng Parkchung",
      terms_page_subtitle: "Vui lòng đọc kỹ các điều khoản này trước khi sử dụng dịch vụ của chúng tôi.",
      terms_page_effective: "Hiệu lực: [*] / Cập nhật lần cuối: 21/11/2025",
      terms_section1_title: "1. Định nghĩa",
      terms_section1_intro: "Trừ khi có quy định khác, các thuật ngữ sau đây có nghĩa như được nêu dưới đây:",
      terms_def_company: '<strong>"Công ty":</strong> Parkchung (bao gồm thực thể vận hành của nó).',
      terms_def_service: '<strong>"Dịch vụ":</strong> nền tảng thị trường trực tuyến do Công ty vận hành cung cấp:',
      terms_def_service_item1: "chức năng thu thập, biên tập và đăng tải thông tin đỗ xe;",
      terms_def_service_item2: "chức năng tìm kiếm và đặt chỗ bãi đỗ xe trực tuyến;",
      terms_def_service_item3: "chức năng thanh toán trực tuyến đối với một số bãi đỗ xe, thông qua website và các kênh khác do Công ty chỉ định.",
      terms_def_driver: '<strong>"Người lái xe":</strong> cá nhân sử dụng Dịch vụ để tìm kiếm, đặt chỗ và/hoặc sử dụng chỗ đỗ xe.',
      terms_def_supplier: '<strong>"Nhà cung cấp":</strong> cá nhân/tổ chức đăng tải hoặc cung cấp chỗ đỗ xe thông qua Dịch vụ.',
      terms_def_parking_info:
        '<strong>"Thông tin bãi đỗ xe:"</strong> thông tin về bãi đỗ xe hiển thị trên Dịch vụ (bao gồm tên, địa chỉ, liên hệ, mức phí, giờ hoạt động, hình ảnh, điều kiện sử dụng…).',
      terms_def_info_only:
        '<strong>"Bãi đỗ chỉ đăng thông tin":</strong> bãi đỗ xe mà Công ty chỉ đăng tải Thông tin bãi đỗ xe dựa trên nguồn thông tin công khai, <strong>không</strong> cung cấp chức năng đặt chỗ hay thanh toán trên Dịch vụ..',
      terms_def_bookable:
        '<strong>"Bãi đỗ có thể đặt chỗ":</strong> bãi đỗ xe mà Nhà cung cấp đã thỏa thuận với Công ty về việc sử dụng chức năng đặt chỗ trên Dịch vụ, cho phép Người lái xe đặt chỗ trực tuyến.',
      terms_def_online_payment:
        '<strong>"Bãi đỗ có thanh toán online":</strong> có nghĩa là Chỗ đỗ có thể đặt mà Nhà cung cấp đã thỏa thuận thêm với Công ty để kích hoạt chức năng thanh toán trực tuyến trên Dịch vụ.',
      terms_def_transaction:
        '<strong>"Số tiền giao dịch":</strong> tổng số tiền (bao gồm thuế và các khoản phí áp dụng) mà Người lái xe phải thanh toán để sử dụng bãi đỗ xe được đặt qua Dịch vụ.',
      terms_def_margin:
        '<strong>"Margin":</strong> tỷ lệ hoặc số tiền do Công ty và Nhà cung cấp thỏa thuận cho từng bãi đỗ xe, được Công ty khấu trừ khi thanh toán/nhận thanh toán với Nhà cung cấp, như là thù lao cung cấp Dịch vụ.',
      terms_def_settlement:
        '<strong>"Ngày quyết toán":</strong> ngày do Công ty và Nhà cung cấp thỏa thuận, dùng để tổng hợp và thực hiện thanh toán/đối soát các giao dịch của kỳ trước.',
      terms_section2_title: "2. Phạm vi áp dụng và sửa đổi Điều khoản",
      terms_section2_item1: "Điều khoản này áp dụng cho mọi người dùng Dịch vụ, bao gồm Người lái xe và Nhà cung cấp.",
      terms_section2_item2:
        "Công ty có thể sửa đổi Điều khoản khi cần thiết. Đối với các sửa đổi quan trọng, Công ty sẽ thông báo bằng phương thức hợp lý (đăng trên website, email…) trước hoặc cùng thời điểm Điều khoản sửa đổi có hiệu lực.",
      terms_section2_item3:
        "Trừ khi có quy định khác, Điều khoản sửa đổi có hiệu lực kể từ thời điểm được đăng tải trên website của Công ty, phù hợp với các quy định pháp luật bắt buộc của Việt Nam và pháp luật liên quan.",
      terms_section3_title: "3. Bản chất Dịch vụ và Vai trò của Công ty",
      terms_section3_item1: "Dịch vụ là nền tảng marketplace trực tuyến kết hợp các chức năng sau:",
      terms_section3_item1_sub1:
        "<strong>Chức năng thông tin:</strong> thu thập, biên tập và trình bày Thông tin bãi đỗ xe (bao gồm Bãi đỗ chỉ đăng thông tin) từ nhiều nguồn, ở dạng dễ tra cứu;",
      terms_section3_item1_sub2: "<strong>Chức năng đặt chỗ:</strong> cho phép Người lái xe đặt chỗ Bãi đỗ có thể đặt chỗ thông qua Dịch vụ;",
      terms_section3_item1_sub3:
        "<strong>Chức năng thanh toán online:</strong> cho phép Người lái xe thanh toán Số tiền giao dịch cho Bãi đỗ có thanh toán online thông qua Dịch vụ.",
      terms_section3_item2:
        "Công ty <strong>không</strong> phải là đơn vị vận hành hay trông giữ bãi đỗ xe và <strong>không </strong>là một bên trong hợp đồng gửi xe giữa Người lái xe và Nhà cung cấp.",
      terms_section3_item2_sub1:
        "Đối với Bãi đỗ chỉ đăng thông tin, Công ty chỉ biên tập và đăng tải thông tin,<strong> không</strong> cung cấp chức năng đặt chỗ hay thanh toán.",
      terms_section3_item2_sub2:
        "Đối với Bãi đỗ có thể đặt chỗ, Công ty chỉ đóng vai trò trung gian hỗ trợ giao kết hợp đồng giữa Người lái xe và Nhà cung cấp.",
      terms_section3_item3:
        "Đối với Bãi đỗ có thanh toán online, khi Người lái xe thanh toán qua Dịch vụ, Công ty đóng vai trò <strong>đơn vị thu hộ/thanh toán thay (payment agent)</strong> của Nhà cung cấp, nhận Số tiền giao dịch thay cho Nhà cung cấp và chuyển tiền ròng cho Nhà cung cấp vào Ngày quyết toán.",
      terms_section4_title: "4. Bãi đỗ chỉ đăng thông tin",
      terms_section4_item1: "Công ty có thể thu thập và biên tập Thông tin bãi đỗ xe cho Bãi đỗ chỉ đăng thông tin từ các nguồn công khai, bao gồm:",
      terms_section4_item1_sub1: "dịch vụ bản đồ trực tuyến;",
      terms_section4_item1_sub2: "website, blog và các ấn phẩm trực tuyến khác của người vận hành bãi đỗ hoặc bên thứ ba;",
      terms_section4_item1_sub3: "trang mạng xã hội (ví dụ: fanpage, trang doanh nghiệp);",
      terms_section4_item1_sub4: "thông tin do cơ quan nhà nước, cơ quan báo chí hoặc nguồn mở khác công bố.",
      terms_section4_item2:
        "Kể cả khi chưa ký kết hợp đồng trước với đơn vị vận hành bãi đỗ, Công ty vẫn có thể, trong phạm vi pháp luật và điều khoản sử dụng của từng nền tảng cho phép, tổng hợp và biên tập các thông tin công khai nêu trên để hiển thị trên Dịch vụ như một “danh mục thông tin bãi đỗ xe”.",
      terms_section4_item3:
        "Công ty nỗ lực cập nhật và duy trì độ chính xác hợp lý của các thông tin này, tuy nhiên <strong>không</strong> bảo đảm tính đầy đủ, chính xác tuyệt đối hoặc cập nhật kịp thời.",
      terms_section4_item4:
        "Đơn vị vận hành Bãi đỗ chỉ đăng thông tin hoặc các chủ thể có quyền liên quan có thể yêu cầu Công ty chỉnh sửa, cập nhật hoặc xóa Thông tin bãi đỗ xe của mình. Công ty sẽ xem xét và xử lý trong phạm vi hợp lý và thời gian phù hợp.",
      terms_section4_item5:
        "Khi Người lái xe sử dụng Bãi đỗ chỉ đăng thông tin, mọi vấn đề về đặt chỗ (nếu có), thanh toán và giải quyết tranh chấp được thực hiện trực tiếp giữa Người lái xe và đơn vị vận hành bãi đỗ. Công ty không tham gia mối quan hệ này và không là một bên của hợp đồng.",
      terms_section5_title: "5. Giao kết hợp đồng điện tử và thông tin tiền hợp đồng",
      terms_section5_item1:
        "Việc đặt chỗ hoặc các đề nghị/chấp thuận khác thông qua Dịch vụ được giao kết hợp lệ bằng phương tiện điện tử, như thao tác nhấn nút hoặc hành vi tương đương. Hợp đồng được tạo bởi hệ thống tự động không bị coi là vô hiệu chỉ vì lý do này.",
      terms_section5_item2:
        "Theo quy định về thương mại điện tử của Việt Nam (bao gồm Nghị định 52), Công ty sẽ hiển thị các điều khoản chủ yếu của giao dịch (mức phí, thời gian sử dụng, điều kiện hủy/hoàn tiền, mức phạt…) trước khi gửi đặt chỗ, và cung cấp cơ chế cho phép người dùng xem lại và chỉnh sửa thông tin trước khi xác nhận.",
      terms_section6_title: "6. Tài khoản và KYC",
      terms_section6_item1:
        "Người dùng phải cung cấp thông tin trung thực, chính xác và được cập nhật khi đăng ký, đồng thời có trách nhiệm duy trì tính cập nhật của thông tin đó.",
      terms_section6_item2:
        "Nhà cung cấp cam kết có đầy đủ quyền hợp pháp (quyền sở hữu, quyền thuê, quyền quản lý…) và các giấy phép, đăng ký cần thiết để cung cấp bãi đỗ xe liên quan.",
      terms_section6_item3:
        "Nhà cung cấp đồng ý phối hợp với Công ty trong việc thực hiện KYC, chống gian lận, tuân thủ chế tài và phòng chống rửa tiền theo yêu cầu của pháp luật Việt Nam.",
      terms_section7_title: "7. Đặt chỗ và phương thức thanh toán",
      terms_section7_item1:
        "Người lái xe có thể tìm kiếm Bãi đỗ có thể đặt chỗ và gửi yêu cầu đặt chỗ bằng cách nhập thời gian sử dụng, thông tin xe và các dữ liệu cần thiết khác trên Dịch vụ.",
      terms_section7_item2: "Phương thức thanh toán đối với Bãi đỗ có thể đặt chỗ bao gồm:",
      terms_section7_item2_sub1:
        "<strong>Thanh toán tại chỗ (Pay at Location):</strong> Người lái xe thanh toán trực tiếp cho Nhà cung cấp tại bãi đỗ vào ngày sử dụng (bằng tiền mặt hoặc phương thức do Nhà cung cấp chấp nhận);",
      terms_section7_item2_sub2:
        "<strong>Thanh toán online (Pay Online):</strong> chỉ áp dụng cho Bãi đỗ có thanh toán online, Người lái xe thanh toán Số tiền giao dịch qua Dịch vụ bằng ví điện tử, thẻ, chuyển khoản ngân hàng hoặc phương thức khác do Công ty hỗ trợ.",
      terms_section7_item3:
        "Tại màn hình đặt chỗ, Dịch vụ sẽ hiển thị rõ ràng phương thức thanh toán áp dụng cho từng bãi đỗ (chỉ thanh toán tại chỗ, chỉ thanh toán online hoặc cả hai).",
      terms_section7_item4:
        "Khi chọn Thanh toán online, Người lái xe thanh toán toàn bộ Số tiền giao dịch cho Công ty thông qua Dịch vụ. Công ty nhận tiền với tư cách là đơn vị thu hộ của Nhà cung cấp và sẽ chuyển lại cho Nhà cung cấp vào Ngày quyết toán sau khi trừ Margin và các khoản bù trừ. Nghĩa vụ thanh toán của Người lái xe đối với Nhà cung cấp được coi là hoàn thành khi Công ty nhận đủ số tiền này.",
      terms_section7_item5:
        "Khi chọn Thanh toán tại chỗ, Người lái xe thanh toán trực tiếp cho Nhà cung cấp tại bãi đỗ theo điều kiện đã hiển thị. Công ty không đóng vai trò thu hộ trong khoản thanh toán đó và không tham gia xử lý tiền mặt. Việc đối soát Margin giữa Công ty và Nhà cung cấp được điều chỉnh theo Điều 9.",
      terms_section7_item6:
        "Công ty có thể hủy hoặc tạm ngưng thanh toán online hoặc đặt chỗ theo quy trình nội bộ trong các trường hợp, bao gồm nhưng không giới hạn, từ chối của đơn vị xử lý thanh toán, nghi ngờ gian lận hoặc xảy ra chargeback.",
      terms_section8_title: "8. Hủy, hoàn tiền và quá thời gian",
      terms_section8_item1:
        "Chính sách hủy, hoàn tiền và phí quá thời gian đối với Bãi đỗ có thể đặt chỗ sẽ được hiển thị rõ ràng tại trang niêm yết và màn hình thanh toán.",
      terms_section8_item2:
        "Trong phạm vi pháp luật cho phép, Công ty/ Nhà cung cấp không hoàn tiền đối với các trường hợp hủy muộn hoặc không đến (no-show) sau thời hạn cho phép.",
      terms_section8_item3:
        "Đối với các giao dịch Thanh toán online, nếu phát sinh hoàn tiền, Công ty sẽ xử lý theo phương thức và thời hạn do Công ty quy định. Thời điểm Người lái xe nhận được tiền hoàn có thể phụ thuộc vào phương thức thanh toán và đơn vị trung gian thanh toán.",
      terms_section8_item4:
        "Trường hợp Người lái xe sử dụng quá thời gian, Công ty có thể tính thêm phí vào phương thức thanh toán đã đăng ký, theo điều kiện hiển thị tại bãi đỗ.",
      terms_section9_title: "9. Thanh toán cho Nhà cung cấp, quyết toán và bù trừ",
      terms_section9_sub1_title: "1. Đối với Thanh toán online",
      terms_section9_1_item1:
        "Đối với Bãi đỗ có thanh toán online, Công ty sẽ khấu trừ Margin đã thỏa thuận và các khoản bù trừ (bao gồm chargeback, hoàn tiền, phạt…) từ Số tiền giao dịch và chuyển phần còn lại cho Nhà cung cấp vào Ngày quyết toán.",
      terms_section9_1_item2:
        "Công ty không chịu trách nhiệm đối với việc chậm trễ hoặc không chuyển được tiền do sai thông tin tài khoản hoặc lý do khác thuộc trách nhiệm của Nhà cung cấp. Chi phí phát sinh cho việc chuyển lại sẽ do Nhà cung cấp chịu.",
      terms_section9_sub2_title: "2. Đối với Thanh toán tại chỗ (Nhà cung cấp thu tiền trực tiếp)",
      terms_section9_2_item1:
        "Trường hợp Người lái xe thanh toán trực tiếp tại bãi, Nhà cung cấp có nghĩa vụ tổng hợp số Margin và các khoản bù trừ đã thỏa thuận với Công ty cho các giao dịch đó và chuyển cho Công ty vào Ngày quyết toán.",
      terms_section9_2_item2:
        "Nhà cung cấp phải báo cáo doanh thu của các giao dịch này theo phương thức do Công ty quy định, và Công ty có quyền, trong phạm vi hợp lý, đối chiếu số liệu với dữ liệu đặt chỗ trên hệ thống.",
      terms_section9_2_item3: "Mỗi bên tự chịu trách nhiệm tuân thủ các quy định về thuế, kế toán và hóa đơn điện tử áp dụng cho mình.",
      terms_section10_title: "10. Hành vi Bị Cấm",
      terms_section10_intro: "Người dùng không được thực hiện các hành vi sau khi sử dụng Dịch vụ:",
      terms_section10_item1: "đăng ký thông tin sai lệch, mạo danh người khác;",
      terms_section10_item2: "đăng bãi đỗ hoặc nhận đặt chỗ khi không có quyền hợp pháp;",
      terms_section10_item3: "khuyến khích hoặc thực hiện hành vi đỗ xe trái phép;",
      terms_section10_item4: "mang vật nguy hiểm hoặc gây mất an toàn tại bãi đỗ;",
      terms_section10_item5: "gây tiếng ồn, xả rác, hoặc gây phiền toái cho cư dân xung quanh;",
      terms_section10_item6: "phá hoại cơ sở vật chất, thiết bị, phương tiện khác;",
      terms_section10_item7: "truy cập trái phép hoặc làm gián đoạn hệ thống, mạng lưới của Dịch vụ;",
      terms_section10_item8: "thao túng đánh giá, gửi khiếu nại gian dối;",
      terms_section10_item9: "các hành vi vi phạm pháp luật hoặc chính sách của Công ty, hoặc hành vi khác mà Công ty cho là không phù hợp.",
      terms_section11_title: "11. Nghĩa vụ của Nhà cung cấp",
      terms_section11_item1:
        "Nhà cung cấp phải bảo đảm thông tin về bãi đỗ xe (phí, giờ hoạt động, giới hạn phương tiện, lối vào/ra, điều kiện sử dụng, điều kiện hủy/hoàn tiền…) chính xác và luôn được cập nhật.",
      terms_section11_item2:
        "Nhà cung cấp phải bảo đảm an toàn, vệ sinh tại bãi đỗ, và tuân thủ các quy định về kỹ thuật, giao thông, phòng cháy chữa cháy, xây dựng và các quy định liên quan khác.",
      terms_section11_item3:
        "Nhà cung cấp chịu trách nhiệm đối với mọi thiệt hại phát sinh do thiếu quyền hợp pháp, thiếu an toàn hoặc vận hành trái pháp luật tại bãi đỗ của mình.",
      terms_section12_title: "12. Nghĩa vụ của Người lái xe",
      terms_section12_item1: "Người lái xe phải tuân thủ nội quy, điều kiện sử dụng niêm yết tại bãi đỗ và các quy định pháp luật có liên quan.",
      terms_section12_item2:
        "Nếu do lỗi cố ý hoặc vô ý của mình mà Người lái xe gây hư hỏng cơ sở vật chất bãi đỗ hoặc phương tiện khác, Người lái xe phải bồi thường chi phí sửa chữa và các thiệt hại liên quan.",
      terms_section12_item3:
        "Người lái xe tự chịu trách nhiệm đối với phương tiện và tài sản trong xe. Công ty không chịu trách nhiệm đối với việc mất cắp, thất lạc hoặc hư hỏng phương tiện, tài sản.",
      terms_section13_title: "13. Quyền sở hữu Trí tuệ",
      terms_section13_item1:
        "Mọi quyền sở hữu trí tuệ liên quan đến Dịch vụ (bao gồm bản quyền, nhãn hiệu, quyền cơ sở dữ liệu…) thuộc về Công ty hoặc bên cấp phép hợp pháp.",
      terms_section13_item2:
        "Người dùng chỉ được cấp quyền sử dụng Dịch vụ không độc quyền, không chuyển nhượng cho mục đích sử dụng đúng chức năng, và không được sao chép, sửa đổi, phân phối, phát tán nội dung Dịch vụ trừ trường hợp pháp luật cho phép rõ ràng.",
      terms_section14_title: "14. Dữ liệu cá nhân và quyền riêng tư",
      terms_section14_item1: "Công ty xử lý dữ liệu cá nhân của Người dùng theo Chính sách Quyền Riêng Tư do Công ty ban hành.",
      terms_section14_item2:
        "Người dùng có thể thực hiện các quyền theo quy định pháp luật bảo vệ dữ liệu cá nhân của Việt Nam (bao gồm quyền truy cập, chỉnh sửa, xóa, rút lại chấp thuận…) theo quy trình nêu trong Chính sách Quyền Riêng Tư.",
      terms_section15_title: "15.  Miễn trừ trách nhiệm và giới hạn trách nhiệm",
      terms_section15_item1:
        "Dịch vụ được cung cấp theo nguyên tắc “như hiện có”, không có bảo đảm, dù rõ ràng hay ngụ ý, về tính đầy đủ, chính xác, phù hợp cho mục đích cụ thể hoặc không bị gián đoạn.",
      terms_section15_item2:
        "Công ty không chịu trách nhiệm về mọi thiệt hại gián tiếp, đặc biệt, hệ quả, mất lợi nhuận hoặc thiệt hại phát sinh từ hoặc liên quan đến việc sử dụng hoặc không thể sử dụng Dịch vụ.",
      terms_section15_item3:
        "Trong trường hợp trách nhiệm của Công ty được xác định, tổng mức trách nhiệm của Công ty đối với một giao dịch cụ thể được giới hạn ở số tiền Margin mà Công ty thực tế đã nhận được từ giao dịch đó.",
      terms_section15_item4:
        "Giới hạn này không áp dụng đối với phần trách nhiệm mà pháp luật không cho phép loại trừ hoặc hạn chế, hoặc các thiệt hại phát sinh do lỗi cố ý hay lỗi nghiêm trọng của Công ty.",
      terms_section16_title: "16. Bất khả kháng",
      terms_section16_item1:
        "“Bất khả kháng” là sự kiện khách quan, không thể lường trước và không thể khắc phục dù đã áp dụng mọi biện pháp cần thiết (bao gồm thiên tai, chiến tranh, bạo loạn, khủng bố, cháy nổ, lũ lụt, dịch bệnh, mất điện, quyết định của cơ quan nhà nước…).",
      terms_section16_item2:
        "Công ty không chịu trách nhiệm trong phạm vi việc cung cấp Dịch vụ bị chậm trễ hoặc không thực hiện được do sự kiện Bất khả kháng.",
      terms_section17_title: "17. Tạm ngưng và chấm dứt",
      terms_section17_item1:
        "Nếu Công ty có căn cứ hợp lý cho rằng Người dùng vi phạm Điều khoản này hoặc có hành vi gian lận, trái pháp luật, Công ty có thể, không cần thông báo trước, tạm ngưng hoặc gỡ niêm yết bãi đỗ, hủy đặt chỗ hoặc khóa tài khoản của Người dùng.",
      terms_section17_item2: "Quy định này không làm ảnh hưởng đến các quyền bảo vệ người tiêu dùng bắt buộc theo pháp luật hiện hành.",
      terms_section18_title: "18. Giải quyết tranh chấp",
      terms_section18_item1:
        "Khiếu nại, thắc mắc và tranh chấp từ Người dùng trước tiên sẽ được xử lý theo <strong>Chính sách Giải Quyết Tranh Chấp</strong> nội bộ của Công ty.",
      terms_section18_item2:
        "Nếu không thể giải quyết nội bộ, Người dùng có thể đề nghị cơ quan nhà nước có thẩm quyền, tổ chức bảo vệ người tiêu dùng, cơ chế giải quyết tranh chấp thay thế hoặc khởi kiện tại tòa án.",
      terms_section18_item3: "Người tiêu dùng giữ nguyên các quyền về thẩm quyền xét xử bắt buộc theo luật bảo vệ người tiêu dùng có hiệu lực.",
      terms_section19_title: "19.  Luật áp dụng, tòa án có thẩm quyền và ngôn ngữ",
      terms_section19_item1:
        "Điều khoản này được điều chỉnh bởi pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam, không áp dụng các quy tắc xung đột pháp luật.",
      terms_section19_item2:
        "Tranh chấp phát sinh từ hoặc liên quan đến Điều khoản này hoặc Dịch vụ sẽ thuộc thẩm quyền giải quyết của tòa án tại Hà Nội, Việt Nam, trừ khi pháp luật bảo vệ người tiêu dùng có quy định bắt buộc khác về thẩm quyền.",
      terms_section19_item3:
        "Điều khoản này được lập bằng tiếng Nhật, tiếng Anh và tiếng Việt. Trong trường hợp có sự không thống nhất, bản tiếng Việt là bản gốc và được ưu tiên áp dụng.",
      privacy_header_title: "Chính Sách Quyền Riêng Tư Parkchung",
      privacy_header_info: "Có hiệu lực: [*] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      privacy_intro_1:
        "Chính sách Quyền riêng tư này (\"Chính sách\") mô tả cách Parkchung (\"Công ty\", \"chúng tôi\", \"chúng tôi\") thu thập và xử lý dữ liệu cá nhân liên quan đến các dịch vụ marketplace trực tuyến mà chúng tôi vận hành (\"Dịch vụ\").",
      privacy_intro_2: "Trừ khi được định nghĩa khác trong đây, các thuật ngữ viết hoa có nghĩa như được nêu trong Điều khoản Sử dụng của chúng tôi.",
      privacy_section1_title: "1. Nguyên tắc & Pháp luật Áp dụng",
      privacy_section1_item1:
        "Chúng tôi xử lý dữ liệu cá nhân của người dùng (bao gồm Người lái xe, Nhà cung cấp và các người dùng khác của Dịch vụ) tuân thủ các quy định về bảo vệ dữ liệu cá nhân của Việt Nam, bao gồm Nghị định 13/2023/NĐ-CP (\"PDPD\"), và các luật và hướng dẫn áp dụng khác.",
      privacy_section1_item2:
        "Chúng tôi tuân theo các nguyên tắc bảo vệ dữ liệu cốt lõi như giới hạn mục đích, tối thiểu hóa dữ liệu, chính xác, giới hạn lưu trữ, bảo mật và minh bạch, và chúng tôi chỉ xử lý dữ liệu ở mức cần thiết để vận hành Dịch vụ.",
      privacy_section2_title: "2. Dữ liệu Chúng tôi Thu thập",
      privacy_section2_intro:
        "Chúng tôi có thể thu thập và xử lý các danh mục dữ liệu sau, giới hạn ở những gì cần thiết cho các mục đích đã nêu.",
      privacy_data1_title: "<strong>1. Dữ liệu Tài khoản (chủ yếu là Người lái xe và Nhà cung cấp)</strong>",
      privacy_data1_item1: "Tên, số điện thoại, địa chỉ email",
      privacy_data1_item2: "ID đăng nhập, mật khẩu",
      privacy_data1_item3: "Tùy chọn ngôn ngữ, cài đặt thông báo và các cấu hình tài khoản khác",
      privacy_data2_title: "<strong>2. Dữ liệu KYC và Thanh toán (chủ yếu là Nhà cung cấp)</strong>",
      privacy_data2_item1: "Thông tin giấy tờ tùy thân (tên, địa chỉ, ngày sinh, số CMND/CCCD, v.v.)",
      privacy_data2_item2: "Chi tiết tài khoản ngân hàng và thông tin tài khoản thanh toán",
      privacy_data2_item3: "Tài liệu chứng minh quyền vận hành bãi đỗ xe (quyền sở hữu, thuê, thỏa thuận quản lý, v.v.)",
      privacy_data2_item4: "Thông tin cần thiết cho hóa đơn (tên công ty, mã số thuế, địa chỉ đăng ký, v.v.)",
      privacy_data3_title: "<strong>3. Dữ liệu Đặt chỗ, Thanh toán và Quyết toán</strong>",
      privacy_data3_item1: "ID đặt chỗ, ngày/giờ, vị trí bãi đỗ, thời gian bắt đầu/kết thúc, chi tiết phương tiện",
      privacy_data3_item2: "Chi tiết thanh toán trực tuyến: số tiền, phương thức, trạng thái, hoàn tiền, chargeback",
      privacy_data3_item3: "Báo cáo doanh số tiền mặt/tại chỗ cho các giao dịch Thanh toán tại Địa điểm, tóm tắt và chi tiết doanh số được sử dụng để quyết toán Margin với Nhà cung cấp",
      privacy_data4_title: "<strong>4. Dữ liệu Kỹ thuật và Nhật ký</strong>",
      privacy_data4_item1: "Thông tin thiết bị, chi tiết trình duyệt và hệ điều hành, địa chỉ IP",
      privacy_data4_item2: "Nhật ký truy cập, nhật ký lỗi và nhật ký sử dụng",
      privacy_data4_item3: "Định danh và dữ liệu duyệt web thu được thông qua cookies, SDK, pixel và các công nghệ tương tự",
      privacy_data5_title: "<strong>5. Dữ liệu Hỗ trợ và Giao tiếp</strong>",
      privacy_data5_item1: "Nội dung yêu cầu và hỗ trợ",
      privacy_data5_item2: "Hồ sơ khiếu nại và xử lý tranh chấp (tóm tắt cuộc gọi, chat, email, v.v.)",
      privacy_data6_title: "<strong>6. Thông tin Bãi đỗ từ Nguồn Công khai</strong>",
      privacy_data6_item1: "Thông tin bãi đỗ công khai (tên, địa chỉ, số điện thoại, website, giờ mở cửa, phí, v.v.)",
      privacy_data6_item2:
        "Chi tiết liên hệ công khai của người vận hành bãi đỗ hoặc người liên hệ (ví dụ: tên, email, số điện thoại như được công bố trên website doanh nghiệp hoặc hồ sơ mạng xã hội)",
      privacy_data6_item3: "Ở mức độ thông tin như vậy liên quan đến một cá nhân có thể nhận dạng, chúng tôi coi nó là dữ liệu cá nhân và xử lý nó phù hợp với Chính sách này và PDPD.",
      privacy_section3_title: "3. Cơ sở Pháp lý & Mục đích",
      privacy_section3_intro: "1. Chúng tôi sử dụng dữ liệu cá nhân cho các mục đích sau:",
      privacy_purpose1_title: "<strong>Vận hành Dịch vụ</strong>",
      privacy_purpose1_item1: "Hiển thị thông tin bãi đỗ và cung cấp chức năng tìm kiếm",
      privacy_purpose1_item2: "Cho phép đặt chỗ trực tuyến và gửi xác nhận đặt chỗ",
      privacy_purpose1_item3: "Cho phép thanh toán trực tuyến và thực hiện quyết toán hàng tháng hoặc định kỳ",
      privacy_purpose1_item4: "Tạo và quản lý tài khoản người dùng và thực hiện xác thực",
      privacy_purpose2_title: "<strong>Thanh toán cho Nhà cung cấp, Kế toán, Thuế và Kiểm toán</strong>",
      privacy_purpose2_item1: "Quyết toán Margin dựa trên các giao dịch trực tuyến và tại chỗ (tiền mặt)",
      privacy_purpose2_item2: "Duy trì hồ sơ cho kế toán, khai thuế và kiểm toán",
      privacy_purpose3_title: "<strong>Xác minh Danh tính, Ngăn chặn Gian lận và Bảo mật</strong>",
      privacy_purpose3_item1: "KYC và ngăn chặn giả mạo",
      privacy_purpose3_item2: "Ngăn chặn gian lận thanh toán và xử lý chargeback",
      privacy_purpose3_item3: "Giám sát hệ thống, phân tích nhật ký truy cập và phản ứng với sự cố",
      privacy_purpose4_title: "<strong>Hỗ trợ Khách hàng, Khiếu nại và Giải quyết Tranh chấp</strong>",
      privacy_purpose4_item1: "Xử lý yêu cầu và khắc phục sự cố",
      privacy_purpose4_item2: "Quản lý khiếu nại và tranh chấp phù hợp với Điều khoản Sử dụng và Chính sách Giải quyết Tranh chấp của chúng tôi",
      privacy_purpose5_title: "<strong>Cải thiện Dịch vụ, Phân tích và Phát triển Sản phẩm</strong>",
      privacy_purpose5_item1: "Phân tích mô hình sử dụng, cải thiện UI/UX và phát triển tính năng mới",
      privacy_purpose5_item2: "Chủ yếu sử dụng dữ liệu ẩn danh hoặc tổng hợp; khi sử dụng dữ liệu cá nhân, chúng tôi dựa vào cơ sở pháp lý phù hợp như sự đồng ý hoặc lợi ích hợp pháp, theo quy định của pháp luật",
      privacy_purpose6_title: "<strong>Tiếp thị, Quảng cáo và Đo lường</strong>",
      privacy_purpose6_item1: "Gửi thông tin về dịch vụ, khuyến mãi và chiến dịch của chúng tôi",
      privacy_purpose6_item2: "Đo lường hiệu suất quảng cáo, phân bổ theo kênh và các biện pháp chống gian lận",
      privacy_purpose6_item3: "Khi được yêu cầu bởi pháp luật, chúng tôi có được sự đồng ý trước và cung cấp cơ chế từ chối",
      privacy_purpose7_title: "<strong>Tuân thủ Pháp luật và Bảo vệ Quyền</strong>",
      privacy_purpose7_item1: "Tuân thủ nghĩa vụ pháp lý và quy định và phản hồi các yêu cầu hợp pháp",
      privacy_purpose7_item2: "Bảo vệ quyền, tài sản và an toàn của Công ty, người dùng và bên thứ ba",
      privacy_section3_legal_bases: "2. Các cơ sở pháp lý chính mà chúng tôi xử lý dữ liệu cá nhân bao gồm:",
      privacy_legal_basis1: "Thực hiện hoặc chuẩn bị hợp đồng với Người lái xe và Nhà cung cấp (ví dụ: để cung cấp Dịch vụ và xử lý đặt chỗ và quyết toán);",
      privacy_legal_basis2: "Sự đồng ý của người dùng, đặc biệt cho tiếp thị, một số phân tích và chuyển dữ liệu xuyên biên giới khi được yêu cầu;",
      privacy_legal_basis3: "Tuân thủ nghĩa vụ pháp lý (ví dụ: thuế, kế toán, báo cáo quy định);",
      privacy_legal_basis4: "Bảo vệ lợi ích quan trọng của người dùng hoặc bên thứ ba;",
      privacy_legal_basis5: "Lợi ích hợp pháp của Công ty, chẳng hạn như vận hành một marketplace an toàn và hiệu quả, ngăn chặn gian lận và cải thiện Dịch vụ, trong đó các lợi ích như vậy được cân bằng với quyền và tự do của người dùng phù hợp với PDPD.",
      privacy_section4_title: "4. Chia sẻ và Bên Xử lý",
      privacy_section4_item1:
        "Chúng tôi có thể chia sẻ hoặc ủy thác dữ liệu cá nhân cho bên thứ ba trên cơ sở cần biết theo các thỏa thuận xử lý dữ liệu phù hợp bao gồm giới hạn mục đích, biện pháp bảo mật, kiểm soát bên xử lý phụ và quyền kiểm toán. Các bên thứ ba này bao gồm:",
      privacy_section4_item2: "<strong>1. Nhà cung cấp Thanh toán, Tài chính và KYC:</strong> xử lý thanh toán, xử lý chargeback, xác minh danh tính;",
      privacy_section4_item3: "<strong>2. Nhà cung cấp IT và Cloud:</strong> phát triển và bảo trì hệ thống, lưu trữ, sao lưu, giám sát, ghi nhật ký, phân tích;",
      privacy_section4_item4: "<strong>3. Đối tác Tiếp thị và Kênh:</strong> giới thiệu và thu hút, chiến dịch chung, phân bổ và phát hiện gian lận, hỗ trợ khách hàng phối hợp;",
      privacy_section4_item5: "<strong>4. Cố vấn Chuyên nghiệp và Cơ quan:</strong> luật sư, kế toán, kiểm toán viên và cơ quan công quyền khi việc tiết lộ được yêu cầu bởi pháp luật.",
      privacy_section5_title: "5. Cookies, SDK và Pixel",
      privacy_section5_item1:
        "Chúng tôi sử dụng cookies, SDK, pixel và các công nghệ tương tự để tiện lợi, ngăn chặn gian lận, phân tích và mục đích quảng cáo/đo lường.",
      privacy_section5_item2: "Bạn có thể tắt cookies thông qua cài đặt trình duyệt hoặc thiết bị của mình; tuy nhiên, một số tính năng của Dịch vụ có thể không hoạt động đúng nếu cookies bị tắt.",
      privacy_section5_item3:
        "Khi được yêu cầu bởi pháp luật, chúng tôi sẽ có được sự đồng ý cho việc sử dụng các công nghệ như vậy và cung cấp cơ chế để quản lý tùy chọn và từ chối.",
      privacy_section6_title: "6. Chuyển Dữ liệu Xuyên biên giới",
      privacy_section6_item1:
        "Chúng tôi có thể chuyển dữ liệu cá nhân đến, hoặc lưu trữ và xử lý dữ liệu cá nhân tại, các quốc gia ngoài Việt Nam, ví dụ nơi các nhà cung cấp cloud hoặc thực thể nhóm của chúng tôi được đặt.",
      privacy_section6_item2:
        "Khi chúng tôi thực hiện chuyển dữ liệu xuyên biên giới, chúng tôi sẽ tuân thủ PDPD, bao gồm, khi áp dụng:",
      privacy_section6_item2_sub1: "chuẩn bị và duy trì đánh giá tác động chuyển dữ liệu;",
      privacy_section6_item2_sub2: "có được sự đồng ý phù hợp từ chủ thể dữ liệu; và",
      privacy_section6_item2_sub3: "thực hiện các biện pháp bảo vệ hợp đồng với người nhận để đảm bảo bảo vệ đầy đủ dữ liệu cá nhân.",
      privacy_section7_title: "7. Lưu giữ",
      privacy_section7_item1:
        "Chúng tôi chỉ lưu giữ dữ liệu cá nhân trong thời gian cần thiết để thực hiện các mục đích mô tả ở trên hoặc theo yêu cầu của các luật áp dụng (ví dụ: yêu cầu lưu giữ thuế và kế toán).",
      privacy_section7_item2:
        "Khi dữ liệu cá nhân không còn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh hóa nó bằng các phương pháp phù hợp và an toàn.",
      privacy_section8_title: "8. Quyền của Chủ thể Dữ liệu",
      privacy_section8_intro: "1. Theo PDPD và các luật áp dụng khác, bạn có thể có các quyền sau:",
      privacy_section8_item1: "quyền được thông báo;",
      privacy_section8_item2: "quyền truy cập;",
      privacy_section8_item3: "quyền sửa đổi và cập nhật;",
      privacy_section8_item4: "quyền xóa;",
      privacy_section8_item5: "quyền hạn chế hoặc tạm ngừng xử lý (mà chúng tôi sẽ thực hiện, về nguyên tắc, trong vòng 72 giờ);",
      privacy_section8_item6: "quyền yêu cầu cung cấp hoặc tính di động của dữ liệu khi áp dụng;",
      privacy_section8_item7: "quyền phản đối xử lý;",
      privacy_section8_item8: "quyền rút lại sự đồng ý (mà không ảnh hưởng đến tính hợp pháp của việc xử lý trước khi rút lại);",
      privacy_section8_item9: "quyền khiếu nại, tố cáo, khởi kiện, yêu cầu bồi thường thiệt hại và bảo vệ quyền và lợi ích hợp pháp của bạn.",
      privacy_section8_note:
        "2. Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi bằng các chi tiết trong Điều 11. Chúng tôi sẽ phản hồi phù hợp với các luật áp dụng trong khung thời gian hợp lý.",
      privacy_section9_title: "9. Dữ liệu Trẻ em",
      privacy_section9_item1:
        "Dịch vụ của chúng tôi thường dành cho người dùng trưởng thành; tuy nhiên, khi chúng tôi xử lý dữ liệu cá nhân của trẻ em, chúng tôi sẽ áp dụng các biện pháp bảo vệ tăng cường phù hợp với PDPD.",
      privacy_section9_item2:
        "Theo pháp luật Việt Nam, đối với trẻ em từ 7 tuổi trở lên, việc xử lý dữ liệu cá nhân có thể yêu cầu sự đồng ý từ cả trẻ em và cha mẹ/người giám hộ của chúng.",
      privacy_section10_title: "10. Biện pháp Bảo mật",
      privacy_section10_intro: "Chúng tôi thực hiện các biện pháp bảo vệ tổ chức, kỹ thuật và vật lý để bảo vệ dữ liệu cá nhân chống lại truy cập trái phép, mất mát, phá hủy, thay đổi hoặc tiết lộ, bao gồm:",
      privacy_section10_item1: "kiểm soát truy cập dựa trên nguyên tắc đặc quyền tối thiểu;",
      privacy_section10_item2: "mã hóa thông tin liên lạc và cơ sở dữ liệu khi phù hợp;",
      privacy_section10_item3: "ghi nhật ký và dấu vết kiểm toán, quản lý lỗ hổng;",
      privacy_section10_item4: "đào tạo nhân viên và nhà thầu và nghĩa vụ bảo mật;",
      privacy_section10_item5: "quy trình báo cáo sự cố, khắc phục và phòng ngừa.",
      privacy_section11_title: "11. Nhân viên Bảo vệ Dữ liệu (DPO) / Liên hệ",
      privacy_section11_item1:
        "Chúng tôi đã bổ nhiệm một Nhân viên Bảo vệ Dữ liệu (hoặc bộ phận chịu trách nhiệm tương đương) để giám sát tuân thủ các luật bảo vệ dữ liệu.",
      privacy_section11_item2:
        "Đối với bất kỳ câu hỏi nào về Chính sách này hoặc để thực hiện quyền của bạn, vui lòng liên hệ:",
      privacy_section11_email: "Email: <strong>contact@parkchung.com</strong> (kính gửi: DPO / Nhóm Bảo vệ Dữ liệu)",
      privacy_section12_title: "12. Thay đổi & Ngôn ngữ",
      privacy_section12_item1:
        "Chúng tôi có thể cập nhật Chính sách này theo thời gian. Các thay đổi quan trọng sẽ được thông báo một cách hợp lý và, trừ khi được quy định khác, sẽ có hiệu lực khi đăng trên website của chúng tôi.",
      privacy_section12_item2:
        "Chính sách này được lập bằng tiếng Nhật, tiếng Anh và tiếng Việt. Trong trường hợp có sự không thống nhất giữa các phiên bản, phiên bản tiếng Việt sẽ được ưu tiên.",
      privacy_section12_item3:
        "Không có gì trong Chính sách này giới hạn bất kỳ quyền bắt buộc nào của người dùng theo luật bảo vệ người tiêu dùng hoặc bảo vệ dữ liệu của Việt Nam.",
      insurance_page_title: "Chính Sách Bảo Hiểm & Trách Nhiệm Parkchung",
      insurance_page_subtitle: "Thông tin về bảo hiểm và điều khoản trách nhiệm.",
      insurance_header_title: "Chính Sách Bảo Hiểm & Trách Nhiệm Parkchung",
      insurance_header_info: "Có hiệu lực: [•] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      insurance_intro_1:
        "Chính sách Bảo hiểm & Trách nhiệm này (\"Chính sách\") quy định việc phân bổ rủi ro và trách nhiệm cơ bản liên quan đến marketplace trực tuyến do Parkchung (\"Công ty\", \"chúng tôi\", \"chúng tôi\") vận hành.",
      insurance_intro_2: "Trừ khi được định nghĩa khác, các thuật ngữ viết hoa có nghĩa như được nêu trong Điều khoản Sử dụng của chúng tôi (bao gồm Bãi đỗ chỉ đăng thông tin, Bãi đỗ có thể đặt chỗ, Bãi đỗ có thanh toán online, Người lái xe, Nhà cung cấp, v.v.).",
      insurance_section1_title: "1. Nguyên tắc, Không Giữ Hộ và Vai trò của Công ty",
      insurance_section1_item1:
        "Công ty vận hành một <strong>marketplace trực tuyến</strong> cung cấp thông tin bãi đỗ, chức năng đặt chỗ và thanh toán trực tuyến. Chúng tôi không phải là người vận hành bãi đỗ, quản lý hoặc người giữ hộ/phụ trách phương tiện.",
      insurance_section1_item2:
        "Đối với <strong>Bãi đỗ chỉ đăng thông tin</strong>, chúng tôi chỉ biên tập và hiển thị thông tin bãi đỗ công khai. Chúng tôi không phải là một bên trong bất kỳ hợp đồng đỗ xe nào; tất cả các quan hệ và trách nhiệm hợp đồng nằm trực tiếp giữa Người lái xe và người vận hành bãi đỗ.",
      insurance_section1_item3:
        "Đối với <strong>Bãi đỗ có thể đặt chỗ</strong> và <strong>Bãi đỗ có thanh toán online</strong>, chúng tôi chỉ đóng vai trò trung gian (và là đơn vị thanh toán cho Bãi đỗ có thanh toán online) và không nhận nghĩa vụ giữ hộ hoặc bảo quản đối với phương tiện hoặc tài sản.",
      insurance_section1_item4:
        "Trừ khi được yêu cầu rõ ràng bởi pháp luật áp dụng, Công ty không chịu trách nhiệm trực tiếp về tai nạn, trộm cắp hoặc thiệt hại liên quan đến cơ sở bãi đỗ, phương tiện hoặc nội dung phương tiện.",
      insurance_section2_title: "2. Trách nhiệm của Người lái xe",
      insurance_section2_item1:
        "Người lái xe <strong>chịu trách nhiệm hoàn toàn</strong> về phương tiện và tài sản của họ. Rủi ro trộm cắp, thiệt hại hoặc mất mát khi đỗ xe vẫn thuộc về Người lái xe, người nên dựa vào bảo hiểm xe máy của chính họ hoặc bảo hiểm khác phù hợp.",
      insurance_section2_item2:
        "Nếu Người lái xe gây thiệt hại cho bên thứ ba (người dùng khác, hàng xóm, v.v.) liên quan đến đỗ xe, Người lái xe chịu trách nhiệm, bằng chi phí của chính họ, để bồi thường thiệt hại như vậy.",
      insurance_section2_item3:
        "Người lái xe phải tuân thủ các luật áp dụng, quy tắc và điều kiện được đăng tại cơ sở bãi đỗ, và bất kỳ cảnh báo hoặc hướng dẫn nào được hiển thị thông qua Dịch vụ. Người lái xe không được mang vật liệu nguy hiểm, lạm dụng lửa hoặc làm tổn hại an toàn tại hoặc xung quanh cơ sở bãi đỗ.",
      insurance_section3_title: "3. Trách nhiệm của Nhà cung cấp",
      insurance_section3_item1:
        "Nhà cung cấp đại diện và đảm bảo rằng họ có quyền và thẩm quyền hợp pháp (quyền sở hữu, quyền thuê, quyền quản lý, v.v.) và giấy phép/đăng ký cần thiết để cung cấp các chỗ đỗ xe liên quan thông qua Dịch vụ.",
      insurance_section3_item2: "Nhà cung cấp phải duy trì cơ sở bãi đỗ của họ trong tình trạng an toàn, bao gồm:",
      insurance_section3_item2_sub1: "ánh sáng đầy đủ, đánh dấu, chặn bánh xe và biển báo lối vào/lối ra;",
      insurance_section3_item2_sub2: "tuân thủ các quy định phòng cháy chữa cháy và các quy tắc xây dựng, quy hoạch và giao thông áp dụng khác;",
      insurance_section3_item2_sub3: "tuân thủ các tiêu chuẩn và quy tắc kỹ thuật liên quan theo pháp luật Việt Nam.",
      insurance_section3_item3:
        "Nhà cung cấp chịu trách nhiệm về tổn thất mà Người lái xe hoặc bên thứ ba phải chịu do lỗi cấu trúc, hỏng hóc thiết bị, biển báo không đủ, vi phạm nghĩa vụ an toàn, thiếu quyền hợp pháp hoặc các hành vi/thiếu sót khác trong phạm vi kiểm soát của họ.",
      insurance_section3_item4:
        "Đối với Bãi đỗ chỉ đăng thông tin, tất cả trách nhiệm về vận hành, an toàn và tuân thủ pháp luật thuộc về người vận hành bãi đỗ thực tế hoặc người nắm quyền; Công ty không chịu trách nhiệm về các vấn đề này.",
      insurance_section4_title: "4. Trách nhiệm và Giới hạn của Công ty",
      insurance_section4_item1:
        "Công ty sẽ sử dụng nỗ lực hợp lý để vận hành các hệ thống đặt chỗ và thanh toán một cách an toàn, nhưng không đảm bảo hoạt động không gián đoạn hoặc không có lỗi của Dịch vụ.",
      insurance_section4_item2:
        "Công ty có thể hỗ trợ giải quyết tranh chấp giữa người dùng (ví dụ: Người lái xe và Nhà cung cấp) nhưng không phải là bên bồi thường trực tiếp trong các tranh chấp như vậy.",
      insurance_section4_item3:
        "Khi trách nhiệm của Công ty được xác lập theo pháp luật áp dụng, trách nhiệm tổng hợp tối đa của Công ty đối với bất kỳ giao dịch nào được giới hạn ở số tiền hoa hồng (Margin) thực tế mà Công ty nhận được cho giao dịch đó.",
      insurance_section4_item4:
        "Giới hạn này không áp dụng cho các trách nhiệm không thể loại trừ hoặc giới hạn theo pháp luật Việt Nam, cũng như các tổn thất do hành vi cố ý hoặc sơ suất nghiêm trọng của Công ty gây ra.",
      insurance_section4_item5:
        "Đối với Bãi đỗ chỉ đăng thông tin, nghĩa vụ của Công ty được giới hạn ở việc xem xét hợp lý và, khi phù hợp, sửa đổi hoặc xóa thông tin rõ ràng không chính xác hoặc không phù hợp sau khi được thông báo.",
      insurance_section5_title: "5. Bảo hiểm",
      insurance_section5_item1:
        "Hiện tại, Công ty không cung cấp bất kỳ sản phẩm bảo hiểm độc quyền hoặc chương trình bồi thường nào (chẳng hạn như bảo hiểm đỗ xe cụ thể).",
      insurance_section5_item2:
        "Người lái xe chịu trách nhiệm duy trì bất kỳ bảo hiểm xe máy bắt buộc nào và xem xét bất kỳ bảo hiểm tùy chọn nào mà họ cho là phù hợp.",
      insurance_section5_item3:
        "Nhà cung cấp chịu trách nhiệm xem xét và sắp xếp, theo quyết định và chi phí của chính họ, bảo hiểm phù hợp như bảo hiểm trách nhiệm cơ sở/công cộng, bảo hiểm cháy và các chính sách liên quan khác.",
      insurance_section5_item4:
        "Nếu, trong tương lai, Công ty hoặc một công ty bảo hiểm đối tác cung cấp các sản phẩm bảo hiểm tùy chọn, các điều khoản và điều kiện cụ thể của các sản phẩm như vậy sẽ được ưu tiên so với Chính sách này ở mức độ không nhất quán.",
      insurance_section6_title: "6. Bất khả kháng",
      insurance_section6_item1:
        "\"Bất khả kháng\" có nghĩa là một sự kiện xảy ra một cách khách quan, không thể lường trước và không thể ngăn chặn hoặc khắc phục mặc dù đã thực hiện tất cả các biện pháp cần thiết và hợp lý (bao gồm nhưng không giới hạn ở thiên tai, lũ lụt, động đất, chiến tranh, bạo loạn, khủng bố, dịch bệnh, mất điện, lỗi mạng quy mô lớn và hành động của chính phủ).",
      insurance_section6_item2:
        "Công ty không chịu trách nhiệm về sự chậm trễ hoặc thất bại trong việc cung cấp Dịch vụ ở mức độ do các sự kiện Bất khả kháng gây ra.",
      insurance_section7_title: "7. Bồi thường",
      insurance_section7_item1:
        "Người lái xe sẽ bảo vệ, bồi thường và giữ cho Công ty không bị tổn hại khỏi các tổn thất, chi phí và khiếu nại (bao gồm phí pháp lý) phát sinh từ việc Người lái xe vi phạm Chính sách này hoặc Điều khoản Sử dụng, hoặc từ hành vi cố ý hoặc sơ suất của họ đối với bên thứ ba (Nhà cung cấp, người vận hành, người dùng khác, v.v.), ở mức độ được pháp luật cho phép.",
      insurance_section7_item2:
        "Nhà cung cấp cũng sẽ bảo vệ, bồi thường và giữ cho Công ty không bị tổn hại khỏi các tổn thất, chi phí và khiếu nại phát sinh từ việc thiếu quyền hợp pháp, vi phạm an toàn, trình bày sai hoặc các vi phạm/lỗi khác liên quan đến chỗ đỗ xe của họ.",
      insurance_section7_item3:
        "Các bồi thường này chỉ áp dụng ở mức độ được pháp luật Việt Nam cho phép và không làm tổn hại đến bất kỳ quyền bắt buộc nào của người tiêu dùng.",
      insurance_section8_title: "8. Thông báo Sự cố (Tai nạn, Trộm cắp, v.v.)",
      insurance_section8_item1:
        "Trong trường hợp tai nạn, trộm cắp, thương tích cá nhân hoặc hỏng hóc thiết bị lớn tại cơ sở bãi đỗ, người dùng nên ưu tiên an toàn trước và, khi phù hợp, liên hệ cảnh sát, dịch vụ khẩn cấp và/hoặc công ty bảo hiểm của họ.",
      insurance_section8_item2:
        "Người dùng sau đó nên thông báo cho Công ty về sự cố càng sớm càng thực tế, tốt nhất là trong vòng 48 giờ, và cung cấp thông tin và bằng chứng liên quan (ảnh, video, tài liệu, biên lai, v.v.) để hỗ trợ phối hợp.",
      insurance_section8_item3:
        "Sự chậm trễ trong thông báo có thể ảnh hưởng đến khả năng điều tra và phản hồi của Công ty hoặc các bên khác, ở mức độ không bị pháp luật cấm, nhưng sự chậm trễ như vậy không tự động làm mất bất kỳ quyền pháp định bắt buộc nào của người tiêu dùng.",
      insurance_section9_title: "9. Bảo vệ Người tiêu dùng và Tính Khả thi",
      insurance_section9_item1:
        "Không có gì trong Chính sách này ghi đè hoặc giới hạn bất kỳ sự bảo vệ bắt buộc nào được trao cho người tiêu dùng theo luật bảo vệ người tiêu dùng Việt Nam hoặc các quy tắc bắt buộc áp dụng khác.",
      insurance_section9_item2:
        "Nếu bất kỳ quy định nào của Chính sách này được coi là không hợp lệ, bất hợp pháp hoặc không thể thực thi, các quy định còn lại sẽ tiếp tục có hiệu lực đầy đủ.",
      insurance_section10_title: "10. Giải quyết Tranh chấp",
      insurance_section10_content:
        "Khiếu nại và tranh chấp phát sinh liên quan đến Chính sách này sẽ được xử lý phù hợp với <strong>Chính sách Giải quyết Tranh chấp</strong> và <strong>Điều khoản Sử dụng</strong> của Công ty (giải quyết nội bộ → cơ quan có thẩm quyền/cơ quan người tiêu dùng/ADR → tòa án).",
      dispute_page_title: "Chính Sách Giải Quyết Tranh Chấp Parkchung",
      dispute_page_subtitle: "Cách chúng tôi xử lý và giải quyết tranh chấp giữa người dùng.",
      dispute_header_title: "Chính Sách Giải Quyết Tranh Chấp Parkchung",
      dispute_header_info: "Có hiệu lực: [•] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      dispute_intro_1:
        "Chính sách Giải quyết Tranh chấp này (\"Chính sách\") quy định cách Parkchung (\"Công ty\", \"chúng tôi\", \"chúng tôi\") xử lý khiếu nại và tranh chấp liên quan đến các dịch vụ marketplace trực tuyến mà chúng tôi vận hành (\"Dịch vụ\").",
      dispute_intro_2: "Trừ khi được định nghĩa khác, các thuật ngữ viết hoa có nghĩa như được nêu trong Điều khoản Sử dụng của chúng tôi.",
      dispute_section1_title: "1. Nguyên tắc",
      dispute_section1_item1:
        "Công ty tìm cách giải quyết khiếu nại và tranh chấp liên quan đến người dùng (bao gồm Người lái xe và Nhà cung cấp) và/hoặc Công ty một cách <strong>nhanh chóng, công bằng và minh bạch</strong>.",
      dispute_section1_item2:
        "Chúng tôi ưu tiên giải quyết hòa giải thông qua xử lý nội bộ và đàm phán. Nếu điều đó không thành công, các bên có thể chuyển lên các cơ quan bên ngoài và, cuối cùng, lên tòa án, phù hợp với pháp luật Việt Nam.",
      dispute_section1_item3:
        "Công ty sẽ hành động thiện chí và phù hợp với các luật Việt Nam áp dụng và hướng dẫn do các cơ quan có thẩm quyền ban hành.",
      dispute_section2_title: "2. Phạm vi Khiếu nại và Tranh chấp",
      dispute_section2_item1: "Chính sách này áp dụng cho các khiếu nại và tranh chấp bao gồm, không giới hạn:",
      dispute_section2_item1_sub1: "sự khác biệt giữa đặt chỗ và dịch vụ thực tế được cung cấp (mức độ dịch vụ, giá cả, v.v.);",
      dispute_section2_item1_sub2: "các vấn đề liên quan đến hủy bỏ, hoàn tiền và không đến;",
      dispute_section2_item1_sub3: "tranh chấp về phí, thanh toán và quyết toán;",
      dispute_section2_item1_sub4: "phản đối thông tin không chính xác hoặc không phù hợp liên quan đến Bãi đỗ chỉ đăng thông tin;",
      dispute_section2_item1_sub5: "bất kỳ khiếu nại hoặc tranh chấp nào khác phát sinh từ hoặc liên quan đến việc sử dụng Dịch vụ.",
      dispute_section2_item2:
        "Trách nhiệm thực chất liên quan đến vận hành, an toàn và bảo trì cơ sở bãi đỗ chủ yếu thuộc về Nhà cung cấp hoặc người vận hành bãi đỗ. Vai trò của Công ty là hỗ trợ giải quyết tranh chấp với tư cách là trung gian, phù hợp với Chính sách Bảo hiểm & Trách nhiệm của chúng tôi.",
      dispute_section3_title: "3. Nộp và Xác nhận Khiếu nại",
      dispute_section3_item1: "Khiếu nại, phản đối và yêu cầu liên quan nên được gửi đến:",
      dispute_section3_item1_email: "Email: contact@parkchung.com",
      dispute_section3_item2:
        "Công ty sẽ xác nhận nhận được khiếu nại trong vòng 3 ngày làm việc kể từ khi nhận được, về nguyên tắc.",
      dispute_section3_item3:
        "Công ty sẽ bắt đầu xem xét và đàm phán trong vòng 7 ngày làm việc kể từ khi nhận được và sẽ cố gắng cung cấp phản hồi thực chất hoặc cập nhật tạm thời trong một khoảng thời gian hợp lý, tùy thuộc vào độ phức tạp của vấn đề.",
      dispute_section4_title: "4. Các Bước Giải quyết",
      dispute_section4_intro:
        "Vì mục đích điều tra và giải quyết, Công ty có thể yêu cầu thông tin bổ sung, bao gồm ID đặt chỗ, chi tiết thanh toán, ảnh/video và hồ sơ giao tiếp giữa các bên.",
      dispute_section4_stage1_title: "<strong>Giai đoạn 1 – Xử lý Nội bộ</strong>",
      dispute_section4_stage1_item1:
        "Công ty sẽ xem xét các sự kiện, thu thập thông tin từ Người lái xe, Nhà cung cấp và/hoặc các bên liên quan khác, và đánh giá tình hình.",
      dispute_section4_stage1_item2:
        "Dựa trên việc xem xét này, Công ty sẽ cố gắng đề xuất một <strong>giải pháp</strong> trong khung thời gian hợp lý, có thể bao gồm hoàn tiền, thực hiện lại, giảm giá, sửa đổi thông tin hoặc các biện pháp khắc phục khác, khi phù hợp.",
      dispute_section4_stage2_title: "<strong>Giai đoạn 2 – Cơ quan và Tổ chức Bên ngoài</strong>",
      dispute_section4_stage2_item1:
        "Nếu tranh chấp không thể được giải quyết nội bộ, các bên có thể chuyển vấn đề lên các cơ quan bảo vệ người tiêu dùng Việt Nam, các tổ chức hòa giải được công nhận hoặc các tổ chức trọng tài ở Việt Nam.",
      dispute_section4_stage2_item2:
        "Công ty sẽ hợp tác với các cơ quan và tổ chức như vậy phù hợp với pháp luật áp dụng.",
      dispute_section4_stage3_title: "<strong>Giai đoạn 3 – Tòa án</strong>",
      dispute_section4_stage3_item1:
        "Cuối cùng, các tranh chấp có thể được đưa ra trước các tòa án Việt Nam có thẩm quyền để giải quyết cuối cùng.",
      dispute_section4_stage3_item2:
        "Công ty và người dùng có thể tìm kiếm biện pháp pháp lý khi họ cho là cần thiết và phù hợp.",
      dispute_section5_title: "5. Trọng tài và Quyền Người tiêu dùng",
      dispute_section5_item1:
        "Trong các tranh chấp người tiêu dùng, việc sử dụng trọng tài yêu cầu sự đồng ý rõ ràng của người tiêu dùng, theo yêu cầu của pháp luật Việt Nam.",
      dispute_section5_item2:
        "Ngay cả khi có thỏa thuận trọng tài, người tiêu dùng có thể giữ quyền truy cập tòa án ở mức độ được quy định bởi pháp luật bắt buộc của Việt Nam.",
      dispute_section5_item3:
        "Phương thức hòa giải hoặc trọng tài (trực tiếp, trực tuyến hoặc kết hợp) sẽ tuân theo các luật áp dụng và quy tắc của các tổ chức liên quan.",
      dispute_section6_title: "6. Luật Áp dụng và Thẩm quyền",
      dispute_section6_item1:
        "Chính sách này và các thủ tục giải quyết tranh chấp được nêu ở đây được điều chỉnh bởi pháp luật Việt Nam.",
      dispute_section6_item2:
        "Theo nguyên tắc chung, các tranh chấp thuộc thẩm quyền của các tòa án tại <strong>Hà Nội</strong>, nơi Công ty đặt trụ sở.",
      dispute_section6_item3:
        "Điều này không làm tổn hại đến bất kỳ quyền địa điểm bắt buộc nào được trao cho người tiêu dùng theo luật bảo vệ người tiêu dùng Việt Nam hoặc các luật bắt buộc khác.",
      dispute_section7_title: "7. Vai trò của Công ty và Mối quan hệ với Các Chính sách Khác",
      dispute_section7_item1:
        "Vai trò của Công ty theo Chính sách này là tạo điều kiện và hỗ trợ giải quyết tranh chấp với tư cách là trung gian. Việc tham gia vào điều tra, đàm phán, hòa giải hoặc trọng tài <strong>không</strong> tự nó tạo ra các nghĩa vụ hoặc trách nhiệm hợp đồng bổ sung cho Công ty ngoài những gì được nêu trong <strong>Điều khoản Sử dụng</strong> và <strong>Chính sách Bảo hiểm & Trách nhiệm</strong>.",
      dispute_section7_item2:
        "Chính sách này không mở rộng hoặc sửa đổi giới hạn trách nhiệm hoặc phân bổ rủi ro của Công ty như được định nghĩa trong <strong>Điều khoản Sử dụng</strong> và <strong>Chính sách Bảo hiểm & Trách nhiệm</strong> và phải được giải thích cùng với các tài liệu đó.",
      dispute_section8_title: "8. Thay đổi và Ngôn ngữ",
      dispute_section8_item1:
        "Công ty có thể sửa đổi Chính sách này theo thời gian. Các thay đổi quan trọng sẽ được thông báo một cách hợp lý và, trừ khi được nêu khác, sẽ có hiệu lực khi đăng trên website của chúng tôi.",
      dispute_section8_item2:
        "Chính sách này được lập bằng tiếng Nhật, tiếng Anh và tiếng Việt. Trong trường hợp có sự không thống nhất giữa các phiên bản ngôn ngữ, phiên bản <strong>tiếng Việt</strong> sẽ được ưu tiên.",
      dispute_section8_item3:
        "Không có gì trong Chính sách này giới hạn hoặc làm tổn hại đến bất kỳ quyền bắt buộc nào có sẵn cho người dùng theo luật bảo vệ người tiêu dùng hoặc bảo vệ dữ liệu Việt Nam.",
      security_page_title: "Chính Sách An Ninh Thông Tin Parkchung",
      security_page_subtitle: "Cam kết của chúng tôi về bảo mật thông tin và bảo vệ dữ liệu.",
      security_header_title: "Chính Sách An Ninh Thông Tin Parkchung",
      security_header_info: "Có hiệu lực: [•] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      security_intro_1:
        "Chính sách An ninh này (\"Chính sách\") mô tả cách Parkchung (\"Công ty\", \"chúng tôi\", \"chúng tôi\") bảo vệ tài sản thông tin, hệ thống và dịch vụ của mình liên quan đến marketplace trực tuyến mà chúng tôi vận hành (\"Dịch vụ\").",
      security_intro_2:
        "Việc xử lý cụ thể dữ liệu cá nhân được điều chỉnh bởi <strong>Chính sách Quyền riêng tư</strong> của chúng tôi; Chính sách này tập trung vào các biện pháp bảo mật kỹ thuật và tổ chức hỗ trợ các thực hành đó.",
      security_section1_title: "1. Mục đích, Phạm vi và Khung Pháp lý",
      security_section1_item1:
        "Mục đích của Chính sách này là bảo vệ tài sản thông tin của Công ty và Dịch vụ chống lại truy cập trái phép, tiết lộ, thay đổi và phá hủy, và vận hành an toàn và liên tục phù hợp với pháp luật Việt Nam và các thực hành ngành được công nhận.",
      security_section1_item2:
        "Chính sách này áp dụng cho tất cả các cá nhân tham gia vận hành hoặc hỗ trợ Dịch vụ, bao gồm cán bộ, nhân viên, thực tập sinh, nhà thầu và nhà cung cấp (\"Nhân sự\").",
      security_section1_item3: "Trong việc triển khai các biện pháp bảo mật, chúng tôi tính đến, trong số những điều khác:",
      security_section1_item3_sub1: "Các quy định bảo vệ dữ liệu của Việt Nam, bao gồm Nghị định 13/2023 (PDPD);",
      security_section1_item3_sub2: "Luật An toàn Thông tin Mạng, Luật An ninh Mạng và các nghị định liên quan (ví dụ: Nghị định 53/2022);",
      security_section1_item3_sub3: "các tiêu chuẩn và thực hành bảo mật được công nhận quốc tế (ví dụ: ISO/IEC 27001/27002, OWASP).",
      security_section2_title: "2. Quản trị và Vai trò",
      security_section2_item1:
        "Công ty bổ nhiệm một <strong>Người đứng đầu An ninh Thông tin</strong> (tương đương CISO) chịu trách nhiệm về quản trị bảo mật tổng thể, triển khai Chính sách này và giám sát các sự cố lớn.",
      security_section2_item2:
        "Một <strong>Nhân viên Bảo vệ Dữ liệu (DPO)</strong> hoặc đơn vị tương đương chịu trách nhiệm về các vấn đề liên quan đến PDPD như quyền của chủ thể dữ liệu, thủ tục chuyển dữ liệu xuyên biên giới và thông báo quy định.",
      security_section2_item3:
        "Trưởng phòng ban chịu trách nhiệm quản lý quyền truy cập, giám sát các thỏa thuận bên thứ ba và đảm bảo đào tạo trong lĩnh vực của họ.",
      security_section2_item4:
        "Tất cả Nhân sự phải tuân thủ Chính sách này và các thủ tục liên quan, duy trì bảo mật và hoàn thành ít nhất <strong>đào tạo bảo mật và quyền riêng tư hàng năm</strong>.",
      security_section3_title: "3. Tuân thủ Luật pháp và Tiêu chuẩn",
      security_section3_item1:
        "Trong trường hợp vi phạm dữ liệu cá nhân, Công ty sẽ tuân thủ các yêu cầu PDPD, bao gồm <strong>thông báo 72 giờ</strong> cho các cơ quan liên quan (như MPS/A05) và, khi được yêu cầu, thông báo cho các chủ thể dữ liệu bị ảnh hưởng.",
      security_section3_item2:
        "Công ty tuân theo các nguyên tắc xử lý sự cố nhanh chóng, chính xác và phối hợp theo Luật An toàn Thông tin Mạng và hướng dẫn liên quan.",
      security_section3_item3:
        "Khi có chuyển dữ liệu cá nhân xuyên biên giới, Công ty sẽ chuẩn bị và duy trì <strong>đánh giá tác động chuyển dữ liệu</strong> và thực hiện các hồ sơ cần thiết với Bộ Công an, theo yêu cầu của PDPD, cùng với các biện pháp bảo vệ hợp đồng phù hợp.",
      security_section3_item4:
        "Nếu, trong tương lai, Công ty phải tuân thủ các yêu cầu về địa phương hóa dữ liệu hoặc hiện diện địa phương theo Luật An ninh Mạng và các nghị định liên quan, Công ty sẽ đánh giá và tuân thủ các yêu cầu như vậy, bao gồm triển khai các biện pháp kỹ thuật và tổ chức cần thiết.",
      security_section4_title: "4. Quản lý Rủi ro và ISMS",
      security_section4_item1:
        "Công ty thực hiện ít nhất đánh giá rủi ro hàng năm đối với tài sản thông tin của mình, duy trì danh mục tài sản và phân loại tài sản theo mức độ quan trọng (bảo mật, tính toàn vẹn, khả năng sử dụng).",
      security_section4_item2:
        "Công ty duy trì khung quản lý bảo mật phù hợp với các tiêu chuẩn như ISO/IEC 27001/27002, bao gồm chính sách, thủ tục và hồ sơ, và xem xét chúng thường xuyên.",
      security_section4_item3:
        "Các rủi ro và sự cố quan trọng được chuyển lên quản lý cấp cao, với các hành động khắc phục và quyết định đầu tư phù hợp được thực hiện khi cần thiết.",
      security_section5_title: "5. Quản lý Truy cập",
      security_section5_item1:
        "Truy cập vào hệ thống và dữ liệu được cấp trên cơ sở đặc quyền tối thiểu, với sự phân tách nhiệm vụ phù hợp.",
      security_section5_item2:
        "Xác thực đa yếu tố (MFA) được yêu cầu cho truy cập quản trị và cho quản lý từ xa hoặc các hoạt động nhạy cảm khác, khi phù hợp.",
      security_section5_item3:
        "Tài khoản người dùng được quản lý trong suốt vòng đời của chúng (onboarding, thay đổi vai trò, offboarding), với xem xét quyền truy cập hàng quý.",
      security_section5_item4:
        "Các hoạt động đặc quyền và thay đổi cấu hình quan trọng được ghi nhật ký, với lưu trữ nhật ký kiểm toán chống giả mạo trong một khoảng thời gian lưu giữ được xác định.",
      security_section6_title: "6. Mã hóa và Thông tin Bảo mật",
      security_section6_item1:
        "Dữ liệu trong quá trình truyền được bảo vệ bằng TLS 1.2 trở lên (ưu tiên TLS 1.3), và thông tin nhạy cảm như mật khẩu và dữ liệu liên quan đến thanh toán được bảo vệ thêm thông qua băm hoặc mã hóa.",
      security_section6_item2:
        "Dữ liệu khi lưu trữ được mã hóa bằng AES-256 hoặc các thuật toán tiêu chuẩn ngành tương đương, hoặc các biện pháp bảo vệ tương đương.",
      security_section6_item3:
        "Khóa mã hóa và chứng chỉ được quản lý riêng biệt (ví dụ: thông qua dịch vụ quản lý khóa cloud), với các thủ tục xoay vòng và thu hồi được xác định.",
      security_section6_item4:
        "Công ty không lưu trữ số thẻ thanh toán trực tiếp và thay vào đó dựa vào các <strong>bộ xử lý thanh toán tuân thủ PCI DSS</strong> cho các giao dịch thẻ.",
      security_section7_title: "7. Phát triển An toàn và Bảo mật Cloud",
      security_section7_item1:
        "Bảo mật được tích hợp vào vòng đời phát triển phần mềm (SSDLC), với các đánh giá bảo mật được thực hiện ở các giai đoạn quan trọng (yêu cầu, thiết kế, triển khai, kiểm thử, phát hành).",
      security_section7_item2:
        "Công ty quản lý rủi ro liên quan đến các thành phần mã nguồn mở và bên thứ ba thông qua phân tích thành phần phần mềm (SCA) và sử dụng phân tích tĩnh và động (SAST/DAST) khi phù hợp.",
      security_section7_item3:
        "Ứng dụng web được thiết kế phù hợp với hướng dẫn OWASP Top 10/ASVS, và Công ty nhằm thực hiện ít nhất <strong>kiểm thử thâm nhập hàng năm</strong> cho các dịch vụ quan trọng.",
      security_section7_item4:
        "Trong môi trường cloud, Công ty áp dụng cấu hình thực hành tốt nhất, bao gồm phân đoạn mạng, sử dụng WAF và IDS/IPS, mã hóa mặc định của lưu trữ và cấm tiếp xúc công khai không cần thiết (ví dụ: bucket mở).",
      security_section7_item5:
        "Cấu hình hạ tầng được quản lý dưới dạng mã (IaC) khi khả thi, với kiểm soát phiên bản và theo dõi thay đổi.",
      security_section8_title: "8. Ghi nhật ký, Giám sát và Quản lý Lỗ hổng",
      security_section8_item1:
        "Công ty thu thập và giám sát nhật ký truy cập, hoạt động và lỗi một cách tập trung, với mục tiêu phát hiện hành vi bất thường hoặc đáng ngờ.",
      security_section8_item2:
        "Nhật ký được lưu trữ với các biện pháp bảo vệ phù hợp chống lại truy cập trái phép và giả mạo và được lưu giữ trong các khoảng thời gian được yêu cầu bởi pháp luật và nhu cầu kinh doanh.",
      security_section8_item3:
        "Công ty giám sát các cảnh báo lỗ hổng cho hệ điều hành, middleware và ứng dụng, và áp dụng các bản vá theo <strong>thỏa thuận mức dịch vụ (SLA)</strong> được xác định (ví dụ: Lỗ hổng Nghiêm trọng trong vòng 7 ngày, Lỗ hổng Cao trong vòng 14 ngày), với quy trình chấp nhận rủi ro cho các ngoại lệ.",
      security_section8_item4:
        "Các thủ tục rollback và sửa chữa khẩn cấp được đặt ra cho các cập nhật có thể ảnh hưởng đến tính ổn định dịch vụ.",
      security_section9_title: "9. Quản lý Bên thứ ba và Nhà cung cấp",
      security_section9_item1:
        "Khi chọn nhà cung cấp hoặc bên xử lý xử lý dữ liệu cá nhân hoặc thông tin quan trọng, Công ty đánh giá các thực hành bảo mật và bảo vệ dữ liệu của họ.",
      security_section9_item2:
        "Công ty ký kết các điều khoản bảo vệ dữ liệu và bảo mật (ví dụ: DPA) với các bên xử lý, giải quyết giới hạn mục đích, bảo mật, biện pháp bảo mật, kiểm soát bên xử lý phụ và nghĩa vụ thông báo vi phạm kịp thời.",
      security_section9_item3:
        "Các bên xử lý phải thông báo ngay cho Công ty về bất kỳ vi phạm dữ liệu cá nhân hoặc sự cố bảo mật khác để cho phép Công ty đáp ứng nghĩa vụ báo cáo 72 giờ của mình khi áp dụng.",
      security_section9_item4:
        "Khi có chuyển dữ liệu xuyên biên giới, cả Công ty và các bên xử lý của nó phải tuân thủ các yêu cầu PDPD, bao gồm đánh giá tác động, hồ sơ và biện pháp bảo vệ hợp đồng.",
      security_section10_title: "10. Phản ứng Sự cố",
      security_section10_item1:
        "Công ty duy trì các thủ tục phản ứng sự cố được ghi chép bao gồm chuẩn bị-phát hiện-ngăn chặn-loại bỏ-phục hồi-bài học kinh nghiệm, và đảm bảo Nhân sự liên quan quen thuộc với chúng.",
      security_section10_item2:
        "Mức độ nghiêm trọng của sự cố được xác định, và đối với các sự cố lớn, phản ứng ban đầu (bao gồm xác định phạm vi và ngăn chặn) được khởi động trong vòng một ngày làm việc khi thực tế.",
      security_section10_item3:
        "Đối với các sự cố liên quan đến dữ liệu cá nhân, Công ty sẽ thông báo cho các cơ quan có thẩm quyền và, khi được yêu cầu, người dùng bị ảnh hưởng phù hợp với PDPD và các luật áp dụng khác.",
      security_section10_item4:
        "Xử lý sự cố được ghi chép, và phân tích nguyên nhân gốc rễ và các hành động khắc phục được triển khai để ngăn chặn tái diễn.",
      security_section11_title: "11. Tính Liên tục Kinh doanh và Phục hồi Thảm họa",
      security_section11_item1:
        "Đối với các hệ thống quan trọng, Công ty xác định mục tiêu thời gian phục hồi (RTO) và mục tiêu điểm phục hồi (RPO), và thực hiện sao lưu thường xuyên và ít nhất kiểm thử khôi phục hàng năm.",
      security_section11_item2:
        "Hạ tầng cloud được thiết kế với dự phòng (ví dụ: trên các vùng khả dụng) để giảm tác động của lỗi.",
      security_section11_item3:
        "Công ty duy trì kế hoạch tính liên tục kinh doanh (BCP) xác định ưu tiên và thủ tục để duy trì hoặc khôi phục các dịch vụ thiết yếu trong trường hợp gián đoạn lớn.",
      security_section12_title: "12. An ninh Vật lý và Văn phòng",
      security_section12_item1:
        "Công ty dựa vào bảo mật vật lý và chứng nhận của các trung tâm dữ liệu của nhà cung cấp dịch vụ cloud của mình.",
      security_section12_item2:
        "Đối với văn phòng và các địa điểm vật lý khác dưới sự kiểm soát của Công ty, các biện pháp phù hợp như kiểm soát truy cập, đăng ký khách thăm và lưu trữ và xử lý an toàn tài liệu và phương tiện được triển khai.",
      security_section13_title: "13. An ninh Nhân sự",
      security_section13_item1:
        "Theo pháp luật áp dụng, Công ty có thể thực hiện kiểm tra trước khi tuyển dụng phù hợp và yêu cầu nhân viên và nhà thầu ký kết thỏa thuận bảo mật (NDA) khi tham gia.",
      security_section13_item2:
        "Nhân sự nhận được ít nhất đào tạo bảo mật và quyền riêng tư hàng năm, và vi phạm có thể dẫn đến các biện pháp kỷ luật phù hợp với quy tắc nội bộ và hợp đồng.",
      security_section13_item3:
        "Quyền truy cập được giới hạn ở những gì cần thiết cho mỗi vai trò, và tài khoản được vô hiệu hóa ngay lập tức và đặc quyền bị thu hồi khi chấm dứt hoặc kết thúc hợp đồng.",
      security_section14_title: "14. Tối thiểu hóa Dữ liệu, Lưu giữ và Xóa",
      security_section14_item1:
        "Công ty chỉ thu thập và xử lý dữ liệu cá nhân ở mức cần thiết cho các mục đích được chỉ định và tránh thu thập hoặc lưu giữ không cần thiết (tối thiểu hóa dữ liệu).",
      security_section14_item2:
        "Thời gian lưu giữ và thủ tục xóa được xác định phù hợp với Chính sách Quyền riêng tư và các luật áp dụng; khi dữ liệu không còn cần thiết, nó được xóa an toàn hoặc ẩn danh hóa.",
      security_section14_item3:
        "Yêu cầu từ chủ thể dữ liệu (ví dụ: truy cập, sửa đổi, xóa, hạn chế) được xử lý phù hợp với các thủ tục được nêu trong Chính sách Quyền riêng tư và PDPD.",
      security_section15_title: "15. Tiết lộ Lỗ hổng và Safe Harbor",
      security_section15_item1:
        "Công ty hoan nghênh báo cáo lỗ hổng thiện chí từ các nhà nghiên cứu bảo mật và người dùng và nhằm cung cấp cách tiếp cận safe-harbor hợp lý cho các báo cáo như vậy.",
      security_section15_item2:
        "Tuy nhiên, các hoạt động vi phạm pháp luật hoặc Điều khoản Sử dụng của chúng tôi—chẳng hạn như truy cập trái phép, rò rỉ dữ liệu, phá hủy dữ liệu hoặc gián đoạn dịch vụ—không được phép.",
      security_section15_item3: "Lỗ hổng có thể được báo cáo đến:",
      security_section15_item3_email: "Email: <strong>contact@parkchung.com</strong> (vui lòng bao gồm \"Security\" hoặc \"Vulnerability\" trong dòng chủ đề).",
      security_section15_item3_note: "Khi cần, Công ty có thể nhận báo cáo được mã hóa cho thông tin nhạy cảm.",
      security_section16_title: "16. Xem xét và Cập nhật",
      security_section16_item1:
        "Công ty xem xét Chính sách này ít nhất hàng năm và bất cứ khi nào có thay đổi quan trọng về luật pháp, công nghệ hoặc hoạt động kinh doanh, và cập nhật nó khi cần thiết.",
      security_section16_item2:
        "Phiên bản mới nhất của Chính sách này được xuất bản trên website của Công ty và thường có hiệu lực khi đăng, trừ khi được nêu khác.",
      security_section16_item3:
        "Trong trường hợp có sự không thống nhất giữa Chính sách này và các chính sách khác của Công ty, <strong>Chính sách Quyền riêng tư</strong> điều chỉnh việc xử lý dữ liệu cá nhân, trong khi <strong>Điều khoản Sử dụng</strong> và <strong>Chính sách Bảo hiểm & Trách nhiệm</strong> điều chỉnh phân bổ và giới hạn trách nhiệm và giải quyết tranh chấp.",
      driver_page_title: "Điều Khoản & Chính Sách Đặt Chỗ cho Người Lái Xe Parkchung",
      driver_page_subtitle: "Điều khoản và chính sách dành cho người lái xe sử dụng dịch vụ đặt chỗ đỗ xe của chúng tôi.",
      driver_header_title: "Điều Khoản & Chính Sách Đặt Chỗ cho Người Lái Xe Parkchung",
      driver_header_info: "Có hiệu lực: [•] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      driver_intro_1:
        "Tài liệu này bổ sung cho Điều khoản Sử dụng Parkchung, Chính sách Bảo hiểm & Trách nhiệm, Chính sách Quyền riêng tư, Chính sách Giải quyết Tranh chấp và Chính sách An ninh.",
      driver_intro_2:
        "Các thuật ngữ viết hoa (Công ty, Dịch vụ, Người lái xe, Nhà cung cấp, Số tiền Giao dịch, Biên lợi nhuận, Ngày Thanh toán, v.v.) có nghĩa như được nêu trong Điều khoản Sử dụng.",
      driver_sectionA_title: "A. Điều Khoản Người Lái Xe (Chung) v2.1",
      driver_section1_title: "1. Phạm vi & Chấp nhận",
      driver_section1_item1:
        'Các điều khoản này áp dụng cho các cá nhân ("Người lái xe") sử dụng Parkchung ("Công ty") để xem thông tin, đặt chỗ và sử dụng chỗ đỗ xe thông qua marketplace trực tuyến của chúng tôi ("Dịch vụ").',
      driver_section1_item2:
        "Bằng cách nhấp để chấp nhận trực tuyến, bạn tham gia vào một hợp đồng điện tử và đồng ý bị ràng buộc bởi các điều khoản và chính sách liên quan này. Hợp đồng không bị từ chối hiệu lực chỉ vì hình thức điện tử của nó.",
      driver_section1_item3:
        "Các cập nhật quan trọng sẽ được thông báo một cách hợp lý và thường có hiệu lực khi đăng, không làm ảnh hưởng đến bất kỳ quyền bảo vệ người tiêu dùng bắt buộc nào theo pháp luật Việt Nam.",
      driver_section2_title: "2. Các Loại Đỗ Xe & Vai trò của Parkchung",
      driver_section2_item1: "Chỗ đỗ xe trên Dịch vụ được phân loại rộng rãi như sau:",
      driver_section2_item1a:
        "<strong>Đỗ xe Chỉ Thông tin:</strong> Parkchung xuất bản thông tin (tên, địa chỉ, chi tiết liên hệ, v.v.) dựa trên các nguồn công khai (ví dụ: Google Maps, website, Facebook) hoặc thông tin do Nhà cung cấp cung cấp. Không có đặt chỗ hoặc thanh toán nào được xử lý qua Parkchung.",
      driver_section2_item1b:
        "<strong>Đỗ xe Có thể Đặt - Thanh toán Tại Địa điểm / Thanh toán Sau:</strong> Người lái xe đặt chỗ qua Parkchung và thanh toán Số tiền Giao dịch trực tiếp cho Nhà cung cấp tại địa điểm.",
      driver_section2_item1c:
        "<strong>Đỗ xe Có thể Đặt - Thanh toán Trực tuyến (Thanh toán Ngay):</strong> Người lái xe đặt chỗ qua Parkchung và thanh toán trước toàn bộ hoặc một phần Số tiền Giao dịch trực tuyến cho Công ty. Công ty hoạt động với tư cách là Đại lý Thanh toán (như được định nghĩa trong Điều khoản Sử dụng), nhận Số tiền Giao dịch và chuyển phần của Nhà cung cấp vào Ngày Thanh toán.",
      driver_section2_item2:
        "Đối với mỗi danh sách, danh mục áp dụng và phương thức thanh toán có sẵn (Thanh toán Tại Địa điểm / Thanh toán Sau và/hoặc Thanh toán Ngay) được tiết lộ rõ ràng trên trang danh sách và tại thanh toán.",
      driver_section2_item3:
        "Parkchung hoạt động chỉ với tư cách là nền tảng trung gian và không phải là nhà khai thác cơ sở đỗ xe hoặc người giữ hộ/người giám hộ. Trách nhiệm chính về vận hành, an toàn và tình trạng của cơ sở đỗ xe thuộc về Nhà cung cấp hoặc nhà khai thác cơ sở (như được mô tả thêm trong <strong>Chính sách Bảo hiểm & Trách nhiệm</strong>).",
      driver_section2_item4:
        "Nếu Người lái xe liên hệ và giao dịch với Nhà cung cấp trực tiếp dựa trên thông tin hiển thị trên Parkchung, các giao dịch như vậy diễn ra bên ngoài luồng đặt chỗ và thanh toán của Parkchung. Parkchung không phải là bên ký kết hợp đồng cho các giao dịch đó và không xử lý các khoản thanh toán liên quan.",
      driver_section3_title: "3. Đặt chỗ & Phương thức Thanh toán",
      driver_section3_item1:
        "Đối với đỗ xe Có thể Đặt (2.1.2 và 2.1.3), Người lái xe có thể chọn giữa Thanh toán Tại Địa điểm / Thanh toán Sau và Thanh toán Ngay, trong phạm vi được hỗ trợ bởi danh sách liên quan.",
      driver_section3_item2:
        "Theo Thanh toán Tại Địa điểm / Thanh toán Sau, Người lái xe thanh toán toàn bộ Số tiền Giao dịch trực tiếp cho Nhà cung cấp tại địa điểm. Parkchung không nhận Số tiền Giao dịch; thay vào đó, Nhà cung cấp khấu trừ Biên lợi nhuận đã thỏa thuận và chuyển cho Parkchung vào Ngày Thanh toán phù hợp với Điều khoản Sử dụng.",
      driver_section3_item3:
        "Theo Thanh toán Ngay, Người lái xe thanh toán trước toàn bộ hoặc một phần Số tiền Giao dịch cho Parkchung thông qua Dịch vụ. Parkchung, hoạt động với tư cách là Đại lý Thanh toán, nhận Số tiền Giao dịch và chuyển phần của Nhà cung cấp vào Ngày Thanh toán. Quy tắc hủy, hoàn tiền và chargeback cho đặt chỗ Thanh toán Ngay được nêu trong Điều 7 và Chính sách Hủy & Hoàn tiền của Người lái xe.",
      driver_section4_title: "4. Tính Khả dụng & Điều kiện Sử dụng",
      driver_section4_item1:
        "Ngày/giờ có thể đặt, đơn vị đặt tối thiểu, hạn chế truy cập, giới hạn phương tiện (chiều cao, chiều rộng, v.v.) và các điều kiện khác được đặt bởi mỗi Nhà cung cấp và được tiết lộ trong danh sách và trên trang thanh toán trước khi bạn gửi đặt chỗ.",
      driver_section4_item2:
        "Parkchung cung cấp một bước xác nhận trước hợp đồng, cho phép bạn xem xét và sửa các đầu vào của mình trước khi gửi cuối cùng, phù hợp với quy định thương mại điện tử của Việt Nam.",
      driver_section5_title: "5. Vào & Ra",
      driver_section5_item1:
        "Bạn có thể vào chỗ đỗ xe vào hoặc sau thời gian bắt đầu đặt chỗ và phải rời khỏi chỗ đỗ trước thời gian kết thúc.",
      driver_section5_item2:
        "Phương thức vào/ra cụ thể (cổng có nhân viên, rào chắn tự động, mã QR, v.v.) được xác định bởi điều kiện danh sách và hướng dẫn của Nhà cung cấp.",
      driver_section6_title: "6. Gia hạn & Ở quá giờ",
      driver_section6_item1:
        "Quy tắc về việc ở quá thời gian đặt chỗ ban đầu được nêu trong <strong>Chính sách Gia hạn & Ở quá giờ của Người lái xe</strong>.",
      driver_section6_item2:
        "Parkchung có thể hoặc không cung cấp chức năng gia hạn trực tuyến (ví dụ: nút gia hạn trong ứng dụng). Khi chức năng như vậy không có sẵn, bạn phải tham khảo Nhà cung cấp trực tiếp tại địa điểm để yêu cầu bất kỳ gia hạn nào.",
      driver_section7_title: "7. Hủy, Hoàn tiền & Không xuất hiện",
      driver_section7_item1:
        "Hủy, hoàn tiền và không xuất hiện được điều chỉnh bởi <strong>Chính sách Hủy & Hoàn tiền của Người lái xe</strong>.",
      driver_section7_item2:
        "Đối với đặt chỗ <strong>Thanh toán Tại Địa điểm / Thanh toán Sau</strong>, nếu bạn hủy sau thời gian hủy miễn phí được nêu trong danh sách hoặc không xuất hiện, bạn <strong>có nghĩa vụ hợp đồng</strong> phải thanh toán phí hủy áp dụng được chỉ định trong danh sách cho Công ty, trừ khi bị cấm hoặc hạn chế bởi luật bảo vệ người tiêu dùng Việt Nam hoặc các luật bắt buộc khác.",
      driver_section7_item3:
        "Do các ràng buộc kỹ thuật và thực tế, Công ty có thể không thu ngay hoặc tự động các phí hủy này cho đặt chỗ Thanh toán Tại Địa điểm / Thanh toán Sau. Điều này <strong>không làm mất nghĩa vụ thanh toán của bạn</strong>. Công ty có thể theo đuổi các biện pháp hợp lý cho các phí hủy chưa thanh toán, bao gồm yêu cầu thanh toán, hạn chế đặt chỗ trong tương lai, hạn chế bạn chỉ đặt chỗ Thanh toán Ngay, hoặc đình chỉ tài khoản của bạn.",
      driver_section8_title: "8. Hành vi Bị Cấm",
      driver_section8_content:
        "<strong>Chiếm dụng trái phép hoặc chặn truy cập</strong>, mang vật liệu nguy hiểm, gây phiền toái, thiệt hại tài sản, thao túng đánh giá, lạm dụng hệ thống, hoặc bất kỳ hành vi bất hợp pháp hoặc lạm dụng nào vi phạm các điều khoản này, điều kiện danh sách hoặc pháp luật áp dụng đều bị cấm.",
      driver_section9_title: "9. Thiệt hại & Trách nhiệm",
      driver_section9_item1:
        "Parkchung là nhà cung cấp nền tảng và không phải là bên bồi thường trực tiếp cho thiệt hại đối với cơ sở đỗ xe, phương tiện hoặc tài sản. Trách nhiệm chính thuộc về Người lái xe hoặc Nhà cung cấp, như được mô tả trong <strong>Chính sách Bảo hiểm & Trách nhiệm</strong>.",
      driver_section9_item2:
        "Trong phạm vi Parkchung bị coi là có trách nhiệm đối với Người lái xe theo pháp luật Việt Nam, tổng trách nhiệm của Parkchung đối với một đặt chỗ được giới hạn ở Biên lợi nhuận (hoa hồng) thực tế nhận được bởi Parkchung cho đặt chỗ đó, trừ khi giới hạn như vậy không thể áp dụng theo luật bắt buộc hoặc cho các tổn thất do hành vi sai trái cố ý hoặc sơ suất nghiêm trọng của Parkchung.",
      driver_section10_title: "10. Quyền riêng tư",
      driver_section10_content:
        "<strong>Dữ liệu cá nhân</strong> được xử lý phù hợp với <strong>Chính sách Quyền riêng tư Parkchung</strong> (tuân thủ PDPD).",
      driver_section11_title: "11. Khiếu nại & Tranh chấp",
      driver_section11_item1: "Khiếu nại và yêu cầu có thể được gửi đến: contact@parkchung.com.",
      driver_section11_item2:
        "Quy trình giải quyết tranh chấp tuân theo <strong>Chính sách Giải quyết Tranh chấp</strong> (xử lý nội bộ → cơ quan có thẩm quyền/ADR → tòa án), không làm ảnh hưởng đến quyền người tiêu dùng bắt buộc.",
      driver_section12_title: "12. Luật Điều chỉnh & Ngôn ngữ",
      driver_section12_content:
        "Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Trong trường hợp có sự khác biệt giữa các phiên bản ngôn ngữ, phiên bản tiếng Việt sẽ được ưu tiên.",
      driver_sectionB_title: "B. Chính sách Gia hạn & Ở quá giờ của Người lái xe v2.0",
      driver_extension_section1_title: "1. Phạm vi",
      driver_extension_section1_content:
        "Chính sách này áp dụng cho tất cả các đặt chỗ được thực hiện qua Parkchung với thời gian bắt đầu và kết thúc được xác định, bất kể phương thức thanh toán (Thanh toán Tại Địa điểm / Thanh toán Sau hoặc Thanh toán Ngay).",
      driver_extension_section2_title: "2. Yêu cầu Gia hạn",
      driver_extension_section2_item1:
        "Parkchung có thể không cung cấp chức năng gia hạn trực tuyến (ví dụ: nút gia hạn trong ứng dụng) cho một số danh sách hoặc tại một số thời điểm. Khi không có chức năng như vậy được cung cấp, bạn phải liên hệ Nhà cung cấp trực tiếp tại địa điểm nếu bạn muốn ở quá thời gian kết thúc ban đầu của mình.",
      driver_extension_section2_item2:
        "Nếu Parkchung cung cấp chức năng gia hạn trực tuyến cho một danh sách, các thủ tục, đơn vị tăng và phí hiển thị trên Dịch vụ cho danh sách đó sẽ được ưu tiên, và Chính sách này có thể được cập nhật tương ứng.",
      driver_extension_section3_title: "3. Phê duyệt Gia hạn & Phí",
      driver_extension_section3_item1:
        "Liệu một gia hạn có được phép hay không, và theo điều kiện nào, được quyết định bởi Nhà cung cấp dựa trên tính khả dụng không gian, chính sách vận hành và các hoàn cảnh liên quan khác. Parkchung không đảm bảo rằng bất kỳ yêu cầu gia hạn nào sẽ được phê duyệt hoặc một mức phí cụ thể sẽ áp dụng.",
      driver_extension_section3_item2:
        "Đối với đặt chỗ <strong>Thanh toán Tại Địa điểm / Thanh toán Sau</strong>, nếu một gia hạn được phê duyệt, phí gia hạn thường được thanh toán trực tiếp bởi Người lái xe cho Nhà cung cấp tại địa điểm, ngoài Số tiền Giao dịch ban đầu.",
      driver_extension_section3_item3:
        "Đối với đặt chỗ <strong>Thanh toán Ngay</strong>, bất kỳ phí gia hạn được phê duyệt nào phải được thanh toán qua chức năng thanh toán trực tuyến của Parkchung như một khoản phí bổ sung. Phương thức và thời gian áp dụng của các khoản phí như vậy (ví dụ: tính phí ngay lập tức hoặc tính phí hợp nhất sau sử dụng) được tiết lộ trong danh sách và tại thanh toán.",
      driver_extension_section4_title: "4. Ở quá giờ (Gia hạn Trái phép)",
      driver_extension_section4_item1:
        "Ở lại trong chỗ đỗ xe quá thời gian kết thúc đặt chỗ mà không có sự đồng ý của Nhà cung cấp cấu thành ở quá giờ (gia hạn trái phép).",
      driver_extension_section4_item2:
        "Trong trường hợp ở quá giờ, Nhà cung cấp có thể thực hiện các biện pháp phù hợp với quy tắc đã đăng và pháp luật áp dụng, bao gồm tính phí bổ sung, sắp xếp di chuyển phương tiện hoặc từ chối sử dụng trong tương lai. Các chi phí và tổn thất như vậy do Người lái xe chịu.",
      driver_extension_section4_item3:
        "Parkchung có thể đình chỉ hoặc hạn chế các tài khoản liên tục ở quá giờ hoặc lạm dụng Dịch vụ theo cách khác.",
      driver_extension_section5_title: "5. Vấn đề Hệ thống & Bất khả kháng",
      driver_extension_section5_item1:
        "Nếu lỗi hệ thống, vấn đề kết nối hoặc các sự kiện bất khả kháng khác ảnh hưởng đến khả năng xử lý gia hạn hoặc thoát đúng giờ của bạn, bạn nên liên hệ Nhà cung cấp và hỗ trợ Parkchung càng sớm càng hợp lý và làm theo bất kỳ thủ tục giải pháp tạm thời hợp lý nào được hướng dẫn.",
      driver_extension_section5_item2:
        "Định nghĩa bất khả kháng và giới hạn trách nhiệm của Parkchung tuân theo Điều khoản Sử dụng và Chính sách Bảo hiểm & Trách nhiệm.",
      driver_sectionC_title: "C. Chính sách Hủy & Hoàn tiền của Người lái xe v2.1",
      driver_cancellation_section1_title: "1. Phạm vi & Nguyên tắc Cơ bản",
      driver_cancellation_section1_item1:
        "Chính sách này điều chỉnh hủy, hoàn tiền và không xuất hiện cho đặt chỗ đỗ xe được thực hiện qua Parkchung.",
      driver_cancellation_section1_item2:
        "Cơ chế khác nhau giữa đặt chỗ <strong>Thanh toán Tại Địa điểm / Thanh toán Sau</strong> và <strong>Thanh toán Ngay</strong>. Phương thức thanh toán và điều kiện áp dụng cho mỗi đặt chỗ được hiển thị trên danh sách và tại thanh toán.",
      driver_cancellation_section2_title: "2. Đặt chỗ Thanh toán Tại Địa điểm / Thanh toán Sau - Hủy & Không xuất hiện",
      driver_cancellation_section2_item1:
        "Đối với đặt chỗ <strong>Thanh toán Tại Địa điểm / Thanh toán Sau</strong>, Parkchung không nhận Số tiền Giao dịch tại thời điểm đặt chỗ, vì vậy thường không có 'hoàn tiền' được xử lý bởi chính Parkchung.",
      driver_cancellation_section2_item2:
        "Mỗi danh sách có thể chỉ định một <strong>thời gian hủy miễn phí</strong> và một <strong>phí hủy</strong> áp dụng sau thời gian đó. Các điều khoản này được tiết lộ trên trang danh sách và tại thanh toán.",
      driver_cancellation_section2_item3:
        "Nếu bạn hủy <strong>trong</strong> thời gian hủy miễn phí, bạn thường sẽ không có nghĩa vụ thanh toán cho đặt chỗ đó (trừ khi bạn đồng ý riêng với Nhà cung cấp tại địa điểm).",
      driver_cancellation_section2_item4:
        "Nếu bạn hủy <strong>sau</strong> thời gian hủy miễn phí hoặc nếu bạn <strong>không xuất hiện</strong>, bạn <strong>có nghĩa vụ hợp đồng</strong> phải thanh toán phí hủy được chỉ định trong danh sách cho Công ty, trừ khi bị cấm hoặc hạn chế bởi luật bảo vệ người tiêu dùng Việt Nam hoặc các luật bắt buộc khác.",
      driver_cancellation_section2_item5:
        "Do các ràng buộc kỹ thuật và thực tế, Công ty có thể không thu ngay hoặc tự động các phí hủy này cho đặt chỗ Thanh toán Tại Địa điểm / Thanh toán Sau. Điều này <strong>không làm mất</strong> nghĩa vụ thanh toán của bạn. Công ty có thể theo đuổi các biện pháp hợp lý cho các phí hủy chưa thanh toán, bao gồm yêu cầu thanh toán trực tuyến, bù trừ qua các giao dịch Thanh toán Ngay trong tương lai khi hợp pháp và phù hợp, hạn chế đặt chỗ trong tương lai, hạn chế bạn chỉ đặt chỗ Thanh toán Ngay, hoặc đình chỉ tài khoản của bạn.",
      driver_cancellation_section2_item6:
        "Bất kể những điều trên, bạn nên hủy càng sớm càng tốt một khi bạn biết bạn sẽ không sử dụng một đặt chỗ, để tránh hủy phút cuối và không xuất hiện.",
      driver_cancellation_section3_title: "3. Đặt chỗ Thanh toán Ngay - Hủy, Hoàn tiền & Không xuất hiện",
      driver_cancellation_section3_item1:
        "Đối với đặt chỗ Thanh toán Ngay, mỗi danh sách tiết lộ thời hạn hủy áp dụng, phí hủy và xử lý không xuất hiện.",
      driver_cancellation_section3_item2:
        "Nếu bạn hủy trong thời gian hủy miễn phí (nếu có), Parkchung thường sẽ hoàn lại <strong>toàn bộ Số tiền Giao dịch</strong> cho phương thức thanh toán ban đầu của bạn.",
      driver_cancellation_section3_item3:
        "Nếu bạn hủy <strong>sau</strong> thời gian hủy miễn phí, phí hủy (ví dụ: toàn bộ hoặc một phần Số tiền Giao dịch) được tiết lộ trong danh sách sẽ áp dụng. Parkchung sẽ hoàn lại bất kỳ số tiền còn lại nào (nếu có) cho phương thức thanh toán ban đầu của bạn.",
      driver_cancellation_section3_item4:
        "Đối với <strong>không xuất hiện</strong> (thất bại xuất hiện mà không hủy), hoàn tiền thường không được cung cấp, và Parkchung có thể áp dụng toàn bộ Số tiền Giao dịch cho các khoản thanh toán cho Nhà cung cấp và Biên lợi nhuận của Parkchung, trong phạm vi được phép bởi pháp luật.",
      driver_cancellation_section3_item5:
        "Khi một khoản hoàn tiền được đến hạn, Parkchung sẽ xử lý hoàn tiền cho phương thức thanh toán ban đầu trong một khung thời gian hợp lý. Thời gian ghi có thực tế có thể thay đổi tùy thuộc vào bộ xử lý thanh toán và điều kiện hệ thống.",
      driver_cancellation_section4_title: "4. Hủy do Nhà cung cấp hoặc Nền tảng",
      driver_cancellation_section4_item1:
        'Nếu Nhà cung cấp không thể cung cấp một không gian đã đặt do lý do của chính họ, Người lái xe không có nghĩa vụ thanh toán, và đối với đặt chỗ "Thanh toán Ngay", Parkchung thường sẽ phát hành hoàn tiền đầy đủ.',
      driver_cancellation_section4_item2:
        "Nếu lỗi hệ thống của Parkchung dẫn đến một đặt chỗ được hình thành không đúng hoặc tính phí trùng lặp, Parkchung sẽ hoàn lại đầy đủ bất kỳ số tiền giao dịch sai hoặc trùng lặp nào.",
      driver_cancellation_section4_item3:
        'Đối với đặt chỗ "Thanh toán Tại Địa điểm / Thanh toán Sau" nơi Nhà cung cấp đã thu thanh toán nhưng không thể cung cấp không gian, Parkchung sẽ hợp tác với Nhà cung cấp để tạo điều kiện hoàn tiền phù hợp cho Người lái xe.',
      driver_cancellation_section5_title: "5. Chargeback & Gian lận",
      driver_cancellation_section5_content:
        'Đặt chỗ "Thanh toán Ngay" liên quan đến gian lận nghi ngờ, thẻ bị đánh cắp hoặc các vấn đề tương tự được quản lý theo quy tắc của bộ xử lý thanh toán, bao gồm chargeback. Nếu một số tiền giao dịch không được thanh toán cuối cùng cho Parkchung và/hoặc Nhà cung cấp do chargeback hoặc đảo ngược, cả Parkchung và Nhà cung cấp đều không có nghĩa vụ thực hiện hoặc duy trì thanh toán cho Người lái xe cho đặt chỗ đó, trừ khi được yêu cầu bởi pháp luật.',
      driver_cancellation_section6_title: "6. Bảo vệ Người tiêu dùng",
      driver_cancellation_section6_content:
        "Không có gì trong Chính sách này hạn chế bất kỳ quyền nào được cấp cho Người lái xe theo luật bảo vệ người tiêu dùng Việt Nam hoặc các quy định pháp lý bắt buộc khác.",
      supplier_page_title: "Điều Khoản & Chính Sách Dành Cho Nhà Cung Cấp Parkchung",
      supplier_page_subtitle: "Điều khoản và chính sách dành cho nhà cung cấp đăng bãi đỗ xe trên nền tảng của chúng tôi.",
      supplier_header_title: "Điều Khoản & Chính Sách Dành Cho Nhà Cung Cấp Parkchung",
      supplier_header_info: "Có hiệu lực: [•] / Cập nhật lần cuối: 21 tháng 11 năm 2025",
      supplier_intro_1:
        "Tài liệu này hoạt động cùng với Điều khoản Sử dụng Parkchung, Chính sách Bảo hiểm & Trách nhiệm, Chính sách Quyền riêng tư, Chính sách Giải quyết Tranh chấp và Chính sách An ninh.",
      supplier_intro_2:
        "Các thuật ngữ viết hoa (Công ty, Dịch vụ, Người lái xe, Nhà cung cấp, Số tiền Giao dịch, Biên lợi nhuận, Ngày Thanh toán, v.v.) có nghĩa như được nêu trong Điều khoản Sử dụng.",
      supplier_sectionA_title: "A. Điều Khoản Nhà Cung Cấp (Chung) v2.0",
      supplier_section1_title: "1. Áp dụng & Thứ bậc",
      supplier_section1_item1:
        'Các điều khoản này áp dụng cho mỗi Nhà cung cấp đã ký kết một Thỏa thuận Nhà cung cấp bằng văn bản hoặc được thực hiện theo cách khác với Parkchung ("Công ty").',
      supplier_section1_item2:
        "Trong trường hợp có sự không thống nhất giữa Thỏa thuận Nhà cung cấp và các Điều khoản Nhà cung cấp này, Thỏa thuận Nhà cung cấp được ưu tiên, tiếp theo là các Điều khoản Nhà cung cấp này và các chính sách chung của Công ty (Điều khoản Sử dụng, Chính sách Bảo hiểm & Trách nhiệm, Chính sách Quyền riêng tư, Chính sách Giải quyết Tranh chấp, Chính sách An ninh), trừ khi được đồng ý rõ ràng khác.",
      supplier_section2_title: "2. Định nghĩa & Tham chiếu chéo",
      supplier_section2_intro:
        "Trừ khi được định nghĩa khác ở đây, các thuật ngữ viết hoa tuân theo các định nghĩa trong Điều khoản Sử dụng Parkchung. Cụ thể:",
      supplier_section2_item1: "<strong>Dịch vụ:</strong> marketplace đỗ xe trực tuyến được vận hành bởi Công ty.",
      supplier_section2_item2:
        "<strong>Số tiền Giao dịch:</strong> tổng số tiền Người lái xe thanh toán cho một đặt chỗ, trực tiếp cho Nhà cung cấp (tiền mặt/tại địa điểm) hoặc trực tuyến cho Công ty.",
      supplier_section2_item3:
        "<strong>Biên lợi nhuận:</strong> tỷ lệ hoa hồng đã thỏa thuận mà Công ty được trả thù lao (ví dụ: 15%).",
      supplier_section2_item4:
        "<strong>Ngày Thanh toán:</strong> ngày mà Công ty thanh toán cho Nhà cung cấp (hoặc Nhà cung cấp thanh toán cho Công ty) các số tiền ròng cho tháng trước, sau khi khấu trừ/áp dụng Biên lợi nhuận và bất kỳ khoản bù trừ đã thỏa thuận nào.",
      supplier_section3_title: "3. Các Loại Đỗ Xe & Vai trò của Parkchung",
      supplier_section3_item1: "Chỗ đỗ xe trên Dịch vụ được phân loại rộng rãi như sau:",
      supplier_section3_item1a:
        "<strong>Đỗ xe Chỉ Thông tin:</strong> Công ty xuất bản thông tin (tên, địa chỉ, chi tiết liên hệ, v.v.) dựa trên các nguồn công khai (Google Maps, website, Facebook, v.v.) hoặc thông tin do Nhà cung cấp cung cấp. Không có chức năng đặt chỗ hoặc thanh toán nào được cung cấp qua Parkchung.",
      supplier_section3_item1b:
        "<strong>Đỗ xe Có thể Đặt - Thanh toán Tại Địa điểm / Thanh toán Sau:</strong> Người lái xe đặt chỗ qua Parkchung và thanh toán Số tiền Giao dịch trực tiếp cho Nhà cung cấp tại địa điểm vào thời điểm sử dụng.",
      supplier_section3_item1c:
        "<strong>Đỗ xe Có thể Đặt - Thanh toán Trực tuyến (Thanh toán Ngay):</strong> Người lái xe đặt chỗ qua Parkchung và thanh toán trước toàn bộ hoặc một phần Số tiền Giao dịch trực tuyến cho Công ty. Công ty hoạt động với tư cách là Đại lý Thanh toán, nhận Số tiền Giao dịch và chuyển phần của Nhà cung cấp vào Ngày Thanh toán.",
      supplier_section3_item2:
        "Đối với mỗi danh sách, danh mục áp dụng và phương thức thanh toán được hỗ trợ (Thanh toán Tại Địa điểm / Thanh toán Sau và/hoặc Thanh toán Ngay) phải được chỉ định rõ ràng trên trang danh sách và tại thanh toán, phù hợp với UI của Dịch vụ và trách nhiệm của Nhà cung cấp về tính chính xác.",
      supplier_section3_item3:
        "Công ty hoạt động chỉ với tư cách là nền tảng trung gian và không phải là nhà khai thác cơ sở đỗ xe hoặc người giữ hộ/người giám hộ. Trách nhiệm chính về tuân thủ pháp luật, an toàn và tình trạng của cơ sở đỗ xe thuộc về Nhà cung cấp và nhà khai thác cơ sở (như được mô tả thêm trong Chính sách Bảo hiểm & Trách nhiệm).",
      supplier_section3_item4:
        "Đối với Đỗ xe Chỉ Thông tin, nếu Người lái xe liên hệ và giao dịch với Nhà cung cấp trực tiếp dựa trên thông tin hiển thị trên Parkchung, các giao dịch như vậy diễn ra bên ngoài luồng đặt chỗ/thanh toán của Parkchung. Công ty không phải là bên ký kết hợp đồng cho các giao dịch đó và không xử lý các khoản thanh toán liên quan.",
      supplier_section4_title: "4. Đủ điều kiện Nhà cung cấp & KYC",
      supplier_section4_item1:
        "Nhà cung cấp đại diện và đảm bảo rằng họ nắm giữ các quyền hợp pháp hợp lệ (quyền sở hữu, thuê, quyền quản lý, v.v.) để cung cấp các chỗ đỗ xe được liệt kê và sở hữu giấy phép/giấy phép cần thiết theo pháp luật áp dụng (quy định đỗ xe, an toàn cháy nổ, quy tắc xây dựng/quy hoạch đô thị, v.v.).",
      supplier_section4_item2:
        "Theo yêu cầu của Công ty, Nhà cung cấp phải cung cấp thông tin KYC chính xác và cập nhật, bằng chứng về quyền, chi tiết tài khoản ngân hàng, thông tin hóa đơn/thuế và các tài liệu yêu cầu khác.",
      supplier_section4_item3:
        "Nhà cung cấp sẽ hợp tác với các kiểm tra hợp lý của Công ty liên quan đến trừng phạt, chống rửa tiền, phòng chống gian lận và tuân thủ pháp luật.",
      supplier_section5_title: "5. Điều kiện Danh sách, Vận hành Tại địa điểm & Hành vi Bị cấm",
      supplier_section5_item1:
        "Nhà cung cấp phải tiết lộ chính xác giá cả, giờ khả dụng, đơn vị đặt tối thiểu, hạn chế phương tiện, quy tắc nội bộ, điều khoản hủy và các điều kiện danh sách khác, và cập nhật chúng ngay lập tức khi có bất kỳ thay đổi nào.",
      supplier_section5_item2:
        "Nhà cung cấp phải thực hiện các biện pháp an toàn hợp lý, bao gồm chiếu sáng, đánh dấu, biển báo vào/ra và đăng quy tắc tại địa điểm, đồng thời tuân thủ các luật và mã kỹ thuật áp dụng (ví dụ: mã an toàn cháy nổ, tiêu chuẩn QCVN).",
      supplier_section5_item3:
        "Nhà cung cấp không được tham gia vào các thỏa thuận tiền tệ mờ ám hoặc ngoài nền tảng, chẳng hạn như phụ phí ẩn hoặc thanh toán phụ không công bằng mâu thuẫn với danh sách.",
      supplier_section5_item4:
        'Không có sự chấp thuận trước của Công ty, Nhà cung cấp không được chuyển hướng Người lái xe khỏi "Parkchung" một cách không đúng đắn sang các kênh thanh toán thay thế (ví dụ: chuyển khoản ngoài nền tảng) bỏ qua các luồng đã thỏa thuận.',
      supplier_section5_item5:
        "Nhà cung cấp phải thông báo cho Công ty ít nhất 24 giờ trước (khi khả thi hợp lý) về bất kỳ đóng cửa tạm thời, không khả dụng hoặc thay đổi quan trọng của không gian dự kiến, và hợp tác với các điều chỉnh hoặc hủy đặt chỗ hiện có, trừ trường hợp khẩn cấp.",
      supplier_section6_title: "6. Mối quan hệ với Chính sách Phía Người lái xe (Đặt chỗ, Gia hạn, Hủy)",
      supplier_section6_item1:
        'Các đặt chỗ được thực hiện qua Dịch vụ chủ yếu được điều chỉnh bởi "Điều khoản Người lái xe (Chung)", "Chính sách Gia hạn & Ở quá giờ của Người lái xe" và "Chính sách Hủy & Hoàn tiền của Người lái xe".',
      supplier_section6_item2:
        "Nhà cung cấp phải cấu hình điều kiện danh sách của mình để tránh xung đột với chính sách phía người lái xe hoặc luật bắt buộc của Việt Nam. Trong trường hợp xung đột, chính sách của Công ty và luật bắt buộc được ưu tiên.",
      supplier_section6_item3:
        'Nghĩa vụ và quyền của Nhà cung cấp liên quan đến gia hạn/ở quá giờ và hủy được mô tả chi tiết thêm trong "phần B (Chính sách Danh sách, Thanh toán & Thanh toán của Nhà cung cấp)" và trong các chính sách phía người lái xe.',
      supplier_section7_title: "7. Số tiền Giao dịch, Biên lợi nhuận & Thanh toán",
      supplier_section7_content:
        "Quy tắc về Số tiền Giao dịch, Biên lợi nhuận và Thanh toán được nêu trong phần B (Chính sách Danh sách, Thanh toán & Thanh toán của Nhà cung cấp).",
      supplier_section8_title: "8. Bảo hiểm & Phân bổ Trách nhiệm",
      supplier_section8_item1:
        "Nghĩa vụ an toàn và phân bổ trách nhiệm của Nhà cung cấp được điều chỉnh bởi Chính sách Bảo hiểm & Trách nhiệm Parkchung và phần C (Chính sách Rủi ro & Trách nhiệm của Nhà cung cấp).",
      supplier_section8_item2:
        "Để tránh nghi ngờ, và như được chỉ định trong Chính sách Bảo hiểm & Trách nhiệm, tổng trách nhiệm của Công ty đối với bất kỳ bên nào cho một giao dịch nhất định được giới hạn ở Biên lợi nhuận thực tế nhận được bởi Công ty cho giao dịch đó, trừ các trách nhiệm không thể loại trừ theo luật và các tổn thất do hành vi sai trái cố ý hoặc sơ suất nghiêm trọng của Công ty.",
      supplier_section9_title: "9. Bảo mật & Dữ liệu",
      supplier_section9_item1:
        "Nhà cung cấp sẽ coi tất cả thông tin không công khai về Công ty, các Nhà cung cấp khác và Người lái xe thu được thông qua mối quan hệ là bảo mật và sẽ không tiết lộ cho bên thứ ba trừ khi được yêu cầu bởi pháp luật hoặc được Công ty ủy quyền.",
      supplier_section9_item2:
        "Công ty có thể sử dụng dữ liệu ẩn danh và tổng hợp cho phân tích, cải thiện dịch vụ và báo cáo, trong khi dữ liệu cá nhân được xử lý theo Chính sách Quyền riêng tư.",
      supplier_section10_title: "10. Đình chỉ & Chấm dứt",
      supplier_section10_content:
        "Trong trường hợp vi phạm các Điều khoản Nhà cung cấp này, Thỏa thuận Nhà cung cấp, pháp luật áp dụng hoặc chính sách của Công ty, hoặc trong trường hợp gian lận, khiếu nại liên tục hoặc thất bại dịch vụ lặp lại, Công ty có thể, với thông báo trước hoặc, khi khẩn cấp, không có thông báo trước, đình chỉ hoặc gỡ danh sách Nhà cung cấp, hạn chế đặt chỗ mới hoặc chấm dứt Thỏa thuận Nhà cung cấp.",
      supplier_section11_title: "11. Luật Điều chỉnh & Giải quyết Tranh chấp",
      supplier_section11_content:
        "Các Điều khoản Nhà cung cấp này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp được xử lý phù hợp với Chính sách Giải quyết Tranh chấp của Công ty (xử lý nội bộ → cơ quan có thẩm quyền/ADR → tòa án).",
      supplier_sectionB_title: "B. Chính sách Danh sách, Thanh toán & Thanh toán của Nhà cung cấp v2.0",
      supplier_settlement_section1_title: "1. Phạm vi",
      supplier_settlement_section1_content:
        "Chính sách này điều chỉnh giá cả, luồng Số tiền Giao dịch, Biên lợi nhuận, thanh toán và đối chiếu/khiếu nại cho tất cả các chỗ đỗ xe có thể đặt được liệt kê qua Parkchung (cả Thanh toán Tại Địa điểm / Thanh toán Sau và Thanh toán Ngay).",
      supplier_settlement_section2_title: "2. Giá cả & Điều kiện Danh sách",
      supplier_settlement_section2_item1:
        "Nhà cung cấp đặt giá cơ bản (mỗi giờ/ngày, v.v.), đơn vị đặt tối thiểu, điều khoản hủy, giá gia hạn/ở quá giờ và các phí khác phù hợp với các trường được xác định của Dịch vụ.",
      supplier_settlement_section2_item2:
        "Nhà cung cấp chịu trách nhiệm đảm bảo tuân thủ các quy định về giá cả và bảo vệ người tiêu dùng áp dụng và phải tránh hiển thị giá gây hiểu lầm (ví dụ: phí bắt buộc ẩn, giảm giá lừa dối).",
      supplier_settlement_section2_item3:
        "Đối với khuyến mãi, phiếu giảm giá hoặc chiến dịch ảnh hưởng đến giá cả, cơ chế chia sẻ chi phí (Nhà cung cấp chịu, Công ty chịu hoặc chia sẻ) được xác định trong Thỏa thuận Nhà cung cấp hoặc một thỏa thuận bằng văn bản riêng.",
      supplier_settlement_section3_title: "3. Đặt chỗ Thanh toán Ngay - Thanh toán Trực tuyến & Thanh toán",
      supplier_settlement_section3_item1:
        "Đối với đặt chỗ Thanh toán Ngay, Người lái xe thanh toán trước toàn bộ hoặc một phần Số tiền Giao dịch cho Công ty thông qua Dịch vụ. Công ty, hoạt động với tư cách là Đại lý Thanh toán, nhận Số tiền Giao dịch và chuyển phần của Nhà cung cấp vào Ngày Thanh toán.",
      supplier_settlement_section3_item2:
        "Đối với đặt chỗ Thanh toán Ngay hoàn thành vào cuối tháng dương lịch, Công ty sẽ, vào <strong>Ngày Thanh toán</strong> đã thỏa thuận, chuyển cho tài khoản ngân hàng được chỉ định của Nhà cung cấp số tiền ròng sau khi khấu trừ:",
      supplier_settlement_section3_item2a: "Biên lợi nhuận đã thỏa thuận <strong>(hoa hồng)</strong>;",
      supplier_settlement_section3_item2b:
        "điều chỉnh cho hoàn tiền, hủy, không xuất hiện và bất kỳ phí liên quan nào trong khoảng thời gian đó;",
      supplier_settlement_section3_item2c:
        "chargeback, thanh toán thất bại hoặc khấu trừ bộ xử lý thanh toán; và",
      supplier_settlement_section3_item2d:
        "phạt hoặc chi phí hợp lý phát sinh bởi Công ty do vi phạm của Nhà cung cấp, trong phạm vi được thông báo cho Nhà cung cấp.",
      supplier_settlement_section3_item3:
        "Công ty sẽ cung cấp cho Nhà cung cấp một báo cáo điện tử hàng tháng tóm tắt giao dịch, khấu trừ và chuyển khoản ròng. Nhà cung cấp có thể nêu ra các khiếu nại hợp lý trong <strong>7 ngày</strong> kể từ khi nhận được. Không có khiếu nại trong khoảng thời gian này, báo cáo được coi là cuối cùng cho khoảng thời gian đó.",
      supplier_settlement_section4_title: "4. Xử lý hoàn tiền, phí hủy và phí không xuất hiện cho đặt chỗ Thanh toán Ngay",
      supplier_settlement_section4_content:
        'Việc xử lý hoàn tiền, phí hủy và phí không xuất hiện cho đặt chỗ "Thanh toán Ngay" tuân theo "Chính sách Hủy & Hoàn tiền của Người lái xe" và bất kỳ điều khoản nào được nêu trong "Thỏa thuận Nhà cung cấp".',
      supplier_settlement_section5_title: "5. Đặt chỗ Thanh toán Tại Địa điểm / Thanh toán Sau - Thanh toán Tại địa điểm & Thanh toán",
      supplier_settlement_section5_item1:
        'Đối với đặt chỗ "Thanh toán Tại Địa điểm / Thanh toán Sau", Người lái xe thanh toán toàn bộ Số tiền Giao dịch trực tiếp cho Nhà cung cấp tại địa điểm. Công ty không nhận Số tiền Giao dịch tại thời điểm đặt chỗ.',
      supplier_settlement_section5_item2:
        'Nhà cung cấp phải tính toán, dựa trên hồ sơ của mình và dữ liệu đặt chỗ của Công ty, tổng Số tiền Giao dịch đã thu tại địa điểm cho đặt chỗ "Thanh toán Tại Địa điểm / Thanh toán Sau" trong mỗi tháng, và xác định các số tiền phải trả cho Công ty (Biên lợi nhuận và bất kỳ khoản mục đã thỏa thuận nào khác).',
      supplier_settlement_section5_item3:
        'Nhà cung cấp sẽ thanh toán cho Công ty, vào "Ngày Thanh toán" đã thỏa thuận, Biên lợi nhuận tổng hợp và bất kỳ số tiền đã thỏa thuận nào khác cho tháng trước, bằng cách chuyển các khoản tiền đó vào tài khoản ngân hàng được chỉ định bởi Công ty.',
      supplier_settlement_section5_item4:
        "Công ty có thể tạo báo cáo đối chiếu hàng tháng dựa trên hồ sơ đặt chỗ của mình và báo cáo của Nhà cung cấp. Nhà cung cấp phải xem xét và có thể nêu ra khiếu nại trong vòng 7 ngày kể từ khi nhận được; không có như vậy, báo cáo được coi là đã chấp nhận cho mục đích thanh toán.",
      supplier_settlement_section5_item5:
        'Đối với đặt chỗ "Thanh toán Tại Địa điểm / Thanh toán Sau" nơi Người lái xe hủy sau thời gian hủy miễn phí hoặc không xuất hiện, và Công ty thành công thu phí hủy từ Người lái xe, việc phân bổ phí như vậy giữa Công ty và Nhà cung cấp sẽ như đã thỏa thuận trong "Thỏa thuận Nhà cung cấp" hoặc các thỏa thuận bằng văn bản khác.',
      supplier_settlement_section6_title: "6. Thuế & Hóa đơn",
      supplier_settlement_section6_item1:
        "Nhà cung cấp chịu trách nhiệm duy nhất về tuân thủ tất cả các nghĩa vụ thuế áp dụng (bao gồm VAT, thuế thu nhập doanh nghiệp và bất kỳ nghĩa vụ khấu trừ nào) và phải phát hành hóa đơn/biên lai phù hợp cho Người lái xe và/hoặc cho Công ty khi được yêu cầu bởi pháp luật.",
      supplier_settlement_section6_item2:
        "Công ty chịu trách nhiệm về các nghĩa vụ thuế của riêng mình liên quan đến Biên lợi nhuận và các số tiền khác mà nó nhận được, phù hợp với pháp luật Việt Nam.",
      supplier_settlement_section6_item3:
        "Bất kỳ thỏa thuận thuế đặc biệt nào giữa Nhà cung cấp và Công ty (ví dụ: luồng hóa đơn, khấu trừ) phải được nêu trong Thỏa thuận Nhà cung cấp.",
      supplier_settlement_section7_title: "7. Bảng điều khiển & Báo cáo",
      supplier_settlement_section7_item1:
        "Công ty có thể cung cấp bảng điều khiển Nhà cung cấp hiển thị lịch sử đặt chỗ, thông tin doanh thu và chi tiết thanh toán.",
      supplier_settlement_section7_item2:
        "Ở giai đoạn ban đầu, Công ty có thể không cung cấp tính năng xuất CSV/PDF hoặc có thể chỉ cung cấp chức năng báo cáo hạn chế. Công ty sẽ thông báo bất kỳ thay đổi quan trọng nào đối với các công cụ như vậy trên website của mình hoặc qua email.",
      supplier_sectionC_title: "C. Chính sách Rủi ro & Trách nhiệm của Nhà cung cấp v2.0",
      supplier_risk_section1_title: "1. Quản lý An toàn & Tuân thủ",
      supplier_risk_section1_item1:
        "Nhà cung cấp phải thực hiện các biện pháp hợp lý để giữ chỗ đỗ xe an toàn và có thể sử dụng, bao gồm chiếu sáng, đánh dấu, biển báo vào/ra, quy tắc tại địa điểm và loại bỏ nguy hiểm.",
      supplier_risk_section1_item2:
        "Nhà cung cấp phải tuân thủ quyền sử dụng đất/tòa nhà, yêu cầu phòng cháy chữa cháy, quy tắc xây dựng, quy hoạch đô thị, nghĩa vụ hiển thị giá hợp pháp và bất kỳ quy định áp dụng nào khác.",
      supplier_risk_section2_title: "2. Sự cố, Trộm cắp & Thiệt hại",
      supplier_risk_section2_item1:
        "Khi thiệt hại hoặc mất mát đối với Người lái xe hoặc bên thứ ba phát sinh từ khuyết tật cấu trúc, thất bại thiết bị, thiếu sót vận hành, vi phạm nghĩa vụ an toàn hoặc thiếu quyền hợp pháp do Nhà cung cấp, Nhà cung cấp chịu trách nhiệm cho các tổn thất như vậy.",
      supplier_risk_section2_item2:
        "Công ty có thể hỗ trợ giải quyết tranh chấp với tư cách là trung gian nhưng không phải, về nguyên tắc, là bên bồi thường trực tiếp, như được chỉ định trong Chính sách Bảo hiểm & Trách nhiệm.",
      supplier_risk_section3_title: "3. Bảo hiểm",
      supplier_risk_section3_item1: "Công ty hiện không cung cấp sản phẩm bảo hiểm riêng của mình.",
      supplier_risk_section3_item2:
        "Nhà cung cấp chịu trách nhiệm sắp xếp, bằng chi phí của chính mình, bảo hiểm phù hợp (ví dụ: bảo hiểm cơ sở/trách nhiệm công cộng) khi cần thiết.",
      supplier_risk_section4_title: "4. Giới hạn Trách nhiệm Công ty",
      supplier_risk_section4_content:
        "Trách nhiệm của Công ty được điều chỉnh bởi Chính sách Bảo hiểm & Trách nhiệm và Điều khoản Sử dụng. Ngay cả khi Công ty bị coi là có trách nhiệm theo pháp luật Việt Nam, tổng trách nhiệm của Công ty mỗi giao dịch được giới hạn ở <strong>Biên lợi nhuận thực tế nhận được bởi Công ty cho giao dịch đó</strong>, trừ các trách nhiệm không thể loại trừ theo luật và các tổn thất do hành vi sai trái cố ý hoặc sơ suất nghiêm trọng của Công ty.",
      supplier_risk_section5_title: "5. Bồi thường",
      supplier_risk_section5_item1:
        "Trong phạm vi được phép bởi pháp luật, Nhà cung cấp sẽ bảo vệ và bồi thường Công ty chống lại các khiếu nại và tổn thất của bên thứ ba phát sinh từ vi phạm, sơ suất hoặc thiếu quyền của Nhà cung cấp liên quan đến chỗ đỗ xe.",
      supplier_risk_section5_item2:
        "Chính sách này không giới hạn bất kỳ quyền bắt buộc nào của Người lái xe theo luật bảo vệ người tiêu dùng Việt Nam hoặc các luật bắt buộc khác.",
      footer_support: "HỖ TRỢ",
      sup_booking: "Hướng dẫn đặt chỗ",
      sup_listing: "Hướng dẫn đăng bãi",
      sup_faq: "Câu hỏi thường gặp",
      sup_blog: "Blog",
      footer_copy: "Một sản phẩm của CTCP",
      ph_location: "Nhập địa điểm hoặc mã bưu chính",
      results_title: "Chỗ đỗ xe khả dụng",
      results_desc: "Chọn chỗ phù hợp và đặt trong vài giây.",
      no_results: "Rất tiếc, không tìm thấy chỗ đỗ phù hợp với tiêu chí của bạn.",
      book_now: "Đặt ngay",
      login_title: "Đăng nhập tài khoản",
      register_title: "Tạo tài khoản",
      email: "Email",
      password: "Mật khẩu",
      full_name: "Họ và tên",
      phone: "Số điện thoại",
      register: "Đăng ký",
      no_account: "Chưa có tài khoản?",
      register_here: "Đăng ký tại đây",
      have_account: "Đã có tài khoản?",
      login_here: "Đăng nhập tại đây",
      my_bookings: "Đặt chỗ của tôi",
      back_home: "← Về Trang chủ",
      loading: "Đang tải danh sách đặt chỗ...",
      host_hero_title: "Kiếm tiền với chỗ đỗ xe của bạn",
      host_hero_desc: "Tham gia cộng đồng chủ bãi và biến chỗ đỗ trống thành thu nhập. Đơn giản, an toàn và miễn phí đăng tin.",
      host_benefit_price: "Tự đặt giá",
      host_benefit_avail: "Chủ động lịch trống",
      host_benefit_secure: "Thanh toán an toàn, dễ dàng",
      host_form_title: "Đăng tin chỗ đỗ",
      host_form_note: "Tin sẽ được quản trị viên duyệt trước khi hiển thị.",
      address: "Địa chỉ",
      get_location: "Lấy vị trí",
      coords_hint: "Chúng tôi sẽ cố gắng lấy tọa độ tự động. Bạn có thể chỉnh thủ công nếu cần.",
      longitude: "Kinh độ",
      latitude: "Vĩ độ",
      hourly_rate: "Giá theo giờ (VND)",
      spot_image: "Hình ảnh chỗ đỗ",
      click_upload: "Nhấn để tải ảnh lên",
      no_file: "Chưa chọn tệp",
      submit_review: "Gửi duyệt",
      details_title: "CHI TIẾT ĐẶT CHỖ",
      details_subtitle: "Bạn sắp hoàn tất! Vui lòng điền vài thông tin để xác nhận.",
      details_section_title: "Chi tiết đặt chỗ",
      arriving_on: "Thời gian đến",
      leaving_on: "Thời gian rời đi",
      ph_select_datetime: "Chọn ngày/giờ",
      duration: "Số giờ đặt chỗ",
      contact_title: "Số điện thoại",
      contact_phone_label: "Số Điện Thoại",
      contact_hint: "Chúng tôi sẽ sử dụng thông tin này để liên hệ với bạn về đặt chỗ",
      vehicle_title: "Thông Tin Phương Tiện",
      vehicle_reg_label: "Biển Số Xe",
      vehicle_desc: "Biển số xe của bạn sẽ được chia sẻ với đơn vị vận hành bãi đỗ",
      ph_vehicle_reg: "Nhập biển số xe của bạn",
      payment_title: "Thông Tin Thanh Toán",
      payment_desc: "Tất cả thanh toán đều được mã hóa và bảo mật ở mức ngân hàng",
      payment_secure: "Mã hóa SSL 256-bit",
      payment_methods: "Chấp nhận tất cả thẻ chính",
      spot_loading: "Đang tải địa chỉ...",
      unit_price: "Đơn giá",
      parking_duration: "Thời lượng đỗ",
      total_price: "Tổng tiền",
      rechecked: "Kiểm tra lại khả dụng lúc",
      time_to_complete: "Thời gian hoàn tất đặt chỗ:",
      btn_pay_reserve: "Thanh toán và giữ chỗ",
      trust_best_price: "Giá tốt nhất",
      trust_reviews: "163,000+ đánh giá",
      trust_trusted: "Được 10 triệu tài xế tin dùng",
      trust_free_cancel: "Hủy miễn phí đến 24h trước giờ đến",
      trust_award: "Dịch vụ khách hàng đoạt giải",
      trust_excellent: "Xuất sắc",
      popup_title: "Hoàn Tất Đặt Chỗ",
      popup_booking_summary: "Tóm Tắt Đặt Chỗ",
      popup_from: "Từ",
      popup_to: "Đến",
      popup_contact_info: "Thông Tin Liên Hệ",
      popup_contact_desc: "Chúng tôi sẽ sử dụng thông tin này để xác nhận đặt chỗ của bạn",
      popup_fullname: "Họ và Tên",
      popup_email: "Địa Chỉ Email",
      popup_phone: "Số Điện Thoại",
      popup_cancel: "Hủy",
      popup_send: "Hoàn Tất Đặt Chỗ",
      policy_page_title: "CHÍNH SÁCH BẢO MẬT",
      policy_page_subtitle: "Cách chúng tôi thu thập, bảo vệ và sử dụng dữ liệu của bạn trên Parkchung.",
      policy_collect_title: "Mục đích và phạm vi thu thập",
      policy_collect_intro: "Thông tin cá nhân của Khách hàng chỉ được dùng trong những mục đích sau đây:",
      policy_collect_item1: "Hỗ trợ việc đặt xe và cung cấp xe cho Khách hàng;",
      policy_collect_item2: "Liên lạc với Khách hàng trong cho mục đích giới thiệu các chương trình khuyến mãi của Công ty;",
      policy_collect_item3: "Nâng cao chất lượng dịch vụ và hỗ trợ Khách hàng;",
      policy_collect_item4: "Giải quyết các sự vụ và tranh chấp phát sinh liên quan đến việc sử dụng dịch vụ trên Sàn giao dịch;",
      policy_collect_item5: "Cung cấp thông tin cho các Cơ quan thực thi Pháp luật theo yêu cầu;",
      policy_collect_member_intro: "Khi các thành viên đăng ký tài khoản chungxe.vn, thông tin mà chúng tôi thu thập bao gồm:",
      policy_collect_member_item1: "Tên đăng ký, số điện thoại",
      policy_collect_member_item2: "Email",
      policy_collect_member_item3: "Địa chỉ",
      policy_collect_member_item4: "Mã số thuế, hoặc chứng minh nhân dân.",
      policy_use_title: "Phạm vi sử dụng thông tin",
      policy_use_intro: "Công ty sử dụng thông tin Khách hàng cung cấp để:",
      policy_use_item1: "Gửi các thông báo về các hoạt động trao đổi thông tin giữa Khách hàng và Công ty;",
      policy_use_item2: "Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của Khách hàng hoặc các hoạt động giả mạo Khách hàng;",
      policy_use_item3: "Liên lạc và giải quyết với Khách hàng trong những trường hợp đặc biệt;",
      policy_use_item4: "Không sử dụng thông tin cá nhân của Khách hàng ngoài mục đích xác nhận và liên hệ có liên quan đến đặt xe và cung cấp xe.",
      policy_use_item5:
        "Trong trường hợp có yêu cầu của Pháp luật: Công ty có trách nhiệm hợp tác cung cấp thông tin cá nhân của Khách hàng khi có yêu cầu từ Cơ quan Tư pháp bao gồm: Viện kiểm sát, Tòa án, Cơ quan Công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của Khách hàng. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân của Khách hàng.",
      policy_retention_title: "Thời gian lưu trữ thông tin",
      policy_retention_desc:
        "Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của Website chungxe.vn theo quy định của pháp luật tùy từng thời điểm.",
      policy_access_title: "Những người hoặc tổ chức có thể được tiếp cận với thông tin đó",
      policy_access_item1: "Công ty có quyền tiếp cận và sử dụng các thông tin này trong phạm vi đã thông báo với người cung cấp thông tin.",
      policy_access_item2:
        "Người cung cấp thông tin có quyền tiếp cận, sử dụng các thông tin do mình cung cấp hoặc sửa đổi, bổ sung các thông tin này khi cần thiết.",
      policy_access_item3:
        "Đối tác có thể tiếp cận các thông tin về: tên, số điện thoại, địa chỉ email của khách hàng theo quy định của Ban quản lý Website change.vn để phục vụ cho việc xác nhận sử dụng dịch vụ và cung cấp dịch vụ của mình.",
      policy_access_item4: "Cơ quan nhà nước có thẩm quyền có thể tiếp cận các nguồn tin theo quy định của pháp luật.",
      policy_access_notice1:
        "Ban quản lý Website chungxe.vn sẽ thông báo toàn bộ khách hàng và cơ quan chức năng để điều tra, xử lý kịp thời trong vòng 03 (ba) giờ sau khi phát hiện sự cố, hacker trong trường hợp hệ thống thông tin bị tấn công làm phát sinh nguy cơ mất thông tin của khách hàng.",
      policy_access_notice2:
        "Khách hàng có quyền gửi khiếu nại về bị việc lộ thông tin các nhân cho bên thứ 3 đến Ban quản lý chungxe.vn. Khi tiếp nhận những phản hồi này, Công ty sẽ xác nhận lại thông tin, phải có trách nhiệm trả lời lý do và hướng dẫn thành viên khôi phục và bảo mật lại thông tin",
      policy_address_title: "Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân",
      policy_address_company: "CÔNG TY CỔ PHẦN PARKCHUNG",
      policy_address_location: "Địa chỉ: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      policy_address_email: "Email: contact@parkchung.com",
      policy_user_rights_title: "Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân của mình",
      policy_user_rights_intro1:
        "Thành viên có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản và chỉnh sửa thông tin cá nhân hoặc yêu cầu Website chungxe.vn thực hiện việc này.",
      policy_user_rights_intro2:
        "Thành viên có quyền gửi khiếu nại về việc lộ thông tin cá nhân cho bên thứ 3 đến Ban quản trị của Website chungxe.vn. Khi tiếp nhận những phản hồi này, Website chungxe.vn sẽ xác nhận lại thông tin, phải có trách nhiệm trả lời lý do và hướng dẫn thành viên khôi phục và bảo mật lại thông tin.",
      policy_user_rights_contact: "Email: contact@chungxe.vn",
      policy_user_rights_address: "Địa chỉ: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      policy_commitment_title: "Cam kết bảo mật thông tin cá nhân khách hàng",
      policy_commitment_intro1:
        "Thông tin cá nhân của thành viên trên Website chungxe.vn được chungxe.vn cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của Công ty. Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.",
      policy_commitment_intro2:
        "Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng ý từ Thành viên.",
      policy_commitment_intro3:
        "Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân Thành viên, parkchung.com sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý kịp thời và thông báo cho thành viên được biết. Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của Thành viên bao gồm thông tin hóa đơn kế toán chứng từ số hóa tại khu vực dữ liệu trung tâm an toàn cao cấp của parkchung.com.",
      policy_commitment_intro4:
        "Ban quản lý Website parkchung.com yêu cầu các cá nhân khi đăng ký/mua hàng là thành viên, phải cung cấp đầy đủ thông tin cá nhân có liên quan như: Họ và tên, địa chỉ liên lạc, email, điện thoại, ...và chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban quản lý Website parkchung không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại có liên quan đến quyền lợi của Thành viên đó nếu xét thấy tất cả thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban đầu là không chính xác.",
      policy_complaint_title: "Cơ chế tiếp nhận và giải quyết khiếu nại liên quan đến việc thông tin cá nhân thành viên",
      policy_complaint_intro:
        "Thành viên có quyền gửi khiếu nại về việc lộ thông tin các nhân cho bên thứ 3 đến Ban quản trị của website chungxe.vn đến địa chỉ Công ty hoặc qua email.",
      policy_complaint_contact: "Email: contact@parkchung.com",
      policy_complaint_resolution: "Công ty có trách nhiệm thực hiện các biện pháp kỹ thuật, nghiệp vụ để xác minh các nội dung được phản ánh.",
      policy_complaint_resolution1:
        "Thời gian xử lý phản ánh liên quan đến thông tin cá nhân thành viên có nhu cầu sử dụng dịch vụ mua bán trên sàn TMĐT là 10 ngày",
      complaint_page_title: "QUY TRÌNH XỬ LÝ KHIẾU NẠI",
      complaint_page_subtitle: "Quy trình tiếp nhận, xử lý và giải quyết khiếu nại, tranh chấp của khách hàng.",
      complaint_info_title: "Thông tin về dịch vụ",
      complaint_info_intro:
        "Tất cả thông tin về dịch vụ, chính sách chất lượng và giá cả trên Website được công khai hiển thị và cập nhật thường xuyên. Khách hàng có thể truy cập thông tin này trước khi thực hiện bất kỳ đặt chỗ hoặc giao dịch nào.",
      complaint_process_title: "Quy trình giải quyết khiếu nại",
      complaint_process_intro: "Khi phát sinh tranh chấp hoặc khiếu nại, chúng tôi thực hiện theo các bước sau:",
      complaint_step1_title: "Bước 1: Gửi khiếu nại",
      complaint_step1_desc: "Khách hàng có thể gửi khiếu nại qua các kênh sau:",
      complaint_step1_item1: "Email: contact@parkchung.com",
      complaint_step1_item2: "Gửi thư đến: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      complaint_step1_item3: "Điện thoại: 0903.229.906 (8:00 AM - 9:00 PM)",
      complaint_step1_note:
        "Vui lòng cung cấp thông tin chi tiết bao gồm: mã đặt chỗ, mô tả vấn đề, tài liệu hỗ trợ (nếu có), và thông tin liên hệ của bạn.",
      complaint_step2_title: "Bước 2: Xem xét và xác minh khiếu nại",
      complaint_step2_desc: "Sau khi nhận được khiếu nại, chúng tôi sẽ:",
      complaint_step2_item1: "Xác nhận đã nhận trong vòng 24 giờ",
      complaint_step2_item2: "Xem xét và xác minh thông tin được cung cấp",
      complaint_step2_item3: "Liên hệ các bên liên quan (khách hàng, chủ bãi, nhà cung cấp dịch vụ) để thu thập thêm thông tin",
      complaint_step2_item4: "Điều tra vấn đề một cách kỹ lưỡng",
      complaint_step3_title: "Bước 3: Giải quyết và phản hồi",
      complaint_step3_desc: "Sau khi hoàn tất điều tra, chúng tôi sẽ:",
      complaint_step3_item1: "Cung cấp phản hồi chi tiết giải thích kết quả điều tra",
      complaint_step3_item2: "Đề xuất giải pháp hoặc bồi thường (nếu có)",
      complaint_step3_item3: "Thực hiện các biện pháp khắc phục để ngăn chặn vấn đề tương tự",
      complaint_step3_item4: "Theo dõi để đảm bảo khách hàng hài lòng",
      complaint_timeline_title: "Thời gian xử lý",
      complaint_timeline_desc: "Chúng tôi cam kết xử lý khiếu nại trong các khung thời gian sau:",
      complaint_timeline_item1: "Xác nhận: Trong vòng 24 giờ kể từ khi nhận được",
      complaint_timeline_item2: "Phản hồi ban đầu: Trong vòng 3 ngày làm việc",
      complaint_timeline_item3: "Giải quyết hoàn toàn: Trong vòng 5 ngày làm việc đối với khiếu nại tiêu chuẩn",
      complaint_timeline_item4: "Trường hợp phức tạp: Lên đến 10 ngày làm việc với cập nhật thường xuyên",
      complaint_contact_title: "Thông tin liên hệ khiếu nại",
      complaint_contact_company: "CÔNG TY CỔ PHẦN PARKCHUNG",
      complaint_contact_address: "Địa chỉ: BK Alumni House, Hanoi University of Science and Technology, No. 1 Dai Co Viet street, Hanoi",
      complaint_contact_email: "Email: contact@parkchung.com",
      complaint_contact_phone: "Điện thoại: 0903.229.906 (8:00 AM - 9:00 PM)",
      complaint_commitment_title: "Cam kết của chúng tôi",
      complaint_commitment_intro1:
        "Chúng tôi cam kết bảo vệ quyền lợi người dùng và đảm bảo giải quyết công bằng mọi tranh chấp. Tất cả khiếu nại được xử lý với tính bảo mật và chuyên nghiệp.",
      complaint_commitment_intro2:
        "Khách hàng có trách nhiệm cung cấp thông tin chính xác và đầy đủ khi gửi khiếu nại. Thông tin sai lệch hoặc gây hiểu lầm có thể làm chậm quá trình giải quyết.",
      complaint_commitment_intro3: "Chúng tôi có quyền yêu cầu thêm tài liệu hoặc thông tin để điều tra và giải quyết khiếu nại một cách đúng đắn.",
      complaint_after_title: "Sau khi giải quyết tranh chấp",
      complaint_after_intro: "Sau khi tranh chấp được giải quyết:",
      complaint_after_item1: "Tất cả các bên sẽ được thông báo về kết quả giải quyết",
      complaint_after_item2:
        "Nếu nhà cung cấp dịch vụ bị phát hiện không tuân thủ, các biện pháp thích hợp sẽ được thực hiện, bao gồm cảnh báo, tạm ngưng hoặc chấm dứt dịch vụ",
      complaint_after_item3: "Chúng tôi sẽ thực hiện các biện pháp để ngăn chặn các vấn đề tương tự tái diễn",
      complaint_after_item4: "Khách hàng có thể yêu cầu tóm tắt bằng văn bản về kết quả giải quyết để lưu trữ",
      complaint_legal_title: "Quyền khởi kiện",
      complaint_legal_desc: "Nếu không thể đạt được thỏa thuận thông qua quy trình khiếu nại nội bộ của chúng tôi, khách hàng có quyền:",
      complaint_legal_item1: "Gửi khiếu nại đến các cơ quan bảo vệ người tiêu dùng có liên quan",
      complaint_legal_item2: "Tìm kiếm hòa giải thông qua các dịch vụ giải quyết tranh chấp bên thứ ba",
      complaint_legal_item3: "Khởi kiện thông qua các tòa án có thẩm quyền theo pháp luật Việt Nam",
      complaint_legal_note:
        "Chúng tôi sẽ hợp tác đầy đủ với bất kỳ thủ tục pháp lý nào và cung cấp tất cả tài liệu cần thiết theo yêu cầu của pháp luật.",
      faq_support_label: "Hỗ trợ",
      faq_page_title: "Câu hỏi thường gặp",
      faq_page_subtitle: "Hướng dẫn từng bước và giải đáp các thắc mắc phổ biến khi đặt chỗ.",
      faq_steps_title: "Quy trình thuê xe/bãi",
      faq_step1_title: "Tìm xe/bãi",
      faq_step1_desc: "Truy cập website/app Parkchung, chọn thời gian và địa điểm bạn cần.",
      faq_step2_title: "Đặt xe",
      faq_step2_desc: "So sánh các lựa chọn phù hợp, chọn bãi/xe ưng ý và gửi yêu cầu đặt chỗ.",
      faq_step3_title: "Nhận xe",
      faq_step3_desc: "Hoàn tất thủ tục, nhận xác nhận, gặp chủ bãi hoặc đại diện Parkchung.",
      faq_step4_title: "Trả xe",
      faq_step4_desc: "Hoàn tất lịch trình, trả xe/bãi và đánh giá dịch vụ để chúng tôi cải thiện.",
      faq_questions_title: "Các câu hỏi thường gặp",
      faq_q1_q: "Tôi cần chuẩn bị giấy tờ gì để thuê xe máy?",
      faq_q1_a: "Mang theo CMND/CCCD hoặc hộ chiếu, giấy phép lái xe hợp lệ và tiền đặt cọc (nếu có). Chúng tôi sẽ kiểm tra trước khi bàn giao xe.",
      faq_q2_q: "Thuê ô tô tự lái cần giấy tờ gì?",
      faq_q2_a: "Bạn cần CMND/CCCD, giấy phép lái xe ô tô còn hạn và khoản đặt cọc hoặc bảo lãnh theo yêu cầu của chủ xe.",
      faq_q3_q: "Kiểm tra xe trước khi nhận như thế nào?",
      faq_q3_a: "Kiểm tra cùng chủ xe, chụp hình công tơ mét, mức xăng, trầy xước và ký biên bản bàn giao để tránh phát sinh tranh chấp.",
      faq_q4_q: "Tôi có thể đặt xe giúp người khác không?",
      faq_q4_a: "Có, nhưng bạn cần cung cấp chính xác thông tin người sử dụng và đảm bảo họ đáp ứng đủ điều kiện nêu trong hợp đồng.",
      faq_q5_q: "Giá thuê có phụ phí nào không?",
      faq_q5_a: "Giá hiển thị bao gồm phí thuê cơ bản. Các khoản phát sinh như xăng, quá giờ, cầu đường sẽ được ghi rõ hoặc thỏa thuận với chủ xe.",
      faq_q6_q: "Chungxe cung cấp những loại phương tiện nào?",
      faq_q6_a: "Chúng tôi có ô tô, xe máy, điểm sạc EV và bãi đỗ tư nhân. Tùy vào thành phố và thời gian mà mức độ sẵn có khác nhau.",
      faq_q7_q: "Xe có mới và đảm bảo chất lượng không?",
      faq_q7_a: "Mỗi tin đăng đều được kiểm tra định kỳ. Chủ xe phải đảm bảo vệ sinh, an toàn và tình trạng kỹ thuật trước mỗi lần cho thuê.",
      faq_q8_q: "Có thể thanh toán bằng hình thức nào?",
      faq_q8_a: "Bạn có thể thanh toán bằng chuyển khoản, thẻ ngân hàng hoặc tiền mặt tùy từng tin đăng. Chi tiết được hiển thị khi thanh toán.",
      about_page_title: "VỀ CHÚNG TÔI",
      about_intro_para1: "Parkchung là một startup tiên phong phát triển nền tảng trực tuyến cho thuê và chia sẻ xe máy, ô tô tự lái tại Việt Nam.",
      about_intro_para2:
        "Parkchung kết nối khách hàng có nhu cầu thuê phương tiện tự lái (ô tô, xe máy) với các đơn vị cho thuê và cá nhân có phương tiện nhàn rỗi trên toàn quốc thông qua website hoặc ứng dụng di động, cho phép tìm kiếm, so sánh và thuê một cách dễ dàng và nhanh chóng.",
      about_intro_para3:
        "Sứ mệnh của Parkchung là cung cấp một nền tảng công nghệ hiện đại cho việc cho thuê và chia sẻ phương tiện nhanh chóng, an toàn và tiết kiệm, hướng tới một cộng đồng cho thuê và chia sẻ phương tiện đi lại một cách văn minh và thân thiện với môi trường.",
      about_why_title: "Tại sao chúng tôi làm?",
      about_why_item1: "Hiện nay, ở Việt Nam chưa có một nền tảng trực tuyến cho thuê và chia sẻ xe máy, ô tô tự lái.",
      about_why_item2:
        "Khách thuê xe gặp rất nhiều khó khăn để thuê được một chiếc xe tự lái như ý trong khi cá nhân có xe nhàn rỗi hoặc các đơn vị cho thuê xe tự lái chưa có một công nghệ đủ tốt để quản lý, tối ưu tài sản của mình.",
      about_why_item3:
        "Với sự bùng nổ của xu hướng công nghệ 4.0 thì các tiện ích của việc đặt dịch vụ vận chuyển qua kênh online/ mobile cũng như công nghệ chia sẻ xe đang ngày càng phát triển và phổ biến.",
      about_why_item4: "Chia sẻ phương tiện đang dần trở thành xu hướng chính trên thế giới thay thế cho việc sở hữu xe.",
      about_how_title: "Chúng tôi làm như thế nào?",
      about_how_para1:
        "Ngay cả những vấn đề phức tạp nhất cũng có một giải pháp phù hợp để giải quyết. Parkchung không chỉ đơn thuần cho thuê xe; chúng tôi tạo ra những sản phẩm sáng tạo trong hệ sinh thái hiện có.",
      about_how_para2:
        "Chúng tôi tận dụng công nghệ để cung cấp giải pháp di chuyển toàn diện bằng cách kết nối khách hàng với các nhà cung cấp dịch vụ cho thuê xe tự lái. Sứ mệnh của Parkchung là cung cấp một nền tảng nơi khách hàng có thể dễ dàng thuê chiếc xe mong muốn, trong khi chủ xe có thể thu hút khách hàng và kinh doanh một cách thuận tiện.",
      about_how_para3:
        "Công ty tập trung vào việc đơn giản hóa quy trình thuê xe, cung cấp các công cụ hỗ trợ giao dịch từ so sánh giá đến thanh toán trực tuyến, bảo hiểm thuê xe, giảm thiểu thủ tục và nhiều tiện ích khác cho cả khách hàng và đối tác cung cấp xe.",
      footer_about: "Về chúng tôi",
    },
  };

  function renderNav() {
    const dict = t[currentLang] || t.en;
    const langSwitcher = `
            <span style="margin: 0 10px;">|</span>
            <button id="lang-en" style="background:none;border:none;color:${currentLang === "en" ? "#13b47e" : "#555"};font-weight:${
      currentLang === "en" ? "700" : "500"
    };cursor:pointer;">EN</button>
            <span style="color:#aaa;">/</span>
            <button id="lang-vi" style="background:none;border:none;color:${currentLang === "vi" ? "#13b47e" : "#555"};font-weight:${
      currentLang === "vi" ? "700" : "500"
    };cursor:pointer;">VI</button>
        `;

    if (userData) {
      nav.innerHTML = `
            <a href="create-spot.html" style="text-decoration: none; color: #13b47e; font-weight: 500;">${dict.becomeHost}</a>
            <a href="my-bookings.html" style="text-decoration: none; color: #13b47e; font-weight: 500; margin-left: 15px;">${dict.myBookings}</a>
            <span style="margin: 0 15px;">|</span>
            <span>${dict.welcome}, ${userData.fullName}!</span>
            <a href="#" id="logout-btn" style="margin-left: 15px; text-decoration: none; color: #e74c3c; font-weight: 500;">${dict.logout}</a>
            ${langSwitcher}
            `;
    } else {
      nav.innerHTML = `
            <a href="register.html">${dict.becomeHostRegister}</a>
            <a href="login.html">${dict.login}</a>
            ${langSwitcher}
            `;
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "index.html";
      });
    }

    const langEnBtn = document.getElementById("lang-en");
    const langViBtn = document.getElementById("lang-vi");
    if (langEnBtn) langEnBtn.addEventListener("click", () => setLanguage("en"));
    if (langViBtn) langViBtn.addEventListener("click", () => setLanguage("vi"));

    applyTranslations(dict);
    window.__applyI18n = () => applyTranslations(t[currentLang] || t.en);

  }

  function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    currentLang = lang;
    renderNav();
  }

  function applyTranslations(dict) {
    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        // Use innerHTML if text contains HTML tags (like <strong>), otherwise use textContent
        if (dict[key].includes("<strong>") || dict[key].includes("<")) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });
  }

  renderNav();
});
