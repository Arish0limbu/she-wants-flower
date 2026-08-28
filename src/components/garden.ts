import { FlowerAnimation, Flower } from '../animations/flowers';
import { config } from '../config';

export class GardenComponent {
  private scene: HTMLElement;
  private container: HTMLElement;
  private flowerAnimation: FlowerAnimation;
  private flowers: Flower[] = [];
  private collectedCount: number = 0;

  constructor() {
    this.scene = this.createScene();
    this.container = this.scene.querySelector('.garden-container')!;
    this.flowerAnimation = new FlowerAnimation(this.container);
    this.createFlowers();
  }

  private createScene(): HTMLElement {
    const scene = document.createElement('div');
    scene.id = 'garden-scene';
    scene.className = 'scene';
    scene.innerHTML = `
      <div class="moon"></div>
      ${this.createStars()}
      <div class="garden-container">
        <div class="ground"></div>
      </div>
    `;
    document.getElementById('app')!.appendChild(scene);
    return scene;
  }

  private createStars(): string {
    let stars = '';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 60;
      const delay = Math.random() * 3;
      stars += `<div class="star" style="left: ${x}%; top: ${y}%; animation-delay: ${delay}s;"></div>`;
    }
    return stars;
  }

  private createFlowers(): void {
    const positions = this.generateFlowerPositions();
    
    config.flowerTypes.forEach((type, index) => {
      const flower = this.flowerAnimation.createFlower(
        `flower-${index}`,
        type,
        positions[index].x,
        positions[index].y
      );
      this.flowers.push(flower);
    });
  }

  private generateFlowerPositions(): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const count = config.flowerCount;

    for (let i = 0; i < count; i++) {
      // Distribute flowers across the bottom area
      const x = 10 + (i / (count - 1)) * 80;
      const y = 15 + Math.random() * 10;
      positions.push({ x, y });
    }

    return positions;
  }

  public async show(): Promise<void> {
    this.scene.classList.add('active');
    
    // Grow flowers with staggered timing
    for (let i = 0; i < this.flowers.length; i++) {
      setTimeout(async () => {
        await this.flowerAnimation.growFlower(this.flowers[i]);
      }, i * 500);
    }
  }

  public async hide(): Promise<void> {
    this.scene.classList.remove('active');
  }

  public getFlowers(): Flower[] {
    return this.flowers;
  }

  public getFlower(id: string): Flower | undefined {
    return this.flowerAnimation.getFlower(id);
  }

  public async collectFlower(flower: Flower): Promise<void> {
    if (flower.collected) return;
    
    await this.flowerAnimation.collectFlower(flower);
    this.collectedCount++;
    
    const event = new CustomEvent('flowerCollected', {
      detail: { flower, count: this.collectedCount, total: this.flowers.length }
    });
    document.dispatchEvent(event);
  }

  public getCollectedCount(): number {
    return this.collectedCount;
  }

  public getTotalFlowers(): number {
    return this.flowers.length;
  }

  public destroy(): void {
    this.scene.remove();
  }
}
