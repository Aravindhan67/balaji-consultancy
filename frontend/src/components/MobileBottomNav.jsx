import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Layers, 
  FileText, 
  Phone, 
  Menu
} from 'lucide-react';

export const MobileBottomNav = ({ onOpenSideDrawer }) => {
  const location = useLocation();

  const isCurrent = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-1.5 px-3">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isCurrent('/') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${isCurrent('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">Home</span>
        </Link>

        {/* 2. Valuation / Sell */}
        <Link
          to="/quotation"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isCurrent('/quotation') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <FileText className={`w-5 h-5 ${isCurrent('/quotation') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">Valuation</span>
        </Link>

        {/* 3. Center Elevated Action: Stock (Inventory) */}
        <div className="flex flex-col items-center -mt-5">
          <Link
            to="/products"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white transform active:scale-95 transition-all ${
              isCurrent('/products')
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white ring-2 ring-orange-500/40 shadow-orange-600/40'
                : 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-600/30'
            }`}
            title="Browse Certified Vehicle & Spares Stock"
          >
            <Layers className="w-5 h-5 text-white stroke-[2.5]" />
          </Link>
          <span className="text-[10px] font-black text-orange-600 mt-1">Stock</span>
        </div>

        {/* 4. Contact */}
        <Link
          to="/contact"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isCurrent('/contact') ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Phone className={`w-5 h-5 ${isCurrent('/contact') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1">Contact</span>
        </Link>

        {/* 5. Side Menu Drawer Trigger */}
        <button
          onClick={onOpenSideDrawer}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-slate-900 font-medium transition-all"
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-1">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
