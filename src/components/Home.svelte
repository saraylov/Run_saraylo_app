<script>
  import { onMount } from 'svelte';

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
</script>

{#if isLoading}
  <div class="loading">Загрузка...</div>
{:else if user}
  <!-- Header separated from main panel -->
  <header class="header separate-header">
    <h1>Главная</h1>
    <div class="user-info">
      <button class="settings-button" on:click={goToSettings}>
        <span class="gear-icon">⚙️</span>
      </button>
    </div>
  </header>
  
  <div class="glass-panel home-panel">
    <!-- Page header with page title -->
    <div class="page-header">
      <h2 class="page-title">Главная страница</h2>
    </div>
    
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
  
  /* Separate header styling with glass panel effect */
  .separate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    margin-bottom: 1.5rem;
    border-radius: 1.5rem; /* Same as glass panel */
    
    /* Glass panel effect - matching main panel */
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(0.625rem);
    -webkit-backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.18);
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
    position: relative;
    z-index: 15;
  }
  
  .separate-header h1 {
    margin: 0;
    font-size: 1.5rem;
    /* Matching gradient background as main panel */
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Gear icon styling */
  .gear-icon {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Settings button styling */
  .settings-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    font-size: 0.875rem;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
  }
  
  .settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  /* Glass panel effect */
  .glass-panel {
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
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
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