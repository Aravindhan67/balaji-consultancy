import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { PhoneCall, Menu } from 'lucide-react';

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
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo size="normal" showTagline={true} />
          </div>

          {/* Desktop Nav Links - Single Line Aligned (Minimalist Supro Pills) */}
          <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs xl:text-sm transition-all duration-200 shrink-0 ${
                  isActive(item.path)
                    ? 'bg-[#111111] text-white font-semibold shadow-none'
                    : 'text-[#6B665F] hover:text-[#111111] hover:bg-[#EAE3D7]/70 font-medium'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href="tel:+918124336369"
              className="taste-btn flex items-center gap-2 text-xs xl:text-sm font-semibold text-white bg-[#111111] hover:bg-neutral-800 px-4 py-2 rounded-full border border-neutral-900 transition-all whitespace-nowrap shrink-0 shadow-none tracking-wide"
              title="Direct Yard Call"
            >
              <div className="w-5 h-5 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-3 h-3 text-white" />
              </div>
              <span className="whitespace-nowrap font-semibold">+91 81243 36369</span>
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
