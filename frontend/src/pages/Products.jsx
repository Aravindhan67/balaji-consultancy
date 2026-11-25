import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import BlurText from '../components/BlurText';
import ShinyText from '../components/ShinyText';
import SpotlightCard from '../components/SpotlightCard';

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
  const [priceMax, setPriceMax] = useState(null); // null means all budgets, dynamic cap

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
        const params = { status: 'available' };
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
    setPriceMax(null);
    setSearchParams(new URLSearchParams());
  };

  // Safe array operations
  const safeProducts = Array.isArray(products) ? products : [];

  // Exclude sold out or reserved vehicles from public customer product page
  const availableProducts = safeProducts.filter(
    (p) => p && (p.status === 'available' || !p.status)
  );

  // Calculate dynamic maximum price from available catalog (default minimum 16 Lakh)
  const maxCatalogPrice = Math.max(
    1600000,
    ...availableProducts.map((p) => {
      const val = Number(p?.price);
      return !isNaN(val) && val > 0 ? val : 0;
    })
  );

  const filteredProducts = availableProducts
    .filter((p) => {
      if (!p) return false;
      if (priceMax !== null && priceMax < maxCatalogPrice) {
        const pPrice = Number(p.price);
        if (!isNaN(pPrice) && pPrice > priceMax) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'year-new') return (b.modelYear || 0) - (a.modelYear || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const availableBrands = Array.from(
    new Set([
      'Mahindra',
      'Swaraj',
      'John Deere',
      'Sonalika',
      'Massey Ferguson',
      'Eicher',
      'Maruti Suzuki',
      'Hyundai',
      'Tata',
      'Toyota',
      'Bosch India',
      'Exide Industries',
      ...availableProducts.map((p) => p?.brand).filter(Boolean)
    ])
  );

  const categories = [
    { id: 'all', label: 'All Inventory', count: availableProducts.length },
    { id: 'tractor', label: '🚜 Tractors', count: availableProducts.filter((p) => p && p.category === 'tractor').length },
    { id: 'car', label: '🚗 Cars', count: availableProducts.filter((p) => p && p.category === 'car').length },
    { id: 'spare_part', label: '⚙️ Spare Parts', count: availableProducts.filter((p) => p && p.category === 'spare_part').length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F1EB] text-[#111111]">
      {/* Supro Minimalist Editorial Header Banner */}
      <div className="bg-white text-[#111111] rounded-3xl p-8 sm:p-12 border border-[#E3DBD0]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#111111] uppercase tracking-wider bg-[#EAE3D7] px-3.5 py-1.5 rounded-full border border-[#DCD4C7]">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <ShinyText variant="dark">Balaji Certified Stock</ShinyText>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#111111] tracking-tight">
            <BlurText
              text="Certified Tractors, Cars & Genuine Spares"
              delay={50}
              stepDuration={0.3}
              className="justify-start"
            />
          </h1>
          <p className="text-[#6B665F] text-xs sm:text-sm leading-relaxed font-normal">
            Browse multi-brand pre-owned vehicles with 120-point mechanical certification, transparent pricing in ₹, and authentic RTO paperwork.
          </p>
        </div>
      </div>

      {/* Main Filter & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.05)"
          className="bg-white p-6 rounded-2xl border border-[#E3DBD0] space-y-6 lg:sticky lg:top-28 shadow-xs"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0]">
            <h3 className="font-heading font-bold text-[#111111] text-sm uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#111111]" />
              Filter Stock
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#6B665F] hover:text-[#111111] flex items-center gap-1 font-semibold transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search bar inside sidebar */}
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Search by Name or Model</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Swaraj, Bolero, Swift..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full text-xs bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl pl-9 pr-3.5 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
              />
              <Search className="w-4 h-4 text-[#8C857B] absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">Category</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between border ${
                    category === cat.id
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-none'
                      : 'bg-[#FAF8F5] text-[#111111] border-[#E3DBD0] hover:border-[#2E7D32] hover:text-[#2E7D32]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Manufacturer / Brand</label>
            <select
              value={brand}
              onChange={(e) => handleBrandSelect(e.target.value)}
              className="w-full text-xs font-semibold bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3 py-2.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
            >
              <option value="all">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Maximum Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#111111] mb-1.5">
              <span>Max Budget:</span>
              <span className="font-extrabold text-[#111111]">
                {priceMax === null || priceMax >= maxCatalogPrice ? 'All Budgets' : formatINR(priceMax)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max={maxCatalogPrice}
              step={maxCatalogPrice > 5000000 ? 50000 : 10000}
              value={priceMax === null ? maxCatalogPrice : priceMax}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceMax(val >= maxCatalogPrice ? null : val);
              }}
              className="w-full accent-[#2E7D32] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C857B] mt-1">
              <span>₹2,000 (Spares)</span>
              <span>{formatINR(maxCatalogPrice)} (Max)</span>
            </div>
          </div>

          {/* Trust Badge In Sidebar */}
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E3DBD0] text-xs text-[#111111] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#111111] uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#111111]" /> 120-Point Yard Guarantee
            </div>
            <p className="text-[11px] text-[#6B665F] leading-snug">
              Every tractor &amp; car in stock is physically inspected with original engine compression, gearbox &amp; clean RTO papers.
            </p>
          </div>
        </SpotlightCard>

        {/* Right Main Product Listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3DBD0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B665F]">
              Showing <strong className="text-[#111111] font-bold">{filteredProducts.length}</strong> verified vehicles &amp; parts
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <SlidersHorizontal className="w-4 h-4 text-[#8C857B]" />
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wider">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-[#FAF8F5] border border-[#E3DBD0] rounded-xl px-3 py-1.5 text-[#111111] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#111111]"
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
                <div key={n} className="h-96 bg-[#FAF8F5] rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E3DBD0] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF8F5] text-[#111111] flex items-center justify-center mx-auto text-xl border border-[#E3DBD0]">
                🚜
              </div>
              <h3 className="font-heading font-black text-xl text-[#111111]">
                No Vehicles Found Matching Your Filter
              </h3>
              <p className="text-xs text-[#6B665F] max-w-md mx-auto">
                Try loosening your budget slider or clearing specific brand filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-[#2E7D32] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-[#236628] transition-colors"
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
