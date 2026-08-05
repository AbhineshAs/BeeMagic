import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { products as fallbackProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function ProductGrid() {
  const [products, setProducts] = useState(fallbackProducts);
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
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch dynamic products, using fallback:', err);
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

      <div className="products-grid">
        {products.slice(0, 4).map((product, index) => (
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
        ))}
      </div>
    </section>
  );
}
