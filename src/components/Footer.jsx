import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import '../styles/footer.css';

export default function Footer({ onNavigate }) {
  const nav = (page, e) => {
    if (e) e.preventDefault();
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="foot">
      <div className="foot-inner">
        {/* Col 1: Logo + mascot */}
        <div className="foot-brand">
          <img 
            src="/assets/9.png" 
            alt="Active Hands DIY Kit" 
            className="foot-brand-img" 
          />
        </div>

        {/* Col 2: Quick Links */}
        <div className="foot-col">
          <h4 className="foot-heading">QUICK LINKS</h4>
          <a href="#shop" onClick={(e) => nav('shop', e)}>Shop All Kits</a>
          <a href="#workshops" onClick={(e) => nav('workshops', e)}>How It Works</a>
          <a href="#about-us" onClick={(e) => nav('about-us', e)}>About Us</a>
          <a href="#policy" onClick={(e) => nav('policy', e)}>Contact Us</a>
        </div>

        {/* Col 3: Help */}
        <div className="foot-col">
          <h4 className="foot-heading">HELP</h4>
          <a href="#faq" onClick={(e) => nav('faq', e)}>FAQs</a>
          <a href="#policy" onClick={(e) => nav('policy', e)}>Shipping & Delivery</a>
          <a href="#policy" onClick={(e) => nav('policy', e)}>Returns & Refunds</a>
          <a href="#policy" onClick={(e) => nav('policy', e)}>Terms & Conditions</a>
        </div>

        {/* Col 4: Social + reading mascot */}
        <div className="foot-social">
          <h4 className="foot-heading">FOLLOW US</h4>
          <div className="foot-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="foot-icon-circle" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="foot-icon-circle" aria-label="Facebook">
              <Facebook size={17} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="foot-icon-circle" aria-label="YouTube">
              <Youtube size={17} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="foot-icon-circle" aria-label="Pinterest">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.8-.17-2.04.04-2.92.19-.8 1.22-5.18 1.22-5.18s-.31-.62-.31-1.54c0-1.45.84-2.53 1.89-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.89 1.55 1.89 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.25-4.37-4.25-2.98 0-4.73 2.23-4.73 4.54 0 .9.35 1.86.78 2.39.09.11.1.2.07.31-.08.31-.25 1.04-.29 1.19-.05.19-.16.23-.36.14-1.34-.62-2.18-2.58-2.18-4.15 0-3.38 2.46-6.49 7.09-6.49 3.72 0 6.62 2.65 6.62 6.2 0 3.7-2.33 6.67-5.57 6.67-1.09 0-2.11-.57-2.46-1.23l-.67 2.55c-.24.93-.89 2.1-1.33 2.81.99.31 2.05.47 3.14.47 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
          
          <img 
            src="/assets/footer_kid.png" 
            alt="Kid reading a book" 
            className="foot-reader" 
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="foot-copy">
        <p>© 2024 Active Hands DIY Kit. All rights reserved.</p>
      </div>
    </footer>
  );
}

