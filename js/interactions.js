// Interactive Elements Controller
class InteractionsController {
    constructor() {
        this.setupProjectFiltering();
        this.setupContactForm();
        this.setupModalHandlers();
        this.setupHoverEffects();
        this.setupThemeToggle();
        this.setupEasterEggs();
    }
    
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterButtons.length === 0 || projectCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        
                        // Animate in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission(contactForm);
        });
        
        // Setup form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    async handleContactSubmission(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const formData = new FormData(form);
        
        // Get form values
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!this.validateForm(data)) {
            this.showFormError('Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Sending...
            </div>
        `;
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.submitContactForm(data);
            
            // Show success message
            this.showFormSuccess('Thank you! Your message has been sent successfully.');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async submitContactForm(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, you would send this to your backend
        console.log('Form submission:', data);
        
        // For demo purposes, we'll just resolve successfully
        return Promise.resolve();
    }
    
    validateForm(data) {
        return data.name && data.email && data.subject && data.message && 
               this.isValidEmail(data.email);
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.style.borderColor = '#e53e3e';
        field.parentElement.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFormSuccess(message) {
        this.showFormMessage(message, 'success');
    }
    
    showFormError(message) {
        this.showFormMessage(message, 'error');
    }
    
    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        const bgColor = type === 'success' ? '#f0fff4' : '#fed7d7';
        const textColor = type === 'success' ? '#22543d' : '#742a2a';
        const borderColor = type === 'success' ? '#9ae6b4' : '#fc8181';
        
        messageDiv.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideDown 0.3s ease;
        `;
        
        const contactForm = document.getElementById('contact-form');
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }
    
    setupModalHandlers() {
        // Generic modal handlers
        document.addEventListener('click', (e) => {
            // Close modals when clicking backdrop
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
                setTimeout(() => {
                    e.target.style.display = 'none';
                }, 300);
            }
            
            // Close button handlers
            if (e.target.classList.contains('close') || e.target.closest('.close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    openModal.classList.remove('show');
                    setTimeout(() => {
                        openModal.style.display = 'none';
                    }, 300);
                }
            }
        });
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.btn, .project-card, .skill-category, .achievement-card, .blog-card, .tool-card'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-5px)';
                element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });
        });
        
        // Magnetic effect for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        
        themeToggle.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-backdrop);
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        `;
        
        document.body.appendChild(themeToggle);
        
        // Theme toggle functionality
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeToggle.innerHTML = newTheme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        });
    }
    
    setupEasterEggs() {
        // Konami code easter egg
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let userInput = [];
        
        document.addEventListener('keydown', (e) => {
            userInput.push(e.code);
            userInput = userInput.slice(-konamiCode.length);
            
            if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
                this.activateEasterEgg();
            }
        });
        
        // Double-click on logo easter egg
        const logo = document.querySelector('.logo-text');
        if (logo) {
            let clickCount = 0;
            logo.addEventListener('click', () => {
                clickCount++;
                setTimeout(() => { clickCount = 0; }, 500);
                
                if (clickCount === 3) {
                    this.showSecretMessage();
                }
            });
        }
    }
    
    activateEasterEgg() {
        // Create party mode effect
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Show celebration message
        const message = document.createElement('div');
        message.textContent = '🎉 You found the Konami Code! Party mode activated! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            animation: bounce 0.5s ease-in-out;
        `;
        
        document.body.appendChild(message);
        
        // Remove effects after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            message.remove();
            style.remove();
        }, 5000);
    }
    
    showSecretMessage() {
        const messages = [
            "Hi there! You're quite the explorer! 👋",
            "Thanks for checking out my portfolio so thoroughly! 🕵️‍♂️",
            "I appreciate your attention to detail! 🔍",
            "Hope you're enjoying the interactive elements! ✨"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const toast = document.createElement('div');
        toast.textContent = randomMessage;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Project Advisor Modal Handler
function openAdvisorModal() {
    const modal = document.getElementById('advisor-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeAdvisorModal() {
    const modal = document.getElementById('advisor-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function getProjectAdvice() {
    const projectType = document.getElementById('project-type').value;
    const projectDescription = document.getElementById('project-description').value;
    
    if (!projectDescription.trim()) {
        alert('Please describe your project idea first!');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.advisor-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Analyzing your project...
        </div>
    `;
    
    // Simulate AI analysis
    setTimeout(() => {
        const advice = generateProjectAdvice(projectType, projectDescription);
        displayAdvice(advice);
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;
    }, 2000 + Math.random() * 2000);
}

function generateProjectAdvice(type, description) {
    const adviceTemplates = {
        'machine-learning': {
            intro: "Great choice! Machine learning projects can be incredibly rewarding. Based on your description, here's my advice:",
            recommendations: [
                "Start with a clear problem definition and success metrics",
                "Ensure you have quality, labeled data for training",
                "Consider using established frameworks like scikit-learn or TensorFlow",
                "Plan for model validation and testing from the beginning",
                "Think about deployment and scalability early in the process"
            ],
            technologies: ["Python", "Pandas", "scikit-learn", "TensorFlow/PyTorch", "Jupyter Notebooks"],
            resources: [
                "Kaggle for datasets and competitions",
                "Papers With Code for latest research",
                "Google Colab for free GPU access",
                "MLflow for experiment tracking"
            ]
        },
        'web-development': {
            intro: "Web development offers endless possibilities! Here's how I'd approach your project:",
            recommendations: [
                "Define your target users and their needs clearly",
                "Choose a tech stack that matches your project complexity",
                "Focus on responsive design and accessibility",
                "Implement proper security measures from the start",
                "Plan for performance optimization and SEO"
            ],
            technologies: ["React/Vue.js", "Node.js", "TypeScript", "CSS frameworks", "Database (SQL/NoSQL)"],
            resources: [
                "MDN Web Docs for reference",
                "Can I Use for browser compatibility",
                "Lighthouse for performance auditing",
                "GitHub Pages/Vercel for deployment"
            ]
        }
        // Add more templates for other project types
    };
    
    const template = adviceTemplates[type] || adviceTemplates['machine-learning'];
    
    return `
${template.intro}

**Key Recommendations:**
${template.recommendations.map(rec => `• ${rec}`).join('\n')}

**Recommended Technologies:**
${template.technologies.join(' • ')}

**Helpful Resources:**
${template.resources.map(resource => `• ${resource}`).join('\n')}

**Next Steps:**
1. Create a detailed project plan with milestones
2. Set up your development environment
3. Start with a minimal viable product (MVP)
4. Iterate based on testing and feedback
5. Document your process and learnings

**From my experience:** The key to successful projects is starting small, staying focused on user needs, and maintaining consistent progress. Don't hesitate to reach out to the community for help when you get stuck!

Good luck with your project! 🚀
    `;
}

function displayAdvice(advice) {
    const output = document.getElementById('advisor-output');
    const content = document.getElementById('advice-content');
    
    content.innerHTML = advice.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.interactionsController = new InteractionsController();
});

// Add some CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
    }
`;
document.head.appendChild(additionalStyles);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionsController;
}