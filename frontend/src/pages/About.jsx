import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  MapPin, 
  FileCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Wrench,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-16 py-8 bg-[#F8FAFC]">
      {/* Hero Banner - Distinct Lite-Dark Slate Gradient Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl border border-slate-700/60">
          {/* Subtle warm ambient lighting & jewel glow */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -top-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 px-3.5 py-1.5 rounded-full shadow-md shadow-amber-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-950" />
              About Balaji Auto &amp; Agro Consultancy
            </div>
            
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Pioneering Trust in India's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
                Pre-Owned Vehicle &amp; Tractor Ecosystem.
              </span>
            </h1>
            
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Founded with the singular purpose of eliminating fraud, unfair middleman brokerage, and unverified mechanical conditions in the second-hand vehicle and agricultural machinery market.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-block text-xs font-bold text-orange-700 bg-orange-50 px-3.5 py-1 rounded-full uppercase border border-orange-200">
              Our Journey &amp; Mission
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900">
              Transforming How India Buys &amp; Sells Second-Hand Tractors &amp; Cars
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              In traditional Indian rural and urban markets, buying a second-hand tractor or car often comes with severe risks: tampered hour meters, hidden hydraulic lift failures, concealed accidental damage, or entangled RTO court hypothecations.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              At <strong className="text-slate-900">Balaji Auto &amp; Agro Consultancy</strong>, we built an institutional, transparent bridge. Every tractor and car entering our yard undergoes an exhaustive <strong>120-Point Mechanical &amp; Electrical Inspection</strong>. We inspect the compression ratio, hydraulic pump pressure, PTO output, gearbox synchronization, tyre wear, and legal RTO verification.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Furthermore, to support vehicle longevity, we established our dedicated <strong className="text-slate-900">Genuine Spare Parts Division</strong>, supplying OEM clutch assemblies, fuel injectors, pumps, and brakes directly to our buyers at factory-direct pricing.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No Hidden Brokerage Fees
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                All-India RTO NOC Support
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                Guaranteed Genuine Spare Parts
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="font-heading font-black text-3xl text-orange-600 mb-1">10+ Years</div>
                <div className="text-xs font-bold text-slate-900">Industry Experience</div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Serving farmers, transport contractors, and families with pride since 2014.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="font-heading font-black text-3xl text-emerald-600 mb-1">5,800+</div>
                <div className="text-xs font-bold text-slate-900">Satisfied Customers</div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Delivered across Tamil Nadu, Karnataka, Maharashtra, Punjab, and beyond.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="font-heading font-black text-3xl text-blue-600 mb-1">100%</div>
                <div className="text-xs font-bold text-slate-900">Legal Title Guarantee</div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Complete verification with VAHAN portal and local RTO registers.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 shadow-sm">
                <div className="font-heading font-black text-3xl text-amber-600 mb-1">120-Pt</div>
                <div className="text-xs font-bold text-slate-900">Engineering Check</div>
                <p className="text-[11px] text-slate-600 mt-2">
                  Certified mechanical certification report handed over with every vehicle key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars - Clean White Cards */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3.5 py-1 rounded-full uppercase border border-orange-200">
              How We Protect You
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 mt-2">
              Our 4 Pillars of Operational Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base mb-2">1. Mechanical Certification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No surprises. We measure real engine blow-by, clutch slippage, hydraulic pump flow, and steering play before quoting a price.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base mb-2">2. 100% RTO Clean Title</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bank NOCs, road tax receipts, hypothecation cancellations, and interstate transit permits verified with zero legal disputes.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base mb-2">3. Genuine Spare Parts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our in-house parts inventory provides genuine assemblies at fair prices, protecting your investment for years down the line.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-slate-900 text-base mb-2">4. Transparent Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct seller-to-buyer clarity without arbitrary brokerage markups. What you see is what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Lite Warm Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 text-slate-900 text-center relative overflow-hidden shadow-sm border border-orange-200/80">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Looking for a Trusted Vehicle or Need Instant Valuation?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Talk directly with our automotive and agricultural consultants today. We will guide you with honest market rates and physical inspection support.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-600/20"
              >
                Browse Our Inventory
              </Link>
              <Link
                to="/contact"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all"
              >
                Visit Balaji Yard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
