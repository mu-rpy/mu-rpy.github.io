class ProjectsController {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.init();
    }
    init() {
        this.setupFilters();
        this.addCardAnimations();
        this.setupParticleEffects();
    }
    setupFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.applyFilter(filter);
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = filter;
            });
        });
    }
    applyFilter(filter) {
        const allCards = document.querySelectorAll('.project-card');
        allCards.forEach((card, index) => {
            const categories = card.dataset.category || '';
            const isComingSoon = card.classList.contains('coming-soon');
            if (isComingSoon) {
                card.style.display = 'block';
                return;
            }
            const shouldShow = filter === 'all' || categories.includes(filter);
            if (shouldShow) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                setTimeout(() => {
                    card.style.display = 'block';
                }, index * 50);
            } else {
                card.classList.remove('filtered-in');
                card.classList.add('filtered-out');
                setTimeout(() => {
                    if (card.classList.contains('filtered-out')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
    addCardAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px) scale(0.95)';
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }
    setupParticleEffects() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            if (!cardFront) return;
            cardFront.addEventListener('mouseenter', (e) => {
                this.createHoverParticles(cardFront);
            });
        });
    }
    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;
            particle.style.cssText = `
                position: fixed;
                left: ${startX}px;
                top: ${startY}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${this.getRandomColor()};
                box-shadow: 0 0 ${size * 3}px currentColor;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(particle);
            this.animateParticle(particle, startX, startY);
        }
    }
    animateParticle(particle, startX, startY) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        let x = 0;
        let y = 0;
        let opacity = 1;
        let life = 0;
        const maxLife = 60;
        const animate = () => {
            life++;
            x += vx;
            y += vy - (life * 0.1);
            opacity = 1 - (life / maxLife);
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            if (life < maxLife) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        requestAnimationFrame(animate);
    }
    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.8)',
            'rgba(206, 200, 200, 0.8)',
            'rgba(255, 255, 255, 0.8)',
            'rgba(219, 219, 219, 0.8)',
            'rgba(177, 177, 177, 0.8)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
class CardTiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    init() {
        this.cards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            if (!cardFront) return;
            cardFront.addEventListener('mousemove', (e) => {
                const rect = cardFront.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                cardFront.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale3d(1.02, 1.02, 1.02)
                `;
            });
            cardFront.addEventListener('mouseleave', () => {
                cardFront.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
}
class GlowTrailEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    init() {
        this.cards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            if (!cardFront) return;
            cardFront.addEventListener('mousemove', (e) => {
                const rect = cardFront.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                const glow = card.querySelector('.card-glow');
                if (glow) {
                    glow.style.background = `
                        radial-gradient(
                            circle at ${x}% ${y}%, 
                            rgba(255, 255, 255, 0.3), 
                            transparent 50%
                        )
                    `;
                }
            });
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsController();
    new CardTiltEffect();
    new GlowTrailEffect();
    const elements = document.querySelectorAll('.projects-header, .filter-container, .projects-grid, .navigation-footer');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease';
            el.style.opacity = '1';
        }, index * 200);
    });
});
document.addEventListener('visibilitychange', () => {
    const cards = document.querySelectorAll('.project-card');
    if (document.hidden) {
        cards.forEach(card => {
            card.style.animationPlayState = 'paused';
        });
    } else {
        cards.forEach(card => {
            card.style.animationPlayState = 'running';
        });
    }
});