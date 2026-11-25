import React from 'react';
import './BrandMarquee.css';

const DEFAULT_BRANDS = [
  { name: 'Mahindra Tractors', category: 'Tractors', icon: '🚜' },
  { name: 'Swaraj 855 / 744', category: 'Tractors', icon: '🌾' },
  { name: 'John Deere PowerTech', category: 'Tractors', icon: '🚜' },
  { name: 'Sonalika Sikander', category: 'Tractors', icon: '⚙️' },
  { name: 'Eicher Air Cooled', category: 'Tractors', icon: '🚜' },
  { name: 'Mahindra Bolero Maxi Truck', category: 'Utility Cars', icon: '🚗' },
  { name: 'Maruti Suzuki Commercial', category: 'Utility Cars', icon: '🚙' },
  { name: 'Tata Ace & Xenon', category: 'Pickup Trucks', icon: '🚚' },
  { name: 'Bosch CRDI Injectors', category: 'Genuine OEM', icon: '🔧' },
  { name: 'Exide Heavy Batteries', category: 'Direct Yard Stock', icon: '⚡' }
];

/**
 * BrandMarquee from 21st.dev / React Bits
 * Continuous horizontal ticker with side fade gradients and pause on hover.
 */
export const BrandMarquee = ({
  items = DEFAULT_BRANDS,
  speed = 35,
  className = ''
}) => {
  return (
    <div className={`marquee-container marquee-mask py-4 ${className}`} style={{ '--marquee-duration': `${speed}s` }}>
      <div className="marquee-content">
        {items.map((brand, idx) => (
          <div
            key={`brand-1-${idx}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xs border border-[#E3DBD0] text-[#111111] shrink-0 shadow-xs hover:border-[#111111] transition-colors"
          >
            <span className="text-base">{brand.icon}</span>
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider">{brand.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
            <span className="text-[10px] text-[#6B665F] font-semibold">{brand.category}</span>
          </div>
        ))}
      </div>

      <div className="marquee-content" aria-hidden="true">
        {items.map((brand, idx) => (
          <div
            key={`brand-2-${idx}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xs border border-[#E3DBD0] text-[#111111] shrink-0 shadow-xs hover:border-[#111111] transition-colors"
          >
            <span className="text-base">{brand.icon}</span>
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider">{brand.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
            <span className="text-[10px] text-[#6B665F] font-semibold">{brand.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
