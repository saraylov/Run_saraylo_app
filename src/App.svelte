<script>
  import { onMount, tick } from 'svelte';
  import { createEventDispatcher } from 'svelte'; // Import createEventDispatcher
  import SplashScreen from './components/Splashscreen.svelte';
  import Home from './components/Home.svelte';
  import Settings from './components/Settings.svelte';
  import Profile from './components/Profile.svelte';
  import BluetoothDevices from './components/BluetoothDevices.svelte';
  import Heart from './components/Heart.svelte';
  import Exercises from './components/Exercises.svelte';
  import Training from './components/Training.svelte';
  import TabBar from './components/TabBar.svelte';
  import ActivityRingsTest from './components/ActivityRingsTest.svelte';
  import History from './components/History.svelte';
  import { showTabBar, hideTabBar } from './lib/tabBarStore.js';
  import TapBarReady from './components/TapBarReady.svelte'; // Импорт нового компонента TapBarReady
  import { workoutSelected, resetWorkoutSelection } from './lib/workoutSelectionStore.js'; // Импорт хранилища выбора тренировки

  // State for authentication
  let isAuthenticated = $state(true); // Always authenticated
  let user = $state({
    id: 123456789,
    first_name: "Тестовый",
    last_name: "Пользователь",
    username: "testuser",
    avatar: "/images/default-avatar.png",
    join_date: "2023-01-15",
    total_steps: 125430,
    achievements: 15,
    level: 7
  });
  
  let currentView = $state('splash'); // 'splash', 'home', 'settings', 'test'
  
  // Splash screen state
  let showSplash = $state(true);
  let splashTransitioning = $state(false);
  let panelAnimationStage = $state(0); // 0: hidden, 1: appearing, 2: visible
  
  // Bubble animation state
  let bubbles = $state([]);
  let bubbleIdCounter = $state(0);
  
  // Add debugging
  console.log('App component mounting');
  
  // Initialize bubble animation
  onMount(() => {
    console.log('App onMount called');
    // Start bubble animation
    animateBubbles();
    
    // Start creating bubbles sequentially
    createBubbleSequentially();
  });
  
  // Handle splash screen transition
  function handleSplashTransition() {
    console.log('handleSplashTransition called');
    splashTransitioning = true;
    panelAnimationStage = 1; // Start panel appearing animation
    
    // After splash screen, go directly to home
    setTimeout(() => {
      currentView = 'home';
      showSplash = false;
      showTabBar(); // Show TabBar when transitioning to home
      console.log('Splash transition complete, currentView set to:', currentView);
      
      // Start the panel animation sequence with a smoother transition
      setTimeout(() => {
        panelAnimationStage = 2; // Panel fully visible
      }, 50); // Reduced delay for smoother transition
    }, 1500); // Match the fade-out duration
  }
  
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
  
  // Handle navigation to Bluetooth devices
  function handleGoToBluetoothDevices() {
    console.log('handleGoToBluetoothDevices called, setting currentView to bluetooth');
    currentView = 'bluetooth';
    showTabBar(); // Show TabBar on Bluetooth devices page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation back from Bluetooth devices
  function handleBluetoothDevicesBack() {
    console.log('handleBluetoothDevicesBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Keep TabBar visible on home page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation to health page
  function handleGoToHealth() {
    console.log('handleGoToHealth called, setting currentView to health');
    currentView = 'health';
    showTabBar(); // Show TabBar on health page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation back from health page
  function handleHealthBack() {
    console.log('handleHealthBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Keep TabBar visible on home page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation to exercises page
  function handleGoToExercises() {
    console.log('handleGoToExercises called, setting currentView to exercises');
    currentView = 'exercises';
    showTabBar(); // Show TabBar on exercises page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation to training page
  function handleGoToTraining() {
    console.log('handleGoToTraining called, setting currentView to training');
    currentView = 'training';
    showTabBar(); // Show TabBar on training page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation back from exercises page
  function handleExercisesBack() {
    console.log('handleExercisesBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Keep TabBar visible on home page
    // Reset workout selection when leaving exercises page
    resetWorkoutSelection();
    console.log('currentView is now:', currentView);
  }

  // Handle navigation to settings
  function handleGoToSettings() {
    console.log('handleGoToSettings called, setting currentView to settings');
    currentView = 'settings';
    showTabBar(); // Show TabBar on settings page
    console.log('currentView is now:', currentView);
  }

  // Handle navigation back from settings
  function handleSettingsBack() {
    console.log('handleSettingsBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Keep TabBar visible on home page
    console.log('currentView is now:', currentView);
  }
  
  // Handle navigation to test page
  function handleGoToTest() {
    console.log('handleGoToTest called, setting currentView to test');
    currentView = 'test';
    hideTabBar(); // Hide TabBar on test page
    console.log('currentView is now:', currentView);
  }
  
  // Handle navigation back from test
  function handleTestBack() {
    console.log('handleTestBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Show TabBar when returning to home
    console.log('currentView is now:', currentView);
  }
  
  // Handle navigation back from history page
  function handleHistoryBack() {
    console.log('handleHistoryBack called, setting currentView to home');
    currentView = 'home';
    showTabBar(); // Keep TabBar visible on home page
    // Reset workout selection when leaving history page
    resetWorkoutSelection();
    console.log('currentView is now:', currentView);
  }
  
  // Logout function - now just for testing transitions
  function handleLogout() {
    // Hide TabBar during logout
    hideTabBar();
    
    // For permanent auth, we'll just simulate a logout/login cycle
    currentView = 'login'; // This will show nothing since we removed the login view
    // Immediately go back to home
    setTimeout(() => {
      currentView = 'home';
      showTabBar(); // Show TabBar when returning to home
      // Reset workout selection when logging out
      resetWorkoutSelection();
    }, 100);
  }
  
  // Function to update TabBar visibility based on current view
  function updateTabBarVisibility() {
    if (currentView === 'splash' || currentView === 'training') {
      hideTabBar();
    } else if (currentView === 'home' || currentView === 'settings' || currentView === 'profile' || currentView === 'bluetooth' || currentView === 'health' || currentView === 'exercises' || currentView === 'history') {
      showTabBar();
    } else {
      hideTabBar();
    }
  }
  
  // Handle central button click
  function handleCentralButtonClick() {
    console.log('Central button clicked!');
    // For now, we'll just log the click
    // You can implement any functionality you want here
  }
  
  // Handle tab changes from TabBar
  function handleTabChange(event) {
    const { tab } = event.detail;
    console.log('Tab changed to:', tab);
    
    switch (tab) {
      case 'home':
        currentView = 'home';
        break;
      case 'profile':
        currentView = 'profile';
        break;
      case 'bluetooth':
        // Navigate to Bluetooth devices page
        currentView = 'bluetooth';
        break;
      case 'health':
        // Navigate to Health page
        currentView = 'health';
        break;
      case 'exercises':
        // Navigate to Exercises page
        currentView = 'exercises';
        break;
      case 'settings':
        // Repurpose settings tab to navigate to profile
        currentView = 'profile';
        break;
      default:
        currentView = 'home';
    }
    
    showTabBar(); // Ensure TabBar is visible
  }
  
  // Watch for changes in currentView and update TabBar visibility
  $effect(() => {
    updateTabBarVisibility();
  });
</script>

<main>
  <!-- Show splash screen initially -->
  {#if showSplash}
    <SplashScreen onSplashComplete={handleSplashTransition} />
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
    
    <!-- Home Page Component -->
    {#if currentView === 'home'}
      <Home onLogout={handleLogout} onSettings={handleGoToSettings} onTest={handleGoToTest} onHealth={handleGoToHealth} onExercises={handleGoToExercises} />
    {:else if currentView === 'settings'}
      <Settings onBack={handleSettingsBack} onLogout={handleLogout} user={user} onBluetoothDevices={handleGoToBluetoothDevices} />
    {:else if currentView === 'profile'}
      <Profile user={user} onBack={handleSettingsBack} onSettings={handleGoToSettings} onHistory={() => {
        console.log('Navigate to history');
        currentView = 'history';
      }} />
    {:else if currentView === 'bluetooth'}
      <BluetoothDevices onBack={handleBluetoothDevicesBack} onSettings={handleGoToSettings} />
    {:else if currentView === 'health'}
      <Heart onBack={handleHealthBack} onSettings={handleGoToSettings} />
    {:else if currentView === 'exercises'}
      <Exercises onBack={handleExercisesBack} onSettings={handleGoToSettings} onTraining={handleGoToTraining} />
    {:else if currentView === 'training'}
      <Training onBack={handleExercisesBack} onSettings={handleGoToSettings} on:tabChanged={handleTabChange} />
    {:else if currentView === 'history'}
      <History onBack={handleHistoryBack} onSettings={handleGoToSettings} />
    {:else if currentView === 'test'}
      <ActivityRingsTest />
    {/if}

  {/if}
  
  <!-- Global TabBar component - hidden on training page -->
  {#if currentView !== 'training'}
    {#if currentView === 'exercises'}
      <!-- Используем TapBarReady на странице упражнений -->
      <TapBarReady workoutSelected={$workoutSelected} on:startTraining={handleGoToTraining} on:tabChanged={handleTabChange} />
    {:else}
      <!-- Use regular TabBar on other pages -->
      <TabBar on:centralButtonClicked={handleCentralButtonClick} on:tabChanged={handleTabChange} />
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
    z-index: 1; /* Keep bubbles behind all UI elements */
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
    z-index: 1; /* Ensure bubbles are behind all other UI elements */
  }
  
  main {
    display: flex;
    flex-direction: column;
    gap: 1.25rem; /* 20px in rem */
    width: 87.975%;
    max-width: 30.546875rem; /* 488.75px in rem */
    margin: 0 auto;
    padding: 1.25rem; /* 20px in rem */
    position: relative;
    z-index: 10; /* Ensure main content is above bubbles */
    /* Add padding to account for floating TabBar height */
    padding-bottom: 5.5rem; /* Increased padding to account for floating TabBar (60px height + 1rem bottom offset + extra spacing) */
  }
  
  /* Enhanced Glass panel effect - more pronounced bulging effect */
  .glass-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(0.625rem); /* 10px in rem */
    -webkit-backdrop-filter: blur(0.625rem); /* 10px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.18); /* 1px in rem */
    border-radius: 1.5rem; /* 24px in rem */
    padding: 1.5rem; /* 24px in rem */
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
    position: relative;
    z-index: 15; /* Ensure glass panels are above bubbles */
    opacity: 0;
    transform: translateY(50px) scale(0.9);
    transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: blur(10px);
    /* Bulging effect with multiple box shadows */
    overflow: hidden;
  }
  
  .glass-panel::before {
    content: '';
    position: absolute;
    top: -0.625rem; /* 10px in rem */
    left: -0.625rem; /* 10px in rem */
    right: -0.625rem; /* 10px in rem */
    bottom: -0.625rem; /* 10px in rem */
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 70%,
      transparent 100%
    );
    border-radius: 2rem; /* 32px in rem */
    z-index: -1;
    pointer-events: none;
  }
  
  .glass-panel.panel-appearing {
    opacity: 0.3;
    transform: translateY(25px) scale(0.95);
    filter: blur(5px);
  }
  
  .glass-panel.panel-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  
  /* Login Panel */
  .login-panel {
    text-align: center;
  }
  
  .login-description {
    font-size: 1rem;
    margin: 1.5rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;
  }
  
  .panel-visible .login-description {
    opacity: 0.9;
    transform: translateY(0);
  }
  
  .telegram-login-container {
    margin: 2rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s;
  }
  
  .panel-visible .telegram-login-container {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Emulation Button */
  .emulate-auth-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem); /* 5px in rem */
    -webkit-backdrop-filter: blur(0.3125rem); /* 5px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.25); /* 1px in rem */
    border-radius: 0.5rem; /* 8px in rem */
    color: white;
    padding: 0.75rem 1.5rem; /* 12px 24px in rem */
    cursor: pointer;
    font-size: 1rem; /* 16px in rem */
    margin-top: 1.5rem; /* 24px in rem */
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s;
    box-shadow: 
      0 0.25rem 0.75rem rgba(0, 0, 0, 0.15),
      inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.2);
  }
  
  .panel-visible .emulate-auth-button {
    opacity: 1;
    transform: translateY(0);
  }
  
  .emulate-auth-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.5rem 1rem rgba(0, 0, 0, 0.2),
      inset 0 0.0625rem 0.1875rem rgba(255, 255, 255, 0.3);
  }
  
  /* App Panel (after login) */
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;
  }
  
  .panel-visible .user-info {
    opacity: 1;
    transform: translateY(0);
  }
  
  .logout-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem); /* 5px in rem */
    -webkit-backdrop-filter: blur(0.3125rem); /* 5px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.25); /* 1px in rem */
    border-radius: 0.5rem; /* 8px in rem */
    color: white;
    padding: 0.375rem 0.75rem; /* 6px 12px in rem */
    cursor: pointer;
    font-size: 0.875rem; /* 14px in rem */
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }
  
  .logout-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .welcome-message {
    text-align: center;
    margin: 1.5rem 0;
    font-size: 1.125rem; /* 18px in rem */
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s;
  }
  
  .panel-visible .welcome-message {
    opacity: 1;
    transform: translateY(0);
  }
  
  .app-features {
    margin: 1.5rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s;
  }
  
  
  .panel-visible .app-features {
    opacity: 1;
    transform: translateY(0);
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
  }
  
  /* Additional breakpoints for better responsiveness */
  @media (min-width: 48rem) { /* 768px in rem */
    main {
      width: 83.0875%;
    }
  }
  
  @media (min-width: 64rem) { /* 1024px in rem */
    main {
      width: 78.2%;
      max-width: 35.38125rem; /* 566.1px in rem */
    }
  }
  
  @media (min-width: 90rem) { /* 1440px in rem */
    main {
      width: 73.3125%;
      max-width: 42.765625rem; /* 684.25px in rem */
    }
  }
  
  @media (min-width: 120rem) { /* 1920px in rem */
    main {
      width: 68.425%;
      max-width: 48.875rem; /* 782px in rem */
    }
  }
  
  @media (min-width: 160rem) { /* 2560px in rem */
    main {
      width: 63.5375%;
      max-width: 55.084375rem; /* 881.35px in rem */
    }
  }
</style>