import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Fuel, Calendar, Gauge, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { resolveImageUrl } from '../utils/imageUrl';

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    _id,
    title = '',
    category = 'tractor',
    brand = '',
    modelYear,
    price = 0,
    condition,
    kmOrHours,
    fuelType,
    rtoPassing,
    hpPower,
    images = [],
    featured
  } = product;

  const getDefaultFallbackImage = () => {
    if (category === 'tractor') {
      const lowerTitle = ((title || '') + ' ' + (brand || '')).toLowerCase();
      if (lowerTitle.includes('john deere')) return '/static-uploads/tractor-john-deere-5050.jpg';
      if (lowerTitle.includes('swaraj')) return '/static-uploads/tractor-swaraj-855.jpg';
      if (lowerTitle.includes('massey')) return '/static-uploads/tractor-massey-241.jpg';
      if (lowerTitle.includes('sonalika')) return '/static-uploads/tractor-sonalika-745.jpg';
      if (lowerTitle.includes('eicher')) return '/static-uploads/tractor-eicher-380.jpg';
      return '/static-uploads/tractor-mahindra-575.jpg';
    }
    if (category === 'car') {
      const lowerTitle = ((title || '') + ' ' + (brand || '')).toLowerCase();
      if (lowerTitle.includes('swift')) return '/static-uploads/car-maruti-swift.jpg';
      if (lowerTitle.includes('i20')) return '/static-uploads/car-hyundai-i20.jpg';
      if (lowerTitle.includes('nexon')) return '/static-uploads/car-tata-nexon.jpg';
      if (lowerTitle.includes('innova')) return '/static-uploads/car-toyota-innova.jpg';
      return '/static-uploads/car-mahindra-bolero.jpg';
    }
    return '/static-uploads/part-clutch-plate.jpg';
  };

  const rawImage = images && images.length > 0 ? images[0] : getDefaultFallbackImage();
  const imageUrl = resolveImageUrl(rawImage);

  const categoryLabel = 
    category === 'tractor' ? 'Tractor' : 
    category === 'car' ? 'Car' : 'Spare Part';

  // Humanable distinct category badges
  const categoryColor =
    category === 'tractor' ? 'bg-amber-50 text-amber-800 border-amber-200' :
    category === 'car' ? 'bg-blue-50 text-blue-800 border-blue-200' :
    'bg-emerald-50 text-emerald-800 border-emerald-200';

  const waMessage = encodeURIComponent(
    `Hello Balaji Consultancy! I am interested in: ${title} (${hpPower ? hpPower + ' • ' : ''}${formatINR(price, false)}). Is it currently available for inspection at your yard?`
  );

  return (
    <div className="taste-card group bg-white rounded-2xl overflow-hidden border border-[#E3DBD0] flex flex-col justify-between transition-all duration-200 hover:border-[#111111]">
      {/* Top Image */}
      <div className="taste-zoom relative aspect-[16/10] bg-[#FAF8F5]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const fallback = resolveImageUrl(getDefaultFallbackImage());
            if (e.target.src !== fallback) {
              e.target.src = fallback;
            }
          }}
        />
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand, Year & 120-Pt Inspection Header */}
          <div className="flex items-center justify-between text-xs text-[#6B665F] mb-2 font-medium">
            <span className="font-bold text-[#111111] uppercase tracking-wider text-[11px]">{brand}</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] bg-[#EAF3EB] px-2.5 py-0.5 rounded-full border border-[#C8E0CD]">
                <ShieldCheck className="w-3 h-3 text-[#2E7D32]" />
                Auto &amp; Agro Verified
              </span>
              {modelYear && (
                <span className="flex items-center gap-1 text-[#6B665F] text-xs">
                  <Calendar className="w-3 h-3 text-[#6B665F]" />
                  {modelYear}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/products/${_id}`} className="block">
            <h3 className="font-heading font-bold text-[#111111] text-base group-hover:text-[#6B665F] transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Specs Snippets */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F0EBE3] text-xs text-[#6B665F]">
            {kmOrHours && (
              <div className="flex items-center gap-1.5 truncate">
                <Gauge className="w-3.5 h-3.5 text-[#6B665F] flex-shrink-0" />
                <span className="truncate">{kmOrHours}</span>
              </div>
            )}
            {hpPower && (
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-4 h-4 rounded-full bg-[#FAF8F5] text-[#111111] text-[9px] font-bold flex items-center justify-center flex-shrink-0 border border-[#E3DBD0]">
                  HP
                </span>
                <span className="truncate">{hpPower}</span>
              </div>
            )}
            {fuelType && (
              <div className="flex items-center gap-1.5 truncate">
                <Fuel className="w-3.5 h-3.5 text-[#6B665F] flex-shrink-0" />
                <span className="truncate">{fuelType}</span>
              </div>
            )}
            {rtoPassing && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#6B665F] flex-shrink-0" />
                <span className="truncate">{typeof rtoPassing === 'string' ? rtoPassing.split(' ')[0] : rtoPassing}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C857B] block">Direct Yard Price</span>
            <div className="font-heading font-extrabold text-lg text-[#111111]">
              {formatINR(price)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/918124336369?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="taste-btn p-2 rounded-full bg-[#FAF8F5] text-[#111111] hover:bg-[#2E7D32] hover:text-white border border-[#E3DBD0] hover:border-[#2E7D32] transition-colors"
              title="Quick WhatsApp Enquiry"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
            
            <Link
              to={`/products/${_id}`}
              className="taste-btn inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#2E7D32] hover:bg-[#236628] text-white px-4 py-2 rounded-full shadow-none"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
