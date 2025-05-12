import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: '/ahavatech.github.io/',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
      { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@layouts', replacement: resolve(__dirname, 'src/layouts') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@lib', replacement: resolve(__dirname, 'src/lib') },
      { find: '@shared', replacement: resolve(__dirname, 'src/shared') }
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
          'vendor': ['@hookform/resolvers/zod', 'react-hook-form', 'zod'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', 'lucide-react'],
          'query': ['@tanstack/react-query']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@hookform/resolvers/zod',
      'react-hook-form',
      'zod',
      'react-router-dom',
      '@radix-ui/react-accordion',
      'lucide-react',
      '@tanstack/react-query'
    ]
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('oplayeni.onrender.com')
  },
  server: {
    port: 3000,
    host: true
  }
});