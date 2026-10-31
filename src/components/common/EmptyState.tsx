import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'goals' | 'reviews' | 'employees' | 'kpis';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  type = 'goals'
}) => {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-800 bg-[#0a0f1d]/60">
      {/* Bespoke Architectural SVG Illustration */}
      <div className="w-24 h-24 mb-4 relative flex items-center justify-center text-[#c59b6d]">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-80"
        >
          {/* Isometric grid lines */}
          <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M50 15V85" stroke="#1e293b" strokeWidth="1" />
          <path d="M15 35L85 65" stroke="#1e293b" strokeWidth="1" />
          <path d="M15 65L85 35" stroke="#1e293b" strokeWidth="1" />

          {/* Central geometric focal prism */}
          <polygon points="50,28 72,42 72,66 50,80 28,66 28,42" fill="#0c1222" stroke="#c59b6d" strokeWidth="1.5" />
          <polyline points="28,42 50,56 72,42" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
          <line x1="50" y1="56" x2="50" y2="80" stroke="#f8f6f0" strokeWidth="1.2" />

          {/* Orbiting accent marks */}
          <circle cx="50" cy="28" r="2.5" fill="#f8f6f0" />
          <circle cx="72" cy="54" r="2" fill="#38bdf8" />
          <circle cx="28" cy="54" r="2" fill="#c59b6d" />
        </svg>
      </div>

      <h4 className="font-serif text-lg font-semibold text-white mb-1.5 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-5">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-[#060a14] bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
