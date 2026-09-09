import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Heart,
  Moon,
  Plus,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  Dumbbell,
  Coffee,
  AlertCircle,
  FileText,
  Printer,
  Layers,
  Award,
  Check,
} from 'lucide-react';
import {
  DailyWellnessLog,
  LanguageCode,
  ProgressMilestone,
  SymptomTrendRecord,
  User,
} from '../types';
import {
  SEED_DAILY_LOGS,
  SEED_PROGRESS_MILESTONES,
  SEED_SYMPTOM_TRENDS,
} from '../data/wellnessData';

interface ProgressTrackerViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpenExercisePortal: () => void;
  onOpenHomeRemedies: () => void;
  onOpen3DModal: () => void;
  onBookDoctor: () => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  currentUser,
  currentLanguage,
  onOpenExercisePortal,
  onOpenHomeRemedies,
  onOpen3DModal,
  onBookDoctor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'daily_log' | 'milestones' | 'trends' | 'report'>('overview');
  const [dailyLogs, setDailyLogs] = useState<DailyWellnessLog[]>(SEED_DAILY_LOGS);
  const [milestones, setMilestones] = useState<ProgressMilestone[]>(SEED_PROGRESS_MILESTONES);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Form State for Today's Log
  const todayStr = new Date().toISOString().split('T')[0];
  const [logDate, setLogDate] = useState(todayStr);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [stepsCount, setStepsCount] = useState(7500);
  const [exerciseMinutes, setExerciseMinutes] = useState(25);
  const [exerciseCompleted, setExerciseCompleted] = useState(true);
  const [exerciseType, setExerciseType] = useState('PCOS Yoga Flow & Pelvic Stretching');
  const [crampsSeverity, setCrampsSeverity] = useState(1);
  const [acneSeverity, setAcneSeverity] = useState(2);
  const [bloatingSeverity, setBloatingSeverity] = useState(1);
  const [moodLevel, setMoodLevel] = useState<'peaceful' | 'energetic' | 'neutral' | 'fatigued' | 'anxious' | 'irritable'>('energetic');
  const [stressLevel, setStressLevel] = useState(2);
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>(['Myo-Inositol (40:1)', 'Vitamin D3']);
  const [selectedRemedies, setSelectedRemedies] = useState<string[]>(['Spearmint Infusion', 'Methi Dana Water']);
  const [dietAdherence, setDietAdherence] = useState<'strict_low_gi' | 'balanced' | 'high_sugar_cheat'>('strict_low_gi');
  const [logNotes, setLogNotes] = useState('');

  const supplementOptions = [
    'Myo-Inositol (40:1)',
    'Vitamin D3',
    'Omega-3 Fish / Flax Oil',
    'Magnesium Glycinate',
    'Zinc & Selenium',
    'N-Acetyl Cysteine (NAC)',
  ];

  const remedyOptions = [
    'Spearmint Infusion',
    'Methi Dana Water',
    'Ceylon Cinnamon Decoction',
    'Seed Cycling (Flax/Pumpkin)',
    'Ginger-Tulsi Kadha',
    'Turmeric-Ashwagandha Milk',
    'Warm Castor Oil Pack',
  ];

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyWellnessLog = {
      id: 'log_' + Date.now(),
      date: logDate,
      userId: currentUser?.id || 'usr_demo_01',
      waterGlasses,
      sleepHours,
      stepsCount,
      exerciseMinutes,
      exerciseCompleted,
      exerciseType: exerciseCompleted ? exerciseType : undefined,
      crampsSeverity,
      acneSeverity,
      bloatingSeverity,
      moodLevel,
      stressLevel,
      supplementsTaken: selectedSupplements,
      remediesUsed: selectedRemedies,
      dietAdherence,
      notes: logNotes,
    };

    setDailyLogs([newLog, ...dailyLogs.filter((l) => l.date !== logDate)]);
    setShowLogModal(false);
  };

  const toggleSupplement = (sup: string) => {
    setSelectedSupplements((prev) =>
      prev.includes(sup) ? prev.filter((s) => s !== sup) : [...prev, sup]
    );
  };

  const toggleRemedy = (rem: string) => {
    setSelectedRemedies((prev) =>
      prev.includes(rem) ? prev.filter((r) => r !== rem) : [...prev, rem]
    );
  };

  // Metrics summary calculations
  const totalLogsCount = dailyLogs.length;
  const avgSleepHours = (
    dailyLogs.reduce((sum, l) => sum + l.sleepHours, 0) / (totalLogsCount || 1)
  ).toFixed(1);
  const totalExerciseMins = dailyLogs.reduce((sum, l) => sum + l.exerciseMinutes, 0);
  const avgWater = Math.round(
    dailyLogs.reduce((sum, l) => sum + l.waterGlasses, 0) / (totalLogsCount || 1)
  );
  const currentStreakDays = 7; // Consecutive days logged
  const recoveryScore = 84; // 0-100 composite score

  const handleShareReport = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast notification */}
      {showShareToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-emerald-200" />
          <div>
            <p className="font-bold text-sm">Clinical Health Report Exported!</p>
            <p className="text-xs text-emerald-100">Ready to share via PDF or with your Gynecologist / ASHA worker.</p>
          </div>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-[#1c0d2b] to-indigo-950 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'hi' ? 'दैनिक स्वास्थ्य व रिकवरी ट्रैकर' : 'Daily Progress & Recovery Matrix'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentLanguage === 'hi' ? 'पीसीओएस रिकवरी व लक्षण डायरी' : 'PCOS Progress & Lifestyle Tracker'}
            </h1>
            <p className="text-sm text-rose-200/80 leading-relaxed">
              {currentLanguage === 'hi'
                ? 'अपने दैनिक इनोसिटोल, व्यायाम, पानी, नींद और घरेलू उपचारों को ट्रैक करें। वैज्ञानिक डेटा से अपने हार्मोन संतुलित करें।'
                : 'Monitor daily inositol adherence, GLUT4 workouts, natural herbal remedies, sleep, and symptom reduction with clinical progress telemetry.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-log-today-progress"
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-rose-900/40 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? 'आज का दिन लॉग करें' : "Log Today's Wellness"}</span>
            </button>

            <button
              type="button"
              onClick={onOpenExercisePortal}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-rose-200 text-sm font-semibold border border-rose-500/30 transition"
            >
              <Dumbbell className="w-4 h-4 text-pink-400" />
              <span>{currentLanguage === 'hi' ? 'व्यायाम पोर्टल' : 'Exercise Portal'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenHomeRemedies}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-rose-200 text-sm font-semibold border border-rose-500/30 transition"
            >
              <Coffee className="w-4 h-4 text-emerald-400" />
              <span>{currentLanguage === 'hi' ? 'घरेलू उपचार' : 'Home Remedies'}</span>
            </button>
          </div>
        </div>

        {/* Highlight Score & Streak Bar */}
        <div className="mt-8 pt-6 border-t border-rose-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-rose-500/15 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-200/60 uppercase font-semibold">Active Streak</p>
              <p className="text-xl font-black text-white">{currentStreakDays} Days</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-rose-500/15 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-200/60 uppercase font-semibold">Recovery Index</p>
              <p className="text-xl font-black text-emerald-400">{recoveryScore} / 100</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-rose-500/15 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-200/60 uppercase font-semibold">Avg Hydration</p>
              <p className="text-xl font-black text-white">{avgWater} Glasses/Day</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-rose-500/15 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-200/60 uppercase font-semibold">Avg Sleep</p>
              <p className="text-xl font-black text-white">{avgSleepHours} Hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-rose-500/20 scrollbar-none">
        {[
          { id: 'overview', label: currentLanguage === 'hi' ? 'दैनिक सारांश' : 'Progress Dashboard', icon: Activity },
          { id: 'milestones', label: currentLanguage === 'hi' ? 'लक्ष्य व बैज' : 'Milestones & Badges', icon: Award },
          { id: 'trends', label: currentLanguage === 'hi' ? 'लक्षण सुधार ट्रेंड्स' : 'Symptom Reduction Trends', icon: TrendingUp },
          { id: 'daily_log', label: currentLanguage === 'hi' ? 'लॉग इतिहास' : 'Daily Log History', icon: Calendar },
          { id: 'report', label: currentLanguage === 'hi' ? 'डॉक्टर रिपोर्ट (PDF)' : 'Clinical Care Summary', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                  : 'bg-[#180f24] text-rose-200/70 hover:bg-rose-950/40 hover:text-white border border-rose-500/15'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spearmint & Inositol Adherence Card */}
            <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">Herbal & Supplement Streak</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Active 7/7
                </span>
              </div>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                This tracker records wellness habits only. Supplements and herbal products should be discussed with a qualified healthcare professional before use.
              </p>
              <div className="space-y-2 pt-2 border-t border-rose-500/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Myo-Inositol (40:1 Ratio)</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Taken Today
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Spearmint Herbal Infusion</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 2 Cups Taken
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Soaked Methi Dana Water</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Morning Habit
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenHomeRemedies}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition"
              >
                <span>Browse All 8 Evidence Remedies</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exercise & GLUT4 Activation Card */}
            <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">Metabolic Movement</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  {totalExerciseMins} Mins Logged
                </span>
              </div>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Low-impact resistance and zone-2 walking stimulate GLUT4 glucose uptake in skeletal muscle without raising cortisol.
              </p>
              <div className="space-y-2 pt-2 border-t border-rose-500/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Today's Routine</span>
                  <span className="text-pink-300 font-semibold">PCOS Yoga & Pelvic Flow</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Intensity Level</span>
                  <span className="text-emerald-400 font-bold">Cortisol-Safe</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Weekly Target (150m)</span>
                  <span className="text-white font-bold">135 / 150 mins (90%)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenExercisePortal}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 text-pink-300 text-xs font-bold border border-pink-500/30 transition"
              >
                <span>Start Today's 20-Min Workout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menstrual Cycle Regularization Card */}
            <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">Cycle Regularity Track</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Day 4 of Cycle
                </span>
              </div>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Cycle interval has normalized from 54 days in May down to 35 days in August with reduced pain and clotting.
              </p>
              <div className="space-y-2 pt-2 border-t border-rose-500/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Previous Cycle Length</span>
                  <span className="text-emerald-400 font-bold">35 Days (-19 days)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Dysmenorrhea Cramp Score</span>
                  <span className="text-emerald-400 font-bold">1.8 / 5 (Mild)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Predicted Next Ovulation</span>
                  <span className="text-purple-300 font-semibold">Sept 04 – 07, 2026</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpen3DModal}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-xs font-bold border border-purple-500/30 transition"
              >
                <span>View 3D Ovarian Morphology</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Latest Daily Log Highlight */}
          <div className="bg-[#140c1e] rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Today's Logged Telemetry ({dailyLogs[0]?.date})</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Logged
                  </span>
                </h3>
                <p className="text-xs text-rose-200/70 mt-0.5">
                  Detailed snapshot of energy, hydration, low-GI diet, and natural remedies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLogModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Update or Log New Day</span>
              </button>
            </div>

            {dailyLogs[0] && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Water Intake</span>
                  <p className="text-base font-bold text-cyan-300">{dailyLogs[0].waterGlasses} Glasses</p>
                  <span className="text-[10px] text-slate-400">Target: 8+ cups</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Sleep Rest</span>
                  <p className="text-base font-bold text-purple-300">{dailyLogs[0].sleepHours} Hours</p>
                  <span className="text-[10px] text-slate-400">Target: 7.5 hrs</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Daily Steps</span>
                  <p className="text-base font-bold text-amber-300">{dailyLogs[0].stepsCount.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400">Target: 8,000</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Exercise Done</span>
                  <p className="text-base font-bold text-pink-300">{dailyLogs[0].exerciseMinutes} Mins</p>
                  <span className="text-[10px] text-slate-400 truncate block">{dailyLogs[0].exerciseType || 'Yoga Flow'}</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Cramps & Acne</span>
                  <p className="text-base font-bold text-emerald-300">
                    {dailyLogs[0].crampsSeverity}/5 · {dailyLogs[0].acneSeverity}/5
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">Mild / Minimal</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-3.5 border border-rose-500/10 space-y-1">
                  <span className="text-[11px] text-rose-200/60 uppercase font-semibold">Diet Adherence</span>
                  <p className="text-base font-bold text-emerald-300 capitalize">
                    {dailyLogs[0].dietAdherence.replace('_', ' ')}
                  </p>
                  <span className="text-[10px] text-slate-400">Low-Glycemic</span>
                </div>
              </div>
            )}

            {dailyLogs[0]?.notes && (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-100/90 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300 block mb-0.5">Personal Reflection Note:</span>
                  <p className="leading-relaxed">{dailyLogs[0].notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. MILESTONES & BADGES */}
      {activeSubTab === 'milestones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Milestones & Streak Badges</h2>
              <p className="text-xs text-rose-200/70">
                Celebrate your biological consistency and hormonal milestones on your PCOS journey.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              3 Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(milestones || []).map((m) => (
              <div
                key={m.id}
                className={`rounded-3xl p-6 border transition space-y-4 ${
                  m.achieved
                    ? 'bg-gradient-to-br from-[#1b1029] to-[#25103a] border-amber-500/30 shadow-xl'
                    : 'bg-[#140c1e] border-rose-500/15 opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl border ${
                        m.achieved
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-inner'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {currentLanguage === 'hi' ? m.titleHi : m.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                        {m.category} · {m.badgeTier} TIER
                      </span>
                    </div>
                  </div>

                  {m.achieved ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Earned</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                      In Progress ({m.progressPercent}%)
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-200/80 leading-relaxed">
                  {currentLanguage === 'hi' ? m.descriptionHi : m.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Consistency Goal</span>
                    <span className="text-white font-bold">{m.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.achieved
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-rose-500 to-pink-500'
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                </div>

                {m.achieved && m.achievedDate && (
                  <p className="text-[11px] text-amber-200/80 font-medium">
                    Unlocked on {m.achievedDate}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. SYMPTOM REDUCTION TRENDS */}
      {activeSubTab === 'trends' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">4-Month Clinical Recovery Trends</h2>
              <p className="text-xs text-rose-200/70">
                Observational metrics showing cycle normalization, pain score drops, and insulin improvement.
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-rose-200 text-xs font-bold border border-rose-500/30 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Trend Graphs</span>
            </button>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#140c1e] rounded-3xl p-5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200/60 uppercase font-semibold">Cycle Duration</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -19 Days
                </span>
              </div>
              <p className="text-2xl font-black text-white">35 Days</p>
              <p className="text-[11px] text-slate-400">From 54 days in May 2026</p>
            </div>

            <div className="bg-[#140c1e] rounded-3xl p-5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200/60 uppercase font-semibold">Cramps Severity</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -60% Drop
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-400">1.8 / 5</p>
              <p className="text-[11px] text-slate-400">From 4.5/5 severe dysmenorrhea</p>
            </div>

            <div className="bg-[#140c1e] rounded-3xl p-5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200/60 uppercase font-semibold">Acne / Hirsutism</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -55% Soothed
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-400">1.9 / 5</p>
              <p className="text-[11px] text-slate-400">Benefiting from Spearmint tea</p>
            </div>

            <div className="bg-[#140c1e] rounded-3xl p-5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-200/60 uppercase font-semibold">Daily Energy Index</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +110% Boost
                </span>
              </div>
              <p className="text-2xl font-black text-pink-400">4.4 / 5</p>
              <p className="text-[11px] text-slate-400">Zero afternoon sugar crashes</p>
            </div>
          </div>

          {/* Detailed Monthly Breakdown Table */}
          <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-rose-500/20 text-rose-200/60 uppercase text-[11px]">
                  <th className="py-3 px-4">Reporting Month</th>
                  <th className="py-3 px-4">Cycle Length</th>
                  <th className="py-3 px-4">Cramp Score (0-5)</th>
                  <th className="py-3 px-4">Cystic Acne (0-5)</th>
                  <th className="py-3 px-4">Energy Index (0-5)</th>
                  <th className="py-3 px-4">Insulin Resistance Marker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10 text-slate-200">
                {SEED_SYMPTOM_TRENDS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>{item.month}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-300">
                      {item.avgCycleLength} Days
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          item.crampScore < 2
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.crampScore < 3.5
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.crampScore} / 5
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          item.acneScore < 2
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.acneScore < 3.5
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.acneScore} / 5
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-pink-300">
                      {item.energyScore} / 5
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-medium">
                        {item.insulinScore <= 2.5 ? 'Normalizing GLUT4' : 'Elevated HOMA-IR'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. DAILY LOG HISTORY */}
      {activeSubTab === 'daily_log' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Wellness Log Entries</h2>
              <p className="text-xs text-rose-200/70">
                Detailed records of symptoms, water, sleep, remedies, and low-GI meals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>

          <div className="space-y-3">
            {dailyLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#140c1e] rounded-2xl p-5 border border-rose-500/15 hover:border-rose-500/30 transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-500/10">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">{log.date}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 capitalize">
                      Mood: {log.moodLevel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                      {log.dietAdherence.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span>💧 {log.waterGlasses} Cups</span>
                    <span>🌙 {log.sleepHours}h Sleep</span>
                    <span>👣 {log.stepsCount} Steps</span>
                    <span>⚡ {log.exerciseMinutes}m Workout</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-rose-200/60 font-semibold">Remedies & Supplements:</span>
                  {[...log.supplementsTaken, ...log.remediesUsed].map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-rose-500/20 text-slate-200 text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {log.notes && (
                  <p className="text-xs text-rose-200/80 italic bg-white/5 p-2.5 rounded-xl">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. CLINICAL REPORT */}
      {activeSubTab === 'report' && (
        <div className="bg-[#140c1e] rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-500/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>StreeSure Clinical Health Record</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Patient Telemetry & Lifestyle Adherence Report
              </h2>
              <p className="text-xs text-rose-200/70">
                Prepared for Gynecological Review · Patient: {currentUser?.fullName || 'Sunita Sharma'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-rose-500/30 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>

              <button
                type="button"
                onClick={onBookDoctor}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/40 transition"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Attach to Doctor Booking (₹199)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-rose-500/10 space-y-1">
              <span className="text-xs text-rose-200/60 uppercase font-semibold">Screening Category</span>
              <p className="text-base font-bold text-amber-300">Level 2 (Orange) - Moderate Risk</p>
              <p className="text-[11px] text-slate-400">Rotterdam 2023 Criteria Aligned</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-rose-500/10 space-y-1">
              <span className="text-xs text-rose-200/60 uppercase font-semibold">Cycle Regularization</span>
              <p className="text-base font-bold text-emerald-300">54d → 35d (-35% Interval)</p>
              <p className="text-[11px] text-slate-400">Tracking with clinician guidance</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-rose-500/10 space-y-1">
              <span className="text-xs text-rose-200/60 uppercase font-semibold">Herbal & Diet Adherence</span>
              <p className="text-base font-bold text-purple-300">92% Compliance (Past 30 Days)</p>
              <p className="text-[11px] text-slate-400">Wellness & nutrition habits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-200 leading-relaxed bg-white/5 p-5 rounded-2xl border border-rose-500/10">
            <h4 className="font-bold text-rose-300 uppercase text-xs tracking-wider">
              Summary Clinical Notes for Attending Physician:
            </h4>
            <p>
              1. <strong>Menstrual Phenotype:</strong> Patient-reported cycle history is shown for longitudinal tracking. Changes over time should not be attributed to a supplement or herbal product without appropriate clinical assessment.
            </p>
            <p>
              2. <strong>Metabolic & GLUT4 Activity:</strong> Consistent 4x weekly low-impact resistance workouts and 30-minute zone-2 walks logged. No symptomatic postprandial hypoglycemic reactive crashes noted.
            </p>
            <p>
              3. <strong>Hyperandrogen Signs:</strong> Cystic jawline breakouts reduced by ~55%. Mild hirsutism persists on upper lip and chin, under continuous observation.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: LOG TODAY'S WELLNESS */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#160d22] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-rose-500/30 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Log Today's PCOS Progress</h3>
                  <p className="text-xs text-rose-200/70">Record your nutrition, workout, symptoms, and natural remedies.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-5 text-xs sm:text-sm">
              {/* Date selector */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-rose-500/20 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Water & Sleep & Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Water (Glasses)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={waterGlasses}
                    onChange={(e) => setWaterGlasses(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-rose-500/20 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Sleep (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={3}
                    max={15}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-rose-500/20 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                    Steps Count
                  </label>
                  <input
                    type="number"
                    step="500"
                    min={0}
                    max={40000}
                    value={stepsCount}
                    onChange={(e) => setStepsCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-rose-500/20 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Exercise Log */}
              <div className="bg-white/5 p-4 rounded-2xl border border-rose-500/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase">Exercise / Workout</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exerciseCompleted}
                      onChange={(e) => setExerciseCompleted(e.target.checked)}
                      className="rounded-sm text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs text-rose-200">Completed Workout</span>
                  </label>
                </div>

                {exerciseCompleted && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Minutes</label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={exerciseMinutes}
                        onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-rose-500/20 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Routine Type</label>
                      <select
                        value={exerciseType}
                        onChange={(e) => setExerciseType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1d122b] border border-rose-500/20 text-white text-xs"
                      >
                        <option value="PCOS Yoga Flow & Pelvic Stretching">PCOS Yoga Flow & Pelvic</option>
                        <option value="Low-Impact Strength & Glute Resistance">Low-Impact Strength & GLUT4</option>
                        <option value="Zone-2 Brisk Walking">Zone-2 Brisk Walking</option>
                        <option value="Pelvic Floor & Diaphragmatic Core Flow">Pelvic Floor & Core</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Supplements Taken */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase mb-2">
                  Supplements Taken Today
                </label>
                <div className="flex flex-wrap gap-2">
                  {supplementOptions.map((sup) => (
                    <button
                      key={sup}
                      type="button"
                      onClick={() => toggleSupplement(sup)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        selectedSupplements.includes(sup)
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {selectedSupplements.includes(sup) ? '✓ ' : '+ '}
                      {sup}
                    </button>
                  ))}
                </div>
              </div>

              {/* Natural Remedies Used */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase mb-2">
                  Natural Home Remedies Consumed Today
                </label>
                <div className="flex flex-wrap gap-2">
                  {remedyOptions.map((rem) => (
                    <button
                      key={rem}
                      type="button"
                      onClick={() => toggleRemedy(rem)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        selectedRemedies.includes(rem)
                          ? 'bg-rose-600 text-white border-rose-400'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {selectedRemedies.includes(rem) ? '✓ ' : '+ '}
                      {rem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Adherence */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase mb-2">
                  Diet & Low-GI Pairing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'strict_low_gi', label: 'Strict Low-GI (Protein + Fiber)' },
                    { id: 'balanced', label: 'Balanced Meal' },
                    { id: 'high_sugar_cheat', label: 'Sugar Spike / Cheat Meal' },
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setDietAdherence(diet.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        dietAdherence === diet.id
                          ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Notes */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase mb-1">
                  Daily Notes & Observations
                </label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="How did you feel? Energy levels, cravings, cramp relief..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-rose-500/20 text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-500/20">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 hover:bg-white/15 text-xs font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-900/40 hover:from-rose-500 hover:to-pink-500 transition"
                >
                  Save & Update Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
