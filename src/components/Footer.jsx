import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import logo from '../assets/2026-05-15 22.59.50.jpg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link">
            <img src={logo} alt="Honey Bee Treasures Logo" className="footer-logo-img" />
            <span className="footer-brand-title">Bee Magic</span>
          </Link>
          <p>
            Ethically harvested, unfiltered organic honey crafted by passionate beekeepers.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon-link"><Facebook size={18} /></a>
            <a href="#" className="social-icon-link"><Twitter size={18} /></a>
            <a href="#" className="social-icon-link"><Instagram size={18} /></a>
            <a href="#" className="social-icon-link"><Linkedin size={18} /></a>
            <a href="#" className="social-icon-link"><Youtube size={18} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>COLLECTIONS</h4>
            <Link to="/shop">Raw and Reserve</Link>
            <Link to="/shop">Infused Blends</Link>
            <Link to="/shop">Gift Sets</Link>
            <Link to="/shop">Accessories</Link>
          </div>
          <div className="footer-column">
            <h4>ABOUT</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/about">Sustainability</Link>
            <Link to="/blog">The Honey Journal</Link>
            <Link to="/track-order">Track Order</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-column">
            <h4>CONTACT US</h4>
            <p style={{ fontSize: '0.85rem', color: '#8d6e63', lineHeight: '1.5', margin: 0 }}>
              <strong>Laya Enterprises</strong><br />
              Aramthanam, Vamanapuram Circle,<br />
              Thiruvananthapuram, Kerala - 695606<br />
              <a href="https://wa.me/919074799336" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706', textDecoration: 'none' }}>
                WhatsApp: +91 9074799336
              </a><br />
              <a href="mailto:beemagic777@gmail.com" style={{ color: '#d97706', textDecoration: 'none' }}>
                beemagic777@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Laya Enterprises (Bee Magic). All rights reserved.</p>
        <div className="footer-legal">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
