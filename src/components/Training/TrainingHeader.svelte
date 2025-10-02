<script>
  import Header from '../Header.svelte';
  
  // Props using Svelte 5 runes
  const { title, showSettingsButton, onSettings, onBack } = $props();
</script>

<Header title={title} showSettingsButton={showSettingsButton} onSettings={onSettings} onBack={onBack} />

<style>
</style>