import React from 'react';

export default function PolicyPage({ onNavigate }) {
  return (
    <div style={{ padding: '70px 24px 100px', maxWidth: '860px', margin: '0 auto', color: '#4A5568', lineHeight: 1.8 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ color: '#00676A', fontSize: '3rem', fontWeight: 800, marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>
          Store Policy & Returns
        </h1>
        <p style={{ color: '#DF5E30', fontWeight: 700, fontSize: '1.2rem' }}>
          Shipping, Customer Care & Return Guidelines
        </p>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#00676A', fontSize: '1.6rem', marginBottom: 14 }}>Shipping & Returns</h2>
        <p style={{ marginBottom: 14 }}>
          Thanks for purchasing our DIY kits at Active Hands! We offer a full money-back guarantee for all purchases made on our website. If you are not satisfied with the product that you have purchased from us, please feel free to call or email us regarding your concerns.
        </p>
        <p style={{ marginBottom: 14 }}>
          You are eligible for a full reimbursement within 7 calendar days of your purchase. The product must be in the same condition that you receive it. If the product is damaged in any way, or you have initiated the return after 7 calendar days have passed, you will not be eligible for a refund.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#00676A', fontSize: '1.6rem', marginBottom: 14 }}>Follow 3 Easy Steps to Return:</h2>
        <ol style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>Intimate us your intent to return through Email/phone within 7 days of receipt of the product.</li>
          <li>Ship to the address provided by us. (Return shipping charges are borne by the customer).</li>
          <li>Furnish details of your account for swift processing.</li>
        </ol>
      </section>

      <section>
        <h2 style={{ color: '#00676A', fontSize: '1.6rem', marginBottom: 14 }}>Wholesale & Customization Queries</h2>
        <p style={{ marginBottom: 14 }}>
          We are open to discuss collaborations. Wholesale/bulk orders imply quantities over 10 pieces per variant. We also offer customized kits to suit your party themes, schools, or corporate events. Execution time frame is generally 15–25 days.
        </p>
      </section>
    </div>
  );
}
