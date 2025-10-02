<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import WorkoutCard from './WorkoutCard.svelte';
  import WorkoutDetailModal from './WorkoutDetailModal.svelte';
  import mockWorkoutHistory from '../lib/mockWorkoutData.js';

  // Props
  let { onBack, onSettings } = $props();

  // Workout history data
  let workoutHistory = $state([]);

  // Detail view state
  let detailedView = $state(false);
  let selectedWorkout = $state(null);

  // Load workout history
  onMount(() => {
    // In a real app, this would come from localStorage or an API
    workoutHistory = [...mockWorkoutHistory];
    
    // Sort by date in reverse chronological order (newest first)
    workoutHistory.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  });

  // Show detailed view for a workout
  function showWorkoutDetail(workout) {
    selectedWorkout = workout;
    detailedView = true;
  }

  // Close detailed view
  function closeDetailView() {
    detailedView = false;
    selectedWorkout = null;
  }

  // Handle navigation in modal
  function handleModalNavigation(event) {
    selectedWorkout = event.detail.workout;
  }
</script>

<Header title="История тренировок" showBackButton={true} onBack={onBack} onSettings={onSettings} />

<div class="history-container">
  {#if workoutHistory.length === 0}
    <div class="glass-panel">
      <div class="no-history">
        <p>История тренировок пуста</p>
        <p>Завершите тренировку длительностью более 10 минут, чтобы она появилась здесь</p>
      </div>
    </div>
  {:else}
    <div class="glass-panel history-list">
      <h2 class="section-title">История тренировок</h2>
      <div class="workouts-grid">
        {#each workoutHistory as workout}
          <WorkoutCard 
            workout={workout} 
            onclick={() => showWorkoutDetail(workout)} 
          />
        {/each}
      </div>
    </div>
  {/if}
</div>

<WorkoutDetailModal 
  workout={selectedWorkout} 
  isVisible={detailedView} 
  workouts={workoutHistory}
  on:close={closeDetailView}
  on:navigate={handleModalNavigation}
/>

<style>
  .history-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
  }

  .glass-panel {
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

  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .no-history {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .no-history p {
    margin: 0.5rem 0;
  }

  /* Responsive design */
  @media (max-width: 30rem) { /* 480px */
    .history-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }
    
    .glass-panel {
      padding: 1rem;
    }
    
    .section-title {
      font-size: 1.1rem;
    }
    
    .workouts-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>