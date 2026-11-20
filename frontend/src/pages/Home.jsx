import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  PhoneCall, 
  Sparkles, 
  Wrench, 
  Car, 
  BadgePercent,
  Star,
  Users,
  ChevronRight,
  MapPin,
  FileCheck,
  Check,
  Award,
  Layers,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { InspectionStation } from '../components/InspectionStation';
import { ValuationEstimator } from '../components/ValuationEstimator';
import { BrandTrustStrip } from '../components/BrandTrustStrip';
import { resolveImageUrl } from '../utils/imageUrl';
import tractorRotationVideo from '../assets/tractor-rotation.mp4';
import carRotationVideo from '../assets/car-rotation.mp4';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeHeroTab, setActiveHeroTab] = useState('tractor');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true });
        if (res.success) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCategory !== 'all') query.append('category', searchCategory);
    if (searchBrand !== 'all') query.append('brand', searchBrand);
    if (searchKeyword.trim()) query.append('search', searchKeyword.trim());
    navigate(`/products?${query.toString()}`);
  };

  const tractors = featuredProducts.filter(p => p.category === 'tractor').slice(0, 3);
  const cars = featuredProducts.filter(p => p.category === 'car').slice(0, 3);
  const spares = featuredProducts.filter(p => p.category === 'spare_part').slice(0, 3);

  // Hero showcase preview data
  const heroShowcase = {
    tractor: {
      title: 'Mahindra 575 DI & Swaraj 855 FE',
      tag: 'Heavy Agricultural Workhorses',
      price: 'From ₹3.85 Lakh',
      specs: '42 - 52 HP • Dual Clutch • 1,600 kg Lift',
      rto: 'TN / KA / AP RTO Passing Guaranteed',
      image: '/uploads/tractor-mahindra-575.jpg',
      link: '/products?category=tractor'
    },
    car: {
      title: 'Mahindra Bolero Maxi Truck & Maruti Dzire',
      tag: 'Commercial & Family Utility',
      price: 'From ₹4.20 Lakh',
      specs: 'Diesel mHawk / 1.2L DualJet • Tested Suspension',
      rto: 'Single Owner • Clean NOC Released',
      image: '/uploads/car-mahindra-bolero.jpg',
      link: '/products?category=car'
    },
    spare: {
      title: 'Genuine OEM Clutch Plates, Injectors & Pumps',
      tag: 'Certified Spare Components',
      price: 'Starting ₹1,200',
      specs: 'Bosch, Exide, TVS & OEM Factory Sealed',
      rto: 'Direct Yard Stock with 6-Month Warranty',
      image: '/uploads/part-clutch-plate.jpg',
      link: '/products?category=spare_part'
    }
  };

  const activeShowcase = heroShowcase[activeHeroTab] || heroShowcase.tractor;

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#F8FAFC]">
      {/* 1. HERO SECTION - TASTE SKILL ENTRANCE & HUMANABLE ARCHITECTURE */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:py-20 bg-gradient-to-b from-white via-slate-50/70 to-[#F8FAFC] border-b border-slate-200/60">
        {/* Soft Organic Diffuse Background Accents */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[480px] h-[480px] bg-orange-100/35 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[480px] h-[480px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline, Buyer Promise, CTAs & Counter Row */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="animate-hero-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-extrabold border border-orange-200/80 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>India's Trusted Automotive &amp; Agro Vehicle Consultancy</span>
              </div>

              {/* H1 Headline */}
              <h1 className="animate-hero-rise hero-delay-1 font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.12]">
                Certified <span className="text-orange-600">Second-Hand Tractors</span>, Utility Cars &amp; Genuine Spares.
              </h1>

              {/* Lead Paragraph */}
              <p className="animate-hero-rise hero-delay-2 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Helping Indian farmers, transport operators, and families buy and sell pre-owned vehicles with 
                <strong className="text-slate-900 font-semibold"> 120-point mechanical certification</strong>, guaranteed 
                <strong className="text-slate-900 font-semibold"> RTO RC transfer</strong>, and zero middleman broker fees.
              </p>

              {/* CTAs */}
              <div className="animate-hero-rise hero-delay-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  to="/products"
                  className="taste-btn inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-600/25 transition-all"
                >
                  Explore Certified Stock
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/quotation"
                  className="taste-btn inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
                >
                  <FileCheck className="w-4 h-4 text-slate-950" />
                  Free Valuation / Sell
                </Link>

                <a
                  href="tel:+918124336369"
                  className="taste-btn inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all"
                  title="Direct Yard Call"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  +91 81243 36369
                </a>
              </div>

              {/* Real Animated Trust Stats */}
              <div className="animate-hero-rise hero-delay-4 pt-6 border-t border-slate-200 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={5800} suffix="+" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-tight mt-1">
                    Vehicles Delivered
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-emerald-600 whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-tight mt-1">
                    RTO Passing Guarantee
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-orange-600 whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={120} suffix="-Point" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-tight mt-1">
                    Engine &amp; Gearbox Check
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Stock Preview & Quick Search Console */}
            <div className="lg:col-span-5 space-y-4">
              {/* Interactive Showcase Preview Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/70 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Live Yard Categories
                  </span>
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('tractor')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        activeHeroTab === 'tractor'
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚜 Tractors
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('car')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        activeHeroTab === 'car'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚗 Cars
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('spare')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        activeHeroTab === 'spare'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⚙️ Spares
                    </button>
                  </div>
                </div>

                {/* Visual Frame: Clean Rotating Tractor Video / Showcase Image */}
                <div className="taste-zoom aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200/70 shadow-inner group">
                  {activeHeroTab === 'tractor' ? (
                    <video
                      key="tractor-rotation-video"
                      src={tractorRotationVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={resolveImageUrl('/uploads/tractor-mahindra-575.jpg')}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={(e) => {
                        const v = e.currentTarget;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                      ref={(el) => {
                        if (el) {
                          el.muted = true;
                          el.defaultMuted = true;
                          el.play().catch(() => {});
                        }
                      }}
                    />
                  ) : activeHeroTab === 'car' ? (
                    <video
                      key="car-rotation-video"
                      src={carRotationVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={resolveImageUrl('/uploads/car-mahindra-bolero.jpg')}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={(e) => {
                        const v = e.currentTarget;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                      ref={(el) => {
                        if (el) {
                          el.muted = true;
                          el.defaultMuted = true;
                          el.play().catch(() => {});
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={resolveImageUrl(activeShowcase.image)}
                      alt={activeShowcase.title}
                      className="w-full h-full object-cover animate-hero-settle"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  )}
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {activeShowcase.tag}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
                    {activeShowcase.price}
                  </div>
                </div>

                {/* Showcase Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-heading font-extrabold text-slate-900 text-sm">
                    {activeShowcase.title}
                  </div>
                  <div className="text-slate-500 font-medium">{activeShowcase.specs}</div>
                  <div className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{activeShowcase.rto}</span>
                  </div>
                </div>

                {/* Quick Search Launcher */}
                <form onSubmit={handleSearchSubmit} className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search model, HP, or part (e.g. Swaraj, Bolero, Clutch)..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="taste-btn w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Search Entire Yard Stock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-BRAND MANUFACTURERS TRUST STRIP */}
      <BrandTrustStrip />

      {/* 2. WHY BALAJI VEHICLE CONSULTANCY - 4 CLEAN PILLARS (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block text-xs font-extrabold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
              Zero Fraud • 100% Verified Consulting
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Why Indian Farmers &amp; Drivers Trust Balaji
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
              Buying or selling a pre-owned tractor or vehicle shouldn't feel like a gamble. We protect your hard-earned money with technical rigour and official legal documentation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={50}>
            <div className="taste-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base mb-2">120-Point Inspection</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Every engine compression, hydraulic draft lift, PTO spline, car chassis, and meter reading is rigorously tested by our certified mechanics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Field-tested guarantee
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="taste-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base mb-2">Guaranteed RC &amp; NOC</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  We check national Vahan records, clear bank hypothecation, and handle all Form 29/30 and interstate NOC transfer paperwork.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                100% legal ownership
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={190}>
            <div className="taste-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base mb-2">Genuine OEM Spares</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Direct yard inventory of factory-sealed clutch plates, CRDI injectors, hydraulic pumps, brake discs, and filters for Swaraj, Mahindra &amp; Tata.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-amber-600" />
                Direct OEM replacement
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <div className="taste-card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                  <BadgePercent className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base mb-2">Agro Finance &amp; Spot Cash</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Support with agricultural equipment finance and Kisan credit. Selling your tractor? Receive immediate spot cash bank transfer on verification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-purple-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                Same-day settlement
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. DEALT MOMENT 1: INTERACTIVE 120-POINT MECHANICAL STATION (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <InspectionStation />
        </ScrollReveal>
      </section>

      {/* 4. FEATURED TRACTORS (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full mb-2 border border-amber-200">
                🚜 Agricultural &amp; Heavy Field Tractors
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                Featured Verified Pre-Owned Tractors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Popular Indian models from Mahindra, Swaraj, John Deere, and Sonalika tested and ready for agricultural operations.
              </p>
            </div>
            <Link
              to="/products?category=tractor"
              className="taste-btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-orange-600 hover:text-orange-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              View All Tractors ({tractors.length > 0 ? 'Verified' : 'Catalog'})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tractors.map((item, idx) => (
              <ScrollReveal key={item._id} delay={idx * 100}>
                <ProductCard product={item} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* 5. DEALT MOMENT 2: INSTANT FAIR MARKET VALUE CALCULATOR (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <ValuationEstimator />
        </ScrollReveal>
      </section>

      {/* 6. FEATURED CARS & UTILITY VEHICLES (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full mb-2 border border-blue-200">
                🚗 Commercial &amp; Family Utility Vehicles
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                Verified Pre-Owned Cars &amp; Bolero Pickups
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Top models like Bolero Maxi Truck, Swift, i20, and Nexon with certified single-owner records and clean titles.
              </p>
            </div>
            <Link
              to="/products?category=car"
              className="taste-btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              View All Utility Cars
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((item, idx) => (
              <ScrollReveal key={item._id} delay={idx * 100}>
                <ProductCard product={item} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* 7. GENUINE SPARE PARTS SECTION (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/40 text-slate-800 py-12 sm:py-16 rounded-3xl px-6 sm:px-12 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2 border border-emerald-200">
                  ⚙️ OEM Replacement Assemblies &amp; Spares
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900">
                  Genuine Spare Parts for Tractors &amp; Commercial Cars
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                  Keep your machinery running without downtime. Tested OEM clutch assemblies, turbochargers, heavy batteries, and hydraulic valves available with warranty.
                </p>
              </div>
              <Link
                to="/products?category=spare_part"
                className="taste-btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl transition-all shadow-md shadow-orange-600/20"
              >
                Browse Spare Parts Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spares.map((item, idx) => (
                <div key={item._id} className="taste-card bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="taste-zoom aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={resolveImageUrl(item.images?.[0] || '/uploads/part-clutch-plate.jpg')}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs text-orange-600 font-bold mb-1">{item.brand}</div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Fixed Price</span>
                      <div className="text-lg font-extrabold text-slate-900">₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <Link
                      to={`/products/${item._id}`}
                      className="taste-btn text-xs font-bold bg-slate-100 text-slate-800 hover:bg-orange-600 hover:text-white px-3.5 py-2 rounded-xl transition-colors"
                    >
                      View Part
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. 4-STEP VEHICLE CONSULTING PROCESS (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-orange-700 bg-orange-50 px-3.5 py-1 rounded-full uppercase border border-orange-200">
              Clear 4-Step Process
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 mt-2">
              How Balaji Vehicle Consultancy Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Whether you are buying or selling, we protect your time and money with complete transparency.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '1',
              title: 'Browse or Submit',
              desc: 'Explore certified stock online or submit your vehicle details for a free market valuation.'
            },
            {
              num: '2',
              title: '120-Point Physical Check',
              desc: 'Test-drive at our yard or have our consultant inspect the vehicle on your farm or doorstep.'
            },
            {
              num: '3',
              title: 'Guaranteed RTO NOC',
              desc: 'We clear bank hypothecation, handle Form 29/30, and secure legal interstate NOCs.'
            },
            {
              num: '4',
              title: 'Secure Delivery & Support',
              desc: 'Take delivery with full peace of mind and access our genuine spare parts inventory anytime.'
            }
          ].map((step, idx) => (
            <ScrollReveal key={step.num} delay={idx * 80}>
              <div className="taste-card bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-heading font-black text-sm flex items-center justify-center mx-auto mb-4 shadow-sm shadow-orange-600/30">
                    {step.num}
                  </div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-base mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 9. REAL CUSTOMER EXPERIENCES (SCROLL REVEAL) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full uppercase border border-emerald-200">
                Customer Testimonials
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 mt-2">
                Trusted by 5,800+ Farmers &amp; Vehicle Owners
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={50}>
              <div className="taste-card bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                    "I was looking for a pre-owned Swaraj 855 for my 15-acre sugarcane farm. Balaji Consultancy gave me a certified tractor with genuine hours and handled all the RTO transfer from Punjab to Tamil Nadu smoothly. Very honest service!"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm border border-orange-200">
                    SS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Senthil Saravanan</div>
                    <div className="text-[11px] text-slate-500">Sugarcane Farmer, Salem (Tamil Nadu)</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="taste-card bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                    "Sold my 2018 Mahindra Bolero through Balaji Consultancy. Within 3 days they found a buyer at my expected valuation and the payment was credited to my bank instantly. Highly recommended."
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                    RP
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Rajeshwar Patil</div>
                    <div className="text-[11px] text-slate-500">Transport Fleet Owner, Pune (Maharashtra)</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={190}>
              <div className="taste-card bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                    "Finding genuine Bosch diesel injectors and tractor clutch plates at reasonable rates was difficult in our local market. Balaji's spare parts division sent OEM parts with warranty. Saved me over ₹15,000!"
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm border border-emerald-200">
                    MK
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Manpreet Singh Kahlon</div>
                    <div className="text-[11px] text-slate-500">Agricultural Contractor, Ludhiana (Punjab)</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 text-slate-900 text-center relative overflow-hidden shadow-sm border border-orange-200/80">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="text-xs font-black text-orange-900 uppercase tracking-widest bg-orange-100/80 border border-orange-200 px-3.5 py-1 rounded-full shadow-sm">
                Get Started Today
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900">
                Ready to Buy, Sell, or Find Genuine Spare Parts?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Connect with our certified vehicle consultants for immediate valuation, yard visits, or spare parts inquiry across India.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  to="/quotation"
                  className="taste-btn bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-md shadow-orange-600/20 transition-all"
                >
                  Request Free Quotation
                </Link>
                <a
                  href="tel:+918124336369"
                  className="taste-btn bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Call Yard (+91 81243 36369)
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
