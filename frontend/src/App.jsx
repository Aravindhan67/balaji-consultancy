import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppPill } from './components/WhatsAppPill';
import { ScrollToTop } from './components/ScrollToTop';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSideDrawer } from './components/MobileSideDrawer';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Quotation } from './pages/Quotation';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  // Is this an administrative route (/admin or /admin/login)?
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-600 selection:text-white">
      {/* Public Top Navbar - Hidden on Admin Portal */}
      {!isAdminRoute && (
        <Navbar onOpenSideDrawer={() => setSideDrawerOpen(true)} />
      )}

      {/* Public Mobile Drawer - Hidden on Admin Portal */}
      {!isAdminRoute && (
        <MobileSideDrawer 
          isOpen={sideDrawerOpen} 
          onClose={() => setSideDrawerOpen(false)} 
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${!isAdminRoute ? 'pb-16 lg:pb-0' : 'pb-6'}`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Public Footer - Hidden on Admin Portal */}
      {!isAdminRoute && <Footer />}

      {/* Floating WhatsApp Action Pill - Hidden on Admin Portal */}
      {!isAdminRoute && <WhatsAppPill phoneNumber="918124336369" />}

      {/* Mobile App-like Bottom Navigation Bar - Hidden on Admin Portal */}
      {!isAdminRoute && (
        <MobileBottomNav onOpenSideDrawer={() => setSideDrawerOpen(true)} />
      )}
    </div>
  );
}

export function App() {
  // Display preloader on initial load and every page refresh
  const [loading, setLoading] = useState(true);

  const handleFinishPreloader = () => {
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        {loading && <Preloader onFinish={handleFinishPreloader} />}
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
