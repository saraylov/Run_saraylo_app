<script context="module">
  // This runs in module context (once, when the module is first imported)
  // We can't access window here as it doesn't exist in server-side rendering
</script>

<script>
  import { onMount, afterUpdate } from 'svelte';
  import Splashscreen from './lib/Splashscreen.svelte';
  
  // State for splash screen
  let showSplash = true;
  
  // State for authentication
  let isAuthenticated = false;
  let user = null;
  
  // Bubble animation state
  let bubbles = [];
  let bubbleIdCounter = 0;
  
  // Initialize bubble animation
  onMount(() => {
    // Start bubble animation
    animateBubbles();
    
    // Start creating bubbles sequentially
    createBubbleSequentially();
    
    // Add Telegram auth function to window object
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.onTelegramAuth = function(telegramUser) {
        // Call the local function
        handleTelegramAuth(telegramUser);
      };
    }
    
    // Check if user is already authenticated
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('telegramUser');
    
    if (savedAuth === 'true' && savedUser) {
      isAuthenticated = true;
      user = JSON.parse(savedUser);
    }
    
    // Hide splash screen after 5 seconds
    setTimeout(() => {
      showSplash = false;
    }, 5000);
  });
  
  // Create bubbles one by one at intervals
  function createBubbleSequentially() {
    // Create a single bubble
    const newBubble = {
      id: bubbleIdCounter++,
      x: Math.random() * 100,
      y: 110 + Math.random() * 20, // Start below the screen
      size: 2.8125 + Math.random() * 6.5625, // Increased size in rem (45-150px converted to rem)
      speed: 0.05, // Slowed down speed in rem per frame (was 0.2)
      color: getRandomColor(), // Random color
      rotation: Math.random() * 360, // Random initial rotation
      rotationSpeed: -2 + Math.random() * 4, // Rotation speed in degrees per frame
      // Zigzag movement properties
      initialX: Math.random() * 100,
      amplitude: 2 + Math.random() * 4, // Horizontal movement amplitude in rem
      frequency: 0.02 + Math.random() * 0.03, // Zigzag frequency
      phase: Math.random() * Math.PI * 2 // Random starting phase
    };
    
    // Add the new bubble to the array
    bubbles = [...bubbles, newBubble];
    
    // Limit the number of bubbles to prevent performance issues (increased from 30 to 60)
    if (bubbles.length > 60) {
      bubbles = bubbles.slice(1); // Remove the oldest bubble
    }
    
    // Schedule the next bubble creation (increased frequency: every 500ms instead of 1000ms)
    setTimeout(createBubbleSequentially, 500); // Create a new bubble every 0.5 seconds
  }
  
  // Get random color from Miami Vice palette
  function getRandomColor() {
    const colors = [
      '#41B6E6', // Miami Blue
      '#db3eb1', // Miami Pink
      '#FFFFFF'  // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Animate bubbles
  function animateBubbles() {
    bubbles = bubbles.map(bubble => {
      // Calculate zigzag movement
      let newY = bubble.y - bubble.speed;
      let newX = bubble.initialX + Math.sin(newY * bubble.frequency + bubble.phase) * bubble.amplitude;
      let newRotation = bubble.rotation + bubble.rotationSpeed;
      
      // Reset bubble when it goes off screen
      if (newY < -20) {
        // Instead of resetting, we'll remove it and let the sequential creation add new ones
        return null;
      }
      return { 
        ...bubble, 
        x: newX,
        y: newY,
        rotation: newRotation
      };
    }).filter(bubble => bubble !== null); // Remove bubbles that are off-screen
    
    requestAnimationFrame(animateBubbles);
  }
  
  // Handle Telegram authentication
  function handleTelegramAuth(telegramUser) {
    console.log('Logged in as', telegramUser);
    user = telegramUser;
    isAuthenticated = true;
    
    // Store user data in localStorage
    localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
    localStorage.setItem('isAuthenticated', 'true');
  }
  
  // Emulate authentication for testing
  function emulateAuth() {
    const mockUser = {
      id: 123456789,
      first_name: "Тестовый",
      last_name: "Пользователь",
      username: "testuser",
      photo_url: "",
      auth_date: Math.floor(Date.now() / 1000),
      hash: "mock_hash_for_testing"
    };
    
    handleTelegramAuth(mockUser);
  }
  
  // Logout function
  function logout() {
    isAuthenticated = false;
    user = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('telegramUser');
  }
</script>

<main>
  {#if showSplash}
    <Splashscreen />
  {:else}
    <!-- Bubbles background -->
    <div class="bubbles-container">
      {#each bubbles as bubble (bubble.id)}
        <div 
          class="bubble" 
          style="left: {bubble.x}%; top: {bubble.y}%; width: {bubble.size}rem; height: {bubble.size}rem; color: {bubble.color}; transform: rotate({bubble.rotation}deg);"
        >
          S
        </div>
      {/each}
    </div>
    
    {#if !isAuthenticated}
      <!-- Login Page -->
      <div class="glass-panel login-panel">
        <header class="header">
          <h1>Vice Run</h1>
        </header>
        
        <div class="login-content">
          <p class="login-description">Войдите через Telegram для начала использования приложения</p>
          
          <!-- Telegram Login Widget -->
          <div class="telegram-login-container">
            <script async src="https://telegram.org/js/telegram-widget.js?22" 
                    data-telegram-login="Saraylo_bot" 
                    data-size="large" 
                    data-onauth="onTelegramAuth(user)" 
                    data-request-access="write"></script>
          </div>
          
          <!-- Emulation Button for Testing -->
          <button class="emulate-auth-button" on:click={emulateAuth}>
            Эмитация авторизации
          </button>
        </div>
      </div>
    {:else}
      <!-- Main Application (after login) -->
      <div class="glass-panel app-panel">
        <header class="header">
          <h1>Vice Run</h1>
          <div class="user-info">
            <span>Привет, {user.first_name}!</span>
            <button class="logout-button" on:click={logout}>Выйти</button>
          </div>
        </header>
        
        <div class="welcome-message">
          <p>Добро пожаловать в Vice Run Tracker!</p>
          <p>Вы успешно вошли через Telegram.</p>
        </div>
        
        <!-- Placeholder for the actual running tracker functionality -->
        <div class="app-features">
          <p>Здесь будет основной функционал трекера активности</p>
          <ul>
            <li>Отслеживание пробежек</li>
            <li>Статистика тренировок</li>
            <li>Достижения и награды</li>
          </ul>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 1.25rem; /* 20px in rem */
    min-height: 100vh;
    background: linear-gradient(135deg, #000000 0%, #41B6E6 50%, #db3eb1 100%);
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    color: #FFFFFF;
    overflow-x: hidden;
    position: relative;
  }
  
  :global(#app) {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
    position: relative;
    z-index: 20;
  }
  
  /* Bubbles background */
  .bubbles-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }
  
  .bubble {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: calc(1em + 2vw); /* Increased font size for better visibility */
    opacity: 0.7;
    text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5); /* 8px in rem */
    transition: opacity 0.3s ease;
    z-index: -1; /* Ensure bubbles are behind all other elements */
  }
  
  main {
    display: flex;
    flex-direction: column;
    gap: 1.25rem; /* 20px in rem */
    width: 90%;
    max-width: 31.25rem; /* 500px in rem */
    margin: 0 auto;
    padding: 1.25rem; /* 20px in rem */
    position: relative;
    z-index: 10;
  }
  
  /* Glass panel effect - adjusted transparency */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(0.3125rem); /* 5px in rem */
    -webkit-backdrop-filter: blur(0.3125rem); /* 5px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.3); /* 1px in rem */
    border-radius: 1.25rem; /* 20px in rem */
    padding: 1.25rem; /* 20px in rem */
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1); /* 4px, 16px in rem */
    position: relative;
    z-index: 15;
  }
  
  /* Header */
  .header {
    text-align: center;
    padding: 0.9375rem; /* 15px in rem */
  }
  
  .header h1 {
    margin: 0;
    font-size: 1.25rem; /* 2rem in rem */
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Login Panel */
  .login-panel {
    text-align: center;
  }
  
  .login-description {
    font-size: 1rem;
    margin: 1.5rem 0;
    opacity: 0.9;
  }
  
  .telegram-login-container {
    margin: 2rem 0;
  }
  
  /* Emulation Button */
  .emulate-auth-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(0.1875rem); /* 3px in rem */
    -webkit-backdrop-filter: blur(0.1875rem); /* 3px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.3); /* 1px in rem */
    border-radius: 0.3125rem; /* 5px in rem */
    color: white;
    padding: 0.625rem 1.25rem; /* 10px 20px in rem */
    cursor: pointer;
    font-size: 1rem; /* 16px in rem */
    margin-top: 1.25rem; /* 20px in rem */
  }
  
  .emulate-auth-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* App Panel (after login) */
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  
  .logout-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(0.1875rem); /* 3px in rem */
    -webkit-backdrop-filter: blur(0.1875rem); /* 3px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.3); /* 1px in rem */
    border-radius: 0.3125rem; /* 5px in rem */
    color: white;
    padding: 0.3125rem 0.625rem; /* 5px 10px in rem */
    cursor: pointer;
    font-size: 0.875rem; /* 14px in rem */
  }
  
  .logout-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .welcome-message {
    text-align: center;
    margin: 1.5rem 0;
    font-size: 1.125rem; /* 18px in rem */
  }
  
  .app-features {
    margin: 1.5rem 0;
  }
  
  .app-features ul {
    text-align: left;
    margin-top: 1rem;
    padding-left: 1.25rem; /* 20px in rem */
  }
  
  .app-features li {
    margin-bottom: 0.625rem; /* 10px in rem */
  }
  
  /* Responsive design */
  @media (max-width: 37.5rem) { /* 600px in rem */
    main {
      padding: 0.625rem; /* 10px in rem */
    }
    
    .header h1 {
      font-size: 1.5rem; /* Increased for better visibility on mobile */
    }
  }
  
  /* Additional breakpoints for better responsiveness */
  @media (min-width: 48rem) { /* 768px in rem */
    main {
      width: 85%;
    }
  }
  
  @media (min-width: 64rem) { /* 1024px in rem */
    main {
      width: 80%;
      max-width: 37.5rem; /* 600px in rem */
    }
    
    .header h1 {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 90rem) { /* 1440px in rem */
    main {
      width: 75%;
      max-width: 43.75rem; /* 700px in rem */
    }
  }
  
  @media (min-width: 120rem) { /* 1920px in rem */
    main {
      width: 70%;
      max-width: 50rem; /* 800px in rem */
    }
  }
  
  @media (min-width: 160rem) { /* 2560px in rem */
    main {
      width: 65%;
      max-width: 56.25rem; /* 900px in rem */
    }
    
    .header h1 {
      font-size: 2.5rem;
    }
  }
</style>