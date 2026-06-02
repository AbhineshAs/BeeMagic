import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import Features from '../components/Features';
import ProductGrid from '../components/ProductGrid';
import BestSellers from '../components/BestSellers';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />
        <Categories />
        <Features />
        <ProductGrid />
        <BestSellers />
        <Newsletter />
      </main>
      <Footer />
      
      {/* Floating Chat/Support button */}
      <button className="floating-action-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  );
}
