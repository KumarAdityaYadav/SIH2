import React from 'react';
import {
  Heart,
  PhoneCall,
  ShieldCheck,
  Globe,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface FooterProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenVoiceSaathi: () => void;
  onOpen3DModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenVoiceSaathi,
  onOpen3DModal,
  onNavigateTab,
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);

  return (
    <footer className="bg-[#09040e] text-slate-100 pt-16 pb-12 border-t border-rose-500/20 selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Emergency & Helpline Grid */}
        <div className="glass-blossom-card rounded-3xl p-6 sm:p-8 border border-rose-500/25 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-rose-400 font-semibold uppercase text-[11px] tracking-wider block">
                24x7 Government & Emergency Helplines (Toll-Free)
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Immediate Healthcare & Women Support Lines in India
              </h3>
              <p className="text-xs text-rose-200/70 max-w-xl">
                If you are experiencing severe pain, abnormal hemorrhage, or need urgent medical attention, dial 104 or visit the nearest Community Health Centre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:104"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#12081a] hover:bg-[#1a0e26] border border-rose-500/20 hover:border-teal-500/40 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-500/30">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">104</span>
                  <span className="text-[10px] text-rose-300/70">National Health Helpline</span>
                </div>
              </a>

              <a
                href="tel:181"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#12081a] hover:bg-[#1a0e26] border border-rose-500/20 hover:border-rose-400 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-500/30">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">181</span>
                  <span className="text-[10px] text-rose-300/70">Women in Distress Line</span>
                </div>
              </a>

              <a
                href="tel:108"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#12081a] hover:bg-[#1a0e26] border border-rose-500/20 hover:border-pink-400 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0 border border-pink-500/30">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">108</span>
                  <span className="text-[10px] text-rose-300/70">Emergency Medical</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] border border-pink-300/40">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">STREESURE</span>
            </div>
            <p className="text-xs text-rose-200/70 leading-relaxed max-w-sm">
              {t('brandDescription')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act (India) Compliant • Privacy-First</span>
            </div>
          </div>

          {/* Col 2: Core Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-rose-200/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('screening')}
                  className="hover:text-rose-300 transition"
                >
                  {t('navScreening')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('smart_kit')}
                  className="hover:text-pink-300 transition flex items-center gap-1.5"
                >
                  <span>{t('navSmartKit')}</span>
                  <span className="text-[9px] font-bold bg-pink-900/80 border border-pink-500/40 text-pink-300 px-1.5 py-0.2 rounded-full">
                    Future Scope
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenVoiceSaathi}
                  className="hover:text-rose-300 transition flex items-center gap-1"
                >
                  <span>{t('navVoiceAssistant')}</span>
                  <span className="text-[9px] font-bold bg-rose-900/80 border border-rose-500/40 text-rose-300 px-1.5 py-0.2 rounded-full">
                    Voice
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpen3DModal}
                  className="hover:text-pink-300 transition"
                >
                  {t('navAnatomy3D')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('period_tracker')}
                  className="hover:text-rose-300 transition"
                >
                  {t('navPeriodTracker')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('doctors')}
                  className="hover:text-rose-300 transition"
                >
                  {t('navDoctors')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Grassroots */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              {t('navCommunity')}
            </h4>
            <ul className="space-y-2 text-xs text-rose-200/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('asha_dashboard')}
                  className="hover:text-teal-300 transition"
                >
                  {t('ashaWorkerLogin')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('ngo_dashboard')}
                  className="hover:text-teal-300 transition"
                >
                  {t('ngoPartnerLogin')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('community')}
                  className="hover:text-teal-300 transition"
                >
                  {t('navCommunity')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('store')}
                  className="hover:text-teal-300 transition"
                >
                  {t('navStore')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('knowledge')}
                  className="hover:text-teal-300 transition"
                >
                  {t('navKnowledgeHub')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Languages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              {t('chooseLanguage')}
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-rose-200/70">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code)}
                  className={`text-left hover:text-white transition ${
                    currentLanguage === l.code ? 'font-bold text-rose-400' : ''
                  }`}
                >
                  {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="pt-8 border-t border-rose-500/20 text-[11px] text-rose-200/70 leading-relaxed space-y-2">
          <p>
            <strong className="text-rose-200">CRITICAL MEDICAL DISCLAIMER:</strong> {t('medicalDisclaimer')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-rose-300/50 text-[10px] pt-4 border-t border-rose-500/10 gap-2">
            <span>© 2026 StreeSure Health Platform. Built for Smart India Hackathon & Grassroots Impact.</span>
            <span>Ethical AI • Consent-First • Privacy Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
