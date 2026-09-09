import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  User,
  Plus,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Consultation, Doctor, LanguageCode, User as UserType } from '../types';
import { SEED_CONSULTATIONS } from '../data/seedData';

interface DoctorDashboardViewProps {
  currentUser: UserType | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>(SEED_CONSULTATIONS);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(
    SEED_CONSULTATIONS[0] || null
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    'Example clinician note: reported cycle irregularity and androgen-related symptoms. Further history and clinician-directed evaluation may be considered.'
  );
  const [prescriptionSummary, setPrescriptionSummary] = useState(
    'Example care-plan field: clinician to document individualized recommendations, investigations, medicines, and follow-up here.'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    if (!selectedConsultation) return;
    fetch(`/api/consultations/${encodeURIComponent(selectedConsultation.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorClinicalNotes: clinicalNotes,
        prescriptionSummary,
        status: 'completed',
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to save consultation');
        setConsultations((items) => items.map((item) =>
          item.id === selectedConsultation.id
            ? { ...item, doctorClinicalNotes: clinicalNotes, prescriptionSummary, status: 'completed' }
            : item
        ));
        setSelectedConsultation((item) => item ? { ...item, doctorClinicalNotes: clinicalNotes, prescriptionSummary, status: 'completed' } : item);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      })
      .catch((error) => console.warn('Consultation update unavailable:', error));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-200 text-xs font-bold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Clinical Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {currentUser?.fullName || 'Dr. Ananya Sen'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            MS (OB/GYN) • AIIMS Fellow • Reviewing teleconsultations & screening summaries
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen3DModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition shadow-md"
        >
          <Layers className="w-4 h-4" />
          <span>Launch 3D Clinical Model</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Consultation Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Patient Appointments</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                {consultations.length} Active
              </span>
            </h2>

            <div className="space-y-2.5">
              {(consultations || []).map((cns) => (
                <button
                  key={cns.id}
                  type="button"
                  onClick={() => setSelectedConsultation(cns)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition ${
                    selectedConsultation?.id === cns.id
                      ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{cns.patientName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        cns.status === 'scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cns.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <span>{new Date(cns.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="capitalize">{cns.mode}</span>
                  </div>
                  {cns.sharedScreeningSummary && (
                    <div className="mt-2 text-[10px] bg-amber-50 text-amber-900 px-2 py-1 rounded-md border border-amber-200/60 font-medium">
                      ⚠️ {cns.sharedScreeningSummary}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Selected Patient Clinical View */}
        <div className="lg:col-span-7">
          {selectedConsultation ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedConsultation.patientName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scheduled for {new Date(selectedConsultation.scheduledAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={selectedConsultation.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Call</span>
                </a>
              </div>

              {/* Shared StreeSure Screening Summary */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>StreeSure Non-Diagnostic Patient Screening Report</span>
                </div>
                <p className="leading-relaxed">
                  Patient reported delayed menstrual intervals (38–45 days), mild jawline hirsutism, and BMI of 23.2. Assessment Category: <strong>Level 2 Orange (Evaluation Recommended)</strong>.
                </p>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Doctor Clinical Impressions & Differential Notes
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Prescription / Advice */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Lifestyle & Medical Prescription Summary (Dispatched to Patient Portal)
                </label>
                <textarea
                  value={prescriptionSummary}
                  onChange={(e) => setPrescriptionSummary(e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {isSaved ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Notes dispatched successfully!
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Save & Send to Patient</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select a patient from the queue to view clinical summary
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
