/* ================================================================
   VyE INGENIERÍA — UTILIDADES DOM SEGURAS
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function createEl(tag, attrs, children) {
        const node = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (key) {
                const val = attrs[key];
                if (val === null || val === undefined || val === false) return;
                if (key === 'className') {
                    node.className = val;
                } else if (key === 'text') {
                    node.textContent = val;
                } else if (key === 'dataset' && typeof val === 'object') {
                    Object.keys(val).forEach(function (dKey) {
                        node.dataset[dKey] = val[dKey];
                    });
                } else if (key === 'attrs' && typeof val === 'object') {
                    Object.keys(val).forEach(function (aKey) {
                        node.setAttribute(aKey, val[aKey]);
                    });
                } else if (key === 'events' && typeof val === 'object') {
                    Object.keys(val).forEach(function (evName) {
                        node.addEventListener(evName, val[evName]);
                    });
                } else {
                    node.setAttribute(key, val === true ? '' : String(val));
                }
            });
        }
        if (children !== undefined && children !== null) {
            const list = Array.isArray(children) ? children : [children];
            list.forEach(function (child) {
                if (child === null || child === undefined || child === false) return;
                if (typeof child === 'string' || typeof child === 'number') {
                    node.appendChild(document.createTextNode(String(child)));
                } else if (child && typeof child.nodeType === 'number') {
                    node.appendChild(child);
                }
            });
        }
        return node;
    }

    function createSvg(width, height, viewBox, paths, extraAttrs) {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('width', String(width));
        svg.setAttribute('height', String(height));
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('aria-hidden', 'true');
        if (extraAttrs) {
            Object.keys(extraAttrs).forEach(function (k) {
                svg.setAttribute(k, extraAttrs[k]);
            });
        }
        paths.forEach(function (spec) {
            const el = document.createElementNS(ns, spec.tag || 'path');
            Object.keys(spec).forEach(function (k) {
                if (k !== 'tag') el.setAttribute(k, spec[k]);
            });
            svg.appendChild(el);
        });
        return svg;
    }

    VyE.dom = {
        qs: qs,
        qsa: qsa,
        createEl: createEl,
        createSvg: createSvg
    };
})(window);
