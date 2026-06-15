import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon google">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path fill="currentColor" stroke="none" d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8v-4h12a11.54 11.54 0 0 1 -2.336 5.864l-3.342 -3.342a4 4 0 1 1 -5.322 -5.322l3.342 -3.342z" />
    <path fill="#EA4335" stroke="none" d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <circle cx="12" cy="12" r="9" fill="#fff" />
    <path fill="#4285F4" stroke="none" d="M21 12c0 -.7 -.1 -1.4 -.3 -2h-8.7v4h5c-.2 1.1 -.9 2 -1.8 2.6v2.2h2.9c1.7 -1.6 2.9 -4 2.9 -6.8z" />
    <path fill="#34A853" stroke="none" d="M12 21c2.5 0 4.6 -.8 6.2 -2.3l-2.9 -2.2c-.8 .6 -2 1 -3.3 1c-2.5 0 -4.6 -1.7 -5.4 -4l-2.7 2.1c1.5 3.1 4.7 5.4 8.1 5.4z" />
    <path fill="#FBBC05" stroke="none" d="M6.6 13.5c-.2 -.6 -.3 -1.3 -.3 -2s.1 -1.4 .3 -2l-2.7 -2.1c-.6 1.2 -1 2.6 -1 4.1s.4 2.9 1 4.1l2.7 -2.1z" />
    <path fill="#EA4335" stroke="none" d="M12 7c1.4 0 2.6 .5 3.6 1.4l2.7 -2.7c-1.6 -1.5 -3.7 -2.4 -6.3 -2.4c-3.4 0 -6.6 2.3 -8.1 5.4l2.7 2.1c.8 -2.3 2.9 -4 5.4 -4z" />
  </svg>
);



export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Listen to message events from Google/Apple popup window
  useEffect(() => {
    const handleSocialMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, email, name, address, phone, provider } = event.data;
      if (type === 'SOCIAL_LOGIN_SUCCESS') {
        setError('');
        setIsLoading(true);
        try {
          await login(email, 'password', name, address, phone, provider);
          navigate(-1);
        } catch (err) {
          setError(err.message || 'Social sign-in failed');
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleSocialMessage);
    return () => {
      window.removeEventListener('message', handleSocialMessage);
    };
  }, [login, navigate]);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setOtpMessage('Please enter a valid phone number first.');
      return;
    }
    setOtpLoading(true);
    setOtpMessage('');
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpMessage(`OTP sent successfully! For demo: enter code ${data.otp}`);
      } else {
        setOtpMessage(data.message || 'Failed to send OTP code.');
      }
    } catch (err) {
      setOtpMessage('Failed to communicate with the OTP service.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const userData = await login(email, password);
        if (userData && userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(-1);
        }
      } else {
        if (!otpSent) {
          throw new Error('Please click Send OTP and verify your phone number first.');
        }
        const userData = await register(name, address, email, phoneNumber, password, otp);
        if (userData && userData.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(-1);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    const width = 500;
    const height = 660;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/mock-${provider.toLowerCase()}-login`,
      `${provider}Login`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (popup) {
      popup.focus();
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(true); setError(''); setOtpMessage(''); }}
        >
          Login
        </button>
        <button
          type="button"
          className={`auth-tab ${!isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(false); setError(''); setOtpMessage(''); }}
        >
          Sign Up
        </button>
      </div>

      {error && <div className="error-message" style={{ color: '#e53e3e', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <UserIcon />
                <input
                  type="text"
                  id="name"
                  placeholder="Alexander Beekeeper"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="address">Shipping Address</label>
              <div className="input-wrapper">
                <MapPinIcon />
                <input
                  type="text"
                  id="address"
                  placeholder="742 Nectar Blossom Lane, Portland, OR"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper phone-wrapper">
                <PhoneIcon />
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !phoneNumber}
                >
                  {otpLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="input-group">
                <label htmlFor="otp">OTP Verification Code</label>
                <div className="input-wrapper">
                  <ShieldCheckIcon />
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            {otpMessage && (
              <div className="otp-status-message">
                {otpMessage}
              </div>
            )}
          </>
        )}

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <MailIcon />
            <input
              type="email"
              id="email"
              placeholder="hello@beemagic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <div className="password-header">
            <label htmlFor="password">Password</label>
            {isLogin && <a href="#" className="forgot-password">Forgot Password?</a>}
          </div>
          <div className="input-wrapper">
            <LockIcon />
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Sign In to Your Hive' : 'Join the Hive')}
        </button>
      </form>

    </div>
  );
}
