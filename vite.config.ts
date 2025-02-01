import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  optimizeDeps: {
    exclude: ['@capacitor/core'],
  },
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      external: ['@capacitor/core'],
    }
  },
});
