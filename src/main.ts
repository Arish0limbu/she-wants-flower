import './styles/main.css';
import './styles/animations.css';
import './styles/mobile.css';

import { IntroComponent } from './components/intro';
import { GardenComponent } from './components/garden';
import { FlowerInteraction } from './components/flowerInteraction';
import { MusicComponent } from './components/music';
import { FinalSceneComponent } from './components/finalScene';
import { ProgressIndicator } from './components/progressIndicator';
import { ParallaxSystem } from './components/parallax';

import { PetalSystem } from './animations/petals';
import { ParticleSystem } from './animations/particles';
import { FireflySystem } from './animations/fireflies';
import { BouquetAnimation } from './animations/bouquet';
import { HeartAnimation } from './animations/heart';
import { TransitionAnimation } from './animations/transitions';

class App {
  private intro: IntroComponent;
  private garden: GardenComponent;
  private flowerInteraction: FlowerInteraction;
  private music: MusicComponent;
  private finalScene: FinalSceneComponent;
  private progressIndicator: ProgressIndicator;
  private parallax: ParallaxSystem;
  
  private petalSystem: PetalSystem;
  private particleSystem: ParticleSystem;
  private fireflySystem: FireflySystem;
  private bouquetAnimation: BouquetAnimation;
  private heartAnimation: HeartAnimation;

  constructor() {
    // Initialize systems
    this.petalSystem = new PetalSystem();
    this.particleSystem = new ParticleSystem();
    this.fireflySystem = new FireflySystem();
    this.music = new MusicComponent();
    this.progressIndicator = new ProgressIndicator();
    this.parallax = new ParallaxSystem();
    
    // Initialize components
    this.intro = new IntroComponent();
    this.garden = new GardenComponent();
    this.flowerInteraction = new FlowerInteraction(this.particleSystem);
    this.finalScene = new FinalSceneComponent();
    this.bouquetAnimation = new BouquetAnimation();
    this.heartAnimation = new HeartAnimation();

    // Setup event listeners
    this.setupEventListeners();
    
    // Start intro
    this.intro.show();
  }

  private setupEventListeners(): void {
    // Open garden event
    document.addEventListener('openGarden', () => this.openGarden());
    
    // Flower collected event
    document.addEventListener('flowerCollected', (e: any) => {
      this.handleFlowerCollected(e.detail);
    });
    
    // Flower tapped event
    document.addEventListener('flowerTapped', (e: any) => {
      this.handleFlowerTapped(e.detail);
    });
  }

  private async openGarden(): Promise<void> {
    // Start music after first interaction
    await this.music.startAfterInteraction();
    
    // Play transition
    await TransitionAnimation.introToGarden();
    
    // Hide intro
    await this.intro.hide();
    
    // Show garden
    await this.garden.show();
    
    // Start particle systems
    this.petalSystem.start();
    this.particleSystem.start();
    this.fireflySystem.start();
    
    // Attach flower interactions
    const flowers = this.garden.getFlowers();
    flowers.forEach(flower => {
      this.flowerInteraction.attachToFlower(flower);
    });
    
    // Setup parallax
    this.setupParallax();
    
    // Show progress indicator
    this.progressIndicator.update(0, this.garden.getTotalFlowers());
  }

  private setupParallax(): void {
    const moon = document.querySelector('.moon') as HTMLElement;
    const stars = document.querySelectorAll('.star') as NodeListOf<HTMLElement>;
    
    if (moon) {
      this.parallax.addElement(moon, 0.5);
    }
    
    stars.forEach(star => {
      this.parallax.addElement(star, 0.3);
    });
  }

  private async handleFlowerCollected(detail: any): Promise<void> {
    const { count, total } = detail;
    
    // Update progress
    this.progressIndicator.update(count, total);
    
    // Check if all flowers collected
    if (count >= total) {
      setTimeout(() => this.transitionToFinal(), 1500);
    }
  }

  private async handleFlowerTapped(detail: any): Promise<void> {
    const { flower } = detail;
    
    // Collect the flower
    await this.garden.collectFlower(flower);
    
    // Respond to fireflies
    const rect = flower.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    this.fireflySystem.respondToTouch(centerX, centerY);
  }

  private async transitionToFinal(): Promise<void> {
    // Hide progress indicator
    this.progressIndicator.hide();
    
    // Play transition
    await TransitionAnimation.gardenToFinal();
    
    // Hide garden
    await this.garden.hide();
    
    // Stop particle systems
    this.petalSystem.stop();
    this.particleSystem.stop();
    this.fireflySystem.stop();
    
    // Show final scene
    this.finalScene.show();
    
    // Assemble bouquet
    const flowers = this.garden.getFlowers();
    await this.bouquetAnimation.assembleBouquet(flowers);
    
    // Wait for messages to complete
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Play heart animation
    await this.heartAnimation.formHeart();
    
    // Restart petals for final scene
    this.petalSystem.start();
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
