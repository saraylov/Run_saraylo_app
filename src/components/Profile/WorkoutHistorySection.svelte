<script>
  import { formatHistoryDate, formatTime } from './profileUtils.js';
  
  // Props using Svelte 5 runes
  const { workoutHistory } = $props();
</script>

<!-- Workout History Section -->
<div class="workout-history-panel">
  <h3 class="panel-title">История тренировок</h3>
  {#if workoutHistory && workoutHistory.length > 0}
    <div class="workout-history-list">
      {#each workoutHistory as workout, i}
        <div class="workout-history-item">
          <div class="workout-header">
            <div class="workout-date">{formatHistoryDate(workout.date)}</div>
            <div class="workout-type">{workout.type}</div>
          </div>
          <div class="workout-stats">
            <div class="stat">
              <div class="stat-value">{formatTime(workout.duration)}</div>
              <div class="stat-label">Время</div>
            </div>
            <div class="stat">
              <div class="stat-value">{workout.distance?.toFixed(2) || 0} км</div>
              <div class="stat-label">Дистанция</div>
            </div>
            <div class="stat">
              <div class="stat-value">{workout.calories || 0}</div>
              <div class="stat-label">Калории</div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-history-message">
      <p>У вас пока нет завершенных тренировок</p>
    </div>
  {/if}
</div>

<style>
  /* Workout History Panel */
  .workout-history-panel {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3),
      inset 0 0 2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15),
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 15;
    overflow: hidden;
  }
  
  .panel-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.25rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .workout-history-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .workout-history-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .workout-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .workout-date {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .workout-type {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
  }
  
  .workout-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .no-history-message {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .workout-stats {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 30rem) { /* 480px */
    .workout-stats {
      grid-template-columns: 1fr;
    }
  }
</style>