import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RotateCw } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';

const TURNTABLE_FRAMES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * HeroEditorial3D
 * Clean 3D automotive editorial split-hero design:
 * - Warm studio backdrop (#E2DDD5)
 * - Sweeping diagonal perspective stripes tapering smoothly into the horizon
 * - Stacked bold editorial typography with soft sky-blue highlight block
 * - Seamless crimson BMW-style studio car on the right (with 360° tractor toggle)
 */
export const HeroEditorial3D = () => {
  const [spinMode, setSpinMode] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  // 3D Stage Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const vehicleRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const vehicleRotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const vehicleTranslateX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const stripesShiftX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const textShiftX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleStageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);

    if (spinMode && isDragging.current) {
      const dx = e.clientX - lastX.current;
      if (Math.abs(dx) > 22) {
        setFrameIdx((prev) => (prev + (dx > 0 ? 1 : -1) + TURNTABLE_FRAMES.length) % TURNTABLE_FRAMES.length);
        lastX.current = e.clientX;
      }
    }
  };

  const handleStageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    isDragging.current = false;
  };

  const handlePointerDown = (e) => {
    if (!spinMode) return;
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const currentVehicleSrc = spinMode
    ? resolveImageUrl(`/static-uploads/tractor-360-${TURNTABLE_FRAMES[frameIdx]}.jpg`)
    : resolveImageUrl('/static-uploads/hero-studio-bmw-front.png');

  return (
    <section
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      onPointerUp={handlePointerUp}
      style={{ perspective: '1400px' }}
      className="relative overflow-hidden bg-[#D9D4CC] border-b border-[#C9C2B6] min-h-[580px] lg:min-h-[650px] flex items-center"
    >
      {/* Sweeping Diagonal Perspective Stripes (Bottom-Left tapering smoothly to Horizon) */}
      <motion.div
        style={{ x: stripesShiftX }}
        initial={{ opacity: 0, x: -120 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 720"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="stripeFadeSky" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#60A5FA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stripeFadeGreen" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#2E7D32" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stripeFadeRed" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#DC2626" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Stripe 1: Light Sky Blue */}
          <polygon points="-120,720 130,720 690,415 665,415" fill="url(#stripeFadeSky)" />
          {/* Stripe 2: Motorsport Royal Blue / Balaji Green */}
          <polygon points="130,720 340,720 715,415 690,415" fill="url(#stripeFadeGreen)" />
          {/* Stripe 3: Crimson Red */}
          <polygon points="340,720 560,720 740,415 715,415" fill="url(#stripeFadeRed)" />
        </svg>
      </motion.div>

      {/* Main Split Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center">
          {/* LEFT COLUMN: Stacked Brutalist-Editorial Typography */}
          <motion.div
            style={{ x: textShiftX }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            {/* Stacked Editorial Display Headline with Soft Blue Highlight Behind Top Lines */}
            <h1 className="font-heading font-black uppercase text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.15rem] text-[#111111] leading-[0.94] tracking-tighter select-none">
              <span className="inline-block bg-[#93C5FD]/55 px-2.5 py-0.5 mb-1">
                BALAJI BELIEVES
              </span>
              <br />
              <span className="inline-block bg-[#93C5FD]/55 px-2.5 py-0.5 mb-1">
                TRUST BEGINS AT
              </span>
              <br />
              <span className="inline-block px-1">
                120-POINT CHECK.
              </span>
            </h1>
          </motion.div>

          {/* RIGHT COLUMN: Transparent 3D Studio Vehicle Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-end">
            <motion.div
              onPointerDown={handlePointerDown}
              style={{
                rotateX: vehicleRotateX,
                rotateY: vehicleRotateY,
                x: vehicleTranslateX,
                transformStyle: 'preserve-3d'
              }}
              initial={{ opacity: 0, scale: 0.94, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full max-w-[250px] sm:max-w-[380px] lg:max-w-[540px] ml-auto translate-x-4 sm:translate-x-6 ${
                spinMode ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Realistic Ground Contact Shadow */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[88%] h-10 bg-black/40 blur-xl rounded-full pointer-events-none"
              />

              {/* True Transparent PNG Car Image */}
              <img
                src={currentVehicleSrc}
                alt={spinMode ? 'Balaji Certified 360 Tractor' : 'Balaji Certified Crimson Classic Car Front View'}
                draggable={false}
                className={`relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_18px_24px_rgba(0,0,0,0.32)] ${
                  spinMode ? 'rounded-2xl' : ''
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static-uploads/car-mahindra-bolero.jpg';
                }}
              />

              {/* Interactive 360° Hint Pill when active */}
              {spinMode && (
                <div className="absolute bottom-3 right-3 bg-[#111111]/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <RotateCw className="w-3 h-3 text-[#4ADE80]" />
                  <span>Drag left/right to rotate ({TURNTABLE_FRAMES[frameIdx]}°)</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroEditorial3D;
