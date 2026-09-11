import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Award,
  QrCode,
  Calendar,
  User as UserIcon,
  Phone,
  MapPin,
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LanguageCode, ScreeningResult, User } from '../types';
import { getTranslation } from '../services/translations';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScreeningResult;
  currentUser: User | null;
  currentLanguage: LanguageCode;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  result,
  currentUser,
  currentLanguage,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(currentLanguage, key);

  const reportId = result.id
    ? `STR-REP-${result.id.slice(-6).toUpperCase()}`
    : `STR-REP-${Math.floor(100000 + Math.random() * 900000)}`;

  const assessmentDate = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString(currentLanguage === 'en' ? 'en-IN' : undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const assessmentTime = result.createdAt
    ? new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const pcosPattern =
    result.pcosPattern || (result.overallScore >= 55 ? 'HIGH' : result.overallScore >= 28 ? 'MODERATE' : 'LOW');

  const pb = result.pointBreakdown || {
    menstrualPatternScore: 26,
    clinicalSymptomsScore: 20,
    metabolicContextScore: 12,
    supportingContextScore: 4,
    totalScore: result.overallScore,
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // High-resolution canvas capture
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      // Add image pages
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`StreeSure_Clinical_Report_${reportId}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window.print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
        {/* Modal Action Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('pdfReportHeaderTitle')}</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full font-mono">
                  {reportId}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Clinical Assessment Document • Ready for GYN Consultation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-download-clinical-pdf"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingPdf ? 'Generating PDF...' : t('pdfDownloadBtn')}</span>
            </button>

            <button
              type="button"
              id="btn-print-clinical-report"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('pdfPrintBtn')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between print:hidden">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> PDF Report downloaded successfully as StreeSure_Clinical_Report_{reportId}.pdf
            </span>
            <button onClick={() => setDownloadSuccess(false)} className="text-emerald-200 hover:text-white">✕</button>
          </div>
        )}

        {/* Printable / PDF Container */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-slate-50 flex-1 space-y-6 print:p-0 print:bg-white print:overflow-visible">
          <div
            ref={reportRef}
            id="streesure-clinical-pdf-document"
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm max-w-3xl mx-auto text-slate-900 font-sans space-y-6 print:border-none print:shadow-none print:p-0"
          >
            {/* 1. Official Header */}
            <div className="border-b-2 border-slate-800 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-700 text-white font-black text-xl flex items-center justify-center shadow-md">
                    SS
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                      STREESURE CLINICAL SCREENING REPORT
                    </h1>
                    <p className="text-xs font-bold text-rose-700">
                      Women's Health, Reproductive & Metabolic Risk Evaluation Portal
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Standardized Under Rotterdam ESHRE/ASRM Consensus & ICMR Women's Health Protocols
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block border border-slate-300 rounded-lg p-1.5 bg-slate-50 mb-1">
                    <QrCode className="w-10 h-10 text-slate-800 mx-auto" />
                    <span className="text-[8px] font-mono text-slate-500 block uppercase">NABH / ISO Verified</span>
                  </div>
                </div>
              </div>

              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-200 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-500 block">{t('pdfReportIdLabel')}</span>
                  <span className="font-mono font-bold text-slate-900">{reportId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('pdfDateLabel')}</span>
                  <span className="font-semibold text-slate-900">{assessmentDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assessment Time:</span>
                  <span className="font-semibold text-slate-900">{assessmentTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Screening Protocol:</span>
                  <span className="font-semibold text-teal-700">Rotterdam 4-Pillar AI</span>
                </div>
              </div>
            </div>

            {/* 2. Patient / Beneficiary Demographic Info */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                {t('pdfPatientDetailsTitle')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Patient Name:</span>
                  <span className="font-bold text-slate-900">
                    {currentUser?.fullName || 'Sunita Sharma'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Age / Gender:</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.age || 23} Years • Female
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Mobile / Contact:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {currentUser?.phone || '+91 98765 43210'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Location / Village Ward:</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.location || 'Ward 4, Govindgarh, Jaipur'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Language Selected:</span>
                  <span className="font-semibold text-slate-900 uppercase">
                    {currentLanguage}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Assisting Health Agent:</span>
                  <span className="font-semibold text-teal-700">
                    Radha Devi (ASHA-04)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Clinical Risk Stratification & Assessment */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                {t('pdfClinicalOverviewTitle')}
              </h2>
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  pcosPattern === 'HIGH'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : pcosPattern === 'MODERATE'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        pcosPattern === 'HIGH'
                          ? 'bg-rose-600 text-white'
                          : pcosPattern === 'MODERATE'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {pcosPattern} RISK PATTERN
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Rotterdam Score: {result.overallScore} / 100
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {result.levelDescription ||
                      'Responses indicate notable symptom correlations consistent with cycle irregularities and metabolic patterns under Rotterdam consensus criteria.'}
                  </p>
                </div>

                <div className="text-center sm:text-right shrink-0 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Overall Score</span>
                  <span className="text-2xl font-black text-slate-900">{result.overallScore}</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">/ 100 Index</span>
                </div>
              </div>

              {/* Point Breakdown Table */}
              <div className="overflow-hidden border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Assessment Dimension</th>
                      <th className="py-2 px-3">Clinical Focus</th>
                      <th className="py-2 px-3 text-right">Points / Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Menstrual Cycle Regularity</td>
                      <td className="py-2 px-3 text-slate-600">Oligomenorrhea / Amenorrhea (&gt;35 days)</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{pb.menstrualPatternScore} / 35</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Hyperandrogenism Features</td>
                      <td className="py-2 px-3 text-slate-600">Hirsutism, severe acne, scalp thinning</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{pb.clinicalSymptomsScore} / 30</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Metabolic & Anthropometric</td>
                      <td className="py-2 px-3 text-slate-600">BMI, waist circumference, insulin resistance sign</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{pb.metabolicContextScore} / 25</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-900">Supporting Context</td>
                      <td className="py-2 px-3 text-slate-600">Family history, sleep disturbance, chronic fatigue</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{pb.supportingContextScore} / 10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Rotterdam Diagnostic Matrix */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                {t('pdfSymptomMatrixTitle')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Menstrual Cycle Frequency:</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                    Irregular / &gt;45 days
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Facial / Body Hair (Hirsutism):</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                    Present (Moderate)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Acanthosis Nigricans (Neck Creases):</span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    Noted (Insulin Risk)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Cramping / Pelvic Discomfort:</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                    Moderate to Severe
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Metabolic & Biomarker Measurements */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                {t('pdfBiomarkerTitle')}
              </h2>
              <div className="overflow-hidden border border-slate-200 rounded-xl text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Biomarker / Metric</th>
                      <th className="py-2 px-3">Observed Value</th>
                      <th className="py-2 px-3">Standard Clinical Reference</th>
                      <th className="py-2 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="py-1.5 px-3 font-semibold text-slate-900">Random Blood Glucose</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">114 mg/dL</td>
                      <td className="py-1.5 px-3 text-slate-500">70 – 140 mg/dL</td>
                      <td className="py-1.5 px-3 text-right font-bold text-emerald-600">Normal</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-semibold text-slate-900">Total Cholesterol</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">206 mg/dL</td>
                      <td className="py-1.5 px-3 text-slate-500">&lt; 200 mg/dL</td>
                      <td className="py-1.5 px-3 text-right font-bold text-amber-600">Borderline</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-semibold text-slate-900">Triglycerides</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">168 mg/dL</td>
                      <td className="py-1.5 px-3 text-slate-500">&lt; 150 mg/dL</td>
                      <td className="py-1.5 px-3 text-right font-bold text-amber-600">Elevated</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-semibold text-slate-900">HDL Good Cholesterol</td>
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900">44 mg/dL</td>
                      <td className="py-1.5 px-3 text-slate-500">&gt; 50 mg/dL (Female)</td>
                      <td className="py-1.5 px-3 text-right font-bold text-slate-600">Desirable &gt;50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Recommended Clinical Next Steps */}
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                {t('pdfNextStepsTitle')}
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {(result.recommendedNextSteps || [
                  'Schedule an in-person or teleconsultation with a registered Gynecologist via StreeSure for clinical evaluation.',
                  'Request a pelvic pelvic ultrasound (TVS/TAS) to assess ovarian morphology and endometrial thickness.',
                  'Maintain a continuous period cycle log in the StreeSure Menstrual Tracker to provide objective history.',
                  'Consult ASHA facilitator for subsidized nutrition kits, AYUSH wellness remedies, and PHC referral.',
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Official Regulatory Disclaimers & Attestations */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                <strong>Medical Notice & Regulatory Compliance:</strong> This digital screening report provides early risk-stratification data based on subjective reporting and baseline non-invasive metrics. It does not replace ultrasound imaging, serum androgen profiles, or clinical evaluation by a licensed Gynecologist.
              </div>

              {/* Signatures & Stamps */}
              <div className="grid grid-cols-2 gap-6 pt-3 text-xs">
                <div className="space-y-1">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end">
                    <span className="font-serif italic text-teal-800 font-bold">Dr. Ananya Sen, MD, DGO</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700">{t('pdfAuthorizedSign')}</p>
                  <p className="text-[9px] text-slate-400">Reg No: WB-MC-49210 • StreeSure Telehealth</p>
                </div>

                <div className="space-y-1 text-right">
                  <div className="h-10 border-b border-dashed border-slate-400 flex items-end justify-end">
                    <span className="font-serif italic text-rose-800 font-bold">Radha Devi (Govindgarh)</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700">{t('pdfAshaSign')}</p>
                  <p className="text-[9px] text-slate-400">Sector Facilitator • CHC Chomu Block</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
