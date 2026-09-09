import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Heart,
  Calendar,
  Clock,
  AlertTriangle,
  Sparkles,
  Shield,
  Activity,
  UserCheck,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { LanguageCode, ScreeningAnswers, ScreeningResult } from '../types';
import { speakText, stopSpeaking, playChime } from '../services/voiceService';
import { calculateScreeningResult, defaultMockScreeningAnswers } from '../services/screeningEngine';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface VoiceScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onComplete: (result: ScreeningResult) => void;
  onOpenConsultDoctor?: () => void;
}

interface QuestionDef {
  id: string;
  field: string;
  category: 'menstrual' | 'symptoms' | 'history';
  spokenText: Record<LanguageCode, string>;
  titleText: Record<LanguageCode, string>;
  options: {
    id: string;
    label: Record<LanguageCode, string>;
    subtitle?: Record<LanguageCode, string>;
    color: string;
    icon: any;
    keywords: Record<LanguageCode, string[]>;
    apply: (answers: ScreeningAnswers) => void;
  }[];
}

const VOICE_QUESTIONS: QuestionDef[] = [
  {
    id: 'q1_regularity',
    field: 'cycleRegularity',
    category: 'menstrual',
    spokenText: {
      hi: 'नमस्ते दीदी! पहला सवाल: आपकी माहवारी यानी पीरियड्स समय पर आती है, या देर से आती है?',
      en: 'Hello! First question: Do your menstrual periods arrive regularly on time, or are they delayed?',
      bn: 'নমস্কার! প্রথম প্রশ্ন: আপনার মাসিক কি সময়ে হয়, নাকি দেরিতে হয়?',
      mr: 'नमस्कार ताई! पहिला प्रश्न: तुमची मासिक पाळी वेळेवर येते की उशिरा येते?',
      ta: 'வணக்கம்! முதல் கேள்வி: உங்கள் மாதவிடாய் சரியான நேரத்தில் வருகிறதா அல்லது தாமதமாகிறதா?',
      te: 'నమస్కారం! మొదటి ప్రశ్న: మీ పీరియడ్స్ సమయానికి వస్తున్నాయా లేదా ఆలస్యంగా వస్తున్నాయా?',
    },
    titleText: {
      hi: '१. माहवारी का समय व नियमितता',
      en: '1. Period Timing & Regularity',
      bn: '১. মাসিকের সময় ও নিয়মিততা',
      mr: '१. मासिक पाळीची वेळ आणि नियमितता',
      ta: '1. மாதவிடாய் நேரம் மற்றும் ஒழுங்குமுறை',
      te: '1. పీరియడ్స్ సమయం మరియు క్రమబద్ధత',
    },
    options: [
      {
        id: 'regular',
        label: {
          hi: 'समय पर आती है (२१-३५ दिन)',
          en: 'Regular (Every 21 to 35 days)',
          bn: 'নিয়মিত সময়ে হয় (২১-৩৫ দিন)',
          mr: 'वेळेवर येते (२१ ते ३५ दिवस)',
          ta: 'சரியான நேரத்தில் (21-35 நாட்கள்)',
          te: 'సమయానికి వస్తుంది (21-35 రోజులు)',
        },
        subtitle: {
          hi: 'हर महीने तय समय पर',
          en: 'Predictable monthly cycle',
          bn: 'প্রতি মাসে নির্দিষ্ট সময়ে',
          mr: 'दरमहा नियमितपणे',
          ta: 'ஒவ்வொரு மாதமும் சீராக',
          te: 'ప్రతి నెలా క్రమం తప్పకుండా',
        },
        color: 'emerald',
        icon: Calendar,
        keywords: {
          hi: ['समय पर', 'नियमित', 'ठीक', 'टाइम', 'नार्मल', 'सही', '28', '30'],
          en: ['regular', 'on time', 'normal', 'predictable', 'yes'],
          bn: ['নিয়মিত', 'সময়ে', 'ঠিক'],
          mr: ['वेळेवर', 'नियमित', 'योग्य', 'होय'],
          ta: ['சரியான', 'வழக்கமான', 'நேரத்தில்', 'ஆம்'],
          te: ['సమయానికి', 'క్రమబద్ధంగా', 'అవును'],
        },
        apply: (ans) => {
          ans.cycleRegularity = 'regular_21_35';
          ans.daysBetweenPeriods = 28;
          if (ans.menstrualProfile) {
            ans.menstrualProfile.cycleRegularity = 'regular_21_35';
            ans.menstrualProfile.averageCycleLengthDays = 28;
          }
        },
      },
      {
        id: 'delayed',
        label: {
          hi: 'देर से आती है (३५ दिन से ज्यादा)',
          en: 'Delayed / Late (> 35 days)',
          bn: 'দেরিতে হয় (৩৫ দিনের বেশি)',
          mr: 'उशिरा येते (३५ दिवसांपेक्षा जास्त)',
          ta: 'தாமதமாக வருகிறது (35 நாட்களுக்கு மேல்)',
          te: 'ఆలస్యంగా వస్తుంది (35 రోజులకు పైగా)',
        },
        subtitle: {
          hi: 'अक्सर देर हो जाती है',
          en: 'Frequently late cycles',
          bn: 'প্রায়ই দেরি হয়',
          mr: 'वारंवार उशीर होतो',
          ta: 'அடிக்கடி தாமதம்',
          te: 'తరచుగా ఆలస్యం',
        },
        color: 'amber',
        icon: Clock,
        keywords: {
          hi: ['देर', 'लेट', '35', '40', '45', 'उलटा', 'ज्यादा दिन', 'अक्सर देर'],
          en: ['delayed', 'late', 'irregular', 'infrequent', 'over 35', 'slow'],
          bn: ['দেরি', 'দেরিতে', 'অনিয়মিত'],
          mr: ['उशिरा', 'उशीर', 'लेट', 'जास्त'],
          ta: ['தாமதம்', 'தாமதமாக', 'நீண்ட'],
          te: ['ఆలస్యం', 'ఆలస్యంగా', 'ఎక్కువ'],
        },
        apply: (ans) => {
          ans.cycleRegularity = 'infrequent_over_35';
          ans.daysBetweenPeriods = 42;
          if (ans.menstrualProfile) {
            ans.menstrualProfile.cycleRegularity = 'infrequent_over_35';
            ans.menstrualProfile.averageCycleLengthDays = 42;
            ans.menstrualProfile.frequentlyOver35Days = true;
          }
        },
      },
      {
        id: 'absent',
        label: {
          hi: 'महीनों से बंद है (३+ महीने)',
          en: 'Missed for Months (> 3 months)',
          bn: 'কয়েকমাস বন্ধ আছে (৩+ মাস)',
          mr: 'महिन्यांपासून बंद आहे (३+ महिने)',
          ta: 'மாதக்கணக்கில் வரவில்லை (3+ மாதங்கள்)',
          te: 'నెలల తరబడి ఆగిపోయింది (3+ నెలలు)',
        },
        subtitle: {
          hi: 'लंबे समय से नहीं आई',
          en: 'No period for 90+ days',
          bn: 'দীর্ঘদিন যাবত বন্ধ',
          mr: 'खूप दिवसांपासून नाही',
          ta: 'நீண்ட நாட்களாக இல்லை',
          te: 'చాలా కాలంగా రాలేదు',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['बंद', 'नहीं आई', 'छूट गई', 'तीन महीने', 'महीनों', 'गायब', 'बिल्कुल नहीं'],
          en: ['absent', 'missed', 'stopped', 'no period', 'months', 'none'],
          bn: ['বন্ধ', 'আসেনি', 'তিন মাস'],
          mr: ['बंद', 'नाही आली', 'तीन महिने'],
          ta: ['நின்றுவிட்டது', 'வரவில்லை', 'மூன்று மாதம்'],
          te: ['ఆగిపోయింది', 'రాలేదు', 'మూడు నెలలు'],
        },
        apply: (ans) => {
          ans.cycleRegularity = 'absent_3_months_plus';
          ans.daysBetweenPeriods = 95;
          if (ans.menstrualProfile) {
            ans.menstrualProfile.cycleRegularity = 'absent_3_months_plus';
            ans.menstrualProfile.anyCycleOver90Days = true;
          }
        },
      },
    ],
  },
  {
    id: 'q2_facial_hair',
    field: 'increasedFacialHair',
    category: 'symptoms',
    spokenText: {
      hi: 'दूसरा सवाल: क्या आपके चेहरे, ठोड़ी, सीने या पेट पर अनचाहे काले और मोटे बाल आते हैं?',
      en: 'Second question: Do you notice excess or thick unwanted hair on your face, chin, or body?',
      bn: 'দ্বিতীয় প্রশ্ন: আপনার মুখ, থুতনি বা শরীরে কি অস্বাভাবিক কালো বা মোটা লোম গজায়?',
      mr: 'दुसरा प्रश्न: तुमच्या चेहऱ्यावर, हनुवटीवर किंवा शरीरावर नको असलेले काळे जाड केस येतात का?',
      ta: 'இரண்டாவது கேள்வி: உங்கள் முகம், தாடை அல்லது உடலில் தேவையற்ற தடித்த முடிகள் வளர்கிறதா?',
      te: 'రెండవ ప్రశ్న: మీ ముఖం, గడ్డం లేదా శరీరంపై అవాంఛిత ముతక వెంట్రుకలు వస్తున్నాయా?',
    },
    titleText: {
      hi: '२. चेहरे या शरीर पर अनचाहे बाल',
      en: '2. Facial & Body Hair',
      bn: '২. মুখে বা শরীরে অবাঞ্ছিত লোম',
      mr: '२. चेहऱ्यावरील जाड केस',
      ta: '2. முகத்தில் தேவையற்ற முடி',
      te: '2. ముఖంపై అవాంఛిత వెంట్రుకలు',
    },
    options: [
      {
        id: 'none',
        label: {
          hi: 'नहीं, बिल्कुल नहीं',
          en: 'No, none at all',
          bn: 'না, একদমই নেই',
          mr: 'नाही, मुळीच नाही',
          ta: 'இல்லை, சுத்தமாக இல்லை',
          te: 'లేదు, అస్సలు లేదు',
        },
        subtitle: {
          hi: 'सामान्य चिकनी त्वचा',
          en: 'Normal smooth skin',
          bn: 'স্বাভাবিক ত্বক',
          mr: 'साधी त्वचा',
          ta: 'இயல்பான தோல்',
          te: 'సాధారణ చర్మం',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'बिल्कुल नहीं', 'साफ', 'कोई नहीं'],
          en: ['no', 'none', 'not at all', 'clean', 'clear'],
          bn: ['না', 'নেই', 'একদম না'],
          mr: ['नाही', 'मुळीच नाही'],
          ta: ['இல்லை', 'இல்லவே இல்லை'],
          te: ['లేదు', 'అస్సలు లేదు'],
        },
        apply: (ans) => {
          ans.increasedFacialHair = 'none';
          if (ans.symptomProfile) ans.symptomProfile.excessFacialBodyHair = 'none';
        },
      },
      {
        id: 'mild',
        label: {
          hi: 'थोड़े-बहुत / हल्के बाल',
          en: 'Mild / A few hairs',
          bn: 'সামান্য বা অল্প লোম',
          mr: 'किरकोळ किंवा थोडे केस',
          ta: 'லேசான முடிகள்',
          te: 'స్వల్పంగా వెంట్రుకలు',
        },
        subtitle: {
          hi: 'होंठ के ऊपर हल्के',
          en: 'Occasional light hair',
          bn: 'কখনও কখনও অল্প',
          mr: 'कधीतरी थोडेफार',
          ta: 'எப்போதாவது லேசாக',
          te: 'అప్పుడప్పుడు కొద్దిగా',
        },
        color: 'amber',
        icon: Shield,
        keywords: {
          hi: ['थोड़ा', 'कम', 'हल्का', 'कभी-कभार', 'कुछ बाल'],
          en: ['mild', 'few', 'little', 'light', 'a bit'],
          bn: ['অল্প', 'সামান্য'],
          mr: ['थोडे', 'किरकोळ'],
          ta: ['லேசாக', 'கொஞ்சம்'],
          te: ['కొద్దిగా', 'స్వల్పంగా'],
        },
        apply: (ans) => {
          ans.increasedFacialHair = 'mild';
          if (ans.symptomProfile) ans.symptomProfile.excessFacialBodyHair = 'mild';
        },
      },
      {
        id: 'moderate_to_severe',
        label: {
          hi: 'हाँ, काफी ज्यादा बाल आते हैं',
          en: 'Yes, noticeable coarse hair',
          bn: 'হ্যাঁ, বেশ ঘন লোম আছে',
          mr: 'होय, बरेच जाड केस येतात',
          ta: 'ஆம், அதிக தடித்த முடி உள்ளது',
          te: 'అవును, చాలా ఎక్కువ వెంట్రుకలు ఉన్నాయి',
        },
        subtitle: {
          hi: 'ठोड़ी या चेहरे पर मोटे बाल',
          en: 'Visible on chin, lip, chest',
          bn: 'থুতনিতে বা মুখে স্পষ্ট',
          mr: 'हनुवटीवर किंवा चेहऱ्यावर',
          ta: 'தாடையில் தெளிவாகத் தெரியும்',
          te: 'గడ్డంపై స్పష్టంగా కనిపిస్తాయి',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['हाँ', 'हां', 'बहुत', 'काफी', 'दाढ़ी', 'मोटे बाल', 'ज्यादा'],
          en: ['yes', 'moderate', 'severe', 'a lot', 'thick', 'chin'],
          bn: ['হ্যাঁ', 'অনেক', 'ঘন'],
          mr: ['होय', 'खूप', 'बरेच'],
          ta: ['ஆம்', 'அதிகம்', 'நிறைய'],
          te: ['అవును', 'చాలా', 'ఎక్కువ'],
        },
        apply: (ans) => {
          ans.increasedFacialHair = 'moderate_to_severe';
          if (ans.symptomProfile) ans.symptomProfile.excessFacialBodyHair = 'moderate_to_severe';
        },
      },
    ],
  },
  {
    id: 'q3_acne',
    field: 'persistentAcne',
    category: 'symptoms',
    spokenText: {
      hi: 'तीसरा सवाल: क्या आपके चेहरे, जबड़े या गालों पर बार-बार दर्द भरे बड़े मुंहासे या पिंपल्स निकलते हैं?',
      en: 'Third question: Do you frequently get persistent, painful acne or pimples along your jawline or cheeks?',
      bn: 'তৃতীয় প্রশ্ন: আপনার মুখে বা চোয়ালে কি ঘন ঘন ব্যথাদায়ক বড় ব্রণ বের হয়?',
      mr: 'तिसरा प्रश्न: तुमच्या चेहऱ्यावर किंवा जबड्यावर वारंवार दुखणारे मोठे मुरुम येतात का?',
      ta: 'மூன்றாவது கேள்வி: உங்கள் முகத்திலோ தாடையிலோ அடிக்கடி வலி நிறைந்த பருக்கள் வருகிறதா?',
      te: 'మూడవ ప్రశ్న: మీ ముఖం లేదా దవడపై తరచుగా నొప్పితో కూడిన మొటిమలు వస్తున్నాయా?',
    },
    titleText: {
      hi: '३. चेहरे या जबड़े पर मुंहासे (पिंपल्स)',
      en: '3. Persistent Acne / Pimples',
      bn: '৩. মুখে ব্রণ বা ফুসকুড়ি',
      mr: '३. चेहऱ्यावरील मुरुमे (पिंपल्स)',
      ta: '3. முகத்தில் பருக்கள்',
      te: '3. ముఖంపై మొటిమలు',
    },
    options: [
      {
        id: 'none',
        label: {
          hi: 'नहीं, त्वचा साफ है',
          en: 'No, skin is clear',
          bn: 'না, ত্বক পরিষ্কার',
          mr: 'नाही, त्वचा स्वच्छ आहे',
          ta: 'இல்லை, தோல் சுத்தமாக உள்ளது',
          te: 'లేదు, చర్మం బాగుంది',
        },
        subtitle: {
          hi: 'कोई खास मुंहासे नहीं',
          en: 'No significant acne',
          bn: 'কোনো ব্রণ নেই',
          mr: 'मुरुम नाहीत',
          ta: 'பருக்கள் இல்லை',
          te: 'మొటిమలు లేవు',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'साफ', 'कुछ नहीं', 'पिंपल नहीं'],
          en: ['no', 'none', 'clear', 'no acne'],
          bn: ['না', 'নেই', 'পরিষ্কার'],
          mr: ['नाही', 'स्वच्छ'],
          ta: ['இல்லை', 'சுத்தம்'],
          te: ['లేదు', 'మొటిమలు లేవు'],
        },
        apply: (ans) => {
          ans.persistentAcne = 'none';
          if (ans.symptomProfile) ans.symptomProfile.persistentSevereAcne = 'none';
        },
      },
      {
        id: 'moderate_to_severe',
        label: {
          hi: 'हाँ, काफी दर्दनाक मुंहासे हैं',
          en: 'Yes, painful frequent acne',
          bn: 'হ্যাঁ, প্রচুর ব্যথাদায়ক ব্রণ হয়',
          mr: 'होय, खूप दुखणारे मुरुम आहेत',
          ta: 'ஆம், வலி மிகுந்த பருக்கள் உள்ளன',
          te: 'అవును, నొప్పితో కూడిన మొటిమలు ఉన్నాయి',
        },
        subtitle: {
          hi: 'जबड़े या गालों पर बने रहते हैं',
          en: 'Cystic and stubborn bumps',
          bn: 'চোয়ালে ঘন ঘন হয়',
          mr: 'सतत चेहऱ्यावर राहतात',
          ta: 'தாடையில் தொடர்ந்து உள்ளது',
          te: 'దవడపై నిరంతరం ఉంటాయి',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['हाँ', 'हां', 'पिंपल', 'मुंहासे', 'दाने', 'बहुत', 'दर्दनाक', 'जबड़े पर'],
          en: ['yes', 'acne', 'pimples', 'severe', 'painful', 'cystic'],
          bn: ['হ্যাঁ', 'ব্রণ', 'অনেক'],
          mr: ['होय', 'मुरुम', 'पिंपल्स', 'खूप'],
          ta: ['ஆம்', 'பருக்கள்', 'வலி'],
          te: ['అవును', 'మొటిమలు', 'నొప్పి'],
        },
        apply: (ans) => {
          ans.persistentAcne = 'persistent_adult_cystic';
          if (ans.symptomProfile) ans.symptomProfile.persistentSevereAcne = 'moderate_to_severe';
        },
      },
    ],
  },
  {
    id: 'q4_hair_thinning',
    field: 'scalpHairThinning',
    category: 'symptoms',
    spokenText: {
      hi: 'चौथा सवाल: क्या आपके सिर के बीच के बाल तेजी से झड़ रहे हैं या मांग चौड़ी हो रही है?',
      en: 'Fourth question: Is your scalp hair noticeably thinning or shedding rapidly from the crown?',
      bn: 'চতুর্থ প্রশ্ন: আপনার কি মাথার মাঝখানের চুল অতিরিক্ত পাতলা হয়ে যাচ্ছে বা সিঁথি চওড়া হচ্ছে?',
      mr: 'चौथा प्रश्न: तुमच्या डोक्यावरील केस वेगाने पातळ होत आहेत किंवा भांग रुंद होत आहे का?',
      ta: 'நான்காவது கேள்வி: உங்கள் தலையின் உச்சிப்பகுதியில் முடி அதிகமாக உதிர்கிறதா?',
      te: 'నాల్గవ ప్రశ్న: మీ తల వెంట్రుకలు పల్చబడుతున్నాయా లేదా పాపిట వెడల్పు అవుతోందా?',
    },
    titleText: {
      hi: '४. सिर के बालों का झड़ना या पतला होना',
      en: '4. Scalp Hair Thinning',
      bn: '৪. মাথার চুল পাতলা হওয়া',
      mr: '४. डोक्यावरील केस गळणे',
      ta: '4. முடி உதிர்தல்',
      te: '4. వెంట్రుకలు రాలడం',
    },
    options: [
      {
        id: 'none',
        label: {
          hi: 'नहीं, बाल सामान्य हैं',
          en: 'No, normal hair',
          bn: 'না, চুল স্বাভাবিক আছে',
          mr: 'नाही, केस सामान्य आहेत',
          ta: 'இல்லை, முடி இயல்பாக உள்ளது',
          te: 'లేదు, వెంట్రుకలు బాగున్నాయి',
        },
        subtitle: {
          hi: 'बाल गिरना सामान्य सीमा में है',
          en: 'Normal healthy scalp',
          bn: 'চুল পড়া স্বাভাবিক',
          mr: 'केस गळत नाहीत',
          ta: 'இயல்பான முடி',
          te: 'సాధారణంగా ఉంది',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'सामान्य', 'ठीक', 'बाल ठीक हैं'],
          en: ['no', 'none', 'normal', 'fine'],
          bn: ['না', 'ঠিক আছে', 'স্বাভাবিক'],
          mr: ['नाही', 'सामान्य'],
          ta: ['இல்லை', 'இயல்பு'],
          te: ['లేదు', 'బాగుంది'],
        },
        apply: (ans) => {
          if (ans.symptomProfile) ans.symptomProfile.scalpHairThinning = 'none';
        },
      },
      {
        id: 'moderate_to_severe',
        label: {
          hi: 'हाँ, काफी बाल झड़ रहे हैं',
          en: 'Yes, significant shedding',
          bn: 'হ্যাঁ, খুব বেশি চুল পড়ছে',
          mr: 'होय, खूप केस गळत आहेत',
          ta: 'ஆம், அதிக முடி உதிர்கிறது',
          te: 'అవును, చాలా వెంట్రుకలు రాలుతున్నాయి',
        },
        subtitle: {
          hi: 'मांग चौड़ी या बाल बहुत पतले',
          en: 'Crown thinning or shedding',
          bn: 'মাঝখান থেকে পাতলা',
          mr: 'केस खूप गळत आहेत',
          ta: 'உச்சியில் முடி குறைகிறது',
          te: 'తల మధ్యలో పల్చబడింది',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['हाँ', 'हां', 'झड़ रहे हैं', 'गिर रहे हैं', 'पतले', 'मांग', 'बहुत बाल गिरते हैं'],
          en: ['yes', 'thinning', 'hair fall', 'shedding', 'severe'],
          bn: ['হ্যাঁ', 'চুল পড়ছে', 'পাতলা'],
          mr: ['होय', 'केस गळतात', 'पातळ'],
          ta: ['ஆம்', 'முடி உதிர்கிறது', 'மெலிந்துவிட்டது'],
          te: ['అవును', 'రాలుతున్నాయి', 'పల్చబడింది'],
        },
        apply: (ans) => {
          if (ans.symptomProfile) ans.symptomProfile.scalpHairThinning = 'moderate_to_severe';
        },
      },
    ],
  },
  {
    id: 'q5_weight_gain',
    field: 'unexplainedWeightGain',
    category: 'symptoms',
    spokenText: {
      hi: 'पांचवां सवाल: क्या आपका वजन हाल में अचानक बढ़ गया है और लाख कोशिश के बाद भी घट नहीं रहा?',
      en: 'Fifth question: Have you had unexplained sudden weight gain that feels very difficult to lose?',
      bn: 'পঞ্চম প্রশ্ন: আপনার কি হঠাৎ ওজন বেড়ে গেছে এবং চেষ্টা করেও ওজন কমছে না?',
      mr: 'पाचवा प्रश्न: तुमचे वजन अचानक वाढले आहे का आणि प्रयत्न करूनही कमी होत नाही का?',
      ta: 'ஐந்தாவது கேள்வி: உங்கள் உடல் எடை திடீரென அதிகரித்துள்ளதா மற்றும் குறைக்க முடியவில்லையா?',
      te: 'ఐదవ ప్రశ్న: మీ బరువు ఆకస్మికంగా పెరిగిందా మరియు తగ్గించడం కష్టంగా ఉందా?',
    },
    titleText: {
      hi: '५. अचानक वजन बढ़ना',
      en: '5. Unexplained Weight Gain',
      bn: '৫. হঠাৎ ওজন বৃদ্ধি',
      mr: '५. अचानक वजन वाढणे',
      ta: '5. திடீர் எடை அதிகரிப்பு',
      te: '5. ఆకస్మికంగా బరువు పెరగడం',
    },
    options: [
      {
        id: 'none',
        label: {
          hi: 'नहीं, वजन स्थिर है',
          en: 'No, weight is stable',
          bn: 'না, ওজন স্বাভাবিক আছে',
          mr: 'नाही, वजन स्थिर आहे',
          ta: 'இல்லை, எடை நிலையானது',
          te: 'లేదు, బరువు స్థిరంగా ఉంది',
        },
        subtitle: {
          hi: 'अचानक कोई बदलाव नहीं',
          en: 'Normal weight trends',
          bn: 'ওজনে পরিবর্তন নেই',
          mr: 'वजनात बदल नाही',
          ta: 'எடையில் மாற்றம் இல்லை',
          te: 'బరువులో మార్పు లేదు',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'स्थिर', 'नार्मल', 'वजन ठीक है'],
          en: ['no', 'stable', 'normal', 'not gained'],
          bn: ['না', 'স্বাভাবিক', 'বাড়েনি'],
          mr: ['नाही', 'स्थिर'],
          ta: ['இல்லை', 'மாற்றமில்லை'],
          te: ['లేదు', 'స్థిరంగా ఉంది'],
        },
        apply: (ans) => {
          ans.unexplainedWeightGain = 'none';
          if (ans.symptomProfile) ans.symptomProfile.unexplainedWeightChange = 'none';
        },
      },
      {
        id: 'significant',
        label: {
          hi: 'हाँ, वजन बहुत बढ़ गया है',
          en: 'Yes, sudden weight gain',
          bn: 'হ্যাঁ, খুব ওজন বেড়েছে',
          mr: 'होय, वजन खूप वाढले आहे',
          ta: 'ஆம், எடை அதிகமாகிவிட்டது',
          te: 'అవును, బరువు చాలా పెరిగింది',
        },
        subtitle: {
          hi: 'पेट पर चर्बी और कम नहीं होता',
          en: 'Hard to lose despite diet',
          bn: 'কমাতে খুব কষ্ট হয়',
          mr: 'कमी करण्यास त्रास होतो',
          ta: 'குறைக்க முடியவில்லை',
          te: 'తగ్గించడం కష్టంగా ఉంది',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['हाँ', 'हां', 'वजन', 'मोटापा', 'बढ़ गया', 'कम नहीं होता', 'भारी'],
          en: ['yes', 'weight gain', 'gain', 'difficult', 'belly fat'],
          bn: ['হ্যাঁ', 'ওজন বেড়েছে', 'কমে না'],
          mr: ['होय', 'वजन वाढले', 'कमी होत नाही'],
          ta: ['ஆம்', 'எடை கூடிவிட்டது', 'குறையவில்லை'],
          te: ['అవును', 'పెరిగింది', 'తగ్గడం లేదు'],
        },
        apply: (ans) => {
          ans.unexplainedWeightGain = 'significant_difficulty_losing';
          if (ans.symptomProfile) ans.symptomProfile.unexplainedWeightChange = 'significant';
        },
      },
    ],
  },
  {
    id: 'q6_dark_neck',
    field: 'acanthosisSkinChanges',
    category: 'symptoms',
    spokenText: {
      hi: 'छठा सवाल: क्या आपकी गर्दन के पीछे या बगल में त्वचा पर गहरे काले मखमली धब्बे हैं?',
      en: 'Sixth question: Do you notice darkened, velvety skin patches on the back of your neck or armpits?',
      bn: 'ষষ্ঠ প্রশ্ন: আপনার কি ঘাড়ে বা বগলে কালো খসখসে বা ভেলভেটের মতো দাগ আছে?',
      mr: 'सहावा प्रश्न: तुमच्या मानेवर किंवा काखेत काळे मखमली डाग पडले आहेत का?',
      ta: 'ஆறாவது கேள்வி: உங்கள் கழுத்தின் பின்னால் அல்லது அக்குளில் கருமையான தடித்த திட்டுகள் உள்ளதா?',
      te: 'ఆరవ ప్రశ్న: మీ మెడ వెనుక లేదా చంకలలో నల్లటి మందపాటి మచ్చలు ఉన్నాయా?',
    },
    titleText: {
      hi: '६. गर्दन या बगल में काले मखमली धब्बे',
      en: '6. Darkened Neck Patches',
      bn: '৬. ঘাড়ে বা বগলে কালো দাগ',
      mr: '६. मानेवर काळे डाग',
      ta: '6. கழுத்தில் கருமையான திட்டுகள்',
      te: '6. మెడపై నల్లటి మచ్చలు',
    },
    options: [
      {
        id: 'no',
        label: {
          hi: 'नहीं, ऐसा कुछ नहीं है',
          en: 'No, skin looks normal',
          bn: 'না, এমন দাগ নেই',
          mr: 'नाही, अशी समस्या नाही',
          ta: 'இல்லை, அப்படி எதுவும் இல்லை',
          te: 'లేదు, అలాంటివి ఏమీ లేవు',
        },
        subtitle: {
          hi: 'गर्दन पर कोई कालापन नहीं',
          en: 'Even skin tone',
          bn: 'স্বাভাবিক ত্বক',
          mr: 'काळे डाग नाहीत',
          ta: 'இயல்பான நிறம்',
          te: 'సాధారణ రంగు',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'साफ है', 'कोई दाग नहीं', 'नार्मल'],
          en: ['no', 'none', 'normal', 'clear'],
          bn: ['না', 'নেই', 'দাগ নেই'],
          mr: ['नाही', 'डाग नाहीत'],
          ta: ['இல்லை', 'திட்டுகள் இல்லை'],
          te: ['లేదు', 'మచ్చలు లేవు'],
        },
        apply: (ans) => {
          if (ans.symptomProfile) ans.symptomProfile.acanthosisSkinChanges = false;
        },
      },
      {
        id: 'yes',
        label: {
          hi: 'हाँ, काले मखमली धब्बे हैं',
          en: 'Yes, dark velvety patches',
          bn: 'হ্যাঁ, কালো দাগ আছে',
          mr: 'होय, काळे डाग आहेत',
          ta: 'ஆம், கருமையான திட்டுகள் உள்ளன',
          te: 'అవును, నల్లటి మచ్చలు ఉన్నాయి',
        },
        subtitle: {
          hi: 'गर्दन या कांख की त्वचा काली है',
          en: 'Acanthosis nigricans pattern',
          bn: 'ঘাড়ে বা বগলে স্পষ্ট দাগ',
          mr: 'मानेवर काळपटपणा',
          ta: 'கழுத்து அல்லது அக்குளில்',
          te: 'మెడ లేదా చంకలలో',
        },
        color: 'rose',
        icon: AlertTriangle,
        keywords: {
          hi: ['हाँ', 'हां', 'काला', 'गर्दन पर', 'धब्बे', 'कालापन', 'कांख'],
          en: ['yes', 'dark neck', 'patches', 'black neck', 'velvety'],
          bn: ['হ্যাঁ', 'কালো দাগ', 'ঘাড়ে'],
          mr: ['होय', 'काळे डाग', 'मानेवर'],
          ta: ['ஆம்', 'கருமை', 'திட்டுகள்'],
          te: ['అవును', 'నల్లటి మచ్చలు', 'మెడపై'],
        },
        apply: (ans) => {
          if (ans.symptomProfile) ans.symptomProfile.acanthosisSkinChanges = true;
        },
      },
    ],
  },
  {
    id: 'q7_family_history',
    field: 'familyHistory',
    category: 'history',
    spokenText: {
      hi: 'अंतिम सवाल: क्या आपके परिवार में मां या बहन को पीसीओएस, या किसी को शुगर यानी डायबिटीज की बीमारी है?',
      en: 'Final question: Does your mother or sister have PCOS, or does anyone in your family have diabetes?',
      bn: 'শেষ প্রশ্ন: আপনার পরিবারে মা বা বোনের পিসিওএস, অথবা কারো ডায়াবেটিস বা সুগার আছে কি?',
      mr: 'शेवटचा प्रश्न: तुमच्या कुटुंबात आई किंवा बहिणीला पीसीओएस किंवा कोणाला मधुमेह (डायबिटीज) आहे का?',
      ta: 'கடைசி கேள்வி: உங்கள் குடும்பத்தில் தாய் அல்லது சகோதரிக்கு பிசிஓஎஸ் அல்லது யாருக்காவது சர்க்கரை நோய் உள்ளதா?',
      te: 'చివరి ప్రశ్న: మీ కుటుంబంలో తల్లి లేదా సోదరికి పిసిఒఎస్ లేదా ఎవరికైనా మధుమేహం (షుగర్) ఉందా?',
    },
    titleText: {
      hi: '७. परिवार में पीसीओएस या शुगर (डायबिटीज)',
      en: '7. Family History of PCOS or Diabetes',
      bn: '৭. পরিবারে পিসিওএস বা ডায়াবেটিস',
      mr: '७. कुटुंबात पीसीओएस किंवा मधुमेह',
      ta: '7. குடும்ப வரலாறு (பிசிஓஎஸ் / சர்க்கரை)',
      te: '7. కుటుంబంలో పిసిఒఎస్ లేదా మధుమేహం',
    },
    options: [
      {
        id: 'no',
        label: {
          hi: 'नहीं, परिवार में किसी को नहीं',
          en: 'No, no family history',
          bn: 'না, পরিবারে কারো নেই',
          mr: 'नाही, कुटुंबात कोणाला नाही',
          ta: 'இல்லை, குடும்பத்தில் யாருக்கும் இல்லை',
          te: 'లేదు, కుటుంబంలో ఎవరికీ లేదు',
        },
        subtitle: {
          hi: 'किसी को पीसीओएस या शुगर नहीं',
          en: 'No known genetic history',
          bn: 'কারো কোনো সমস্যা নেই',
          mr: 'कोणालाही त्रास नाही',
          ta: 'யாருக்கும் பாதிப்பில்லை',
          te: 'ఎవరికీ సమస్య లేదు',
        },
        color: 'emerald',
        icon: Sparkles,
        keywords: {
          hi: ['नहीं', 'ना', 'किसी को नहीं', 'कोई बीमारी नहीं', 'नार्मल'],
          en: ['no', 'none', 'no family history'],
          bn: ['না', 'কারো নেই'],
          mr: ['नाही', 'कोणाला नाही'],
          ta: ['இல்லை', 'யாருக்கும் இல்லை'],
          te: ['లేదు', 'ఎవరికీ లేదు'],
        },
        apply: (ans) => {
          ans.familyDiabetesHistory = false;
          if (ans.basicProfile) {
            ans.basicProfile.familyHistoryPcos = false;
            ans.basicProfile.familyHistoryDiabetes = false;
          }
        },
      },
      {
        id: 'yes',
        label: {
          hi: 'हाँ, मां/बहन को पीसीओएस या शुगर है',
          en: 'Yes, family history exists',
          bn: 'হ্যাঁ, পরিবারে পিসিওএস বা সুগার আছে',
          mr: 'होय, आई/बहिणीला किंवा कुटुंबात आहे',
          ta: 'ஆம், குடும்பத்தில் உள்ளது',
          te: 'అవును, కుటుంబంలో ఉంది',
        },
        subtitle: {
          hi: 'परिवार में पहले से समस्या है',
          en: 'Mother/sister PCOS or diabetes',
          bn: 'মা বা বোনের সমস্যা আছে',
          mr: 'आईला किंवा बहिणीला आहे',
          ta: 'தாய் அல்லது சகோதரிக்கு உள்ளது',
          te: 'తల్లి లేదా సోదరికి ఉంది',
        },
        color: 'rose',
        icon: Heart,
        keywords: {
          hi: ['हाँ', 'हां', 'मां को है', 'बहन को है', 'शुगर है', 'डायबिटीज है', 'परिवार में है'],
          en: ['yes', 'mother', 'sister', 'family', 'diabetes', 'pcos'],
          bn: ['হ্যাঁ', 'মায়ের আছে', 'বোনের আছে', 'ডায়াবেটিস'],
          mr: ['होय', 'आईला आहे', 'बहिणीला आहे', 'डायबिटीज'],
          ta: ['ஆம்', 'அம்மாவுக்கு', 'சகோதரிக்கு', 'சர்க்கரை'],
          te: ['అవును', 'అమ్మకు', 'చెల్లికి', 'షుగర్'],
        },
        apply: (ans) => {
          ans.familyDiabetesHistory = true;
          if (ans.basicProfile) {
            ans.basicProfile.familyHistoryPcos = true;
            ans.basicProfile.familyHistoryDiabetes = true;
          }
        },
      },
    ],
  },
];

export const VoiceScreeningModal: React.FC<VoiceScreeningModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onComplete,
  onOpenConsultDoctor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersState, setAnswersState] = useState<ScreeningAnswers>(() => {
    return { ...defaultMockScreeningAnswers };
  });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Audio / Speech Recognition State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const [isFinalResultReady, setIsFinalResultReady] = useState(false);
  const [finalResult, setFinalResult] = useState<ScreeningResult | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const advanceTimerRef = useRef<any>(null);

  const currentQ = VOICE_QUESTIONS[currentIndex];

  // Map app LanguageCode to SpeechRecognition language string
  const getRecognitionLang = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'bn': return 'bn-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  // Stop listening cleanly
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Safe ignore
      }
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
  };

  // Start listening with Web Speech API
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceFeedback('माइक्रोफ़ोन समर्थित नहीं है, कृपया नीचे दिए कार्ड पर क्लिक करें।');
      return;
    }

    stopListening();
    try {
      playChime('start');
      const recognition = new SpeechRecognition();
      recognition.lang = getRecognitionLang(currentLanguage);
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setVoiceFeedback('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }

        const trimmed = currentTranscript.trim();
        setTranscript(trimmed);

        // Check if this spoken text matches any option
        handleVoiceTranscriptMatch(trimmed);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Voice recognition notice:', event.error);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          // Restart if still in listening mode
          try {
            recognition.start();
          } catch (e) {
            isListeningRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Mic start notice:', e);
      setIsListening(false);
    }
  };

  // Check if speech matches any option for the current question
  const handleVoiceTranscriptMatch = (spokenText: string) => {
    if (!currentQ) return;
    const lower = spokenText.toLowerCase();

    for (const opt of currentQ.options) {
      const keywords = opt.keywords[currentLanguage] || opt.keywords['en'] || [];
      const match = keywords.some((kw) => lower.includes(kw.toLowerCase()));

      if (match) {
        // Matched! Select option
        stopListening();
        selectOption(opt.id, true);
        break;
      }
    }
  };

  // Select an option either by voice or by touching the large card
  const selectOption = (optionId: string, fromVoice = false) => {
    if (!currentQ) return;
    const chosen = currentQ.options.find((o) => o.id === optionId);
    if (!chosen) return;

    setSelectedOptionId(optionId);
    playChime('reply');

    // Update state answers
    const newAnswers = { ...answersState };
    chosen.apply(newAnswers);
    setAnswersState(newAnswers);

    const feedbackMsg = chosen.label[currentLanguage] || chosen.label['en'];
    setVoiceFeedback(feedbackMsg);

    // Speak confirmation
    const confirmationWord: Record<LanguageCode, string> = {
      hi: `दर्ज किया: ${feedbackMsg}। बहुत अच्छा दीदी!`,
      en: `Recorded: ${feedbackMsg}. Great!`,
      bn: `নথিভুক্ত করা হয়েছে: ${feedbackMsg}`,
      mr: `नोंदवले: ${feedbackMsg}. खूप छान!`,
      ta: `பதிவு செய்யப்பட்டது: ${feedbackMsg}`,
      te: `నమోదు చేయబడింది: ${feedbackMsg}`,
    };

    setIsSpeaking(true);
    speakText(confirmationWord[currentLanguage], currentLanguage, () => {
      setIsSpeaking(false);
      // Auto-advance to next question
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        goToNextQuestion();
      }, 700);
    });
  };

  // Go to next question or complete screening
  const goToNextQuestion = () => {
    if (currentIndex < VOICE_QUESTIONS.length - 1) {
      setSelectedOptionId(null);
      setTranscript('');
      setVoiceFeedback('');
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all questions!
      finishScreening();
    }
  };

  // Go back to previous question
  const goToPrevQuestion = () => {
    if (currentIndex > 0) {
      stopSpeaking();
      stopListening();
      setSelectedOptionId(null);
      setTranscript('');
      setVoiceFeedback('');
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Speak current question whenever index or language changes
  const speakCurrentQuestion = () => {
    if (!currentQ) return;
    stopSpeaking();
    stopListening();

    const textToSpeak = currentQ.spokenText[currentLanguage] || currentQ.spokenText['en'];
    setIsSpeaking(true);
    speakText(textToSpeak, currentLanguage, () => {
      setIsSpeaking(false);
      // Start listening after question finishes speaking
      startListening();
    });
  };

  // Read question aloud whenever index changes or modal opens
  useEffect(() => {
    if (isOpen && !isFinalResultReady) {
      const timer = setTimeout(() => {
        speakCurrentQuestion();
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
        stopListening();
      };
    }
  }, [currentIndex, isOpen, currentLanguage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Compute final Rotterdam result
  const finishScreening = () => {
    stopSpeaking();
    stopListening();

    // Ensure basic profiles are consistent
    const completeAnswers: ScreeningAnswers = {
      ...answersState,
      basicProfile: {
        age: answersState.basicProfile?.age || 23,
        heightCm: answersState.basicProfile?.heightCm || 158,
        weightKg: answersState.basicProfile?.weightKg || 59,
        bmi: 23.6,
        familyHistoryPcos: answersState.basicProfile?.familyHistoryPcos || false,
        familyHistoryDiabetes: answersState.basicProfile?.familyHistoryDiabetes || false,
        knownDiabetes: false,
        knownThyroid: false,
        currentHormonalMeds: false,
      },
      menstrualProfile: {
        averageCycleLengthDays: answersState.daysBetweenPeriods || 35,
        shortestCycleDays: 28,
        longestCycleDays: 48,
        periodsInLast12Months: answersState.cycleRegularity === 'regular_21_35' ? 12 : 8,
        cycleRegularity: answersState.cycleRegularity || 'infrequent_over_35',
        frequentlyOver35Days: answersState.cycleRegularity === 'infrequent_over_35',
        frequentlyUnder21Days: false,
        anyCycleOver90Days: answersState.cycleRegularity === 'absent_3_months_plus',
        averageBleedingDays: 5,
        heavyBleeding: false,
        recentChangeInPattern: true,
      },
    };

    const res = calculateScreeningResult('voice-user', completeAnswers);
    setFinalResult(res);
    setIsFinalResultReady(true);

    // Speak final result summary empathetically
    let resultSpeech = '';
    if (res.level === 'GREEN') {
      const speechMap: Record<LanguageCode, string> = {
        hi: 'बधाई हो दीदी! आपकी जांच पूरी हो गई है। आपके लक्षण बिल्कुल सामान्य पाए गए हैं। कोई चिंता की बात नहीं है। स्वस्थ खान-पान और योग जारी रखें।',
        en: 'Congratulations! Your voice screening is complete. Your symptoms are within the normal baseline. Keep following a healthy diet and lifestyle.',
        bn: 'অভিনন্দন! আপনার ভয়েস স্ক্রীনিং সম্পন্ন হয়েছে। আপনার লক্ষণগুলি স্বাভাবিক রয়েছে। স্বাস্থ্যকর খাবার খান।',
        mr: 'अभिनंदन ताई! तुमची तपासणी पूर्ण झाली आहे. तुमची सर्व लक्षणे सामान्य आहेत. काळजीचे कोणतेही कारण नाही.',
        ta: 'வாழ்த்துகள்! உங்கள் பரிசோதனை முடிந்தது. உங்கள் அறிகுறிகள் இயல்பான வரம்பில் உள்ளன.',
        te: 'అభినందనలు! మీ వాయిస్ స్క్రీనింగ్ పూర్తయింది. మీ లక్షణాలు సాధారణంగా ఉన్నాయి.',
      };
      resultSpeech = speechMap[currentLanguage] || speechMap['en'];
    } else if (res.level === 'ORANGE') {
      const speechMap: Record<LanguageCode, string> = {
        hi: 'दीदी, आपकी जांच पूरी हो गई है। आपके बताए अनुसार माहवारी में थोड़ी देरी और कुछ हार्मोनल बदलाव दिखे हैं। घबराएं नहीं, यह कोई बीमारी का पक्का सबूत नहीं है। आप डॉक्टर या आशा दीदी से सलाह ले सकती हैं।',
        en: 'Your voice screening is complete. Moderate hormonal and cycle variations were observed. Please do not worry. We recommend consulting a gynecologist or ASHA worker for guidance.',
        bn: 'আপনার স্ক্রীনিং সম্পন্ন হয়েছে। মাসিকের সামান্য অনিয়ম লক্ষ্য করা গেছে। চিন্তার কোনো কারণ নেই, ডাক্তারের পরামর্শ নিতে পারেন।',
        mr: 'ताई, तुमची तपासणी पूर्ण झाली आहे. मासिक पाळीत थोडा अनियमितपणा दिसून आला आहे. घाबरू नका, डॉक्टरांचा किंवा आशा ताईंचा सल्ला घ्या.',
        ta: 'உங்கள் பரிசோதனை முடிந்தது. மாதவிடாயில் சிறிய மாறுதல்கள் உள்ளன. கவலைப்பட வேண்டாம், மருத்துவரை அணுகவும்.',
        te: 'మీ స్క్రీనింగ్ పూర్తయింది. పీరియడ్స్‌లో కొంత అసమతుల్యత కనిపించింది. ఆందోళన చెందకండి, వైద్యుడిని సంప్రదించండి.',
      };
      resultSpeech = speechMap[currentLanguage] || speechMap['en'];
    } else {
      const speechMap: Record<LanguageCode, string> = {
        hi: 'दीदी, आपकी जांच पूरी हो गई है। आपके लक्षणों में हार्मोनल असंतुलन के स्पष्ट संकेत मिले हैं। आप जल्द से जल्द किसी महिला डॉक्टर को दिखाकर अल्ट्रासाउंड और जांच कराएं। हम डॉक्टर से बात कराने में आपकी मदद करेंगे।',
        en: 'Your voice screening is complete. High clinical pattern indicators for PCOS were noted. Please consult a qualified gynecologist promptly for complete evaluation.',
        bn: 'আপনার স্ক্রীনিং শেষ হয়েছে। হরমোনের তারতম্যের উল্লেখযোগ্য লক্ষণ দেখা গেছে। শীঘ্রই একজন গাইناکোলজিস্টের পরামর্শ নিন।',
        mr: 'ताई, तपासणी पूर्ण झाली आहे. हार्मोनल असंतुलनाची स्पष्ट लक्षणे आढळली आहेत. लवकरात लवकर महिला डॉक्टरांचा सल्ला घ्या.',
        ta: 'பரிசோதனை முடிந்தது. ஹார்மோன் சமநிலையின்மைக்கான அறிகுறிகள் உள்ளன. விரைவில் பெண் மருத்துவரை அணுகவும்.',
        te: 'స్క్రీనింగ్ పూర్తయింది. హార్మోన్ల అసమతుల్యత సంకేతాలు ఎక్కువగా ఉన్నాయి. త్వరగా గైనకాలజిస్ట్‌ను సంప్రదించండి.',
      };
      resultSpeech = speechMap[currentLanguage] || speechMap['en'];
    }

    setIsSpeaking(true);
    speakText(resultSpeech, currentLanguage, () => {
      setIsSpeaking(false);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-rose-100 overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              🎙️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black tracking-tight">
                  {currentLanguage === 'hi' ? 'बोलकर आसान जाँच' : 'Voice-Guided Screening'}
                </h3>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  {currentLanguage === 'hi' ? 'केवल बोलें • लिखना नहीं' : 'Hands-Free • No Writing'}
                </span>
              </div>
              <p className="text-xs text-rose-100">
                {currentLanguage === 'hi'
                  ? 'कम पढ़ी-लिखी महिलाओं के लिए विशेष वॉयस सखी'
                  : 'Special voice assistant for easy health check'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Multilingual Quick Switcher */}
            <select
              value={currentLanguage}
              onChange={(e) => {
                const newLang = e.target.value as LanguageCode;
                stopSpeaking();
                stopListening();
                onLanguageChange(newLang);
              }}
              className="bg-white/20 text-white text-xs font-bold rounded-xl px-2.5 py-1.5 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isFinalResultReady ? (
          <div className="p-5 sm:p-8 space-y-6">
            
            {/* Step Progress Dots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {VOICE_QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-rose-600'
                        : idx < currentIndex
                        ? 'w-2.5 bg-emerald-500'
                        : 'w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                {currentLanguage === 'hi' ? 'सवाल' : 'Question'} {currentIndex + 1} / {VOICE_QUESTIONS.length}
              </span>
            </div>

            {/* Question Title & Speaking Audio Visualizer */}
            <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-100 text-center relative overflow-hidden">
              <span className="inline-block text-xs font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase mb-2">
                {currentQ.titleText[currentLanguage] || currentQ.titleText['en']}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentQ.spokenText[currentLanguage] || currentQ.spokenText['en']}
              </h2>

              {/* Spoken voice indicator */}
              <div className="mt-4 flex items-center justify-center space-x-3">
                <button
                  onClick={speakCurrentQuestion}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs shadow-sm border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-rose-600' : ''}`} />
                  <span>{currentLanguage === 'hi' ? '🔊 फिर से सुनें (Hear Again)' : '🔊 Hear Again'}</span>
                </button>

                <button
                  onClick={() => {
                    if (isListening) {
                      stopListening();
                    } else {
                      stopSpeaking();
                      startListening();
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-4 h-4 animate-spin text-white" />
                      <span>{currentLanguage === 'hi' ? 'बोलिए, सुन रहे हैं...' : 'Listening... Speak'}</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-slate-500" />
                      <span>{currentLanguage === 'hi' ? 'माइक चालू करें' : 'Start Mic'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time speech transcript feedback */}
              {transcript && (
                <div className="mt-3 bg-white/90 rounded-xl px-4 py-2 border border-rose-200 inline-block text-xs font-semibold text-rose-900 max-w-md mx-auto">
                  <span className="text-rose-500 font-bold">
                    {currentLanguage === 'hi' ? 'आपकी आवाज़: ' : 'You said: '}
                  </span>
                  "{transcript}"
                </div>
              )}

              {/* Recorded Feedback */}
              {voiceFeedback && (
                <div className="mt-2 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-1 px-3 inline-block">
                  ✓ {voiceFeedback}
                </div>
              )}
            </div>

            {/* Huge Pictorial Option Cards — Illiterate / One-Tap Friendly */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>
                  {currentLanguage === 'hi'
                    ? '👉 बोलें या नीचे दिए गए कार्ड को छुएं (Tap or Speak):'
                    : '👉 Speak or tap a card below:'}
                </span>
                <span className="text-[11px] text-rose-600 font-bold">
                  {currentLanguage === 'hi' ? 'बटन दबाने की जरूरत नहीं' : 'Touch friendly'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedOptionId === opt.id;
                  
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectOption(opt.id, false)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/90 shadow-md ring-4 ring-rose-100 transform scale-[1.01]'
                          : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            opt.color === 'emerald'
                              ? 'bg-emerald-100 text-emerald-700'
                              : opt.color === 'amber'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-black text-slate-900">
                            {opt.label[currentLanguage] || opt.label['en']}
                          </div>
                          {opt.subtitle && (
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {opt.subtitle[currentLanguage] || opt.subtitle['en']}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isSelected
                              ? 'bg-rose-600 border-rose-600 text-white'
                              : 'border-slate-300 bg-slate-50 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={goToPrevQuestion}
                disabled={currentIndex === 0}
                className="flex items-center space-x-1 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{currentLanguage === 'hi' ? 'पिछला सवाल' : 'Previous'}</span>
              </button>

              <button
                onClick={goToNextQuestion}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 shadow-md transition-colors"
              >
                <span>{currentLanguage === 'hi' ? 'अगला सवाल' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Final Result View */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-white ${
              finalResult?.level === 'GREEN'
                ? 'bg-emerald-500 text-white'
                : finalResult?.level === 'ORANGE'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-600 text-white'
            }">
              {finalResult?.level === 'GREEN' ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <AlertTriangle className="w-10 h-10" />
              )}
            </div>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                finalResult?.level === 'GREEN'
                  ? 'bg-emerald-100 text-emerald-800'
                  : finalResult?.level === 'ORANGE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {finalResult?.level === 'GREEN'
                  ? (currentLanguage === 'hi' ? 'कम स्क्रीनिंग चिंता (सामान्य)' : 'Low Screening Concern')
                  : finalResult?.level === 'ORANGE'
                  ? (currentLanguage === 'hi' ? 'मध्यम हार्मोनल विविधता (परामर्श आवश्यक)' : 'Moderate Variation')
                  : (currentLanguage === 'hi' ? 'उच्च संकेतक (डॉक्टर से मिलें)' : 'High Pattern Indicators')}
              </span>

              <h2 className="text-2xl font-black text-slate-900">
                {currentLanguage === 'hi' ? 'आपकी आवाज़ से जाँच पूरी हो गई है!' : 'Voice Screening Complete!'}
              </h2>

              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                {finalResult?.level === 'GREEN'
                  ? (currentLanguage === 'hi'
                    ? 'दीदी, आपके बताए अनुसार सभी लक्षण सामान्य हैं। आप स्वस्थ आहार व व्यायाम जारी रखें।'
                    : 'Your reported symptoms align with a normal healthy baseline. Keep taking good care of yourself!')
                  : finalResult?.level === 'ORANGE'
                  ? (currentLanguage === 'hi'
                    ? 'माहवारी में देरी या हार्मोनल बदलाव के कुछ संकेत दिखे हैं। घबराएं नहीं, डॉक्टर या आशा दीदी से संपर्क करें।'
                    : 'Some cycle irregularities and hormonal signs were noted. We recommend discussing this with an ASHA worker or doctor.')
                  : (currentLanguage === 'hi'
                    ? 'हार्मोनल असंतुलन व पीसीओएस के मजबूत संकेत मिले हैं। कृपया किसी स्त्री रोग विशेषज्ञ से मिलकर पूरी जांच करवाएं।'
                    : 'Strong pattern indicators for PCOS were observed. Please consult a qualified gynecologist soon.')}
              </p>
            </div>

            {/* Spoken Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={() => {
                  stopSpeaking();
                  onComplete(finalResult!);
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-md transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{currentLanguage === 'hi' ? 'पूरी रिपोर्ट देखें' : 'View Full Report Card'}</span>
              </button>

              {onOpenConsultDoctor && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    onClose();
                    onOpenConsultDoctor();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{currentLanguage === 'hi' ? 'डॉक्टर से बात करें' : 'Talk to a Doctor'}</span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsFinalResultReady(false);
                  setCurrentIndex(0);
                  setSelectedOptionId(null);
                  setTranscript('');
                  setVoiceFeedback('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center space-x-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{currentLanguage === 'hi' ? 'फिर से बोलकर जाँच करें' : 'Retake Voice Screening'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
