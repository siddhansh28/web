// Main Application Controller
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.settings = {
            animations: true,
            sound: false,
            particles: true,
            theme: 'auto'
        };
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Siddhansh Govind Portfolio...');
            
            // Load settings from localStorage
            this.loadSettings();
            
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Initialize analytics (privacy-friendly)
            this.initializeAnalytics();
            
            this.isInitialized = true;
            console.log('✅ Portfolio initialization complete!');
            
            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('portfolioReady', {
                detail: { app: this }
            }));
            
        } catch (error) {
            console.error('❌ Error initializing portfolio:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeModules() {
        // Initialize modules in order of dependency
        const modules = [
            'constellation',
            'animations',
            'interactions',
            'aiChat',
            'munGenerator'
        ];
        
        for (const module of modules) {
            try {
                await this.initializeModule(module);
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${module}:`, error);
            }
        }
    }
    
    async initializeModule(moduleName) {
        console.log(`📦 Loading ${moduleName} module...`);
        
        switch (moduleName) {
            case 'constellation':
                if (this.settings.particles && window.ConstellationCanvas) {
                    this.modules.constellation = new ConstellationCanvas();
                }
                break;
                
            case 'animations':
                if (this.settings.animations) {
                    // Modules are already initialized by their respective files
                    this.modules.animations = true;
                }
                break;
                
            case 'interactions':
                this.modules.interactions = true;
                break;
                
            case 'aiChat':
                if (window.siddhansChatsAI) {
                    this.modules.aiChat = window.siddhansChatsAI;
                }
                break;
                
            case 'munGenerator':
                if (window.munGenerator) {
                    this.modules.munGenerator = window.munGenerator;
                }
                break;
        }
    }
    
    setupGlobalEvents() {
        // Global error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        
        // Page visibility changes
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Network status
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Custom portfolio events
        document.addEventListener('portfolioAction', this.handlePortfolioAction.bind(this));
    }
    
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Page Performance:', {
                        loadTime: `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`,
                        domContentLoaded: `${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`,
                        firstPaint: this.getFirstPaint()
                    });
                }
            }, 0);
        });
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('⚠️ Long task detected:', entry);
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Performance observer not supported');
            }
        }
        
        // Memory usage monitoring (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000);
        }
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? `${Math.round(firstPaint.startTime)}ms` : 'N/A';
    }
    
    setupAccessibility() {
        // Skip to content link
        this.createSkipToContentLink();
        
        // Focus management for modals
        this.setupFocusManagement();
        
        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.settings.animations = false;
            document.documentElement.classList.add('reduced-motion');
        }
        
        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Keyboard navigation indicators
        this.setupKeyboardNavigation();
    }
    
    createSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-to-content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupFocusManagement() {
        let lastFocusedElement = null;
        
        // Store last focused element before opening modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="Modal"]')) {
                lastFocusedElement = e.target;
            }
        });
        
        // Restore focus when modal closes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = mutation.target;
                    if (element.classList.contains('modal') && 
                        element.style.display === 'none' && 
                        lastFocusedElement) {
                        lastFocusedElement.focus();
                        lastFocusedElement = null;
                    }
                }
            });
        });
        
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            observer.observe(modal, { attributes: true });
        });
    }
    
    setupKeyboardNavigation() {
        // Add focus indicators for keyboard users
        let isKeyboardUser = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                isKeyboardUser = true;
                document.body.classList.add('keyboard-user');
            }
        });
        
        document.addEventListener('mousedown', () => {
            isKeyboardUser = false;
            document.body.classList.remove('keyboard-user');
        });
        
        // Add CSS for keyboard focus indicators
        const focusStyles = document.createElement('style');
        focusStyles.textContent = `
            .keyboard-user *:focus {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-user .skip-to-content:focus {
                outline: none !important;
            }
        `;
        document.head.appendChild(focusStyles);
    }
    
    initializeAnalytics() {
        // Privacy-friendly analytics - only track page views and interactions
        if (!localStorage.getItem('analytics_disabled')) {
            this.trackEvent('page_view', {
                page: window.location.pathname,
                referrer: document.referrer || 'direct',
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                language: navigator.language
            });
        }
    }
    
    trackEvent(eventName, data = {}) {
        // Simple client-side analytics (replace with your analytics service)
        console.log('📈 Analytics Event:', eventName, data);
        
        // Store events in localStorage for privacy-friendly tracking
        const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
        events.push({
            event: eventName,
            data: data,
            timestamp: Date.now()
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('portfolio_events', JSON.stringify(events));
    }
    
    handleGlobalError(event) {
        console.error('🚨 Global error:', event.error);
        
        this.trackEvent('error', {
            message: event.error?.message || 'Unknown error',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
        
        // Show user-friendly error message
        this.showErrorNotification('Something went wrong. Please refresh the page if the issue persists.');
    }
    
    handleUnhandledRejection(event) {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        
        this.trackEvent('unhandled_rejection', {
            reason: event.reason?.message || 'Unknown rejection'
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause heavy animations
            this.pauseAnimations();
            this.trackEvent('page_hidden');
        } else {
            // Page is visible - resume animations
            this.resumeAnimations();
            this.trackEvent('page_visible');
        }
    }
    
    handleNetworkChange(isOnline) {
        const status = isOnline ? 'online' : 'offline';
        console.log(`🌐 Network status: ${status}`);
        
        this.trackEvent('network_change', { status });
        
        // Show notification for offline status
        if (!isOnline) {
            this.showErrorNotification('You appear to be offline. Some features may not work properly.');
        }
    }
    
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K to open search (if implemented)
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            // Open search functionality
            console.log('Search shortcut activated');
        }
        
        // Ctrl/Cmd + / to show help
        if ((event.ctrlKey || event.metaKey) && event.key === '/') {
            event.preventDefault();
            this.showKeyboardShortcuts();
        }
        
        // Escape to close any open modals
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                openModal.classList.remove('show');
                setTimeout(() => openModal.style.display = 'none', 300);
            }
        }
    }
    
    handlePortfolioAction(event) {
        const { action, data } = event.detail;
        
        this.trackEvent('portfolio_action', { action, data });
        
        switch (action) {
            case 'project_filter':
                console.log('Project filtered:', data.filter);
                break;
            case 'contact_submit':
                console.log('Contact form submitted');
                break;
            case 'modal_open':
                console.log('Modal opened:', data.modal);
                break;
        }
    }
    
    pauseAnimations() {
        if (this.modules.constellation && typeof this.modules.constellation.pause === 'function') {
            this.modules.constellation.pause();
        }
        
        // Pause CSS animations
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }
    
    resumeAnimations() {
        if (this.modules.constellation && typeof this.modules.constellation.resume === 'function') {
            this.modules.constellation.resume();
        }
        
        // Resume CSS animations
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }
    
    showErrorNotification(message) {
        // Remove existing error notifications
        const existingNotification = document.querySelector('.error-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="close-notification" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fed7d7;
            color: #742a2a;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #fc8181;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Close button functionality
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 8000);
    }
    
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl/Cmd + K', action: 'Open search' },
            { key: 'Ctrl/Cmd + /', action: 'Show keyboard shortcuts' },
            { key: 'Escape', action: 'Close modal or menu' },
            { key: 'Tab', action: 'Navigate through elements' },
            { key: 'Enter', action: 'Activate button or link' },
            { key: 'Space', action: 'Scroll page or activate button' }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    ${shortcuts.map(shortcut => `
                        <div class="shortcut-item">
                            <kbd>${shortcut.key}</kbd>
                            <span>${shortcut.action}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="close-shortcuts">Close</button>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(modal);
        
        // Close functionality
        modal.querySelector('.close-shortcuts').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    loadSettings() {
        const saved = localStorage.getItem('portfolio_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('portfolio_settings', JSON.stringify(this.settings));
    }
    
    handleInitializationError(error) {
        // Fallback initialization for critical failures
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
                <h1 style="color: #e53e3e; margin-bottom: 1rem;">
                    🚨 Portfolio Loading Error
                </h1>
                <p style="color: #666; margin-bottom: 2rem; max-width: 500px;">
                    There was an error loading the portfolio. This might be due to an unsupported browser or network issue.
                </p>
                <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                    Retry Loading
                </button>
            </div>
        `;
    }
    
    // Public API methods
    getModule(name) {
        return this.modules[name];
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    getAnalytics() {
        return JSON.parse(localStorage.getItem('portfolio_events') || '[]');
    }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .shortcuts-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
    }
    
    .shortcuts-list {
        margin: 1.5rem 0;
    }
    
    .shortcut-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .shortcut-item kbd {
        background: #f7f7f7;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875rem;
        border: 1px solid #ddd;
    }
    
    .close-shortcuts {
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        font-size: 1rem;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the portfolio app
window.portfolioApp = new PortfolioApp();

// Global utility functions
window.dispatchPortfolioAction = function(action, data = {}) {
    document.dispatchEvent(new CustomEvent('portfolioAction', {
        detail: { action, data }
    }));
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}