import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { PhoneCall, FileText, Menu, UserCheck } from 'lucide-react';

export const Navbar = ({ onOpenSideDrawer }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="shrink-0">
            <Logo size="normal" showTagline={true} />
          </div>

          {/* Desktop Nav Links - Single Line Aligned (No Vertical Wrapping) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-3 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm transition-all duration-200 shrink-0 ${
                  isActive(item.path)
                    ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold'
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
              className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
              title="Direct Yard Call"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <span className="whitespace-nowrap font-bold">+91 81243 36369</span>
            </a>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 whitespace-nowrap shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Admin
              </Link>
            )}

            <Link
              to="/quotation"
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs px-3.5 xl:px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-100 shrink-0" />
              <span>Free Valuation / Sell</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger (Opens Side Drawer) */}
          <div className="flex lg:hidden">
            <button
              onClick={onOpenSideDrawer}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-200"
              aria-label="Open side navigation menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
