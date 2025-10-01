/**
 * View Transition utility for smooth page transitions
 * Provides a wrapper for the View Transitions API with fallback support
 */

/**
 * Start a view transition with fallback for unsupported browsers
 * @param {Function} callback - Function to run during the transition
 * @param {Object} options - Transition options
 * @returns {Promise} Promise that resolves when transition is complete
 */
export async function startViewTransition(callback, options = {}) {
  // Default options
  const defaultOptions = {
    duration: 400,
    easing: 'ease-in-out',
    skipIfUnsupported: false,
    type: 'fade' // 'fade', 'slide-left', 'slide-right', 'slide-up', 'slide-down'
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Check if View Transitions API is supported
  if (document.startViewTransition) {
    try {
      // Apply transition class to document root for CSS-based transitions
      if (opts.type && opts.type !== 'fade') {
        document.documentElement.classList.add(`view-transition-${opts.type}`);
      }
      
      // Start the view transition
      const transition = document.startViewTransition(async () => {
        // Apply custom styles during transition if provided
        if (opts.onTransitionStart) {
          opts.onTransitionStart();
        }
        
        // Execute the callback
        await callback();
        
        // Apply custom styles after transition if provided
        if (opts.onTransitionEnd) {
          opts.onTransitionEnd();
        }
      });
      
      // Wait for the transition to complete
      const result = await transition.finished;
      
      // Remove transition class after completion
      if (opts.type && opts.type !== 'fade') {
        document.documentElement.classList.remove(`view-transition-${opts.type}`);
      }
      
      return result;
    } catch (error) {
      console.warn('View transition failed:', error);
      // Fallback to direct execution
      return await callback();
    }
  } else {
    // Fallback for browsers that don't support View Transitions API
    if (!opts.skipIfUnsupported) {
      console.info('View Transitions API not supported, using direct transition');
    }
    
    // Execute callback directly
    return await callback();
  }
}

/**
 * Apply CSS for view transitions
 */
export function applyViewTransitionStyles() {
  // Add CSS for view transitions if not already present
  if (!document.getElementById('view-transition-styles')) {
    const style = document.createElement('style');
    style.id = 'view-transition-styles';
    style.textContent = `
      /* Default view transition styles */
      ::view-transition-group(root) {
        animation-duration: 400ms;
        animation-timing-function: ease-in-out;
      }
      
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none;
      }
      
      /* Cross-fade animation */
      .view-transition-fade-old {
        animation: view-transition-fade-out 400ms ease-in-out both;
      }
      
      .view-transition-fade-new {
        animation: view-transition-fade-in 400ms ease-in-out both;
      }
      
      @keyframes view-transition-fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes view-transition-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Slide animations */
      .view-transition-slide-left-old {
        animation: view-transition-slide-left-out 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-left-new {
        animation: view-transition-slide-left-in 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-right-old {
        animation: view-transition-slide-right-out 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-right-new {
        animation: view-transition-slide-right-in 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-up-old {
        animation: view-transition-slide-up-out 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-up-new {
        animation: view-transition-slide-up-in 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-down-old {
        animation: view-transition-slide-down-out 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      .view-transition-slide-down-new {
        animation: view-transition-slide-down-in 350ms cubic-bezier(0.4, 0, 0.2, 1) both;
      }
      
      /* Keyframes for slide animations */
      @keyframes view-transition-slide-left-out {
        from { transform: translateX(0); }
        to { transform: translateX(-100%); }
      }
      
      @keyframes view-transition-slide-left-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      
      @keyframes view-transition-slide-right-out {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
      
      @keyframes view-transition-slide-right-in {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      
      @keyframes view-transition-slide-up-out {
        from { transform: translateY(0); }
        to { transform: translateY(-100%); }
      }
      
      @keyframes view-transition-slide-up-in {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      
      @keyframes view-transition-slide-down-out {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
      }
      
      @keyframes view-transition-slide-down-in {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize view transitions for the application
 */
export function initViewTransitions() {
  // Apply default styles
  applyViewTransitionStyles();
  
  // Add meta tag for MPA support (if needed in future)
  if (!document.querySelector('meta[name="view-transition"]')) {
    const meta = document.createElement('meta');
    meta.name = 'view-transition';
    meta.content = 'same-origin';
    document.head.appendChild(meta);
  }
}

/**
 * Navigation context manager for determining transition types
 */
class NavigationContext {
  constructor() {
    this.history = [];
    this.currentRoute = null;
  }
  
  /**
   * Navigate to a new route with appropriate transition
   * @param {string} route - The route to navigate to
   * @param {Function} callback - The navigation callback
   * @param {Object} options - Additional options
   */
  navigate(route, callback, options = {}) {
    // Determine transition type based on route hierarchy
    const transitionType = this.getTransitionType(route);
    
    // Update history
    if (this.currentRoute) {
      this.history.push(this.currentRoute);
    }
    this.currentRoute = route;
    
    // Start transition with appropriate type
    return startViewTransition(callback, {
      ...options,
      type: transitionType
    });
  }
  
  /**
   * Determine transition type based on route relationship
   * @param {string} newRoute - The route we're navigating to
   * @returns {string} The transition type
   */
  getTransitionType(newRoute) {
    // For simplicity in this implementation, we'll use fade for all transitions
    // In a more complex app, you might implement logic like:
    /*
    if (this.isDeeperRoute(newRoute)) {
      return 'slide-left'; // Going deeper into hierarchy
    } else if (this.isShallowerRoute(newRoute)) {
      return 'slide-right'; // Going back up hierarchy
    } else {
      return 'fade'; // Same level navigation
    }
    */
    
    return 'fade'; // Default to fade for all transitions
  }
  
  /**
   * Check if new route is deeper in hierarchy than current
   * @param {string} newRoute - The route we're navigating to
   * @returns {boolean} True if new route is deeper
   */
  isDeeperRoute(newRoute) {
    // Implementation would depend on your routing structure
    return false;
  }
  
  /**
   * Check if new route is shallower in hierarchy than current
   * @param {string} newRoute - The route we're navigating to
   * @returns {boolean} True if new route is shallower
   */
  isShallowerRoute(newRoute) {
    // Implementation would depend on your routing structure
    return false;
  }
}

// Export a singleton instance
export const navigationContext = new NavigationContext();