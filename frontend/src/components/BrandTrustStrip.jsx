import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

export function BrandTrustStrip() {
  const brands = [
    { name: 'Mahindra', type: 'Tractors & Bolero' },
    { name: 'Swaraj', type: 'Agricultural Tractors' },
    { name: 'John Deere', type: 'Heavy Duty Green Tech' },
    { name: 'Massey Ferguson', type: 'High Mileage Tractors' },
    { name: 'Sonalika', type: 'Sikander Series' },
    { name: 'Maruti Suzuki', type: 'Utility & Fleet Cars' },
    { name: 'Tata Motors', type: 'Commercial Vehicles' },
    { name: 'Toyota', type: 'Innova & Utility' },
    { name: 'Bosch India', type: 'Genuine CRDI Spares' },
    { name: 'Exide', type: 'Heavy Tractor Batteries' }
  ];

  return (
    <div className="py-6 border-y border-slate-200/80 bg-white/70 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Multi-Brand Hub</div>
              <div className="text-xs font-black text-slate-900">Supported Manufacturers</div>
            </div>
          </div>

          {/* Brand Pills Row */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1 w-full md:w-auto">
            {brands.map((b) => (
              <div
                key={b.name}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-xs flex items-center gap-2 shadow-sm"
              >
                <span className="font-extrabold text-slate-800">{b.name}</span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">• {b.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
