<script>
  import Header from '../Header.svelte';
  
  // Props using Svelte 5 runes
  const { title, showSettingsButton, showHistoryButton, onSettings, onHistory } = $props();
</script>

<Header 
  title={title} 
  showSettingsButton={showSettingsButton} 
  showHistoryButton={showHistoryButton} 
  onSettings={onSettings} 
  onHistory={onHistory} 
/>

<style>
</style>