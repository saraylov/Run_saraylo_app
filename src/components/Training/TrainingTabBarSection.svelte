<script>
  import TrainingTabBar from '../TrainingTabBar.svelte';
  import ActiveTrainingTabBar from '../ActiveTrainingTabBar.svelte';
  
  // Props using Svelte 5 runes
  const { 
    trainingStarted,
    handleStartTraining,
    handleTabChange,
    handlePauseTraining,
    handleFinishTraining
  } = $props();
</script>

<!-- Training TabBar - show regular tab bar when not training, active tab bar when training -->
{#if !trainingStarted}
  <TrainingTabBar on:startTraining={handleStartTraining} on:tabChanged={handleTabChange} />
{:else}
  <ActiveTrainingTabBar on:pauseTraining={handlePauseTraining} on:finishTraining={handleFinishTraining} />
{/if}

<style>
</style>