import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import ShimmerButton from './ShimmerButton';

/**
 * HeroEditorial3D
 * Premium Single-Product Studio Hero matched to Balaji's Warm Linen & Farmer Green theme:
 * - Clean studio backdrop (#FAF8F5 -> #EAE3D7) with soft Farmer Green (#2E7D32) radial spotlight
 * - Single isolated transparent vehicle centerpiece with 3D mouse/touch/gyroscope parallax
 * - Crisp editorial typography & clean Explore Stock CTA
 */
export const HeroEditorial3D = () => {
  const isInteracting = useRef(false);
  const hasGyro = useRef(false);

  // 3D Stage Mouse / Touch / Gyroscope Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 110, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 110, damping: 22 });

  const vehicleRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const vehicleRotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const vehicleTranslateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const titleShiftX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);

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
        mouseX.set(Math.sin(t * 1.15) * 0.28);
        mouseY.set(Math.cos(t * 0.85) * 0.18);
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
      style={{ perspective: '1400px' }}
      className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F2EDE4] to-[#E9E2D6] text-[#111111] border-b border-[#DCD4C7] min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex flex-col justify-between"
    >
      {/* Subtle Theme-Matched Farmer Green & Warm Gold Studio Aura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 56%, rgba(46, 125, 50, 0.14) 0%, rgba(46, 125, 50, 0.04) 42%, transparent 72%)'
        }}
      />

      {/* Subtle Studio Horizon Ring */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[540px] lg:w-[680px] h-[110px] sm:h-[160px] rounded-full border border-[#2E7D32]/15 bg-white/30 blur-[1px] pointer-events-none z-0"
      />

      {/* Top Editorial Header */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-9 text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF3EB] text-[#2E7D32] border border-[#C8E0CD] text-[10px] font-bold uppercase tracking-[0.18em] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>120-Point Certified Studio</span>
        </div>

        <motion.h1
          style={{
            x: titleShiftX,
            fontFamily: "'Playfair Display', Georgia, serif"
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.7rem] sm:text-[4.8rem] md:text-[6rem] lg:text-[7.2rem] font-semibold leading-[0.94] tracking-[-0.03em] text-[#111111] select-none"
        >
          Balaji <span className="text-[#2E7D32] italic font-medium">Yard</span>
        </motion.h1>

        <p className="text-xs sm:text-sm text-[#6B665F] max-w-md mx-auto font-medium">
          Pre-Owned Tractors, Utility Cars, Trucks &amp; Agro Equipments.
        </p>
      </div>

      {/* Centerpiece: ONLY ONE Clean Studio Product with 3D Parallax */}
      <div className="relative z-10 flex items-center justify-center px-4 py-2 sm:py-4">
        <motion.div
          style={{
            rotateX: vehicleRotateX,
            rotateY: vehicleRotateY,
            x: vehicleTranslateX,
            transformStyle: 'preserve-3d'
          }}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[270px] sm:max-w-[380px] lg:max-w-[440px]"
        >
          {/* Realistic Soft Floor Contact Shadow */}
          <div
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[84%] h-8 bg-[#111111]/30 blur-xl rounded-full pointer-events-none"
          />

          <img
            src={resolveImageUrl('/static-uploads/hero-studio-bmw-front.png')}
            alt="Balaji Certified Vehicle"
            draggable={false}
            className="relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/static-uploads/car-mahindra-bolero.jpg';
            }}
          />
        </motion.div>
      </div>

      {/* Bottom Premium Action Bar (spaced cleanly above mobile bottom nav) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-10 pb-14 sm:pb-9 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2E7D32]">
            Auto &amp; Agro Consultancy
          </div>
          <div className="text-xs text-[#6B665F] font-medium mt-0.5">
            Direct Yard Price • Verified RTO &amp; NOC Transfer
          </div>
        </div>

        <Link to="/products">
          <ShimmerButton variant="primary" className="py-3 px-7 text-xs shadow-md">
            <span>Explore Certified Stock</span>
            <ArrowRight className="w-4 h-4" />
          </ShimmerButton>
        </Link>
      </div>
    </section>
  );
};

export default HeroEditorial3D;
