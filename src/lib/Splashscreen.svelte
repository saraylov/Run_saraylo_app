<script>
  import { onMount } from 'svelte';
  
  let showContent = false;
  let hideCursor = false;
  
  onMount(() => {
    // Hide cursor after 100ms
    setTimeout(() => {
      hideCursor = true;
    }, 100);
    
    // Show content after 2 seconds (1.5s background fade + 0.5s delay)
    setTimeout(() => {
      showContent = true;
    }, 2000);
  });
</script>

<div class="splash-container {hideCursor ? 'hide-cursor' : ''}">
  <div class="splash-background">
    <div class="content {showContent ? 'visible' : ''}">
      <div class="logo-container">
        <img src="/image/logo.png" alt="Saraylo Logo" class="logo" />
      </div>
      <h1 class="welcome-text">Добро пожаловать</h1>
      <div class="copyright">Создано студией Saraylo</div>
    </div>
  </div>
</div>

<style>
  .splash-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #000000; /* Start with black */
    animation: fadeInBackground 1.5s forwards;
  }
  
  .hide-cursor {
    cursor: none;
  }
  
  @keyframes fadeInBackground {
    from {
      background-color: #000000;
    }
    to {
      background-color: #f5f5f5; /* Light background like iOS */
    }
  }
  
  .splash-background {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }
  
  .content.visible {
    opacity: 1;
  }
  
  .logo-container {
    margin-bottom: 2rem;
  }
  
  .logo {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }
  
  .welcome-text {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin: 0;
    text-align: center;
  }
  
  .copyright {
    position: absolute;
    bottom: 2rem;
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-size: 0.9rem;
    color: #666;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .logo {
      width: 100px;
      height: 100px;
    }
    
    .welcome-text {
      font-size: 1.2rem;
    }
    
    .copyright {
      font-size: 0.8rem;
      bottom: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .logo {
      width: 80px;
      height: 80px;
    }
    
    .logo-container {
      margin-bottom: 1.5rem;
    }
    
    .welcome-text {
      font-size: 1rem;
    }
    
    .copyright {
      font-size: 0.7rem;
      bottom: 1rem;
    }
  }
</style>