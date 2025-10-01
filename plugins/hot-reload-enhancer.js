/**
 * Hot Reload Enhancer Plugin for Svelte
 * This plugin enhances the hot reload capabilities of the Svelte application
 */

export default function hotReloadEnhancer() {
  return {
    name: 'hot-reload-enhancer',
    
    // Hook that runs when the dev server is initialized
    configureServer(server) {
      // Log when the server starts
      server.ws.on('connection', () => {
        console.log('🔥 Hot Reload Enhancer: Client connected');
      });
      
      // Watch for file changes and log them
      server.watcher.on('change', (file) => {
        console.log(`🔄 Hot Reload Enhancer: File changed - ${file}`);
      });
      
      // Watch for file additions
      server.watcher.on('add', (file) => {
        console.log(`➕ Hot Reload Enhancer: File added - ${file}`);
      });
      
      // Watch for file deletions
      server.watcher.on('unlink', (file) => {
        console.log(`➖ Hot Reload Enhancer: File deleted - ${file}`);
      });
    },
    
    // Hook that runs on transform (when files are processed)
    transform(code, id) {
      // Only process .svelte files
      if (id.endsWith('.svelte')) {
        // Add a comment to the top of the file with a timestamp for debugging
        const timestamp = new Date().toISOString();
        const enhancedCode = `<!-- Hot Reload Enhancer: Processed at ${timestamp} -->\n${code}`;
        return {
          code: enhancedCode,
          map: null // We're not generating a source map
        };
      }
      
      // Return null to indicate no transformation for other files
      return null;
    }
  };
}