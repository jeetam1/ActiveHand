import React, { useState } from 'react';
import { X, ShoppingBag, Star, CheckCircle, ShieldCheck, Video, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/modals.css';

export default function QuickViewModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="auth-modal-close" 
          style={{ top: 12, right: 12, zIndex: 10 }}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Product Image Side */}
        <div className="quickview-img-box">
          <img src={product.img} alt={product.title} className="quickview-img" />
        </div>

        {/* Product Details Side */}
        <div className="quickview-info">
          <div>
            <span style={{ background: '#FFF0EB', color: '#ED612B', fontFamily: 'var(--font-hand)', fontSize: '0.9rem', fontWeight: 800, padding: '3px 10px', borderRadius: 12 }}>
              {product.tag || '⭐ ALL-IN-ONE KIT'}
            </span>

            <h2 className="quickview-title" style={{ marginTop: 8 }}>{product.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#FFB800" color="#FFB800" />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: '#718096', fontWeight: 700 }}>
                {product.rating || '4.9'} ({product.reviews || 120} reviews)
              </span>
            </div>

            <span className="quickview-price">{product.price}</span>

            {/* Features */}
            <div className="quickview-features">
              <div className="quickview-feature-item">
                <CheckCircle size={16} color="#2A9D8F" />
                <span><strong>All Tools Included:</strong> No extra scissors or glue required</span>
              </div>
              <div className="quickview-feature-item">
                <ShieldCheck size={16} color="#00676A" />
                <span><strong>Age Group:</strong> Suitable for Ages 6 to Adult</span>
              </div>
              <div className="quickview-feature-item">
                <Video size={16} color="#ED612B" />
                <span><strong>Video Tutorial:</strong> Scan QR code for HD instructions</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.2rem', fontWeight: 700 }}>Quantity:</span>
              <div className="cart-qty-stepper" style={{ padding: '2px 4px' }}>
                <button className="cart-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span className="cart-qty-val">{qty}</span>
                <button className="cart-qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <button 
              className="shop-buy-btn" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.25rem', padding: '12px' }}
              onClick={handleAdd}
            >
              <ShoppingBag size={20} />
              <span>Add to Craft Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
