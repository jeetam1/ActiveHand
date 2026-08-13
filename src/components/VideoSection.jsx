import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';
import '../styles/video.css';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="video-section" id="video">
      <div className="video-container">
        <p className="section-subtitle">See our</p>
        <h2 className="section-title">Kit in Action!</h2>

        <div className="video-wrapper" onClick={handleTogglePlay}>
          <video 
            ref={videoRef}
            src="/video/kit_in_action.mp4"
            className="video-element"
            controls={isPlaying}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          
          {!isPlaying && (
            <div className="video-play-overlay" aria-label="Play video">
              <div className="play-circle-btn">
                <Play size={36} fill="#FFFFFF" style={{ marginLeft: 4 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
