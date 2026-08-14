import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickContactBar from './components/QuickContactBar';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import AccountDrawer from './components/AccountDrawer';
import SearchModal from './components/SearchModal';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import AboutUsPage from './pages/AboutUs/AboutUsPage';
import FAQPage from './pages/FAQ/FAQPage';
import PolicyPage from './pages/Policy/PolicyPage';
import WorkshopsPage from './pages/Workshops/WorkshopsPage';
import InProgressPage from './components/InProgressPage';
import './styles/global.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Handle URL hash changes for seamless client-side routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'shop', 'workshops', 'about-us', 'faq', 'policy'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'shop':
        return (
          <ShopPage 
            onNavigate={handleNavigate} 
            onOpenQuickView={(prod) => setQuickViewProduct(prod)}
          />
        );
      case 'about-us':
        return <AboutUsPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'policy':
        return <PolicyPage onNavigate={handleNavigate} />;
      case 'workshops':
        return <WorkshopsPage onNavigate={handleNavigate} />;
      default:
        return <InProgressPage pageName={currentPage} onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="app-layout">
            {/* Top Navbar */}
            <Navbar 
              activePage={currentPage} 
              onNavigate={handleNavigate} 
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Dynamic Page View */}
            {renderPage()}

            {/* Brand Footer */}
            <Footer onNavigate={handleNavigate} />

            {/* Floating WhatsApp & Back to Top helpers */}
            <QuickContactBar />

            {/* Slide-out Cart Drawer */}
            <CartDrawer 
              onNavigate={handleNavigate} 
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* Slide-out Wishlist Drawer */}
            <WishlistDrawer onNavigate={handleNavigate} />

            {/* Authentication Modal (Sign In / Sign Up) */}
            <AuthModal />

            {/* Account / User Profile Drawer */}
            <AccountDrawer />

            {/* Live Search Modal */}
            <SearchModal 
              isOpen={isSearchOpen} 
              onClose={() => setIsSearchOpen(false)}
              onNavigate={handleNavigate}
            />

            {/* Product Quick View Modal */}
            <QuickViewModal 
              product={quickViewProduct} 
              onClose={() => setQuickViewProduct(null)}
            />

            {/* Checkout & Order Confirmation Modal */}
            <CheckoutModal 
              isOpen={isCheckoutOpen} 
              onClose={() => setIsCheckoutOpen(false)}
            />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
