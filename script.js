/* ============================================
   Armen & Lilit Wedding — Animations & Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Background Music (muted by default, no autoplay) ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const preloader = document.getElementById('preloader');
    let musicPlaying = false;
    let userPaused = false;

    // Set audio to muted by default
    if (bgMusic) {
        bgMusic.volume = 0.4;
        bgMusic.muted = true;
    }

    if (musicToggle) {
        musicToggle.classList.add('visible');
        musicToggle.classList.add('muted');
    }

    // Music toggle: play/pause and mute/unmute
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (musicPlaying) {
                // Pause
                userPaused = true;
                bgMusic.pause();
                musicPlaying = false;
                musicToggle.classList.add('muted');
            } else {
                // Play
                userPaused = false;
                bgMusic.muted = false;
                bgMusic.play().then(() => {
                    musicPlaying = true;
                    musicToggle.classList.remove('muted');
                }).catch(() => {
                    // Play failed
                });
            }
        });
    }

    // --- Preloader ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(initHeroAnimations, 300);
        }, 800);
    });

    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            setTimeout(initHeroAnimations, 300);
        }
    }, 3000);

    // --- Hero Fade-Up Animations ---
    function initHeroAnimations() {
        const fadeElements = document.querySelectorAll('.fade-up');
        fadeElements.forEach((el) => {
            el.classList.add('visible');
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax-like subtle movement on hero ---
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;

                    if (scrolled < heroHeight) {
                        const opacity = 1 - (scrolled / heroHeight) * 0.6;
                        const translateY = scrolled * 0.3;
                        heroContent.style.opacity = opacity;
                        heroContent.style.transform = `translateY(${translateY}px)`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Staggered reveal for info items ---
    const infoItems = document.querySelectorAll('.info-item');

    const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                infoObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    infoItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        infoObserver.observe(item);
    });

    // --- Countdown Timer ---
    const weddingDate = new Date('2026-06-26T11:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('cdDays').textContent = '00';
            document.getElementById('cdHours').textContent = '00';
            document.getElementById('cdMinutes').textContent = '00';
            document.getElementById('cdSeconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');

        document.getElementById('cdDays').textContent = pad(days);
        document.getElementById('cdHours').textContent = pad(hours);
        document.getElementById('cdMinutes').textContent = pad(minutes);
        document.getElementById('cdSeconds').textContent = pad(seconds);
    }

    if (document.getElementById('countdownTimer')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // --- Floating Hearts Animation (across entire page) ---
    function createFloatingHearts() {
        // Create a fixed container that covers the whole viewport
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'hearts-container';
        document.body.appendChild(heartsContainer);

        // Inject heart keyframe styles
        if (!document.getElementById('heart-styles')) {
            const style = document.createElement('style');
            style.id = 'heart-styles';
            style.textContent = `
                .hearts-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9990;
                    overflow: hidden;
                }

                .floating-heart {
                    position: absolute;
                    bottom: -40px;
                    pointer-events: none;
                    will-change: transform, opacity;
                }

                .floating-heart svg {
                    display: block;
                }

                @keyframes heartRise {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(0.4);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                        transform: translateY(-10vh) translateX(10px) rotate(5deg) scale(1);
                    }
                    30% {
                        transform: translateY(-30vh) translateX(-15px) rotate(-8deg) scale(1);
                    }
                    50% {
                        transform: translateY(-50vh) translateX(20px) rotate(10deg) scale(0.95);
                    }
                    70% {
                        transform: translateY(-70vh) translateX(-10px) rotate(-5deg) scale(0.85);
                    }
                    90% {
                        opacity: 0.6;
                        transform: translateY(-90vh) translateX(15px) rotate(8deg) scale(0.7);
                    }
                    100% {
                        transform: translateY(-110vh) translateX(0) rotate(0deg) scale(0.5);
                        opacity: 0;
                    }
                }

                @keyframes heartRiseSway {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(0.3);
                        opacity: 0;
                    }
                    8% {
                        opacity: 0.9;
                        transform: translateY(-8vh) translateX(-12px) rotate(-10deg) scale(1);
                    }
                    25% {
                        transform: translateY(-25vh) translateX(18px) rotate(12deg) scale(1);
                    }
                    45% {
                        transform: translateY(-45vh) translateX(-22px) rotate(-15deg) scale(0.9);
                    }
                    65% {
                        transform: translateY(-65vh) translateX(14px) rotate(8deg) scale(0.8);
                    }
                    85% {
                        opacity: 0.5;
                        transform: translateY(-85vh) translateX(-8px) rotate(-6deg) scale(0.65);
                    }
                    100% {
                        transform: translateY(-115vh) translateX(5px) rotate(3deg) scale(0.4);
                        opacity: 0;
                    }
                }

                @keyframes heartRiseDrift {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(0.5);
                        opacity: 0;
                    }
                    12% {
                        opacity: 0.8;
                        transform: translateY(-12vh) translateX(20px) rotate(15deg) scale(1);
                    }
                    35% {
                        transform: translateY(-35vh) translateX(-25px) rotate(-10deg) scale(0.95);
                    }
                    55% {
                        transform: translateY(-55vh) translateX(15px) rotate(5deg) scale(0.85);
                    }
                    75% {
                        opacity: 0.4;
                        transform: translateY(-75vh) translateX(-20px) rotate(-12deg) scale(0.7);
                    }
                    100% {
                        transform: translateY(-110vh) translateX(10px) rotate(8deg) scale(0.45);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Heart SVG templates — outline style to stay minimalistic
        function createHeartSVG(size, opacity, filled) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', size);
            svg.setAttribute('height', size);
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', filled ? `rgba(138, 125, 107, ${opacity * 0.4})` : 'none');
            svg.setAttribute('stroke', `rgba(138, 125, 107, ${opacity})`);
            svg.setAttribute('stroke-width', '1.2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
            svg.appendChild(path);

            return svg;
        }

        const animations = ['heartRise', 'heartRiseSway', 'heartRiseDrift'];

        function spawnHeart() {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';

            const size = Math.random() * 14 + 10; // 10–24px
            const opacity = Math.random() * 0.4 + 0.15; // 0.15–0.55
            const filled = Math.random() > 0.5;
            const leftPos = Math.random() * 100;
            const duration = Math.random() * 6 + 8; // 8–14s
            const anim = animations[Math.floor(Math.random() * animations.length)];

            heart.style.left = leftPos + '%';
            heart.style.animation = `${anim} ${duration}s ease-out forwards`;

            heart.appendChild(createHeartSVG(size, opacity, filled));
            heartsContainer.appendChild(heart);

            // Remove after animation ends
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        }

        // Spawn initial batch with staggered delays
        for (let i = 0; i < 6; i++) {
            setTimeout(() => spawnHeart(), i * 800);
        }

        // Continuously spawn hearts
        setInterval(() => {
            // Keep heart count reasonable
            const currentHearts = heartsContainer.querySelectorAll('.floating-heart').length;
            if (currentHearts < 15) {
                spawnHeart();
            }
        }, 1800);

        // Spawn a burst of hearts on click (fun interaction)
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'floating-heart';

                    const size = Math.random() * 12 + 8;
                    const opacity = Math.random() * 0.35 + 0.2;
                    const filled = Math.random() > 0.4;
                    const duration = Math.random() * 4 + 6;
                    const anim = animations[Math.floor(Math.random() * animations.length)];

                    // Spawn near click position
                    const rect = document.body.getBoundingClientRect();
                    const leftPercent = ((e.clientX + (Math.random() * 60 - 30)) / window.innerWidth) * 100;

                    heart.style.left = leftPercent + '%';
                    heart.style.bottom = (window.innerHeight - e.clientY) + 'px';
                    heart.style.animation = `${anim} ${duration}s ease-out forwards`;

                    heart.appendChild(createHeartSVG(size, opacity, filled));
                    heartsContainer.appendChild(heart);

                    heart.addEventListener('animationend', () => {
                        heart.remove();
                    });
                }, i * 150);
            }
        });
    }

    createFloatingHearts();

    // --- Image placeholder handling ---
    document.querySelectorAll('.event-image img').forEach((img) => {
        img.addEventListener('error', () => {
            img.parentElement.classList.add('placeholder');
        });

        // If image src is empty or doesn't exist
        if (!img.src || img.src === window.location.href) {
            img.parentElement.classList.add('placeholder');
        }
    });

    // --- Couple photo placeholder handling ---
    const coupleImg = document.querySelector('.couple-photo-frame img');
    if (coupleImg) {
        const showPlaceholder = () => {
            coupleImg.style.display = 'none';
            const placeholder = coupleImg.parentElement.querySelector('.couple-photo-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
        };

        coupleImg.addEventListener('error', showPlaceholder);

        if (!coupleImg.src || coupleImg.src === window.location.href) {
            showPlaceholder();
        }
    }

    // --- RSVP Form Submission ---
    // Replace this with your Google Apps Script Web App URL after deploying.
    // See the setup guide in the project for step-by-step instructions.
    const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyJIXWS33FTpbrvgpyzrOGPWQc9KWW-EMt2iJbk-qwqD2IbjS_AWkuxHAmRe4NZBCRi4Q/exec';

    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        const submitBtn = document.getElementById('rsvpSubmit');
        const feedback = document.getElementById('rsvpFeedback');
        const nameInput = document.getElementById('rsvpName');

        const setFeedback = (text, type) => {
            feedback.textContent = text;
            feedback.classList.remove('is-success', 'is-error');
            if (type) feedback.classList.add(`is-${type}`);
        };

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const attending = rsvpForm.querySelector('input[name="attending"]:checked');
            const sides = Array.from(
                rsvpForm.querySelectorAll('input[name="side"]:checked')
            ).map((el) => el.value);

            if (!name) {
                setFeedback('Խնդրում ենք լրացնել Ձեր անունը։', 'error');
                nameInput.focus();
                return;
            }
            if (!attending) {
                setFeedback('Խնդրում ենք նշել Ձեր ներկայությունը։', 'error');
                return;
            }

            setFeedback('Ուղարկվում է...', null);
            submitBtn.disabled = true;
            submitBtn.classList.add('is-loading');

            const payload = new FormData();
            payload.append('name', name);
            payload.append('attending', attending.value);
            payload.append('side', sides.join(', '));
            payload.append('timestamp', new Date().toISOString());

            try {
                if (
                    !RSVP_ENDPOINT ||
                    RSVP_ENDPOINT.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')
                ) {
                    throw new Error('endpoint-not-configured');
                }

                // Note: Google Apps Script responds with a 302 redirect that
                // browsers can't follow cleanly under `no-cors` mode, so fetch
                // sometimes never resolves even though the data lands in the
                // sheet. We race it against a timeout and assume success.
                const submission = fetch(RSVP_ENDPOINT, {
                    method: 'POST',
                    body: payload,
                    mode: 'no-cors'
                }).catch(() => {});

                await Promise.race([
                    submission,
                    new Promise((resolve) => setTimeout(resolve, 3000))
                ]);

                setFeedback('Շնորհակալություն, Ձեր պատասխանը ստացված է 🤍', 'success');
                rsvpForm.classList.add('is-sent');
            } catch (err) {
                if (err.message === 'endpoint-not-configured') {
                    setFeedback(
                        'Ձևը դեռ կարգավորված չէ։ (Մշակողի համար՝ սահմանեք RSVP_ENDPOINT-ը script.js-ում։)',
                        'error'
                    );
                } else {
                    setFeedback(
                        'Ինչ-որ բան սխալ գնաց։ Խնդրում ենք փորձել կրկին։',
                        'error'
                    );
                }
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-loading');
            }
        });
    }

    // --- Cursor trail effect (very subtle, desktop only) ---
    if (window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let trailTimeout;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            clearTimeout(trailTimeout);
            trailTimeout = setTimeout(() => {
                // Subtle glow follows cursor on hero
                if (hero) {
                    hero.style.setProperty(
                        'background',
                        `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(138, 125, 107, 0.03), transparent 40%), var(--color-cream)`
                    );
                }
            }, 50);
        });
    }

});
