/* ================================================================
   VyE INGENIERÍA — MÓDULO REVEAL ON SCROLL
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});
    const { qsa } = VyE.dom;

    function init() {
        const elements = qsa('[data-reveal]');
        if (!elements.length) return;

        const reducedMotion =
            global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion || !('IntersectionObserver' in global)) {
            elements.forEach(function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    const siblings = entry.target.parentElement
                        ? Array.prototype.slice.call(entry.target.parentElement.children)
                        : [];
                    const idx = siblings
                        .filter(function (c) {
                            return c.hasAttribute('data-reveal');
                        })
                        .indexOf(entry.target);

                    setTimeout(function () {
                        entry.target.classList.add('revealed');
                    }, Math.max(0, idx) * 70);

                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.reveal = { init: init };
})(window);
