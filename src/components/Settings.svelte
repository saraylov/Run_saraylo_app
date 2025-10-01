<script>
  import { onMount } from 'svelte';
  import AuthService from '../lib/AuthService.js';
  import Header from './Header.svelte'; // Import the new Header component

  // Props using Svelte 5 runes
  const { user: userProp, onBack, onLogout, onBluetoothDevices } = $props();

  // Fallback to AuthService if no user prop provided
  let isLoading = $state(true);
  let errorMessage = $state('');
  let user = $state(userProp || null); // Local reactive user variable
  
  // Settings state
  let notificationsEnabled = $state(true);
  let darkMode = $state(false);
  let language = $state('ru');
  
  // Available languages
  const languages = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' }
  ];

  onMount(async () => {
    try {
      // If no user prop provided, check AuthService (for non-permanent auth mode)
      if (!user) {
        const authData = AuthService.getAuthData();
        if (authData && authData.user) {
          user = authData.user;
        } else {
          errorMessage = 'Пользователь не авторизован';
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      errorMessage = 'Ошибка загрузки данных пользователя';
    } finally {
      isLoading = false;
    }
  });

  // Save settings function
  function saveSettings() {
    // In a real app, you would save these settings to a backend or localStorage
    console.log('Settings saved:', { notificationsEnabled, darkMode, language });
    alert('Настройки сохранены!');
  }
  
  // Reset settings to defaults
  function resetSettings() {
    notificationsEnabled = true;
    darkMode = false;
    language = 'ru';
  }
  
  // Go back function - modified to navigate to Profile page
  function goBack() {
    // Dispatch a custom event to navigate to the profile tab
    const event = new CustomEvent('tabChanged', {
      detail: { tab: 'profile' }
    });
    window.dispatchEvent(event);
  }
  
  // Navigate to Bluetooth devices function
  function goToBluetoothDevices() {
    if (onBluetoothDevices) onBluetoothDevices();
  }
  
  // Logout function
  function logout() {
    if (onLogout) onLogout();
  }
</script>

{#if isLoading}
  <div class="loading">Загрузка...</div>
{:else if errorMessage}
  <div class="error-message">{errorMessage}</div>
{:else if user}
  <div class="settings-container">
    <!-- Use the new unified Header component -->
    <Header title="Настройки" showBackButton={true} onBack={goBack} />
    
    <div class="glass-panel settings-panel">
      <!-- Round pencil button in top right corner -->
      <button class="round-pencil-button">
        <span class="pencil-icon">✏️</span>
      </button>
      
      <div class="settings-section">
        <h2 class="section-title">Основные настройки</h2>
        
        <div class="setting-item">
          <label class="setting-label">Уведомления</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" bind:checked={notificationsEnabled}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">Темная тема</label>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" bind:checked={darkMode}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">Язык</label>
          <select class="language-select" bind:value={language}>
            {#each languages as lang}
              <option value={lang.value}>{lang.label}</option>
            {/each}
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h2 class="section-title">Аккаунт</h2>
        
        <div class="setting-item">
          <label class="setting-label">Имя пользователя</label>
          <div class="user-info-display">
            <span>{user.first_name} {user.last_name || ''}</span>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">ID пользователя</label>
          <div class="user-info-display">
            <span>{user.id}</span>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h2 class="section-title">Устройства</h2>
        
        <div class="setting-item">
          <label class="setting-label">Bluetooth устройства</label>
          <button class="bluetooth-button" on:click={goToBluetoothDevices}>
            Управление устройствами
          </button>
        </div>
      </div>
      
      <div class="settings-actions">
        <button class="action-button secondary" on:click={resetSettings}>
          Сбросить
        </button>
        <button class="action-button primary" on:click={saveSettings}>
          Сохранить
        </button>
      </div>
      
      <!-- Logout button inside the settings panel -->
      <div class="settings-actions">
        <button class="action-button logout" on:click={logout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="error-message">Пользователь не авторизован</div>
{/if}

<style>
  .loading, .error-message {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }
  
  .error-message {
    color: #ff6b6b;
  }
  
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
  
  /* Round pencil button styling */
  .round-pencil-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }
  
  .round-pencil-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  /* Pencil icon styling */
  .pencil-icon {
    font-size: 1.2rem;
    color: white;
  }

  .settings-section {
    margin-bottom: 2rem;
  }
  
  .settings-section:last-child {
    margin-bottom: 0;
  }
  
  .section-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    color: white;
    font-weight: 600;
    border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.2);
    padding-bottom: 0.5rem;
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .setting-item:last-child {
    margin-bottom: 0;
  }
  
  .setting-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    flex: 1;
  }
  
  .switch-container {
    display: flex;
    align-items: center;
  }
  
  /* Switch styling */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
  
  .language-select {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem;
    font-size: 1rem;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }
  
  .user-info-display {
    background: rgba(255, 255, 255, 0.05);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* Bluetooth button styling */
  .bluetooth-button {
    background: rgba(65, 182, 230, 0.12); /* Miami Blue with transparency */
    color: #41B6E6; /* Miami Blue */
    border: 0.0625rem solid rgba(65, 182, 230, 0.25); /* Miami Blue with transparency */
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }
  
  .bluetooth-button:hover {
    background: rgba(65, 182, 230, 0.2); /* Miami Blue with more transparency */
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .settings-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .action-button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
  }
  
  .action-button.primary {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }
  
  .action-button.secondary {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }
  
  .action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }
  
  .action-button.primary:hover {
    background: linear-gradient(90deg, #3a9fd0, #c837a0);
  }
  
  .action-button.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  /* Logout button styling inside settings panel */
  .action-button.logout {
    background: rgba(219, 62, 177, 0.12); /* Miami Pink with transparency */
    color: #db3eb1; /* Miami Pink */
    border: 0.0625rem solid rgba(219, 62, 177, 0.25); /* Miami Pink with transparency */
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }
  
  .action-button.logout:hover {
    background: rgba(219, 62, 177, 0.2); /* Miami Pink with more transparency */
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
</style>