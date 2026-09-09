import React, { useState } from 'react';
import {
  Activity,
  Mic,
  Stethoscope,
  BookOpen,
  Heart,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShoppingBag,
  Globe2,
  HelpCircle,
  Clock,
  Award,
  Lock,
  ChevronRight,
  PhoneCall,
  Volume2,
  Calendar,
  TrendingUp,
  Dumbbell,
  Leaf,
  Cpu,
  RefreshCw,
  Share2,
  FileCheck,
  ChevronDown,
  Play,
  Check,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../services/translations';
import { ThreeDModel } from './ThreeDModel';

interface LandingPageProps {
  currentLanguage: LanguageCode;
  onStartScreening: () => void;
  onOpenVoiceSaathi: () => void;
  onFindDoctor: () => void;
  onExploreKnowledge: () => void;
  onOpen3DModal: () => void;
  onOpenStore: () => void;
  onOpenCommunity: () => void;
  onSwitchToRole: (roleKey: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'signup' | 'otp') => void;
  onOpenSmartKit?: () => void;
  onOpenProgressTracker?: () => void;
  onOpenExercisePortal?: () => void;
  onOpenHomeRemedies?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onStartScreening,
  onOpenVoiceSaathi,
  onFindDoctor,
  onExploreKnowledge,
  onOpen3DModal,
  onOpenStore,
  onOpenCommunity,
  onSwitchToRole,
  onOpenAuth,
  onOpenSmartKit,
  onOpenProgressTracker,
  onOpenExercisePortal,
  onOpenHomeRemedies,
}) => {
  const [activeSymptom, setActiveSymptom] = useState<string>('delayed_period');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Curated common symptoms for progressive disclosure
  const symptomsData = [
    {
      id: 'delayed_period',
      label: currentLanguage === 'hi' ? 'माहवारी में देरी (Delayed Cycle)' : 'Delayed / Irregular Periods',
      tag: currentLanguage === 'hi' ? '35+ दिन का अंतराल' : '35+ Days Interval',
      desc:
        currentLanguage === 'hi'
          ? 'यदि आपकी माहवारी 35 दिनों से अधिक के अंतराल पर आती है या साल में 8 बार से कम होती है, तो यह ओव्यूलेशन में हार्मोनल असंतुलन (LH/FSH या इंसुलिन) का संकेत हो सकता है।'
          : 'Cycles lasting over 35 days or occurring fewer than 8 times a year indicate oligomenorrhea, often driven by paused follicular maturation and hormonal variance.',
      actionTip:
        currentLanguage === 'hi'
          ? 'माहवारी ट्रैकर में तारीख नोट करें और 2-मिनट की निःशुल्क जांच शुरू करें।'
          : 'Log dates in our cycle tracker and complete the 2-min Rotterdam screener.',
      icon: Calendar,
      color: 'from-rose-500 to-pink-500',
    },
    {
      id: 'facial_hair',
      label: currentLanguage === 'hi' ? 'चेहरे पर अनचाहे बाल (Hirsutism)' : 'Facial Hair & Acne',
      tag: currentLanguage === 'hi' ? 'ठोड़ी व होंठों के ऊपर' : 'Chin, Jawline & Cheeks',
      desc:
        currentLanguage === 'hi'
          ? 'ठोड़ी, गालों या छाती पर मोटे काले बाल आना शरीर में एंड्रोजन (पुरुष हार्मोन) के हल्के उभार के कारण होता है। यह पीसीओएस का सामान्य लक्षण है जिसे लाइफस्टाइल और सही पोषण से नियंत्रित किया जा सकता है।'
          : 'Coarse terminal hair on chin, upper lip, or jawline results from mild androgen excess (hyperandrogenism), a core Rotterdam diagnostic marker.',
      actionTip:
        currentLanguage === 'hi'
          ? 'स्पीयरमिंट (पुदीना) चाय और जिंक युक्त आहार एंड्रोजन संतुलन में सहायक होते हैं।'
          : 'Balanced nutrition and healthy routines may support general wellbeing; PCOS-specific treatment should be individualized by a clinician.',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500',
    },
    {
      id: 'weight_resistance',
      label: currentLanguage === 'hi' ? 'वजन बढ़ना व पेट की चर्बी' : 'Weight Gain & Insulin Resistance',
      tag: currentLanguage === 'hi' ? 'जिद्दी फैट व थकान' : 'Metabolic Sluggishness',
      desc:
        currentLanguage === 'hi'
          ? 'पीसीओएस में कोशिकाएं इंसुलिन को ठीक से अवशोषित नहीं कर पातीं, जिससे शर्करा फैट के रूप में जमा होने लगती है और मीठा खाने की तलब बढ़ती है।'
          : 'Insulin resistance causes glucose to be stored as visceral fat, leading to energy crashes, sugar cravings, and darkened skin creases (acanthosis nigricans).',
      actionTip:
        currentLanguage === 'hi'
          ? 'मायो-इनोसिटोल और संतुलित फाइबर युक्त भोजन इंसुलिन संवेदनशीलता को सुधारते हैं।'
          : 'Nutrition education can support healthy routines, but supplements are not a universal PCOS treatment.',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'pelvic_pain',
      label: currentLanguage === 'hi' ? 'पेल्विक दर्द व ऐंठन' : 'Pelvic Cramps & Heaviness',
      tag: currentLanguage === 'hi' ? 'कमर व पेट के निचले हिस्से में' : 'Lower Abdomen Tension',
      desc:
        currentLanguage === 'hi'
          ? 'ओवरी में छोटे तरल युक्त फॉलिकल्स (सिस्ट) के जमाव या सूजन के कारण पेल्विक क्षेत्र में भारीपन या दर्द महसूस हो सकता है।'
          : 'Multiple immature follicles in the ovarian periphery can create localized pressure, lower back ache, and dull pelvic heaviness.',
      actionTip:
        currentLanguage === 'hi'
          ? 'बटरफ्लाई आसन (बद्ध कोणासन) और गुनगुना मेथी पानी पेल्विक ब्लड फ्लो को बेहतर बनाते हैं।'
          : 'Gentle Baddha Konasana (Butterfly pose) and warm hydration relieve pelvic stagnation.',
      icon: Heart,
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const handlePlayVoiceDemo = (audioId: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (playingAudioId === audioId) {
        setPlayingAudioId(null);
        return;
      }
      setPlayingAudioId(audioId);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full bg-[#FFF5F8] text-slate-900 overflow-hidden font-sans health-watermark-bg">
      {/* ========================================================
          1. HERO SECTION (Clean, Spacious, Essential Actions)
          ======================================================== */}
      <section className="relative pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-rose-100/90 overflow-hidden">
        {/* Soft atmospheric background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-rose-200/40 via-pink-100/60 to-purple-100/40 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Focused Essential Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Refined Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-rose-700 text-xs font-bold border border-rose-200/80 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>{t('heroPill')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black tracking-tight text-slate-900 leading-[1.18]">
                {t('heroTitlePrefix')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600">
                  {t('heroTitleGradient')}
                </span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {t('heroSubtitle')}
              </p>

              {/* 3 Prominent Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  id="hero-primary-cta"
                  onClick={onStartScreening}
                  className="px-7 py-3.5 rounded-full btn-rose-primary text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>{t('startScreening')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-voice-cta"
                  onClick={onOpenVoiceSaathi}
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 font-bold text-sm border border-rose-200 shadow-2xs transition flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>{t('talkToVoiceSaathi')}</span>
                  <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded-full">
                    AI
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onFindDoctor}
                  className="px-5 py-3.5 rounded-full bg-[#FFF0F4] hover:bg-[#FDE5EC] text-slate-800 font-bold text-sm border border-rose-200/80 transition flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-pink-600" />
                  <span>{currentLanguage === 'hi' ? 'डॉक्टर परामर्श (₹199)' : 'Gynecologists (₹199)'}</span>
                </button>
              </div>

              {/* Verified Trust Metrics Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rotterdam 2023 Clinical Guidelines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>10 Indian Regional Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>100% Free & Confidential</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Interactive AI Voice & Symptom Showcase Card */}
            <div className="lg:col-span-5">
              <div className="glass-blossom-glow rounded-3xl p-5 sm:p-6 border border-rose-200/90 shadow-xl relative space-y-4 bg-white/95">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800 tracking-wide">
                      {currentLanguage === 'hi' ? 'वॉयस साथी AI • सीधा बोलकर पूछें' : 'Voice Saathi AI • Live Voice Health Assistant'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    Active • 24x7
                  </span>
                </div>

                {/* Simulated Spoken Dialogue Box */}
                <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-rose-100 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold shrink-0 mt-0.5">
                      आप:
                    </span>
                    <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                      "मेरी माहवारी 2 महीने से लेट है और चेहरे पर दाने हो रहे हैं, क्या यह पीसीओएस है?"
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1 border-t border-rose-100/80">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shrink-0 mt-0.5 shadow-2xs">
                      वॉयस साथी:
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-800 font-normal leading-relaxed">
                      <p>
                        "नमस्ते! माहवारी में देरी और चेहरे पर दाने होना हार्मोनल असंतुलन का सामान्य संकेत हो सकता है। घबराएं नहीं, 2 मिनट की निःशुल्क जांच करके हम इसका सही कारण समझ सकते हैं।"
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handlePlayVoiceDemo(
                            'hero-voice-demo',
                            'नमस्ते! माहवारी में देरी और चेहरे पर दाने होना हार्मोनल असंतुलन का सामान्य संकेत हो सकता है। घबराएं नहीं, 2 मिनट की निःशुल्क जांच करके हम इसका सही कारण समझ सकते हैं।'
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white px-3 py-1 rounded-lg border border-rose-200 shadow-2xs transition"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        <span>
                          {playingAudioId === 'hero-voice-demo'
                            ? 'सुन रहे हैं... (Stop)'
                            : '🔊 बोलकर सुनो (Listen Aloud)'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 Core Quick Pillars */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <button
                    type="button"
                    onClick={onStartScreening}
                    className="p-2.5 rounded-xl bg-[#FFF0F4] hover:bg-[#FDE2EB] text-rose-900 border border-rose-200 transition"
                  >
                    <span className="block font-bold text-rose-700">1. जांचें</span>
                    2-मिनट टेस्ट
                  </button>
                  <button
                    type="button"
                    onClick={onOpen3DModal}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition"
                  >
                    <span className="block font-bold text-purple-700">2. 3D मॉडल</span>
                    ओवरी सिमुलेशन
                  </button>
                  <button
                    type="button"
                    onClick={onFindDoctor}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
                  >
                    <span className="block font-bold text-emerald-700">3. डॉक्टर</span>
                    ₹199 परामर्श
                  </button>
                </div>

                {/* Direct Action Launcher */}
                <button
                  type="button"
                  onClick={onOpenVoiceSaathi}
                  className="w-full py-3 px-4 rounded-xl btn-rose-primary text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Mic className="w-4 h-4 text-white" />
                  <span>
                    {currentLanguage === 'hi' ? 'वॉयस साथी से अपनी भाषा में बात करें' : 'Open Voice Saathi in Hindi, Bengali, Tamil...'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INTERACTIVE SYMPTOM EXPLORER (Scroll-Revealed & Focused)
          ======================================================== */}
      <section className="py-14 sm:py-16 border-b border-rose-100/90 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {currentLanguage === 'hi' ? 'लक्षण मार्गदर्शिका' : 'Interactive Symptom Guide'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5">
              {currentLanguage === 'hi' ? 'आप क्या अनुभव कर रही हैं?' : 'What symptoms are you experiencing?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              {currentLanguage === 'hi'
                ? 'किसी भी लक्षण पर क्लिक करें और उसका सरल वैज्ञानिक कारण व घरेलू सुझाव जानें:'
                : 'Select any symptom below to instantly reveal plain-language root causes and doctor-backed tips:'}
            </p>
          </div>

          {/* Interactive Clickable Symptom Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {symptomsData.map((sym) => {
              const Icon = sym.icon;
              const isSelected = activeSymptom === sym.id;

              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => setActiveSymptom(sym.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shadow-2xs ${
                    isSelected
                      ? 'btn-rose-primary text-white scale-102 ring-2 ring-rose-300'
                      : 'bg-white text-slate-700 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                  <span>{sym.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Symptom Clean Focused Display Card */}
          {(() => {
            const current = symptomsData.find((s) => s.id === activeSymptom) || symptomsData[0];
            const Icon = current.icon;

            return (
              <div className="max-w-4xl mx-auto glass-blossom-glow rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-md bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        {current.tag}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Rotterdam Marker</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-rose-600" />
                      <span>{current.label}</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {current.desc}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#FFF5F8] border border-rose-200 text-xs space-y-1">
                      <div className="font-bold text-rose-800 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>सुझाव / Doctor-Backed Next Step:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{current.actionTip}</p>
                    </div>
                  </div>

                  {/* Right: Quick Action Mini-Console */}
                  <div className="md:col-span-4 bg-[#FFF0F4] p-5 rounded-2xl border border-rose-200 text-center space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentLanguage === 'hi' ? 'सटीक जांच करवाएं' : 'Check Your Risk Level'}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {currentLanguage === 'hi'
                        ? '12 सरल प्रश्नों में जाने कि क्या यह लक्षण पीसीओएस से संबंधित हैं।'
                        : 'Answer 12 simple clinical questions for an explainable risk matrix.'}
                    </p>

                    <button
                      type="button"
                      onClick={onStartScreening}
                      className="w-full py-2.5 rounded-full btn-rose-primary text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{t('startScreening')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onOpenVoiceSaathi}
                      className="w-full py-2 rounded-full bg-white text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-50 transition flex items-center justify-center gap-1.5"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-600" />
                      <span>बोलकर पूछें</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ========================================================
          3. 3D OVARIAN & PELVIC ANATOMY (Rotterdam Explained)
          ======================================================== */}
      <section className="py-14 sm:py-16 border-b border-rose-100/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                {t('navAnatomy3D')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('feat3DTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {t('feat3DDesc')}
              </p>

              {/* Anatomy Key Observations */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white border border-rose-200 flex items-start gap-3 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      सामान्य ओव्यूलेशन (Normal Ovulation)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      प्रत्येक चक्र में एक मुख्य फॉलिकल परिपक्व होकर डिंब (अंडा) रिलीज करता है।
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200 flex items-start gap-3 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      स्ट्रिंग ऑफ पर्ल्स साइन (String of Pearls Sign)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      पीसीओएस में कई छोटे-छोटे फॉलिकल्स ओवरी की परिधि में मोतियों की माला की तरह एकत्रित हो जाते हैं।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpen3DModal}
                  className="px-6 py-3 rounded-full btn-rose-primary text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:scale-102 transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('feat3DBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={onExploreKnowledge}
                  className="px-5 py-3 rounded-full bg-white text-slate-700 border border-rose-200 text-xs font-bold hover:bg-rose-50 transition shadow-2xs"
                >
                  <span>{t('navKnowledgeHub')}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live 3D Canvas Box */}
            <div className="lg:col-span-6">
              <div className="glass-blossom-card p-4 sm:p-5 rounded-3xl border border-rose-200 shadow-lg bg-white">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">
                      Interactive 3D Pelvic Simulation
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                    Rotterdam Ultrasound
                  </span>
                </div>
                <ThreeDModel initialMode="pcos" interactive={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CONTINUOUS CARE PATHWAY (How StreeSure Works)
          ======================================================== */}
      <section id="how-it-works-section" className="py-14 sm:py-16 border-b border-rose-100/90 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {t('howItWorksHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5">
              4-Step Connected Care Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              {t('howItWorksSubheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-rose-200 relative hover:border-rose-400 transition bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t('step1Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-amber-200 relative hover:border-amber-400 transition bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-black text-sm mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t('step2Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-teal-200 relative hover:border-teal-400 transition bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t('step3Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-blossom-card p-6 rounded-2xl border border-purple-200 relative hover:border-purple-400 transition bg-white shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-sm mb-4">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{t('step4Title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onStartScreening}
              className="px-8 py-3.5 rounded-full btn-rose-primary text-white font-bold text-xs shadow-md transition hover:scale-[1.02]"
            >
              {t('startScreening')}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ASHA DIDI & VERIFIED GYNECOLOGIST TELECONSULTATION
          ======================================================== */}
      <section className="py-14 sm:py-16 border-b border-rose-100/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {t('featCommunityTitle')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('ashaFieldPortal')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {t('featCommunityDesc')}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSwitchToRole('asha')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold transition shadow-xs hover:scale-102"
                >
                  <Users className="w-4 h-4" />
                  <span>{t('ashaFieldPortal')}</span>
                </button>
                <button
                  type="button"
                  onClick={onFindDoctor}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-50 transition shadow-2xs"
                >
                  <Stethoscope className="w-4 h-4 text-rose-600" />
                  <span>{currentLanguage === 'hi' ? 'स्त्री रोग विशेषज्ञ (₹199)' : 'Book Gynecologist (₹199)'}</span>
                </button>
              </div>
            </div>

            {/* ASHA Field Card Preview */}
            <div className="lg:col-span-6">
              <div className="glass-blossom-card rounded-3xl p-6 border border-rose-200 space-y-3 bg-white shadow-md">
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    {t('beneficiaryScreening')}
                  </h4>
                  <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-bold px-2.5 py-0.5 rounded-full">
                    {t('demoModeNotice')}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-[#FFF5F8] p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Kavita Meena (22 yrs)</span>
                      <span className="text-[10px] text-slate-500">Govindgarh Ward 3 • Cycle delays (45d)</span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {t('levelOrange')}
                    </span>
                  </div>

                  <div className="bg-[#FFF5F8] p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Pooja Choudhary (26 yrs)</span>
                      <span className="text-[10px] text-slate-500">Nangal Kalan • Skipped 3+ months</span>
                    </div>
                    <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {t('levelRed')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FREQUENTLY ASKED QUESTIONS (Accordion)
          ======================================================== */}
      <section className="py-14 sm:py-16 border-b border-rose-100/90 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {t('faqHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5">
              {t('faqHeading')}
            </h2>
          </div>

          <div className="space-y-3.5">
            {[
              { q: t('faqQ1'), a: t('faqA1') },
              { q: t('faqQ2'), a: t('faqA2') },
              { q: t('faqQ3'), a: t('faqA3') },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-blossom-card rounded-2xl border border-rose-200 overflow-hidden bg-white shadow-2xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-rose-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-rose-600 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-rose-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. BOTTOM CALL TO ACTION
          ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-center shadow-lg relative overflow-hidden">
        {/* Soft background watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('ctaHeading')}
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {t('ctaSubheading')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              type="button"
              onClick={onStartScreening}
              className="px-8 py-3.5 rounded-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md hover:scale-[1.02] transition"
            >
              {t('startScreening')}
            </button>
            <button
              type="button"
              onClick={onOpenVoiceSaathi}
              className="px-6 py-3.5 rounded-full bg-rose-900/40 hover:bg-rose-900/60 text-white font-bold text-sm border border-white/30 transition flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-pink-300 animate-pulse" />
              <span>{t('talkToVoiceSaathi')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
