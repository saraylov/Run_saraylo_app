<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte'; // Import the new Header component
  import ActivityRings from './ActivityRings.svelte'; // Import the new Activity Rings component

  // User data - permanent authentication
  let user = $state({
    id: 123456789,
    first_name: "Тестовый",
    last_name: "Пользователь",
    username: "testuser"
  });
  let isLoading = $state(false); // No loading needed for permanent auth
  
  // Function props using Svelte 5 runes
  const { onLogout, onSettings, onTest, onHealth, onExercises } = $props();

  // Steps data
  let steps = $state(7234); // Example steps data
  let stepsGoal = $state(10000); // Default goal

  // Logout function
  function logout() {
    // For permanent auth, we'll just simulate a logout/login cycle
    if (onLogout) onLogout();
  }
  
  // Go to settings function
  function goToSettings() {
    console.log('Go to settings button clicked');
    if (onSettings) {
      console.log('Calling onSettings function');
      onSettings();
    } else {
      console.log('onSettings function is not defined');
    }
  }
  
  // Go to test function
  function goToTest() {
    console.log('Go to test button clicked');
    if (onTest) {
      console.log('Calling onTest function');
      onTest();
    } else {
      console.log('onTest function is not defined');
    }
  }
  
  // Go to health function
  function goToHealth() {
    console.log('Go to health button clicked');
    if (onHealth) {
      console.log('Calling onHealth function');
      onHealth();
    } else {
      console.log('onHealth function is not defined');
    }
  }
  
  // Go to exercises function
  function goToExercises() {
    console.log('Go to exercises button clicked');
    if (onExercises) {
      console.log('Calling onExercises function');
      onExercises();
    } else {
      console.log('onExercises function is not defined');
    }
  }
  
  // Handle calendar button click
  function handleCalendarClick() {
    console.log('Calendar button clicked');
    // Implement calendar functionality here
  }
</script>

{#if isLoading}
  <div class="loading">Загрузка...</div>
{:else if user}
  <!-- Use the new unified Header component -->
  <Header title="Статистика" showSettingsButton={true} onSettings={goToSettings} />
  
  <!-- Activity Rings Panel -->
  <div class="glass-panel activity-panel">
    <h2 class="panel-title">Прогресс активности</h2>
    <ActivityRings 
      hasData={true} 
      showWhenNoData={true} 
      steps={steps}
      stepsGoal={stepsGoal}
    />
    
    <!-- Health Button -->
    <button class="health-button" on:click={goToHealth}>
      Здоровье
    </button>
    
    <!-- Exercises Button -->
    <button class="exercises-button" on:click={goToExercises}>
      Упражнения
    </button>
    
    {#if onTest}
      <button class="test-button" on:click={goToTest}>
        Перейти к тесту компонента
      </button>
    {/if}
  </div>
{:else}
  <!-- This shouldn't happen with permanent auth -->
  <div class="loading">Ошибка загрузки</div>
{/if}

<style>
  .loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }
  
  /* Add margin-top to account for fixed header */
  .glass-panel {
    margin-top: 80px; /* Header height (60px) + top offset (1rem ≈ 16px) + some spacing */
    
    /* Enhanced Glass panel effect - thicker glass appearance */
    background: rgba(255, 255, 255, 0.12); /* Increased opacity for thicker appearance */
    backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    -webkit-backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    border: 0.125rem solid rgba(255, 255, 255, 0.25); /* Thicker border */
    border-radius: 1.5rem; /* Slightly increased radius */
    padding: 1.5rem; /* Increased padding */
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3), /* Enhanced shadow */
      inset 0 0 2rem rgba(255, 255, 255, 0.2), /* Inner glow for thickness */
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15), /* Bottom inner light */
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2); /* Top inner light */
    position: relative;
    z-index: 15;
    overflow: hidden;
  }
  
  .activity-panel {
    margin-top: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .panel-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .health-button, .exercises-button, .test-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    min-width: 200px;
    margin-top: 1rem;
  }
  
  .health-button:hover, .exercises-button:hover, .test-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.3);
  }
  
  .health-button:active, .exercises-button:active, .test-button:active {
    transform: translateY(0);
  }
  
  /* Page header with title */
  .page-header {
    text-align: center;
    padding: 1rem 0;
    margin: 1rem 0;
    border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.2);
  }
  
  .page-title {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
  }
  
  .welcome-message {
    text-align: center;
    margin: 1.5rem 0;
    font-size: 1.125rem;
  }
  
  .app-features {
    margin: 1.5rem 0;
  }
  
  .app-features ul {
    text-align: left;
    margin-top: 1rem;
    padding-left: 1.25rem;
  }
  
  .app-features li {
    margin-bottom: 0.625rem;
  }
</style>