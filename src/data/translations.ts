export type Language = 'en' | 'hi';

export interface Translations {
  // Brand & Slogans
  brandName: string;
  brandSubtitle: string;
  brandTagline: string;

  // Nav & Header
  navCustomerShop: string;
  navArtisanPortal: string;
  navB2BBulk: string;
  navCatalog: string;
  navTracking: string;
  navCart: string;
  navNotifications: string;
  searchPlaceholder: string;
  langSwitchEn: string;
  langSwitchHi: string;
  askAiButton: string;

  // Hero & Banners
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroArtisanCount: string;
  heroCommissionFree: string;
  heroGIAssured: string;

  // Category Filters
  allCategories: string;
  catTextiles: string;
  catPottery: string;
  catJewelry: string;
  catWoodwork: string;
  catMetalwork: string;
  catHomeDecor: string;
  catPaintings: string;

  // Sorting & Search
  sortBy: string;
  sortFeatured: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortPopular: string;
  noProductsFound: string;
  clearFilters: string;

  // Product Card & Details
  price: string;
  addToCart: string;
  addedToCart: string;
  inStock: string;
  unitsLeft: string;
  outOfStock: string;
  viewDetails: string;
  craftTechnique: string;
  materialsUsed: string;
  artisanStory: string;
  verifiedArtisan: string;
  directUpiTransfer: string;
  zeroCommissionPledge: string;
  clusterOrigin: string;
  listenCraftAudio: string;
  experienceYearsLabel: string;
  close: string;

  // Cart & Checkout
  yourBag: string;
  bagEmpty: string;
  bagEmptySub: string;
  subtotal: string;
  freeShipping: string;
  shippingCharge: string;
  totalPayable: string;
  proceedToCheckout: string;
  continueShopping: string;
  quantity: string;
  remove: string;

  // Checkout Form
  checkoutTitle: string;
  deliveryAddress: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  deliveryNotes: string;
  paymentMethod: string;
  payViaUpi: string;
  payViaCod: string;
  scanUpiQrDesc: string;
  upiVerifyDesc: string;
  confirmAndPlaceOrder: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  trackOrderBtn: string;

  // Orders & Tracking
  myOrdersTitle: string;
  myOrdersSubtitle: string;
  noOrdersYet: string;
  orderId: string;
  trackingNumber: string;
  courierPartner: string;
  estimatedArrival: string;
  statusOrderPlaced: string;
  statusAccepted: string;
  statusDispatched: string;
  statusInTransit: string;
  statusOutForDelivery: string;
  statusDelivered: string;
  statusCancelled: string;
  statusReturnRequested: string;
  statusReturnInTransit: string;
  statusReturnedRefunded: string;
  statusExchangeRequested: string;
  statusExchangeInProgress: string;
  statusExchanged: string;
  liveMapTracking: string;
  needHelp: string;

  // Cancel, Return & Exchange Actions
  cancelOrderBtn: string;
  cancelOrderTitle: string;
  cancelOrderDesc: string;
  cancelReasonLabel: string;
  cancelReasonPlaceholder: string;
  cancelConfirmBtn: string;
  cancelSuccessToast: string;

  returnProductBtn: string;
  returnProductTitle: string;
  returnProductDesc: string;
  returnReasonLabel: string;
  returnReasonPlaceholder: string;
  returnPickupAddress: string;
  returnRefundOptionLabel: string;
  returnSubmitBtn: string;
  returnSuccessToast: string;

  exchangeProductBtn: string;
  exchangeProductTitle: string;
  exchangeProductDesc: string;
  exchangeReasonLabel: string;
  exchangeReasonPlaceholder: string;
  exchangeReplacementReqLabel: string;
  exchangeReplacementReqPlaceholder: string;
  exchangeSubmitBtn: string;
  exchangeSuccessToast: string;

  // Artisan Portal
  artisanDashboardTitle: string;
  artisanDashboardSub: string;
  voiceStudioTab: string;
  photoStudioTab: string;
  myListingsTab: string;
  ordersReceivedTab: string;
  artisanProfileTab: string;
  totalEarnings: string;
  activeOrdersCount: string;
  publishedProductsCount: string;
  clusterReputation: string;
  addNewProductBtn: string;
  recordVoiceListingBtn: string;
  enhancePhotoBtn: string;
  markAsDispatched: string;
  dispatchSuccess: string;

  // Voice Studio
  voiceStudioTitle: string;
  voiceStudioDesc: string;
  voiceRecording: string;
  voiceStartRecord: string;
  voiceStopRecord: string;
  voiceProcessing: string;
  voiceAutoFillSuccess: string;
  voiceLanguageNote: string;

  // Photo Enhancer Studio
  photoStudioTitle: string;
  photoStudioDesc: string;
  photoUploadPrompt: string;
  photoOriginal: string;
  photoEnhanced: string;
  photoApplyingStudio: string;
  photoSaveEnhanced: string;
  photoReset: string;

  // B2B & Wholesale
  b2bTitle: string;
  b2bSubtitle: string;
  b2bTagline: string;
  b2bBuyerName: string;
  b2bCompanyName: string;
  b2bQuantityReq: string;
  b2bSubmitRfq: string;
  b2bSuccessMsg: string;

  // Lookbook / Web Catalog
  lookbookTitle: string;
  lookbookSubtitle: string;
  shareCatalog: string;
  printCatalog: string;

  // Ask KalaKriti AI
  aiAssistantTitle: string;
  aiAssistantSubtitle: string;
  aiInputPlaceholder: string;
  aiThinking: string;
  aiQuickPrompts: string[];

  // Portal & Role Selector Landing
  portalSelectTitle: string;
  portalSelectSubtitle: string;
  roleArtisanTitle: string;
  roleArtisanDesc: string;
  roleArtisanAction: string;
  roleCustomerTitle: string;
  roleCustomerDesc: string;
  roleCustomerAction: string;
  roleB2BTitle: string;
  roleB2BDesc: string;
  roleB2BAction: string;
  roleAdminTitle: string;
  roleAdminDesc: string;
  roleAdminAction: string;
  roleCatalogTitle: string;
  roleCatalogDesc: string;
  roleCatalogAction: string;
  pillBrowseCatalog: string;
  pillFindArtisans: string;
  pillBecomeArtisan: string;
  searchBtn: string;
  switchRole: string;
  workingAs: string;
  ready30sTitle: string;
  ready30sSubtitle: string;
  ready30sAction: string;

  // Customer Customization
  requestCustomization: string;
  customizationModalTitle: string;
  customizationModalSubtitle: string;
  customColorLabel: string;
  customColorPlaceholder: string;
  customPatternLabel: string;
  customPatternPlaceholder: string;
  customSizeLabel: string;
  customSizePlaceholder: string;
  customMessageLabel: string;
  customMessagePlaceholder: string;
  customContactName: string;
  customContactPhone: string;
  customContactEmail: string;
  submitCustomizationBtn: string;
  customizationSubmittedToast: string;
  customizationRequestsTab: string;
  noCustomizationRequests: string;
  customizationStatusPending: string;
  customizationStatusAccepted: string;
  customizationStatusDeclined: string;
  acceptCustomizationBtn: string;
  declineCustomizationBtn: string;
  artisanEstimateDaysLabel: string;
  artisanEstimatePriceLabel: string;
  artisanNotePlaceholder: string;
  declineReasonPlaceholder: string;
  myCustomizationsTitle: string;
  myCustomizationsSub: string;

  // Multilingual Voice Input
  voiceSpokenLang: string;
  voiceOutputLang: string;
  voiceTranslateAction: string;
  voiceTranslating: string;
  voiceOriginalSpoken: string;
  voiceTranslatedOutput: string;

  // Admin Protection
  adminPortalTitle: string;
  adminPasskeyLabel: string;
  adminPasskeyPlaceholder: string;
  adminVerifyBtn: string;
  adminLockedNotice: string;
  adminSignOut: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'KALAKRITI',
    brandSubtitle: 'Empowering Artisans. Enriching Lives.',
    brandTagline: '— From Handmade Craft to Digital Market. —',

    navCustomerShop: 'Customer Shop',
    navArtisanPortal: 'Artisan Portal',
    navB2BBulk: 'B2B Wholesale',
    navCatalog: 'Master Catalog',
    navTracking: 'Track Order',
    navCart: 'Bag',
    navNotifications: 'Alerts',
    searchPlaceholder: 'Search handwoven dupattas, terracotta pots, silver jhumkas...',
    langSwitchEn: 'English',
    langSwitchHi: 'हिंदी',
    askAiButton: 'Ask KalaKriti AI',

    heroBadge: '✨ 100% Direct Fair Trade Craft Ecosystem',
    heroTitle: 'Authentic Indian Crafts, Direct From Master Looms & Wheels',
    heroSubtitle: 'Every handcrafted artifact is directly crafted by rural master artisans. 0% intermediary fee, direct UPI settlements, GI-tagged authenticity, and door-to-door courier tracking.',
    heroArtisanCount: '500+ Certified Artisans',
    heroCommissionFree: '100% Direct Payment to Artisans',
    heroGIAssured: 'GI-Certified Authentic Crafts',

    allCategories: 'All Crafts',
    catTextiles: 'Textiles & Weaving',
    catPottery: 'Pottery & Ceramics',
    catJewelry: 'Jewelry & Silver',
    catWoodwork: 'Woodcraft & Carving',
    catMetalwork: 'Metal & Brassware',
    catHomeDecor: 'Home & Living',
    catPaintings: 'Folk Paintings & Art',

    sortBy: 'Sort by',
    sortFeatured: 'Featured & Authentic',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortPopular: 'Most Popular',
    noProductsFound: 'No handcrafted products found matching your search.',
    clearFilters: 'Clear Filters',

    price: 'Price',
    addToCart: 'Add to Bag',
    addedToCart: 'Added to Bag',
    inStock: 'In Stock',
    unitsLeft: 'units left in cluster',
    outOfStock: 'Sold Out',
    viewDetails: 'View Craft Details',
    craftTechnique: 'Craft Technique',
    materialsUsed: 'Authentic Materials',
    artisanStory: 'The Artisan’s Legacy & Story',
    verifiedArtisan: 'Verified Master Artisan',
    directUpiTransfer: 'Direct UPI Instant Settlement',
    zeroCommissionPledge: 'Zero Middleman Commission (100% to Maker)',
    clusterOrigin: 'Craft Origin',
    listenCraftAudio: 'Listen to Artisan Audio Story',
    experienceYearsLabel: 'Years of Master Crafting',
    close: 'Close',

    yourBag: 'Your Craft Bag',
    bagEmpty: 'Your bag is empty',
    bagEmptySub: 'Support rural Indian weavers and potters by exploring their authentic handcrafted creations.',
    subtotal: 'Subtotal',
    freeShipping: 'FREE',
    shippingCharge: 'Delivery & Packaging',
    totalPayable: 'Total Payable',
    proceedToCheckout: 'Proceed to Checkout',
    continueShopping: 'Continue Exploring Crafts',
    quantity: 'Quantity',
    remove: 'Remove',

    checkoutTitle: 'Secure Artisan Checkout',
    deliveryAddress: 'Shipping & Delivery Address',
    fullName: 'Full Name',
    phoneNumber: 'Mobile Phone Number',
    emailAddress: 'Email Address',
    addressLine1: 'Street Address / House No.',
    addressLine2: 'Apartment / Area / Landmark',
    city: 'City / Town',
    state: 'State',
    pincode: 'PIN Code',
    landmark: 'Nearest Landmark',
    deliveryNotes: 'Delivery Instructions for Courier',
    paymentMethod: 'Choose Payment Option',
    payViaUpi: 'Direct Artisan UPI QR Code (Instant 0% Fee)',
    payViaCod: 'Cash on Delivery (Pay at Doorstep)',
    scanUpiQrDesc: 'Scan with any UPI app (GPay, PhonePe, Paytm, BHIM). Money transfers directly into the artisan’s verified bank account.',
    upiVerifyDesc: 'Once paid, confirm your transaction reference or proceed to generate order tracking.',
    confirmAndPlaceOrder: 'Confirm & Place Order',
    orderSuccessTitle: 'Order Successfully Placed with Artisan!',
    orderSuccessDesc: 'Thank you for directly empowering our master artisans. Your order notification and courier dispatch slip have been generated.',
    trackOrderBtn: 'Track Live Delivery',

    myOrdersTitle: 'My Handcrafted Orders & Live Tracking',
    myOrdersSubtitle: 'Real-time status updates, live courier milestones, and direct artisan fulfillment tracking.',
    noOrdersYet: 'You have not placed any orders yet.',
    orderId: 'Order ID',
    trackingNumber: 'Waybill Tracking',
    courierPartner: 'Courier Partner',
    estimatedArrival: 'Estimated Delivery',
    statusOrderPlaced: 'Order Placed',
    statusAccepted: 'Accepted by Artisan',
    statusDispatched: 'Packed & Dispatched',
    statusInTransit: 'In Transit',
    statusOutForDelivery: 'Out for Delivery',
    statusDelivered: 'Delivered to Doorstep',
    statusCancelled: 'Order Cancelled & Refunded',
    statusReturnRequested: 'Return Requested & Reverse Pickup',
    statusReturnInTransit: 'Return In Transit',
    statusReturnedRefunded: 'Returned & Refund Processed',
    statusExchangeRequested: 'Exchange Requested',
    statusExchangeInProgress: 'Exchange In Progress',
    statusExchanged: 'Exchange Completed',
    liveMapTracking: 'Courier Routing Status',
    needHelp: 'Need Artisan Help?',

    // Cancel, Return & Exchange Actions
    cancelOrderBtn: 'Cancel Order',
    cancelOrderTitle: 'Cancel Handcrafted Order',
    cancelOrderDesc: 'You can cancel your order before it is delivered. A 100% full refund will be immediately initiated to your original payment method.',
    cancelReasonLabel: 'Reason for Cancellation',
    cancelReasonPlaceholder: 'Select or specify reason for cancellation...',
    cancelConfirmBtn: 'Confirm Cancellation & Initiate Refund',
    cancelSuccessToast: 'Order cancelled. 100% refund initiated to your payment source.',

    returnProductBtn: 'Request Return',
    returnProductTitle: 'Request Return for Handcrafted Order',
    returnProductDesc: 'Items can be returned within 7 days of delivery. BlueDart reverse pickup will be scheduled at your doorstep.',
    returnReasonLabel: 'Reason for Return',
    returnReasonPlaceholder: 'Select why you would like to return this craft...',
    returnPickupAddress: 'Reverse Pickup Address',
    returnRefundOptionLabel: 'Refund Destination',
    returnSubmitBtn: 'Schedule Reverse Pickup & Return',
    returnSuccessToast: 'Return requested. Courier reverse pickup scheduled.',

    exchangeProductBtn: 'Request Exchange',
    exchangeProductTitle: 'Request Exchange for Handcrafted Order',
    exchangeProductDesc: 'Exchange your craft for a different size, colorway, or request a fresh handmade replacement.',
    exchangeReasonLabel: 'Reason for Exchange',
    exchangeReasonPlaceholder: 'Select why you need an exchange...',
    exchangeReplacementReqLabel: 'Replacement Craft Requirements / Notes',
    exchangeReplacementReqPlaceholder: 'e.g. Please send Size L instead of M, or request deeper indigo blue shade...',
    exchangeSubmitBtn: 'Submit Exchange Request',
    exchangeSuccessToast: 'Exchange request submitted. Artisan notified for replacement.',

    artisanDashboardTitle: 'Artisan Workshop & Commerce Portal',
    artisanDashboardSub: 'Manage your handcrafted inventory, record new listings via voice in Hindi or English, enhance photos, and track direct UPI payments.',
    voiceStudioTab: '🎙️ Voice Listing Studio',
    photoStudioTab: '📸 Photo Studio Enhancer',
    myListingsTab: '📦 Craft Catalog',
    ordersReceivedTab: '🚚 Order Fulfillment',
    artisanProfileTab: '👤 Master Artisan Profile',
    totalEarnings: 'Total Direct UPI Earnings',
    activeOrdersCount: 'Active Orders to Dispatch',
    publishedProductsCount: 'Live Listed Crafts',
    clusterReputation: 'Cluster Rating',
    addNewProductBtn: '+ Add New Handcrafted Item',
    recordVoiceListingBtn: '🎙️ Record Voice Description',
    enhancePhotoBtn: '📸 Enhance Photo Studio',
    markAsDispatched: 'Mark Dispatched & Print Courier Label',
    dispatchSuccess: 'Order dispatched and buyer notified via SMS/Push!',

    voiceStudioTitle: 'AI Multilingual Voice-to-Listing Studio',
    voiceStudioDesc: 'Simply speak in your regional language or Hindi. Our AI automatically extracts product title, technique, materials, price, and descriptions in both Hindi & English.',
    voiceRecording: 'Listening... Speak about your craft piece (name, materials, price, size)',
    voiceStartRecord: 'Start Voice Recording',
    voiceStopRecord: 'Stop & Generate Listing',
    voiceProcessing: 'Transcribing & structuring craft listing...',
    voiceAutoFillSuccess: 'Listing details filled automatically from your voice note!',
    voiceLanguageNote: 'Supports Hindi, Gujarati, Rajasthani, Marathi, and English voice input.',

    photoStudioTitle: 'Authentic Photo Studio Enhancer',
    photoStudioDesc: 'Enhance your craft photos with studio lighting, authentic color balance, and crisp detail while preserving the true handmade texture.',
    photoUploadPrompt: 'Upload or snap craft photo to enhance',
    photoOriginal: 'Raw Craft Photo',
    photoEnhanced: 'Studio Enhanced Finish',
    photoApplyingStudio: 'Applying studio enhancement and color correction...',
    photoSaveEnhanced: 'Use Studio Enhanced Photo',
    photoReset: 'Reset Original',

    b2bTitle: 'KalaKriti Corporate & Export Wholesale',
    b2bSubtitle: 'Direct Artisan Sourcing for Luxury Retailers, Hotels & Corporate Gifting',
    b2bTagline: 'Zero intermediaries, fair trade wages, customized bulk packaging, and export compliance.',
    b2bBuyerName: 'Buyer / Sourcing Contact',
    b2bCompanyName: 'Company / Brand / Hotel',
    b2bQuantityReq: 'Estimated Quantity (Units)',
    b2bSubmitRfq: 'Submit Bulk Sourcing RFQ',
    b2bSuccessMsg: 'Wholesale inquiry submitted! Our cluster coordinator will reach out within 24 hours.',

    lookbookTitle: 'KalaKriti Master Artisan Catalog',
    lookbookSubtitle: 'A curated public digital craft lookbook for interior designers, curators, and cultural collectors.',
    shareCatalog: 'Share Catalog Link',
    printCatalog: 'Print / Export PDF',

    aiAssistantTitle: 'Ask KalaKriti AI Assistant',
    aiAssistantSubtitle: 'Ask anything about Indian crafts, GI history, artisan clusters, material care, and styling advice.',
    aiInputPlaceholder: 'e.g. How to care for organic Kala cotton? or What makes Kutch weaving unique?',
    aiThinking: 'Consulting master craft knowledge base...',
    aiQuickPrompts: [
      'What is Kala Cotton and why is it eco-friendly?',
      'How do I care for hand-painted Madhubani art?',
      'Tell me the history of Dhokra brass casting',
      'How does KalaKriti ensure 100% goes to artisans?',
    ],

    // Portal & Role Selector Landing
    portalSelectTitle: 'Select Your Workspace & Role',
    portalSelectSubtitle: 'Choose how you want to experience KalaKriti — as an artisan, customer, wholesale buyer, curator, or admin.',
    roleArtisanTitle: 'Artisan',
    roleArtisanDesc: 'Create, manage & sell your handmade products',
    roleArtisanAction: 'Continue as Artisan →',
    roleCustomerTitle: 'Customer',
    roleCustomerDesc: 'Discover & buy authentic handmade products',
    roleCustomerAction: 'Shop Products →',
    roleB2BTitle: 'B2B Buyer',
    roleB2BDesc: 'Find artisans and source products in bulk',
    roleB2BAction: 'Find Artisans →',
    roleAdminTitle: 'Admin',
    roleAdminDesc: 'Manage users, products, orders & platform',
    roleAdminAction: 'Admin Login →',
    roleCatalogTitle: 'Web Catalog',
    roleCatalogDesc: 'Explore handmade products and discover artisans',
    roleCatalogAction: 'Explore Catalog →',
    pillBrowseCatalog: 'Browse Catalog',
    pillFindArtisans: 'Find Artisans',
    pillBecomeArtisan: 'Become an Artisan',
    searchBtn: 'Search',
    switchRole: 'Switch Role',
    workingAs: 'Working as',
    ready30sTitle: 'Product Ready in 30 Seconds',
    ready30sSubtitle: 'Zero typing required. Upload 1 photo and AI handles studio enhancement and complete listing generation.',
    ready30sAction: '✨ Ready in 30s',

    // Customer Customization
    requestCustomization: 'Request Customization',
    customizationModalTitle: 'Request Custom Handcraft',
    customizationModalSubtitle: 'Specify custom colors, motifs, dimensions, or special requests directly to the artisan.',
    customColorLabel: 'Preferred Color / Dye Shade',
    customColorPlaceholder: 'e.g. Royal Indigo, Terracotta Rust, Deep Ochre, Emerald Green...',
    customPatternLabel: 'Pattern / Motif Preference',
    customPatternPlaceholder: 'e.g. Geometric Ajrakh, Traditional Peacock, Floral Jaal, Temple Border...',
    customSizeLabel: 'Custom Size / Dimensions',
    customSizePlaceholder: 'e.g. 2.5m x 1m, Double bed size, Custom height 14 inches...',
    customMessageLabel: 'Special Instructions / Notes for the Artisan',
    customMessagePlaceholder: 'Describe special occasions, preferred finishes, or heirloom expectations...',
    customContactName: 'Your Full Name',
    customContactPhone: 'Contact Number (WhatsApp / Phone)',
    customContactEmail: 'Email Address (optional)',
    submitCustomizationBtn: 'Send Customization Request to Artisan',
    customizationSubmittedToast: 'Customization request sent directly to the master artisan! They will review it promptly.',
    customizationRequestsTab: 'Customization Inquiries',
    noCustomizationRequests: 'No customization requests received yet.',
    customizationStatusPending: 'Pending Review',
    customizationStatusAccepted: 'Accepted by Artisan',
    customizationStatusDeclined: 'Declined',
    acceptCustomizationBtn: 'Accept Request',
    declineCustomizationBtn: 'Decline Request',
    artisanEstimateDaysLabel: 'Estimated Crafting Days',
    artisanEstimatePriceLabel: 'Estimated Custom Price (₹)',
    artisanNotePlaceholder: 'Add a warm message to the customer about weaving or crafting details...',
    declineReasonPlaceholder: 'Polite reason for declining (e.g. raw material out of season, loom size limits)...',
    myCustomizationsTitle: 'My Custom Craft Inquiries',
    myCustomizationsSub: 'Track direct customization requests sent to master artisans',

    // Multilingual Voice Input
    voiceSpokenLang: 'Spoken Language',
    voiceOutputLang: 'Listing Output Language',
    voiceTranslateAction: 'Translate to Output Language',
    voiceTranslating: 'Translating voice...',
    voiceOriginalSpoken: 'Original Spoken Words',
    voiceTranslatedOutput: 'Translated Listing Text',

    // Admin Protection
    adminPortalTitle: 'KalaKriti Administrative Control',
    adminPasskeyLabel: 'Enter Administrator Secret Passkey',
    adminPasskeyPlaceholder: 'Enter secret passkey...',
    adminVerifyBtn: 'Unlock Admin Portal',
    adminLockedNotice: 'Protected platform administration portal. Authorized staff only.',
    adminSignOut: 'Lock / Exit Admin',
  },
  hi: {
    brandName: 'कलाकृति',
    brandSubtitle: 'कारीगरों का सशक्तिकरण, जीवन का संवर्धन।',
    brandTagline: '— हस्तशिल्प से डिजिटल बाज़ार तक —',

    navCustomerShop: 'ग्राहक बाज़ार',
    navArtisanPortal: 'कारीगर पोर्टल',
    navB2BBulk: 'थोक व्यापार (B2B)',
    navCatalog: 'मास्टर कैटलॉग',
    navTracking: 'ऑर्डर ट्रैकिंग',
    navCart: 'झोला',
    navNotifications: 'सूचनाएं',
    searchPlaceholder: 'हथकरघा दुपट्टा, मिट्टी के बर्तन, चांदी के झुमके खोजें...',
    langSwitchEn: 'English',
    langSwitchHi: 'हिंदी',
    askAiButton: 'कलाकृति AI से पूछें',

    heroBadge: '✨ 100% प्रत्यक्ष निष्पक्ष व्यापार शिल्प मंच',
    heroTitle: 'प्रामाणिक भारतीय हस्तशिल्प, सीधे कारीगरों के करघों और चाक से',
    heroSubtitle: 'हर हस्तनिर्मित कलाकृति सीधे ग्रामीण मास्टर कारीगरों द्वारा बनाई गई है। 0% बिचौलिया शुल्क, सीधा UPI भुगतान, जीआई (GI) टैग प्रामाणिकता, और घर तक कूरियर ट्रैकिंग।',
    heroArtisanCount: '500+ प्रमाणित कारीगर',
    heroCommissionFree: '100% भुगतान सीधे कारीगरों को',
    heroGIAssured: 'जीआई-प्रमाणित शुद्ध हस्तशिल्प',

    allCategories: 'सभी शिल्प',
    catTextiles: 'वस्त्र और बुनाई',
    catPottery: 'मिट्टी के बर्तन और सिरेमिक',
    catJewelry: 'पारंपरिक आभूषण व चांदी',
    catWoodwork: 'काष्ठ कला व नक्काशी',
    catMetalwork: 'धातु व पीतल शिल्प',
    catHomeDecor: 'गृह सज्जा व लिविंग',
    catPaintings: 'लोक चित्रकला व कला',

    sortBy: 'क्रमबद्ध करें',
    sortFeatured: 'विशेष व प्रामाणिक',
    sortPriceLow: 'कीमत: कम से अधिक',
    sortPriceHigh: 'कीमत: अधिक से कम',
    sortPopular: 'सर्वाधिक लोकप्रिय',
    noProductsFound: 'आपकी खोज के अनुसार कोई हस्तशिल्प उत्पाद नहीं मिला।',
    clearFilters: 'फ़िल्टर हटाएं',

    price: 'कीमत',
    addToCart: 'बैग में जोड़ें',
    addedToCart: 'बैग में जोड़ा गया',
    inStock: 'उपलब्ध',
    unitsLeft: 'इकाइयाँ शेष',
    outOfStock: 'स्टॉक समाप्त',
    viewDetails: 'शिल्प का विवरण देखें',
    craftTechnique: 'पारंपरिक शिल्प तकनीक',
    materialsUsed: 'प्राकृतिक सामग्री',
    artisanStory: 'कारीगर की विरासत और कहानी',
    verifiedArtisan: 'सत्यापित मास्टर कारीगर',
    directUpiTransfer: 'सीधा UPI त्वरित भुगतान',
    zeroCommissionPledge: 'शून्य बिचौलिया कमीशन (100% कारीगर को)',
    clusterOrigin: 'शिल्प का मूल स्थान',
    listenCraftAudio: 'कारीगर की ऑडियो कहानी सुनें',
    experienceYearsLabel: 'वर्षों का शिल्पकला अनुभव',
    close: 'बंद करें',

    yourBag: 'आपका शिल्प झोला (Shopping Bag)',
    bagEmpty: 'आपका झोला खाली है',
    bagEmptySub: 'ग्रामीण भारतीय बुनकरों और कुम्हारों के प्रामाणिक हस्तशिल्प को देखकर उनका सहयोग करें।',
    subtotal: 'उप-योग (Subtotal)',
    freeShipping: 'मुफ्त (FREE)',
    shippingCharge: 'डिलीवरी और सुरक्षित पैकेजिंग',
    totalPayable: 'कुल देय राशि',
    proceedToCheckout: 'चेकआउट के लिए आगे बढ़ें',
    continueShopping: 'शिल्प देखना जारी रखें',
    quantity: 'मात्रा',
    remove: 'हटाएं',

    checkoutTitle: 'सुरक्षित कारीगर चेकआउट',
    deliveryAddress: 'डिलीवरी का पता (Shipping Address)',
    fullName: 'पूरा नाम',
    phoneNumber: 'मोबाइल नंबर',
    emailAddress: 'ईमेल पता',
    addressLine1: 'मकान / फ्लैट नं. और गली',
    addressLine2: 'इलाका / कॉलोनी / क्षेत्र',
    city: 'शहर / कस्बा',
    state: 'राज्य',
    pincode: 'पिन कोड (PIN Code)',
    landmark: 'नजदीकी प्रसिद्ध स्थान (Landmark)',
    deliveryNotes: 'कूरियर वाले के लिए निर्देश',
    paymentMethod: 'भुगतान का तरीका चुनें',
    payViaUpi: 'कारीगर का सीधा UPI QR कोड (तत्काल 0% शुल्क)',
    payViaCod: 'कैश ऑन डिलीवरी (दरवाजे पर नकद भुगतान)',
    scanUpiQrDesc: 'किसी भी UPI ऐप (GPay, PhonePe, Paytm, BHIM) से स्कैन करें। पैसा सीधे कारीगर के सत्यापित खाते में जमा होगा।',
    upiVerifyDesc: 'भुगतान के बाद, अपना संदर्भ सत्यापित करें या ट्रैकिंग आईडी प्राप्त करें।',
    confirmAndPlaceOrder: 'ऑर्डर की पुष्टि करें और भेजें',
    orderSuccessTitle: 'कारीगर के साथ ऑर्डर सफलतापूर्वक दर्ज हुआ!',
    orderSuccessDesc: 'मास्टर कारीगरों को सीधे सशक्त बनाने के लिए धन्यवाद। आपका ऑर्डर अलर्ट और कूरियर प्रेषण पर्ची तैयार हो गई है।',
    trackOrderBtn: 'लाइव डिलीवरी ट्रैक करें',

    myOrdersTitle: 'मेरे हस्तशिल्प ऑर्डर और लाइव ट्रैकिंग',
    myOrdersSubtitle: 'वास्तविक समय की स्थिति अपडेट, लाइव कूरियर मील के पत्थर, और सीधा कारीगर ट्रैकिंग।',
    noOrdersYet: 'आपने अभी तक कोई ऑर्डर नहीं दिया है।',
    orderId: 'ऑर्डर आईडी',
    trackingNumber: 'वेबिल / ट्रैकिंग संख्या',
    courierPartner: 'कूरियर पार्टनर',
    estimatedArrival: 'अनुमानित डिलीवरी समय',
    statusOrderPlaced: 'ऑर्डर दर्ज हुआ',
    statusAccepted: 'कारीगर द्वारा स्वीकृत',
    statusDispatched: 'पैक और रवाना हुआ',
    statusInTransit: 'रास्ते में है',
    statusOutForDelivery: 'डिलीवरी के लिए निकला',
    statusDelivered: 'घर पर सफलतापूर्वक डिलीवर',
    statusCancelled: 'ऑर्डर रद्द और 100% रिफंड शुरू',
    statusReturnRequested: 'वापसी अनुरोध और रिवर्स पिकअप',
    statusReturnInTransit: 'वापसी पार्सल रास्ते में है',
    statusReturnedRefunded: 'वापसी पूर्ण और रिफंड जमा हुआ',
    statusExchangeRequested: 'एक्सचेंज अनुरोध प्राप्त हुआ',
    statusExchangeInProgress: 'एक्सचेंज प्रतिस्थापन प्रगति पर है',
    statusExchanged: 'एक्सचेंज सफलतापूर्वक संपन्न',
    liveMapTracking: 'कूरियर रूट की स्थिति',
    needHelp: 'कारीगर से सहायता चाहिए?',

    // Cancel, Return & Exchange Actions
    cancelOrderBtn: 'ऑर्डर रद्द करें',
    cancelOrderTitle: 'हस्तशिल्प ऑर्डर रद्द करें',
    cancelOrderDesc: 'डिलीवरी से पहले आप अपना ऑर्डर रद्द कर सकते हैं। आपके मूल भुगतान माध्यम (UPI/कार्ड) पर 100% पूरा रिफंड तुरंत शुरू कर दिया जाएगा।',
    cancelReasonLabel: 'रद्द करने का कारण',
    cancelReasonPlaceholder: 'रद्द करने का कारण चुनें या लिखें...',
    cancelConfirmBtn: 'रद्द करने की पुष्टि करें और रिफंड लें',
    cancelSuccessToast: 'ऑर्डर रद्द कर दिया गया। आपके भुगतान माध्यम पर 100% रिफंड शुरू हो गया है।',

    returnProductBtn: 'वापसी अनुरोध (Return)',
    returnProductTitle: 'हस्तशिल्प उत्पाद वापसी अनुरोध',
    returnProductDesc: 'डिलीवरी के 7 दिनों के भीतर आप वापसी का अनुरोध कर सकते हैं। ब्लू डार्ट कूरियर आपके घर से रिवर्स पिकअप करेगा।',
    returnReasonLabel: 'वापसी का कारण',
    returnReasonPlaceholder: 'वापसी का कारण चुनें...',
    returnPickupAddress: 'रिवर्स पिकअप का पता',
    returnRefundOptionLabel: 'रिफंड प्राप्त करने का माध्यम',
    returnSubmitBtn: 'रिवर्स पिकअप शेड्यूल करें और वापसी भेजें',
    returnSuccessToast: 'वापसी अनुरोध दर्ज हुआ। कूरियर पिकअप निर्धारित किया गया है।',

    exchangeProductBtn: 'एक्सचेंज अनुरोध (Exchange)',
    exchangeProductTitle: 'हस्तशिल्प उत्पाद एक्सचेंज अनुरोध',
    exchangeProductDesc: 'अपने हस्तशिल्प उत्पाद को दूसरे आकार, रंग या नए हस्तनिर्मित प्रतिस्थापन के साथ बदलें।',
    exchangeReasonLabel: 'एक्सचेंज का कारण',
    exchangeReasonPlaceholder: 'एक्सचेंज का कारण चुनें...',
    exchangeReplacementReqLabel: 'नए बदले जाने वाले उत्पाद का विवरण / निर्देश',
    exchangeReplacementReqPlaceholder: 'उदा. मुझे M की जगह L साइज़ चाहिए, या गहरा नीला रंग चाहिए...',
    exchangeSubmitBtn: 'एक्सचेंज अनुरोध सबमिट करें',
    exchangeSuccessToast: 'एक्सचेंज अनुरोध सबमिट हुआ। कारीगर को नया उत्पाद तैयार करने की सूचना भेजी गई।',

    artisanDashboardTitle: 'कारीगर कार्यशाला और बाज़ार पोर्टल',
    artisanDashboardSub: 'अपनी हस्तशिल्प सूची प्रबंधित करें, हिंदी या अंग्रेजी में आवाज़ द्वारा नए उत्पाद जोड़ें, फ़ोटो सुधारें और सीधे UPI भुगतान देखें।',
    voiceStudioTab: '🎙️ आवाज़ से उत्पाद जोड़ें',
    photoStudioTab: '📸 फ़ोटो स्टूडियो संवर्द्धन',
    myListingsTab: '📦 मेरी शिल्प सूची',
    ordersReceivedTab: '🚚 प्राप्त ऑर्डर और प्रेषण',
    artisanProfileTab: '👤 मास्टर कारीगर प्रोफ़ाइल',
    totalEarnings: 'कुल प्रत्यक्ष UPI आय',
    activeOrdersCount: 'सक्रिय ऑर्डर प्रेषण हेतु',
    publishedProductsCount: 'लाइव सूचीबद्ध हस्तशिल्प',
    clusterReputation: 'क्लस्टर प्रतिष्ठा रेटिंग',
    addNewProductBtn: '+ नया हस्तशिल्प उत्पाद जोड़ें',
    recordVoiceListingBtn: '🎙️ आवाज़ में विवरण रिकॉर्ड करें',
    enhancePhotoBtn: '📸 फ़ोटो स्टूडियो में सुधारें',
    markAsDispatched: 'रवाना करें और कूरियर लेबल निकालें',
    dispatchSuccess: 'ऑर्डर रवाना हुआ और ग्राहक को संदेश भेजा गया!',

    voiceStudioTitle: 'AI बहुभाषी वॉयस-टू-लिस्टिंग स्टूडियो',
    voiceStudioDesc: 'बस अपनी क्षेत्रीय भाषा या हिंदी में बोलें। हमारा AI स्वचालित रूप से उत्पाद का नाम, तकनीक, सामग्री, कीमत और विवरण निकाल लेता है।',
    voiceRecording: 'सुन रहे हैं... अपने शिल्प के बारे में बोलें (नाम, सामग्री, कीमत, आकार)',
    voiceStartRecord: 'आवाज़ रिकॉर्ड करना शुरू करें',
    voiceStopRecord: 'रोकें और लिस्टिंग तैयार करें',
    voiceProcessing: 'आवाज़ को समझकर विवरण तैयार किया जा रहा है...',
    voiceAutoFillSuccess: 'आपकी आवाज़ से सभी विवरण स्वचालित रूप से भर दिए गए!',
    voiceLanguageNote: 'हिंदी, गुजराती, राजस्थानी, मराठी और अंग्रेजी वॉयस इनपुट का समर्थन करता है।',

    photoStudioTitle: 'प्रामाणिक फ़ोटो स्टूडियो संवर्द्धक',
    photoStudioDesc: 'शिल्प की असली बनावट को बनाए रखते हुए स्टूडियो लाइटिंग और स्पष्ट रंगों के साथ अपनी फ़ोटो को निखारें।',
    photoUploadPrompt: 'सुधारने के लिए शिल्प की फ़ोटो अपलोड करें या खींचें',
    photoOriginal: 'मूल शिल्प फ़ोटो',
    photoEnhanced: 'स्टूडियो संवर्धित फ़ोटो',
    photoApplyingStudio: 'स्टूडियो लाइटिंग और रंग सुधार लागू किए जा रहे हैं...',
    photoSaveEnhanced: 'इस संवर्धित फ़ोटो का उपयोग करें',
    photoReset: 'मूल फ़ोटो पर रीसेट करें',

    b2bTitle: 'कलाकृति कॉर्पोरेट और निर्यात थोक व्यापार',
    b2bSubtitle: 'लक्जरी रिटेलर्स, होटलों और उपहारों के लिए सीधा कारीगर स्रोत',
    b2bTagline: 'शून्य बिचौलिए, उचित मजदूरी, अनुकूलित थोक पैकेजिंग, और निर्यात अनुपालन।',
    b2bBuyerName: 'खरीदार / संपर्क व्यक्ति',
    b2bCompanyName: 'कंपनी / ब्रांड / होटल',
    b2bQuantityReq: 'अनुमानित मात्रा (इकाइयाँ)',
    b2bSubmitRfq: 'थोक मूल्य प्रस्ताव (RFQ) भेजें',
    b2bSuccessMsg: 'थोक पूछताछ दर्ज हो गई है! हमारे क्लस्टर समन्वयक 24 घंटे के भीतर संपर्क करेंगे।',

    lookbookTitle: 'कलाकृति मास्टर कारीगर कैटलॉग',
    lookbookSubtitle: 'इंटीरियर डिजाइनरों, क्यूरेटरों और सांस्कृतिक संग्राहकों के लिए सार्वजनिक डिजिटल लुकबुक।',
    shareCatalog: 'कैटलॉग लिंक साझा करें',
    printCatalog: 'प्रिंट / PDF निर्यात',

    aiAssistantTitle: 'कलाकृति AI सहायक से पूछें',
    aiAssistantSubtitle: 'भारतीय शिल्प, जीआई इतिहास, कारीगर क्लस्टर, सामग्री देखभाल और सजावट सलाह के बारे में कुछ भी पूछें।',
    aiInputPlaceholder: 'उदा. काला कॉटन की देखभाल कैसे करें? या कच्छी बुनाई क्यों खास है?',
    aiThinking: 'शिल्प ज्ञानकोश से जानकारी ली जा रही है...',
    aiQuickPrompts: [
      'काला कॉटन (Kala Cotton) क्या है और यह पर्यावरण के अनुकूल क्यों है?',
      'हाथ से बनी मधुबनी पेंटिंग की देखभाल कैसे करें?',
      'ढोकरा पीतल शिल्प का प्राचीन इतिहास क्या है?',
      'कलाकृति यह कैसे सुनिश्चित करती है कि 100% पैसा कारीगर को मिले?',
    ],

    // Portal & Role Selector Landing
    portalSelectTitle: 'अपना कार्यक्षेत्र और भूमिका चुनें',
    portalSelectSubtitle: 'कलाकृति का अनुभव कैसे करना चाहते हैं चुनें — कारीगर, ग्राहक, थोक खरीदार, क्यूरेटर या व्यवस्थापक।',
    roleArtisanTitle: 'कारीगर (Artisan)',
    roleArtisanDesc: 'अपने हस्तनिर्मित उत्पादों को बनाएं, प्रबंधित करें और सीधे बेचें',
    roleArtisanAction: 'कारीगर के रूप में जारी रखें →',
    roleCustomerTitle: 'ग्राहक (Customer)',
    roleCustomerDesc: 'प्रामाणिक हस्तनिर्मित उत्पाद खोजें और 100% सीधे खरीदें',
    roleCustomerAction: 'उत्पाद खरीदें →',
    roleB2BTitle: 'थोक खरीदार (B2B Buyer)',
    roleB2BDesc: 'कारीगरों को खोजें और थोक ऑर्डर के लिए संपर्क करें',
    roleB2BAction: 'कारीगर खोजें →',
    roleAdminTitle: 'प्रशासक (Admin)',
    roleAdminDesc: 'उपयोगकर्ताओं, उत्पादों, ऑर्डर और प्लेटफ़ॉर्म का प्रबंधन करें',
    roleAdminAction: 'एडमिन लॉगिन →',
    roleCatalogTitle: 'वेब कैटलॉग (Web Catalog)',
    roleCatalogDesc: 'हस्तनिर्मित शिल्प देखें और मास्टर कारीगरों की खोज करें',
    roleCatalogAction: 'कैटलॉग देखें →',
    pillBrowseCatalog: 'कैटलॉग देखें',
    pillFindArtisans: 'कारीगर खोजें',
    pillBecomeArtisan: 'कारीगर बनें',
    searchBtn: 'खोजें',
    switchRole: 'भूमिका बदलें',
    workingAs: 'वर्तमान भूमिका',
    ready30sTitle: '३० सेकंड में उत्पाद तैयार',
    ready30sSubtitle: 'कारीगरों के लिए शून्य टाइपिंग: बस १ फोटो अपलोड करें और AI पूरी लिस्टिंग तैयार कर देगा।',
    ready30sAction: '✨ ३० सेकंड में तैयार',

    // Customer Customization
    requestCustomization: 'कस्टमाइज़ेशन का अनुरोध करें',
    customizationModalTitle: 'कस्टम हस्तशिल्प अनुरोध',
    customizationModalSubtitle: 'मास्टर कारीगर को सीधे अपने पसंदीदा रंग, माप, पारंपरिक रूपांकन या विशेष निर्देश भेजें।',
    customColorLabel: 'पसंदीदा रंग / डाई शेड',
    customColorPlaceholder: 'उदा. गहरा नील, गेरुआ, मस्टर्ड पीला, पन्ना हरा...',
    customPatternLabel: 'पैटर्न / पारंपरिक रूपांकन',
    customPatternPlaceholder: 'उदा. अजरक जाली, मोर बूटी, कैरी (पैसले), मंदिर बॉर्डर...',
    customSizeLabel: 'कस्टम आकार / माप',
    customSizePlaceholder: 'उदा. २.५ मीटर x १ मीटर, विशेष आकार या व्यास...',
    customMessageLabel: 'कारीगर के लिए विशेष संदेश व निर्देश',
    customMessagePlaceholder: 'विशिष्ट विवरण, उपहार या पारिवारिक उत्सव की आवश्यकता लिखें...',
    customContactName: 'आपका पूरा नाम',
    customContactPhone: 'संपर्क नंबर (व्हाट्सएप / कॉल हेतु)',
    customContactEmail: 'ईमेल पता (वैकल्पिक)',
    submitCustomizationBtn: 'कारीगर को कस्टमाइज़ेशन अनुरोध भेजें',
    customizationSubmittedToast: 'कस्टमाइज़ेशन अनुरोध सीधे मास्टर कारीगर को भेजा गया! वे शीघ्र समीक्षा करेंगे।',
    customizationRequestsTab: 'कस्टमाइज़ेशन पूछताछ',
    noCustomizationRequests: 'अभी तक कोई कस्टमाइज़ेशन अनुरोध प्राप्त नहीं हुआ है।',
    customizationStatusPending: 'समीक्षा लंबित',
    customizationStatusAccepted: 'कारीगर द्वारा स्वीकृत',
    customizationStatusDeclined: 'अस्वीकृत',
    acceptCustomizationBtn: 'अनुरोध स्वीकार करें',
    declineCustomizationBtn: 'अनुरोध अस्वीकार करें',
    artisanEstimateDaysLabel: 'अनुमानित कार्य दिवस',
    artisanEstimatePriceLabel: 'अनुमानित कस्टम मूल्य (₹)',
    artisanNotePlaceholder: 'ग्राहक को शिल्प प्रक्रिया या डिलीवरी के संबंध में संदेश लिखें...',
    declineReasonPlaceholder: 'अस्वीकृति का कारण (उदा. मौसम के कारण सामग्री अनुपलब्ध, करघा माप सीमा)...',
    myCustomizationsTitle: 'मेरे कस्टम शिल्प अनुरोध',
    myCustomizationsSub: 'कारीगरों को भेजे गए सीधे कस्टमाइज़ेशन अनुरोधों की स्थिति देखें',

    // Multilingual Voice Input
    voiceSpokenLang: 'बोली जाने वाली भाषा',
    voiceOutputLang: 'लिस्टिंग आउटपुट भाषा',
    voiceTranslateAction: 'आउटपुट भाषा में अनुवाद करें',
    voiceTranslating: 'आवाज का अनुवाद हो रहा है...',
    voiceOriginalSpoken: 'बोले गए मूल शब्द',
    voiceTranslatedOutput: 'अनुवादित लिस्टिंग टेक्स्ट',

    // Admin Protection
    adminPortalTitle: 'कलाकृति प्रशासनिक नियंत्रण',
    adminPasskeyLabel: 'प्रशासक सीक्रेट पासकी दर्ज करें',
    adminPasskeyPlaceholder: 'सीक्रेट पासकी दर्ज करें...',
    adminVerifyBtn: 'एडमिन पोर्टल खोलें',
    adminLockedNotice: 'सुरक्षित प्लेटफ़ॉर्म एडमिन पोर्टल। केवल अधिकृत कर्मियों के लिए।',
    adminSignOut: 'एडमिन से बाहर निकलें',
  },
};
