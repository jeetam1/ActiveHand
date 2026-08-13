import React, { useState } from 'react';
import '../styles/newsletter.css';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email) {
      setDone(true);
      setEmail('');
    }
  };

  return (
    <section className="banner torn-top">
      <div className="banner-inner">
        {/* Left: Megaphone mascot */}
        <div className="banner-mascot">
          <img 
            src="/assets/8.png" 
            alt="Active Hands kid shouting with megaphone" 
            className="banner-mascot-img" 
          />
        </div>

        {/* Center: Headline with hand-drawn star & underline rays */}
        <div className="banner-text">
          <svg className="banner-star-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
            <polygon points="14,2 17,9 25,10 19,16 21,24 14,19 7,24 9,16 3,10 11,9" />
          </svg>

          <p className="banner-line1">Making Learning</p>
          <div className="banner-line2-wrap">
            <p className="banner-line2">Seriously Fun!</p>
            {/* Doodle rays under Seriously Fun! */}
            <svg className="banner-rays-svg" width="130" height="20" viewBox="0 0 130 20" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round">
              <path d="M4 14 L32 17" />
              <path d="M42 16 L88 17" />
              <path d="M96 16 L124 14" />
            </svg>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="banner-divider" />

        {/* Right: Newsletter Signup */}
        <div className="banner-form-area">
          <h3 className="banner-form-title">STAY IN THE LOOP!</h3>
          <p className="banner-form-desc">Get updates on new kits, offers & fun ideas.</p>
          
          {done ? (
            <div className="banner-success">
              <span>✓ Thanks for subscribing! Check your inbox soon.</span>
            </div>
          ) : (
            <form className="banner-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="banner-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="banner-submit">
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

