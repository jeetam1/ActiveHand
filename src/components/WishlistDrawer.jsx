import React from 'react';
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

export default function WishlistDrawer({ onNavigate }) {
  const { wishlist, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeWishlist}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-box">
            <Heart size={24} color="#ED612B" fill="#ED612B" />
            <h2 className="cart-drawer-title">Your Wishlist</h2>
            <span className="cart-drawer-count" style={{ background: '#FFF0EB', color: '#ED612B' }}>
              {wishlist.length}
            </span>
          </div>
          <button className="cart-drawer-close" onClick={closeWishlist} aria-label="Close Wishlist">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {wishlist.length === 0 ? (
            <div className="cart-empty-box">
              <Heart size={54} color="#CBD5E0" style={{ marginBottom: 16 }} />
              <h3 className="cart-empty-title">Your Wishlist is Empty</h3>
              <p className="cart-empty-text">
                Tap the heart on any craft kit to save your favorites for later!
              </p>
              <button 
                className="cart-empty-btn" 
                onClick={() => {
                  closeWishlist();
                  onNavigate?.('shop');
                }}
              >
                EXPLORE CRAFT KITS
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlist.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-img-box">
                    <img src={item.img} alt={item.title} className="cart-item-img" />
                  </div>
                  <div className="cart-item-info">
                    <div>
                      <h4 className="cart-item-title">{item.title}</h4>
                      <span className="cart-item-price">{item.price}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button 
                        className="shop-buy-btn"
                        style={{ padding: '6px 12px', fontSize: '0.95rem' }}
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Bag</span>
                      </button>

                      <button 
                        className="cart-remove-btn"
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
