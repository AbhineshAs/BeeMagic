import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Compass, LogOut, Phone, MapPin, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/2026-05-15 22.59.50.jpg';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile dropdown and modal states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to clicks on the window to close the dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const closeDropdown = () => setIsDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="main-navbar">
        <div className="nav-left">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Honey Bee Treasures Logo" className="logo-img" />
          </Link>
        </div>

        <div className="nav-center">
          <div className="desktop-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
            {isAdmin && <NavLink to="/admin" className={({ isActive }) => isActive ? 'admin-pill active' : 'admin-pill'}>Admin</NavLink>}
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-icons">
            {isAuthenticated ? (
              <div className="user-profile-nav-container">
                <button
                  className="nav-icon-btn profile-trigger"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  title="My Account"
                >
                  <User size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <User size={15} />
                      <span>View Profile</span>
                    </button>
                    <Link
                      to="/track-order"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Compass size={15} />
                      <span>Track Order</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item logout"
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="nav-outline-btn">Sign In</Link>
              </div>
            )}

            <Link to="/cart" className="nav-icon-btn cart-btn">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        <div className="sidebar-links">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</NavLink>
          <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</NavLink>
          <NavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)}>BLOG</NavLink>
          <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>OUR STORY</NavLink>
          <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</NavLink>
          <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>ACCOUNT</NavLink>
        </div>
      </div>
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Profile Details Modal */}
      {isProfileModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsProfileModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <div className="profile-avatar-circle">
                <User size={36} />
              </div>
              <h2>User Profile</h2>
              <span className="profile-role-tag">{user.role || 'USER'}</span>
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-item">
                <User size={18} className="info-icon" />
                <div className="info-text">
                  <label>Full Name</label>
                  <p>{user.name}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <Mail size={18} className="info-icon" />
                <div className="info-text">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <Phone size={18} className="info-icon" />
                <div className="info-text">
                  <label>Phone Number</label>
                  <p>{user.phoneNumber || 'Not Provided'}</p>
                </div>
              </div>

              <div className="profile-info-item">
                <MapPin size={18} className="info-icon" />
                <div className="info-text">
                  <label>Shipping Address</label>
                  <p>{user.address || 'Not Provided'}</p>
                </div>
              </div>
            </div>

            <button className="modal-ok-btn" onClick={() => setIsProfileModalOpen(false)}>
              Back to Boutique
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

