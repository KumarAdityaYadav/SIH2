import React from 'react';
import {
  Activity,
  Calendar,
  Mic,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Heart,
  TrendingUp,
  Dumbbell,
  Leaf,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { LanguageCode, ScreeningResult, User } from '../types';
import { getTranslation } from '../services/translations';

interface UserDashboardViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  latestScreeningResult: ScreeningResult | null;
  onStartScreening: () => void;
  onOpenVoiceSaathi: () => void;
  onOpenCycleTracker: () => void;
  onOpenHealthJourney: () => void;
  onOpenEducation: () => void;
  onOpenDoctors: () => void;
  onOpenProgressTracker: () => void;
  onOpenExercisePortal: () => void;
  onOpenWellnessGuidance: () => void;
  onOpen3DModal: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  currentLanguage,
  latestScreeningResult,
  onStartScreening,
  onOpenVoiceSaathi,
  onOpenCycleTracker,
  onOpenHealthJourney,
  onOpenEducation,
  onOpenDoctors,
  onOpenProgressTracker,
  onOpenExercisePortal,
  onOpenWellnessGuidance,
  onOpen3DModal,
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);
  const userName = currentUser?.name || 'Sunita';

  // Determine screening status
  const getScreeningStatus = () => {
    if (!latestScreeningResult) {
      return {
        status: 'In progress',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        title: 'Screening In Progress',
        desc: 'Complete your 3-minute confidential questionnaire to receive explainable health insights.',
        actionLabel: 'Continue Screening',
      };
    }
    if (latestScreeningResult.level === 'RED') {
      return {
        status: 'Follow-up recommended',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        title: 'Higher Screening Concern',
        desc: 'Multiple contributing factors were noted. We recommend discussing these with a doctor.',
        actionLabel: 'Review Summary & Referrals',
      };
    }
    if (latestScreeningResult.level === 'ORANGE') {
      return {
        status: 'Follow-up recommended',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        title: 'Moderate Screening Concern',
        desc: 'Some cycle variations were reported. Proactive clinical review is suggested.',
        actionLabel: 'View Screening Summary',
      };
    }
    return {
      status: 'Completed',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      title: 'Lower Screening Concern',
      desc: 'Your reported metrics align with typical variations. Keep tracking your cycle.',
      actionLabel: 'Retake Screening',
    };
  };

  const screeningStatus = getScreeningStatus();

  return (
    <div className="w-full min-h-screen bg-[#0D0914] blossom-mesh-bg text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="glass-blossom-glow p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Personalized Health Space</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good to see you, {userName}
            </h1>
            <p className="text-sm sm:text-base text-rose-200/80 max-w-xl">
              Let's keep your health journey simple. Track, screen, understand, and connect anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              type="button"
              id="btn-user-dash-start-screening"
              onClick={onStartScreening}
              className="flex items-center gap-2 px-6 py-3 rounded-full btn-rose-primary text-white font-bold text-sm shadow-lg shadow-rose-900/40 hover:scale-[1.02] active:scale-95 transition"
            >
              <Activity className="w-4 h-4" />
              <span>Start / Continue Screening</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-user-dash-voice-saathi"
              onClick={onOpenVoiceSaathi}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1e1329] hover:bg-[#2a1a3a] text-rose-200 border border-rose-500/30 font-bold text-sm transition"
            >
              <Mic className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Voice Saathi</span>
            </button>
          </div>
        </div>

        {/* 6 Core Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card A: Screening Status */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Activity className="w-5 h-5" />
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${screeningStatus.badgeColor}`}>
                  {screeningStatus.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {screeningStatus.title}
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed mb-4">
                {screeningStatus.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={onStartScreening}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition"
            >
              <span>{screeningStatus.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card B: Cycle Tracking Overview */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  <Calendar className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-rose-300/80">
                  Day 18 of Cycle
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Menstrual Cycle Overview
              </h3>
              <div className="space-y-1.5 my-3 text-xs">
                <div className="flex justify-between text-rose-200/80">
                  <span>Current Cycle:</span>
                  <span className="font-semibold text-white">38 Days (Luteal Phase)</span>
                </div>
                <div className="flex justify-between text-rose-200/80">
                  <span>Previous Cycle:</span>
                  <span className="font-semibold text-white">42 Days</span>
                </div>
                <div className="flex justify-between text-rose-200/80">
                  <span>Pattern Overview:</span>
                  <span className="font-semibold text-amber-300">Moderate Variation</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCycleTracker}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/30 text-xs font-bold transition"
            >
              <span>Open Cycle Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card C: Health Journey Timeline */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                  Step 2 of 4
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Your Health Journey
              </h3>
              {/* Visual 4-Step Timeline */}
              <div className="my-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="text-emerald-200 font-medium">1. Screening</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-rose-500/40 border border-rose-400 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">2</span>
                  <span className="text-white font-bold">2. Understanding Factors</span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-60">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">3</span>
                  <span className="text-slate-400">3. Guided Referral</span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-60">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">4</span>
                  <span className="text-slate-400">4. Clinical Follow-up</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenHealthJourney}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 text-xs font-bold transition"
            >
              <span>View Full Journey Pathway</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card D: Voice Saathi Feature Card */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1b1028] to-[#251336] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Mic className="w-5 h-5 text-pink-400" />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  6 Languages
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Prefer to Speak?
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                Talk naturally in Hindi, Bengali, Marathi, Tamil, Telugu or English. Voice Saathi will help answer your questions and guide your screening.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenVoiceSaathi}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-berry-primary text-white text-xs font-bold transition shadow-sm"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Voice Saathi</span>
            </button>
          </div>

          {/* Card E: Learn About PCOS & 3D Anatomy */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Layers className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-rose-300/80">
                  Interactive 3D
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Learn About PCOS
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed mb-4">
                Explore Rotterdam criteria, follicle maturation, androgen balance, and myths vs facts with our interactive 3D pelvic model.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onOpenEducation}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge Hub</span>
              </button>
              <button
                type="button"
                onClick={onOpen3DModal}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/30 text-xs font-bold transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Anatomy</span>
              </button>
            </div>
          </div>

          {/* Card F: Referral & Clinical Next Step */}
          <div className="glass-blossom-card p-6 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                  ₹199 Teleconsult
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Your Next Recommended Step
              </h3>
              <p className="text-xs text-teal-200/70 leading-relaxed mb-4">
                Connect with certified gynecologists or request an ASHA worker visit to coordinate formal ultrasound & hormone evaluations.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenDoctors}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 text-xs font-bold transition"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Find Healthcare Professional</span>
            </button>
          </div>
        </div>

        {/* Secondary Supportive Tools Strip */}
        <div className="glass-blossom-card p-6 rounded-2xl border border-rose-500/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300/70 mb-4">
            Supportive Lifestyle & Wellness Tools
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={onOpenProgressTracker}
              className="p-4 rounded-xl bg-[#170e22] hover:bg-[#221332] border border-rose-500/20 hover:border-rose-500/40 text-left transition flex items-center gap-3"
            >
              <span className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-white">Daily Biometric Tracker</div>
                <div className="text-[10px] text-rose-200/60">Log water, sleep, stress & activity</div>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenExercisePortal}
              className="p-4 rounded-xl bg-[#170e22] hover:bg-[#221332] border border-rose-500/20 hover:border-rose-500/40 text-left transition flex items-center gap-3"
            >
              <span className="p-2 rounded-lg bg-pink-500/20 text-pink-300">
                <Dumbbell className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-white">Low-Cortisol Workouts</div>
                <div className="text-[10px] text-rose-200/60">Resistance routines & pelvic yoga</div>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenWellnessGuidance}
              className="p-4 rounded-xl bg-[#170e22] hover:bg-[#221332] border border-rose-500/20 hover:border-rose-500/40 text-left transition flex items-center gap-3"
            >
              <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Leaf className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-bold text-white">Lifestyle & Wellness Guidance</div>
                <div className="text-[10px] text-rose-200/60">Nutrition, sleep & herbal education</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
