import React, { useState } from 'react';
import {
  User,
  Goal,
  PerformanceReview,
  TimelineEvent,
  KPI
} from '../../types';
import { PerformanceTimeline } from '../visualizations/PerformanceTimeline';
import { PerformanceCharts } from '../visualizations/PerformanceCharts';
import { EmptyState } from '../common/EmptyState';
import {
  Target,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sliders,
  MessageSquare
} from 'lucide-react';

interface EmployeeDashboardProps {
  currentUser: User;
  goals: Goal[];
  reviews: PerformanceReview[];
  timeline: TimelineEvent[];
  onOpenUpdateProgress: (goal: Goal) => void;
  onOpenAcknowledgeReview: (review: PerformanceReview) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  goals,
  reviews,
  timeline,
  onOpenUpdateProgress,
  onOpenAcknowledgeReview
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'goals' | 'kpis' | 'updates' | 'reviews' | 'history'
  >('overview');

  // Strict Privacy Sandbox: Only filter current user's records
  const myGoals = goals.filter((g) => g.assignedEmployeeId === currentUser.id);
  const myReviews = reviews.filter((r) => r.employeeId === currentUser.id);
  const latestReview = myReviews[0];
  const pendingReview = myReviews.find((r) => r.status === 'published' && !r.employeeAcknowledged);

  const avgCompletion = myGoals.length
    ? Math.round(myGoals.reduce((acc, g) => acc + g.progressPercentage, 0) / myGoals.length)
    : 85;

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#080d19] text-slate-100 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Employee Greeting & Privacy Sandbox Notification */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-semibold">
              Employee Performance Portal
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-emerald-400">Personal Confidential Sandbox</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {currentUser.designation} · {currentUser.department} · Reporting to {currentUser.managerName || 'Marcus Chen'}
          </p>
        </div>

        {/* Pending Acknowledgment Alert Button */}
        {pendingReview && (
          <button
            onClick={() => onOpenAcknowledgeReview(pendingReview)}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#060a14] bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg animate-pulse"
          >
            <AlertCircle className="w-4 h-4 text-[#060a14]" />
            <span>Action Required: Sign Q4 Review</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'My Overview' },
          { id: 'goals', label: `My Assigned Goals (${myGoals.length})` },
          { id: 'kpis', label: 'My KPIs' },
          { id: 'updates', label: 'Progress Check-Ins' },
          { id: 'reviews', label: `Performance Reviews (${myReviews.length})` },
          { id: 'history', label: 'My Trajectory & History' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#38bdf8] text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW VIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Calibrated Score</span>
                <Award className="w-4 h-4 text-[#c59b6d]" />
              </div>
              <div className="text-3xl font-mono font-bold text-[#c59b6d] tabular-nums">
                {currentUser.performanceScore || 4.6} <span className="text-xs text-slate-500 font-sans">/ 5.0</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1">
                Exceeds Expectations
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Active Goals</span>
                <Target className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {myGoals.length}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Avg Progress: {avgCompletion}%
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Active Cycle</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white tabular-nums">
                Q4 2026
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Cycle Deadline: Dec 31, 2026
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Review Audit Status</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {latestReview?.employeeAcknowledged ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 text-base">
                    <CheckCircle2 className="w-4 h-4" /> Signed & Sealed
                  </span>
                ) : (
                  <span className="text-amber-400 text-base">Pending Sign-off</span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Evaluator: {currentUser.managerName || 'Marcus Chen'}
              </div>
            </div>
          </div>

          {/* Pending Review Sign-Off Banner */}
          {pendingReview && (
            <div className="p-6 rounded-xl bg-[#0c1222] border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Official Action Required · Q4 2026 Evaluation
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  Your Performance Review has been published by {pendingReview.managerName}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Overall Calibrated Score: <strong className="text-[#c59b6d]">{pendingReview.overallScore} / 5.0</strong>. Please review managerial feedback, goal milestones, and digitally sign off.
                </p>
              </div>
              <button
                onClick={() => onOpenAcknowledgeReview(pendingReview)}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#060a14] bg-amber-400 hover:bg-amber-300 whitespace-nowrap shadow-md transition-colors"
              >
                Review & Confirm Signature
              </button>
            </div>
          )}

          {/* Goals & Check-in Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Active Performance Goals
                </h3>
                <p className="text-xs text-slate-400">
                  Update your completion percentage and log milestone progress.
                </p>
              </div>
            </div>

            {myGoals.map((g) => (
              <div key={g.id} className="p-5 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#060a14] border border-slate-800 text-[#38bdf8]">
                        {g.category}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#15203b] border border-slate-700 text-slate-300">
                        Priority: {g.priority}
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-white">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenUpdateProgress(g)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#15203b] hover:bg-[#1e2f56] border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Update Progress
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Execution Progress</span>
                    <span className="text-[#38bdf8] font-bold">{g.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#060a14] overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-[#38bdf8] to-[#c59b6d] rounded-full transition-all duration-500"
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>

                  {/* Milestones list */}
                  {g.milestones && (
                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/50">
                      {g.milestones.map((ms) => (
                        <div key={ms.id} className="flex items-center justify-between text-[11px]">
                          <span className={ms.completed ? 'line-through text-slate-500' : 'text-slate-300'}>
                            · {ms.title}
                          </span>
                          <span className="font-mono text-slate-500">
                            {ms.completed ? 'Completed' : `Due ${ms.dueDate}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Manager Written Feedback */}
          {latestReview && (
            <div className="p-6 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <h3 className="font-serif text-base font-bold text-white">
                  Latest Manager Coaching Guidance · {latestReview.period}
                </h3>
                <span className="text-xs font-mono text-[#c59b6d]">
                  Score: {latestReview.overallScore} / 5.0
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-lg bg-[#060a14] border border-slate-800/80">
                  <div className="font-semibold text-white mb-1.5">Recognized Strengths</div>
                  <p className="text-slate-300 leading-relaxed">
                    {latestReview.writtenFeedback.strengths}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#060a14] border border-slate-800/80">
                  <div className="font-semibold text-white mb-1.5">Strategic Growth Horizon</div>
                  <p className="text-slate-300 leading-relaxed">
                    {latestReview.writtenFeedback.forwardLookingGoals}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MY GOALS VIEW */}
      {activeTab === 'goals' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {myGoals.map((g) => (
            <div key={g.id} className="p-6 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#060a14] border border-slate-800 text-[#38bdf8]">
                    {g.category}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-white mt-2">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {g.description}
                  </p>
                </div>
                <button
                  onClick={() => onOpenUpdateProgress(g)}
                  className="px-4 py-2 text-xs font-semibold text-[#060a14] bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors whitespace-nowrap"
                >
                  Log Progress Update
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-[#38bdf8] font-bold">{g.progressPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#060a14] overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#38bdf8] to-[#c59b6d] rounded-full"
                    style={{ width: `${g.progressPercentage}%` }}
                  />
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Deadline: {g.deadline} · Assigned by {currentUser.managerName || 'Marcus Chen'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. MY KPIS VIEW */}
      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
            <h3 className="font-serif text-lg font-bold text-white mb-1">
              Objective Metric Telemetry
            </h3>
            <p className="text-xs text-slate-400">
              Live indicators tied directly to assigned engineering and architecture milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myGoals.flatMap((g) => g.kpis || []).map((kpi) => (
              <div key={kpi.id} className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8] font-semibold">
                    {kpi.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Frequency: {kpi.updateFrequency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-800 font-mono">
                  <div>
                    <div className="text-[11px] text-slate-400">Target SLA</div>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {kpi.targetValue} {kpi.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Recorded Metric</div>
                    <div className="text-xl font-bold text-[#c59b6d] mt-0.5">
                      {kpi.actualValue} {kpi.unit}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Weight: {kpi.weight}%</span>
                  <span className="text-emerald-400 font-mono">Target Achieved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UPDATES VIEW */}
      {activeTab === 'updates' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
            <h3 className="font-serif text-lg font-bold text-white mb-1">
              Continuous Progress Check-In Stream
            </h3>
            <p className="text-xs text-slate-400">
              Chronological milestone validations and performance delta entries.
            </p>
          </div>

          <div className="bg-[#0c1222] border border-slate-800 rounded-xl p-6">
            <PerformanceTimeline events={timeline} maxItems={6} />
          </div>
        </div>
      )}

      {/* 5. REVIEWS VIEW */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {myReviews.map((rev) => (
            <div key={rev.id} className="p-6 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
                <div>
                  <span className="text-xs font-mono text-[#c59b6d] uppercase font-semibold">
                    {rev.period} Formal Review
                  </span>
                  <h4 className="font-serif text-xl font-bold text-white mt-1">
                    Evaluated by {rev.managerName}
                  </h4>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Published: {rev.publishedAt}
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-3xl font-mono font-bold text-[#c59b6d]">
                    {rev.overallScore} <span className="text-xs text-slate-500 font-sans">/ 5.0</span>
                  </div>
                  <div className="text-xs font-mono mt-1">
                    {rev.employeeAcknowledged ? (
                      <span className="text-emerald-400 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenAcknowledgeReview(rev)}
                        className="px-3 py-1 rounded bg-amber-400 text-[#060a14] font-semibold text-xs"
                      >
                        Sign & Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Categorical Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {rev.categoryScores.map((cat) => (
                  <div key={cat.category} className="p-3 rounded-lg bg-[#060a14] border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">{cat.category}</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {cat.score} / 5
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback text */}
              <div className="p-4 rounded-lg bg-[#080d19] border border-slate-800 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-white">Strengths: </span>
                  <span className="text-slate-300">{rev.writtenFeedback.strengths}</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Areas for Growth: </span>
                  <span className="text-slate-300">{rev.writtenFeedback.areasForGrowth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <PerformanceCharts organizationMode={false} />
        </div>
      )}
    </div>
  );
};
