import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Mic,
  Calendar,
  Stethoscope,
  BookOpen,
  Users,
  ShoppingBag,
  Layers,
  Cpu,
  TrendingUp,
  Dumbbell,
  Leaf,
  Shield,
  X,
  Search,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Globe,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { LanguageCode, Role, User } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../services/translations';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenVoiceSaathi: () => void;
  onOpen3DModal: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'otp') => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'clinical' | 'daily' | 'doctor' | 'portals';
  isAction?: boolean;
  badge?: string;
  color: string;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeTab,
  onNavigateTab,
  currentLanguage,
  onLanguageChange,
  onOpenVoiceSaathi,
  onOpen3DModal,
  onOpenAuth,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const menuItems: MenuItem[] = [
    // Clinical & Screening
    {
      id: 'screening',
      titleKey: 'navScreen',
      descKey: 'Clinical Rotterdam 2023 2-min risk assessment & symptom analyzer',
      icon: Activity,
      category: 'clinical',
      badge: 'Free AI',
      color: 'from-rose-500 to-pink-500',
    },
    {
      id: 'anatomy3d',
      titleKey: 'navAnatomy3D',
      descKey: 'Interactive 3D Pelvic & Ovarian Follicle morphology simulation',
      icon: Layers,
      category: 'clinical',
      isAction: true,
      badge: 'Three.js 3D',
      color: 'from-pink-500 to-purple-500',
    },
    {
      id: 'smart_kit',
      titleKey: 'navSmartKit',
      descKey: 'Non-invasive sweat & salivary biomarker sensor integration',
      icon: Cpu,
      category: 'clinical',
      badge: 'Future Tech',
      color: 'from-indigo-500 to-blue-500',
    },

    // Daily Wellness
    {
      id: 'period_tracker',
      titleKey: 'navPeriodTracker',
      descKey: 'Log cycles, luteal phase delays, spotting & flow anomalies',
      icon: Calendar,
      category: 'daily',
      badge: 'Smart Log',
      color: 'from-rose-500 to-red-500',
    },
    {
      id: 'progress_tracker',
      titleKey: 'navProgressTracker',
      descKey: 'Track sleep, water, stress, acanthosis & symptom scores over time',
      icon: TrendingUp,
      category: 'daily',
      badge: 'Daily Matrix',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'exercise_portal',
      titleKey: 'navExercisePortal',
      descKey: 'Low-cortisol strength routines, pelvic yoga & HIIT alternatives',
      icon: Dumbbell,
      category: 'daily',
      badge: 'Video Guided',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'home_remedies',
      titleKey: 'navHomeRemedies',
      descKey: 'Evidence-based Myo-Inositol, Spearmint, Methi & herbal science',
      icon: Leaf,
      category: 'daily',
      badge: 'AYUSH Validated',
      color: 'from-emerald-500 to-teal-500',
    },

    // Doctor & Care
    {
      id: 'doctors',
      titleKey: 'navDoctors',
      descKey: 'Book private, verified teleconsultations with female gynecologists for ₹199',
      icon: Stethoscope,
      category: 'doctor',
      badge: '₹199 Consult',
      color: 'from-rose-600 to-pink-600',
    },
    {
      id: 'community',
      titleKey: 'navCommunity',
      descKey: 'Find nearby ASHA workers, PHC centers & rural reproductive camps',
      icon: Users,
      category: 'doctor',
      badge: 'Grassroots',
      color: 'from-teal-600 to-emerald-600',
    },
    {
      id: 'store',
      titleKey: 'navCareStore',
      descKey: 'Subsidized biodegradable pads, Inositol supplements & testing kits',
      icon: ShoppingBag,
      category: 'doctor',
      badge: 'Care Store',
      color: 'from-pink-600 to-rose-600',
    },

    // Portals & Education
    {
      id: 'knowledge',
      titleKey: 'navKnowledgeHub',
      descKey: 'Myth-busting articles, clinical research, hormonal biomarkers & podcasts',
      icon: BookOpen,
      category: 'portals',
      badge: 'Clinical Hub',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'asha_dashboard',
      titleKey: 'ashaFieldPortal',
      descKey: 'Rural beneficiary screening, Hindi voice triage & offline field sync',
      icon: Heart,
      category: 'portals',
      badge: 'ASHA Didi',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'doctor_dashboard',
      titleKey: 'doctorLogin',
      descKey: 'Patient queue, Rotterdam ultrasound staging & prescription management',
      icon: Stethoscope,
      category: 'portals',
      badge: 'Doctor Clinic',
      color: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'ngo_dashboard',
      titleKey: 'ngoOperations',
      descKey: 'District prevalence telemetry, subsidized kit supply & rural camps',
      icon: Globe,
      category: 'portals',
      badge: 'NGO Ops',
      color: 'from-rose-500 to-orange-500',
    },
    {
      id: 'admin_dashboard',
      titleKey: 'adminAnalytics',
      descKey: 'National health telemetry, clinical engine audit & governance',
      icon: Shield,
      category: 'portals',
      badge: 'Admin Panel',
      color: 'from-slate-700 to-slate-900',
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      t(item.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel from Right */}
      <aside
        aria-label="Platform Navigation Menu"
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-white border-l border-rose-100 shadow-2xl flex flex-col health-watermark-bg">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white relative shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight flex items-center gap-1.5">
                    <span>StreeSure Navigation Hub</span>
                    <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold uppercase">
                      All Modules
                    </span>
                  </h2>
                  <p className="text-xs text-rose-100/90 font-medium">
                    {currentLanguage === 'hi' ? 'सभी सुविधाएं और स्वास्थ्य पोर्टल' : 'Explore complete care & screening tools'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition border border-white/20"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Voice Saathi Bar inside Header */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceSaathi();
                }}
                className="flex-1 bg-white text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>{currentLanguage === 'hi' ? '🎙️ वॉयस साथी से पूछें' : '🎙️ Talk to Voice Saathi'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpen3DModal();
                }}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Model</span>
              </button>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="p-4 bg-[#FFF5F8] border-b border-rose-100 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={currentLanguage === 'hi' ? 'सुविधाएं या लक्षण खोजें...' : 'Search tools, symptoms, doctors...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: currentLanguage === 'hi' ? 'सभी' : 'All' },
                { id: 'clinical', label: currentLanguage === 'hi' ? 'जांच (Screening)' : 'Clinical' },
                { id: 'daily', label: currentLanguage === 'hi' ? 'दैनिक वेलनेस' : 'Daily Wellness' },
                { id: 'doctor', label: currentLanguage === 'hi' ? 'डॉक्टर व केयर' : 'Doctor & Care' },
                { id: 'portals', label: currentLanguage === 'hi' ? 'पोर्टल व ज्ञान' : 'Portals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition text-[11px] ${
                    selectedCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    if (item.isAction) {
                      onOpen3DModal();
                    } else {
                      onNavigateTab(item.id);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl transition border group relative overflow-hidden flex items-start gap-3.5 ${
                    isActive
                      ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/30 shadow-xs'
                      : 'bg-white hover:bg-rose-50/50 border-rose-100 hover:border-rose-200 shadow-2xs'
                  }`}
                >
                  {/* Icon with gradient badge */}
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition truncate">
                        {t(item.titleKey)}
                      </h4>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.descKey}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition shrink-0 mt-2.5" />
                </button>
              );
            })}
          </div>

          {/* Footer inside Drawer */}
          <div className="p-4 bg-[#FFF5F8] border-t border-rose-100 space-y-3">
            {/* Language switch & Emergency */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                  className="bg-white text-slate-800 text-xs font-bold py-1 px-2 rounded-lg border border-rose-200"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeLabel} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>

              <a
                href="tel:104"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs"
              >
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                <span>Helpline 104</span>
              </a>
            </div>

            {/* Auth / Profile status */}
            <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] font-semibold text-rose-600 uppercase">
                      Role: {currentUser.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth('signin');
                    }}
                    className="flex-1 py-2 rounded-xl bg-white text-slate-800 border border-rose-200 font-bold text-xs hover:bg-rose-50 transition text-center shadow-2xs"
                  >
                    {t('signIn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth('signup');
                    }}
                    className="flex-1 py-2 rounded-xl btn-rose-primary text-white font-bold text-xs transition text-center"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
