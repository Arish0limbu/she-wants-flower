import gsap from 'gsap';
import { config } from '../config';

export class TransitionAnimation {
  public static async introToGarden(): Promise<void> {
    if (config.reducedMotion) {
      return this.simpleTransition();
    }

    const timeline = gsap.timeline();

    // Zoom effect
    timeline.to('body', {
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    // Fade particles toward camera
    timeline.to('.particle', {
      scale: 2,
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'power2.out'
    }, '-=1');

    // Reset scale
    timeline.to('body', {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

    await timeline.play();
  }

  public static async gardenToFinal(): Promise<void> {
    if (config.reducedMotion) {
      return this.simpleTransition();
    }

    const timeline = gsap.timeline();

    // Gather flowers to center
    timeline.to('.flower', {
      x: '50%',
      y: '50%',
      scale: 0.8,
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.1
    });

    // Fade out garden elements
    timeline.to('#garden-scene', {
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    }, '-=1');

    await timeline.play();
  }

  private static async simpleTransition(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}
