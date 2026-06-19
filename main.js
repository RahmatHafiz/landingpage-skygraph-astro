// Setup Date
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal Animation Observer
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealElements.forEach(el => observer.observe(el));
}

// Navbar & FAB Interaction (passive scroll for performance)
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    const nav = document.getElementById('navbar');
    if (nav) {
        if (lastScrollY > 20) {
            nav.classList.add('glass-dark', 'shadow-sm');
        } else {
            nav.classList.remove('glass-dark', 'shadow-sm');
        }
    }

    const waBtn = document.getElementById('wa-btn');
    const heroEl = document.getElementById('hero');
    const chatUi = document.getElementById('chatbot-ui');

    if (waBtn && heroEl) {
        const heroHeight = heroEl.offsetHeight;
        if (lastScrollY > heroHeight / 2) {
            waBtn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            waBtn.classList.add('translate-y-20', 'opacity-0');
            if (chatUi && !chatUi.classList.contains('hidden-chat')) {
                toggleChat();
            }
        }
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// 5 Steps Animation with Mobile Auto-Scroll functionality
const steps = document.querySelectorAll('.step-item');
const stepCircles = document.querySelectorAll('.step-circle');
const progressLine = document.getElementById('step-progress-line');
let currentStep = 0;

function animateSteps() {
    if (steps.length === 0 || stepCircles.length === 0) return;

    stepCircles.forEach(circle => {
        circle.classList.remove('bg-brand-500', 'text-white', 'border-brand-400', 'scale-110', 'shadow-md');
        circle.classList.add('bg-slate-800', 'text-slate-500', 'border-slate-700');
    });
    steps.forEach(step => {
        step.classList.remove('scale-105', 'bg-slate-800', 'border-brand-500');
        step.classList.add('bg-transparent', 'border-transparent');
    });

    if (stepCircles[currentStep]) {
        stepCircles[currentStep].classList.remove('bg-slate-800', 'text-slate-500', 'border-slate-700');
        stepCircles[currentStep].classList.add('bg-brand-500', 'text-white', 'border-brand-400', 'scale-110', 'shadow-md');

        steps[currentStep].classList.remove('bg-transparent', 'border-transparent');
        steps[currentStep].classList.add('scale-105', 'bg-slate-800', 'border-brand-500');

        // Mobile auto-scroll to current step
        if (window.innerWidth < 768) {
            const container = document.getElementById('steps-container');
            if (container && steps[currentStep]) {
                const step = steps[currentStep];
                const scrollPos = step.offsetLeft - (container.clientWidth / 2) + (step.clientWidth / 2);
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }
    }

    if (progressLine) {
        const widthPercent = (currentStep / (steps.length - 1)) * 100;
        progressLine.style.width = `${widthPercent}%`;
    }

    currentStep = (currentStep + 1) % steps.length;
}

if (steps.length > 0) {
    setInterval(animateSteps, 2000);
    animateSteps();
}

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (mobileMenu && menuIcon) {
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            if(mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            if(mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (isMenuOpen) toggleMenu(); });
});

// Flip Card Click Handler (replaces hover)
document.querySelectorAll('.flip-container').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active-flip');
    });
    // Add keyboard accessibility for flip cards
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('active-flip');
        }
    });
});

// FAQ Toggle
window.toggleFaq = function(button) {
    if (!button || !button.parentElement) return;
    const faqItem = button.parentElement;
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) item.classList.remove('active');
    });
    const isActive = faqItem.classList.toggle('active');
    button.setAttribute('aria-expanded', isActive);
}

// Contact Form → WhatsApp Redirect (data is actually sent)
window.submitFormToWhatsApp = function() {
    const name = document.getElementById('form-name')?.value.trim() || '';
    const company = document.getElementById('form-company')?.value.trim() || '';
    const phone = document.getElementById('form-phone')?.value.trim() || '';
    const service = document.getElementById('form-service')?.value || '';
    const detail = document.getElementById('form-detail')?.value.trim() || '';

    if (!name || !phone || !service) return;

    const formBtn = document.querySelector('#contact-form button[type="submit"]');
    const msg = document.getElementById('success-msg');
    const formEl = document.getElementById('contact-form');

    if (!formBtn) return;

    const originalContent = formBtn.innerHTML;
    formBtn.innerHTML = 'Mengirim...';
    formBtn.disabled = true;
    formBtn.classList.add('opacity-80', 'cursor-not-allowed');

    // Build WhatsApp message
    let waMessage = `Halo Skygraph! 👋\n\n`;
    waMessage += `*Nama:* ${name}\n`;
    if (company) waMessage += `*Perusahaan:* ${company}\n`;
    waMessage += `*No. WA:* ${phone}\n`;
    waMessage += `*Layanan:* ${service}\n`;
    if (detail) waMessage += `*Detail:* ${detail}\n`;
    waMessage += `\n_Pesan dikirim dari website skygraph.id_`;

    const waUrl = `https://wa.me/6285155377210?text=${encodeURIComponent(waMessage)}`;

    setTimeout(() => {
        window.open(waUrl, '_blank');
        formBtn.innerHTML = 'Berhasil! ✓';
        if (msg) msg.classList.remove('hidden');
        if (formEl) formEl.reset();

        setTimeout(() => {
            formBtn.innerHTML = originalContent;
            formBtn.disabled = false;
            formBtn.classList.remove('opacity-80', 'cursor-not-allowed');
            if (msg) msg.classList.add('hidden');
        }, 4000);
    }, 600);
}

// Portfolio Carousel (Infinite Loop Drag/Swipe) - Optimized 2x clone
window.addEventListener('load', () => {
    const track = document.getElementById('carousel');
    if (track) {
        const originalItems = Array.from(track.children);
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));

        let maxScroll = track.scrollWidth / 2;
        track.scrollLeft = 0;

        track.addEventListener('scroll', () => {
            if (isDown) return; // Prevent glitch during manual drag
            maxScroll = track.scrollWidth / 2;
            
            // Disable scroll snap temporarily to prevent jumping behavior during loop reset
            if (track.scrollLeft >= maxScroll) {
                track.style.scrollSnapType = 'none';
                track.scrollLeft = track.scrollLeft - maxScroll;
                // Re-enable scroll snap after layout shift
                setTimeout(() => { track.style.scrollSnapType = 'x mandatory'; }, 50);
            } else if (track.scrollLeft <= 0) {
                track.style.scrollSnapType = 'none';
                track.scrollLeft = maxScroll;
                setTimeout(() => { track.style.scrollSnapType = 'x mandatory'; }, 50);
            }
        }, { passive: true });

        let isDown = false, startX, scrollLeftPos;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.scrollSnapType = 'none';
            startX = e.pageX - track.offsetLeft;
            scrollLeftPos = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.scrollSnapType = 'x mandatory';
            
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.scrollSnapType = 'x mandatory';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeftPos - walk;
        });
        // --- Bulletproof Auto Scroll ---
        let autoScrollTimer;
        
        function playCarousel() {
            clearInterval(autoScrollTimer);
            autoScrollTimer = setInterval(() => {
                if (!isDown) {
                    const item = track.querySelector('.carousel-item');
                    if(item) {
                        const style = window.getComputedStyle(track);
                        const gap = parseInt(style.gap) || 24;
                        const scrollStep = item.offsetWidth + gap;
                        
                        // Use accurate scroll limit check
                        const maxScrollLeft = track.scrollWidth - track.clientWidth;
                        
                        if (track.scrollLeft >= maxScrollLeft - 10) {
                            track.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                            track.scrollBy({ left: scrollStep, behavior: 'smooth' });
                        }
                    }
                }
            }, 1500);
        }
        
        // Start automatically
        setTimeout(playCarousel, 1500);
        
        track.addEventListener('mouseenter', () => clearInterval(autoScrollTimer));
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.scrollSnapType = 'x mandatory';
            playCarousel();
        });
        
        track.addEventListener('touchstart', () => clearInterval(autoScrollTimer), {passive: true});
        track.addEventListener('touchend', () => {
            isDown = false;
            track.style.scrollSnapType = 'x mandatory';
            setTimeout(playCarousel, 1500);
        }, {passive: true});

    }
});

// Chatbot Controls
window.toggleChat = function() {
    const chatUI = document.getElementById('chatbot-ui');
    const chatInput = document.getElementById('chat-input');
    if (chatUI) {
        chatUI.classList.toggle('hidden-chat');
        if (!chatUI.classList.contains('hidden-chat') && chatInput) chatInput.focus();
    }
}

window.handleChatSubmit = function(e) {
    if (e.key === 'Enter') sendChat();
}

window.sendChat = function() {
    const input = document.getElementById('chat-input');
    if (input) {
        const msg = input.value.trim();
        if (msg !== "") {
            const waUrl = `https://wa.me/6285155377210?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
            input.value = "";
            toggleChat();
        }
    }
}


// Hero Background Video Rotation
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        const playlist = [
            'assets/tugu-songket.webm',
            'assets/pacu-jalur.webm',
            'assets/istana-siak.webm',
            'assets/sunset.webm'
        ];
        let currentVideoIndex = 0;
        
        // Ensure initial transition is set
        heroVideo.style.transition = 'opacity 0.8s ease-in-out';

        heroVideo.addEventListener('ended', () => {
            // Fade out
            heroVideo.style.opacity = '0';
            
            setTimeout(() => {
                currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
                heroVideo.src = playlist[currentVideoIndex];
                heroVideo.load();
                
                heroVideo.play().then(() => {
                    // Fade in once playing
                    heroVideo.style.opacity = '0.6';
                }).catch(e => console.log('Auto-play failed:', e));
            }, 800); // Wait for fade out to complete before switching
        });
    }
});
