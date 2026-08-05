import { Link } from 'react-router-dom';

export default function ShopProductCard({ product }) {
  if (!product) return null;

  const price = Number(product.price || 0);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const rating = Number(product.rating || 5);

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
          <img src={product.image} alt={product.title || 'Product'} />
          
          <div className="spc-rating-badge">
            <span>{rating.toFixed(1)}</span>
            <span className="star-icon">★</span>
          </div>
        </div>
      </Link>
      <div className="spc-info">
        <div className="spc-header">
          <Link to={`/product/${product.id}`}>
            <h3>{product.title}</h3>
          </Link>
          <div className="spc-price-wrapper">
            <span className="spc-price">₹{price.toFixed(0)}</span>
            {oldPrice && (
              <span className="spc-old-price">₹{oldPrice.toFixed(0)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
