import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Preprocess with Vite
  preprocess: vitePreprocess(),
  
  // Compiler options for Svelte 5
  compilerOptions: {
    // Enable runes mode for Svelte 5
    runes: true
  }
}