import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import API_URL from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopProductCard from '../components/ShopProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('best');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.collection && p.collection.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;

      if (activeCategory === 'infused') {
        return p.collection === 'INFUSED HONEY COLLECTION';
      } else if (activeCategory === 'pure') {
        return p.collection === 'ARTISANAL PURE HONEY';
      } else if (activeCategory === 'best') {
        return p.badge === 'BEST SELLER' || p.badge === 'IMMUNITY BOOSTER' || p.badge === 'TROPICAL FAVORITE';
      }
      return true;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchQuery, sortBy, activeCategory, products]);

  return (
    <div className="shop-page">
      <Navbar />

      <main className="shop-main">
        <div className="shop-container">
          <div className="shop-header page-fade-in">
            <h1 className="shop-title">Discover Liquid Gold</h1>

            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search for Products"
                className="shop-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-tabs-scroll">
              <button className={`category-tab-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>For You</button>
              <button className={`category-tab-btn ${activeCategory === 'infused' ? 'active' : ''}`} onClick={() => setActiveCategory('infused')}>Infused Honey</button>
              <button className={`category-tab-btn ${activeCategory === 'pure' ? 'active' : ''}`} onClick={() => setActiveCategory('pure')}>Pure Honey</button>
              <button className={`category-tab-btn ${activeCategory === 'best' ? 'active' : ''}`} onClick={() => setActiveCategory('best')}>Best Sellers</button>
            </div>

            <div className="filter-row">
              <div className="sort-group">
                <span style={{ fontSize: '0.8rem', color: '#888', marginRight: '0.5rem' }}>SORT BY:</span>
                <select
                  className="filter-pill-btn"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ border: 'none', background: 'white', padding: '0.5rem 1rem', borderRadius: '25px', cursor: 'pointer' }}
                >
                  <option value="best">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {searchQuery && (
              <div className="active-filters">
                <div className="filter-tag">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>&times;</button>
                </div>
                <button className="clear-filters" onClick={() => { setSearchQuery(''); setSortBy('best'); }}>Clear all</button>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading the harvest...</div>
          ) : (
            <div className="shop-list">
              {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                <div key={product.id} className={`reveal-on-scroll slide-up delay-${(index % 4 + 1) * 100}`}>
                  <ShopProductCard product={product} />
                </div>
              )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                  No products match your search.
                </div>
              )}
            </div>
          )}


        </div>
      </main>

      <Footer />
    </div>
  );
}
