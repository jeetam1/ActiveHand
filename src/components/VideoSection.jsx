import React, { useState, useRef } from 'react';
import { Play, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/video.css';

export default function VideoSection() {
  const { isAuthenticated, openAuth } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleTogglePlay = () => {
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }

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

        <div className="video-wrapper" onClick={handleTogglePlay} style={{ cursor: 'pointer' }}>
          <video 
            ref={videoRef}
            src="/video/kit_in_action.mp4"
            className="video-element"
            controls={isAuthenticated && isPlaying}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          
          {!isPlaying && (
            <div className="video-play-overlay" aria-label="Play video">
              <div className="play-circle-btn">
                {isAuthenticated ? (
                  <Play size={36} fill="#FFFFFF" style={{ marginLeft: 4 }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Lock size={28} color="#FFFFFF" />
                  </div>
                )}
              </div>
              {!isAuthenticated && (
                <div style={{
                  position: 'absolute',
                  bottom: 24,
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Lock size={16} color="#ED612B" />
                  <span>Sign in to watch Kit in Action</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
