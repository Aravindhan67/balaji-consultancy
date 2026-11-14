import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Fuel, Calendar, Gauge, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const ProductCard = ({ product }) => {
  const {
    _id,
    title,
    category,
    brand,
    modelYear,
    price,
    condition,
    kmOrHours,
    fuelType,
    rtoPassing,
    hpPower,
    images = [],
    featured
  } = product;

  const imageUrl = images && images.length > 0 ? images[0] : '/uploads/tractor-mahindra-575.jpg';

  const categoryLabel = 
    category === 'tractor' ? 'Tractor' : 
    category === 'car' ? 'Car' : 'Spare Part';

  // Humanable distinct category badges
  const categoryColor =
    category === 'tractor' ? 'bg-amber-50 text-amber-800 border-amber-200' :
    category === 'car' ? 'bg-blue-50 text-blue-800 border-blue-200' :
    'bg-emerald-50 text-emerald-800 border-emerald-200';

  const waMessage = encodeURIComponent(
    `Hello Balaji Consultancy! I am interested in: ${title} (${formatINR(price, false)}). Is it currently available for inspection?`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Floating Tags */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient shadow for clear badge contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 to-transparent pointer-events-none"></div>

        {/* Status / Featured Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryColor}`}>
            {categoryLabel}
          </span>
          {featured && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black shadow-sm">
              ★ Featured
            </span>
          )}
        </div>

        {/* Condition Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[11px] font-bold bg-white/95 backdrop-blur text-slate-800 px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
            {condition || 'Certified'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Brand, Year & 120-Pt Inspection Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span className="font-bold text-slate-800">{brand}</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                120-Pt Verified
              </span>
              {modelYear && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {modelYear}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/products/${_id}`} className="block">
            <h3 className="font-heading font-extrabold text-slate-900 text-base group-hover:text-orange-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Specs Snippets */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {kmOrHours && (
              <div className="flex items-center gap-1.5 truncate">
                <Gauge className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{kmOrHours}</span>
              </div>
            )}
            {hpPower && (
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-3.5 h-3.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 border border-amber-200">
                  HP
                </span>
                <span className="truncate">{hpPower}</span>
              </div>
            )}
            {fuelType && (
              <div className="flex items-center gap-1.5 truncate">
                <Fuel className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{fuelType}</span>
              </div>
            )}
            {rtoPassing && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{typeof rtoPassing === 'string' ? rtoPassing.split(' ')[0] : rtoPassing}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Fixed Best Price</div>
            <div className="font-heading font-extrabold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
              {formatINR(price)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/918124336369?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100"
              title="Quick WhatsApp Enquiry"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            
            <Link
              to={`/products/${_id}`}
              className="inline-flex items-center gap-1 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
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
