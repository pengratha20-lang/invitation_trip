/* ============================================
   INVITATION INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Envelope Interaction Logic
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const openBtn = document.getElementById('openEnvelope');
    const mainContent = document.getElementById('mainContent');

    if (openBtn && envelopeWrapper && mainContent) {
        openBtn.addEventListener('click', () => {
            // Start opening animation
            envelopeWrapper.classList.add('is-opening');

            // Wait for letter animation to finish, then reveal main content
            setTimeout(() => {
                envelopeWrapper.classList.add('is-open');
                mainContent.classList.remove('is-hidden');

                // Start the countdown once opened
                startCountdown('April 18, 2026 07:00:00');

                console.log('📖 Invitation opened. Enjoy the quest!');
            }, 1000);
        });
    }

    // 1. Animate elements on scroll using Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe timeline items, logistics cards, and why items
    const elementsToAnimate = document.querySelectorAll('.timeline-item, .logistics-card, .why-item, .rules-card');

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Add visibility styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 2. RSVP Button Confetti Effect & Redirect
    const rsvpBtn = document.querySelector('.confirm-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', (e) => {
            // Add excited animations
            rsvpBtn.classList.add('btn-pop');
            rsvpBtn.classList.add('booked-state');

            // Trigger more intense confetti from the click location
            triggerConfetti(e.clientX, e.clientY);

            rsvpBtn.textContent = '🎉 YESSS! LET\'S GOOOOO! 🚀';
            rsvpBtn.style.background = 'linear-gradient(135deg, #00BCD4, #6B4CE8)';
            console.log('🎉 Journey Confirmed! The SU54 squad is growing!');

            // Redirect to Telegram group after a short delay
            setTimeout(() => {
                window.open('https://t.me/+KG7UXnikpoJjZGU9', '_blank');
            }, 1200);

            // Remove pop class so it can be triggered again if needed
            setTimeout(() => rsvpBtn.classList.remove('btn-pop'), 500);
        });
    }

    // 3. Create Dust Motes for Golden Hour Effect
    createDustMotes();

    // 4. Quiz Button Logic
    const quizButtons = document.querySelectorAll('.quiz-btn');
    quizButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Unselect others in the same group
            const parent = btn.parentElement;
            parent.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // 5. Cinematic Parallax Scroll (#9)
    window.addEventListener('scroll', parallaxScroll);

    // 6. Map and Journal Observers (#8, #10)
    initAestheticObservers();

    // 7. Immersive Journey Logs
    console.log('🚗 Road trip engine started... Destination: Siem Reap');
});

/**
 * Starts the countdown timer
 * @param {string} targetDate - The destination date
 */
function startCountdown(targetDate) {
    const countdownDate = new Date(targetDate).getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById('countdown').innerHTML = "THE JOURNEY HAS BEGUN! 🚀";
        }
    }, 1000);
}

/**
 * Creates a vibrant confetti burst from a specific point
 * @param {number} x - The x coordinate for the burst
 * @param {number} y - The y coordinate for the burst
 */
function triggerConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const colors = ['#00BCD4', '#6B4CE8', '#FFD700', '#FF8C42', '#FFFFFF'];
    const shapes = ['square', 'circle'];

    // Create more particles for more "excitement"
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 8 + 6;

        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${x}px;
            top: ${y}px;
            z-index: 9999;
            pointer-events: none;
            border-radius: ${shape === 'circle' ? '50%' : '2px'};
        `;
        document.body.appendChild(confetti);

        // Randomized trajectory for a burst effect
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 400 + 200;
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity + 400; // Extra gravity effect

        const duration = Math.random() * 1500 + 1000;
        const animation = confetti.animate([
            { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0) rotate(${Math.random() * 1000}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
}
/**
 * Creates organic floating dust motes in the sunbeams
 */
function createDustMotes() {
    const container = document.querySelector('.dust-motes');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const mote = document.createElement('div');
        mote.className = 'mote';

        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        mote.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 215, 0, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            left: ${left}%;
            top: ${top}%;
            filter: blur(1px);
            pointer-events: none;
            animation: floatMote ${duration}s linear infinite;
            animation-delay: -${delay}s;
        `;
        container.appendChild(mote);
    }
}
/**
 * Handles cinematic parallax scroll effect
 */
function parallaxScroll() {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    const scrollPos = window.pageYOffset;

    parallaxImages.forEach(img => {
        const parent = img.parentElement;
        const parentOffsetTop = parent.offsetTop;
        const parentHeight = parent.offsetHeight;

        // Only animate if in view
        if (scrollPos + window.innerHeight > parentOffsetTop && scrollPos < parentOffsetTop + parentHeight) {
            const speed = 0.4;
            const yPos = (scrollPos - parentOffsetTop) * speed;
            img.style.transform = `translateY(${yPos}px)`;
        }
    });
}

/**
 * Initializes observers for SVG Map and Journal Annotations
 */
function initAestheticObservers() {
    const observerOptions = {
        threshold: 0.3
    };

    const aestheticObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Map Path
                if (entry.target.classList.contains('map-path')) {
                    entry.target.classList.add('active');
                    // Trigger map points, labels, and the BUS!
                    document.querySelectorAll('.map-point, .map-label, .map-bus').forEach(el => el.classList.add('active'));
                }
            }
        });
    }, observerOptions);

    // Observe Map Path
    const mapPath = document.querySelector('.map-path');
    if (mapPath) aestheticObserver.observe(mapPath);
}
