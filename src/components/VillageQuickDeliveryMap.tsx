import React, { useState, useEffect } from 'react';
import {
  Bike,
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Package,
  Layers,
  Zap,
  Radio,
  Truck,
  Heart,
  Eye,
  RefreshCw,
  Send,
  Volume2,
  PhoneCall,
  X,
  Store,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { DeliveryPartner, VillageDarkStore, CartItem } from '../types';
import { SEED_DELIVERY_PARTNERS, SEED_VILLAGE_DARK_STORES } from '../data/seedData';

interface VillageQuickDeliveryMapProps {
  orderId?: string;
  selectedPartner?: DeliveryPartner;
  orderedItems?: CartItem[];
  deliveryAddress?: {
    fullName: string;
    phone: string;
    villageOrStreet: string;
    district: string;
    pincode: string;
  };
  totalAmount?: number;
  onClose?: () => void;
}

export const VillageQuickDeliveryMap: React.FC<VillageQuickDeliveryMapProps> = ({
  orderId = 'STR-RUR-9021',
  selectedPartner = SEED_DELIVERY_PARTNERS[0],
  orderedItems = [],
  deliveryAddress = {
    fullName: 'Sunita Sharma',
    phone: '+91 98765 43210',
    villageOrStreet: 'Ward 4, Near Shiva Temple, Govindgarh',
    district: 'Jaipur Rural (Rajasthan)',
    pincode: '303702',
  },
  totalAmount = 298,
  onClose,
}) => {
  // Live simulated position progress: 0 (at dark store) to 100 (at doorstep)
  const [riderProgress, setRiderProgress] = useState(38);
  const [isCallingRider, setIsCallingRider] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'live_tracking' | 'dark_stores' | 'discreet_notes'>('live_tracking');
  const [discreetNote, setDiscreetNote] = useState('Please pack in opaque brown paper bag and hand over directly.');
  const [noteSaved, setNoteSaved] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(18 * 60 - 45); // ~17 mins
  const [activeDarkStore, setActiveDarkStore] = useState<VillageDarkStore>(SEED_VILLAGE_DARK_STORES[0]);
  const [isEmergencyDroneActive, setIsEmergencyDroneActive] = useState(selectedPartner.partnerType === 'SOS_DRONE');

  // Simulated live moving rider timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRiderProgress((prev) => {
        if (prev >= 98) return 98;
        return prev + 0.5;
      });
      setRemainingSeconds((prev) => (prev > 60 ? prev - 1 : 60));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Call duration counter
  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (isCallingRider) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [isCallingRider]);

  const minutesLeft = Math.floor(remainingSeconds / 60);
  const secondsLeft = remainingSeconds % 60;

  // Road coordinates simulation for SVG map
  // Route from Dark store (X: 60, Y: 220) through village roads to Home (X: 380, Y: 80)
  const routePoints = [
    { x: 60, y: 220, label: 'Govindgarh Zepto/Blinkit Dark Store' },
    { x: 120, y: 200, label: 'Govindgarh Sub-Centre PHC' },
    { x: 180, y: 230, label: 'Chomu Bypass Road' },
    { x: 240, y: 170, label: 'Gram Panchayat Circle' },
    { x: 310, y: 120, label: 'Ward 3 Canal Bridge' },
    { x: 380, y: 80, label: 'Sunita\'s Doorstep (Ward 4)' },
  ];

  // Calculate rider's current SVG coordinate based on riderProgress (0 to 100%)
  const riderPointIndex = Math.min(
    Math.floor((riderProgress / 100) * (routePoints.length - 1)),
    routePoints.length - 2
  );
  const localProg = ((riderProgress / 100) * (routePoints.length - 1)) - riderPointIndex;
  const p1 = routePoints[riderPointIndex];
  const p2 = routePoints[riderPointIndex + 1];
  const currentRiderX = p1.x + (p2.x - p1.x) * localProg;
  const currentRiderY = p1.y + (p2.y - p1.y) * localProg;

  const currentRoadName =
    riderProgress < 20
      ? 'Leaving Micro Dark-Store Hub'
      : riderProgress < 45
      ? 'Chomu-Govindgarh Link Road (Speed: 28 km/h)'
      : riderProgress < 75
      ? 'Near Ward 3 Shiva Temple & Primary School'
      : riderProgress < 95
      ? 'Entering Ward 4 Residential Lane'
      : 'Arrived at Doorstep!';

  return (
    <div className="w-full bg-[#110B18] border border-rose-500/20 rounded-3xl overflow-hidden shadow-2xl text-slate-100 animate-in fade-in duration-300">
      {/* Top Banner: Blinkit / Zepto Village Express Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-slate-900 border-b border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
            {selectedPartner.partnerType === 'SOS_DRONE' ? (
              <Zap className="w-6 h-6 animate-pulse" />
            ) : selectedPartner.partnerType === 'ASHA_EXPRESS' ? (
              <Heart className="w-6 h-6 text-rose-100" />
            ) : (
              <Bike className="w-6 h-6 animate-bounce duration-1000" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-pink-300 border border-rose-500/30">
                {selectedPartner.logoBadge}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping" />
                Live GPS Active
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Village Quick-Commerce Delivery</span>
              <span className="text-xs font-mono text-rose-300 font-normal">#{orderId}</span>
            </h2>
          </div>
        </div>

        {/* ETA Highlight Badge */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-rose-950/80 border border-pink-500/40 text-right shadow-inner">
            <span className="block text-[10px] uppercase font-bold text-rose-300 tracking-wider">
              Estimated Delivery
            </span>
            <span className="text-lg sm:text-xl font-mono font-black text-white flex items-center justify-end gap-1.5">
              <Clock className="w-4 h-4 text-pink-400 animate-spin duration-3000" />
              <span>
                {minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </span>
              <span className="text-xs font-normal text-rose-200">mins</span>
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition"
              title="Close Map Tracking"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation: Live Tracking / Dark Store Network / Discreet Delivery Notes */}
      <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-rose-500/15 flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('live_tracking')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'live_tracking'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
              : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 border border-rose-500/20'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Live Route Tracking</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dark_stores')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dark_stores'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
              : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 border border-rose-500/20'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Village Dark-Stores & Inventory ({SEED_VILLAGE_DARK_STORES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('discreet_notes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'discreet_notes'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
              : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 border border-rose-500/20'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Discreet Hand-Off Notes</span>
          {noteSaved && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
        </button>
      </div>

      {/* TAB 1: LIVE INTERACTIVE MAP & TRACKING */}
      {activeTab === 'live_tracking' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Real-Time Interactive SVG Village Route Map */}
          <div className="relative w-full rounded-2xl bg-[#09050d] border border-rose-500/30 overflow-hidden shadow-inner aspect-[16/9] sm:aspect-[21/9] max-h-[320px]">
            {/* Background Grid Lines & Rural Contour Texture */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 450 280"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Neon Route Glow */}
                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Gradient for Delivery Trail */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Rural Farmland & Village Terrain Grid */}
              <pattern id="ruralGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="rgba(244, 63, 94, 0.05)"
                  strokeWidth="0.8"
                />
              </pattern>
              <rect width="450" height="280" fill="url(#ruralGrid)" />

              {/* Village Green patches (Mustard / Crop fields) */}
              <path
                d="M 10 10 Q 70 40 50 110 Q 20 160 10 240 Z"
                fill="rgba(16, 185, 129, 0.04)"
              />
              <path
                d="M 280 20 Q 380 40 430 110 Q 440 220 330 260 Z"
                fill="rgba(244, 63, 94, 0.04)"
              />

              {/* Rural Secondary Roads (Gray lines) */}
              <path
                d="M 20 80 Q 140 100 220 40 T 430 30"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="4 4"
              />
              <path
                d="M 50 260 Q 150 190 280 240 T 430 220"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="3.5"
                fill="none"
              />
              <path
                d="M 180 230 L 180 20"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Active Delivery Route Path (Chomu -> Govindgarh -> Ward 4) */}
              <path
                d="M 60 220 C 100 200, 140 210, 180 230 S 260 180, 310 120 T 380 80"
                stroke="url(#routeGradient)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#routeGlow)"
              />

              {/* Animated Dash Array to show live motion flow */}
              <path
                d="M 60 220 C 100 200, 140 210, 180 230 S 260 180, 310 120 T 380 80"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6 8"
                fill="none"
                opacity="0.8"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Landmark Pin 1: Village Micro Dark-Store */}
              <g transform="translate(60, 220)">
                <circle r="14" fill="rgba(244, 63, 94, 0.2)" className="animate-ping" />
                <circle r="9" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="24" textAnchor="middle" fill="#fbcfe8" fontSize="9" fontWeight="bold">
                  🏪 Zepto/Blinkit Hub
                </text>
              </g>

              {/* Landmark Pin 2: Govindgarh PHC Sub-Centre */}
              <g transform="translate(180, 230)">
                <circle r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="18" textAnchor="middle" fill="#c4b5fd" fontSize="8">
                  🏥 Sub-Centre PHC
                </text>
              </g>

              {/* Landmark Pin 3: Village Square */}
              <g transform="translate(240, 170)">
                <circle r="6" fill="#64748b" stroke="#ffffff" strokeWidth="1" />
                <text x="0" y="-10" textAnchor="middle" fill="#cbd5e1" fontSize="8">
                  🏛️ Panchayat Circle
                </text>
              </g>

              {/* Landmark Pin 4: User's House (Destination) */}
              <g transform="translate(380, 80)">
                <circle r="16" fill="rgba(16, 185, 129, 0.25)" className="animate-ping" />
                <circle r="11" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="-18" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold">
                  🏠 Sunita's House (Ward 4)
                </text>
              </g>

              {/* LIVE MOVING RIDER ICON */}
              <g transform={`translate(${currentRiderX}, ${currentRiderY})`}>
                <circle r="18" fill="rgba(244, 63, 94, 0.3)" className="animate-pulse" />
                <circle r="12" fill="#fb7185" stroke="#ffffff" strokeWidth="2.5" />
                {selectedPartner.partnerType === 'SOS_DRONE' ? (
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11">
                    🚁
                  </text>
                ) : (
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11">
                    🏍️
                  </text>
                )}
                {/* Rider Label Tooltip */}
                <rect
                  x="-55"
                  y="-32"
                  width="110"
                  height="20"
                  rx="6"
                  fill="rgba(15, 10, 25, 0.9)"
                  stroke="rgba(244, 63, 94, 0.6)"
                  strokeWidth="1"
                />
                <text x="0" y="-19" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {selectedPartner.riderName.split(' ')[0]} ({Math.round(selectedPartner.distanceKm * (1 - riderProgress / 100) * 10) / 10} km away)
                </text>
              </g>
            </svg>

            {/* Floating Live Status pill on Map */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-[#170c20]/90 backdrop-blur-md border border-rose-500/30 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-pink-400 animate-spin duration-3000" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-rose-300 font-mono uppercase block">
                  Current Rider Waypoint:
                </span>
                <strong className="text-white font-semibold">{currentRoadName}</strong>
              </div>
            </div>

            {/* Quick Map Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setRiderProgress((p) => Math.min(p + 15, 95))}
                className="px-2.5 py-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-[10px] font-bold text-rose-200 hover:text-white shadow hover:bg-rose-900 transition flex items-center gap-1"
                title="Fast Forward Simulation"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Simulate Forward</span>
              </button>
            </div>
          </div>

          {/* Delivery Timeline / Status Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-rose-200">
              <span>Village Micro-Hub Order Timeline</span>
              <span className="text-emerald-400 font-bold">{Math.round(riderProgress)}% Completed</span>
            </div>

            <div className="w-full bg-rose-950/60 rounded-full h-2.5 p-0.5 border border-rose-500/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-emerald-400 transition-all duration-700 shadow-lg shadow-rose-900/50"
                style={{ width: `${riderProgress}%` }}
              ></div>
            </div>

            {/* 4 Step Milestones */}
            <div className="grid grid-cols-4 gap-1 pt-1 text-center text-[10px] text-rose-300/80 font-medium">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-0.5" />
                <span className="text-white font-bold">1. Placed</span>
                <span className="text-[9px] text-rose-400">Govt Subsidized</span>
              </div>

              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-0.5" />
                <span className="text-white font-bold">2. Packed</span>
                <span className="text-[9px] text-rose-400">Sterile Pouch</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[9px] font-bold mb-0.5 animate-pulse">
                  3
                </div>
                <span className="text-pink-300 font-bold">3. In Transit</span>
                <span className="text-[9px] text-rose-400">Hero E-Bike</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-rose-950 border border-rose-500/40 text-rose-400 flex items-center justify-center text-[9px] mb-0.5">
                  4
                </div>
                <span className="text-slate-400">4. Doorstep</span>
                <span className="text-[9px] text-slate-500">Ward 4 House</span>
              </div>
            </div>
          </div>

          {/* Delivery Partner Profile Card & Contact Actions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-slate-950 border border-rose-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Rider Identity */}
            <div className="flex items-center gap-3.5 md:col-span-2">
              <img
                src={selectedPartner.riderPhoto}
                alt={selectedPartner.riderName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500/50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-white">
                    {selectedPartner.riderName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Partner
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 font-medium">
                  {selectedPartner.vehicleType} • <span className="font-mono text-pink-300">{selectedPartner.vehicleNumber}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-rose-300/70 pt-0.5">
                  <span className="text-amber-300 font-bold flex items-center gap-0.5">
                    ★ {selectedPartner.rating}
                  </span>
                  <span>•</span>
                  <span>{selectedPartner.totalDeliveries}+ Safe Rural Deliveries</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Calling Buttons */}
            <div className="flex flex-row md:flex-col gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsCallingRider(true)}
                className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 hover:scale-102 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Delivery Partner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('discreet_notes')}
                className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-rose-950/70 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Discreet Instructions</span>
              </button>
            </div>
          </div>

          {/* Delivery Address & Order Safeguards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
              <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider block">
                Destination Address:
              </span>
              <strong className="text-white block">{deliveryAddress.fullName} ({deliveryAddress.phone})</strong>
              <p className="text-rose-200/80 leading-snug">
                {deliveryAddress.villageOrStreet}, {deliveryAddress.district} - {deliveryAddress.pincode}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Stigma Rural Packaging Guarantee:
              </span>
              <p className="text-rose-100/90 leading-relaxed">
                Orders are 100% confidential, packed in plain unbranded tamper-proof pouches with zero product labels visible from the outside.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VILLAGE DARK-STORE NETWORK LOCATOR (Blinkit / Zepto Style) */}
      {activeTab === 'dark_stores' && (
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">
                StreeSure Rural Micro-Fulfillment & Dark Store Network
              </h3>
              <p className="text-xs text-rose-200/70">
                Strategically positioned hyper-local storage hubs inside PHCs and rural community centers for 15-30 min delivery.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {SEED_VILLAGE_DARK_STORES.length} Active Dark-Stores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SEED_VILLAGE_DARK_STORES.map((store) => (
              <div
                key={store.id}
                onClick={() => setActiveDarkStore(store)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                  activeDarkStore.id === store.id
                    ? 'bg-rose-950/70 border-pink-500 shadow-lg shadow-rose-950/50 ring-1 ring-pink-500/40'
                    : 'bg-rose-950/25 border-rose-500/20 hover:bg-rose-900/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-pink-400" />
                      <h4 className="text-sm font-bold text-white">{store.name}</h4>
                    </div>
                    <p className="text-xs text-rose-300/80">
                      {store.block}, {store.district} ({store.state})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ⚡ {store.avgDeliveryTimeMinutes} Mins ETA
                  </span>
                </div>

                {/* Micro-Inventory Breakdown */}
                <div className="p-3 rounded-xl bg-[#09050d] border border-rose-500/20 text-[11px] space-y-2">
                  <div className="flex justify-between font-mono text-rose-200/80">
                    <span>Active E-Bike Riders on Duty:</span>
                    <strong className="text-emerald-400">{store.activeRidersCount} Active</strong>
                  </div>
                  <div className="flex justify-between font-mono text-rose-200/80">
                    <span>Coverage Radius:</span>
                    <span className="text-white">{store.deliveryRadiusKm} km Village Radius</span>
                  </div>

                  <div className="pt-2 border-t border-rose-500/15 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-rose-950/50">
                      <span className="text-rose-300 block">Pads</span>
                      <strong className="text-white">{store.inventoryCount.pads} pcs</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-950/50">
                      <span className="text-rose-300 block">Anti-Cramp Tabs</span>
                      <strong className="text-white">{store.inventoryCount.tablets} pcs</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-950/50">
                      <span className="text-rose-300 block">Hot Bags/Patches</span>
                      <strong className="text-white">{store.inventoryCount.hotBags + store.inventoryCount.patches} pcs</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISCREET DELIVERY INSTRUCTIONS */}
      {activeTab === 'discreet_notes' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Discreet & Safe Village Delivery Preferences</span>
            </h3>
            <p className="text-xs text-rose-200/70">
              We understand privacy in rural and joint family homes. Customize how your rider will hand over your kit.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-rose-200">
              Special Delivery Note for {selectedPartner.riderName.split(' ')[0]}:
            </label>
            <textarea
              rows={3}
              value={discreetNote}
              onChange={(e) => {
                setDiscreetNote(e.target.value);
                setNoteSaved(false);
              }}
              placeholder="e.g. Leave with ASHA Didi Radha Devi, or deliver in opaque bag without calling out loud..."
              className="w-full p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-white text-xs placeholder:text-rose-300/40 focus:outline-none focus:border-pink-500 transition"
            ></textarea>

            {/* Quick pre-set chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Hand over to ASHA Didi',
                'Call before approaching gate',
                'Leave quietly near back door',
                'No product name on outer package',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setDiscreetNote((prev) => (prev ? `${prev} • ${chip}` : chip));
                    setNoteSaved(false);
                  }}
                  className="px-3 py-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 text-[11px] font-medium transition"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setNoteSaved(true)}
                className="py-2.5 px-5 rounded-2xl btn-berry-primary text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                {noteSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Instructions Saved & Transmitted to Rider</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Save & Notify Delivery Partner</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Call Overlay Modal */}
      {isCallingRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-[#1a0f26] border border-rose-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={selectedPartner.riderPhoto}
                alt={selectedPartner.riderName}
                className="w-full h-full rounded-full object-cover border-4 border-pink-500 shadow-xl"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-white animate-pulse">
                <Volume2 className="w-3 h-3" />
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                Connecting to Rural Delivery Partner...
              </span>
              <h3 className="text-lg font-black text-white">{selectedPartner.riderName}</h3>
              <p className="text-xs text-rose-200/70">
                {selectedPartner.partnerLabel} ({selectedPartner.vehicleNumber})
              </p>
              <div className="text-sm font-mono text-pink-300 font-bold pt-1">
                Call Duration: 00:{callDuration < 10 ? `0${callDuration}` : callDuration}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/20 text-xs text-rose-200 text-left space-y-1">
              <strong className="text-emerald-400 block font-semibold">🎙️ Partner Responded:</strong>
              <p className="text-white text-[11px] leading-relaxed italic">
                "Namaste! I am on the Chomu-Govindgarh link road with your sealed StreeSure package. I will reach your Ward 4 address in approximately {minutesLeft} minutes. No need to worry, everything is packed discreetly."
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCallingRider(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4 rotate-[135deg]" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
