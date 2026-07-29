import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-utils': ['zustand', 'lucide-react'],
        },
      },
    },
  },
  esbuild: {
    // Strip console.log and debugger in production — keep console.error/warn for monitoring
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  server: {
    proxy: {
      '/api/sticker': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/history': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/upload': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/chatbot': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/copilot': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api/copilot-history': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
