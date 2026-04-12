import { useState, useEffect } from 'react';

function App() {
  const [activeApproach, setActiveApproach] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImage = '/assets/hero_woman_lifting_1773959351631.png';
  const bioImage = '/assets/coach_marie_1773961244477.png';
  const helpImage = '/assets/trainer_coaching_1773959380358.png';
  const journeyImage = '/assets/barbell_grip_1773959365867.png';

  const carouselImages = [heroImage, helpImage, journeyImage];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const approaches = [
    {
      title: '1. MEET YOU WHERE YOU ARE.',
      content: "Whether you're just starting, rebuilding strength, or advancing performance, we tailor fitness to match your goals."
    },
    {
      title: '2. PLAN STRENGTH.',
      content: "With progressive, intentional training personalized to your life, we'll target building real, long-term strength through routines that seamlessly integrate into a busy life."
    },
    {
      title: '3. PROTECT YOUR BODY.',
      content: 'Prioritizing proper technique and mobility work so you can train intentionally while remaining safe and injury-free.'
    },
    {
      title: '4. FEEL BETTER.',
      content: 'Gain confidence through consistency. Build resilience, body recomposition, and mental strength.'
    }
  ];

  return (
    <>
      <div className="topbar">
        AUTHENTIC, PERSONALIZED STRENGTH TRAINING. FIRST CONSULTATION IS FREE.
      </div>

      <nav>
        <div className="nav-brand">BUILD TO BURN</div>
        <div className="nav-links">
          <a href="#philosophy">Philosophy</a>
          <a href="#approach">Approach</a>
          <a href="#bio">Meet Marie</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span className="nav-contact">SAN DIEGO, CA</span>
          <a href="#consultation" className="btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.85rem' }}>Start Training</a>
        </div>
      </nav>

      {/* Hero Split Section */}
      <section className="hero-split">
        <div className="hero-left">
          <h1 className="hero-title">
            BUILD STRENGTH,<br />
            BUILD CONFIDENCE,<br />
            <span style={{ color: 'var(--color-accent)' }}>BUILD TO BURN</span>
          </h1>
          <p>
            Personalized strength training for real life, not extremes.
          </p>
          <div>
            <a href="#consultation" className="btn">BOOK A CONSULTATION</a>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>No commitment required.</div>
          </div>
        </div>
        <div className="hero-right">
          {carouselImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Build to Burn Hero ${index + 1}`}
              className={`carousel-img ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
          <button className="carousel-btn prev" onClick={prevImage} aria-label="Previous image">‹</button>
          <button className="carousel-btn next" onClick={nextImage} aria-label="Next image">›</button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="why-section">
        <div className="why-header">
          <h2 className="why-title">REAL TRAINING, REAL RESULTS</h2>
          <p>Our commitment to authenticity sets Build to Burn apart. Instead of quick-fixes or fitness influencer hype, we align your goals with personalized coaching for sustainable results.</p>
        </div>
        <div className="why-grid">
          <div className="why-item">
            <div className="why-line"></div>
            <h3>CLEAR PROGRESS</h3>
            <p>Achieve long-term results through progressive overload and structured support, guiding you every step along the way.</p>
          </div>
          <div className="why-item">
            <div className="why-line"></div>
            <h3>REALISTIC LIFE BALANCE</h3>
            <p>Fitness should enhance your life, not take it over. Workouts are designed to integrate seamlessly into your busy routines.</p>
          </div>
          <div className="why-item">
            <div className="why-line"></div>
            <h3>EMPOWER THE MIND AND BODY</h3>
            <p>We are dedicated to helping women feel strong, both physically and mentally.</p>
          </div>
        </div>
      </section>

      {/* Help Grid Section (Approach) */}
      <section id="approach" className="help-section">
        <div className="help-left">
          <h2 className="help-title" style={{ marginBottom: '2rem' }}>YOUR JOURNEY WITH US</h2>
          <div className="journey-list">
            {approaches.map((item, index) => (
              <div
                key={index}
                className={`list-item ${activeApproach === index ? 'active' : ''}`}
                onClick={() => setActiveApproach(index)}
              >
                <div className="list-item-header">
                  <div className="list-icon">{activeApproach === index ? '−' : '+'}</div>
                  <h3>{item.title}</h3>
                </div>
                <div className="list-content-wrapper">
                  <div className="list-content">
                    <p>{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="help-right">
          <img src={helpImage} alt="Trainer Coaching" />
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="bio-section">
        <div className="bio-left">
          <img src={bioImage} alt="Marie - Founder of Build to Burn" />
        </div>
        <div className="bio-right">
          <div className="bio-label">MEET THE COACH</div>
          <h2 className="bio-title">HI, I'M MARIE</h2>
          <div className="bio-subtitle">Founder of Build to Burn</div>

          <p className="bio-paragraph">
            I created Build to Burn from my belief that strength training has the power to change more than just how we look — it changes how we feel, how we move, and how we see ourselves.
          </p>
          <p className="bio-paragraph">
            My own fitness journey taught me that real progress doesn't come from extremes or quick fixes. I saw so many women feeling overwhelmed by conflicting advice, intimidated by gym environments, or frustrated by unrealistic programs.
          </p>
          <p className="bio-paragraph">
            Build to Burn is grounded on consistency, education, and working with your body instead of against it.
          </p>
          <p className="bio-paragraph">
            I work closely with each client to create personalized programs that prioritize:
          </p>

          <ul className="bio-list">
            <li><span className="bio-list-icon">✔</span> Proper Movement</li>
            <li><span className="bio-list-icon">✔</span> Sustainable Progress</li>
            <li><span className="bio-list-icon">✔</span> Long-Term Strength And Confidence</li>
          </ul>

          <p className="bio-paragraph">
            Coaching, to me, is about more than workouts. It's about helping women build resilience that extends far beyond the gym.
          </p>
        </div>
      </section>

      {/* Stats / Reviews Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div>
            <h2 className="stats-title" style={{ maxWidth: '500px' }}>BUILD TO BURN HAS EMPOWERED HUNDREDS OF WOMEN</h2>
          </div>
          <div className="stat-box">
            <div className="stat-number">100+</div>
            <div className="stat-label">Client Transformations</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">5</div>
            <div className="stat-label">Average Rating (Out of 5.0)</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '3rem', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Samantha R.</div>
            <div style={{ color: '#f5b041' }}>★★★★★</div>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#111' }}>
              "I am probably the fittest and strongest I've ever been! Build to Burn truly focuses on progressive, careful coaching. I feel incredible."
            </p>
          </div>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Jessica M.</div>
            <div style={{ color: '#f5b041' }}>★★★★★</div>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#111' }}>
              "Marie designed a program that fit right into my busy career life. There's no place quite like Build to Burn for feeling supported."
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="text-center mb-6">
          <h2 className="help-title" style={{ marginBottom: '1rem' }}>COACHING OPTIONS</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>It's more than just a workout program, it's a supportive coaching experience.</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-title">Group Training</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#111' }}>
              <span>Package</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>2-1 Package</span> <span style={{color: '#111', fontWeight: 500}}>$45</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>3-1 Package</span> <span style={{color: '#111', fontWeight: 500}}>$35</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>4+ Package</span> <span style={{color: '#111', fontWeight: 500}}>$30</span></li>
            </ul>
            <a href="#consultation" className="btn btn-outline">Select Plan</a>
          </div>

          <div className="pricing-card" style={{ border: '2px solid #111', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 className="pricing-title">PERSONAL TRAINING</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#111' }}>
              <span>Package</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>6 Sessions</span> <span style={{color: '#111', fontWeight: 500}}>$650</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>12 Sessions</span> <span style={{color: '#111', fontWeight: 500}}>$1225</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>24 Sessions</span> <span style={{color: '#111', fontWeight: 500}}>$2305</span></li>
            </ul>
            <a href="#consultation" className="btn">Select Plan</a>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-title">Online Coaching</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#111' }}>
              <span>Program</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem', textAlign: 'left' }}>
                <span style={{paddingRight: '1rem'}}>Online Coaching</span> 
                <span style={{color: '#111', fontWeight: 500}}>$229 / mo</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem', textAlign: 'left' }}>
                <span style={{paddingRight: '1rem', lineHeight: '1.2'}}>Online Coaching <br/>+ Live Classes <br/><span style={{fontSize: '0.75rem', color: 'var(--color-accent)'}}>(Most Popular)</span></span> 
                <span style={{color: '#111', fontWeight: 500}}>$279 / mo</span>
              </li>
            </ul>
            <a href="#consultation" className="btn btn-outline">Select Plan</a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="consultation" className="form-section">
        <h2 className="help-title" style={{ marginBottom: '1rem' }}>READY TO GET STARTED?</h2>
        <p>If you're ready to train smarter, feel stronger, and build confidence that carries into every part of your life, Build to Burn is here to support you.</p>
        <form className="form-group" onSubmit={(e) => { e.preventDefault(); alert("Thanks for submitting! We'll be in touch soon."); }}>
          <input type="email" placeholder="Enter your email address" required />
          <button type="submit" className="btn" style={{ minWidth: '200px' }}>Submit Request</button>
        </form>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', letterSpacing: '2px', marginBottom: '1rem' }}>
          BUILD TO BURN
        </div>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>San Diego, CA</p>
        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '2rem' }}>
          &copy; {new Date().getFullYear()} Build to Burn. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default App;
