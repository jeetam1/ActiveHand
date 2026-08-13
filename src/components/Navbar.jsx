import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({ activePage = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (page, e) => {
    if (e) e.preventDefault();
    onNavigate?.(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { id: 'home', label: 'HOME' },
    { id: 'about-us', label: 'ABOUT US' },
    { id: 'shop', label: 'SHOP', hasDropdown: true },
    { id: 'workshops', label: 'HOW IT WORKS' },
    { id: 'faq', label: 'BLOG' },
    { id: 'policy', label: 'CONTACT' },
  ];

  return (
    <header className={`nav-bar ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo */}
        <a href="#" className="nav-logo" onClick={(e) => nav('home', e)}>
          <img src="/assets/2.png" alt="ACTIVE HANDS DIY KIT" className="nav-logo-img" />
        </a>

        {/* Desktop Links */}
        <nav className="nav-links">
          {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav-link ${activePage === l.id ? 'nav-active' : ''}`}
              onClick={(e) => nav(l.id, e)}
            >
              {l.label}
              {l.hasDropdown && <ChevronDown size={16} style={{ marginLeft: 5 }} />}
            </a>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="nav-icons">
          <button className="nav-icon-btn user-icon" aria-label="Account">
            <User size={24} strokeWidth={2.1} />
          </button>
          <button className="nav-icon-btn cart-icon" aria-label="Cart" onClick={() => nav('shop')}>
            <ShoppingBag size={24} strokeWidth={2.1} />
            <span className="cart-count">0</span>
          </button>
          <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} className="nav-mobile-link" onClick={(e) => nav(l.id, e)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

