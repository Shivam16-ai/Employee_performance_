import React, { useState } from 'react';
import { X, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PerformanceReview, User, Goal } from '../../types';

interface ReviewEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishReview: (review: PerformanceReview) => void;
  employee: User;
  manager: User;
  employeeGoals: Goal[];
  existingReview?: PerformanceReview;
}

export const ReviewEvaluationModal: React.FC<ReviewEvaluationModalProps> = ({
  isOpen,
  onClose,
  onPublishReview,
  employee,
  manager,
  employeeGoals,
  existingReview
}) => {
  const [scores, setScores] = useState<{ [key: string]: number }>({
    'Strategic Execution': existingReview?.categoryScores.find(s => s.category === 'Strategic Execution')?.score || 4,
    'Technical Excellence': existingReview?.categoryScores.find(s => s.category === 'Technical Excellence')?.score || 5,
    'Collaborative Leadership': existingReview?.categoryScores.find(s => s.category === 'Collaborative Leadership')?.score || 4,
    'Innovation & Impact': existingReview?.categoryScores.find(s => s.category === 'Innovation & Impact')?.score || 5
  });

  const [strengths, setStrengths] = useState(
    existingReview?.writtenFeedback.strengths ||
    `${employee.name} exhibits exceptional architectural rigor and consistent delivery under demanding timelines.`
  );
  const [areasForGrowth, setAreasForGrowth] = useState(
    existingReview?.writtenFeedback.areasForGrowth ||
    'Increase cross-functional visibility by authoring technical RFCs for broader engineering distribution.'
  );
  const [forwardGoals, setForwardGoals] = useState(
    existingReview?.writtenFeedback.forwardLookingGoals ||
    'Lead strategic modernization roadmap in the upcoming performance cycle.'
  );

  if (!isOpen) return null;

  // Calculate composite rating
  const scoreValues = Object.values(scores);
  const compositeScore = Number((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1));

  // Goal completion stats
  const avgGoalProgress = employeeGoals.length
    ? Math.round(employeeGoals.reduce((acc, g) => acc + g.progressPercentage, 0) / employeeGoals.length)
    : 85;

  const ratingLabels: { [key: number]: string } = {
    1: '1 · Poor',
    2: '2 · Needs Improvement',
    3: '3 · Meets Expectations',
    4: '4 · Exceeds Expectations',
    5: '5 · Outstanding'
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const review: PerformanceReview = {
      id: existingReview?.id || `rev_q4_${employee.id}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.designation,
      department: employee.department,
      managerId: manager.id,
      managerName: manager.name,
      period: 'Q4 2026',
      goalCompletionRate: avgGoalProgress,
      kpiAchievementRate: 92,
      overallScore: compositeScore,
      categoryScores: Object.entries(scores).map(([category, score]) => ({
        category,
        score,
        comment: `Calibrated evaluation rating: ${score}/5.`
      })),
      writtenFeedback: {
        strengths,
        areasForGrowth,
        forwardLookingGoals: forwardGoals
      },
      status: 'published',
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      employeeAcknowledged: false
    };

    onPublishReview(review);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-[#0c1222] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c59b6d]/15 text-[#c59b6d]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Quarterly Performance Review · Q4 2026
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating {employee.name} · {employee.designation}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-6 space-y-6">
          {/* Employee & Telemetry Context Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#060a14] border border-slate-800 text-center">
            <div>
              <div className="text-[11px] font-mono text-slate-400">Active Goals</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {employeeGoals.length || 3} Goals
              </div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Avg Execution</div>
              <div className="text-base font-bold text-[#38bdf8] font-mono mt-0.5">
                {avgGoalProgress}% Completed
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400">Calibrated Score</div>
              <div className="text-base font-bold text-[#c59b6d] font-mono mt-0.5">
                {compositeScore} / 5.0
              </div>
            </div>
          </div>

          {/* 4 Categorical Rating Selectors */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Performance Dimensions (1 = Poor · 5 = Outstanding)
            </h4>

            {Object.keys(scores).map((catName) => (
              <div key={catName} className="p-3.5 rounded-lg bg-[#080d19] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-white">{catName}</div>
                  <div className="text-[11px] text-slate-400">
                    Selected rating: <span className="text-[#38bdf8] font-mono">{ratingLabels[scores[catName]]}</span>
                  </div>
                </div>

                {/* 1 to 5 Pill Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScores({ ...scores, [catName]: val })}
                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                        scores[catName] === val
                          ? 'bg-[#c59b6d] text-[#060a14] shadow-md scale-105'
                          : 'bg-[#0c1222] border border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Written Qualitative Feedback */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Qualitative Manager Coaching & Guidance
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Core Strengths & Technical Impact
              </label>
              <textarea
                rows={2}
                required
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Areas for Growth & Leverage
              </label>
              <textarea
                rows={2}
                required
                value={areasForGrowth}
                onChange={(e) => setAreasForGrowth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Forward-Looking Strategic Objectives
              </label>
              <textarea
                rows={2}
                required
                value={forwardGoals}
                onChange={(e) => setForwardGoals(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>

          {/* Immutability Notice */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Audit Integrity Standard:</strong> Once published, this evaluation becomes an official permanent record in {employee.name}'s talent file and triggers formal employee acknowledgement.
            </span>
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 text-xs font-semibold text-[#060a14] bg-[#c59b6d] hover:bg-[#dfbe96] rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-[#060a14]" />
              <span>Publish & Authorize Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
