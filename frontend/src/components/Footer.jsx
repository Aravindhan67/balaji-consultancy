import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { GoogleTranslate } from './GoogleTranslate';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#EFE9DF] text-[#6B665F] pt-16 pb-12 border-t border-[#E3DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars - Minimalist White Supro Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#E3DBD0] mb-12">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E3DBD0]">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E3DBD0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#111111] text-sm">120-Point Inspection</h4>
              <p className="text-xs text-[#6B665F]">Engine, hydraulics &amp; chassis verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E3DBD0]">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E3DBD0]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#111111] text-sm">RC Transfer &amp; NOC</h4>
              <p className="text-xs text-[#6B665F]">Complete hassle-free RTO paperwork</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E3DBD0]">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E3DBD0]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#111111] text-sm">Instant Spot Cash</h4>
              <p className="text-xs text-[#6B665F]">Same-day payment upon verified inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#E3DBD0]">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E3DBD0]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#111111] text-sm">Best Price Sell</h4>
              <p className="text-xs text-[#6B665F]">Direct yard valuation without middlemen</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="normal" showTagline={false} lightMode={false} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3EB] text-[#2E7D32] text-[11px] font-bold uppercase tracking-wider border border-[#C8E0CD]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
              Auto &amp; Agro Consultancy
            </div>
            <p className="text-xs text-[#6B665F] leading-relaxed max-w-sm">
              Balaji Auto &amp; Agro Consultancy is India's trusted pre-owned vehicle consultancy. We assist farmers, transport operators, and families with transparent buying, selling, and fair valuation.
            </p>
            <div className="pt-2 text-xs text-[#111111] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
              Serving Farmers &amp; Car Owners Across India Since 2014
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">
              Vehicle Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=tractor" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Second-Hand Tractors
                </Link>
              </li>
              <li>
                <Link to="/products?category=car" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Pre-Owned Cars
                </Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Sell Your Vehicle / Free Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Consultancy Services */}
          <div>
            <h4 className="font-heading font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  120-Point Mechanical Inspection
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  All-India RTO RC Transfer
                </Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Free Machine Price Valuation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Yard Inspection &amp; Certification
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#111111] flex items-center gap-1 transition-colors text-[#6B665F]">
                  <ChevronRight className="w-3 h-3 text-[#111111]" />
                  Staff / Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Yard Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">
              Balaji Yard Desk
            </h4>
            <div className="text-xs space-y-2.5 text-[#6B665F]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#111111] flex-shrink-0 mt-0.5" />
                <span>NH Bypass Road, Opp. Agri Mandi, Salem - 636005, TN</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#111111] flex-shrink-0" />
                <a href="tel:+918124336369" className="hover:text-[#111111] font-semibold transition-colors">+91 81243 36369</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#111111] flex-shrink-0" />
                <span>support@balajiconsultancy.com</span>
              </div>
              <div className="flex items-center gap-2 text-[#6B665F]">
                <Clock className="w-4 h-4 text-[#111111] flex-shrink-0" />
                <span>Open 7 Days (9:00 AM – 8:00 PM)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Language Bar */}
        <div className="pt-8 border-t border-[#E3DBD0] flex flex-col md:flex-row items-center justify-between text-xs text-[#6B665F] gap-4">
          <div>
            © {new Date().getFullYear()} Balaji Auto &amp; Agro Consultancy. All rights reserved.
          </div>

          {/* Google Translate Quick Languages */}
          <div className="flex items-center gap-2">
            <GoogleTranslate variant="topbar" />
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Genuine Pre-Owned Machinery</span>
            <span>•</span>
            <span>Tamil Nadu &amp; All-India Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
