import React from 'react';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import NewArrivals from '../../components/NewArrivals';
import InteractiveSlider from '../../components/InteractiveSlider';
import NewsletterBanner from '../../components/NewsletterBanner';

export default function HomePage({ onNavigate }) {
  return (
    <main className="home-page-container">
      {/* 1. Notebook Paper Hero Section */}
      <Hero onShopClick={() => onNavigate('shop')} />

      {/* 2. Why Active Hands DIY Kits? (4 Column Section) */}
      <Features />

      {/* 3. Our Popular Kits (4 Taped Polaroid Cards Section) */}
      <NewArrivals onShopClick={() => onNavigate('shop')} />

      {/* 4. Philosophy Carousel Slider */}
      <InteractiveSlider />

      {/* 5. Orange Banner ("Making Learning Seriously Fun!") & Newsletter Signup */}
      <NewsletterBanner />
    </main>
  );
}
