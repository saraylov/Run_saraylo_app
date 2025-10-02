<script>
  import Header from '../Header.svelte';
  
  // Props using Svelte 5 runes
  const { title, showBackButton, onBack, onSettings } = $props();
</script>

<Header title={title} showBackButton={showBackButton} onBack={onBack} onSettings={onSettings} />

<style>
</style>