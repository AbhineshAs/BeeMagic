import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';
export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [backendError, setBackendError] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setBackendError(false);
      })
      .catch((err) => {
        console.warn('Failed to fetch dynamic products from backend:', err);
        setProducts([]);
        setBackendError(true);
      });
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    await addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <section className="products-section">
      <div className="section-header reveal-on-scroll slide-up">
        <h2 className="section-title">OUR BEST SELLERS</h2>
        <p className="section-subtitle">Customer favorites, straight from the hive</p>
      </div>

      {backendError ? (
        <div style={{ padding: '2.5rem 1.5rem', background: '#fff8f6', borderRadius: '20px', border: '1px solid #fecaca', textAlign: 'center', margin: '2rem 0' }}>
          <h4 style={{ color: '#dc2626', fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Backend Server Offline
          </h4>
          <p style={{ color: '#7f1d1d', fontSize: '0.9rem', margin: 0 }}>
            Start your Spring Boot backend (<code>./gradlew bootRun</code>) on port 8080 to display products.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? products.slice(0, 4).map((product, index) => (
            <div key={product.id} className={`dribbble-product-card reveal-on-scroll slide-up delay-${(index + 1) * 100}`}>
              <Link to={`/product/${product.id}`} className="card-image-link">
                <div className="card-image-wrapper">
                  <img src={product.image} alt={product.title} />
                </div>
              </Link>
              <div className="card-details">
                <div className="rating-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < (product.reviews > 0 ? product.rating : 0) ? "#f59e0b" : "none"} color={i < (product.reviews > 0 ? product.rating : 0) ? "#f59e0b" : "#d7ccc8"} />
                  ))}
                </div>
                <Link to={`/product/${product.id}`} className="card-title-link">
                  <h4>{product.title}</h4>
                </Link>
                <p className="card-price">₹{Number(product.price || 0).toFixed(2)}</p>
                <button className="btn-add-to-cart" onClick={(e) => handleAddToCart(e, product)}>
                  <ShoppingCart size={15} /> Add to Cart
                </button>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#8d6e63' }}>
              No products found in database.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
