import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Calendar, CheckCircle2, Clock3, Cpu, FileText, HeartPulse, RefreshCw, Stethoscope, TrendingUp, ShieldCheck } from 'lucide-react';
import { LanguageCode, User } from '../types';

interface HealthJourneyViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onStartScreening: () => void;
  onBookDoctor: () => void;
  onOpenTracker: () => void;
  onOpen3DModal: () => void;
}

interface JourneyEvent { id: string; type: string; date?: string; title: string; summary: string; level?: string; status?: string; source?: string; parameter?: string; priority?: string; }
interface JourneyData { generatedAt: string; latestScreening: any; latestHardwareMeasurement: any; stats: { screenings: number; hardwareMeasurements: number; careCases: number; consultations: number; completedConsultations: number }; openCareCases: number; riskTrend: { date: string | null; level: string | null; score: number | null; mlProbability: number | null }[]; timeline: JourneyEvent[]; }

const labelForType: Record<string, string> = { SCREENING: 'Screening', HARDWARE: 'Smart Kit', CARE_CASE: 'Care coordination', CONSULTATION: 'Consultation' };

export const HealthJourneyView: React.FC<HealthJourneyViewProps> = ({ currentUser, onStartScreening, onBookDoctor, onOpenTracker, onOpen3DModal }) => {
  const [journey, setJourney] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    if (!currentUser) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(currentUser.id)}/health-journey`, { credentials: 'include' });
      if (!response.ok) throw new Error('Unable to load the health journey');
      setJourney(await response.json());
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load the health journey'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [currentUser?.id]);

  const latest = journey?.latestScreening;
  const trend = useMemo(() => [...(journey?.riskTrend || [])].reverse(), [journey?.riskTrend]);
  const maxScore = Math.max(100, ...trend.map(x => x.score || 0));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold mb-2"><HeartPulse className="w-3.5 h-3.5" /> Longitudinal Health Journey</div>
          <h1 className="text-2xl sm:text-3xl font-black">Your Care Pathway</h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">One timeline for screenings, Smart Kit measurements, care coordination and consultations.</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-md disabled:opacity-60"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>

      {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}. Your saved data is not changed.</div>}

      {loading && !journey ? <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500">Loading your journey…</div> : journey && <>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            ['Screenings', journey.stats.screenings, Activity],
            ['Measurements', journey.stats.hardwareMeasurements, Cpu],
            ['Care cases', journey.stats.careCases, FileText],
            ['Consultations', journey.stats.consultations, Stethoscope],
            ['Open cases', journey.openCareCases, ShieldCheck],
          ].map(([label, value, Icon]: any) => <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"><Icon className="w-4 h-4 text-rose-600 mb-2" /><div className="text-2xl font-black text-slate-900">{value}</div><div className="text-[11px] font-semibold text-slate-500">{label}</div></div>)}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl">
            <div className="flex items-center justify-between mb-4"><div><h2 className="font-bold text-slate-900">Latest screening</h2><p className="text-xs text-slate-500">A screening signal, not a diagnosis.</p></div><TrendingUp className="w-5 h-5 text-rose-600" /></div>
            {latest ? <div className="rounded-2xl bg-slate-50 p-4 space-y-2"><div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Risk support level</span><span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">{latest.level || 'RECORDED'}</span></div><div className="text-lg font-black text-slate-900">{latest.levelTitle || 'Screening completed'}</div><p className="text-xs text-slate-600">{latest.levelDescription || latest.whatItMeans?.[0] || 'Review the screening summary and consider appropriate clinical evaluation.'}</p><button onClick={onStartScreening} className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-1">Open screening <ArrowRight className="w-3.5 h-3.5" /></button></div> : <Empty label="No screening recorded yet." action="Start screening" onClick={onStartScreening} />}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xl">
            <div className="flex items-center justify-between mb-4"><div><h2 className="font-bold text-slate-900">Risk trend</h2><p className="text-xs text-slate-500">Historical screening scores, when available.</p></div><Activity className="w-5 h-5 text-indigo-600" /></div>
            {trend.length ? <div className="space-y-3">{trend.map((item, i) => <div key={`${item.date}-${i}`}><div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1"><span>{item.date ? new Date(item.date).toLocaleDateString() : 'Recorded'}</span><span>{item.score != null ? `${item.score}/100` : item.level || '—'}</span></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(100, ((item.score || 0) / maxScore) * 100)}%` }} /></div></div>)}</div> : <Empty label="Complete a screening to start your trend." action="Start screening" onClick={onStartScreening} />}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between mb-6"><div><h2 className="text-lg font-bold text-slate-900">Unified timeline</h2><p className="text-xs text-slate-500">Latest saved events from your StreeSure account.</p></div><Calendar className="w-5 h-5 text-slate-400" /></div>
          {journey.timeline.length ? <div className="space-y-5 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">{journey.timeline.map(event => <div key={event.id} className="relative flex gap-4"><div className="w-10 h-10 rounded-2xl bg-white border-2 border-rose-200 flex items-center justify-center shrink-0 z-10"><CheckCircle2 className="w-4 h-4 text-rose-600" /></div><div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-200"><div className="flex flex-col sm:flex-row sm:justify-between gap-1"><div><span className="text-[10px] uppercase tracking-wide font-black text-rose-600">{labelForType[event.type] || event.type}</span><h3 className="text-sm font-bold text-slate-900">{event.title}</h3></div><span className="text-[11px] font-semibold text-slate-400">{event.date ? new Date(event.date).toLocaleString() : 'Recorded'}</span></div><p className="text-xs text-slate-600 mt-1">{event.summary}</p>{event.source && <p className="text-[10px] text-slate-400 mt-2">Source: {event.source}</p>}</div></div>)}</div> : <Empty label="Your journey will appear here as you use StreeSure." action="Start screening" onClick={onStartScreening} />}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <QuickAction icon={Activity} title="Log symptoms" onClick={onOpenTracker} />
          <QuickAction icon={Stethoscope} title="Find a doctor" onClick={onBookDoctor} />
          <QuickAction icon={Clock3} title="Learn with 3D model" onClick={onOpen3DModal} />
        </div>
      </>}
    </div>
  );
};

function Empty({ label, action, onClick }: { label: string; action: string; onClick: () => void }) { return <div className="rounded-2xl bg-slate-50 p-5 text-center"><p className="text-xs text-slate-500 mb-3">{label}</p><button onClick={onClick} className="text-xs font-bold text-rose-600">{action} <ArrowRight className="inline w-3.5 h-3.5" /></button></div>; }
function QuickAction({ icon: Icon, title, onClick }: { icon: any; title: string; onClick: () => void }) { return <button onClick={onClick} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-left hover:border-rose-200 transition"><Icon className="w-5 h-5 text-rose-600" /><span className="text-sm font-bold text-slate-800">{title}</span><ArrowRight className="w-4 h-4 ml-auto text-slate-400" /></button>; }
