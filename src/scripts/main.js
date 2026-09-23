let isGlobalEventAttached = false;
let ticking = false;

document.addEventListener("astro:page-load", () => {
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


    window.updateNavbar = function () {
        const currentScrollY = window.scrollY;
        const nav = document.getElementById('navbar');
        if (nav) {
            const isSolid = nav.dataset.navstyle === 'solid';
            if (currentScrollY > 20 || isMenuOpen) {
                nav.classList.add('bg-slate-900', 'border-slate-800', 'shadow-sm', 'backdrop-blur-md', 'bg-opacity-95');
                if (!isSolid) nav.classList.remove('border-transparent');
            } else {
                nav.classList.remove('shadow-sm', 'backdrop-blur-md', 'bg-opacity-95');
                if (!isSolid) {
                    nav.classList.remove('bg-slate-900', 'border-slate-800');
                    nav.classList.add('border-transparent');
                }
            }
        }

        const waBtn = document.getElementById('wa-btn');
        const scrollUpBtn = document.getElementById('scroll-up-btn');
        const heroEl = document.getElementById('hero');
        const chatUi = document.getElementById('chatbot-ui');

        if (waBtn) {
            const threshold = heroEl ? heroEl.offsetHeight / 2 : 200;
            if (currentScrollY > threshold) {
                waBtn.classList.remove('translate-y-20', 'opacity-0');
                if (scrollUpBtn) scrollUpBtn.classList.remove('translate-y-20', 'opacity-0');
            } else {
                waBtn.classList.add('translate-y-20', 'opacity-0');
                if (scrollUpBtn) scrollUpBtn.classList.add('translate-y-20', 'opacity-0');
                if (chatUi && !chatUi.classList.contains('hidden-chat')) {
                    window.toggleChat();
                }
            }
        }
        ticking = false;
    };

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    let isMenuOpen = false;

    window.toggleMenu = function () {
        isMenuOpen = !isMenuOpen;
        if (mobileMenu && menuIcon) {
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
        window.updateNavbar();
    };

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => { if (isMenuOpen) window.toggleMenu(); });
    });

    window.toggleChat = function () {
        const chatUI = document.getElementById('chatbot-ui');
        const chatInput = document.getElementById('chat-input');
        if (chatUI) {
            chatUI.classList.toggle('hidden-chat');
            if (!chatUI.classList.contains('hidden-chat') && chatInput) chatInput.focus();
        }
    };

    window.handleChatSubmit = function (e) {
        if (e.key === 'Enter') window.sendChat();
    };

    window.sendChat = function () {
        const input = document.getElementById('chat-input');
        if (input) {
            const msg = input.value.trim();
            if (msg !== "") {
                const waUrl = `https://wa.me/6285365557009?text=${encodeURIComponent(msg)}`;
                window.open(waUrl, '_blank');
                input.value = "";
                window.toggleChat();
            }
        }
    };

    if (!isGlobalEventAttached) {
        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(window.updateNavbar);
                ticking = true;
            }
        }, { passive: true });
        isGlobalEventAttached = true;
    }

    // Ensure navbar is updated on load in case of non-zero scroll position after navigation
    window.updateNavbar();

});