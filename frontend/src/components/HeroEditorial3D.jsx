import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Search, PhoneCall, RotateCw, ShieldCheck, Car } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import Magnet from './Magnet';
import ShimmerButton from './ShimmerButton';

const TURNTABLE_FRAMES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * HeroEditorial3D
 * Clean 3D automotive editorial split-hero design:
 * - Warm studio backdrop (#E2DDD5)
 * - Sweeping diagonal perspective stripes tapering smoothly into the horizon
 * - Stacked bold editorial typography with soft sky-blue highlight block
 * - Seamless crimson BMW-style studio car on the right (with 360° tractor toggle)
 */
export const HeroEditorial3D = ({ searchKeyword, setSearchKeyword, handleSearchSubmit }) => {
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
    : resolveImageUrl('/static-uploads/hero-studio-bmw-car.jpg');

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

      {/* Top-Right Studio Mode Pill (Matches Reference Top-Right Badge) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center bg-[#111111] text-white rounded-md overflow-hidden shadow-md border border-white/10">
        <button
          type="button"
          onClick={() => setSpinMode((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
          title="Switch between 3D Car Showcase and 360° Tractor View"
        >
          {spinMode ? (
            <>
              <Car className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>3D Car View</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>360° Tractor</span>
            </>
          )}
        </button>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span>BALAJI</span>
          <span className="text-[#DC2626] font-black">/</span>
          <span className="text-[#60A5FA] font-black">M</span>
        </div>
      </div>

      {/* Main Split Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center">
          {/* LEFT COLUMN: Stacked Brutalist-Editorial Typography + Pill CTA + Search */}
          <motion.div
            style={{ x: textShiftX }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            {/* Top Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-[#C2BBB0] text-[10px] font-bold uppercase tracking-widest text-[#111111]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span>Salem-Coimbatore NH Yard • Open 9 AM – 7 PM</span>
            </div>

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

            {/* Primary Pill CTA (Matches Reference Black Pill + Circle Arrow) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnet padding={35} magnetStrength={4}>
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-3 bg-[#111111] hover:bg-[#2E7D32] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors duration-300 shadow-md"
                >
                  <span>Explore Stock</span>
                  <span className="w-6 h-6 rounded-full bg-white text-[#111111] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              </Magnet>

              <Magnet padding={35} magnetStrength={4}>
                <a
                  href="tel:+918124336369"
                  className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-[#111111] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-[#C2BBB0] hover:border-[#111111] transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>+91 81243 36369</span>
                </a>
              </Magnet>
            </div>

            {/* Compact Integrated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-md pt-1">
              <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#C2BBB0] focus-within:border-[#111111] shadow-sm transition-all">
                <div className="pl-3.5 pr-2 text-[#6B665F]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search Swaraj 855, Mahindra, Bolero..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs bg-transparent border-none text-[#111111] placeholder:text-[#8C857B] focus:outline-none font-medium py-1.5"
                />
                <ShimmerButton type="submit" variant="primary" className="py-2 px-4 shrink-0 text-[10px]">
                  <span>Search</span>
                </ShimmerButton>
              </div>
            </form>

            {/* Bottom-Left Brand Crest & Micro-Caption */}
            <div className="pt-4 sm:pt-6 inline-flex items-center gap-3 bg-white/75 backdrop-blur-xs px-3.5 py-2 rounded-full border border-[#C2BBB0]">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div className="text-[10px] leading-tight font-bold uppercase tracking-wider text-[#111111] pr-1">
                <div>BALAJI AUTO &amp; AGRO CONSULTANCY.</div>
                <div className="text-[#555048]">CERTIFIED TRACTORS &amp; CARS SINCE 2014.</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Seamless 3D Studio Vehicle Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <motion.div
              onPointerDown={handlePointerDown}
              style={{
                rotateX: vehicleRotateX,
                rotateY: vehicleRotateY,
                x: vehicleTranslateX,
                transformStyle: 'preserve-3d'
              }}
              initial={{ opacity: 0, scale: 0.92, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full max-w-[650px] lg:scale-110 ${spinMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              {/* Soft Studio Ground Contact Shadow */}
              <div
                aria-hidden="true"
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[82%] h-10 bg-black/30 blur-xl rounded-full pointer-events-none"
              />

              {/* Seamless Vehicle Image (mix-blend-multiply dissolves pure white studio backdrop cleanly) */}
              <img
                src={currentVehicleSrc}
                alt={spinMode ? 'Balaji Certified 360 Tractor' : 'Balaji Certified Crimson Classic Car'}
                draggable={false}
                className={`w-full h-auto object-contain select-none mix-blend-multiply transition-opacity duration-200 ${
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
