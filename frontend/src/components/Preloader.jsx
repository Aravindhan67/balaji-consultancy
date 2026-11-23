import React, { useState, useEffect } from 'react';

export const Preloader = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Quick, smooth 1-second display then seamless fade-out
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 850);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] transition-opacity duration-300 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 max-w-xs animate-in fade-in zoom-in-95 duration-300">
        {/* Original Clean Vector Brand Emblem */}
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 p-0.5 shadow-xl shadow-orange-500/15 flex items-center justify-center">
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

        {/* Brand Text */}
        <div className="flex items-center gap-1.5 justify-center">
          <h1 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
            BALAJI
          </h1>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#EAF3EB] text-[#1E6B37] border border-[#C8E0CD]">
            INDIA
          </span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E6B37] mt-0.5">
          Auto &amp; Agro Consultancy
        </p>

        {/* Clean Slim Loading Bar */}
        <div className="w-36 h-1 bg-slate-200 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-[#1E6B37] via-emerald-500 to-[#1E6B37] rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
};
