import React, { useState } from 'react';
import { X, Target, Plus, Trash2 } from 'lucide-react';
import { Goal, KPI, User } from '../../types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Goal) => void;
  teamMembers: User[];
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
  teamMembers
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Goal['category']>('Technical');
  const [priority, setPriority] = useState<Goal['priority']>('high');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(teamMembers[0]?.id || '');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [trackingMethod, setTrackingMethod] = useState<'manual' | 'kpi_linked'>('kpi_linked');

  // KPI fields
  const [kpiName, setKpiName] = useState('Target SLA Benchmark');
  const [kpiUnit, setKpiUnit] = useState('%');
  const [kpiTarget, setKpiTarget] = useState(95);
  const [kpiDirection, setKpiDirection] = useState<'higher_is_better' | 'lower_is_better'>('higher_is_better');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = teamMembers.find(m => m.id === assignedEmployeeId) || teamMembers[0];

    const kpiId = `kpi_${Date.now()}`;
    const generatedKpi: KPI = {
      id: kpiId,
      name: kpiName,
      unit: kpiUnit,
      targetValue: kpiTarget,
      actualValue: 0,
      weight: 100,
      direction: kpiDirection,
      updateFrequency: 'weekly',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      title,
      description,
      category,
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      priority,
      assignedEmployeeId: assignedUser.id,
      assignedEmployeeName: assignedUser.name,
      department: assignedUser.department,
      associatedKpiIds: [kpiId],
      kpis: [generatedKpi],
      progressTrackingMethod: trackingMethod,
      progressPercentage: 0,
      status: 'on_track',
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Kickoff & Baseline Assessment', completed: false, dueDate: deadline },
        { id: `m_${Date.now()}_2`, title: 'Mid-Cycle Production Validation', completed: false, dueDate: deadline }
      ]
    };

    onAddGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-[#0c1222] z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Assign Strategic Goal & KPIs
              </h3>
              <p className="text-[11px] text-slate-400">
                Define measurable objectives with calibrated success criteria.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Goal Objective / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Geo-Distributed Microservices Latency Hardening"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Detailed Scope & Execution Standard
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide strategic context, architectural constraints, and target outcomes..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assignee (Team Member)
              </label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.designation})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="Technical">Technical</option>
                <option value="Strategic">Strategic</option>
                <option value="Operational">Operational</option>
                <option value="Leadership">Leadership</option>
                <option value="Growth">Growth</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="low">Low (Discretionary)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Core Priority)</option>
                <option value="urgent">Urgent (Executive Critical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>

          {/* KPI Assignment Sub-Card */}
          <div className="p-4 rounded-xl bg-[#060a14] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#c59b6d] uppercase">
                Associated Telemetry KPI
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Weight: 100%</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">KPI Benchmark Name</label>
                <input
                  type="text"
                  value={kpiName}
                  onChange={(e) => setKpiName(e.target.value)}
                  placeholder="e.g. P99 Latency SLA"
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0c1222] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Measurement Unit</label>
                <input
                  type="text"
                  value={kpiUnit}
                  onChange={(e) => setKpiUnit(e.target.value)}
                  placeholder="e.g. %, ms, tokens/sec"
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0c1222] border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Numeric Value</label>
                <input
                  type="number"
                  value={kpiTarget}
                  onChange={(e) => setKpiTarget(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0c1222] border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Success Direction</label>
                <select
                  value={kpiDirection}
                  onChange={(e) => setKpiDirection(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0c1222] border border-slate-700 text-white"
                >
                  <option value="higher_is_better">Higher is Better (e.g. %, Revenue)</option>
                  <option value="lower_is_better">Lower is Better (e.g. Latency, Errors)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-[#060a14] bg-[#f8f6f0] hover:bg-white rounded-lg transition-colors"
            >
              Assign Goal to Contributor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
