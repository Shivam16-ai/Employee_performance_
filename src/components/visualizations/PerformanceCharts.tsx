import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface PerformanceChartsProps {
  organizationMode?: boolean;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  organizationMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'competencies' | 'distribution'>('trends');

  // Trend data across quarters
  const quarterlyTrendData = [
    { quarter: 'Q1 2026', goalRate: 79, kpiScore: 82, orgCalibrated: 4.15 },
    { quarter: 'Q2 2026', goalRate: 84, kpiScore: 85, orgCalibrated: 4.30 },
    { quarter: 'Q3 2026', goalRate: 91, kpiScore: 89, orgCalibrated: 4.52 },
    { quarter: 'Q4 2026 (Active)', goalRate: 88, kpiScore: 92, orgCalibrated: 4.65 }
  ];

  // Competency evaluation radar (Current vs Prior quarter)
  const competencyRadarData = [
    { subject: 'Strategic Execution', current: 92, prior: 84, fullMark: 100 },
    { subject: 'Technical Excellence', current: 96, prior: 88, fullMark: 100 },
    { subject: 'System Architecture', current: 89, prior: 78, fullMark: 100 },
    { subject: 'Collaborative Leadership', current: 85, prior: 80, fullMark: 100 },
    { subject: 'Innovation & Impact', current: 94, prior: 82, fullMark: 100 },
    { subject: 'Operational Discipline', current: 90, prior: 86, fullMark: 100 }
  ];

  // Department distribution
  const departmentDistributionData = [
    { dept: 'Eng & Tech', count: 34, avgRating: 4.52 },
    { dept: 'Product & Arch', count: 18, avgRating: 4.41 },
    { dept: 'Quant Research', count: 12, avgRating: 4.68 },
    { dept: 'Global Ops', count: 22, avgRating: 4.25 },
    { dept: 'People & Org', count: 8, avgRating: 4.75 }
  ];

  return (
    <div className="w-full bg-[#0c1222] border border-slate-800/90 rounded-xl p-5 shadow-xl">
      {/* Chart Header & Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-serif text-lg font-semibold text-white tracking-tight">
            {organizationMode ? 'Enterprise Performance Intelligence' : 'Performance Calibration & Competencies'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarterly trajectory, evaluated competencies, and cross-functional performance index.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 bg-[#060a14] rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'trends'
                ? 'bg-[#15203b] text-white shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quarterly Trajectory
          </button>
          <button
            onClick={() => setActiveTab('competencies')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'competencies'
                ? 'bg-[#15203b] text-white shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Competency Radar
          </button>
          {organizationMode && (
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'distribution'
                  ? 'bg-[#15203b] text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Departments
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="mt-4 pt-2 h-72 w-full">
        {activeTab === 'trends' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={quarterlyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientElectric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradientCopper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c59b6d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c59b6d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="quarter" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1222',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8f6f0',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="kpiScore"
                name="KPI Score (%)"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradientElectric)"
              />
              <Area
                type="monotone"
                dataKey="goalRate"
                name="Goal Completion (%)"
                stroke="#c59b6d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradientCopper)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'competencies' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyRadarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
              <Radar
                name="Q4 2026 (Current)"
                dataKey="current"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.45}
              />
              <Radar
                name="Q3 2026 (Prior)"
                dataKey="prior"
                stroke="#c59b6d"
                fill="#c59b6d"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1222',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8f6f0',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'distribution' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentDistributionData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="dept" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c1222',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8f6f0',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="avgRating" name="Avg Performance (1-5)" fill="#c59b6d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
            <span>KPI Benchmark (Target $\ge$ 85%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c59b6d]" />
            <span>Goal Execution Index</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Calibrated Period: Q4 2026 · Cycle Active
        </span>
      </div>
    </div>
  );
};
