<script>
  import WorkoutTimeline from '../WorkoutTimeline.svelte';
  
  // Props using Svelte 5 runes
  const { 
    selectedCategory, 
    workoutPrograms, 
    selectedWorkout, 
    selectWorkout, 
    toggleFavorite, 
    isFavorite, 
    getWorkoutSegments 
  } = $props();
</script>

<!-- Workout Selection -->
<div class="glass-panel workout-selection-panel">
  {#if !selectedCategory}
    <div class="placeholder workout-placeholder">
      <p>Выберите тренировку</p>
    </div>
  {:else}
    <h2 class="section-title workout-section-title">Выберите программу тренировки</h2>
    <div class="workout-list">
      {#each workoutPrograms[selectedCategory] as workout}
        <div 
          class="workout-item {selectedWorkout?.id === workout.id ? 'active' : ''}"
          on:click={() => selectWorkout(workout)}
        >
          <!-- Favorite star icon -->
          <div class="favorite-icon workout-favorite-icon" on:click|stopPropagation={(e) => toggleFavorite(workout.id)}>
            {#if isFavorite(workout.id)}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            {:else}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            {/if}
          </div>
          
          <div class="workout-header workout-item-header">
            <h3 class="workout-name workout-item-name">{workout.name}</h3>
            <span class="workout-duration workout-item-duration">{workout.duration}</span>
          </div>
          <p class="workout-description workout-item-description">{workout.description}</p>
          
          <!-- Workout Timeline Visualization -->
          <div class="workout-timeline-container workout-item-timeline">
            <WorkoutTimeline 
              segments={getWorkoutSegments(workout.id)} 
              className="workout-preview-timeline"
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .workout-selection-panel {
    min-height: 200px;
    z-index: 16; /* Above bubbles but below other UI elements */
  }

  .workout-section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
    z-index: 17;
  }

  .workout-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
    z-index: 17;
  }

  .workout-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 17;
  }

  .workout-item {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    position: relative;
    padding-right: 3rem; /* Add extra padding for the star icon */
    z-index: 17;
  }

  .workout-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    z-index: 18;
  }

  .workout-item.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
    z-index: 19;
  }

  .workout-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    z-index: 18;
  }

  .workout-item-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    z-index: 18;
  }

  .workout-item-duration {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    flex-shrink: 0; /* Prevent duration from shrinking */
    z-index: 18;
  }

  .workout-item.active .workout-item-duration {
    background: rgba(255, 255, 255, 0.3);
  }

  .workout-item-description {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    z-index: 18;
  }

  .workout-item.active .workout-item-description {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Favorite icon styling */
  .workout-favorite-icon {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    z-index: 20;
    width: 20px;
    height: 20px;
  }

  /* Workout Timeline Container */
  .workout-item-timeline {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    clear: both; /* Clear any floating elements */
    z-index: 18;
  }

  .workout-preview-timeline {
    margin: 0;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .workout-item {
      flex-direction: column;
      align-items: flex-start;
      padding-right: 3rem; /* Maintain padding for star icon */
    }
    
    .workout-item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .workout-item-duration {
      align-self: flex-start;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .workout-item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .workout-item-duration {
      align-self: flex-start;
    }
    
    .workout-item {
      padding-right: 3rem; /* Maintain padding for star icon */
    }
  }
</style>