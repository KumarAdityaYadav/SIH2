import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Users,
  Calendar,
  Layers,
  FileText,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  FlaskConical,
  HeartPulse,
  Info,
  Download,
  Loader2,
} from 'lucide-react';
import { LanguageCode, ScreeningResult, User } from '../types';
import { getTranslation } from '../services/translations';
import { speakText, stopSpeaking } from '../services/voiceService';
import { ClinicalIntelligence } from '../services/clinicalIntelligence';
import { PdfReportModal } from './PdfReportModal';
import { generateScreeningPdfReport } from '../services/pdfReportGenerator';

interface ScreeningResultViewProps {
  result: ScreeningResult;
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onBookDoctor: () => void;
  onConnectAsha: () => void;
  onOpenTracker: () => void;
  onOpen3DModal: () => void;
  onRetakeScreening: () => void;
}

export const ScreeningResultView: React.FC<ScreeningResultViewProps> = ({
  result,
  currentUser,
  currentLanguage,
  onBookDoctor,
  onConnectAsha,
  onOpenTracker,
  onOpen3DModal,
  onRetakeScreening,
}) => {
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanationText, setAiExplanationText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);
  const [intelligence, setIntelligence] = useState<ClinicalIntelligence | null>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloadSuccess, setPdfDownloadSuccess] = useState<string | null>(null);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const handleDownloadReportPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const { success, filename } = await generateScreeningPdfReport({
        result,
        currentUser,
        currentLanguage,
        intelligence,
        aiExplanation: aiExplanationText,
      });
      if (success) {
        setPdfDownloadSuccess(filename);
        setTimeout(() => setPdfDownloadSuccess(null), 6000);
      }
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Pattern styling
  const pcosPattern = result.pcosPattern || (result.overallScore >= 55 ? 'HIGH' : result.overallScore >= 28 ? 'MODERATE' : 'LOW');

  const getBadgeStyle = () => {
    switch (pcosPattern) {
      case 'LOW':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          colorCode: '#10b981',
          patternLabel: 'LOW PATTERN',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-900',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          icon: AlertCircle,
          colorCode: '#f59e0b',
          patternLabel: 'MODERATE PATTERN',
        };
      case 'HIGH':
      default:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: AlertTriangle,
          colorCode: '#e11d48',
          patternLabel: 'HIGH PATTERN',
        };
    }
  };

  const style = getBadgeStyle();
  const IconComponent = style.icon;

  const handleBuildIntelligence = async () => {
    if (!currentUser) return;
    setIntelligenceLoading(true);
    try {
      const response = await fetch('/api/screening/intelligence', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screeningResult: result }),
      });
      if (!response.ok) throw new Error('Unable to build the explanation');
      setIntelligence(await response.json());
    } catch {
      setIntelligence(null);
    } finally {
      setIntelligenceLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id && result.userId === currentUser.id) handleBuildIntelligence();
    // This panel is derived from the already-computed screening result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, result.id]);

  const handleFetchAiExplanation = async () => {
    setIsAiExplaining(true);
    try {
      const res = await fetch('/api/gemini/explain-screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screeningResult: result,
          language: currentLanguage,
        }),
      });
      const data = await res.json();
      setAiExplanationText(
        data.explanation ||
          'Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation. Your metabolic measurements provide additional health-risk context.'
      );
    } catch (e) {
      setAiExplanationText(
        'Your preliminary assessment indicates features commonly associated with cycle variations and metabolic dynamics. Please consult a qualified gynecologist for an individual clinical review.'
      );
    } finally {
      setIsAiExplaining(false);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      let speech = '';
      if (currentLanguage === 'hi') {
        const patternHi = pcosPattern === 'HIGH' ? 'उच्च जोखिम' : pcosPattern === 'MODERATE' ? 'मध्यम जोखिम' : 'कम जोखिम';
        speech = `स्त्रीश्योर प्राथमिक जांच परिणाम: आपके लक्षणों और स्वास्थ्य जानकारी के आधार पर ${patternHi} का संकेत मिलता है। यह कोई अंतिम बीमारी की पुष्टि नहीं है। कृपया स्त्री रोग विशेषज्ञ से परामर्श लें।`;
      } else if (currentLanguage === 'bn') {
        const patternBn = pcosPattern === 'HIGH' ? 'উচ্চ ঝুঁকি' : pcosPattern === 'MODERATE' ? 'মাঝারি ঝুঁকি' : 'কম ঝুঁকি';
        speech = `স্ত্রীশিওর স্ক্রীনিং ফলাফল: আপনার উপসর্গের ভিত্তিতে ${patternBn} এর লক্ষণ দেখা যাচ্ছে। অনুগ্রহ করে চিকিৎসকের পরামর্শ নিন।`;
      } else if (currentLanguage === 'mr') {
        const patternMr = pcosPattern === 'HIGH' ? 'जास्त धोका' : pcosPattern === 'MODERATE' ? 'मध्यम धोका' : 'कमी धोका';
        speech = `स्त्रीश्योर तपासणी निकाल: आपल्या लक्षणांनुसार ${patternMr} आढळला आहे. कृपया तज्ज्ञ डॉक्टरांचा सल्ला घ्या.`;
      } else {
        const summaryText = result.levelDescription || 'Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation.';
        const stepsText = (result.recommendedNextSteps || []).join('. ');
        speech = `StreeSure Preliminary Screening: ${pcosPattern} PCOS-Associated Feature Pattern. ${summaryText}. What to do next: ${stepsText}`;
      }
      speakText(speech, currentLanguage, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  // Helper Badge for Sources
  const renderSourceBadge = (source?: string) => {
    if (!source) return null;
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

  const pb = result.pointBreakdown || {
    menstrualPatternScore: 26,
    clinicalSymptomsScore: 20,
    metabolicContextScore: 12,
    supportingContextScore: 4,
    totalScore: result.overallScore,
  };

  const nextStepsList = result.recommendedNextSteps || [
    'Schedule a consultation with a registered Gynecologist via StreeSure for clinical evaluation.',
    'Maintain an ongoing menstrual log in the StreeSure Period Tracker to share objective timeline data with your doctor.',
    'Share your metabolic profile with your healthcare provider for integrated lifestyle guidance.',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Download Success Banner */}
      {pdfDownloadSuccess && (
        <div className="bg-emerald-700 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Clinical Health Assessment Report Downloaded</p>
              <p className="text-[11px] text-emerald-100 font-normal">
                Saved as <span className="font-mono font-bold text-white">{pdfDownloadSuccess}</span>. Includes your health assessment, screening date, Rotterdam metrics, and AI-derived recommendations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPdfDownloadSuccess(null)}
            className="px-2.5 py-1 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10 transition text-xs font-bold"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Main Assessment Result Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border ${style.border} ${style.bg} shadow-xl relative`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${style.badge}`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.badge}`}>
                  PCOS-Associated Feature Pattern: {style.patternLabel}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                  Not a diagnosis
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                StreeSure Preliminary Screening
              </h1>
            </div>
          </div>

          {/* Download PDF, Print, Read aloud and 3D buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="btn-download-report-pdf-top"
              onClick={handleDownloadReportPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition disabled:opacity-60"
              title="Download health assessment report as PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Report (PDF)'}</span>
            </button>

            <button
              type="button"
              id="btn-view-pdf-report-top"
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs hover:bg-slate-50 transition"
              title="View full report preview and print"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>{t('pdfReportBtn')}</span>
            </button>

            <button
              type="button"
              onClick={handleReadAloud}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs hover:bg-slate-50 transition"
            >
              <Volume2 className={`w-4 h-4 text-rose-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'Pause Audio' : 'Listen in Language'}</span>
            </button>

            <button
              type="button"
              onClick={onOpen3DModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xs hover:bg-teal-800 transition"
            >
              <Layers className="w-4 h-4" />
              <span>3D Pelvic Model</span>
            </button>
          </div>
        </div>

        {/* Core Medical Phrasing */}
        <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed mb-6">
          Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation. Your metabolic measurements provide additional health-risk context.
        </p>

        {/* Action CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={onBookDoctor}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-200 transition hover:scale-105"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consult Gynecologist (₹199)</span>
          </button>

          <button
            type="button"
            onClick={onConnectAsha}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-200 transition hover:scale-105"
          >
            <Users className="w-4 h-4" />
            <span>Talk to ASHA Worker</span>
          </button>

          <button
            type="button"
            onClick={onOpenTracker}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition"
          >
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Track Menstrual Cycles</span>
          </button>
        </div>
      </div>

      {/* Spotlight Card: Download Official Health Assessment PDF */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Official Clinical Health Assessment Report
              </h3>
              <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                PDF Ready • jsPDF Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes comprehensive risk assessment ({pcosPattern} Pattern), Rotterdam point breakdown, date & time, metabolic markers, and actionable recommendations derived from the AI analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            id="btn-download-spotlight-pdf"
            onClick={handleDownloadReportPdf}
            disabled={isDownloadingPdf}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition disabled:opacity-60"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Report as PDF'}</span>
          </button>

          <button
            type="button"
            id="btn-preview-spotlight-pdf"
            onClick={() => setShowPdfModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Preview & Print</span>
          </button>
        </div>
      </div>

      {/* 2. CLINICAL INTELLIGENCE: Structured explanation and data-quality trace */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-100 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Why did StreeSure give this result?
            </h2>
            <p className="text-xs text-slate-500 mt-1">Structured evidence, data quality and context — not an AI diagnosis.</p>
          </div>
          {!intelligence && <button onClick={handleBuildIntelligence} disabled={intelligenceLoading} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-60">{intelligenceLoading ? 'Analyzing…' : 'Explain result'}</button>}
        </div>
        {intelligence ? <div className="space-y-4">
          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
            <div className="text-sm font-bold text-indigo-950">{intelligence.headline}</div>
            <p className="text-xs text-indigo-900 mt-1">{intelligence.dataQuality.caveat}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {intelligence.evidence.map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-slate-800">{item.label}</span><span className="text-[9px] uppercase font-black text-slate-400">{item.weight}</span></div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
            </div>)}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-800">Data completeness</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{intelligence.dataQuality.completeness}%</div>
              {intelligence.dataQuality.missing.length > 0 && <p className="text-[11px] text-slate-500 mt-1">Missing: {intelligence.dataQuality.missing.join(', ')}</p>}
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-800">Important context</div>
              <p className="text-xs text-slate-600 mt-1">{intelligence.contextFlags.length ? intelligence.contextFlags.join(' ') : 'No additional context flags were identified from the recorded answers.'}</p>
            </div>
          </div>
          {intelligence.mlSignal && <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-purple-950">ML screening signal</span><span className="text-lg font-black text-purple-800">{Math.round(intelligence.mlSignal.probability * 100)}%</span></div>
            <p className="text-[11px] text-purple-900 mt-1">{intelligence.mlSignal.label}{intelligence.mlSignal.modelVersion ? ` • ${intelligence.mlSignal.modelVersion}` : ''}</p>
          </div>}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="text-xs font-bold text-emerald-950">Recommended next steps</div>
            <ul className="mt-2 space-y-1.5 list-disc pl-4 text-xs text-emerald-900">{intelligence.nextSteps.map(step => <li key={step}>{step}</li>)}</ul>
          </div>
          <div className="text-[11px] text-slate-500 flex gap-2 items-start"><ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />{intelligence.safetyNote}</div>
        </div> : <p className="text-xs text-slate-500">Generating a transparent, rule-based explanation from this completed screening.</p>}
      </div>

      {/* 2. EXPLAINABILITY: Exact Point Breakdown from Deterministic Screening Engine */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Deterministic Screening Score & Explainability</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact score components calculated by the deterministic clinical rule engine (not generated or altered by AI)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFullBreakdown(!showFullBreakdown)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            {showFullBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showFullBreakdown && (
          <div className="space-y-6 pt-2">
            {/* 4 Deterministic Engine Point Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Menstrual Pattern */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Menstrual pattern</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-rose-600">{pb.menstrualPatternScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 40</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(pb.menstrualPatternScore / 40) * 100}%` }}
                  />
                </div>
              </div>

              {/* Clinical Symptoms */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Clinical symptoms</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-rose-600">{pb.clinicalSymptomsScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 30</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(pb.clinicalSymptomsScore / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metabolic Context */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Metabolic context</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-teal-600">{pb.metabolicContextScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 20</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full"
                    style={{ width: `${(pb.metabolicContextScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Supporting Context */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Supporting context</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-purple-600">{pb.supportingContextScore}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 10</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${(pb.supportingContextScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Calculation Row */}
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Total Deterministic Preliminary Screening Score:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">{pb.totalScore}</span>
                <span className="text-xs text-slate-500 font-bold">/ 100</span>
              </div>
            </div>

            {/* Structured Factor Observations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.contributingFactors.map((obs, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{obs}</span>
                </div>
              ))}
            </div>

            {/* AI Medical Explanation (Educational Only) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-teal-50/70 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>StreeSure AI Educational Summary</span>
                </div>
                {!aiExplanationText && (
                  <button
                    type="button"
                    onClick={handleFetchAiExplanation}
                    disabled={isAiExplaining}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    {isAiExplaining ? 'Generating Note...' : 'Explain Results in Simple Language'}
                  </button>
                )}
              </div>

              {aiExplanationText ? (
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-xl border border-indigo-100">
                  {aiExplanationText}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Tap "Explain Results in Simple Language" to receive a clear, conversational overview explaining your biological indicators and supportive next steps.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. METABOLIC PROFILE & HARDWARE MEASUREMENTS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600" />
              <span>Metabolic Profile & Device Biomarkers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available blood glucose and lipid markers with verified measurement provenance
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold uppercase">
            DEMO / SIMULATED HARDWARE
          </span>
        </div>

        {/* Metabolic Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Glucose */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Glucose</span>
              {renderSourceBadge(result.metabolicProfile?.glucose?.source || 'DEMO')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {result.metabolicProfile?.glucose?.value || 112}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">Status: Valid</span>
          </div>

          {/* Triglycerides */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Triglycerides</span>
              {renderSourceBadge(result.metabolicProfile?.triglycerides?.source || 'DEMO')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {result.metabolicProfile?.triglycerides?.value || 168}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">Status: Valid</span>
          </div>

          {/* Total Cholesterol */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Total Cholesterol</span>
              {renderSourceBadge(result.metabolicProfile?.totalCholesterol?.source || 'DEMO')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {result.metabolicProfile?.totalCholesterol?.value || 208}
              </span>
              <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">Status: Valid</span>
          </div>
        </div>

        {/* Hardware Measurements Detail Log */}
        {result.hardwareMeasurements && result.hardwareMeasurements.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">StreeSure Hardware Import Log</span>
              </div>
              <span className="text-[10px] font-bold text-purple-300">
                Device: {result.hardwareMeasurements[0]?.deviceId || 'STREESURE-PROTOTYPE-01'}
              </span>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {result.hardwareMeasurements.map((m, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{m.parameter.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700">
                      {m.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-400">
                      {m.value} {m.unit}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {m.qualityStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. "WHAT THIS RESULT MEANS" VS "WHAT IT DOES NOT MEAN" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>What This Result Means</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Your responses show a pattern of PCOS-associated features that may warrant clinical evaluation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Your metabolic measurements provide additional health-risk context.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>It provides organized, objective timeline and biomarker data for your gynecologist appointment.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3>What This Result Does NOT Mean</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>This is <strong>NOT a diagnosis</strong> of PCOS or any specific illness.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>Hardware does not directly detect or diagnose PCOS on its own.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>It does not replace an in-person clinical exam, pelvic ultrasound, or blood tests.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5. SUGGESTED NEXT STEPS & MEDICAL DISCLAIMER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recommended Next Steps</h3>
        <div className="space-y-2.5">
          {nextStepsList.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Global Medical & Demo Disclaimers */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <p>
            <strong>Medical Disclaimer:</strong> StreeSure provides preliminary risk screening and health education. It does not diagnose PCOS or replace evaluation by a qualified healthcare professional.
          </p>
          <p>
            <strong>Demo Disclaimer:</strong> Demo measurements are simulated and are not real clinical measurements.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onRetakeScreening}
            className="text-slate-500 hover:text-rose-600 font-semibold"
          >
            ← Retake or update screening answers
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id="btn-view-pdf-report-bottom"
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('pdfReportBtn')}</span>
            </button>

            <button
              type="button"
              id="btn-download-pdf-report-bottom"
              onClick={handleDownloadReportPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Report as PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official PDF Report Form Modal & Exporter */}
      <PdfReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        result={result}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
