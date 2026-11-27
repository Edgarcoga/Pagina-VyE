/* ================================================================
   VyE INGENIERÍA — COMPONENTE FOOTER COMPARTIDO
   Incluye acceso directo a Política de Privacidad y Configuración de Cookies.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});
    const { createEl, createSvg, qs } = VyE.dom;

    const WHATSAPP_PATH =
        'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

    function init() {
        const footer = qs('#footer') || qs('[data-component="footer"]');
        if (!footer) return;

        const { brand, contact, footer: footerCfg } = VyE.config;
        footer.innerHTML = '';

        const brandBlock = createEl('div', { className: 'footer__brand' }, [
            createEl('img', {
                src: 'assets/Isotipo Vye.png',
                alt: 'VyE Isotipo',
                className: 'footer__logo-icon',
                width: 48,
                height: 48,
                loading: 'lazy'
            }),
            createEl('div', null, [
                createEl('div', { className: 'footer__brand-name', text: brand.name }),
                createEl('div', { className: 'footer__brand-tagline', text: brand.tagline })
            ])
        ]);

        const infoBlock = createEl('div', { className: 'footer__info' }, [
            createEl('p', { className: 'footer__desc', text: footerCfg.description }),
            createEl(
                'div',
                { className: 'footer__nav-links' },
                footerCfg.quickLinks.map(function (link) {
                    return createEl('a', {
                        href: link.href,
                        className: 'footer__nav-link',
                        text: link.label
                    });
                })
            )
        ]);

        const contactBlock = createEl('div', { className: 'footer__contact' }, [
            createEl('h4', { text: 'Contacto' }),
            createEl(
                'a',
                {
                    href: contact.whatsappUrl(),
                    className: 'footer__contact-item',
                    target: '_blank',
                    rel: 'noopener'
                },
                [
                    createSvg(18, 18, '0 0 24 24', [{ d: WHATSAPP_PATH }], { fill: 'currentColor' }),
                    contact.whatsappDisplay
                ]
            ),
            createEl(
                'a',
                {
                    href: 'mailto:' + contact.email,
                    className: 'footer__contact-item'
                },
                [
                    createSvg(
                        18,
                        18,
                        '0 0 24 24',
                        [
                            { tag: 'path', d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
                            { tag: 'polyline', points: '22,6 12,13 2,6' }
                        ],
                        { fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }
                    ),
                    contact.email
                ]
            ),
            createEl(
                'a',
                {
                    href: contact.website,
                    className: 'footer__contact-item',
                    target: '_blank',
                    rel: 'noopener'
                },
                [
                    createSvg(
                        18,
                        18,
                        '0 0 24 24',
                        [
                            { tag: 'circle', cx: '12', cy: '12', r: '10' },
                            { tag: 'line', x1: '2', y1: '12', x2: '22', y2: '12' },
                            { tag: 'path', d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' }
                        ],
                        { fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }
                    ),
                    contact.websiteDisplay
                ]
            )
        ]);

        const top = createEl('div', { className: 'footer__top' }, [brandBlock, infoBlock, contactBlock]);

        const legal = createEl('div', { className: 'footer__legal' }, [
            createEl('a', {
                href: 'privacidad.html',
                className: 'footer__legal-link',
                text: 'Privacidad y cookies'
            }),
            createEl('button', {
                type: 'button',
                className: 'footer__cookie-btn',
                text: 'Configurar cookies',
                dataset: { openCookieSettings: 'true' }
            })
        ]);

        const phrases = createEl(
            'div',
            { className: 'footer__phrases' },
            footerCfg.phrases.reduce(function (acc, phrase, idx) {
                if (idx > 0) acc.push(createEl('span', { text: '·' }));
                acc.push(createEl('span', { text: phrase }));
                return acc;
            }, [])
        );

        const bottom = createEl('div', { className: 'footer__bottom' }, [
            createEl('p', {
                text: '© ' + brand.year + ' ' + brand.name + '. Todos los derechos reservados.'
            }),
            legal,
            phrases
        ]);

        const container = createEl('div', { className: 'footer__container' }, [top, bottom]);
        footer.appendChild(container);
    }

    VyE.components = VyE.components || {};
    VyE.components.footer = { init: init };
})(window);
