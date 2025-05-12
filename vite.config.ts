import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
      { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@layouts', replacement: resolve(__dirname, 'src/layouts') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@lib', replacement: resolve(__dirname, 'src/lib') },
      { find: '@shared', replacement: resolve(__dirname, 'src/shared') }  // Fixed shared path
    ]
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'vendor': [
            '@tanstack/react-query',
            '@hookform/resolvers/zod',
            'react-hook-form',
            'zod'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-query',
      '@hookform/resolvers/zod',
      'react-hook-form',
      'zod'
    ]
  }
});