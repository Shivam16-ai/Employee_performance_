import React, { useState } from 'react';
import {
  User,
  Goal,
  PerformanceReview,
  TimelineEvent,
  KPI
} from '../../types';
import { EmptyState } from '../common/EmptyState';
import { PerformanceCharts } from '../visualizations/PerformanceCharts';
import { PerformanceTimeline } from '../visualizations/PerformanceTimeline';
import {
  Users,
  Target,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sliders,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ManagerDashboardProps {
  currentUser: User;
  users: User[];
  goals: Goal[];
  reviews: PerformanceReview[];
  timeline: TimelineEvent[];
  onOpenCreateGoal: () => void;
  onOpenReviewModal: (employee: User) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentUser,
  users,
  goals,
  reviews,
  timeline,
  onOpenCreateGoal,
  onOpenReviewModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'team' | 'goals' | 'kpis' | 'reviews' | 'history'
  >('overview');

  // Direct reports (Marcus Chen manages engineering & technology team)
  const teamMembers = users.filter(
    (u) => u.managerId === currentUser.id || u.role === 'employee'
  );

  // Team goals
  const teamGoals = goals.filter((g) =>
    teamMembers.some((m) => m.id === g.assignedEmployeeId)
  );

  // Calculation metrics
  const avgTeamScore = (
    teamMembers.reduce((acc, m) => acc + (m.performanceScore || 4.0), 0) /
    (teamMembers.length || 1)
  ).toFixed(1);

  const completedGoalsCount = teamGoals.filter((g) => g.status === 'completed').length;
  const inProgressGoalsCount = teamGoals.filter((g) => g.status === 'on_track' || g.status === 'at_risk').length;

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#080d19] text-slate-100 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Manager Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-semibold">
              Management & Team Leadership Workspace
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Engineering & Technology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Director Workspace · {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Leading {teamMembers.length} engineers and technical architects across goal execution, KPI calibration, and quarterly performance reviews.
          </p>
        </div>

        {/* Manager Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateGoal}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-[#060a14]" />
            <span>Create Employee Goal</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Team Overview' },
          { id: 'team', label: `My Team Directory (${teamMembers.length})` },
          { id: 'goals', label: `Team Goals (${teamGoals.length})` },
          { id: 'kpis', label: 'KPI Tracking Matrix' },
          { id: 'reviews', label: 'Quarterly Reviews' },
          { id: 'history', label: 'Historical Audits' }
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
                <span>Direct Reports</span>
                <Users className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {teamMembers.length}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Engineering & Technology
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Team Average Rating</span>
                <Award className="w-4 h-4 text-[#c59b6d]" />
              </div>
              <div className="text-3xl font-mono font-bold text-[#c59b6d] tabular-nums">
                {avgTeamScore} <span className="text-xs text-slate-500 font-sans">/ 5.0</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1">
                Top Decile Organizational Tier
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Active Goals Executing</span>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {teamGoals.length}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                {completedGoalsCount} Concluded · {inProgressGoalsCount} In Progress
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="text-slate-400 text-xs mb-2 flex items-center justify-between">
                <span>Q4 Review Status</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-[#38bdf8] tabular-nums">
                100%
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Drafts Ready for Calibration
              </div>
            </div>
          </div>

          {/* Visualization Component */}
          <PerformanceCharts organizationMode={false} />

          {/* Priority Team Roster with Direct Review Action */}
          <div className="bg-[#0c1222] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-white">
                  Team Member Performance Roster
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Launch quarterly evaluations, monitor live progress, and review individual feedback.
                </p>
              </div>
              <button
                onClick={onOpenCreateGoal}
                className="px-3 py-1.5 text-xs font-semibold text-[#060a14] bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Goal</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060a14] border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">Team Member</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4 text-right">Active Goals</th>
                    <th className="py-3 px-4 text-right">Performance Score</th>
                    <th className="py-3 px-4 text-right">Q4 Review Status</th>
                    <th className="py-3 px-4 text-right">Manager Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {teamMembers.map((member) => {
                    const memberReview = reviews.find((r) => r.employeeId === member.id);
                    return (
                      <tr key={member.id} className="hover:bg-[#15203b]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {member.designation}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-white">
                          {member.activeGoalsCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[#c59b6d] font-bold">
                          {member.performanceScore ? member.performanceScore.toFixed(1) : '4.0'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          {memberReview?.status === 'published' ? (
                            memberReview.employeeAcknowledged ? (
                              <span className="text-emerald-400 flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Acknowledged
                              </span>
                            ) : (
                              <span className="text-amber-400">Published (Pending Ack)</span>
                            )
                          ) : (
                            <span className="text-slate-500">Draft / In Progress</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onOpenReviewModal(member)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#15203b] hover:bg-[#1e2f56] text-white border border-slate-700/80 transition-colors"
                          >
                            Conduct Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEAM DIRECTORY VIEW */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-6 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#15203b] border border-slate-700 flex items-center justify-center font-serif font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-xs font-mono text-[#c59b6d] font-bold">
                    Score: {member.performanceScore ? member.performanceScore.toFixed(1) : '4.0'}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {member.designation}
                </p>
                <div className="text-[11px] font-mono text-slate-500 mb-4">
                  {member.email} · Joined {member.joinedDate}
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Department</span>
                    <span className="text-white">{member.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Review State</span>
                    <span className="text-[#38bdf8] uppercase">{member.reviewStatus}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onOpenReviewModal(member)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/40 transition-colors"
                >
                  Manage Q4 Review →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. GOALS VIEW */}
      {activeTab === 'goals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Team Goal Execution Matrix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor strategic milestones, SLA commitments, and completion timelines.
              </p>
            </div>
            <button
              onClick={onOpenCreateGoal}
              className="px-4 py-2 text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Goal</span>
            </button>
          </div>

          <div className="space-y-4">
            {teamGoals.map((g) => (
              <div key={g.id} className="p-5 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[#060a14] border border-slate-800 text-[#38bdf8]">
                        {g.category}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        g.priority === 'urgent'
                          ? 'bg-red-950/40 border-red-800/60 text-red-300'
                          : 'bg-[#15203b] border-slate-700 text-slate-300'
                      }`}>
                        Priority: {g.priority}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">
                      {g.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <span className="text-xs text-slate-400">Assigned To</span>
                    <div className="text-xs font-semibold text-white font-mono mt-0.5">
                      {g.assignedEmployeeName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Deadline: {g.deadline}
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Indicators */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-400">Progress Trajectory</span>
                    <span className="text-[#38bdf8] font-bold">{g.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#060a14] overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-[#38bdf8] to-[#c59b6d] rounded-full transition-all duration-500"
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>

                  {/* Milestones list */}
                  {g.milestones && g.milestones.length > 0 && (
                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/50">
                      {g.milestones.map((ms) => (
                        <div key={ms.id} className="flex items-center justify-between text-[11px]">
                          <span className={ms.completed ? 'line-through text-slate-500' : 'text-slate-300'}>
                            · {ms.title}
                          </span>
                          <span className="font-mono text-slate-500">
                            {ms.completed ? 'Validated' : `Target: ${ms.dueDate}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. KPIS VIEW */}
      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
            <h3 className="font-serif text-lg font-bold text-white mb-1">
              Automated Telemetry KPI Calibration
            </h3>
            <p className="text-xs text-slate-400">
              Live telemetry tracking targets vs actual execution values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamGoals.flatMap((g) => g.kpis || []).map((kpi) => (
              <div key={kpi.id} className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8] font-semibold">
                    {kpi.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Updated: {kpi.lastUpdated}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-800 font-mono">
                  <div>
                    <div className="text-[11px] text-slate-400">Target Value</div>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {kpi.targetValue} {kpi.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Actual Value</div>
                    <div className="text-xl font-bold text-[#c59b6d] mt-0.5">
                      {kpi.actualValue} {kpi.unit}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Weight: {kpi.weight}%</span>
                  <span className="text-emerald-400 font-mono">On Track (SLA Met)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. REVIEWS VIEW */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                Quarterly Evaluation & Publishing Engine
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated 1-5 ratings across Strategic, Technical, and Leadership dimensions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-xl bg-[#0c1222] border border-slate-800">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-[#c59b6d] uppercase font-semibold">
                      {rev.period} Official Review
                    </span>
                    <h4 className="font-serif text-xl font-bold text-white mt-1">
                      {rev.employeeName} · {rev.employeeRole}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Evaluated by {rev.managerName} · Published: {rev.publishedAt}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-3xl font-mono font-bold text-[#c59b6d]">
                      {rev.overallScore} <span className="text-xs text-slate-500 font-sans">/ 5.0</span>
                    </div>
                    <div className="text-xs font-mono mt-1">
                      {rev.employeeAcknowledged ? (
                        <span className="text-emerald-400">Digital Signature Validated</span>
                      ) : (
                        <span className="text-amber-400">Pending Contributor Signature</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dimension Scores */}
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

                {/* Qualitative Strengths & Growth */}
                <div className="p-4 rounded-lg bg-[#080d19] border border-slate-800 text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-white">Strengths: </span>
                    <span className="text-slate-300">{rev.writtenFeedback.strengths}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Growth Focus: </span>
                    <span className="text-slate-300">{rev.writtenFeedback.areasForGrowth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HISTORY AUDITS VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
            <h3 className="font-serif text-lg font-bold text-white mb-1">
              Historical Review Archival & Audit Logs
            </h3>
            <p className="text-xs text-slate-400">
              Multi-quarter chronological records, rating calibration shifts, and timestamped acknowledgements.
            </p>
          </div>

          <div className="bg-[#0c1222] border border-slate-800 rounded-xl p-6">
            <PerformanceTimeline events={timeline} maxItems={8} />
          </div>
        </div>
      )}
    </div>
  );
};
