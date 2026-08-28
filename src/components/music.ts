import { config } from '../config';

export class MusicComponent {
  private audio: HTMLAudioElement | null = null;
  private control: HTMLElement;
  private isPlaying: boolean = false;
  private hasInteracted: boolean = false;

  constructor() {
    this.control = this.createControl();
    this.attachEvents();
  }

  private createControl(): HTMLElement {
    const control = document.createElement('button');
    control.className = 'music-control';
    control.setAttribute('aria-label', 'Play music');
    control.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;
    document.body.appendChild(control);
    return control;
  }

  private attachEvents(): void {
    this.control.addEventListener('click', () => this.toggle());
    this.control.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  public async startAfterInteraction(): Promise<void> {
    if (this.hasInteracted) return;
    
    this.hasInteracted = true;
    
    try {
      this.audio = new Audio(config.musicFile);
      this.audio.loop = true;
      this.audio.volume = 0.5;
      
      await this.audio.play();
      this.isPlaying = true;
      this.updateControl();
    } catch (error) {
      console.warn('Audio autoplay blocked or file not found:', error);
    }
  }

  private async toggle(): Promise<void> {
    if (!this.audio) {
      await this.startAfterInteraction();
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      try {
        await this.audio.play();
        this.isPlaying = true;
      } catch (error) {
        console.warn('Failed to play audio:', error);
      }
    }

    this.updateControl();
  }

  private updateControl(): void {
    if (this.isPlaying) {
      this.control.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
      this.control.setAttribute('aria-label', 'Pause music');
    } else {
      this.control.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      this.control.setAttribute('aria-label', 'Play music');
    }
  }

  public setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.control.remove();
  }
}
