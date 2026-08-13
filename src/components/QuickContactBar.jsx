import React, { useState } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

export default function QuickContactBar() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 900
      }}
    >
      {/* WhatsApp Quick Chat */}
      <a
        href="https://wa.me/918390265566?text=Hi%20Active%20Hands,%20I'd%20like%20to%20know%20more%20about%20your%20DIY%20Craft%20Kits!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} fill="#FFFFFF" color="#25D366" />
      </a>

      {/* Back to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            color: '#00676A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E2E8F0',
            transition: 'transform 0.2s ease, background 0.2s ease',
            cursor: 'pointer',
            alignSelf: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#FAF8F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
