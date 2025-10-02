<script>
  // Props using Svelte 5 runes
  const { onSettings } = $props();
</script>

<!-- Settings Button -->
<button class="settings-button" on:click={onSettings}>
  Настройки аккаунта
</button>

<style>
  /* Settings Button */
  .settings-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.75rem;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 
      0 0.25rem 0.75rem rgba(0, 0, 0, 0.15),
      inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 0.5rem;
    position: relative;
    z-index: 5;
  }
  
  .settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-0.125rem);
    box-shadow: 
      0 0.5rem 1rem rgba(0, 0, 0, 0.2),
      inset 0 0.0625rem 0.1875rem rgba(255, 255, 255, 0.3);
  }
</style>