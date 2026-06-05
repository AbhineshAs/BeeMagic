import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();

  // Hide mobile bottom nav on admin dashboard, login, and checkout pages to keep layouts clean
  const hiddenRoutes = ['/admin', '/login', '/checkout', '/mock-google-login'];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/shop" className={`bottom-nav-item ${isActive('/shop') ? 'active' : ''}`}>
        <ShoppingBag size={20} />
        <span>Shop</span>
      </Link>
      <Link to="/track-order" className={`bottom-nav-item ${isActive('/track-order') ? 'active' : ''}`}>
        <Truck size={20} />
        <span>Orders</span>
      </Link>
      <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''} cart-nav-item`}>
        <div className="cart-icon-wrapper">
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </Link>
    </div>
  );
}
