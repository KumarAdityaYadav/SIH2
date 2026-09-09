import React, { useState } from 'react';
import { Heart, ArrowRight, ArrowLeft, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { HealthProfile, LanguageCode, User } from '../types';

interface OnboardingWizardProps {
  user: User;
  onComplete: (profile: HealthProfile) => void;
  onSkip: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);

  // Health Profile State
  const [age, setAge] = useState(user.age || 23);
  const [heightCm, setHeightCm] = useState(158);
  const [weightKg, setWeightKg] = useState(58);
  const [location, setLocation] = useState(user.location || 'Jaipur, Rajasthan');
  
  // Menstrual History
  const [ageAtMenarche, setAgeAtMenarche] = useState(13);
  const [typicalCycleLengthDays, setTypicalCycleLengthDays] = useState(38);
  const [typicalPeriodDurationDays, setTypicalPeriodDurationDays] = useState(5);
  const [cycleRegularity, setCycleRegularity] = useState<'regular' | 'somewhat_irregular' | 'very_irregular' | 'absent_for_months'>('somewhat_irregular');
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-07-10');
  const [missedPeriodsPast6Months, setMissedPeriodsPast6Months] = useState(2);
  const [heavyBleeding, setHeavyBleeding] = useState(true);
  const [severePainCramps, setSeverePainCramps] = useState(true);

  // Medical History
  const [previousPcosEvaluation, setPreviousPcosEvaluation] = useState<'never' | 'suspected' | 'diagnosed_by_doctor' | 'unsure'>('suspected');
  const [thyroidHistory, setThyroidHistory] = useState<'none' | 'hypothyroidism' | 'hyperthyroidism' | 'unsure'>('none');
  const [diabetesMetabolic, setDiabetesMetabolic] = useState<'none' | 'prediabetes' | 'type2_diabetes' | 'gestational' | 'unsure'>('none');
  const [highBloodPressure, setHighBloodPressure] = useState(false);

  const calculateBmi = () => {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  };

  const handleFinish = () => {
    const profile: HealthProfile = {
      userId: user.id,
      age,
      heightCm,
      weightKg,
      bmi: calculateBmi(),
      location,
      preferredLanguage: user.preferredLanguage,
      ageAtMenarche,
      typicalCycleLengthDays,
      typicalPeriodDurationDays,
      cycleRegularity,
      lastPeriodDate,
      missedPeriodsPast6Months,
      majorRecentChanges: 'Cycles delayed up to 40-45 days recently.',
      heavyBleeding,
      severePainCramps,
      spottingBetweenPeriods: false,
      previousPcosEvaluation,
      thyroidHistory,
      diabetesMetabolic,
      highBloodPressure,
      surgeries: 'None',
      currentMedications: 'None',
      allergies: 'None',
      updatedAt: new Date().toISOString(),
    };

    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 my-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 relative">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Step {step} of 3</span>
            <span>"Let's understand your health"</span>
            <button type="button" onClick={onSkip} className="text-rose-600 hover:underline">
              Skip for now
            </button>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-rose-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Step 1: Baseline Metrics
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Tell us a little about your basic health
              </h3>
              <p className="text-xs text-slate-500">
                These help tailor screening ranges to your age and body metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min={12}
                  max={75}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min={100}
                  max={220}
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min={30}
                  max={180}
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
              <span className="text-slate-700">Calculated Body Mass Index (BMI):</span>
              <span className="font-bold text-rose-700 text-sm">{calculateBmi()} kg/m²</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / District</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition"
              >
                <span>Continue to Menstrual History</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Menstrual History */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Step 2: Menstrual History
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Understanding your monthly cycle patterns
              </h3>
              <p className="text-xs text-slate-500">
                Cycles can naturally vary. Answer as accurately as you remember.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age at first period (Menarche)
                </label>
                <input
                  type="number"
                  min={9}
                  max={20}
                  value={ageAtMenarche}
                  onChange={(e) => setAgeAtMenarche(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Typical cycle length (Days between periods)
                </label>
                <input
                  type="number"
                  min={18}
                  max={90}
                  value={typicalCycleLengthDays}
                  onChange={(e) => setTypicalCycleLengthDays(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                How regular are your cycles generally?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'regular', label: 'Regular (Every 21–35 days)' },
                  { key: 'somewhat_irregular', label: 'Somewhat irregular (Delayed by weeks)' },
                  { key: 'very_irregular', label: 'Very irregular (Unpredictable timing)' },
                  { key: 'absent_for_months', label: 'Absent for months (>3 months gap)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCycleRegularity(item.key as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                      cycleRegularity === item.key
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={heavyBleeding}
                  onChange={(e) => setHeavyBleeding(e.target.checked)}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Heavy flow (Changing pad every 1–2 hours)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium">
                <input
                  type="checkbox"
                  checked={severePainCramps}
                  onChange={(e) => setSeverePainCramps(e.target.checked)}
                  className="rounded-sm text-rose-600 focus:ring-rose-500"
                />
                <span>Severe pain or cramps affecting daily routine</span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition"
              >
                <span>Continue to Medical History</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Medical History & Finish */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Step 3: Medical History
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Any prior medical or endocrine evaluations?
              </h3>
              <p className="text-xs text-slate-500">
                You can select "Prefer not to answer" or "Unsure" if you are not certain.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Have you ever been evaluated for PCOS previously?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'never', label: 'Never evaluated' },
                  { key: 'suspected', label: 'Suspected / Self-noted' },
                  { key: 'diagnosed_by_doctor', label: 'Diagnosed by a doctor' },
                  { key: 'unsure', label: 'Unsure / Prefer not to say' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPreviousPcosEvaluation(opt.key as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                      previousPcosEvaluation === opt.key
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thyroid Condition
                </label>
                <select
                  value={thyroidHistory}
                  onChange={(e) => setThyroidHistory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="none">None / Normal</option>
                  <option value="hypothyroidism">Hypothyroidism (Underactive)</option>
                  <option value="hyperthyroidism">Hyperthyroidism (Overactive)</option>
                  <option value="unsure">Unsure / Not tested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blood Sugar / Diabetes History
                </label>
                <select
                  value={diabetesMetabolic}
                  onChange={(e) => setDiabetesMetabolic(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="none">None / Normal</option>
                  <option value="prediabetes">Pre-diabetes</option>
                  <option value="type2_diabetes">Type 2 Diabetes</option>
                  <option value="unsure">Unsure / Not tested</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Your health data is stored securely. This information will only be used to personalize your screening and care navigation.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-200 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile & Continue</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
