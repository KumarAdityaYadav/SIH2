import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  Check,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle2,
  HeartHandshake,
  Shield,
  Stethoscope,
  Users,
  Building,
  Smartphone,
  MapPin,
  Heart,
} from 'lucide-react';
import { LanguageCode, Role, User } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentLanguage: LanguageCode;
  initialMode?: 'signin' | 'signup' | 'otp';
}

type AuthTab = 'signin' | 'signup' | 'forgot';
type SignInMethod = 'password' | 'otp';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLanguage,
  initialMode = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );
  const [signInMethod, setSignInMethod] = useState<SignInMethod>(
    initialMode === 'otp' ? 'otp' : 'password'
  );

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields - Sign Up
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [age, setAge] = useState<number>(24);
  const [selectedRole, setSelectedRole] = useState<Role>('USER');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(currentLanguage);
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [consentHealthData, setConsentHealthData] = useState(true);
  const [consentTerms, setConsentTerms] = useState(true);

  // Forgot Password Fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // OTP State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpContext, setOtpContext] = useState<'signin' | 'signup' | 'forgot'>('signup');
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [otpTarget, setOtpTarget] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset tab on open
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'signup') {
        setActiveTab('signup');
      } else {
        setActiveTab('signin');
        if (initialMode === 'otp') setSignInMethod('otp');
      }
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Helper to generate and simulate OTP
  const triggerOtpGeneration = (target: string, context: 'signin' | 'signup' | 'forgot') => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpTarget(target);
    setOtpContext(context);
    setIsOtpStep(true);
    setOtpTimer(30);
    setEnteredOtp(['', '', '', '']);
    setErrorMsg('');

    // Simulate SMS toast alert
    setOtpNotification(
      `📲 StreeSure SMS Gateway: Your verification OTP is ${randomOtp}. Valid for 10 minutes.`
    );
    setTimeout(() => {
      setOtpNotification(null);
    }, 8000);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { label: string; score: number; color: string } => {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 10) score += 1;

    if (score === 1) return { label: 'Basic', score: 1, color: 'bg-rose-500' };
    if (score === 2) return { label: 'Good', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong & Secure', score: 3, color: 'bg-emerald-500' };
  };

  // Handle standard password login through the server session API.
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: loginIdentifier.trim(), password: loginPassword }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.user) throw new Error(data.error || 'Unable to sign in');
      localStorage.setItem('streesure_authenticated_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      onClose();
    } catch (error: any) {
      setErrorMsg(error?.message || 'Unable to sign in. Please check your details.');
    } finally { setIsLoading(false); }
  };

  // Handle OTP sign-in request
  const handleSendLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    triggerOtpGeneration(`+91 ${cleanNumber.slice(-10)}`, 'signin');
  };

  // Handle Sign-Up Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (email && !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.');
      return;
    }
    if (!consentHealthData || !consentTerms) {
      setErrorMsg('Please accept the health data processing and terms of service.');
      return;
    }

    // Trigger OTP verification for registration
    triggerOtpGeneration(`+91 ${cleanNumber.slice(-10)}`, 'signup');
  };

  // Handle Forgot Password OTP request
  const handleSendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile number.');
      return;
    }

    triggerOtpGeneration(forgotIdentifier, 'forgot');
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...enteredOtp];
    updated[index] = val;
    setEnteredOtp(updated);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Auto-fill test OTP code
  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setEnteredOtp(digits);
    setErrorMsg('');
  };

  // Verify the local demo OTP, then create the account on the server.
  const handleVerifyOtpSubmit = async () => {
    setErrorMsg('');
    const code = enteredOtp.join('');
    if (code.length !== 4) { setErrorMsg('Please enter the complete 4-digit OTP code.'); return; }
    if (code !== generatedOtp && code !== '1234' && code !== '4829') { setErrorMsg('Invalid OTP code. Please enter the correct code or click "Auto-fill Code".'); return; }
    if (otpContext === 'forgot') { setErrorMsg('Password reset is not enabled in local Phase 9. Use password login or create a new account.'); return; }
    setIsLoading(true);
    try {
      const cleanPhone = (mobileNumber || loginIdentifier || '9876543210').replace(/\D/g, '').slice(-10);
      const response = await fetch('/api/auth/signup', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: fullName.trim() || 'Verified StreeSure Member', email: email.trim() || `${cleanPhone}@streesure.org`, phone: `+91 ${cleanPhone}`, password, preferredLanguage: preferredLang }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.user) throw new Error(data.error || 'Unable to create account');
      localStorage.setItem('streesure_authenticated_user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
      onClose();
    } catch (error: any) { setErrorMsg(error?.message || 'Unable to create the account.'); }
    finally { setIsLoading(false); }
  };

  // 1-Click Demo Profiles
  const handleQuickDemoLogin = async (userKey: keyof typeof DEMO_USERS) => {
    setErrorMsg(''); setIsLoading(true);
    try {
      const response = await fetch('/api/auth/demo-login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userKey }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.user) throw new Error(data.error || 'Demo login unavailable');
      localStorage.setItem('streesure_authenticated_user', JSON.stringify(data.user));
      onLoginSuccess(data.user); onClose();
    } catch (error: any) { setErrorMsg(error?.message || 'Demo login unavailable. Start the StreeSure server first.'); }
    finally { setIsLoading(false); }
  };


  const pwdStrength = getPasswordStrength(password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* SMS Alert Toast Simulation */}
      {otpNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 max-w-md w-full px-4 animate-in slide-in-from-top duration-300">
          <div className="p-3.5 rounded-2xl bg-emerald-900 border-2 border-emerald-400 text-emerald-50 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700/80 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-emerald-200 block">Simulated SMS Delivery</span>
              <span className="text-white font-medium">{otpNotification}</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="ml-auto px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shrink-0 transition shadow-sm"
            >
              Fill OTP
            </button>
          </div>
        </div>
      )}

      <div
        id="auth-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative max-h-[92vh] overflow-y-auto text-slate-900"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-rose-50 transition"
          title="Close / Explore Platform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1-Click Fast Evaluator Login Strip */}
        <div className="mb-6 p-4 bg-[#FFF5F8] rounded-2xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-black text-rose-900">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>1-Click Hackathon Evaluator Profiles:</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Instant Login
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              id="btn-demo-user"
              onClick={() => handleQuickDemoLogin('user')}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-rose-100/70 border border-rose-200 font-bold text-rose-900 text-xs truncate text-center transition shadow-2xs"
            >
              👩‍🦰 Beneficiary (Sunita)
            </button>
            <button
              type="button"
              id="btn-demo-asha"
              onClick={() => handleQuickDemoLogin('asha')}
              className="px-2.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 font-bold text-teal-900 text-xs truncate text-center transition shadow-2xs"
            >
              👩‍⚕️ ASHA (Radha Devi)
            </button>
            <button
              type="button"
              id="btn-demo-doctor"
              onClick={() => handleQuickDemoLogin('doctor')}
              className="px-2.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold text-indigo-900 text-xs truncate text-center transition shadow-2xs"
            >
              🩺 Doctor (Dr. Ananya)
            </button>
            <button
              type="button"
              id="btn-demo-ngo"
              onClick={() => handleQuickDemoLogin('ngo')}
              className="px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold text-emerald-900 text-xs truncate text-center transition shadow-2xs"
            >
              🤝 NGO Partner
            </button>
            <button
              type="button"
              id="btn-demo-admin"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold text-amber-900 text-xs truncate text-center transition shadow-2xs"
            >
              🛡️ System Admin
            </button>
            <button
              type="button"
              id="btn-demo-guest"
              onClick={onClose}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-slate-800 text-xs truncate text-center transition shadow-2xs"
            >
              ⚡ Explore as Guest
            </button>
          </div>
        </div>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
            {isOtpStep ? (
              <Smartphone className="w-6 h-6" />
            ) : activeTab === 'signup' ? (
              <UserIcon className="w-6 h-6" />
            ) : activeTab === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isOtpStep
              ? 'Verify Mobile OTP'
              : activeTab === 'signup'
              ? 'Create StreeSure Account'
              : activeTab === 'forgot'
              ? 'Reset Account Password'
              : 'Sign In to StreeSure'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-normal leading-relaxed">
            {isOtpStep
              ? `Enter the 4-digit verification code sent to ${otpTarget}`
              : activeTab === 'signup'
              ? 'Join StreeSure for early PCOS screening, period tracking, voice assistance & certified consultations.'
              : activeTab === 'forgot'
              ? 'Enter your registered mobile or email to receive a password reset OTP.'
              : 'Access your personalized symptom telemetry, screening reports & care history.'}
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary Auth Tabs: Sign In / Sign Up */}
        {!isOtpStep && activeTab !== 'forgot' && (
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-5">
            <button
              type="button"
              id="tab-btn-signin"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'btn-rose-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="tab-btn-signup"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? 'btn-rose-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* -------------------- VIEW 1: OTP VERIFICATION STEP -------------------- */}
        {isOtpStep ? (
          <div className="space-y-5">
            <div className="bg-[#FFF5F8] p-5 rounded-2xl border border-rose-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-700 font-medium">
                <span>Code sent to:</span>
                <strong className="text-slate-900 font-mono font-bold">{otpTarget}</strong>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={enteredOtp[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-2xl font-black font-mono rounded-xl bg-white border-2 border-rose-300 text-slate-900 focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-200 shadow-2xs"
                  />
                ))}
              </div>

              {/* Quick Helper Badge */}
              <div className="flex items-center justify-between text-xs pt-2 px-1 border-t border-rose-100">
                <span className="text-slate-600 text-xs font-medium">
                  Simulated Code: <strong className="text-rose-700 font-mono font-black">{generatedOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-rose-600 hover:text-rose-800 font-bold text-xs underline"
                >
                  Auto-fill Code
                </button>
              </div>
            </div>

            {/* Resend OTP / Timer */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-600 font-medium">
              <span>Didn't receive code?</span>
              {otpTimer > 0 ? (
                <span className="text-slate-500 font-mono font-bold">
                  Resend in {otpTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerOtpGeneration(otpTarget, otpContext)}
                  className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="btn-verify-otp-submit"
                onClick={handleVerifyOtpSubmit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl btn-rose-primary text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                ← Back to Edit Details
              </button>
            </div>
          </div>
        ) : activeTab === 'signin' ? (
          /* -------------------- VIEW 2: SIGN IN (PASSWORD OR OTP) -------------------- */
          <div className="space-y-4">
            {/* Sub-tabs: Password Login vs OTP Login */}
            <div className="flex gap-2 border-b border-rose-100 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setSignInMethod('password')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  signInMethod === 'password'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setSignInMethod('otp')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  signInMethod === 'otp'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mobile Number OTP
              </button>
            </div>

            {signInMethod === 'password' ? (
              /* Password Login Form */
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email Address or Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-login-identifier"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. sunita@example.com or 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('forgot');
                        setErrorMsg('');
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="input-login-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm bg-white border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Login Form */
              <form onSubmit={handleSendLoginOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 flex items-center">
                      🇮🇳 +91
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        id="input-login-phone"
                        required
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    We will send a 4-digit verification SMS code to your phone.
                  </p>
                </div>

                <button
                  type="submit"
                  id="btn-send-login-otp"
                  className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate & Send OTP</span>
                </button>
              </form>
            )}
          </div>
        ) : activeTab === 'signup' ? (
          /* -------------------- VIEW 3: SIGN UP (CREATE ACCOUNT) -------------------- */
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-signup-name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sunita Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Mobile Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="input-signup-mobile"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="input-signup-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sunita@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Age, Language & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Age</label>
                <input
                  type="number"
                  min={12}
                  max={75}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Preferred Language</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-bold"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-white text-slate-900">
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Account Role / Profile Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-bold"
              >
                <option value="USER" className="bg-white text-slate-900">
                  👩‍🦰 Beneficiary / Woman (Self-Care & Period Tracking)
                </option>
                <option value="ASHA" className="bg-white text-slate-900">
                  👩‍⚕️ ASHA Field Worker / Sangini (Rural Surveys)
                </option>
                <option value="DOCTOR" className="bg-white text-slate-900">
                  🩺 Registered Gynecologist / Doctor
                </option>
                <option value="NGO" className="bg-white text-slate-900">
                  🤝 NGO Field Partner (Health Camps)
                </option>
                <option value="ADMIN" className="bg-white text-slate-900">
                  🛡️ Healthcare Administrator
                </option>
              </select>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Create Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-signup-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="input-signup-confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Password Strength:</span>
                  <span className="font-bold text-slate-800">{pwdStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-200'}`} />
                </div>
              </div>
            )}

            {/* Location & Emergency Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">City / District</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jaipur, RJ"
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Optional +91..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={consentHealthData}
                  onChange={(e) => setConsentHealthData(e.target.checked)}
                  className="mt-0.5 rounded-sm bg-white border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I consent to StreeSure securely processing self-reported health answers for non-diagnostic risk screening.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-0.5 rounded-sm bg-white border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I understand StreeSure provides triage risk indicators and is not a substitute for clinical diagnosis.
                </span>
              </label>
            </div>

            <button
              type="submit"
              id="btn-signup-submit"
              className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Verify Mobile via OTP & Create Account</span>
            </button>
          </form>
        ) : (
          /* -------------------- VIEW 4: FORGOT PASSWORD FLOW -------------------- */
          <form onSubmit={handleSendForgotOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Registered Mobile Number or Email <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-500 focus:outline-none font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Send Reset OTP Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-900 text-center transition"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Footer info & Guest switch */}
        <div className="text-center mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-700 hover:text-rose-700 underline font-bold"
          >
            ⚡ Continue Exploring as Guest
          </button>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Triage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
