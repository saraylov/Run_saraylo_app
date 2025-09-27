<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte'; // Import the new Header component
  import ActivityRings from './ActivityRings.svelte'; // Import the Activity Rings component
  // Removed import for ConcentricActivityPanel as requested

  // User data - permanent authentication
  let user = {
    id: 123456789,
    first_name: "Тестовый",
    last_name: "Пользователь",
    username: "testuser"
  };
  let isLoading = false; // No loading needed for permanent auth
  export let onLogout; // Function to call when user "logs out" (optional)
  export let onSettings; // Function to call when user wants to go to settings (optional)

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
  <Header title="Главная" showSettingsButton={true} onSettings={goToSettings} />
  
  <!-- Activity Rings Panel -->
  <div class="activity-panel glass-panel">
    <!-- Calendar button in top right corner -->
    <button class="calendar-button" on:click={handleCalendarClick} aria-label="Календарь">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </button>
    
    <h2 class="panel-title">Ваша активность сегодня</h2>
    <ActivityRings />
    
    <!-- Legend for Activity Rings -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #41B6E6;"></div>
        <span class="legend-label">Калории</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #db3eb1;"></div>
        <span class="legend-label">Шаги</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #FFFFFF;"></div>
        <span class="legend-label">Сон</span>
      </div>
    </div>
  </div>
  
  <!-- New Concentric Activity Panel -->
  <!-- Removed panel with title "Прогресс активности" as requested -->
  
  <!-- Daily Activity Panel -->
  <!-- Removed as requested by user -->
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
    
    /* Glass panel effect */
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(0.625rem);
    -webkit-backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
    position: relative;
    z-index: 15;
  }
  
  .activity-panel {
    margin-top: 1rem;
    text-align: center;
  }
  
  .panel-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  /* Calendar button styles */
  .calendar-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    transition: all 0.2s ease;
  }
  
  .calendar-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .calendar-button svg {
    color: white;
  }
  
  /* Legend styles */
  .legend {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .legend-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
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