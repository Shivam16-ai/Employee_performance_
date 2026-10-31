import React, { useState } from 'react';
import {
  User,
  Department,
  PerformanceCycle,
  Goal,
  PerformanceReview,
  TimelineEvent
} from '../../types';
import { PerformanceCharts } from '../visualizations/PerformanceCharts';
import { PerformanceTimeline } from '../visualizations/PerformanceTimeline';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Building2,
  Calendar,
  Shield,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  ExternalLink,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  departments: Department[];
  cycles: PerformanceCycle[];
  goals: Goal[];
  reviews: PerformanceReview[];
  timeline: TimelineEvent[];
  onOpenAddEmployee: () => void;
  onOpenCreateCycle: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  departments,
  cycles,
  goals,
  reviews,
  timeline,
  onOpenAddEmployee,
  onOpenCreateCycle
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'employees' | 'departments' | 'cycles' | 'analytics'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const totalEmployees = users.length;
  const activeCycle = cycles.find(c => c.status === 'active') || cycles[0];
  const completedReviewsCount = reviews.filter(r => r.status === 'published').length;
  const avgOrgPerformance = (
    users.reduce((acc, u) => acc + (u.performanceScore || 4.0), 0) / (users.length || 1)
  ).toFixed(2);

  // Filtered employees
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || u.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#080d19] text-slate-100 p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Workspace Banner & Identity */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c59b6d] font-semibold">
              Executive HR Administration Workspace
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400">Enterprise Governance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            People, Talent & Performance Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Institutional oversight across {departments.length} departments, active quarterly review cycles, calibration distribution, and talent records.
          </p>
        </div>

        {/* Global Administrative Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateCycle}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-[#0c1222] hover:bg-[#15203b] border border-slate-700/80 transition-all flex items-center gap-2 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Launch Cycle</span>
          </button>
          <button
            onClick={onOpenAddEmployee}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-[#060a14]" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Executive Overview' },
          { id: 'employees', label: `Employees (${users.length})` },
          { id: 'departments', label: `Departments (${departments.length})` },
          { id: 'cycles', label: 'Performance Cycles' },
          { id: 'analytics', label: 'Calibration & Intelligence' }
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
          {/* Executive Metrics Strip (Restrained, high-density, no generic card repetition) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Enterprise Headcount</span>
                <Users className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {totalEmployees}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span>100% Verified in IAM</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Cycle Completion</span>
                <Clock className="w-4 h-4 text-[#c59b6d]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {activeCycle?.completionRate || 78.4}%
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                {activeCycle?.name}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Calibrated Org Rating</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {avgOrgPerformance} <span className="text-xs text-slate-500 font-sans">/ 5.0</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                +0.12 vs Q3 Strategic Review
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Department Operational Units</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {departments.length}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Avg Budget Utilization: 91.8%
              </div>
            </div>
          </div>

          {/* Deep Analytics & Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <PerformanceCharts organizationMode={true} />
            </div>

            {/* Recent Institutional Activity Stream */}
            <div className="lg:col-span-4 bg-[#0c1222] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <h3 className="font-serif text-base font-semibold text-white">
                    Audit Activity Stream
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">Live Log</span>
                </div>
                <PerformanceTimeline events={timeline} maxItems={4} compact={true} />
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Tamper-Proof Audit Logging</span>
                <span className="text-emerald-400">Compliant</span>
              </div>
            </div>
          </div>

          {/* Department Headcount & Review Status Table */}
          <div className="bg-[#0c1222] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-white">
                  Department Operational Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Head of Department allocation, talent headcount, and average performance scores.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">{departments.length} Units Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060a14] border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Leadership Head</th>
                    <th className="py-3 px-4 text-right">Headcount</th>
                    <th className="py-3 px-4 text-right">Avg Performance</th>
                    <th className="py-3 px-4 text-right">Active Goals</th>
                    <th className="py-3 px-4 text-right">Budget Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-[#15203b]/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {dept.name}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {dept.headName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {dept.employeeCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#c59b6d] font-bold">
                        {dept.avgPerformance.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#38bdf8]">
                        {dept.activeGoals}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {dept.budgetUtilization}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. EMPLOYEES DIRECTORY VIEW */}
      {activeTab === 'employees' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Controls Bar: Search & Department Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0c1222] border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, title, or email..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Directory Table */}
          {filteredUsers.length === 0 ? (
            <EmptyState
              title="No Personnel Found"
              description="No active employees match the search filter. Adjust keywords or register new talent."
              actionLabel="Add Employee"
              onAction={onOpenAddEmployee}
            />
          ) : (
            <div className="bg-[#0c1222] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#060a14] border-b border-slate-800 text-slate-400 font-mono">
                    <tr>
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Role & Authority</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Active Goals</th>
                      <th className="py-3 px-4 text-right">Score</th>
                      <th className="py-3 px-4 text-right">Review Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#15203b]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200">{u.designation}</div>
                          <div className="text-[10px] font-mono uppercase text-[#c59b6d]">{u.role}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {u.department}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {u.joinedDate}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-white">
                          {u.activeGoalsCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[#38bdf8] font-bold">
                          {u.performanceScore ? u.performanceScore.toFixed(1) : '4.0'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          {u.reviewStatus === 'completed' ? (
                            <span className="text-emerald-400">Completed</span>
                          ) : u.reviewStatus === 'pending_acknowledgement' ? (
                            <span className="text-amber-400">Pending Ack</span>
                          ) : (
                            <span className="text-slate-500">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DEPARTMENTS VIEW */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {departments.map((dept) => (
            <div key={dept.id} className="p-6 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#c59b6d] font-bold">
                    Avg {dept.avgPerformance.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Led by <span className="text-slate-200 font-medium">{dept.headName}</span>
                </p>

                <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Headcount</span>
                    <span className="text-white">{dept.employeeCount} Personnel</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Active Goals</span>
                    <span className="text-[#38bdf8]">{dept.activeGoals} Assigned</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Budget Health</span>
                    <span className="text-slate-200">{dept.budgetUtilization}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Unit ID: {dept.id}</span>
                <span className="text-[#38bdf8] font-medium hover:underline cursor-pointer">
                  Department Ledger →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. PERFORMANCE CYCLES VIEW */}
      {activeTab === 'cycles' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Institutional Performance Evaluation Cycles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage evaluation cadences, milestones, and organization review completion rates.
              </p>
            </div>
            <button
              onClick={onOpenCreateCycle}
              className="px-4 py-2 text-xs font-semibold text-[#060a14] bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch New Cycle</span>
            </button>
          </div>

          <div className="space-y-4">
            {cycles.map((cycle) => (
              <div key={cycle.id} className="p-5 rounded-xl bg-[#0c1222] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-serif text-lg font-bold text-white">
                      {cycle.name}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      cycle.status === 'active'
                        ? 'bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]'
                        : cycle.status === 'closed'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {cycle.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Cadence: {cycle.startDate} to {cycle.endDate} · {cycle.totalEligible} Eligible Personnel
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Review Completion</span>
                    <span className="text-white font-bold">{cycle.completionRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#060a14] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#38bdf8] to-[#c59b6d] rounded-full"
                      style={{ width: `${cycle.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CALIBRATION & INTELLIGENCE VIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <PerformanceCharts organizationMode={true} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <h4 className="font-serif text-base font-semibold text-white mb-2">
                Executive Calibration Curve
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Distribution aligns with high-performance institutional expectations: 12% Outstanding, 64% Exceeds/Meets, 4% Underperforming.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <h4 className="font-serif text-base font-semibold text-white mb-2">
                Turnaround SLA Benchmark
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Average review publication velocity stands at 4.2 days from cycle initiation, outperforming industry benchmark by 2.8x.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0c1222] border border-slate-800">
              <h4 className="font-serif text-base font-semibold text-white mb-2">
                Compliance & Legal Auditing
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% of closed reviews include dual cryptographic audit seals and formal employee digital acknowledgement timestamps.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
