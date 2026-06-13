import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, Heart, Lock, Truck, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopProductCard from '../components/ShopProductCard';
import { products } from '../data/products';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0.00;
  const taxes = 0.00;
  const discount = cart.length > 0 ? 50.00 : 0.00;
  const total = Math.max(0, subtotal - discount);

  // Recommendations (taking first 4 products for demo)
  const recommendations = products.slice(0, 4);

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        <header className="cart-header page-fade-in">
          <h1>Your Golden Selection</h1>
          <p>Review your artisanal choices before proceeding to checkout.</p>
        </header>

        <div className="cart-content">
          <div className="cart-left reveal-on-scroll slide-left">
            <div className="cart-items">
              {cart.length > 0 ? cart.map((item, index) => (
                <div key={index} className="cart-item-card">
                  <div className="item-image">
                    <img src={item.image} alt={item.title || item.name} />
                  </div>
                  <div className="item-info">
                    <div className="item-header">
                      <h3>{item.title || item.name}</h3>
                      <span className="item-category">RAW & ORGANIC</span>
                      <p className="item-meta">{item.weight || '500g Jar'} - Artisanal Harvest</p>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => removeFromCart(item.id)} className="action-btn">
                        <Trash2 size={16} /> Remove
                      </button>
                      <button className="action-btn">
                        <Heart size={16} /> Save for later
                      </button>
                    </div>
                    <div className="item-footer">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty-cart">
                  <p>Your hive is empty!</p>
                  <Link to="/shop" className="continue-shopping">Explore Collection</Link>
                </div>
              )}
            </div>

            <div className="promo-section">
              <input type="text" placeholder="Promo Code" />
              <button className="apply-btn">APPLY</button>
            </div>
            <p className="promo-note">Free gift wrapping available on all orders over ₹500.</p>
          </div>

          <div className="cart-right reveal-on-scroll slide-right">
            <div className="cart-summary-card">
              <h2>Summary</h2>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>FREE</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row">
                    <span>Special Offer</span>
                    <span style={{ color: '#2e7d32', fontWeight: 600 }}>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {taxes > 0 && (
                  <div className="summary-row">
                    <span>Taxes</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="total-amount-box">
                <span className="total-label">TOTAL AMOUNT</span>
                <div className="total-val">
                  <span className="currency">INR</span>
                  <span className="amount">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="checkout-btn">
                <Lock size={18} />
                SECURE CHECKOUT
              </Link>

              <div className="payment-methods">
                <p>PAYMENT METHODS</p>
                <div className="payment-icons">
                  <CreditCard size={20} />
                  <div className="custom-payment-icon"></div>
                  <div className="custom-payment-icon gray"></div>
                </div>
              </div>

              <div className="shipping-info-card">
                <Truck size={20} className="shipping-icon" />
                <div className="shipping-text">
                  <h4>Artisanal Shipping</h4>
                  <p>Standard delivery arrives in 3-5 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <section className="cart-recommendations reveal-on-scroll slide-up">
          <h2>You May Also Like</h2>
          <div className="recommendations-grid">
            {recommendations.map((product, index) => (
              <div key={product.id} className={`reveal-on-scroll slide-up delay-${(index + 1) * 100}`}>
                <ShopProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
