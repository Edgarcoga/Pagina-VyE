/* ================================================================
   VyE INGENIERÍA — CONFIGURACIÓN CENTRALIZADA
   Fuente única de verdad para marca, contacto, navegación y cookies.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    const WHATSAPP_NUMBER = '527718429946';

    VyE.config = {
        version: '2.0.0',
        brand: {
            name: 'VyE Ingeniería',
            shortName: 'VYE',
            sub: 'INGENIERÍA',
            tagline: 'Diseñamos eficiencia',
            year: 2026
        },
        contact: {
            whatsappNumber: WHATSAPP_NUMBER,
            whatsappDisplay: '771 842 9946',
            email: 'contacto@vyeingenieria.com',
            website: 'https://www.vyeingenieria.com',
            websiteDisplay: 'www.vyeingenieria.com',
            whatsappUrl: function (message) {
                const base = 'https://wa.me/' + WHATSAPP_NUMBER;
                return message ? base + '?text=' + encodeURIComponent(message) : base;
            }
        },
        navigation: {
            home: {
                logoHref: '#hero',
                isBrandAnimated: true,
                links: [
                    { label: 'El Reto', href: '#reto' },
                    { label: 'Servicios', href: '#servicios' },
                    { label: 'Portafolio', href: '#portafolio' },
                    { label: 'Proceso', href: '#proceso' },
                    { label: 'Nosotros', href: '#nosotros' }
                ],
                cta: { label: 'Diagnóstico Gratis', href: '#contacto', type: 'link' }
            },
            nosotros: {
                logoHref: 'index.html#hero',
                isBrandAnimated: false,
                links: [
                    { label: 'Inicio', href: 'index.html#hero' },
                    { label: 'El Reto', href: 'index.html#reto' },
                    { label: 'Servicios', href: 'index.html#servicios' },
                    { label: 'Portafolio', href: 'index.html#portafolio' },
                    { label: 'Proceso', href: 'index.html#proceso' },
                    { label: 'Nosotros', href: 'nosotros.html', active: true }
                ],
                cta: { label: 'Diagnóstico Gratis', href: 'index.html#contacto', type: 'link' }
            },
            educore: {
                logoHref: 'index.html#hero',
                isBrandAnimated: false,
                links: [
                    { label: 'Inicio VyE', href: 'index.html#hero' },
                    { label: 'Servicios', href: 'index.html#servicios' },
                    { label: 'EduCore', href: '#hero', active: true },
                    { label: 'Nosotros', href: 'nosotros.html' }
                ],
                cta: { label: 'Solicitar Demo', openModal: 'mDemo', type: 'button' }
            },
            legal: {
                logoHref: 'index.html#hero',
                isBrandAnimated: false,
                links: [
                    { label: 'Inicio', href: 'index.html#hero' },
                    { label: 'Servicios', href: 'index.html#servicios' },
                    { label: 'Portafolio', href: 'index.html#portafolio' },
                    { label: 'Nosotros', href: 'nosotros.html' }
                ],
                cta: { label: 'Diagnóstico Gratis', href: 'index.html#contacto', type: 'link' }
            }
        },
        footer: {
            description: 'Software y automatización para empresas. Soluciones a medida con impacto operativo real.',
            quickLinks: [
                { label: 'Inicio', href: 'index.html#hero' },
                { label: 'Nosotros', href: 'nosotros.html' },
                { label: 'EduCore (SGE)', href: 'indexSGE.html' },
                { label: 'Privacidad y Cookies', href: 'privacidad.html' }
            ],
            phrases: ['Soluciones a medida', 'Resultados reales', 'Soporte continuo']
        },
        cookies: {
            consentCookieName: 'vye_cookie_consent',
            consentVersion: 1,
            expireDays: 180,
            categories: [
                {
                    id: 'necessary',
                    name: 'Esenciales',
                    required: true,
                    description: 'Necesarias para el funcionamiento básico del sitio, navegación fluida entre páginas y el guardado de tu elección sobre cookies.',
                    cookies: ['vye_cookie_consent', 'vye_visited']
                },
                {
                    id: 'preferences',
                    name: 'Preferencias',
                    required: false,
                    description: 'Permiten recordar selecciones de interfaz, como la pestaña activa en la sección Nosotros o la pantalla seleccionada en el visor del portafolio.',
                    cookies: ['vye_pref_carril', 'vye_pref_feat_shot']
                },
                {
                    id: 'analytics',
                    name: 'Analítica',
                    required: false,
                    description: 'Nos ayudan a medir de forma agregada qué secciones resultan más útiles para mejorar la claridad técnica del sitio.',
                    cookies: ['vye_analytics_sid', 'vye_pageview_count']
                },
                {
                    id: 'marketing',
                    name: 'Campaña y atribución',
                    required: false,
                    description: 'Registran parámetros de origen (UTM o referencia) cuando llegas desde una campaña para entender qué canal te trajo aquí.',
                    cookies: ['vye_attribution']
                }
            ]
        }
    };
})(window);
