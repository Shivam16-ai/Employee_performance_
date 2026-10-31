import React from 'react';
import { BrandLogo } from './BrandLogo';
import { LogOut, Shield, Target, UserCheck } from 'lucide-react';
import { User, UserRole } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onOpenCommandPalette: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onRoleSwitch,
  onOpenCommandPalette,
  isLoggedIn,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#060a14]/90 backdrop-blur-md px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="text-left focus:outline-none"
            aria-label="EPMS Home"
          >
            <BrandLogo size="md" showTagline={false} />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'landing' ? 'text-white border-b-2 border-[#38bdf8] pb-1' : ''
            }`}
          >
            Platform
          </button>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  onRoleSwitch('admin');
                  onNavigate('admin');
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
                  currentView === 'admin' ? 'text-[#38bdf8] border-b-2 border-[#38bdf8] pb-1 font-semibold' : ''
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#c59b6d]" />
                HR Executive
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('manager');
                  onNavigate('manager');
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
                  currentView === 'manager' ? 'text-[#38bdf8] border-b-2 border-[#38bdf8] pb-1 font-semibold' : ''
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#38bdf8]" />
                People Manager
              </button>
              <button
                onClick={() => {
                  onRoleSwitch('employee');
                  onNavigate('employee');
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
                  currentView === 'employee' ? 'text-[#38bdf8] border-b-2 border-[#38bdf8] pb-1 font-semibold' : ''
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#f8f6f0]" />
                Employee Portal
              </button>
            </>
          ) : (
            <>
              <a
                href="#capabilities"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="whitespace-nowrap transition-colors hover:text-white"
              >
                Capabilities
              </a>
              <a
                href="#methodology"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="whitespace-nowrap transition-colors hover:text-white"
              >
                Review Architecture
              </a>
              <a
                href="#enterprise"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('enterprise')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="whitespace-nowrap transition-colors hover:text-white"
              >
                Enterprise Governance
              </a>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & User Context */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Active User Badge / Switcher */}
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white tracking-wide">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-[#c59b6d] capitalize">
                  {currentUser.role === 'admin' ? 'HR Administrator' : currentUser.role}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Sign out of EPMS"
                className="p-2 rounded-lg bg-[#0c1222] border border-slate-700/60 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
            >
              Employee Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
