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

<style global>
  @import './WorkoutDetail.css';
</style>