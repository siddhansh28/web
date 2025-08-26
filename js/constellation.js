// Constellation Canvas Animation
class ConstellationCanvas {
    constructor() {
        this.canvas = document.getElementById('constellation-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.isMouseActive = false;
        
        // Configuration
        this.config = {
            particleCount: 120,
            maxDistance: 120,
            particleSpeed: 0.5,
            particleSize: { min: 1, max: 3 },
            connectionOpacity: 0.3,
            particleOpacity: 0.6,
            mouseRadius: 150,
            colors: {
                particles: ['#3b82f6', '#2563eb', '#60a5fa', '#ffffff'],
                connections: '#ffffff'
            }
        };
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                color: this.config.colors.particles[Math.floor(Math.random() * this.config.colors.particles.length)],
                opacity: Math.random() * this.config.particleOpacity + 0.2,
                originalOpacity: Math.random() * this.config.particleOpacity + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01
            };
            
            this.particles.push(particle);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isMouseActive = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseActive = false;
        });
        
        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.isMouseActive = true;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.isMouseActive = false;
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Mouse interaction
            if (this.isMouseActive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const attraction = force * 0.03;
                    
                    particle.vx += dx * attraction * 0.1;
                    particle.vy += dy * attraction * 0.1;
                    
                    // Increase opacity near mouse
                    particle.opacity = Math.min(1, particle.originalOpacity + force * 0.5);
                } else {
                    // Reset opacity when not near mouse
                    particle.opacity = particle.originalOpacity;
                }
            } else {
                particle.opacity = particle.originalOpacity;
            }
            
            // Add subtle velocity damping
            particle.vx *= 0.999;
            particle.vy *= 0.999;
            
            // Twinkling effect
            particle.opacity += Math.sin(Date.now() * particle.twinkleSpeed + index) * 0.1;
            particle.opacity = Math.max(0.1, Math.min(1, particle.opacity));
        });
    }
    
    findConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;
                    
                    this.connections.push({
                        particle1,
                        particle2,
                        distance,
                        opacity: opacity * Math.min(particle1.opacity, particle2.opacity)
                    });
                }
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Create gradient for particle
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, this.hexToRgba(particle.color, particle.opacity));
            gradient.addColorStop(1, this.hexToRgba(particle.color, 0));
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 2;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.connections.forEach(connection => {
            if (connection.opacity > 0.01) {
                this.ctx.save();
                
                // Create gradient line
                const gradient = this.ctx.createLinearGradient(
                    connection.particle1.x, connection.particle1.y,
                    connection.particle2.x, connection.particle2.y
                );
                
                gradient.addColorStop(0, this.hexToRgba(connection.particle1.color, connection.opacity));
                gradient.addColorStop(0.5, this.hexToRgba(this.config.colors.connections, connection.opacity * 0.5));
                gradient.addColorStop(1, this.hexToRgba(connection.particle2.color, connection.opacity));
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(connection.particle1.x, connection.particle1.y);
                this.ctx.lineTo(connection.particle2.x, connection.particle2.y);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        });
    }
    
    drawMouseConnections() {
        if (!this.isMouseActive) return;
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const opacity = (1 - distance / this.config.mouseRadius) * 0.4;
                
                this.ctx.save();
                this.ctx.strokeStyle = this.hexToRgba('#ffffff', opacity);
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        });
    }
    
    hexToRgba(hex, alpha) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgba(255, 255, 255, ${alpha})`;
    }
    
    animate() {
        // Clear canvas with a slight trail effect for smoothness
        this.ctx.fillStyle = 'rgba(102, 126, 234, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.findConnections();
        this.drawConnections();
        this.drawMouseConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for external control
    setParticleCount(count) {
        this.config.particleCount = count;
        this.createParticles();
    }
    
    setMouseRadius(radius) {
        this.config.mouseRadius = radius;
    }
    
    setConnectionDistance(distance) {
        this.config.maxDistance = distance;
    }
}

// Initialize constellation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page that should have the constellation
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        window.constellation = new ConstellationCanvas();
        
        // Performance optimization for mobile devices
        if (window.innerWidth < 768) {
            window.constellation.setParticleCount(60);
            window.constellation.setMouseRadius(100);
        }
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Optionally pause animation
            } else {
                // Resume animation
            }
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConstellationCanvas;
}