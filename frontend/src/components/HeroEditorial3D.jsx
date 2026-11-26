import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';

const EDITORIAL_SLIDES = [
  {
    num: '01/04',
    title: '120-Point Inspection',
    desc: 'Every tractor, car, and truck is mechanically tested for engine compression and zero meter tampering.'
  },
  {
    num: '02/04',
    title: 'Guaranteed RTO & NOC',
    desc: 'Verified VAHAN records, bank hypothecation clearance, and Form 29/30 interstate transfer.'
  },
  {
    num: '03/04',
    title: 'Multi-Brand Yard',
    desc: 'Certified pre-owned tractors, utility cars, commercial trucks, and heavy agro equipments.'
  },
  {
    num: '04/04',
    title: 'Direct Yard Deals',
    desc: 'Zero middleman brokerage fees. Transparent pricing and instant spot cash settlements.'
  }
];

/**
 * HeroEditorial3D
 * Editorial Poster Hero inspired by Aldena Studio:
 * - Rich sunlit burnt-crimson / terracotta backdrop with architectural shadow & film grain
 * - Top micro category links & giant full-width Playfair Display serif masthead
 * - Lower-center 3D parallax crimson vehicle showcase
 * - Bottom-left editorial serif subhead & 3 stacked micro-lines
 * - Bottom-right interactive 01/04 dark glass carousel card
 */
export const HeroEditorial3D = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const isInteracting = useRef(false);
  const hasGyro = useRef(false);

  // 3D Stage Mouse / Touch / Gyroscope Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 110, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 110, damping: 20 });

  const vehicleRotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const vehicleRotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const vehicleTranslateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const titleShiftX = useTransform(smoothX, [-0.5, 0.5], [8, -8]);

  // Auto-advance editorial slide card every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % EDITORIAL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Mobile Gyroscope, Shake & Ambient 3D Float
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null || isInteracting.current) return;
      hasGyro.current = true;
      mouseX.set(Math.max(-0.5, Math.min(0.5, e.gamma / 45)));
      mouseY.set(Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 45)));
    };

    const handleMotion = (e) => {
      const acc = e.acceleration || e.accelerationIncludingGravity;
      if (!acc || isInteracting.current) return;
      const ax = acc.x || 0;
      const ay = acc.y || 0;
      if (Math.abs(ax) > 1.5 || Math.abs(ay) > 1.5) {
        mouseX.set(Math.max(-0.5, Math.min(0.5, ax / 12)));
        mouseY.set(Math.max(-0.5, Math.min(0.5, ay / 12)));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('devicemotion', handleMotion, true);

    let rafId;
    const startTime = performance.now();
    const isTouchOrMobile = window.matchMedia?.('(hover: none)').matches || window.innerWidth < 1024;

    const tick = (now) => {
      if (isTouchOrMobile && !isInteracting.current && !hasGyro.current) {
        const t = (now - startTime) / 1000;
        mouseX.set(Math.sin(t * 1.2) * 0.28);
        mouseY.set(Math.cos(t * 0.9) * 0.18);
      }
      rafId = requestAnimationFrame(tick);
    };

    if (isTouchOrMobile) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('devicemotion', handleMotion, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  const updatePointerCoords = (clientX, clientY, rect) => {
    if (!rect.width || !rect.height) return;
    mouseX.set(Math.max(-0.5, Math.min(0.5, (clientX - rect.left) / rect.width - 0.5)));
    mouseY.set(Math.max(-0.5, Math.min(0.5, (clientY - rect.top) / rect.height - 0.5)));
  };

  const currentSlide = EDITORIAL_SLIDES[slideIdx];
  const progressPercent = ((slideIdx + 1) / EDITORIAL_SLIDES.length) * 100;

  return (
    <section
      onMouseMove={(e) => {
        isInteracting.current = true;
        updatePointerCoords(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
      }}
      onMouseLeave={() => {
        isInteracting.current = false;
        mouseX.set(0);
        mouseY.set(0);
      }}
      onTouchStart={(e) => {
        isInteracting.current = true;
        const t = e.touches?.[0];
        if (t) updatePointerCoords(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
      }}
      onTouchMove={(e) => {
        const t = e.touches?.[0];
        if (t) updatePointerCoords(t.clientX, t.clientY, e.currentTarget.getBoundingClientRect());
      }}
      onTouchEnd={() => {
        isInteracting.current = false;
      }}
      style={{
        perspective: '1400px',
        background: 'linear-gradient(135deg, #5C1510 0%, #9E291D 38%, #BD3323 64%, #4D100B 100%)'
      }}
      className="relative overflow-hidden text-[#FAF8F5] min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] flex flex-col justify-between border-b border-[#3D0D09]"
    >
      {/* Dramatic Architectural Sunbeam & Shadow Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 52% 45%, rgba(255, 160, 120, 0.24) 0%, rgba(158, 41, 29, 0.05) 48%, rgba(20, 4, 3, 0.62) 100%)'
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-35"
        style={{
          background: 'linear-gradient(112deg, rgba(0,0,0,0.45) 0%, transparent 42%, rgba(255,140,105,0.22) 60%, rgba(0,0,0,0.55) 100%)'
        }}
      />

      {/* Subtle Film Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14] mix-blend-overlay pointer-events-none z-0" aria-hidden="true">
        <filter id="aldenaFilmGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aldenaFilmGrain)" />
      </svg>

      {/* Top Editorial Category Bar + Giant Serif Masthead */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 text-center">
        {/* Top Micro Category Links (Matches Reference Top Menu Row) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-white/80 mb-3 sm:mb-4">
          <Link to="/products?category=tractor" className="hover:text-white transition-colors">Tractors</Link>
          <Link to="/products?category=car" className="hover:text-white transition-colors">Cars</Link>
          <Link to="/products?category=truck" className="hover:text-white transition-colors">Trucks</Link>
          <Link to="/products?category=agro_equipment" className="hover:text-white transition-colors">Agro Equipments</Link>
          <Link to="/quotation" className="hover:text-white transition-colors">Valuation</Link>
        </div>

        {/* Giant Full-Width Editorial Serif Display Title */}
        <motion.h1
          style={{
            x: titleShiftX,
            fontFamily: "'Playfair Display', Georgia, serif"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.85rem] sm:text-[5rem] md:text-[6.2rem] lg:text-[7.8rem] xl:text-[8.6rem] font-semibold leading-[0.9] tracking-[-0.03em] text-[#FAF8F5] select-none drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
        >
          Balaji Yard
        </motion.h1>
      </div>

      {/* Center Foreground Vehicle (Overlapping Lower Center with 3D Parallax) */}
      <div className="relative z-10 flex items-center justify-center px-4 -mt-4 sm:-mt-10 lg:-mt-14 pointer-events-none">
        <motion.div
          style={{
            rotateX: vehicleRotateX,
            rotateY: vehicleRotateY,
            x: vehicleTranslateX,
            transformStyle: 'preserve-3d'
          }}
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[275px] sm:max-w-[390px] lg:max-w-[460px]"
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-10 bg-black/65 blur-xl rounded-full"
          />
          <img
            src={resolveImageUrl('/static-uploads/hero-studio-bmw-front.png')}
            alt="Balaji Certified Crimson Vehicle"
            draggable={false}
            className="relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_24px_38px_rgba(0,0,0,0.65)]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static-uploads/car-mahindra-bolero.jpg';
            }}
          />
        </motion.div>
      </div>

      {/* Bottom Editorial Row: Left Subhead & Micro-Copy | Right 01/04 Glass Card */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-10 pb-7 sm:pb-10 pt-2 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        {/* Bottom-Left Editorial Lockup */}
        <div className="space-y-2.5 text-left">
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FAF8F5] tracking-tight"
          >
            Auto &amp; Agro Consultancy
          </h2>
          <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-white/85 leading-relaxed">
            <div>BUILT TO ENDURE.</div>
            <div>120-POINT INSPECTED.</div>
            <div>VERIFIED IN EVERY DETAIL.</div>
          </div>
        </div>

        {/* Bottom-Right Interactive 01/04 Dark Glass Card */}
        <div className="w-full sm:w-[300px] bg-black/55 backdrop-blur-md border border-white/15 p-4 sm:p-5 shadow-2xl">
          {/* Top Progress Bar + Arrows + Counter */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-1.5 text-white/85">
                <button
                  type="button"
                  onClick={() => setSlideIdx((prev) => (prev - 1 + EDITORIAL_SLIDES.length) % EDITORIAL_SLIDES.length)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous highlight"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIdx((prev) => (prev + 1) % EDITORIAL_SLIDES.length)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  aria-label="Next highlight"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-[2px] flex-1 bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-white/85 tabular-nums">
              {currentSlide.num}
            </span>
          </div>

          {/* Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.num}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-1"
            >
              <h3 className="text-sm font-bold text-white tracking-tight">
                {currentSlide.title}
              </h3>
              <p className="text-[11px] text-white/75 leading-relaxed">
                {currentSlide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HeroEditorial3D;
