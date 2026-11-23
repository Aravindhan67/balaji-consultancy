import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'normal', showTagline = true, lightMode = false, asLink = true }) => {
  const iconSize = size === 'large' ? 'w-14 h-14' : size === 'small' ? 'w-8 h-8' : 'w-11 h-11';
  const mainTextSize = size === 'large' ? 'text-2xl' : size === 'small' ? 'text-base' : 'text-xl';
  const subTextSize = size === 'large' ? 'text-xs' : 'text-[11px]';

  const logoGraphic = (
    <div className="flex items-center gap-3 group select-none">
      {/* Original Crisp Vector Brand Emblem */}
      <div
        className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 p-0.5 shadow-md shadow-orange-500/15 transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center p-1.5 relative overflow-hidden">
          {/* Subtle machinery gear track in background */}
          <svg viewBox="0 0 64 64" className="w-full h-full absolute inset-0 text-amber-400/15" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="5 3" />
          </svg>

          {/* Original Balaji Automotive & Agro Vector Icon */}
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tractor Heavy Duty Rear Wheel */}
            <circle cx="21" cy="44" r="11" stroke="#F59E0B" strokeWidth="3.5" fill="#0F172A" />
            <circle cx="21" cy="44" r="4.5" fill="#FBBF24" />
            <line x1="21" y1="36" x2="21" y2="52" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="44" x2="29" y2="44" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

            {/* Front Turning Wheel */}
            <circle cx="47" cy="46" r="7.5" stroke="#F59E0B" strokeWidth="2.5" fill="#0F172A" />
            <circle cx="47" cy="46" r="3" fill="#FBBF24" />

            {/* Tractor Chassis & Hood */}
            <path
              d="M15 37V22H31L37 31H51V42H33"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tractor Bonnet Highlight */}
            <path d="M12 22H30" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" />

            {/* Exhaust Silencer */}
            <path d="M39 15V22M37 15H41" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />

            {/* Aerodynamic Car Roofline Sweep */}
            <path
              d="M19 22C25 12 39 12 47 21"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 2"
            />

            {/* Auspicious Tilak / Trust Crest */}
            <path d="M31 7V13" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="31" cy="15.5" r="1.2" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-heading font-black tracking-tight ${mainTextSize} ${
              lightMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            BALAJI
          </span>
          <span className="text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EAF3EB] text-[#1E6B37] border border-[#C8E0CD]">
            INDIA
          </span>
        </div>
        <span
          className={`font-heading font-bold tracking-wider uppercase text-[#1E6B37] ${subTextSize} mt-0.5 leading-snug`}
        >
          Auto &amp; Agro Consultancy
        </span>
        {showTagline && (
          <span
            className={`text-[10px] ${
              lightMode ? 'text-slate-400' : 'text-slate-500'
            } font-medium hidden 2xl:block leading-tight whitespace-nowrap`}
          >
            Certified Tractors • Cars • Genuine Spares
          </span>
        )}
      </div>
    </div>
  );

  if (!asLink) {
    return logoGraphic;
  }

  return (
    <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#1E6B37] rounded-xl">
      {logoGraphic}
    </Link>
  );
};

export default Logo;
