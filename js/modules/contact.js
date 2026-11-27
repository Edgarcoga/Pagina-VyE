/* ================================================================
   VyE INGENIERÍA — MÓDULO FORMULARIO DE CONTACTO -> WHATSAPP
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = (document.getElementById('c-nombre')?.value || '').trim();
            const empresa = (document.getElementById('c-empresa')?.value || '').trim();
            const mensaje = (document.getElementById('c-mensaje')?.value || '').trim();

            const lines = ['Hola VyE, me gustaría solicitar un diagnóstico de eficiencia.'];
            if (nombre) {
                lines.push('Soy ' + nombre + (empresa ? ' (' + empresa + ')' : '') + '.');
            } else if (empresa) {
                lines.push('Contacto / Negocio: ' + empresa + '.');
            }
            if (mensaje) {
                lines.push('Situación a resolver: ' + mensaje);
            }

            const url = VyE.config.contact.whatsappUrl(lines.join('\n'));
            global.open(url, '_blank', 'noopener');
        });
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.contact = { init: init };
})(window);
