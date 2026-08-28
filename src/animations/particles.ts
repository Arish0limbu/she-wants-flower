import { config } from '../config';

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particles-canvas';
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = ctx;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public start(): void {
    if (config.reducedMotion) {
      return;
    }

    this.createParticles();
    this.animate();
  }

  private createParticles(): void {
    const count = config.maxParticles;
    
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: 0.3 + Math.random() * 0.5,
      color: this.getRandomParticleColor()
    };
  }

  private getRandomParticleColor(): string {
    const colors = [
      'rgba(255, 217, 61, ',  // Gold
      'rgba(255, 107, 157, ',  // Pink
      'rgba(255, 255, 255, '   // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around screen
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.drawParticle(particle);
    });

    this.animationId = requestAnimationFrame(this.animate);
  }

  private drawParticle(particle: Particle): void {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fillStyle = particle.color + particle.opacity + ')';
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  public createBurst(x: number, y: number): void {
    if (config.reducedMotion) {
      return;
    }

    const burstCount = 15;
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      
      const particle = {
        x,
        y,
        size: 2 + Math.random() * 3,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        opacity: 1,
        color: this.getRandomParticleColor(),
        life: 1
      };

      this.animateBurstParticle(particle);
    }
  }

  private animateBurstParticle(particle: any): void {
    const animate = () => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.speedX *= 0.95;
      particle.speedY *= 0.95;
      particle.life -= 0.02;
      particle.opacity = particle.life;

      if (particle.life > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color + particle.opacity + ')';
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  public stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public destroy(): void {
    this.stop();
    this.canvas.remove();
  }
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}
