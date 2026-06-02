import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ShopProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="shop-product-card">
      <Link to={`/product/${product.id}`} className="spc-image-link">
        <div className="spc-image-wrapper">
          {product.badge && (
            <div className="spc-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              {product.badge}
            </div>
          )}
          <img src={product.image} alt={product.title} />
        </div>
      </Link>
      <div className="spc-info">
        <div className="spc-header">
          <Link to={`/product/${product.id}`}>
            <h3>{product.title}</h3>
          </Link>
          <span className="spc-price">₹{product.price.toFixed(2)}</span>
        </div>
        <p className="spc-desc">{product.description}</p>
        <button className="spc-add-btn" onClick={handleAddToCart}>
          <ShoppingCart size={16} />
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
