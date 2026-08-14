import React, { useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

export default function CartDrawer({ onNavigate, onOpenCheckout }) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    subtotal,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1499;
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    closeCart();
    onOpenCheckout?.();
  };

  const handleStartShopping = () => {
    closeCart();
    onNavigate?.('shop');
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-box">
            <ShoppingBag size={24} color="#00676A" strokeWidth={2.4} />
            <h2 className="cart-drawer-title">Your Craft Bag</h2>
            <span className="cart-drawer-count">{totalItems}</span>
          </div>
          <button className="cart-drawer-close" onClick={closeCart} aria-label="Close Bag">
            <X size={18} strokeWidth={2.6} />
          </button>
        </div>

        {/* Free Shipping Tier */}
        {cart.length > 0 && (
          <div className="cart-shipping-tier">
            <div className="cart-shipping-text">
              {amountNeeded > 0 ? (
                <>
                  <Sparkles size={16} color="#166534" />
                  <span>Add <strong>₹{amountNeeded.toFixed(0)}</strong> more for <strong>FREE Delivery!</strong></span>
                </>
              ) : (
                <>
                  <span>🎉 You've unlocked <strong>FREE Delivery across India!</strong></span>
                </>
              )}
            </div>
            <div className="cart-progress-bar">
              <div 
                className="cart-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-box">
              <img src="/assets/9.png" alt="Empty Bag" className="cart-empty-mascot" />
              <h3 className="cart-empty-title">Your Bag is Empty!</h3>
              <p className="cart-empty-text">
                Looks like you haven't added any creative DIY kits yet.
              </p>
              <button className="cart-empty-btn" onClick={handleStartShopping}>
                EXPLORE DIY KITS
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-img-box">
                    <img src={item.img} alt={item.title} className="cart-item-img" />
                  </div>
                  <div className="cart-item-info">
                    <div>
                      <h4 className="cart-item-title">{item.title}</h4>
                      <span className="cart-item-price">₹{(item.numericPrice * item.quantity).toFixed(2)}</span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-qty-stepper">
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease"
                        >
                          <Minus size={13} strokeWidth={2.8} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button 
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase"
                        >
                          <Plus size={13} strokeWidth={2.8} />
                        </button>
                      </div>

                      <button 
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{amountNeeded === 0 ? 'FREE' : '₹99.00'}</span>
            </div>

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>₹{(subtotal + (amountNeeded === 0 ? 0 : 99)).toFixed(2)}</span>
            </div>

            <button className="cart-checkout-btn" onClick={handleCheckout}>
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={20} />
            </button>

            <button className="cart-continue-btn" onClick={closeCart}>
              Or continue shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
