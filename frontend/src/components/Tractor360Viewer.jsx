import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  Play, 
  Pause, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import defaultTractorVideo from '../assets/tractor-rotation.mp4';

export function Tractor360Viewer({ 
  className = '', 
  videoSrc = defaultTractorVideo,
  autoSpin = true,
  showControls = true
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoSpin);
  const [currentDeg, setCurrentDeg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragStartDeg, setDragStartDeg] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // 8 distinct 360-degree turntable angles
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

  // Map degree (0-359) to closest index (0-7)
  const getFrameIndex = (deg) => {
    const normalized = ((deg % 360) + 360) % 360;
    const step = 360 / frames.length; // 45 deg
    const index = Math.round(normalized / step) % frames.length;
    return index;
  };

  const currentFrame = frames[getFrameIndex(currentDeg)];

  // Auto-play setup with strict muted enforcement for browser policies
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      if (autoSpin) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    }
  }, [autoSpin]);

  // Image mode auto-spin interval when video fails or image mode is active
  useEffect(() => {
    if (!videoError || !isPlaying || isDragging) return;

    const timer = setInterval(() => {
      setCurrentDeg((prev) => (prev + 45) % 360);
    }, 1300);

    return () => clearInterval(timer);
  }, [videoError, isPlaying, isDragging]);

  // Video Time Update -> Rotation Degrees
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isDragging) return;

    const progress = video.currentTime / video.duration;
    const deg = Math.round(progress * 360) % 360;
    setCurrentDeg(deg);
  };

  // Toggle Play / Pause
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;

    if (!videoError && video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Pointer drag scrubbing (Works for both Video and Image frames)
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragStartX(clientX);
    setDragStartDeg(currentDeg);

    const video = videoRef.current;
    if (!videoError && video) {
      setDragStartTime(video.currentTime);
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;

    const video = videoRef.current;
    if (!videoError && video && video.duration) {
      // 320px drag = 360 degrees
      const scrubRatio = deltaX / 320;
      let newTime = dragStartTime - (scrubRatio * video.duration);
      while (newTime < 0) newTime += video.duration;
      while (newTime >= video.duration) newTime -= video.duration;

      video.currentTime = newTime;
      const deg = Math.round((newTime / video.duration) * 360) % 360;
      setCurrentDeg(deg);
    } else {
      // Image mode drag: 35px per 45-degree angle
      const angleShift = Math.floor(deltaX / 35) * 45;
      let newDeg = (dragStartDeg - angleShift) % 360;
      if (newDeg < 0) newDeg += 360;
      setCurrentDeg(newDeg);
    }
  }, [isDragging, dragStartX, dragStartTime, dragStartDeg, videoError]);

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
    setCurrentDeg(targetDeg);
    const video = videoRef.current;
    if (!videoError && video && video.duration) {
      const targetTime = (targetDeg / 360) * video.duration;
      video.currentTime = Math.min(targetTime, video.duration - 0.05);
    }
    if (isPlaying) setIsPlaying(false);
  };

  // Step 45 degrees
  const stepAngle = (direction) => {
    const newDeg = (currentDeg + (direction * 45) + 360) % 360;
    setCurrentDeg(newDeg);

    const video = videoRef.current;
    if (!videoError && video && video.duration) {
      const stepTime = (45 / 360) * video.duration;
      let newTime = video.currentTime + (direction * stepTime);
      if (newTime < 0) newTime += video.duration;
      if (newTime >= video.duration) newTime -= video.duration;
      video.currentTime = newTime;
    }
    if (isPlaying) setIsPlaying(false);
  };

  return (
    <div 
      className={`relative select-none rounded-2xl overflow-hidden bg-white border border-[#E3DBD0] ${className}`}
      ref={containerRef}
    >
      {/* 360 Degree Canvas / Viewer Area */}
      <div 
        className="relative aspect-[16/10] overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center bg-[#FAF8F5]"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={togglePlay}
      >
        {/* Primary Video Element */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={resolveImageUrl(videoSrc)}
            className="w-full h-full object-cover pointer-events-none"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onError={() => {
              console.warn('Video failed to play, switching to photorealistic 360 turntable frames');
              setVideoError(true);
            }}
          />
        ) : (
          /* High-Resolution Turntable Fallback Image Frame */
          <img
            src={resolveImageUrl(currentFrame.img)}
            alt={`Tractor 360 view at ${currentFrame.deg} degrees`}
            className="w-full h-full object-cover pointer-events-none transition-opacity duration-150"
            onError={(e) => {
              e.target.src = resolveImageUrl('/uploads/tractor-mahindra-575.jpg');
            }}
          />
        )}

        {/* Top Left Floating Badge: 360 Degree Indicator */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#111111] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#E3DBD0] pointer-events-none shadow-none">
          <RotateCw className={`w-3.5 h-3.5 text-[#111111] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>360° View</span>
          <span className="font-bold ml-1">({currentDeg}°)</span>
        </div>

        {/* Top Right: Play / Pause Button */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className="p-2 rounded-full bg-white/95 backdrop-blur-md text-[#111111] hover:bg-[#EAE3D7] border border-[#E3DBD0] transition-colors"
            title={isPlaying ? "Pause 360 rotation" : "Play 360 rotation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Drag Hint (Fades when dragging or playing) */}
        {!isDragging && !isPlaying && (
          <div className="absolute inset-x-0 bottom-14 flex justify-center pointer-events-none z-10">
            <div className="bg-white/95 backdrop-blur-md text-[#111111] text-[11px] font-semibold px-4 py-1.5 rounded-full border border-[#E3DBD0] flex items-center gap-2 shadow-sm">
              <RotateCw className="w-3.5 h-3.5 text-[#111111]" />
              <span>Drag horizontally to rotate</span>
            </div>
          </div>
        )}

        {/* Bottom Floating Spec Callout */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 bg-white/95 backdrop-blur-md text-[#111111] px-3.5 py-2 rounded-xl border border-[#E3DBD0] flex items-center justify-between text-xs pointer-events-none">
          <div>
            <div className="text-[10px] text-[#8C857B] font-bold uppercase tracking-wider">
              {currentFrame.label}
            </div>
            <div className="text-[11px] text-[#111111] font-medium line-clamp-1">
              {currentFrame.spec}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#111111] font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Scrub & Angle Switcher Bar */}
      {showControls && (
        <div className="p-3 bg-[#FAF8F5] border-t border-[#E3DBD0] flex items-center justify-between gap-2 text-xs">
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
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#6B665F] hover:text-[#111111] border border-[#E3DBD0]'
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
              className="p-1.5 rounded-full bg-white hover:bg-[#EAE3D7] text-[#111111] border border-[#E3DBD0] transition-colors"
              title="Previous Angle"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => stepAngle(1)}
              className="p-1.5 rounded-full bg-white hover:bg-[#EAE3D7] text-[#111111] border border-[#E3DBD0] transition-colors"
              title="Next Angle"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
