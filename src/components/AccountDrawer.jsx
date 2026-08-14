import React from 'react';
import { X, Package, Award, MapPin, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function AccountDrawer() {
  const { user, isAccountOpen, closeAccount, logout } = useAuth();

  if (!isAccountOpen || !user) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeAccount}>
      <div className="account-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="account-drawer-header">
          <div className="account-user-badge">
            <img src={user.avatar || '/assets/4.png'} alt={user.name} className="account-avatar" />
            <div>
              <h3 className="account-user-name">{user.name}</h3>
              <span className="account-user-tier">{user.tier}</span>
            </div>
          </div>
          <button className="cart-drawer-close" onClick={closeAccount} aria-label="Close">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="account-drawer-body">
          {/* Points Banner */}
          <div style={{ background: '#FFF0EB', border: '1.5px solid #ED612B', borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#ED612B', fontWeight: 700 }}>Creative Maker Points</span>
              <h4 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.6rem', color: '#1A1A1A', margin: 0 }}>{user.points} Points</h4>
            </div>
            <Sparkles size={28} color="#ED612B" />
          </div>

          {/* Orders Section */}
          <div>
            <h4 className="account-section-title">
              <Package size={20} color="#00676A" />
              <span>Your Orders ({user.orders.length})</span>
            </h4>

            {user.orders.length === 0 ? (
              <p style={{ color: '#718096', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
                No past orders yet. Start your first craft project today!
              </p>
            ) : (
              user.orders.map((ord) => (
                <div key={ord.id} className="account-order-card">
                  <div className="account-order-header">
                    <span>Order #{ord.id}</span>
                    <span className="account-order-status">{ord.status}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#1A1A1A', fontWeight: 700 }}>
                    {ord.items.join(', ')}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#00676A', fontWeight: 800 }}>
                    <span>Date: {ord.date}</span>
                    <span>Total: {ord.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Addresses */}
          <div style={{ marginTop: 24 }}>
            <h4 className="account-section-title">
              <MapPin size={20} color="#00676A" />
              <span>Saved Address</span>
            </h4>
            {user.savedAddresses.map((addr) => (
              <div key={addr.id} className="account-order-card">
                <strong style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem' }}>{addr.name}</strong>
                <p style={{ margin: '4px 0', color: '#4A5568', fontSize: '0.9rem' }}>{addr.address}, {addr.city} - {addr.pincode}</p>
                <span style={{ fontSize: '0.85rem', color: '#718096' }}>Phone: {addr.phone}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <button className="account-logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
