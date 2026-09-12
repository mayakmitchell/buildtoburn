import { useState, useEffect, type FormEvent } from 'react';

type SignupStatus = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error';

type CoachingInterest = 'personal-training' | 'group-training' | 'online-coaching' | 'not-sure';

function App() {
  const [activeApproach, setActiveApproach] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMobileGalleryIndex, setCurrentMobileGalleryIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCoachingInterest, setSignupCoachingInterest] = useState<CoachingInterest | ''>('');
  const [signupGoals, setSignupGoals] = useState('');
  const [signupWebsite, setSignupWebsite] = useState('');
  const [signupStatus, setSignupStatus] = useState<SignupStatus>('idle');
  const [signupStartedAt] = useState(() => Date.now());
  const [hasSeenWhySection, setHasSeenWhySection] = useState(false);
  const [hasSeenStatsSection, setHasSeenStatsSection] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [isDesktopHero, setIsDesktopHero] = useState(() => window.innerWidth > 900);

  const bioImage = '/assets/coach_marie_final.jpg';
  const journeyImage = '/assets/journey_image.jpg';
  
  const hero_4 = '/assets/media__1776044929674.jpg';
  const marieMedals = '/assets/hero-marie-medals.jpg';
  const marieMedalsDesktop = '/assets/hero-marie-medals-desktop.png';
  const marieSquat = '/assets/hero-marie-squat.jpg';
  const marieKettlebell = '/assets/hero-marie-kettlebell.jpg';

  const carouselImages = [isDesktopHero ? marieMedalsDesktop : marieMedals, hero_4, journeyImage, marieSquat, marieKettlebell];
  const mobileGalleryImages = [
    '/assets/mobile-gallery-1.jpg',
    '/assets/mobile-gallery-3.jpg',
    '/assets/mobile-gallery-4.jpg',
    '/assets/mobile-gallery-5.jpg',
    '/assets/journey-marie-client.jpg',
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const updateHeroImageMode = () => setIsDesktopHero(mediaQuery.matches);

    updateHeroImageMode();
    mediaQuery.addEventListener('change', updateHeroImageMode);
    return () => mediaQuery.removeEventListener('change', updateHeroImageMode);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobileGalleryIndex((prev) => (prev + 1) % mobileGalleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mobileGalleryImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target.classList.contains('why-section')) {
            setHasSeenWhySection(true);
          }

          if (entry.target.classList.contains('stats-section')) {
            setHasSeenStatsSection(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    const whySection = document.querySelector('.why-section');
    const statsSections = document.querySelectorAll('.stats-section');

    if (whySection) {
      observer.observe(whySection);
    }

    statsSections.forEach((statsSection) => observer.observe(statsSection));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasSeenStatsSection) {
      return;
    }

    let frameId = 0;
    const duration = 1400;
    const startedAt = performance.now();

    const animateCount = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setClientCount(Math.round(easedProgress * 100));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    frameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(frameId);
  }, [hasSeenStatsSection]);

  const approaches = [
    {
      title: '1. Meet you where you are.',
      content: "Whether you're just starting, rebuilding strength, or advancing performance, we tailor fitness to match your goals."
    },
    {
      title: '2. Plan strength.',
      content: "With progressive, intentional training personalized to your life, we'll target building real, long-term strength through routines that seamlessly integrate into a busy life."
    },
    {
      title: '3. Protect your body.',
      content: 'Prioritizing proper technique and mobility work so you can train intentionally while remaining safe and injury-free.'
    },
    {
      title: '4. Feel better.',
      content: 'Gain confidence through consistency. Build resilience, body recomposition, and mental strength.'
    }
  ];

  const testimonials = [
    {
      name: 'Katherine R.',
      text: "Marie is the best! She is knowledgeable, caring and thoughtful. Every session is unique and catered towards my needs and wishes as a client. I have seen incredible progress with my lifting technique and overall strength in my time working with her. Marie emphasizes form and technique in everything we do to ensure we can lift and go through life injury free. Her uplifting and bubbly personality make her a joy to work. I always leave my workouts with her feeling motivated, empowered and stronger. I would recommend Marie to anyone from former athletes to people just starting their fitness journey. Marie will get you where you want to be!"
    },
    {
      name: 'Diane W.',
      text: "I can give three reasons to have Marie for your fitness trainer: expertise, affordability, and motivation. Following some months of physical therapy for back problems, Marie has been a necessary luxury for me. She is so precise in her knowledge of what exercises will help you build muscle where you need it. She uses her expertise to design a program just for you. I never thought I would be in position to be able to have a personal fitness trainer, but Marie made it affordable. Ask her to try to pair you up with one or two other clients, for semi-personal sessions that work for you. Marie also makes it fun- she's joyful and optimistic, at the same time as being firmly motivating. She is clearly qualified to train people who are more serious about sports or body building than I am, but she is also perfect for fitness at any age, or to maintain progress after physical therapy."
    },
    {
      name: 'Kim F.',
      text: "Absolutely love working with Marie. She is definitely a top notch trainer with tremendous knowledge in weightlifting and body building. I love how she ensures that every exercise is done correctly with proper form so you don't get injured. Marie is always mixing up the workouts so you never get bored. She also takes any issues you may have into consideration and designs your workouts to obtain the most effective and best results. She truly cares about her clients and their well being. I feel I have accomplished something really beneficial for my body after a session with Marie. Oh, and did I mention how nice, fun and positive she is? Marie is the best!"
    },
    {
      name: 'Kevin G.',
      text: "I am incredibly grateful for the work that Marie is doing to help my patients reach their ultimate potential. As a Physical Therapist, it has been a huge asset to have a someone you trust and know can get your patients to the next level in a safe and effective manner. Her dedication, expertise, and genuine passion for helping our clients achieve their fitness goals are truly remarkable. She creates customized workout programs tailored to each individual, pushing them beyond their limits while prioritizing their safety. With a personal approach, she actively listens, offers tailored guidance, and builds genuine relationships. Our clients have experienced remarkable progress under her guidance. If you're seeking an exceptional trainer who delivers results, look no further. She is simply outstanding!"
    },
    {
      name: 'Alana K.',
      text: "I absolutely LOVE my training sessions with Marie. She focus so much on my form so I know that, even though I’m working hard, I won’t get injured. Her workouts are thoughtfully planned out and I’m always sore after! I worked with Marie before and throughout my pregnancy and when I had my C-section, the doctor said as she was sewing me up \"great ab muscles!\" Three years later, I was able to carry my 35 pound daughter around Disneyland for 2 days. Marie's approach makes your whole body strong and she is a JOY to work with. Every week I'm excited and scared to see what she comes up with!"
    },
    {
      name: 'Sophie I.',
      text: "Marie is a fantastic personal trainer! Over the last year she has taught me how to properly lift weights (without pain or hurting yourself) and helped me reach fitness goals I didn't think I could! My confidence as woman in the gym and lifting weights has grown exponentially, thanks to Marie! Highly recommend!!"
    },
    {
      name: 'Matthew P.',
      text: "I wanted to take a moment to share my thoughts on the exceptional service that Marie provides as a personal trainer and lifestyle coach. I must say, I am thoroughly impressed. Her attention to detail and ability to create personalized workout plans tailored to each client's needs is truly remarkable. I appreciate the time that she takes to understand each client's goals and limitations, ensuring that every exercise is safe and effective. Her knowledge of anatomy and biomechanics is evident in how she instructs her clients on proper form, which is crucial for injury prevention. Additionally, her positive attitude and enthusiasm is infectious, making clients feel motivated and supported throughout their fitness journey. It's clear that she has a genuine passion for helping others achieve their goals and improve their overall health and well-being. I highly recommend Build to Burn to anyone looking for a skilled and caring personal trainer. Keep up the great work!"
    },
    {
      name: 'Teresa O.',
      text: "Build to Burn is excellent training for beginners to advanced lifters. Marie has taught me correct lifting techniques so that I was confident in my form when using heavier weights. She also took time to create specific programs for me while rehabilitating a wrist injury. Based on the strength I have gained, I have enough energy and strength to run, lift, and play with my grandkids all day without tiring."
    },
    {
      name: 'John J.',
      text: "Marie is an incredibly knowledgeable and patient trainer. It is obvious that she is very passionate about educating her clients on not only how to train, but why what you are doing is important. If you are looking for an amazing trainer than truly cares about your progress, then give her a call!"
    },
    {
      name: 'Michele F.',
      text: "I did my first Build to Burn Bootcamp in 2017. Marie taught me how to lift safely with good technique. I was hooked and have even competed in powerlifting competitions. The best benefit of lifting is it transformed my body. I started when I was 55; so it's never too late to start. I highly recommend this program!"
    }
  ];

  const totalPages = Math.ceil(testimonials.length / 2);
  const currentPage = Math.floor(currentTestimonialIndex / 2) + 1;

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => Math.min(prev + 2, (totalPages - 1) * 2));
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => Math.max(0, prev - 2));
  };

  const resetSignupForm = () => {
    setSignupFirstName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupCoachingInterest('');
    setSignupGoals('');
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = signupEmail.trim().toLowerCase();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setSignupStatus('submitting');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupFirstName.trim(),
          email,
          phone: signupPhone.trim(),
          coachingInterest: signupCoachingInterest,
          goals: signupGoals.trim(),
          website: signupWebsite,
          formStartedAt: signupStartedAt,
          source: 'buildtoburn.com',
        }),
      });

      const result = await response.json().catch(() => null) as { status?: string } | null;

      if (response.status === 409 || result?.status === 'duplicate') {
        resetSignupForm();
        setSignupStatus('duplicate');
        return;
      }

      if (!response.ok) {
        throw new Error('Signup request failed');
      }

      resetSignupForm();
      setSignupStatus('success');
    } catch {
      setSignupStatus('error');
    }
  };

  return (
    <>
      <div className="topbar">
        AUTHENTIC, PERSONALIZED STRENGTH TRAINING. FIRST CONSULTATION IS FREE.
      </div>

      <nav>
        <a href="#" className="nav-brand" aria-label="Build to Burn home">
          <img src="/assets/build-to-burn-logo.jpg" alt="Build to Burn" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="#philosophy">Philosophy</a>
          <a href="#approach">Approach</a>
          <a href="#bio">Meet Marie</a>
          <a href="#pricing">Pricing</a>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#philosophy" onClick={() => setIsMobileMenuOpen(false)}>Philosophy</a>
          <a href="#approach" onClick={() => setIsMobileMenuOpen(false)}>Approach</a>
          <a href="#bio" onClick={() => setIsMobileMenuOpen(false)}>Meet Marie</a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
        </div>

        <div className="nav-actions">
          <span className="nav-contact">SAN DIEGO, CA</span>
          <a href="#consultation" className="btn nav-cta-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.85rem' }}>Start Training</a>
          
          {/* Hamburger toggle button */}
          <button 
            className={`nav-hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-split">
        <div className="hero-right">
          {carouselImages.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Build to Burn Hero ${index + 1}`}
              className={`carousel-img ${img === marieSquat ? 'carousel-img-powerlift' : ''} ${img === marieKettlebell ? 'carousel-img-kettlebell' : ''} ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
        <div className="hero-left">
          <h1 className="hero-title">
            <span className="hero-title-line">Build strength,</span>
            <span className="hero-title-line">Build confidence,</span>
            <span className="hero-title-line hero-title-accent">Build to Burn</span>
          </h1>
          <p>
            Personalized strength training for real life, not extremes.
          </p>
          {/* Desktop CTA — hidden on mobile */}
          <div className="hero-btn-wrapper">
            <a href="#consultation" className="btn">BOOK A CONSULTATION</a>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.82)', marginTop: '0.5rem' }}>No commitment required.</div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="why-section">
        <svg className="why-flame" viewBox="0 0 300 500" aria-hidden="true" focusable="false">
          <path d="M177 10c11 76-51 106-30 166 14 41 67 54 74 116 9 77-43 151-128 184 48-49 58-101 26-145-27-37-43-78-25-121 15-36 49-59 58-94 8-31 4-73 25-106Z" />
          <path className="why-flame-inner" d="M160 202c21 45-13 70 6 105 14 26 40 43 31 80-9 38-42 64-79 77 23-29 25-61 4-86-21-25-23-55-8-80 14-24 41-49 46-96Z" />
        </svg>
        <div className="why-content">
          <div className="why-header">
            <h2 className="why-title">Real training, real results</h2>
            <p>Our commitment to authenticity sets Build to Burn apart. Instead of quick-fixes or fitness influencer hype, we align your goals with personalized coaching for sustainable results.</p>
          </div>
          <div className={`why-grid ${hasSeenWhySection ? 'is-visible' : ''}`}>
            <div className="why-item">
              <div className="why-line"></div>
              <h3>Clear progress</h3>
              <p>Achieve long-term results through progressive overload and structured support, guiding you every step along the way.</p>
            </div>
            <div className="why-item">
              <div className="why-line"></div>
              <h3>Real life balance</h3>
              <p>Fitness should enhance your life, not take it over. Workouts are designed to integrate seamlessly into your busy routines.</p>
            </div>
            <div className="why-item">
              <div className="why-line"></div>
              <h3>Empower the mind and body</h3>
              <p>We are dedicated to helping women feel strong, both physically and mentally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-stats-numbers">
        <div className="stats-section mobile-stats-panel">
          <h2 className="stats-title mobile-section-title">By the numbers</h2>
          <div className="mobile-stats-grid">
            <div className="stat-box">
              <div className="stat-number stat-number-animated">{clientCount}+</div>
              <div className="stat-label">Client Transformations</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">5</div>
              <div className="stat-label">Average Rating (Out of 5.0)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-gallery-section">
        <div className="mobile-gallery-shell">
          {mobileGalleryImages.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Build to Burn mobile gallery ${index + 1}`}
              className={`carousel-img mobile-gallery-img ${index === currentMobileGalleryIndex ? 'active' : ''}`}
            />
          ))}
          <button
            className="carousel-btn prev"
            onClick={() => setCurrentMobileGalleryIndex((prev) => (prev === 0 ? mobileGalleryImages.length - 1 : prev - 1))}
            aria-label="Previous gallery image"
          >
            ‹
          </button>
          <button
            className="carousel-btn next"
            onClick={() => setCurrentMobileGalleryIndex((prev) => (prev + 1) % mobileGalleryImages.length)}
            aria-label="Next gallery image"
          >
            ›
          </button>
        </div>
      </section>

      {/* Help Grid Section (Approach) */}
      <section id="approach" className="help-section">
        <div className="help-left">
          <h2 className="help-title" style={{ marginBottom: '2rem' }}>Your journey with us</h2>
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
          <div className="journey-gallery-shell">
            {mobileGalleryImages.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`Build to Burn journey gallery ${index + 1}`}
                className={`carousel-img journey-gallery-img ${index === currentMobileGalleryIndex ? 'active' : ''}`}
              />
            ))}
            <button
              className="carousel-btn prev"
              onClick={() => setCurrentMobileGalleryIndex((prev) => (prev === 0 ? mobileGalleryImages.length - 1 : prev - 1))}
              aria-label="Previous journey gallery image"
            >
              ‹
            </button>
            <button
              className="carousel-btn next"
              onClick={() => setCurrentMobileGalleryIndex((prev) => (prev + 1) % mobileGalleryImages.length)}
              aria-label="Next journey gallery image"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section id="bio" className="bio-section">
        <div className="bio-left">
          <img src={bioImage} alt="Marie - Founder of Build to Burn" />
        </div>
        <div className="bio-right">
          <div className="bio-label">Meet the coach</div>
          <h2 className="bio-title">Hi, I'm Marie</h2>
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
            <h2 className="stats-title" style={{ maxWidth: '500px' }}>Build to Burn has empowered hundreds of women</h2>
          </div>
          <div className="stat-box stats-desktop-only">
            <div className="stat-number stat-number-animated">{clientCount}+</div>
            <div className="stat-label">Client Transformations</div>
          </div>
          <div className="stat-box stats-desktop-only">
            <div className="stat-number">5</div>
            <div className="stat-label">Average Rating (Out of 5.0)</div>
          </div>
        </div>

        <div className="reviews-mobile-title">
          <h2 className="stats-title mobile-section-title">Ratings & Reviews</h2>
        </div>

        <div className="reviews-container">
          <div style={{ position: 'relative', width: '100%' }}>
            <div className="reviews-list">
              {[0, 1].map((offset) => {
                const index = (currentTestimonialIndex + offset) % testimonials.length;
                const review = testimonials[index];
                return (
                  <div key={`${currentTestimonialIndex}-${offset}`} className="review-card review-animate">
                    <div className="review-author">
                      <div className="review-author-name">{review.name}</div>
                      <div className="review-rating">
                        ★★★★★ <span className="review-rating-label">5/5</span>
                      </div>
                    </div>
                    <div className="review-body">
                      <p>
                        {review.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="review-pagination">
              <button 
                onClick={prevTestimonial} 
                style={{ background: 'transparent', color: 'var(--color-text)', border: 'none', cursor: 'pointer', fontSize: '1.8rem', opacity: currentPage > 1 ? 1 : 0, pointerEvents: currentPage > 1 ? 'auto' : 'none', padding: '0 0.5rem', transition: 'color 0.2s' }} 
                aria-label="Previous reviews"
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              >
                ←
              </button>
              
              <div style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--color-text)', minWidth: '40px', textAlign: 'center' }}>
                {currentPage} / {totalPages}
              </div>
              
              <button 
                onClick={nextTestimonial} 
                style={{ background: 'transparent', color: 'var(--color-text)', border: 'none', cursor: 'pointer', fontSize: '1.8rem', opacity: currentPage < totalPages ? 1 : 0, pointerEvents: currentPage < totalPages ? 'auto' : 'none', padding: '0 0.5rem', transition: 'color 0.2s' }} 
                aria-label="Next reviews"
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="text-center mb-6">
          <h2 className="help-title" style={{ marginBottom: '1rem' }}>Coaching options</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>It's more than just a workout program, it's a supportive coaching experience.</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-title">Group Training</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
              <span>Package</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>2-1 Package</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$45</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>3-1 Package</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$35</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>4+ Package</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$30</span></li>
            </ul>
            <a href="#consultation" className="btn btn-outline">Select Plan</a>
          </div>

          <div className="pricing-card pricing-card-featured">
            <h3 className="pricing-title">Personal Training</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
              <span>Package</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>6 Sessions</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$650</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>12 Sessions</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$1225</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem' }}><span>24 Sessions</span> <span style={{color: 'var(--color-text)', fontWeight: 500}}>$2305</span></li>
            </ul>
            <a href="#consultation" className="btn">Select Plan</a>
          </div>

          <div className="pricing-card">
            <h3 className="pricing-title">Online Coaching</h3>
            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
              <span>Program</span>
              <span>Price</span>
            </div>
            <ul className="pricing-features">
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem', textAlign: 'left' }}>
                <span style={{paddingRight: '1rem'}}>Online Coaching</span> 
                <span style={{color: 'var(--color-text)', fontWeight: 500}}>$229 / mo</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.5rem', textAlign: 'left' }}>
                <span style={{paddingRight: '1rem', lineHeight: '1.2'}}>Online Coaching <br/>+ Live Classes <br/><span style={{fontSize: '0.75rem', color: 'var(--color-accent)'}}>(Most Popular)</span></span> 
                <span style={{color: 'var(--color-text)', fontWeight: 500}}>$279 / mo</span>
              </li>
            </ul>
            <a href="#consultation" className="btn btn-outline">Select Plan</a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="consultation" className="form-section">
        <h2 className="help-title" style={{ marginBottom: '1rem' }}>Ready to get started?</h2>
        <p>If you're ready to train smarter, feel stronger, and build confidence that carries into every part of your life, tell Marie a little about what you're looking for.</p>
        <form
          className="form-group"
          onSubmit={handleSignupSubmit}
          onChange={() => {
            if (signupStatus !== 'idle') {
              setSignupStatus('idle');
            }
          }}
        >
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="signup-first-name">Name <span aria-hidden="true">*</span></label>
              <input
                id="signup-first-name"
                name="firstName"
                type="text"
                value={signupFirstName}
                onChange={(event) => setSignupFirstName(event.target.value)}
                autoComplete="name"
                maxLength={80}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="signup-email">Email address <span aria-hidden="true">*</span></label>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={signupEmail}
                onChange={(event) => setSignupEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="signup-phone">Phone number <span className="field-optional">Optional</span></label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              value={signupPhone}
              onChange={(event) => setSignupPhone(event.target.value)}
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
            />
          </div>

          <fieldset className="form-field coaching-options">
            <legend>What type of coaching are you interested in? <span aria-hidden="true">*</span></legend>
            <div className="coaching-options-grid">
              {[
                ['personal-training', 'Personal Training'],
                ['group-training', 'Group Training'],
                ['online-coaching', 'Online Coaching'],
                ['not-sure', "I'm not sure yet"],
              ].map(([value, label]) => (
                <label className="coaching-option" key={value}>
                  <input
                    type="radio"
                    name="coachingInterest"
                    value={value}
                    checked={signupCoachingInterest === value}
                    onChange={() => setSignupCoachingInterest(value as CoachingInterest)}
                    required
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-field">
            <label htmlFor="signup-goals">What would you like help with? <span className="field-optional">Optional</span></label>
            <textarea
              id="signup-goals"
              name="goals"
              placeholder="Briefly tell Marie about your goals, experience, or anything she should know."
              value={signupGoals}
              onChange={(event) => setSignupGoals(event.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-honeypot" aria-hidden="true">
            <label htmlFor="signup-website">Website</label>
            <input
              id="signup-website"
              name="website"
              type="text"
              value={signupWebsite}
              onChange={(event) => setSignupWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="btn form-submit"
            disabled={signupStatus === 'submitting'}
          >
            {signupStatus === 'submitting' ? 'Sending...' : 'Request a Free Consultation'}
          </button>
          <p className="form-privacy">By submitting, you agree that Marie may contact you about your consultation request.</p>
        </form>
        <div id="signup-message" className="form-message" aria-live="polite" aria-atomic="true">
          {signupStatus === 'success' && (
            <p className="success">Thanks! Your consultation request has been sent. Check your inbox for a confirmation from Marie.</p>
          )}
          {signupStatus === 'duplicate' && (
            <p className="success">Marie already has a request from this email address and will follow up soon.</p>
          )}
          {signupStatus === 'error' && (
            <p className="error">We couldn't add you right now. Please try again in a moment.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <img src="/assets/build-to-burn-logo.jpg" alt="Build to Burn" className="footer-logo" />
        <p style={{ color: '#888', fontSize: '0.9rem' }}>San Diego, CA</p>
        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '2rem' }}>
          &copy; {new Date().getFullYear()} Build to Burn. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default App;
