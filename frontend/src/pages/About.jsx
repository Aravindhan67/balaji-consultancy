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
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUrl';
import BlurText from '../components/BlurText';

export const About = () => {
  return (
    <div className="space-y-16 py-8 bg-[#F5F1EB] text-[#111111]">
      {/* Hero Banner - Supro Minimalist Editorial Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-[#111111] rounded-3xl p-8 sm:p-14 border border-[#E3DBD0]">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider bg-[#EAF3EB] px-3.5 py-1.5 rounded-full border border-[#C8E0CD]">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              Balaji Auto &amp; Agro Consultancy
            </div>
            
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] tracking-tight leading-tight">
              <BlurText
                text="Pioneering Trust in India's Pre-Owned Vehicle & Tractor Ecosystem."
                delay={50}
                stepDuration={0.3}
                className="justify-start"
              />
            </h1>
            
            <p className="text-[#6B665F] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Founded with the singular purpose of eliminating fraud, unfair middleman brokerage, and unverified mechanical conditions in the second-hand vehicle and agricultural machinery market.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy with Mission Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story & Visual Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Narrative Story & Commitments */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block text-[10px] font-bold text-[#111111] bg-[#EAE3D7] px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#DCD4C7]">
              Our Journey &amp; Mission
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111] tracking-tight leading-snug">
              <BlurText
                text="Transforming How India Buys & Sells Second-Hand Tractors & Cars"
                delay={50}
                stepDuration={0.3}
                className="justify-start"
              />
            </h2>
            <p className="text-[#6B665F] text-sm leading-relaxed">
              In traditional Indian rural and urban markets, buying a second-hand tractor or car often comes with severe risks: tampered hour meters, hidden hydraulic lift failures, concealed accidental damage, or entangled RTO court hypothecations.
            </p>
            <p className="text-[#6B665F] text-sm leading-relaxed">
              At <strong className="text-[#111111] font-bold">Balaji Auto &amp; Agro Consultancy</strong>, we built an institutional, transparent bridge. Every tractor and car entering our yard undergoes an exhaustive <strong>120-Point Mechanical &amp; Electrical Inspection</strong>. We inspect the compression ratio, hydraulic pump pressure, PTO output, gearbox synchronization, tyre wear, and legal RTO verification.
            </p>
            <p className="text-[#6B665F] text-sm leading-relaxed">
              Furthermore, to support vehicle longevity, we established our dedicated <strong className="text-[#111111] font-bold">Genuine Spare Parts Division</strong>, supplying OEM clutch assemblies, fuel injectors, pumps, and brakes directly to our buyers at factory-direct pricing.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] bg-white px-3.5 py-1.5 rounded-full border border-[#E3DBD0]">
                <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                <span>No Hidden Brokerage Fees</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] bg-white px-3.5 py-1.5 rounded-full border border-[#E3DBD0]">
                <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                <span>All-India RTO NOC Support</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] bg-white px-3.5 py-1.5 rounded-full border border-[#E3DBD0]">
                <CheckCircle2 className="w-4 h-4 text-[#111111] shrink-0" />
                <span>Guaranteed Genuine Spare Parts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Yard Image Showcase */}
          <div className="lg:col-span-5">
            <div className="taste-card relative rounded-3xl overflow-hidden border border-[#E3DBD0] group">
              <div className="taste-zoom aspect-[4/3] bg-[#FAF8F5] relative">
                <img
                  src={resolveImageUrl('/static-uploads/about-mission-yard.jpg')}
                  alt="Balaji Auto and Agro Consultancy Central Inspection Yard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = resolveImageUrl('/static-uploads/tractor-john-deere-5050.jpg');
                  }}
                />
                
                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 z-10 bg-white/95 backdrop-blur-md text-[#111111] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#E3DBD0] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Salem-Coimbatore NH Yard</span>
                </div>

                {/* Bottom Overlay Info Banner */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex items-center justify-between z-10">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#EAE3D7]">
                      Physical Inspection Hub
                    </div>
                    <div className="text-xs font-bold text-white">
                      120-Point Multi-Brand Testing Yard
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-[#111111] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Open 7 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Metric Containers */}
        <div className="mt-12 pt-10 border-t border-[#E3DBD0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. 10+ Years Industry Experience */}
            <div className="taste-card bg-white rounded-2xl overflow-hidden border border-[#E3DBD0] flex flex-col justify-between group">
              <div>
                <div className="taste-zoom relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={resolveImageUrl('/static-uploads/about-stat-heritage.jpg')}
                    alt="10+ Years Industry Experience"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = resolveImageUrl('/static-uploads/tractor-john-deere-5050.jpg');
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Est. 2014
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-heading font-black text-3xl text-[#111111] mb-1">
                    10+ Years
                  </div>
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Industry Experience
                  </div>
                  <p className="text-[12px] text-[#6B665F] leading-relaxed mt-2.5">
                    Serving farmers, transport contractors, and families with pride since 2014 across South India.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Over a decade of excellence</span>
              </div>
            </div>

            {/* 2. 5,800+ Satisfied Customers */}
            <div className="taste-card bg-white rounded-2xl overflow-hidden border border-[#E3DBD0] flex flex-col justify-between group">
              <div>
                <div className="taste-zoom relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={resolveImageUrl('/static-uploads/about-stat-customers.jpg')}
                    alt="5,800+ Satisfied Customers"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = resolveImageUrl('/static-uploads/tractor-swaraj-855.jpg');
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Pan-India
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-heading font-black text-3xl text-[#111111] mb-1">
                    5,800+
                  </div>
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Satisfied Customers
                  </div>
                  <p className="text-[12px] text-[#6B665F] leading-relaxed mt-2.5">
                    Delivered across Tamil Nadu, Karnataka, Maharashtra, Andhra Pradesh, and Punjab.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Zero middleman broker fees</span>
              </div>
            </div>

            {/* 3. 100% Legal Title Guarantee */}
            <div className="taste-card bg-white rounded-2xl overflow-hidden border border-[#E3DBD0] flex flex-col justify-between group">
              <div>
                <div className="taste-zoom relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={resolveImageUrl('/static-uploads/about-stat-rto.jpg')}
                    alt="100% Legal Title Guarantee"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = resolveImageUrl('/static-uploads/car-mahindra-bolero.jpg');
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    VAHAN Match
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-heading font-black text-3xl text-[#111111] mb-1">
                    100%
                  </div>
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Legal Title Guarantee
                  </div>
                  <p className="text-[12px] text-[#6B665F] leading-relaxed mt-2.5">
                    Complete verification with national VAHAN registry, bank loan NOC release, and official RTO transfer.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Form 29/30 &amp; NOC guaranteed</span>
              </div>
            </div>

            {/* 4. 120-Point Engineering Check */}
            <div className="taste-card bg-white rounded-2xl overflow-hidden border border-[#E3DBD0] flex flex-col justify-between group">
              <div>
                <div className="taste-zoom relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={resolveImageUrl('/static-uploads/about-stat-inspection.jpg')}
                    alt="120-Point Engineering Check"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = resolveImageUrl('/static-uploads/tractor-mahindra-575.jpg');
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    Certified
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-heading font-black text-3xl text-[#111111] mb-1">
                    120-Pt
                  </div>
                  <div className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Engineering Check
                  </div>
                  <p className="text-[12px] text-[#6B665F] leading-relaxed mt-2.5">
                    Certified mechanical inspection report for engine compression, hydraulics, and PTO handed over with every key.
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>6-Month yard warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars - Supro Minimalist Cards */}
      <section className="bg-[#EFE9DF] py-16 border-y border-[#E3DBD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-[#111111] bg-white px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#E3DBD0]">
              How We Protect You
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111] mt-2">
              Our 4 Pillars of Operational Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E3DBD0]">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#111111] text-base mb-2">1. Mechanical Certification</h3>
              <p className="text-xs text-[#6B665F] leading-relaxed">
                No surprises. We measure real engine blow-by, clutch slippage, hydraulic pump flow, and steering play before quoting a price.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E3DBD0]">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#111111] text-base mb-2">2. 100% RTO Clean Title</h3>
              <p className="text-xs text-[#6B665F] leading-relaxed">
                Bank NOCs, road tax receipts, hypothecation cancellations, and interstate transit permits verified with zero legal disputes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E3DBD0]">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#111111] text-base mb-2">3. Genuine Spare Parts</h3>
              <p className="text-xs text-[#6B665F] leading-relaxed">
                Our in-house parts inventory provides genuine assemblies at fair prices, protecting your investment for years down the line.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E3DBD0]">
              <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-[#111111] text-base mb-2">4. Transparent Pricing</h3>
              <p className="text-xs text-[#6B665F] leading-relaxed">
                Direct seller-to-buyer clarity without arbitrary brokerage markups. What you see is what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimalist White Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-[#111111] text-center border border-[#E3DBD0]">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
              Looking for a Trusted Vehicle or Need Instant Valuation?
            </h2>
            <p className="text-[#6B665F] text-xs sm:text-sm">
              Talk directly with our automotive and agricultural consultants today. We will guide you with honest market rates and physical inspection support.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="taste-btn bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full transition-all"
              >
                Browse Our Inventory
              </Link>
              <Link
                to="/contact"
                className="taste-btn bg-[#FAF8F5] hover:bg-[#2E7D32] text-[#111111] hover:text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-all"
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
