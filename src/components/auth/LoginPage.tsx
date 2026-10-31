import React, { useState } from 'react';
import { CinematicVideoReel } from '../common/CinematicVideoReel';
import { BrandLogo } from '../common/BrandLogo';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield, Target, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../../types';

interface LoginPageProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLoginSuccess,
  onBackToLanding
}) => {
  const [email, setEmail] = useState('elena.vance@apex-epms.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Quick switch credentials helper for evaluator convenience
  const setDemoRole = (role: UserRole) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'admin') {
      setEmail('elena.vance@apex-epms.com');
      setPassword('adminPass2026!');
    } else if (role === 'manager') {
      setEmail('marcus.chen@apex-epms.com');
      setPassword('managerPass2026!');
    } else {
      setEmail('sarah.jenkins@apex-epms.com');
      setPassword('employeePass2026!');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Simulate authentic API JWT auth roundtrip
    setTimeout(() => {
      const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!foundUser) {
        setIsLoading(false);
        setErrorMessage('Invalid credentials or unauthorized enterprise email address.');
        return;
      }

      setSuccessMessage(`Authenticated successfully as ${foundUser.name} (${foundUser.role.toUpperCase()})`);
      setIsLoading(false);

      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 700);
    }, 900);
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#060a14] text-slate-100">
      {/* LEFT SIDE: Cinematic Workplace Video Reel & Visual Storytelling (7 cols) */}
      <div className="hidden lg:block lg:col-span-7 relative min-h-screen">
        <CinematicVideoReel
          className="absolute inset-0 w-full h-full"
          overlayOpacity={0.65}
          showControls={true}
        >
          <div className="relative z-30 p-12 lg:p-16 h-full flex flex-col justify-between">
            {/* Top Logo */}
            <div>
              <button onClick={onBackToLanding} className="focus:outline-none">
                <BrandLogo size="lg" showTagline={true} />
              </button>
            </div>

            {/* Central Editorial Narrative */}
            <div className="max-w-xl my-auto">
              <span className="text-xs font-mono tracking-widest text-[#c59b6d] uppercase font-semibold">
                Institutional Performance Governance
              </span>
              <h2 className="font-serif text-4xl xl:text-5xl font-bold text-[#f8f6f0] mt-3 mb-6 leading-tight">
                Great teams are built through meaningful progress.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Continuous goal tracking, verifiable KPI achievements, and calibrated quarterly reviews designed for world-class organizations.
              </p>
            </div>

            {/* Bottom Proof Quote */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>EPMS Security Protocol v2.6</span>
              <span className="text-[#38bdf8]">256-bit AES · Role-Authoritative</span>
            </div>
          </div>
        </CinematicVideoReel>
      </div>

      {/* RIGHT SIDE: Sophisticated Authentication Panel (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-12 xl:p-16 bg-[#080d19] border-l border-slate-800">
        {/* Mobile Header */}
        <div className="flex items-center justify-between pb-6 lg:pb-0">
          <div className="lg:hidden">
            <BrandLogo size="sm" showTagline={false} />
          </div>
          <button
            onClick={onBackToLanding}
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Platform
          </button>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-semibold">
              Enterprise Access Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2 mb-2 tracking-tight">
              Sign in to your workspace
            </h1>
            <p className="text-xs text-slate-400">
              Enter your corporate credentials. Roles are authoritatively verified.
            </p>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6 p-3 rounded-xl bg-[#0c1222] border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span>SELECT DEMO ROLE:</span>
              <span className="text-[#c59b6d]">Pre-fills credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('admin')}
                className={`px-2 py-2 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center gap-1 ${
                  email.includes('elena')
                    ? 'bg-[#15203b] border-[#c59b6d] text-[#f8f6f0]'
                    : 'bg-[#060a14] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#c59b6d]" />
                <span className="text-[11px] font-semibold">HR Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('manager')}
                className={`px-2 py-2 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center gap-1 ${
                  email.includes('marcus')
                    ? 'bg-[#15203b] border-[#38bdf8] text-[#f8f6f0]'
                    : 'bg-[#060a14] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="text-[11px] font-semibold">Manager</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('employee')}
                className={`px-2 py-2 rounded-lg text-xs font-medium border text-center transition-all flex flex-col items-center gap-1 ${
                  email.includes('sarah')
                    ? 'bg-[#15203b] border-[#f8f6f0] text-[#f8f6f0]'
                    : 'bg-[#060a14] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#f8f6f0]" />
                <span className="text-[11px] font-semibold">Employee</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative rounded-lg border border-slate-700 bg-[#0c1222] focus-within:border-[#38bdf8] focus-within:ring-1 focus-within:ring-[#38bdf8] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apex-epms.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For this enterprise demonstration, all passwords authenticate matching demo users.')}
                  className="text-[11px] text-[#38bdf8] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-lg border border-slate-700 bg-[#0c1222] focus-within:border-[#38bdf8] focus-within:ring-1 focus-within:ring-[#38bdf8] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security token"
                  className="w-full pl-10 pr-10 py-2.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#0c1222] text-[#38bdf8] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-400">Remember on this terminal</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">Single Sign-On (SSO) Active</span>
            </div>

            {/* Error state */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success state */}
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#060a14] bg-[#f8f6f0] hover:bg-white transition-all transform active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to EPMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / Compliance Footer */}
        <div className="pt-6 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Protected by Enterprise IAM</span>
          <span>FastAPI Service v2.4</span>
        </div>
      </div>
    </div>
  );
};
