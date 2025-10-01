<script>
  import { onMount } from 'svelte';

  // State for animation phases
  let backgroundVisible = $state(false);
  let contentVisible = $state(false);
  let fadeOut = $state(false);
  let logoScale = $state(1);
  let textOpacity = $state(0);

  // Cursor hiding and input blocking
  let hideCursor = $state(true);
  
  // Event handler for splash completion - properly defined as a prop
  const { onSplashComplete } = $props();

  onMount(() => {
    console.log('SplashScreen mounted');
    // Phase 1: Background fade-in (1.5 seconds)
    setTimeout(() => {
      console.log('Background visible');
      backgroundVisible = true;
    }, 0);

    // Phase 2: Content animations (after 1.5 seconds)
    setTimeout(() => {
      console.log('Content visible');
      contentVisible = true;
      // Animate logo scale
      let scale = 1;
      const scaleInterval = setInterval(() => {
        scale += 0.02;
        logoScale = Math.min(scale, 1.1);
        if (scale >= 1.1) {
          clearInterval(scaleInterval);
          console.log('Logo scale animation complete');
        }
      }, 20);
      
      // Animate text opacity
      let opacity = 0;
      const opacityInterval = setInterval(() => {
        opacity += 0.05;
        textOpacity = Math.min(opacity, 1);
        if (opacity >= 1) {
          clearInterval(opacityInterval);
          console.log('Text opacity animation complete');
        }
      }, 50);
    }, 1500);

    // Phase 3: Start fade-out transition (after 4 seconds)
    setTimeout(() => {
      console.log('Starting fade out');
      fadeOut = true;
      // Dispatch event when fade-out starts
      setTimeout(() => {
        console.log('Calling onSplashComplete');
        if (onSplashComplete) onSplashComplete();
      }, 1500); // Match the fade-out duration
    }, 4000);
  });
</script>

<div class="splash-screen {hideCursor ? 'hide-cursor' : ''} {fadeOut ? 'fade-out' : ''}" class:visible={backgroundVisible}>
  <div class="splash-content" class:visible={contentVisible}>
    <div class="logo-container" class:animate={contentVisible} style="transform: scale({logoScale});">
      <img src="/image/logo/logo.png" alt="Logo" class="logo" />
    </div>
    <h1 class="welcome-text" style="opacity: {textOpacity};">Добро пожаловать</h1>
  </div>
  <div class="copyright">Создано студией Saraylo</div>
</div>

<style>
  .splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: all 1.5s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .splash-screen.visible {
    background: linear-gradient(135deg, #000000 0%, #41B6E6 50%, #db3eb1 100%);
  }

  .splash-screen.fade-out {
    opacity: 0;
    visibility: hidden;
  }

  .splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 1s cubic-bezier(0.65, 0, 0.35, 1);
  }

  .splash-content.visible {
    opacity: 1;
  }

  .logo-container {
    margin-bottom: 1.5rem;
    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logo-container.animate {
    transform: scale(1.1);
  }

  .logo {
    width: 250px;
    height: 250px;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(65, 182, 230, 0.7));
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .welcome-text {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: white;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .copyright {
    position: absolute;
    bottom: 2rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    opacity: 0;
    animation: fadeIn 1s 2.5s forwards;
  }

  .hide-cursor {
    cursor: none;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .logo {
      width: 100px;
      height: 100px;
    }
    
    .welcome-text {
      font-size: 1.75rem;
    }
    
    .copyright {
      font-size: 0.875rem;
      bottom: 1.5rem;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .logo {
      width: 80px;
      height: 80px;
    }
    
    .welcome-text {
      font-size: 1.5rem;
    }
  }
</style>