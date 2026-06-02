import { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      question: "Is your honey organic and raw?",
      answer: "Yes, all Bee Magic products are harvested from pesticide-free wildflower meadows. We never heat-treat or ultra-filter our honey, preserving all natural enzymes and pollens."
    },
    {
      question: "Do you offer international shipping?",
      answer: "We currently ship to over 20 countries. Shipping rates and delivery times vary by location and are calculated at checkout."
    },
    {
      question: "What is your wholesale minimum order?",
      answer: "Our wholesale partnerships begin at a minimum of 24 units. Please select 'Wholesale Inquiry' in the contact form for more details."
    },
    {
      question: "How should I store my honey?",
      answer: "Store your honey in a cool, dry place away from direct sunlight. There's no need to refrigerate it, as honey is naturally self-preserving."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-main">
        <div className="contact-header page-fade-in">
          <h1>Connect with the Hive</h1>
          <p>
            Whether you have questions about our artisanal honey processes or need
            help choosing the perfect jar, our team is here to provide golden-standard service.
          </p>
        </div>

        <div className="contact-container">
          {/* Form Section */}
          <section className="contact-form-section reveal-on-scroll slide-left">
            <div className="form-card">
              <h2>Send a Message</h2>
              <form className="contact-form" onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <div className="select-wrapper">
                    <select>
                      <option>General Inquiry</option>
                      <option>Wholesale Inquiry</option>
                      <option>Order Status</option>
                      <option>Sustainability</option>
                    </select>
                    <ChevronDown size={18} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="submit-inquiry-btn">Submit Inquiry</button>
              </form>
            </div>
          </section>

          {/* Info Section */}
          <section className="contact-info-section reveal-on-scroll slide-right">
            <div className="info-cards-grid">
              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-text">
                  <h4>Our Boutique</h4>
                  <p>72 Honeycomb Lane,<br />Amber Meadows, CA 90210</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <div className="info-text">
                  <h4>Phone</h4>
                  <p>+1 (555) 420-BEE-FREE</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <div className="info-text">
                  <h4>Email</h4>
                  <p>hello@beemagicboutique.com</p>
                </div>
              </div>
            </div>

            <div className="map-display">
              <div className="map-placeholder">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800&auto=format&fit=crop&q=60" alt="Map Location" />
                <div className="map-overlay">
                   <div className="map-pin-custom">
                     <div className="pin-point"></div>
                   </div>
                </div>
                <button className="view-maps-btn">
                  View on Google Maps
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section reveal-on-scroll slide-up">
            <h2 className="faq-title">Common Inquiries</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item reveal-on-scroll slide-up delay-${(index + 1) * 100} ${activeFaq === index ? 'open' : ''}`}
                >
                  <button className="faq-trigger" onClick={() => toggleFaq(index)}>
                    {faq.question}
                    {activeFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="faq-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
