import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  Info,
  Layers,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  Check,
} from 'lucide-react';
import {
  HomeRemedy,
  LanguageCode,
  RemedyCategory,
  User,
} from '../types';
import { SEED_HOME_REMEDIES } from '../data/wellnessData';

interface HomeRemediesPortalViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpenProgressTracker: () => void;
  onOpenExercisePortal: () => void;
}

export const HomeRemediesPortalView: React.FC<HomeRemediesPortalViewProps> = ({
  currentUser,
  currentLanguage,
  onOpenProgressTracker,
  onOpenExercisePortal,
}) => {
  const [remedies, setRemedies] = useState<HomeRemedy[]>(SEED_HOME_REMEDIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipeRemedy, setActiveRecipeRemedy] = useState<HomeRemedy | null>(null);
  const [habitLoggedToast, setHabitLoggedToast] = useState<string | null>(null);

  const handleLogRemedy = (rem: HomeRemedy) => {
    setHabitLoggedToast(rem.name);
    setTimeout(() => setHabitLoggedToast(null), 3500);
  };

  // Filtering
  const filteredRemedies = remedies.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.botanicalOrAltName && r.botanicalOrAltName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.targetSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.targetSymptomsHi.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast notification */}
      {habitLoggedToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <p className="font-bold text-sm">Remedy Added to Today's Routine!</p>
            <p className="text-xs text-emerald-100">
              "{habitLoggedToast}" recorded in your Daily Progress Tracker.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0e241b] to-teal-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>
                {currentLanguage === 'hi'
                  ? 'जीवनशैली व प्राकृतिक पोषण मार्गदर्शन'
                  : 'Lifestyle & Wellness Guidance'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {currentLanguage === 'hi'
                ? 'पीसीओएस जीवनशैली व पोषण सहायता पोर्टल'
                : 'Lifestyle & Wellness Guidance Portal'}
            </h1>
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              {currentLanguage === 'hi'
                ? 'संतुलित पोषण, स्पीयरमिंट चाय, मेथी दाना, दालचीनी, तनाव प्रबंधन व नींद स्वच्छता — वैज्ञानिक प्रमाण और सुरक्षा सावधानियों के साथ।'
                : 'Evidence-informed lifestyle practices, botanical nutrients, sleep hygiene, and nutritional guidance to support metabolic and cycle balance.'}
            </p>
            <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-amber-200">
              ⚠️ <strong>Wellness Notice:</strong> General wellness education only — not a medical cure for PCOS. Consult a doctor for clinical treatment.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenProgressTracker}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition transform active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>{currentLanguage === 'hi' ? 'दैनिक प्रोग्रेस में जोड़ें' : 'Log to Progress Tracker'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenExercisePortal}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-emerald-200 text-sm font-semibold border border-emerald-500/30 transition"
            >
              <Zap className="w-4 h-4 text-pink-400" />
              <span>{currentLanguage === 'hi' ? 'व्यायाम पोर्टल' : 'Exercise Portal'}</span>
            </button>
          </div>
        </div>

        {/* Safety & Clinical Rigor Highlights */}
        <div className="mt-8 pt-6 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">General Wellness Education</p>
              <p className="text-[11px] text-emerald-200/70">Educational guidelines to support healthy daily habits alongside professional medical guidance.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">RCT Research Backing</p>
              <p className="text-[11px] text-teal-200/70">Grounded in published trials from Phytotherapy Research and Obstetrics Journals.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/15 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Chrononutrition Timing</p>
              <p className="text-[11px] text-amber-200/70">Optimal timing mapped to circadian hormonal peaks (empty stomach, post-meal, or bedtime).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#140c1e] rounded-3xl p-6 border border-rose-500/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'hi'
                  ? 'उपचार खोजें (जैसे पुदीना चाय, मेथी पानी, दालचीनी, क्रैम्प्स, मुंहासे)...'
                  : 'Search remedies (e.g. Spearmint Tea, Fenugreek, Cinnamon, Cramps, Acne)...'
              }
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-emerald-500/20 text-white placeholder-emerald-200/40 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-200/70 whitespace-nowrap font-medium">Target Symptom:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#131f1a] border border-emerald-500/30 text-white text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Remedies</option>
              <option value="anti_androgen">Anti-Androgen (Facial Hair & Acne)</option>
              <option value="insulin_metabolic">Insulin Sensitivity & Glucose</option>
              <option value="cramp_relief">Dysmenorrhea & Cramp Relief</option>
              <option value="hormonal_balance">Cycle Balance & Seed Cycling</option>
              <option value="sleep_stress">Sleep & Cortisol Reset</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Remedies' },
            { id: 'anti_androgen', label: 'Anti-Androgen / Hirsutism' },
            { id: 'insulin_metabolic', label: 'Insulin Sensitivity (Methi / Cinnamon)' },
            { id: 'cramp_relief', label: 'Pain & Cramp Relief (Ginger-Tulsi)' },
            { id: 'hormonal_balance', label: 'Seed Cycling & Ovulation' },
            { id: 'sleep_stress', label: 'Restorative Sleep & Adrenals' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-white/5 text-emerald-200/70 hover:bg-white/10 hover:text-white border border-emerald-500/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Remedy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRemedies.map((remedy) => (
          <div
            key={remedy.id}
            className="group bg-[#140c1e] rounded-3xl p-6 sm:p-7 border border-emerald-500/20 hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Top Header & Rating */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">
                      {currentLanguage === 'hi' ? remedy.nameHi : remedy.name}
                    </h3>
                    {remedy.botanicalOrAltName && (
                      <span className="text-[11px] text-emerald-300/80 italic">
                        {remedy.botanicalOrAltName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold shrink-0">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{remedy.rating}</span>
                  <span className="text-[10px] text-amber-200/60">({remedy.reviewCount})</span>
                </div>
              </div>

              {/* Target Symptoms Chips */}
              <div className="flex flex-wrap gap-1.5">
                {(currentLanguage === 'hi' ? remedy.targetSymptomsHi : remedy.targetSymptoms).map(
                  (sym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-white/5 border border-emerald-500/20 text-emerald-200 text-[11px] font-medium"
                    >
                      {sym}
                    </span>
                  )
                )}
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentLanguage === 'hi' ? remedy.summaryHi : remedy.summary}
              </p>

              {/* Mechanism of Action highlight */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-100/90 space-y-1">
                <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider">
                  Mechanism of Action:
                </span>
                <p className="leading-relaxed">
                  {currentLanguage === 'hi' ? remedy.mechanismOfActionHi : remedy.mechanismOfAction}
                </p>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Best Time:</strong>{' '}
                  {currentLanguage === 'hi' ? remedy.bestTimeToConsumeHi : remedy.bestTimeToConsume}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-rose-500/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleLogRemedy(remedy)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Consumed Today</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRecipeRemedy(remedy)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-200 text-xs font-bold border border-emerald-500/30 transition"
              >
                <span>View Recipe & Dosage ({remedy.preparationTimeMinutes}m)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RECIPE & CLINICAL DOSAGE MODAL */}
      {activeRecipeRemedy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
          <div className="bg-[#141f1a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 my-auto text-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {currentLanguage === 'hi' ? activeRecipeRemedy.nameHi : activeRecipeRemedy.name}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    Prep Time: {activeRecipeRemedy.preparationTimeMinutes} Minutes · Clinical Evidence Protocol
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveRecipeRemedy(null)}
                className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Required Ingredients & Exact Measurements:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeRecipeRemedy.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-emerald-500/15 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-200 font-medium">
                      {currentLanguage === 'hi' ? ing.itemHi : ing.item}
                    </span>
                    <span className="text-emerald-300 font-bold ml-2 shrink-0">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Preparation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Step-by-Step Preparation Protocol:
              </h4>
              <div className="space-y-2">
                {activeRecipeRemedy.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-2xl bg-white/5 border border-emerald-500/15 flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 text-[11px]">
                      {step.stepNumber}
                    </span>
                    <p className="text-slate-200 mt-0.5">
                      {currentLanguage === 'hi' ? step.instructionHi : step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Evidence & Safety Warning */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Medical Cautions & Contraindications:</span>
                </div>
                <p className="leading-relaxed">
                  {currentLanguage === 'hi'
                    ? activeRecipeRemedy.contraindicationsAndSafetyHi
                    : activeRecipeRemedy.contraindicationsAndSafety}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider">
                  Published Clinical Study Backing:
                </span>
                <p className="leading-relaxed text-slate-300">
                  {activeRecipeRemedy.clinicalBacking}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
              <button
                type="button"
                onClick={() => setActiveRecipeRemedy(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/15 text-xs font-bold transition"
              >
                Close Recipe
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLogRemedy(activeRecipeRemedy);
                  setActiveRecipeRemedy(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Mark Consumed & Add to Daily Tracker</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
