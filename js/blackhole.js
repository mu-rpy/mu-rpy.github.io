// Black Hole Mouse Interaction & Dynamic Effects
class BlackHoleInteraction {
    constructor() {
        this.blackhole = document.getElementById('blackholeContainer');
        this.centerContainer = document.querySelector('.center-container');
        this.eventHorizon = document.querySelector('.event-horizon');
        this.singularity = document.querySelector('.singularity');
        this.gravitationalLens = document.querySelector('.gravitational-lens');
        
        if (!this.blackhole) return;
        
        this.blackholeRect = null;
        this.blackholeCenter = { x: 0, y: 0 };
        this.maxDistance = 300; // Maximum distance for interaction
        this.isInteracting = false;
        
        this.init();
    }
    
    init() {
        this.updateBlackholePosition();
        this.setupMouseTracking();
        this.setupResizeHandler();
        this.createDynamicParticles();
    }
    
    updateBlackholePosition() {
        if (!this.centerContainer) return;
        
        const rect = this.centerContainer.getBoundingClientRect();
        this.blackholeRect = rect;
        this.blackholeCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }
    
    setupMouseTracking() {
        let rafId = null;
        
        document.addEventListener('mousemove', (e) => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            
            rafId = requestAnimationFrame(() => {
                this.handleMouseMove(e);
            });
        });
        
        document.addEventListener('mouseleave', () => {
            this.resetInteraction();
        });
    }
    
    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const dx = mouseX - this.blackholeCenter.x;
        const dy = mouseY - this.blackholeCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.maxDistance) {
            this.activateInteraction(distance, dx, dy);
        } else {
            this.deactivateInteraction();
        }
    }
    
    activateInteraction(distance, dx, dy) {
        if (!this.isInteracting) {
            this.blackhole.classList.add('interactive');
            this.isInteracting = true;
        }
        
        // Calculate interaction strength (1 = close, 0 = far)
        const strength = 1 - (distance / this.maxDistance);
        
        // Apply gravitational pull effect to event horizon
        if (this.eventHorizon) {
            const angle = Math.atan2(dy, dx);
            const pullX = Math.cos(angle) * strength * 5;
            const pullY = Math.sin(angle) * strength * 5;
            
            this.eventHorizon.style.transform = `translate(calc(-50% + ${pullX}px), calc(-50% + ${pullY}px)) scale(${1 + strength * 0.1})`;
        }
        
        // Apply subtle rotation to singularity
        if (this.singularity) {
            const rotation = strength * 360;
            this.singularity.style.transform = `translate(-50%, -50%) scale(${1 + strength * 0.05}) rotate(${rotation}deg)`;
        }
        
        // Distort gravitational lens
        if (this.gravitationalLens) {
            this.gravitationalLens.style.transform = `translate(-50%, -50%) scale(${1 + strength * 0.15}) rotate(${strength * 180}deg)`;
        }
    }
    
    deactivateInteraction() {
        if (this.isInteracting) {
            this.blackhole.classList.remove('interactive');
            this.isInteracting = false;
            this.resetInteraction();
        }
    }
    
    resetInteraction() {
        if (this.eventHorizon) {
            this.eventHorizon.style.transform = 'translate(-50%, -50%)';
        }
        if (this.singularity) {
            this.singularity.style.transform = 'translate(-50%, -50%)';
        }
        if (this.gravitationalLens) {
            this.gravitationalLens.style.transform = 'translate(-50%, -50%)';
        }
    }
    
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateBlackholePosition();
            }, 250);
        });
    }
    
    createDynamicParticles() {
        // Create additional floating particles around the black hole
        const particleContainer = document.createElement('div');
        particleContainer.className = 'dynamic-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 400px;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.blackhole.appendChild(particleContainer);
        
        // Create 12 orbiting particles
        for (let i = 0; i < 12; i++) {
            this.createOrbitingParticle(particleContainer, i);
        }
    }
    
    createOrbitingParticle(container, index) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 2;
        const orbitRadius = 150 + Math.random() * 50;
        const duration = 15 + Math.random() * 10;
        const delay = (index / 12) * duration;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 121, 198, ${0.6 + Math.random() * 0.4});
            box-shadow: 0 0 ${size * 3}px rgba(255, 121, 198, 0.8);
            top: 50%;
            left: 50%;
            animation: particleOrbit${index} ${duration}s linear infinite;
            animation-delay: -${delay}s;
        `;
        
        container.appendChild(particle);
        
        // Create unique keyframe for each particle
        const keyframes = `
            @keyframes particleOrbit${index} {
                from {
                    transform: translate(-50%, -50%) 
                               rotate(0deg) 
                               translateX(${orbitRadius}px) 
                               rotate(0deg);
                }
                to {
                    transform: translate(-50%, -50%) 
                               rotate(360deg) 
                               translateX(${orbitRadius}px) 
                               rotate(-360deg);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
}

// Energy Wave Effect
class EnergyWaveEffect {
    constructor() {
        this.blackhole = document.getElementById('blackholeContainer');
        if (!this.blackhole) return;
        
        this.createWaves();
    }
    
    createWaves() {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'energy-waves';
        waveContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            pointer-events: none;
            z-index: 2;
        `;
        
        this.blackhole.appendChild(waveContainer);
        
        // Create 3 expanding wave rings
        for (let i = 0; i < 3; i++) {
            this.createWaveRing(waveContainer, i);
        }
    }
    
    createWaveRing(container, index) {
        const wave = document.createElement('div');
        const delay = index * 2;
        
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(255, 121, 198, 0.6);
            animation: energyWave 6s ease-out infinite;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(wave);
    }
}

// Add energy wave animation
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes energyWave {
        0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(waveStyle);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BlackHoleInteraction();
    new EnergyWaveEffect();
    
    // Add subtle background distortion effect
    const networkCanvas = document.getElementById('networkCanvas');
    if (networkCanvas) {
        const addCanvasDistortion = () => {
            networkCanvas.style.filter = 'contrast(1.05) brightness(0.98)';
        };
        setTimeout(addCanvasDistortion, 1000);
    }
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const blackhole = document.getElementById('blackholeContainer');
    if (!blackhole) return;
    
    if (document.hidden) {
        blackhole.style.animationPlayState = 'paused';
        blackhole.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        blackhole.style.animationPlayState = 'running';
        blackhole.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});