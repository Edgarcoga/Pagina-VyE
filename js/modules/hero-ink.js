/* ================================================================
   VyE INGENIERÍA — MÓDULO HERO INK & MARCADOR
   Trazo progresivo del plumón dorado sobre el titular principal.
   Respeta prefers-reduced-motion y el ciclo del preloader.
   ================================================================ */
(function (global) {
    'use strict';

    const VyE = (global.VyE = global.VyE || {});

    function drawHeroMarker(hero, immediate) {
        const title = hero ? hero.querySelector('.hero__title-line--accent') : null;
        if (!title) return;

        const existing = title.querySelector('.hero__marker-canvas');
        if (existing) existing.remove();

        const canvas = document.createElement('canvas');
        canvas.className = 'hero__marker-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        title.appendChild(canvas);

        let frame = null;
        let startedAt;

        function prepare() {
            cancelAnimationFrame(frame);
            const bounds = title.getBoundingClientRect();
            const ratio = Math.min(global.devicePixelRatio || 1, 2);
            const pad = 10;
            const width = bounds.width + pad * 2;
            const height = bounds.height + pad * 2;
            canvas.style.inset = '-' + pad + 'px';
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            canvas.width = Math.ceil(width * ratio);
            canvas.height = Math.ceil(height * ratio);

            const context = canvas.getContext('2d');
            context.setTransform(ratio, 0, 0, ratio, 0, 0);

            const lines = [];
            title.querySelectorAll('.hero__marker-word').forEach(function (word) {
                const rect = word.getBoundingClientRect();
                const previous = lines[lines.length - 1];
                if (previous && Math.abs(previous.top - rect.top) < 3) {
                    previous.right = rect.right;
                } else {
                    lines.push({ left: rect.left, right: rect.right, top: rect.top, height: rect.height });
                }
            });

            let delay = immediate ? 0 : 40;
            const passes = lines.map(function (line, lineIndex) {
                const layer = document.createElement('canvas');
                layer.width = canvas.width;
                layer.height = canvas.height;
                const ink = layer.getContext('2d');
                ink.setTransform(ratio, 0, 0, ratio, 0, 0);
                ink.fillStyle = '#D4AF37';
                const duration = immediate ? 1 : 860;
                const pass = {
                    layer: layer,
                    ink: ink,
                    line: line,
                    lineIndex: lineIndex,
                    delay: delay,
                    duration: duration,
                    drawn: -1
                };
                delay += duration + (immediate ? 0 : 120);
                return pass;
            });

            function nib(pass, distance) {
                const line = pass.line;
                const lineIndex = pass.lineIndex;
                const span = line.right - line.left + 12;
                const x = (line.left - bounds.left + pad - 4) + distance * span;
                const yBase = line.top - bounds.top + pad + line.height * 0.67 - distance * 1.8;
                const wave = Math.sin(distance * 11 + lineIndex) * 1.6 + Math.sin(distance * 26) * 0.6;
                const y = yBase + wave;
                const pressure = 0.94 + Math.sin(distance * 14) * 0.06 + Math.sin(distance * 32) * 0.025;
                const half = line.height * 0.28 * pressure;
                return { x: x, y: y, half: half, dxTop: -2.8, dxBottom: 2.8 };
            }

            function paintPass(pass, target, steps) {
                pass.ink.clearRect(0, 0, width, height);
                pass.ink.beginPath();
                for (let i = 0; i <= target; i += 1) {
                    const pt = nib(pass, i / steps);
                    if (i === 0) pass.ink.moveTo(pt.x + pt.dxTop, pt.y - pt.half);
                    else pass.ink.lineTo(pt.x + pt.dxTop, pt.y - pt.half);
                }
                for (let i = target; i >= 0; i -= 1) {
                    const pt = nib(pass, i / steps);
                    pass.ink.lineTo(pt.x + pt.dxBottom, pt.y + pt.half);
                }
                pass.ink.closePath();
                pass.ink.fill();
            }

            if (immediate) {
                context.clearRect(0, 0, width, height);
                passes.forEach(function (pass) {
                    const steps = Math.max(20, Math.ceil((pass.line.right - pass.line.left) * 2));
                    paintPass(pass, steps, steps);
                    context.globalAlpha = 0.76;
                    context.drawImage(pass.layer, 0, 0, width, height);
                });
                context.globalAlpha = 1;
                return;
            }

            function render(now) {
                if (startedAt === undefined) startedAt = now;
                const elapsed = now - startedAt;
                context.clearRect(0, 0, width, height);
                passes.forEach(function (pass) {
                    const t = Math.max(0, Math.min(1, (elapsed - pass.delay) / pass.duration));
                    const progress = t - Math.sin(t * Math.PI * 2) * 0.055;
                    const steps = Math.max(20, Math.ceil((pass.line.right - pass.line.left) * 2));
                    const target = Math.floor(progress * steps);
                    if (target > pass.drawn) {
                        paintPass(pass, target, steps);
                    }
                    pass.drawn = target;
                    context.globalAlpha = 0.76;
                    context.drawImage(pass.layer, 0, 0, width, height);
                });
                context.globalAlpha = 1;
                if (elapsed < delay) {
                    frame = requestAnimationFrame(render);
                }
            }

            frame = requestAnimationFrame(render);
        }

        prepare();
        let resizeTimer;
        global.addEventListener(
            'resize',
            function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(prepare, 150);
            },
            { passive: true }
        );
    }

    function init() {
        const hero = document.querySelector('.hero');
        if (!hero || !hero.querySelector('.hero__title-line--accent')) return;

        const reducedMotion =
            global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function start() {
            if (hero.classList.contains('hero--ink-ready')) return;
            hero.classList.add('hero--ink-ready');
            drawHeroMarker(hero, reducedMotion);
        }

        const preloader = document.getElementById('preloader');
        if (!preloader || preloader.classList.contains('hidden')) {
            start();
        } else {
            document.addEventListener('vye:preloader-done', function onDone() {
                document.removeEventListener('vye:preloader-done', onDone);
                setTimeout(start, 180);
            });
            setTimeout(start, 1800);
        }
    }

    VyE.modules = VyE.modules || {};
    VyE.modules.heroInk = { init: init };
})(window);
