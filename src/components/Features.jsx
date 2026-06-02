import { useState, useEffect, useRef } from 'react';
import { Droplet, Leaf, Shield, Sparkles } from 'lucide-react';
import rawHoneyImage from '../assets/salah-ait-mokhtar-fvLHfyBkKQM-unsplash.jpg';
import ethicalImage from '../assets/shelby-cohron-UQwbKtu-2Ek-unsplash.jpg';
import Sustainable from '../assets/with-mahdy-FiksIuf61h0-unsplash.jpg';
import awardWinningImage from '../assets/elena-leya-fQ5NRUwqo6k-unsplash.jpg';
const features = [
  {
    id: 1,
    title: '100% RAW AND UNFILTERED',
    description: 'Never heated or processed, preserving all natural enzymes and nutrients.',
    icon: <Droplet size={28} />,
    image: rawHoneyImage
  },
  {
    id: 2,
    title: 'LOCAL AND ETHICAL',
    description: 'Supporting local beekeepers and sustainable practices in every single jar.',
    icon: <Leaf size={28} />,
    image: ethicalImage
  },
  {
    id: 3,
    title: 'SUSTAINABLE BEEKEEPING',
    description: 'Protecting bee populations through regenerative organic agriculture methods.',
    icon: <Shield size={28} />,
    image: Sustainable
  },
  {
    id: 4,
    title: 'AWARD-WINNING QUALITY',
    description: 'Recognized nationally for exceptional purity, taste, and premium standards.',
    icon: <Sparkles size={28} />,
    image: awardWinningImage
  }
];

export default function Features() {
  const containerRef = useRef(null);
  const [beeStyle, setBeeStyle] = useState({
    top: '0px',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    opacity: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress of scroll through the container
      // Starts when top of container reaches 60% of viewport, ends when bottom of container reaches 40% of viewport
      const startOffset = windowHeight * 0.6;
      const endOffset = windowHeight * 0.4;

      const totalDist = containerHeight + startOffset - endOffset;
      const currentScroll = startOffset - rect.top;

      let progress = currentScroll / totalDist;
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1

      if (rect.top > windowHeight || rect.bottom < 0) {
        // Out of viewport
        setBeeStyle(prev => ({ ...prev, opacity: 0 }));
        return;
      }

      // Calculate Top Position of bee (y-axis)
      const topY = progress * containerHeight;

      // Calculate Left Position of bee (x-axis)
      // The timeline winds back and forth, so let's model this as a smooth sinusoidal wave!
      // Center of container is 50%, wave oscillates by +/- 12% to follow nodes
      const angleFreq = progress * Math.PI * 3; // 1.5 full oscillation cycles
      const waveOffsetX = Math.sin(angleFreq) * 10; // offset percentage
      const leftX = `calc(50% + ${waveOffsetX}%)`;

      // Calculate Rotation Angle
      // Derivative of sine wave gives cosine for tangent slope (direction of curve)
      const slopeCos = Math.cos(angleFreq) * 1.5;
      const deg = 90 + Math.atan(slopeCos) * (180 / Math.PI); // offset rotation to match direction of movement

      setBeeStyle({
        top: `${topY}px`,
        left: leftX,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
        opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
        transition: 'top 0.1s ease-out, left 0.1s ease-out, transform 0.1s ease-out, opacity 0.3s ease'
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Trigger initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section className="features-path-section">
      <div className="features-path-header reveal-on-scroll slide-up">
        <h2 className="section-title">OUR ARTISANAL STANDARDS</h2>
        <p className="section-subtitle">Crafted with care, guided by nature</p>
      </div>

      <div className="features-path-container" ref={containerRef}>
        {/* Playful dotted winding line representation */}
        <div className="dashed-path-line"></div>

        {/* Scroll-Driven Flying Bee Element */}
        <div className="flying-bee-element" style={beeStyle}>
          <img src="/images/scroll_bee.png" alt="Flying Bee" className="flying-bee-img" />
        </div>

        {features.map((feature, index) => (
          <div key={feature.id} className={`features-path-node ${index % 2 === 0 ? 'left-aligned' : 'right-aligned'} reveal-on-scroll ${index % 2 === 0 ? 'slide-left' : 'slide-right'}`}>
            <div className="node-marker">
              <div className="marker-icon-wrapper">
                {feature.icon}
              </div>
              <span className="marker-pulse"></span>
            </div>

            <div className="node-content-card">
              <div className="node-image-wrapper">
                <img src={feature.image} alt={feature.title} />
              </div>
              <div className="node-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
