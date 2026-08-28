import { config } from '../config';

export class ParallaxSystem {
  private elements: ParallaxElement[] = [];
  private touchX: number = 0;
  private touchY: number = 0;
  private motionX: number = 0;
  private motionY: number = 0;

  constructor() {
    this.setupMotionSensors();
    this.setupTouchListeners();
  }

  public addElement(element: HTMLElement, intensity: number): void {
    this.elements.push({
      element,
      intensity,
      baseX: 0,
      baseY: 0
    });
  }

  private setupMotionSensors(): void {
    if (config.reducedMotion) {
      return;
    }

    // Check for iOS 13+ permission requirement
    const requestPermission = (DeviceOrientationEvent as any).requestPermission;
    
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof requestPermission === 'function') {
      // iOS 13+ requires permission
      document.addEventListener('click', async () => {
        try {
          const permission = await requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
          }
        } catch (error) {
          console.warn('Motion permission denied:', error);
        }
      }, { once: true });
    } else if (typeof DeviceOrientationEvent !== 'undefined') {
      // Non-iOS devices
      window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
    }
  }

  private handleOrientation(event: DeviceOrientationEvent): void {
    if (config.reducedMotion) {
      return;
    }

    const beta = event.beta || 0; // Front-to-back tilt (-180 to 180)
    const gamma = event.gamma || 0; // Left-to-right tilt (-90 to 90)

    // Normalize and limit the values
    this.motionX = Math.max(-30, Math.min(30, gamma)) / 30;
    this.motionY = Math.max(-30, Math.min(30, beta)) / 30;

    this.updateElements();
  }

  private setupTouchListeners(): void {
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(e: TouchEvent): void {
    this.touchX = e.touches[0].clientX;
    this.touchY = e.touches[0].clientY;
  }

  private handleTouchMove(e: TouchEvent): void {
    if (config.reducedMotion) {
      return;
    }

    const touch = e.touches[0];
    const deltaX = (touch.clientX - this.touchX) / window.innerWidth;
    const deltaY = (touch.clientY - this.touchY) / window.innerHeight;

    this.motionX = deltaX;
    this.motionY = deltaY;

    this.updateElements();
  }

  private handleTouchEnd(): void {
    // Gradually return to center
    this.motionX = 0;
    this.motionY = 0;
    this.updateElements();
  }

  private updateElements(): void {
    this.elements.forEach(item => {
      const x = this.motionX * item.intensity * 20;
      const y = this.motionY * item.intensity * 20;
      
      item.element.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  public destroy(): void {
    window.removeEventListener('deviceorientation', this.handleOrientation.bind(this));
    document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}

interface ParallaxElement {
  element: HTMLElement;
  intensity: number;
  baseX: number;
  baseY: number;
}
