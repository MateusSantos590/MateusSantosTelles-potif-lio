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
