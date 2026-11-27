/* ================================================================
   VyE INGENIERÍA — BOOTSTRAPPER PRINCIPAL
   Inicializa núcleo, componentes compartidos y módulos por página.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function bootstrap() {
        if (VyE.cookies) VyE.cookies.init();

        if (VyE.components) {
            if (VyE.components.preloader) VyE.components.preloader.init();
            if (VyE.components.navbar) VyE.components.navbar.init();
            if (VyE.components.footer) VyE.components.footer.init();
            if (VyE.components.whatsapp) VyE.components.whatsapp.init();
            if (VyE.components.cookieBanner) VyE.components.cookieBanner.init();
        }

        if (VyE.modules) {
            if (VyE.modules.reveal) VyE.modules.reveal.init();
            if (VyE.modules.heroInk) VyE.modules.heroInk.init();
            if (VyE.modules.heroShowcase) VyE.modules.heroShowcase.init();
            if (VyE.modules.portfolio) VyE.modules.portfolio.init();
            if (VyE.modules.process) VyE.modules.process.init();
            if (VyE.modules.carril) VyE.modules.carril.init();
            if (VyE.modules.contact) VyE.modules.contact.init();
            if (VyE.modules.educore) VyE.modules.educore.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})(window);
