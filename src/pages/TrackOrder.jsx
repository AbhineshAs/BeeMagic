import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Truck, Check, HelpCircle, Package, Clock, ArrowLeft, Loader, Star, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function TrackOrder() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderIdStr = searchParams.get('id');
  const orderId = orderIdStr ? parseInt(orderIdStr) : null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review & Rating states
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [submittingReview, setSubmittingReview] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  const handleRatingChange = (productId, rating) => {
    setReviewRatings(prev => ({ ...prev, [productId]: rating }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviewComments(prev => ({ ...prev, [productId]: comment }));
  };

  const submitProductReview = async (productId, productName) => {
    const rating = reviewRatings[productId] || 5;
    const comment = reviewComments[productId] || '';

    setSubmittingReview(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          userName: user?.name || 'Anonymous Beeliever',
          rating: rating,
          comment: comment
        })
      });

      if (response.ok) {
        setSubmittedReviews(prev => ({ ...prev, [productId]: true }));
        alert(`Thank you for reviewing ${productName}!`);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Error submitting review: " + err.message);
    } finally {
      setSubmittingReview(prev => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setLoading(true);
      fetch(`${API_URL}/api/orders/user/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load orders");
          return res.json();
        })
        .then(data => {
          setOrders(data);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const activeOrder = orderId ? orders.find(o => o.id === orderId) : null;

  const handleSelectOrder = (id) => {
    setSearchParams({ id: String(id) });
  };

  const handleClearSelection = () => {
    setSearchParams({});
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'X-User-Id': user?.id,
          'X-User-Role': user?.role
        }
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        alert("Order canceled successfully.");
      } else {
        const errMsg = await response.text();
        alert(`Failed to cancel order: ${errMsg}`);
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("An error occurred: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepStatus = (stepName) => {
    if (!activeOrder) return 'pending';
    const status = activeOrder.status || 'PENDING';
    const steps = ['PENDING', 'PACKED', 'SHIPPED', 'DELIVERED'];

    const currentIdx = steps.indexOf(status);
    const stepIdx = steps.indexOf(stepName);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  const getLineStatus = (startStep, endStep) => {
    if (!activeOrder) return '';
    const status = activeOrder.status || 'PENDING';
    const steps = ['PENDING', 'PACKED', 'SHIPPED', 'DELIVERED'];
    const currentIdx = steps.indexOf(status);
    const endIdx = steps.indexOf(endStep);

    if (currentIdx >= endIdx) return 'completed';
    if (currentIdx === endIdx - 1) return 'active';
    return '';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'We have received your order. The hive is preparing your sweet selections!';
      case 'PACKED':
        return 'Your liquid gold has been packed in secure glass jars and is ready for courier hand-off.';
      case 'SHIPPED':
        return 'Your order is in transit! It left our distribution apiary and is on its way.';
      case 'DELIVERED':
        return 'Delivered! Your golden parcel has arrived. Enjoy the magic!';
      default:
        return 'Your order is being processed by the master beekeepers.';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="track-order-page">
        <Navbar />
        <main className="track-order-main" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#5d4037', fontSize: '2.5rem', marginBottom: '1rem' }}>Track Your Golden Package</h2>
          <p style={{ color: '#8d6e63', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px' }}>
            Please log in to view and track your artisanal honey orders.
          </p>
          <Link to="/login" className="primary-cta-btn" style={{ textDecoration: 'none', background: '#795548', color: 'white', padding: '0.8rem 2.5rem', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(121, 85, 72, 0.2)' }}>
            Log In Here
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="track-order-page">
        <Navbar />
        <main className="track-order-main" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', color: '#795548' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Gathering honey hive logistics...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate prices if active order exists
  const itemsSubtotal = activeOrder?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  // Handle legacy orders and discount gracefully
  const difference = (activeOrder?.totalAmount || 0) - itemsSubtotal;
  let estimatedTax = 0;
  let estimatedShipping = 0;
  let discount = 0;
  if (difference > 0.01) {
    estimatedTax = itemsSubtotal * 0.08;
    estimatedShipping = Math.max(0, activeOrder.totalAmount - itemsSubtotal - estimatedTax);
  } else if (difference < -0.01) {
    discount = Math.abs(difference);
  }

  return (
    <div className="track-order-page">
      <Navbar />

      <main className="track-order-main">
        {!activeOrder ? (
          <>
            <header className="tracking-header page-fade-in">
              <span className="tracking-label">HONEY HARVEST LEDGER</span>
              <h1>Your Orders</h1>
              <p className="order-meta">View details and track shipments for your boutique honey selections.</p>
            </header>

            <section className="tracking-order-details reveal-on-scroll slide-up" style={{ marginTop: '2rem', width: '100%', maxWidth: '800px', margin: '2rem auto' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '24px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
                  <p style={{ fontSize: '1.3rem', color: '#5d4037', fontWeight: 600 }}>No sweet orders found yet!</p>
                  <p style={{ color: '#8d6e63', marginTop: '0.5rem', marginBottom: '2.5rem' }}>Browse our organic collections and treat yourself to liquid gold today.</p>
                  <Link to="/shop" className="primary-cta-btn" style={{ textDecoration: 'none', background: '#795548', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '12px', fontWeight: 700 }}>
                    Shop Honey Collections
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order.id} className="tracking-details-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 8px 32px rgba(93, 64, 55, 0.05)' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#5d4037' }}>Order #BM-{order.id}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#8d6e63', marginTop: '0.3rem' }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        
                        {/* Product Thumbnails */}
                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                          {order.items?.map((item, idx) => (
                            item.image && (
                              <img 
                                key={idx} 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #efebe9', boxShadow: '0 2px 8px rgba(93, 64, 55, 0.08)' }} 
                                title={item.name}
                              />
                            )
                          ))}
                        </div>

                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3e2723', marginTop: '1rem' }}>
                          Total: ₹{(order.totalAmount || 0).toFixed(2)} ({order.items?.length || 0} items)
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span className="badge-v2" style={{ position: 'static', padding: '0.5rem 1.2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '8px', background: order.status === 'CANCELED' ? '#ffebee' : '#e8f5e9', color: order.status === 'CANCELED' ? '#c62828' : '#2e7d32' }}>
                          {order.status || 'PENDING'}
                        </span>
                        
                        {(order.status === 'PENDING' || order.status === 'PACKED') && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order.id);
                            }}
                            style={{ 
                              background: '#fff5f5', 
                              color: '#e53e3e', 
                              border: '1px solid #fed7d7', 
                              padding: '0.8rem 1.8rem', 
                              borderRadius: '12px', 
                              fontWeight: 700, 
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#fed7d7';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#fff5f5';
                            }}
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => handleSelectOrder(order.id)}
                          style={{
                            background: '#795548',
                            color: 'white',
                            border: 'none',
                            padding: '0.8rem 1.8rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(121, 85, 72, 0.15)'
                          }}
                        >
                          Track Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            <header className="tracking-header page-fade-in">
              <button
                onClick={handleClearSelection}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#8d6e63',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontSize: '0.95rem'
                }}
              >
                <ArrowLeft size={16} /> Back to Order History
              </button>
              <br />
              <span className="tracking-label">TRACK YOUR GOLDEN PACKAGE</span>
              <h1>Order #BM-{activeOrder.id}</h1>
              <p className="order-meta">
                Placed on {formatDate(activeOrder.createdAt)} • {activeOrder.items?.length || 0} Items
              </p>
            </header>

            {/* Delivery Status Card */}
            <section className="delivery-status-card reveal-on-scroll slide-up">
              <div className="status-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Delivery Status</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="status-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: activeOrder.status === 'CANCELED' ? '#ffebee' : '#fbe9e7', color: activeOrder.status === 'CANCELED' ? '#c62828' : '#5d4037' }}>
                    <Truck size={14} />
                    {activeOrder.status || 'PENDING'}
                  </div>
                  {(activeOrder.status === 'PENDING' || activeOrder.status === 'PACKED') && (
                    <button 
                      onClick={() => handleCancelOrder(activeOrder.id)}
                      style={{
                        background: '#fff5f5',
                        color: '#e53e3e',
                        border: '1px solid #fed7d7',
                        padding: '0.4rem 1rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fed7d7'}
                      onMouseLeave={(e) => e.target.style.background = '#fff5f5'}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Responsive custom progress stepper */}
              {activeOrder.status === 'CANCELED' ? (
                <>
                  <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '16px', padding: '1.5rem', margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', color: '#c62828', textAlign: 'left' }}>
                    <Clock size={28} />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>This Order has been Canceled</h3>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#d32f2f', lineHeight: 1.4 }}>
                        The honey harvest transaction has been voided. If you have any inquiries regarding refunds or cancellation details, please reach out to our support channel.
                      </p>
                    </div>
                  </div>

                  <div className="tracking-stepper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2.5rem 0', gap: '2rem' }}>
                    {/* Step 1: Ordered */}
                    <div className="tracking-step completed" style={{ textAlign: 'center', flex: '0 1 150px' }}>
                      <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2e7d32', color: 'white' }}>
                        <Check size={20} />
                      </div>
                      <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem', color: '#2e7d32' }}>Ordered</span>
                      <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{formatDate(activeOrder.createdAt)}</span>
                    </div>
                    
                    {/* Red Connection Line */}
                    <div style={{ flex: '0 1 100px', height: '4px', background: '#d32f2f' }}></div>

                    {/* Step 2: Canceled */}
                    <div className="tracking-step active" style={{ textAlign: 'center', flex: '0 1 150px' }}>
                      <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d32f2f', color: 'white', border: 'none' }}>
                        <X size={20} />
                      </div>
                      <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem', color: '#d32f2f' }}>Canceled</span>
                      {activeOrder.canceledAt && (
                        <span style={{ fontSize: '0.75rem', color: '#d32f2f' }}>{formatDate(activeOrder.canceledAt)}</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="tracking-stepper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2rem 0', flexWrap: 'wrap', gap: '1rem' }}>
                  {/* Step 1: Ordered */}
                  <div className={`tracking-step ${getStepStatus('PENDING')}`} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                    <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} />
                    </div>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>Ordered</span>
                    <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{formatDate(activeOrder.createdAt)}</span>
                  </div>

                  {/* Line 1 */}
                  <div className={`tracking-line ${getLineStatus('PENDING', 'PACKED')}`} style={{ flex: '1', height: '2px', minWidth: '20px' }}></div>

                  {/* Step 2: Packed */}
                  <div className={`tracking-step ${getStepStatus('PACKED')}`} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                    <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getStepStatus('PACKED') === 'completed' ? <Check size={14} /> : <Package size={14} />}
                    </div>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>Packed</span>
                    {activeOrder.packedAt && (
                      <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{formatDate(activeOrder.packedAt)}</span>
                    )}
                  </div>

                  {/* Line 2 */}
                  <div className={`tracking-line ${getLineStatus('PACKED', 'SHIPPED')}`} style={{ flex: '1', height: '2px', minWidth: '20px' }}></div>

                  {/* Step 3: Shipped */}
                  <div className={`tracking-step ${getStepStatus('SHIPPED')}`} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                    <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getStepStatus('SHIPPED') === 'completed' ? <Check size={14} /> : <Truck size={14} />}
                    </div>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>Shipped</span>
                    {activeOrder.shippedAt && (
                      <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{formatDate(activeOrder.shippedAt)}</span>
                    )}
                  </div>

                  {/* Line 3 */}
                  <div className={`tracking-line ${getLineStatus('SHIPPED', 'DELIVERED')}`} style={{ flex: '1', height: '2px', minWidth: '20px' }}></div>

                  {/* Step 4: Delivered */}
                  <div className={`tracking-step ${getStepStatus('DELIVERED')}`} style={{ textAlign: 'center', flex: 1, minWidth: '100px' }}>
                    <div className="step-dot" style={{ margin: '0 auto 0.5rem', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} />
                    </div>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem' }}>Delivered</span>
                    {activeOrder.deliveredAt && (
                      <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>{formatDate(activeOrder.deliveredAt)}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="latest-update-card">
                <div className="update-icon"><Clock size={20} /></div>
                <div className="update-info">
                  <h4>Logistics Update</h4>
                  <p>{getStatusText(activeOrder.status)}</p>
                </div>
              </div>
            </section>

            {/* Map Section */}
            <section className="tracking-map-container reveal-on-scroll zoom-in">
              <div className="map-placeholder">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&q=80" alt="Tracking Map" />
                <div className="map-overlay"></div>
                <div className="map-marker-pin">
                  <div className="marker-dot"></div>
                  <div className="marker-pulse"></div>
                </div>

                <div className="current-location-card">
                  <div className="loc-icon-bg">
                    <MapPin size={20} />
                  </div>
                  <div className="loc-info">
                    <span className="loc-label">LOGISTICS STEP</span>
                    <h4>{activeOrder.status || 'PENDING'} STATUS</h4>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Details */}
            <section className="tracking-order-details reveal-on-scroll slide-up">
              <h2>Order Items & Details</h2>
              <div className="tracking-details-card">
                <div className="order-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeOrder.items?.map((item, index) => {
                    const pId = item.productId;
                    const isDelivered = activeOrder.status === 'DELIVERED';
                    const hasSubmitted = submittedReviews[pId];
                    const currentRating = reviewRatings[pId] || 0;
                    const isSubmitting = submittingReview[pId];

                    return (
                      <div key={item.id || index} style={{ borderBottom: '1px solid #f9f9f9', padding: '1.2rem 0' }}>
                        <div className="order-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {item.image && (
                              <div className="item-thumb" style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                            <div>
                              <h4 style={{ fontWeight: 600, color: '#3e2723' }}>{item.name}</h4>
                              <p style={{ fontSize: '0.85rem', color: '#8d6e63' }}>Quantity: {item.quantity} • Price: ₹{item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="item-price" style={{ fontWeight: 700, color: '#795548' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>

                        {/* Rating and Review section after delivery */}
                        {isDelivered && (
                          <div style={{ marginTop: '1rem', background: '#faf8f5', padding: '1.2rem', borderRadius: '12px', border: '1px dashed #d7ccc8', textAlign: 'left' }}>
                            {hasSubmitted ? (
                              <p style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                                <Check size={16} /> Review submitted! Thank you for sharing your experience.
                              </p>
                            ) : (
                              <div>
                                <h5 style={{ color: '#5d4037', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Rate & Review this Honey</h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={20}
                                      fill={star <= currentRating ? "#f59e0b" : "none"}
                                      color={star <= currentRating ? "#f59e0b" : "#d7ccc8"}
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => handleRatingChange(pId, star)}
                                    />
                                  ))}
                                  <span style={{ fontSize: '0.85rem', color: '#8d6e63', marginLeft: '0.5rem' }}>
                                    {currentRating > 0 ? `${currentRating} Stars` : "Select stars"}
                                  </span>
                                </div>
                                <textarea
                                  placeholder="Write a brief comment about this honey's aroma, flavor, and texture..."
                                  value={reviewComments[pId] || ''}
                                  onChange={(e) => handleCommentChange(pId, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '0.85rem',
                                    minHeight: '60px',
                                    resize: 'vertical',
                                    marginBottom: '0.8rem',
                                    fontFamily: 'inherit'
                                  }}
                                />
                                <button
                                  onClick={() => submitProductReview(pId, item.name)}
                                  disabled={currentRating === 0 || isSubmitting}
                                  style={{
                                    background: currentRating === 0 ? '#d7ccc8' : '#795548',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: currentRating === 0 ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="track-summary">
                  <div className="summary-row">
                    <span>Items Subtotal</span>
                    <span>₹{itemsSubtotal.toFixed(2)}</span>
                  </div>
                  {estimatedShipping > 0 ? (
                    <div className="summary-row">
                      <span>Shipping fee</span>
                      <span>₹{estimatedShipping.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="summary-row">
                      <span>Shipping fee</span>
                      <span style={{ color: '#2e7d32', fontWeight: 600 }}>FREE</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="summary-row">
                      <span>Special Offer</span>
                      <span style={{ color: '#2e7d32', fontWeight: 600 }}>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  {estimatedTax > 0 && (
                    <div className="summary-row">
                      <span>Estimated Tax (8%)</span>
                      <span>₹{estimatedTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total Paid</span>
                    <span className="gold-text">₹{(activeOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="shipping-address-block">
                  <div className="addr-header">
                    <Package size={16} />
                    <span>Shipping Destination</span>
                  </div>
                  <address style={{ fontStyle: 'normal', color: '#5d4037', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    {activeOrder.user?.name || user?.name}<br />
                    {activeOrder.shippingAddress || "123 Artisan Lane, Amberville, CA"}
                  </address>
                </div>

                {/* Return Policy Notice */}
                <div style={{ marginTop: '1.5rem', padding: '1rem 1.2rem', background: '#fff9f9', border: '1px solid #ffebee', borderRadius: '12px', display: 'flex', gap: '0.8rem', alignItems: 'flex-start', textAlign: 'left' }}>
                  <HelpCircle size={18} color="#d32f2f" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.85rem', color: '#c62828', fontWeight: 700 }}>Return & Exchange Policy</h5>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#b71c1c', lineHeight: 1.4 }}>
                      Due to the organic, food-grade nature of our artisanal honey collections, all products are non-returnable. We enforce a strict **No Return Policy** to maintain pristine quality and health safety standards.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
