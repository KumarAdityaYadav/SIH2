import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Layers,
  Calendar,
  Stethoscope,
  Activity,
  Globe,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ShoppingBag,
  Users,
  Eye,
  Trash2,
  Dumbbell,
  Leaf,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Search,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { LanguageCode, User } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';
import { speakText, stopSpeaking, prewarmVoices, unlockAudio, playChime } from '../services/voiceService';

interface VoiceSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigateTab: (tab: string) => void;
  onOpen3DModal: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  keyTakeaways?: string[];
  followUpQuestions?: string[];
  actionIntent?: string;
  actionLabel?: string;
  timestamp: string;
  googleGrounded?: boolean;
  sources?: Array<{ title: string; uri: string }>;
  responseTimeMs?: number;
}

type TopicCategory = 'symptoms' | 'myths' | 'nutrition' | 'exercise' | 'remedies' | 'tracker' | 'tests' | 'doctor';

const COMMON_REAL_SYMPTOMS = [
  { id: 'delayed_periods', label: '🩸 Delayed Cycles (35+ Days)', hi: 'माहवारी 35+ दिन लेट', prompt: 'Why are my periods delayed for more than 35-45 days in PCOS?' },
  { id: 'facial_hair', label: '✨ Facial & Chin Hair', hi: 'चेहरे और ठोड़ी पर अनचाहे बाल', prompt: 'What causes facial and chin hair in PCOS and how to reduce it?' },
  { id: 'cystic_acne', label: '🔴 Jawline Cystic Acne', hi: 'जबड़े और चेहरे पर गंभीर मुंहासे', prompt: 'Why do I get hormonal acne around the jawline and how to manage it?' },
  { id: 'weight_gain', label: '⚖️ Stubborn Belly Weight', hi: 'पेट के आसपास बढ़ता वजन', prompt: 'Why is it difficult to lose weight with insulin resistance in PCOS?' },
  { id: 'hair_thinning', label: '💆 Scalp Hair Loss', hi: 'सिर के बालों का पतला होना/झड़ना', prompt: 'How does high androgen cause hair loss on the crown in PCOS?' },
  { id: 'dark_neck', label: '🖤 Dark Patches on Neck', hi: 'गर्दन पर काले मखमली धब्बे', prompt: 'What is Acanthosis Nigricans and why does high insulin cause dark neck skin?' },
  { id: 'fatigue_sugar', label: '⚡ Fatigue & Sugar Cravings', hi: 'अत्यधिक थकान और मीठे की लालसा', prompt: 'Why do I feel tired after meals and crave sweets with PCOS?' },
  { id: 'pregnancy_ovulation', label: '👶 Fertility & Ovulation', hi: 'गर्भधारण और ओव्यूलेशन में मदद', prompt: 'Can I get pregnant naturally with PCOS and how to boost ovulation?' },
  { id: 'spearmint_tea', label: '🍵 Spearmint & Inositol', hi: 'पुदीना चाय और मायो-इनोसिटोल', prompt: 'What is the clinical evidence for Spearmint tea and 40:1 Myo-Inositol for PCOS?' },
  { id: 'pelvic_pain', label: '🌸 Severe Period Cramps', hi: 'माहवारी में तेज पेट दर्द', prompt: 'What causes severe period cramps and pelvic heaviness in PCOS?' },
];

export const VoiceSaathiModal: React.FC<VoiceSaathiModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage,
  onLanguageChange,
  onNavigateTab,
  onOpen3DModal,
}) => {
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'saathi',
      text:
        currentLanguage === 'hi'
          ? 'नमस्ते! मैं आपकी वॉयस साथी (Voice Saathi) हूँ। आप मुझसे अपनी माहवारी में देरी, पेट दर्द, चेहरे पर अनचाहे बाल, मुँहासे, वजन या किसी भी लक्षण के बारे में बोलकर या लिखकर बात कर सकती हैं। आपको अभी क्या परेशानी महसूस हो रही है?'
          : "Hello! I am your Voice Saathi. You can speak or write to me about delayed periods, severe cramps, facial hair, cystic acne, stubborn weight, or any physical symptoms. What problem are you facing right now?",
      keyTakeaways: [
        currentLanguage === 'hi'
          ? 'बातचीत के माध्यम से समाधान: आपकी समस्या को सुनकर तुरंत वैज्ञानिक व आसान सुझाव।'
          : 'Interactive Voice Companion: Instant evidence-based answers to your personal symptoms.',
        currentLanguage === 'hi'
          ? '100% गोपनीय व सुरक्षित: बिना किसी संकोच के अपनी मातृभाषा में साझा करें।'
          : '100% Private & Empathetic: Ask any sensitive cycle or health question in your own language.',
      ],
      followUpQuestions:
        currentLanguage === 'hi'
          ? [
              'माहवारी 40 दिन से ज्यादा लेट क्यों हो रही है?',
              'पेट में बहुत तेज दर्द और ऐंठन के लिए क्या करें?',
              'चेहरे और ठोड़ी पर अनचाहे बाल कैसे कम होंगे?',
              'क्या दुबली महिलाओं को भी पीसीओएस हो सकता है?',
            ]
          : [
              'Why is my period delayed by 40+ days?',
              'What should I do for severe period cramps and pain?',
              'How to naturally reduce facial and chin hair?',
              'Can lean or thin women have PCOS?',
            ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<TopicCategory>('symptoms');
  const [inputText, setInputText] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showSymptomDrawer, setShowSymptomDrawer] = useState(false);
  const [selectedSymptomsList, setSelectedSymptomsList] = useState<string[]>([]);
  const [isAnalyzingSymptoms, setIsAnalyzingSymptoms] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      prewarmVoices();
    }
  }, [isOpen]);

  const toggleSymptomSelection = (symptomLabel: string) => {
    setSelectedSymptomsList((prev) =>
      prev.includes(symptomLabel)
        ? prev.filter((s) => s !== symptomLabel)
        : [...prev, symptomLabel]
    );
  };

  const handleRunMultiSymptomAnalysis = async () => {
    if (selectedSymptomsList.length === 0) return;
    setIsAnalyzingSymptoms(true);
    setShowSymptomDrawer(false);

    const symptomQuery =
      currentLanguage === 'hi'
        ? `कृपया मेरे इन लक्षणों का विश्लेषण करें: ${selectedSymptomsList.join(', ')}। इनका क्या कारण है और मुझे क्या करना चाहिए?`
        : `Please analyze my symptoms: ${selectedSymptomsList.join(', ')}. What are the hormonal root causes, key lab tests, and actionable steps?`;

    await handleSendMessage(symptomQuery);
    setIsAnalyzingSymptoms(false);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi, liveTranscript]);

  if (!isOpen) return null;

  // Curated PCOS topic queries for deep exploration
  const categoryPCOSQuestions: Record<
    TopicCategory,
    { label: string; icon: any; prompts: Record<string, string[]> }
  > = {
    symptoms: {
      label: currentLanguage === 'hi' ? 'लक्षण व मूल कारण' : 'Symptoms & Causes',
      icon: Activity,
      prompts: {
        hi: [
          'माहवारी 35 दिनों से अधिक लेट क्यों होती है?',
          'चेहरे और ठुड्डी पर अनचाहे बाल (हर्सुटिज़्म) क्यों आते हैं?',
          'जबड़े पर जिद्दी हार्मोनल मुंहासे (पिंपल्स) का क्या कारण है?',
          'गर्दन पर काले मखमली निशान (Acanthosis Nigricans) क्यों होते हैं?',
          'क्या सामान्य वजन वाली महिलाओं को भी पीसीओएस (Lean PCOS) हो सकता है?',
        ],
        en: [
          'Why does PCOS cause cycles delayed beyond 35 days?',
          'Why do I get excess facial/chin hair (hirsutism)?',
          'What causes persistent jawline cystic acne in PCOS?',
          'Why are there dark velvety patches on the neck (Acanthosis Nigricans)?',
          'Can normal-weight or thin women have Lean PCOS?',
        ],
      },
    },
    myths: {
      label: currentLanguage === 'hi' ? 'मिथक बनाम सच' : 'Myths vs Facts',
      icon: HelpCircle,
      prompts: {
        hi: [
          'क्या पीसीओएस में कभी गर्भधारण (Pregnancy) नहीं हो सकता?',
          'क्या केवल मोटे लोगों को ही पीसीओएस होता है?',
          'क्या पीसीओएस में अंडाशय में खतरनाक सिस्ट बन जाते हैं?',
          'क्या गर्भनिरोधक गोलियां (Birth Control) ही एकमात्र इलाज हैं?',
          'क्या मुझे रोटी, चावल और दूध पूरी तरह छोड़ना पड़ेगा?',
        ],
        en: [
          'Does PCOS mean I will never be able to get pregnant?',
          'Do only overweight women get PCOS or can thin women have it too?',
          'Are ovarian cysts in PCOS actually tumors or follicles?',
          'Are contraceptive birth control pills the only medical treatment?',
          'Do I need to eliminate all dairy, gluten, and carbohydrates?',
        ],
      },
    },
    nutrition: {
      label: currentLanguage === 'hi' ? 'आहार व सप्लीमेंट्स' : 'Nutrition & Inositol',
      icon: Sparkles,
      prompts: {
        hi: [
          'मायो-इनोसिटोल (Myo-Inositol 40:1) अंडाशय और पीरियड्स को कैसे ठीक करता है?',
          'इंसुलिन रेजिस्टेंस कम करने के लिए भारतीय थाली में क्या बदलाव करें?',
          'क्या पीसीओएस में सीड साइकिलिंग (Seed Cycling) से फायदा होता है?',
          'प्रोटीन और फाइबर बढ़ाने के लिए शाकाहारी स्रोत कौन से हैं?',
          'केयर स्टोर में उपलब्ध पीसीओएस वेलनेस टैबलेट्स के बारे में बताएं।',
        ],
        en: [
          'What does research say about Myo-Inositol and D-Chiro Inositol (40:1)?',
          'What is the optimal Indian low-glycemic meal plate for PCOS?',
          'What is Seed Cycling and does it clinically balance estrogen/progesterone?',
          'Best vegetarian protein sources to prevent post-meal glucose spikes?',
          'Tell me about the PCOS herbal tablets available in the Care Store.',
        ],
      },
    },
    exercise: {
      label: currentLanguage === 'hi' ? 'व्यायाम व योग' : 'Workouts & Yoga',
      icon: Dumbbell,
      prompts: {
        hi: [
          'पीसीओएस में हाई-इंटेंसिटी (HIIT) कार्डियो से तनाव (Cortisol) क्यों बढ़ता है?',
          'मांसपेशियों में ग्लूकोज सोखने (GLUT4) के लिए कौन से व्यायाम सबसे अच्छे हैं?',
          'पेल्विक एरिया में ब्लड सर्कुलेशन बढ़ाने वाले 3 मुख्य योगासन कौन से हैं?',
          'क्या एक्सरसाइज पोर्टल में दिए गए वीडियो रूटीन को देखना सुरक्षित है?',
        ],
        en: [
          'Why should I avoid high-cortisol burnout HIIT and focus on strength/walking?',
          'How does low-impact strength training activate GLUT4 glucose clearance?',
          'Which restorative yoga asanas improve ovarian blood circulation?',
          'How do I explore guided routines in the Exercise Portal?',
        ],
      },
    },
    remedies: {
      label: currentLanguage === 'hi' ? 'घरेलू उपचार' : 'Home Remedies',
      icon: Leaf,
      prompts: {
        hi: [
          'स्पीयरमिंट टी (पुदीना चाय) चेहरे के अनचाहे बाल कैसे कम करती है?',
          'मेथी दाना पानी रातभर भिगोकर पीने के क्या फायदे हैं?',
          'दालचीनी (Cinnamon) चाय ब्लड शुगर और पीरियड्स में कैसे मदद करती है?',
          'क्या अश्वगंधा अधिवृक्क तनाव (Adrenal PCOS) को कम करता है?',
          'घरेलू उपचार पोर्टल में क्या-क्या नुस्खे उपलब्ध हैं?',
        ],
        en: [
          'How does Spearmint tea reduce facial hair and free testosterone?',
          'What are the clinical benefits of overnight soaked fenugreek (methi) water?',
          'How does Ceylon Cinnamon tea improve cellular insulin receptors?',
          'Can Ashwagandha reduce adrenal cortisol in Lean PCOS?',
          'What evidence-based remedies are in the Home Remedies Portal?',
        ],
      },
    },
    tracker: {
      label: currentLanguage === 'hi' ? 'प्रोग्रेस ट्रैकर' : 'Progress Tracker',
      icon: TrendingUp,
      prompts: {
        hi: [
          'प्रोग्रेस ट्रैकर में रोजाना कौन से लक्षण दर्ज करने चाहिए?',
          'नींद, पानी और तनाव को ट्रैक करने से पीसीओएस में क्या सुधार होता है?',
          '30 दिनों का लक्षण सुधार स्कोर (Symptom Severity) कैसे देखें?',
          'अपनी प्रोग्रेस रिपोर्ट डॉक्टर के साथ कैसे शेयर करें?',
        ],
        en: [
          'What biometrics and symptoms should I log in the Progress Tracker?',
          'How does tracking sleep, water, and stress correlate with cycle health?',
          'How does the 30-day symptom severity reduction graph work?',
          'How can I export my wellness report for my gynecologist?',
        ],
      },
    },
    tests: {
      label: currentLanguage === 'hi' ? 'जांच व 3D मॉडल' : 'Tests & 3D Anatomy',
      icon: Layers,
      prompts: {
        hi: [
          '3D मॉडल में पीसीओएस वाले अंडाशय की बनावट कैसे देखें?',
          'पीसीओएस जांचने के लिए रॉटरडैम क्राइटेरिया क्या है?',
          'फास्टिंग इंसुलिन और HOMA-IR टेस्ट क्यों जरूरी है?',
          'LH और FSH का अनुपात 2:1 या 3:1 होने का क्या मतलब है?',
          'सोनोग्राफी में मोतियों की माला (String of Pearls) फॉलिकल्स क्या होते हैं?',
        ],
        en: [
          'Show me the 3D Ovarian Model and immature follicle anatomy',
          'What is the Rotterdam 2023 diagnostic criteria for PCOS?',
          'Why is Fasting Insulin more important than normal blood sugar?',
          'What does an elevated LH to FSH ratio (2:1 or 3:1) mean?',
          'What is the ultrasound "string of pearls" follicle sign?',
        ],
      },
    },
    doctor: {
      label: currentLanguage === 'hi' ? 'डॉक्टर व आशा दीदी' : 'Doctor & ASHA Care',
      icon: Stethoscope,
      prompts: {
        hi: [
          'स्त्रीश्योर पर ₹199 में गायनेकोलॉजिस्ट से परामर्श कैसे बुक करें?',
          'आशा दीदी से सैनिटरी पैड और पोषण सहायता कैसे लें?',
          'डॉक्टर से परामर्श से पहले मुझे क्या-क्या तैयारी करनी चाहिए?',
          'क्या डॉक्टर मेरी पिछली अल्ट्रासाउंड और ब्लड रिपोर्ट की जांच करेंगी?',
        ],
        en: [
          'How to book a confidential gynecologist teleconsult for ₹199?',
          'How can local ASHA workers help with menstrual hygiene and tests?',
          'What questions should I ask my gynecologist during consultation?',
          'Can the doctor review my previous lab and ultrasound reports?',
        ],
      },
    },
  };

  const currentCategoryData = categoryPCOSQuestions[activeCategory];
  const categoryPrompts =
    currentCategoryData.prompts[currentLanguage] || currentCategoryData.prompts.en || [];

  const handleSendMessage = async (userTextToSend?: string) => {
    const text = userTextToSend || inputText;
    if (!text.trim()) return;

    unlockAudio();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setLiveTranscript('');
    latestTranscriptRef.current = '';

    const startTime = Date.now();
    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const recentHistory = messages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoadingAi(true);

    try {
      const res = await fetch('/api/gemini/voice-saathi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language: currentLanguage,
          history: recentHistory,
          context: {
            userRole: currentUser?.role || 'USER',
            userName: currentUser?.fullName || 'Friend',
          },
        }),
      });

      const data = await res.json();
      const elapsedMs = Date.now() - startTime;
      const reply =
        data.reply ||
        (currentLanguage === 'hi'
          ? 'आपके द्वारा पूछे गए सवाल का समाधान संतुलित पोषण, नियमित दिनचर्या और विशेषज्ञ परामर्श से संभव है।'
          : 'Your symptom concern can be effectively addressed with targeted nutrition, lifestyle care, and medical guidance.');

      const saathiMsg: Message = {
        id: 'saathi_' + Date.now(),
        sender: 'saathi',
        text: reply,
        keyTakeaways: data.keyTakeaways || [],
        followUpQuestions: data.followUpQuestions || [],
        actionIntent: data.actionIntent || 'none',
        actionLabel: data.actionLabel || '',
        googleGrounded: data.googleGrounded ?? true,
        sources: data.sources || [],
        responseTimeMs: elapsedMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, saathiMsg]);

      // Play chime and immediately talk to user
      if (autoVoiceEnabled) {
        playChime('reply');
        setCurrentlySpeakingId(saathiMsg.id);
        speakText(reply, currentLanguage, () => {
          setCurrentlySpeakingId(null);
        });
      }
    } catch (e) {
      console.error('Error fetching Voice Saathi response:', e);
      const elapsedMs = Date.now() - startTime;
      const fallbackMsg: Message = {
        id: 'saathi_' + Date.now(),
        sender: 'saathi',
        text:
          currentLanguage === 'hi'
            ? 'नमस्ते! मैंने आपके प्रश्न को समझा। हार्मोनल संतुलन और लक्षणों के समाधान के लिए संतुलित आहार, पानी और डॉक्टर की सलाह से शुरुआत करें।'
            : 'Hello! I heard your question. Supporting hormonal balance starts with regular hydration, low-GI meals, and gynecological guidance.',
        keyTakeaways: [
          currentLanguage === 'hi'
            ? 'इंसुलिन और हार्मोन का संतुलन बनाए रखें।'
            : 'Maintain balanced blood sugar and insulin sensitivity.',
          currentLanguage === 'hi'
            ? 'मायो-इनोसिटोल और सही पोषण से लाभ होता है।'
            : 'Myo-Inositol and low-glycemic nutrition are clinically beneficial.',
        ],
        followUpQuestions:
          currentLanguage === 'hi'
            ? ['मायो-इनोसिटोल कैसे काम करता है?', 'डॉक्टर से परामर्श कैसे लें?']
            : ['How does Myo-Inositol work?', 'How to consult a doctor on StreeSure?'],
        googleGrounded: false,
        sources: [],
        responseTimeMs: elapsedMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoVoiceEnabled) {
        playChime('reply');
        setCurrentlySpeakingId(fallbackMsg.id);
        speakText(fallbackMsg.text, currentLanguage, () => {
          setCurrentlySpeakingId(null);
        });
      }
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleToggleSpeakMessage = (msg: Message) => {
    unlockAudio();
    if (currentlySpeakingId === msg.id) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      stopSpeaking();
      setCurrentlySpeakingId(msg.id);
      speakText(msg.text, currentLanguage, () => {
        setCurrentlySpeakingId(null);
      });
    }
  };

  const startVoiceInput = () => {
    unlockAudio();
    playChime('start');
    setLiveTranscript('');
    latestTranscriptRef.current = '';

    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang =
          currentLanguage === 'hi'
            ? 'hi-IN'
            : currentLanguage === 'bn'
            ? 'bn-IN'
            : currentLanguage === 'mr'
            ? 'mr-IN'
            : currentLanguage === 'ta'
            ? 'ta-IN'
            : currentLanguage === 'te'
            ? 'te-IN'
            : 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const currentText = (finalTranscript || interimTranscript).trim();
          if (currentText) {
            setLiveTranscript(currentText);
            latestTranscriptRef.current = currentText;

            // Reset silence timer on every spoken word
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }

            // Quick auto-submit after 1.2s silence
            silenceTimerRef.current = setTimeout(() => {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (_) {}
              }
              setIsListening(false);
              if (latestTranscriptRef.current) {
                handleSendMessage(latestTranscriptRef.current);
              }
            }, 1200);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e?.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition init error:', err);
        fallbackVoicePrompt();
      }
    } else {
      fallbackVoicePrompt();
    }
  };

  const fallbackVoicePrompt = () => {
    setIsListening(true);
    const sampleSpoken =
      currentLanguage === 'hi'
        ? 'माहवारी 35 दिनों से अधिक लेट क्यों होती है?'
        : 'Why does PCOS cause cycles delayed beyond 35 days?';
    setLiveTranscript(sampleSpoken);
    setTimeout(() => {
      setIsListening(false);
      handleSendMessage(sampleSpoken);
    }, 400);
  };

  const stopVoiceInput = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    const textToSend = latestTranscriptRef.current || liveTranscript;
    if (textToSend.trim()) {
      handleSendMessage(textToSend.trim());
    }
  };

  const handleActionClick = (action: string) => {
    if (action === '3d') {
      onOpen3DModal();
    } else if (action === 'screening') {
      onNavigateTab('screening');
      onClose();
    } else if (action === 'doctors') {
      onNavigateTab('doctors');
      onClose();
    } else if (action === 'knowledge') {
      onNavigateTab('knowledge');
      onClose();
    } else if (action === 'community' || action === 'asha') {
      onNavigateTab('community');
      onClose();
    } else if (action === 'tracker' || action === 'progress_tracker') {
      onNavigateTab('progress_tracker');
      onClose();
    } else if (action === 'exercise_portal') {
      onNavigateTab('exercise_portal');
      onClose();
    } else if (action === 'home_remedies') {
      onNavigateTab('home_remedies');
      onClose();
    } else if (action === 'store') {
      onNavigateTab('store');
      onClose();
    }
  };

  const handleClearHistory = () => {
    stopSpeaking();
    setCurrentlySpeakingId(null);
    setMessages([
      {
        id: 'msg_welcome_reset',
        sender: 'saathi',
        text:
          currentLanguage === 'hi'
            ? 'बातचीत रीसेट हो गई है। आप पीसीओएस, माहवारी स्वास्थ्य, आहार, 3D मॉडल या डॉक्टर परामर्श के बारे में नया प्रश्न पूछ सकती हैं।'
            : 'Conversation cleared. You can ask a fresh question about PCOS root causes, nutrition, 3D anatomy, or doctor consultations.',
        keyTakeaways: [
          currentLanguage === 'hi'
            ? 'किसी भी विषय को नीचे दिए गए टैब से चुनें।'
            : 'Select any category below to explore specific PCOS topics.',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] max-h-[780px] shadow-2xl border border-rose-200 flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-pink-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Voice Saathi AI</h3>
                <span className="bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/30">
                  Instant Voice Doctor
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <Globe className="w-3 h-3 text-amber-300" />
                  <span>Google Grounded</span>
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">
                Talk directly about delayed periods, cramps, acne, and health problems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Voice Speak Toggle */}
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                const nextState = !autoVoiceEnabled;
                setAutoVoiceEnabled(nextState);
                if (!nextState) {
                  stopSpeaking();
                  setCurrentlySpeakingId(null);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                autoVoiceEnabled
                  ? 'bg-white text-rose-900 shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Toggle automatic spoken replies"
            >
              {autoVoiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-rose-700 animate-pulse" />
                  <span className="hidden sm:inline">
                    {currentLanguage === 'hi' ? 'बोलकर जवाब (चालू)' : 'Voice Talking (ON)'}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {currentLanguage === 'hi' ? 'म्यूट' : 'Muted'}
                  </span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl border border-white/30 cursor-pointer focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900 font-medium">
                  {l.nativeLabel}
                </option>
              ))}
            </select>

            <button
              type="button"
              id="btn-close-voice-modal"
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-xl text-white hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Symptoms Quick Bar */}
        <div className="bg-rose-50 border-b border-rose-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-extrabold text-rose-900 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-600" />
            {currentLanguage === 'hi' ? 'लक्षण चुनें:' : 'Tap Problem to Ask:'}
          </span>
          {COMMON_REAL_SYMPTOMS.map((sym) => (
            <button
              key={sym.id}
              type="button"
              onClick={() => handleSendMessage(sym.prompt)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-100 text-slate-800 hover:text-rose-900 text-xs font-bold whitespace-nowrap border border-rose-200 shadow-2xs transition shrink-0"
            >
              {currentLanguage === 'hi' ? sym.hi : sym.label}
            </button>
          ))}
        </div>

        {/* Category Navigation Bar for Deep PCOS Topics */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {(
            [
              { key: 'symptoms', label: categoryPCOSQuestions.symptoms.label, icon: Activity },
              { key: 'myths', label: categoryPCOSQuestions.myths.label, icon: HelpCircle },
              { key: 'nutrition', label: categoryPCOSQuestions.nutrition.label, icon: Sparkles },
              { key: 'exercise', label: categoryPCOSQuestions.exercise.label, icon: Dumbbell },
              { key: 'remedies', label: categoryPCOSQuestions.remedies.label, icon: Leaf },
              { key: 'tracker', label: categoryPCOSQuestions.tracker.label, icon: TrendingUp },
              { key: 'tests', label: categoryPCOSQuestions.tests.label, icon: Layers },
              { key: 'doctor', label: categoryPCOSQuestions.doctor.label, icon: Stethoscope },
            ] as const
          ).map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'btn-rose-primary text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Visualizer & Waveform Animation Bar */}
        {(isListening || liveTranscript || currentlySpeakingId || isLoadingAi) && (
          <div className="bg-rose-50 border-b border-rose-200 py-2.5 px-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-rose-900 animate-in fade-in">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-0.5 h-4 shrink-0">
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_200ms] h-4" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_300ms] h-2" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
                <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_150ms] h-3" />
              </div>
              <div className="flex-1 min-w-0">
                {liveTranscript ? (
                  <p className="text-xs font-medium text-slate-900 truncate">
                    <span className="text-rose-700 font-bold mr-1">
                      {currentLanguage === 'hi' ? 'सुना जा रहा है:' : 'Hearing:'}
                    </span>
                    &ldquo;{liveTranscript}&rdquo;
                  </p>
                ) : (
                  <span className="text-xs font-bold text-rose-900">
                    {isListening
                      ? currentLanguage === 'hi'
                        ? 'आपकी आवाज़ सुनी जा रही है (बोलना बंद करते ही तुरंत उत्तर मिलेगा)...'
                        : 'Listening to your voice (auto-replies with instant answer)...'
                      : isLoadingAi
                      ? currentLanguage === 'hi'
                        ? '⚡ वॉयस साथी तुरंत उत्तर तैयार कर रही है...'
                        : '⚡ Voice Saathi is synthesizing medical response...'
                      : currentLanguage === 'hi'
                      ? 'उत्तर बोला जा रहा है...'
                      : 'Speaking answer aloud...'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isListening && (
                <button
                  type="button"
                  onClick={stopVoiceInput}
                  className="btn-rose-primary text-white flex items-center gap-1.5 font-bold text-xs px-3 py-1 rounded-xl shadow-xs transition"
                >
                  <Zap className="w-3 h-3" />
                  <span>{currentLanguage === 'hi' ? 'उत्तर पाएं' : 'Send Voice Note'}</span>
                </button>
              )}

              {currentlySpeakingId && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setCurrentlySpeakingId(null);
                  }}
                  className="text-slate-700 hover:text-rose-700 flex items-center gap-1 font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs"
                >
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  <span>Stop Speaking</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          {(messages || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'saathi' && (
                <div className="w-8 h-8 rounded-xl btn-rose-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'btn-rose-primary text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                }`}
              >
                {/* Main text message */}
                <div className="space-y-2">
                  <p className="whitespace-pre-line text-slate-900 font-medium leading-relaxed">{msg.text}</p>
                  
                  {msg.sender === 'saathi' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSpeakMessage(msg)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                          currentlySpeakingId === msg.id
                            ? 'btn-rose-primary text-white shadow-md'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                        }`}
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>{currentLanguage === 'hi' ? 'आवाज़ रोकें' : 'Stop Speaking'}</span>
                            <span className="flex gap-0.5 ml-1">
                              <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.5s_infinite_100ms]" />
                              <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.5s_infinite_200ms]" />
                              <span className="w-1 h-3 bg-white rounded-full animate-[bounce_0.5s_infinite_300ms]" />
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                            <span>{currentLanguage === 'hi' ? '🔊 बोलकर सुनो (Listen)' : '🔊 Listen Aloud'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Key Takeaways Card if present */}
                {msg.sender === 'saathi' &&
                  msg.keyTakeaways &&
                  msg.keyTakeaways.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1.5 text-xs text-slate-800">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        <span>
                          {currentLanguage === 'hi' ? 'मुख्य बिंदु (Key Facts)' : 'Key Takeaways'}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {(msg.keyTakeaways || []).map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5 text-slate-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Action Button Trigger if present */}
                {msg.sender === 'saathi' && msg.actionIntent && msg.actionIntent !== 'none' && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.actionIntent!)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl btn-rose-primary text-white font-bold text-xs shadow-xs transition hover:scale-101"
                    >
                      <span className="flex items-center gap-1.5">
                        {msg.actionIntent === '3d' && <Layers className="w-4 h-4 text-amber-300" />}
                        {msg.actionIntent === 'screening' && (
                          <Activity className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'doctors' && (
                          <Stethoscope className="w-4 h-4 text-amber-300" />
                        )}
                        {(msg.actionIntent === 'tracker' || msg.actionIntent === 'progress_tracker') && (
                          <TrendingUp className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'exercise_portal' && (
                          <Dumbbell className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'home_remedies' && (
                          <Leaf className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'store' && (
                          <ShoppingBag className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'community' && (
                          <Users className="w-4 h-4 text-amber-300" />
                        )}
                        {msg.actionIntent === 'knowledge' && (
                          <BookOpen className="w-4 h-4 text-amber-300" />
                        )}
                        <span>
                          {msg.actionLabel ||
                            (msg.actionIntent === '3d'
                              ? 'Launch 3D Ovarian Model'
                              : msg.actionIntent === 'screening'
                              ? 'Take 3-Min Risk Assessment'
                              : msg.actionIntent === 'doctors'
                              ? 'Consult Gynecologist (₹199)'
                              : msg.actionIntent === 'exercise_portal'
                              ? 'Open Exercise & Yoga Portal'
                              : msg.actionIntent === 'home_remedies'
                              ? 'Open Home Remedies Portal'
                              : msg.actionIntent === 'progress_tracker' || msg.actionIntent === 'tracker'
                              ? 'Open PCOS Progress Tracker'
                              : 'Explore Platform Feature')}
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Google Grounding Verified Citations */}
                {msg.sender === 'saathi' && msg.sources && msg.sources.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 space-y-1.5 text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[10px] uppercase tracking-wider">
                      <Globe className="w-3 h-3 text-emerald-600" />
                      <span>{currentLanguage === 'hi' ? 'गूगल मेडिकल साक्ष्य व संदर्भ:' : 'Grounded Google Medical Evidence:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-lg text-xs font-semibold transition"
                        >
                          <span>{src.title || 'Medical Reference'}</span>
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Smart Follow-up Questions */}
                {msg.sender === 'saathi' &&
                  msg.followUpQuestions &&
                  msg.followUpQuestions.length > 0 && (
                    <div className="pt-1 space-y-1.5 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {currentLanguage === 'hi'
                          ? 'आगे क्या पूछना चाहती हैं?'
                          : 'Suggested Follow-Up Questions:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(msg.followUpQuestions || []).map((q, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="text-left px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-800 text-xs font-semibold border border-slate-200 transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-100">
                  {msg.sender === 'saathi' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                      <Zap className="w-2.5 h-2.5 text-emerald-600" />
                      {msg.responseTimeMs
                        ? `${(msg.responseTimeMs / 1000).toFixed(1)}s instant reply`
                        : 'Instant Voice Response'}
                    </span>
                  )}
                  <span
                    className={`text-[10px] ml-auto ${
                      msg.sender === 'user' ? 'text-rose-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoadingAi && (
            <div className="flex gap-2.5 items-center">
              <div className="w-8 h-8 rounded-xl btn-rose-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-700 rounded-tl-none flex items-center gap-2 shadow-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>
                  {currentLanguage === 'hi'
                    ? 'स्त्रीश्योर एआई जानकारी का विश्लेषण कर रही है...'
                    : 'Voice Saathi is synthesizing medical evidence...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Dynamic Category Suggested Prompts Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
              {currentCategoryData.label}:
            </span>
            {(categoryPrompts || []).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold whitespace-nowrap border border-rose-200 transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input & Voice Trigger Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Big Microphone Push-to-Talk / Toggle */}
          <button
            type="button"
            id="btn-voice-mic-modal"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`p-3.5 rounded-2xl transition shadow-md flex items-center justify-center shrink-0 ${
              isListening
                ? 'btn-rose-primary text-white animate-pulse shadow-rose-300 ring-4 ring-rose-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
            title="Tap to speak in your language"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              currentLanguage === 'hi'
                ? 'माहवारी में देरी, दर्द, मुँहासे या डाइट के बारे में पूछें (यहाँ लिखें या माइक दबाएं)...'
                : 'Ask about period delay, cramps, acne, inositol, or diet (type or tap mic)...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-rose-300 focus:border-rose-500 focus:outline-none shadow-inner"
          />

          <button
            type="button"
            id="btn-send-voice-message"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3.5 rounded-2xl btn-rose-primary text-white disabled:opacity-40 disabled:pointer-events-none transition shadow-md hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
