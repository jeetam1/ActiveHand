import React from 'react';
import '../styles/products.css';

const kits = [
  {
    id: 'birdhouse',
    img: '/assets/a1.png',
    title: 'Bird House DIY Kit',
    price: '₹699',
    hasCornerStar: true,
  },
  {
    id: 'ballooncar',
    img: '/assets/a2.png',
    title: 'Balloon Car DIY Kit',
    price: '₹649',
    hasCornerStar: false,
  },
  {
    id: 'camera',
    img: '/assets/a3.png',
    title: 'Camera DIY Kit',
    price: '₹549',
    hasCornerStar: true,
  },
  {
    id: 'monsterpen',
    img: '/assets/a4.png',
    title: 'Monster Pen Stand DIY Kit',
    price: '₹499',
    hasLightning: true,
  },
];

export default function NewArrivals({ onShopClick }) {
  return (
    <section className="kits" id="popular-kits">
      {/* Decorative Star Doodles outside the grid */}
      <img src="/assets/star.png" alt="" className="kits-outer-star-left" />

      <div className="kits-inner">
        {/* Title with decorative elements */}
        <div className="kits-header">
          <h2 className="kits-title">
            <span>Our Popular Kits</span>
            <span className="kits-title-dash">
              <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="12" x2="28" y2="12" />
                <line x1="8" y1="8" x2="25" y2="5" />
                <line x1="8" y1="16" x2="25" y2="19" />
              </svg>
            </span>
          </h2>

          {/* Floating Pencil doodle on right */}
          <img src="/assets/pencil_doodle.png" alt="Pencil Doodle" className="kits-pencil" />
        </div>

        {/* Product Cards Grid */}
        <div className="kits-grid">
          {kits.map((kit, i) => (
            <div 
              key={kit.id} 
              className={`kit-card kit-card-${i % 2 === 0 ? 'even' : 'odd'}`}
              onClick={onShopClick}
            >
              {/* Orange Tape strip */}
              <div className="kit-tape" />

              {/* Lightning doodle above Monster Pen Stand */}
              {kit.hasLightning && (
                <svg className="kit-lightning" width="22" height="30" viewBox="0 0 24 32" fill="none" stroke="#1A1A1A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 17 12 17 11 30 21 15 12 15 13 2" />
                </svg>
              )}
              
              {/* Product image area */}
              <div className="kit-img-box">
                <img src={kit.img} alt={kit.title} className="kit-img" />
              </div>
              
              {/* Info */}
              <h3 className="kit-name">
                {kit.title.split(' DIY Kit')[0]}<br />
                <span className="kit-diy-sub">DIY Kit</span>
              </h3>
              <span className="kit-price">{kit.price}</span>
              
              {/* Small star in bottom right corner */}
              {kit.hasCornerStar && (
                <img src="/assets/star.png" alt="" className="kit-star-corner" />
              )}
            </div>
          ))}
        </div>

        {/* View All button */}
        <div className="kits-cta">
          <button className="kits-btn" onClick={onShopClick}>
            <span>VIEW ALL KITS</span>
            <svg width="22" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="8" x2="21" y2="8" />
              <polyline points="15 2 21 8 15 14" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

