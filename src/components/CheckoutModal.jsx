import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Smartphone, Truck, ShieldCheck, ArrowRight, Loader2, AlertCircle, LogIn, Sparkles, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/modals.css';

// Helper to ensure Razorpay script is loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const { user, openAuth, refreshUser } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Shipping | 2: Payment | 3: Success
  const [payMethod, setPayMethod] = useState('razorpay');
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

    if (!user) {
      setErrorMessage('Please sign in or create an account to complete checkout.');
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setIsSubmitting(true);

      // 1. CASH ON DELIVERY (Direct DB Order)
      if (payMethod === 'cod') {
        try {
          const orderPayload = {
            total_amount: `₹${grandTotal.toFixed(2)}`,
            numeric_total: grandTotal,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            payment_method: 'Cash on Delivery (COD)',
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
          setErrorMessage(err.message || 'Failed to place COD order. Please try again.');
        }
        return;
      }

      // 2. RAZORPAY PAYMENT GATEWAY (Test Mode Sandbox)
      try {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded || !window.Razorpay) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // Create Order on Backend with Razorpay API
        const rzpInit = await api.createRazorpayOrder({
          numeric_total: grandTotal,
          name: formData.name,
          currency: 'INR',
          items: cart,
        });

        if (!rzpInit || !rzpInit.razorpay_order_id) {
          throw new Error(rzpInit?.error || 'Failed to initiate Razorpay order.');
        }

        // Clean phone number (10 digits) for Razorpay UPI/SMS auto-intent
        const cleanPhone = (formData.phone || '').replace(/\D/g, '').slice(-10);

        const options = {
          key: rzpInit.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
          amount: rzpInit.amount,
          currency: rzpInit.currency || 'INR',
          name: 'Active Hands',
          description: `DIY Craft Kit Order (${totalItems} items)`,
          image: '/assets/header_mascot.png',
          order_id: rzpInit.razorpay_order_id,
          prefill: {
            name: formData.name,
            email: user?.email || '',
            contact: cleanPhone || '9876543210',
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: 'Pay via UPI / QR / GPay / PhonePe',
                  instruments: [
                    {
                      method: 'upi',
                    },
                  ],
                },
                cards: {
                  name: 'Cards & NetBanking',
                  instruments: [
                    {
                      method: 'card',
                    },
                    {
                      method: 'netbanking',
                    },
                    {
                      method: 'wallet',
                    },
                  ],
                },
              },
              sequence: payMethod === 'card' ? ['block.cards', 'block.upi'] : ['block.upi', 'block.cards'],
              preferences: {
                show_default_blocks: true,
              },
            },
          },
          notes: {
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          },
          theme: {
            color: '#00676A',
          },
          handler: async function (response) {
            try {
              setIsSubmitting(true);
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                total_amount: `₹${grandTotal.toFixed(2)}`,
                numeric_total: grandTotal,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                payment_method: payMethod === 'upi' ? 'Razorpay (UPI)' : payMethod === 'card' ? 'Razorpay (Cards)' : payMethod === 'net' ? 'Razorpay (NetBanking)' : 'Razorpay (Online)',
                items: cart,
              };

              const verifyRes = await api.verifyRazorpayPayment(verifyPayload);
              if (verifyRes && verifyRes.order) {
                setConfirmedOrder(verifyRes.order);
              }
              await clearCart();
              if (refreshUser) {
                await refreshUser();
              }
              setIsSubmitting(false);
              setStep(3);
            } catch (verErr) {
              setIsSubmitting(false);
              setErrorMessage(verErr.message || 'Payment signature verification failed.');
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setIsSubmitting(false);
          setErrorMessage(response.error?.description || 'Razorpay payment was unsuccessful or cancelled.');
        });
        rzp.open();
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage(err.message || 'Failed to start Razorpay payment. Please try again.');
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
          {!user && step !== 3 ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <img src="/assets/4.png" alt="Mascot" style={{ width: 84, height: 84, margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#1A1A1A', marginBottom: 8 }}>
                Sign In Required to Checkout
              </h3>
              <p style={{ color: '#4A5568', fontSize: '0.95rem', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.5 }}>
                Please sign in or create an account to securely complete your order and earn 50 maker points!
              </p>
              <button
                type="button"
                className="checkout-next-btn"
                style={{ maxWidth: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onClick={() => {
                  onClose();
                  openAuth('login');
                }}
              >
                <LogIn size={18} />
                <span>SIGN IN / CREATE ACCOUNT</span>
              </button>
            </div>
          ) : (
            <>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.4rem', color: '#1A1A1A', margin: 0 }}>
                      2. Select Payment Method
                    </h3>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EBF8FF', color: '#2B6CB0', border: '1px solid #BEE3F8', borderRadius: 6, padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                      <Lock size={12} />
                      <span>Razorpay Test Mode</span>
                    </div>
                  </div>

                  <div className="checkout-payment-methods">
                    <div 
                      className={`checkout-pay-card ${payMethod === 'razorpay' ? 'selected' : ''}`}
                      onClick={() => setPayMethod('razorpay')}
                    >
                      <Sparkles size={22} color="#00676A" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Razorpay QuickPay</span>
                        <small style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 500 }}>UPI, Cards, NetBanking, Wallets</small>
                      </div>
                    </div>

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
                      className={`checkout-pay-card ${payMethod === 'net' ? 'selected' : ''}`}
                      onClick={() => setPayMethod('net')}
                    >
                      <ShieldCheck size={22} color="#4A5568" />
                      <span>Net Banking</span>
                    </div>

                    <div 
                      className={`checkout-pay-card ${payMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setPayMethod('cod')}
                      style={{ gridColumn: '1 / -1' }}
                    >
                      <Truck size={22} color="#2A9D8F" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Cash on Delivery (COD)</span>
                        <small style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 500 }}>Pay in cash at your doorstep</small>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div style={{ marginTop: 20, padding: 14, background: '#FFFDF9', border: '1.5px solid #1A1A1A', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#4A5568' }}>
                      <span>Delivering to:</span>
                      <strong>{formData.name} ({formData.pincode})</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-hand)', fontSize: '1.35rem', fontWeight: 800, color: '#00676A' }}>
                      <span>Amount to Pay:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust Banner */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: '0.78rem', color: '#718096' }}>
                    <ShieldCheck size={14} color="#00676A" />
                    <span>256-bit SSL Encrypted & Verified by Razorpay Test Sandbox</span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button type="button" className="cart-continue-btn" onClick={() => setStep(1)} disabled={isSubmitting}>
                      Back
                    </button>
                    <button type="submit" className="shop-buy-btn" style={{ flex: 1, justifyContent: 'center', fontSize: '1.25rem', padding: '12px' }} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Processing Payment...</span>
                        </span>
                      ) : payMethod === 'cod' ? (
                        <span>Place Order (₹{grandTotal.toFixed(2)})</span>
                      ) : (
                        <span>Pay ₹{grandTotal.toFixed(2)} with Razorpay</span>
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
                      {confirmedOrder.razorpay_payment_id && (
                        <div style={{ fontSize: '0.85rem', color: '#4A5568', fontWeight: 500, marginTop: 4 }}>
                          Payment ID: <code>{confirmedOrder.razorpay_payment_id}</code>
                        </div>
                      )}
                    </div>
                  )}
                  <p style={{ fontFamily: 'var(--font-body)', color: '#4A5568', fontSize: '1rem', maxWidth: 360, margin: '0 auto 20px' }}>
                    We've confirmed your payment and registered your order in our database. A confirmation email and tracking link will be sent shortly.
                  </p>

                  <div style={{ background: '#FFF0EB', border: '1.5px solid #ED612B', borderRadius: 8, padding: 14, maxWidth: 360, margin: '0 auto 24px', fontFamily: 'var(--font-hand)', fontSize: '1.2rem', color: '#ED612B', fontWeight: 700 }}>
                    🎁 You earned <strong>+50 Maker Points</strong> on this order!
                  </div>

                  <button className="cart-empty-btn" onClick={handleClose}>
                    CONTINUE EXPLORING
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
