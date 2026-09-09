import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { DemoTourBar } from './components/DemoTourBar';
import { LandingPage } from './components/LandingPage';
import { ScreeningView } from './components/ScreeningView';
import { ScreeningResultView } from './components/ScreeningResultView';
import { VoiceSaathiModal } from './components/VoiceSaathiModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { PeriodTrackerView } from './components/PeriodTrackerView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { ExercisePortalView } from './components/ExercisePortalView';
import { HomeRemediesPortalView } from './components/HomeRemediesPortalView';
import { DoctorConsultationView } from './components/DoctorConsultationView';
import { DoctorDashboardView } from './components/DoctorDashboardView';
import { AshaDashboardView } from './components/AshaDashboardView';
import { NgoDashboardView } from './components/NgoDashboardView';
import { CareStoreView } from './components/CareStoreView';
import { KnowledgeHubView } from './components/KnowledgeHubView';
import { CommunityMapView } from './components/CommunityMapView';
import { HealthJourneyView } from './components/HealthJourneyView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SmartKitFutureScopeView } from './components/SmartKitFutureScopeView';
import { Footer } from './components/Footer';
import { ThreeDModel } from './components/ThreeDModel';

import {
  AshaBeneficiary,
  CartItem,
  Consultation,
  HealthProfile,
  LanguageCode,
  Product,
  ScreeningResult,
  User,
} from './types';
import { DEMO_USERS, SEED_PRODUCTS } from './data/seedData';
import { calculateScreeningResult, defaultMockScreeningAnswers } from './services/screeningEngine';
import { X, Layers, Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('streesure_authenticated_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // fallback
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('hi');
  // Phase 8: restore the server-side HttpOnly session. LocalStorage is no longer
  // treated as proof of authentication.
  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('streesure_authenticated_user', JSON.stringify(data.user));
        }
      })
      .catch(() => { /* server may be unavailable while the static demo is open */ });
  }, []);


  // Screening State
  const [currentScreeningResult, setCurrentScreeningResult] = useState<ScreeningResult | null>(null);

  // Modals & Auth State
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isVoiceSaathiOpen, setIsVoiceSaathiOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('streesure_authenticated_user');
      const dismissed = sessionStorage.getItem('streesure_auth_dismissed');
      return !stored && !dismissed;
    } catch (e) {
      return false;
    }
  });
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Auth Handlers
  const handleOpenAuth = (mode: 'signin' | 'signup' | 'otp' = 'signin') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
    sessionStorage.setItem('streesure_auth_dismissed', 'true');
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('streesure_authenticated_user');
    setCurrentUser(null);
    setActiveTab('landing');
    handleOpenAuth('signin');
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: SEED_PRODUCTS[0], // Anandi pads
      quantity: 2,
    },
  ]);

  // Handle Screening Completed
  const handleScreeningComplete = (result: ScreeningResult) => {
    setCurrentScreeningResult(result);
    setActiveTab('screening_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Persist completed screening for the signed-in user. The UI remains
    // responsive even if the persistence API is temporarily unavailable.
    if (currentUser) {
      fetch(`/api/users/${encodeURIComponent(currentUser.id)}/screenings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      }).catch((error) => console.warn('Screening persistence unavailable:', error));
    }
  };

  // Handle Switch User / Role
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setCurrentLanguage(user.preferredLanguage);

    if (user.role === 'USER') setActiveTab('landing');
    else if (user.role === 'ASHA') setActiveTab('asha_dashboard');
    else if (user.role === 'DOCTOR') setActiveTab('doctor_dashboard');
    else if (user.role === 'NGO') setActiveTab('ngo_dashboard');
    else if (user.role === 'ADMIN') setActiveTab('admin_dashboard');
  };

  // Handle Demo Flow Trigger
  const handleTriggerDemoFlow = (flowStep: string) => {
    if (flowStep === 'voice_hindi') {
      setCurrentLanguage('hi');
      setIsVoiceSaathiOpen(true);
    } else if (flowStep === 'orange_result') {
      const mockOrange = calculateScreeningResult('usr_sunita', {
        ...defaultMockScreeningAnswers,
        cycleRegularity: 'infrequent_over_35',
        daysBetweenPeriods: 42,
        increasedFacialHair: 'moderate_to_severe',
      });
      setCurrentScreeningResult(mockOrange);
      setActiveTab('screening_result');
    }
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(
      cart.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((i) => i.product.id !== productId));
  };

  const handleCheckout = () => {
    setCart([]);
  };

  // ASHA field screening trigger
  const handleConductScreeningForBeneficiary = (beneficiary: AshaBeneficiary) => {
    setActiveTab('screening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] health-watermark-bg flex flex-col font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* 1. Quick Presentation / Evaluator Bar */}
      <DemoTourBar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onTriggerDemoFlow={handleTriggerDemoFlow}
        onOpen3DModal={() => setIs3DModalOpen(true)}
        onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
        onOpenSmartKit={() => {
          setActiveTab('smart_kit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Responsive Sticky Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setActiveTab('store')}
        onOpen3DModal={() => setIs3DModalOpen(true)}
      />

      {/* Side Navigation Drawer */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
        onOpen3DModal={() => setIs3DModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        currentLanguage={currentLanguage}
        onSwitchLanguage={setCurrentLanguage}
        onSwitchUser={handleSwitchUser}
      />

      {/* 3. Main Views Container */}
      <main className="flex-1">
        {/* LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            currentLanguage={currentLanguage}
            onStartScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
            onFindDoctor={() => {
              setActiveTab('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreKnowledge={() => {
              setActiveTab('knowledge');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onOpenStore={() => {
              setActiveTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCommunity={() => {
              setActiveTab('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToRole={(roleKey) => {
              const u = DEMO_USERS[roleKey as keyof typeof DEMO_USERS];
              if (u) handleSwitchUser(u);
            }}
            onOpenAuth={handleOpenAuth}
            onOpenSmartKit={() => {
              setActiveTab('smart_kit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProgressTracker={() => {
              setActiveTab('progress_tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenExercisePortal={() => {
              setActiveTab('exercise_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenHomeRemedies={() => {
              setActiveTab('home_remedies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* SCREENING QUESTIONNAIRE */}
        {activeTab === 'screening' && (
          <ScreeningView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onScreeningComplete={handleScreeningComplete}
            onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
          />
        )}

        {/* SCREENING RESULT & WHY DID I RECEIVE THIS RESULT */}
        {activeTab === 'screening_result' && (
          <ScreeningResultView
            result={
              currentScreeningResult ||
              calculateScreeningResult('usr_default', defaultMockScreeningAnswers)
            }
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onBookDoctor={() => {
              setActiveTab('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onConnectAsha={() => {
              setActiveTab('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTracker={() => {
              setActiveTab('period_tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onRetakeScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* PERIOD TRACKER */}
        {activeTab === 'period_tracker' && (
          <PeriodTrackerView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onStartScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* COMPREHENSIVE PROGRESS TRACKER */}
        {activeTab === 'progress_tracker' && (
          <ProgressTrackerView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenExercisePortal={() => {
              setActiveTab('exercise_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenHomeRemedies={() => {
              setActiveTab('home_remedies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onBookDoctor={() => {
              setActiveTab('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* EXERCISE & MOVEMENT PORTAL */}
        {activeTab === 'exercise_portal' && (
          <ExercisePortalView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenProgressTracker={() => {
              setActiveTab('progress_tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenHomeRemedies={() => {
              setActiveTab('home_remedies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* HOME REMEDIES & AYUSH PORTAL */}
        {activeTab === 'home_remedies' && (
          <HomeRemediesPortalView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenProgressTracker={() => {
              setActiveTab('progress_tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenExercisePortal={() => {
              setActiveTab('exercise_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* DOCTOR DIRECTORY & BOOKING */}
        {activeTab === 'doctors' && (
          <DoctorConsultationView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onConsultationBooked={(cns) => {
              if (currentUser) {
                fetch('/api/consultations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: currentUser.id, doctorId: cns.doctorId, ...cns }),
                }).catch((error) => console.warn('Consultation persistence unavailable:', error));
              }
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* DOCTOR PORTAL */}
        {activeTab === 'doctor_dashboard' && (
          <DoctorDashboardView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
          />
        )}

        {/* ASHA WORKER FIELD PORTAL */}
        {activeTab === 'asha_dashboard' && (
          <AshaDashboardView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onConductScreeningForBeneficiary={handleConductScreeningForBeneficiary}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
          />
        )}

        {/* NGO RURAL CAMPAIGNS */}
        {activeTab === 'ngo_dashboard' && (
          <NgoDashboardView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
          />
        )}

        {/* KNOWLEDGE & MYTH-BUSTING HUB */}
        {activeTab === 'knowledge' && (
          <KnowledgeHubView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
            onStartScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* AFFORDABLE CARE STORE */}
        {activeTab === 'store' && (
          <CareStoreView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        )}

        {/* COMMUNITY VILLAGE MAP */}
        {activeTab === 'community' && (
          <CommunityMapView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
          />
        )}

        {/* HEALTH JOURNEY CARE PATHWAY */}
        {activeTab === 'health_journey' && (
          <HealthJourneyView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onStartScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookDoctor={() => {
              setActiveTab('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTracker={() => {
              setActiveTab('period_tracker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpen3DModal={() => setIs3DModalOpen(true)}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin_dashboard' && (
          <AdminDashboardView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpen3DModal={() => setIs3DModalOpen(true)}
          />
        )}

        {/* FUTURE SCOPE: STREESURE SMART SCREENING KIT */}
        {activeTab === 'smart_kit' && (
          <SmartKitFutureScopeView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
            onOpenScreening={() => {
              setActiveTab('screening');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDoctors={() => {
              setActiveTab('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
        onOpen3DModal={() => setIs3DModalOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Voice Saathi Modal (Voice Navigation & Assistant) */}
      <VoiceSaathiModal
        isOpen={isVoiceSaathiOpen}
        onClose={() => setIsVoiceSaathiOpen(false)}
        currentUser={currentUser}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpen3DModal={() => setIs3DModalOpen(true)}
      />

      {/* 6. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        initialMode={authInitialMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentLanguage(user.preferredLanguage);
          if (!user.healthProfileCompleted && user.role === 'USER') {
            setIsOnboardingOpen(true);
          }
        }}
        currentLanguage={currentLanguage}
      />

      {/* 7. Onboarding Health Profile Wizard */}
      {isOnboardingOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <OnboardingWizard
              user={currentUser}
              onComplete={(profile: HealthProfile) => {
                // Save the health profile server-side and update the local session
                // so the onboarding wizard does not reappear on the next visit.
                fetch(`/api/users/${encodeURIComponent(currentUser.id)}/profile`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(profile),
                })
                  .then(async (response) => {
                    if (!response.ok) throw new Error(`Profile save failed (${response.status})`);
                    const updatedUser = { ...currentUser, healthProfileCompleted: true };
                    setCurrentUser(updatedUser);
                    localStorage.setItem('streesure_authenticated_user', JSON.stringify(updatedUser));
                  })
                  .catch((error) => {
                    console.warn('Health profile persistence unavailable:', error);
                    // Preserve the existing demo/offline experience.
                    const updatedUser = { ...currentUser, healthProfileCompleted: true };
                    setCurrentUser(updatedUser);
                    localStorage.setItem('streesure_authenticated_user', JSON.stringify(updatedUser));
                  })
                  .finally(() => setIsOnboardingOpen(false));
              }}
              onSkip={() => setIsOnboardingOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 8. Dedicated 3D Pelvic & Ovarian Cycle Visualizer Modal */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09050d]/85 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="glass-blossom-glow rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Interactive 3D Pelvic & Ovarian Visualizer</span>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full">
                      Three.js Simulation
                    </span>
                  </h3>
                  <p className="text-xs text-rose-200/70 font-medium">
                    Explore Normal Ovulatory Cycles vs. PCOS Follicular Morphology
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-3d-modal"
                onClick={() => setIs3DModalOpen(false)}
                className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ThreeDModel initialMode="pcos" interactive={true} />

            <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-100/90 space-y-2">
              <div className="font-bold flex items-center gap-2 text-rose-300 uppercase tracking-wider text-xs">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Clinical Anatomical Observation Matrix:</span>
              </div>
              <p className="leading-relaxed text-slate-200">
                In a typical menstrual cycle, one follicle matures to release a viable egg during ovulation. In PCOS, slight hormonal variations (elevated LH/androgens or insulin resistance) pause follicular maturation, causing multiple small, harmless fluid-filled sacs (&lt;9mm) to gather around the ovary's cortex, known clinically as the <strong className="text-pink-300 font-semibold">"String of Pearls"</strong> sign.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
