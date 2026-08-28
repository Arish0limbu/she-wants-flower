import { config } from '../config';

export class PetalSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private petals: Petal[] = [];
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'petals-canvas';
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

    this.createPetals();
    this.animate();
  }

  private createPetals(): void {
    const count = config.maxPetals;
    
    for (let i = 0; i < count; i++) {
      this.petals.push(this.createPetal());
    }
  }

  private createPetal(): Petal {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height - this.canvas.height,
      size: 5 + Math.random() * 10,
      speedY: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.5,
      color: this.getRandomPetalColor()
    };
  }

  private getRandomPetalColor(): string {
    const colors = [
      'rgba(255, 107, 157, ',  // Pink
      'rgba(255, 183, 178, ',  // Light pink
      'rgba(255, 217, 61, ',   // Yellow
      'rgba(255, 255, 255, '   // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.petals.forEach(petal => {
      // Update position
      petal.y += petal.speedY;
      petal.x += petal.speedX + Math.sin(petal.y * 0.01) * 0.5;
      petal.rotation += petal.rotationSpeed;

      // Reset if off screen
      if (petal.y > this.canvas.height + 20) {
        petal.y = -20;
        petal.x = Math.random() * this.canvas.width;
      }

      // Draw petal
      this.drawPetal(petal);
    });

    this.animationId = requestAnimationFrame(this.animate);
  }

  private drawPetal(petal: Petal): void {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation);
    this.ctx.globalAlpha = petal.opacity;
    this.ctx.fillStyle = petal.color + petal.opacity + ')';

    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
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

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}
