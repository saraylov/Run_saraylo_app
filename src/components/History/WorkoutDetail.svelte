<script>
  import WorkoutTimeline from '../WorkoutTimeline.svelte';
  import { getWorkoutTypeName, formatDate, formatDuration, formatDistance, formatPace, formatSpeed, formatCalories, formatSteps } from './historyUtils.js';
  
  // Props using Svelte 5 runes - corrected syntax
  let { 
    detailedView = false,
    selectedWorkout = null,
    closeDetailView = () => {}
  } = $props();
</script>

{#if detailedView && selectedWorkout}
  <div class="history-container">
    <!-- Workout Detail View -->
    <div class="glass-panel detail-view">
      <h2 class="section-title">{getWorkoutTypeName(selectedWorkout.type)}</h2>
      
      <div class="detail-section">
        <div class="detail-date">{formatDate(selectedWorkout.date)}</div>
        
        <!-- Workout Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Время</div>
            <div class="metric-value">{formatDuration(selectedWorkout.duration)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Расстояние</div>
            <div class="metric-value">{formatDistance(selectedWorkout.distance)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Средний темп</div>
            <div class="metric-value">{formatPace(selectedWorkout.avgPace)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Средняя скорость</div>
            <div class="metric-value">{formatSpeed(selectedWorkout.avgSpeed)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Макс. скорость</div>
            <div class="metric-value">{formatSpeed(selectedWorkout.maxSpeed)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Калории</div>
            <div class="metric-value">{formatCalories(selectedWorkout.calories)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Шаги</div>
            <div class="metric-value">{formatSteps(selectedWorkout.steps)}</div>
          </div>
        </div>
        
        <!-- Workout Timeline Visualization -->
        <div class="timeline-section">
          <h3 class="subsection-title">Структура тренировки</h3>
          <WorkoutTimeline segments={selectedWorkout.segments} showAvgSpeeds={true} />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .detail-view {
    min-height: 300px;
  }
  
  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .subsection-title {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: white;
    font-weight: 500;
    text-align: center;
  }
  
  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .detail-date {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .metric-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .metric-card .metric-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.25rem;
  }
  
  .metric-card .metric-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
  
  .timeline-section {
    margin-top: 1rem;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
</style>