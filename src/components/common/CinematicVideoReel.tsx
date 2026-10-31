import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Sparkles, Sliders } from 'lucide-react';
import { CINEMATIC_WORKPLACE_SCENES } from '../../data/mockData';

interface CinematicVideoReelProps {
  className?: string;
  variant?: 'hero' | 'login' | 'inline';
  showControls?: boolean;
  autoPlay?: boolean;
  intervalMs?: number;
  overlayOpacity?: number; // 0 to 1
  children?: React.ReactNode;
}

export const CinematicVideoReel: React.FC<CinematicVideoReelProps> = ({
  className = '',
  variant = 'hero',
  showControls = true,
  autoPlay = true,
  intervalMs = 7000,
  overlayOpacity = 0.55,
  children
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [timecodeSeconds, setTimecodeSeconds] = useState(14);
  const [lensEffect, setLensEffect] = useState(true);
  const timerRef = useRef<any>(null);

  const activeScene = CINEMATIC_WORKPLACE_SCENES[currentSceneIndex];

  // Auto-advance scenes smoothly like a cinematic film reel
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % CINEMATIC_WORKPLACE_SCENES.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, intervalMs]);

  // Real-time cinematic timecode ticker
  useEffect(() => {
    const timecodeInterval = setInterval(() => {
      setTimecodeSeconds((prev) => (prev >= 180 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timecodeInterval);
  }, []);

  const formatTimecode = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    const frames = Math.floor((sec * 24) % 24);
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSceneIndex((prev) => (prev === 0 ? CINEMATIC_WORKPLACE_SCENES.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSceneIndex((prev) => (prev + 1) % CINEMATIC_WORKPLACE_SCENES.length);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  // 5 distinct cinematic camera animations for the 5 scenes
  const cameraTransforms = [
    'scale-110 translate-x-2 -translate-y-2', // Slow push across reflection
    'scale-105 -translate-x-3 translate-y-1', // Lateral atrium tracking
    'scale-115 translate-y-3',                 // Slow tilt up
    'scale-110 -translate-x-2 -translate-y-1', // Diagonal glide toward horizon
    'scale-105 translate-x-1'                  // Anamorphic center push
  ];

  return (
    <div className={`relative overflow-hidden bg-[#060a14] select-none ${className}`}>
      {/* Background Image / Film Sequence with Ken Burns Motion */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {CINEMATIC_WORKPLACE_SCENES.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          const animClass = cameraTransforms[idx % cameraTransforms.length];

          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={scene.image}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out will-change-transform ${
                  isActive ? animClass : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Cinematic Lighting & Anamorphic Film Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-colors duration-700"
          style={{
            background: `linear-gradient(180deg, rgba(6,10,20,${overlayOpacity * 0.7}) 0%, rgba(6,10,20,${overlayOpacity}) 50%, rgba(6,10,20,${overlayOpacity * 1.1}) 100%)`
          }}
        />

        {/* Film Vignette */}
        <div className="absolute inset-0 z-20 pointer-events-none cinematic-vignette opacity-80" />

        {/* Subtle Horizontal Lens Glare & Warm Accent */}
        {lensEffect && (
          <div className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-screen bg-gradient-to-r from-transparent via-[#38bdf8]/10 to-[#c59b6d]/15" />
        )}

        {/* Film grain texture */}
        <div className="absolute inset-0 z-20 pointer-events-none cinema-grain opacity-60" />
      </div>

      {/* Children Content (Typography / Login Form / Hero Content) */}
      <div className="relative z-30 w-full h-full">
        {children}
      </div>

      {/* Film Reel Telemetry & Controls Bar */}
      {showControls && (
        <div className="absolute bottom-4 left-6 right-6 z-40 flex items-center justify-between text-xs font-mono text-slate-300 pointer-events-auto">
          {/* Left: Camera metadata */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[#38bdf8] font-semibold tracking-wider">
              REEL {currentSceneIndex + 1}/{CINEMATIC_WORKPLACE_SCENES.length}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 tracking-wider">
              {activeScene.title}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 text-[11px]">
              {activeScene.aperture}
            </span>
          </div>

          {/* Center: Live Timecode & Status */}
          <div className="flex items-center gap-2 bg-[#0c1222]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause workplace video reel' : 'Play workplace video reel'}
              className="text-[#38bdf8] hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] tabular-nums tracking-widest text-[#f8f6f0]">
              {formatTimecode(timecodeSeconds)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] tracking-wider text-[#c59b6d] font-semibold">
              4K HDR 60FPS
            </span>
          </div>

          {/* Right: Scene Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous scene"
              className="p-1.5 rounded bg-[#0c1222]/80 hover:bg-[#1a253d] text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next scene"
              className="p-1.5 rounded bg-[#0c1222]/80 hover:bg-[#1a253d] text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLensEffect(!lensEffect)}
              title="Toggle cinematic anamorphic flare"
              aria-label="Toggle cinematic flare"
              className={`p-1.5 rounded border transition-colors ${
                lensEffect
                  ? 'bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]'
                  : 'bg-[#0c1222]/80 border-slate-700/60 text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
