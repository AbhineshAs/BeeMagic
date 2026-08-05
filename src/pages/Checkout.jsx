import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CreditCard, ChevronDown, Check, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_URL from '../config/api';

const indiaData = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Anantapur", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Pasighat", "Namsai", "Ziro"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur"],
  "Delhi": ["Delhi", "New Delhi", "Dwarka", "Rohini", "Saket", "Vasant Kunj"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Rohtak", "Hisar", "Karnal", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Baddi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Shimoga", "Udupi"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kottayam", "Kannur"],
  "Ladakh": ["Leh", "Kargil"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai", "Kalyan-Dombivli"],
  "Manipur": ["Imphal", "Thoubal", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Nagercoil"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Tripura": ["Agartala", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Noida", "Greater Noida", "Bareilly", "Aligarh", "Gorakhpur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Kharagpur", "Darjeeling"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu"],
  "Lakshadweep": ["Kavaratti"]
};

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

export default function Checkout() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const [buyNowItem, setBuyNowItem] = useState(location.state?.buyNowItem || null);
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const handleDecreaseQuantity = (item) => {
    if (buyNowItem) {
      if (buyNowItem.quantity > 1) {
        setBuyNowItem(prev => ({ ...prev, quantity: prev.quantity - 1 }));
      }
    } else {
      if (item.quantity > 1) {
        updateQuantity(item.id, item.quantity - 1);
      } else {
        removeFromCart(item.id);
      }
    }
  };

  const handleIncreaseQuantity = (item) => {
    if (buyNowItem) {
      setBuyNowItem(prev => ({ ...prev, quantity: prev.quantity + 1 }));
    } else {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: ''
  });

  const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0.00; 
  const taxes = 0.00;
  const discount = checkoutItems.length > 0 ? 50.00 : 0.00;
  const total = Math.max(0, subtotal - discount);

  // Autofill address from user's registered details
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const addressParts = (user.address || '').split(',');
      const street = addressParts[0] || '';
      const city = addressParts[1]?.trim() || '';
      const state = addressParts[2]?.trim() || 'Maharashtra';
      const zipCode = addressParts[3]?.trim() || '';

      setShippingInfo(prev => ({
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        street: prev.street || street,
        city: prev.city || city,
        state: prev.state || state,
        zipCode: prev.zipCode || zipCode
      }));
    }
  }, [user]);

  const handleStateChange = (selectedState) => {
    const defaultCity = indiaData[selectedState] ? indiaData[selectedState][0] : '';
    setShippingInfo(prev => ({
      ...prev,
      state: selectedState,
      city: defaultCity
    }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to complete your order.");
      return;
    }
    if (checkoutItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // Simple Validation
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.street || !shippingInfo.city || !shippingInfo.zipCode) {
      alert("Please fill in all shipping details first.");
      return;
    }

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Are you connected to the internet?");
        setIsProcessing(false);
        return;
      }

      const amountInPaise = Math.round(total * 100);
      const orderResponse = await fetch(`${API_URL}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise })
      });

      if (!orderResponse.ok) {
        const errText = await orderResponse.text();
        throw new Error(errText || "Failed to initiate transaction.");
      }

      const orderData = await orderResponse.json();
      const { orderId, keyId, mock } = orderData;

      if (mock || !keyId || keyId === "rzp_test_demo") {
        const fullAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`;
        const demoPaymentId = "pay_demo_" + Math.random().toString(36).substring(2, 12);
        
        const localOrderResponse = await fetch(`${API_URL}/api/orders/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalAmount: total,
            shippingAddress: fullAddress,
            paymentMethod: 'RAZORPAY (DEMO MODE)',
            paymentId: demoPaymentId,
            razorpayOrderId: orderId,
            items: checkoutItems.map(item => ({
              productId: String(item.productId),
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image
            }))
          })
        });

        if (localOrderResponse.ok) {
          if (!buyNowItem) {
            await clearCart();
          }
          alert("Order placed successfully!");
          navigate('/track-order');
        } else {
          const errText = await localOrderResponse.text();
          throw new Error(`Failed to place order: ${errText || localOrderResponse.statusText}`);
        }
        return;
      }

      const options = {
        key: keyId,
        amount: amountInPaise,
        currency: "INR",
        name: "Bee Magic",
        description: "Order Checkout",
        order_id: orderId,
        theme: {
          color: "#E8A020"
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: user?.email || "",
          contact: user?.phoneNumber || ""
        },
        handler: async function (response) {
          setIsProcessing(true);
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verificationResult = await verifyResponse.json();

            if (!verifyResponse.ok || verificationResult.status !== 'success') {
              throw new Error(verificationResult.message || "Payment signature verification failed.");
            }

            const fullAddress = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}`;
            
            const localOrderResponse = await fetch(`${API_URL}/api/orders/${user.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                totalAmount: total,
                shippingAddress: fullAddress,
                paymentMethod: 'RAZORPAY',
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                items: checkoutItems.map(item => ({
                  productId: String(item.productId),
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image
                }))
              })
            });

            if (localOrderResponse.ok) {
              if (!buyNowItem) {
                await clearCart();
              }
              alert("Order placed successfully! Payment verified via Razorpay.");
              navigate('/track-order');
            } else {
              const errText = await localOrderResponse.text();
              throw new Error(`Failed to place order in local database: ${errText || localOrderResponse.statusText} (${localOrderResponse.status})`);
            }
          } catch (err) {
            console.error("Order completion error:", err);
            alert(err.message || "An error occurred while confirming payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout initiation error:", err);
      alert(err.message || "Failed to start checkout. Please try again.");
      setIsProcessing(false);
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
                    <div className="select-wrapper">
                      <select 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      >
                        {(indiaData[shippingInfo.state] || []).map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <div className="select-wrapper">
                      <select 
                        value={shippingInfo.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                      >
                        {Object.keys(indiaData).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input 
                    type="text" 
                    placeholder="400001" 
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    required 
                  />
                </div>
              </form>
            </section>

            {/* Payment Gateway Section */}
            <section className="checkout-section card">
              <h2>Secure Razorpay Checkout</h2>
              <div className="payment-options">
                <div className="payment-option selected">
                  <div className="option-header">
                    <div className="radio-circle"></div>
                    <div className="option-info">
                      <span>Pay via Razorpay Payment Gateway</span>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#78716c' }}>
                        Supports Cards, Netbanking, UPI (GPay, PhonePe, Paytm), and Wallets securely.
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
                {checkoutItems.length > 0 ? checkoutItems.map((item, index) => (
                  <div key={item.id || index} className="summary-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                      <div className="item-img" style={{ flexShrink: 0 }}>
                        <img src={item.image} alt={item.title || item.name} />
                      </div>
                      <div className="item-details" style={{ minWidth: 0 }}>
                        <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || item.name}</h4>
                        <p>{item.subtitle || 'Boutique Selection'}</p>
                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="checkout-qty-controls" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#faf8f5', border: '1px solid #d7ccc8', borderRadius: '25px', padding: '0.25rem 0.6rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleDecreaseQuantity(item)}
                        style={{ background: 'white', border: '1px solid #e0d6d2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', color: '#5d4037', fontWeight: 700, padding: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        title="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3e2723', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncreaseQuantity(item)}
                        style={{ background: 'white', border: '1px solid #e0d6d2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', color: '#5d4037', fontWeight: 700, padding: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        title="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
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
                disabled={isProcessing || checkoutItems.length === 0}
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
