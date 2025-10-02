<script>
  import WorkoutTimeline from '../WorkoutTimeline.svelte';
  import { getWorkoutTypeName, formatDate, formatDuration, formatDistance, formatPace, formatSpeed, formatCalories, formatSteps } from './historyUtils.js';
  
  // Props using Svelte 5 runes - corrected syntax
  let { 
    comparisonView = false,
    selectedWorkouts = [],
    closeComparisonView = () => {}
  } = $props();
</script>

{#if comparisonView && selectedWorkouts.length === 2}
  <div class="history-container">
    <!-- Workout Comparison View -->
    <div class="glass-panel comparison-view">
      <h2 class="section-title">Сравнение тренировок</h2>
      
      <div class="comparison-section">
        <!-- Workout Comparison Header -->
        <div class="comparison-header">
          <div class="workout-info">
            <h3 class="workout-title">{getWorkoutTypeName(selectedWorkouts[0].type)}</h3>
            <div class="workout-date">{formatDate(selectedWorkouts[0].date)}</div>
          </div>
          <div class="vs">VS</div>
          <div class="workout-info">
            <h3 class="workout-title">{getWorkoutTypeName(selectedWorkouts[1].type)}</h3>
            <div class="workout-date">{formatDate(selectedWorkouts[1].date)}</div>
          </div>
        </div>
        
        <!-- Metrics Comparison -->
        <div class="metrics-comparison">
          <div class="metric-row">
            <div class="metric-label">Время</div>
            <div class="metric-value">{formatDuration(selectedWorkouts[0].duration)}</div>
            <div class="metric-value">{formatDuration(selectedWorkouts[1].duration)}</div>
            <div class="metric-diff {selectedWorkouts[0].duration > selectedWorkouts[1].duration ? 'positive' : 'negative'}">
              {formatDuration(Math.abs(selectedWorkouts[0].duration - selectedWorkouts[1].duration))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Расстояние</div>
            <div class="metric-value">{formatDistance(selectedWorkouts[0].distance)}</div>
            <div class="metric-value">{formatDistance(selectedWorkouts[1].distance)}</div>
            <div class="metric-diff {selectedWorkouts[0].distance > selectedWorkouts[1].distance ? 'positive' : 'negative'}">
              {formatDistance(Math.abs(selectedWorkouts[0].distance - selectedWorkouts[1].distance))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Средний темп</div>
            <div class="metric-value">{formatPace(selectedWorkouts[0].avgPace)}</div>
            <div class="metric-value">{formatPace(selectedWorkouts[1].avgPace)}</div>
            <div class="metric-diff {selectedWorkouts[0].avgPace < selectedWorkouts[1].avgPace ? 'positive' : 'negative'}">
              {formatPace(Math.abs(selectedWorkouts[0].avgPace - selectedWorkouts[1].avgPace))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Средняя скорость</div>
            <div class="metric-value">{formatSpeed(selectedWorkouts[0].avgSpeed)}</div>
            <div class="metric-value">{formatSpeed(selectedWorkouts[1].avgSpeed)}</div>
            <div class="metric-diff {selectedWorkouts[0].avgSpeed > selectedWorkouts[1].avgSpeed ? 'positive' : 'negative'}">
              {formatSpeed(Math.abs(selectedWorkouts[0].avgSpeed - selectedWorkouts[1].avgSpeed))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Макс. скорость</div>
            <div class="metric-value">{formatSpeed(selectedWorkouts[0].maxSpeed)}</div>
            <div class="metric-value">{formatSpeed(selectedWorkouts[1].maxSpeed)}</div>
            <div class="metric-diff {selectedWorkouts[0].maxSpeed > selectedWorkouts[1].maxSpeed ? 'positive' : 'negative'}">
              {formatSpeed(Math.abs(selectedWorkouts[0].maxSpeed - selectedWorkouts[1].maxSpeed))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Калории</div>
            <div class="metric-value">{formatCalories(selectedWorkouts[0].calories)}</div>
            <div class="metric-value">{formatCalories(selectedWorkouts[1].calories)}</div>
            <div class="metric-diff {selectedWorkouts[0].calories > selectedWorkouts[1].calories ? 'positive' : 'negative'}">
              {formatCalories(Math.abs(selectedWorkouts[0].calories - selectedWorkouts[1].calories))}
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric-label">Шаги</div>
            <div class="metric-value">{formatSteps(selectedWorkouts[0].steps)}</div>
            <div class="metric-value">{formatSteps(selectedWorkouts[1].steps)}</div>
            <div class="metric-diff {selectedWorkouts[0].steps > selectedWorkouts[1].steps ? 'positive' : 'negative'}">
              {formatSteps(Math.abs(selectedWorkouts[0].steps - selectedWorkouts[1].steps))}
            </div>
          </div>
        </div>
        
        <!-- Timeline Comparison -->
        <div class="timeline-comparison">
          <h3 class="subsection-title">Сравнение структуры</h3>
          <div class="timelines-container">
            <div class="timeline-item">
              <WorkoutTimeline segments={selectedWorkouts[0].segments} />
            </div>
            <div class="timeline-item">
              <WorkoutTimeline segments={selectedWorkouts[1].segments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .comparison-view {
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
  
  .comparison-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  
  .workout-info {
    flex: 1;
    text-align: center;
  }
  
  .workout-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
  }
  
  .workout-date {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .vs {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
  }
  
  .metrics-comparison {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .metric-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
  }
  
  .metric-label {
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
  }
  
  .metric-value {
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .metric-diff {
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .metric-diff.positive {
    color: #34C759; /* Green for positive differences */
  }
  
  .metric-diff.negative {
    color: #db3eb1; /* Pink for negative differences */
  }
  
  .timeline-comparison {
    margin-top: 1rem;
  }
  
  .timelines-container {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .timeline-item {
    flex: 1;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .comparison-header {
      flex-direction: column;
      gap: 1rem;
    }
    
    .timelines-container {
      flex-direction: column;
    }
    
    .metric-row {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>