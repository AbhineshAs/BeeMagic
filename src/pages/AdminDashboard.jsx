import { useState, useEffect } from 'react';
import {
  Search, ShoppingBag, Menu, TrendingUp, DollarSign,
  Users, Zap, Plus, Settings, BarChart2, Home, Package,
  User, ChevronRight, Bell, Trash2, Edit3, X, Check, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '', collection: 'ARTISANAL PURE HONEY', badge: '', price: '', oldPrice: '', image: '', stock: 100, description: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showFullLedger, setShowFullLedger] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerFilterStatus, setLedgerFilterStatus] = useState('ALL');

  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [showFullReviews, setShowFullReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
  const sortedProducts = [...products].sort((a, b) => b.id - a.id);

  const filteredProducts = sortedProducts.filter(p => 
    p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    (p.collection || '').toLowerCase().includes(catalogSearch.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch =
      String(order.id).includes(ledgerSearch) ||
      (order.user?.name || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (order.user?.phoneNumber || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (order.shippingAddress || '').toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (order.items || []).some(item => item.name.toLowerCase().includes(ledgerSearch.toLowerCase()));

    const matchesStatus = ledgerFilterStatus === 'ALL' || order.status === ledgerFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const [isLiveMode, setIsLiveMode] = useState(true);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLiveMode) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLiveMode, user]);

  const fetchData = async (isPoll = false) => {
    if (!isPoll) setLoading(true);
    try {
      const headers = { 'X-User-Role': user?.role };
      const [prodRes, orderRes, countRes, revRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders/all', { headers }),
        fetch('/api/auth/users/count'),
        fetch('/api/reviews')
      ]);

      if (prodRes.ok) {
        const prods = await prodRes.json();
        setProducts(prods);
      } else {
        console.error("Failed to fetch products");
      }

      if (orderRes.ok) {
        const ords = await orderRes.json();
        setOrders(ords);
      } else {
        console.error("Failed to fetch orders");
      }

      if (countRes.ok) {
        const countData = await countRes.json();
        setCustomerCount(countData.count || 0);
      } else {
        console.error("Failed to fetch customer count");
      }

      if (revRes.ok) {
        const revs = await revRes.json();
        setReviews(revs);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleStartAdd = () => {
    setEditingProduct(null);
    setNewProduct({
      title: '',
      collection: 'ARTISANAL PURE HONEY',
      badge: '',
      price: '',
      oldPrice: '',
      image: '',
      stock: 100,
      description: ''
    });
    setImageFile(null);
    setPreviewUrl(null);
    setShowAddForm(true);
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      collection: product.collection || 'ARTISANAL PURE HONEY',
      badge: product.badge || '',
      price: product.price.toString(),
      oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
      image: product.image || '',
      stock: product.stock || 100,
      description: product.description || ''
    });
    setImageFile(null);
    setPreviewUrl(product.image || null);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = newProduct.image;

      // 1. Upload image if a file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        ...newProduct,
        image: finalImageUrl,
        price: parseFloat(newProduct.price),
        oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
        stock: parseInt(newProduct.stock) || 0
      };

      if (editingProduct) {
        // Edit Mode
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': user?.role
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
          setShowAddForm(false);
          setEditingProduct(null);
          setImageFile(null);
          setPreviewUrl(null);
          setNewProduct({
            title: '', collection: 'ARTISANAL PURE HONEY', badge: '', price: '', oldPrice: '', image: '', stock: 100, description: ''
          });
          alert("Success! The product has been updated.");
        } else {
          alert("Failed to update product. Check your permissions.");
        }
      } else {
        // Add Mode
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': user?.role
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(prev => [...prev, data]);
          setShowAddForm(false);
          setImageFile(null);
          setPreviewUrl(null);
          setNewProduct({
            title: '', collection: 'ARTISANAL PURE HONEY', badge: '', price: '', oldPrice: '', image: '', stock: 100, description: ''
          });
          alert("Success! The new liquid gold has been added to the catalog.");
        } else {
          alert("Failed to add product. Check your permissions.");
        }
      }
    } catch (err) {
      console.error("Submit product error:", err);
      alert("An error occurred: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product? It will be gone from the shop immediately.")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Role': user?.role }
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete. Admins only.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Role': user?.role }
      });
      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        fetchData();
        alert("Review deleted successfully.");
      } else {
        alert("Failed to delete review. Admins only.");
      }
    } catch (err) {
      console.error("Delete review error:", err);
      alert("An error occurred: " + err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': user?.role
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        alert(`Order #${orderId} status updated to ${newStatus}!`);
      } else {
        alert("Failed to update order status. Check your permissions.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("An error occurred: " + err.message);
    }
  };

  // Helper calculations for dynamic dashboard stats
  const getDashboardStats = () => {
    const today = new Date().toDateString();

    // Yesterday's date string
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // 1. Daily Sales (Non-canceled orders placed today)
    const todayOrders = orders.filter(o => {
      const dateStr = new Date(o.createdAt).toDateString();
      return dateStr === today && o.status !== 'CANCELED';
    });
    const dailySales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Yesterday's Sales
    const yesterdayOrders = orders.filter(o => {
      const dateStr = new Date(o.createdAt).toDateString();
      return dateStr === yesterdayStr && o.status !== 'CANCELED';
    });
    const yesterdaySales = yesterdayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Sales Growth Percentage
    let salesGrowth = 0.0;
    if (yesterdaySales > 0) {
      salesGrowth = ((dailySales - yesterdaySales) / yesterdaySales) * 100;
    } else if (dailySales > 0) {
      salesGrowth = 100.0;
    }

    // 2. Total Orders
    const totalOrders = orders.length;

    // Yesterday's total orders
    const yesterdayTotalOrdersCount = orders.filter(o => new Date(o.createdAt).toDateString() === yesterdayStr).length;
    const todayTotalOrdersCount = orders.filter(o => new Date(o.createdAt).toDateString() === today).length;

    let ordersGrowth = 0.0;
    if (yesterdayTotalOrdersCount > 0) {
      ordersGrowth = ((todayTotalOrdersCount - yesterdayTotalOrdersCount) / yesterdayTotalOrdersCount) * 100;
    } else if (todayTotalOrdersCount > 0) {
      ordersGrowth = 100.0;
    }

    // 3. Active Customers
    const activeCustomers = customerCount;

    // 4. Conversion Rate
    // Dynamic rate that fluctuates realistically relative to orders and customers
    const conversionRate = (customerCount + 125) > 0
      ? (orders.length / (customerCount + 125) * 100).toFixed(1)
      : "0.0";

    // 5. Canceled Orders Count
    const canceledOrdersCount = orders.filter(o => o.status === 'CANCELED').length;

    return {
      dailySales,
      salesGrowth,
      totalOrders,
      ordersGrowth,
      activeCustomers,
      conversionRate,
      canceledOrdersCount
    };
  };

  const stats = getDashboardStats();

  const getWeeklySalesData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentWeekSales = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    // Get start of the current week (Monday)
    const todayDate = new Date();
    const currentDay = todayDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() + distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    orders.forEach(order => {
      if (order.status === 'CANCELED') return;
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startOfWeek && orderDate < endOfWeek) {
        const dayName = days[orderDate.getDay()];
        if (currentWeekSales[dayName] !== undefined) {
          currentWeekSales[dayName] += (order.totalAmount || 0);
        }
      }
    });

    const maxVal = Math.max(...Object.values(currentWeekSales), 1);

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
      const amount = currentWeekSales[day];
      // Scale between 15% and 100% height for nice visualization, or 5% if amount is 0
      const val = amount > 0 ? Math.round((amount / maxVal) * 85) + 15 : 5;
      return {
        day,
        amount,
        val
      };
    });
  };

  const chartData = getWeeklySalesData();
  const todayDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  const handleDownloadCSV = () => {
    if (orders.length === 0) {
      alert("No orders to download!");
      return;
    }

    // Define headers
    const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Shipping Address", "Products", "Total Amount", "Status"];

    // Map order rows
    const rows = orders.map(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const customerName = order.user?.name || "N/A";
      const email = order.user?.email || "N/A";
      const phone = order.user?.phoneNumber || "N/A";
      const address = `"${(order.shippingAddress || "").replace(/"/g, '""')}"`;
      const products = `"${(order.items || []).map(item => `${item.name} (x${item.quantity})`).join(', ')}"`;
      const totalAmount = (order.totalAmount || 0).toFixed(2);
      const status = order.status || "PENDING";

      return [order.id, date, customerName, email, phone, address, products, totalAmount, status];
    });

    // Create CSV content
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    // Download trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bee_magic_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page">
      <style>{`
        .chart-bar-wrapper {
          position: relative !important;
        }
        .chart-bar {
          position: relative !important;
        }
        .chart-bar .bar-tooltip {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          background: #3e2723;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(93, 64, 55, 0.2);
          z-index: 10;
        }
        .chart-bar-wrapper:hover .bar-tooltip {
          opacity: 1;
          transform: translate(-50%, -3px);
        }
        
        /* Pulsing live dot */
        .live-dot {
          width: 8px;
          height: 8px;
          background-color: #4caf50;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          animation: pulse 1.6s infinite;
          vertical-align: middle;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
      `}</style>
      <Navbar />

      <main className="admin-main">
        {/* Header Section */}
        <div className="admin-header-v2" style={{ gridColumn: 'span 12', padding: '1rem 0' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#5d4037' }}>Hive Command Center</h1>
          <p style={{ color: '#8d6e63' }}>Manage your inventory, monitor sales, and oversee the artisanal harvest.</p>
        </div>

        {/* Stats Row */}
        <section className="admin-stats-v2">
          <div className="stat-card-v2">
            <div className={`badge-v2 ${stats.salesGrowth >= 0 ? 'green' : 'red'}`}>
              {stats.salesGrowth >= 0 ? '+' : ''}{stats.salesGrowth.toFixed(1)}%
            </div>
            <div className="card-icon-box"><DollarSign size={20} /></div>
            <span className="label">Daily Sales</span>
            <span className="value">₹{stats.dailySales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="stat-card-v2">
            <div className={`badge-v2 ${stats.ordersGrowth >= 0 ? 'green' : 'red'}`}>
              {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth.toFixed(1)}%
            </div>
            <div className="card-icon-box"><ShoppingBag size={20} /></div>
            <span className="label">Total Orders</span>
            <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {stats.totalOrders}
              {stats.canceledOrdersCount > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#c62828', background: '#ffebee', padding: '0.15rem 0.4rem', borderRadius: '6px', fontWeight: 700 }}>
                  {stats.canceledOrdersCount} Canceled
                </span>
              )}
            </span>
          </div>

          <div className="stat-card-v2">
            <div className="badge-v2 gold">Online</div>
            <div className="card-icon-box"><Users size={20} /></div>
            <span className="label">Active Customers</span>
            <span className="value">{stats.activeCustomers}</span>
          </div>

          <div className="stat-card-v2 dark">
            <div className="card-icon-box"><Zap size={20} /></div>
            <span className="label">Conversion Rate</span>
            <span className="value">{stats.conversionRate}%</span>
          </div>
        </section>

        {/* Performance Chart */}
        <section className="performance-section">
          <div className="perf-header">
            <div>
              <h2>Revenue Performance</h2>
              <p>Weekly trend analysis</p>
            </div>
            <div className="perf-btns">
              <button className="perf-btn" onClick={handleDownloadCSV}>Download CSV</button>
              <button
                className={`perf-btn ${isLiveMode ? 'active' : ''}`}
                onClick={() => setIsLiveMode(!isLiveMode)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isLiveMode && <span className="live-dot"></span>}
                Live View
              </button>
            </div>
          </div>

          <div className="chart-container">
            {chartData.map((d, i) => (
              <div key={i} className="chart-bar-wrapper">
                <div
                  className={`chart-bar ${d.day === todayDayName ? 'active' : ''}`}
                  style={{ height: `${d.val}%`, transition: 'height 0.4s ease-out' }}
                >
                  {d.amount > 0 && (
                    <span className="bar-tooltip">₹{d.amount.toFixed(0)}</span>
                  )}
                </div>
                <span className="chart-label">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions Sidebar Area */}
        <section className="quick-actions-v2">
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8d6e63', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Management</h4>
          <button className="action-card-v2" onClick={handleStartAdd}>
            <div className="icon-box"><Plus size={18} /></div>
            <span>Add New Product</span>
          </button>
          <button className="action-card-v2" onClick={() => setShowFullReviews(true)}>
            <div className="icon-box"><Star size={18} /></div>
            <span>Customer Reviews</span>
          </button>
          <button className="action-card-v2">
            <div className="icon-box"><Package size={18} /></div>
            <span>Inventory Audit</span>
          </button>
          <button className="action-card-v2">
            <div className="icon-box"><Zap size={18} /></div>
            <span>Marketing Blast</span>
          </button>
          <button className="action-card-v2">
            <div className="icon-box"><Settings size={18} /></div>
            <span>Hive Settings</span>
          </button>
        </section>

        {/* Banner */}
        <section className="admin-promo-banner">
          <div className="promo-overlay">
            <h3>Seasonal Summer Harvest</h3>
            <p>Preparation for the wildflower collection launch is 85% complete.</p>
          </div>
        </section>

        {/* Product Catalog Section */}
        <section className="recent-orders-v2" style={{ gridColumn: 'span 12', marginBottom: '2rem' }}>
          <div className="header">
            <h2>Product Catalog</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  setCatalogSearch('');
                  setShowFullCatalog(true);
                }}
                className="view-all"
                style={{ border: 'none', background: 'none', color: '#795548', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                View Full Catalog
              </button>
              <button className="view-all" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8d6e63', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={handleStartAdd}>
                <Plus size={16} /> New Product
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <form className="admin-add-form card" onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#5d4037' }}>{editingProduct ? 'Edit Collection Item' : 'New Collection Item'}</h2>
                  <button type="button" onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8d6e63' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>PRODUCT TITLE</label>
                    <input type="text" placeholder="e.g. Wildflower Gold" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>PRICE (₹)</label>
                    <input type="number" step="0.01" placeholder="24.99" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>COLLECTION</label>
                    <input type="text" placeholder="e.g. INFUSED HONEY COLLECTION" value={newProduct.collection} onChange={e => setNewProduct({ ...newProduct, collection: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>BADGE</label>
                    <input type="text" placeholder="e.g. BEST SELLER" value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>STOCK</label>
                    <input type="number" placeholder="100" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>OLD PRICE (₹, OPTIONAL)</label>
                    <input type="number" step="0.01" placeholder="e.g. 650.00" value={newProduct.oldPrice || ''} onChange={e => setNewProduct({ ...newProduct, oldPrice: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>PRODUCT IMAGE</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.4rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: '#8d6e63', fontWeight: 600 }}>IMAGE URL</label>
                      <input
                        type="text"
                        placeholder="e.g. /images/organic_honey.jpg"
                        value={newProduct.image}
                        onChange={e => {
                          setNewProduct({ ...newProduct, image: e.target.value });
                          if (!imageFile) setPreviewUrl(e.target.value);
                        }}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.2rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: '#8d6e63', fontWeight: 600 }}>OR UPLOAD FILE</label>
                      <div style={{ border: '2px dashed #eee', borderRadius: '10px', padding: '0.5rem', textAlign: 'center', position: 'relative', cursor: 'pointer', marginTop: '0.2rem', minHeight: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
                        <span style={{ fontSize: '0.75rem', color: '#8d6e63' }}>
                          {imageFile ? imageFile.name : "Choose File..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {previewUrl && (
                    <div style={{ position: 'relative', marginTop: '1rem' }}>
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px' }} />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setPreviewUrl(null);
                          setNewProduct(prev => ({ ...prev, image: '' }));
                        }}
                        style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8d6e63' }}>DESCRIPTION</label>
                  <textarea placeholder="Describe the nectar's origin..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #eee', marginTop: '0.4rem', minHeight: '100px' }} />
                </div>

                <button type="submit" disabled={isSubmitting} style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: '#795548', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer' }}>
                  {isSubmitting ? 'PREPARING THE JAR...' : (editingProduct ? 'UPDATE HIVE CATALOG' : 'ADD TO HIVE CATALOG')}
                </button>
              </form>
            </div>
          )}

          <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PREVIEW</th>
                  <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PRODUCT NAME</th>
                  <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PRICE</th>
                  <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>STOCK</th>
                  <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.slice(0, 4).map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <img src={product.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '1rem 0', fontWeight: 600, color: '#3e2723' }}>{product.title}</td>
                    <td style={{ padding: '1rem 0', color: '#795548', fontWeight: 700 }}>₹{(product.price || 0).toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className="badge-v2 gold" style={{ position: 'static' }}>{product.stock || 100} in hive</span>
                    </td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleStartEdit(product)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #eee', background: 'white', color: '#8d6e63', cursor: 'pointer' }}><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ffebee', background: '#fff9f9', color: '#d32f2f', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Orders Wide Table */}
        <section className="recent-orders-v2">
          <div className="header">
            <h2>Recent Harvest Orders</h2>
            <button
              onClick={() => {
                setLedgerSearch('');
                setLedgerFilterStatus('ALL');
                setShowFullLedger(true);
              }}
              className="view-all"
              style={{ border: 'none', background: 'none', color: '#795548', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              View Full Ledger
            </button>
          </div>
          <div className="order-list-v2">
            {sortedOrders.slice(0, 3).map((order, i) => (
              <div
                key={order.id || i}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #efebe9',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.2rem',
                  boxShadow: '0 4px 20px rgba(93, 64, 55, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  textAlign: 'left'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f2ee', paddingBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#795548' }}>#BM-{order.id}</span>
                    <span style={{ fontSize: '0.85rem', color: '#8d6e63', fontWeight: 600 }}>
                      Ordered: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {order.status === 'CANCELED' && order.canceledByCustomer && (
                      <span style={{ fontSize: '0.8rem', color: '#c62828', background: '#ffebee', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                        CANCELED BY CUSTOMER
                      </span>
                    )}
                  </div>
                  <div>
                    <select
                      value={order.status || 'PENDING'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #d7ccc8',
                        background: '#fbe9e7',
                        color: '#5d4037',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {/* Customer Info */}
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Delivery Contact</h5>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: '#3e2723', fontWeight: 700 }}>{order.user?.name || 'Artisan Customer'}</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#5d4037' }}><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#5d4037' }}><strong>Phone:</strong> {order.user?.phoneNumber || 'N/A'}</p>
                  </div>

                  {/* Destination Address */}
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Shipping Destination</h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5d4037', lineHeight: '1.5' }}>
                      {order.shippingAddress || 'N/A'}
                    </p>
                  </div>

                  {/* Products Ordered */}
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Products Ordered</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', color: '#3e2723', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>• {item.name} <strong style={{ color: '#795548', marginLeft: '0.4rem' }}>x{item.quantity}</strong></span>
                          <span style={{ fontWeight: 700, color: '#8d6e63' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      )) : (
                        <span style={{ fontSize: '0.85rem', color: '#8d6e63' }}>No products listed.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f2ee', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#8d6e63', fontWeight: 500 }}>
                    Payment Status: Paid (Online Gateway)
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3e2723' }}>
                    Total Amount: ₹{(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Branding Footer */}
        <div className="admin-branding-footer">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#5d4037', marginBottom: '1rem' }}>Bee Magic</h1>
          <p style={{ fontSize: '1rem', color: '#8d6e63', lineHeight: 1.6, maxWidth: '600px', marginBottom: '2rem' }}>
            Empowering artisanal honey boutiques through state-of-the-art management tools and sustainable growth strategies.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3e2723', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#8d6e63' }}>
                <li>Inventory Audit</li>
                <li>Staff Training</li>
                <li>Sustainability Report</li>
                <li>Market Trends</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3e2723', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Hive Support</h4>
              <p style={{ fontSize: '0.9rem', color: '#8d6e63' }}>help@beemagic.admin</p>
              <p style={{ fontSize: '0.8rem', color: '#d7ccc8', marginTop: '0.5rem' }}>Priority Support Active</p>
            </div>
            <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', color: '#d7ccc8' }}>Bee Magic ERP v1.2.4-stable</p>
              <p style={{ fontSize: '0.8rem', color: '#d7ccc8' }}>© 2026 Bee Magic Honey Boutique</p>
            </div>
          </div>
        </div>
      </main>

      {/* Full Fulfillment Ledger Modal */}
      {showFullLedger && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#faf8f5', padding: '2rem 2.5rem', borderRadius: '24px', width: '95%', maxWidth: '1000px', height: '90%', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#5d4037', margin: 0 }}>Hive Fulfillment Ledger</h2>
                <p style={{ color: '#8d6e63', fontSize: '0.9rem', marginTop: '0.2rem' }}>Comprehensive database of all boutique honey orders</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullLedger(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8d6e63' }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Controls Filters Row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ flex: 1, minWidth: '250px' }}>
                <input
                  type="text"
                  placeholder="Search by ID, Customer, Email, Phone, Address, or Honey Type..."
                  value={ledgerSearch}
                  onChange={e => setLedgerSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #d7ccc8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '0.4rem', background: '#f5f2ee', padding: '0.3rem', borderRadius: '12px', flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'PACKED', 'SHIPPED', 'DELIVERED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setLedgerFilterStatus(status)}
                    style={{
                      border: 'none',
                      background: ledgerFilterStatus === status ? '#795548' : 'transparent',
                      color: ledgerFilterStatus === status ? 'white' : '#8d6e63',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List scroll container */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#8d6e63' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No matching honey orders found.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>Try modifying your search keywords or status filter.</p>
                </div>
              ) : (
                filteredOrders.map((order, i) => (
                  <div
                    key={order.id || i}
                    style={{
                      background: 'white',
                      border: '1px solid #efebe9',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      marginBottom: '1.2rem',
                      boxShadow: '0 4px 15px rgba(93, 64, 55, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.2rem',
                      textAlign: 'left'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f2ee', paddingBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#795548' }}>#BM-{order.id}</span>
                        <span style={{ fontSize: '0.85rem', color: '#8d6e63', fontWeight: 600 }}>
                          Ordered: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {order.status === 'CANCELED' && order.canceledByCustomer && (
                          <span style={{ fontSize: '0.8rem', color: '#c62828', background: '#ffebee', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                            CANCELED BY CUSTOMER
                          </span>
                        )}
                      </div>
                      <div>
                        <select
                          value={order.status || 'PENDING'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: '1px solid #d7ccc8',
                            background: '#fbe9e7',
                            color: '#5d4037',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELED">CANCELED</option>
                        </select>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                      {/* Customer Info */}
                      <div>
                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Delivery Contact</h5>
                        <p style={{ margin: '0.2rem 0', fontSize: '0.95rem', color: '#3e2723', fontWeight: 700 }}>{order.user?.name || 'Artisan Customer'}</p>
                        <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#5d4037' }}><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                        <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#5d4037' }}><strong>Phone:</strong> {order.user?.phoneNumber || 'N/A'}</p>
                      </div>

                      {/* Destination Address */}
                      <div>
                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Shipping Destination</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#5d4037', lineHeight: '1.5' }}>
                          {order.shippingAddress || 'N/A'}
                        </p>
                      </div>

                      {/* Products Ordered */}
                      <div>
                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8d6e63', textTransform: 'uppercase', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>Products Ordered</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem', color: '#3e2723', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>• {item.name} <strong style={{ color: '#795548', marginLeft: '0.4rem' }}>x{item.quantity}</strong></span>
                              <span style={{ fontWeight: 700, color: '#8d6e63' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          )) : (
                            <span style={{ fontSize: '0.85rem', color: '#8d6e63' }}>No products listed.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f2ee', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#8d6e63', fontWeight: 500 }}>
                        Payment Status: Paid
                      </span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#3e2723' }}>
                        Total Amount: ₹{(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Full Product Catalog Modal */}
      {showFullCatalog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#faf8f5', padding: '2rem 2.5rem', borderRadius: '24px', width: '95%', maxWidth: '1000px', height: '90%', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#5d4037', margin: 0 }}>Hive Product Catalog</h2>
                <p style={{ color: '#8d6e63', fontSize: '0.9rem', marginTop: '0.2rem' }}>Comprehensive database of all boutique honey products</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    setShowFullCatalog(false);
                    handleStartAdd();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.6rem 1.2rem', background: '#795548', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <Plus size={16} /> New Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullCatalog(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8d6e63' }}
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by Title, Collection, or Description..."
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #d7ccc8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Products Table Wrapper */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#8d6e63' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No matching honey products found.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>Try modifying your search keywords.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PREVIEW</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PRODUCT NAME</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>COLLECTION</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PRICE</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>STOCK</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                          <td style={{ padding: '1rem 0' }}>
                            <img src={product.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          </td>
                          <td style={{ padding: '1rem 0', fontWeight: 600, color: '#3e2723' }}>{product.title}</td>
                          <td style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.85rem' }}>{product.collection || 'ARTISANAL PURE HONEY'}</td>
                          <td style={{ padding: '1rem 0', color: '#795548', fontWeight: 700 }}>₹{(product.price || 0).toFixed(2)}</td>
                          <td style={{ padding: '1rem 0' }}>
                            <span className="badge-v2 gold" style={{ position: 'static' }}>{product.stock || 0} in hive</span>
                          </td>
                          <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => {
                                  setShowFullCatalog(false);
                                  handleStartEdit(product);
                                }} 
                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #eee', background: 'white', color: '#8d6e63', cursor: 'pointer' }}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ffebee', background: '#fff9f9', color: '#d32f2f', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Full Customer Reviews Modal */}
      {showFullReviews && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#faf8f5', padding: '2rem 2.5rem', borderRadius: '24px', width: '95%', maxWidth: '1000px', height: '90%', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#5d4037', margin: 0 }}>Customer Reviews Management</h2>
                <p style={{ color: '#8d6e63', fontSize: '0.9rem', marginTop: '0.2rem' }}>Review ledger of all customer feedback and honey ratings</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFullReviews(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8d6e63' }}
              >
                <X size={28} />
              </button>
            </div>

            {/* Reviews Table Wrapper */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#8d6e63' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No customer reviews found in the hive.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>Customer reviews will appear here once submitted.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>DATE</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>CUSTOMER NAME</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>PRODUCT NAME</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>RATING</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700 }}>COMMENT</th>
                        <th style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(review => {
                        const matchedProduct = products.find(p => p.id === review.productId);
                        const productName = matchedProduct ? matchedProduct.title : `Product ID: ${review.productId}`;
                        return (
                          <tr key={review.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.85rem' }}>
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '1rem 0', fontWeight: 600, color: '#3e2723' }}>{review.userName}</td>
                            <td style={{ padding: '1rem 0', color: '#8d6e63', fontSize: '0.85rem' }}>{productName}</td>
                            <td style={{ padding: '1rem 0', color: '#f59e0b', fontWeight: 700 }}>
                              <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} color={i < review.rating ? "#f59e0b" : "#d7ccc8"} />
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: '1rem 0', color: '#5d4037', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={review.comment}>
                              {review.comment || <em style={{ color: '#bcaaa4' }}>No comment left</em>}
                            </td>
                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                              <button 
                                onClick={() => handleDeleteReview(review.id)} 
                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ffebee', background: '#fff9f9', color: '#d32f2f', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                              >
                                Delete Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
