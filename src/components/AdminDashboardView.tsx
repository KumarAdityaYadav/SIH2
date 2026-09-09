import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  Stethoscope,
  Building2,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { LanguageCode, User } from '../types';
import { SEED_DOCTORS } from '../data/seedData';

interface AdminDashboardViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
}) => {
  const [doctors, setDoctors] = useState(SEED_DOCTORS);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [newFee, setNewFee] = useState<number>(199);

  const handleUpdateFee = (id: string) => {
    setDoctors(
      doctors.map((d) => (d.id === id ? { ...d, consultationFeeInr: newFee } : d))
    );
    setEditingDocId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Governance & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            StreeSure Central Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time screening epidemiology, ASHA field performance, NGO campaign oversight, and subsidized fee configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen3DModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>3D Clinical Viewer</span>
        </button>
      </div>

      {/* Aggregate Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Screenings Completed
          </span>
          <span className="text-3xl font-black text-slate-900">4,280</span>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 Indian Languages</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Risk Distribution
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              52% L1
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              34% L2
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              14% L3
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Green / Orange / Red ratio</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Teleconsultations Conducted
          </span>
          <span className="text-3xl font-black text-indigo-700">892</span>
          <p className="text-[11px] text-slate-500 mt-1">Avg Rating: 4.9 / 5.0</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active ASHA & NGO Nodes
          </span>
          <span className="text-3xl font-black text-teal-700">148</span>
          <p className="text-[11px] text-slate-500 mt-1">Villages connected</p>
        </div>
      </div>

      {/* Doctor Subsidized Fee Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Doctor Subsidized Fee Control</h2>
            <p className="text-xs text-slate-500">
              Manage maximum teleconsultation fees to ensure care remains affordable for rural beneficiaries
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {(doctors || []).map((doc) => (
            <div
              key={doc.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{doc.fullName}</span>
                  <span className="text-[10px] text-teal-700 font-semibold">{doc.specialty}</span>
                </div>
                <span className="text-[11px] text-slate-500">{doc.qualifications}</span>
              </div>

              <div className="flex items-center gap-3">
                {editingDocId === doc.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newFee}
                      onChange={(e) => setNewFee(parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateFee(doc.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDocId(null)}
                      className="px-2 py-1 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{doc.consultationFeeInr}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDocId(doc.id);
                        setNewFee(doc.consultationFeeInr);
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Edit Fee
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
