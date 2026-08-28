import gsap from 'gsap';
import { config } from '../config';

export class FinalSceneComponent {
  private scene: HTMLElement;
  private message1: HTMLElement;
  private message2: HTMLElement;
  private message3: HTMLElement;

  constructor() {
    this.scene = this.createScene();
    this.message1 = this.scene.querySelector('.final-message-1')!;
    this.message2 = this.scene.querySelector('.final-message-2')!;
    this.message3 = this.scene.querySelector('.final-message-3')!;
  }

  private createScene(): HTMLElement {
    const scene = document.createElement('div');
    scene.id = 'final-scene';
    scene.className = 'scene';
    scene.innerHTML = `
      <div class="final-content">
        <h1 class="final-message-1">You wanted flowers…</h1>
        <h2 class="final-message-2">…so I made you a whole garden.</h2>
        <h3 class="final-message-3">${config.finalMessage}</h3>
      </div>
      <div class="bouquet-container"></div>
    `;
    document.getElementById('app')!.appendChild(scene);
    return scene;
  }

  public async show(): Promise<void> {
    this.scene.classList.add('active');
    
    if (config.reducedMotion) {
      this.simpleShow();
      return;
    }

    const timeline = gsap.timeline();

    // Show first message
    timeline.to(this.message1, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Pause
    timeline.to({}, { duration: 2 });

    // Show second message
    timeline.to(this.message2, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Pause
    timeline.to({}, { duration: 2 });

    // Show final message
    timeline.to(this.message3, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: 'power2.out'
    });

    await timeline.play();
  }

  private simpleShow(): void {
    gsap.set([this.message1, this.message2, this.message3], {
      opacity: 1,
      y: 0
    });
  }

  public getBouquetContainer(): HTMLElement {
    return this.scene.querySelector('.bouquet-container')!;
  }

  public hide(): void {
    this.scene.classList.remove('active');
  }

  public destroy(): void {
    this.scene.remove();
  }
}
