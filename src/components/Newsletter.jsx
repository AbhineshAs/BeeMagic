export default function Newsletter() {
  return (
    <section className="newsletter-path-container">
      {/* Wavy transition SVG element */}
      <div className="wavy-transition-top">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--color-gold)"></path>
        </svg>
      </div>

      <div className="newsletter-card-dribbble reveal-on-scroll zoom-in">
        <h2>JOIN OUR HIVE</h2>
        <p>Get 15% off your first order + sweet updates</p>
        
        <form className="newsletter-form-dribbble" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            required 
            className="newsletter-input-dribbble"
          />
          <button type="submit" className="newsletter-btn-dribbble">
            Get My Discount
          </button>
        </form>
      </div>
    </section>
  );
}
