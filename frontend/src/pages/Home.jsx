import React, { useState, useEffect, useRef } from 'react';
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
import { ValuationEstimator } from '../components/ValuationEstimator';
import { EmiCalculator } from '../components/EmiCalculator';
import { resolveImageUrl } from '../utils/imageUrl';
import tractorRotationVideo from '../assets/tractor-rotation.mp4';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const heroVideoRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let animationFrameId;
    let scrollEndTimer;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        // Parallax depth translation
        if (scrollY < 1200) {
          setParallaxY(scrollY * 0.22);
        }

        // Scrub 360-degree tractor rotation video in background as user scrolls
        const video = heroVideoRef.current;
        if (video && video.duration && !isNaN(video.duration)) {
          const scrollRange = 750; // 750px of scroll completes full 360 rotation
          const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);

          if (!video.paused) {
            video.pause();
          }
          video.currentTime = progress * video.duration;
        }
      });

      // Resume smooth ambient rotation when scrolling stops near top
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        const video = heroVideoRef.current;
        if (video && window.scrollY < 300 && video.paused) {
          video.play().catch(() => {});
        }
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollEndTimer);
    };
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true });
        if (res && res.success && Array.isArray(res.data)) {
          setFeaturedProducts(res.data);
        } else if (res && Array.isArray(res.data)) {
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

  const safeFeatured = Array.isArray(featuredProducts) ? featuredProducts : [];
  const allTractors = safeFeatured.filter(p => p && p.category === 'tractor');
  const allCars = safeFeatured.filter(p => p && p.category === 'car');

  // Featured Tractors
  const tractors = allTractors.slice(0, 3);

  // Featured Cars & Utility Vehicles
  const cars = allCars.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#F8FAFC]">
      {/* 1. HERO SECTION - FULL SCREEN 360 ROTATION SHOWROOM */}
      <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center bg-slate-950 border-b border-slate-800">
        {/* Background 360-Degree Tractor Video with Scroll-Linked Rotation & Parallax */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="w-full h-full relative transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${parallaxY}px, 0)`
            }}
          >
            <video
              ref={heroVideoRef}
              src={tractorRotationVideo}
              autoPlay
              loop
              muted
              playsInline
              poster={resolveImageUrl('/static-uploads/tractor-mahindra-575.jpg')}
              className="w-full h-full object-cover object-center lg:object-[72%_center] opacity-90"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                v.muted = true;
                v.defaultMuted = true;
                v.play().catch(() => {});
              }}
            />
          </div>

          {/* Cinematic Dark Gradient for Crisp Text Readability on Left Side */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent lg:w-3/5 z-[1] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 z-[1] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline, Buyer Promise, Search, CTAs & Counter Row */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              {/* Badges Row: Brand Trust + Live Yard Status Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="animate-hero-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-extrabold border border-orange-500/30 shadow-sm backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>India's Trusted Automotive &amp; Agro Vehicle Consultancy</span>
                </div>
                <div className="animate-hero-rise hero-delay-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700/80 shadow-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Yard Open Today: 9 AM - 7 PM • Salem-Coimbatore NH</span>
                </div>
              </div>

              {/* H1 Headline - Cinematic High-Contrast White & Gold */}
              <h1 className="animate-hero-rise hero-delay-1 font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
                Certified <span className="text-orange-500">Second-Hand Tractors</span>, Utility Cars &amp; Genuine Spares.
              </h1>

              {/* Lead Paragraph */}
              <p className="animate-hero-rise hero-delay-2 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Helping Indian farmers, transport operators, and families buy and sell pre-owned vehicles with{' '}
                <strong className="text-white font-semibold">120-point mechanical certification</strong>, guaranteed{' '}
                <strong className="text-white font-semibold">RTO RC transfer</strong>, and zero middleman broker fees.
              </p>

              {/* Integrated Search Bar */}
              <form onSubmit={handleSearchSubmit} className="animate-hero-rise hero-delay-2 max-w-xl mx-auto lg:mx-0 pt-1">
                <div className="flex items-center bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                  <div className="pl-3.5 pr-2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tractor model, HP, or vehicle (e.g. Swaraj 855, Bolero)..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent border-none text-white placeholder:text-slate-400 focus:outline-none font-medium py-2"
                  />
                  <button
                    type="submit"
                    className="taste-btn shrink-0 inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <span>Search Stock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* CTAs */}
              <div className="animate-hero-rise hero-delay-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  to="/products"
                  className="taste-btn inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all"
                >
                  Explore Certified Stock
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/quotation"
                  className="taste-btn inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
                >
                  <FileCheck className="w-4 h-4 text-slate-950" />
                  Free Valuation / Sell
                </Link>

                <a
                  href="tel:+918124336369"
                  className="taste-btn inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm transition-all"
                  title="Direct Yard Call"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  +91 81243 36369
                </a>
              </div>

              {/* Real Animated Trust Stats */}
              <div className="animate-hero-rise hero-delay-4 pt-6 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-white whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={5800} suffix="+" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-tight mt-1">
                    Vehicles Delivered
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-emerald-400 whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-tight mt-1">
                    RTO Passing Guarantee
                  </div>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-orange-400 whitespace-nowrap tracking-tight">
                    <AnimatedCounter end={120} suffix="-Point" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-semibold leading-tight mt-1">
                    Engine &amp; Gearbox Check
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Subtle Turntable Indicator Badge */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center self-end pb-8">
              <div className="bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-2xl text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>360° Interactive Turntable</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Scroll page down to rotate vehicle in background
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* 3. FEATURED TRACTORS (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
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

        {/* Tractor Spare Parts Callout Banner */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-600/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  Genuine Spare Parts for Tractors Only
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Tractor Spares Only
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Dual clutch plates, hydraulic lift pumps, 88Ah heavy batteries &amp; filters available with 6-month yard replacement warranty.
              </p>
            </div>
          </div>
          <Link
            to="/products?category=spare_part"
            className="taste-btn shrink-0 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Browse Tractor Spares Only</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. INTERACTIVE TRACTOR & VEHICLE EMI / KISAN LOAN CALCULATOR (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <EmiCalculator />
        </ScrollReveal>
      </section>

      {/* 6. DEALT MOMENT 2: INSTANT FAIR MARKET VALUE CALCULATOR (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <ValuationEstimator />
        </ScrollReveal>
      </section>

      {/* 7. FEATURED CARS & UTILITY VEHICLES (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
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

        {/* Car Spare Parts Callout Banner */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 border border-blue-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  Genuine Spare Parts for Commercial Cars &amp; Bolero Pickups
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Car Spares Only
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Bosch CRDI injectors, ceramic brake pad kits, Garrett turbochargers &amp; suspension bush kits with Balaji testing warranty.
              </p>
            </div>
          </div>
          <Link
            to="/products?category=spare_part"
            className="taste-btn shrink-0 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Browse Car Spares Only</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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

      {/* 10. REAL CUSTOMER EXPERIENCES (SCROLL REVEAL) */}
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

      {/* 11. FINAL CALL TO ACTION (SCROLL REVEAL) */}
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
