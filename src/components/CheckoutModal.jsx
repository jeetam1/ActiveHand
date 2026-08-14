import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Smartphone, Truck, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/modals.css';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Shipping | 2: Payment | 3: Success
  const [payMethod, setPayMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.savedAddresses?.[0]?.phone || '',
    address: user?.savedAddresses?.[0]?.address || '',
    city: user?.savedAddresses?.[0]?.city || '',
    pincode: user?.savedAddresses?.[0]?.pincode || '',
  });

  if (!isOpen) return null;

  const grandTotal = subtotal >= 1499 ? subtotal : subtotal + 99;

  const handleNext = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsSubmitting(true);
      try {
        const orderPayload = {
          total_amount: `₹${grandTotal.toFixed(2)}`,
          numeric_total: grandTotal,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          payment_method: payMethod,
          items: cart,
        };

        const res = await api.createOrder(orderPayload);
        if (res && res.order) {
          setConfirmedOrder(res.order);
        }
        await clearCart();
        if (refreshUser) {
          await refreshUser();
        }
        setIsSubmitting(false);
        setStep(3);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage(err.message || 'Failed to place order. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={step === 3 ? handleClose : undefined}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <h2 className="checkout-title">
            {step === 3 ? '🎉 Order Placed Successfully!' : 'Express Checkout'}
          </h2>
          <button className="auth-modal-close" style={{ position: 'static' }} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="checkout-body">
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: '#FFF5F5',
              border: '1.5px solid #E53E3E',
              borderRadius: 8,
              color: '#C53030',
              fontSize: '0.9rem',
              marginBottom: 16,
              fontFamily: 'var(--font-body)',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext}>
              <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: '#1A1A1A', marginBottom: 14 }}>
                1. Delivery Address ({totalItems} Items)
              </h3>

              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  style={{ paddingLeft: 14 }}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <input
                  type="tel"
                  className="auth-input"
                  style={{ paddingLeft: 14 }}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Complete Street Address</label>
                <input
                  type="text"
                  className="auth-input"
                  style={{ paddingLeft: 14 }}
                  placeholder="House/Flat No., Street, Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="auth-form-group">
                  <label className="auth-label">City</label>
                  <input
                    type="text"
                    className="auth-input"
                    style={{ paddingLeft: 14 }}
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="auth-form-group">
                  <label className="auth-label">Pincode</label>
                  <input
                    type="text"
                    className="auth-input"
                    style={{ paddingLeft: 14 }}
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ background: '#FAF8F5', border: '1.5px dashed #CBD5E0', borderRadius: 8, padding: 14, margin: '14px 0', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-hand)', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Order Total:</span>
                <span style={{ color: '#00676A' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button type="submit" className="shop-buy-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '1.25rem', padding: '12px' }}>
                <span>Proceed to Payment</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext}>
              <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: '#1A1A1A', marginBottom: 14 }}>
                2. Select Payment Method
              </h3>

              <div className="checkout-payment-methods">
                <div 
                  className={`checkout-pay-card ${payMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('upi')}
                >
                  <Smartphone size={22} color="#00676A" />
                  <span>UPI / QR / GPay</span>
                </div>

                <div 
                  className={`checkout-pay-card ${payMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('card')}
                >
                  <CreditCard size={22} color="#ED612B" />
                  <span>Debit / Credit Card</span>
                </div>

                <div 
                  className={`checkout-pay-card ${payMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('cod')}
                >
                  <Truck size={22} color="#2A9D8F" />
                  <span>Cash on Delivery</span>
                </div>

                <div 
                  className={`checkout-pay-card ${payMethod === 'net' ? 'selected' : ''}`}
                  onClick={() => setPayMethod('net')}
                >
                  <ShieldCheck size={22} color="#4A5568" />
                  <span>Net Banking</span>
                </div>
              </div>

              <div style={{ marginTop: 24, padding: 16, background: '#FFFDF9', border: '1.5px solid #1A1A1A', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#4A5568' }}>
                  <span>Delivering to:</span>
                  <strong>{formData.name} ({formData.pincode})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'var(--font-hand)', fontSize: '1.4rem', fontWeight: 800, color: '#00676A' }}>
                  <span>Amount to Pay:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="button" className="cart-continue-btn" onClick={() => setStep(1)} disabled={isSubmitting}>
                  Back
                </button>
                <button type="submit" className="shop-buy-btn" style={{ flex: 1, justifyContent: 'center', fontSize: '1.25rem', padding: '12px' }} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Order to DB...</span>
                    </span>
                  ) : (
                    <span>Place Order (₹{grandTotal.toFixed(2)})</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="checkout-success-box">
              <div className="checkout-success-icon">
                <CheckCircle size={44} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '2.2rem', color: '#00676A', margin: '0 0 6px 0' }}>
                Thank You for Crafting with Us!
              </h3>
              {confirmedOrder && (
                <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.25rem', color: '#1A1A1A', fontWeight: 700, margin: '8px 0 12px' }}>
                  Order Number: <span style={{ color: '#ED612B' }}>#{confirmedOrder.order_number}</span>
                </div>
              )}
              <p style={{ fontFamily: 'var(--font-body)', color: '#4A5568', fontSize: '1rem', maxWidth: 360, margin: '0 auto 20px' }}>
                We've stored your order in our database. A confirmation email and tracking link will be sent shortly.
              </p>

              <div style={{ background: '#FFF0EB', border: '1.5px solid #ED612B', borderRadius: 8, padding: 14, maxWidth: 360, margin: '0 auto 24px', fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#ED612B', fontWeight: 700 }}>
                🎁 You earned <strong>+50 Maker Points</strong> on this order!
              </div>

              <button className="cart-empty-btn" onClick={handleClose}>
                CONTINUE EXPLORING
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
