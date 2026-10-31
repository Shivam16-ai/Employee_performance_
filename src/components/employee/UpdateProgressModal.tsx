import React, { useState } from 'react';
import { X, TrendingUp, CheckSquare, Square } from 'lucide-react';
import { Goal } from '../../types';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (goalId: string, progress: number, milestoneId?: string) => void;
  goal: Goal;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  goal
}) => {
  const [progress, setProgress] = useState(goal.progressPercentage);
  const [selectedMilestone, setSelectedMilestone] = useState<string | undefined>(
    goal.milestones.find(m => !m.completed)?.id
  );
  const [updateNote, setUpdateNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(goal.id, progress, selectedMilestone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Log Progress & Milestones
              </h3>
              <p className="text-[11px] text-slate-400">
                Update completion status for "{goal.title}"
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Overall Completion Percentage
              </label>
              <span className="text-base font-mono font-bold text-[#38bdf8]">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
              className="w-full h-2 bg-[#060a14] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0% (Initiated)</span>
              <span>50% (Midway)</span>
              <span>100% (Completed)</span>
            </div>
          </div>

          {/* Milestone Selection */}
          {goal.milestones && goal.milestones.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Associate with Key Milestone
              </label>
              <div className="space-y-2">
                {goal.milestones.map((ms) => {
                  const isChecked = selectedMilestone === ms.id || ms.completed;
                  return (
                    <div
                      key={ms.id}
                      onClick={() => !ms.completed && setSelectedMilestone(ms.id)}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#15203b] border-[#38bdf8]/60 text-white'
                          : 'bg-[#060a14] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={ms.completed ? 'line-through text-slate-500' : ''}>
                          {ms.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ms.completed ? 'Validated' : `Due ${ms.dueDate}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Update Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Progress Narrative & Verification Notes
            </label>
            <textarea
              rows={3}
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              placeholder="Detail quantitative achievements, telemetry logs, or blocker resolutions..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
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
              Submit Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
