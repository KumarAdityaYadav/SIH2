import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Plus,
  CheckCircle2,
  Sparkles,
  Award,
  Globe,
  Share2,
} from 'lucide-react';
import { Campaign, LanguageCode, User } from '../types';
import { SEED_CAMPAIGNS } from '../data/seedData';

interface NgoDashboardViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
}

export const NgoDashboardView: React.FC<NgoDashboardViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Campaign Form
  const [title, setTitle] = useState('');
  const [villageDistrict, setVillageDistrict] = useState('');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState(250);
  const [campaignDate, setCampaignDate] = useState('2026-09-10');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: Campaign = {
      id: 'camp_' + Date.now(),
      ngoId: currentUser?.id || 'ngo_saheli',
      ngoName: currentUser?.fullName || 'Saheli Women Health Foundation',
      title,
      villageDistrict,
      targetBeneficiaries,
      screenedBeneficiaries: 0,
      ashaWorkersInvolved: 4,
      kitsDistributed: 0,
      campaignDate,
      status: 'planned',
    };

    setCampaigns([newCamp, ...campaigns]);
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO Grassroots Health Coalition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {currentUser?.fullName || 'Saheli Women Health Foundation'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Driving rural awareness camps, distributing subsidized period hygiene kits, and organizing ASHA field clusters across Rajasthan & UP.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Village Camp</span>
        </button>
      </div>

      {/* KPI Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Campaigns
          </span>
          <span className="text-3xl font-black text-slate-900">{campaigns.length}</span>
          <p className="text-[11px] text-slate-500 mt-1">Villages covered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Women Screened
          </span>
          <span className="text-3xl font-black text-emerald-700">
            {campaigns.reduce((sum, c) => sum + c.screenedBeneficiaries, 0)}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Assisted by field team</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Care Kits Distributed
          </span>
          <span className="text-3xl font-black text-teal-700">
            {campaigns.reduce((sum, c) => sum + c.kitsDistributed, 0)}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Biodegradable & cloth kits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            ASHA Workers Mobilized
          </span>
          <span className="text-3xl font-black text-indigo-700">22</span>
          <p className="text-[11px] text-slate-500 mt-1">Across 8 Gram Panchayats</p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Rural Awareness & Screening Camps</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(campaigns || []).map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{camp.title}</h3>
                  <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{camp.villageDistrict}</span>
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    camp.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : camp.status === 'completed'
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {camp.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Screened</span>
                  <span className="font-bold text-slate-900">
                    {camp.screenedBeneficiaries} / {camp.targetBeneficiaries}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ASHA Team</span>
                  <span className="font-bold text-slate-900">{camp.ashaWorkersInvolved}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Kits Given</span>
                  <span className="font-bold text-emerald-700">{camp.kitsDistributed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date: {new Date(camp.campaignDate).toLocaleDateString()}</span>
                </span>
                <button
                  type="button"
                  onClick={onOpen3DModal}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  Use 3D Demo in Camp ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Camp Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Schedule Village Health Camp</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Amber Block Adolescent & PCOS Camp"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Village & District</label>
                <input
                  type="text"
                  required
                  value={villageDistrict}
                  onChange={(e) => setVillageDistrict(e.target.value)}
                  placeholder="e.g. Achrol Village, Amber Block, Jaipur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Beneficiaries
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={2000}
                    value={targetBeneficiaries}
                    onChange={(e) => setTargetBeneficiaries(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campaign Date</label>
                  <input
                    type="date"
                    required
                    value={campaignDate}
                    onChange={(e) => setCampaignDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
