import React, { useState } from 'react';
import {
  Heart,
  Globe,
  Mic,
  Calendar,
  User as UserIcon,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  Users,
  Shield,
  Activity,
  LogOut,
  Bell,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Layers,
  Cpu,
  TrendingUp,
  Dumbbell,
  Leaf,
  Compass,
} from 'lucide-react';
import { LanguageCode, Role, User } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  onOpenVoiceSaathi: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup' | 'otp') => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpen3DModal: () => void;
  onOpenSideMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  currentLanguage,
  setCurrentLanguage,
  onOpenVoiceSaathi,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  onOpen3DModal,
  onOpenSideMenu,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Essential top quick links to keep the navbar elegant & uncluttered
  const primaryNavLinks = [
    { id: 'landing', label: t('navHome'), icon: Heart },
    { id: 'screening', label: t('navScreen'), icon: Activity, badge: 'AI' },
    { id: 'period_tracker', label: t('navPeriodTracker'), icon: Calendar },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope },
    { id: 'anatomy3d', label: t('navAnatomy3D'), icon: Layers, isAction: true },
    { id: 'community', label: t('navCommunity'), icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-200/80 text-slate-800 shadow-xs">
      {/* Top Emergency & ASHA Support Quick Bar */}
      <div className="bg-[#FFF0F4] border-b border-rose-100 text-rose-900 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              StreeSure Care
            </span>
            <span className="hidden sm:inline text-rose-800/90 text-[11px] font-medium">
              {t('disclaimerBar')}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <a
              href="tel:104"
              className="flex items-center gap-1.5 hover:underline text-rose-800 font-bold"
              title="National Women Health Helpline"
            >
              <PhoneCall className="w-3 h-3 text-emerald-600" />
              <span>{t('helplineText')}</span>
            </a>
            <span className="text-rose-300">|</span>
            <button
              onClick={onOpenVoiceSaathi}
              className="flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 transition"
            >
              <Mic className="w-3 h-3 text-rose-600 animate-pulse" />
              <span>{t('talkToVoiceSaathi')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Brand Logo & Side Menu Quick Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Side Bar Menu Button */}
            {onOpenSideMenu && (
              <button
                type="button"
                id="btn-open-side-menu"
                onClick={onOpenSideMenu}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition font-bold text-xs shadow-2xs group"
                title="Open Complete Modules & Portals Menu"
              >
                <Compass className="w-4 h-4 text-rose-600 group-hover:rotate-45 transition-transform" />
                <span className="hidden sm:inline">
                  {currentLanguage === 'hi' ? 'मेनू (Modules)' : 'All Modules'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              </button>
            )}

            <button
              type="button"
              id="brand-logo-btn"
              onClick={() => setActiveTab(currentUser ? (currentUser.role === 'USER' ? 'landing' : `${currentUser.role.toLowerCase()}_dashboard`) : 'landing')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform font-black text-lg border border-white/40">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-sans">
                    STREESURE
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-wider">
                    v1.4
                  </span>
                </div>
                <p className="text-[10px] text-rose-700/80 font-medium leading-none">
                  {t('tagline')}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              if (link.isAction) {
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={onOpen3DModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 shadow-2xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-pink-600" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                      : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Voice Saathi Quick Trigger Button */}
            <button
              type="button"
              id="btn-voice-saathi-nav"
              onClick={onOpenVoiceSaathi}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-rose-primary text-xs font-bold transition-all hover:scale-102 shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="hidden sm:inline">{t('talkToVoiceSaathi')}</span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono font-bold">AI</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <select
                id="select-language"
                aria-label="Select Application Language"
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as LanguageCode)}
                className="appearance-none bg-[#FFF5F8] hover:bg-[#FDE8EF] text-rose-900 text-xs font-bold pl-7 pr-4 py-1.5 rounded-full border border-rose-200 cursor-pointer focus:outline-none focus:border-rose-400 transition"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-800">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-rose-600 absolute left-2.5 top-2 pointer-events-none" />
            </div>

            {/* Shopping Cart Button */}
            <button
              type="button"
              id="btn-cart"
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-rose-200 transition shadow-2xs"
              title="Affordable Care Store Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-logout"
                  onClick={onLogout}
                  title={t('signOut')}
                  className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-rose-200 transition shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="btn-sign-in-nav"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-slate-800 border border-rose-200 text-xs font-bold transition shadow-2xs"
                >
                  {t('signIn')}
                </button>
                <button
                  type="button"
                  id="btn-register-nav"
                  onClick={() => onOpenAuth('signup')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-full btn-rose-primary text-white text-xs font-bold transition shadow-2xs"
                >
                  {t('register')}
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => {
                if (onOpenSideMenu) {
                  onOpenSideMenu();
                } else {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              }}
              className="p-2 rounded-xl text-rose-800 hover:bg-rose-100 border border-rose-200 lg:hidden shadow-2xs"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

