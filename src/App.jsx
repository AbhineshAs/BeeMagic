import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/AdminDashboard';
import MockGoogleLogin from './pages/MockGoogleLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

// ScrollRevealManager handles page-reveal animations and auto-scrolling to top on navigation
function ScrollRevealManager() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top of page on route change
    window.scrollTo(0, 0);

    // Configure the intersection observer
    const options = {
      root: null, // viewport
      rootMargin: '0px 0px -80px 0px', // trigger slightly before element reaches bottom
      threshold: 0.1 // trigger when 10% visible
    };

    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stop observing once animation has run
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    // Select and observe all reveal target elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Use MutationObserver to watch for DOM updates from client-side route mounting
    const mutationCallback = (mutationsList) => {
      let hasNewNodes = false;
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      if (hasNewNodes) {
        observeElements();
      }
    };

    const mutationObserver = new MutationObserver(mutationCallback);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}

function App() {
  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => console.log('Backend connection test:', data))
      .catch(err => console.error('Failed to connect to backend:', err));
  }, []);

  return (
    <Router>
      <ScrollRevealManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/mock-google-login" element={<MockGoogleLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

