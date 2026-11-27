/* ================================================================
   VyE INGENIERÍA — MÓDULO HERO SHOWCASE INTERACTIVO
   Visor de 5 especialidades sincronizado con barra de pestañas y
   progreso lineal de 4.5s (pausa al hover; respeta reduced-motion).
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        const showcase = document.getElementById('heroShowcase');
        if (!showcase) return;

        const slides = showcase.querySelectorAll('.hero-showcase__slide');
        const tag = document.getElementById('heroShowcaseTag');
        const progressFill = document.getElementById('heroProgressFill');
        const tabsContainer = document.getElementById('capabilitiesTabs');
        const tabs = tabsContainer ? tabsContainer.querySelectorAll('.capabilities-tab') : [];

        if (!slides.length) return;

        const reducedMotion =
            global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let currentIndex = 0;
        const total = slides.length;
        const intervalDuration = 4500;
        let progressStart = null;
        let animFrame = null;
        let isPaused = false;
        let currentProgress = 0;

        function setSlide(index) {
            currentIndex = (index + total) % total;

            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === currentIndex);
            });

            tabs.forEach(function (tab, i) {
                const isActive = i === currentIndex;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            if (tag) {
                const activeSlide = slides[currentIndex];
                const label = activeSlide ? activeSlide.getAttribute('data-label') : '';
                if (label) tag.textContent = label;
            }

            resetProgress();
        }

        function stepProgress(timestamp) {
            if (!progressStart) progressStart = timestamp;

            if (!isPaused) {
                const elapsed = timestamp - progressStart;
                currentProgress = Math.min(elapsed / intervalDuration, 1);

                if (progressFill) {
                    progressFill.style.width = (currentProgress * 100).toFixed(2) + '%';
                }

                if (elapsed >= intervalDuration) {
                    setSlide(currentIndex + 1);
                    return;
                }
            } else {
                progressStart = timestamp - currentProgress * intervalDuration;
            }

            animFrame = requestAnimationFrame(stepProgress);
        }

        function resetProgress() {
            if (animFrame) cancelAnimationFrame(animFrame);
            currentProgress = 0;
            if (progressFill) progressFill.style.width = '0%';
            progressStart = null;
            if (!reducedMotion) {
                animFrame = requestAnimationFrame(stepProgress);
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const target = parseInt(tab.getAttribute('data-slide'), 10);
                if (!isNaN(target)) {
                    setSlide(target);
                }
            });
        });

        showcase.addEventListener('mouseenter', function () {
            isPaused = true;
        });

        showcase.addEventListener('mouseleave', function () {
            isPaused = false;
        });

        resetProgress();
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.heroShowcase = { init: init };
})(window);
