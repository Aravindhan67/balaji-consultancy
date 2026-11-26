import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import SpotlightCard from './SpotlightCard';

/**
 * AdminAnalytics
 * Interactive SVG & Motion-animated analytics charts matching the User Panel Warm Linen & Farmer Green theme.
 */
export const AdminAnalytics = ({ products = [], enquiries = [], quotations = [] }) => {
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
      count: items.length,
      pct: Math.round((items.length / totalCount) * 100),
      value
    };
  });

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
    { key: 'available', label: 'Available (In Stock)', color: '#2E7D32', count: activeProducts.filter((p) => (p.status || 'available') === 'available').length },
    { key: 'reserved', label: 'Reserved / Booked', color: '#D97706', count: activeProducts.filter((p) => p.status === 'reserved').length },
    { key: 'sold', label: 'Sold Out', color: '#DC2626', count: activeProducts.filter((p) => p.status === 'sold').length },
    { key: 'inspection', label: 'Under Inspection', color: '#2563EB', count: activeProducts.filter((p) => p.status === 'inspection').length }
  ];

  // 3. Top Brands Bar Chart
  const brandMap = {};
  activeProducts.forEach((p) => {
    const b = (p.brand || 'Other').trim();
    if (!brandMap[b]) brandMap[b] = { brand: b, count: 0, value: 0 };
    brandMap[b].count += 1;
    brandMap[b].value += Number(p.price) || 0;
  });
  const topBrands = Object.values(brandMap)
    .sort((a, b) => b.count - a.count || b.value - a.value)
    .slice(0, 7);
  const maxBrandCount = Math.max(1, ...topBrands.map((b) => b.count));

  // 4. Leads & Quotations Pipeline
  const enqNew = enquiries.filter((e) => (e.status || 'new') === 'new').length;
  const enqContacted = enquiries.filter((e) => e.status === 'contacted').length;
  const enqClosed = enquiries.filter((e) => e.status === 'closed').length;
  const enqTotal = enquiries.length || 1;

  const quotPending = quotations.filter((q) => (q.status || 'pending') === 'pending').length;
  const quotEval = quotations.filter((q) => q.status === 'evaluated').length;
  const quotDeal = quotations.filter((q) => q.status === 'deal_made').length;
  const quotTotal = quotations.length || 1;

  return (
    <div className="space-y-6">
      {/* Row 1: Category Donut Chart & Stock Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution Donut Chart */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E3DBD0] shadow-xs"
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#111111] text-sm">Category Share &amp; Valuation</h3>
                <p className="text-[11px] text-[#6B665F]">Live stock distribution across 4 categories</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#111111] px-3 py-1 rounded-full border border-[#E3DBD0]">
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
                      strokeWidth="16"
                      strokeDasharray={seg.dasharray}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: seg.dashoffset }}
                      transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C857B]">Total Value</span>
                <span className="font-heading font-black text-sm text-[#111111]">{formatINR(totalValue)}</span>
              </div>
            </div>

            {/* Category Legend Table */}
            <div className="flex-1 w-full space-y-2.5">
              {categoryStats.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E3DBD0] text-xs">
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
                </div>
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* Stock Status Distribution */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#E3DBD0] shadow-xs"
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#111111] text-sm">Yard Stock Status Analysis</h3>
                <p className="text-[11px] text-[#6B665F]">Availability, bookings &amp; completed sales</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF3EB] text-[#2E7D32] px-3 py-1 rounded-full border border-[#C8E0CD]">
              Live Status
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {statusItems.map((st, idx) => {
              const pct = Math.round((st.count / totalCount) * 100);
              return (
                <div key={st.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111111] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                      {st.label}
                    </span>
                    <span className="font-bold text-[#111111]">
                      {st.count} <span className="text-[#8C857B] font-medium">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F5F1EB] rounded-full overflow-hidden border border-[#E3DBD0]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: st.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.75, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] flex items-center justify-between text-xs">
            <span className="text-[#6B665F] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              Average Vehicle Price
            </span>
            <span className="font-heading font-black text-sm text-[#111111]">
              {formatINR(Math.round(totalValue / totalCount))}
            </span>
          </div>
        </SpotlightCard>
      </div>

      {/* Row 2: Top Brands Column Chart & Lead Conversion Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Brands Column Chart */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E3DBD0] shadow-xs"
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#111111] text-sm">Inventory by Manufacturer / Brand</h3>
                <p className="text-[11px] text-[#6B665F]">Units stocked &amp; total valuation per brand</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-52 pt-4 pb-2 px-1">
            {topBrands.map((b, idx) => {
              const heightPct = Math.max(12, Math.round((b.count / maxBrandCount) * 100));
              return (
                <div key={b.brand} className="flex flex-col items-center justify-end h-full group">
                  <span className="text-[10px] font-black text-[#111111] mb-1">{b.count}</span>
                  <div className="w-full flex-1 flex items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-[#2E7D32] to-[#4ADE80] group-hover:from-[#1B5E20] group-hover:to-[#2E7D32] transition-colors relative shadow-xs"
                      title={`${b.brand}: ${b.count} units (${formatINR(b.value)})`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#6B665F] mt-2 truncate max-w-full text-center" title={b.brand}>
                    {b.brand}
                  </span>
                </div>
              );
            })}
          </div>
        </SpotlightCard>

        {/* Customer Enquiries & Quotations Funnel */}
        <SpotlightCard
          spotlightColor="rgba(46, 125, 50, 0.06)"
          className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center border border-[#C8E0CD]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Customer Lead Pipeline</h3>
                  <p className="text-[11px] text-[#6B665F]">Enquiries &amp; sell-quote conversions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Enquiries Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111111]">Enquiries ({enquiries.length})</span>
                  <span className="text-[10px] font-bold text-[#2E7D32]">{enqNew} New • {enqContacted} Contacted • {enqClosed} Closed</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#E3DBD0]">
                  <div style={{ width: `${(enqNew / enqTotal) * 100}%` }} className="bg-amber-500 h-full transition-all" />
                  <div style={{ width: `${(enqContacted / enqTotal) * 100}%` }} className="bg-blue-600 h-full transition-all" />
                  <div style={{ width: `${(enqClosed / enqTotal) * 100}%` }} className="bg-[#2E7D32] h-full transition-all" />
                </div>
              </div>

              {/* Quotations Bar */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E3DBD0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111111]">Valuations ({quotations.length})</span>
                  <span className="text-[10px] font-bold text-[#2E7D32]">{quotPending} Pending • {quotEval} Evaluated • {quotDeal} Deals</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#E3DBD0]">
                  <div style={{ width: `${(quotPending / quotTotal) * 100}%` }} className="bg-amber-500 h-full transition-all" />
                  <div style={{ width: `${(quotEval / quotTotal) * 100}%` }} className="bg-blue-600 h-full transition-all" />
                  <div style={{ width: `${(quotDeal / quotTotal) * 100}%` }} className="bg-[#2E7D32] h-full transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between text-xs">
            <span className="text-[#6B665F] font-medium">Total Active Leads</span>
            <span className="font-heading font-black text-base text-[#2E7D32]">
              {enquiries.length + quotations.length} Requests
            </span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
