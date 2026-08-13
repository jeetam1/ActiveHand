import React from 'react';

export default function WorkshopsPage({ onNavigate }) {
  return (
    <div style={{ padding: '70px 24px 100px', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
      <p style={{ color: '#DF5E30', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
        For skill development & recreation
      </p>
      <h1 style={{ color: '#00676A', fontSize: '3rem', fontWeight: 800, marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
        Workshops & Craft Demos
      </h1>
      <p style={{ color: '#4A5568', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: 40 }}>
        We engage with organisations and individuals to guide, plan and execute craft-based learning programmes.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, textAlign: 'left', marginBottom: 50 }}>
        {[
          'Arranging Craft Demos / Field Trips',
          'Pedagogical Planning & Brainstorming',
          'Teacher Training Programme',
          'Project Execution with Students',
          'Facilitate Customised Supplies'
        ].map((item, idx) => (
          <div key={idx} style={{ background: '#FAF8F5', border: '1px solid #E8E2D9', borderRadius: 10, padding: '24px 20px' }}>
            <div style={{ color: '#DF5E30', fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>0{idx + 1}</div>
            <h3 style={{ color: '#00676A', fontSize: '1.15rem', fontWeight: 700 }}>{item}</h3>
          </div>
        ))}
      </div>

      <div style={{ background: '#F6ECE1', padding: '36px 30px', borderRadius: 14 }}>
        <h2 style={{ color: '#DF5E30', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>
          Let's organize a workshop!
        </h2>
        <p style={{ color: '#4A5568', marginBottom: 20 }}>
          Contact us directly to design a custom workshop curriculum for your school, corporate team, or NGO.
        </p>
        <a 
          href="mailto:activehandsdiy@gmail.com?subject=Workshop%20Inquiry"
          style={{
            backgroundColor: '#00676A',
            color: '#fff',
            padding: '12px 32px',
            borderRadius: 6,
            fontWeight: 700,
            display: 'inline-block',
            textDecoration: 'none'
          }}
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
