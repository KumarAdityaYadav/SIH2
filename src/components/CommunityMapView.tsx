import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { LanguageCode, User } from '../types';

interface CommunityMapViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpen3DModal: () => void;
}

export const CommunityMapView: React.FC<CommunityMapViewProps> = ({
  currentUser,
  currentLanguage,
  onOpen3DModal,
}) => {
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  const campLocations = [
    {
      id: 'camp_1',
      name: 'Chomu Block ASHA Cluster Camp',
      district: 'Jaipur, Rajasthan',
      ashaLead: 'Radha Devi (ASHA)',
      womenScreened: 180,
      nextCampDate: 'Aug 28, 2026',
      x: 35,
      y: 40,
      status: 'active',
    },
    {
      id: 'camp_2',
      name: 'Govindgarh Gram Panchayat Camp',
      district: 'Jaipur, Rajasthan',
      ashaLead: 'Kavita Sharma (ASHA)',
      womenScreened: 120,
      nextCampDate: 'Sep 02, 2026',
      x: 48,
      y: 32,
      status: 'active',
    },
    {
      id: 'camp_3',
      name: 'Morija Village Health Awareness',
      district: 'Jaipur, Rajasthan',
      ashaLead: 'Mamta Saini (ASHA)',
      womenScreened: 95,
      nextCampDate: 'Sep 05, 2026',
      x: 62,
      y: 55,
      status: 'planned',
    },
    {
      id: 'camp_4',
      name: 'Amber Block Adolescent Care Drive',
      district: 'Jaipur Rural, Rajasthan',
      ashaLead: 'Pooja Choudhary (ASHA)',
      womenScreened: 210,
      nextCampDate: 'Sep 12, 2026',
      x: 25,
      y: 65,
      status: 'planned',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Grassroots Reach Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Rural Women's Health & Camp Network
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-xl">
            Interactive village map connecting Gram Panchayat screening drives, ASHA cluster coverage, and partner Primary Health Centres (PHCs).
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen3DModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md transition shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Launch 3D Camp Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Map Container */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Rajasthan Cluster 01: Jaipur Rural & Semi-Urban</span>
            </h2>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
              4 Active Village Hubs
            </span>
          </div>

          {/* Map Canvas Mock with interactive nodes */}
          <div className="relative w-full h-80 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#0d9488 1px, transparent 1px), radial-gradient(#0d9488 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Simulated Village Hub Pins */}
            {(campLocations || []).map((camp) => (
              <button
                key={camp.id}
                type="button"
                onClick={() => setSelectedPin(camp)}
                style={{ left: `${camp.x}%`, top: `${camp.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-transform hover:scale-125 focus:outline-hidden ${
                  selectedPin?.id === camp.id
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200'
                    : 'bg-teal-700 text-white'
                }`}
                title={camp.name}
              >
                <MapPin className="w-4 h-4" />
              </button>
            ))}

            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Click on any map pin to view camp schedule & ASHA lead</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Camp Details or Roster */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPin ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md uppercase">
                  Village Health Hub
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPin(null)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900">{selectedPin.name}</h3>
              <p className="text-xs text-slate-500">{selectedPin.district}</p>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">ASHA Lead:</span>
                  <span className="font-bold text-slate-800">{selectedPin.ashaLead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Women Screened:</span>
                  <span className="font-bold text-teal-700">{selectedPin.womenScreened}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upcoming Camp:</span>
                  <span className="font-bold text-slate-800">{selectedPin.nextCampDate}</span>
                </div>
              </div>

              <a
                href="tel:104"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Community Coordinator</span>
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Health Drives</h3>
              <div className="space-y-2.5">
                {(campLocations || []).map((camp) => (
                  <button
                    key={camp.id}
                    type="button"
                    onClick={() => setSelectedPin(camp)}
                    className="w-full p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-left transition"
                  >
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {camp.name}
                    </span>
                    <span className="text-[11px] text-teal-700 block">
                      Lead: {camp.ashaLead} • {camp.nextCampDate}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
