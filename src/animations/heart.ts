import { config } from '../config';

export class HeartAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: HeartParticle[] = [];
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'heart-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '100';
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

  public async formHeart(): Promise<void> {
    if (config.reducedMotion) {
      return;
    }

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scale = Math.min(this.canvas.width, this.canvas.height) * 0.3;

    // Create heart particles
    this.createHeartParticles(centerX, centerY, scale);
    
    // Animate formation
    await this.animateFormation();
    
    // Pulse
    await this.animatePulse();
    
    // Scatter
    await this.animateScatter();
    
    // Reform
    await this.animateReformation();
  }

  private createHeartParticles(centerX: number, centerY: number, scale: number): void {
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2;
      
      // Heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      const targetX = centerX + x * scale / 20;
      const targetY = centerY + y * scale / 20;

      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        targetX,
        targetY,
        size: 2 + Math.random() * 3,
        opacity: 0,
        color: this.getRandomHeartColor()
      });
    }
  }

  private getRandomHeartColor(): string {
    const colors = [
      'rgba(255, 107, 157, ',  // Pink
      'rgba(255, 60, 100, ',   // Deep pink
      'rgba(255, 150, 180, ',  // Light pink
      'rgba(255, 200, 220, '   // Very light pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private async animateFormation(): Promise<void> {
    return new Promise(resolve => {
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
          particle.x += (particle.targetX - particle.x) * 0.05;
          particle.y += (particle.targetY - particle.y) * 0.05;
          particle.opacity = ease;

          this.drawHeartParticle(particle);
        });

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private async animatePulse(): Promise<void> {
    return new Promise(resolve => {
      const duration = 2000;
      const startTime = performance.now();
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;
        const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.1;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
          this.ctx.save();
          this.ctx.translate(centerX, centerY);
          this.ctx.scale(pulse, pulse);
          this.ctx.translate(-centerX, -centerY);
          
          this.drawHeartParticle(particle);
          
          this.ctx.restore();
        });

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private async animateScatter(): Promise<void> {
    return new Promise(resolve => {
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
          const angle = Math.random() * Math.PI * 2;
          
          particle.x += Math.cos(angle) * 5;
          particle.y += Math.sin(angle) * 5;
          particle.opacity = 1 - progress;

          this.drawHeartParticle(particle);
        });

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private async animateReformation(): Promise<void> {
    // Reset particles to scattered positions
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.particles.forEach(particle => {
      particle.x = centerX + (Math.random() - 0.5) * 300;
      particle.y = centerY + (Math.random() - 0.5) * 300;
      particle.opacity = 0;
    });

    return new Promise(resolve => {
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
          particle.x += (particle.targetX - particle.x) * 0.05;
          particle.y += (particle.targetY - particle.y) * 0.05;
          particle.opacity = ease;

          this.drawHeartParticle(particle);
        });

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          // Fade out slowly
          this.fadeOut().then(resolve);
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private async fadeOut(): Promise<void> {
    return new Promise(resolve => {
      const duration = 3000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
          particle.opacity = 1 - progress;
          this.drawHeartParticle(particle);
        });

        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationId = requestAnimationFrame(animate);
    });
  }

  private drawHeartParticle(particle: HeartParticle): void {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fillStyle = particle.color + particle.opacity + ')';
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
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

interface HeartParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  color: string;
}
