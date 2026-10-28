/* ================================================================
   VyE INGENIERÍA — Interactive Scripts
   Diseñamos Eficiencia
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    const hero = document.querySelector('.hero');

    function drawHeroMarker() {
        const title = hero?.querySelector('.hero__title-line--accent');
        if (!title) return;
        const canvas = document.createElement('canvas');
        canvas.className = 'hero__marker-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        title.appendChild(canvas);
        let frame;
        let startedAt;

        function prepare() {
            cancelAnimationFrame(frame);
            const bounds = title.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            const pad = 10;
            const width = bounds.width + pad * 2;
            const height = bounds.height + pad * 2;
            canvas.style.inset = `-${pad}px`;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.width = Math.ceil(width * ratio);
            canvas.height = Math.ceil(height * ratio);
            const context = canvas.getContext('2d');
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            const lines = [];
            title.querySelectorAll('.hero__marker-word').forEach(word => {
                const rect = word.getBoundingClientRect();
                const previous = lines[lines.length - 1];
                if (previous && Math.abs(previous.top - rect.top) < 3) {
                    previous.right = rect.right;
                } else {
                    lines.push({ left: rect.left, right: rect.right, top: rect.top, height: rect.height });
                }
            });
            let delay = 60;
            const passes = lines.flatMap((line, lineIndex) => {
                return [false, true].map(returning => {
                    const layer = document.createElement('canvas');
                    layer.width = canvas.width;
                    layer.height = canvas.height;
                    const ink = layer.getContext('2d');
                    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
                    ink.fillStyle = returning ? '#e5b84a' : '#d4a843';
                    const duration = returning ? 720 : 850;
                    const pass = { layer, ink, line, lineIndex, returning, delay, duration, drawn: 0 };
                    delay += duration + 90;
                    return pass;
                });
            });
            const pen = hero.querySelector('.text-pen-underline');
            pen?.style.setProperty('--pen-forward-delay', `${delay + 750}ms`);

            // A tilted felt tip deposits short connected strips. Only new ink is
            // added each frame; the existing waviness and pressure stay in place.
            function nib(pass, distance) {
                const { line, returning, lineIndex } = pass;
                if (!returning) {
                    // ── First pass: confident forward stroke (left to right) ──
                    const span = (line.right - line.left + 12);
                    const x = (line.left - bounds.left + pad - 4) + distance * span;
                    const yBase = line.top - bounds.top + pad + line.height * 0.67 - distance * 1.8;
                    const wave = Math.sin(distance * 11 + lineIndex) * 1.6 + Math.sin(distance * 26) * 0.6;
                    const y = yBase + wave;
                    const pressure = 0.94 + Math.sin(distance * 14) * 0.06 + Math.sin(distance * 32) * 0.025;
                    const half = line.height * 0.28 * pressure;
                    const dxTop = -2.8;
                    const dxBottom = 2.8;
                    return { x, y, half, dxTop, dxBottom };
                } else {
                    // ── Second pass: human, irregular return stroke (right to left) ──
                    // Starts inset on the right and overshoots on the left with natural hand drift
                    const span = (line.right - line.left + 14);
                    const startX = line.right - bounds.left + pad + 3;
                    const x = startX - distance * span;
                    // Natural wrist pivot arc
                    const wristArc = Math.sin(distance * Math.PI) * 3.6;
                    // Diagonal drift across text (crosses slightly higher on the left)
                    const drift = (1 - distance) * 4.2 - 2.0;
                    // Richer, independent wave harmonics for hand-drawn irregularity
                    const wave = Math.sin(distance * 7.4 + 2.3) * 2.3
                        + Math.sin(distance * 18.2 + 0.9) * 1.2
                        + Math.sin(distance * 39.0) * 0.45;
                    const y = line.top - bounds.top + pad + line.height * 0.61 + drift + wristArc + wave;
                    // Looser, more organic pressure variation
                    const pressure = 0.88 + Math.sin(distance * 5.8 + 1.2) * 0.15
                        + Math.sin(distance * 21.0) * 0.08;
                    const half = line.height * 0.245 * pressure;
                    // Returning wrist changes chisel tip angle and slant
                    const dxTop = -0.8 + Math.sin(distance * 9) * 0.7;
                    const dxBottom = 4.0 + Math.sin(distance * 11) * 0.6;
                    return { x, y, half, dxTop, dxBottom };
                }
            }

            function render(now) {
                if (startedAt === undefined) startedAt = now;
                const elapsed = now - startedAt;
                context.clearRect(0, 0, width, height);
                passes.forEach(pass => {
                    const t = Math.max(0, Math.min(1, (elapsed - pass.delay) / pass.duration));
                    // Gentle acceleration with small changes of hand speed.
                    const progress = t - Math.sin(t * Math.PI * 2) * 0.055;
                    const steps = Math.ceil((pass.line.right - pass.line.left) * 2);
                    const target = Math.floor(progress * steps);
                    if (target > pass.drawn) {
                        // One continuous ink surface avoids seams between nib samples.
                        pass.ink.clearRect(0, 0, width, height);
                        pass.ink.beginPath();
                        for (let i = 0; i <= target; i++) {
                            const point = nib(pass, i / steps);
                            if (i === 0) pass.ink.moveTo(point.x + point.dxTop, point.y - point.half);
                            else pass.ink.lineTo(point.x + point.dxTop, point.y - point.half);
                        }
                        for (let i = target; i >= 0; i--) {
                            const point = nib(pass, i / steps);
                            pass.ink.lineTo(point.x + point.dxBottom, point.y + point.half);
                        }
                        pass.ink.closePath();
                        pass.ink.fill();
                    }
                    pass.drawn = target;
                    context.globalAlpha = pass.returning ? 0.46 : 0.74;
                    context.drawImage(pass.layer, 0, 0, width, height);
                });
                context.globalAlpha = 1;
                if (elapsed < delay) frame = requestAnimationFrame(render);
            }
            frame = requestAnimationFrame(render);
        }

        prepare();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(prepare, 150);
        }, { passive: true });
    }

    function startHeroInkAnimation() {
        if (!hero || hero.classList.contains('hero--ink-ready')) return;
        drawHeroMarker();
        hero?.classList.add('hero--ink-ready');
    }

    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                // Wait until the preloader fade has finished so the drawing is visible.
                setTimeout(startHeroInkAnimation, 650);
            }, 1800);
        } else {
            setTimeout(startHeroInkAnimation, 250);
        }
    });

    // Fallback: hide preloader after 3s regardless
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            setTimeout(startHeroInkAnimation, 650);
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
        document.documentElement.style.setProperty('--brand-offset-y', `${(remaining * 52).toFixed(1)}px`);
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
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 8;
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
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




    // ── CARRIL DE SECCIONES (NOSOTROS) ──
    const carrilViewport = document.getElementById('nosotrosCarrilViewport');
    const carrilTrack = document.getElementById('nosotrosCarrilTrack');

    if (carrilViewport && carrilTrack) {
        const slides = carrilTrack.querySelectorAll('.carril__slide');
        const tabs = document.querySelectorAll('.carril__tab');
        const dots = document.querySelectorAll('.carril__dot');
        const prevBtn = document.getElementById('carrilPrevBtn');
        const nextBtn = document.getElementById('carrilNextBtn');
        const currentNumEl = document.getElementById('carrilCurrentNum');
        const inlineBtns = document.querySelectorAll('[data-carril-goto]');

        let currentIndex = 0;
        const totalSlides = slides.length;
        const autoplayBar = document.getElementById('carrilAutoplayBar');
        const autoplayTime = document.getElementById('carrilAutoplayTime');
        const carrilContainer = document.querySelector('.carril__container') || carrilViewport;

        const AUTOPLAY_DURATION = 30000; // 30 segundos
        let autoplayStartTime = performance.now();
        let pausedDuration = 0;
        let isCarrilHovered = false;
        let pauseStartTime = null;
        let autoplayRafId = null;

        function resetAutoplay() {
            autoplayStartTime = performance.now();
            pausedDuration = 0;
            if (isCarrilHovered) {
                pauseStartTime = performance.now();
            } else {
                pauseStartTime = null;
            }
            if (autoplayBar) autoplayBar.style.width = '0%';
            if (autoplayTime) autoplayTime.textContent = '30s';
        }

        function runAutoplay(now) {
            if (!isCarrilHovered && !isPointerDown) {
                const totalElapsed = (now - autoplayStartTime) - pausedDuration;
                const progress = Math.min(1, Math.max(0, totalElapsed / AUTOPLAY_DURATION));

                if (autoplayBar) {
                    autoplayBar.style.width = `${progress * 100}%`;
                }
                if (autoplayTime) {
                    const remainingSeconds = Math.max(0, Math.ceil((AUTOPLAY_DURATION - totalElapsed) / 1000));
                    autoplayTime.textContent = `${remainingSeconds}s`;
                }

                if (totalElapsed >= AUTOPLAY_DURATION) {
                    // Advance to next slide in cycle (0 -> 1 -> 2 -> 0)
                    const nextIdx = (currentIndex + 1) % totalSlides;
                    updateCarril(nextIdx);
                    return;
                }
            }
            autoplayRafId = requestAnimationFrame(runAutoplay);
        }

        function updateCarril(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;

            // Slide position (each slide is 100% of viewport)
            carrilTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update Tabs
            tabs.forEach((tab, i) => {
                const isActive = (i === currentIndex);
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Update Dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Update Counter
            if (currentNumEl) {
                currentNumEl.textContent = `0${currentIndex + 1}`;
            }

            // Update Navigation Buttons (prev / next disabled & highlight)
            if (prevBtn) {
                prevBtn.disabled = (currentIndex === 0);
            }
            if (nextBtn) {
                nextBtn.disabled = (currentIndex === totalSlides - 1);
                // When we can move forward, keep the highlight on nextBtn (like in reference video)
                if (currentIndex < totalSlides - 1) {
                    nextBtn.classList.add('carril__arrow--forward-highlight');
                } else {
                    nextBtn.classList.remove('carril__arrow--forward-highlight');
                }
            }

            // Reset autoplay progress for the newly active slide
            resetAutoplay();
            if (autoplayRafId) cancelAnimationFrame(autoplayRafId);
            autoplayRafId = requestAnimationFrame(runAutoplay);
        }

        // Pause autoplay on mouse hover over carril or controls so reading is never interrupted
        if (carrilContainer) {
            carrilContainer.addEventListener('mouseenter', () => {
                if (!isCarrilHovered) {
                    isCarrilHovered = true;
                    pauseStartTime = performance.now();
                }
            });
            carrilContainer.addEventListener('mouseleave', () => {
                if (isCarrilHovered) {
                    if (pauseStartTime) {
                        pausedDuration += (performance.now() - pauseStartTime);
                        pauseStartTime = null;
                    }
                    isCarrilHovered = false;
                }
            });
            carrilContainer.addEventListener('touchstart', () => {
                isCarrilHovered = true;
                pauseStartTime = performance.now();
            }, { passive: true });
            carrilContainer.addEventListener('touchend', () => {
                if (pauseStartTime) {
                    pausedDuration += (performance.now() - pauseStartTime);
                    pauseStartTime = null;
                }
                isCarrilHovered = false;
            }, { passive: true });
        }

        // Button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateCarril(currentIndex - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateCarril(currentIndex + 1));
        }

        // Tab clicks
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetIdx = parseInt(tab.getAttribute('data-tab'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx);
            });
        });

        // Dot clicks
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-dot'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx);
            });
        });

        // Inline "siguiente" buttons inside slides
        inlineBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetIdx = parseInt(btn.getAttribute('data-carril-goto'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx);
            });
        });

        // Keyboard arrows navigation when over carril
        carrilViewport.setAttribute('tabindex', '0');
        carrilViewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                updateCarril(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                updateCarril(currentIndex + 1);
            }
        });

        // Touch & Pointer Drag Gestures (Desplazamiento a mano)
        let isPointerDown = false;
        let startX = 0;
        let startY = 0;
        let isHorizontalSwipe = false;

        carrilViewport.addEventListener('pointerdown', (e) => {
            // Ignore clicks on buttons/links
            if (e.target.closest('button, a, svg')) return;
            isPointerDown = true;
            isHorizontalSwipe = false;
            startX = e.clientX;
            startY = e.clientY;
            carrilViewport.classList.add('is-dragging');
            carrilTrack.classList.add('is-dragging');
        });

        window.addEventListener('pointermove', (e) => {
            if (!isPointerDown) return;
            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;

            // Check if user is scrolling vertically or swiping horizontally
            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
                    isHorizontalSwipe = true;
                } else if (Math.abs(diffY) > 8) {
                    // Vertical page scroll, cancel horizontal drag
                    isPointerDown = false;
                    carrilViewport.classList.remove('is-dragging');
                    carrilTrack.classList.remove('is-dragging');
                    return;
                }
            }

            if (isHorizontalSwipe) {
                const width = carrilViewport.offsetWidth || window.innerWidth;
                const percentShift = (diffX / width) * 100;
                // Add rubber-band dampening at edges
                let effectiveShift = percentShift;
                if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
                    effectiveShift = percentShift * 0.35;
                }
                const baseOffset = -currentIndex * 100;
                carrilTrack.style.transform = `translateX(${baseOffset + effectiveShift}%)`;
            }
        });

        function handlePointerUp(e) {
            if (!isPointerDown) return;
            isPointerDown = false;
            carrilViewport.classList.remove('is-dragging');
            carrilTrack.classList.remove('is-dragging');

            if (isHorizontalSwipe) {
                const diffX = e.clientX - startX;
                const threshold = Math.min(60, (carrilViewport.offsetWidth || 400) * 0.15);
                if (diffX < -threshold && currentIndex < totalSlides - 1) {
                    updateCarril(currentIndex + 1);
                } else if (diffX > threshold && currentIndex > 0) {
                    updateCarril(currentIndex - 1);
                } else {
                    updateCarril(currentIndex); // Snap back to current
                }
            }
        }

        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        // Initial setup
        updateCarril(0);
    }


    // ── CARRUSEL NUESTRO TRABAJO (GALERÍA FOTOS REALES) ──
    const galeriaViewport = document.getElementById('galeriaViewport');
    const galeriaProgressBar = document.getElementById('galeriaProgressBar');
    const galeriaProgressTrack = document.getElementById('galeriaProgressTrack');
    const galeriaPrevBtn = document.getElementById('galeriaPrevBtn');
    const galeriaNextBtn = document.getElementById('galeriaNextBtn');

    if (galeriaViewport && galeriaProgressBar) {
        function updateGaleriaProgress() {
            const maxScroll = galeriaViewport.scrollWidth - galeriaViewport.clientWidth;
            const trackWidth = galeriaProgressTrack ? galeriaProgressTrack.offsetWidth : 300;
            
            if (maxScroll > 0) {
                const ratio = galeriaViewport.scrollLeft / maxScroll;
                const barWidth = Math.max(80, trackWidth * (galeriaViewport.clientWidth / galeriaViewport.scrollWidth));
                galeriaProgressBar.style.width = `${barWidth}px`;
                const maxShift = trackWidth - barWidth;
                galeriaProgressBar.style.transform = `translateX(${ratio * maxShift}px)`;

                if (galeriaPrevBtn) {
                    galeriaPrevBtn.disabled = galeriaViewport.scrollLeft <= 10;
                }
                if (galeriaNextBtn) {
                    const atEnd = galeriaViewport.scrollLeft >= maxScroll - 10;
                    galeriaNextBtn.disabled = atEnd;
                    if (!atEnd) {
                        galeriaNextBtn.classList.add('galeria-carrusel__arrow--active');
                    } else {
                        galeriaNextBtn.classList.remove('galeria-carrusel__arrow--active');
                    }
                }
            }
        }

        galeriaViewport.addEventListener('scroll', updateGaleriaProgress, { passive: true });
        window.addEventListener('resize', updateGaleriaProgress);

        let galeriaDirection = 1; // 1 = avanza hacia la derecha, -1 = regresa hacia la izquierda

        if (galeriaNextBtn) {
            galeriaNextBtn.addEventListener('click', () => {
                galeriaDirection = 1;
                const scrollAmount = Math.max(340, galeriaViewport.clientWidth * 0.7);
                galeriaViewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        if (galeriaPrevBtn) {
            galeriaPrevBtn.addEventListener('click', () => {
                galeriaDirection = -1;
                const scrollAmount = Math.max(340, galeriaViewport.clientWidth * 0.7);
                galeriaViewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        // ── AUTO-DESPLAZAMIENTO SUAVE BIDIRECCIONAL (REGRESA SUAVEMENTE AL LLEGAR AL FINAL) ──
        let isGaleriaHovered = false;
        let isGaleriaTurning = false;
        let galeriaTurnTimeout = null;
        let isModalOpen = false;
        const GALERIA_SPEED = 0.85; // px por frame (~50px/segundo a 60fps)

        function autoScrollGaleria() {
            if (!isGaleriaHovered && !isPointerDown && !isGaleriaTurning && !isModalOpen) {
                const maxScroll = galeriaViewport.scrollWidth - galeriaViewport.clientWidth;
                if (maxScroll > 0) {
                    if (galeriaDirection === 1) {
                        if (galeriaViewport.scrollLeft >= maxScroll - 2) {
                            // Llegó al final: breve pausa suave (500ms) y empieza a regresar solo para no verse trabado
                            isGaleriaTurning = true;
                            galeriaTurnTimeout = setTimeout(() => {
                                galeriaDirection = -1;
                                isGaleriaTurning = false;
                            }, 500);
                        } else {
                            galeriaViewport.scrollLeft += GALERIA_SPEED;
                        }
                    } else {
                        if (galeriaViewport.scrollLeft <= 2) {
                            // Llegó al inicio: breve pausa suave (500ms) y vuelve a avanzar
                            isGaleriaTurning = true;
                            galeriaTurnTimeout = setTimeout(() => {
                                galeriaDirection = 1;
                                isGaleriaTurning = false;
                            }, 500);
                        } else {
                            galeriaViewport.scrollLeft -= GALERIA_SPEED;
                        }
                    }
                }
            }
            requestAnimationFrame(autoScrollGaleria);
        }

        requestAnimationFrame(autoScrollGaleria);

        // Al pasar el mouse por encima de la galería, se detiene el auto-desplazamiento
        // y el usuario puede interactuar de manera 100% normal
        const galeriaCarruselWrap = document.querySelector('.galeria-carrusel') || galeriaViewport;

        galeriaCarruselWrap.addEventListener('mouseenter', () => {
            isGaleriaHovered = true;
            if (isGaleriaTurning && galeriaTurnTimeout) {
                clearTimeout(galeriaTurnTimeout);
                isGaleriaTurning = false;
            }
        });

        galeriaCarruselWrap.addEventListener('mouseleave', () => {
            isGaleriaHovered = false;
        });

        galeriaCarruselWrap.addEventListener('touchstart', () => {
            isGaleriaHovered = true;
        }, { passive: true });

        galeriaCarruselWrap.addEventListener('touchend', () => {
            setTimeout(() => {
                isGaleriaHovered = false;
            }, 3000);
        }, { passive: true });

        // Pointer Drag-to-Scroll (arrastre con ratón o táctil)
        let isPointerDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        let hasMoved = false;

        galeriaViewport.addEventListener('pointerdown', (e) => {
            isPointerDown = true;
            hasMoved = false;
            startX = e.pageX - galeriaViewport.offsetLeft;
            startScrollLeft = galeriaViewport.scrollLeft;
            galeriaViewport.classList.add('is-dragging');
        });

        window.addEventListener('pointermove', (e) => {
            if (!isPointerDown) return;
            const x = e.pageX - galeriaViewport.offsetLeft;
            const walk = (x - startX) * 1.4;
            if (Math.abs(walk) > 4) hasMoved = true;
            galeriaViewport.scrollLeft = startScrollLeft - walk;
        });

        function endDrag() {
            if (!isPointerDown) return;
            isPointerDown = false;
            galeriaViewport.classList.remove('is-dragging');
        }

        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);

        // Lightbox Modal para fotos reales al hacer clic
        const modal = document.getElementById('galeriaModal');
        const modalClose = document.getElementById('galeriaModalClose');
        const modalBackdrop = document.getElementById('galeriaModalBackdrop');
        const modalImg = document.getElementById('galeriaModalImg');
        const modalPlaceholder = document.getElementById('galeriaModalPlaceholder');
        const modalIcon = document.getElementById('galeriaModalIcon');
        const modalTag = document.getElementById('galeriaModalTag');
        const modalTitle = document.getElementById('galeriaModalTitle');
        const modalDesc = document.getElementById('galeriaModalDesc');

        const cards = galeriaViewport.querySelectorAll('.galeria-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If the user was dragging, don't trigger modal click
                if (hasMoved) return;

                const title = card.getAttribute('data-title') || '';
                const tag = card.getAttribute('data-tag') || '';
                const desc = card.getAttribute('data-desc') || '';
                const cardImg = card.querySelector('.galeria-card__img');
                const cardBadgeSvg = card.querySelector('.galeria-card__badge-icon svg');

                if (modalTitle) modalTitle.textContent = title;
                if (modalTag) modalTag.textContent = tag;
                if (modalDesc) modalDesc.textContent = desc;

                if (cardImg && cardImg.getAttribute('src') && cardImg.style.display !== 'none') {
                    if (modalImg) {
                        modalImg.src = cardImg.src;
                        modalImg.style.display = 'block';
                    }
                    if (modalPlaceholder) modalPlaceholder.style.display = 'none';
                } else {
                    if (modalImg) modalImg.style.display = 'none';
                    if (modalPlaceholder) modalPlaceholder.style.display = 'flex';
                    if (modalIcon && cardBadgeSvg) {
                        modalIcon.innerHTML = cardBadgeSvg.outerHTML;
                    }
                }

                if (modal) {
                    modal.classList.add('is-open');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    isModalOpen = true;
                }
            });
        });

        function closeModal() {
            if (modal) {
                modal.classList.remove('is-open');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                isModalOpen = false;
            }
        }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // Initialize progress bar
        setTimeout(updateGaleriaProgress, 200);
    }

});
