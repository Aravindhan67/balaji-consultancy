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
import { resolveImageUrl } from '../utils/imageUrl';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [flightProgress, setFlightProgress] = useState(0);
  const [flightDelta, setFlightDelta] = useState({ dx: 760, dy: 540 });
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const sourceWrapperRef = useRef(null);
  const movingTractorRef = useRef(null);
  const targetCardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    let animationFrameId;

    const updateGeometry = () => {
      if (typeof window === 'undefined') return;
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (!desktop) {
        setFlightProgress(0);
        return;
      }

      if (sourceWrapperRef.current && targetCardRef.current) {
        const sRect = sourceWrapperRef.current.getBoundingClientRect();
        const tRect = targetCardRef.current.getBoundingClientRect();
        const dx = tRect.left - sRect.left;
        const dy = (tRect.top + window.scrollY) - (sRect.top + window.scrollY);

        if (dx > 50 && dy > 50) {
          setFlightDelta({ dx, dy });
        }
      }
    };

    updateGeometry();
    window.addEventListener('resize', updateGeometry);

    const handleScroll = () => {
      const scrollY = window.scrollY;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        // Tractor card flight: moves down and across diagonally directly into Card 3 on the right
        if (window.innerWidth >= 1024 && sourceWrapperRef.current && targetCardRef.current) {
          const sRect = sourceWrapperRef.current.getBoundingClientRect();
          const tRect = targetCardRef.current.getBoundingClientRect();

          const sourceTopDoc = sRect.top + scrollY;
          const targetTopDoc = tRect.top + scrollY;

          // Start flight as Section 2 passes into viewing range
          const flightStart = sourceTopDoc - (window.innerHeight * 0.45);
          // End flight when Card 3 reaches viewing position
          const flightEnd = targetTopDoc - (window.innerHeight * 0.42);

          if (flightEnd > flightStart) {
            const p = Math.min(Math.max((scrollY - flightStart) / (flightEnd - flightStart), 0), 1);
            setFlightProgress(p);
          }
        } else {
          setFlightProgress(0);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateGeometry);
      cancelAnimationFrame(animationFrameId);
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

  // Update geometry measurements whenever featured products load or screen changes
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        if (sourceWrapperRef.current && targetCardRef.current && window.innerWidth >= 1024) {
          const sRect = sourceWrapperRef.current.getBoundingClientRect();
          const tRect = targetCardRef.current.getBoundingClientRect();
          const dx = tRect.left - sRect.left;
          const dy = (tRect.top + window.scrollY) - (sRect.top + window.scrollY);
          if (dx > 50 && dy > 50) {
            setFlightDelta({ dx, dy });
          }
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800 text-white py-16 sm:py-24">
        {/* Cinematic Agro & Commercial Vehicle Yard Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={resolveImageUrl('/static-uploads/hero-tractor-bg.jpg')}
            alt="Balaji Auto and Agro Vehicle Consultancy Yard"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Multi-Stop Cinematic Scrim for Text Contrast & Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/92" />
          <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px]" />
          
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-orange-600/15 blur-[120px] rounded-full" />
          <div className="absolute -bottom-20 right-10 w-[420px] h-[280px] bg-amber-500/10 blur-[110px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center space-y-6 sm:space-y-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="animate-hero-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-extrabold border border-amber-500/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              India's Trusted Automotive &amp; Agro Vehicle Consultancy
            </span>
            <span className="animate-hero-rise hero-delay-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700/80 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Yard Open Today: 9 AM - 7 PM • Salem-Coimbatore NH
            </span>
          </div>

          {/* H1 Headline - Crisp High-Contrast Pure White & Luminous Amber-Gold */}
          <h1 className="animate-hero-rise hero-delay-1 font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12] drop-shadow-sm">
            Certified <span className="text-amber-400">Second-Hand Tractors</span>, Utility Cars &amp; Genuine Spares.
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-rise hero-delay-2 text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-normal">
            Helping Indian farmers, transport operators, and families buy and sell pre-owned vehicles with{' '}
            <strong className="text-amber-300 font-semibold">120-point mechanical certification</strong>, guaranteed{' '}
            <strong className="text-emerald-400 font-semibold">RTO RC transfer</strong>, and zero middleman broker fees.
          </p>

          {/* Integrated Search Console */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400 transition-all">
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
                  className="taste-btn shrink-0 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <span>Search Stock</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              to="/products"
              className="taste-btn inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all"
            >
              Explore Certified Stock
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+918124336369"
              className="taste-btn inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm transition-all"
              title="Direct Yard Call"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              +91 81243 36369
            </a>
          </div>

          {/* Live Trust Counters Row */}
          <div className="pt-6 border-t border-white/15 flex items-center justify-center gap-6 sm:gap-14 text-center">
            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
                <AnimatedCounter end={5800} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-0.5">
                Vehicles Delivered
              </div>
            </div>

            <div className="h-7 w-px bg-white/20"></div>

            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-emerald-400 tracking-tight drop-shadow-sm">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-0.5">
                RTO Passing Guarantee
              </div>
            </div>

            <div className="h-7 w-px bg-white/20"></div>

            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-amber-400 tracking-tight drop-shadow-sm">
                <AnimatedCounter end={120} suffix="-Point" />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold mt-0.5">
                Engine &amp; Gearbox Check
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY BALAJI VEHICLE CONSULTANCY - 4 CLEAN PILLARS + DYNAMIC SCROLL TRACTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-block text-xs font-extrabold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
              Zero Fraud • 100% Verified Consulting
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Why Indian Farmers &amp; Drivers Trust Balaji
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl mx-auto">
              Buying or selling a pre-owned tractor or vehicle shouldn't feel like a gamble. We protect your hard-earned money with technical rigour and official legal documentation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Left Column: Dynamic Tractor Image that moves with scroll down toward product cards */}
          <div className="lg:col-span-5 relative" ref={sourceWrapperRef}>
            {/* Background ghost / slot left in Section 2 when tractor flies to right card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 min-h-[350px] text-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 shadow-inner">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-heading font-black text-slate-800">
                Mahindra 575 DI Sarpanch
              </span>
              <span className="text-xs text-slate-500 mt-1 max-w-[220px]">
                Pre-owned vehicle certified by our mechanics and moved to live yard stock below
              </span>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <span>Moved to Right Card Below</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Flying / Moving Card: Travels diagonally down and across directly to the right product card */}
            <div 
              ref={movingTractorRef}
              className={`will-change-transform ${
                isDesktop ? 'lg:absolute lg:inset-0 z-30' : 'relative z-10'
              }`}
              style={{
                transform: isDesktop && flightProgress > 0
                  ? `translate3d(${flightProgress * flightDelta.dx}px, ${flightProgress * flightDelta.dy}px, 0) scale(${1 - flightProgress * 0.06})`
                  : 'none',
                opacity: isDesktop && flightProgress >= 0.95 
                  ? Math.max(1 - (flightProgress - 0.95) * 20, 0) 
                  : 1,
                pointerEvents: isDesktop && flightProgress > 0.05 ? 'none' : 'auto',
                transition: 'transform 0.08s ease-out, opacity 0.15s ease-out'
              }}
            >
              <div className="taste-card bg-white p-4 rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={resolveImageUrl('/static-uploads/tractor-mahindra-575.jpg')}
                    alt="Verified Pre-Owned Tractor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>120-Point Inspected</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/15 shadow-md">
                    <span>Mahindra 575 DI (45 HP)</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <span>{flightProgress > 0.05 ? 'Moving to Right Card...' : 'Moving to Stock'}</span>
                    <ArrowRight className="w-3 h-3 animate-pulse" />
                  </div>
                </div>

                <div className="mt-3.5 px-1 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-heading font-extrabold text-slate-900 block text-sm">
                      Field-Tested Workhorse
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Zero blow-by • 1,600 kg hydraulic lift certified
                    </span>
                  </div>
                  <a
                    href="#featured-tractors"
                    className="taste-btn shrink-0 inline-flex items-center gap-1 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>View in Stock</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Clean Pillars in a balanced 2x2 grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                  <h3 className="font-heading font-extrabold text-slate-900 text-base mb-2">Instant Spot Cash</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Selling your tractor or utility vehicle? Receive immediate spot cash bank transfer on verification with zero middleman broker fees.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-purple-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-purple-600" />
                  Same-day settlement
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TRACTORS (SCROLL REVEAL) */}
      <section id="featured-tractors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {tractors.map((item, idx) => {
              const isTargetCard = idx === 2 || (idx === tractors.length - 1 && idx > 0);
              const isDocked = isTargetCard && isDesktop && flightProgress >= 0.88;

              return (
                <div
                  key={item._id}
                  ref={isTargetCard ? targetCardRef : null}
                  className={`relative transition-all duration-300 rounded-2xl ${
                    isDocked
                      ? 'ring-4 ring-orange-500 shadow-2xl scale-[1.02] bg-orange-50/20'
                      : ''
                  }`}
                >
                  {isDocked && (
                    <div className="absolute -top-3.5 right-4 z-20 animate-bounce bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Added to Stock • Right Card</span>
                    </div>
                  )}
                  <ScrollReveal delay={idx * 100}>
                    <ProductCard product={item} />
                  </ScrollReveal>
                </div>
              );
            })}
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

      {/* 5. DEALT MOMENT 2: INSTANT FAIR MARKET VALUE CALCULATOR (SCROLL REVEAL) */}
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
