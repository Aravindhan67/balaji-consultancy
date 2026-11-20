import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Sparkles, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Video
} from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';

export function Tractor360Viewer({ 
  className = '', 
  autoSpin = true,
  showControls = true
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoSpin);
  const [currentDeg, setCurrentDeg] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // 8 distinct 360-degree turntable angles for fallback or reference
  const frames = [
    {
      deg: 0,
      label: 'Front Grille & Bumper',
      spec: 'Heavy Cast Iron Front Axle • Halogen Headlamps',
      img: '/uploads/tractor-360-0.jpg'
    },
    {
      deg: 45,
      label: 'Front-Right 3/4 Perspective',
      spec: 'High-Torque 42-50 HP Engine Hood & Exhaust',
      img: '/uploads/tractor-360-45.jpg'
    },
    {
      deg: 90,
      label: 'Right Side Profile',
      spec: 'Constant-Mesh 8F+2R Transmission & Dual Clutch',
      img: '/uploads/tractor-360-90.jpg'
    },
    {
      deg: 135,
      label: 'Rear-Right 3/4 Angle',
      spec: 'Heavy Agricultural Lug Tyre (13.6 x 28) & Fender',
      img: '/uploads/tractor-360-135.jpg'
    },
    {
      deg: 180,
      label: 'Rear Hitch & PTO Shaft',
      spec: '1,600 kg Hydraulic 3-Point Linkage • 540 RPM PTO',
      img: '/uploads/tractor-360-180.jpg'
    },
    {
      deg: 225,
      label: 'Rear-Left 3/4 Angle',
      spec: 'Oil-Immersed Multi-Disc Brake Assembly',
      img: '/uploads/tractor-360-225.jpg'
    },
    {
      deg: 270,
      label: 'Left Side Profile',
      spec: 'Vertical Exhaust Stack & Heavy Oil-Bath Air Cleaner',
      img: '/uploads/tractor-360-270.jpg'
    },
    {
      deg: 315,
      label: 'Front-Left 3/4 Perspective',
      spec: 'Direct Injection Fuel Pump & Alternator Circuit',
      img: '/uploads/tractor-360-315.jpg'
    }
  ];

  // Pick specification callout based on current rotation angle
  const getCallout = (deg) => {
    const normalized = ((deg % 360) + 360) % 360;
    const closest = frames.reduce((prev, curr) => {
      return Math.abs(curr.deg - normalized) < Math.abs(prev.deg - normalized) ? curr : prev;
    }, frames[0]);
    return closest;
  };

  const currentCallout = getCallout(currentDeg);

  // Auto-play control on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoSpin) {
      video.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy might require user gesture, remains paused
        setIsPlaying(false);
      });
    }
  }, [autoSpin]);

  // Video Time Update -> Calculate Rotation Degrees (0° to 360°)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const progress = video.currentTime / video.duration;
    const deg = Math.round(progress * 360) % 360;
    setCurrentDeg(deg);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  // Toggle Play / Pause
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Interactive Drag-to-Rotate Video Scrubbing
  const handlePointerDown = (e) => {
    const video = videoRef.current;
    if (!video) return;

    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragStartX(clientX);
    setDragStartTime(video.currentTime);

    // Pause video during scrubbing
    if (!video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;

    // Full width of card (approx 320px) scrubs full 360 rotation
    const scrubRatio = deltaX / 320;
    let newTime = dragStartTime - (scrubRatio * video.duration);
    
    // Wrap around 0 to duration
    while (newTime < 0) newTime += video.duration;
    while (newTime >= video.duration) newTime -= video.duration;

    video.currentTime = newTime;
    const deg = Math.round((newTime / video.duration) * 360) % 360;
    setCurrentDeg(deg);
  }, [isDragging, dragStartX, dragStartTime]);

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove]);

  // Jump to specific angle (0°, 90°, 180°, 270°)
  const jumpToAngle = (targetDeg) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const targetTime = (targetDeg / 360) * video.duration;
    video.currentTime = Math.min(targetTime, video.duration - 0.05);
    setCurrentDeg(targetDeg);
  };

  // Step 45 degrees
  const stepAngle = (direction) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const stepTime = (45 / 360) * video.duration;
    let newTime = video.currentTime + (direction * stepTime);
    if (newTime < 0) newTime += video.duration;
    if (newTime >= video.duration) newTime -= video.duration;

    video.currentTime = newTime;
    const deg = Math.round((newTime / video.duration) * 360) % 360;
    setCurrentDeg(deg);
  };

  return (
    <div 
      className={`relative select-none rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/70 shadow-lg ${className}`}
      ref={containerRef}
    >
      {/* 360 Degree Video / Canvas Viewer */}
      <div 
        className="relative aspect-[16/10] overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center bg-slate-950"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={togglePlay}
      >
        {/* Video Player */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={resolveImageUrl('/uploads/tractor-360-video.mp4')}
            className="w-full h-full object-cover pointer-events-none"
            muted
            loop
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setVideoError(true)}
          />
        ) : (
          /* Fallback image sequence */
          <img
            src={resolveImageUrl(frames[imageIndex].img)}
            alt={`Tractor 360 view at ${frames[imageIndex].deg} degrees`}
            className="w-full h-full object-cover pointer-events-none"
          />
        )}

        {/* Top Left Floating Badge: 360 Degree Indicator */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 shadow-md pointer-events-none">
          <RotateCw className={`w-3.5 h-3.5 text-orange-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>360° ROTATION</span>
          <span className="text-orange-400 font-extrabold ml-1">({currentDeg}°)</span>
        </div>

        {/* Top Right: Play / Pause Button */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="p-2 rounded-xl bg-slate-900/85 backdrop-blur-md text-white hover:text-orange-400 border border-white/20 shadow-md transition-colors"
            title={isPlaying ? "Pause 360 rotation" : "Play 360 rotation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Drag Hint (Fades when dragging or playing) */}
        {!isDragging && !isPlaying && (
          <div className="absolute inset-x-0 bottom-14 flex justify-center pointer-events-none z-10">
            <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg">
              <RotateCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Drag or swipe horizontally to spin</span>
            </div>
          </div>
        )}

        {/* Bottom Floating Spec Callout */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/15 flex items-center justify-between text-xs shadow-md pointer-events-none">
          <div>
            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
              {currentCallout.label}
            </div>
            <div className="text-[11px] text-slate-200 font-medium line-clamp-1">
              {currentCallout.spec}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Scrub & Angle Switcher Bar */}
      {showControls && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
          {/* Quick Angle Jump Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { label: 'Front (0°)', deg: 0 },
              { label: 'Right (90°)', deg: 90 },
              { label: 'Rear (180°)', deg: 180 },
              { label: 'Left (270°)', deg: 270 }
            ].map(item => {
              const isSelected = Math.abs(currentDeg - item.deg) < 30 || (item.deg === 0 && currentDeg > 330);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => jumpToAngle(item.deg)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => stepAngle(-1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous Angle (Step Back)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => stepAngle(1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Next Angle (Step Forward)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
