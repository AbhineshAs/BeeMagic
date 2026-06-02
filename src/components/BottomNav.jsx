import { Home, LayoutGrid, User, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/shop" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutGrid size={20} />
        <span>Shop</span>
      </NavLink>
      <NavLink to="/login" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={20} />
        <span>Account</span>
      </NavLink>
      <button className="nav-item cart-nav-btn">
        <div className="cart-icon-wrapper">
          <ShoppingBag size={20} />
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </div>
        <span>Cart</span>
      </button>
    </div>
  );
}
