import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "As a chef, I'm very particular about ingredients. HoneyBee Treasures delivers exceptional quality every single time. It adds the perfect touch of natural sweetness to my signature glazes.",
    name: "Marcus Chen",
    location: "San Francisco, CA"
  },
  {
    id: 2,
    rating: 5,
    text: "Pure, rich, and absolutely delicious. This is hands-down the best raw honey I've ever tasted! I use the turmeric infusion daily in my morning tea, and it has done wonders for my digestion.",
    name: "Elena Rivera",
    location: "Austin, Texas"
  },
  {
    id: 3,
    rating: 5,
    text: "Fast shipping and incredible quality. It's like a spoonful of sunshine in every single jar! Highly recommend the ginger and wildflower varieties to anyone looking for authentic raw honey.",
    name: "Sarah Jenkins",
    location: "Seattle, Washington"
  }
];

export default function BestSellers() {
  const [allTestimonials, setAllTestimonials] = useState(testimonials);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadReviewsAndProducts = async () => {
      try {
        // Fetch all products so we can look up their titles
        const prodRes = await fetch('/api/products');
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const prodData = await prodRes.json();

        // Fetch all user-submitted reviews
        const revRes = await fetch('/api/reviews');
        if (!revRes.ok) throw new Error("Failed to fetch reviews");
        const revData = await revRes.json();

        // Map database reviews to the testimonials shape
        const dbTestimonials = revData.map(rev => {
          const matchedProduct = prodData.find(p => p.id === rev.productId);
          const productName = matchedProduct ? matchedProduct.title : 'Artisanal Honey';
          return {
            id: `db-${rev.id}`,
            rating: rev.rating,
            text: rev.comment || "Exceptional quality and authentic flavor. Truly honey magic!",
            name: rev.userName,
            location: `Verified Buyer • Reviewed: ${productName}`
          };
        });

        // Merge database reviews at the beginning of the list, followed by static fallbacks
        setAllTestimonials([...dbTestimonials, ...testimonials]);
      } catch (err) {
        console.error("Failed to load dynamic reviews for testimonial slider:", err);
      }
    };

    loadReviewsAndProducts();
  }, []);

  useEffect(() => {
    if (allTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [allTestimonials]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const active = allTestimonials[activeIndex] || testimonials[0];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header reveal-on-scroll slide-up">
        <h2 className="section-title">WHAT OUR CUSTOMERS SAY</h2>
        <p className="section-subtitle">Join thousands of happy honey lovers</p>
      </div>

      <div className="testimonials-container reveal-on-scroll zoom-in">
        <button className="slider-nav-btn prev" onClick={handlePrev}>
          <ChevronLeft size={24} />
        </button>

        <div className="testimonial-card-wrapper" key={active.id}>
          <div className="testimonial-stars">
            {[...Array(active.rating)].map((_, i) => (
              <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <p className="testimonial-text">"{active.text}"</p>
          <div className="testimonial-author">
            <h4 className="author-name">{active.name}</h4>
            <span className="author-location">{active.location}</span>
          </div>
        </div>

        <button className="slider-nav-btn next" onClick={handleNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="slider-indicators">
        {allTestimonials.map((_, index) => (
          <span 
            key={index} 
            className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}
