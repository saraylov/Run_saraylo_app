<script>
  import { onMount } from 'svelte';
  import HistoryHeader from './History/HistoryHeader.svelte';

  // Export functions for parent component using Svelte 5 runes
  let { onBack, onSettings } = $props();
  
  // State for history data
  let workoutHistory = $state([]);
  let loading = $state(true);
  let selectedWorkout = $state(null);
  let showDetailModal = $state(false);
  
  // Mock data for demonstration with more detailed information
  onMount(() => {
    // Simulate loading data
    setTimeout(() => {
      workoutHistory = [
        {
          id: 1,
          date: '2023-05-15',
          type: 'Бег',
          duration: 1800,
          distance: 5.2,
          avgSpeed: 10.5,
          maxSpeed: 12.3,
          calories: 320,
          steps: 4850,
          pace: '5:42',
          elevationGain: 45,
          elevationLoss: 38,
          heartRate: {
            avg: 145,
            max: 178,
            min: 82
          }
        },
        {
          id: 2,
          date: '2023-05-12',
          type: 'Велосипед',
          duration: 2400,
          distance: 15.7,
          avgSpeed: 23.5,
          maxSpeed: 32.1,
          calories: 450,
          steps: 0,
          pace: '2:34',
          elevationGain: 120,
          elevationLoss: 115,
          heartRate: {
            avg: 138,
            max: 165,
            min: 95
          }
        },
        {
          id: 3,
          date: '2023-05-10',
          type: 'Бег',
          duration: 1500,
          distance: 4.1,
          avgSpeed: 9.8,
          maxSpeed: 11.7,
          calories: 280,
          steps: 3920,
          pace: '6:05',
          elevationGain: 28,
          elevationLoss: 25,
          heartRate: {
            avg: 142,
            max: 172,
            min: 78
          }
        }
      ];
      loading = false;
    }, 1000);
  });
  
  // Function to open workout details modal
  function openWorkoutDetails(workout) {
    selectedWorkout = workout;
    showDetailModal = true;
  }
  
  // Function to close workout details modal
  function closeWorkoutDetails() {
    showDetailModal = false;
    selectedWorkout = null;
  }
  
  // Function to format time from seconds to MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  // Function to format date
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
  }
</script>

<HistoryHeader 
  title="История тренировок" 
  showBackButton={true} 
  {onBack} 
  {onSettings} 
/>

<div class="history-container">
  <div class="glass-panel history-summary-panel">
    <h2 class="section-title">Статистика</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Всего тренировок</div>
        <div class="stat-value">{workoutHistory.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Пройдено км</div>
        <div class="stat-value">
          {workoutHistory.reduce((sum, workout) => sum + workout.distance, 0).toFixed(1)}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Сожжено ккал</div>
        <div class="stat-value">
          {workoutHistory.reduce((sum, workout) => sum + workout.calories, 0)}
        </div>
      </div>
    </div>
  </div>
  
  <div class="glass-panel history-list-panel">
    <h2 class="section-title">Последние тренировки</h2>
    {#if loading}
      <div class="loading">Загрузка...</div>
    {:else if workoutHistory.length === 0}
      <div class="no-history">
        <p>У вас пока нет тренировок</p>
        <p>Начните тренироваться, чтобы увидеть здесь свою историю</p>
      </div>
    {:else}
      <div class="workouts-list">
        {#each workoutHistory as workout}
          <div class="workout-item" on:click={() => openWorkoutDetails(workout)}>
            <div class="workout-summary">
              <div class="workout-header">
                <h3 class="workout-title">{workout.type}</h3>
                <div class="workout-date">
                  {formatDate(workout.date)}
                </div>
              </div>
              <div class="workout-metrics">
                <div class="metric">
                  <span class="metric-label">Дистанция</span>
                  <span class="metric-value">{workout.distance} км</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Время</span>
                  <span class="metric-value">
                    {Math.floor(workout.duration / 60)} мин
                  </span>
                </div>
                <div class="metric">
                  <span class="metric-label">Скорость</span>
                  <span class="metric-value">{workout.avgSpeed} км/ч</span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <div class="glass-panel history-actions-panel">
    <h2 class="section-title">Действия</h2>
    <div class="actions-grid">
      <button class="action-button">
        <span class="action-icon">📊</span>
        <span class="action-label">Подробная статистика</span>
      </button>
      <button class="action-button">
        <span class="action-icon">🔄</span>
        <span class="action-label">Сравнить тренировки</span>
      </button>
      <button class="action-button">
        <span class="action-icon">📅</span>
        <span class="action-label">Календарь</span>
      </button>
      <button class="action-button">
        <span class="action-icon">⚙️</span>
        <span class="action-label">Настройки</span>
      </button>
    </div>
  </div>
</div>

<!-- Workout Detail Modal -->
{#if showDetailModal && selectedWorkout}
  <div class="modal-overlay" on:click={closeWorkoutDetails}>
    <div class="modal-content glass-panel" on:click|stopPropagation>
      <div class="modal-header">
        <h2 class="modal-title">{selectedWorkout.type} - Подробности</h2>
        <button class="close-button" on:click={closeWorkoutDetails}>×</button>
      </div>
      
      <div class="modal-body">
        <div class="detail-section">
          <div class="detail-date">{formatDate(selectedWorkout.date)}</div>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Дистанция</div>
              <div class="metric-value">{selectedWorkout.distance} км</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Время</div>
              <div class="metric-value">{Math.floor(selectedWorkout.duration / 60)}:{(selectedWorkout.duration % 60).toString().padStart(2, '0')}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Сожжено</div>
              <div class="metric-value">{selectedWorkout.calories} ккал</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Средняя скорость</div>
              <div class="metric-value">{selectedWorkout.avgSpeed} км/ч</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Макс. скорость</div>
              <div class="metric-value">{selectedWorkout.maxSpeed} км/ч</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Темп</div>
              <div class="metric-value">{selectedWorkout.pace} /км</div>
            </div>
          </div>
          
          <div class="additional-metrics">
            <h3 class="subsection-title">Дополнительная статистика</h3>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Шаги</div>
                <div class="metric-value">{selectedWorkout.steps}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Подъем</div>
                <div class="metric-value">{selectedWorkout.elevationGain} м</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Спуск</div>
                <div class="metric-value">{selectedWorkout.elevationLoss} м</div>
              </div>
            </div>
          </div>
          
          <div class="heart-rate-section">
            <h3 class="subsection-title">Пульс</h3>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Средний</div>
                <div class="metric-value">{selectedWorkout.heartRate.avg} уд/мин</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Максимальный</div>
                <div class="metric-value">{selectedWorkout.heartRate.max} уд/мин</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Минимальный</div>
                <div class="metric-value">{selectedWorkout.heartRate.min} уд/мин</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .history-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
  }
  
  /* Glass panel effect - consistent with app styling */
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
    z-index: 15; /* Ensure panels are above bubbles */
    overflow: hidden;
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
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
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
  }
  
  .workout-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
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
  
  .no-history {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .action-button {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .action-button:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .action-icon {
    font-size: 1.5rem;
  }
  
  .action-label {
    font-size: 0.9rem;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1002; /* Increased from 1000 to ensure it's above the tab bar */
    backdrop-filter: blur(5px);
  }
  
  .modal-content {
    width: 90%;
    max-width: 31.25rem;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    z-index: 1003; /* Increased from 1001 to ensure it's above the tab bar */
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
  }
  
  .close-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
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
    grid-template-columns: repeat(3, 1fr);
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
  
  .additional-metrics, .heart-rate-section {
    margin-top: 1rem;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .actions-grid {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    
    .modal-content {
      width: 95%;
      padding: 1rem;
    }
  }
</style>