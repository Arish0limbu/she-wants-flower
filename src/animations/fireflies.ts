import { config } from '../config';

export class FireflySystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fireflies: Firefly[] = [];
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fireflies-canvas';
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

    this.createFireflies();
    this.animate();
  }

  private createFireflies(): void {
    const count = config.maxFireflies;
    
    for (let i = 0; i < count; i++) {
      this.fireflies.push(this.createFirefly());
    }
  }

  private createFirefly(): Firefly {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0,
      targetOpacity: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.02 + Math.random() * 0.03
    };
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.fireflies.forEach(firefly => {
      // Update position
      firefly.x += firefly.speedX;
      firefly.y += firefly.speedY;

      // Random direction changes
      if (Math.random() < 0.02) {
        firefly.speedX = (Math.random() - 0.5) * 0.5;
        firefly.speedY = (Math.random() - 0.5) * 0.5;
      }

      // Wrap around screen
      if (firefly.x < 0) firefly.x = this.canvas.width;
      if (firefly.x > this.canvas.width) firefly.x = 0;
      if (firefly.y < 0) firefly.y = this.canvas.height;
      if (firefly.y > this.canvas.height) firefly.y = 0;

      // Update opacity for twinkling effect
      firefly.phase += firefly.phaseSpeed;
      firefly.opacity = firefly.targetOpacity * (0.5 + 0.5 * Math.sin(firefly.phase));

      // Draw firefly
      this.drawFirefly(firefly);
    });

    this.animationId = requestAnimationFrame(this.animate);
  }

  private drawFirefly(firefly: Firefly): void {
    this.ctx.save();
    this.ctx.globalAlpha = firefly.opacity;
    
    // Glow effect
    const gradient = this.ctx.createRadialGradient(
      firefly.x, firefly.y, 0,
      firefly.x, firefly.y, firefly.size * 3
    );
    gradient.addColorStop(0, 'rgba(255, 217, 61, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 217, 61, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 217, 61, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(firefly.x, firefly.y, firefly.size * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Core
    this.ctx.fillStyle = 'rgba(255, 255, 200, 0.9)';
    this.ctx.beginPath();
    this.ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  public respondToTouch(x: number, y: number): void {
    if (config.reducedMotion) {
      return;
    }

    // Make nearby fireflies move toward touch
    this.fireflies.forEach(firefly => {
      const dx = x - firefly.x;
      const dy = y - firefly.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        firefly.speedX += dx * 0.001;
        firefly.speedY += dy * 0.001;
        firefly.targetOpacity = 1;
      }
    });
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

interface Firefly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  targetOpacity: number;
  phase: number;
  phaseSpeed: number;
}
