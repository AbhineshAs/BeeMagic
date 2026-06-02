import { useState } from 'react';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-input-icon-svg">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-input-icon-svg">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-input-icon-svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-input-icon-svg">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function MockGoogleLogin() {
  const accounts = [
    { name: 'Abhinesh', email: 'abhineshas996@gmail.com', address: 'Pooram House, Kerala, IN', phone: '+91 90612 18582' },
    { name: 'Abhinesh AS', email: 'trainer1whitetrack@gmail.com', address: 'White Track Dev Center, Kerala, IN', phone: '+91 90612 18500' },
    { name: 'Manager WAX', email: 'managerwhiteaurax@gmail.com', address: 'White Aurax HQ, Kerala, IN', phone: '+91 90612 18511' },
    { name: 'zevrotech solutions', email: 'zevrotechsolutions@gmail.com', address: 'Zevrotech Solutions Office, Kerala, IN', phone: '+91 90612 18522' }
  ];

  const [step, setStep] = useState(1); // 1: Choose Account, 2: Complete Profile, 3: Consent
  const [selectedAcc, setSelectedAcc] = useState(accounts[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  // Profile details
  const [profileName, setProfileName] = useState(accounts[0].name);
  const [profileAddress, setProfileAddress] = useState(accounts[0].address);
  const [profilePhone, setProfilePhone] = useState(accounts[0].phone);

  const handleSelectAccount = (acc) => {
    setIsCustom(false);
    setSelectedAcc(acc);
    setProfileName(acc.name);
    setProfileAddress(acc.address);
    setProfilePhone(acc.phone);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setProfileName('');
    setProfileAddress('');
    setProfilePhone('');
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (isCustom && !customEmail) {
      alert('Please enter an email address.');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleAllow = () => {
    const finalEmail = isCustom ? customEmail : selectedAcc.email;

    // Post message back to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'SOCIAL_LOGIN_SUCCESS',
        email: finalEmail,
        name: profileName,
        address: profileAddress,
        phone: profilePhone,
        provider: 'Google'
      }, window.location.origin);
    }
    window.close();
  };

  const currentEmail = isCustom ? customEmail : selectedAcc.email;

  return (
    <div className="popup-layout google-layout">
      <div className="popup-card">
        {/* Progress Header */}
        <div className="popup-header">
          <div className="popup-logo">
            <GoogleLogo />
          </div>
          <h3 className="popup-title">Sign in with Google</h3>
          <p className="popup-subtitle">to continue to Bee Magic</p>
          <div className="popup-progress-dots">
            <span className={`dot ${step >= 1 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 2 ? 'active' : ''}`}></span>
            <span className={`dot ${step >= 3 ? 'active' : ''}`}></span>
          </div>
        </div>

        {/* Step 1: Account Selection */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="popup-step-form">
            <div className="popup-content">
              <div className="popup-section-title">Choose an account</div>

              <div className="popup-account-list">
                {accounts.map((acc, index) => {
                  const isSelected = !isCustom && selectedAcc.email === acc.email;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`popup-account-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectAccount(acc)}
                    >
                      <div className="popup-avatar google">
                        {acc.name.charAt(0)}
                      </div>
                      <div className="popup-account-details">
                        <div className="popup-account-name">{acc.name}</div>
                        <div className="popup-account-email">{acc.email}</div>
                      </div>
                      <div className="popup-select-dot"></div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={`popup-account-item ${isCustom ? 'selected' : ''}`}
                  onClick={handleCustomSelect}
                >
                  <div className="popup-avatar custom-avatar">
                    +
                  </div>
                  <div className="popup-account-details">
                    <div className="popup-account-name font-semibold">Use another account</div>
                    <div className="popup-account-email">Enter a custom email address</div>
                  </div>
                  <div className="popup-select-dot"></div>
                </button>
              </div>

              {isCustom && (
                <div className="popup-custom-box">
                  <div className="popup-input-group">
                    <label htmlFor="custom-email">Email Address</label>
                    <div className="popup-input-wrapper">
                      <span className="popup-icon-box"><MailIcon /></span>
                      <input
                        type="email"
                        id="custom-email"
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        required={isCustom}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="popup-actions">
              <button
                type="button"
                className="popup-btn-cancel"
                onClick={() => window.close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="popup-btn-submit google"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Complete Profile */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="popup-step-form">
            <div className="popup-content">
              <div className="popup-profile-completion">
                <div className="popup-section-title">Confirm Profile Details</div>
                <p className="popup-section-desc">We'll register this account with the details below.</p>

                <div className="popup-input-group">
                  <label htmlFor="p-name">Full Name</label>
                  <div className="popup-input-wrapper">
                    <span className="popup-icon-box"><UserIcon /></span>
                    <input
                      type="text"
                      id="p-name"
                      placeholder="Your full name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="popup-input-group">
                  <label htmlFor="p-address">Shipping Address</label>
                  <div className="popup-input-wrapper">
                    <span className="popup-icon-box"><MapPinIcon /></span>
                    <input
                      type="text"
                      id="p-address"
                      placeholder="Street, City, State, ZIP"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="popup-input-group">
                  <label htmlFor="p-phone">Phone Number</label>
                  <div className="popup-input-wrapper">
                    <span className="popup-icon-box"><PhoneIcon /></span>
                    <input
                      type="tel"
                      id="p-phone"
                      placeholder="Phone number"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-actions">
              <button
                type="button"
                className="popup-btn-cancel"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className="popup-btn-submit google"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: OAuth Consent */}
        {step === 3 && (
          <div className="popup-step-form">
            <div className="popup-content">
              <div className="popup-consent-box">
                <div className="popup-consent-app">
                  <div className="popup-consent-appname">Bee Magic</div>
                  <div className="popup-consent-userbadge">{currentEmail}</div>
                </div>

                <p className="popup-consent-text">
                  <strong>Bee Magic</strong> wants permission to access your Google Account profile:
                </p>

                <div className="popup-consent-list">
                  <div className="popup-consent-item">
                    <span className="popup-consent-item-dot">✓</span>
                    <span>View your name ({profileName})</span>
                  </div>
                  <div className="popup-consent-item">
                    <span className="popup-consent-item-dot">✓</span>
                    <span>View your primary email address ({currentEmail})</span>
                  </div>
                  <div className="popup-consent-item">
                    <span className="popup-consent-item-dot">✓</span>
                    <span>Access shipping address ({profileAddress}) and phone number ({profilePhone}) for delivery</span>
                  </div>
                </div>

                <p className="popup-consent-privacy">
                  By clicking Allow, you authorize Bee Magic to create and log into your account. You can review Bee Magic's Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>

            <div className="popup-actions" style={{ padding: '1rem 0 0', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="button"
                className="popup-btn-cancel"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="popup-btn-submit google"
                onClick={handleAllow}
              >
                Allow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
