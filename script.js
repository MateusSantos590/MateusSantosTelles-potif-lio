/* ================================================
   SCRIPT.JS — Mateus Telles Personal Landing Page
   ================================================ */

// ── Particles Canvas ──────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.4 + 0.1
        };
    }

    function init() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
        particles = Array.from({ length: count }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--purple-2').trim() || '#8b5cf6';

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
            ctx.fill();
        });

        // draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    resize();
    init();
    draw();
})();


// ── Header shrink on scroll ───────────────────────
(function headerScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    const handler = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
})();


// ── Mobile Menu Toggle ────────────────────────────
(function mobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // close on outside click
    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();


// ── Reveal on Scroll ──────────────────────────────
(function revealOnScroll() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => observer.observe(el));
})();


// ── Skill Bar Animation ───────────────────────────
(function skillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    fills.forEach(el => observer.observe(el));
})();


// ── Active nav link highlight ─────────────────────
(function activeNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    links.forEach(link => {
                        const active = link.getAttribute('href') === `#${id}`;
                        link.style.color = active ? 'var(--purple-3)' : '';
                        link.style.background = active ? 'rgba(139,92,246,.1)' : '';
                    });
                }
            });
        },
        { threshold: 0.45 }
    );

    sections.forEach(s => observer.observe(s));
})();


// ── Smooth hero CTA scroll offset ────────────────
(function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();


// ── Real-time Date/Time Display ───────────────────
(function liveDateTime() {
    const el = document.getElementById('hero-datetime');
    if (!el) return;

    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    function pad(n) { return String(n).padStart(2, '0'); }

    function update() {
        const now = new Date();
        const dia = dias[now.getDay()];
        const num = now.getDate();
        const mes = meses[now.getMonth()];
        const h = pad(now.getHours());
        const m = pad(now.getMinutes());
        const s = pad(now.getSeconds());
        el.textContent = `${dia}, ${num} de ${mes} · ${h}:${m}:${s}`;
    }

    update();
    setInterval(update, 1000);
})();


// ── Secret Panel ──────────────────────────
(function secretPanel() {
    const btn = document.getElementById('secret-btn');
    const panel = document.getElementById('secret-panel');
    const overlay = document.getElementById('secret-overlay');
    const closeBtn = document.getElementById('secret-close');
    if (!btn || !panel) return;

    function open() {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Reset drawer scroll to top
        const drawer = panel.querySelector('.secret-drawer');
        if (drawer) drawer.scrollTop = 0;
    }

    function close() {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        panel.classList.contains('active') ? close() : open();
    });

    if (overlay) overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('active')) close();
    });

    // Mobile long-press: reveal the button after 800 ms hold
    let pressTimer = null;
    btn.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => {
            btn.classList.add('revealed');
        }, 800);
    }, { passive: true });
    btn.addEventListener('touchend', () => clearTimeout(pressTimer));
    btn.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
})();


// ── Pixel Trail on Mouse Move ─────────────────────
(function pixelTrail() {
    const COLORS = [
        '#8b5cf6', '#7c3aed', '#06b6d4', '#e879f9',
        '#a78bfa', '#22d3ee', '#c084fc', '#38bdf8'
    ];
    const SIZE = 6;   // px — tamanho do pixel
    const LIFE = 600; // ms — duração da animação

    let lastX = -999, lastY = -999;

    function spawn(x, y) {
        const el = document.createElement('div');
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        // offset aleatório pequeno p/ efeito mais "espalhado"
        const ox = (Math.random() - 0.5) * 12;
        const oy = (Math.random() - 0.5) * 12;

        Object.assign(el.style, {
            position: 'fixed',
            left: `${x + ox - SIZE / 2}px`,
            top: `${y + oy - SIZE / 2}px`,
            width: `${SIZE}px`,
            height: `${SIZE}px`,
            background: color,
            borderRadius: '1px',
            pointerEvents: 'none',
            zIndex: '99999',
            opacity: '1',
            transition: `transform ${LIFE}ms ease-out, opacity ${LIFE}ms ease-out`,
            willChange: 'transform, opacity',
            imageRendering: 'pixelated',
            boxShadow: `0 0 4px ${color}88`,
        });

        document.body.appendChild(el);

        // força reflow p/ a transition disparar
        el.getBoundingClientRect();

        const floatY = -(20 + Math.random() * 30);
        const floatX = (Math.random() - 0.5) * 16;
        const scale = 0.1 + Math.random() * 0.4;

        el.style.transform = `translate(${floatX}px, ${floatY}px) scale(${scale})`;
        el.style.opacity = '0';

        setTimeout(() => el.remove(), LIFE + 50);
    }

    document.addEventListener('mousemove', e => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        // só solta pixel se o mouse andou pelo menos 8px
        if (dx * dx + dy * dy < 64) return;
        lastX = e.clientX;
        lastY = e.clientY;
        spawn(e.clientX, e.clientY);
    });
})();


// ── Circular Skills Rings — Scroll Animate + Hover Info ──
(function skillRings() {
    const cards = document.querySelectorAll('.ring-card');
    const infoBox = document.getElementById('ring-info-box');
    const infoIco = document.getElementById('ring-info-ico');
    const infoTtl = document.getElementById('ring-info-title');
    const infoNot = document.getElementById('ring-info-note');
    const infoBdg = document.getElementById('ring-info-badge');
    if (!cards.length || !infoBox) return;

    // ── Hover: update info panel ──
    const DEFAULT_ICO = '💡';
    const DEFAULT_TITLE = 'Passe o mouse sobre uma habilidade';
    const DEFAULT_NOTE = 'Cada anel mostra meu nível atual de domínio nessa tecnologia.';

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const { icon, label, pct, color, note } = card.dataset;
            infoIco.textContent = icon;
            infoTtl.textContent = label;
            infoNot.textContent = note;
            infoBdg.textContent = pct + '%';
            infoBdg.style.color = color;
            infoBox.style.borderColor = color + '55';
            infoBox.style.background = color + '12';
        });
        card.addEventListener('mouseleave', () => {
            infoIco.textContent = DEFAULT_ICO;
            infoTtl.textContent = DEFAULT_TITLE;
            infoNot.textContent = DEFAULT_NOTE;
            infoBdg.textContent = '';
            infoBdg.style.color = '';
            infoBox.style.borderColor = '';
            infoBox.style.background = '';
        });
    });

    // ── Scroll: animate rings filling up ──
    const panel = document.querySelector('.skills-rings-panel');
    if (!panel) return;

    let animated = false;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                panel.querySelectorAll('.ring-progress').forEach((ring, i) => {
                    const target = ring.dataset.target;
                    // staggered: each ring starts a bit later
                    setTimeout(() => {
                        ring.style.transition =
                            `stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), filter .3s ease`;
                        ring.style.strokeDashoffset = target;
                    }, i * 100);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.25 });

    observer.observe(panel);
})();
