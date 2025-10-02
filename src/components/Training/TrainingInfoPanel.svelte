<script>
  import WorkoutTimeline from '../WorkoutTimeline.svelte';
  
  // Props using Svelte 5 runes
  const { training, getWorkoutSegments, getWorkoutId } = $props();
</script>

<!-- Workout Info and Timeline Panel for all workouts -->
<div class="glass-panel workout-info-timeline training-info-panel">
  <div class="workout-header training-workout-header">
    <h2 class="workout-title training-workout-title">{training.name}</h2>
    {#if training.duration > 0}
      <div class="workout-duration training-workout-duration">{training.duration} мин</div>
    {:else}
      <div class="workout-duration training-workout-duration">Без ограничения по времени</div>
    {/if}
  </div>
  
  <!-- Workout Timeline Visualization for all workouts -->
  <div class="timeline-section training-timeline-section">
    <WorkoutTimeline segments={getWorkoutSegments(getWorkoutId())} />
  </div>
</div>

<style>
  /* Glass panel effect - consistent with app styling */
  .training-info-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.12); /* Increased opacity for thicker appearance */
    backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    -webkit-backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    border: 0.125rem solid rgba(255, 255, 255, 0.25); /* Thicker border */
    border-radius: 1.5rem; /* Slightly increased radius */
    padding: 1.5rem; /* Increased padding */
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3), /* Enhanced shadow */
      inset 0 0 2rem rgba(255, 255, 255, 0.2), /* Inner glow for thickness */
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15), /* Bottom inner light */
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2); /* Top inner light */
    position: relative;
    z-index: 15;
    overflow: hidden;
  }

  .training-workout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 16;
  }

  .training-workout-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    z-index: 16;
  }

  .training-workout-duration {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    z-index: 16;
  }

  .training-timeline-section {
    padding: 0;
    z-index: 16;
  }
</style>