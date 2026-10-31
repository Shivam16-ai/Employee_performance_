import React from 'react';
import { CinematicVideoReel } from '../common/CinematicVideoReel';
import { BrandLogo } from '../common/BrandLogo';
import { PerformanceCharts } from '../visualizations/PerformanceCharts';
import {
  Shield,
  Target,
  UserCheck,
  CheckCircle,
  FileCheck2,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onExplore: () => void;
  onLogin: () => void;
  onRoleSwitch: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onLogin,
  onRoleSwitch
}) => {
  return (
    <div className="w-full min-h-screen bg-[#060a14] text-slate-100 selection:bg-[#38bdf8]/20 selection:text-[#38bdf8]">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
        <CinematicVideoReel
          className="absolute inset-0 w-full h-full"
          overlayOpacity={0.62}
          showControls={true}
        >
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-28 min-h-[92vh] flex flex-col justify-center items-center text-center">
            {/* Editorial Brand Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1222]/80 border border-[#c59b6d]/40 backdrop-blur-md mb-8 animate-in fade-in duration-700">
              <span className="w-2 h-2 rounded-full bg-[#c59b6d]" />
              <span className="text-xs font-mono tracking-widest text-[#f8f6f0] uppercase font-semibold">
                EPMS Enterprise Suite · People. Performance. Progress.
              </span>
            </div>

            {/* Hero Headline with Text Mask & Editorial Serif Typography */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f8f6f0] max-w-4xl leading-[1.08] mb-6 text-balance">
              Performance is more than a number.
            </h1>

            {/* Supporting Prose */}
            <p className="font-sans text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
              An intelligent enterprise approach to employee goals, continuous performance tracking, KPI calibration, and meaningful team growth.
            </p>

            {/* Hero CTA */}
            <div>
              <button
                onClick={onLogin}
                className="px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#0c1222]/90 hover:bg-[#15203b] border border-slate-700/80 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-xl hover:-translate-y-0.5"
              >
                <span>Employee Login</span>
                <span className="text-[#38bdf8] font-mono text-xs">→</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="mt-16 pt-8 border-t border-slate-800/80 w-full max-w-3xl flex flex-wrap items-center justify-around gap-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#c59b6d]" />
                <span>Role-Authoritative Governance</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#38bdf8]" />
                <span>Immutable Review Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Real-Time KPI Calibration</span>
              </div>
            </div>
          </div>
        </CinematicVideoReel>
      </section>

      {/* 2. THREE-ROLE ARCHITECTURE SHOWCASE */}
      <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c59b6d] font-semibold">
            01. Dedicated Workspace Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3 mb-4 tracking-tight">
            Designed for every tier of leadership and talent.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Eliminating confusing all-in-one dashboards. EPMS delivers tailored, secure interfaces specifically architected for Executive HR, People Managers, and Individual Contributors.
          </p>
        </div>

        {/* 3 Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin / HR Card */}
          <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-7 flex flex-col justify-between hover:border-[#c59b6d]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#c59b6d]/10 border border-[#c59b6d]/30 flex items-center justify-center text-[#c59b6d] mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#c59b6d] mb-1">
                Executive & HR
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">
                Administrative Workspace
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Complete institutional oversight. Department distributions, performance cycles, cross-department calibrations, manager assignments, and compliance tracking.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#c59b6d]" />
                  <span>Cycle progress & completion rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#c59b6d]" />
                  <span>Cross-organizational talent calibration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#c59b6d]" />
                  <span>Department head budgeting & headcount</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onRoleSwitch('admin');
                onExplore();
              }}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-[#15203b] hover:bg-[#1e2f56] text-xs font-semibold text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore HR Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#c59b6d]" />
            </button>
          </div>

          {/* People Manager Card */}
          <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-7 flex flex-col justify-between hover:border-[#38bdf8]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#38bdf8] mb-1">
                Team Leadership
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">
                Manager Workspace
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Empower directors and managers to set weighted goals, track automatic KPIs, conduct 5-point quarterly reviews, and publish actionable coaching feedback.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Goal creation with weighted KPIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Quarterly review evaluation & scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Official review publication pipeline</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onRoleSwitch('manager');
                onExplore();
              }}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-[#15203b] hover:bg-[#1e2f56] text-xs font-semibold text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Manager Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#38bdf8]" />
            </button>
          </div>

          {/* Employee Card */}
          <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-7 flex flex-col justify-between hover:border-[#f8f6f0]/50 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f8f6f0]/10 border border-[#f8f6f0]/30 flex items-center justify-center text-[#f8f6f0] mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#f8f6f0] mb-1">
                Individual Contributor
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">
                Employee Portal
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Clear visibility into assigned goals, milestone check-ins, automated telemetry KPIs, historical scores, and formal digital review acknowledgement.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#f8f6f0]" />
                  <span>Personal progress updates & milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#f8f6f0]" />
                  <span>Formal review acknowledgement & feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#f8f6f0]" />
                  <span>Strict personal privacy sandbox</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onRoleSwitch('employee');
                onExplore();
              }}
              className="mt-8 w-full py-2.5 px-4 rounded-lg bg-[#15203b] hover:bg-[#1e2f56] text-xs font-semibold text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Employee Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#f8f6f0]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PERFORMANCE VISUALIZATION & METHODOLOGY */}
      <section id="methodology" className="py-20 px-6 bg-[#0a0e1a] border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#38bdf8] font-semibold">
              02. Rigorous Evaluation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3 mb-5 leading-tight">
              Calibrated ratings. Zero arbitrary ambiguity.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Conventional reviews fail because expectations are opaque. EPMS pairs quantitative KPI telemetry directly with qualitative competency assessments across four core leadership dimensions.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0c1222] border border-slate-800 flex items-start gap-3">
                <span className="font-mono text-[#c59b6d] font-bold text-sm">1-5</span>
                <div>
                  <div className="font-semibold text-white">Standardized Rating Scale</div>
                  <div className="text-slate-400 mt-0.5">
                    1 (Poor) · 2 (Needs Improvement) · 3 (Meets Expectations) · 4 (Exceeds Expectations) · 5 (Outstanding).
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0c1222] border border-slate-800 flex items-start gap-3">
                <span className="font-mono text-[#38bdf8] font-bold text-sm">KPI</span>
                <div>
                  <div className="font-semibold text-white">Target vs. Actual Weighting</div>
                  <div className="text-slate-400 mt-0.5">
                    Measurable metrics (latency, revenue, SLA, milestones) calculated automatically with higher/lower-is-better logic.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0c1222] border border-slate-800 flex items-start gap-3">
                <span className="font-mono text-emerald-400 font-bold text-sm">REV</span>
                <div>
                  <div className="font-semibold text-white">Immutable Publication & Sign-Off</div>
                  <div className="text-slate-400 mt-0.5">
                    Once published, evaluation scores cannot be tampered with. Employees sign off with timestamped digital acknowledgement.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chart Preview */}
          <div className="lg:col-span-7">
            <PerformanceCharts organizationMode={true} />
          </div>
        </div>
      </section>

      {/* 4. QUANTITATIVE PROOF & EDITORIAL STATEMENT */}
      <section id="enterprise" className="py-24 px-6 max-w-5xl mx-auto text-center">
        <blockquote className="font-serif text-2xl sm:text-3xl text-[#f8f6f0] leading-snug max-w-3xl mx-auto mb-8 italic">
          "Great teams are not built by passive annual appraisals. They are built through continuous alignment, transparent benchmarks, and meaningful mutual accountability."
        </blockquote>
        <div className="text-xs font-mono text-[#c59b6d] tracking-widest uppercase">
          EPMS Architecture Standard · Executive Whitepaper 2026
        </div>

        {/* Quantitative Proof Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-white tabular-nums mb-1">
              98.4%
            </div>
            <div className="text-xs text-slate-400">
              On-Time Review Cycles
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#38bdf8] tabular-nums mb-1">
              3.4x
            </div>
            <div className="text-xs text-slate-400">
              Faster Goal Calibration
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#c59b6d] tabular-nums mb-1">
              100%
            </div>
            <div className="text-xs text-slate-400">
              Audit Trail Compliance
            </div>
          </div>
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums mb-1">
              4.62
            </div>
            <div className="text-xs text-slate-400">
              Org Average Performance
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-800 py-12 px-6 bg-[#04070e] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" showTagline={true} />
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Version 2.6.4 Production</span>
            <span>·</span>
            <span>FastAPI Secure Gateway</span>
            <span>·</span>
            <span>© 2026 EPMS Enterprise</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
