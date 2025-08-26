// Animation Controller
class AnimationController {
    constructor() {
        this.observers = [];
        this.counters = [];
        this.skillBars = [];
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupSkillBarAnimations();
        this.setupParallaxEffect();
    }
    
    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('skill-progress')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('[data-aos], .counter, .skill-progress, .reveal');
        animatedElements.forEach(el => observer.observe(el));
        
        this.observers.push(observer);
    }
    
    setupCounterAnimations() {
        // Find all counter elements
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            this.counters.push({
                element: counter,
                target: parseInt(counter.dataset.count),
                current: 0,
                increment: null,
                animated: false
            });
        });
    }
    
    animateCounter(counterElement) {
        const counterData = this.counters.find(c => c.element === counterElement);
        if (!counterData || counterData.animated) return;
        
        counterData.animated = true;
        counterData.increment = counterData.target / 100; // 100 steps
        
        const animate = () => {
            counterData.current += counterData.increment;
            
            if (counterData.current >= counterData.target) {
                counterData.current = counterData.target;
                counterElement.textContent = Math.ceil(counterData.current);
                return;
            }
            
            counterElement.textContent = Math.ceil(counterData.current);
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    setupSkillBarAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            this.skillBars.push({
                element: bar,
                width: bar.dataset.width,
                animated: false
            });
        });
    }
    
    animateSkillBar(barElement) {
        const barData = this.skillBars.find(b => b.element === barElement);
        if (!barData || barData.animated) return;
        
        barData.animated = true;
        
        // Animate width from 0 to target
        setTimeout(() => {
            barElement.style.width = barData.width;
        }, 300);
    }
    
    setupParallaxEffect() {
        // Simple parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const parallaxHandler = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    parallaxHandler();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Smooth Scrolling Handler
class SmoothScrolling {
    constructor() {
        this.setupSmoothScrolling();
        this.setupScrollToTop();
    }
    
    setupSmoothScrolling() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    this.updateActiveNavLink(targetId);
                }
            });
        });
    }
    
    updateActiveNavLink(activeId) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`a[href="${activeId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    setupScrollToTop() {
        // Create scroll to top button
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.className = 'scroll-to-top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(scrollButton);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top functionality
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Loading Screen Controller
class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
    }
    
    createLoadingScreen() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-screen';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-family: var(--font-primary);
        `;
        
        loadingOverlay.innerHTML = `
            <div class="loading-content" style="text-align: center;">
                <div class="loading-logo" style="font-size: 3rem; font-weight: 800; margin-bottom: 2rem; background: linear-gradient(45deg, #ffffff, #f0f8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    SG
                </div>
                <div class="loading-spinner" style="width: 60px; height: 60px; border: 3px solid rgba(255, 255, 255, 0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 2rem;"></div>
                <div class="loading-text" style="font-size: 1.2rem; font-weight: 500; opacity: 0.9;">
                    Loading Portfolio...
                </div>
                <div class="loading-progress" style="width: 200px; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; margin: 1rem auto; overflow: hidden;">
                    <div class="progress-bar" style="width: 0%; height: 100%; background: white; border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
        
        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingOverlay);
        
        // Simulate loading progress
        this.animateProgress(loadingOverlay);
    }
    
    animateProgress(overlay) {
        const progressBar = overlay.querySelector('.progress-bar');
        const loadingText = overlay.querySelector('.loading-text');
        
        const steps = [
            { progress: 20, text: 'Loading assets...' },
            { progress: 40, text: 'Initializing animations...' },
            { progress: 60, text: 'Setting up interactions...' },
            { progress: 80, text: 'Finalizing experience...' },
            { progress: 100, text: 'Ready!' }
        ];
        
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                progressBar.style.width = `${step.progress}%`;
                loadingText.textContent = step.text;
                currentStep++;
                
                setTimeout(updateProgress, 500 + Math.random() * 500);
            } else {
                // Hide loading screen
                setTimeout(() => this.hideLoadingScreen(overlay), 500);
            }
        };
        
        setTimeout(updateProgress, 300);
    }
    
    hideLoadingScreen(overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            overlay.remove();
            // Initialize other animations after loading
            this.initializePageAnimations();
        }, 500);
    }
    
    initializePageAnimations() {
        // Trigger initial animations
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });
        
        // Start constellation animation
        if (window.constellation) {
            window.constellation.animate();
        }
    }
}

// Navbar Scroll Handler
class NavbarController {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollTop = 0;
        this.setupScrollHandler();
        this.setupActiveSection();
    }
    
    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class when scrolling down
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (scrollTop > this.lastScrollTop && scrollTop > 100) {
                // Scrolling down
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.navbar.style.transform = 'translateY(0)';
            }
            
            this.lastScrollTop = scrollTop;
        });
    }
    
    setupActiveSection() {
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
}

// Mobile Navigation Handler
class MobileNavigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.setupMobileNav();
    }
    
    setupMobileNav() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // Close menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }
}

// Page Transition Handler
class PageTransitions {
    constructor() {
        this.setupPageTransitions();
    }
    
    setupPageTransitions() {
        // Add entrance animations to sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.6s ease';
            section.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Trigger animations when page loads
        window.addEventListener('load', () => {
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Skip loading screen for now - initialize directly
    // const loadingScreen = new LoadingScreen();
    
    // Initialize other controllers immediately
    window.animationController = new AnimationController();
    window.smoothScrolling = new SmoothScrolling();
    window.navbarController = new NavbarController();
    window.mobileNavigation = new MobileNavigation();
    // window.pageTransitions = new PageTransitions();
    
    // Initialize AOS animations directly
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom'
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationController,
        SmoothScrolling,
        LoadingScreen,
        NavbarController,
        MobileNavigation,
        PageTransitions
    };
}