import React, { useState, useEffect } from 'react';
import ParticleText from './ParticleText';

export const Preloader = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // 2.4s presentation to let the particle text assemble gracefully and settle
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 2400);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setFade(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F1EB] transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 w-full max-w-4xl animate-in fade-in zoom-in-95 duration-300">
        {/* Original Clean Vector Brand Emblem */}
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-[#2E7D32] p-0.5 shadow-xl shadow-orange-500/15 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-slate-900 p-2 flex items-center justify-center relative overflow-hidden">
              <svg
                viewBox="0 0 64 64"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Tractor Heavy Duty Rear Wheel */}
                <circle cx="21" cy="44" r="11" stroke="#F59E0B" strokeWidth="3.5" fill="#0F172A" />
                <circle cx="21" cy="44" r="4.5" fill="#FBBF24" />
                <line x1="21" y1="36" x2="21" y2="52" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <line x1="13" y1="44" x2="29" y2="44" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

                {/* Front Wheel */}
                <circle cx="47" cy="46" r="7.5" stroke="#F59E0B" strokeWidth="2.5" fill="#0F172A" />
                <circle cx="47" cy="46" r="3" fill="#FBBF24" />

                {/* Tractor Body */}
                <path
                  d="M15 37V22H31L37 31H51V42H33"
                  stroke="#FFFFFF"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 22H30" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />

                {/* Exhaust */}
                <path d="M39 15V22M37 15H41" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />

                {/* Car Roofline */}
                <path
                  d="M19 22C25 12 39 12 47 21"
                  stroke="#60A5FA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                />

                {/* Tilak */}
                <path d="M31 7V13" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="31" cy="15.5" r="1.2" fill="#F59E0B" />
              </svg>
            </div>
          </div>
        </div>

        {/* Interactive ParticleText Assembly for "Balaji Consultancy" */}
        <div className="w-full h-44 sm:h-56 relative flex items-center justify-center my-1">
          <ParticleText
            text="Balaji Consultancy"
            particleSize={2.2}
            density={3.2}
            color="#111111"
            highlightColor="#2E7D32"
            highlightMode="motion"
            shape="circle"
            intro="gather"
            scatter={160}
            gatherDuration={1300}
            stagger={300}
            clickBurst={true}
            burstStrength={1.2}
            pointerRepel={45}
            repelRadius={110}
            idleDrift={0.6}
            trigger="hover"
            fontSize="clamp(2.2rem, 5.8vw, 4.2rem)"
            fontWeight={900}
            fontFamily="Outfit, sans-serif"
            glow={true}
          />
        </div>

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3EB] text-[#2E7D32] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-[#C8E0CD]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
          Auto &amp; Agro Consultancy • Salem-Coimbatore NH Yard
        </div>

        {/* Slim Loading Bar */}
        <div className="w-48 h-1 bg-[#E3DBD0] rounded-full overflow-hidden mt-5">
          <div className="h-full bg-gradient-to-r from-[#2E7D32] via-emerald-400 to-[#2E7D32] rounded-full animate-pulse w-full"></div>
        </div>

        {/* Quick Skip Option */}
        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 text-[11px] font-semibold text-[#8C857B] hover:text-[#111111] transition-colors cursor-pointer"
        >
          Skip intro &rarr;
        </button>
      </div>
    </div>
  );
};

export default Preloader;
