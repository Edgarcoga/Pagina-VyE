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
                return [false].map(returning => {
                    const layer = document.createElement('canvas');
                    layer.width = canvas.width;
                    layer.height = canvas.height;
                    const ink = layer.getContext('2d');
                    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
                    ink.fillStyle = '#D4AF37';
                    const duration = 920; // Ritmo humano, natural y deliberado
                    const pass = { layer, ink, line, lineIndex, returning, delay, duration, drawn: 0 };
                    delay += duration + 140;
                    return pass;
                });
            });

            // A tilted felt tip deposits short connected strips. Only new ink is
            // added each frame; the existing waviness and pressure stay in place.
            function nib(pass, distance) {
                const { line, lineIndex } = pass;
                // ── Confident forward stroke (left to right) ──
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
            }

            let penTriggered = false;
            function triggerPen() {
                if (penTriggered) return;
                penTriggered = true;
                setTimeout(animatePenUnderline, 400);
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
                    context.globalAlpha = 0.76;
                    context.drawImage(pass.layer, 0, 0, width, height);
                });
                context.globalAlpha = 1;
                if (elapsed >= delay - 40 && !penTriggered) {
                    triggerPen();
                }
                if (elapsed < delay) {
                    frame = requestAnimationFrame(render);
                } else {
                    triggerPen();
                }
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

    function animatePenUnderline() {
        const penPath = hero?.querySelector('.text-pen-underline__path');
        if (!penPath) return;
        const length = (typeof penPath.getTotalLength === 'function') ? penPath.getTotalLength() : 520;
        penPath.style.strokeDasharray = `${length}`;
        penPath.style.strokeDashoffset = `${length}`;
        penPath.style.opacity = '1';

        let startTime = null;
        const duration = 750; // Trazado visible y deliberado a lápiz

        function drawFrame(now) {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: inicio firme y frenado suave orgánico
            const ease = 1 - Math.pow(1 - progress, 3);
            penPath.style.strokeDashoffset = `${(length * (1 - ease)).toFixed(2)}`;
            if (progress < 1) {
                requestAnimationFrame(drawFrame);
            } else {
                penPath.style.strokeDashoffset = '0';
            }
        }
        requestAnimationFrame(drawFrame);
    }

    function startHeroInkAnimation() {
        if (!hero || hero.classList.contains('hero--ink-ready')) return;
        drawHeroMarker();
        hero?.classList.add('hero--ink-ready');
    }

    if (preloader) {
        // Ejecución continua, fluida y ágil de la carga (1.6s) con rebote elástico completo
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            // Esperar el desvanecimiento de opacidad para iniciar los trazos dorados del hero
            setTimeout(startHeroInkAnimation, 300);
        }, 1600);
    } else {
        setTimeout(startHeroInkAnimation, 100);
    }

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    const brandTransition = document.getElementById('brandTransition');
    const isHomepage = document.body.classList.contains('homepage');
    let lastScroll = 0;

    function updateBrandTransition() {
        if (!isHomepage || !brandTransition || window.innerWidth < 769) return;
        // Transición progresiva, continua y suave a lo largo de 280px de scroll
        const progress = Math.min(window.scrollY / 280, 1);
        const remaining = 1 - progress;
        document.documentElement.style.setProperty('--brand-scroll-progress', progress.toFixed(3));
        document.documentElement.style.setProperty('--brand-offset-y', `${(remaining * 52).toFixed(1)}px`);
        document.documentElement.style.setProperty('--brand-scale', (1 + (remaining * 2.15)).toFixed(3));

        // Desvanecer suavemente el badge IPN al iniciar el scroll para que nunca colisione con el logo
        const badge = hero?.querySelector('.hero__badge');
        if (badge) {
            const badgeFade = Math.min(window.scrollY / 100, 1);
            badge.style.opacity = (1 - badgeFade).toFixed(2);
            badge.style.transform = `translateY(${-badgeFade * 10}px)`;
        }
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



    // ── PARTICLES (MODERADAS Y ESTÁTICAS PARA EVITAR DISTRACCIÓN) ──
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        // Reducido a 8 partículas sutiles de fondo, sin bucles infinitos de inserción
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = (i * 12 + Math.random() * 8) + '%';
            particle.style.bottom = (Math.random() * 80) + '%';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.opacity = '0.35';
            particleContainer.appendChild(particle);
        }
    }

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
                // When we can move forward, keep the highlight on nextBtn
                if (currentIndex < totalSlides - 1) {
                    nextBtn.classList.add('carril__arrow--forward-highlight');
                } else {
                    nextBtn.classList.remove('carril__arrow--forward-highlight');
                }
            }
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


    // ── PORTAFOLIO REAL & LIGHTBOX MODAL ──
    const PROJECTS = {
    "nissan": {
        "title": "ERP Nissan Universidad",
        "cat": "ERP · Concesionaria · En desarrollo",
        "shots": [
            {
                "src": "assets/portfolio/nissan_0.png",
                "t": "Acceso al portal",
                "d": "Inicio de sesión del equipo operativo de la concesionaria Nissan Universidad."
            },
            {
                "src": "assets/portfolio/nissan_1.png",
                "t": "Dashboard de ventas y SLA",
                "d": "Regla de los 5 días: 8.8% en meta, promedio de 3.2 días. Total facturado $73.78M con 99 unidades, según el tablero del sistema."
            },
            {
                "src": "assets/portfolio/nissan_2.png",
                "t": "Daños y evidencia fotográfica",
                "d": "Registro de afectaciones por vista del vehículo, con fotos del estado físico de recepción."
            },
            {
                "src": "assets/portfolio/nissan_3.png",
                "t": "Almacén y estatus del vehículo",
                "d": "381 unidades en proceso, según el tablero. Cada vehículo con VIN, cliente, SLA y etapa: almacén, mantenimiento, PDI y entrega."
            },
            {
                "src": "assets/portfolio/nissan_4.png",
                "t": "Pipeline de 5 etapas",
                "d": "202 unidades en agencia, según el tablero. El pipeline muestra en qué etapa se atora el proceso."
            },
            {
                "src": "assets/portfolio/nissan_5.png",
                "t": "Correo de restablecimiento de contraseña",
                "d": "Generación de correos para restablecer la contraseña del usuario operativo (rol ADPC)."
            },
            {
                "src": "assets/portfolio/nissan_6.png",
                "t": "Correo de verificación de usuario",
                "d": "Generación de correos para crear y verificar el usuario operativo (rol ADPC)."
            }
        ]
    },
    "contable": {
        "title": "Control Operativo y Contable",
        "cat": "Plataforma web · Finanzas",
        "shots": [
            {
                "src": "assets/portfolio/contable_0.jpg",
                "t": "Gestión de proyectos",
                "d": "Proyectos con hitos operativos y seguimiento en un solo panel."
            },
            {
                "src": "assets/portfolio/contable_1.jpg",
                "t": "Contratos",
                "d": "Control de vigencia y montos de cada contrato."
            },
            {
                "src": "assets/portfolio/contable_2.jpg",
                "t": "Proyectos",
                "d": "Vista general de proyectos activos de la empresa."
            },
            {
                "src": "assets/portfolio/contable_3.jpg",
                "t": "Reportes automáticos",
                "d": "Reportes financieros generados por el sistema, sin armarlos a mano."
            },
            {
                "src": "assets/portfolio/contable_4.jpg",
                "t": "Módulo REPSE",
                "d": "Documentación legal REPSE integrada a la operación."
            }
        ]
    },
    "billar": {
        "title": "POS Billar & Bar",
        "cat": "Punto de venta · Entretenimiento",
        "shots": [
            {
                "src": "assets/portfolio/billar_0.jpg",
                "t": "Pantalla principal",
                "d": "Acceso rápido a mesas, barra e inventario."
            },
            {
                "src": "assets/portfolio/billar_1.jpg",
                "t": "Control de tarifas",
                "d": "Mesas de billar cobradas automáticamente por tiempo."
            },
            {
                "src": "assets/portfolio/billar_2.jpg",
                "t": "Venta en barra",
                "d": "Comandas rápidas para barra sin filas."
            },
            {
                "src": "assets/portfolio/billar_3.jpg",
                "t": "Inventario",
                "d": "Existencias con alertas de reabastecimiento."
            },
            {
                "src": "assets/portfolio/billar_4.jpg",
                "t": "Historial de cortes",
                "d": "Cortes de caja por turno y por cajero."
            },
            {
                "src": "assets/portfolio/billar_5.jpg",
                "t": "Dashboard",
                "d": "Resumen de ventas y operación del negocio."
            }
        ]
    },
    "pos": {
        "title": "POS General Premium",
        "cat": "Punto de venta · Comercio",
        "shots": [
            {
                "src": "assets/portfolio/pos_0.jpg",
                "t": "Pantalla principal",
                "d": "Venta rápida pensada para el mostrador."
            },
            {
                "src": "assets/portfolio/pos_1.jpg",
                "t": "Facturación CFDI 4.0",
                "d": "Facturación electrónica integrada con el SAT."
            },
            {
                "src": "assets/portfolio/pos_2.jpg",
                "t": "Inventario inteligente",
                "d": "Alertas de stock para no quedarte sin producto."
            },
            {
                "src": "assets/portfolio/pos_3.jpg",
                "t": "Historial de cortes",
                "d": "Cortes de caja, devoluciones y arqueos."
            },
            {
                "src": "assets/portfolio/pos_4.jpg",
                "t": "Configuración y licencias",
                "d": "Ajustes del sistema y control de licencias."
            },
            {
                "src": "assets/portfolio/pos_5.jpg",
                "t": "Usuarios y roles",
                "d": "Usuarios con permisos según su rol en el negocio."
            }
        ]
    }
};

    // Proyecto Destacado (Nissan) Thumbnail Switcher
    const featImg = document.getElementById('featImg');
    const featTitle = document.getElementById('featTitle');
    const featDesc = document.getElementById('featDesc');
    const thumbsBox = document.getElementById('featThumbs');
    let featCur = 1; // Start on screen 1 (Dashboard de ventas y SLA)

    if (thumbsBox && PROJECTS.nissan && PROJECTS.nissan.shots) {
        const nissanShots = PROJECTS.nissan.shots;
        thumbsBox.innerHTML = '';
        nissanShots.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-label', s.t);
            if (i === featCur) btn.className = 'on';

            const im = document.createElement('img');
            im.src = s.src;
            im.alt = s.t;
            im.loading = 'lazy';
            btn.appendChild(im);

            btn.addEventListener('click', () => {
                setFeat(i);
            });
            thumbsBox.appendChild(btn);
        });

        function setFeat(i) {
            featCur = i;
            const s = nissanShots[i];
            if (featImg) {
                featImg.src = s.src;
                featImg.alt = s.t + ' — ERP Nissan Universidad';
            }
            if (featTitle) featTitle.textContent = s.t;
            if (featDesc) featDesc.textContent = s.d;

            Array.from(thumbsBox.children).forEach((b, j) => {
                b.classList.toggle('on', j === i);
            });
        }

        if (featImg) {
            featImg.addEventListener('click', () => {
                openLb('nissan', featCur);
            });
        }
    }

    // Lightbox modal logic
    const lb = document.getElementById('lb');
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbCat = document.getElementById('lbCat');
    const lbCapT = document.getElementById('lbCapT');
    const lbCapD = document.getElementById('lbCapD');
    const lbCount = document.getElementById('lbCount');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');

    let lbProj = null;
    let lbIdx = 0;
    let lastFocus = null;

    window.openLb = function(key, idx) {
        if (!PROJECTS[key]) return;
        lbProj = PROJECTS[key];
        lbIdx = idx || 0;
        lastFocus = document.activeElement;

        if (lbTitle) lbTitle.textContent = lbProj.title;
        if (lbCat) lbCat.textContent = lbProj.cat;

        renderLb();

        if (lb) {
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        if (lbClose) lbClose.focus();
    };

    window.closeLb = function() {
        if (lb) {
            lb.classList.remove('open');
            document.body.style.overflow = '';
        }
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    };

    function renderLb() {
        if (!lbProj || !lbProj.shots || !lbProj.shots[lbIdx]) return;
        const s = lbProj.shots[lbIdx];
        if (lbImg) {
            lbImg.src = s.src;
            lbImg.alt = s.t + ' — ' + lbProj.title;
        }
        if (lbCapT) lbCapT.textContent = s.t;
        if (lbCapD) lbCapD.textContent = s.d;
        if (lbCount) lbCount.textContent = (lbIdx + 1) + ' / ' + lbProj.shots.length;
    }

    function step(direction) {
        if (!lbProj || !lbProj.shots.length) return;
        lbIdx = (lbIdx + direction + lbProj.shots.length) % lbProj.shots.length;
        renderLb();
    }

    // Attach click to cards with data-proj attribute
    document.querySelectorAll('[data-proj]').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-proj');
            window.openLb(key, 0);
        });
    });

    if (lbClose) lbClose.addEventListener('click', window.closeLb);
    if (lbPrev) lbPrev.addEventListener('click', () => step(-1));
    if (lbNext) lbNext.addEventListener('click', () => step(1));

    if (lb) {
        lb.addEventListener('click', (e) => {
            if (e.target === lb) window.closeLb();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lb || !lb.classList.contains('open')) return;
        if (e.key === 'Escape') window.closeLb();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
    });

    // Touch swipe navigation for Lightbox on mobile
    let touchStartX = null;
    if (lb) {
        lb.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        lb.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 48) {
                step(dx < 0 ? 1 : -1);
            }
            touchStartX = null;
        }, { passive: true });
    }

    // ── CINTA CONTINUA (STRIP TICKER INFINITO) ──
    const stripIn = document.getElementById('stripIn');
    if (stripIn && stripIn.children.length <= 8) {
        stripIn.innerHTML += stripIn.innerHTML;
    }

    // ── FORMULARIO DE CONTACTO / DIAGNÓSTICO -> WHATSAPP ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = (document.getElementById('c-nombre')?.value || '').trim();
            const empresa = (document.getElementById('c-empresa')?.value || '').trim();
            const mensaje = (document.getElementById('c-mensaje')?.value || '').trim();

            const lines = ['Hola VyE, me gustaría solicitar un diagnóstico de eficiencia.'];
            if (nombre) {
                lines.push(`Soy ${nombre}${empresa ? ` (${empresa})` : ''}.`);
            } else if (empresa) {
                lines.push(`Contacto / Negocio: ${empresa}.`);
            }
            if (mensaje) {
                lines.push(`Situación a resolver: ${mensaje}`);
            }

            const url = `https://wa.me/527718429946?text=${encodeURIComponent(lines.join('\n'))}`;
            window.open(url, '_blank', 'noopener');
        });
    }



    // ── PROCESO INTERACTIVO 3 PASOS (ESTILO LINEAR / RAYCAST) ──
    const processSection = document.getElementById('proceso');
    if (processSection) {
        const titles = processSection.querySelectorAll('.process-stacked-title');
        const cards = processSection.querySelectorAll('.process-card');
        const steps = processSection.querySelectorAll('.process-step-item');
        let currentStep = 1;
        let isUserInteracting = false;

        function setStep(stepNum) {
            currentStep = stepNum;
            titles.forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-step') === String(stepNum));
            });
            cards.forEach(c => {
                c.classList.toggle('active', c.getAttribute('data-step') === String(stepNum));
            });
            steps.forEach(s => {
                s.classList.toggle('active', s.getAttribute('data-step') === String(stepNum));
            });
        }

        titles.forEach(t => {
            t.addEventListener('mouseenter', () => {
                isUserInteracting = true;
                const s = parseInt(t.getAttribute('data-step'), 10);
                if (s) setStep(s);
            });
            t.addEventListener('click', () => {
                isUserInteracting = true;
                const s = parseInt(t.getAttribute('data-step'), 10);
                if (s) setStep(s);
            });
        });

        cards.forEach(c => {
            c.addEventListener('mouseenter', () => {
                isUserInteracting = true;
                const s = parseInt(c.getAttribute('data-step'), 10);
                if (s) setStep(s);
            });
            c.addEventListener('click', () => {
                isUserInteracting = true;
                const s = parseInt(c.getAttribute('data-step'), 10);
                if (s) setStep(s);
            });
        });

        steps.forEach(s => {
            s.addEventListener('mouseenter', () => {
                isUserInteracting = true;
                const step = parseInt(s.getAttribute('data-step'), 10);
                if (step) setStep(step);
            });
            s.addEventListener('click', () => {
                isUserInteracting = true;
                const step = parseInt(s.getAttribute('data-step'), 10);
                if (step) setStep(step);
            });
        });

        processSection.addEventListener('mouseleave', () => {
            isUserInteracting = false;
        });

        setInterval(() => {
            if (!isUserInteracting) {
                let next = currentStep + 1;
                if (next > 3) next = 1;
                setStep(next);
            }
        }, 4500);
    }

});
