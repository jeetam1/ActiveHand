import React from 'react';
import '../styles/features.css';

const features = [
  {
    id: 'creativity',
    img: '/assets/4.png',
    title: 'Boost Creativity',
    desc: 'Fun projects that spark imagination and original thinking.',
  },
  {
    id: 'confidence',
    img: '/assets/5.png',
    title: 'Build Confidence',
    desc: 'Hands-on making gives kids a sense of achievement.',
  },
  {
    id: 'screenfree',
    img: '/assets/6.png',
    title: 'Screen-Free Fun',
    desc: 'Engaging activities that keep kids away from screens.',
  },
  {
    id: 'explore',
    img: '/assets/7.png',
    title: 'Learn & Explore',
    desc: 'Learn new skills while exploring the world around them.',
  },
];

export default function Features() {
  return (
    <section className="feat" id="features">
      <div className="feat-inner">
        {/* Section title with hand-drawn 3 dashes on both sides */}
        <h2 className="feat-heading">
          <span className="feat-dash feat-dash-left">
            <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="12" x2="28" y2="12" />
              <line x1="8" y1="5" x2="25" y2="8" />
              <line x1="8" y1="19" x2="25" y2="16" />
            </svg>
          </span>
          <span>Why <span className="feat-orange">Active Hands</span> DIY Kits?</span>
          <span className="feat-dash feat-dash-right">
            <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
              <line x1="6" y1="12" x2="30" y2="12" />
              <line x1="9" y1="8" x2="26" y2="5" />
              <line x1="9" y1="16" x2="26" y2="19" />
            </svg>
          </span>
        </h2>

        {/* 4 columns */}
        <div className="feat-grid">
          {features.map((f, i) => (
            <React.Fragment key={f.id}>
              <div className="feat-col">
                <div className="feat-img-wrap">
                  <img src={f.img} alt={f.title} className="feat-mascot" />
                </div>
                <p className="feat-desc">{f.desc}</p>
              </div>
              {i < features.length - 1 && <div className="feat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

