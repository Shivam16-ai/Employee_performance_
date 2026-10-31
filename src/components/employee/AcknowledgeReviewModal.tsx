import React, { useState } from 'react';
import { X, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PerformanceReview, User } from '../../types';

interface AcknowledgeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (reviewId: string, comment?: string) => void;
  review: PerformanceReview;
  currentUser: User;
}

export const AcknowledgeReviewModal: React.FC<AcknowledgeReviewModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
  review,
  currentUser
}) => {
  const [agreed, setAgreed] = useState(false);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    onAcknowledge(review.id, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0c1222] border border-slate-700/80 rounded-xl shadow-2xl text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-[#0c1222] z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Formal Review Acknowledgement · {review.period}
              </h3>
              <p className="text-xs text-slate-400">
                Official evaluation authored by {review.managerName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Score Bar */}
          <div className="p-4 rounded-xl bg-[#060a14] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Calibrated Final Rating</span>
              <div className="text-2xl font-bold font-mono text-[#c59b6d] mt-0.5">
                {review.overallScore} <span className="text-xs text-slate-500 font-sans">/ 5.0 (Exceeds Expectations)</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Published: {review.publishedAt}</div>
              <div className="text-[#38bdf8]">Status: Official Record</div>
            </div>
          </div>

          {/* Categorical Scores Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Categorical Dimension Ratings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {review.categoryScores.map((cat) => (
                <div key={cat.category} className="p-3 rounded-lg bg-[#080d19] border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{cat.category}</span>
                    <span className="font-mono text-xs font-bold text-[#38bdf8]">{cat.score} / 5.0</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{cat.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Written Guidance */}
          <div className="space-y-3 p-4 rounded-xl bg-[#080d19] border border-slate-800 text-xs">
            <div>
              <div className="font-semibold text-white mb-1">Strengths & Demonstrated Impact</div>
              <p className="text-slate-300 leading-relaxed">{review.writtenFeedback.strengths}</p>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <div className="font-semibold text-white mb-1">Areas for Ongoing Development</div>
              <p className="text-slate-300 leading-relaxed">{review.writtenFeedback.areasForGrowth}</p>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <div className="font-semibold text-white mb-1">Strategic Horizon Focus</div>
              <p className="text-slate-300 leading-relaxed">{review.writtenFeedback.forwardLookingGoals}</p>
            </div>
          </div>

          {/* Employee Response Commentary */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Employee Response or Commentary (Optional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide reflections, milestones context, or alignment notes for your permanent file..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#060a14] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Legal Acknowledgement Checkbox */}
          <div className="p-4 rounded-xl bg-[#060a14] border border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-[#0c1222] text-[#38bdf8] focus:ring-0"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby acknowledge receipt and review of this {review.period} Performance Evaluation. I confirm that I have reviewed the goals, KPI calibrations, and managerial feedback.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Signer: {currentUser.name} ({currentUser.email})
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!agreed}
                className="px-6 py-2.5 text-xs font-semibold text-[#060a14] bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#060a14]" />
                <span>Confirm Digital Signature</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
