import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/modals.css';

const productsCatalog = [
  { id: 1, title: 'Mosaic Art Tray Kit', price: '₹899.00', img: '/assets/b1.avif', category: 'Mosaic & Clay' },
  { id: 2, title: 'Book Binding DIY Kit', price: '₹799.00', img: '/assets/b2.avif', category: 'Paper Crafts' },
  { id: 3, title: 'Block Printing DIY Kit', price: '₹1099.00', img: '/assets/b3.avif', category: 'Traditional Crafts' },
  { id: 4, title: 'Hand-made Paper Making DIY Kit', price: '₹899.00', img: '/assets/b4.avif', category: 'Paper Crafts' },
  { id: 5, title: 'Weaving Loom DIY Kit', price: '₹899.00', img: '/assets/b5.avif', category: 'Traditional Crafts' },
  { id: 6, title: 'Dried Press Flower Kit', price: '₹699.00', img: '/assets/b6.avif', category: 'Botanical' },
  { id: 7, title: 'Paper Mache Clay DIY Kit', price: '₹699.00', img: '/assets/b7.avif', category: 'Sculpting' },
  { id: 8, title: 'Natural Soap Making Kit', price: '₹699.00', img: '/assets/b8.avif', category: 'Organic' },
  { id: 9, title: 'Paper Décor Making Kit', price: '₹699.00', img: '/assets/b9.avif', category: 'Origami' },
  { id: 10, title: 'Indigo Shibori Dyeing DIY Kit', price: '₹949.00', img: '/assets/b10.jpg', category: 'Traditional Crafts' },
  { id: 11, title: 'Natural Dye Bag: Manjistha', price: '₹799.00', img: '/assets/b2.avif', category: 'Traditional Crafts' },
  { id: 12, title: 'Bead Loom DIY Kit', price: '₹899.00', img: '/assets/b5.avif', category: 'Weaving' },
  { id: 13, title: 'Origami Cloth Bags Kit', price: '₹799.00', img: '/assets/b4.avif', category: 'Origami' },
];

export default function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' 
    ? productsCatalog.slice(0, 4) 
    : productsCatalog.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (product) => {
    addToCart(product);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={22} color="#00676A" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search DIY kits, origami, paper making..."
            className="search-modal-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="auth-modal-close" style={{ position: 'static' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-modal-body">
          <p style={{ fontFamily: 'var(--font-hand)', fontSize: '1.05rem', color: '#718096', marginBottom: 10 }}>
            {query.trim() === '' ? 'Popular Craft Kits' : `Found ${results.length} results`}
          </p>

          {results.map((prod) => (
            <div 
              key={prod.id} 
              className="search-result-item"
              onClick={() => handleSelect(prod)}
            >
              <img src={prod.img} alt={prod.title} className="search-result-img" />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#1A1A1A', margin: 0 }}>
                  {prod.title}
                </h4>
                <span style={{ fontSize: '0.85rem', color: '#718096' }}>{prod.category}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 800, color: '#00676A' }}>
                  {prod.price}
                </span>
                <button 
                  style={{ display: 'block', background: 'none', border: 'none', color: '#ED612B', fontFamily: 'var(--font-hand)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
