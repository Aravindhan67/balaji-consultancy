import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export function App() {
  // Only display preloader on first session visit to prevent reload lockups
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('balaji_visited');
  });
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const handleFinishPreloader = () => {
    try {
      sessionStorage.setItem('balaji_visited', 'true');
    } catch (e) {
      // ignore storage errors in restricted contexts
    }
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        {loading && <Preloader onFinish={handleFinishPreloader} />}
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-600 selection:text-white">
            {/* Top Navbar */}
            <Navbar onOpenSideDrawer={() => setSideDrawerOpen(true)} />

            {/* Mobile Side Drawer (Slide-over from left) */}
            <MobileSideDrawer 
              isOpen={sideDrawerOpen} 
              onClose={() => setSideDrawerOpen(false)} 
            />

            {/* Main Content with bottom padding for mobile bottom bar */}
            <main className="flex-1 pb-16 lg:pb-0">
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

            {/* Footer */}
            <Footer />

            {/* Floating WhatsApp Action Pill */}
            <WhatsAppPill phoneNumber="918124336369" />

            {/* Mobile App-like Bottom Navigation Bar */}
            <MobileBottomNav onOpenSideDrawer={() => setSideDrawerOpen(true)} />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
