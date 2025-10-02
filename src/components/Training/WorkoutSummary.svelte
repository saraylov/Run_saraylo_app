<script>
  import WorkoutSummaryModal from '../WorkoutSummaryModal.svelte';
  
  // Props using Svelte 5 runes
  const { 
    showSummaryModal,
    finalWorkoutData,
    handleModalClose,
    handleModalSave
  } = $props();
</script>

<!-- Workout Summary Modal -->
<WorkoutSummaryModal 
  isVisible={showSummaryModal} 
  workoutData={finalWorkoutData}
  onClose={handleModalClose}
  onSave={handleModalSave}
/>

<style>
</style>