import React from 'react';
import { ChevronRight } from 'lucide-react';
import '../styles/mission.css';

export default function Mission({ onAboutClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onAboutClick) {
      onAboutClick();
    }
  };

  return (
    <section className="mission-section" id="mission">
      <div className="mission-container">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-text">
          Active hands started as a small initiative to provide every child an opportunity 
          to explore and express the joy of working with tactile materials to create endless 
          creative expressions that can stimulate and rejuvenate both mind and body. With each 
          kit you learn the nuances of a traditional craft process through a contemporary 
          multidisciplinary approach.
        </p>
        <a 
          href="#about-us" 
          className="mission-link"
          onClick={handleClick}
        >
          <span>Read more about us</span>
          <ChevronRight size={22} />
        </a>
      </div>
    </section>
  );
}
