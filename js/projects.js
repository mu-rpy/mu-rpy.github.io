class ProjectsController {
    constructor() {
        this.cards = document.querySelectorAll('.project-card:not(.coming-soon)');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.init();
    }
    init() {
        this.setupCardFlips();
        this.setupFilters();
        this.addCardAnimations();
        this.setupParticleEffects();
    }
    setupCardFlips() {
        this.cards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            const closeBtn = card.querySelector('.close-card');
            cardFront.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    this.flipCard(card);
                }
            });
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.unflipCard(card);
                });
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.project-card')) {
                this.unflipAllCards();
            }
        });
    }
    flipCard(card) {
        this.unflipAllCards();
        card.classList.add('flipped');
        this.playFlipSound();
    }
    unflipCard(card) {
        card.classList.remove('flipped');
    }
    unflipAllCards() {
        this.cards.forEach(card => {
            card.classList.remove('flipped');
        });
    }
    playFlipSound() {
        const audioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) return;
        const ctx = new audioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
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
        this.cards.forEach(card => {
            observer.observe(card);
        });
    }
    setupParticleEffects() {
        this.cards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
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
            'rgba(255, 121, 198, 0.8)',
            'rgba(189, 147, 249, 0.8)',
            'rgba(139, 233, 253, 0.8)',
            'rgba(80, 250, 123, 0.8)',
            'rgba(241, 250, 140, 0.8)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
class KeyboardNavigation {
    constructor() {
        this.cards = Array.from(document.querySelectorAll('.project-card:not(.coming-soon)'));
        this.currentIndex = -1;
        this.init();
    }
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigatePrevious();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleCurrentCard();
            } else if (e.key === 'Escape') {
                this.closeAllCards();
            }
        });
    }
    navigateNext() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.focusCard(this.currentIndex);
    }
    navigatePrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.focusCard(this.currentIndex);
    }
    focusCard(index) {
        const card = this.cards[index];
        if (!card) return;
        this.cards.forEach(c => c.style.outline = 'none');
        card.style.outline = '3px solid rgba(139, 233, 253, 0.6)';
        card.style.outlineOffset = '5px';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    toggleCurrentCard() {
        const card = this.cards[this.currentIndex];
        if (!card) return;
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
        } else {
            this.closeAllCards();
            card.classList.add('flipped');
        }
    }
    closeAllCards() {
        this.cards.forEach(card => card.classList.remove('flipped'));
        this.cards.forEach(c => c.style.outline = 'none');
        this.currentIndex = -1;
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
                if (card.classList.contains('flipped')) return;
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
                            rgba(255, 121, 198, 0.3), 
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
    new KeyboardNavigation();
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