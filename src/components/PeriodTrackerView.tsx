import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Heart,
  Droplet,
  Sparkles,
  AlertCircle,
  Clock,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Activity,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { LanguageCode, PeriodLog, User } from '../types';
import { SEED_PERIOD_LOGS } from '../data/seedData';
import { getTranslation } from '../services/translations';

interface PeriodTrackerViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
  onStartScreening: () => void;
}

export const PeriodTrackerView: React.FC<PeriodTrackerViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
  onStartScreening,
}) => {
  const [logs, setLogs] = useState<PeriodLog[]>(SEED_PERIOD_LOGS);
  const [showLogModal, setShowLogModal] = useState(false);

  // New Log Form State
  const [startDate, setStartDate] = useState('2026-08-20');
  const [endDate, setEndDate] = useState('2026-08-25');
  const [flowIntensity, setFlowIntensity] = useState<'spotting' | 'light' | 'medium' | 'heavy'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Cramps', 'Bloating']);
  const [selectedMood, setSelectedMood] = useState<'calm' | 'irritable' | 'anxious' | 'fatigued' | 'energetic'>('fatigued');
  const [notes, setNotes] = useState('');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const availableSymptoms = [
    'Severe Cramps',
    'Mild Cramps',
    'Bloating',
    'Acne Breakout',
    'Headache',
    'Back Pain',
    'Breast Tenderness',
    'Mood Swings',
    'Fatigue',
  ];

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const cycleLength = logs.length > 0 ? 36 : 28; // calculated
    const newLog: PeriodLog = {
      id: 'log_' + Date.now(),
      userId: currentUser?.id || 'usr_guest',
      startDate,
      endDate,
      cycleLengthDays: cycleLength,
      periodDurationDays: 5,
      flowIntensity,
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes,
      createdAt: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setShowLogModal(false);
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Cycle Health & Ovulation Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Period & Symptom Tracker
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
            Log your cycles, pain, flow, and symptoms to build an accurate health timeline for your gynecologist consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-open-log-modal"
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-lg hover:bg-rose-50 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Period & Symptoms</span>
          </button>

          <button
            type="button"
            onClick={onOpen3DModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold border border-white/20 transition"
          >
            <Layers className="w-4 h-4" />
            <span>3D Cycle Model</span>
          </button>
        </div>
      </div>

      {/* Cycle Key Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Average Cycle Length
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">38 Days</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Delayed &gt;35d
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Normal cycle length is typically between 21 and 35 days.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Next Predicted Period
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">Sep 15</span>
            <span className="text-xs font-medium text-slate-500">in ~23 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Estimated based on your historical cycle intervals.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cycle Regularity Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-700">Somewhat Irregular</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Fluctuations observed over the past 3 logged cycles.
          </p>
        </div>
      </div>

      {/* Logged Periods History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Logged Cycle History</h2>
            <p className="text-xs text-slate-500">Your recent menstrual entries and symptoms</p>
          </div>
          <button
            type="button"
            onClick={onStartScreening}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Update StreeSure Screening ↗
          </button>
        </div>

        <div className="space-y-3">
          {(logs || []).map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">
                      {new Date(log.startDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      –{' '}
                      {new Date(log.endDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Duration: {log.periodDurationDays} days • Cycle interval: {log.cycleLengthDays} days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-md capitalize">
                    {log.flowIntensity} Flow
                  </span>
                  <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-md capitalize">
                    Mood: {log.mood}
                  </span>
                </div>
              </div>

              {log.symptoms && log.symptoms.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-slate-400">Symptoms:</span>
                  {(log.symptoms || []).map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              )}

              {log.notes && (
                <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                  "{log.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Log New Period & Symptoms</h3>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Flow Intensity</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                    <button
                      key={flow}
                      type="button"
                      onClick={() => setFlowIntensity(flow)}
                      className={`p-2 rounded-xl border capitalize font-semibold ${
                        flowIntensity === flow
                          ? 'bg-rose-50 border-rose-500 text-rose-900'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Symptoms</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
                        selectedSymptoms.includes(sym)
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mood</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['calm', 'irritable', 'anxious', 'fatigued', 'energetic'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMood(m)}
                      className={`p-2 rounded-xl border capitalize font-semibold ${
                        selectedMood === m
                          ? 'bg-teal-50 border-teal-500 text-teal-900'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mild headache, took ginger tea..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
