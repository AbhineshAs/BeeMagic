import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Content */}
        <div
          className="hero-content"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
        >
          <h1 className="hero-title">
            PURE, RAW <span className="highlight-orange">HONEY</span> <br />
            FROM SUSTAINABLE <br />
            HIVES
          </h1>
          <p className="hero-subtitle">
            Ethically harvested, unfiltered honey crafted by passionate beekeepers.
          </p>
          <div className="hero-actions">
            <Link to="/shop">
              <button className="btn-primary">Shop Honey</button>
            </Link>
            <Link to="/about">
              <button className="btn-outline">Learn Our History</button>
            </Link>
          </div>
          <div className="hero-support">
            <div className="support-icon-wrapper">
              <PhoneCall size={18} />
            </div>
            <div className="support-info">
              <span className="support-label">Customer Service</span>
              <span className="support-number">+91 9074 799 336</span>
            </div>
          </div>
        </div>

        {/* Right Graphic Mockup */}
        <div className="hero-graphic-panel">
          <div
            className="hero-circle-wrapper"
            style={{ transform: `translateY(${scrollY * 0.25}px)` }}
          >
            <div className="circle-background animate-circle-reveal">
              <div className="hero-bottle-wrapper animate-bottle-reveal">
                <img
                  src="/images/roberta_honey.jpg"
                  alt="Artisanal Honey Jar"
                  className="hero-bottle-img"
                  style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
                />
              </div>
            </div>
          </div>

          {/* Floating badges with custom speed scroll multipliers */}
          <div
            className="badge-wrapper-top-left"
            style={{ transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * 0.05}px)` }}
          >
            <div className="floating-badge animate-badge-left animate-badge-1">
              <span className="badge-dot"></span>
              <span>Local & Ethical</span>
            </div>
          </div>

          <div
            className="badge-wrapper-top-right"
            style={{ transform: `translateY(${scrollY * 0.18}px) translateX(${-scrollY * 0.08}px)` }}
          >
            <div className="floating-badge animate-badge-right animate-badge-2">
              <span className="badge-dot"></span>
              <span>100% Raw & Unfiltered</span>
            </div>
          </div>

          <div
            className="badge-wrapper-bottom-left"
            style={{ transform: `translateY(${scrollY * 0.28}px) translateX(${scrollY * 0.08}px)` }}
          >
            <div className="floating-badge animate-badge-left animate-badge-3">
              <span className="badge-dot"></span>
              <span>Award-Winning Quality</span>
            </div>
          </div>

          <div
            className="badge-wrapper-bottom-right"
            style={{ transform: `translateY(${scrollY * 0.35}px) translateX(${-scrollY * 0.04}px)` }}
          >
            <div className="floating-badge animate-badge-right animate-badge-4">
              <span className="badge-dot"></span>
              <span>Sustainable Beekeeping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
