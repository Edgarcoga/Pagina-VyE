/* ================================================================
   VyE INGENIERÍA — Interactive Scripts
   Diseñamos Eficiencia
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 1800);
        }
    });

    // Fallback: hide preloader after 3s regardless
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 3000);
    }

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    const brandTransition = document.getElementById('brandTransition');
    const isHomepage = document.body.classList.contains('homepage');
    let lastScroll = 0;

    function updateBrandTransition() {
        if (!isHomepage || !brandTransition || window.innerWidth < 769) return;
        const progress = Math.min(window.scrollY / 340, 1);
        const remaining = 1 - progress;
        document.documentElement.style.setProperty('--brand-scroll-progress', progress.toFixed(3));
        document.documentElement.style.setProperty('--brand-offset-y', `${(remaining * 138).toFixed(1)}px`);
        document.documentElement.style.setProperty('--brand-scale', (1 + (remaining * 2.15)).toFixed(3));
    }

    function handleScroll() {
        const scrollY = window.scrollY;
        if (!navbar) return;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
        updateBrandTransition();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateBrandTransition, { passive: true });
    updateBrandTransition();

    // ── MOBILE MENU ──
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active').toString());
        });
    }

    // Close menu on link click
    document.querySelectorAll('.navbar__link, .navbar__cta-btn').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // ── SMOOTH SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── REVEAL ON SCROLL ──
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animations
                    const delay = Array.from(entry.target.parentElement?.children || [])
                        .filter(child => child.hasAttribute('data-reveal'))
                        .indexOf(entry.target) * 100;

                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);

                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));



    // ── PARTICLES ──
    const particleContainer = document.getElementById('heroParticles');

    function createParticle() {
        if (!particleContainer) return;
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const x = Math.random() * 100;
        const duration = 8 + Math.random() * 12;
        const size = 1 + Math.random() * 3;
        const delay = Math.random() * 5;

        particle.style.left = x + '%';
        particle.style.bottom = '-10px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particleContainer.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial particles
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            createParticle();
        }

        // Continuously add particles only on the page that contains the hero.
        setInterval(createParticle, 800);
    }



    // ── MAGNETIC EFFECT ON CTA BUTTONS ──
    document.querySelectorAll('.btn--primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ── PARALLAX ON HERO ──
    const heroGlow = document.querySelector('.hero__glow');
    const heroGrid = document.querySelector('.hero__bg-grid');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        if (heroGlow) {
            heroGlow.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        }

        if (heroGrid) {
            heroGrid.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
        }
    });

    // ── ACTIVE SECTION TRACKING ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach(section => sectionObserver.observe(section));

    // ── CURSOR GLOW EFFECT ──
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212, 168, 67, 0.04) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    let cursorTimeout;
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';

        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            cursorGlow.style.opacity = '0';
        }, 3000);
    });

    // ── TILT EFFECT ON CARDS ──
    document.querySelectorAll('.diferencial__value, .servicio__card, .problema__point').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
                perspective(1000px)
                rotateY(${x * 5}deg)
                rotateX(${-y * 5}deg)
                translateY(-4px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── SCROLL PROGRESS ──
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold));
        z-index: 10001;
        transition: width 0.1s;
        width: 0%;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollableHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPct = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        scrollProgress.style.width = scrollPct + '%';
    }, { passive: true });



});
