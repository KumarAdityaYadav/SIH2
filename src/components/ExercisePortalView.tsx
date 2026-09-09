import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Info,
  Layers,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
  Check,
  Video,
  X,
} from 'lucide-react';
import {
  CyclePhase,
  ExerciseCategory,
  ExerciseRoutine,
  LanguageCode,
  User,
} from '../types';
import { SEED_EXERCISE_ROUTINES } from '../data/wellnessData';

interface ExercisePortalViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpenProgressTracker: () => void;
  onOpenHomeRemedies: () => void;
}

export const ExercisePortalView: React.FC<ExercisePortalViewProps> = ({
  currentUser,
  currentLanguage,
  onOpenProgressTracker,
  onOpenHomeRemedies,
}) => {
  const [routines, setRoutines] = useState<ExerciseRoutine[]>(SEED_EXERCISE_ROUTINES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Guided Player State
  const [activeRoutine, setActiveRoutine] = useState<ExerciseRoutine | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedRoutineToast, setCompletedRoutineToast] = useState(false);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto advance to next step if available
      if (activeRoutine && currentStepIndex < activeRoutine.steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setTimerSecondsLeft(activeRoutine.steps[currentStepIndex + 1].durationSeconds);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, activeRoutine, currentStepIndex]);

  const handleStartWorkout = (routine: ExerciseRoutine) => {
    setActiveRoutine(routine);
    setCurrentStepIndex(0);
    setTimerSecondsLeft(routine.steps[0]?.durationSeconds || 180);
    setIsTimerRunning(true);
  };

  const handleFinishWorkout = () => {
    setIsTimerRunning(false);
    setActiveRoutine(null);
    setCompletedRoutineToast(true);
    setTimeout(() => setCompletedRoutineToast(false), 4000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Filter routines
  const filteredRoutines = routines.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const matchesPhase =
      selectedPhase === 'all' || r.cyclePhase === selectedPhase || r.cyclePhase === 'all';
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pcosBenefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPhase && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast notification */}
      {completedRoutineToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in slide-in-from-top-4">
          <Trophy className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <p className="font-black text-sm">Workout Completed! +25 Mins Logged</p>
            <p className="text-xs text-emerald-100">
              GLUT4 metabolic activation logged in your Daily Progress Tracker.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-800 via-pink-700 to-rose-900 border border-rose-600 p-6 sm:p-8 shadow-xl text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-rose-100 border border-white/30 text-xs font-bold uppercase tracking-wider">
              <Dumbbell className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {currentLanguage === 'hi'
                  ? 'हार्मोनल व इंसुलिन-फ्रेंडली व्यायाम'
                  : 'Cortisol-Safe & GLUT4 Movement'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentLanguage === 'hi'
                ? 'पीसीओएस एक्सरसाइज व योग वीडियो पोर्टल'
                : 'PCOS Video-Guided Exercise & Yoga Portal'}
            </h1>
            <p className="text-sm text-rose-100 leading-relaxed font-normal">
              {currentLanguage === 'hi'
                ? 'अंडाशय में रक्त संचार बढ़ाने वाले योगासन, इंसुलिन संवेदनशीलता बढ़ाने वाले लो-इम्पैक्ट स्ट्रेंथ वर्कआउट और चक्र-संरेखित रूटीन।'
                : 'Evidence-based video flows engineered for PCOS: pelvic circulation yoga, skeletal muscle GLUT4 glucose uptake, and cycle-synced restorative movement.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenProgressTracker}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 text-sm font-bold shadow-md transition transform active:scale-95"
            >
              <Activity className="w-4 h-4 text-rose-700" />
              <span>{currentLanguage === 'hi' ? 'प्रोग्रेस ट्रैकर में जाएं' : 'View Progress Tracker'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenHomeRemedies}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/30 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{currentLanguage === 'hi' ? 'घरेलू उपचार' : 'Herbal Remedies'}</span>
            </button>
          </div>
        </div>

        {/* Informational Guidelines Badges */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-amber-300 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">GLUT4 Insulin Sensitization</p>
              <p className="text-xs text-rose-100/90 font-normal">Resistance movements clear glucose directly into muscles without spike.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-pink-200 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Cortisol-Safe Zone</p>
              <p className="text-xs text-rose-100/90 font-normal">No inflammatory burnout: workouts designed below anaerobic stress threshold.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-emerald-300 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Cycle-Synced Rhythm</p>
              <p className="text-xs text-rose-100/90 font-normal">Match exercise intensity to your follicular, ovulatory, and luteal phases.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-rose-200 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'hi'
                  ? 'व्यायाम, योग या लाभ खोजें (जैसे तितली आसन, स्ट्रेंथ, पेल्विक)...'
                  : 'Search workouts, asanas, or benefits (e.g. Pelvic Flow, GLUT4, Squats)...'
              }
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
            />
          </div>

          {/* Cycle Phase Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 whitespace-nowrap font-bold">Cycle Phase:</span>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="all">All Cycle Phases</option>
              <option value="follicular">Follicular Phase (Days 6–13)</option>
              <option value="ovulatory">Ovulatory Phase (Days 14–17)</option>
              <option value="luteal">Luteal Phase (Days 18–28)</option>
              <option value="menstrual">Menstrual Phase (Days 1–5)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Routines' },
            { id: 'yoga', label: 'PCOS Yoga & Asanas' },
            { id: 'strength', label: 'Low-Impact Strength & GLUT4' },
            { id: 'liss_cardio', label: 'Zone-2 Steady Cardio' },
            { id: 'pelvic_core', label: 'Pelvic Floor & Core' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'btn-rose-primary text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="group bg-white rounded-3xl overflow-hidden border border-rose-200 hover:border-rose-400 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={routine.thumbnailUrl}
                  alt={routine.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold shadow-md uppercase">
                    {routine.category.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900/90 text-rose-200 text-[11px] font-bold border border-rose-400/40">
                    Phase: {routine.cyclePhase}
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/90 text-amber-300 text-[11px] font-black border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{routine.durationMinutes} Mins</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white leading-snug drop-shadow-md">
                    {currentLanguage === 'hi' ? routine.titleHi : routine.title}
                  </h3>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-6 space-y-4">
                {/* Hormonal impact badge */}
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold">
                    {currentLanguage === 'hi' ? routine.hormonalImpactHi : routine.hormonalImpact}
                  </span>
                </div>

                {/* Benefits list */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                    PCOS Clinical Benefits:
                  </p>
                  <ul className="space-y-1">
                    {(currentLanguage === 'hi' ? routine.pcosBenefitsHi : routine.pcosBenefits).map(
                      (benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Equipment & Instructor */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                  <span>Instructor: <strong className="text-slate-900">{routine.instructorName}</strong></span>
                  <span>Calories: <strong className="text-amber-700 font-bold">~{routine.caloriesBurnEstimate} kcal</strong></span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => handleStartWorkout(routine)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl btn-rose-primary text-white text-xs sm:text-sm font-bold shadow-md hover:scale-101 transition transform active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Video-Guided Routine ({routine.steps.length} Steps)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: INTERACTIVE GUIDED WORKOUT PLAYER / VIDEO DEMONSTRATION */}
      {activeRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-rose-200 shadow-2xl space-y-6 my-auto text-slate-900 max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRoutine(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {currentLanguage === 'hi' ? activeRoutine.titleHi : activeRoutine.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Step {currentStepIndex + 1} of {activeRoutine.steps.length} · {activeRoutine.difficulty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRoutine(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Step Details */}
            {activeRoutine.steps[currentStepIndex] && (
              <div className="space-y-6">
                {/* Step Name & Timer Card */}
                <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 rounded-3xl p-6 sm:p-8 border border-rose-200 text-center space-y-4 shadow-sm">
                  <span className="px-3.5 py-1 rounded-full bg-rose-200 text-rose-900 border border-rose-300 text-xs font-black uppercase tracking-wider">
                    Current Movement / Asana
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentLanguage === 'hi'
                      ? activeRoutine.steps[currentStepIndex].nameHi
                      : activeRoutine.steps[currentStepIndex].name}
                  </h2>

                  {/* Big Timer Display */}
                  <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-white border-2 border-rose-300 shadow-md">
                    <span className="text-5xl sm:text-6xl font-mono font-black text-rose-700 tracking-tight">
                      {formatSeconds(timerSecondsLeft)}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 uppercase font-bold">Remaining Movement Timer</span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl btn-rose-primary text-white text-sm font-bold shadow-md transition"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{isTimerRunning ? 'Pause Timer' : 'Resume Timer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSecondsLeft(activeRoutine.steps[currentStepIndex].durationSeconds);
                      }}
                      className="p-3 rounded-2xl bg-white hover:bg-rose-50 text-slate-700 border border-slate-300 transition shadow-2xs"
                      title="Reset Step Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instructions & Form Cue */}
                <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
                      Execution & Breathing Instructions:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {currentLanguage === 'hi'
                        ? activeRoutine.steps[currentStepIndex].instructionsHi
                        : activeRoutine.steps[currentStepIndex].instructions}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 font-bold">Biomechanical Focus Cue: </strong>
                      <span className="font-medium">{activeRoutine.steps[currentStepIndex].focusCue}</span>
                    </div>
                  </div>
                </div>

                {/* Step Navigator Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={currentStepIndex === 0}
                    onClick={() => {
                      const prevIdx = currentStepIndex - 1;
                      setCurrentStepIndex(prevIdx);
                      setTimerSecondsLeft(activeRoutine.steps[prevIdx].durationSeconds);
                      setIsTimerRunning(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold transition border border-slate-200"
                  >
                    Previous Step
                  </button>

                  {currentStepIndex < activeRoutine.steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = currentStepIndex + 1;
                        setCurrentStepIndex(nextIdx);
                        setTimerSecondsLeft(activeRoutine.steps[nextIdx].durationSeconds);
                        setIsTimerRunning(true);
                      }}
                      className="px-5 py-2.5 rounded-xl btn-rose-primary text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Next Movement</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishWorkout}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish & Log Routine</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
