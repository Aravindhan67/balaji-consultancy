import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check, Languages } from 'lucide-react';

export const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌾', badge: 'Tamil Nadu' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', badge: 'National' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🌾' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🌾' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🌾' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🌾' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🌾' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🌾' }
];

export const setSiteLanguage = (langCode) => {
  const cookieValue = `/en/${langCode}`;
  const domain = window.location.hostname;
  const expires = 'expires=Fri, 31 Dec 2030 23:59:59 GMT;';

  // Set cookie for current host, domain, and root path
  document.cookie = `googtrans=${cookieValue}; path=/; ${expires}`;
  if (domain !== 'localhost' && domain !== '127.0.0.1') {
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; ${expires}`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain}; ${expires}`;
  }

  // Update Google Translate combo box if present in DOM
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    window.location.reload();
  }
};

export const GoogleTranslate = ({ variant = 'topbar', className = '' }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync current language from cookies
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z_-]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    setCurrentLang(code);
    setDropdownOpen(false);
    setSiteLanguage(code);
  };

  const activeLang = INDIAN_LANGUAGES.find((l) => l.code === currentLang) || {
    code: currentLang,
    name: currentLang.toUpperCase(),
    native: currentLang.toUpperCase()
  };

  // Top Announcement Bar Variant
  if (variant === 'topbar') {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`} ref={dropdownRef}>
        {/* Direct Google Translate Element Container */}
        <div id="google_translate_element" className="inline-block" />

        {/* Quick Language Dropdown Pill */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="taste-btn inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/25 transition-all cursor-pointer backdrop-blur-xs"
          title="Translate Website (Google Translate)"
          aria-expanded={dropdownOpen}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-200" />
          <span className="font-semibold">{activeLang.native || activeLang.name}</span>
          <ChevronDown className={`w-3 h-3 text-emerald-200 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E3DBD0] p-3.5 text-[#111111] z-50 text-left animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#F0EBE3]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Languages className="w-4 h-4 text-[#2E7D32]" />
                <span>Language / மொழி</span>
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] bg-[#EAF3EB] px-2 py-0.5 rounded-full border border-[#C8E0CD]">
                Google Translate
              </span>
            </div>

            <p className="text-[11px] text-[#6B665F] mb-2 leading-tight">
              Read all tractor specs, prices, and certificates in your regional language.
            </p>

            {/* Quick Regional Indian Languages */}
            <div className="grid grid-cols-2 gap-1.5 mb-3 max-h-56 overflow-y-auto pr-1">
              {INDIAN_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                    currentLang === l.code
                      ? 'bg-[#EAF3EB] text-[#2E7D32] font-bold border-[#C8E0CD]'
                      : 'bg-[#FAF8F5] hover:bg-[#F0EBE3] text-[#111111] border-[#E3DBD0]'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-bold block leading-tight">{l.native}</span>
                    <span className="text-[10px] text-[#8C857B]">{l.name}</span>
                  </div>
                  {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 ml-1" />}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F0EBE3] text-[10px] text-[#8C857B] text-center">
              Powered by Google Translate • 100+ World Languages Supported
            </div>
          </div>
        )}
      </div>
    );
  }

  // Navbar CTA Variant
  if (variant === 'navbar') {
    return (
      <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="taste-btn flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#2E7D32] bg-[#FAF8F5] hover:bg-[#EAF3EB] px-3 py-2 rounded-full border border-[#E3DBD0] hover:border-[#2E7D32] transition-all cursor-pointer"
          title="Translate Website / மொழி"
        >
          <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>{activeLang.native}</span>
          <ChevronDown className="w-3 h-3 text-[#8C857B]" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E3DBD0] p-3 text-[#111111] z-50 text-left">
            <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#2E7D32]" />
              <span>Choose Language / மொழி</span>
            </div>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
              {INDIAN_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    currentLang === l.code ? 'bg-[#EAF3EB] text-[#2E7D32] font-bold' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="font-semibold block">{l.native}</span>
                  <span className="text-[10px] text-[#8C857B]">{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Drawer Variant
  return (
    <div className={`p-4 bg-white rounded-2xl border border-[#E3DBD0] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EAF3EB] text-[#2E7D32] flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#111111]">Translate Website</div>
            <div className="text-[10px] text-[#6B665F]">Google மொழி மாற்றம்</div>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3EB] text-[#2E7D32] border border-[#C8E0CD]">
          {activeLang.native}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {INDIAN_LANGUAGES.slice(0, 6).map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => handleLanguageChange(l.code)}
            className={`text-left px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
              currentLang === l.code
                ? 'bg-[#2E7D32] text-white font-bold border-[#2E7D32]'
                : 'bg-[#FAF8F5] text-[#111111] border-[#E3DBD0] hover:border-[#2E7D32]'
            }`}
          >
            <span className="block font-semibold">{l.native}</span>
            <span className="block text-[10px] opacity-75">{l.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
