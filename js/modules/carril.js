/* ================================================================
   VyE INGENIERÍA — MÓDULO CARRIL (NOSOTROS)
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        const carrilViewport = document.getElementById('nosotrosCarrilViewport');
        const carrilTrack = document.getElementById('nosotrosCarrilTrack');
        if (!carrilViewport || !carrilTrack) return;

        const slides = carrilTrack.querySelectorAll('.carril__slide');
        const tabs = document.querySelectorAll('.carril__tab');
        const dots = document.querySelectorAll('.carril__dot');
        const prevBtn = document.getElementById('carrilPrevBtn');
        const nextBtn = document.getElementById('carrilNextBtn');
        const currentNumEl = document.getElementById('carrilCurrentNum');
        const inlineBtns = document.querySelectorAll('[data-carril-goto]');

        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateCarril(index, persist) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;

            carrilTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

            tabs.forEach(function (tab, i) {
                const isActive = i === currentIndex;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });

            if (currentNumEl) {
                currentNumEl.textContent = '0' + (currentIndex + 1);
            }

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) {
                nextBtn.disabled = currentIndex === totalSlides - 1;
                nextBtn.classList.toggle('carril__arrow--forward-highlight', currentIndex < totalSlides - 1);
            }

            if (persist && VyE.cookies) {
                VyE.cookies.setPreference('vye_pref_carril', String(currentIndex), 30);
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                updateCarril(currentIndex - 1, true);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                updateCarril(currentIndex + 1, true);
            });
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const targetIdx = parseInt(tab.getAttribute('data-tab'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx, true);
            });
        });

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const targetIdx = parseInt(dot.getAttribute('data-dot'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx, true);
            });
        });

        inlineBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const targetIdx = parseInt(btn.getAttribute('data-carril-goto'), 10);
                if (!isNaN(targetIdx)) updateCarril(targetIdx, true);
            });
        });

        carrilViewport.setAttribute('tabindex', '0');
        carrilViewport.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                updateCarril(currentIndex - 1, true);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                updateCarril(currentIndex + 1, true);
            }
        });

        let isPointerDown = false;
        let startX = 0;
        let startY = 0;
        let isHorizontalSwipe = false;

        carrilViewport.addEventListener('pointerdown', function (e) {
            if (e.target.closest('button, a, svg')) return;
            isPointerDown = true;
            isHorizontalSwipe = false;
            startX = e.clientX;
            startY = e.clientY;
            carrilViewport.classList.add('is-dragging');
            carrilTrack.classList.add('is-dragging');
        });

        global.addEventListener('pointermove', function (e) {
            if (!isPointerDown) return;
            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;

            if (!isHorizontalSwipe) {
                if (Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
                    isHorizontalSwipe = true;
                } else if (Math.abs(diffY) > 8) {
                    isPointerDown = false;
                    carrilViewport.classList.remove('is-dragging');
                    carrilTrack.classList.remove('is-dragging');
                    return;
                }
            }

            if (isHorizontalSwipe) {
                const width = carrilViewport.offsetWidth || global.innerWidth;
                const percentShift = (diffX / width) * 100;
                let effectiveShift = percentShift;
                if ((currentIndex === 0 && diffX > 0) || (currentIndex === totalSlides - 1 && diffX < 0)) {
                    effectiveShift = percentShift * 0.35;
                }
                carrilTrack.style.transform = 'translateX(' + (-currentIndex * 100 + effectiveShift) + '%)';
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
                    updateCarril(currentIndex + 1, true);
                } else if (diffX > threshold && currentIndex > 0) {
                    updateCarril(currentIndex - 1, true);
                } else {
                    updateCarril(currentIndex, false);
                }
            }
        }

        global.addEventListener('pointerup', handlePointerUp);
        global.addEventListener('pointercancel', handlePointerUp);

        const savedIndex = VyE.cookies ? parseInt(VyE.cookies.getPreference('vye_pref_carril') || '', 10) : NaN;
        updateCarril(!isNaN(savedIndex) ? savedIndex : 0, false);
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.carril = { init: init };
})(window);
