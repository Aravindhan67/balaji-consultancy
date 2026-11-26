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
 * Full-bleed Editorial Poster Hero inspired by Aldena Studio:
 * - Full-bleed dealership yard photograph integrated with warm emerald-sunlit theme grading & film grain
 * - Top micro category links & giant full-width Playfair Display serif masthead
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
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 22 });

  const bgTranslateX = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const bgTranslateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const titleShiftX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);

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
        mouseX.set(Math.sin(t * 1.1) * 0.25);
        mouseY.set(Math.cos(t * 0.85) * 0.16);
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
      className="relative overflow-hidden bg-[#0D2412] text-[#FAF8F5] min-h-[540px] sm:min-h-[620px] lg:min-h-[690px] flex flex-col justify-between border-b border-[#163D1F]"
    >
      {/* Full-Bleed Dealership Yard Background with 3D Parallax */}
      <motion.div
        style={{ x: bgTranslateX, y: bgTranslateY }}
        className="absolute -inset-6 z-0 pointer-events-none"
      >
        <img
          src={resolveImageUrl('/static-uploads/hero-tractor-bg-v2.jpg')}
          alt="Balaji Auto and Agro Consultancy Yard"
          className="w-full h-full object-cover object-center scale-105 brightness-90 contrast-110 saturate-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/static-uploads/hero-tractor-bg.jpg';
          }}
        />
      </motion.div>

      {/* Theme-Matched Emerald & Warm Sunset Editorial Grading */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(11, 34, 16, 0.72) 0%, rgba(18, 52, 25, 0.25) 45%, rgba(10, 26, 13, 0.85) 100%)'
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 55% 45%, rgba(251, 191, 36, 0.16) 0%, rgba(46, 125, 50, 0.18) 45%, rgba(0, 0, 0, 0.55) 100%)'
        }}
      />

      {/* Subtle Editorial Film Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.14] mix-blend-overlay pointer-events-none z-0" aria-hidden="true">
        <filter id="aldenaFilmGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aldenaFilmGrain)" />
      </svg>

      {/* Top Editorial Category Bar + Giant Serif Masthead */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-white/85 mb-3 sm:mb-4">
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
          className="text-[3rem] sm:text-[5.2rem] md:text-[6.5rem] lg:text-[8rem] xl:text-[9rem] font-semibold leading-[0.9] tracking-[-0.03em] text-[#FAF8F5] select-none drop-shadow-[0_6px_28px_rgba(0,0,0,0.55)]"
        >
          Balaji Yard
        </motion.h1>
      </div>

      {/* Center Breathing Space to Showcase Full-Bleed Yard Photograph */}
      <div className="flex-1 min-h-[140px] sm:min-h-[200px]" />

      {/* Bottom Editorial Row: Left Subhead & Micro-Copy | Right 01/04 Glass Card */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-10 pb-7 sm:pb-10 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        {/* Bottom-Left Editorial Lockup */}
        <div className="space-y-2.5 text-left">
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FAF8F5] tracking-tight drop-shadow-md"
          >
            Auto &amp; Agro Consultancy
          </h2>
          <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-white/90 leading-relaxed drop-shadow-sm">
            <div>BUILT TO ENDURE.</div>
            <div>120-POINT INSPECTED.</div>
            <div>VERIFIED IN EVERY DETAIL.</div>
          </div>
        </div>

        {/* Bottom-Right Interactive 01/04 Dark Glass Card (offset from floating WhatsApp pill) */}
        <div className="w-full sm:w-[300px] sm:mb-10 lg:mb-12 bg-black/60 backdrop-blur-md border border-white/15 p-4 sm:p-5 shadow-2xl">
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
              <p className="text-[11px] text-white/80 leading-relaxed">
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
