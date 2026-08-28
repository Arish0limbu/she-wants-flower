import { IntroAnimation } from '../animations/intro';

export class IntroComponent {
  private animation: IntroAnimation;
  private scene: HTMLElement;
  private openButton: HTMLElement;

  constructor() {
    this.scene = this.createScene();
    this.animation = new IntroAnimation();
    this.openButton = this.scene.querySelector('.intro-button')!;
    this.attachEvents();
  }

  private createScene(): HTMLElement {
    const scene = document.createElement('div');
    scene.id = 'intro-scene';
    scene.className = 'scene active';
    scene.innerHTML = `
      <div class="moon"></div>
      ${this.createStars()}
      <div class="intro-text">
        <h1 class="intro-title">She said she wants flowers…</h1>
        <h2 class="intro-subtitle">I have something for her.</h2>
        <button class="garden-button intro-button" aria-label="Open the garden">
          Open Your Garden
        </button>
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

  private attachEvents(): void {
    this.openButton.addEventListener('click', () => this.handleOpen());
    this.openButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleOpen();
      }
    });
  }

  private handleOpen(): void {
    const event = new CustomEvent('openGarden');
    document.dispatchEvent(event);
  }

  public show(): void {
    this.scene.classList.add('active');
    this.animation.play();
  }

  public async hide(): Promise<void> {
    await this.animation.hide();
  }

  public destroy(): void {
    this.scene.remove();
  }
}
