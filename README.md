# 🌸 She Wants Flowers

A romantic interactive flower garden experience - a magical digital love letter built with modern web technologies.

## ✨ Features

- **Cinematic Intro Scene** - Beautiful dark garden with stars, moon, and atmospheric effects
- **Interactive Flower Garden** - Touch-responsive flowers that bloom and glow
- **Particle Systems** - Falling petals, fireflies, and magical particle bursts
- **Parallax Effects** - Motion sensor and touch-based parallax for depth
- **Flower Collection** - Collect flowers to build a beautiful bouquet
- **Final Heart Animation** - Glowing particle heart formation
- **Mobile-First Design** - Optimized for smartphones with responsive desktop support
- **Accessibility** - Keyboard navigation, screen reader support, reduced motion preferences
- **Performance Optimized** - Canvas-based particles, adaptive quality for low-end devices

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **GSAP** - Advanced animations
- **Canvas API** - Particle systems and effects
- **Web Audio API** - Music and sound interaction

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/she-wants-flowers.git
   cd she-wants-flowers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## ⚙️ Configuration

Customize the experience by editing `src/config.ts`:

```typescript
export const config = {
  // Personalization
  herName: 'My Love',
  websiteTitle: 'She Wants Flowers',
  
  // Romantic messages shown when tapping flowers
  romanticMessages: [
    'For your beautiful smile.',
    'For every little thing that makes you special.',
    // ... add more messages
  ],
  
  // Final message
  finalMessage: 'For the girl who deserves every flower in the world. ❤️',
  
  // Flower settings
  flowerCount: 7,
  
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
};
```

## 🎵 Music

Add your romantic background music:

1. Create a `public/music/` directory
2. Add your audio file (e.g., `romantic-piano.mp3`)
3. Update the `musicFile` path in `src/config.ts`

**Note:** Use royalty-free music or music you have the rights to use.

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

The project includes a GitHub Actions workflow for automatic deployment:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/she-wants-flowers.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under **Build and deployment**, select **Source** > **GitHub Actions**
   - The workflow will automatically deploy on push to main

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 📁 Project Structure

```
she-wants-flowers/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
│
├── src/
│   ├── main.ts                    # Application entry point
│   ├── config.ts                  # Configuration settings
│   │
│   ├── animations/
│   │   ├── intro.ts               # Intro scene animations
│   │   ├── flowers.ts             # Flower generation and animation
│   │   ├── petals.ts              # Falling petals system
│   │   ├── particles.ts           # Particle effects
│   │   ├── fireflies.ts           # Firefly system
│   │   ├── bouquet.ts             # Bouquet assembly animation
│   │   ├── heart.ts               # Heart particle animation
│   │   └── transitions.ts         # Scene transitions
│   │
│   ├── components/
│   │   ├── intro.ts               # Intro scene component
│   │   ├── garden.ts              # Garden component
│   │   ├── flowerInteraction.ts   # Flower touch interaction
│   │   ├── music.ts               # Music control
│   │   ├── finalScene.ts          # Final scene component
│   │   ├── progressIndicator.ts   # Progress indicator
│   │   └── parallax.ts            # Parallax system
│   │
│   └── styles/
│       ├── main.css               # Main styles
│       ├── animations.css         # Animation keyframes
│       └── mobile.css             # Mobile optimizations
│
├── public/
│   ├── music/                     # Place your music file here
│   └── images/                    # Additional assets if needed
│
└── .github/
    └── workflows/
        └── deploy.yml              # GitHub Actions workflow
```

## 🎨 Customization Guide

### Changing Colors

Edit the CSS variables in `src/styles/main.css`:

```css
:root {
  --accent-color: #ff6b9d;
  --secondary-color: #c44569;
  --glow-color: #ffd93d;
  --bg-dark: #1a0a2e;
  --bg-purple: #2d1b4e;
}
```

### Adding More Flowers

Edit `config.flowerTypes` in `src/config.ts`:

```typescript
flowerTypes: ['rose', 'tulip', 'cherry blossom', 'lily', 'sunflower', 'daisy', 'orchid'],
```

### Adjusting Animation Speed

Modify `animationIntensity` in `src/config.ts` (0.1 to 1.0):

```typescript
animationIntensity: 0.8,  // Lower = slower, Higher = faster
```

## 📱 Mobile Optimization

The project is optimized for mobile devices:

- Touch-friendly interactions
- Responsive design for all screen sizes
- Performance detection for low-end devices
- Reduced motion support
- Safe area handling for notched phones

## ♿ Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels and live regions
- Focus states for interactive elements
- Reduced motion support via `prefers-reduced-motion`
- Screen reader compatible

## 🔧 Performance

The project includes automatic performance optimization:

- Canvas-based particle systems for efficiency
- Adaptive quality based on device capabilities
- Reduced particle count on low-end devices
- Optimized animation loops
- Lazy loading considerations

## 🐛 Troubleshooting

### GSAP Module Not Found

If you see "Cannot find module 'gsap'", run:

```bash
npm install
```

### TypeScript Errors

Ensure all dependencies are installed:

```bash
npm install
```

### Build Issues

Clear the cache and rebuild:

```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📝 License

This project is created as a personal romantic gesture. Feel free to use and modify it for your own purposes.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 💝 Message from the Creator

This website was built with love as a romantic surprise. Every animation, every particle, and every flower was crafted to create a magical experience. Feel free to customize it and make it your own.

---

Made with ❤️ for someone special