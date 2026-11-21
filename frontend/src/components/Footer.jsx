import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pillars - Clean Lite Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-200 mb-12">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">120-Point Inspection</h4>
              <p className="text-xs text-slate-500">Engine, hydraulics &amp; chassis thoroughly verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">RC Transfer &amp; NOC</h4>
              <p className="text-xs text-slate-500">Complete hassle-free RTO paperwork across all states</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-200">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Instant Spot Cash</h4>
              <p className="text-xs text-slate-500">Same-day bank transfer upon verified inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Instant Best Price Sell</h4>
              <p className="text-xs text-slate-500">Get spot payment for your second-hand vehicle</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="normal" showTagline={false} lightMode={false} />
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Balaji Auto &amp; Agro Consultancy is India's premier multi-brand vehicle consulting firm. We assist farmers, transport operators, and families with transparent buying, selling, fair valuation, and genuine spare parts for second-hand tractors and cars.
            </p>
            <div className="pt-2 text-xs text-orange-700 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Serving Farmers &amp; Car Owners Across India Since 2014
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Vehicle Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=tractor" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Second-Hand Tractors
                </Link>
              </li>
              <li>
                <Link to="/products?category=car" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Pre-Owned Cars
                </Link>
              </li>
              <li>
                <Link to="/products?category=spare_part" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Tractor Spare Parts
                </Link>
              </li>
              <li>
                <Link to="/products?category=spare_part" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Car Engine &amp; Brake Spares
                </Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Sell Your Vehicle / Free Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Consultancy Services */}
          <div>
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  120-Point Mechanical Inspection
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  All-India RTO RC Transfer
                </Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Free Machine Price Valuation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Yard Inspection &amp; Certification
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-orange-600 flex items-center gap-1 transition-colors text-slate-600">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Staff / Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Yard Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
              Balaji Yard Desk
            </h4>
            <div className="text-xs space-y-2.5 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>NH Bypass Road, Opp. Agri Mandi, Salem - 636005, TN</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <a href="tel:+918124336369" className="hover:text-orange-600 font-semibold transition-colors">+91 81243 36369</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>support@balajiconsultancy.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Open 7 Days (9:00 AM – 8:00 PM)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Balaji Auto &amp; Agro Consultancy. All rights reserved.
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
