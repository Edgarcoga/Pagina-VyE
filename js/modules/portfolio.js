/* ================================================================
   VyE INGENIERÍA — MÓDULO PORTAFOLIO & LIGHTBOX
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        const thumbsBox = document.getElementById('featThumbs');
        const lb = document.getElementById('lb');
        if (!thumbsBox && !lb) return;

        let projects = VyE.data.PORTFOLIO_FALLBACK;
        let lbProj = null;
        let lbIdx = 0;
        let lastFocus = null;
        let featCur = 1;

        const featImg = document.getElementById('featImg');
        const featTitle = document.getElementById('featTitle');
        const featDesc = document.getElementById('featDesc');
        const btnFeatViewAll = document.getElementById('btnFeatViewAll');

        const lbImg = document.getElementById('lbImg');
        const lbTitle = document.getElementById('lbTitle');
        const lbCat = document.getElementById('lbCat');
        const lbCapT = document.getElementById('lbCapT');
        const lbCapD = document.getElementById('lbCapD');
        const lbCount = document.getElementById('lbCount');
        const lbClose = document.getElementById('lbClose');
        const lbPrev = document.getElementById('lbPrev');
        const lbNext = document.getElementById('lbNext');

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

        function openLb(key, idx) {
            if (!projects[key]) return;
            lbProj = projects[key];
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
        }

        function closeLb() {
            if (lb) {
                lb.classList.remove('open');
                document.body.style.overflow = '';
            }
            if (lastFocus && typeof lastFocus.focus === 'function') {
                lastFocus.focus();
            }
        }

        function step(direction) {
            if (!lbProj || !lbProj.shots.length) return;
            lbIdx = (lbIdx + direction + lbProj.shots.length) % lbProj.shots.length;
            renderLb();
        }

        global.openLb = openLb;
        global.closeLb = closeLb;

        function setupFeatured(data) {
            projects = data;
            if (!thumbsBox || !projects.nissan || !projects.nissan.shots) return;

            const nissanShots = projects.nissan.shots;
            const savedShot = VyE.cookies ? parseInt(VyE.cookies.getPreference('vye_pref_feat_shot') || '', 10) : NaN;
            if (!isNaN(savedShot) && savedShot >= 0 && savedShot < nissanShots.length) {
                featCur = savedShot;
            }

            function setFeat(i) {
                featCur = i;
                const s = nissanShots[i];
                if (featImg) {
                    featImg.src = s.src;
                    featImg.alt = s.t + ' — ERP Nissan Universidad';
                }
                if (featTitle) featTitle.textContent = s.t;
                if (featDesc) featDesc.textContent = s.d;

                Array.prototype.slice.call(thumbsBox.children).forEach(function (b, j) {
                    b.classList.toggle('on', j === i);
                });

                if (VyE.cookies) {
                    VyE.cookies.setPreference('vye_pref_feat_shot', String(i), 90);
                }
            }

            thumbsBox.innerHTML = '';
            nissanShots.forEach(function (s, i) {
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
                btn.addEventListener('click', function () {
                    setFeat(i);
                });
                thumbsBox.appendChild(btn);
            });

            setFeat(featCur);
        }

        if (featImg) {
            featImg.addEventListener('click', function () {
                openLb('nissan', featCur);
            });
        }

        if (btnFeatViewAll) {
            btnFeatViewAll.addEventListener('click', function () {
                openLb('nissan', featCur);
            });
        }

        document.querySelectorAll('[data-proj]').forEach(function (card) {
            card.addEventListener('click', function () {
                openLb(card.getAttribute('data-proj'), 0);
            });
        });

        if (lbClose) lbClose.addEventListener('click', closeLb);
        if (lbPrev) lbPrev.addEventListener('click', function () { step(-1); });
        if (lbNext) lbNext.addEventListener('click', function () { step(1); });

        if (lb) {
            lb.addEventListener('click', function (e) {
                if (e.target === lb) closeLb();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (!lb || !lb.classList.contains('open')) return;
            if (e.key === 'Escape') closeLb();
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
        });

        let touchStartX = null;
        if (lb) {
            lb.addEventListener(
                'touchstart',
                function (e) {
                    touchStartX = e.touches[0].clientX;
                },
                { passive: true }
            );

            lb.addEventListener(
                'touchend',
                function (e) {
                    if (touchStartX === null) return;
                    const dx = e.changedTouches[0].clientX - touchStartX;
                    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
                    touchStartX = null;
                },
                { passive: true }
            );
        }

        setupFeatured(projects);
        VyE.data.loadPortfolioData().then(setupFeatured);
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.portfolio = { init: init };
})(window);
