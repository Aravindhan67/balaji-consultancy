import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, Activity, ShieldCheck, X } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import SpotlightCard from './SpotlightCard';

/**
 * AdminAnalytics
 * Interactive SVG & Motion-animated analytics charts matching the User Panel Warm Linen & Farmer Green theme.
 * Supports both desktop hover and mobile touch/tap to inspect detailed breakdowns.
 */
export const AdminAnalytics = ({ products = [], enquiries = [], quotations = [] }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [activeBrand, setActiveBrand] = useState(null);
  const [activeLead, setActiveLead] = useState(null);

  // 1. Category Breakdown
  const categoryConfig = [
    { key: 'tractor', label: 'Tractors', color: '#2E7D32', bg: 'bg-[#EAF3EB] text-[#2E7D32]' },
    { key: 'car', label: 'Cars', color: '#2563EB', bg: 'bg-blue-50 text-blue-700' },
    { key: 'truck', label: 'Trucks', color: '#D97706', bg: 'bg-amber-50 text-amber-700' },
    { key: 'agro_equipment', label: 'Agro Equipments', color: '#111111', bg: 'bg-[#EAE3D7] text-[#111111]' }
  ];

  const activeProducts = products.filter((p) => p && p.category !== 'spare_part');
  const totalCount = activeProducts.length || 1;
  const totalValue = activeProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const categoryStats = categoryConfig.map((cat) => {
    const items = activeProducts.filter((p) => p.category === cat.key);
    const value = items.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    return {
      ...cat,
      items,
      count: items.length,
      pct: Math.round((items.length / totalCount) * 100),
      value
    };
  });

  const selectedCategory = categoryStats.find((c) => c.key === activeCategory) || null;

  // Build SVG Donut segments
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;
  const donutSegments = categoryStats.map((cat) => {
    const segLength = (cat.count / totalCount) * circumference;
    const segment = {
      ...cat,
      dasharray: `${segLength} ${circumference}`,
      dashoffset: -cumulativeOffset
    };
    cumulativeOffset += segLength;
    return segment;
  });

  // 2. Stock Status Breakdown
  const statusItems = [
    { key: 'available', label: 'Available (In Stock)', color: '#2E7D32' },
    { key: 'reserved', label: 'Reserved / Booked', color: '#D97706' },
    { key: 'sold', label: 'Sold Out', color: '#DC2626' },
    { key: 'inspection', label: 'Under Inspection', color: '#2563EB' }
  ].map((st) => {
    const items = activeProducts.filter((p) => (p.status || 'available') === st.key);
    const value = items.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    return {
      ...st,
      items,
      count: items.length,
      pct: Math.round((items.length / totalCount) * 100),
      value
    };
  });

  const selectedStatus = statusItems.find((s) => s.key === activeStatus) || null;

  // 3. Top Brands Bar Chart
  const brandMap = {};
  activeProducts.forEach((p) => {
    const b = (p.brand || 'Other').trim();
    if (!brandMap[b]) brandMap[b] = { brand: b, count: 0, value: 0, items: [] };
    brandMap[b].count += 1;
    brandMap[b].value += Number(p.price) || 0;
    brandMap[b].items.push(p);
  });
  const topBrands = Object.values(brandMap)
    .sort((a, b) => b.count - a.count || b.value - a.value)
    .slice(0, 7);
  const maxBrandCount = Math.max(1, ...topBrands.map((b) => b.count));
  const selectedBrand = topBrands.find((b) => b.brand === activeBrand) || null;

  // 4. Leads & Quotations Pipeline
  const enquirySegments = [
    { key: 'new', label: 'New Enquiries', color: '#F59E0B', dotClass: 'bg-amber-500', items: enquiries.filter((e) => (e.status || 'new') === 'new') },
    { key: 'contacted', label: 'Contacted', color: '#2563EB', dotClass: 'bg-blue-600', items: enquiries.filter((e) => e.status === 'contacted') },
    { key: 'closed', label: 'Closed', color: '#2E7D32', dotClass: 'bg-[#2E7D32]', items: enquiries.filter((e) => e.status === 'closed') }
  ];
  const enqNew = enquirySegments[0].items.length;
  const enqContacted = enquirySegments[1].items.length;
  const enqClosed = enquirySegments[2].items.length;
  const enqTotal = enquiries.length || 1;

  const quotationSegments = [
    { key: 'pending', label: 'Pending Valuation', color: '#F59E0B', dotClass: 'bg-amber-500', items: quotations.filter((q) => (q.status || 'pending') === 'pending') },
    { key: 'evaluated', label: 'Evaluated', color: '#2563EB', dotClass: 'bg-blue-600', items: quotations.filter((q) => q.status === 'evaluated') },
    { key: 'deal_made', label: 'Deals Made', color: '#2E7D32', dotClass: 'bg-[#2E7D32]', items: quotations.filter((q) => q.status === 'deal_made') }
  ];
  const quotPending = quotationSegments[0].items.length;
  const quotEval = quotationSegments[1].items.length;
  const quotDeal = quotationSegments[2].items.length;
  const quotTotal = quotations.length || 1;

  const selectedLeadDetail = (() => {
    if (!activeLead) return null;
    if (activeLead.type === 'enquiry') {
      const seg = enquirySegments.find((s) => s.key === activeLead.status);
      if (!seg) return null;
      return {
        category: 'Customer Enquiries',
        label: seg.label,
        color: seg.color,
        count: seg.items.length,
        pct: enquiries.length ? Math.round((seg.items.length / enquiries.length) * 100) : 0,
        items: seg.items.map((e) => `${e.name || 'Customer'}${e.vehicleTitle ? ` — ${e.vehicleTitle}` : ''}`)
      };
    }
    const seg = quotationSegments.find((s) => s.key === activeLead.status);
    if (!seg) return null;
    return {
      category: 'Sell-Quote Valuations',
      label: seg.label,
      color: seg.color,
      count: seg.items.length,
      pct: quotations.length ? Math.round((seg.items.length / quotations.length) * 100) : 0,
      items: seg.items.map((q) => `${q.sellerName || q.name || 'Seller'} — ${q.vehicleModel || q.brand || 'Vehicle'}`)
    };
  })();

  return (
    <div className="space-y-6">
      {/* Row 1: Category Donut Chart & Stock Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution Donut Chart */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Category Share &amp; Valuation</h3>
                  <p className="text-[11px] text-[#6B665F]">Tap or hover a slice to view details</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#6B665F] px-3 py-1 rounded-full border border-[#E3DBD0]">
                {activeProducts.length} Units
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Animated SVG Donut */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#F5F1EB"
                    strokeWidth="16"
                  />
                  {donutSegments.map((seg, i) =>
                    seg.count > 0 ? (
                      <motion.circle
                        key={seg.key}
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={activeCategory === seg.key ? 20 : 16}
                        strokeDasharray={seg.dasharray}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                          strokeDashoffset: seg.dashoffset,
                          opacity: activeCategory && activeCategory !== seg.key ? 0.35 : 1
                        }}
                        transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveCategory(seg.key)}
                        onClick={() => setActiveCategory((prev) => (prev === seg.key ? null : seg.key))}
                      />
                    ) : null
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C857B] truncate max-w-full">
                    {selectedCategory ? selectedCategory.label : 'Total Value'}
                  </span>
                  <span className="font-heading font-black text-sm text-[#111111]">
                    {formatINR(selectedCategory ? selectedCategory.value : totalValue)}
                  </span>
                  {selectedCategory && (
                    <span className="text-[10px] font-bold text-[#2E7D32]">
                      {selectedCategory.count} units ({selectedCategory.pct}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Category Legend Table */}
              <div className="flex-1 w-full space-y-2.5">
                {categoryStats.map((cat) => {
                  const isSelected = activeCategory === cat.key;
                  return (
                    <button
                      type="button"
                      key={cat.key}
                      onMouseEnter={() => setActiveCategory(cat.key)}
                      onClick={() => setActiveCategory((prev) => (prev === cat.key ? null : cat.key))}
                      className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EAF3EB]/60 border-[#2E7D32] shadow-xs'
                          : 'bg-[#FAF8F5] border-[#E3DBD0] hover:border-[#2E7D32]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <div>
                          <div className="font-bold text-[#111111]">{cat.label}</div>
                          <div className="text-[10px] text-[#6B665F]">{formatINR(cat.value)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[#111111]">{cat.count}</div>
                        <div className="text-[10px] font-semibold text-[#6B665F]">{cat.pct}%</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCategory.color }} />
                    {selectedCategory.label} Breakdown
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className="text-[#8C857B] hover:text-[#111111] p-0.5 cursor-pointer"
                    aria-label="Clear category selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B665F]">
                  <span>Units: <strong className="text-[#111111]">{selectedCategory.count} ({selectedCategory.pct}%)</strong></span>
                  <span>Valuation: <strong className="text-[#111111]">{formatINR(selectedCategory.value)}</strong></span>
                  <span>
                    Avg Price:{' '}
                    <strong className="text-[#2E7D32]">
                      {formatINR(selectedCategory.count ? Math.round(selectedCategory.value / selectedCategory.count) : 0)}
                    </strong>
                  </span>
                </div>
                {selectedCategory.items.length > 0 && (
                  <div className="text-[11px] text-[#6B665F] truncate">
                    Top Stock:{' '}
                    <span className="text-[#111111] font-medium">
                      {selectedCategory.items.slice(0, 3).map((p) => p.title).join(' • ')}
                      {selectedCategory.items.length > 3 ? ` (+${selectedCategory.items.length - 3} more)` : ''}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>

        {/* Stock Status Distribution */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Yard Stock Status Analysis</h3>
                  <p className="text-[11px] text-[#6B665F]">Tap or hover any bar to inspect vehicles</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF3EB] text-[#2E7D32] px-3 py-1 rounded-full border border-[#C8E0CD]">
                Live Status
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {statusItems.map((st, idx) => {
                const isSelected = activeStatus === st.key;
                return (
                  <button
                    type="button"
                    key={st.key}
                    onMouseEnter={() => setActiveStatus(st.key)}
                    onClick={() => setActiveStatus((prev) => (prev === st.key ? null : st.key))}
                    className={`w-full text-left space-y-1.5 p-2 -mx-2 rounded-xl transition-all cursor-pointer ${
                      isSelected ? 'bg-[#FAF8F5] ring-1 ring-[#2E7D32]/40' : 'hover:bg-[#FAF8F5]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111111] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                        {st.label}
                      </span>
                      <span className="font-bold text-[#111111]">
                        {st.count} <span className="text-[#8C857B] font-medium">({st.pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#F5F1EB] rounded-full overflow-hidden border border-[#E3DBD0]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: st.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${st.pct}%` }}
                        transition={{ duration: 0.75, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedStatus ? (
              <motion.div
                key={selectedStatus.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E7D32]/30 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedStatus.color }} />
                    {selectedStatus.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveStatus(null)}
                    className="text-[#8C857B] hover:text-[#111111] p-0.5 cursor-pointer"
                    aria-label="Clear status selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B665F]">
                  <span>Count: <strong className="text-[#111111]">{selectedStatus.count} ({selectedStatus.pct}%)</strong></span>
                  <span>Total Value: <strong className="text-[#111111]">{formatINR(selectedStatus.value)}</strong></span>
                  <span>
                    Avg Price:{' '}
                    <strong className="text-[#2E7D32]">
                      {formatINR(selectedStatus.count ? Math.round(selectedStatus.value / selectedStatus.count) : 0)}
                    </strong>
                  </span>
                </div>
                <div className="text-[11px] text-[#6B665F] truncate">
                  {selectedStatus.items.length > 0 ? (
                    <>
                      Vehicles:{' '}
                      <span className="text-[#111111] font-medium">
                        {selectedStatus.items.slice(0, 3).map((p) => p.title).join(' • ')}
                        {selectedStatus.items.length > 3 ? ` (+${selectedStatus.items.length - 3} more)` : ''}
                      </span>
                    </>
                  ) : (
                    <span>No vehicles currently in this status.</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-avg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] flex items-center justify-between text-xs"
              >
                <span className="text-[#6B665F] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  Average Vehicle Price
                </span>
                <span className="font-heading font-black text-sm text-[#111111]">
                  {formatINR(Math.round(totalValue / totalCount))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </div>

      {/* Row 2: Top Brands Column Chart & Lead Conversion Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Brands Column Chart */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Inventory by Manufacturer / Brand</h3>
                  <p className="text-[11px] text-[#6B665F]">Tap or hover any bar to see brand valuation &amp; models</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-1">
              <div className="min-w-[420px] sm:min-w-0 grid grid-cols-7 gap-2 sm:gap-3 items-end h-52 pt-4 pb-2 px-1">
              {topBrands.map((b, idx) => {
                const heightPct = Math.max(12, Math.round((b.count / maxBrandCount) * 100));
                const isSelected = activeBrand === b.brand;
                return (
                  <button
                    type="button"
                    key={b.brand}
                    onMouseEnter={() => setActiveBrand(b.brand)}
                    onClick={() => setActiveBrand((prev) => (prev === b.brand ? null : b.brand))}
                    className="flex flex-col items-center justify-end h-full group cursor-pointer focus:outline-none"
                  >
                    <span className={`text-[10px] font-black mb-1 transition-colors ${isSelected ? 'text-[#2E7D32]' : 'text-[#111111]'}`}>
                      {b.count}
                    </span>
                    <div className="w-full flex-1 flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${heightPct}%`,
                          opacity: activeBrand && !isSelected ? 0.45 : 1
                        }}
                        transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-full max-w-[42px] rounded-t-xl transition-all relative shadow-xs ${
                          isSelected
                            ? 'bg-gradient-to-t from-[#1B5E20] to-[#2E7D32] ring-2 ring-[#2E7D32] ring-offset-2'
                            : 'bg-gradient-to-t from-[#2E7D32] to-[#4ADE80] group-hover:from-[#1B5E20] group-hover:to-[#2E7D32]'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-2 truncate max-w-full text-center transition-colors ${
                        isSelected ? 'text-[#111111]' : 'text-[#6B665F]'
                      }`}
                      title={b.brand}
                    >
                      {b.brand}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedBrand ? (
              <motion.div
                key={selectedBrand.brand}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E7D32]/30 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111]">{selectedBrand.brand} Inventory Details</span>
                  <button
                    type="button"
                    onClick={() => setActiveBrand(null)}
                    className="text-[#8C857B] hover:text-[#111111] p-0.5 cursor-pointer"
                    aria-label="Clear brand selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6B665F]">
                  <span>Units: <strong className="text-[#111111]">{selectedBrand.count} ({Math.round((selectedBrand.count / totalCount) * 100)}%)</strong></span>
                  <span>Total Value: <strong className="text-[#111111]">{formatINR(selectedBrand.value)}</strong></span>
                  <span>Avg Price: <strong className="text-[#2E7D32]">{formatINR(Math.round(selectedBrand.value / selectedBrand.count))}</strong></span>
                </div>
                <div className="text-[11px] text-[#6B665F] truncate">
                  Models:{' '}
                  <span className="text-[#111111] font-medium">
                    {selectedBrand.items.slice(0, 3).map((p) => p.title).join(' • ')}
                    {selectedBrand.items.length > 3 ? ` (+${selectedBrand.items.length - 3} more)` : ''}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="mt-4 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] text-[11px] text-[#6B665F] text-center">
                Touch or hover over any manufacturer column above to inspect unit valuation &amp; models.
              </div>
            )}
          </AnimatePresence>
        </SpotlightCard>

        {/* Customer Enquiries & Quotations Funnel */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Customer Lead Pipeline</h3>
                  <p className="text-[11px] text-[#6B665F]">Tap or hover segments to inspect leads</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enquiries Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111111]">Enquiries ({enquiries.length})</span>
                  <span className="text-[10px] font-bold text-[#2E7D32]">{enqNew} New • {enqContacted} Contacted • {enqClosed} Closed</span>
                </div>
                <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-[#E3DBD0]">
                  {enquirySegments.map((seg) => {
                    const widthPct = (seg.items.length / enqTotal) * 100;
                    const isSelected = activeLead?.type === 'enquiry' && activeLead?.status === seg.key;
                    return (
                      <button
                        type="button"
                        key={seg.key}
                        style={{ width: `${widthPct}%` }}
                        onMouseEnter={() => setActiveLead({ type: 'enquiry', status: seg.key })}
                        onClick={() =>
                          setActiveLead((prev) =>
                            prev?.type === 'enquiry' && prev?.status === seg.key ? null : { type: 'enquiry', status: seg.key }
                          )
                        }
                        className={`${seg.dotClass} h-full transition-all cursor-pointer ${
                          isSelected ? 'brightness-110 ring-2 ring-inset ring-white/80' : 'hover:brightness-105'
                        }`}
                        title={`${seg.label}: ${seg.items.length}`}
                        aria-label={`${seg.label}: ${seg.items.length}`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {enquirySegments.map((seg) => {
                    const isSelected = activeLead?.type === 'enquiry' && activeLead?.status === seg.key;
                    return (
                      <button
                        type="button"
                        key={seg.key}
                        onMouseEnter={() => setActiveLead({ type: 'enquiry', status: seg.key })}
                        onClick={() =>
                          setActiveLead((prev) =>
                            prev?.type === 'enquiry' && prev?.status === seg.key ? null : { type: 'enquiry', status: seg.key }
                          )
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected ? 'bg-white border-[#2E7D32] text-[#111111]' : 'bg-white/60 border-[#E3DBD0] text-[#6B665F]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${seg.dotClass}`} />
                        {seg.label.split(' ')[0]} ({seg.items.length})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quotations Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111111]">Valuations ({quotations.length})</span>
                  <span className="text-[10px] font-bold text-[#2E7D32]">{quotPending} Pending • {quotEval} Evaluated • {quotDeal} Deals</span>
                </div>
                <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-[#E3DBD0]">
                  {quotationSegments.map((seg) => {
                    const widthPct = (seg.items.length / quotTotal) * 100;
                    const isSelected = activeLead?.type === 'quotation' && activeLead?.status === seg.key;
                    return (
                      <button
                        type="button"
                        key={seg.key}
                        style={{ width: `${widthPct}%` }}
                        onMouseEnter={() => setActiveLead({ type: 'quotation', status: seg.key })}
                        onClick={() =>
                          setActiveLead((prev) =>
                            prev?.type === 'quotation' && prev?.status === seg.key ? null : { type: 'quotation', status: seg.key }
                          )
                        }
                        className={`${seg.dotClass} h-full transition-all cursor-pointer ${
                          isSelected ? 'brightness-110 ring-2 ring-inset ring-white/80' : 'hover:brightness-105'
                        }`}
                        title={`${seg.label}: ${seg.items.length}`}
                        aria-label={`${seg.label}: ${seg.items.length}`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {quotationSegments.map((seg) => {
                    const isSelected = activeLead?.type === 'quotation' && activeLead?.status === seg.key;
                    return (
                      <button
                        type="button"
                        key={seg.key}
                        onMouseEnter={() => setActiveLead({ type: 'quotation', status: seg.key })}
                        onClick={() =>
                          setActiveLead((prev) =>
                            prev?.type === 'quotation' && prev?.status === seg.key ? null : { type: 'quotation', status: seg.key }
                          )
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected ? 'bg-white border-[#2E7D32] text-[#111111]' : 'bg-white/60 border-[#E3DBD0] text-[#6B665F]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${seg.dotClass}`} />
                        {seg.label.split(' ')[0]} ({seg.items.length})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedLeadDetail ? (
              <motion.div
                key={`${activeLead.type}-${activeLead.status}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E7D32]/30 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedLeadDetail.color }} />
                    {selectedLeadDetail.label} ({selectedLeadDetail.count} • {selectedLeadDetail.pct}%)
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveLead(null)}
                    className="text-[#8C857B] hover:text-[#111111] p-0.5 cursor-pointer"
                    aria-label="Clear lead selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-[#6B665F] truncate">
                  {selectedLeadDetail.items.length > 0 ? (
                    <>
                      Recent:{' '}
                      <span className="text-[#111111] font-medium">
                        {selectedLeadDetail.items.slice(0, 2).join(' • ')}
                        {selectedLeadDetail.items.length > 2 ? ` (+${selectedLeadDetail.items.length - 2} more)` : ''}
                      </span>
                    </>
                  ) : (
                    <span>No {selectedLeadDetail.label.toLowerCase()} right now.</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between text-xs">
                <span className="text-[#6B665F] font-medium">Total Active Leads</span>
                <span className="font-heading font-black text-base text-[#2E7D32]">
                  {enquiries.length + quotations.length} Requests
                </span>
              </div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
