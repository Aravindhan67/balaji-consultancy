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
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
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

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#F8FAFC]">
      {/* HERO SECTION - HUMANABLE LITE PATTERN */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/70 to-[#F8FAFC] border-b border-slate-200/60">
        {/* Soft Modern Diffuse Ambient Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[420px] h-[420px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[420px] h-[420px] bg-emerald-50/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200/80 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>India's Trusted Automotive &amp; Agro Consultancy</span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15]">
                Certified <span className="text-orange-600">Second-Hand Tractors</span>, Cars &amp; Genuine Spares.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Helping Indian farmers, commercial operators, and families buy and sell pre-owned vehicles with 
                <strong className="text-slate-900 font-semibold"> 120-point mechanical inspection</strong>, guaranteed 
                <strong className="text-slate-900 font-semibold"> RTO RC transfer</strong>, and fair transparent pricing.
              </p>

              {/* Quick CTAs - Humanable Balanced Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Explore Inventory
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/quotation"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <FileCheck className="w-4 h-4 text-slate-950" />
                  Free Valuation / Sell
                </Link>

                <a
                  href="tel:+918124336369"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Talk to Consultant
                </a>
              </div>

              {/* Trust badges row - Humanable Clarity */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-slate-900">5,800+</div>
                  <div className="text-xs text-slate-500 font-medium">Vehicles Delivered</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600">100%</div>
                  <div className="text-xs text-slate-500 font-medium">RTO Passing Guarantee</div>
                </div>
                <div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-orange-600">120-Point</div>
                  <div className="text-xs text-slate-500 font-medium">Engine &amp; Gearbox Check</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Clean Crisp Filter Box */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/90 relative">
                {/* Header of Search Box */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900">Quick Vehicle &amp; Spares Search</h3>
                    <p className="text-xs text-slate-500">Find verified tractors, cars or parts across India</p>
                  </div>
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100">
                    <Search className="w-5 h-5" />
                  </div>
                </div>

                {/* Filter Form */}
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSearchCategory('all')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          searchCategory === 'all'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchCategory('tractor')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          searchCategory === 'tractor'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🚜 Tractors
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchCategory('car')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          searchCategory === 'car'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🚗 Cars
                      </button>
                    </div>
                  </div>

                  {/* Brand select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Brand</label>
                    <select
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Brands (Mahindra, Swaraj, Maruti, John Deere...)</option>
                      <option value="Mahindra">Mahindra (Tractors &amp; Bolero)</option>
                      <option value="Swaraj">Swaraj Tractors</option>
                      <option value="John Deere">John Deere Tractors</option>
                      <option value="Sonalika">Sonalika Sikander</option>
                      <option value="Massey Ferguson">Massey Ferguson</option>
                      <option value="Maruti Suzuki">Maruti Suzuki Cars</option>
                      <option value="Hyundai">Hyundai Cars</option>
                      <option value="Tata">Tata Motors</option>
                      <option value="Toyota">Toyota (Innova)</option>
                      <option value="Bosch India">Bosch Spares</option>
                    </select>
                  </div>

                  {/* Search query input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Keyword or Model</label>
                    <input
                      type="text"
                      placeholder="e.g. 575 DI, 855 FE, Swift, Clutch Plate, Bolero..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Verified Stock
                  </button>
                </form>

                {/* Instant Valuation Micro Banner */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Want to sell your tractor/car?</span>
                  <Link to="/quotation" className="font-bold text-orange-600 hover:underline flex items-center gap-0.5">
                    Instant Valuation <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY BALAJI CONSULTANCY - 4 CLEAN PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block text-xs font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full mb-2 border border-emerald-200">
            Why Indian Farmers &amp; Drivers Choose Us
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900">
            Zero Fraud, 100% Certified Vehicle Consulting
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Buying or selling a second-hand tractor or car shouldn't be risky. We eliminate brokers and middleman commissions with certified technical inspection and transparent paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-2">120-Point Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every tractor engine, hydraulic lift, PTO shaft, car chassis, suspension and meter reading is rigorously tested by certified mechanics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-2">Guaranteed RC &amp; NOC</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We verify all RTO records, hypothecation clearance, tax payment history, and provide seamless interstate NOC and ownership transfer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-2">Genuine Spare Parts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct access to OEM clutch plates, injectors, hydraulic pumps, brake shoes, and filters for all Indian tractor and car models.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
              <BadgePercent className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-2">Agro Loan &amp; Spot Cash</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assistance with Kisan credit and agricultural equipment finance. Want to sell? Get instant spot cash payment for your vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED TRACTORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full mb-2 border border-amber-200">
              🚜 Agriculture &amp; Commercial
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Featured Second-Hand Tractors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Popular Indian models from Mahindra, Swaraj, John Deere, and Sonalika ready for field work.
            </p>
          </div>
          <Link
            to="/products?category=tractor"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            View All Tractors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tractors.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* FEATURED CARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 px-3.5 py-1 rounded-full mb-2 border border-blue-200">
              🚗 Family &amp; Commercial Cars
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Verified Pre-Owned Cars &amp; Utility Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Top models like Bolero, Swift, i20, Nexon &amp; Innova with certified single-owner records.
            </p>
          </div>
          <Link
            to="/products?category=car"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            View All Cars
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* GENUINE SPARE PARTS SECTION - CLEAN LITE CARD */}
      <section className="bg-gradient-to-br from-emerald-50/40 via-white to-amber-50/50 text-slate-800 py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 shadow-sm border border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full mb-2 border border-emerald-200">
                ⚙️ Automotive &amp; Agricultural Components
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900">
                Genuine Spare Parts for Cars &amp; Tractors
              </h2>
              <p className="text-slate-600 text-sm mt-2 max-w-xl leading-relaxed">
                Keep your agricultural tractor and vehicle running at peak performance with tested OEM assemblies, clutch plates, CRDI injectors, and hydraulics.
              </p>
            </div>
            <Link
              to="/products?category=spare_part"
              className="inline-flex items-center gap-1.5 text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20"
            >
              Browse Spare Parts Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spares.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={item.images?.[0] || '/uploads/part-clutch-plate.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-orange-600 font-bold mb-1">{item.brand}</div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Price</span>
                    <div className="text-lg font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</div>
                  </div>
                  <Link
                    to={`/products/${item._id}`}
                    className="text-xs font-bold bg-slate-100 text-slate-800 hover:bg-orange-600 hover:text-white px-3.5 py-2 rounded-xl transition-colors"
                  >
                    View Part
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW OUR CONSULTANCY WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3.5 py-1 rounded-full uppercase border border-orange-200">
            Simple 4-Step Process
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 mt-2">
            How Balaji Vehicle Consultancy Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Whether buying or selling, we protect your money and time with complete transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              1
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base mb-1">Browse or Submit</h4>
            <p className="text-xs text-slate-600">
              Browse our verified stock online or submit your vehicle details for a free price quotation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              2
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base mb-1">Physical Inspection</h4>
            <p className="text-xs text-slate-600">
              Test drive at our yard or have our consultant inspect the vehicle at your farm or doorstep.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              3
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base mb-1">Clear Documentation</h4>
            <p className="text-xs text-slate-600">
              We complete all RTO NOC, form 29/30, loan settlement and official transfer paperwork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              4
            </div>
            <h4 className="font-heading font-bold text-slate-900 text-base mb-1">Secure Delivery</h4>
            <p className="text-xs text-slate-600">
              Take delivery with peace of mind and access our dedicated spare parts support anytime.
            </p>
          </div>
        </div>
      </section>

      {/* INDIAN USER TESTIMONIALS */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full uppercase border border-emerald-200">
              Customer Experiences
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 mt-2">
              Trusted by 5,000+ Farmers &amp; Vehicle Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "I was looking for a pre-owned Swaraj 855 for my 15-acre farm. Balaji Consultancy gave me a certified tractor with genuine hours and handled all the RTO transfer from Punjab to Tamil Nadu smoothly. Very honest service!"
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

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
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

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
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
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION - CLEAN LITE THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 sm:p-12 text-slate-900 text-center relative overflow-hidden shadow-sm border border-orange-200/80">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-xs font-black text-orange-900 uppercase tracking-widest bg-orange-100/80 border border-orange-200 px-3.5 py-1 rounded-full shadow-sm">
              Get Started Today
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900">
              Ready to Buy, Sell, or Find Spare Parts?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connect with our certified vehicle consultants for immediate valuation, yard visits, or spare parts inquiry across India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/quotation"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md shadow-orange-600/20 transition-all"
              >
                Request Free Quotation
              </Link>
              <Link
                to="/contact"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-7 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all"
              >
                Contact Balaji Yard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
