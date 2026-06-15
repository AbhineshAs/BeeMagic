import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ChevronDown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_URL from '../config/api';

export default function Checkout() {
  const { cart, cartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping Address Form State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: 'California',
    zipCode: ''
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0.00; 
  const taxes = 0.00;
  const discount = cart.length > 0 ? 50.00 : 0.00;
  const total = Math.max(0, subtotal - discount);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckoutSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to complete your order.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // Simple Validation
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.street || !shippingInfo.city || !shippingInfo.zipCode) {
      alert("Please fill in all shipping details first.");
      return;
    }

    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_5m1p3n4M5rP6qQ',
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Bee Magic",
      description: "Order Checkout",
      image: "/favicon.svg",
      handler: async function (response) {
        const fullAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`;
        try {
          const orderResponse = await fetch(`${API_URL}/api/orders/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              totalAmount: total,
              shippingAddress: fullAddress,
              paymentMethod: 'RAZORPAY',
              paymentId: response.razorpay_payment_id,
              items: cart.map(item => ({
                productId: String(item.productId),
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
              }))
            })
          });

          if (orderResponse.ok) {
            await clearCart();
            alert("Order placed successfully! Payment verified via Razorpay.");
            navigate('/track-order');
          } else {
            alert("Failed to save order on backend, but payment succeeded. Payment ID: " + response.razorpay_payment_id);
          }
        } catch (err) {
          console.error("Order error:", err);
          alert("An error occurred during order submission. Payment ID: " + response.razorpay_payment_id);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: user.email,
        contact: user.phone || ''
      },
      notes: {
        address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`
      },
      theme: {
        color: "#d97706"
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-main">
        {/* Progress Stepper */}
        <div className="checkout-stepper page-fade-in">
          <div className="step completed">
            <div className="step-icon"><Check size={16} /></div>
            <span>Info</span>
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <div className="step-icon">2</div>
            <span>Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-icon">3</div>
            <span>Payment</span>
          </div>
        </div>

        <div className="checkout-container">
          <div className="checkout-left reveal-on-scroll slide-left">
            {/* Shipping Address Section */}
            <section className="checkout-section card">
              <h2>Shipping Address</h2>
              <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    placeholder="123 Artisan Lane" 
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      placeholder="Amberville" 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <div className="select-wrapper">
                      <select 
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      >
                        <option>California</option>
                        <option>New York</option>
                        <option>Texas</option>
                        <option>Florida</option>
                      </select>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input 
                    type="text" 
                    placeholder="90210" 
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    required 
                  />
                </div>
              </form>
            </section>

            {/* Simulated payment modes preview */}
            <section className="checkout-section card">
              <h2>Secure Razorpay Integration</h2>
              <div className="payment-options">
                <div className="payment-option selected">
                  <div className="option-header">
                    <div className="radio-circle"></div>
                    <div className="option-info">
                      <span>Pay via Razorpay Portal</span>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#78716c' }}>
                        Supports Cards (debit/credit) & instant UPI apps (GPay, PhonePe, Paytm)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="checkout-right reveal-on-scroll slide-right">
            {/* Order Summary Section */}
            <section className="checkout-section order-summary card">
              <h2>Order Summary</h2>
              
              <div className="summary-items">
                {cart.length > 0 ? cart.map((item, index) => (
                  <div key={index} className="summary-item">
                    <div className="item-img">
                      <img src={item.image} alt={item.title || item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.title || item.name}</h4>
                      <p>{item.subtitle || 'Boutique Selection'}</p>
                      <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="empty-msg">Your cart is empty</p>
                )}
              </div>

              <div className="summary-footer">
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
                    <span>Estimated Taxes</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Order Total</span>
                  <span className="final-price">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="complete-order-btn" 
                onClick={handleCheckoutSubmit}
                disabled={isProcessing || cart.length === 0}
              >
                {isProcessing ? 'PROCESSING...' : 'COMPLETE ORDER TODAY'}
              </button>
              
              <div className="secure-checkout-label">
                <Lock size={14} />
                Secure encrypted checkout
              </div>
            </section>
          </div>
        </div>
      </main>



      <Footer />
    </div>
  );
}
