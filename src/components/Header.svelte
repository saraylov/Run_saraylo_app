<script>
  import { onMount } from 'svelte';
  
  // Export props for customization
  export let title = 'Заголовок';
  export let showBackButton = false;
  export let showSettingsButton = false;
  export let showHistoryButton = false; // New prop to control history button
  export let showCircularButton = false; // New prop to control circular button
  export let onBack = null;
  export let onSettings = null;
  export let onHistory = null; // New prop for history function
  
  // Handle back button click
  function handleBack() {
    if (onBack) onBack();
  }
  
  // Handle settings button click
  function handleSettings() {
    if (onSettings) onSettings();
  }
  
  // Handle history button click
  function handleHistory() {
    if (onHistory) onHistory();
  }
</script>

<header class="unified-header">
  {#if showBackButton}
    <button class="header-button back-button" on:click={handleBack}>
      <span class="button-icon">←</span>
    </button>
  {:else if showHistoryButton}
    <button class="header-button history-button" on:click={handleHistory}>
      <span class="button-icon">H</span>
    </button>
  {:else if showCircularButton}
    <button class="header-button circular-button">
      <span class="button-icon">●</span>
    </button>
  {:else}
    <div class="button-placeholder"></div>
  {/if}
  
  <h1 class="header-title">{title}</h1>
  
  {#if showSettingsButton}
    <button class="header-button settings-button" on:click={handleSettings}>
      <img src="/icons/settings.png" alt="Settings" class="button-icon-image" />
    </button>
  {:else}
    <div class="button-placeholder"></div>
  {/if}
</header>

<style>
  .unified-header {
    position: fixed;
    top: 2rem; /* Поднять от верхнего края экрана, аналогично TabBar */
    left: 50%; /* Центрировать горизонтально */
    transform: translateX(-50%); /* Сдвинуть влево на половину ширины */
    width: 90%; /* Ширина панели */
    max-width: 31.25rem; /* Максимальная ширина 500px */
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    z-index: 1000;
    
    /* Glass panel effect - matching TabBar */
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem; /* Закругленные углы */
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
  }
  
  .header-title {
    margin: 0;
    font-size: 1.5rem;
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    flex: 1;
    padding: 0 1rem;
  }
  
  .header-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem); /* 5px in rem */
    -webkit-backdrop-filter: blur(0.3125rem); /* 5px in rem */
    border: 0.0625rem solid rgba(255, 255, 255, 0.25); /* 1px in rem */
    border-radius: 0.5rem; /* 8px in rem */
    color: white;
    width: 48px;
    height: 48px;
    cursor: pointer;
    font-size: 1rem;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }
  
  .history-button {
    border-radius: 50%; /* Make it circular */
    width: 40px;
    height: 40px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .circular-button {
    border-radius: 50%; /* Make it circular */
    width: 40px;
    height: 40px;
  }
  
  .header-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .history-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .circular-button:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }
  
  .button-placeholder {
    width: 48px; /* Same width as buttons to maintain spacing */
  }
  
  .button-icon {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .button-icon-image {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
</style>