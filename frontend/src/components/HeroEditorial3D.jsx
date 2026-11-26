import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Search, PhoneCall, RotateCw, ShieldCheck } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import { Logo } from './Logo';
import Magnet from './Magnet';
import ShimmerButton from './ShimmerButton';

const TURNTABLE_FRAMES = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * HeroEditorial3D
 * Inspired by clean 3D automotive editorial split-hero design:
 * - Warm studio backdrop (#E2DDD5)
 * - Diagonal sweeping perspective stripes from bottom-left
 * - Stacked bold editorial typography with soft highlight block
 * - Interactive 3D studio vehicle stage with mouse tilt & 360° turntable toggle
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

  const currentTractorSrc = spinMode
    ? resolveImageUrl(`/static-uploads/tractor-360-${TURNTABLE_FRAMES[frameIdx]}.jpg`)
    : resolveImageUrl('/static-uploads/hero-studio-tractor.jpg');

  return (
    <section
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      onPointerUp={handlePointerUp}
      style={{ perspective: '1400px' }}
      className="relative overflow-hidden bg-[#E2DDD5] border-b border-[#D2CCC2] min-h-[580px] lg:min-h-[640px] flex items-center"
    >
      {/* Sweeping Diagonal Perspective Stripes (Bottom-Left to Center Horizon) */}
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
          {/* Stripe 1: Sky / Sage Mist */}
          <polygon
            points="-80,720 140,720 620,380 575,380"
            fill="#60A5FA"
            opacity="0.88"
          />
          {/* Stripe 2: Balaji Farmer Green */}
          <polygon
            points="140,720 340,720 665,380 620,380"
            fill="#2E7D32"
            opacity="0.92"
          />
          {/* Stripe 3: Crimson Tractor Red */}
          <polygon
            points="340,720 560,720 715,380 665,380"
            fill="#DC2626"
            opacity="0.92"
          />
        </svg>
      </motion.div>

      {/* Top-Right Studio Mode Pill (Matches Reference Top-Right Badge) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center bg-[#111111] text-white rounded-md overflow-hidden shadow-md border border-white/10">
        <button
          type="button"
          onClick={() => setSpinMode((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
          title="Toggle 360° Interactive Spin View"
        >
          <RotateCw className={`w-3.5 h-3.5 ${spinMode ? 'text-[#4ADE80] animate-spin' : 'text-white'}`} />
          <span>{spinMode ? '360° Active' : '3D View'}</span>
        </button>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span>BALAJI</span>
          <span className="text-[#DC2626] font-black">/</span>
          <span className="text-[#60A5FA] font-black">AGRO</span>
        </div>
      </div>

      {/* Main Split Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* LEFT COLUMN: Stacked Brutalist-Editorial Typography + Pill CTA + Search */}
          <motion.div
            style={{ x: textShiftX }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            {/* Top Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#CFC8BC] text-[10px] font-bold uppercase tracking-widest text-[#111111]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span>Salem-Coimbatore NH Yard • Open 9 AM – 7 PM</span>
            </div>

            {/* Stacked Editorial Display Headline with Soft Highlight Behind Top Lines */}
            <h1 className="font-heading font-black uppercase text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem] text-[#111111] leading-[0.94] tracking-tighter select-none">
              <span className="inline-block bg-[#93C5FD]/45 px-2.5 py-0.5 mb-1 rounded-xs">
                BALAJI BELIEVES
              </span>
              <br />
              <span className="inline-block bg-[#93C5FD]/45 px-2.5 py-0.5 mb-1 rounded-xs">
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
                  className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#111111] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-[#CFC8BC] hover:border-[#111111] transition-all shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>+91 81243 36369</span>
                </a>
              </Magnet>
            </div>

            {/* Compact Integrated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-md pt-1">
              <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#CFC8BC] focus-within:border-[#111111] shadow-sm transition-all">
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

            {/* Bottom-Left Brand Crest & Micro-Caption (Matches Reference Bottom-Left Lockup) */}
            <div className="pt-4 sm:pt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-[#CFC8BC] flex items-center justify-center shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div className="text-[10px] leading-tight font-bold uppercase tracking-wider text-[#111111]">
                <div>BALAJI AUTO &amp; AGRO CONSULTANCY.</div>
                <div className="text-[#555048]">CERTIFIED TRACTORS &amp; CARS SINCE 2014.</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: 3D Interactive Vehicle Stage */}
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
              className={`relative w-full max-w-[600px] ${spinMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              {/* Soft Studio Ground Contact Shadow */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[82%] h-10 bg-black/25 blur-xl rounded-full pointer-events-none"
              />

              {/* Studio 3D Vehicle Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={currentTractorSrc}
                  alt="Balaji Certified 3D Tractor Showcase"
                  draggable={false}
                  className="w-full h-auto object-contain select-none mix-blend-multiply drop-shadow-2xl transition-opacity duration-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/static-uploads/tractor-mahindra-575.jpg';
                  }}
                />
              </div>

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
