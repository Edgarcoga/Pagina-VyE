/* ================================================================
   VyE INGENIERÍA — MÓDULO EDUCORE (indexSGE.html)
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function init() {
        if (!document.body.classList.contains('educore-page')) return;

        function openM(id) {
            const modal = document.getElementById(id);
            if (!modal) return;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeM(id) {
            const modal = document.getElementById(id);
            if (!modal) return;
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        function toggleFaq(btn) {
            const item = btn && btn.parentElement;
            if (!item) return;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(function (el) {
                el.classList.remove('active');
            });
            if (!isActive) item.classList.add('active');
        }

        function handleDemoSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const nombre = (document.getElementById('demo-name')?.value || '').trim();
            const institucion = (document.getElementById('demo-institution')?.value || '').trim();
            const plan = (document.getElementById('demo-plan')?.value || '').trim();
            const correo = (document.getElementById('demo-email')?.value || '').trim();
            const telefono = (document.getElementById('demo-phone')?.value || '').trim();

            const msgLines = [
                'Hola VyE, solicito una demostración de EduCore.',
                nombre ? 'Nombre: ' + nombre : '',
                institucion ? 'Institución: ' + institucion : '',
                plan ? 'Paquete de interés: ' + plan : '',
                correo ? 'Correo: ' + correo : '',
                telefono ? 'Teléfono: ' + telefono : ''
            ].filter(Boolean);

            const waUrl = VyE.config.contact.whatsappUrl(msgLines.join('\n'));
            let feedback = document.getElementById('demoFeedback');
            if (!feedback) {
                feedback = VyE.dom.createEl('div', { id: 'demoFeedback', className: 'demo-feedback' });
                form.parentElement.appendChild(feedback);
            }

            feedback.innerHTML = '';
            feedback.hidden = false;
            feedback.appendChild(
                VyE.dom.createEl('p', {
                    text:
                        'Solicitud registrada para ' +
                        (institucion || 'tu institución') +
                        '. Puedes agilizar la agenda abriendo este resumen directo por WhatsApp:'
                })
            );
            feedback.appendChild(
                VyE.dom.createEl('a', {
                    href: waUrl,
                    target: '_blank',
                    rel: 'noopener',
                    className: 'btn btn--whatsapp btn--sm',
                    text: 'Continuar por WhatsApp →'
                })
            );

            form.reset();
        }

        global.openM = openM;
        global.closeM = closeM;
        global.toggleFaq = toggleFaq;
        global.handleDemoSubmit = handleDemoSubmit;

        document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    overlay.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
                    m.classList.remove('open');
                });
                document.body.style.overflow = '';
            }
        });

        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        function closeSidebar() {
            hamburgerBtn?.classList.remove('active');
            sidebar?.classList.remove('open');
            sidebarOverlay?.classList.remove('open');
        }

        hamburgerBtn?.addEventListener('click', function () {
            hamburgerBtn.classList.toggle('active');
            sidebar?.classList.toggle('open');
            sidebarOverlay?.classList.toggle('open');
        });
        sidebarOverlay?.addEventListener('click', closeSidebar);

        document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
            link.addEventListener('click', closeSidebar);
        });

        const floatingCta = document.getElementById('floatingCta');
        const heroSection = document.getElementById('hero');
        if (floatingCta && heroSection && 'IntersectionObserver' in global) {
            const observer = new IntersectionObserver(
                function (entries) {
                    const entry = entries[0];
                    floatingCta.style.opacity = entry.isIntersecting ? '0' : '1';
                    floatingCta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
                },
                { threshold: 0.35 }
            );
            observer.observe(heroSection);
        }
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.educore = { init: init };
})(window);
