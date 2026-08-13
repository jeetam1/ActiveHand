import React from 'react';

const allProducts = [
  { id: 1, title: 'Mosaic Art Tray Kit', price: '₹899.00', url: 'https://rzp.io/l/B8kcvpZv', img: '/images/products/mosaic-tray.jpg' },
  { id: 2, title: 'Book Binding DIY Kit', price: '₹799.00', url: 'https://rzp.io/l/MZMgvJT', img: '/images/products/book-binding.jpg' },
  { id: 3, title: 'Block Printing DIY Kit', price: '₹1099.00', url: 'https://rzp.io/l/vpyraESL', img: '/images/products/block-printing.jpg' },
  { id: 4, title: 'Hand-made Paper Making DIY Kit', price: '₹899.00', url: 'https://rzp.io/l/YP2hIiawf', img: '/images/products/mosaic-tray.jpg' },
  { id: 5, title: 'Weaving Loom DIY Kit', price: '₹899.00', url: 'https://rzp.io/l/sqT408WeA', img: '/images/slider/learn.jpg' },
  { id: 6, title: 'Dried Press Flower Kit', price: '₹699.00', url: 'https://rzp.io/l/7pvBCVAs', img: '/images/slider/gift.jpg' }
];

export default function ShopPage({ onNavigate }) {
  return (
    <div style={{ padding: '60px 24px 100px', maxWidth: '1240px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ color: '#DF5E30', fontSize: '1.3rem', fontWeight: 700, marginBottom: 6, fontFamily: 'Outfit, sans-serif' }}>
          Think out of the box!
        </p>
        <h1 style={{ color: '#00676A', fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          All DIY Craft Kits
        </h1>
        <p style={{ color: '#4A5568', maxWidth: 600, margin: '12px auto 0' }}>
          Handcrafted DIY learning kits designed to inspire creativity, patience, and traditional crafting techniques.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
        {allProducts.map((prod) => (
          <div 
            key={prod.id} 
            style={{
              backgroundColor: '#fff',
              border: '1px solid #E8E2D9',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <img src={prod.img} alt={prod.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ color: '#DF5E30', fontSize: '1.25rem', marginBottom: 8, minHeight: 48 }}>{prod.title}</h3>
            <span style={{ color: '#00676A', fontSize: '1.3rem', fontWeight: 800, marginBottom: 16 }}>{prod.price}</span>
            <a 
              href={prod.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#00676A',
                color: '#fff',
                padding: '10px 28px',
                borderRadius: 4,
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Buy Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
