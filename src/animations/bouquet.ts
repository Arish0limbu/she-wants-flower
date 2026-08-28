import gsap from 'gsap';
import { config } from '../config';
import { Flower } from './flowers';

export class BouquetAnimation {
  constructor() {
    // Constructor for future use
  }

  public async assembleBouquet(flowers: Flower[]): Promise<void> {
    if (config.reducedMotion) {
      this.simpleAssemble(flowers);
      return;
    }

    const timeline = gsap.timeline();
    const centerX = 50;
    const centerY = 25;

    // Move each flower to bouquet position with slight offset
    flowers.forEach((flower, index) => {
      const angle = (index / flowers.length) * Math.PI * 2;
      const radius = 8;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      timeline.to(flower.element, {
        left: `${centerX + offsetX}%`,
        bottom: `${centerY + offsetY}%`,
        scale: 0.7,
        rotation: (Math.random() - 0.5) * 20,
        duration: 1.5,
        ease: 'power2.inOut'
      }, index * 0.1);
    });

    // Add glow effect
    timeline.to('.flower', {
      filter: 'drop-shadow(0 0 20px rgba(255, 107, 157, 0.8))',
      duration: 0.5
    });

    await timeline.play();
  }

  private simpleAssemble(flowers: Flower[]): void {
    const centerX = 50;
    const centerY = 25;

    flowers.forEach((flower, index) => {
      const angle = (index / flowers.length) * Math.PI * 2;
      const radius = 8;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;

      gsap.set(flower.element, {
        left: `${centerX + offsetX}%`,
        bottom: `${centerY + offsetY}%`,
        scale: 0.7
      });
    });
  }
}
