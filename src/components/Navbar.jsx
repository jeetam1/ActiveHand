import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/navbar.css';

export default function Navbar({ activePage = 'home', onNavigate, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, openAuth, openAccount } = useAuth();
  const { totalWishlist, openWishlist } = useWishlist();

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

  const handleUserClick = () => {
    if (user) {
      openAccount();
    } else {
      openAuth('login');
    }
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
          {/* Search Button */}
          <button className="nav-icon-btn search-btn" aria-label="Search" onClick={onOpenSearch}>
            <Search size={22} strokeWidth={2.1} />
          </button>

          {/* Wishlist Button */}
          <button className="nav-icon-btn cart-icon" aria-label="Wishlist" onClick={openWishlist}>
            <Heart size={23} strokeWidth={2.1} />
            {totalWishlist > 0 && (
              <span className="cart-count cart-count-active" style={{ background: '#E53E3E' }}>
                {totalWishlist}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          <button 
            className="nav-icon-btn user-icon" 
            aria-label="Account" 
            onClick={handleUserClick}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {user ? (
              <img 
                src={user.avatar || '/assets/4.png'} 
                alt={user.name} 
                style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #1A1A1A' }} 
              />
            ) : (
              <User size={23} strokeWidth={2.1} />
            )}
          </button>

          {/* Cart Bag Button */}
          <button className="nav-icon-btn cart-icon" aria-label="Cart" onClick={openCart}>
            <ShoppingBag size={24} strokeWidth={2.1} />
            <span className={`cart-count ${totalItems > 0 ? 'cart-count-active' : ''}`}>
              {totalItems}
            </span>
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

