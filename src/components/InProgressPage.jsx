import React from 'react';
import '../styles/inprogress.css';

export default function InProgressPage({ pageName = 'This Page', onNavigate }) {
  const getPageTitle = () => {
    switch (pageName) {
      case 'shop': return 'Shop All Kits';
      case 'workshops': return 'DIY Workshops & How It Works';
      case 'about-us': return 'About Active Hands';
      case 'faq': return 'Frequently Asked Questions';
      case 'policy': return 'Customer Help & Policies';
      default: return 'Page';
    }
  };

  return (
    <div className="in-progress-page notebook-bg">
      <div className="in-progress-inner">
        {/* Playful Floating Paper Airplane */}
        <img 
          src="/assets/3.png" 
          alt="Paper Airplane" 
          className="in-progress-airplane" 
        />

        {/* Builder Mascot */}
        <div className="in-progress-mascot-wrap">
          <img 
            src="/assets/12.png" 
            alt="Active Hands Builder" 
            className="in-progress-mascot" 
          />
          <div className="in-progress-tape" />
        </div>

        {/* Text Content */}
        <div className="in-progress-content">
          <div className="in-progress-badge">UNDER CONSTRUCTION 🛠️</div>
          
          <h1 className="in-progress-title">
            <span>{getPageTitle()}</span>
            <span className="in-progress-sub">Is In Progress!</span>
          </h1>

          <p className="in-progress-desc">
            Our little builders are actively handcrafting this section with exciting new DIY kits, 
            creative guides, and hands-on fun. Check back very soon!
          </p>

          {/* Action Button to Return Home */}
          <div className="in-progress-actions">
            <button 
              className="in-progress-btn" 
              onClick={() => onNavigate?.('home')}
            >
              <span>BACK TO HOME</span>
              <svg width="22" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="8" x2="21" y2="8" />
                <polyline points="15 2 21 8 15 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative Star */}
        <img 
          src="/assets/star.png" 
          alt="" 
          className="in-progress-star" 
        />
      </div>
    </div>
  );
}
