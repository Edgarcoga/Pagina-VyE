/* ================================================================
   VyE INGENIERÍA — COMPONENTE NAVBAR COMPARTIDA
   Renderiza e hidrata navegación consistente desde VyE.config.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});
    const { createEl, qs, qsa } = VyE.dom;

    function buildNavbarContent(mount, pageConfig) {
        mount.innerHTML = '';

        const logo = createEl(
            'a',
            {
                href: pageConfig.logoHref,
                className: 'navbar__logo',
                id: pageConfig.isBrandAnimated ? 'brandTransition' : null,
                attrs: { 'aria-label': 'VyE Ingeniería - Inicio' }
            },
            [
                createEl('img', {
                    src: 'assets/Isotipo Vye.png',
                    alt: 'VyE Isotipo',
                    className: 'navbar__logo-icon',
                    width: 40,
                    height: 40
                }),
                createEl('div', { className: 'navbar__logo-text' }, [
                    createEl('img', {
                        src: 'assets/Logotipo Vye.svg',
                        alt: 'VYE',
                        className: 'navbar__logotipo',
                        height: 18
                    }),
                    createEl('span', { className: 'navbar__sub', text: VyE.config.brand.sub })
                ])
            ]
        );

        const toggle = createEl(
            'button',
            {
                type: 'button',
                className: 'navbar__toggle',
                id: 'navToggle',
                attrs: {
                    'aria-label': 'Abrir menú de navegación',
                    'aria-expanded': 'false',
                    'aria-controls': 'navMenu'
                }
            },
            [createEl('span'), createEl('span'), createEl('span')]
        );

        const menuItems = pageConfig.links.map(function (item) {
            return createEl('li', null, [
                createEl('a', {
                    href: item.href,
                    className: 'navbar__link' + (item.active ? ' active' : ''),
                    text: item.label
                })
            ]);
        });

        let ctaNode;
        if (pageConfig.cta.type === 'button') {
            ctaNode = createEl('button', {
                type: 'button',
                className: 'navbar__cta-btn',
                text: pageConfig.cta.label,
                dataset: pageConfig.cta.openModal ? { openModal: pageConfig.cta.openModal } : {}
            });
        } else {
            ctaNode = createEl('a', {
                href: pageConfig.cta.href,
                className: 'navbar__cta-btn',
                text: pageConfig.cta.label
            });
        }
        menuItems.push(createEl('li', null, [ctaNode]));

        const menu = createEl('ul', { className: 'navbar__menu', id: 'navMenu' }, menuItems);
        const container = createEl('div', { className: 'navbar__container' }, [logo, toggle, menu]);
        mount.appendChild(container);
    }

    function initScrollProgress() {
        if (document.body.dataset.scrollProgress === 'false') return;
        const bar = createEl('div', { className: 'scroll-progress', attrs: { 'aria-hidden': 'true' } });
        document.body.appendChild(bar);

        function updateBar() {
            const scrollable = document.body.scrollHeight - global.innerHeight;
            const pct = scrollable > 0 ? Math.min(100, Math.max(0, (global.scrollY / scrollable) * 100)) : 0;
            bar.style.width = pct.toFixed(2) + '%';
        }

        global.addEventListener('scroll', updateBar, { passive: true });
        updateBar();
    }

    function init() {
        const navbar = qs('#navbar') || qs('[data-component="navbar"]');
        if (!navbar) return;

        const pageKey = navbar.dataset.page || document.body.dataset.page || 'home';
        const pageConfig = VyE.config.navigation[pageKey] || VyE.config.navigation.home;

        buildNavbarContent(navbar, pageConfig);

        const brandTransition = qs('#brandTransition', navbar);
        const isHomepage = document.body.classList.contains('homepage');
        const navToggle = qs('#navToggle', navbar);
        const navMenu = qs('#navMenu', navbar);

        function updateBrandTransition() {
            if (!isHomepage || !brandTransition || global.innerWidth < 769) return;
            const progress = Math.min(global.scrollY / 280, 1);
            const remaining = 1 - progress;
            document.documentElement.style.setProperty('--brand-scroll-progress', progress.toFixed(3));
            document.documentElement.style.setProperty('--brand-offset-y', (remaining * 80).toFixed(1) + 'px');
            document.documentElement.style.setProperty('--brand-scale', (1 + remaining * 1.35).toFixed(3));
        }

        function handleScroll() {
            if (global.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateBrandTransition();
        }

        function closeMenu() {
            if (!navToggle || !navMenu) return;
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function () {
                const isOpen = navToggle.classList.toggle('active');
                navMenu.classList.toggle('active', isOpen);
                navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMenu();
                    navToggle.focus();
                }
            });
        }

        qsa('.navbar__link, .navbar__cta-btn', navbar).forEach(function (item) {
            item.addEventListener('click', function () {
                closeMenu();
                const modalId = item.dataset.openModal;
                if (modalId && typeof global.openM === 'function') {
                    global.openM(modalId);
                }
            });
        });

        // Smooth scroll para enlaces internos con ancla
        qsa('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const target = qs(targetId);
                if (!target) return;
                e.preventDefault();
                const navHeight = navbar.offsetHeight || 72;
                const targetPosition = target.getBoundingClientRect().top + global.pageYOffset - navHeight + 8;
                global.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            });
        });

        // Seguimiento de sección activa en homepage
        if (isHomepage && 'IntersectionObserver' in global) {
            const sections = qsa('section[id]');
            const navLinks = qsa('.navbar__link', navbar);
            const sectionObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(function (link) {
                            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                        });
                    });
                },
                { threshold: 0.3 }
            );
            sections.forEach(function (section) {
                sectionObserver.observe(section);
            });
        }

        global.addEventListener('scroll', handleScroll, { passive: true });
        global.addEventListener('resize', updateBrandTransition, { passive: true });
        handleScroll();
        initScrollProgress();
    }

    VyE.components = VyE.components || {};
    VyE.components.navbar = { init: init };
})(window);
