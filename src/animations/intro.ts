import gsap from 'gsap';
import { config } from '../config';

export class IntroAnimation {
  private scene: HTMLElement;
  private title: HTMLElement;
  private subtitle: HTMLElement;
  private button: HTMLElement;

  constructor() {
    this.scene = document.getElementById('intro-scene')!;
    this.title = this.scene.querySelector('.intro-title')!;
    this.subtitle = this.scene.querySelector('.intro-subtitle')!;
    this.button = this.scene.querySelector('.intro-button')!;
  }

  public play(): void {
    if (config.reducedMotion) {
      this.playReducedMotion();
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power2.out'
      }
    });

    // Fade in title
    timeline.to(this.title, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      delay: 0.5
    });

    // Fade in subtitle
    timeline.to(this.subtitle, {
      opacity: 1,
      y: 0,
      duration: 1.5
    }, '-=0.5');

    // Fade in button
    timeline.to(this.button, {
      opacity: 1,
      y: 0,
      duration: 1
    }, '-=0.5');

    // Add subtle pulse to button
    timeline.to(this.button, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  private playReducedMotion(): void {
    gsap.set([this.title, this.subtitle, this.button], {
      opacity: 1,
      y: 0
    });
  }

  public hide(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this.scene, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          this.scene.classList.remove('active');
          resolve();
        }
      });
    });
  }
}
