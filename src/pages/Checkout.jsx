import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL, { formatImageUrl } from '../config/api';
import { Lock, CreditCard, ChevronDown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

  // Razorpay Overlay State
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('card'); // 'card' or 'upi'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'other'
  const [upiId, setUpiId] = useState('');
  
  // Card Inputs State
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const [paymentStep, setPaymentStep] = useState(1); // 1: Input, 2: Loading, 3: Success, 4: QR Code
  const [qrTimer, setQrTimer] = useState(300); // 5 minutes in seconds

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0.00; 
  const taxes = 0.00;
  const discount = cart.length > 0 ? 50.00 : 0.00;
  const total = Math.max(0, subtotal - discount);

  // Countdown timer for QR Code step
  useEffect(() => {
    let interval;
    if (showRazorpay && paymentStep === 4) {
      setQrTimer(300);
      interval = setInterval(() => {
        setQrTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showRazorpay, paymentStep]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
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

    // Open Razorpay Popup
    setPaymentStep(1);
    setShowRazorpay(true);
  };

  const simulateOrderPlacement = (finalPaymentMethod) => {
    setTimeout(async () => {
      // Build address string and select payment method label
      const fullAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`;
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substr(2, 9)}`;

      setIsProcessing(true);
      try {
        const response = await fetch(`${API_URL}/api/orders/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalAmount: total,
            shippingAddress: fullAddress,
            paymentMethod: finalPaymentMethod,
            paymentId: mockPaymentId,
            items: cart.map(item => ({
              productId: String(item.productId),
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image
            }))
          })
        });

        if (response.ok) {
          setPaymentStep(3); // Transition to success checkmark
          setTimeout(async () => {
            await clearCart();
            setShowRazorpay(false);
            alert("Order placed successfully! Payment verified via Razorpay.");
            navigate('/track-order');
          }, 1800);
        } else {
          alert("Failed to place order on server. Please try again.");
          setPaymentStep(1);
        }
      } catch (err) {
        console.error("Order error:", err);
        alert("An error occurred during order submission.");
        setPaymentStep(1);
      } finally {
        setIsProcessing(false);
      }
    }, 1800); // simulated processing delay
  };

  const handlePayMock = () => {
    // Validate checkout method details
    if (razorpayMethod === 'card') {
      if (!cardNo || !cardExpiry || !cardCvv || !cardName) {
        alert("Please fill in all card details.");
        return;
      }
      setPaymentStep(2); // Start loading spinner
      simulateOrderPlacement('CARD');
    } else if (razorpayMethod === 'upi') {
      if (selectedUpiApp === 'other' && !upiId) {
        alert("Please enter your UPI ID.");
        return;
      }

      // Check if user is on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      let upiProviderLabel = 'UPI';
      if (selectedUpiApp === 'gpay') upiProviderLabel = 'GOOGLE_PAY';
      else if (selectedUpiApp === 'phonepe') upiProviderLabel = 'PHONEPE';
      else if (selectedUpiApp === 'paytm') upiProviderLabel = 'PAYTM';

      if (isMobile) {
        // Build standard UPI deep link to redirect to their app
        const upiLink = `upi://pay?pa=beemagic777@okaxis&pn=Bee%20Magic&am=${total.toFixed(2)}&cu=INR&tn=Order%20Payment`;
        
        // Trigger redirect to the UPI app
        window.location.href = upiLink;
        
        // Show loading spinner while redirecting
        setPaymentStep(2);
        simulateOrderPlacement(upiProviderLabel);
      } else {
        // Show Desktop QR code screen
        setPaymentStep(4);
        
        // Simulate scanning and payment completion after 6 seconds
        setTimeout(() => {
          setPaymentStep(2); // Show processing payment
          simulateOrderPlacement(upiProviderLabel);
        }, 6000);
      }
    }
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
                      <img src={formatImageUrl(item.image)} alt={item.title || item.name} />
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

      {/* Razorpay Gateway Mock Overlay */}
      {showRazorpay && (
        <div className="razorpay-overlay">
          <div className="razorpay-container">
            {paymentStep === 1 && (
              <>
                <div className="razorpay-header">
                  <div className="razorpay-merchant-info">
                    <div className="razorpay-icon">R</div>
                    <div>
                      <h3 className="merchant-name">Bee Magic</h3>
                      <p className="merchant-desc">Order checkout</p>
                    </div>
                  </div>
                  <div className="razorpay-amount-box">
                    <span className="rzp-label">Amount to Pay</span>
                    <span className="rzp-amount">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="razorpay-body">
                  <div className="razorpay-sidebar">
                    <button 
                      type="button" 
                      className={`sidebar-tab ${razorpayMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setRazorpayMethod('card')}
                    >
                      <CreditCard size={18} />
                      <span>Card Payment</span>
                    </button>
                    <button 
                      type="button" 
                      className={`sidebar-tab ${razorpayMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setRazorpayMethod('upi')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="upi-sidebar-icon">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                      </svg>
                      <span>UPI Options</span>
                    </button>
                  </div>

                  <div className="razorpay-main-content">
                    {razorpayMethod === 'card' && (
                      <div className="razorpay-card-form reveal-on-scroll">
                        <h4>Enter Card Details</h4>
                        
                        <div className="rzp-form-group">
                          <label>Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444" 
                            maxLength={19}
                            value={cardNo}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              setCardNo(val);
                            }}
                            required
                          />
                        </div>

                        <div className="rzp-form-row">
                          <div className="rzp-form-group">
                            <label>Expiry Date</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\//g, '');
                                if (val.length >= 2) {
                                  val = val.substring(0, 2) + '/' + val.substring(2);
                                }
                                setCardExpiry(val);
                              }}
                              required
                            />
                          </div>
                          <div className="rzp-form-group">
                            <label>CVV</label>
                            <input 
                              type="password" 
                              placeholder="123" 
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              required
                            />
                          </div>
                        </div>

                        <div className="rzp-form-group">
                          <label>Cardholder Name</label>
                          <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {razorpayMethod === 'upi' && (
                      <div className="razorpay-upi-form reveal-on-scroll">
                        <h4>Select UPI Application</h4>
                        
                        <div className="upi-app-grid">
                          <button 
                            type="button" 
                            className={`upi-app-item ${selectedUpiApp === 'gpay' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('gpay')}
                          >
                            <div className="upi-logo gpay"></div>
                            <span>Google Pay</span>
                          </button>
                          <button 
                            type="button" 
                            className={`upi-app-item ${selectedUpiApp === 'phonepe' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('phonepe')}
                          >
                            <div className="upi-logo phonepe"></div>
                            <span>PhonePe</span>
                          </button>
                          <button 
                            type="button" 
                            className={`upi-app-item ${selectedUpiApp === 'paytm' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('paytm')}
                          >
                            <div className="upi-logo paytm"></div>
                            <span>Paytm</span>
                          </button>
                          <button 
                            type="button" 
                            className={`upi-app-item ${selectedUpiApp === 'other' ? 'selected' : ''}`}
                            onClick={() => setSelectedUpiApp('other')}
                          >
                            <div className="upi-logo upi-generic"></div>
                            <span>Other UPI ID</span>
                          </button>
                        </div>

                        {selectedUpiApp === 'other' && (
                          <div className="rzp-form-group" style={{ marginTop: '1.25rem' }}>
                            <label>Enter Virtual Payment Address (VPA)</label>
                            <input 
                              type="text" 
                              placeholder="username@okaxis" 
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="razorpay-footer">
                  <button 
                    type="button" 
                    className="rzp-btn-cancel"
                    onClick={() => setShowRazorpay(false)}
                  >
                    Cancel Payment
                  </button>
                  <button 
                    type="button" 
                    className="rzp-btn-pay"
                    onClick={handlePayMock}
                  >
                    Pay ₹{total.toFixed(2)}
                  </button>
                </div>
              </>
            )}

            {paymentStep === 2 && (
              <div className="razorpay-loader-screen">
                <div className="rzp-spinner"></div>
                <h3>Processing Payment</h3>
                <p>Please do not refresh the page or click back.</p>
                <div className="rzp-secured-by">Secured by Razorpay</div>
              </div>
            )}

            {paymentStep === 3 && (
              <div className="razorpay-success-screen">
                <div className="rzp-success-checkmark-wrapper">
                  <div className="rzp-checkmark-circle">
                    <div className="rzp-checkmark-kick"></div>
                    <div className="rzp-checkmark-stem"></div>
                  </div>
                </div>
                <h3>Payment Successful!</h3>
                <p>Redirecting to order confirmation...</p>
              </div>
            )}

            {paymentStep === 4 && (
              <div className={`razorpay-qr-screen brand-${selectedUpiApp}`}>
                <div className="qr-header">
                  <div className="upi-logo header-logo"></div>
                  <h3>
                    Pay using {selectedUpiApp === 'gpay' && 'Google Pay'}
                    {selectedUpiApp === 'phonepe' && 'PhonePe'}
                    {selectedUpiApp === 'paytm' && 'Paytm'}
                    {selectedUpiApp === 'other' && 'UPI'}
                  </h3>
                </div>
                
                <div className="qr-body">
                  <div className="rzp-qr-wrapper">
                    <svg className="rzp-qr-code" width="160" height="160" viewBox="0 0 29 29" shapeRendering="crispEdges">
                      <path fill="#ffffff" d="M0 0h29v29H0z"/>
                      <path fill="#000000" d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0zm9 0h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm1-3h1v1h-1zm3 0h1v1h-1zm0 2h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 0h1v1h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-5-8h1v1h-1zm3 0h1v1h-1zm-2 1h1v1h-1zm3 0h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-3 2h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 0h1v1h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-15 1h1v1h-1zm1 1h1v1h-1zm-1 1h1v1h-1zm1 1h1v1h-1zm1-3h1v1h-1zm3 0h1v1h-1zm0 2h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 0h1v1h-1zm-2 2h1v1h-1zm2 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zM2 2h3v3H2zm20 0h3v3h-3zM2 24h3v3H2z"/>
                    </svg>
                    <div className="rzp-qr-app-logo">
                      {selectedUpiApp === 'gpay' && <span className="logo-text">GPay</span>}
                      {selectedUpiApp === 'phonepe' && <span className="logo-text">PhonePe</span>}
                      {selectedUpiApp === 'paytm' && <span className="logo-text">Paytm</span>}
                      {selectedUpiApp === 'other' && <span className="logo-text">UPI</span>}
                    </div>
                  </div>
                  
                  <div className="qr-info">
                    <div className="qr-amount">₹{total.toFixed(2)}</div>
                    <p className="qr-instructions">
                      Open your {selectedUpiApp === 'gpay' && 'Google Pay'}
                      {selectedUpiApp === 'phonepe' && 'PhonePe'}
                      {selectedUpiApp === 'paytm' && 'Paytm'}
                      {selectedUpiApp === 'other' && 'UPI'} app on your phone to scan this QR code.
                    </p>
                    <div className="qr-timer">
                      Expires in: <span className="timer-countdown">{formatTimer(qrTimer)}</span>
                    </div>
                    <div className="qr-status-indicator">
                      <span className="pulse-dot"></span>
                      <span>Waiting for scanning verification...</span>
                    </div>
                  </div>
                </div>
                
                <div className="razorpay-footer">
                  <button 
                    type="button" 
                    className="rzp-btn-cancel"
                    onClick={() => setPaymentStep(1)}
                  >
                    Back to payment modes
                  </button>
                  <div className="rzp-secured-by" style={{ margin: 0 }}>Secured by Razorpay</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
