import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Heart,
  ShieldCheck,
  Zap,
  Radio,
  Bluetooth,
  Stethoscope,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  FileText,
  Volume2,
  Mic,
  Eye,
  Lock,
  BatteryCharging,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Gauge,
  Thermometer,
  PieChart,
  BarChart3,
  Server,
  CornerDownRight,
  Flame,
  Globe,
  Share2,
  Download,
} from 'lucide-react';
import { LanguageCode, User, ScreeningLevel } from '../types';
import { getTranslation } from '../services/translations';

interface SmartKitFutureScopeViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onOpenVoiceSaathi?: () => void;
  onOpenScreening?: () => void;
  onOpenDoctors?: () => void;
}

export const SmartKitFutureScopeView: React.FC<SmartKitFutureScopeViewProps> = ({
  currentUser,
  currentLanguage,
  onOpenVoiceSaathi,
  onOpenScreening,
  onOpenDoctors,
}) => {
  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<
    | 'vision'
    | 'modules'
    | 'simulator'
    | 'asha_kit'
    | 'explainability'
    | 'roadmap'
    | 'research'
    | 'sih_guide'
  >('vision');

  // Interactive Simulator State
  const [simStep, setSimStep] = useState<
    'idle' | 'pairing' | 'connected' | 'health_check' | 'measuring' | 'validating' | 'result'
  >('idle');
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [simSensorHealth, setSimSensorHealth] = useState({
    opticalPpg: 'HEALTHY',
    tempSensor: 'HEALTHY',
    bioImpedance: 'CALIBRATED',
    bluetoothBle: 'ENCRYPTED',
  });

  // Simulated parameters
  const [simulatedParams, setSimulatedParams] = useState({
    heartRateBpm: 76,
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    skinTempC: 36.6,
    estimatedGlucoseMgDl: 98,
    measurementQualityScore: 97,
  });

  const [simulatedVoiceState, setSimulatedVoiceState] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<'A' | 'B' | 'C'>('A');

  // Simulating the BLE Handshake and Health Check
  const startSimulation = () => {
    setSimStep('pairing');
    setSimulatedVoiceState('Connecting to StreeSure Smart Kit via BLE 5.3 Enclave...');
    setTimeout(() => {
      setSimStep('connected');
      setSimulatedVoiceState('Device Paired! Running Diagnostic Health Check & Sensor Calibration...');
    }, 1600);
  };

  const runHealthCheck = () => {
    setSimStep('health_check');
    setTimeout(() => {
      setSimStep('measuring');
      setSimulatedVoiceState('ASHA Voice Saathi: "Please place fingertip on optical PPG module. Collecting non-invasive measurements..."');
    }, 2000);
  };

  const completeMeasurement = () => {
    setSimStep('validating');
    setSimulatedVoiceState('ASHA Voice Saathi: "Measurement completed. Validating signal quality with StreeSure AI..."');
    setTimeout(() => {
      setSimStep('result');
      setSimulatedVoiceState('ASHA Voice Saathi: "Data stored securely with patient consent. StreeSure multi-parameter screening updated."');
    }, 1800);
  };

  const resetSimulator = () => {
    setSimStep('idle');
    setSimulatedVoiceState('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP STATUTORY DISCLAIMER BANNER (MANDATORY REGULATORY COMPLIANCE) */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/80 via-purple-950/70 to-rose-950/80 border border-amber-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Future Research & Development Concept
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-pink-300 border border-rose-500/30">
                  Coming Soon — Clinical Validation Required
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-1 font-medium leading-relaxed">
                <strong>Important Notice:</strong> The StreeSure Smart Screening Kit is an investigational multi-parameter hardware concept. It is <strong>NOT</strong> currently a clinically validated diagnostic device and does <strong>NOT</strong> detect or diagnose PCOS on its own. It is designed to support preliminary risk assessment under healthcare-professional oversight.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/30 text-[11px] font-mono text-amber-200 shrink-0">
            TRL 3: Proof of Concept
          </span>
        </div>
      </div>

      {/* 2. HERO SECTION: "What's Next for StreeSure?" */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b0d28] via-[#241033] to-[#12081c] border border-rose-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Future Scope & Hardware R&D Vision</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            StreeSure Sense — Research Prototype
          </h1>

          <p className="text-base sm:text-xl font-medium text-pink-200">
            "An experimental low-cost optical sensing module designed to explore colorimetric and metabolic measurements."
          </p>

          <p className="text-sm text-rose-100/80 leading-relaxed">
            From digital questionnaire screening to accessible community-level physical assessment. We are architecting a compact, rural-friendly, multi-parameter companion device combining ESP32-S3 microcontroller, TCS34725 optical sensor chamber, controlled LED illumination, and BLE connectivity directly with StreeSure's screening engine and ASHA worker workflows.
          </p>

          {/* Quick Pillar Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { label: 'Non-Invasive First', icon: ShieldCheck },
              { label: 'ASHA Field Ready', icon: Users },
              { label: 'BLE Secure Enclave', icon: Lock },
              { label: 'Explainable AI Integration', icon: Cpu },
              { label: 'Affordable Engineering Goal', icon: Heart },
            ].map((tag, i) => {
              const Icon = tag.icon;
              return (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-pink-400" />
                  {tag.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-rose-500/20">
        {[
          { id: 'vision', label: '1. Vision & Ecosystem', icon: Globe },
          { id: 'modules', label: '2. Modular Architecture', icon: Layers },
          { id: 'simulator', label: '3. Live Kit Simulator', icon: Gauge },
          { id: 'asha_kit', label: '4. ASHA Community Kit & Voice', icon: Users },
          { id: 'explainability', label: '5. Explainable AI & Doctor Summary', icon: Stethoscope },
          { id: 'roadmap', label: '6. 10-Phase Clinical Roadmap', icon: Clock },
          { id: 'research', label: '7. Research Telemetry Dashboard', icon: BarChart3 },
          { id: 'sih_guide', label: '8. SIH Presentation Positioning', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-rose-950/30 text-rose-300/80 hover:bg-rose-900/40 border border-rose-500/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VISION & ECOSYSTEM */}
      {/* ========================================================================= */}
      {activeSubTab === 'vision' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Scientific Position Card */}
          <div className="p-6 rounded-3xl bg-[#170c22] border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Scientific & Clinical Position</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              An Investigational Multi-Parameter Screening Device Intended to Support Preliminary PCOS-Related Risk Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-rose-200/90 leading-relaxed">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-2">
                <strong className="text-white block font-bold text-sm">❌ What We Do NOT Claim:</strong>
                <p>
                  We do <strong>NOT</strong> claim "one magical device that detects PCOS". PCOS is a complex endocrinological and metabolic condition with phenotypic heterogeneity (Rotterdam criteria). It cannot reliably be confirmed using one sensor measurement alone.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <strong className="text-emerald-300 block font-bold text-sm">✅ What The Ecosystem Combines:</strong>
                <ul className="list-disc pl-4 space-y-1 text-emerald-100">
                  <li>Detailed menstrual pattern history & symptom reports</li>
                  <li>Relevant physical & metabolic measurements</li>
                  <li>Contextual differential health history</li>
                  <li>Clinician-provided laboratory investigations (when required)</li>
                  <li><strong>Final diagnostic decision strictly with qualified healthcare professionals</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* The Future Ecosystem Interactive Visual Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12081a] via-[#1a0c24] to-[#100616] border border-pink-500/30 space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                End-to-End System Architecture
              </span>
              <h3 className="text-xl font-black text-white">The StreeSure Unified Screening Ecosystem</h3>
              <p className="text-xs text-rose-200/70 max-w-xl mx-auto">
                How physical hardware measurements seamlessly enrich digital health profiles to assist community frontline workers and clinicians.
              </p>
            </div>

            {/* Architecture Node Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {[
                { step: '1', title: 'PHYSICAL KIT', desc: 'Modular sensors collect vital signals', icon: Cpu, color: 'text-pink-400' },
                { step: '2', title: 'MEASUREMENTS', desc: 'Optical PPG, vitals, temp & impedance', icon: Activity, color: 'text-amber-400' },
                { step: '3', title: 'SECURE BLE', desc: 'AES-256 hardware encrypted handshake', icon: Bluetooth, color: 'text-blue-400' },
                { step: '4', title: 'STREESURE APP', desc: 'User consent & digital profile match', icon: Lock, color: 'text-purple-400' },
                { step: '5', title: 'MULTI-DATA COMBINE', desc: 'Menstrual history + symptoms + vitals', icon: Layers, color: 'text-rose-400' },
                { step: '6', title: 'AI RISK ENGINE', desc: 'Multi-parameter risk stratification', icon: Zap, color: 'text-emerald-400' },
                { step: '7', title: 'EXPLAINABLE RESULT', desc: 'Transparent factor breakdown (3 levels)', icon: FileText, color: 'text-teal-400' },
                { step: '8', title: 'DOCTOR EVALUATION', desc: 'Clinical consultation & diagnostic tests', icon: Stethoscope, color: 'text-rose-300' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 flex flex-col items-center justify-between space-y-2 hover:border-pink-500/50 transition hover:scale-102"
                  >
                    <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                    <strong className="text-[11px] font-extrabold text-white leading-tight">
                      {item.title}
                    </strong>
                    <p className="text-[10px] text-rose-200/70 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Visual ASCII representation block from user request */}
            <div className="p-4 rounded-2xl bg-[#09050d] border border-rose-500/20 font-mono text-[11px] text-pink-300/80 overflow-x-auto">
              <div className="text-center font-bold text-rose-300 mb-2">Ecosystem Routing Topology:</div>
              <pre className="text-center leading-relaxed text-[10px] sm:text-xs">
{`             STREESURE PLATFORM
                     │
       ┌─────────────┼──────────────┐
       │             │              │
   MOBILE APP   VOICE SAATHI   SMART KIT
       │             │              │
       └─────────────┼──────────────┘
                     │
             SCREENING ENGINE
                     │
       ┌─────────────┴──────────────┐
       │                            │
   USER BENEFICIARY           ASHA SANGINI
       │                            │
       └─────────────┬──────────────┘
                     │
             REFERRAL / TELE-CONSULT
                     │
             DOCTOR EVALUATION`}
              </pre>
            </div>
          </div>

          {/* The Problem Addressed in Underserved Communities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Limited Specialist Access',
                desc: 'Rural PHCs and Sub-Centres rarely have dedicated endocrinologists or gynecologists on-site.',
                icon: Stethoscope,
              },
              {
                title: 'Distant Diagnostic Labs',
                desc: 'Ultrasonography and hormonal blood tests often require 40+ km travel to district headquarters.',
                icon: Globe,
              },
              {
                title: 'Screening Costs & Delays',
                desc: 'Expensive private diagnostics cause women to delay care until symptoms become severe or chronic.',
                icon: Clock,
              },
              {
                title: 'Low PCOS Awareness',
                desc: 'Irregular cycles and hirsutism are frequently dismissed due to stigma or lack of objective screening tools.',
                icon: HelpCircle,
              },
              {
                title: 'Frontline Worker Empowerment',
                desc: 'Equips ASHA and Anganwadi workers with portable objective tools during village health camps.',
                icon: Users,
              },
              {
                title: 'Rural Resilience',
                desc: 'Built for low connectivity, solar/power-bank recharge, simple sanitization, and voice-guided steps.',
                icon: BatteryCharging,
              },
            ].map((prob, i) => {
              const Icon = prob.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-rose-950/25 border border-rose-500/20 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{prob.title}</h4>
                  <p className="text-xs text-rose-200/75 leading-relaxed">{prob.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MODULAR ARCHITECTURE & HARDWARE DESIGN */}
      {/* ========================================================================= */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Modular Hardware Architecture</h2>
              <p className="text-xs text-rose-200/70">
                A non-invasive first, modular screening platform with swappable sensor cartridges and hardware cryptographic security.
              </p>
            </div>
            <div className="flex gap-2">
              {(['A', 'B', 'C'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModule(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedModule === m
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Module {m}
                </button>
              ))}
            </div>
          </div>

          {/* Module Detailed Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Module A: Physiological */}
            <div
              onClick={() => setSelectedModule('A')}
              className={`p-5 rounded-3xl border transition cursor-pointer space-y-4 ${
                selectedModule === 'A'
                  ? 'bg-rose-950/70 border-pink-500 ring-2 ring-pink-500/30'
                  : 'bg-rose-950/20 border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Module A: Core Baseline
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% Non-Invasive</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-pink-400" />
                <span>Basic Physiological Vitals</span>
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Captures baseline cardiovascular, hemodynamic, and autonomic markers to contextualize general health rather than act as standalone PCOS markers.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Dual-Wavelength PPG:</span>
                  <strong className="text-white font-mono">Heart Rate & HRV (Autonomic)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Micro-Cuff / Optical BP:</span>
                  <strong className="text-white font-mono">Blood Pressure (Systolic/Dia)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Medical IR Thermopile:</span>
                  <strong className="text-white font-mono">Basal Body Temperature</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200">
                💡 <strong>Clinical Context:</strong> Autonomic imbalance and metabolic hypertension frequently co-occur with PCOS.
              </div>
            </div>

            {/* Module B: Metabolic */}
            <div
              onClick={() => setSelectedModule('B')}
              className={`p-5 rounded-3xl border transition cursor-pointer space-y-4 ${
                selectedModule === 'B'
                  ? 'bg-rose-950/70 border-pink-500 ring-2 ring-pink-500/30'
                  : 'bg-rose-950/20 border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Module B: Metabolic
                </span>
                <span className="text-[10px] text-amber-300 font-mono">Evidence-Based</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Metabolic Screening Module</span>
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Evaluates insulin resistance indicators and body composition distributions relevant to metabolic syndrome in women.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Enzymatic Blood Glucose:</span>
                  <strong className="text-white font-mono">Fasting / Random Glycemia</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Multi-Frequency BIA:</span>
                  <strong className="text-white font-mono">Visceral Fat & Muscle Mass</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Waist-Hip Ratio Tracker:</span>
                  <strong className="text-white font-mono">Central Adiposity Index</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200">
                💡 <strong>Scientific Justification:</strong> ~70% of women with PCOS exhibit peripheral insulin resistance.
              </div>
            </div>

            {/* Module C: Biochemical & Hormonal R&D */}
            <div
              onClick={() => setSelectedModule('C')}
              className={`p-5 rounded-3xl border transition cursor-pointer space-y-4 ${
                selectedModule === 'C'
                  ? 'bg-rose-950/70 border-pink-500 ring-2 ring-pink-500/30'
                  : 'bg-rose-950/20 border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Module C: Future R&D
                </span>
                <span className="text-[10px] text-rose-400 font-mono">Lab Study Phase</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Biochemical / Hormonal Module</span>
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Future R&D exploring low-cost salivary / microfluidic lateral-flow reader assays for reproductive hormones.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Androgen Biomarkers:</span>
                  <strong className="text-white font-mono">Free Testosterone / DHEAS (R&D)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Gonadotropins:</span>
                  <strong className="text-white font-mono">LH / FSH Ratio Trends (R&D)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex justify-between">
                  <span className="text-rose-200">Thyroid Context:</span>
                  <strong className="text-white font-mono">TSH Screening Immunoassay (R&D)</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-200">
                ⚠️ <strong>Strict Scientific Boundary:</strong> We do NOT claim the current prototype measures these hormones without clinical lab correlation.
              </div>
            </div>
          </div>

          {/* Physical Hardware Design Specs */}
          <div className="p-6 rounded-3xl bg-[#150a1e] border border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pink-400" />
              <span>Physical Device Architecture & Rural Engineering Standards</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-mono text-[10px] block">1. Form Factor</span>
                <strong className="text-white block">Compact Handheld (140g)</strong>
                <p className="text-[11px] text-rose-200/70">Durable ABS-polycarbonate drop-proof casing.</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-mono text-[10px] block">2. Display / Interface</span>
                <strong className="text-white block">0.96" High-Contrast OLED</strong>
                <p className="text-[11px] text-rose-200/70">Sunlight readable with multi-color status ring LEDs.</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-mono text-[10px] block">3. Power & Battery</span>
                <strong className="text-white block">LiFePO4 7-Day Battery</strong>
                <p className="text-[11px] text-rose-200/70">USB-C fast recharge + portable 5V solar input.</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-mono text-[10px] block">4. Security & Enclave</span>
                <strong className="text-white block">Hardware ATECC608A Chip</strong>
                <p className="text-[11px] text-rose-200/70">Encrypted BLE 5.3 pairing with zero data leakage.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERACTIVE LIVE KIT SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b0d26] via-[#210f30] to-[#14081e] border border-pink-500/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                  Hardware Simulation Engine
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  StreeSure Smart Kit Live Handshake & Measurement Simulator
                </h2>
                <p className="text-xs text-rose-200/80">
                  Experience how the future Bluetooth Low Energy companion hardware communicates securely with the StreeSure app.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetSimulator}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Test</span>
                </button>
              </div>
            </div>

            {/* Virtual Device Display & Telemetry Screen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Virtual Device Shell */}
              <div className="md:col-span-1 p-6 rounded-3xl bg-[#09040e] border-2 border-rose-500/40 shadow-2xl relative space-y-4 text-center">
                {/* Physical status bar on device */}
                <div className="flex items-center justify-between text-[10px] text-pink-300/80 font-mono border-b border-rose-500/20 pb-2">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    STREESURE-KIT-091
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    {batteryLevel}%
                  </span>
                </div>

                {/* OLED Display Screen */}
                <div className="p-4 rounded-2xl bg-[#020104] border border-pink-500/50 shadow-inner font-mono space-y-2 min-h-[140px] flex flex-col justify-center items-center">
                  {simStep === 'idle' && (
                    <div className="space-y-1">
                      <span className="text-xs text-rose-400 block animate-pulse">● READY TO PAIR</span>
                      <p className="text-[10px] text-rose-300/60">Press Connect on Mobile App</p>
                    </div>
                  )}

                  {simStep === 'pairing' && (
                    <div className="space-y-1">
                      <Bluetooth className="w-6 h-6 text-blue-400 mx-auto animate-spin duration-3000" />
                      <span className="text-xs text-blue-300 block font-bold">BLE 5.3 HANDSHAKE...</span>
                      <p className="text-[9px] text-blue-200/60">Verifying Device UUID</p>
                    </div>
                  )}

                  {simStep === 'connected' && (
                    <div className="space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <span className="text-xs text-emerald-300 block font-bold">DEVICE AUTHENTICATED</span>
                      <p className="text-[9px] text-emerald-200/70">Enclave Key Exchanged</p>
                    </div>
                  )}

                  {simStep === 'health_check' && (
                    <div className="space-y-1">
                      <Gauge className="w-6 h-6 text-amber-400 mx-auto animate-spin" />
                      <span className="text-xs text-amber-300 block font-bold">DIAGNOSTIC TEST</span>
                      <p className="text-[9px] text-amber-200/70">Sensors Calibrated 100%</p>
                    </div>
                  )}

                  {simStep === 'measuring' && (
                    <div className="space-y-1">
                      <Activity className="w-6 h-6 text-pink-400 mx-auto animate-bounce" />
                      <span className="text-xs text-pink-300 block font-bold">SAMPLING SIGNALS...</span>
                      <p className="text-[9px] text-pink-200/80">Keep finger still on PPG optical sensor</p>
                    </div>
                  )}

                  {simStep === 'validating' && (
                    <div className="space-y-1">
                      <Cpu className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
                      <span className="text-xs text-purple-300 block font-bold">AI DATA VALIDATION</span>
                      <p className="text-[9px] text-purple-200/80">Signal Quality: 97%</p>
                    </div>
                  )}

                  {simStep === 'result' && (
                    <div className="space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <span className="text-xs text-emerald-400 block font-black">MEASUREMENT COMPLETED</span>
                      <p className="text-[9px] text-white/80">Transmitted to StreeSure App</p>
                    </div>
                  )}
                </div>

                {/* Physical Optical Sensor Touch-Pad on Mockup */}
                <div className="pt-2">
                  <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-rose-600 to-pink-700 border-4 border-pink-400/40 flex items-center justify-center text-white shadow-lg shadow-rose-900/60 cursor-pointer">
                    <Heart className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-rose-300 font-mono mt-1 block">
                    Optical PPG & Bio-Sensor
                  </span>
                </div>
              </div>

              {/* Simulation Interactive Control Console */}
              <div className="md:col-span-2 space-y-4">
                {/* Voice Saathi Audio Simulation Banner */}
                {simulatedVoiceState && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-pink-500/40 flex items-start gap-3 animate-in fade-in">
                    <Volume2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <span className="text-[10px] font-mono text-pink-300 uppercase tracking-wider block">
                        Voice Saathi Hindi/English Voice Prompt:
                      </span>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {simulatedVoiceState}
                      </p>
                    </div>
                  </div>
                )}

                {/* Diagnostic Health Check Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20">
                    <span className="text-[10px] text-rose-300 block">PPG Sensor:</span>
                    <strong className="text-emerald-400 text-xs font-mono">
                      {simStep === 'idle' ? 'STANDBY' : simSensorHealth.opticalPpg}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20">
                    <span className="text-[10px] text-rose-300 block">IR Temp:</span>
                    <strong className="text-emerald-400 text-xs font-mono">
                      {simStep === 'idle' ? 'STANDBY' : simSensorHealth.tempSensor}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20">
                    <span className="text-[10px] text-rose-300 block">Bio-Impedance:</span>
                    <strong className="text-emerald-400 text-xs font-mono">
                      {simStep === 'idle' ? 'STANDBY' : simSensorHealth.bioImpedance}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20">
                    <span className="text-[10px] text-rose-300 block">BLE Security:</span>
                    <strong className="text-emerald-400 text-xs font-mono">
                      {simStep === 'idle' ? 'STANDBY' : simSensorHealth.bluetoothBle}
                    </strong>
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-rose-200">
                    <span>Test Workflow Execution:</span>
                    <span className="text-pink-400 font-mono">
                      {simStep === 'idle'
                        ? 'Step 1/4: Connect'
                        : simStep === 'connected'
                        ? 'Step 2/4: Health Check'
                        : simStep === 'measuring'
                        ? 'Step 3/4: Sample Data'
                        : simStep === 'result'
                        ? 'Step 4/4: Complete'
                        : 'Processing...'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {simStep === 'idle' && (
                      <button
                        type="button"
                        onClick={startSimulation}
                        className="py-3 px-6 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center gap-2"
                      >
                        <Bluetooth className="w-4 h-4" />
                        <span>Pair & Authenticate Smart Kit</span>
                      </button>
                    )}

                    {simStep === 'connected' && (
                      <button
                        type="button"
                        onClick={runHealthCheck}
                        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                      >
                        <Gauge className="w-4 h-4" />
                        <span>Run Diagnostics & Calibrate Sensor</span>
                      </button>
                    )}

                    {simStep === 'measuring' && (
                      <button
                        type="button"
                        onClick={completeMeasurement}
                        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Signal Sampling & Transmit</span>
                      </button>
                    )}

                    {simStep === 'result' && (
                      <div className="w-full space-y-3">
                        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                          <span>✅ Transmitted Measurements Quality: <strong>97% (Acceptable)</strong></span>
                          <span className="font-mono text-emerald-300">HR: 76 bpm | BP: 118/78 | Temp: 36.6°C</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('explainability')}
                          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View How AI Combines Kit Data with Symptoms</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ASHA WORKER VERSION — "STREESURE COMMUNITY KIT" */}
      {/* ========================================================================= */}
      {activeSubTab === 'asha_kit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#160c20] border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  Community Healthcare Extension
                </span>
                <h2 className="text-xl font-black text-white">
                  StreeSure Community Kit for ASHA Sanginis
                </h2>
              </div>
              <span className="px-3 py-1 rounded-xl bg-rose-950 text-rose-300 text-xs font-mono border border-rose-500/20">
                Frontline Village Deployment
              </span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Designed for Accredited Social Health Activists (ASHAs) during door-to-door visits and monthly village health sanitation and nutrition days (VHSND).
            </p>

            {/* ASHA 8-Step Screening Workflow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 text-center text-xs">
              {[
                { step: '1', title: 'ASHA WORKER', desc: 'Opens ASHA Portal on smartphone' },
                { step: '2', title: 'SELECT BENEFICIARY', desc: 'Picks village woman from roster' },
                { step: '3', title: 'INFORMED CONSENT', desc: 'Digital audio consent recorded' },
                { step: '4', title: 'CONNECT KIT', desc: 'BLE one-tap secure pairing' },
                { step: '5', title: 'MEASUREMENTS', desc: 'Collects non-invasive vitals' },
                { step: '6', title: 'QUESTIONNAIRE', desc: 'Combines menstrual & symptom logs' },
                { step: '7', title: 'RISK STRATIFY', desc: 'Level 1, 2, or 3 assessment' },
                { step: '8', title: 'PHC REFERRAL', desc: 'Connects to MO / Gynecologist' },
              ].map((st, i) => (
                <div key={i} className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold mx-auto flex items-center justify-center">
                    {st.step}
                  </span>
                  <strong className="text-[11px] text-white block">{st.title}</strong>
                  <p className="text-[10px] text-rose-200/70">{st.desc}</p>
                </div>
              ))}
            </div>

            {/* Critical ASHA Rule Banner */}
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-300 block text-sm">Vital Operational Directive for ASHA Workers:</strong>
                <p className="mt-0.5">
                  The ASHA worker must <strong>NOT</strong> diagnose PCOS. The system generates: <em>"Screening indicates that professional evaluation may be appropriate."</em> This protects community trust and ensures strict medical safety.
                </p>
              </div>
            </div>
          </div>

          {/* Voice Saathi Multilingual Interactive Simulation */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b0e26] to-[#100616] border border-pink-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-pink-400" />
              <span>Voice Saathi Multilingual Voice Commands for Community Workers</span>
            </h3>
            <p className="text-xs text-rose-200/70">
              Low-literacy friendly step-by-step audio prompts in Hindi, Bengali, Marathi, Tamil, Telugu & English.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-2">
                <span className="text-[10px] font-mono text-pink-400 uppercase">ASHA Hindi Command:</span>
                <strong className="text-white block text-sm">"किट कनेक्ट करो।"</strong>
                <div className="p-2.5 rounded-xl bg-black/40 text-pink-200 text-[11px]">
                  🎙️ <strong>Voice Saathi:</strong> "StreeSure Smart Kit कनेक्ट हो गया है। कृपया डिवाइस तैयार रखें।"
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-2">
                <span className="text-[10px] font-mono text-pink-400 uppercase">Step Guidance:</span>
                <strong className="text-white block text-sm">"रीडिंग शुरू करो।"</strong>
                <div className="p-2.5 rounded-xl bg-black/40 text-pink-200 text-[11px]">
                  🎙️ <strong>Voice Saathi:</strong> "अब अगला measurement शुरू किया जा सकता है। कृपया उंगली स्थिर रखें।"
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-2">
                <span className="text-[10px] font-mono text-pink-400 uppercase">Completion & Referral:</span>
                <strong className="text-white block text-sm">"रिजल्ट बताओ।"</strong>
                <div className="p-2.5 rounded-xl bg-black/40 text-pink-200 text-[11px]">
                  🎙️ <strong>Voice Saathi:</strong> "माप पूरा हुआ। डॉक्टर परामर्श की सिफारिश की जाती है।"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EXPLAINABLE AI & DOCTOR SUMMARY PORTAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'explainability' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Kit Result Level Standards */}
          <div className="p-6 rounded-3xl bg-[#170b22] border border-rose-500/30 space-y-4">
            <h2 className="text-xl font-extrabold text-white">
              Transparent 3-Level Risk Categorization Standard
            </h2>
            <p className="text-xs text-rose-200/70">
              The device NEVER says "PCOS Detected". Instead, it outputs objective measurements to the StreeSure screening engine, which categorizes overall screening concern:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <strong className="text-emerald-300 text-sm">🟢 LEVEL 1</strong>
                </div>
                <h4 className="text-white font-bold">Lower Screening Concern</h4>
                <p className="text-emerald-100/80 leading-relaxed">
                  Menstrual regularity and vital parameters within standard normative boundaries. Continue routine tracking & healthy nutrition.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <strong className="text-amber-300 text-sm">🟠 LEVEL 2</strong>
                </div>
                <h4 className="text-white font-bold">Further Evaluation Recommended</h4>
                <p className="text-amber-100/80 leading-relaxed">
                  Multiple indicators (e.g. cycle length variability + metabolic vitals) suggest scheduling a routine evaluation with a medical officer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <strong className="text-rose-300 text-sm">🔴 LEVEL 3</strong>
                </div>
                <h4 className="text-white font-bold">Professional Evaluation Strongly Recommended</h4>
                <p className="text-rose-100/80 leading-relaxed">
                  High concordance across symptoms, history, and vitals. <em>(Important: RED does NOT mean PCOS diagnosis; it prompts timely clinical consultation).</em>
                </p>
              </div>
            </div>
          </div>

          {/* Explainable Factor Breakdown Module */}
          <div className="p-6 rounded-3xl bg-[#12081a] border border-pink-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-pink-400" />
              <span>How Did StreeSure Reach This Screening Level?</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-bold block">1. Menstrual Pattern</span>
                <span className="text-amber-400 font-semibold block">42-day cycles (Oligomenorrhea)</span>
                <p className="text-[11px] text-rose-200/70">Contributes ~35% to assessment weighting.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-bold block">2. Reported Symptoms</span>
                <span className="text-amber-400 font-semibold block">Moderate facial hirsutism</span>
                <p className="text-[11px] text-rose-200/70">Phenotypic hyperandrogen marker.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-bold block">3. Health History</span>
                <span className="text-white font-semibold block">Family history of Type 2 Diabetes</span>
                <p className="text-[11px] text-rose-200/70">Metabolic genetic predisposition.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-bold block">4. Kit Measurements</span>
                <span className="text-emerald-400 font-semibold block">BP 118/78, BMI 24.8, HR 76</span>
                <p className="text-[11px] text-rose-200/70">Hemodynamic context within normal bounds.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                <span className="text-rose-300 font-bold block">5. Clinical Context</span>
                <span className="text-purple-300 font-semibold block">Pending Pelvic Ultrasound</span>
                <p className="text-[11px] text-rose-200/70">To be reviewed by qualified doctor.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 text-xs text-rose-100 italic">
              "Several features in your screening profile may warrant further evaluation by a medical professional. These results provide contextual risk insights and do not confirm PCOS."
            </div>
          </div>

          {/* Doctor Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a0f28] to-[#12071c] border border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-purple-300 uppercase">Clinician Decision Support</span>
                <h3 className="text-base font-bold text-white">StreeSure Clinical Screening Summary for Doctors</h3>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Summary</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0a0510] border border-purple-500/20 text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-purple-500/20 pb-2">
                <div><span className="text-rose-300">Patient:</span> <strong className="text-white block">Sunita Sharma (24y)</strong></div>
                <div><span className="text-rose-300">Screening Level:</span> <strong className="text-amber-400 block">Level 2 (Orange)</strong></div>
                <div><span className="text-rose-300">Kit ID:</span> <span className="font-mono text-pink-300 block">STR-KIT-9021</span></div>
                <div><span className="text-rose-300">ASHA Sangini:</span> <span className="text-white block">Radha Devi (Govindgarh)</span></div>
              </div>
              <p className="text-rose-200/80 text-[11px]">
                <strong>Physician Note:</strong> The AI screening summary provides pre-consultation triage data. It does NOT make clinical diagnostic determinations. The doctor decides whether pelvic ultrasound, serum testosterone, fasting lipid profile, or oral glucose tolerance tests (OGTT) are warranted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: 10-PHASE CLINICAL VALIDATION ROADMAP */}
      {/* ========================================================================= */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#160c20] border border-rose-500/30 space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Scientific Rigor & Engineering Lifecycle
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                10-Phase Device Validation & Regulatory Pipeline
              </h2>
              <p className="text-xs text-rose-200/70">
                From initial scientific literature review to multi-center clinical trials and CDSCO / ISO 13485 regulatory approvals.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  phase: 'Phase 1',
                  title: 'Research & Parameter Identification',
                  desc: 'Identify scientifically relevant, evidence-based physiological and metabolic parameters associated with PCOS risk.',
                  status: 'COMPLETED',
                },
                {
                  phase: 'Phase 2',
                  title: 'Sensor Feasibility Studies',
                  desc: 'Evaluate whether identified parameters can be captured reliably using affordable, low-noise, portable optoelectronics.',
                  status: 'CURRENT PHASE',
                },
                {
                  phase: 'Phase 3',
                  title: 'Laboratory Hardware Prototyping',
                  desc: 'Build functional bench prototype with ESP32-S3 microcontroller, ATECC608A crypto enclave, and modular cartridges.',
                  status: 'IN PROGRESS',
                },
                {
                  phase: 'Phase 4',
                  title: 'Bench Testing & Repeatability',
                  desc: 'Evaluate signal-to-noise ratio (SNR), thermal drift, motion artifact rejection, and test-retest reliability.',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 5',
                  title: 'Clinical Reference Comparison',
                  desc: 'Compare prototype non-invasive readings with gold-standard hospital diagnostic tools (sphygmomanometers, clinical labs).',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 6',
                  title: 'AI Screening Model Development',
                  desc: 'Train and cross-validate multi-parameter statistical and machine learning screening algorithms on representative cohort datasets.',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 7',
                  title: 'Multi-Center Clinical Validation',
                  desc: 'Quantify clinical sensitivity, specificity, positive predictive value (PPV), and calibration curves with institutional ethics approval.',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 8',
                  title: 'Regulatory Pathway (CDSCO / ISO 13485)',
                  desc: 'Comply with Indian Medical Device Rules (MDR 2017) Class B/C investigational pathways and Software as a Medical Device (SaMD) standards.',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 9',
                  title: 'Controlled Pilot Deployments',
                  desc: 'Execute field usability trials with 50+ ASHA workers in designated primary health centres (PHCs).',
                  status: 'PLANNED',
                },
                {
                  phase: 'Phase 10',
                  title: 'Scaled Community Rollout',
                  desc: 'Scale manufacturing and national health mission integration only after full statutory certifications.',
                  status: 'LONG-TERM VISION',
                },
              ].map((ph, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-rose-900/30 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-pink-300 font-bold uppercase">{ph.phase}:</span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-white">{ph.title}</h4>
                      </div>
                      <p className="text-xs text-rose-200/75 mt-0.5">{ph.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap self-start sm:self-center ${
                      ph.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : ph.status === 'CURRENT PHASE' || ph.status === 'IN PROGRESS'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 animate-pulse'
                        : 'bg-rose-950/60 text-rose-300/60 border border-rose-500/10'
                    }`}
                  >
                    {ph.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RESEARCH TELEMETRY DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'research' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#160c20] border border-rose-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Anonymized Aggregated Analytics
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  StreeSure Clinical Research & Telemetry Hub
                </h2>
                <p className="text-xs text-rose-200/70">
                  Population-level epidemiological insights for authorized health researchers and state health missions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-black/40 border border-purple-500/30 text-[10px] text-purple-200 font-mono">
                🔒 HIPAA & DISHA Privacy Compliant
              </span>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-center space-y-1">
                <span className="text-xs text-rose-300 font-medium">Screenings Completed</span>
                <strong className="text-2xl font-black text-white font-mono block">12,480</strong>
                <span className="text-[10px] text-emerald-400">+18% this month</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-center space-y-1">
                <span className="text-xs text-rose-300 font-medium">Avg Signal Quality</span>
                <strong className="text-2xl font-black text-emerald-400 font-mono block">96.4%</strong>
                <span className="text-[10px] text-rose-300/80">Optical SNR &gt; 24dB</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-center space-y-1">
                <span className="text-xs text-rose-300 font-medium">PHC Referral Rate</span>
                <strong className="text-2xl font-black text-amber-300 font-mono block">31.2%</strong>
                <span className="text-[10px] text-amber-300/80">Level 2 & Level 3 Triage</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-center space-y-1">
                <span className="text-xs text-rose-300 font-medium">Doctor Follow-Up Rate</span>
                <strong className="text-2xl font-black text-pink-300 font-mono block">78.5%</strong>
                <span className="text-[10px] text-emerald-400">Within 14 Days</span>
              </div>
            </div>

            {/* Distribution Charts Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0d0714] border border-rose-500/20 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-pink-400" />
                  <span>Screening Level Stratification (Anonymized Cohort N=12,480)</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-rose-200">
                      <span>🟢 Level 1: Low Screening Concern</span>
                      <strong>68.8% (8,586)</strong>
                    </div>
                    <div className="w-full bg-rose-950/50 rounded-full h-2 mt-1">
                      <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '68.8%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-rose-200">
                      <span>🟠 Level 2: Further Evaluation Recommended</span>
                      <strong>22.4% (2,795)</strong>
                    </div>
                    <div className="w-full bg-rose-950/50 rounded-full h-2 mt-1">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '22.4%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-rose-200">
                      <span>🔴 Level 3: Strongly Recommended Evaluation</span>
                      <strong>8.8% (1,099)</strong>
                    </div>
                    <div className="w-full bg-rose-950/50 rounded-full h-2 mt-1">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: '8.8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0714] border border-rose-500/20 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Age Group Distribution in Rural Camps</span>
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
                  <div className="p-2.5 rounded-xl bg-rose-950/30">
                    <span className="text-[10px] text-rose-300 block">15–19 yrs</span>
                    <strong className="text-white block font-mono text-sm">24%</strong>
                    <span className="text-[9px] text-rose-400">Adolescent</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/30">
                    <span className="text-[10px] text-rose-300 block">20–29 yrs</span>
                    <strong className="text-white block font-mono text-sm">48%</strong>
                    <span className="text-[9px] text-pink-300">Peak Onset</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/30">
                    <span className="text-[10px] text-rose-300 block">30–39 yrs</span>
                    <strong className="text-white block font-mono text-sm">21%</strong>
                    <span className="text-[9px] text-rose-400">Reproductive</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/30">
                    <span className="text-[10px] text-rose-300 block">40+ yrs</span>
                    <strong className="text-white block font-mono text-sm">7%</strong>
                    <span className="text-[9px] text-rose-400">Perimenopausal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: SIH PRESENTATION POSITIONING GUIDE */}
      {/* ========================================================================= */}
      {activeSubTab === 'sih_guide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c0d28] to-[#12071b] border border-pink-500/40 space-y-4">
            <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Smart India Hackathon (SIH) & Evaluator Presentation Guide</span>
            </div>
            <h2 className="text-xl font-black text-white">
              How to Position the StreeSure Smart Screening Kit to Judges & Experts
            </h2>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              When presenting this concept to medical, engineering, or innovation juries, adhere strictly to these scientific positioning guidelines:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5">
                <strong className="text-emerald-300 block text-sm font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  CORRECT STATEMENT TO SAY TO JUDGES:
                </strong>
                <p className="text-emerald-100/90 italic leading-relaxed text-[12px] bg-black/40 p-3 rounded-xl border border-emerald-500/20">
                  "We are not claiming that our current prototype diagnoses PCOS. Our immediate platform focuses on accessible digital screening, awareness and referral. As a future research direction, we propose a low-cost multi-parameter screening kit that could integrate with StreeSure after rigorous scientific and clinical validation."
                </p>
                <ul className="list-disc pl-4 space-y-1 text-emerald-200/80 text-[11px]">
                  <li>Emphasize multi-parameter contextualization over single-sensor claims</li>
                  <li>Highlight ASHA worker enablement and Voice Saathi guidance</li>
                  <li>Explain the 10-phase clinical validation and regulatory roadmap</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
                <strong className="text-rose-300 block text-sm font-extrabold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  INCORRECT STATEMENTS TO STRICTLY AVOID:
                </strong>
                <div className="space-y-2 text-rose-100/90 text-[12px]">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-rose-300">
                    ❌ <em>"We have invented a device that detects PCOS."</em>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-rose-300">
                    ❌ <em>"This $5 sensor replaces hospital ultrasounds and hormone blood tests."</em>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-rose-300">
                    ❌ <em>"Our AI diagnoses PCOS without doctors."</em>
                  </div>
                </div>
                <p className="text-rose-200/70 text-[11px]">
                  Juries with clinical or regulatory backgrounds appreciate intellectual honesty and rigorous validation pathways.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FUTURE ROADMAP STRIP: NOW → NEXT → FUTURE → LONG TERM */}
      <div className="p-6 rounded-3xl bg-[#13091c] border border-rose-500/20 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-rose-300">
          StreeSure Strategic Roadmap
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-pink-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              NOW
            </span>
            <h4 className="text-white font-extrabold pt-1">StreeSure Digital Platform</h4>
            <p className="text-rose-200/70 text-[11px]">
              AI-assisted screening + Multilingual Voice Saathi + ASHA Portal + Doctor Directory + Rural Care Store.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-amber-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              NEXT
            </span>
            <h4 className="text-white font-extrabold pt-1">Prototype Smart Kit</h4>
            <p className="text-rose-200/70 text-[11px]">
              Modular non-invasive optical vital companion device + secure BLE enclave handshake.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-purple-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              FUTURE
            </span>
            <h4 className="text-white font-extrabold pt-1">Clinical Research & Validation</h4>
            <p className="text-rose-200/70 text-[11px]">
              Multi-center hospital reference trials + CDSCO investigational regulatory pathway.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-emerald-500/40 space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LONG TERM
            </span>
            <h4 className="text-white font-extrabold pt-1">Validated Community Ecosystem</h4>
            <p className="text-rose-200/70 text-[11px]">
              Nationwide frontline screening network integrated with primary healthcare centres.
            </p>
          </div>
        </div>
      </div>

      {/* 5. FINAL STATUTORY FUTURE SCOPE SUMMARY STATEMENT */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-slate-950 border border-rose-500/30 text-center space-y-3">
        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-pink-300 border border-rose-500/40 uppercase">
          Coming Soon — Research & Development
        </span>
        <p className="text-xs sm:text-sm text-rose-100/90 max-w-4xl mx-auto leading-relaxed">
          "The StreeSure Smart Screening Kit is envisioned as a future extension of the StreeSure ecosystem — a potentially affordable, portable, multi-parameter screening device designed to support preliminary PCOS-related risk assessment in collaboration with healthcare professionals. Its development would require scientific research, engineering validation, clinical studies, regulatory compliance and real-world testing before deployment."
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          {onOpenScreening && (
            <button
              type="button"
              onClick={onOpenScreening}
              className="py-2.5 px-5 rounded-2xl btn-berry-primary text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Try Live Digital Screening Platform</span>
            </button>
          )}
          {onOpenVoiceSaathi && (
            <button
              type="button"
              onClick={onOpenVoiceSaathi}
              className="py-2.5 px-5 rounded-2xl bg-rose-950/80 hover:bg-rose-900/80 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Open Voice Saathi Assistant</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
