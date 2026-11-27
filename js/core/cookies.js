/* ================================================================
   VyE INGENIERÍA — GESTOR DE COOKIES Y CONSENTIMIENTO
   Lectura/escritura real vía document.cookie (con fallback seguro si
   el navegador bloquea cookies en protocolo file://) y hooks por categoría.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});
    const cfg = VyE.config.cookies;
    const STORAGE_FALLBACK_KEY = 'vye_cookie_fallback_store';
    const listeners = [];

    const CATEGORY_COOKIES = {
        necessary: ['vye_cookie_consent', 'vye_visited'],
        preferences: ['vye_pref_carril', 'vye_pref_feat_shot'],
        analytics: ['vye_analytics_sid', 'vye_pageview_count'],
        marketing: ['vye_attribution']
    };

    function isHttps() {
        return global.location && global.location.protocol === 'https:';
    }

    function readFallbackStore() {
        try {
            const raw = global.localStorage ? global.localStorage.getItem(STORAGE_FALLBACK_KEY) : null;
            return raw ? JSON.parse(raw) : {};
        } catch (err) {
            return {};
        }
    }

    function writeFallbackStore(store) {
        try {
            if (global.localStorage) {
                global.localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(store));
            }
        } catch (err) {
            // Ignorar si almacenamiento local no está disponible
        }
    }

    function getCookie(name) {
        const encodedName = encodeURIComponent(name) + '=';
        const parts = (document.cookie || '').split('; ');
        for (let i = 0; i < parts.length; i += 1) {
            if (parts[i].indexOf(encodedName) === 0) {
                try {
                    return decodeURIComponent(parts[i].slice(encodedName.length));
                } catch (err) {
                    return parts[i].slice(encodedName.length);
                }
            }
        }
        // Fallback solo cuando document.cookie no persiste (p. ej. file:// en Chromium)
        if (global.location && global.location.protocol === 'file:') {
            const store = readFallbackStore();
            const entry = store[name];
            if (entry && (!entry.expiresAt || entry.expiresAt > Date.now())) {
                return entry.value;
            }
        }
        return null;
    }

    function setCookie(name, value, days, options) {
        const opts = options || {};
        const maxAgeSeconds = typeof days === 'number' ? Math.round(days * 86400) : null;
        let cookieStr = encodeURIComponent(name) + '=' + encodeURIComponent(String(value));
        cookieStr += '; path=' + (opts.path || '/');
        cookieStr += '; SameSite=' + (opts.sameSite || 'Lax');
        if (maxAgeSeconds !== null) {
            const expDate = new Date(Date.now() + maxAgeSeconds * 1000);
            cookieStr += '; expires=' + expDate.toUTCString();
            cookieStr += '; max-age=' + maxAgeSeconds;
        }
        if (isHttps() || opts.secure) {
            cookieStr += '; Secure';
        }
        document.cookie = cookieStr;

        if (global.location && global.location.protocol === 'file:') {
            const store = readFallbackStore();
            store[name] = {
                value: String(value),
                expiresAt: maxAgeSeconds !== null ? Date.now() + maxAgeSeconds * 1000 : null
            };
            writeFallbackStore(store);
        }
    }

    function deleteCookie(name) {
        document.cookie =
            encodeURIComponent(name) +
            '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';
        if (global.location && global.location.protocol === 'file:') {
            const store = readFallbackStore();
            if (Object.prototype.hasOwnProperty.call(store, name)) {
                delete store[name];
                writeFallbackStore(store);
            }
        }
    }

    function defaultConsent() {
        return {
            version: cfg.consentVersion,
            decided: false,
            updatedAt: null,
            categories: {
                necessary: true,
                preferences: false,
                analytics: false,
                marketing: false
            }
        };
    }

    function getConsent() {
        const raw = getCookie(cfg.consentCookieName);
        if (!raw) return defaultConsent();
        try {
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || parsed.version !== cfg.consentVersion) {
                return defaultConsent();
            }
            const cats = parsed.categories || {};
            return {
                version: cfg.consentVersion,
                decided: Boolean(parsed.decided),
                updatedAt: parsed.updatedAt || null,
                categories: {
                    necessary: true,
                    preferences: Boolean(cats.preferences),
                    analytics: Boolean(cats.analytics),
                    marketing: Boolean(cats.marketing)
                }
            };
        } catch (err) {
            return defaultConsent();
        }
    }

    function hasDecided() {
        return getConsent().decided;
    }

    function hasConsent(category) {
        if (category === 'necessary') return true;
        const consent = getConsent();
        return Boolean(consent.decided && consent.categories[category]);
    }

    function cleanupDisabledCategories(categories) {
        ['preferences', 'analytics', 'marketing'].forEach(function (cat) {
            if (!categories[cat]) {
                (CATEGORY_COOKIES[cat] || []).forEach(deleteCookie);
            }
        });
    }

    function applyEnabledEffects(consent) {
        if (consent.categories.analytics) {
            let sid = getCookie('vye_analytics_sid');
            if (!sid) {
                sid = 'vye_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
                setCookie('vye_analytics_sid', sid, 30);
            }
            const currentViews = parseInt(getCookie('vye_pageview_count') || '0', 10) || 0;
            setCookie('vye_pageview_count', String(currentViews + 1), 30);
        }

        if (consent.categories.marketing && global.location && global.location.search) {
            const params = new URLSearchParams(global.location.search);
            const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'ref'];
            const found = {};
            let hasAny = false;
            trackedKeys.forEach(function (key) {
                const v = params.get(key);
                if (v) {
                    found[key] = v.slice(0, 80);
                    hasAny = true;
                }
            });
            if (hasAny) {
                setCookie('vye_attribution', JSON.stringify(found), 30);
            }
        }
    }

    function notifyListeners(consent) {
        listeners.forEach(function (fn) {
            try {
                fn(consent);
            } catch (err) {
                // Evitar que un suscriptor rompa la cadena
            }
        });
        try {
            document.dispatchEvent(new CustomEvent('vye:consent-updated', { detail: consent }));
        } catch (err) {
            // Fallback sin CustomEvent
        }
    }

    function saveConsent(partialCategories) {
        const categories = {
            necessary: true,
            preferences: Boolean(partialCategories && partialCategories.preferences),
            analytics: Boolean(partialCategories && partialCategories.analytics),
            marketing: Boolean(partialCategories && partialCategories.marketing)
        };

        const payload = {
            version: cfg.consentVersion,
            decided: true,
            updatedAt: new Date().toISOString(),
            categories: categories
        };

        setCookie(cfg.consentCookieName, JSON.stringify(payload), cfg.expireDays);
        cleanupDisabledCategories(categories);
        applyEnabledEffects(payload);
        notifyListeners(payload);
        return payload;
    }

    function acceptAll() {
        return saveConsent({ preferences: true, analytics: true, marketing: true });
    }

    function rejectOptional() {
        return saveConsent({ preferences: false, analytics: false, marketing: false });
    }

    function resetConsent() {
        deleteCookie(cfg.consentCookieName);
        cleanupDisabledCategories({ preferences: false, analytics: false, marketing: false });
        const fresh = defaultConsent();
        notifyListeners(fresh);
        return fresh;
    }

    function setPreference(name, value, days) {
        if (!hasConsent('preferences')) return false;
        setCookie(name, value, typeof days === 'number' ? days : 90);
        return true;
    }

    function getPreference(name) {
        if (!hasConsent('preferences')) return null;
        return getCookie(name);
    }

    function onChange(fn) {
        if (typeof fn === 'function') listeners.push(fn);
    }

    function init() {
        const current = getConsent();
        if (current.decided) {
            cleanupDisabledCategories(current.categories);
            applyEnabledEffects(current);
        }
    }

    VyE.cookies = {
        get: getCookie,
        set: setCookie,
        remove: deleteCookie,
        getConsent: getConsent,
        hasDecided: hasDecided,
        hasConsent: hasConsent,
        saveConsent: saveConsent,
        acceptAll: acceptAll,
        rejectOptional: rejectOptional,
        resetConsent: resetConsent,
        setPreference: setPreference,
        getPreference: getPreference,
        onChange: onChange,
        init: init
    };
})(window);
