class NetworkBackground {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = 120;
        this.connectionDistance = 150;
        this.mouseInfluenceDistance = 200;
        
        this.colors = {
            pink: 'rgba(255, 121, 198, ',
            purple: 'rgba(189, 147, 249, ',
            cyan: 'rgba(139, 233, 253, '
        };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                colorKey: ['pink', 'purple', 'cyan'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors[particle.colorKey] + '0.6)';
        this.ctx.fill();
    }
    
    drawConnection(p1, p2, distance, isMouseConnection = false) {
        const limit = isMouseConnection ? this.mouseInfluenceDistance : this.connectionDistance;
        const opacity = 1 - (distance / limit);
        const baseOpacity = isMouseConnection ? 0.5 : 0.2;
        
        const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, this.colors[p1.colorKey] + (baseOpacity * opacity) + ')');
        gradient.addColorStop(1, this.colors[p2.colorKey] + (baseOpacity * opacity) + ')');
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = isMouseConnection ? 2 : 0.8;
        
        if (isMouseConnection) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.colors[p1.colorKey] + '0.5)';
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            this.updateParticle(p1);
            this.drawParticle(p1);
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    this.drawConnection(p1, p2, distance);
                }
            }
            
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p1.x - this.mouse.x;
                const dy = p1.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouseInfluenceDistance) {
                    this.drawConnection(
                        p1, 
                        { x: this.mouse.x, y: this.mouse.y, colorKey: p1.colorKey }, 
                        distance, 
                        true
                    );
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class RepoOrbit {
    constructor() {
        this.repoItems = document.querySelectorAll('.repo-item');
        this.setupRepositoryAnimation();
        this.setupPageTransitions();
    }
    
    setupRepositoryAnimation() {
        this.repoItems.forEach((item, index) => {
            const angle = index * (360 / this.repoItems.length);
            item.style.setProperty('--angle', angle);
            
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                if (href && href.startsWith('http')) return; 
                e.preventDefault();
                this.animateTransition(item);
            });
        });
    }
    
    setupPageTransitions() {
        const links = document.querySelectorAll('a:not(.repo-item)');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('http')) {
                    e.preventDefault();
                    document.body.classList.add('fade-out');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                }
            });
        });
    }
    
    animateTransition(item) {
        const box = item.querySelector('.repo-box');
        const url = item.href;
        box.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        box.style.transform = 'scale(2) rotate(720deg)';
        box.style.opacity = '0';
        setTimeout(() => { window.location.href = url; }, 400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NetworkBackground();
    new RepoOrbit();
    
    const contactFlip = document.getElementById('contactFlip');
    if (contactFlip) {
        contactFlip.addEventListener('click', (e) => {
            e.preventDefault();
            contactFlip.classList.toggle('flipped');
        });
    }
    
    const projectsButton = document.getElementById('projectsButton');
    const projectsPopup = document.getElementById('projectsPopup');
    const closePopup = document.getElementById('closePopup');
    
    if (projectsButton && projectsPopup) {
        projectsButton.addEventListener('click', (e) => {
            e.preventDefault();
            projectsPopup.classList.add('active');
        });
    }
    
    if (closePopup && projectsPopup) {
        closePopup.addEventListener('click', () => {
            projectsPopup.classList.remove('active');
        });
        projectsPopup.addEventListener('click', (e) => {
            if (e.target === projectsPopup) projectsPopup.classList.remove('active');
        });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
            document.body.classList.add('fade-in');
        }
    });
});