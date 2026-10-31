import React from 'react';
import { TimelineEvent } from '../../types';
import { Target, CheckCircle2, TrendingUp, Award, MessageSquare, ShieldCheck } from 'lucide-react';

interface PerformanceTimelineProps {
  events: TimelineEvent[];
  maxItems?: number;
  compact?: boolean;
}

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  events,
  maxItems = 6,
  compact = false
}) => {
  const displayEvents = events.slice(0, maxItems);

  const getEventBadge = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'review_published':
        return {
          icon: Award,
          color: 'text-[#c59b6d]',
          bg: 'bg-[#c59b6d]/15 border-[#c59b6d]/40',
          label: 'Review Published'
        };
      case 'review_acknowledged':
        return {
          icon: ShieldCheck,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/15 border-emerald-500/40',
          label: 'Acknowledged'
        };
      case 'milestone_reached':
        return {
          icon: CheckCircle2,
          color: 'text-[#38bdf8]',
          bg: 'bg-[#38bdf8]/15 border-[#38bdf8]/40',
          label: 'Milestone'
        };
      case 'kpi_updated':
        return {
          icon: TrendingUp,
          color: 'text-indigo-400',
          bg: 'bg-indigo-500/15 border-indigo-500/40',
          label: 'KPI Calibration'
        };
      case 'goal_created':
        return {
          icon: Target,
          color: 'text-[#f8f6f0]',
          bg: 'bg-slate-700/50 border-slate-600/40',
          label: 'Goal Assigned'
        };
      case 'feedback_given':
      default:
        return {
          icon: MessageSquare,
          color: 'text-amber-400',
          bg: 'bg-amber-500/15 border-amber-500/40',
          label: 'Feedback'
        };
    }
  };

  return (
    <div className="w-full">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
        {displayEvents.map((evt) => {
          const config = getEventBadge(evt.type);
          const Icon = config.icon;

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Node Point */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center bg-[#0c1222] ${config.bg} transition-transform group-hover:scale-110`}
              >
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>

              {/* Event Content Box */}
              <div className="bg-[#0c1222]/80 border border-slate-800/80 rounded-lg p-3.5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white tracking-tight">
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#060a14] border border-slate-800 text-slate-400">
                      {config.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {evt.date}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
                  <span>Logged by: {evt.author}</span>
                  {evt.scoreDelta && (
                    <span className="text-[#38bdf8] font-semibold">
                      {evt.scoreDelta}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
