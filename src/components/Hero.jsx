import React from 'react';
import '../styles/hero.css';

export default function Hero({ onShopClick }) {
  return (
    <section className="hero notebook-bg torn-bottom" id="home-hero">
      <div className="hero-wrap">
        {/* Left: Text Content */}
        <div className="hero-text">
          {/* Flying Paper Airplane Doodle with dotted trail */}
          <div className="hero-airplane-container">
            <img src="/assets/3.png" alt="Paper Airplane" className="hero-airplane" />
          </div>

          <h1 className="hero-title">
            <span>Build.</span>
            <span>Create.</span>
            <span className="hero-awesome">Be <em>Awesome!</em></span>
          </h1>

          <p className="hero-sub">
            DIY Kits that turn screen time<br />into creative time.
          </p>

          <div className="hero-cta-row">
            <button className="hero-btn" onClick={onShopClick}>
              EXPLORE KITS
            </button>
            <svg className="hero-btn-arrow" width="32" height="18" viewBox="0 0 32 18" fill="none" stroke="#1A1A1A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="9" x2="28" y2="9" />
              <polyline points="20 2 28 9 20 16" />
            </svg>
          </div>
        </div>

        {/* Right: Main Hero Illustration */}
        <div className="hero-illustration">
          <img 
            src="/assets/12.png" 
            alt="Kid building DIY car with tools, glue, instructions, and speech bubble" 
            className="hero-scene-img" 
          />
        </div>
      </div>
    </section>
  );
}

