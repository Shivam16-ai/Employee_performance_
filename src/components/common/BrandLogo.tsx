import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  monochrome?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  monochrome = false,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-base tracking-[0.2em]',
    md: 'text-lg tracking-[0.24em]',
    lg: 'text-2xl tracking-[0.28em]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Ascending Vector Monogram */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base structural frame */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="4"
            className={monochrome ? 'stroke-current' : 'stroke-[#c59b6d]/40'}
            strokeWidth="1.25"
          />
          {/* Three ascending performance pillars with architectural bevels */}
          {/* Pillar 1: People (Ivory) */}
          <path
            d="M9 33V24L15 20V33H9Z"
            fill={monochrome ? 'currentColor' : '#f8f6f0'}
            opacity="0.95"
          />
          {/* Pillar 2: Performance (Electric Blue) */}
          <path
            d="M19 33V17L25 13V33H19Z"
            fill={monochrome ? 'currentColor' : '#38bdf8'}
            opacity="0.92"
          />
          {/* Pillar 3: Progress (Warm Bronze) */}
          <path
            d="M29 33V11L35 7V33H29Z"
            fill={monochrome ? 'currentColor' : '#c59b6d'}
          />
          {/* Top precision diagonal crossline */}
          <line
            x1="8"
            y1="34.5"
            x2="36"
            y2="34.5"
            className={monochrome ? 'stroke-current' : 'stroke-[#38bdf8]/40'}
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Editorial Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`font-serif font-bold text-white ${textSizes[size]}`}>
            EPMS
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#c59b6d]">
            Enterprise
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-[0.18em] uppercase text-slate-400 font-sans font-medium">
            People <span className="text-[#38bdf8]">·</span> Performance <span className="text-[#c59b6d]">·</span> Progress
          </span>
        )}
      </div>
    </div>
  );
};
