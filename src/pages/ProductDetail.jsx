import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, ChevronDown, ChevronUp, Truck, ShieldCheck, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopProductCard from '../components/ShopProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const navigate = useNavigate();

  const [reviewsList, setReviewsList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 600 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });

    // Fetch reviews
    fetch(`/api/reviews/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setReviewsList(data);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
      });

    // Fetch related products (using all products as pool)
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setRelatedProducts(data.filter(p => String(p.id) !== String(id)).slice(0, 4));
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <main className="product-detail-main">
          <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
            <div className="loading-spinner">Savoring the harvest...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <main className="product-detail-main">
          <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h2>Product not found.</h2>
            <Link to="/shop" className="back-to-shop" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    await addToCart(product, quantity);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      alert("Please log in to complete your purchase.");
      navigate('/login');
      return;
    }
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Related products are now handled by useEffect state

  return (
    <div className="product-detail-page">
      <Navbar />

      <main className="product-detail-main">
        <div className="product-detail-container">
          <div className="product-view-layout">
            {/* Gallery Section */}
            <div className="product-gallery page-fade-in">
              <div className="main-image-wrapper">
                {product.badge && (
                  <div className="detail-badge-group">
                    <span className="detail-badge gold">Best Seller</span>
                    <span className="detail-badge white">Limited Edition</span>
                  </div>
                )}
                <img src={product.image} alt={product.title} />
              </div>
              <div className="thumbnail-grid">
                <div className="thumbnail active"><img src={product.image} alt="thumb" /></div>
                <div className="thumbnail"><img src="https://images.unsplash.com/photo-1558583082-409143c7c9f8?w=200" alt="thumb" /></div>
                <div className="thumbnail"><img src="https://images.unsplash.com/photo-1587049352851-8d4e891347d4?w=200" alt="thumb" /></div>
                <div className="thumbnail"><img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=200" alt="thumb" /></div>
              </div>
            </div>

            {/* Info Section */}
            <div className="product-info-panel page-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="info-header">
                <span className="collection-label">{product.collection || 'BEE MAGIC COLLECTION'}</span>
                <h1>{product.title}</h1>
                <div className="rating-row">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < (product.reviews > 0 ? product.rating : 0) ? "#f59e0b" : "none"} color={i < (product.reviews > 0 ? product.rating : 0) ? "#f59e0b" : "#d7ccc8"} />
                    ))}
                  </div>
                  <span className="review-count">{product.reviews || 0} Reviews</span>
                </div>
                <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="current-price">₹{product.price.toFixed(2)}</span>
                  {product.oldPrice && (
                    <>
                      <span className="old-price">₹{product.oldPrice.toFixed(2)}</span>
                      <span className="discount-percent">
                        {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="special-offer-badge-box">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="offer-tag">₹50 OFFER</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>Flat discount applied at checkout!</span>
                    </div>
                    <p className="offer-description" style={{ margin: 0 }}>
                      Claim your extra <strong>₹50.00 OFF</strong> to get this jar for only <strong style={{ fontSize: '1rem', color: '#16a34a' }}>₹{(product.price - 50).toFixed(0)}</strong> + <strong>FREE Shipping</strong>!
                    </p>
                    <div className="countdown-timer-line">
                      <span className="pulse-dot-red"></span>
                      <span>Offer ends in: <span style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{formatTime(timeLeft)}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="purchase-controls">
                <div className="quantity-row">
                  <span className="qty-label">Quantity:</span>
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  ADD TO CART
                </button>
                <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
              </div>

              <div className="product-accordions">
                <div className={`accordion-item ${activeAccordion === 'description' ? 'open' : ''}`}>
                  <button className="accordion-trigger" onClick={() => toggleAccordion('description')}>
                    Description
                    {activeAccordion === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="accordion-content">
                    <p>{product.description}</p>
                  </div>
                </div>

                <div className={`accordion-item ${activeAccordion === 'benefits' ? 'open' : ''}`}>
                  <button className="accordion-trigger" onClick={() => toggleAccordion('benefits')}>
                    Health Benefits
                    {activeAccordion === 'benefits' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="accordion-content">
                    <ul>
                      <li>Rich in antioxidants and polyphenols</li>
                      <li>Natural antibacterial properties</li>
                      <li>Soothes sore throats and coughs</li>
                      <li>Prebiotic support for gut health</li>
                    </ul>
                  </div>
                </div>

                <div className={`accordion-item ${activeAccordion === 'shipping' ? 'open' : ''}`}>
                  <button className="accordion-trigger" onClick={() => toggleAccordion('shipping')}>
                    Shipping Info
                    {activeAccordion === 'shipping' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="accordion-content">
                    <p>Free standard shipping on orders over ₹500. Express 2-day delivery available at checkout. All jars are safely packed in 100% recyclable materials.</p>
                  </div>
                </div>
              </div>

              <div className="trust-badges">
                <div className="trust-item">
                  <ShieldCheck size={20} />
                  <span>100% Organic</span>
                </div>
                <div className="trust-item">
                  <Truck size={20} />
                  <span>Global Shipping</span>
                </div>
                <div className="trust-item">
                  <Heart size={20} />
                  <span>Lab Tested</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List Section */}
          <section className="product-reviews-section reveal-on-scroll slide-up" style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #efebe9' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#5d4037', marginBottom: '1.5rem' }}>Customer Appreciation</h2>
            
            {reviewsList.length === 0 ? (
              <div style={{ padding: '2rem', background: '#faf8f5', borderRadius: '16px', border: '1px solid #efebe9', color: '#8d6e63', textAlign: 'left' }}>
                <p>No reviews have been submitted for this harvest yet.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                  Have you ordered this honey? You can submit your rating and review directly from the <strong>Track Order</strong> page once your package is delivered!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                {reviewsList.map((review) => (
                  <div key={review.id} style={{ background: 'rgba(255,255,255,0.4)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 20px rgba(93,64,55,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d7ccc8', color: '#5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                          {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 700, color: '#3e2723', fontSize: '0.95rem' }}>{review.userName}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.1rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} color={i < review.rating ? "#f59e0b" : "#d7ccc8"} />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: '#5d4037', fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Related Section */}
          <div className="related-products-section reveal-on-scroll slide-up">
            <div className="related-header">
              <h2>You may also like:</h2>
              <p>Curated selections from our boutique</p>
              <Link to="/shop" className="view-collection">View Collection</Link>
            </div>
            <div className="shop-list">
              {relatedProducts.map((p, index) => (
                <div key={p.id} className={`reveal-on-scroll slide-up delay-${(index + 1) * 100}`}>
                  <ShopProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
