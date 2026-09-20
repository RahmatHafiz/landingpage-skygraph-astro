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

    // Navbar & FAB Interaction (passive scroll for performance)

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

    // 5 Steps Animation with Mobile Auto-Scroll functionality
    const steps = document.querySelectorAll('.step-item');
    const stepCircles = document.querySelectorAll('.step-circle');
    const progressLine = document.getElementById('step-progress-line');
    let currentStep = 0;

    window.animateSteps = function () {
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
    };

    if (steps.length > 0) {
        setInterval(window.animateSteps, 2000);
        window.animateSteps();
    }

    // Mobile Menu
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

    // Flip Card Click Handler
    document.querySelectorAll('.flip-container').forEach(card => {
        if (card.id === 'flip-container') return; // Exclude legal page container

        card.addEventListener('click', () => {
            card.classList.toggle('active-flip');
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('active-flip');
            }
        });
    });

    // FAQ Toggle
    window.toggleFaq = function (button) {
        if (!button || !button.parentElement) return;
        const faqItem = button.parentElement;
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });
        const isActive = faqItem.classList.toggle('active');
        button.setAttribute('aria-expanded', isActive);
    };

    // Contact Form (Web3Forms Email Integration)
    window.submitFormToEmail = function () {
        const name = document.getElementById('form-name')?.value.trim() || '';
        const company = document.getElementById('form-company')?.value.trim() || '';
        const email = document.getElementById('form-email')?.value.trim() || '';
        const phone = document.getElementById('form-phone')?.value.trim() || '';
        const service = document.getElementById('form-service')?.value || '';
        const detail = document.getElementById('form-detail')?.value.trim() || '';
        if (!name || !email || !phone || !service) return;

        // Validasi format email dengan Regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Silakan masukkan alamat email yang valid (contoh: nama@email.com).");
            return;
        }

        // Rate Limiting (Mencegah spam dari user manusia)
        const lastSubmitTime = localStorage.getItem('lastFormSubmit');
        const now = new Date().getTime();
        if (lastSubmitTime && now - parseInt(lastSubmitTime) < 60000) { // 60 detik cooldown
            alert("Anda telah mengirim pesan belum lama ini. Harap tunggu sekitar 1 menit sebelum mengirim pesan lagi.");
            return;
        }

        const formBtn = document.querySelector('#contact-form button[type="submit"]');
        const msg = document.getElementById('success-msg');
        const formEl = document.getElementById('contact-form');

        if (!formBtn) return;

        const originalContent = formBtn.innerHTML;
        formBtn.innerHTML = 'Mengirim...';
        formBtn.disabled = true;
        formBtn.classList.add('opacity-80', 'cursor-not-allowed');

        // Honeypot Anti-Spam Check
        const botcheck = document.getElementById('form-botcheck');
        if (botcheck && botcheck.checked) {
            // Fake success response for bots
            setTimeout(() => {
                formBtn.innerHTML = 'Berhasil Terkirim!';
                if (msg) {
                    msg.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
                    msg.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
                    msg.innerHTML = 'Pesan terkirim ke email SKYGRAPH. Tim kami akan segera menghubungi Anda.';
                }
                if (formEl) formEl.reset();

                setTimeout(() => {
                    formBtn.innerHTML = originalContent;
                    formBtn.disabled = false;
                    formBtn.classList.remove('opacity-80', 'cursor-not-allowed');
                    if (msg) msg.classList.add('hidden');
                }, 5000);
            }, 1000);
            return;
        }
        // TODO: Dapatkan Access Key gratis dari https://web3forms.com 
        // dengan memasukkan email skygraph.idn@gmail.com di website tersebut.
        // Ganti teks "GANTI_DENGAN_ACCESS_KEY_WEB3FORMS_ANDA" dengan key yang dikirim ke email.
        const accessKey = "8e519141-1557-4e80-b571-b1b22f5a5a99";

        // Access Key berhasil disetel
        const formData = new FormData();
        formData.append('access_key', accessKey);
        formData.append('subject', `Permintaan Layanan Baru: ${service} dari ${name}`);
        formData.append('from_name', 'SKYGRAPH Website');
        formData.append('replyto', email);
        formData.append('Nama Lengkap', name);
        if (company) formData.append('Perusahaan', company);
        formData.append('Alamat Email', email);
        formData.append('No. WhatsApp', phone);
        formData.append('Kebutuhan Layanan', service);
        if (detail) formData.append('Detail Request', detail);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
            .then(async (response) => {
                if (response.status == 200) {
                    // Catat waktu pengiriman untuk Rate Limiting
                    localStorage.setItem('lastFormSubmit', new Date().getTime().toString());

                    formBtn.innerHTML = 'Berhasil Terkirim!';
                    if (msg) {
                        msg.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200');
                        msg.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
                        msg.innerHTML = 'Pesan terkirim ke email SKYGRAPH. Tim kami akan segera menghubungi Anda.';
                    }
                    if (formEl) formEl.reset();
                } else {
                    throw new Error('Gagal mengirim');
                }
            })
            .catch(error => {
                console.error(error);
                formBtn.innerHTML = 'Gagal Mengirim ✕';
                if (msg) {
                    msg.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
                    msg.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
                    msg.innerHTML = '✕ Terjadi kesalahan sistem. Silakan hubungi kami via WhatsApp secara manual.';
                }
            })
            .finally(() => {
                setTimeout(() => {
                    formBtn.innerHTML = originalContent;
                    formBtn.disabled = false;
                    formBtn.classList.remove('opacity-80', 'cursor-not-allowed');
                    if (msg) msg.classList.add('hidden');
                }, 5000);
            });
    };

    // Portfolio Carousel: Auto-clone Content for Infinite Loop
    const track = document.getElementById('carousel');
    if (track && track.dataset.cloned !== "true") {
        track.dataset.cloned = "true";
        const originalItems = Array.from(track.children);
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
    }

    // Chatbot Controls
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

    // Sewa Modal Controls
    window.toggleSewaModal = function () {
        const modal = document.getElementById('sewa-modal');
        const modalContent = document.getElementById('sewa-modal-content');
        const modalBackdrop = document.getElementById('sewa-modal-backdrop');

        if (modal && modalContent && modalBackdrop) {
            const navbar = document.getElementById('navbar');
            const floatingWidgets = document.getElementById('floating-widgets');
            
            if (modal.classList.contains('hidden')) {
                // Calculate scrollbar width
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                
                // Open modal
                modal.classList.remove('hidden');
                // Trigger reflow
                void modal.offsetWidth;
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
                modalBackdrop.classList.remove('opacity-0');
                modalBackdrop.classList.add('opacity-100');
                
                // Prevent layout shift
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
                if (floatingWidgets) floatingWidgets.style.marginRight = `${scrollbarWidth}px`;
                document.body.style.overflow = 'hidden';
            } else {
                // Close modal
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-95', 'opacity-0');
                modalBackdrop.classList.remove('opacity-100');
                modalBackdrop.classList.add('opacity-0');
                
                // Restore layout
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                if (navbar) navbar.style.paddingRight = '';
                if (floatingWidgets) floatingWidgets.style.marginRight = '';
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }
    };

    // Close Modal on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('sewa-modal');
            if (modal && !modal.classList.contains('hidden')) {
                window.toggleSewaModal();
            }
        }
    });

    // Auto-clone Marquee Content for Infinite Loop
    const marquee = document.getElementById('client-marquee');
    if (marquee && marquee.children.length === 1) {
        const content = marquee.firstElementChild;
        if (content) {
            marquee.appendChild(content.cloneNode(true));
        }
    }

    // Hero Background Video Rotation (Seamless Dual Video)
    const video1 = document.getElementById('hero-video-1');
    const video2 = document.getElementById('hero-video-2');
    if (video1 && video2) {
        const playlist = [
            '/assets/homepage-vid/tugu-songket.webm',
            '/assets/homepage-vid/pacu-jalur.webm',
            '/assets/homepage-vid/istana-siak.webm',
            '/assets/homepage-vid/sunset.webm'
        ];
        let currentVideoIndex = 0;
        let activeVideo = 1;

        const handleVideoEnd = () => {
            currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
            const nextSrc = playlist[currentVideoIndex];

            if (activeVideo === 1) {
                video2.src = nextSrc;
                video2.load();
                video2.play().then(() => {
                    video1.style.opacity = '0';
                    video2.style.opacity = '0.6';
                    activeVideo = 2;
                }).catch(e => console.log('Auto-play failed:', e));
            } else {
                video1.src = nextSrc;
                video1.load();
                video1.play().then(() => {
                    video2.style.opacity = '0';
                    video1.style.opacity = '0.6';
                    activeVideo = 1;
                }).catch(e => console.log('Auto-play failed:', e));
            }
        };

        video1.addEventListener('ended', () => { if (activeVideo === 1) handleVideoEnd(); });
        video2.addEventListener('ended', () => { if (activeVideo === 2) handleVideoEnd(); });
    }

    // Global Scroll Listener
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

    // Drone Video Hover/Touch Interaction
    const droneWrappers = document.querySelectorAll('.drone-card-wrapper');
    droneWrappers.forEach(wrapper => {
        const vid = wrapper.querySelector('.drone-video');
        if (!vid) return;

        // Pause on initialization
        vid.pause();

        // Disable loop to play once until the end
        vid.loop = false;

        // Play on hover over the card (will play until end)
        wrapper.addEventListener('mouseenter', () => {
            vid.style.opacity = ''; // reset opacity in case interrupted
            if (vid.ended) {
                vid.currentTime = 0;
            }
            vid.play().catch(e => console.log('Play on hover blocked:', e));
        });

        // Play on mobile tap on the card
        wrapper.addEventListener('touchstart', () => {
            vid.style.opacity = ''; // reset opacity in case interrupted
            if (vid.ended) {
                vid.currentTime = 0;
            }
            if (vid.paused) {
                vid.play().catch(e => console.log('Play on tap blocked:', e));
            }
        }, { passive: true });

        // Ensure video is reset to the first frame smoothly when ended
        vid.addEventListener('ended', () => {
            // Apply a guaranteed smooth CSS transition for opacity
            vid.style.transition = 'opacity 0.6s ease-in-out';

            // Fade out the video
            vid.style.opacity = '0';

            // Wait for fade out to complete (600ms)
            setTimeout(() => {
                vid.currentTime = 0;
                vid.pause();

                // Fade back in
                vid.style.opacity = '';

                // Clean up the inline transition style after fade in completes
                setTimeout(() => {
                    vid.style.transition = '';
                }, 600);
            }, 600);
        });
    });
});
