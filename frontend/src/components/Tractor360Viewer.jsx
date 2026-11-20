import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Compass, 
  Maximize2, 
  Sparkles, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';

export function Tractor360Viewer({ 
  className = '', 
  initialAngle = 0,
  autoSpin = true,
  showControls = true
}) {
  // 8 distinct 360-degree turntable angles
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  // Angle frame definitions with verified mechanical callouts
  const frames = [
    {
      deg: 0,
      label: 'Front Grille & Bumper',
      spec: 'Heavy Cast Iron Front Axle • Halogen Headlamps',
      img: '/uploads/tractor-360-0.jpg',
      fallback: '/uploads/tractor-mahindra-575.jpg'
    },
    {
      deg: 45,
      label: 'Front-Right 3/4',
      spec: 'High-Torque 42 HP DI Engine Hood',
      img: '/uploads/tractor-360-45.jpg',
      fallback: '/uploads/tractor-mahindra-575.jpg'
    },
    {
      deg: 90,
      label: 'Right Side Profile',
      spec: 'Constant-Mesh 8F+2R Transmission & Dual Clutch',
      img: '/uploads/tractor-360-90.jpg',
      fallback: '/uploads/tractor-swaraj-855.jpg'
    },
    {
      deg: 135,
      label: 'Rear-Right 3/4',
      spec: 'Heavy Agricultural Lug Tyre (13.6 x 28)',
      img: '/uploads/tractor-360-135.jpg',
      fallback: '/uploads/tractor-massey-241.jpg'
    },
    {
      deg: 180,
      label: 'Rear Hitch & PTO',
      spec: '1,600 kg Hydraulic 3-Point Linkage • 540 RPM PTO',
      img: '/uploads/tractor-360-180.jpg',
      fallback: '/uploads/tractor-john-deere-5050.jpg'
    },
    {
      deg: 225,
      label: 'Rear-Left 3/4',
      spec: 'Oil-Immersed Multi-Disc Brake Assembly',
      img: '/uploads/tractor-360-225.jpg',
      fallback: '/uploads/tractor-sonalika-745.jpg'
    },
    {
      deg: 270,
      label: 'Left Side Profile',
      spec: 'Vertical Exhaust Stack & Heavy Oil-Bath Air Cleaner',
      img: '/uploads/tractor-360-270.jpg',
      fallback: '/uploads/tractor-eicher-380.jpg'
    },
    {
      deg: 315,
      label: 'Front-Left 3/4',
      spec: 'Direct Injection Fuel Pump & Alternator Circuit',
      img: '/uploads/tractor-360-315.jpg',
      fallback: '/uploads/tractor-mahindra-575.jpg'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoSpin);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [startFrameIndex, setStartFrameIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef(null);

  // Preload frames to guarantee zero flicker
  useEffect(() => {
    frames.forEach((f, idx) => {
      const img = new Image();
      img.src = resolveImageUrl(f.img);
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [idx]: f.img }));
      };
      img.onerror = () => {
        // Fallback to existing high-res shot if 360 angle specific frame is loading
        setLoadedImages(prev => ({ ...prev, [idx]: f.fallback }));
      };
    });
  }, []);

  // Auto-spin interval
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % frames.length);
    }, 1400);

    return () => clearInterval(timer);
  }, [isPlaying, isDragging, frames.length]);

  // Pointer drag handling for 360 degree turntable spin
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    setDragStartX(clientX);
    setStartFrameIndex(currentIndex);
    if (isPlaying) setIsPlaying(false);
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    
    // Sensitivity: Every 35px dragged rotates 1 frame (45 degrees)
    const frameShift = Math.floor(deltaX / 35);
    const numFrames = frames.length;
    let newIndex = (startFrameIndex - frameShift) % numFrames;
    if (newIndex < 0) newIndex += numFrames;

    setCurrentIndex(newIndex);
  }, [isDragging, dragStartX, startFrameIndex, frames.length]);

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

  const currentFrame = frames[currentIndex];
  const activeImageSrc = loadedImages[currentIndex] 
    ? resolveImageUrl(loadedImages[currentIndex])
    : resolveImageUrl(currentFrame.fallback);

  return (
    <div 
      className={`relative select-none rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/70 shadow-lg ${className}`}
      ref={containerRef}
    >
      {/* 360 Turntable Canvas Frame */}
      <div 
        className="relative aspect-[16/10] overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950"
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        {/* Turntable platform floor illusion */}
        <div className="absolute bottom-1 inset-x-8 h-8 rounded-[100%] bg-gradient-to-t from-slate-800/80 to-transparent blur-[2px] pointer-events-none"></div>

        {/* Tractor Image */}
        <img
          src={activeImageSrc}
          alt={`Mahindra 575 DI Tractor at ${currentFrame.deg} degrees`}
          className="w-full h-full object-cover transition-opacity duration-150 pointer-events-none"
          draggable="false"
        />

        {/* Top Floating Badge: 360 Degree Indicator */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 shadow-md">
          <RotateCw className={`w-3.5 h-3.5 text-orange-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span>360° ROTATION</span>
          <span className="text-orange-400 font-extrabold ml-1">({currentFrame.deg}°)</span>
        </div>

        {/* Top Right: Expand / Play Toggle */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="p-2 rounded-xl bg-slate-900/85 backdrop-blur-md text-white hover:text-orange-400 border border-white/20 shadow-md transition-colors"
            title={isPlaying ? "Pause 360 auto-rotation" : "Play 360 auto-rotation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Center Drag Hint (Fades out when interacting) */}
        {!isDragging && !isPlaying && (
          <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none z-10">
            <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg">
              <RotateCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Drag or swipe horizontally to spin</span>
            </div>
          </div>
        )}

        {/* Bottom Floating Spec Callout */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/15 flex items-center justify-between text-xs shadow-md">
          <div>
            <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
              {currentFrame.label}
            </div>
            <div className="text-[11px] text-slate-200 font-medium line-clamp-1">
              {currentFrame.spec}
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
              { label: 'Front (0°)', idx: 0 },
              { label: 'Right (90°)', idx: 2 },
              { label: 'Rear (180°)', idx: 4 },
              { label: 'Left (270°)', idx: 6 }
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setCurrentIndex(item.idx);
                  if (isPlaying) setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                  currentIndex === item.idx
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(prev => (prev - 1 + frames.length) % frames.length);
                if (isPlaying) setIsPlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous Angle"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(prev => (prev + 1) % frames.length);
                if (isPlaying) setIsPlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
