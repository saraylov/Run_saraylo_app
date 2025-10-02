<script>
  import { createEventDispatcher } from 'svelte';
  import { formatDate, formatDuration, formatDistance, formatPace, formatSpeed, formatCalories, formatSteps, getWorkoutTypeName } from '../lib/workoutUtils.js';
  import WorkoutTimeline from './WorkoutTimeline.svelte';

  // Props
  let { workout, isVisible, workouts = [] } = $props();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Close modal
  function closeModal() {
    dispatch('close');
  }

  // Handle backdrop click
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  // Find current workout index
  let currentWorkoutIndex = $derived(workout ? workouts.findIndex(w => w.id === workout.id) : -1);

  // Navigate to previous workout
  function goToPrevious() {
    if (currentWorkoutIndex > 0) {
      const previousWorkout = workouts[currentWorkoutIndex - 1];
      dispatch('navigate', { workout: previousWorkout });
    }
  }

  // Navigate to next workout
  function goToNext() {
    if (currentWorkoutIndex < workouts.length - 1) {
      const nextWorkout = workouts[currentWorkoutIndex + 1];
      dispatch('navigate', { workout: nextWorkout });
    }
  }

  // Check if there's a previous workout
  let hasPrevious = $derived(currentWorkoutIndex > 0);

  // Check if there's a next workout
  let hasNext = $derived(currentWorkoutIndex < workouts.length - 1);
</script>

{#if isVisible && workout}
  <div class="modal-backdrop" onclick={handleBackdropClick}>
    <div class="modal-container" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 class="modal-title">{getWorkoutTypeName(workout.type)}</h2>
        <button class="close-button" onclick={closeModal} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <div class="workout-date">{formatDate(workout.date)}</div>

        <!-- Navigation buttons -->
        <div class="navigation-buttons">
          <button 
            class="nav-button prev-button" 
            onclick={goToPrevious} 
            disabled={!hasPrevious}
            aria-label="Предыдущая тренировка"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <button 
            class="nav-button next-button" 
            onclick={goToNext} 
            disabled={!hasNext}
            aria-label="Следующая тренировка"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Main metrics grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Общее время</div>
            <div class="metric-value">{formatDuration(workout.duration)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Расстояние</div>
            <div class="metric-value">{formatDistance(workout.distance)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Средняя скорость</div>
            <div class="metric-value">{formatSpeed(workout.avgSpeed)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Средний темп</div>
            <div class="metric-value">{formatPace(workout.avgPace)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Макс. скорость</div>
            <div class="metric-value">{formatSpeed(workout.maxSpeed)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Пиковый темп</div>
            <div class="metric-value">{formatPace(workout.maxPace)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Калории</div>
            <div class="metric-value">{formatCalories(workout.calories)}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Шаги</div>
            <div class="metric-value">{formatSteps(workout.steps)}</div>
          </div>
        </div>

        <!-- Workout Timeline Visualization -->
        <div class="timeline-section">
          <h3 class="section-title">Структура тренировки</h3>
          <WorkoutTimeline segments={workout.segments} showAvgSpeeds={true} />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-container {
    background: rgba(30, 30, 40, 0.95);
    border-radius: 1.5rem;
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.5);
    max-width: 60rem;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: modalAppear 0.3s ease-out;
    position: relative;
    overflow: hidden;
  }
  
  .modal-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.5rem;
    background: linear-gradient(90deg, #98002E, #F9A01B, #00BFFF, #FF1493);
    z-index: 100;
  }

  @keyframes modalAppear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 0;
  }

  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    background: linear-gradient(90deg, #00BFFF, #FF1493);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .close-button {
    background: linear-gradient(135deg, #FF1493, #98002E);
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .modal-content {
    padding: 1.5rem;
  }

  .workout-date {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .nav-button {
    background: linear-gradient(135deg, #98002E, #F9A01B);
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  .nav-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .metric-card:hover {
    border: 0.0625rem solid #00BFFF;
    box-shadow: 0 0 0.5rem rgba(0, 191, 255, 0.3);
  }
  
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.125rem;
    background: linear-gradient(90deg, #98002E, #F9A01B);
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

  .section-title {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: white;
    font-weight: 500;
    text-align: center;
    background: linear-gradient(90deg, #F9A01B, #00BFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Responsive design */
  @media (max-width: 62rem) { /* 992px */
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .modal-container {
      border-radius: 1rem;
    }
    
    .modal-header {
      padding: 1rem 1rem 0;
    }
    
    .modal-content {
      padding: 1rem;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .navigation-buttons {
      position: sticky;
      top: 0;
      background: rgba(30, 30, 40, 0.95);
      padding: 0.5rem 0;
      z-index: 10;
    }
  }
</style>