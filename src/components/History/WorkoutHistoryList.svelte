<script>
  // Import utility functions
  import { getWorkoutTypeName, formatDate, formatDuration, formatDistance, formatPace } from './historyUtils.js';
  
  // Props using Svelte 5 runes - corrected syntax
  let { 
    workoutHistory, 
    filteredHistory, 
    comparisonMode, 
    selectedWorkouts, 
    toggleWorkoutSelection, 
    showWorkoutDetail 
  } = $props();
</script>

<!-- Workout History List -->
<div class="glass-panel history-list">
  <h2 class="section-title">История тренировок</h2>
  
  {#if workoutHistory.length === 0}
    <div class="no-history">
      <p>История тренировок пуста</p>
      <p>Завершите тренировку длительностью более 10 минут, чтобы она появилась здесь</p>
    </div>
  {:else}
    <div class="workouts-list">
      {#each filteredHistory as workout}
        <div 
          class="workout-item {comparisonMode ? 'selectable' : ''} {selectedWorkouts.some(w => w.id === workout.id) ? 'selected' : ''}"
          on:click={() => comparisonMode ? toggleWorkoutSelection(workout) : showWorkoutDetail(workout)}
          role="button"
          tabindex="0"
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              comparisonMode ? toggleWorkoutSelection(workout) : showWorkoutDetail(workout);
            }
          }}
        >
          <div class="workout-summary">
            <div class="workout-header">
              <h3 class="workout-title">{getWorkoutTypeName(workout.type)}</h3>
              <span class="workout-date">{formatDate(workout.date)}</span>
            </div>
            <div class="workout-metrics">
              <div class="metric">
                <span class="metric-label">Время:</span>
                <span class="metric-value">{formatDuration(workout.duration)}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Расстояние:</span>
                <span class="metric-value">{formatDistance(workout.distance)}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Темп:</span>
                <span class="metric-value">{formatPace(workout.avgPace)}</span>
              </div>
            </div>
          </div>
          
          {#if comparisonMode}
            <div class="selection-indicator">
              {#if selectedWorkouts.some(w => w.id === workout.id)}
                <span class="checkmark">✓</span>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .history-list {
    min-height: 300px;
  }
  
  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .no-history {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .no-history p {
    margin: 0.5rem 0;
  }
  
  .workouts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .workout-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .workout-item.selectable {
    cursor: pointer;
  }
  
  .workout-item.selected {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }
  
  .workout-summary {
    flex: 1;
  }
  
  .workout-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .workout-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .workout-date {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .workout-metrics {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .metric {
    display: flex;
    flex-direction: column;
  }
  
  .metric-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .metric-value {
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .selection-indicator {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .workout-item.selected .selection-indicator {
    border-color: white;
    background: white;
  }
  
  .checkmark {
    color: #db3eb1;
    font-weight: bold;
  }
</style>