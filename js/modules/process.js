/* ================================================================
   VyE INGENIERÍA — MÓDULO PROCESO (3 PASOS MINIMAL CON HOVER)
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        const dynamicWord = document.getElementById('processDynamicWord');
        const cardsGrid = document.getElementById('processCardsGrid');
        if (!dynamicWord || !cardsGrid) return;

        const cards = cardsGrid.querySelectorAll('.process-minimal-card');
        const defaultText = 'Sin sorpresas.';
        const reducedMotion =
            global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let fadeTimeout = null;

        function setPhrase(newText) {
            clearTimeout(fadeTimeout);
            if (dynamicWord.textContent.trim() === newText.trim()) return;

            if (reducedMotion) {
                dynamicWord.textContent = newText;
                dynamicWord.classList.remove('is-fading');
                return;
            }

            dynamicWord.classList.add('is-fading');
            fadeTimeout = setTimeout(function () {
                dynamicWord.textContent = newText;
                dynamicWord.classList.remove('is-fading');
            }, 100);
        }

        cards.forEach(function (card) {
            const phrase = card.getAttribute('data-phrase');
            if (!phrase) return;

            card.addEventListener('mouseenter', function () {
                setPhrase(phrase);
            });
            card.addEventListener('focusin', function () {
                setPhrase(phrase);
            });
        });

        cardsGrid.addEventListener('mouseleave', function () {
            setPhrase(defaultText);
        });
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.process = { init: init };
})(window);
