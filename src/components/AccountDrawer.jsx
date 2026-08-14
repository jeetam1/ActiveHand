import React, { useEffect } from 'react';
import { X, Package, Award, MapPin, LogOut, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function AccountDrawer() {
  const { user, isAccountOpen, closeAccount, logout, refreshUser, isLoading } = useAuth();

  useEffect(() => {
    if (isAccountOpen && refreshUser) {
      refreshUser();
    }
  }, [isAccountOpen, refreshUser]);

  if (!isAccountOpen || !user) return null;

  const orders = user.orders || [];
  const savedAddresses = user.savedAddresses || [];

  return (
    <div className="cart-drawer-overlay" onClick={closeAccount}>
      <div className="account-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="account-drawer-header">
          <div className="account-user-badge">
            <img src={user.avatar || '/assets/4.png'} alt={user.name} className="account-avatar" />
            <div>
              <h3 className="account-user-name">{user.name || user.username}</h3>
              <span className="account-user-tier">{user.tier || 'Junior Maker 🌱'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              className="cart-drawer-close"
              onClick={refreshUser}
              title="Refresh from Database"
              aria-label="Refresh data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button className="cart-drawer-close" onClick={closeAccount} aria-label="Close">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="account-drawer-body">
          {/* Points Banner */}
          <div style={{
            background: '#FFF0EB',
            border: '1.5px solid #ED612B',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#ED612B', fontWeight: 700 }}>
                Creative Maker Points
              </span>
              <h4 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.6rem', color: '#1A1A1A', margin: 0 }}>
                {user.points || 50} Points
              </h4>
            </div>
            <Sparkles size={28} color="#ED612B" />
          </div>

          {/* Orders Section */}
          <div>
            <h4 className="account-section-title">
              <Package size={20} color="#00676A" />
              <span>Your Orders ({orders.length})</span>
            </h4>

            {orders.length === 0 ? (
              <p style={{ color: '#718096', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
                No past orders yet. Start your first craft project today!
              </p>
            ) : (
              orders.map((ord) => {
                const ordNumber = ord.order_number || ord.id;
                const ordDate = ord.date_formatted || ord.date || (ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent');
                const ordTotal = ord.total_amount || ord.total;
                const ordStatus = ord.status || 'Confirmed ✅';
                
                // Get item summary
                let itemSummary = '';
                if (ord.item_titles && ord.item_titles.length > 0) {
                  itemSummary = ord.item_titles.join(', ');
                } else if (ord.items && Array.isArray(ord.items)) {
                  itemSummary = ord.items.map((it) => (typeof it === 'string' ? it : `${it.title} (x${it.quantity})`)).join(', ');
                } else {
                  itemSummary = 'DIY Craft Kit';
                }

                return (
                  <div key={ord.id || ord.order_number} className="account-order-card">
                    <div className="account-order-header">
                      <span>Order #{ordNumber}</span>
                      <span className="account-order-status">{ordStatus}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem', color: '#1A1A1A', fontWeight: 700 }}>
                      {itemSummary}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-hand)', fontSize: '1.1rem', color: '#00676A', fontWeight: 800 }}>
                      <span>Date: {ordDate}</span>
                      <span>Total: {ordTotal}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Saved Addresses */}
          <div style={{ marginTop: 24 }}>
            <h4 className="account-section-title">
              <MapPin size={20} color="#00676A" />
              <span>Saved Address ({savedAddresses.length})</span>
            </h4>
            {savedAddresses.length === 0 ? (
              <p style={{ color: '#718096', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
                Addresses will be automatically saved when you checkout.
              </p>
            ) : (
              savedAddresses.map((addr) => (
                <div key={addr.id || `${addr.city}-${addr.pincode}`} className="account-order-card">
                  <strong style={{ fontFamily: 'var(--font-hand)', fontSize: '1.15rem' }}>{addr.name}</strong>
                  <p style={{ margin: '4px 0', color: '#4A5568', fontSize: '0.9rem' }}>
                    {addr.address}, {addr.city} - {addr.pincode}
                  </p>
                  {addr.phone && <span style={{ fontSize: '0.85rem', color: '#718096' }}>Phone: {addr.phone}</span>}
                </div>
              ))
            )}
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
