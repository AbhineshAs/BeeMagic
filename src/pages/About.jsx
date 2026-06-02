import { Link } from 'react-router-dom';
import { Leaf, Droplets, FlaskConical, Wind } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import honeyFront from '../assets/kateryna-hliznitsova-v0ckFtPMbP0-unsplash.jpg';

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-glass-card page-fade-in">
            <h1>Our Story</h1>
            <p>
              Founded on the belief that nature's purest gifts should be shared,
              we've spent generations mastering the art of artisanal beekeeping.
            </p>
          </div>
        </section>

        {/* Quality Section */}
        <section className="about-info-section">
          <div className="info-text reveal-on-scroll slide-left">
            <span className="section-label">PURITY FIRST</span>
            <h2>Uncompromising Quality</h2>
            <p>
              Every jar of Bee Magic honey is a testament to our commitment
              to excellence. We never use heat, chemicals, or ultra-filtration,
              ensuring that the natural enzymes and pollens remain intact for
              a taste that's truly magical.
            </p>
          </div>
          <div className="info-image reveal-on-scroll slide-right">
            <img src={honeyFront} alt="Honey Pouring" />
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="about-info-section reverse">
          <div className="info-text gold-bg reveal-on-scroll slide-right">
            <span className="section-label">FROM THE HIVE</span>
            <h2>Sustainability in Every Drop</h2>
            <p>
              Our apiaries are located in protected wildflower meadows,
              far from pesticides and pollution. We practice ethical
              harvesting that ensures the bees have enough honey for themselves,
              preserving the colony's health for years to come.
            </p>
          </div>
          <div className="info-image reveal-on-scroll slide-left">
            <img src="https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=800" alt="Bee on Flower" />
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="craftsmanship-section">
          <h2 className="reveal-on-scroll slide-up">The Craftsmanship</h2>
          <div className="craft-divider reveal-on-scroll slide-up"></div>
          <div className="craft-grid">
            <div className="craft-item reveal-on-scroll slide-up delay-100">
              <div className="craft-icon"><Leaf size={24} /></div>
              <h4>Wild Foraging</h4>
              <p>Bees roam protected wildflower meadows, collecting only the finest nectar and pollen.</p>
            </div>
            <div className="craft-item reveal-on-scroll slide-up delay-200">
              <div className="craft-icon"><Droplets size={24} /></div>
              <h4>Gentle Harvest</h4>
              <p>We harvest small batches manually to minimize stress on the hive and maintain raw quality.</p>
            </div>
            <div className="craft-item reveal-on-scroll slide-up delay-300">
              <div className="craft-icon"><FlaskConical size={24} /></div>
              <h4>Lab Analysis</h4>
              <p>Every batch is tested for purity, potency, and the presence of any harmful pollutants.</p>
            </div>
            <div className="craft-item reveal-on-scroll slide-up delay-400">
              <div className="craft-icon"><Wind size={24} /></div>
              <h4>Pure Jarring</h4>
              <p>Pure honey is directly bottled into UV-protected glass to preserve taste and nutritional value.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-header reveal-on-scroll slide-up">
            <h2>Meet the Keepers</h2>
            <p>The dedicated team of enthusiasts behind every jar of Bee Magic honey.</p>
            <button className="join-btn">JOIN THE TEAM</button>
          </div>
          <div className="team-grid">
            <div className="team-member reveal-on-scroll slide-up delay-100">
              <div className="member-img">
                <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600" alt="Julian Aris" />
              </div>
              <h3>Julian Aris</h3>
              <p>Founder & Master Beekeeper</p>
            </div>
            <div className="team-member reveal-on-scroll slide-up delay-200">
              <div className="member-img">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" alt="Dr. Elena Thorne" />
              </div>
              <h3>Dr. Elena Thorne</h3>
              <p>Quality Assurance Director</p>
            </div>
            <div className="team-member reveal-on-scroll slide-up delay-300">
              <div className="member-img">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" alt="Marcus Chen" />
              </div>
              <h3>Marcus Chen</h3>
              <p>Head of Sustainability</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta reveal-on-scroll zoom-in">
          <h2>Experience the Magic</h2>
          <p>Treat yourself to nature's most exquisite gold, harvested with respect for the season.</p>
          <div className="cta-actions">
            <Link to="/shop" className="primary-cta-btn">Shop Collection</Link>
            <Link to="/contact" className="secondary-cta-btn">Visit Us</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
