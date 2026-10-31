import React, { useState } from 'react';
import { X, Calendar, PlusCircle } from 'lucide-react';
import { PerformanceCycle } from '../../types';

interface CreateCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCycle: (cycle: PerformanceCycle) => void;
  totalEmployees: number;
}

export const CreateCycleModal: React.FC<CreateCycleModalProps> = ({
  isOpen,
  onClose,
  onAddCycle,
  totalEmployees
}) => {
  const [name, setName] = useState('');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [year, setYear] = useState(2027);
  const [startDate, setStartDate] = useState('2027-01-01');
  const [endDate, setEndDate] = useState('2027-03-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCycle: PerformanceCycle = {
      id: `cycle_${quarter.toLowerCase()}_${year}`,
      name: name || `${quarter} ${year} Strategic Performance Cycle`,
      quarter,
      year,
      startDate,
      endDate,
      status: 'upcoming',
      completionRate: 0,
      totalEligible: totalEmployees
    };
    onAddCycle(newCycle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Launch Performance Review Cycle
              </h3>
              <p className="text-[11px] text-slate-400">
                Initiate a structured organizational evaluation cadence.
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
              Cycle Nomenclature
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q1 2027 Strategic Horizon Cycle"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Quarter
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="Q1">Q1 (Jan - Mar)</option>
                <option value="Q2">Q2 (Apr - Jun)</option>
                <option value="Q3">Q3 (Jul - Sep)</option>
                <option value="Q4">Q4 (Oct - Dec)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Calendar Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2027)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                End Date (Cut-off)
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#060a14] border border-slate-800 text-xs text-slate-400 font-mono">
            <span>Eligible Personnel: </span>
            <span className="text-[#38bdf8] font-bold">{totalEmployees} Active Employees</span>
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
              className="px-5 py-2 text-xs font-semibold text-[#060a14] bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors"
            >
              Initialize Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
