import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { PhoneCall, Menu } from 'lucide-react';
import { GoogleTranslate } from './GoogleTranslate';
import { ShinyText } from './ShinyText';
import { ShimmerButton } from './ShimmerButton';

export const Navbar = ({ onOpenSideDrawer }) => {
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Inventory & Spares', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Get Quotation / Sell', path: '/quotation' },
    { label: 'Contact & Enquiry', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F1EB]/95 backdrop-blur-md border-b border-[#E3DBD0] transition-all">
      {/* Top Auto & Agro Consultancy Farmer Green Announcement Bar with Language Selector */}
      <div className="bg-[#2E7D32] text-white py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-[11px]">
              <ShinyText variant="light">Auto &amp; Agro Consultancy</ShinyText>
            </span>
            <span className="text-emerald-200 hidden sm:inline">•</span>
            <span className="text-emerald-100 hidden sm:inline">Certified Pre-Owned Tractors, Commercial Vehicles &amp; Spares</span>
            <span className="text-emerald-200 hidden md:inline">•</span>
            <span className="text-emerald-100 font-semibold hidden md:inline">Salem-Coimbatore NH Yard</span>
          </div>

          {/* Google Translate Language Changer */}
          <div className="flex items-center gap-2 shrink-0">
            <GoogleTranslate variant="topbar" />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo size="normal" showTagline={true} />
          </div>

          {/* Desktop Nav Links - Gliding Spring Pill */}
          <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative whitespace-nowrap px-4 py-2 rounded-full text-xs xl:text-sm transition-colors duration-200 shrink-0 ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-[#6B665F] hover:text-[#2E7D32] hover:bg-[#EAF3EB]/70 font-medium'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navbarActivePill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 bg-[#2E7D32] rounded-full -z-10 shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a href="tel:+918124336369" title="Direct Yard Call">
              <ShimmerButton
                variant="primary"
                shimmerColor="rgba(255, 255, 255, 0.45)"
                className="py-2 px-4 text-xs xl:text-sm font-semibold whitespace-nowrap shadow-none tracking-wide"
              >
                <div className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3 h-3 text-white" />
                </div>
                <span>+91 81243 36369</span>
              </ShimmerButton>
            </a>
          </div>

          {/* Mobile Menu Trigger (Opens Side Drawer) */}
          <div className="flex lg:hidden">
            <button
              onClick={onOpenSideDrawer}
              className="p-2.5 rounded-full text-[#111111] hover:bg-[#EAE3D7] focus:outline-none transition-colors border border-[#E3DBD0]"
              aria-label="Open side navigation menu"
            >
              <Menu className="w-5 h-5 text-[#111111]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
