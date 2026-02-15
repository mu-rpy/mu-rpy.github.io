class AboutPageController {
    constructor() {
        this.sections = document.querySelectorAll('.resume-section');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.scrollContainer = document.querySelector('.scroll-container');
        this.currentSection = 0;
        this.isScrolling = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupScrollDetection();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
        this.setupResponsive();
    }
    
    setupNavigation() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.navigateToSection(index);
            });
        });
    }
    
    navigateToSection(index) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const section = this.sections[index];
        
        if (!this.isMobile) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            this.scrollContainer.scrollTop = section.offsetTop;
        }
        
        this.updateActiveNav(index);
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    updateActiveNav(index) {
        this.navDots.forEach(dot => dot.classList.remove('active'));
        if (this.navDots[index]) {
            this.navDots[index].classList.add('active');
        }
        this.currentSection = index;
    }
    
    setupScrollDetection() {
        let scrollTimeout;
        
        this.scrollContainer.addEventListener('scroll', () => {
            if (this.isScrolling) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.detectCurrentSection();
            }, 100);
        });
    }
    
    detectCurrentSection() {
        const scrollPosition = this.scrollContainer.scrollTop + window.innerHeight / 2;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                this.updateActiveNav(index);
            }
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            root: this.scrollContainer,
            threshold: 0.5,
            rootMargin: '-10% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    const cards = entry.target.querySelectorAll(
                        '.experience-card, .education-card, .project-card, .skill-category'
                    );
                    
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px)';
                            setTimeout(() => {
                                card.style.transition = 'all 0.6s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                if (this.currentSection < this.sections.length - 1) {
                    this.navigateToSection(this.currentSection + 1);
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                if (this.currentSection > 0) {
                    this.navigateToSection(this.currentSection - 1);
                }
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.navigateToSection(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.navigateToSection(this.sections.length - 1);
            }
        });
    }
    
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }
}

class SkillInteractions {
    constructor() {
        this.skillTags = document.querySelectorAll('.skill-tag');
        this.init();
    }
    
    init() {
        this.skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', (e) => {
                this.createParticles(e.target);
            });
        });
    }
    
    createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = 'var(--accent-pink)';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = '0 0 10px var(--glow-pink)';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0;
            let y = 0;
            let opacity = 1;
            
            const animate = () => {
                x += vx;
                y += vy;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
}

class ProjectCardInteractions {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createGlowEffect(e.currentTarget);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.updateCardTilt(e, e.currentTarget);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.resetCardTilt(e.currentTarget);
            });
        });
    }
    
    createGlowEffect(card) {
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.style.animation = 'none';
            setTimeout(() => {
                statusBadge.style.animation = 'badgePulse 2s ease-in-out infinite';
            }, 10);
        }
    }
    
    updateCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }
    
    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AboutPageController();
    new SkillInteractions();
    new ProjectCardInteractions();
    
    const sections = document.querySelectorAll('.resume-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        setTimeout(() => {
            section.style.transition = 'opacity 0.8s ease';
            section.style.opacity = '1';
        }, index * 100);
    });
});