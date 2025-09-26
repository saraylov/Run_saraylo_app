<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte'; // Import the new Header component

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
  <!-- Use the new unified Header component -->
  <Header title="Главная" showSettingsButton={true} onSettings={goToSettings} />
  
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