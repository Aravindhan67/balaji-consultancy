import React, { useState } from 'react';
import { MessageSquare, PhoneCall, X } from 'lucide-react';

export const WhatsAppPill = ({ phoneNumber = '918124336369', defaultMessage = 'Hello Balaji Consultancy, I want to enquire about certified second-hand tractors, cars and spare parts.' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const encodedMsg = encodeURIComponent(defaultMessage);
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-30 flex flex-col items-end">
      {/* Tooltip prompt */}
      {showTooltip && (
        <div className="mb-3 max-w-xs bg-white rounded-2xl shadow-xl border border-emerald-100 p-3.5 text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-emerald-800">Balaji Support Online</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Need quick quotation or want to sell your tractor/car? Chat directly with our vehicle consultant on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating CTA Buttons */}
      <div className="flex items-center gap-2">
        <a
          href={`tel:+${phoneNumber}`}
          className="w-12 h-12 bg-white text-emerald-800 border border-slate-200 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          title="Direct Call to Balaji Yard"
        >
          <PhoneCall className="w-5 h-5" />
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold text-sm group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#25D366]"></span>
          </div>
          <span className="hidden sm:inline">WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
};
