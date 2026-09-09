import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Cpu,
  Shield,
  Sparkles,
  Info,
  Layers,
  FlaskConical,
  RefreshCw,
  AlertCircle,
  Check,
  Smartphone,
  Gauge,
  HelpCircle,
  Globe,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  BasicProfile,
  HardwareMeasurementItem,
  LanguageCode,
  MenstrualProfile,
  MetabolicMeasurementEntry,
  MetabolicProfile,
  ScreeningAnswers,
  ScreeningResult,
  SymptomProfile,
  User,
} from '../types';
import { calculateScreeningResult, defaultMockScreeningAnswers } from '../services/screeningEngine';
import { getTranslation, SUPPORTED_LANGUAGES } from '../services/translations';
import { speakText, stopSpeaking } from '../services/voiceService';
import { getHardwareProvider } from '../hardware/hardwareAdapter';
import { validateMeasurement, PARAMETER_CONFIGS } from '../hardware/validation';
import { VoiceScreeningModal } from './VoiceScreeningModal';

interface ScreeningViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onScreeningComplete: (result: ScreeningResult) => void;
  onOpenVoiceSaathi: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  onOpenConsultDoctor?: () => void;
}

export const ScreeningView: React.FC<ScreeningViewProps> = ({
  currentUser,
  currentLanguage,
  onScreeningComplete,
  onOpenVoiceSaathi,
  onLanguageChange,
  onOpenConsultDoctor,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSpeakingInstruction, setIsSpeakingInstruction] = useState(false);

  // 1. Basic Profile State
  const [age, setAge] = useState<number>(23);
  const [heightCm, setHeightCm] = useState<number>(162);
  const [weightKg, setWeightKg] = useState<number>(64);
  const [waistCircumferenceCm, setWaistCircumferenceCm] = useState<number | undefined>(80);
  const [familyHistoryPcos, setFamilyHistoryPcos] = useState<boolean>(true);
  const [familyHistoryDiabetes, setFamilyHistoryDiabetes] = useState<boolean>(true);
  const [knownDiabetes, setKnownDiabetes] = useState<boolean>(false);
  const [knownThyroid, setKnownThyroid] = useState<boolean>(false);
  const [currentHormonalMeds, setCurrentHormonalMeds] = useState<boolean>(false);

  // Automatic BMI Calculation: weightKg / (heightM * heightM)
  const calculateBmi = (w: number, h: number): number => {
    if (!w || !h || h <= 0) return 0;
    const heightM = h / 100;
    const bmiVal = w / (heightM * heightM);
    return Math.round(bmiVal * 10) / 10;
  };
  const calculatedBmi = calculateBmi(weightKg, heightCm);

  // 2. Menstrual Profile State
  const [averageCycleLengthDays, setAverageCycleLengthDays] = useState<number>(40);
  const [shortestCycleDays, setShortestCycleDays] = useState<number>(30);
  const [longestCycleDays, setLongestCycleDays] = useState<number>(55);
  const [periodsInLast12Months, setPeriodsInLast12Months] = useState<number>(8);
  const [cycleRegularity, setCycleRegularity] = useState<
    'regular_21_35' | 'infrequent_over_35' | 'frequent_under_21' | 'absent_3_months_plus'
  >('infrequent_over_35');
  const [frequentlyOver35Days, setFrequentlyOver35Days] = useState<boolean>(true);
  const [frequentlyUnder21Days, setFrequentlyUnder21Days] = useState<boolean>(false);
  const [anyCycleOver90Days, setAnyCycleOver90Days] = useState<boolean>(false);
  const [averageBleedingDays, setAverageBleedingDays] = useState<number>(5);
  const [heavyBleeding, setHeavyBleeding] = useState<boolean>(true);
  const [recentChangeInPattern, setRecentChangeInPattern] = useState<boolean>(true);

  // 3. Symptoms Profile State
  // Core Features
  const [excessFacialBodyHair, setExcessFacialBodyHair] = useState<'none' | 'mild' | 'moderate_to_severe'>('moderate_to_severe');
  const [persistentSevereAcne, setPersistentSevereAcne] = useState<'none' | 'mild' | 'moderate_to_severe'>('moderate_to_severe');
  const [scalpHairThinning, setScalpHairThinning] = useState<'none' | 'mild' | 'moderate_to_severe'>('mild');
  // Supporting Features
  const [acanthosisSkinChanges, setAcanthosisSkinChanges] = useState<boolean>(false);
  const [unexplainedWeightChange, setUnexplainedWeightChange] = useState<'none' | 'moderate' | 'significant'>('significant');
  const [chronicFatigue, setChronicFatigue] = useState<boolean>(true);
  const [sleepIssues, setSleepIssues] = useState<boolean>(true);
  const [moodChanges, setMoodChanges] = useState<boolean>(true);
  const [pelvicDiscomfort, setPelvicDiscomfort] = useState<boolean>(false);

  // 4. Metabolic State (Manual & Device)
  const [glucoseEntry, setGlucoseEntry] = useState<MetabolicMeasurementEntry>({
    value: 112,
    unit: 'mg/dL',
    source: 'DEMO',
    fastingStatus: 'FASTING',
    isMeasured: true,
    qualityStatus: 'VALID',
    deviceId: 'STREESURE-PROTOTYPE-01',
    timestamp: new Date().toISOString(),
  });
  const [tgEntry, setTgEntry] = useState<MetabolicMeasurementEntry>({
    value: 168,
    unit: 'mg/dL',
    source: 'DEMO',
    fastingStatus: 'FASTING',
    isMeasured: true,
    qualityStatus: 'VALID',
    deviceId: 'STREESURE-PROTOTYPE-01',
    timestamp: new Date().toISOString(),
  });
  const [cholEntry, setCholEntry] = useState<MetabolicMeasurementEntry>({
    value: 208,
    unit: 'mg/dL',
    source: 'DEMO',
    fastingStatus: 'FASTING',
    isMeasured: true,
    qualityStatus: 'VALID',
    deviceId: 'STREESURE-PROTOTYPE-01',
    timestamp: new Date().toISOString(),
  });
  const [hdlEntry, setHdlEntry] = useState<MetabolicMeasurementEntry>({
    value: 44,
    unit: 'mg/dL',
    source: 'DEMO',
    fastingStatus: 'FASTING',
    isMeasured: true,
    qualityStatus: 'VALID',
    deviceId: 'STREESURE-PROTOTYPE-01',
    timestamp: new Date().toISOString(),
  });
  const [ldlEntry, setLdlEntry] = useState<MetabolicMeasurementEntry>({
    value: 130,
    unit: 'mg/dL',
    source: 'DEMO',
    fastingStatus: 'FASTING',
    isMeasured: true,
    qualityStatus: 'VALID',
    deviceId: 'STREESURE-PROTOTYPE-01',
    timestamp: new Date().toISOString(),
  });
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);

  // 5. Hardware State
  const [hardwareStatus, setHardwareStatus] = useState<
    'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'MEASURING' | 'COMPLETED' | 'ERROR'
  >('DISCONNECTED');
  const [hardwareMeasurements, setHardwareMeasurements] = useState<HardwareMeasurementItem[]>([]);
  const [hardwareImportNotice, setHardwareImportNotice] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceRecognizedText, setVoiceRecognizedText] = useState('');

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Steps configuration (dynamically translated to user's preferred language)
  const steps = [
    {
      id: 'basic',
      title: t('step1Title') || '1. Basic Health Information',
      subtitle: t('step1Subtitle') || 'Physical baseline, calculated BMI, and family medical background',
      explanation: t('step1Explanation') || 'General baseline metrics help contextualize metabolic and endocrine wellness without acting as diagnostic criteria.',
    },
    {
      id: 'menstrual',
      title: t('step2Title') || '2. Menstrual Information',
      subtitle: t('step2Subtitle') || 'Menstrual pattern relevant to PCOS screening',
      explanation: t('step2Explanation') || 'Cycle intervals and ovulatory regularity provide essential non-invasive signals of hormonal balance.',
    },
    {
      id: 'symptoms',
      title: t('step3Title') || '3. PCOS-Associated Symptoms',
      subtitle: t('step3Subtitle') || 'Core clinical features and general health symptoms',
      explanation: t('step3Explanation') || 'Evaluates hyperandrogenic patterns (skin/hair) alongside supporting systemic observations.',
    },
    {
      id: 'metabolic',
      title: t('step4Title') || '4. Metabolic Information',
      subtitle: t('step4Subtitle') || 'Blood glucose, lipid markers, and blood pressure indicators',
      explanation: t('step4Explanation') || 'Metabolic markers are optional and provide health-risk context across manual, lab, or device sources.',
    },
    {
      id: 'hardware',
      title: t('step5Title') || '5. StreeSure Hardware Check',
      subtitle: t('step5Subtitle') || 'Import available metabolic measurements from the StreeSure prototype',
      explanation: t('step5Explanation') || 'Connect to the StreeSure optical biosensor prototype to import metabolic readings directly into this screening.',
    },
    {
      id: 'review',
      title: t('step6Title') || '6. Review Your Screening',
      subtitle: t('step6Subtitle') || 'Verify data completeness before generating preliminary screening results',
      explanation: t('step6Explanation') || 'Confirm your inputs and imported measurements before running the deterministic clinical engine.',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Hardware Connection & Measurement Importer
  const handleConnectHardware = async () => {
    try {
      setHardwareStatus('CONNECTING');
      const provider = getHardwareProvider();
      await provider.connect();
      setHardwareStatus('CONNECTED');

      // Automatically read demo/hardware measurements
      setHardwareStatus('MEASURING');
      const measurements = await provider.readAllAvailableMeasurements();
      setHardwareMeasurements(measurements);

      // Persist device provenance when a signed-in beneficiary is available.
      if (currentUser?.id && measurements.length > 0) {
        try {
          await fetch('/api/hardware/measurements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              userId: currentUser.id,
              sessionId: measurements[0]?.sessionId,
              measurements,
            }),
          });
        } catch {
          // Local screening can continue if persistence is temporarily unavailable.
        }
      }
      setHardwareStatus('COMPLETED');

      // Merge into metabolic profile with DEMO / DEVICE provenance
      const importedParams: string[] = [];
      measurements.forEach((m) => {
        if (m.parameter === 'GLUCOSE') {
          setGlucoseEntry({
            value: m.value,
            unit: 'mg/dL',
            source: m.source,
            fastingStatus: m.fastingStatus,
            isMeasured: true,
            qualityStatus: m.qualityStatus,
            deviceId: m.deviceId,
            timestamp: m.timestamp,
          });
          importedParams.push('Glucose (112 mg/dL)');
        } else if (m.parameter === 'TRIGLYCERIDES') {
          setTgEntry({
            value: m.value,
            unit: 'mg/dL',
            source: m.source,
            fastingStatus: m.fastingStatus,
            isMeasured: true,
            qualityStatus: m.qualityStatus,
            deviceId: m.deviceId,
            timestamp: m.timestamp,
          });
          importedParams.push('Triglycerides (168 mg/dL)');
        } else if (m.parameter === 'TOTAL_CHOLESTEROL') {
          setCholEntry({
            value: m.value,
            unit: 'mg/dL',
            source: m.source,
            fastingStatus: m.fastingStatus,
            isMeasured: true,
            qualityStatus: m.qualityStatus,
            deviceId: m.deviceId,
            timestamp: m.timestamp,
          });
          importedParams.push('Total Cholesterol (208 mg/dL)');
        } else if (m.parameter === 'HDL') {
          setHdlEntry({
            value: m.value,
            unit: 'mg/dL',
            source: m.source,
            fastingStatus: m.fastingStatus,
            isMeasured: true,
            qualityStatus: m.qualityStatus,
            deviceId: m.deviceId,
            timestamp: m.timestamp,
          });
        } else if (m.parameter === 'LDL') {
          setLdlEntry({
            value: m.value,
            unit: 'mg/dL',
            source: m.source,
            fastingStatus: m.fastingStatus,
            isMeasured: true,
            qualityStatus: m.qualityStatus,
            deviceId: m.deviceId,
            timestamp: m.timestamp,
          });
        }
      });

      const deviceSource = measurements.some((m) => m.source === 'DEVICE') ? 'LIVE BLE DEVICE' : 'DEMO DEVICE';
      setHardwareImportNotice(
        `Successfully imported ${measurements.length} measurements from ${deviceSource} (${importedParams.join(', ')}). Provenance and quality metadata were retained.`
      );
    } catch (err: any) {
      setHardwareStatus('ERROR');
      setHardwareImportNotice('Failed to connect to hardware prototype: ' + (err?.message || 'Connection timeout'));
    }
  };

  // Compile Unified Screening Session
  const compileScreeningAnswers = (): ScreeningAnswers => {
    const basicProfileObj: BasicProfile = {
      age,
      heightCm,
      weightKg,
      bmi: calculatedBmi,
      waistCircumferenceCm,
      familyHistoryPcos,
      familyHistoryDiabetes,
      knownDiabetes,
      knownThyroid,
      currentHormonalMeds,
    };

    const menstrualProfileObj: MenstrualProfile = {
      averageCycleLengthDays,
      shortestCycleDays,
      longestCycleDays,
      periodsInLast12Months,
      cycleRegularity,
      frequentlyOver35Days: cycleRegularity === 'infrequent_over_35' || frequentlyOver35Days,
      frequentlyUnder21Days: cycleRegularity === 'frequent_under_21' || frequentlyUnder21Days,
      anyCycleOver90Days: cycleRegularity === 'absent_3_months_plus' || anyCycleOver90Days,
      averageBleedingDays,
      heavyBleeding,
      recentChangeInPattern,
    };

    const symptomProfileObj: SymptomProfile = {
      excessFacialBodyHair,
      persistentSevereAcne,
      scalpHairThinning,
      menstrualIrregularityPresent: cycleRegularity !== 'regular_21_35',
      acanthosisSkinChanges,
      unexplainedWeightChange,
      chronicFatigue,
      sleepIssues,
      moodChanges,
      pelvicDiscomfort,
    };

    const metabolicProfileObj: MetabolicProfile = {
      glucose: glucoseEntry.isMeasured ? glucoseEntry : undefined,
      triglycerides: tgEntry.isMeasured ? tgEntry : undefined,
      totalCholesterol: cholEntry.isMeasured ? cholEntry : undefined,
      hdl: hdlEntry.isMeasured ? hdlEntry : undefined,
      ldl: ldlEntry.isMeasured ? ldlEntry : undefined,
      systolicBp,
      diastolicBp,
      waistCircumferenceCm,
    };

    return {
      // Legacy compatibility mappings
      cycleRegularity,
      periodSkippingFrequency: cycleRegularity === 'infrequent_over_35' ? 'frequently_multiple_times_a_year' : 'occasionally',
      recentPatternChange: recentChangeInPattern,
      heavyProlongedBleeding: heavyBleeding,
      daysBetweenPeriods: averageCycleLengthDays,
      lastPeriodDate: '2026-07-15',

      increasedFacialHair: excessFacialBodyHair,
      increasedBodyHair: excessFacialBodyHair === 'moderate_to_severe' ? 'moderate_to_severe' : 'mild',
      persistentAcne: persistentSevereAcne === 'moderate_to_severe' ? 'persistent_adult_cystic' : persistentSevereAcne === 'mild' ? 'mild_occasional' : 'none',
      scalpHairThinning: scalpHairThinning === 'moderate_to_severe' ? 'noticeable_crown_thinning' : scalpHairThinning === 'mild' ? 'mild_shedding' : 'none',
      suddenHairChanges: false,

      unexplainedWeightGain: unexplainedWeightChange === 'significant' ? 'significant_difficulty_losing' : unexplainedWeightChange === 'moderate' ? 'moderate' : 'none',
      familyDiabetesHistory: familyHistoryDiabetes,
      elevatedBloodSugarHistory: knownDiabetes || (glucoseEntry.value ? glucoseEntry.value >= 126 : false),
      bloodPressureElevated: systolicBp >= 130 || diastolicBp >= 85,
      physicalActivityLevel: 'moderate_1_2_days',
      sleepQuality: sleepIssues ? 'poor_insomnia_apnea' : 'good',

      difficultyConceiving: 'not_applicable',
      previousPelvicUltrasound: 'unsure',
      previousHormonalTesting: 'never',

      knownThyroidDisorder: knownThyroid,
      highStressRecentEvents: moodChanges,
      majorHealthChanges: recentChangeInPattern,
      currentHormonalMeds,

      familyPcosHistory: familyHistoryPcos,
      familyCardiovascularMetabolic: false,

      // Unified object
      basicProfile: basicProfileObj,
      menstrualProfile: menstrualProfileObj,
      symptomProfile: symptomProfileObj,
      metabolicProfile: metabolicProfileObj,
      hardwareMeasurements,
    };
  };

  // Step Navigation
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } else {
      // Step 6: Review finished -> Run Deterministic Engine
      const unifiedAnswers = compileScreeningAnswers();
      const result = calculateScreeningResult(currentUser?.id || 'usr_guest', unifiedAnswers);
      onScreeningComplete(result);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  // Helper Badge for Sources
  const renderSourceBadge = (source: string) => {
    switch (source) {
      case 'DEMO':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-extrabold tracking-wide uppercase">
            DEMO
          </span>
        );
      case 'DEVICE':
        return (
          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-extrabold tracking-wide uppercase">
            STREESURE DEVICE
          </span>
        );
      case 'LAB_REPORT':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold tracking-wide uppercase">
            LAB REPORT
          </span>
        );
      case 'MANUAL':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold tracking-wide uppercase">
            MANUAL
          </span>
        );
    }
  };

  const handleSpeakStepInstruction = () => {
    if (isSpeakingInstruction) {
      stopSpeaking();
      setIsSpeakingInstruction(false);
    } else {
      setIsSpeakingInstruction(true);
      const speech = `${currentStep.title}. ${currentStep.subtitle}. ${currentStep.explanation}`;
      speakText(speech, currentLanguage, () => {
        setIsSpeakingInstruction(false);
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 0. Dedicated Voice-Only Screening Modal for Low-Literacy Users */}
      <VoiceScreeningModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        onScreeningComplete={(result) => {
          setIsVoiceModalOpen(false);
          onScreeningComplete(result);
        }}
      />

      {/* Low-Literacy / Voice-Only Screening Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-teal-700 text-white shadow-xl shadow-rose-200/60 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
            <Mic className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider">
                {currentLanguage === 'hi'
                  ? 'आवाज़ सहायक मोड (Voice Mode)'
                  : currentLanguage === 'bn'
                  ? 'ভয়েস সহকারী মোড'
                  : currentLanguage === 'mr'
                  ? 'व्हॉइस असिस्टंट मोड'
                  : currentLanguage === 'ta'
                  ? 'குரல் உதவி முறை'
                  : currentLanguage === 'te'
                  ? 'వాయిస్ అసిస్టెంట్ మోడ్'
                  : 'Voice Assistant Mode'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 text-[10px] font-bold">
                {currentLanguage === 'hi'
                  ? '100% बोलकर • लिखना ज़रूरी नहीं'
                  : currentLanguage === 'bn'
                  ? '১০০% বলে • লেখার দরকার নেই'
                  : currentLanguage === 'mr'
                  ? '१००% बोलून • लिहिण्याची गरज नाही'
                  : currentLanguage === 'ta'
                  ? '100% குரல் வழி'
                  : currentLanguage === 'te'
                  ? '100% వాయిస్ ద్వారా'
                  : '100% Voice-Guided • No Typing'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
              {currentLanguage === 'hi'
                ? 'बोलकर जाँच करें — बिना कुछ लिखे, केवल बोलकर अपनी जांच पूरी करें'
                : currentLanguage === 'bn'
                ? 'মুখে বলে পরীক্ষা করুন — কোনো টাইপ ছাড়াই স্ক্রীনিং সম্পন্ন করুন'
                : currentLanguage === 'mr'
                ? 'बोलून तपासणी करा — न लिहिता फक्त बोलून स्क्रीनिंग पूर्ण करा'
                : currentLanguage === 'ta'
                ? 'குரல் மூலம் பரிசோதனை — எதையும் தட்டச்சு செய்யாமல் பேசுங்கள்'
                : currentLanguage === 'te'
                ? 'వాయిస్ ద్వారా స్క్రీనింగ్ — టైప్ చేయకుండా మాట్లాడండి'
                : 'Complete Your Screening Entirely by Voice'}
            </h3>
            <p className="text-xs text-rose-100/90 mt-0.5 max-w-xl">
              {currentLanguage === 'hi'
                ? 'यदि आप पढ़ना या लिखना नहीं चाहते, तो आवाज़ सहायक आपसे सवाल पूछेगा और आपके बोलने पर खुद उत्तर चुनेगा।'
                : currentLanguage === 'bn'
                ? 'সহজ ও স্পষ্ট ভয়েস নির্দেশিকা সহ সম্পূর্ণ পরীক্ষা সম্পন্ন করুন।'
                : currentLanguage === 'mr'
                ? 'सोप्या आवाजाच्या सूचनेनुसार संपूर्ण तपासणी सहज पूर्ण करा.'
                : currentLanguage === 'ta'
                ? 'எளிய குரல் வழிகாட்டலுடன் முழுமையான பரிசோதனையை முடிக்கவும்.'
                : currentLanguage === 'te'
                ? 'సులభమైన వాయిస్ గైడెన్స్‌తో పూర్తి స్క్రీనింగ్‌ను పూర్తి చేయండి.'
                : 'Designed for accessibility. Our voice assistant reads each question aloud in your language and recognizes your spoken response.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-start-voice-screening"
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 text-xs sm:text-sm font-black shadow-lg hover:scale-105 transition shrink-0 flex items-center justify-center gap-2"
        >
          <Mic className="w-5 h-5 text-rose-600 animate-bounce" />
          <span>
            {currentLanguage === 'hi'
              ? 'बोलकर शुरू करें (Start Voice)'
              : currentLanguage === 'bn'
              ? 'ভয়েসে শুরু করুন'
              : currentLanguage === 'mr'
              ? 'बोलून सुरू करा'
              : currentLanguage === 'ta'
              ? 'குரலில் தொடங்குங்கள்'
              : currentLanguage === 'te'
              ? 'వాయిస్‌తో ప్రారంభించండి'
              : 'Start Voice-Guided Screening'}
          </span>
        </button>
      </div>

      {/* 1. Header with Progress Tracker and Language Preference */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60 mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>{t('appName')} PCOS Screening Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('screeningTitle') || "Women's Health & PCOS Screening"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Step {currentStepIndex + 1} / {steps.length}: {currentStep.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Direct Language Switcher in Screening */}
            {onLanguageChange && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onLanguageChange(lang.code)}
                    className={`px-2 py-1 rounded-xl text-[11px] font-bold transition ${
                      currentLanguage === lang.code
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {lang.nativeLabel}
                  </button>
                ))}
              </div>
            )}

            {/* Read Step Aloud Audio Button */}
            <button
              type="button"
              onClick={handleSpeakStepInstruction}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isSpeakingInstruction
                  ? 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Listen to this step instructions"
            >
              {isSpeakingInstruction ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>{currentLanguage === 'hi' ? 'रोकें' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-700" />
                  <span>{currentLanguage === 'hi' ? 'सुनिए' : 'Listen'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-rose-500 via-rose-600 to-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Indicator Pills (Fully Translated) */}
        <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-semibold text-slate-500">
          <span className={currentStepIndex === 0 ? 'text-rose-600 font-bold' : ''}>
            1. {currentLanguage === 'hi' ? 'बुनियादी' : currentLanguage === 'bn' ? 'মৌলিক' : currentLanguage === 'mr' ? 'मूलभूत' : currentLanguage === 'ta' ? 'அடிப்படை' : currentLanguage === 'te' ? 'ప్రాథమిక' : 'Basic'}
          </span>
          <span className={currentStepIndex === 1 ? 'text-rose-600 font-bold' : ''}>
            2. {currentLanguage === 'hi' ? 'माहवारी' : currentLanguage === 'bn' ? 'ঋতুস্রাব' : currentLanguage === 'mr' ? 'मासिक पाळी' : currentLanguage === 'ta' ? 'மாதவிடாய்' : currentLanguage === 'te' ? 'ఋతుచక్రం' : 'Cycle'}
          </span>
          <span className={currentStepIndex === 2 ? 'text-rose-600 font-bold' : ''}>
            3. {currentLanguage === 'hi' ? 'लक्षण' : currentLanguage === 'bn' ? 'লক্ষণ' : currentLanguage === 'mr' ? 'लक्षणे' : currentLanguage === 'ta' ? 'அறிகுறிகள்' : currentLanguage === 'te' ? 'లక్షణాలు' : 'Symptoms'}
          </span>
          <span className={currentStepIndex === 3 ? 'text-rose-600 font-bold' : ''}>
            4. {currentLanguage === 'hi' ? 'मेटाबॉलिक' : currentLanguage === 'bn' ? 'বিপাকীয়' : currentLanguage === 'mr' ? 'मेटाबॉलिक' : currentLanguage === 'ta' ? 'வளர்சிதை' : currentLanguage === 'te' ? 'మెటబాలిక్' : 'Metabolic'}
          </span>
          <span className={currentStepIndex === 4 ? 'text-rose-600 font-bold' : ''}>
            5. {currentLanguage === 'hi' ? 'हार्डवेयर' : currentLanguage === 'bn' ? 'হার্ডওয়্যার' : currentLanguage === 'mr' ? 'हार्डवेअर' : currentLanguage === 'ta' ? 'வன்பொருள்' : currentLanguage === 'te' ? 'హార్డ్‌వేర్' : 'Hardware'}
          </span>
          <span className={currentStepIndex === 5 ? 'text-rose-600 font-bold' : ''}>
            6. {currentLanguage === 'hi' ? 'समीक्षा' : currentLanguage === 'bn' ? 'পর্যালোচনা' : currentLanguage === 'mr' ? 'पुनरावलोकन' : currentLanguage === 'ta' ? 'மதிப்பாய்வு' : currentLanguage === 'te' ? 'సమీక్ష' : 'Review'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2 mt-3">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            {t('screeningMedicalNotice') || (
              <>
                <strong>Medical Notice:</strong> StreeSure provides preliminary pattern screening and health education. It does not diagnose PCOS or replace medical consultation with a qualified gynecologist.
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Main Step Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            {currentStep.title}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {currentStep.subtitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentStep.explanation}
          </p>
        </div>

        {/* =========================================================
            STEP 1: BASIC HEALTH INFORMATION
        ========================================================= */}
        {currentStepIndex === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Age */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('ageLabel') || 'Age (Years)'}
                </label>
                <input
                  type="number"
                  value={age}
                  min={12}
                  max={60}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-rose-500"
                />
              </div>

              {/* Height */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('heightLabel') || 'Height (cm)'}
                </label>
                <input
                  type="number"
                  value={heightCm}
                  min={100}
                  max={220}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-rose-500"
                />
              </div>

              {/* Weight */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('weightLabel') || 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  value={weightKg}
                  min={30}
                  max={180}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Automatically Calculated BMI Notice */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {t('bmiTitle') || 'Automatically Calculated Body Mass Index (BMI):'}
                </span>
                <span className="text-[11px] text-slate-600">
                  {t('bmiExplanation') || 'Formula: weight (kg) ÷ height (m)². BMI is an informative metabolic marker and never used as a diagnostic criterion for PCOS.'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-black text-rose-700">{calculatedBmi}</span>
                <span className="text-[10px] text-slate-500 block">kg/m²</span>
              </div>
            </div>

            {/* Optional Waist Circumference */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t('waistLabel') || 'Optional: Waist Circumference (cm)'}
              </label>
              <input
                type="number"
                placeholder="e.g. 78 (optional)"
                value={waistCircumferenceCm || ''}
                onChange={(e) =>
                  setWaistCircumferenceCm(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-rose-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Waist circumference above 80 cm in South Asian females indicates central adipose distribution.
              </span>
            </div>

            {/* Medical Background Checklist */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-900">
                {t('familyHistoryTitle') || 'Medical & Family History'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'famPcos',
                    label: t('motherSisterPcos') || 'Family history of PCOS (Mother / Sister)',
                    state: familyHistoryPcos,
                    setter: setFamilyHistoryPcos,
                  },
                  {
                    id: 'famDiabetes',
                    label: t('familyDiabetes') || 'Family history of Type 2 Diabetes',
                    state: familyHistoryDiabetes,
                    setter: setFamilyHistoryDiabetes,
                  },
                  {
                    id: 'knownDiabetes',
                    label: t('knownDiabetes') || 'Known history of Elevated Blood Glucose / Diabetes',
                    state: knownDiabetes,
                    setter: setKnownDiabetes,
                  },
                  {
                    id: 'knownThyroid',
                    label: t('knownThyroid') || 'Known Thyroid Condition (Hypo/Hyperthyroidism)',
                    state: knownThyroid,
                    setter: setKnownThyroid,
                  },
                  {
                    id: 'hormonalMeds',
                    label: t('hormonalMeds') || 'Current use of Oral Contraceptives or Hormonal Meds',
                    state: currentHormonalMeds,
                    setter: setCurrentHormonalMeds,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => item.setter(!item.state)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between gap-3 transition ${
                      item.state
                        ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        item.state ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.state && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 2: MENSTRUAL INFORMATION
        ========================================================= */}
        {currentStepIndex === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                {t('cycleRegularityTitle') || '1. How would you describe your typical menstrual cycle frequency?'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    key: 'regular_21_35',
                    label: t('regRegularTitle') || 'Regular (Every 21 to 35 days)',
                    desc: t('regRegularDesc') || 'Predictable monthly cycles within standard interval',
                  },
                  {
                    key: 'infrequent_over_35',
                    label: t('regInfrequentTitle') || 'Infrequent (Cycles take >35 to 60+ days)',
                    desc: t('regInfrequentDesc') || 'Oligomenorrhea pattern; periods delayed by weeks',
                  },
                  {
                    key: 'frequent_under_21',
                    label: t('regFrequentTitle') || 'Frequent (Periods return in under 21 days)',
                    desc: t('regFrequentDesc') || 'Polymenorrhea; periods recur too frequently',
                  },
                  {
                    key: 'absent_3_months_plus',
                    label: t('regAbsentTitle') || 'Absent for months (No period for >90 days)',
                    desc: t('regAbsentDesc') || 'Amenorrhea pattern without confirmed pregnancy',
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setCycleRegularity(opt.key as any);
                      if (opt.key === 'regular_21_35') {
                        setFrequentlyOver35Days(false);
                        setFrequentlyUnder21Days(false);
                        setAnyCycleOver90Days(false);
                      } else if (opt.key === 'infrequent_over_35') {
                        setFrequentlyOver35Days(true);
                      } else if (opt.key === 'absent_3_months_plus') {
                        setAnyCycleOver90Days(true);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition ${
                      cycleRegularity === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cycle Durations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('avgCycleDaysLabel') || 'Average Cycle Length (Days)'}
                </label>
                <input
                  type="number"
                  value={averageCycleLengthDays}
                  min={15}
                  max={120}
                  onChange={(e) => setAverageCycleLengthDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('shortestCycleLabel') || 'Shortest Cycle (Past Year)'}
                </label>
                <input
                  type="number"
                  value={shortestCycleDays}
                  min={15}
                  max={120}
                  onChange={(e) => setShortestCycleDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('longestCycleLabel') || 'Longest Cycle (Past Year)'}
                </label>
                <input
                  type="number"
                  value={longestCycleDays}
                  min={15}
                  max={180}
                  onChange={(e) => setLongestCycleDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900"
                />
              </div>
            </div>

            {/* Conditional Irregularity Details (Only shown if irregular) */}
            {cycleRegularity !== 'regular_21_35' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <span className="text-xs font-bold text-amber-900 block">
                  {t('additionalCycleTitle') || 'Detailed Menstrual Irregularity Factors'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFrequentlyOver35Days(!frequentlyOver35Days)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                      frequentlyOver35Days ? 'bg-amber-100/80 border-amber-500 text-amber-950' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span>{t('obsFrequentlyOver35') || 'Frequently takes >35 days'}</span>
                    {frequentlyOver35Days && <Check className="w-4 h-4 text-amber-700" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnyCycleOver90Days(!anyCycleOver90Days)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                      anyCycleOver90Days ? 'bg-amber-100/80 border-amber-500 text-amber-950' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span>{currentLanguage === 'hi' ? 'कोई भी माहवारी 90+ दिन छूटी' : 'Any cycle skipped >90 days'}</span>
                    {anyCycleOver90Days && <Check className="w-4 h-4 text-amber-700" />}
                  </button>
                </div>
              </div>
            )}

            {/* Bleeding Flow and Recent Shifts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHeavyBleeding(!heavyBleeding)}
                className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between ${
                  heavyBleeding ? 'bg-rose-50 border-rose-500 text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="block">{t('obsHeavyBleeding') || 'Heavy or prolonged bleeding (>7 days)'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {currentLanguage === 'hi' ? 'पैड जल्दी बदलना या थक्के निकलना' : 'Soaking pads rapidly or passing clots'}
                  </span>
                </div>
                {heavyBleeding && <Check className="w-4 h-4 text-rose-600" />}
              </button>

              <button
                type="button"
                onClick={() => setRecentChangeInPattern(!recentChangeInPattern)}
                className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between ${
                  recentChangeInPattern ? 'bg-rose-50 border-rose-500 text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <span className="block">{t('obsRecentChange') || 'Recent change in menstrual cycle pattern'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {currentLanguage === 'hi' ? 'हाल के महीनों में अनियमितता बढ़ गई' : 'Cycles became noticeably more irregular recently'}
                  </span>
                </div>
                {recentChangeInPattern && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 3: PCOS-ASSOCIATED SYMPTOMS
        ========================================================= */}
        {currentStepIndex === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* CORE FEATURES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase tracking-wide">
                  {currentLanguage === 'hi' ? 'मुख्य नैदानिक लक्षण' : currentLanguage === 'bn' ? 'প্রধান ক্লিনিক্যাল লক্ষণ' : 'Core Clinical Features'}
                </span>
                <span className="text-xs text-slate-500">
                  {currentLanguage === 'hi' ? 'हार्मोनल संतुलन और ओव्यूलेशन से संबंधित' : 'Associated with hyperandrogenic balance & ovarian ovulation'}
                </span>
              </div>

              <div className="space-y-4">
                {/* 1. Facial / Body Hair */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    {t('facialHairQ') || 'Excess Coarse Facial or Body Hair (Hirsutism pattern on chin, upper lip, chest, abdomen)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: t('sevNone') || 'None / Normal' },
                      { key: 'mild', label: t('sevMild') || 'Mild (Few strands)' },
                      { key: 'moderate_to_severe', label: t('sevModSevere') || 'Moderate to Significant' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setExcessFacialBodyHair(opt.key as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                          excessFacialBodyHair === opt.key
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Persistent Acne */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    {t('acneQ') || 'Persistent or Cystic Adult Acne (Particularly on jawline, cheeks, or back)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: t('sevNone') || 'None / Rare' },
                      { key: 'mild', label: t('sevMild') || 'Mild / Occasional' },
                      { key: 'moderate_to_severe', label: t('sevModSevere') || 'Persistent / Cystic' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setPersistentSevereAcne(opt.key as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                          persistentSevereAcne === opt.key
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Scalp Hair Thinning */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    {t('hairThinningQ') || 'Scalp Hair Thinning or Crown Shedding (Female pattern hair loss)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: t('sevNone') || 'Normal density' },
                      { key: 'mild', label: t('sevMild') || 'Mild shedding' },
                      { key: 'moderate_to_severe', label: t('sevModSevere') || 'Noticeable thinning' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setScalpHairThinning(opt.key as any)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                          scalpHairThinning === opt.key
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORTING GENERAL HEALTH FEATURES */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold uppercase tracking-wide">
                  {currentLanguage === 'hi' ? 'सहायक स्वास्थ्य कारक' : currentLanguage === 'bn' ? 'সহায়ক স্বাস্থ্য কারণ' : 'Supporting Health Factors'}
                </span>
                <span className="text-xs text-slate-500">
                  {currentLanguage === 'hi' ? 'सामान्य ऊर्जा, नींद और मेटाबॉलिज्म' : 'General metabolic, sleep, and well-being context'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'acanthosis',
                    label: t('obsAcanthosis') || 'Darkened velvety skin patches (Acanthosis Nigricans on neck/armpits)',
                    state: acanthosisSkinChanges,
                    setter: setAcanthosisSkinChanges,
                  },
                  {
                    id: 'fatigue',
                    label: t('obsFatigue') || 'Chronic low energy, fatigue, or brain fog',
                    state: chronicFatigue,
                    setter: setChronicFatigue,
                  },
                  {
                    id: 'sleep',
                    label: t('obsSleepIssues') || 'Unrefreshing sleep or insomnia tendencies',
                    state: sleepIssues,
                    setter: setSleepIssues,
                  },
                  {
                    id: 'mood',
                    label: t('obsMoodChanges') || 'High emotional stress, irritability, or anxiety',
                    state: moodChanges,
                    setter: setMoodChanges,
                  },
                  {
                    id: 'pelvic',
                    label: t('obsPelvicDiscomfort') || 'Frequent lower abdominal or pelvic discomfort',
                    state: pelvicDiscomfort,
                    setter: setPelvicDiscomfort,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => item.setter(!item.state)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between gap-3 transition ${
                      item.state
                        ? 'bg-rose-50 border-rose-500 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                        item.state ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {item.state && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 4: METABOLIC INFORMATION
        ========================================================= */}
        {currentStepIndex === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
              <FlaskConical className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                Metabolic measurements provide additional health-risk context. You can enter them manually, reference a recent lab report, or import from the StreeSure prototype device in Step 5. <strong>Hardware is never mandatory</strong>.
              </span>
            </div>

            {/* Glucose Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Blood Glucose (mg/dL)</h4>
                  <span className="text-[10px] text-slate-500">{PARAMETER_CONFIGS.GLUCOSE.normalRangeLabel}</span>
                </div>
                {glucoseEntry.isMeasured && renderSourceBadge(glucoseEntry.source)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Value (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 105"
                    value={glucoseEntry.value || ''}
                    onChange={(e) =>
                      setGlucoseEntry({
                        ...glucoseEntry,
                        value: e.target.value ? Number(e.target.value) : undefined,
                        isMeasured: Boolean(e.target.value),
                        source: glucoseEntry.source === 'DEMO' || glucoseEntry.source === 'DEVICE' ? 'MANUAL' : glucoseEntry.source,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Fasting Status</label>
                  <select
                    value={glucoseEntry.fastingStatus || 'FASTING'}
                    onChange={(e) =>
                      setGlucoseEntry({ ...glucoseEntry, fastingStatus: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900"
                  >
                    <option value="FASTING">Fasting (8-12 hrs)</option>
                    <option value="NON_FASTING">Non-Fasting / Post-Meal</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Source</label>
                  <select
                    value={glucoseEntry.source}
                    onChange={(e) =>
                      setGlucoseEntry({ ...glucoseEntry, source: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900"
                  >
                    <option value="MANUAL">Manual Entry</option>
                    <option value="LAB_REPORT">Lab Report</option>
                    <option value="DEVICE">StreeSure Device</option>
                    <option value="DEMO">Demo Device</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lipid Measurements (Triglycerides & Total Cholesterol) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Triglycerides */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Triglycerides (mg/dL)</span>
                  {tgEntry.isMeasured && renderSourceBadge(tgEntry.source)}
                </div>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={tgEntry.value || ''}
                  onChange={(e) =>
                    setTgEntry({
                      ...tgEntry,
                      value: e.target.value ? Number(e.target.value) : undefined,
                      isMeasured: Boolean(e.target.value),
                      source: tgEntry.source === 'DEMO' || tgEntry.source === 'DEVICE' ? 'MANUAL' : tgEntry.source,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 block">Normal: &lt;150 mg/dL</span>
              </div>

              {/* Total Cholesterol */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Total Cholesterol (mg/dL)</span>
                  {cholEntry.isMeasured && renderSourceBadge(cholEntry.source)}
                </div>
                <input
                  type="number"
                  placeholder="e.g. 195"
                  value={cholEntry.value || ''}
                  onChange={(e) =>
                    setCholEntry({
                      ...cholEntry,
                      value: e.target.value ? Number(e.target.value) : undefined,
                      isMeasured: Boolean(e.target.value),
                      source: cholEntry.source === 'DEMO' || cholEntry.source === 'DEVICE' ? 'MANUAL' : cholEntry.source,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 block">Normal: &lt;200 mg/dL</span>
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Blood Pressure (mmHg)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Systolic (Top)</span>
                  <input
                    type="number"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Diastolic (Bottom)</span>
                  <input
                    type="number"
                    value={diastolicBp}
                    onChange={(e) => setDiastolicBp(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 5: STREESURE HARDWARE CHECK
        ========================================================= */}
        {currentStepIndex === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* DEMO / SIMULATED DEVICE INPUT NOTICE ALWAYS VISIBLE */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                  <Cpu className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-purple-950">
                      STREESURE HARDWARE PROTOTYPE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black tracking-wider uppercase">
                      DEMO / SIMULATED DEVICE INPUT
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    Demonstration mode with deterministic biosensor data. Demo measurements are simulated and are not real clinical measurements.
                  </p>
                </div>
              </div>
            </div>

            {/* Device Connection Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      hardwareStatus === 'CONNECTED' || hardwareStatus === 'COMPLETED'
                        ? 'bg-emerald-500 text-slate-950'
                        : hardwareStatus === 'CONNECTING' || hardwareStatus === 'MEASURING'
                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Device Status
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {hardwareStatus === 'DISCONNECTED' && 'Disconnected'}
                      {hardwareStatus === 'CONNECTING' && 'Connecting to StreeSure Device...'}
                      {hardwareStatus === 'CONNECTED' && 'Device Connected (STREESURE-PROTOTYPE-01)'}
                      {hardwareStatus === 'MEASURING' && 'Measuring Bio-Optical Biomarkers...'}
                      {hardwareStatus === 'COMPLETED' && 'Measurements Complete & Imported'}
                      {hardwareStatus === 'ERROR' && 'Connection Error'}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConnectHardware}
                  disabled={hardwareStatus === 'CONNECTING' || hardwareStatus === 'MEASURING'}
                  className={`px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition flex items-center justify-center gap-2 ${
                    hardwareStatus === 'COMPLETED'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      hardwareStatus === 'CONNECTING' || hardwareStatus === 'MEASURING' ? 'animate-spin' : ''
                    }`}
                  />
                  <span>
                    {hardwareStatus === 'DISCONNECTED' && 'Connect StreeSure Device'}
                    {hardwareStatus === 'CONNECTING' && 'Connecting...'}
                    {hardwareStatus === 'CONNECTED' && 'Start Measurement'}
                    {hardwareStatus === 'MEASURING' && 'Importing Data...'}
                    {hardwareStatus === 'COMPLETED' && 'Re-Import Device Data'}
                    {hardwareStatus === 'ERROR' && 'Retry Connection'}
                  </span>
                </button>
              </div>

              {/* Status Banner / Overwrite Clarity */}
              {hardwareImportNotice && (
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hardwareImportNotice}</span>
                </div>
              )}

              {/* Imported Hardware Table */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Available Sensor Biomarkers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Glucose */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Glucose</span>
                      <span className="text-[10px] font-bold text-purple-400">DEMO</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">112</span>
                      <span className="text-xs text-slate-400">mg/dL</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Status: Valid</span>
                  </div>

                  {/* Triglycerides */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Triglycerides</span>
                      <span className="text-[10px] font-bold text-purple-400">DEMO</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">168</span>
                      <span className="text-xs text-slate-400">mg/dL</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Status: Valid</span>
                  </div>

                  {/* Total Cholesterol */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Total Cholesterol</span>
                      <span className="text-[10px] font-bold text-purple-400">DEMO</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">208</span>
                      <span className="text-xs text-slate-400">mg/dL</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Status: Valid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 6: REVIEW ALL INPUTS
        ========================================================= */}
        {currentStepIndex === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Completeness Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Screening Completeness
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Represents data completeness across required sections (<strong>not</strong> model confidence or diagnostic certainty).
                  </span>
                </div>
                <span className="text-lg font-black text-rose-600">100%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-600 h-full w-full rounded-full" />
              </div>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Basic Profile Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900">Your Information</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(0)}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-semibold">{age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated BMI:</span>
                    <span className="font-semibold">{calculatedBmi} kg/m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family History:</span>
                    <span className="font-semibold">
                      {familyHistoryPcos ? 'PCOS (Yes)' : 'No'} / {familyHistoryDiabetes ? 'Diabetes (Yes)' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Menstrual Pattern Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900">Menstrual Pattern</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(1)}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Cycle Frequency:</span>
                    <span className="font-semibold">
                      {cycleRegularity === 'regular_21_35'
                        ? 'Regular (21-35d)'
                        : cycleRegularity === 'infrequent_over_35'
                        ? 'Infrequent (>35d)'
                        : cycleRegularity === 'frequent_under_21'
                        ? 'Frequent (<21d)'
                        : 'Absent (>90d)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Cycle Length:</span>
                    <span className="font-semibold">{averageCycleLengthDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flow & Patterns:</span>
                    <span className="font-semibold">
                      {heavyBleeding ? 'Heavy flow' : 'Standard'} · {recentChangeInPattern ? 'Recent shifts' : 'Stable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Clinical Symptoms Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900">PCOS-Associated Symptoms</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(2)}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Facial/Body Hair:</span>
                    <span className="font-semibold capitalize">{excessFacialBodyHair.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Persistent Acne:</span>
                    <span className="font-semibold capitalize">{persistentSevereAcne.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scalp Hair Shedding:</span>
                    <span className="font-semibold capitalize">{scalpHairThinning.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {/* 4. Metabolic & Hardware Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-900">Metabolic & Hardware Values</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(3)}
                    className="text-[11px] text-rose-600 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Glucose:</span>
                    <span className="font-semibold flex items-center gap-1.5">
                      {glucoseEntry.isMeasured ? `${glucoseEntry.value} mg/dL` : 'Not measured'}
                      {glucoseEntry.isMeasured && renderSourceBadge(glucoseEntry.source)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Triglycerides:</span>
                    <span className="font-semibold flex items-center gap-1.5">
                      {tgEntry.isMeasured ? `${tgEntry.value} mg/dL` : 'Not measured'}
                      {tgEntry.isMeasured && renderSourceBadge(tgEntry.source)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Cholesterol:</span>
                    <span className="font-semibold flex items-center gap-1.5">
                      {cholEntry.isMeasured ? `${cholEntry.value} mg/dL` : 'Not measured'}
                      {cholEntry.isMeasured && renderSourceBadge(cholEntry.source)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Disclaimer Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>{currentLanguage === 'hi' ? 'मूल्यांकन अस्वीकरण:' : 'Evaluation Disclaimer:'}</strong>{' '}
              {currentLanguage === 'hi'
                ? 'स्त्रीश्योर प्राथमिक स्क्रीनिंग मानकीकृत क्लीनिकल पैटर्न लॉजिक पर आधारित है। यह केवल जोखिम का प्रारंभिक अनुमान है और डॉक्टर के परामर्श का विकल्प नहीं है।'
                : 'StreeSure preliminary screening applies deterministic clinical pattern logic. Hardware measurements and answers are combined to generate preliminary risk insight and do not constitute a medical diagnosis.'}
            </div>
          </div>
        )}

        {/* 3. Navigation Actions (Back / Next / Calculate) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('btnBack') || 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            id="btn-screening-next"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold shadow-lg shadow-rose-200 transition hover:scale-105"
          >
            <span>
              {currentStepIndex === steps.length - 1
                ? (t('btnGenerateResult') || 'Generate StreeSure Screening Result')
                : (t('btnSaveContinue') || 'Save & Continue')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
