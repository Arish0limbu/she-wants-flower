export class ProgressIndicator {
  private element: HTMLElement;

  constructor() {
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const indicator = document.createElement('div');
    indicator.className = 'progress-indicator';
    indicator.setAttribute('aria-live', 'polite');
    indicator.setAttribute('aria-label', 'Flower collection progress');
    indicator.textContent = 'Flowers collected: 0 / 0';
    document.body.appendChild(indicator);
    return indicator;
  }

  public update(current: number, total: number): void {
    this.current = current;
    this.total = total;
    this.element.textContent = `Flowers collected: ${current} / ${total}`;
    
    if (current > 0) {
      this.element.classList.add('show');
    }
  }

  public show(): void {
    this.element.classList.add('show');
  }

  public hide(): void {
    this.element.classList.remove('show');
  }

  public destroy(): void {
    this.element.remove();
  }
}
