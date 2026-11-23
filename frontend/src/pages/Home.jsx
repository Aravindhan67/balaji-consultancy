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
  ThumbsUp,
  X,
  Plus,
  MessageSquare,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { resolveImageUrl } from '../utils/imageUrl';

const defaultReviews = [
  {
    _id: 'rev_1',
    name: 'Senthil Saravanan',
    role: 'Sugarcane Farmer',
    location: 'Salem (Tamil Nadu)',
    vehicleOrService: 'Swaraj 855 FE',
    rating: 5,
    comment: 'I was looking for a pre-owned Swaraj 855 for my 15-acre sugarcane farm. Balaji Consultancy gave me a certified tractor with genuine hours and handled all the RTO transfer from Punjab to Tamil Nadu smoothly. Very honest service!',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    _id: 'rev_2',
    name: 'Rajeshwar Patil',
    role: 'Transport Fleet Owner',
    location: 'Pune (Maharashtra)',
    vehicleOrService: 'Mahindra Bolero Maxi Truck',
    rating: 5,
    comment: 'Sold my 2018 Mahindra Bolero through Balaji Consultancy. Within 3 days they found a buyer at my expected valuation and the payment was credited to my bank instantly. Highly recommended.',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  },
  {
    _id: 'rev_3',
    name: 'Manpreet Singh Kahlon',
    role: 'Agricultural Contractor',
    location: 'Ludhiana (Punjab)',
    vehicleOrService: 'Genuine OEM Spares',
    rating: 5,
    comment: 'Finding genuine Bosch diesel injectors and tractor clutch plates at reasonable rates was difficult in our local market. Balaji\'s spare parts division sent OEM parts with warranty. Saved me over ₹15,000!',
    verified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
  }
];

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'CU';
};

const avatarColors = [
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-amber-100 text-amber-700 border-amber-200'
];

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [reviews, setReviews] = useState(defaultReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [newReviewId, setNewReviewId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    location: '',
    vehicleOrService: '',
    rating: 5,
    comment: ''
  });

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

  // Load verified customer reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getReviews();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        } else {
          const local = localStorage.getItem('balaji_customer_reviews');
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setReviews(parsed);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert('Please enter your name and review experience.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewPayload = {
        name: reviewForm.name.trim(),
        role: reviewForm.role.trim() || 'Verified Customer',
        location: reviewForm.location.trim(),
        vehicleOrService: reviewForm.vehicleOrService.trim(),
        rating: Number(reviewForm.rating) || 5,
        comment: reviewForm.comment.trim(),
        verified: true,
        createdAt: new Date().toISOString()
      };

      const res = await api.createReview(reviewPayload);
      const addedReview = (res && res.success && res.data) ? res.data : {
        _id: `rev_${Date.now()}`,
        ...reviewPayload
      };

      const updated = [addedReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem('balaji_customer_reviews', JSON.stringify(updated));
      } catch (_) {}

      setNewReviewId(addedReview._id);
      setIsReviewModalOpen(false);
      setReviewSuccessMsg(`Thank you, ${reviewPayload.name}! Your review has been added to our live customer wall.`);
      setReviewForm({
        name: '',
        role: '',
        location: '',
        vehicleOrService: '',
        rating: 5,
        comment: ''
      });

      setTimeout(() => {
        setReviewSuccessMsg('');
      }, 7000);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

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
    <div className="space-y-16 sm:space-y-24 bg-[#F5F1EB] text-[#111111]">
      {/* 1. HERO SECTION - SUPRO MINIMALIST EDITORIAL */}
      <section className="relative overflow-hidden bg-[#F5F1EB] border-b border-[#E3DBD0] py-20 sm:py-28">
        {/* Rich Agro Background Layer - Reduced White Shade & Higher Clarity */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={resolveImageUrl('/static-uploads/hero-tractor-bg.jpg')}
            alt="Balaji Auto and Agro Vehicle Consultancy Yard"
            className="w-full h-full object-cover object-center scale-105 opacity-80 contrast-105 saturate-110"
          />
          {/* Subtle Warm Vignette - Reduced White Fog/Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1EB]/25 via-transparent to-[#F5F1EB]/75" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center space-y-6 sm:space-y-8">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="animate-hero-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF3EB] text-[#2E7D32] text-[11px] font-bold uppercase tracking-wider border border-[#C8E0CD] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
              Auto &amp; Agro Consultancy
            </span>
            <span className="animate-hero-rise hero-delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] text-[#111111] text-[11px] font-semibold border border-[#E3DBD0]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
              Salem-Coimbatore NH Yard • Open 9 AM - 7 PM
            </span>
          </div>

          {/* H1 Headline - Supro Bold Editorial */}
          <h1 className="animate-hero-rise hero-delay-1 font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tight leading-[1.1] drop-shadow-sm">
            Certified Second-Hand Tractors, Utility Cars &amp; Genuine Spares.
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-rise hero-delay-2 text-[#4A453F] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Helping Indian farmers, transport operators, and families buy and sell pre-owned vehicles with{' '}
            <strong className="text-[#111111] font-bold">120-point mechanical certification</strong>, guaranteed{' '}
            <strong className="text-[#111111] font-bold">RTO RC transfer</strong>, and zero middleman broker fees.
          </p>

          {/* Integrated Search Console - Minimalist Warm Pill (Reduced White Glare) */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-[#FAF8F5]/95 backdrop-blur-md p-1.5 rounded-full border border-[#DCD4C7] focus-within:border-[#111111] transition-all shadow-sm">
                <div className="pl-4 pr-2 text-[#8C857B]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search tractor model, HP, or vehicle (e.g. Swaraj 855, Bolero)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent border-none text-[#111111] placeholder:text-[#8C857B] focus:outline-none font-medium py-2"
                />
                <button
                  type="submit"
                  className="taste-btn shrink-0 inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#236628] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors shadow-none"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Action CTAs - Farmer Green & Outline Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              to="/products"
              className="taste-btn inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-full transition-all shadow-none"
            >
              Explore Certified Stock
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+918124336369"
              className="taste-btn inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#2E7D32] hover:text-white text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-all"
              title="Direct Yard Call"
            >
              <PhoneCall className="w-4 h-4" />
              +91 81243 36369
            </a>
          </div>

          {/* Live Trust Counters Row */}
          <div className="pt-8 border-t border-[#E3DBD0] flex items-center justify-center gap-6 sm:gap-14 text-center">
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
                <AnimatedCounter end={5800} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs text-[#8C857B] font-bold uppercase tracking-widest mt-1">
                Vehicles Delivered
              </div>
            </div>

            <div className="h-8 w-px bg-[#E3DBD0]"></div>

            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="text-[10px] sm:text-xs text-[#8C857B] font-bold uppercase tracking-widest mt-1">
                RTO Passing Guarantee
              </div>
            </div>

            <div className="h-8 w-px bg-[#E3DBD0]"></div>

            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
                <AnimatedCounter end={120} suffix="-Point" />
              </div>
              <div className="text-[10px] sm:text-xs text-[#8C857B] font-bold uppercase tracking-widest mt-1">
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
            <div className="inline-block text-[11px] font-bold tracking-wider uppercase text-[#111111] bg-[#EAE3D7] px-4 py-1.5 rounded-full mb-2 border border-[#DCD4C7]">
              Zero Fraud • 100% Verified Consulting
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111] tracking-tight">
              Why Indian Farmers &amp; Drivers Trust Balaji
            </h2>
            <p className="text-[#6B665F] text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl mx-auto">
              Buying or selling a pre-owned tractor or vehicle shouldn't feel like a gamble. We protect your hard-earned money with technical rigour and official legal documentation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Left Column: Dynamic Tractor Image that moves with scroll down toward product cards */}
          <div className="lg:col-span-5 relative" ref={sourceWrapperRef}>
            {/* Background ghost / slot left in Section 2 when tractor flies to right card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-[#E3DBD0] bg-[#FAF8F5] min-h-[350px] text-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-[#EAE3D7] text-[#111111] flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-heading font-bold text-[#111111]">
                Mahindra 575 DI Sarpanch
              </span>
              <span className="text-xs text-[#6B665F] mt-1 max-w-[220px]">
                Pre-owned vehicle certified by our mechanics and moved to live yard stock below
              </span>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-white px-3 py-1 rounded-full border border-[#E3DBD0]">
                <span>Moved to Right Card Below</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Flying / Moving Card */}
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
              <div className="taste-card bg-white p-4 rounded-3xl border border-[#E3DBD0] shadow-sm hover:border-[#111111] transition-all relative overflow-hidden group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF8F5] relative">
                  <img
                    src={resolveImageUrl('/static-uploads/tractor-mahindra-575.jpg')}
                    alt="Verified Pre-Owned Tractor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#2E7D32] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    <span>Auto &amp; Agro Inspected</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#111111] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#E3DBD0]">
                    <span>Mahindra 575 DI (45 HP)</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#2E7D32] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span>{flightProgress > 0.05 ? 'Moving to Card...' : 'Yard Stock'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                <div className="mt-3.5 px-1 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-heading font-bold text-[#111111] block text-sm">
                      Field-Tested Workhorse
                    </span>
                    <span className="text-[#6B665F] text-[11px]">
                      Zero blow-by • 1,600 kg hydraulic lift certified
                    </span>
                  </div>
                  <a
                    href="#featured-tractors"
                    className="taste-btn shrink-0 inline-flex items-center gap-1 bg-[#FAF8F5] hover:bg-[#2E7D32] hover:text-white text-[#111111] text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-colors"
                  >
                    <span>View in Stock</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Clean Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ScrollReveal delay={50}>
              <div className="taste-card bg-white p-6 rounded-2xl border border-[#E3DBD0] h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-[#111111] text-base mb-2">120-Point Inspection</h3>
                  <p className="text-xs text-[#6B665F] leading-relaxed font-normal">
                    Every engine compression, hydraulic draft lift, PTO spline, car chassis, and meter reading is rigorously tested by our certified mechanics.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  Field-tested guarantee
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="taste-card bg-white p-6 rounded-2xl border border-[#E3DBD0] h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-[#111111] text-base mb-2">Guaranteed RC &amp; NOC</h3>
                  <p className="text-xs text-[#6B665F] leading-relaxed font-normal">
                    We check national Vahan records, clear bank hypothecation, and handle all Form 29/30 and interstate NOC transfer paperwork.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  100% legal ownership
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={190}>
              <div className="taste-card bg-white p-6 rounded-2xl border border-[#E3DBD0] h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-[#111111] text-base mb-2">Genuine OEM Spares</h3>
                  <p className="text-xs text-[#6B665F] leading-relaxed font-normal">
                    Direct yard inventory of factory-sealed clutch plates, CRDI injectors, hydraulic pumps, brake discs, and filters for Swaraj, Mahindra &amp; Tata.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
                  Direct OEM replacement
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={260}>
              <div className="taste-card bg-white p-6 rounded-2xl border border-[#E3DBD0] h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mb-4 border border-[#E3DBD0]">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-[#111111] text-base mb-2">Instant Spot Cash</h3>
                  <p className="text-xs text-[#6B665F] leading-relaxed font-normal">
                    Selling your tractor or utility vehicle? Receive immediate spot cash bank transfer on verification with zero middleman broker fees.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EBE3] text-[11px] font-bold text-[#111111] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#111111]" />
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
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#EAF3EB] px-3.5 py-1 rounded-full mb-2 border border-[#C8E0CD]">
                🚜 Auto &amp; Agro Consultancy • Agricultural Tractors
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                Featured Verified Pre-Owned Tractors
              </h2>
              <p className="text-xs sm:text-sm text-[#6B665F] mt-1">
                Popular Indian models from Mahindra, Swaraj, John Deere, and Sonalika tested and ready for agricultural operations.
              </p>
            </div>
            <Link
              to="/products?category=tractor"
              className="taste-btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#2E7D32] hover:text-white bg-white px-5 py-2 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-colors"
            >
              View All Tractors
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-[#FAF8F5] rounded-2xl animate-pulse"></div>
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
                      ? 'ring-2 ring-[#111111] scale-[1.01]'
                      : ''
                  }`}
                >
                  {isDocked && (
                    <div className="absolute -top-3.5 right-4 z-20 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>Added to Stock</span>
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

        {/* Tractor Spare Parts Callout Banner - Minimalist Supro Card */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-[#E3DBD0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-base text-[#111111]">
                  Genuine Spare Parts for Tractors Only
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EAE3D7] text-[#111111] px-2.5 py-0.5 rounded-full border border-[#DCD4C7]">
                  Tractor Spares Only
                </span>
              </div>
              <p className="text-xs text-[#6B665F] mt-0.5">
                Dual clutch plates, hydraulic lift pumps, 88Ah heavy batteries &amp; filters with 6-month warranty.
              </p>
            </div>
          </div>
          <Link
            to="/products?category=spare_part"
            className="taste-btn shrink-0 inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-none"
          >
            <span>Browse Spares</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. FEATURED CARS & UTILITY VEHICLES (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-3.5 py-1 rounded-full mb-2 border border-[#DCD4C7]">
                🚗 Commercial &amp; Family Utility Vehicles
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                Verified Pre-Owned Cars &amp; Bolero Pickups
              </h2>
              <p className="text-xs sm:text-sm text-[#6B665F] mt-1">
                Top models like Bolero Maxi Truck, Swift, i20, and Nexon with certified single-owner records and clean titles.
              </p>
            </div>
            <Link
              to="/products?category=car"
              className="taste-btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#2E7D32] hover:text-white bg-white px-5 py-2 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-colors"
            >
              View All Utility Cars
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-[#FAF8F5] rounded-2xl animate-pulse"></div>
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

        {/* Car Spare Parts Callout Banner - Minimalist Supro Card */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-[#E3DBD0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm sm:text-base text-[#111111]">
                  Genuine Spare Parts for Commercial Cars &amp; Bolero Pickups
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EAE3D7] text-[#111111] px-2.5 py-0.5 rounded-full border border-[#DCD4C7]">
                  Car Spares Only
                </span>
              </div>
              <p className="text-xs text-[#6B665F] mt-0.5">
                Bosch CRDI injectors, ceramic brake pad kits, Garrett turbochargers &amp; suspension bush kits with testing warranty.
              </p>
            </div>
          </div>
          <Link
            to="/products?category=spare_part"
            className="taste-btn shrink-0 inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-none"
          >
            <span>Browse Spares</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 8. 4-STEP VEHICLE CONSULTING PROCESS (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-4 py-1.5 rounded-full border border-[#DCD4C7]">
              Clear 4-Step Process
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111] mt-2">
              How Balaji Vehicle Consultancy Works
            </h2>
            <p className="text-xs sm:text-sm text-[#6B665F] mt-2">
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
              <div className="taste-card bg-white p-6 rounded-2xl border border-[#E3DBD0] text-center relative h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white font-heading font-black text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {step.num}
                  </div>
                  <h4 className="font-heading font-bold text-[#111111] text-base mb-1.5">{step.title}</h4>
                  <p className="text-xs text-[#6B665F] leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 10. REAL CUSTOMER EXPERIENCES (SCROLL REVEAL) - WARM SAND SUPRO WALL */}
      <section id="customer-reviews" className="bg-[#EFE9DF] py-16 border-y border-[#E3DBD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-[#E3DBD0]">
                  Verified Customer Testimonials
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111] mt-2">
                  Trusted by 5,800+ Farmers &amp; Vehicle Owners
                </h2>
                <p className="text-xs sm:text-sm text-[#6B665F] mt-1 max-w-xl">
                  Real feedback from farmers, transport operators, and families who bought or sold vehicles with Balaji Consultancy.
                </p>
              </div>

              {/* Action Button: Write a Review */}
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="taste-btn inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer shadow-none"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Write a Customer Review</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Toast Notification when a review is added */}
          {reviewSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E3DBD0] text-[#111111] text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-[#111111] shrink-0" />
                <span>{reviewSuccessMsg}</span>
              </div>
              <button 
                type="button"
                onClick={() => setReviewSuccessMsg('')}
                className="text-[#6B665F] hover:text-[#111111] text-xs font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Dynamic Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => {
              const initials = getInitials(rev.name);
              const isJustAdded = rev._id === newReviewId;

              return (
                <ScrollReveal key={rev._id || idx} delay={Math.min(idx * 70, 300)}>
                  <div className={`taste-card bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between h-full relative ${
                    isJustAdded ? 'border-[#111111] ring-2 ring-[#111111]/20' : 'border-[#E3DBD0]'
                  }`}>
                    {isJustAdded && (
                      <span className="absolute -top-3 right-4 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-white" />
                        Just Added
                      </span>
                    )}

                    <div>
                      {/* Star Rating & Optional Vehicle / Service Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex text-[#D97706]">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < (rev.rating || 5) ? 'fill-current text-[#D97706]' : 'text-neutral-200'}`} 
                            />
                          ))}
                        </div>
                        {rev.vehicleOrService && (
                          <span className="text-[10px] font-semibold text-[#111111] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E3DBD0]">
                            {rev.vehicleOrService}
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-[#555048] leading-relaxed italic font-normal">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div className="mt-4 pt-4 border-t border-[#F0EBE3] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs bg-[#FAF8F5] text-[#111111] border border-[#E3DBD0] shrink-0">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-[#111111] text-xs truncate">{rev.name}</div>
                        <div className="text-[11px] text-[#8C857B] truncate">
                          {rev.role}{rev.location ? `, ${rev.location}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. FINAL CALL TO ACTION (SCROLL REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-[#111111] text-center relative overflow-hidden border border-[#E3DBD0]">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="text-[10px] font-bold text-[#111111] uppercase tracking-widest bg-[#EAE3D7] border border-[#DCD4C7] px-4 py-1.5 rounded-full">
                Get Started Today
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#111111]">
                Ready to Buy, Sell, or Find Genuine Spare Parts?
              </h2>
              <p className="text-[#6B665F] text-xs sm:text-sm leading-relaxed">
                Connect with our certified vehicle consultants for immediate valuation, yard visits, or spare parts inquiry across India.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  to="/quotation"
                  className="taste-btn bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-none"
                >
                  Request Free Quotation
                </Link>
                <a
                  href="tel:+918124336369"
                  className="taste-btn bg-[#FAF8F5] hover:bg-[#2E7D32] hover:text-white text-[#111111] font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call Yard (+91 81243 36369)
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CUSTOMER REVIEW SUBMISSION MODAL */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E3DBD0] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E3DBD0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] bg-[#EAE3D7] px-3 py-0.5 rounded-full border border-[#DCD4C7]">
                  Customer Feedback
                </span>
                <h3 className="font-heading font-black text-xl text-[#111111] mt-2">
                  Share Your Experience
                </h3>
                <p className="text-xs text-[#6B665F] mt-0.5">
                  Your review will be added directly to our verified customer wall.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-[#D97706] fill-[#D97706]' : 'text-neutral-200'}`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#111111] ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Full Name <span className="text-neutral-900">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>

              {/* Role & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    Your Role / Profession
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sugarcane Farmer, Fleet Owner"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                    City / District &amp; State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Salem (Tamil Nadu)"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                  />
                </div>
              </div>

              {/* Vehicle or Service */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Vehicle Bought / Sold or Service Used (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahindra 575 DI, Bolero Maxi Truck, Clutch Kit"
                  value={reviewForm.vehicleOrService}
                  onChange={(e) => setReviewForm({ ...reviewForm, vehicleOrService: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Your Review / Experience <span className="text-neutral-900">*</span>
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share details about vehicle condition, RTO transfer, valuation, or customer service..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="taste-btn px-5 py-2.5 rounded-full border border-[#E3DBD0] text-[#111111] font-bold text-xs uppercase tracking-wider hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="taste-btn inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#236628] text-white font-bold text-xs uppercase tracking-wider px-7 py-2.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
