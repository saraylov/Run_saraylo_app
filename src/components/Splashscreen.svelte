<script>
  import { onMount } from 'svelte';

  // State for animation phases
  let backgroundVisible = false;
  let contentVisible = false;

  // Cursor hiding and input blocking
  let hideCursor = true;

  onMount(() => {
    // Phase 1: Background fade-in (1.5 seconds)
    setTimeout(() => {
      backgroundVisible = true;
    }, 0);

    // Phase 2: Content fade-in (after 2 seconds delay from start)
    setTimeout(() => {
      contentVisible = true;
    }, 2000);

    // Re-enable cursor after splash screen (optional - can be controlled by parent)
    // setTimeout(() => {
    //   hideCursor = false;
    // }, 5000);
  });
</script>

<div class="splash-screen {hideCursor ? 'hide-cursor' : ''}" class:visible={backgroundVisible}>
  <div class="splash-content" class:visible={contentVisible}>
    <div class="logo-container">
      <img src="/image/logo/logo.png" alt="Logo" class="logo" />
    </div>
    <h1 class="welcome-text">Добро пожаловать</h1>
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
    transition: background 1.5s ease-out;
  }

  .splash-screen.visible {
    background: linear-gradient(135deg, #000000 0%, #41B6E6 50%, #db3eb1 100%);
  }

  .splash-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 1s ease-out;
  }

  .splash-content.visible {
    opacity: 1;
  }

  .logo-container {
    margin-bottom: 1.5rem;
  }

  .logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }

  .welcome-text {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: white;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .copyright {
    position: absolute;
    bottom: 2rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }

  .hide-cursor {
    cursor: none;
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