import gsap from 'gsap';
import { config } from '../config';

export interface Flower {
  id: string;
  type: string;
  x: number;
  y: number;
  element: HTMLElement;
  collected: boolean;
}

export class FlowerAnimation {
  private flowers: Map<string, Flower> = new Map();
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public createFlower(id: string, type: string, x: number, y: number): Flower {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.id = id;
    flower.style.left = `${x}%`;
    flower.style.bottom = `${y}%`;
    flower.setAttribute('role', 'button');
    flower.setAttribute('aria-label', `Collect ${type} flower`);
    flower.setAttribute('tabindex', '0');

    // Create flower SVG
    flower.innerHTML = this.getFlowerSVG(type);

    this.container.appendChild(flower);

    const flowerData: Flower = {
      id,
      type,
      x,
      y,
      element: flower,
      collected: false
    };

    this.flowers.set(id, flowerData);

    return flowerData;
  }

  public async growFlower(flower: Flower): Promise<void> {
    if (config.reducedMotion) {
      this.simpleGrow(flower);
      return;
    }

    const timeline = gsap.timeline();

    // Grow stem
    timeline.fromTo(flower.element.querySelector('.stem')!, {
      scaleY: 0,
      transformOrigin: 'bottom'
    }, {
      scaleY: 1,
      duration: 1,
      ease: 'power2.out'
    });

    // Grow leaves
    timeline.fromTo(flower.element.querySelectorAll('.leaf'), {
      scaleX: 0,
      transformOrigin: 'left center'
    }, {
      scaleX: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    // Bloom flower head
    timeline.fromTo(flower.element.querySelector('.flower-head')!, {
      scale: 0,
      rotation: -180
    }, {
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    }, '-=0.3');

    // Add gentle sway
    timeline.to(flower.element, {
      rotation: '+=2',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    await timeline.play();
  }

  public async collectFlower(flower: Flower): Promise<void> {
    if (config.reducedMotion) {
      this.simpleCollect(flower);
      return;
    }

    flower.collected = true;
    flower.element.classList.add('glowing');

    const timeline = gsap.timeline();

    // Grow slightly
    timeline.to(flower.element, {
      scale: 1.2,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });

    // Create particle burst
    this.createParticleBurst(flower);

    // Return to normal size
    timeline.to(flower.element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    await timeline.play();
  }

  public async moveToBouquet(flower: Flower, centerX: number, centerY: number): Promise<void> {
    if (config.reducedMotion) {
      this.simpleMove(flower, centerX, centerY);
      return;
    }

    const timeline = gsap.timeline();

    timeline.to(flower.element, {
      left: `${centerX}%`,
      bottom: `${centerY}%`,
      scale: 0.6,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    await timeline.play();
  }

  private createParticleBurst(flower: Flower): void {
    const rect = flower.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.position = 'fixed';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.background = config.accentColor;
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      document.body.appendChild(particle);

      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  }

  private simpleGrow(flower: Flower): void {
    gsap.set(flower.element, { opacity: 1 });
  }

  private simpleCollect(flower: Flower): void {
    flower.collected = true;
    flower.element.classList.add('glowing');
  }

  private simpleMove(flower: Flower, centerX: number, centerY: number): void {
    gsap.set(flower.element, {
      left: `${centerX}%`,
      bottom: `${centerY}%`,
      scale: 0.6
    });
  }

  private getFlowerSVG(type: string): string {
    const colors = {
      rose: '#ff6b9d',
      tulip: '#ff6b6b',
      'cherry blossom': '#ffb7b2',
      lily: '#fff0f5',
      sunflower: '#ffd93d',
      daisy: '#ffffff',
      orchid: '#dda0dd'
    };

    const color = colors[type as keyof typeof colors] || config.accentColor;

    return `
      <svg viewBox="0 0 100 200" width="80" height="160">
        <!-- Stem -->
        <line class="stem" x1="50" y1="200" x2="50" y2="50" stroke="#4a7c59" stroke-width="4" stroke-linecap="round"/>
        
        <!-- Leaves -->
        <ellipse class="leaf" cx="35" cy="140" rx="15" ry="8" fill="#4a7c59" transform="rotate(-30 35 140)"/>
        <ellipse class="leaf" cx="65" cy="120" rx="15" ry="8" fill="#4a7c59" transform="rotate(30 65 120)"/>
        
        <!-- Flower Head -->
        <g class="flower-head" transform="translate(50, 50)">
          ${this.getFlowerPetals(type, color)}
          <circle cx="0" cy="0" r="8" fill="#ffd93d"/>
        </g>
      </svg>
    `;
  }

  private getFlowerPetals(type: string, color: string): string {
    switch (type) {
      case 'rose':
        return `
          <ellipse cx="0" cy="-15" rx="12" ry="15" fill="${color}"/>
          <ellipse cx="12" cy="-8" rx="12" ry="15" fill="${color}" transform="rotate(45)"/>
          <ellipse cx="8" cy="8" rx="12" ry="15" fill="${color}" transform="rotate(90)"/>
          <ellipse cx="-8" cy="8" rx="12" ry="15" fill="${color}" transform="rotate(135)"/>
          <ellipse cx="-12" cy="-8" rx="12" ry="15" fill="${color}" transform="rotate(180)"/>
          <ellipse cx="-8" cy="-15" rx="12" ry="15" fill="${color}" transform="rotate(225)"/>
        `;
      case 'tulip':
        return `
          <ellipse cx="0" cy="-10" rx="15" ry="20" fill="${color}"/>
          <ellipse cx="-12" cy="0" rx="12" ry="18" fill="${color}" transform="rotate(-30)"/>
          <ellipse cx="12" cy="0" rx="12" ry="18" fill="${color}" transform="rotate(30)"/>
        `;
      case 'cherry blossom':
        return `
          <circle cx="0" cy="-12" r="10" fill="${color}"/>
          <circle cx="12" cy="-4" r="10" fill="${color}"/>
          <circle cx="8" cy="10" r="10" fill="${color}"/>
          <circle cx="-8" cy="10" r="10" fill="${color}"/>
          <circle cx="-12" cy="-4" r="10" fill="${color}"/>
        `;
      default:
        return `
          <circle cx="0" cy="-10" r="12" fill="${color}"/>
          <circle cx="12" cy="0" r="12" fill="${color}"/>
          <circle cx="0" cy="12" r="12" fill="${color}"/>
          <circle cx="-12" cy="0" r="12" fill="${color}"/>
        `;
    }
  }

  public getFlower(id: string): Flower | undefined {
    return this.flowers.get(id);
  }

  public getAllFlowers(): Flower[] {
    return Array.from(this.flowers.values());
  }
}
