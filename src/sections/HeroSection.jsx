import React, { useEffect, useRef, useState } from 'react';
import { CoffeeDoodle } from '../components/Brand';
import { images } from '../data/images';

const stripMessages = [
  'Café com gelo',
  'Matcha na mesa',
  'Conversa por acabar',
  'Puxe mais uma cadeira',
];

export default function HeroSection({ onMakeItRain }) {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setShowVideo(!motionPreference.matches);

    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }

  return (
    <>
      <section className={`hero${showVideo ? ' hero-with-video' : ''}`} id="home" aria-labelledby="hero-heading">
        <img
          className="hero-image"
          src={images.hero.src}
          alt={images.hero.alt}
          fetchPriority="high"
        />
        {showVideo && (
          <video
            ref={videoRef}
            className="hero-video"
            src={`${import.meta.env.BASE_URL}videos/koffee-hero.mp4`}
            poster={images.hero.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setShowVideo(false)}
          />
        )}
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="hero-intro">O café era a desculpa</p>
          <h1 id="hero-heading">Era só<br />um café</h1>
          <p className="hero-description">
            Um café gelado na mão e a conversa por acabar.<br />Há dias que pedem só isto.
          </p>
          <a className="button button-light" href="#menu">Escolher o meu pedido</a>
        </div>
        <button className="coffee-sticker" onClick={onMakeItRain} aria-label="Fazer chover grãos de café">
          <span className="sticker-top">Só mais</span>
          <CoffeeDoodle />
          <span className="sticker-bottom">um café</span>
          <span className="sticker-hint">toque para agitar</span>
        </button>
        <div className="hero-bottom">
          {showVideo && (
            <button
              className="hero-video-toggle"
              type="button"
              onClick={toggleVideo}
              aria-label={isPlaying ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                {isPlaying ? (
                  <path d="M3 2h3v12H3zM10 2h3v12h-3z" />
                ) : (
                  <path d="m4 2 10 6-10 6z" />
                )}
              </svg>
              {isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            </button>
          )}
        </div>
      </section>
      <div className="good-things-strip" aria-label="Café com gelo, matcha e tempo à mesa">
        <div aria-hidden="true">
          {[0, 1].map(copy => (
            <React.Fragment key={copy}>
              {stripMessages.map(message => <span key={message}>{message}</span>)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
