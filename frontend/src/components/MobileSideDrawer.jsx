import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { GoogleTranslate } from './GoogleTranslate';
import { 
  X, 
  Home, 
  Layers, 
  FileText, 
  Info, 
  Phone, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const MobileSideDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  const isCurrent = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Inventory & Spares', path: '/products', icon: Layers },
    { label: 'Get Valuation / Sell', path: '/quotation', icon: FileText, highlight: true },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact & Enquiry', path: '/contact', icon: Phone },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-in Panel from Left */}
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-[#F5F1EB] shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-out animate-in slide-in-from-left">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#E3DBD0] flex items-center justify-between">
            <div>
              <Logo size="small" showTagline={false} />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1.5 rounded-full bg-[#EAF3EB] text-[#2E7D32] text-[10px] font-bold uppercase tracking-wider border border-[#C8E0CD]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                Auto &amp; Agro Consultancy
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#111111] hover:bg-[#EAE3D7]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Google Translate Regional Language Switcher */}
          <div className="p-3 border-b border-[#E3DBD0]">
            <GoogleTranslate variant="drawer" />
          </div>

          {/* Quick Categories Bar */}
          <div className="p-4 border-b border-[#E3DBD0] space-y-2 bg-[#FAF8F5]">
            <div className="text-[10px] uppercase font-bold text-[#8C857B] tracking-wider">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/products?category=tractor"
                onClick={onClose}
                className="flex items-center gap-2 p-2 rounded-xl bg-white text-[#111111] text-xs font-bold border border-[#E3DBD0] hover:bg-[#EAE3D7] transition-colors"
              >
                <span>🚜 Tractors</span>
              </Link>
              <Link
                to="/products?category=car"
                onClick={onClose}
                className="flex items-center gap-2 p-2 rounded-xl bg-white text-[#111111] text-xs font-bold border border-[#E3DBD0] hover:bg-[#EAE3D7] transition-colors"
              >
                <span>🚗 Cars</span>
              </Link>
            </div>
            <Link
              to="/products?category=spare_part"
              onClick={onClose}
              className="flex items-center justify-between p-2 rounded-xl bg-white text-[#111111] text-xs font-bold border border-[#E3DBD0] hover:bg-[#EAE3D7] transition-colors"
            >
              <span>⚙️ Genuine Spare Parts</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#111111]" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    item.highlight
                      ? 'bg-[#2E7D32] text-white hover:bg-[#236628]'
                      : isCurrent(item.path)
                      ? 'bg-[#EAF3EB] text-[#2E7D32]'
                      : 'text-[#6B665F] hover:bg-[#EAF3EB] hover:text-[#2E7D32]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${item.highlight ? 'text-white' : isCurrent(item.path) ? 'text-[#2E7D32]' : 'text-[#8C857B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 ${item.highlight ? 'text-white' : 'text-[#8C857B]'}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info & Quick Call inside Drawer */}
        <div className="p-4 border-t border-[#E3DBD0] bg-[#FAF8F5] space-y-3">
          <div className="flex items-center gap-2">
            <a
              href="tel:+918124336369"
              className="flex-1 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white" />
              Call Yard
            </a>
            <a
              href="https://wa.me/918124336369?text=Hello%20Balaji%20Consultancy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#25D366] text-white rounded-full shadow-sm hover:bg-[#20ba59] transition-colors"
              title="WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#6B665F]">
            <Clock className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
            <span>Open All 7 Days • 9:00 AM – 8:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
