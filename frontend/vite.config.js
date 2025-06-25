import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true, // optional, for node: protocol support
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: `https://wu-react-app-1.onrender.com`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      // Add more aliases if you see missing modules like 'stream', 'buffer', etc.
      stream: 'stream-browserify',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Polyfill 'global'
      },
    },
  },
});
