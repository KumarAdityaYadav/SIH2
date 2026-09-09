import React from 'react';
import {
  Sparkles,
  UserCheck,
  Stethoscope,
  Users,
  Building2,
  ShieldAlert,
  PlayCircle,
  Layers,
  Mic,
  Activity,
  Cpu,
} from 'lucide-react';
import { Role, User } from '../types';
import { DEMO_USERS } from '../data/seedData';

interface DemoTourBarProps {
  currentUser: User | null;
  onSwitchUser: (user: User) => void;
  onTriggerDemoFlow: (flowStep: string) => void;
  onOpen3DModal: () => void;
  onOpenVoiceSaathi: () => void;
  onOpenSmartKit?: () => void;
}

export const DemoTourBar: React.FC<DemoTourBarProps> = ({
  currentUser,
  onSwitchUser,
  onTriggerDemoFlow,
  onOpen3DModal,
  onOpenVoiceSaathi,
  onOpenSmartKit,
}) => {
  return (
    <aside aria-label="Demo Bar" className="bg-[#0e0716]/95 text-rose-100 border-b border-rose-500/20 px-4 py-2 text-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            SIH Interactive Sandbox
          </span>
          <span className="text-rose-200/70 hidden md:inline text-[11px]">
            Role Persona Switcher:
          </span>
        </div>

        {/* Center: Role Switchers */}
        <div className="flex items-center gap-1 bg-[#180e24] p-1 rounded-full border border-rose-500/30">
          <button
            type="button"
            id="demo-switch-user"
            onClick={() => onSwitchUser(DEMO_USERS.user)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              currentUser?.role === 'USER'
                ? 'btn-rose-primary text-white shadow-sm'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            User (Sunita)
          </button>

          <button
            type="button"
            id="demo-switch-asha"
            onClick={() => onSwitchUser(DEMO_USERS.asha)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              currentUser?.role === 'ASHA'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <Users className="w-3 h-3 text-teal-300" />
            ASHA Worker
          </button>

          <button
            type="button"
            id="demo-switch-doctor"
            onClick={() => onSwitchUser(DEMO_USERS.doctor)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              currentUser?.role === 'DOCTOR'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-sm'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <Stethoscope className="w-3 h-3 text-purple-300" />
            Doctor
          </button>

          <button
            type="button"
            id="demo-switch-ngo"
            onClick={() => onSwitchUser(DEMO_USERS.ngo)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              currentUser?.role === 'NGO'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <Building2 className="w-3 h-3 text-emerald-300" />
            NGO
          </button>

          <button
            type="button"
            id="demo-switch-admin"
            onClick={() => onSwitchUser(DEMO_USERS.admin)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              currentUser?.role === 'ADMIN'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-amber-300" />
            Admin
          </button>
        </div>

        {/* Right: Quick Feature Shortcuts */}
        <div className="flex items-center gap-2">
          {onOpenSmartKit && (
            <button
              type="button"
              id="demo-btn-smart-kit"
              onClick={onOpenSmartKit}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-900/60 to-rose-900/60 hover:from-amber-800/70 hover:to-rose-800/70 text-amber-200 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-semibold transition"
            >
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>Smart Kit (R&D)</span>
            </button>
          )}

          <button
            type="button"
            id="demo-btn-3d-model"
            onClick={onOpen3DModal}
            className="flex items-center gap-1 bg-[#1a0f26] hover:bg-[#251538] text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full text-[11px] font-semibold transition"
          >
            <Layers className="w-3 h-3 text-pink-400" />
            3D Anatomy
          </button>

          <button
            type="button"
            id="demo-btn-voice"
            onClick={onOpenVoiceSaathi}
            className="flex items-center gap-1 btn-rose-primary text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md transition"
          >
            <Mic className="w-3 h-3 text-white" />
            Voice Saathi
          </button>
        </div>
      </div>
    </aside>
  );
};
