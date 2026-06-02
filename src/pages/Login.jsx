import AuthCard from '../components/AuthCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Login() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="auth-section">
        <div className="auth-header page-fade-in">
          <h1>Bee Magic</h1>
          <p className="subtitle">PURE ARTISANAL GOLD</p>
        </div>

        <div className="auth-content page-fade-in" style={{ animationDelay: '150ms' }}>
          <AuthCard />

          <p className="terms-text">
            By joining, you agree to our <strong>Terms of Service</strong> and{' '}
            <strong>Privacy Policy</strong>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
