import { LanguageCode, LanguageInfo } from '../types';
import { SCREENING_TRANSLATIONS } from './screeningTranslations';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // App Branding & General
    appName: 'StreeSure',
    tagline: 'Listen. Screen. Understand. Connect.',
    heroSubtitle: "Multilingual AI-assisted women's health screening and care navigation designed to make early health awareness more accessible.",
    heroTitlePrefix: 'Understand Your Symptoms.',
    heroTitleGradient: 'Take the Next Step With Confidence.',
    heroPill: "Women's Health • Early Screening • Accessible Care",
    startScreening: 'Start My Screening',
    talkToVoiceSaathi: 'Voice Saathi',
    findDoctor: 'Find a Doctor',
    exploreHealth: 'Explore StreeSure',
    exploreKnowledge: 'Explore Knowledge',
    ashaWorkerLogin: 'ASHA Worker',
    ngoPartnerLogin: 'NGO Partner',
    doctorLogin: 'Doctor Portal',
    adminLogin: 'Admin Portal',
    signIn: 'Sign In',
    register: 'Register',
    signOut: 'Sign Out',
    disclaimerBar: 'StreeSure provides preliminary screening and health information. It does not replace professional medical diagnosis or treatment.',
    helplineText: 'Helpline: 104 / 181 (Toll-Free)',
    quickRoleDemo: 'Quick Role Demo:',
    demoModeNotice: 'SIH Live Demo Mode Active',
    medicalNotice: 'Medical Notice: This tool identifies clinical pattern correlations. It does not constitute a medical diagnosis.',
    
    // Navigation Links
    navHome: 'Home',
    navScreen: 'Screening',
    navVoiceSaathi: 'Voice Saathi',
    navProgressTracker: 'Progress Tracker',
    navExercisePortal: 'Exercise Portal',
    navHomeRemedies: 'Home Remedies',
    navPeriodTracker: 'Period Tracker',
    navHealthJourney: 'Health Journey',
    navDoctors: 'Consult Doctor',
    navKnowledgeHub: 'Knowledge Hub',
    navCareStore: 'Care Store',
    navCommunity: 'Community & Camps',
    navAnatomy3D: '3D Anatomy & Cycle',
    navSmartKit: 'Smart Kit (R&D)',
    navProfile: 'Profile',
    navDashboard: 'Dashboard',
    
    // Role Portal Labels in Nav
    ashaFieldPortal: 'ASHA Field Portal',
    beneficiaryScreening: 'Beneficiary Screening',
    beneficiaryProgress: 'Beneficiary Progress',
    ayushRemedies: 'Ayush Remedies',
    communityKit: 'Community Kit (R&D)',
    pelvicDemo: '3D Pelvic Demo',
    villageCamps: 'Village Camps',
    trainingGuides: 'Training Guides',
    patientTelemetry: 'Patient Telemetry',
    doctorDirectory: 'Doctor Directory',
    clinicalHub: 'Clinical Hub',
    ngoOperations: 'NGO Operations',
    ruralCampaigns: 'Rural Campaigns',
    subsidizedKits: 'Subsidized Kits',
    adminAnalytics: 'Admin Analytics',
    screeningEngine: 'Screening Engine',
    
    // Stats Bar
    statExplainable: '94% Explainability Score',
    statExplainableDesc: 'Transparent Rotterdam criteria indicators',
    statLanguages: '6+ Regional Languages',
    statLanguagesDesc: 'Voice & text in Hindi, Bengali, Marathi, Tamil, Telugu',
    statSubsidized: '100% Free & Subsidized',
    statSubsidizedDesc: 'Inclusive care for rural & urban communities',
    statOffline: 'Offline-Ready for ASHA',
    statOfflineDesc: 'Works in low-bandwidth rural health clinics',
    
    // Core Features Section
    featuresHeading: 'Comprehensive Care Architecture',
    featuresSubheading: 'Built for women, ASHA field workers, gynecologists, and community health organizations.',
    
    featScreeningTitle: 'AI Symptom & Risk Screening',
    featScreeningDesc: 'Evidence-based questionnaire assessing cycle irregularities, hyperandrogenism signs, and metabolic patterns.',
    featScreeningBtn: 'Take Screening',
    
    featVoiceTitle: 'Voice Saathi Multilingual AI',
    featVoiceDesc: 'Interactive speech assistant enabling natural voice queries in your native language for low-literacy accessibility.',
    featVoiceBtn: 'Speak Now',
    
    featDoctorsTitle: 'Verified Gynecologist Consultations',
    featDoctorsDesc: 'Connect with certified women’s health specialists for personalized clinical guidance and prescriptions.',
    featDoctorsBtn: 'Book Doctor',
    
    feat3DTitle: '3D Pelvic & Ovary Explorer',
    feat3DDesc: 'Interactive visual models explaining normal follicle progression versus multicystic ovary architecture.',
    feat3DBtn: 'View 3D Model',
    
    featPeriodTitle: 'Period & Symptom Cycle Diary',
    featPeriodDesc: 'Track cycle intervals, bleeding variations, pain levels, and mood patterns over time.',
    featPeriodBtn: 'Open Tracker',
    
    featRemediesTitle: 'Lifestyle & Wellness Guidance',
    featRemediesDesc: 'Evidence-informed nutrition, spearmint tea, seed cycling, and daily habits with safety disclaimers.',
    featRemediesBtn: 'Explore Remedies',
    
    featCommunityTitle: 'Community Camps & ASHA Network',
    featCommunityDesc: 'Grassroots village screening camps, PHC referral pathways, and subsidized menstrual care distribution.',
    featCommunityBtn: 'View Camps',
    
    featSmartKitTitle: 'StreeSure Sense — Research Prototype',
    featSmartKitDesc: 'Experimental low-cost optical sensing module exploring colorimetric and metabolic screening.',
    featSmartKitBtn: 'Kit Future Scope',

    // How StreeSure Works
    howItWorksHeading: 'How StreeSure Works',
    howItWorksSubheading: 'Four simple, compassionate steps from symptom awareness to verified clinical care.',
    step1Title: '1. Share Your Symptoms',
    step1Desc: 'Answer simple questions by tapping or speaking naturally in Hindi, English, Bengali, Marathi, Tamil, or Telugu.',
    step2Title: '2. Multi-Factor Pattern Analysis',
    step2Desc: 'Our engine aligns clinical patterns against established Rotterdam consensus indicators transparently.',
    step3Title: '3. Clear, Explainable Card',
    step3Desc: 'Receive a color-coded overview explaining what your result means, what it does NOT mean, and key lifestyle tips.',
    step4Title: '4. Seamless Doctor Handoff',
    step4Desc: 'Download your structured summary card to share with an ASHA worker or book a verified teleconsultation.',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'Meet Voice Saathi — Your Health Companion',
    voiceBannerSubheading: 'Ask questions freely about periods, missed cycles, cramps, or diet in your mother tongue.',
    voiceBannerBtn: 'Start Voice Conversation',
    sampleVoicePrompt1: '"What foods help with period pain?"',
    sampleVoicePrompt2: '"Why is my period delayed this month?"',
    sampleVoicePrompt3: '"How do I prepare for a doctor appointment?"',

    // Rotterdam Education
    rotterdamHeading: 'Clinically Grounded: The Rotterdam Framework',
    rotterdamSubheading: 'StreeSure assesses three key evidence-based clinical dimensions without generating synthetic scores.',
    rotterdamPillar1: '1. Ovulatory & Cycle Irregularity',
    rotterdamPillar1Desc: 'Cycles exceeding 35 days, infrequent ovulation, or unpredictable interval variations.',
    rotterdamPillar2: '2. Clinical Hyperandrogenism',
    rotterdamPillar2Desc: 'Persistent adult acne, hirsutism (excess facial/body hair), or scalp hair thinning patterns.',
    rotterdamPillar3: '3. Morphology & Metabolic Context',
    rotterdamPillar3Desc: 'Pelvic ultrasound observations, insulin dynamics, BMI shifts, and family history.',

    // FAQ Section
    faqHeading: 'Frequently Asked Questions',
    faqSubheading: 'Clear, medically reviewed answers regarding PCOS, privacy, and the screening process.',
    faqQ1: 'Is StreeSure an official medical diagnosis?',
    faqA1: 'No. StreeSure is a screening and risk assessment tool designed to help you understand your symptoms. Only a licensed gynecologist or medical doctor can formally diagnose conditions through clinical tests and pelvic ultrasound.',
    faqQ2: 'Is my health data kept private?',
    faqA2: 'Yes. Your responses are stored securely, processed with medical-grade privacy standards, and never sold to third parties.',
    faqQ3: 'How does Voice Saathi understand regional languages?',
    faqA3: 'Voice Saathi utilizes advanced speech recognition tuned for Indian regional dialects including Hindi, Bengali, Marathi, Tamil, and Telugu.',
    faqQ4: 'What should I do if my screening result is Orange or Red?',
    faqA4: 'We recommend sharing your downloadable summary report with an ASHA worker or scheduling a consultation with a verified gynecologist on our portal.',

    // CTA Banner
    ctaHeading: 'Take the First Step Toward Hormonal & Cycle Health',
    ctaSubheading: 'Join thousands of women across India who are understanding their health and connecting with verified specialists.',
    ctaPrimaryBtn: 'Begin Free Screening Now',
    ctaSecondaryBtn: 'Explore Knowledge Hub',

    // Voice
    voiceListening: 'Listening to you...',
    voiceSpeakNow: 'Speak naturally in your language...',
    voiceTapToSpeak: 'Tap microphone to speak',
    voiceStop: 'Stop listening',
    voiceReplay: 'Replay audio',
    voiceTryAsking: 'Try asking:',
    
    // Screening Levels
    levelGreen: 'Typical Physiological Variations (Lower Concern)',
    levelOrange: 'Moderate Variations (Evaluation Recommended)',
    levelRed: 'Elevated Indicators (Clinical Assessment Recommended)',
    whyResult: 'Why did I receive this result?',
    whatItMeans: 'What this result means',
    whatItDoesNotMean: 'What this result does NOT mean',
    nextSteps: 'What should I do next?',
    
    // Action Buttons
    consultGynecologist: 'Consult a Gynecologist',
    talkToAsha: 'Talk to ASHA Worker',
    trackHealth: 'Track My Health',
    learnMore: 'Learn More',
    downloadCard: 'Download Health Summary Card',
    retakeScreening: 'Retake Screening Assessment',

    // Footer
    footerHelplineTitle: '24x7 Government & Emergency Helplines (Toll-Free)',
    footerHelplineSub: 'Immediate Healthcare & Women Support Lines in India',
    footerHelplineDesc: 'If you are experiencing severe pain, abnormal hemorrhage, or need urgent medical attention, dial 104 or visit the nearest Community Health Centre.',
    footerQuickLinks: 'Quick Links',
    footerCareNavigation: 'Care Navigation',
    footerGovernmentInitiatives: 'Government Alignment',
    footerDisclaimers: 'Disclaimer: StreeSure is a non-diagnostic digital screening and health navigation application. Designed for SIH 2024 / healthcare equity.',
    allRightsReserved: 'All rights reserved.',
  },

  hi: {
    // App Branding & General
    appName: 'स्त्रीश्योर (StreeSure)',
    tagline: 'सुनें. जांचें. समझें. जुड़ें.',
    heroSubtitle: 'बहुभाषी एआई-सहायक महिला स्वास्थ्य स्क्रीनिंग और देखभाल-नेविगेशन, जो शुरुआती स्वास्थ्य जागरूकता को हर महिला तक सरल और सुलभ बनाता है।',
    heroTitlePrefix: 'अपने लक्षणों को समझें।',
    heroTitleGradient: 'आत्मविश्वास के साथ अगला कदम बढ़ाएं।',
    heroPill: 'महिला स्वास्थ्य • प्रारंभिक स्क्रीनिंग • सुलभ देखभाल',
    startScreening: 'स्क्रीनिंग शुरू करें',
    talkToVoiceSaathi: 'वॉयस साथी से बात करें',
    findDoctor: 'डॉक्टर से परामर्श लें',
    exploreHealth: 'स्त्रीश्योर को जानें',
    exploreKnowledge: 'ज्ञान केंद्र देखें',
    ashaWorkerLogin: 'आशा कार्यकर्ता',
    ngoPartnerLogin: 'एनजीओ साथी',
    doctorLogin: 'डॉक्टर पोर्टल',
    adminLogin: 'एडमिन पोर्टल',
    signIn: 'साइन इन करें',
    register: 'पंजीकरण करें',
    signOut: 'लॉग आउट',
    disclaimerBar: 'स्त्रीश्योर प्राथमिक स्क्रीनिंग और स्वास्थ्य जानकारी प्रदान करता है। यह किसी पेशेवर चिकित्सा निदान या उपचार का विकल्प नहीं है।',
    helplineText: 'हेल्पलाइन: 104 / 181 (निःशुल्क)',
    quickRoleDemo: 'डेमो रोल बदलें:',
    demoModeNotice: 'एसआईएच लाइव डेमो मोड सक्रिय',
    medicalNotice: 'चिकित्सीय सूचना: यह उपकरण नैदानिक पैटर्न को पहचानता है। यह कोई मेडिकल डायग्नोसिस नहीं है।',

    // Navigation Links
    navHome: 'होम',
    navScreen: 'स्क्रीनिंग',
    navVoiceSaathi: 'वॉयस साथी',
    navProgressTracker: 'प्रोग्रेस ट्रैकर',
    navExercisePortal: 'व्यायाम पोर्टल',
    navHomeRemedies: 'घरेलू उपचार',
    navPeriodTracker: 'माहवारी ट्रैकर',
    navHealthJourney: 'स्वास्थ्य यात्रा',
    navDoctors: 'डॉक्टर परामर्श',
    navKnowledgeHub: 'ज्ञान केंद्र',
    navCareStore: 'केयर स्टोर',
    navCommunity: 'समुदाय व कैंप',
    navAnatomy3D: '3D शरीर रचना व चक्र',
    navSmartKit: 'स्मार्ट किट (अनुसंधान)',
    navProfile: 'प्रोफ़ाइल',
    navDashboard: 'डैशबोर्ड',

    // Role Portal Labels in Nav
    ashaFieldPortal: 'आशा फील्ड पोर्टल',
    beneficiaryScreening: 'हितग्राही स्क्रीनिंग',
    beneficiaryProgress: 'हितग्राही प्रगति',
    ayushRemedies: 'आयुष घरेलू उपचार',
    communityKit: 'सामुदायिक किट (अनुसंधान)',
    pelvicDemo: '3D पेल्विक मॉडल',
    villageCamps: 'ग्राम स्वास्थ्य शिविर',
    trainingGuides: 'प्रशिक्षण पुस्तिका',
    patientTelemetry: 'मरीज़ टेलीमेट्री',
    doctorDirectory: 'डॉक्टर डायरेक्टरी',
    clinicalHub: 'क्लिनिकल हब',
    ngoOperations: 'एनजीओ संचालन',
    ruralCampaigns: 'ग्रामीण अभियान',
    subsidizedKits: 'रियायती किट',
    adminAnalytics: 'एडमिन एनालिटिक्स',
    screeningEngine: 'स्क्रीनिंग इंजन',

    // Stats Bar
    statExplainable: '94% स्पष्ट व्याख्या स्कोर',
    statExplainableDesc: 'पारदर्शी रॉटरडैम मानदंड संकेतक',
    statLanguages: '6+ भारतीय भाषाएं',
    statLanguagesDesc: 'हिंदी, बंगाली, मराठी, तमिल, तेलुगु में आवाज व टेक्स्ट',
    statSubsidized: '100% निःशुल्क व सुलभ',
    statSubsidizedDesc: 'ग्रामीण व शहरी बहनों के लिए समर्पित देखभाल',
    statOffline: 'आशा कार्यकर्ताओं के लिए ऑफलाइन तैयार',
    statOfflineDesc: 'दूरदराज के प्राथमिक स्वास्थ्य केंद्रों में भी सुचारू',

    // Core Features Section
    featuresHeading: 'व्यापक स्वास्थ्य सहायता प्रणाली',
    featuresSubheading: 'महिलाओं, आशा कार्यकर्ताओं, स्त्री रोग विशेषज्ञों और सामुदायिक संस्थाओं के लिए विशेष रूप से निर्मित।',

    featScreeningTitle: 'एआई लक्षण व जोखिम स्क्रीनिंग',
    featScreeningDesc: 'अनियमित माहवारी, अनचाहे बाल, मुँहासे व मेटाबॉलिक पैटर्न का वैज्ञानिक मूल्यांकन।',
    featScreeningBtn: 'स्क्रीनिंग करें',

    featVoiceTitle: 'वॉयस साथी बहुभाषी एआई',
    featVoiceDesc: 'अपनी मातृभाषा में बोलकर प्रश्न पूछें और सरलता से स्वास्थ्य मार्गदर्शन प्राप्त करें।',
    featVoiceBtn: 'अभी बोलें',

    featDoctorsTitle: 'सत्यापित स्त्री रोग विशेषज्ञ परामर्श',
    featDoctorsDesc: 'योग्य महिला चिकित्सकों से सुरक्षित ऑडियो/वीडियो परामर्श और उपचार सलाह प्राप्त करें।',
    featDoctorsBtn: 'डॉक्टर बुक करें',

    feat3DTitle: '3D गर्भाशय व अंडाशय मॉडल',
    feat3DDesc: 'सामान्य अंडाशय और पॉलीसिस्टिक अंडाशय के बीच का अंतर 3D विज़ुअल में आसानी से समझें।',
    feat3DBtn: '3D मॉडल देखें',

    featPeriodTitle: 'माहवारी व लक्षण डायरी',
    featPeriodDesc: 'माहवारी की तारीख, रक्तप्रवाह, दर्द और मूड के बदलाव को नियमित रूप से दर्ज करें।',
    featPeriodBtn: 'ट्रैकर खोलें',

    featRemediesTitle: 'जीवनशैली व प्राकृतिक पोषण',
    featRemediesDesc: 'संतुलित आहार, स्पीयरमिंट चाय, सीड साइकलिंग और सुरक्षा सावधानियों के साथ सलाह।',
    featRemediesBtn: 'उपचार देखें',

    featCommunityTitle: 'स्वास्थ्य शिविर व आशा नेटवर्क',
    featCommunityDesc: 'गाँवों में स्वास्थ्य शिविर, पीएचसी रेफरल और सस्ती मासिक धर्म स्वच्छता सामग्री।',
    featCommunityBtn: 'शिविर देखें',

    featSmartKitTitle: 'स्त्रीश्योर सेंस — अनुसंधान प्रोटोटाइप',
    featSmartKitDesc: 'सस्ता ऑप्टिकल सेंसिंग मॉड्यूल जो प्राथमिक बायोमार्कर और रंग-आधारित जांच में सक्षम है।',
    featSmartKitBtn: 'किट जानकारी',

    // How StreeSure Works
    howItWorksHeading: 'स्त्रीश्योर कैसे काम करता है?',
    howItWorksSubheading: 'लक्षणों को समझने से लेकर डॉक्टर से जुड़ने तक के चार सरल व सुरक्षित कदम।',
    step1Title: '1. अपने लक्षण बताएं',
    step1Desc: 'हिंदी, अंग्रेजी या अपनी भाषा में बोलकर या चुनकर सरल प्रश्नों के उत्तर दें।',
    step2Title: '2. वैज्ञानिक पैटर्न विश्लेषण',
    step2Desc: 'हमारा इंजन अंतरराष्ट्रीय रॉटरडैम दिशानिर्देशों के आधार पर पारदर्शी विश्लेषण करता है।',
    step3Title: '3. स्पष्ट व आसान परिणाम कार्ड',
    step3Desc: 'रंग-कोडेड रिपोर्ट जिसमें स्पष्ट लिखा होता है कि इस परिणाम का क्या अर्थ है और क्या नहीं।',
    step4Title: '4. डॉक्टर व आशा से जुड़ें',
    step4Desc: 'अपनी रिपोर्ट डाउनलोड करें और नजदीकी आशा दीदी या डॉक्टर को दिखाकर उचित मार्गदर्शन लें।',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'मिलिए वॉयस साथी से — आपकी अपनी स्वास्थ्य सहेली',
    voiceBannerSubheading: 'माहवारी, दर्द, आहार या पीसीओएस से जुड़े सवाल बिना किसी झिझक के अपनी भाषा में पूछें।',
    voiceBannerBtn: 'बातचीत शुरू करें',
    sampleVoicePrompt1: '"पीरियड के दर्द में कौन सा घरेलू नुस्खा काम करता है?"',
    sampleVoicePrompt2: '"मेरी माहवारी 40 दिन से नहीं आई, क्या करूं?"',
    sampleVoicePrompt3: '"डॉक्टर को दिखाने से पहले मुझे क्या तैयारी करनी चाहिए?"',

    // Rotterdam Education
    rotterdamHeading: 'वैज्ञानिक आधार: रॉटरडैम मानदंड (Rotterdam Criteria)',
    rotterdamSubheading: 'स्त्रीश्योर तीन प्रमुख चिकित्सकीय संकेतकों का निष्पक्ष मूल्यांकन करता है।',
    rotterdamPillar1: '1. माहवारी की अनियमितता',
    rotterdamPillar1Desc: '35 दिन से अधिक का अंतराल, कम रक्तस्राव या अनियमित चक्र।',
    rotterdamPillar2: '2. अतिरिक्त एंड्रोजन के लक्षण',
    rotterdamPillar2Desc: 'चेहरे या शरीर पर अनचाहे बाल (हिर्सुटिज़्म), लगातार मुँहासे या बालों का झड़ना।',
    rotterdamPillar3: '3. मेटाबॉलिक व सोनोग्राफी संदर्भ',
    rotterdamPillar3Desc: 'वज़न में अचानक बदलाव, इंसुलिन रेजिस्टेंस या पिछली अल्ट्रासाउंड रिपोर्ट।',

    // FAQ Section
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    faqSubheading: 'स्त्रीश्योर, पीसीओएस और आपकी गोपनीयता से संबंधित सभी आवश्यक उत्तर।',
    faqQ1: 'क्या स्त्रीश्योर कोई पक्की मेडिकल डायग्नोसिस देता है?',
    faqA1: 'नहीं। स्त्रीश्योर एक प्राथमिक स्क्रीनिंग और स्वास्थ्य जागरूकता टूल है। केवल एक योग्य स्त्री रोग विशेषज्ञ ही अल्ट्रासाउंड व रक्त जांच के बाद अंतिम निदान कर सकते हैं।',
    faqQ2: 'क्या मेरी व्यक्तिगत जानकारी सुरक्षित रहती है?',
    faqA2: 'हाँ, आपकी जानकारी पूरी तरह गोपनीय रहती है और इसे किसी तीसरे पक्ष के साथ साझा नहीं किया जाता।',
    faqQ3: 'वॉयस साथी क्षेत्रीय भाषाएं कैसे समझता है?',
    faqA3: 'वॉयस साथी उन्नत भारतीय भाषा एआई मॉडल का उपयोग करता है जो हिंदी, बंगाली, मराठी, तमिल और तेलुगु को सटीकता से समझता है।',
    faqQ4: 'यदि मेरा परिणाम ऑरेंज या रेड आए तो मुझे क्या करना चाहिए?',
    faqA4: 'आप तुरंत अपनी रिपोर्ट डाउनलोड करें और हमारे पोर्टल पर उपलब्ध डॉक्टर या अपनी आशा दीदी से संपर्क करें।',

    // CTA Banner
    ctaHeading: 'हार्मोनल व माहवारी स्वास्थ्य की दिशा में पहला कदम उठाएं',
    ctaSubheading: 'भारत भर की हज़ारों महिलाओं के साथ जुड़ें जो अपने स्वास्थ्य को समझ रही हैं और सही मदद पा रही हैं।',
    ctaPrimaryBtn: 'निःशुल्क स्क्रीनिंग शुरू करें',
    ctaSecondaryBtn: 'ज्ञान केंद्र देखें',

    // Voice
    voiceListening: 'हम आपको सुन रहे हैं...',
    voiceSpeakNow: 'अपनी भाषा में खुलकर बोलें...',
    voiceTapToSpeak: 'बोलने के लिए माइक दबाएं',
    voiceStop: 'रोकें',
    voiceReplay: 'फिर से सुनें',
    voiceTryAsking: 'आप पूछ सकती हैं:',

    // Screening Levels
    levelGreen: 'कम स्क्रीनिंग चिंता (सामान्य विविधता)',
    levelOrange: 'मध्यम विविधता (डॉक्टरी परामर्श की अनुशंसा)',
    levelRed: 'उच्च संकेतक (शीघ्र चिकित्सीय मूल्यांकन आवश्यक)',
    whyResult: 'मुझे यह परिणाम क्यों मिला?',
    whatItMeans: 'इस परिणाम का क्या अर्थ है',
    whatItDoesNotMean: 'इस परिणाम का क्या अर्थ नहीं है',
    nextSteps: 'अब आगे क्या करें?',

    // Action Buttons
    consultGynecologist: 'स्त्री रोग विशेषज्ञ से बात करें',
    talkToAsha: 'आशा दीदी से संपर्क करें',
    trackHealth: 'स्वास्थ्य ट्रैक करें',
    learnMore: 'अधिक जानें',
    downloadCard: 'स्वास्थ्य रिपोर्ट कार्ड डाउनलोड करें',
    retakeScreening: 'पुनः स्क्रीनिंग करें',

    // Footer
    footerHelplineTitle: '24x7 सरकारी व आपातकालीन हेल्पलाइन (निःशुल्क)',
    footerHelplineSub: 'भारत में त्वरित स्वास्थ्य व महिला सहायता हेल्पलाइन',
    footerHelplineDesc: 'यदि आपको असहनीय दर्द, अत्यधिक रक्तस्राव या आपातकालीन सहायता चाहिए, तो 104 डायल करें या नजदीकी स्वास्थ्य केंद्र जाएं।',
    footerQuickLinks: 'त्वरित लिंक',
    footerCareNavigation: 'देखभाल नेविगेशन',
    footerGovernmentInitiatives: 'सरकारी योजनाएं व सहयोग',
    footerDisclaimers: 'अस्वीकरण: स्त्रीश्योर एक गैर-निदान डिजिटल स्क्रीनिंग व स्वास्थ्य मार्गदर्शन प्लेटफ़ॉर्म है।',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
  },

  bn: {
    // App Branding & General
    appName: 'স্ত্রীশিওর (StreeSure)',
    tagline: 'শুনুন. পরীক্ষা করুন. বুঝুন. যুক্ত হন.',
    heroSubtitle: 'বহুভাষিক এআই-সহায়তাপ্রাপ্ত নারী স্বাস্থ্য স্ক্রীনিং এবং যত্ন-পরিচালনা ব্যবস্থা, যা প্রাথমিক স্বাস্থ্য সচেতনতাকে সহজলভ্য করে তোলে।',
    heroTitlePrefix: 'আপনার উপসর্গগুলি বুঝুন।',
    heroTitleGradient: 'আত্মবিশ্বাসের সাথে পরবর্তী পদক্ষেপ নিন।',
    heroPill: 'নারী স্বাস্থ্য • প্রাথমিক স্ক্রিনিং • সহজলভ্য সেবা',
    startScreening: 'স্ক্রিনিং শুরু করুন',
    talkToVoiceSaathi: 'ভয়েস সাথীর সাথে কথা বলুন',
    findDoctor: 'ডাক্তার খুঁজুন',
    exploreHealth: 'স্ত্রীশিওর সম্পর্কে জানুন',
    exploreKnowledge: 'জ্ঞান কেন্দ্র দেখুন',
    ashaWorkerLogin: 'আশা কর্মী',
    ngoPartnerLogin: 'এনজিও পার্টনার',
    doctorLogin: 'ডাক্তার পোর্টাল',
    adminLogin: 'অ্যাডমিন পোর্টাল',
    signIn: 'সাইন ইন',
    register: 'রেজিস্টার',
    signOut: 'লগ আউট',
    disclaimerBar: 'স্ত্রীশিওর প্রাথমিক স্ক্রিনিং এবং তথ্য প্রদান করে। এটি ডাক্তারের বিকল্প নয়।',
    helplineText: 'হেল্পলাইন: 104 / 181 (টোল-ফ্রি)',
    quickRoleDemo: 'ভূমিকা পরিবর্তন:',
    demoModeNotice: 'এসআইএইচ লাইভ ডেমো সক্রিয়',
    medicalNotice: 'চিকিৎসা বিজ্ঞপ্তি: এটি প্যাটার্ন বিশ্লেষণ করে, কোনো চূড়ান্ত চিকিৎসা নির্ণয় নয়।',

    // Navigation Links
    navHome: 'হোম',
    navScreen: 'স্ক্রিনিং',
    navVoiceSaathi: 'ভয়েস সাথী',
    navProgressTracker: 'প্রোগ্রেস ট্র্যাকার',
    navExercisePortal: 'ব্যায়াম পোর্টাল',
    navHomeRemedies: 'ঘরোয়া প্রতিকার',
    navPeriodTracker: 'পিরিয়ড ট্র্যাকার',
    navHealthJourney: 'স্বাস্থ্য যাত্রা',
    navDoctors: 'ডাক্তার পরামর্শ',
    navKnowledgeHub: 'জ্ঞান কেন্দ্র',
    navCareStore: 'কেয়ার স্টোর',
    navCommunity: 'কমিউনিটি ও ক্যাম্প',
    navAnatomy3D: '3D অ্যানাটমি ও চক্র',
    navSmartKit: 'স্মার্ট কিট (গবেষণা)',
    navProfile: 'প্রোফাইল',
    navDashboard: 'ড্যাশবোর্ড',

    // Role Portal Labels in Nav
    ashaFieldPortal: 'আশা ফিল্ড পোর্টাল',
    beneficiaryScreening: 'সুবিধাভোগী স্ক্রিনিং',
    beneficiaryProgress: 'সুবিধাভোগী অগ্রগতি',
    ayushRemedies: 'আয়ুশ প্রতিকার',
    communityKit: 'কমিউনিটি কিট (গবেষণা)',
    pelvicDemo: '3D পেলভিক ডেমো',
    villageCamps: 'গ্রামীণ স্বাস্থ্য শিবির',
    trainingGuides: 'প্রশিক্ষণ গাইড',
    patientTelemetry: 'রোগীর টেলিমেট্রি',
    doctorDirectory: 'ডাক্তার ডিরেক্টরি',
    clinicalHub: 'ক্লিনিকাল হাব',
    ngoOperations: 'এনজিও কার্যক্রম',
    ruralCampaigns: 'গ্রামীণ প্রচার',
    subsidizedKits: 'ভর্তুকিযুক্ত কিট',
    adminAnalytics: 'অ্যাডমিন বিশ্লেষণ',
    screeningEngine: 'স্ক্রিনিং ইঞ্জিন',

    // Stats Bar
    statExplainable: '৯৪% ব্যাখ্যাযোগ্যতা স্কোর',
    statExplainableDesc: 'স্বচ্ছ রোটারডাম মানদণ্ড সূচক',
    statLanguages: '৬+ আঞ্চলিক ভাষা',
    statLanguagesDesc: 'বাংলা, হিন্দি, মারাঠি, তামিল, তেলুগু ও ইংরেজিতে সহায়তা',
    statSubsidized: '১০০% বিনামূল্যে ও সহজলভ্য',
    statSubsidizedDesc: 'গ্রামীণ ও শহুরে মহিলাদের জন্য অন্তর্ভুক্তিমূলক যত্ন',
    statOffline: 'আশা কর্মীদের জন্য অফলাইন প্রস্তুত',
    statOfflineDesc: 'কম ইন্টারনেট সংযোগেও স্বাস্থ্যকেন্দ্রে কার্যকর',

    // Core Features Section
    featuresHeading: 'সার্বিক যত্ন পরিকাঠামো',
    featuresSubheading: 'মহিলা, আশা কর্মী, স্ত্রীরোগ বিশেষজ্ঞ এবং স্বাস্থ্য সংস্থার জন্য নির্মিত।',

    featScreeningTitle: 'এআই উপসর্গ ও ঝুঁকি স্ক্রিনিং',
    featScreeningDesc: 'অনিয়মিত মাসিক, ব্রণ এবং মেটাবলিক প্যাটার্ন মূল্যায়নের প্রশ্নাবলী।',
    featScreeningBtn: 'স্ক্রিনিং করুন',

    featVoiceTitle: 'ভয়েস সাথী বহুভাষিক এআই',
    featVoiceDesc: 'আপনার মাতৃভাষায় কথা বলে সরাসরি প্রশ্ন করুন ও সঠিক স্বাস্থ্য পরামর্শ পান।',
    featVoiceBtn: 'এখনই বলুন',

    featDoctorsTitle: 'যাচাইকৃত স্ত্রীরোগ বিশেষজ্ঞ পরামর্শ',
    featDoctorsDesc: 'যোগ্য চিকিৎসকদের সাথে নিরাপদ ভিডিও/অডিও মাধ্যমে পরামর্শ নিন।',
    featDoctorsBtn: 'ডাক্তার বুক করুন',

    feat3DTitle: '3D জরায়ু ও ডিম্বাশয় মডেল',
    feat3DDesc: 'স্বাভাবিক ডিম্বাশয় এবং পলিসিস্টিক ডিম্বাশয়ের পার্থক্য 3D মডেলে দেখুন।',
    feat3DBtn: '3D মডেল দেখুন',

    featPeriodTitle: 'পিরিয়ড ও উপসর্গ ডায়েরি',
    featPeriodDesc: 'মাসিকের চক্র, রক্তপ্রবাহ এবং মেজাজের পরিবর্তন নিয়মিত ট্র্যাক করুন।',
    featPeriodBtn: 'ট্র্যাকার খুলুন',

    featRemediesTitle: 'জীবনধারা ও প্রাকৃতিক যত্ন',
    featRemediesDesc: 'সুষম পুষ্টি, পুদিনা চা, সীড সাইক্লিং এবং সুরক্ষা নির্দেশিকা।',
    featRemediesBtn: 'প্রতিকার দেখুন',

    featCommunityTitle: 'স্বাস্থ্য শিবির ও আশা নেটওয়ার্ক',
    featCommunityDesc: 'গ্রামাঞ্চলে স্বাস্থ্য শিবির এবং সাশ্রয়ী মাসিক স্বাস্থ্য পণ্য।',
    featCommunityBtn: 'শিবির দেখুন',

    featSmartKitTitle: 'স্ত্রীশিওর সেন্স — গবেষণা প্রোটোটাইপ',
    featSmartKitDesc: 'সাশ্রয়ী অপটিক্যাল সেন্সিং মডিউল যা প্রাথমিক বায়োমার্কার বিশ্লেষণে সক্ষম।',
    featSmartKitBtn: 'কিটের ভবিষ্যৎ',

    // How StreeSure Works
    howItWorksHeading: 'স্ত্রীশিওর কিভাবে কাজ করে?',
    howItWorksSubheading: 'উপসর্গ বোঝা থেকে শুরু করে চিকিৎসকের পরামর্শ নেওয়ার ৪টি সহজ ধাপ।',
    step1Title: '১. আপনার উপসর্গ জানান',
    step1Desc: 'বাংলা বা আপনার নিজের ভাষায় কথা বলে বা বেছে নিয়ে উত্তর দিন।',
    step2Title: '২. প্যাটার্ন বিশ্লেষণ',
    step2Desc: 'আন্তর্জাতিক রোটারডাম নির্দেশিকা অনুযায়ী বিশ্লেষণ করা হয়।',
    step3Title: '৩. স্পষ্ট ফলাফল কার্ড',
    step3Desc: 'সহজে বোঝার মতো রঙ-নির্দেশিত ফলাফল এবং পরামর্শ।',
    step4Title: '৪. ডাক্তার ও আশার সাথে যোগাযোগ',
    step4Desc: 'রিপোর্ট ডাউনলোড করে স্থানীয় আশা দিদি বা ডাক্তারকে দেখান।',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'ভয়েস সাথী — আপনার ব্যক্তিগত স্বাস্থ্য সহচরী',
    voiceBannerSubheading: 'পিরিয়ড, ব্যথা বা খাদ্যতালিকা সংক্রান্ত প্রশ্ন বাংলায় সরাসরি জিজ্ঞাসা করুন।',
    voiceBannerBtn: 'কথা বলা শুরু করুন',
    sampleVoicePrompt1: '"পিরিয়ডের ব্যথায় কি ঘরোয়া উপায় কাজে লাগে?"',
    sampleVoicePrompt2: '"আমার পিরিয়ড দেরিতে হচ্ছে কেন?"',
    sampleVoicePrompt3: '"ডাক্তার দেখানোর আগে কি প্রস্তুতি নেওয়া দরকার?"',

    // Rotterdam Education
    rotterdamHeading: 'ক্লিনিকাল ভিত্তি: রোটারডাম ফ্রেমওয়ার্ক',
    rotterdamSubheading: 'স্ত্রীশিওর তিনটি প্রধান ক্লিনিকাল সূচক মূল্যায়ন করে।',
    rotterdamPillar1: '১. ডিম্বস্ফোটন ও মাসিকের অনিয়ম',
    rotterdamPillar1Desc: '৩৫ দিনের বেশি ব্যবধান বা অপ্রত্যাশিত চক্র পরিবর্তন।',
    rotterdamPillar2: '২. অ্যান্ড্রোজেনের লক্ষণ',
    rotterdamPillar2Desc: 'অবাঞ্ছিত লোম, ব্রণ বা চুল পড়ার প্রবণতা।',
    rotterdamPillar3: '৩. মেটাবলিক ও আল্ট্রাসাউন্ড প্রসঙ্গ',
    rotterdamPillar3Desc: 'ওজন পরিবর্তন, ইনসুলিন রেজিস্ট্যান্স বা পূর্ববর্তী আল্ট্রাসাউন্ড।',

    // FAQ Section
    faqHeading: 'সাধারণ জিজ্ঞাসা (FAQ)',
    faqSubheading: 'স্ত্রীশিওর এবং পিসিওএস সম্পর্কে প্রয়োজনীয় তথ্য।',
    faqQ1: 'স্ত্রীশিওর কি চূড়ান্ত চিকিৎসা নির্ণয় দেয়?',
    faqA1: 'না। এটি একটি প্রাথমিক স্ক্রিনিং টুল। চূড়ান্ত রোগ নির্ণয়ের জন্য চিকিৎসকের পরামর্শ অপরিহার্য।',
    faqQ2: 'আমার তথ্য কি গোপন থাকে?',
    faqA2: 'হ্যাঁ, আপনার সমস্ত তথ্য সম্পূর্ণ নিরাপদ ও গোপন রাখা হয়।',
    faqQ3: 'ভয়েস সাথী বাংলা কীভাবে বোঝে?',
    faqA3: 'ভয়েস সাথী ভারতীয় আঞ্চলিক ভাষার আধুনিক এআই মডেল দ্বারা চালিত।',
    faqQ4: 'ফলাফল অরেঞ্জ বা রেড হলে কি করব?',
    faqA4: 'রিপোর্ট ডাউনলোড করে অবিলম্বে আশা কর্মী বা ডাক্তারের সাথে পরামর্শ করুন।',

    // CTA Banner
    ctaHeading: 'হরমোন ও মাসিক স্বাস্থ্যের সঠিক যত্ন নিন',
    ctaSubheading: 'ভারতের হাজার হাজার নারীর সাথে যুক্ত হন এবং সঠিক পরামর্শ পান।',
    ctaPrimaryBtn: 'বিনামূল্যে স্ক্রিনিং শুরু করুন',
    ctaSecondaryBtn: 'জ্ঞান কেন্দ্র দেখুন',

    // Voice
    voiceListening: 'শুনছি...',
    voiceSpeakNow: 'আপনার ভাষায় কথা বলুন...',
    voiceTapToSpeak: 'কথা বলতে মাইকে চাপুন',
    voiceStop: 'থামান',
    voiceReplay: 'পুনরায় শুনুন',
    voiceTryAsking: 'আপনি জিজ্ঞাসা করতে পারেন:',

    // Screening Levels
    levelGreen: 'কম স্ক্রিনিং উদ্বেগ (স্বাভাবিক)',
    levelOrange: 'পরামর্শের সুপারিশ (ডাক্তার দেখানো ভালো)',
    levelRed: 'জরুরী ডাক্তার মূল্যায়ন বাঞ্ছনীয়',
    whyResult: 'কেন এই ফলাফল এল?',
    whatItMeans: 'এই ফলাফলের অর্থ',
    whatItDoesNotMean: 'এই ফলাফলের যা অর্থ নয়',
    nextSteps: 'পরবর্তী পদক্ষেপ',

    // Action Buttons
    consultGynecologist: 'স্ত্রীরোগ বিশেষজ্ঞের পরামর্শ',
    talkToAsha: 'আশা কর্মীর সাথে কথা বলুন',
    trackHealth: 'স্বাস্থ্য ট্র্যাক করুন',
    learnMore: 'আরো জানুন',
    downloadCard: 'রিপোর্ট কার্ড ডাউনলোড করুন',
    retakeScreening: 'পুনরায় স্ক্রিনিং করুন',

    // Footer
    footerHelplineTitle: '২৪x৭ সরকারী ও জরুরী হেল্পলাইন (টোল-ফ্রি)',
    footerHelplineSub: 'ভারতে জরুরী স্বাস্থ্য ও নারী সহায়তা লাইন',
    footerHelplineDesc: 'তীব্র যন্ত্রণা বা অতিরিক্ত রক্তপাতের ক্ষেত্রে ১০৪ নম্বরে কল করুন।',
    footerQuickLinks: 'জরুরী লিঙ্ক',
    footerCareNavigation: 'যত্ন সহায়িকা',
    footerGovernmentInitiatives: 'সরকারী উদ্যোগ',
    footerDisclaimers: 'দাবিত্যাগ: স্ত্রীশিওর একটি প্রাথমিক ডিজিটাল স্ক্রিনিং প্ল্যাটফর্ম।',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
  },

  mr: {
    // App Branding & General
    appName: 'स्त्रीश्योर (StreeSure)',
    tagline: 'ऐका. तपासा. समजा. जोडा.',
    heroSubtitle: 'बहुभाषिक AI-सहाय्यित महिला आरोग्य स्क्रीनिंग आणि काळजी-मार्गदर्शन प्लॅटफॉर्म, जे आरोग्यविषयक जाणीव प्रत्येक महिलेपर्यंत पोहोचवते.',
    heroTitlePrefix: 'तुमची लक्षणे समजून घ्या.',
    heroTitleGradient: 'आत्मविश्वासाने पुढचे पाऊल टाका.',
    heroPill: 'महिला आरोग्य • प्राथमिक तपासणी • सुलभ काळजी',
    startScreening: 'स्क्रीनिंग सुरू करा',
    talkToVoiceSaathi: 'व्हॉइस साथीशी बोला',
    findDoctor: 'डॉक्टरांचा सल्ला घ्या',
    exploreHealth: 'स्त्रीश्योर समजून घ्या',
    exploreKnowledge: 'ज्ञान केंद्र पहा',
    ashaWorkerLogin: 'आशा सेविका',
    ngoPartnerLogin: 'एनजीओ भागीदार',
    doctorLogin: 'डॉक्टर पोर्टल',
    adminLogin: 'प्रशासक पोर्टल',
    signIn: 'साइन इन',
    register: 'नोंदणी करा',
    signOut: 'लॉग आउट',
    disclaimerBar: 'स्त्रीश्योर प्राथमिक तपासणी व माहिती पुरवते. हा वैद्यकीय निदानाचा पर्याय नाही.',
    helplineText: 'हेल्पलाइन: 104 / 181 (टोल-फ्री)',
    quickRoleDemo: 'भूमिका बदला:',
    demoModeNotice: 'SIH थेट डेमो मोड सक्रिय',
    medicalNotice: 'वैद्यकीय सूचना: हे साधन केवळ क्लिनिकल पॅटर्न ओळखते, अंतिम निदान नाही.',

    // Navigation Links
    navHome: 'मुख्यपृष्ठ',
    navScreen: 'स्क्रीनिंग',
    navVoiceSaathi: 'व्हॉइस साथी',
    navProgressTracker: 'प्रोग्रेस ट्रॅकर',
    navExercisePortal: 'व्यायाम पोर्टल',
    navHomeRemedies: 'घरगुती उपाय',
    navPeriodTracker: 'मासिक पाळी ट्रॅकर',
    navHealthJourney: 'आरोग्य प्रवास',
    navDoctors: 'डॉक्टर सल्ला',
    navKnowledgeHub: 'ज्ञान केंद्र',
    navCareStore: 'केअर स्टोअर',
    navCommunity: 'समुदाय व शिबिरे',
    navAnatomy3D: '3D शरीररचना व चक्र',
    navSmartKit: 'स्मार्ट किट (संशोधन)',
    navProfile: 'प्रोफाइल',
    navDashboard: 'डॅशबोर्ड',

    // Role Portal Labels in Nav
    ashaFieldPortal: 'आशा फील्ड पोर्टल',
    beneficiaryScreening: 'लाभार्थी स्क्रीनिंग',
    beneficiaryProgress: 'लाभार्थी प्रगती',
    ayushRemedies: 'आयुष घरगुती उपाय',
    communityKit: 'समुदाय किट (संशोधन)',
    pelvicDemo: '3D पेल्विक मॉडेल',
    villageCamps: 'ग्राम आरोग्य शिबिरे',
    trainingGuides: 'प्रशिक्षण मार्गदर्शिका',
    patientTelemetry: 'रुग्ण टेलीमेट्री',
    doctorDirectory: 'डॉक्टर निर्देशिका',
    clinicalHub: 'क्लिनिकल हब',
    ngoOperations: 'एनजीओ ऑपरेशन्स',
    ruralCampaigns: 'ग्रामीण मोहिमा',
    subsidizedKits: 'सवलतीचे किट्स',
    adminAnalytics: 'अॅडमिन विश्लेषण',
    screeningEngine: 'स्क्रीनिंग इंजिन',

    // Stats Bar
    statExplainable: '९४% स्पष्टता स्कोअर',
    statExplainableDesc: 'पारदर्शक रॉटरडॅम निकष निर्देशक',
    statLanguages: '६+ प्रादेशिक भाषा',
    statLanguagesDesc: 'मराठी, हिंदी, बंगाली, तमिळ, तेलगू मध्ये आवाज व मजकूर',
    statSubsidized: '१००% मोफत व सुलभ',
    statSubsidizedDesc: 'ग्रामीण व शहरी भागातील महिलांसाठी समर्पित',
    statOffline: 'आशा सेविकांसाठी ऑफलाइन तयार',
    statOfflineDesc: 'कमी इंटरनेट असलेल्या प्राथमिक केंद्रांमध्येही कार्यरत',

    // Core Features Section
    featuresHeading: 'सर्वसमावेशक आरोग्य सेवा रचना',
    featuresSubheading: 'महिला, आशा सेविका, स्त्रीरोगतज्ज्ञ आणि आरोग्य संस्थांसाठी विशेष रचना.',

    featScreeningTitle: 'AI लक्षण व जोखीम स्क्रीनिंग',
    featScreeningDesc: 'अनियमित मासिक पाळी, चेहऱ्यावरील केस, मुरुमे व चयापचय लक्षणांचे विश्लेषण.',
    featScreeningBtn: 'स्क्रीनिंग करा',

    featVoiceTitle: 'व्हॉइस साथी बहुभाषिक AI',
    featVoiceDesc: 'तुमच्या भाषेत बोलून प्रश्न विचारा आणि त्वरित आरोग्य मार्गदर्शन मिळवा.',
    featVoiceBtn: 'आता बोला',

    featDoctorsTitle: 'सत्यापित स्त्रीरोगतज्ज्ञ सल्ला',
    featDoctorsDesc: 'तज्ज्ञ महिला डॉक्टरांशी खाजगी व्हिडिओ किंवा ऑडिओद्वारे संपर्क साधा.',
    featDoctorsBtn: 'डॉक्टर बुक करा',

    feat3DTitle: '3D गर्भाशय व अंडाशय मॉडेल',
    feat3DDesc: 'सामान्य अंडाशय आणि पीसीओएस अंडाशयामधील फरक 3D मध्ये समजून घ्या.',
    feat3DBtn: '3D मॉडेल पहा',

    featPeriodTitle: 'मासिक पाळी व लक्षण डायरी',
    featPeriodDesc: 'मासिक पाळीच्या तारखा, रक्तस्त्राव आणि मूडमधील बदल नोंदवून ठेवा.',
    featPeriodBtn: 'ट्रॅकर उघडा',

    featRemediesTitle: 'जीवनशैली व नैसर्गिक उपाय',
    featRemediesDesc: 'संतुलित आहार, पुदिना चहा, सीड सायकलिंग आणि सुरक्षित मार्गदर्शक तत्त्वे.',
    featRemediesBtn: 'उपाय पहा',

    featCommunityTitle: 'आरोग्य शिबिरे व आशा नेटवर्क',
    featCommunityDesc: 'गावागावांत तपासणी शिबिरे आणि परवडणारी मासिक पाळी स्वच्छता उत्पादने.',
    featCommunityBtn: 'शिबिरे पहा',

    featSmartKitTitle: 'स्त्रीश्योर सेन्स — संशोधन प्रोटोटाइप',
    featSmartKitDesc: 'कमी खर्चाचे ऑप्टिकल सेन्सिंग मॉड्युल जे प्राथमिक तपासणीत उपयुक्त आहे.',
    featSmartKitBtn: 'किट भविष्य',

    // How StreeSure Works
    howItWorksHeading: 'स्त्रीश्योर कसे कार्य करते?',
    howItWorksSubheading: 'लक्षणे समजण्यापासून डॉक्टरांचा सल्ला घेण्यापर्यंतची ४ सोपी पावले.',
    step1Title: '१. तुमची लक्षणे सांगा',
    step1Desc: 'मराठीत बोलून किंवा निवडून सोप्या प्रश्नांची उत्तरे द्या.',
    step2Title: '२. वैज्ञानिक पॅटर्न विश्लेषण',
    step2Desc: 'आंतरराष्ट्रीय रॉटरडॅम मार्गदर्शक तत्त्वांनुसार पारदर्शक विश्लेषण.',
    step3Title: '३. स्पष्ट निकाल कार्ड',
    step3Desc: 'निकालाचा नेमका काय अर्थ आहे हे दर्शविणारा रंग-कोडित रिपोर्ट.',
    step4Title: '४. डॉक्टर व आशा यांच्याशी संपर्क',
    step4Desc: 'रिपोर्ट डाऊनलोड करून आशा सेविका किंवा डॉक्टरांना दाखवा.',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'भेटा व्हॉइस साथीला — तुमची हक्काची आरोग्य मैत्रीण',
    voiceBannerSubheading: 'मासिक पाळी, पोटदुखी किंवा आहाराबद्दल मराठीत मोकळेपणाने विचारा.',
    voiceBannerBtn: 'संभाषण सुरू करा',
    sampleVoicePrompt1: '"मासिक पाळीच्या पोटदुखीत कोणता घरगुती उपाय करावा?"',
    sampleVoicePrompt2: '"माझी मासिक पाळी उशिरा का येत आहे?"',
    sampleVoicePrompt3: '"डॉक्टरांना भेटण्यापूर्वी कोणती तयारी करावी?"',

    // Rotterdam Education
    rotterdamHeading: 'क्लिनिकल आधार: रॉटरडॅम निकष (Rotterdam Criteria)',
    rotterdamSubheading: 'स्त्रीश्योर तीन प्रमुख क्लिनिकल घटकांचे वस्तुनिष्ठ मूल्यांकन करते.',
    rotterdamPillar1: '१. ओव्हुलेशन व पाळीची अनियमितता',
    rotterdamPillar1Desc: '३५ दिवसांपेक्षा जास्त अंतर किंवा अनियमित चक्र.',
    rotterdamPillar2: '२. अतिरिक्त एंड्रोजनची लक्षणे',
    rotterdamPillar2Desc: 'चेहऱ्यावरील अतिरिक्त केस, सततचे मुरुम किंवा केस गळणे.',
    rotterdamPillar3: '३. चयापचय व सोनोग्राफी संदर्भ',
    rotterdamPillar3Desc: 'वजनात अचानक बदल, इन्सुलिन रेजिस्टेंस किंवा अल्ट्रासाउंड संदर्भ.',

    // FAQ Section
    faqHeading: 'नेहमी विचारले जाणारे प्रश्न (FAQ)',
    faqSubheading: 'स्त्रीश्योर, पीसीओएस आणि तुमच्या गोपनीयतेबद्दल महत्त्वाची माहिती.',
    faqQ1: 'स्त्रीश्योर अंतिम वैद्यकीय निदान देते का?',
    faqA1: 'नाही. हे केवळ प्राथमिक स्क्रीनिंग टूल आहे. अंतिम निदानासाठी स्त्रीरोगतज्ज्ञांचा सल्ला आवश्यक आहे.',
    faqQ2: 'माझी माहिती सुरक्षित राहते का?',
    faqA2: 'होय, तुमची माहिती पूर्णपणे खाजगी व सुरक्षित ठेवली जाते.',
    faqQ3: 'व्हॉइस साथी मराठी कसे समजते?',
    faqA3: 'हे प्रगत भारतीय भाषा AI मॉडेलवर आधारित आहे जे मराठी अचूकपणे समजते.',
    faqQ4: 'निकाल ऑरेंज किंवा रेड आल्यास काय करावे?',
    faqA4: 'रिपोर्ट डाऊनलोड करून त्वरित आशा सेविका किंवा डॉक्टरांचा सल्ला घ्या.',

    // CTA Banner
    ctaHeading: 'हार्मोनल व पाळीच्या आरोग्यासाठी पहिले पाऊल उचला',
    ctaSubheading: 'आपले आरोग्य समजून घेणाऱ्या देशभरातील हजारो महिलांसोबत सामील व्हा.',
    ctaPrimaryBtn: 'मोफत स्क्रीनिंग सुरू करा',
    ctaSecondaryBtn: 'ज्ञान केंद्र पहा',

    // Voice
    voiceListening: 'आम्ही ऐकत आहोत...',
    voiceSpeakNow: 'आपल्या भाषेत बोला...',
    voiceTapToSpeak: 'बोलण्यासाठी माइक दाबा',
    voiceStop: 'थांबवा',
    voiceReplay: 'पुन्हा ऐका',
    voiceTryAsking: 'तुम्ही विचारू शकता:',

    // Screening Levels
    levelGreen: 'कमी स्क्रीनिंग चिंता (सामान्य)',
    levelOrange: 'तपासणीची शिफारस (डॉक्टरांचा सल्ला घ्यावा)',
    levelRed: 'त्वरित डॉक्टरी सल्ला आवश्यक',
    whyResult: 'मला हा निकाल का मिळाला?',
    whatItMeans: 'या निकालाचा अर्थ काय',
    whatItDoesNotMean: 'या निकालाचा काय अर्थ नाही',
    nextSteps: 'पुढे काय करावे?',

    // Action Buttons
    consultGynecologist: 'स्त्रीरोगतज्ज्ञांचा सल्ला घ्या',
    talkToAsha: 'आशा सेविकेशी संपर्क करा',
    trackHealth: 'आरोग्य ट्रॅक करा',
    learnMore: 'अधिक माहिती',
    downloadCard: 'आरोग्य रिपोर्ट डाऊनलोड करा',
    retakeScreening: 'पुन्हा तपासणी करा',

    // Footer
    footerHelplineTitle: '२४x७ शासकीय व आपत्कालीन हेल्पलाइन (टोल-फ्री)',
    footerHelplineSub: 'भारतातील त्वरित आरोग्य व महिला मदत हेल्पलाइन',
    footerHelplineDesc: 'तीव्र वेदना किंवा आपत्कालीन परिस्थितीत १०४ वर संपर्क साधा.',
    footerQuickLinks: 'महत्त्वाच्या लिंक्स',
    footerCareNavigation: 'आरोग्य मार्गदर्शन',
    footerGovernmentInitiatives: 'शासकीय उपक्रम',
    footerDisclaimers: 'अस्वीकरण: स्त्रीश्योर हे प्राथमिक डिजिटल स्क्रीनिंग साधन आहे.',
    allRightsReserved: 'सर्व हक्क राखीव.',
  },

  ta: {
    // App Branding & General
    appName: 'ஸ்திரீஷ்யூர் (StreeSure)',
    tagline: 'கேளுங்கள். பரிசோதியுங்கள். புரிந்து கொள்ளுங்கள். இணையுங்கள்.',
    heroSubtitle: 'பெண்கள் சுகாதார விழிப்புணர்வு மற்றும் AI பரிசோதனை தளம், ஆரம்ப சுகாதார விழிப்புணர்வை எளிதாக்குகிறது.',
    heroTitlePrefix: 'உங்கள் அறிகுறிகளைப் புரிந்து கொள்ளுங்கள்.',
    heroTitleGradient: 'நம்பிக்கையுடன் அடுத்த அடியை எடுத்து வையுங்கள்.',
    heroPill: 'பெண்கள் நலம் • ஆரம்ப பரிசோதனை • எளிதான அணுகல்',
    startScreening: 'பரிசோதனையைத் தொடங்குங்கள்',
    talkToVoiceSaathi: 'குரல் தோழியிடம் பேசுங்கள்',
    findDoctor: 'மருத்துவரை அணுகவும்',
    exploreHealth: 'ஸ்திரீஷ்யூர் பற்றி அறிக',
    exploreKnowledge: 'அறிவு மையம்',
    ashaWorkerLogin: 'ஆஷா பணியாளர்',
    ngoPartnerLogin: 'தன்னார்வ அமைப்பு',
    doctorLogin: 'மருத்துவர் தளம்',
    adminLogin: 'நிர்வாக தளம்',
    signIn: 'உள்நுழைய',
    register: 'பதிவு செய்ய',
    signOut: 'வெளியேறு',
    disclaimerBar: 'ஸ்திரீஷ்யூர் ஆரம்பகட்ட வழிகாட்டுதலையே வழங்குகிறது. இது மருத்துவ சிகிச்சைக்கு மாற்று அல்ல.',
    helplineText: 'உதவி எண்: 104 / 181 (கட்டணமில்லா எண்)',
    quickRoleDemo: 'பயனர் முறை மாற்று:',
    demoModeNotice: 'SIH நேரடி டெமோ முறை செயலில் உள்ளது',
    medicalNotice: 'மருத்துவக் குறிப்பு: இது மருத்துவப் பாங்குகளை மட்டுமே மதிப்பீடு செய்கிறது, இறுதி நோய் கண்டறிதல் அல்ல.',

    // Navigation Links
    navHome: 'முகப்பு',
    navScreen: 'பரிசோதனை',
    navVoiceSaathi: 'குரல் தோழி',
    navProgressTracker: 'முன்னேற்ற கண்காணிப்பு',
    navExercisePortal: 'உடற்பயிற்சி தளம்',
    navHomeRemedies: 'வீட்டு வைத்தியம்',
    navPeriodTracker: 'மாதவிடாய் கண்காணிப்பு',
    navHealthJourney: 'ஆரோக்கிய பயணம்',
    navDoctors: 'மருத்துவர் ஆலோசனை',
    navKnowledgeHub: 'அறிவு மையம்',
    navCareStore: 'பராமரிப்பு அங்காடி',
    navCommunity: 'முகாம்கள்',
    navAnatomy3D: '3D உடற்கூறியல்',
    navSmartKit: 'ஸ்மார்ட் கிட் (ஆராய்ச்சி)',
    navProfile: 'சுயவிவரம்',
    navDashboard: 'டாஷ்போர்டு',

    // Role Portal Labels in Nav
    ashaFieldPortal: 'ஆஷா கள போர்டல்',
    beneficiaryScreening: 'பயனாளி பரிசோதனை',
    beneficiaryProgress: 'பயனாளி முன்னேற்றம்',
    ayushRemedies: 'ஆயுஷ் வைத்தியம்',
    communityKit: 'சமூக கிட் (ஆராய்ச்சி)',
    pelvicDemo: '3D இடுப்பு மாதிரி',
    villageCamps: 'கிராம நல முகாம்கள்',
    trainingGuides: 'பயிற்சி கையேடு',
    patientTelemetry: 'நோயாளி தரவு',
    doctorDirectory: 'மருத்துவர் அடைவு',
    clinicalHub: 'மருத்துவ மையம்',
    ngoOperations: 'தன்னார்வ செயல்பாடுகள்',
    ruralCampaigns: 'கிராமப்புற பிரச்சாரங்கள்',
    subsidizedKits: 'மானிய கிட்கள்',
    adminAnalytics: 'நிர்வாக பகுப்பாய்வு',
    screeningEngine: 'பரிசோதனை எஞ்சின்',

    // Stats Bar
    statExplainable: '94% வெளிப்படைத்தன்மை',
    statExplainableDesc: 'ராட்டர்டாம் அளவுகோல் அடிப்படையிலானது',
    statLanguages: '6+ பிராந்திய மொழிகள்',
    statLanguagesDesc: 'தமிழ், இந்தி, தெலுங்கு, மராத்தி, வங்காள மொழிகளில் குரல் மற்றும் உரை',
    statSubsidized: '100% இலவசம் மற்றும் மானியம்',
    statSubsidizedDesc: 'கிராமப்புற மற்றும் நகர்ப்புற பெண்களுக்கான சேவை',
    statOffline: 'ஆஷா பணியாளர்களுக்கு ஆஃப்லைன் தயார்',
    statOfflineDesc: 'குறைந்த இணைய வசதியிலும் இயங்கக்கூடியது',

    // Core Features Section
    featuresHeading: 'முழுமையான பராமரிப்பு கட்டமைப்பு',
    featuresSubheading: 'பெண்கள், ஆஷா பணியாளர்கள் மற்றும் மருத்துவர்களுக்காக உருவாக்கப்பட்டது.',

    featScreeningTitle: 'AI அறிகுறி பரிசோதனை',
    featScreeningDesc: 'மாதவிடாய் ஒழுங்கின்மை, முகப்பரு மற்றும் ஹார்மோன் மாற்றங்களை மதிப்பீடு செய்யும் வினாடி வினா.',
    featScreeningBtn: 'பரிசோதிக்கவும்',

    featVoiceTitle: 'குரல் தோழி AI',
    featVoiceDesc: 'உங்கள் சொந்த மொழியில் பேசி உங்கள் சந்தேகங்களுக்கு உடனடி விடை பெறுங்கள்.',
    featVoiceBtn: 'இப்போது பேசுங்கள்',

    featDoctorsTitle: 'மகப்பேறு மருத்துவர் ஆலோசனை',
    featDoctorsDesc: 'அங்கீகரிக்கப்பட்ட பெண் மருத்துவர்களிடம் பாதுகாப்பான ஆலோசனை பெறுங்கள்.',
    featDoctorsBtn: 'மருத்துவரை பதிவு செய்க',

    feat3DTitle: '3D கருப்பை மற்றும் சினைப்பை மாதிரி',
    feat3DDesc: 'சாதாரண சினைப்பை மற்றும் பிசிஓஎஸ் சினைப்பை வேறுபாட்டை 3D முறையில் அறிந்து கொள்ளுங்கள்.',
    feat3DBtn: '3D மாதிரி காண்க',

    featPeriodTitle: 'மாதவிடாய் நாட்குறிப்பு',
    featPeriodDesc: 'மாதவிடாய் தேதிகள் மற்றும் அறிகுறிகளை தொடர்ந்து கண்காணிக்கவும்.',
    featPeriodBtn: 'டிராக்கரைத் திறக்கவும்',

    featRemediesTitle: 'வாழ்க்கை முறை & இயற்கை நலம்',
    featRemediesDesc: 'சத்தான உணவு, புதினா தேநீர் மற்றும் விதை சுழற்சி முறைகள்.',
    featRemediesBtn: 'வைத்தியம் பார்க்க',

    featCommunityTitle: 'சமூக நல முகாம்கள் & ஆஷா நெட்வொர்க்',
    featCommunityDesc: 'கிராமப்புற பரிசோதனை முகாம்கள் மற்றும் மலிவு விலை மாதவிடாய் பொருட்கள்.',
    featCommunityBtn: 'முகாம்களைப் பார்க்க',

    featSmartKitTitle: 'ஸ்திரீஷ்யூர் சென்ஸ் — ஆராய்ச்சி மாதிரி',
    featSmartKitDesc: 'குறைந்த விலை ஆப்டிகல் சென்சார் மூலம் ஆரம்ப நிலை சோதனைகள்.',
    featSmartKitBtn: 'கிட் விவரம்',

    // How StreeSure Works
    howItWorksHeading: 'ஸ்திரீஷ்யூர் எவ்வாறு செயல்படுகிறது?',
    howItWorksSubheading: 'அறிகுறிகளை அறிவது முதல் மருத்துவரை அணுகுவது வரையிலான 4 எளிய படிகள்.',
    step1Title: '1. உங்கள் அறிகுறிகளைப் பகிருங்கள்',
    step1Desc: 'தமிழில் பேசியோ அல்லது தேர்ந்தெடுத்தோ எளிய கேள்விகளுக்குப் பதிலளிக்கவும்.',
    step2Title: '2. மருத்துவ பகுப்பாய்வு',
    step2Desc: 'ராட்டர்டாம் மருத்துவ வழிகாட்டுதல்களின்படி வெளிப்படையான மதிப்பீடு.',
    step3Title: '3. தெளிவான முடிவு அட்டை',
    step3Desc: 'முடிவின் உண்மையான அர்த்தத்தை விளக்கும் வண்ண குறியீட்டு அட்டை.',
    step4Title: '4. மருத்துவர் மற்றும் ஆஷா இணைப்பு',
    step4Desc: 'அறிக்கையைப் பதிவிறக்கி ஆஷா பணியாளர் அல்லது மருத்துவரிடம் காண்பிக்கவும்.',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'குரல் தோழியை சந்தியுங்கள் — உங்கள் நல்வாழ்வு தோழி',
    voiceBannerSubheading: 'மாதவிடாய், வலி அல்லது உணவு பற்றி தமிழில் தயக்கமின்றி கேளுங்கள்.',
    voiceBannerBtn: 'பேசத் தொடங்குங்கள்',
    sampleVoicePrompt1: '"மாதவிடாய் வலிக்கு என்ன வீட்டு வைத்தியம் உள்ளது?"',
    sampleVoicePrompt2: '"எனக்கு மாதவிடாய் தாமதமாக வருவது ஏன்?"',
    sampleVoicePrompt3: '"மருத்துவரை சந்திக்கும் முன் என்ன செய்ய வேண்டும்?"',

    // Rotterdam Education
    rotterdamHeading: 'ராட்டர்டாம் மருத்துவ அளவுகோல்',
    rotterdamSubheading: 'ஸ்திரீஷ்யூர் மூன்று முக்கிய மருத்துவப் பகுதிகளை மதிப்பீடு செய்கிறது.',
    rotterdamPillar1: '1. அண்டவிடுப்பு மற்றும் மாதவிடாய் சுழற்சி',
    rotterdamPillar1Desc: '35 நாட்களுக்கு மேலான சுழற்சி அல்லது ஒழுங்கற்ற தன்மை.',
    rotterdamPillar2: '2. ஆன்ட்ரோஜன் ஹார்மோன் அறிகுறிகள்',
    rotterdamPillar2Desc: 'தேவையற்ற முடி வளர்ச்சி, முகப்பரு அல்லது முடி உதிர்தல்.',
    rotterdamPillar3: '3. அல்ட்ராசவுண்ட் மற்றும் மெட்டபாலிசம்',
    rotterdamPillar3Desc: 'உடல் எடை மாற்றங்கள், இன்சுலின் எதிர்ப்பு அல்லது முந்தைய ஸ்கேன்.',

    // FAQ Section
    faqHeading: 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)',
    faqSubheading: 'ஸ்திரீஷ்யூர் மற்றும் பிசிஓஎஸ் பற்றிய முக்கிய கேள்விகளுக்கான பதில்கள்.',
    faqQ1: 'ஸ்திரீஷ்யூர் உறுதியான மருத்துவ முடிவை வழங்குமா?',
    faqA1: 'இல்லை. இது ஒரு ஆரம்ப பரிசோதனை கருவி மட்டுமே. இறுதி முடிவுக்கு மருத்துவரை அணுக வேண்டும்.',
    faqQ2: 'என் தரவுகள் பாதுகாப்பாக உள்ளதா?',
    faqA2: 'ஆம், உங்கள் தகவல்கள் முற்றிலும் ரகசியமாக வைக்கப்படும்.',
    faqQ3: 'குரல் தோழி தமிழை எவ்வாறு புரிந்துகொள்கிறது?',
    faqA3: 'இது மேம்பட்ட இந்திய மொழி AI தொழில்நுட்பத்தின் மூலம் தமிழை துல்லியமாக புரிந்துகொள்கிறது.',
    faqQ4: 'முடிவு ஆரஞ்சு அல்லது சிவப்பு என்றால் என்ன செய்வது?',
    faqA4: 'அறிக்கையைப் பதிவிறக்கம் செய்து உடனடியாக மருத்துவரை அல்லது ஆஷா பணியாளரை அணுகவும்.',

    // CTA Banner
    ctaHeading: 'ஹார்மோன் ஆரோக்கியத்திற்கான முதல் படியை எடுங்கள்',
    ctaSubheading: 'ஆரோக்கியத்தை உணர்ந்து நல்வாழ்வு பெறும் ஆயிரக்கணக்கான பெண்களுடன் இணையுங்கள்.',
    ctaPrimaryBtn: 'இலவச பரிசோதனையைத் தொடங்குங்கள்',
    ctaSecondaryBtn: 'அறிவு மையம் காண்க',

    // Voice
    voiceListening: 'கேட்கிறோம்...',
    voiceSpeakNow: 'உங்கள் மொழியில் பேசுங்கள்...',
    voiceTapToSpeak: 'பேச மைக் பொத்தானை அழுத்தவும்',
    voiceStop: 'நிறுத்து',
    voiceReplay: 'மீண்டும் கேள்',
    voiceTryAsking: 'நீங்கள் கேட்கலாம்:',

    // Screening Levels
    levelGreen: 'குறைந்த இடர் அளவு (இயல்பான மாற்றம்)',
    levelOrange: 'மருத்துவ ஆலோசனை பரிந்துரைக்கப்படுகிறது',
    levelRed: 'உடனடி மருத்துவ ஆலோசனை தேவை',
    whyResult: 'இந்த முடிவு ஏன் கிடைத்தது?',
    whatItMeans: 'இதன் பொருள் என்ன',
    whatItDoesNotMean: 'இதன் பொருள் அல்லாதவை',
    nextSteps: 'அடுத்த கட்ட நடவடிக்கைகள்',

    // Action Buttons
    consultGynecologist: 'மகப்பேறு மருத்துவரை அணுகவும்',
    talkToAsha: 'ஆஷா தோழியிடம் பேசவும்',
    trackHealth: 'ஆரோக்கியத்தை கண்காணிக்கவும்',
    learnMore: 'மேலும் அறிய',
    downloadCard: 'சுருக்க அறிக்கையைப் பதிவிறக்குக',
    retakeScreening: 'மீண்டும் பரிசோதிக்கவும்',

    // Footer
    footerHelplineTitle: '24x7 அரசு மற்றும் அவசர உதவி எண்கள் (கட்டணமில்லா எண்)',
    footerHelplineSub: 'இந்தியாவில் உடனடி மகளிர் உதவி எண்கள்',
    footerHelplineDesc: 'கடுமையான வலி அல்லது அவசர நிலைக்கு 104 அல்லது 181 ஐ அழைக்கவும்.',
    footerQuickLinks: 'முக்கிய இணைப்புகள்',
    footerCareNavigation: 'வழிகாட்டுதல்',
    footerGovernmentInitiatives: 'அரசு திட்டங்கள்',
    footerDisclaimers: 'பொறுப்புத் துறப்பு: ஸ்திரீஷ்யூர் ஒரு டிஜிட்டல் பரிசோதனை தளம் மட்டுமே.',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  },

  te: {
    // App Branding & General
    appName: 'స్త్రీష్యూర్ (StreeSure)',
    tagline: 'వినండి. పరిశీలించండి. అర్థం చేసుకోండి. కలవండి.',
    heroSubtitle: 'మహిళల ఆరోగ్య ప్రాథమిక అవగాహన మరియు AI స్క్రీనింగ్ వేదిక, మహిళల ఆరోగ్య రక్షణను మరింత సులభతరం చేస్తుంది.',
    heroTitlePrefix: 'మీ లక్షణాలను అర్థం చేసుకోండి.',
    heroTitleGradient: 'ఆత్మవిశ్వాసంతో తదుపరి అడుగు వేయండి.',
    heroPill: 'మహిళా ఆరోగ్యం • ప్రాథమిక స్క్రీనింగ్ • సులభ సంరక్షణ',
    startScreening: 'స్క్రీనింగ్ ప్రారంభించండి',
    talkToVoiceSaathi: 'వాయిస్ సాతీతో మాట్లాడండి',
    findDoctor: 'వైద్యులను సంప్రదించండి',
    exploreHealth: 'స్త్రీష్యూర్ గురించి తెలుసుకోండి',
    exploreKnowledge: 'నాలెడ్జ్ హబ్ చూడండి',
    ashaWorkerLogin: 'ఆశా కార్యకర్త',
    ngoPartnerLogin: 'ఎన్జీవో భాగస్వామి',
    doctorLogin: 'డాక్టర్ పోర్టల్',
    adminLogin: 'అడ్మిన్ పోర్టల్',
    signIn: 'సైన్ ఇన్',
    register: 'రిజిస్టర్',
    signOut: 'లాగ్ అవుట్',
    disclaimerBar: 'స్త్రీష్యూర్ ప్రాథమిక స్క్రీనింగ్ అందిస్తుంది. ఇది వైద్య నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు.',
    helplineText: 'హెల్ప్‌లైన్: 104 / 181 (టోల్-ఫ్రీ)',
    quickRoleDemo: 'పాత్ర మార్పు:',
    demoModeNotice: 'SIH ప్రత్యక్ష డెమో మోడ్ సక్రియంగా ఉంది',
    medicalNotice: 'వైద్య గమనిక: ఇది లక్షణాల పోకడలను మాత్రమే విశ్లేషిస్తుంది, తుది రోగ నిర్ధారణ కాదు.',

    // Navigation Links
    navHome: 'హోమ్',
    navScreen: 'స్క్రీనింగ్',
    navVoiceSaathi: 'వాయిస్ సాతీ',
    navProgressTracker: 'ప్రోగ్రెస్ ట్రాకర్',
    navExercisePortal: 'వ్యాయామ పోర్టల్',
    navHomeRemedies: 'గృహ చిట్కాలు',
    navPeriodTracker: 'పీరియడ్ ట్రాకర్',
    navHealthJourney: 'ఆరోగ్య ప్రయాణం',
    navDoctors: 'డాక్టర్ సంప్రదింపు',
    navKnowledgeHub: 'నాలెడ్జ్ హబ్',
    navCareStore: 'కేర్ స్టోర్',
    navCommunity: 'కమ్యూనిటీ & క్యాంపులు',
    navAnatomy3D: '3D శరీరనిర్మాణం & చక్రం',
    navSmartKit: 'స్మార్ట్ కిట్ (పరిశోధన)',
    navProfile: 'ప్రొఫైల్',
    navDashboard: 'డాష్‌బోర్డ్',

    // Role Portal Labels in Nav
    ashaFieldPortal: 'ఆశా ఫీల్డ్ పోర్టల్',
    beneficiaryScreening: 'లబ్ధిదారుల స్క్రీనింగ్',
    beneficiaryProgress: 'లబ్ధిదారుల ప్రగతి',
    ayushRemedies: 'ఆయుష్ నివారణలు',
    communityKit: 'కమ్యూనిటీ కిట్ (పరిశోధన)',
    pelvicDemo: '3D పెల్విక్ డెమో',
    villageCamps: 'గ్రామీణ ఆరోగ్య శిబిరాలు',
    trainingGuides: 'శిక్షణ మార్గదర్శకాలు',
    patientTelemetry: 'రోగి టెలిమెట్రీ',
    doctorDirectory: 'డాక్టర్ల డైరెక్టరీ',
    clinicalHub: 'క్లినికల్ హబ్',
    ngoOperations: 'ఎన్జీవో కార్యకలాపాలు',
    ruralCampaigns: 'గ్రామీణ ప్రచారాలు',
    subsidizedKits: 'రాయితీ కిట్లు',
    adminAnalytics: 'అడ్మిన్ విశ్లేషణలు',
    screeningEngine: 'స్క్రీనింగ్ ఇంజిన్',

    // Stats Bar
    statExplainable: '94% వివరణాత్మక స్కోరు',
    statExplainableDesc: 'రోటర్‌డ్యామ్ ప్రమాణాల సూచికలు',
    statLanguages: '6+ ప్రాంతీయ భాషలు',
    statLanguagesDesc: 'తెలుగు, హిందీ, తమిళం, మరాఠీ, బెంగాలీలో వాయిస్ మరియు టెక్స్ట్',
    statSubsidized: '100% ఉచితం & అందుబాటులో',
    statSubsidizedDesc: 'గ్రామీణ మరియు పట్టణ మహిళల కోసం ప్రత్యేక సంరక్షణ',
    statOffline: 'ఆశా కార్యకర్తల కోసం ఆఫ్‌లైన్ సదుపాయం',
    statOfflineDesc: 'తక్కువ ఇంటర్నెట్ ఉన్న ప్రాంతాలలోనూ పని చేస్తుంది',

    // Core Features Section
    featuresHeading: 'సమగ్ర ఆరోగ్య సంరక్షణ వేదిక',
    featuresSubheading: 'మహిళలు, ఆశా కార్యకర్తలు, వైద్యుల కోసం రూపొందించబడింది.',

    featScreeningTitle: 'AI లక్షణాల స్క్రీనింగ్',
    featScreeningDesc: 'రుతుక్రమ సమస్యలు, మొటిమలు మరియు హార్మోన్ల మార్పుల ప్రాథమిక అంచనా.',
    featScreeningBtn: 'స్క్రీనింగ్ చేయండి',

    featVoiceTitle: 'వాయిస్ సాతీ AI',
    featVoiceDesc: 'మీ సొంత భాషలో మాట్లాడి మీ ఆరోగ్య సందేహాలను నివృత్తి చేసుకోండి.',
    featVoiceBtn: 'ఇప్పుడే మాట్లాడండి',

    featDoctorsTitle: 'గైనకాలజిస్ట్ సంప్రదింపులు',
    featDoctorsDesc: 'అనుభవజ్ఞులైన వైద్యులతో సురక్షితమైన వీడియో/ఆడియో సంప్రదింపులు.',
    featDoctorsBtn: 'డాక్టర్‌ను బుక్ చేయండి',

    feat3DTitle: '3D గర్భాశయ & అండాశయ నమూనా',
    feat3DDesc: 'సాధారణ అండాశయం మరియు పిసిఒఎస్ అండాశయం తేడాలను 3Dలో సులభంగా అర్థం చేసుకోండి.',
    feat3DBtn: '3D మోడల్ చూడండి',

    featPeriodTitle: 'పీరియడ్ & లక్షణాల డైరీ',
    featPeriodDesc: 'రుతుక్రమ తేదీలు, రక్తప్రవాహం మరియు మానసిక మార్పులను నమోదు చేసుకోండి.',
    featPeriodBtn: 'ట్రాకర్ తెరవండి',

    featRemediesTitle: 'జీవనశైలి & సహజ చిట్కాలు',
    featRemediesDesc: 'పౌష్టికాహారం, పుదీనా టీ, సీడ్ సైక్లింగ్ మరియు భద్రతా సూచనలు.',
    featRemediesBtn: 'చిట్కాలు చూడండి',

    featCommunityTitle: 'ఆరోగ్య శిబిరాలు & ఆశా నెట్‌వర్క్',
    featCommunityDesc: 'గ్రామాల్లో పరీక్షా శిబిరాలు మరియు సరసమైన రుతుక్రమ సంరక్షణ వస్తువులు.',
    featCommunityBtn: 'శిబిరాలు చూడండి',

    featSmartKitTitle: 'స్త్రీష్యూర్ సెన్స్ — పరిశోధనా ప్రోటోటైప్',
    featSmartKitDesc: 'ప్రాథమిక విశ్లేషణ కోసం తక్కువ ఖర్చుతో కూడిన ఆప్టికల్ సెన్సార్.',
    featSmartKitBtn: 'కిట్ భవిష్యత్తు',

    // How StreeSure Works
    howItWorksHeading: 'స్త్రీష్యూర్ ఎలా పనిచేస్తుంది?',
    howItWorksSubheading: 'లక్షణాలను అర్థం చేసుకోవడం నుండి వైద్యుడిని సంప్రదించే వరకు 4 సులభమైన దశలు.',
    step1Title: '1. మీ లక్షణాలను తెలపండి',
    step1Desc: 'తెలుగులో మాట్లాడటం ద్వారా లేదా ఎంపిక చేసుకోవడం ద్వారా సమాధానాలు ఇవ్వండి.',
    step2Title: '2. శాస్త్రీయ విశ్లేషణ',
    step2Desc: 'రోటర్‌డ్యామ్ మార్గదర్శకాల ప్రకారం పారదర్శక విశ్లేషణ.',
    step3Title: '3. స్పష్టమైన ఫలితాల కార్డు',
    step3Desc: 'ఫలితం యొక్క అర్థాన్ని తెలిపే రంగుల కార్డు.',
    step4Title: '4. వైద్యులు మరియు ఆశాతో సంప్రదింపు',
    step4Desc: 'నివేదికను డౌన్‌లోడ్ చేసి ఆశా కార్యకర్తకు లేదా డాక్టర్‌కు చూపించండి.',

    // Voice Saathi Spotlight
    voiceBannerHeading: 'వాయిస్ సాతీని కలవండి — మీ ఆరోగ్య నేస్తం',
    voiceBannerSubheading: 'పీరియడ్స్, నొప్పి లేదా ఆహారం గురించి తెలుగులో నిస్సంకోచంగా అడగండి.',
    voiceBannerBtn: 'సంభాషణ ప్రారంభించండి',
    sampleVoicePrompt1: '"పీరియడ్స్ నొప్పికీ గృహ చిట్కాలు ఏమిటి?"',
    sampleVoicePrompt2: '"నా పీరియడ్ ఆలస్యంగా ఎందుకు వస్తోంది?"',
    sampleVoicePrompt3: '"డాక్టర్‌ను కలిసే ముందు ఏ వివరాలు సిద్ధం చేసుకోవాలి?"',

    // Rotterdam Education
    rotterdamHeading: 'రోటర్‌డ్యామ్ వైద్య ప్రమాణాలు',
    rotterdamSubheading: 'స్త్రీష్యూర్ మూడు ముఖ్యమైన వైద్య విభాగాలను అంచనా వేస్తుంది.',
    rotterdamPillar1: '1. అండోత్సర్గము & రుతుక్రమ అవకతవకలు',
    rotterdamPillar1Desc: '35 రోజుల కంటే ఎక్కువ వ్యవధి లేదా క్రమం తప్పిన సైకిల్.',
    rotterdamPillar2: '2. ఆండ్రోజెన్ లక్షణాలు',
    rotterdamPillar2Desc: 'అవాంఛిత రోమాలు, మొటిమలు లేదా జుట్టు రాలడం.',
    rotterdamPillar3: '3. మెటబాలిజం & అల్ట్రాసౌండ్ వివరాలు',
    rotterdamPillar3Desc: 'బరువులో మార్పులు, ఇన్సులిన్ రెసిస్టెన్స్ లేదా స్కానింగ్ వివరాలు.',

    // FAQ Section
    faqHeading: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    faqSubheading: 'స్త్రీష్యూర్ మరియు పిసిఒఎస్ గురించిన ముఖ్యమైన సమాధానాలు.',
    faqQ1: 'స్త్రీష్యూర్ తుది వైద్య నిర్ధారణను ఇస్తుందా?',
    faqA1: 'కాదు. ఇది కేవలం ప్రాథమిక స్క్రీనింగ్ మాత్రమే. తుది నిర్ధారణకు వైద్యుడిని సంప్రదించాలి.',
    faqQ2: 'నా వివరాలు సురక్షితంగా ఉంటాయా?',
    faqA2: 'అవును, మీ సమాచారం పూర్తిగా సురక్షితంగా మరియు రహస్యంగా ఉంచబడుతుంది.',
    faqQ3: 'వాయిస్ సాతీ తెలుగును ఎలా అర్థం చేసుకుంటుంది?',
    faqA3: 'ఇది ఆధునిక భారతీయ భాషా AI మోడల్స్ సహాయంతో తెలుగును ఖచ్చితంగా అర్థం చేసుకుంటుంది.',
    faqQ4: 'ఫలితం ఆరెంజ్ లేదా రెడ్ వస్తే ఏమి చేయాలి?',
    faqA4: 'రిపోర్టును డౌన్‌లోడ్ చేసి వెంటనే ఆశా కార్యకర్తను లేదా వైద్యుడిని సంప్రదించండి.',

    // CTA Banner
    ctaHeading: 'హార్మోన్ల ఆరోగ్య దిశగా మొదటి అడుగు వేయండి',
    ctaSubheading: 'ఆరోగ్యాన్ని అర్థం చేసుకుంటున్న వేలాది మంది మహిళలతో చేరండి.',
    ctaPrimaryBtn: 'ఉచిత స్క్రీనింగ్ ప్రారంభించండి',
    ctaSecondaryBtn: 'నాలెడ్జ్ హబ్ చూడండి',

    // Voice
    voiceListening: 'వింటున్నాము...',
    voiceSpeakNow: 'మీ భాషలో మాట్లాడండి...',
    voiceTapToSpeak: 'మాట్లాడటానికి మైక్ నొక్కండి',
    voiceStop: 'ఆపండి',
    voiceReplay: 'మళ్లీ వినండి',
    voiceTryAsking: 'మీరు అడగవచ్చు:',

    // Screening Levels
    levelGreen: 'తక్కువ స్క్రీనింగ్ ఆందోళన (సాధారణం)',
    levelOrange: 'వైద్యుని సంప్రదింపు సిఫార్సు చేయబడింది',
    levelRed: 'త్వరిత వైద్య మూల్యాంకనం సిఫార్సు చేయబడింది',
    whyResult: 'ఈ ఫలితం ఎందుకు వచ్చింది?',
    whatItMeans: 'దీని అర్థం ఏమిటి',
    whatItDoesNotMean: 'దీని అర్థం కానివి',
    nextSteps: 'తరువాత ఏమి చేయాలి?',

    // Action Buttons
    consultGynecologist: 'గైనకాలజిస్ట్‌ను సంప్రదించండి',
    talkToAsha: 'ఆశా కార్యకర్తతో మాట్లాడండి',
    trackHealth: 'ఆరోగ్యాన్ని ట్రాక్ చేయండి',
    learnMore: 'మరింత తెలుసుకోండి',
    downloadCard: 'ఆరోగ్య నివేదిక కార్డు డౌన్‌లోడ్ చేయండి',
    retakeScreening: 'మళ్లీ స్క్రీనింగ్ చేయండి',

    // Footer
    footerHelplineTitle: '24x7 ప్రభుత్వ & అత్యవసర హెల్ప్‌లైన్లు (టోల్-ఫ్రీ)',
    footerHelplineSub: 'భారతదేశంలో తక్షణ ఆరోగ్య మరియు మహిళా సహాయక లైన్లు',
    footerHelplineDesc: 'తీవ్రమైన నొప్పి లేదా అత్యవసర పరిస్థితిలో 104 లేదా 181 కు కాల్ చేయండి.',
    footerQuickLinks: 'ముఖ్యమైన లింకులు',
    footerCareNavigation: 'ఆరోగ్య మార్గదర్శనం',
    footerGovernmentInitiatives: 'ప్రభుత్వ పథకాలు',
    footerDisclaimers: 'గమనిక: స్త్రీష్యూర్ ఒక డిజిటల్ స్క్రీనింగ్ ప్లాట్‌ఫారమ్ మాత్రమే.',
    allRightsReserved: 'సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
  },
};

export function getTranslation(lang: LanguageCode, key: string): string {
  if (SCREENING_TRANSLATIONS[lang] && SCREENING_TRANSLATIONS[lang][key]) {
    return SCREENING_TRANSLATIONS[lang][key];
  }
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  if (SCREENING_TRANSLATIONS['en'] && SCREENING_TRANSLATIONS['en'][key]) {
    return SCREENING_TRANSLATIONS['en'][key];
  }
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  return key;
}
