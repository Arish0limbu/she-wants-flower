// Configuration - Customize these values for your experience
export const config = {
  // Personalization
  herName: 'My Love',
  websiteTitle: 'She Wants Flowers',
  
  // Romantic messages shown when tapping flowers
  romanticMessages: [
    'For your beautiful smile.',
    'For every little thing that makes you special.',
    'Because you deserve more than one flower.',
    'You make ordinary moments beautiful.',
    'Some flowers bloom once. You make every day bloom.',
    'Your presence is my favorite garden.',
    'Every petal represents a moment with you.',
    'You are the rarest flower of all.'
  ],
  
  // Final message
  finalMessage: 'For the girl who deserves every flower in the world. ❤️',
  
  // Flower settings
  flowerCount: 7,
  flowerTypes: ['rose', 'tulip', 'cherry blossom', 'lily', 'sunflower', 'daisy', 'orchid'],
  
  // Music
  musicFile: '/music/romantic-piano.mp3',
  
  // Colors
  accentColor: '#ff6b9d',
  secondaryColor: '#c44569',
  glowColor: '#ffd93d',
  
  // Animation intensity (0.1 to 1.0)
  animationIntensity: 0.8,
  
  // Performance settings
  maxParticles: 100,
  maxFireflies: 20,
  maxPetals: 50,
  
  // Reduced motion support
  reducedMotion: false
};

// Detect reduced motion preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  config.reducedMotion = mediaQuery.matches;
  
  // Auto-adjust performance for low-end devices
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  if (isLowEnd) {
    config.maxParticles = 50;
    config.maxFireflies = 10;
    config.maxPetals = 30;
    config.animationIntensity = 0.5;
  }
}
