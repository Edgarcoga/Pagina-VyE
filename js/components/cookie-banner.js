/* ================================================================
   VyE INGENIERÍA — UI DE CONSENTIMIENTO DE COOKIES
   Banner discreto, modal de preferencias granulares y sincronización
   con la página de Política de Privacidad y Cookies.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});
    const { createEl, qsa } = VyE.dom;

    let bannerEl = null;
    let modalEl = null;
    let lastTrigger = null;
    const categoryInputs = {};

    function updateStatusDisplays() {
        const consent = VyE.cookies.getConsent();
        const nodes = qsa('[data-cookie-status]');
        if (!nodes.length) return;

        const activeNames = [];
        if (consent.categories.necessary) activeNames.push('Esenciales');
        if (consent.categories.preferences) activeNames.push('Preferencias');
        if (consent.categories.analytics) activeNames.push('Analítica');
        if (consent.categories.marketing) activeNames.push('Campaña');

        nodes.forEach(function (node) {
            node.innerHTML = '';
            if (!consent.decided) {
                node.appendChild(
                    createEl('span', null, [
                        createEl('strong', { text: 'Pendiente de elección: ' }),
                        'Solo están activas las cookies esenciales.'
                    ])
                );
                return;
            }
            const dateStr = consent.updatedAt
                ? new Date(consent.updatedAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                  })
                : '';
            node.appendChild(
                createEl('span', null, [
                    createEl('strong', { text: 'Activas: ' }),
                    activeNames.join(', ') + (dateStr ? ' (' + dateStr + ')' : '')
                ])
            );
        });
    }

    function syncModalInputs() {
        const consent = VyE.cookies.getConsent();
        Object.keys(categoryInputs).forEach(function (catId) {
            categoryInputs[catId].checked = Boolean(consent.categories[catId]);
        });
    }

    function showBanner() {
        if (bannerEl) bannerEl.hidden = false;
    }

    function hideBanner() {
        if (bannerEl) bannerEl.hidden = true;
    }

    function openModal(trigger) {
        if (!modalEl) return;
        lastTrigger = trigger || document.activeElement;
        syncModalInputs();
        modalEl.hidden = false;
        const closeBtn = modalEl.querySelector('.cookie-modal__close');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (!modalEl) return;
        modalEl.hidden = true;
        if (lastTrigger && typeof lastTrigger.focus === 'function') {
            lastTrigger.focus();
        }
    }

    function buildBanner() {
        const banner = createEl('aside', {
            className: 'cookie-banner',
            id: 'cookieBanner',
            hidden: true,
            attrs: {
                role: 'region',
                'aria-label': 'Aviso y configuración de cookies'
            }
        });

        const head = createEl('div', { className: 'cookie-banner__head' }, [
            createEl('h2', { className: 'cookie-banner__title', text: 'Uso de cookies' }),
            createEl('span', { className: 'cookie-banner__tag', text: 'Privacidad' })
        ]);

        const text = createEl('p', { className: 'cookie-banner__text' }, [
            'Usamos cookies esenciales para que el sitio funcione correctamente y, si lo autorizas, cookies de preferencias, analítica y campaña. Consulta los detalles en nuestra ',
            createEl('a', { href: 'privacidad.html', text: 'Política de privacidad y cookies' }),
            '.'
        ]);

        const acceptBtn = createEl('button', {
            type: 'button',
            className: 'btn btn--primary btn--sm',
            text: 'Aceptar todas',
            events: {
                click: function () {
                    VyE.cookies.acceptAll();
                    hideBanner();
                }
            }
        });

        const rejectBtn = createEl('button', {
            type: 'button',
            className: 'btn btn--outline btn--sm',
            text: 'Solo esenciales',
            events: {
                click: function () {
                    VyE.cookies.rejectOptional();
                    hideBanner();
                }
            }
        });

        const configBtn = createEl('button', {
            type: 'button',
            className: 'cookie-banner__config',
            text: 'Configurar',
            events: {
                click: function () {
                    openModal(configBtn);
                }
            }
        });

        const actions = createEl('div', { className: 'cookie-banner__actions' }, [
            acceptBtn,
            rejectBtn,
            configBtn
        ]);

        banner.appendChild(head);
        banner.appendChild(text);
        banner.appendChild(actions);
        return banner;
    }

    function buildModal() {
        const modal = createEl('div', {
            className: 'cookie-modal',
            id: 'cookieModal',
            hidden: true,
            attrs: {
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': 'cookieModalTitle'
            }
        });

        const closeBtn = createEl('button', {
            type: 'button',
            className: 'cookie-modal__close',
            text: '✕',
            attrs: { 'aria-label': 'Cerrar configuración de cookies' },
            events: { click: closeModal }
        });

        const header = createEl('div', { className: 'cookie-modal__header' }, [
            createEl('div', null, [
                createEl('h2', {
                    className: 'cookie-modal__title',
                    id: 'cookieModalTitle',
                    text: 'Preferencias de cookies'
                }),
                createEl('p', {
                    className: 'cookie-modal__sub',
                    text: 'Elige qué categorías deseas habilitar. Puedes cambiar o revocar tu consentimiento cuando quieras desde el pie de página.'
                })
            ]),
            closeBtn
        ]);

        const body = createEl('div', { className: 'cookie-modal__body' });
        VyE.config.cookies.categories.forEach(function (cat) {
            let control;
            if (cat.required) {
                control = createEl('span', { className: 'cookie-category__badge', text: 'Siempre activas' });
            } else {
                const input = createEl('input', {
                    type: 'checkbox',
                    id: 'cookie-cat-' + cat.id,
                    attrs: { 'aria-label': 'Activar cookies de ' + cat.name }
                });
                categoryInputs[cat.id] = input;
                control = createEl('label', { className: 'cookie-switch', attrs: { for: 'cookie-cat-' + cat.id } }, [
                    input,
                    createEl('span', { className: 'cookie-switch__track' })
                ]);
            }

            const card = createEl('div', { className: 'cookie-category' }, [
                createEl('div', { className: 'cookie-category__row' }, [
                    createEl('h3', { className: 'cookie-category__name', text: cat.name }),
                    control
                ]),
                createEl('p', { className: 'cookie-category__desc', text: cat.description }),
                createEl('div', {
                    className: 'cookie-category__names',
                    text: 'Cookies: ' + cat.cookies.join(', ')
                })
            ]);
            body.appendChild(card);
        });

        const footer = createEl('div', { className: 'cookie-modal__footer' }, [
            createEl('a', {
                href: 'privacidad.html',
                className: 'cookie-modal__policy-link',
                text: 'Ver política completa'
            }),
            createEl('div', { className: 'cookie-modal__btns' }, [
                createEl('button', {
                    type: 'button',
                    className: 'btn btn--outline btn--sm',
                    text: 'Solo esenciales',
                    events: {
                        click: function () {
                            VyE.cookies.rejectOptional();
                            hideBanner();
                            closeModal();
                        }
                    }
                }),
                createEl('button', {
                    type: 'button',
                    className: 'btn btn--primary btn--sm',
                    text: 'Guardar preferencias',
                    events: {
                        click: function () {
                            VyE.cookies.saveConsent({
                                preferences: categoryInputs.preferences ? categoryInputs.preferences.checked : false,
                                analytics: categoryInputs.analytics ? categoryInputs.analytics.checked : false,
                                marketing: categoryInputs.marketing ? categoryInputs.marketing.checked : false
                            });
                            hideBanner();
                            closeModal();
                        }
                    }
                })
            ])
        ]);

        const dialog = createEl('div', { className: 'cookie-modal__dialog' }, [header, body, footer]);
        modal.appendChild(dialog);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hidden) {
                closeModal();
            }
        });

        return modal;
    }

    function init() {
        bannerEl = buildBanner();
        modalEl = buildModal();
        document.body.appendChild(bannerEl);
        document.body.appendChild(modalEl);

        if (!VyE.cookies.hasDecided()) {
            showBanner();
        }

        document.addEventListener('click', function (e) {
            const trigger = e.target.closest('[data-open-cookie-settings]');
            if (trigger) {
                e.preventDefault();
                openModal(trigger);
            }
        });

        VyE.cookies.onChange(updateStatusDisplays);
        updateStatusDisplays();
    }

    VyE.components = VyE.components || {};
    VyE.components.cookieBanner = {
        init: init,
        openSettings: openModal,
        showBanner: showBanner
    };
})(window);
