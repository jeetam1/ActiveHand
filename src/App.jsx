import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickContactBar from './components/QuickContactBar';
import HomePage from './pages/Home/HomePage';
import InProgressPage from './components/InProgressPage';
import './styles/global.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar activePage={currentPage} onNavigate={handleNavigate} />

      {/* Dynamic Page View */}
      {currentPage === 'home' ? (
        <HomePage onNavigate={handleNavigate} />
      ) : (
        <InProgressPage pageName={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Brand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp & Back to Top helpers */}
      <QuickContactBar />
    </div>
  );
}
