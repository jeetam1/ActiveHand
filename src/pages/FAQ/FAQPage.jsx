import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: '1. When will I receive my order?',
    a: 'All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.'
  },
  {
    q: '2. Can I track my shipment status?',
    a: 'Once your order has been shipped, you will receive a Shipment Confirmation email containing your tracking number(s). The tracking number will be active within 24 hours.'
  },
  {
    q: '3. What is the shipping cost within the country?',
    a: 'Shipping charges for your order will be calculated and displayed at checkout.'
  },
  {
    q: '4. Am I eligible for free shipping?',
    a: 'Check out our combo-offers for free shipping promotions.'
  },
  {
    q: '5. Do you ship internationally?',
    a: 'We have tie-ups for international shipping. Rates vary depending on the country and size of order. Please contact us via email to receive estimates on cost and delivery time.'
  },
  {
    q: '6. What if the product is damaged in handling?',
    a: 'Active Hands may not be completely liable for any products damaged during shipping, but we can contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods for filing a claim.'
  }
];

export default function FAQPage({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ padding: '70px 24px 100px', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ color: '#DF5E30', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
          Have Questions?
        </p>
        <h1 style={{ color: '#00676A', fontSize: '3rem', fontWeight: 800, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>
          Frequently Asked Questions
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              style={{
                border: '1px solid #E8E2D9',
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#FAF8F5'
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#00676A',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {isOpen && (
                <div style={{ padding: '0 24px 20px', color: '#4A5568', fontSize: '1rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
