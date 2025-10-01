import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import hotReloadEnhancer from './plugins/hot-reload-enhancer.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    hotReloadEnhancer()
  ],
  base: '/Run_saraylo_app/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Server configuration for development with hot reload
  server: {
    historyApiFallback: true,
    // Enable hot module replacement
    hmr: {
      overlay: true
    },
    // Host and port configuration
    host: 'localhost',
    port: 3000,
    // Enable strict port to prevent automatic port switching
    strictPort: false,
    // Enable CORS for development
    cors: true
  },
  // Optimize dependencies for faster hot reload
  optimizeDeps: {
    include: ['svelte']
  }
})