import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mic,
  Activity,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  CloudCheck,
  Search,
  Building2,
  FileText,
  Languages,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AshaBeneficiary, LanguageCode, User } from '../types';
import { SEED_ASHA_BENEFICIARIES } from '../data/seedData';

interface AshaDashboardViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onConductScreeningForBeneficiary: (beneficiary: AshaBeneficiary) => void;
  onOpen3DModal: () => void;
  onOpenVoiceSaathi: () => void;
}

export const AshaDashboardView: React.FC<AshaDashboardViewProps> = ({
  currentUser,
  currentLanguage,
  onConductScreeningForBeneficiary,
  onOpen3DModal,
  onOpenVoiceSaathi,
}) => {
  const [beneficiaries, setBeneficiaries] = useState<AshaBeneficiary[]>(SEED_ASHA_BENEFICIARIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Beneficiary form
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(22);
  const [villageWard, setVillageWard] = useState('Govindgarh Ward 4');
  const [contactNumber, setContactNumber] = useState('');
  const [hasConsent, setHasConsent] = useState(true);

  const filtered = (beneficiaries || []).filter(
    (b) =>
      (b.fullName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (b.villageWard || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConsent) {
      alert('Consent from beneficiary is mandatory to record health data.');
      return;
    }

    const newBen: AshaBeneficiary = {
      id: 'ben_' + Date.now(),
      ashaWorkerId: currentUser?.id || 'asha_radha_01',
      fullName,
      age,
      villageWard,
      contactNumber,
      screeningStatus: 'pending',
      referralStatus: 'none',
      notes: 'Added via ASHA village field round.',
      createdAt: new Date().toISOString(),
      consentGiven: true,
    };

    setBeneficiaries([newBen, ...(beneficiaries || [])]);
    fetch('/api/care-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        beneficiaryUserId: newBen.id,
        createdByUserId: currentUser?.id || 'asha_demo_01',
        assignedAshaId: currentUser?.id || 'asha_demo_01',
        consentGiven: true,
        priority: 'MEDIUM',
        reason: 'New beneficiary registered for StreeSure assisted screening',
        notes: newBen.notes,
      }),
    }).catch((error) => console.warn('Care-case persistence unavailable:', error));
    setShowAddModal(false);
    setFullName('');
  };

  const handleMarkReferred = (id: string) => {
    setBeneficiaries(
      (beneficiaries || []).map((b) =>
        b.id === id ? { ...b, referralStatus: 'referred_to_phc' } : b
      )
    );
    fetch('/api/care-cases', { method: 'GET' })
      .then((r) => r.json())
      .then((data) => {
        const match = (data.careCases || []).find((c: any) => c.beneficiaryUserId === id);
        if (match) {
          return fetch(`/api/care-cases/${encodeURIComponent(match.id)}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'DOCTOR_REFERRED' }),
          });
        }
      })
      .catch((error) => console.warn('Referral persistence unavailable:', error));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>ASHA Sangini Grassroots Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Namaste, {currentUser?.fullName || 'Radha Devi'} (ASHA)
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-xl">
            Govindgarh Sector • Chomu Block, Jaipur • Empowering rural women with assisted voice screening and PHC referrals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-add-beneficiary-modal"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register Beneficiary</span>
          </button>

          <button
            type="button"
            onClick={onOpen3DModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-950/60 hover:bg-teal-950 text-white text-xs font-bold border border-teal-700 transition"
          >
            <span>3D Awareness Demo</span>
          </button>
        </div>
      </div>

      {/* Field Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Registered in Village
          </span>
          <span className="text-3xl font-black text-slate-900">{beneficiaries.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Beneficiaries mapped</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Screenings Conducted
          </span>
          <span className="text-3xl font-black text-teal-700">
            {beneficiaries.filter((b) => b.screeningStatus === 'completed').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Assisted by ASHA</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            PHC Referrals
          </span>
          <span className="text-3xl font-black text-rose-600">
            {beneficiaries.filter((b) => b.referralStatus === 'referred_to_phc').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Sent for Doctor Consult</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cloud Sync Status
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All records synced (Online)</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Auto-sync on re-connect</span>
        </div>
      </div>

      {/* Beneficiaries Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Village Beneficiary Roster</h2>
            <p className="text-xs text-slate-500">
              Conduct assisted voice screenings and track clinical follow-ups
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ward..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Beneficiaries List */}
        <div className="divide-y divide-slate-100">
          {filtered.map((b) => (
            <div key={b.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{b.fullName}</span>
                  <span className="text-xs text-slate-500">({b.age} yrs)</span>
                  {b.screeningResultLevel && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        b.screeningResultLevel === 'RED'
                          ? 'bg-rose-100 text-rose-800'
                          : b.screeningResultLevel === 'ORANGE'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {b.screeningResultLevel} Level
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {b.villageWard} • Contact: {b.contactNumber}
                </p>
                {b.notes && <p className="text-xs text-slate-600 italic">"{b.notes}"</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onConductScreeningForBeneficiary(b)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {b.screeningStatus === 'completed' ? 'Update Screening' : 'Start Screening'}
                  </span>
                </button>

                {b.referralStatus !== 'referred_to_phc' ? (
                  <button
                    type="button"
                    onClick={() => handleMarkReferred(b.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Refer to PHC / Doctor</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-2 rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Referred to PHC</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-teal-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Register Village Beneficiary</h3>
            <p className="text-xs text-slate-500">
              Collect basic identification and verbal/written consent for health record storage.
            </p>

            <form onSubmit={handleAddBeneficiary} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Beneficiary Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Suman Devi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={12}
                    max={70}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Village / Ward / Landmark</label>
                <input
                  type="text"
                  required
                  value={villageWard}
                  onChange={(e) => setVillageWard(e.target.value)}
                  placeholder="e.g. Morija Ward 2, Near Panchayat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <label className="flex items-start gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="rounded-sm text-teal-600 focus:ring-teal-500 mt-0.5"
                />
                <span className="text-[11px] text-teal-900 font-medium">
                  I confirm that the beneficiary has provided explicit verbal or written consent for her menstrual and symptom data to be processed for risk screening.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
