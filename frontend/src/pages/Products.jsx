import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL params safely
  const urlCategory = searchParams.get('category') || 'all';
  const urlBrand = searchParams.get('brand') || 'all';
  const urlSearch = searchParams.get('search') || '';

  // Local state initialized from URL
  const [category, setCategory] = useState(urlCategory);
  const [brand, setBrand] = useState(urlBrand);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');
  const [priceMax, setPriceMax] = useState(1600000);

  // Sync state when URL searchParams change (e.g. Back/Forward navigation or search from Home)
  useEffect(() => {
    const c = searchParams.get('category') || 'all';
    const b = searchParams.get('brand') || 'all';
    const s = searchParams.get('search') || '';
    setCategory(c);
    setBrand(b);
    setSearchQuery(s);
  }, [searchParams]);

  // Fetch products from backend whenever filters change
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category && category !== 'all') params.category = category;
        if (brand && brand !== 'all') params.brand = brand;
        if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

        const res = await api.getProducts(params);
        if (isMounted) {
          if (res && res.success && Array.isArray(res.data)) {
            setProducts(res.data);
          } else if (Array.isArray(res)) {
            setProducts(res);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [category, brand, searchQuery]);

  const updateUrlParams = (newCategory, newBrand, newSearch) => {
    const nextParams = new URLSearchParams();
    if (newCategory && newCategory !== 'all') nextParams.set('category', newCategory);
    if (newBrand && newBrand !== 'all') nextParams.set('brand', newBrand);
    if (newSearch && newSearch.trim()) nextParams.set('search', newSearch.trim());
    setSearchParams(nextParams);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    updateUrlParams(selectedCategory, brand, searchQuery);
  };

  const handleBrandSelect = (selectedBrand) => {
    setBrand(selectedBrand);
    updateUrlParams(category, selectedBrand, searchQuery);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    updateUrlParams(category, brand, val);
  };

  const handleClearFilters = () => {
    setCategory('all');
    setBrand('all');
    setSearchQuery('');
    setSortBy('newest');
    setPriceMax(1600000);
    setSearchParams(new URLSearchParams());
  };

  // Safe array operations
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts
    .filter((p) => p && (p.price === undefined || p.price <= priceMax))
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'year-new') return (b.modelYear || 0) - (a.modelYear || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const categories = [
    { id: 'all', label: 'All Inventory', count: safeProducts.length },
    { id: 'tractor', label: '🚜 Tractors', count: safeProducts.filter((p) => p && p.category === 'tractor').length },
    { id: 'car', label: '🚗 Cars', count: safeProducts.filter((p) => p && p.category === 'car').length },
    { id: 'spare_part', label: '⚙️ Spare Parts', count: safeProducts.filter((p) => p && p.category === 'spare_part').length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Distinct Lite-Dark Slate Gradient Header Banner */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-700/60">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 px-3.5 py-1.5 rounded-full shadow-md shadow-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            Balaji Certified Stock
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            Certified Tractors, Cars &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
              Genuine Spares
            </span>
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
            Browse multi-brand pre-owned vehicles with 120-point mechanical certification, transparent pricing in ₹, and authentic RTO paperwork.
          </p>
        </div>
      </div>

      {/* Main Filter & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-600" />
              Filter Stock
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search bar inside sidebar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Search by Name or Model</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Swaraj, Bolero, Swift, Clutch..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                    category === cat.id
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Manufacturer / Brand</label>
            <select
              value={brand}
              onChange={(e) => handleBrandSelect(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Brands</option>
              <option value="Mahindra">Mahindra</option>
              <option value="Swaraj">Swaraj</option>
              <option value="John Deere">John Deere</option>
              <option value="Sonalika">Sonalika</option>
              <option value="Massey Ferguson">Massey Ferguson</option>
              <option value="Eicher">Eicher</option>
              <option value="Maruti Suzuki">Maruti Suzuki</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Tata">Tata Motors</option>
              <option value="Toyota">Toyota</option>
              <option value="Bosch India">Bosch India</option>
              <option value="Exide Industries">Exide</option>
            </select>
          </div>

          {/* Maximum Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Max Budget:</span>
              <span className="text-orange-600 font-extrabold">{formatINR(priceMax)}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="1600000"
              step="10000"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹2,000 (Spares)</span>
              <span>₹16 Lakh (Vehicles)</span>
            </div>
          </div>

          {/* Trust Badge In Sidebar */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 120-Point Yard Guarantee
            </div>
            <p className="text-[11px] text-emerald-700 leading-snug">
              Every tractor &amp; car in stock is physically inspected with original engine compression, gearbox &amp; clean RTO papers.
            </p>
          </div>
        </div>

        {/* Right Main Product Listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> verified vehicles &amp; parts
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-semibold text-slate-700">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Latest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Model Year (Newest)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl border border-orange-100">
                🚜
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                No Vehicles Found Matching Your Filter
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try loosening your budget slider or clearing specific brand filters. Alternatively, request an immediate vehicle procurement.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-md shadow-orange-600/20"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
