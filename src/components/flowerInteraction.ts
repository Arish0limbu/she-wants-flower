import { Flower } from '../animations/flowers';
import { ParticleSystem } from '../animations/particles';
import { config } from '../config';

export class FlowerInteraction {
  private particleSystem: ParticleSystem;
  private messagePopup: HTMLElement;

  constructor(particleSystem: ParticleSystem) {
    this.particleSystem = particleSystem;
    this.messagePopup = this.createMessagePopup();
  }

  private createMessagePopup(): HTMLElement {
    const popup = document.createElement('div');
    popup.className = 'message-popup';
    popup.innerHTML = '<p></p>';
    popup.setAttribute('role', 'alert');
    popup.setAttribute('aria-live', 'polite');
    document.body.appendChild(popup);
    return popup;
  }

  public attachToFlower(flower: Flower): void {
    const element = flower.element;

    // Touch events
    element.addEventListener('touchstart', (e) => this.handleTouch(e, flower), { passive: true });
    element.addEventListener('click', (e) => this.handleClick(e, flower));
    
    // Keyboard events
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick(e, flower);
      }
    });
  }

  private handleTouch(e: TouchEvent, flower: Flower): void {
    const touch = e.touches[0];
    this.createParticleBurst(touch.clientX, touch.clientY);
    this.showMessage();
    this.notifyCollection(flower);
  }

  private handleClick(e: MouseEvent | KeyboardEvent, flower: Flower): void {
    const x = 'clientX' in e ? e.clientX : window.innerWidth / 2;
    const y = 'clientY' in e ? e.clientY : window.innerHeight / 2;
    this.createParticleBurst(x, y);
    this.showMessage();
    this.notifyCollection(flower);
  }

  private createParticleBurst(x: number, y: number): void {
    this.particleSystem.createBurst(x, y);
  }

  private showMessage(): void {
    const message = this.getRandomMessage();
    
    const textElement = this.messagePopup.querySelector('p')!;
    textElement.textContent = message;
    
    this.messagePopup.classList.add('show');
    
    // Hide after delay
    setTimeout(() => {
      this.messagePopup.classList.remove('show');
    }, 3000);
  }

  private getRandomMessage(): string {
    const messages = config.romanticMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private notifyCollection(flower: Flower): void {
    const event = new CustomEvent('flowerTapped', {
      detail: { flower }
    });
    document.dispatchEvent(event);
  }

  public destroy(): void {
    this.messagePopup.remove();
  }
}
