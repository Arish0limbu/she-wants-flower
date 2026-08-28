import { defineConfig } from 'vite';

export default defineConfig({
  base: '/she-wants-flowers/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
