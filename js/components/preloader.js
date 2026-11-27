/* ================================================================
   VyE INGENIERÍA — COMPONENTE PRELOADER
   Respeta cookie esencial vye_visited y prefers-reduced-motion para
   evitar demoras artificiales en navegación recurrente.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function finish(preloader) {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
        document.body.style.overflow = '';
        try {
            document.dispatchEvent(new CustomEvent('vye:preloader-done'));
        } catch (err) {
            // Ignorar si CustomEvent falla
        }
    }

    function init() {
        const preloader = document.getElementById('preloader');
        const reducedMotion =
            global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const alreadyVisited = VyE.cookies && VyE.cookies.get('vye_visited') === '1';

        if (!preloader || reducedMotion || alreadyVisited) {
            if (preloader) {
                preloader.style.transition = 'none';
                preloader.classList.add('hidden');
            }
            document.body.style.overflow = '';
            setTimeout(function () {
                finish(preloader);
            }, 40);
            return;
        }

        if (VyE.cookies) {
            VyE.cookies.set('vye_visited', '1', 1);
        }

        document.body.style.overflow = 'hidden';

        const hideTimer = setTimeout(function () {
            finish(preloader);
        }, 900);

        // Salvaguarda máxima por si algún recurso externo demora
        setTimeout(function () {
            clearTimeout(hideTimer);
            finish(preloader);
        }, 1600);
    }

    VyE.components = VyE.components || {};
    VyE.components.preloader = { init: init };
})(window);
