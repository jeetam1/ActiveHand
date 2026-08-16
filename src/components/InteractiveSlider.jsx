import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/slider.css';

const slides = [
  {
    id: 'learn',
    title: 'LEARN',
    desc: 'Explore a variety of materials, tools and processes,',
    image: '/images/slider/learn.jpg'
  },
  {
    id: 'care',
    title: 'CARE',
    desc: 'sustainable materials that care for you and the planet',
    image: '/images/slider/care.jpg'
  },
  {
    id: 'gift',
    title: 'GIFT',
    desc: 'Meaningful party gifts to your friends, loved ones',
    image: '/images/slider/gift.jpg'
  },
  {
    id: 'support',
    title: 'SUPPORT',
    desc: 'Support local resources and craftsmen',
    image: '/images/slider/support.jpg'
  }
];

export default function InteractiveSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section 
      className="slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Philosophy Carousel"
    >
      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slide-item ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay" />
            <div className="slide-content">
              <h2 className="slide-title">{slide.title.split('').join(' ')}</h2>
              <p className="slide-desc">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="slider-arrow-btn prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={26} />
      </button>

      <button 
        className="slider-arrow-btn next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={26} />
      </button>

      <div className="slider-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}
