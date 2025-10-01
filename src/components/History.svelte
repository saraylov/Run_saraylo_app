<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import WorkoutTimeline from './WorkoutTimeline.svelte';
  
  // Export functions for parent component using Svelte 5 runes
  const { onBack, onSettings } = $props();
  
  // Workout history data
  let workoutHistory = $state([]);
  
  // Filter options
  let filterType = $state('all');
  let filterDate = $state('all');
  let filterDuration = $state('all');
  
  // Comparison state
  let comparisonMode = $state(false);
  let selectedWorkouts = $state([]);
  
  // Detail view state
  let detailedView = $state(false);
  let selectedWorkout = $state(null);
  
  // Comparison view state
  let comparisonView = $state(false);
  
  // Get filtered and sorted workout history
  let filteredHistory = $derived(applyFilters());
  
  // Load workout history from localStorage on component mount
  onMount(() => {
    loadWorkoutHistory();
  });
  
  // Load workout history from localStorage
  function loadWorkoutHistory() {
    try {
      const history = localStorage.getItem('workoutHistory');
      if (history) {
        workoutHistory = JSON.parse(history);
        // Sort by date in reverse chronological order (newest first)
        workoutHistory.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      }
    } catch (error) {
      console.error('Failed to load workout history:', error);
      workoutHistory = [];
    }
  }
  
  // Save workout history to localStorage
  function saveWorkoutHistory() {
    try {
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    } catch (error) {
      console.error('Failed to save workout history:', error);
    }
  }
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' в ' + date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Format duration for display
  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} мин ${secs} сек`;
  }
  
  // Format pace for display
  function formatPace(paceInSeconds) {
    const mins = Math.floor(paceInSeconds / 60);
    const secs = Math.floor(paceInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')} /км`;
  }
  
  // Format speed for display
  function formatSpeed(speed) {
    return speed.toFixed(1) + ' км/ч';
  }
  
  // Format calories for display
  function formatCalories(calories) {
    // Handle both number and string inputs
    let caloriesValue = calories;
    if (typeof calories === 'string') {
      caloriesValue = parseInt(calories.replace(' kcal', '')) || 0;
    }
    return caloriesValue.toLocaleString() + ' ккал';
  }
  
  // Format steps for display
  function formatSteps(steps) {
    // Handle both number and string inputs
    let stepsValue = steps;
    if (typeof steps === 'string') {
      stepsValue = parseInt(steps.replace(/\s/g, '')) || 0;
    }
    return stepsValue.toLocaleString() + ' шагов';
  }
  
  // Format distance for display
  function formatDistance(distance) {
    // Handle both number and string inputs
    let distanceValue = distance;
    if (typeof distance === 'string') {
      distanceValue = parseFloat(distance.replace(' km', '')) || 0;
    }
    return distanceValue.toFixed(2) + ' км';
  }
  
  // Get workout type name
  function getWorkoutTypeName(type) {
    const typeMap = {
      'running': 'Бег',
      'treadmill': 'Бег на дорожке',
      'cycling': 'Велосипед',
      'walking': 'Ходьба',
      'nordic_walking': 'Скандинавская ходьба'
    };
    return typeMap[type] || type;
  }
  
  // Toggle workout selection for comparison
  function toggleWorkoutSelection(workout) {
    if (comparisonMode) {
      const index = selectedWorkouts.findIndex(w => w.id === workout.id);
      if (index >= 0) {
        selectedWorkouts.splice(index, 1);
      } else {
        if (selectedWorkouts.length < 2) {
          selectedWorkouts = [...selectedWorkouts, workout];
        }
      }
    }
  }
  
  // Start comparison mode
  function startComparison() {
    comparisonMode = true;
    selectedWorkouts = [];
  }
  
  // Cancel comparison mode
  function cancelComparison() {
    comparisonMode = false;
    comparisonView = false;
    selectedWorkouts = [];
  }
  
  // Show comparison view
  function showComparisonView() {
    if (selectedWorkouts.length === 2) {
      comparisonView = true;
    }
  }
  
  // Show detailed view for a workout
  function showWorkoutDetail(workout) {
    if (!comparisonMode) {
      selectedWorkout = workout;
      detailedView = true;
    }
  }
  
  // Close detailed view
  function closeDetailView() {
    detailedView = false;
    selectedWorkout = null;
  }
  
  // Close comparison view
  function closeComparisonView() {
    comparisonView = false;
  }
  
  // Apply filters to workout history
  function applyFilters() {
    let filtered = [...workoutHistory];
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(workout => workout.type === filterType);
    }
    
    // Filter by date
    if (filterDate !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (filterDate) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(workout => new Date(workout.date) >= startDate);
    }
    
    // Filter by duration
    if (filterDuration !== 'all') {
      filtered = filtered.filter(workout => {
        const minutes = Math.floor(workout.duration / 60);
        switch (filterDuration) {
          case '10-30':
            return minutes >= 10 && minutes <= 30;
          case '30-60':
            return minutes > 30 && minutes <= 60;
          case '60+':
            return minutes > 60;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }
  
  // Get speed progress data for chart
  function getSpeedProgressData() {
    if (workoutHistory.length === 0) return [];
    
    // Get last 5 workouts sorted by date
    const recentWorkouts = [...workoutHistory]
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-5);
    
    // Find min and max values for scaling
    const speeds = recentWorkouts.map(w => w.avgSpeed);
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);
    const range = maxSpeed - minSpeed || 1; // Avoid division by zero
    
    // Generate chart data
    return recentWorkouts.map((workout, index) => {
      const height = ((workout.avgSpeed - minSpeed) / range) * 100;
      const color = workout.avgSpeed > minSpeed ? '#41B6E6' : '#db3eb1';
      const date = new Date(workout.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      
      return {
        height: Math.max(height, 10), // Minimum height of 10%
        color,
        label,
        value: workout.avgSpeed
      };
    });
  }
  
  // Get distance progress data for chart
  function getDistanceProgressData() {
    if (workoutHistory.length === 0) return [];
    
    // Get last 5 workouts sorted by date
    const recentWorkouts = [...workoutHistory]
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-5);
    
    // Find min and max values for scaling
    const distances = recentWorkouts.map(w => w.distance);
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    const range = maxDistance - minDistance || 1; // Avoid division by zero
    
    // Generate chart data
    return recentWorkouts.map((workout, index) => {
      const height = ((workout.distance - minDistance) / range) * 100;
      const color = workout.distance > minDistance ? '#41B6E6' : '#db3eb1';
      const date = new Date(workout.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      
      return {
        height: Math.max(height, 10), // Minimum height of 10%
        color,
        label,
        value: workout.distance
      };
    });
  }
  
  // Get calories progress data for chart
  function getCaloriesProgressData() {
    if (workoutHistory.length === 0) return [];
    
    // Get last 5 workouts sorted by date
    const recentWorkouts = [...workoutHistory]
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-5);
    
    // Find min and max values for scaling
    const calories = recentWorkouts.map(w => w.calories);
    const minCalories = Math.min(...calories);
    const maxCalories = Math.max(...calories);
    const range = maxCalories - minCalories || 1; // Avoid division by zero
    
    // Generate chart data
    return recentWorkouts.map((workout, index) => {
      const height = ((workout.calories - minCalories) / range) * 100;
      const color = workout.calories > minCalories ? '#41B6E6' : '#db3eb1';
      const date = new Date(workout.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      
      return {
        height: Math.max(height, 10), // Minimum height of 10%
        color,
        label,
        value: workout.calories
      };
    });
  }
</script>

{#if comparisonView && selectedWorkouts.length === 2}
  <Header title="Сравнение тренировок" showBackButton={true} onBack={closeComparisonView} onSettings={onSettings} />
  
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
{:else if detailedView && selectedWorkout}
  <Header title="Детали тренировки" showBackButton={true} onBack={closeDetailView} onSettings={onSettings} />
  
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
{:else}
  <Header title="История тренировок" showBackButton={true} onBack={onBack} onSettings={onSettings} />

  <div class="history-container">
    <!-- Progress Visualization Section -->
    <div class="glass-panel progress-section">
      <h2 class="section-title">Прогресс со временем</h2>
      
      <!-- Progress Charts -->
      <div class="progress-charts">
        <div class="chart-container">
          <h3 class="chart-title">Средняя скорость</h3>
          <div class="chart">
            {#each getSpeedProgressData() as data, i}
              <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
            {/each}
          </div>
          <div class="chart-labels">
            {#each getSpeedProgressData() as data, i}
              <div class="chart-label">{data.label}</div>
            {/each}
          </div>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Расстояние</h3>
          <div class="chart">
            {#each getDistanceProgressData() as data, i}
              <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
            {/each}
          </div>
          <div class="chart-labels">
            {#each getDistanceProgressData() as data, i}
              <div class="chart-label">{data.label}</div>
            {/each}
          </div>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Калории</h3>
          <div class="chart">
            {#each getCaloriesProgressData() as data, i}
              <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
            {/each}
          </div>
          <div class="chart-labels">
            {#each getCaloriesProgressData() as data, i}
              <div class="chart-label">{data.label}</div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filter Section -->
    <div class="glass-panel filter-section">
      <h2 class="section-title">Фильтры</h2>
      <div class="filter-controls">
        <select bind:value={filterType} class="filter-select">
          <option value="all">Все типы</option>
          <option value="running">Бег</option>
          <option value="treadmill">Бег на дорожке</option>
          <option value="cycling">Велосипед</option>
          <option value="walking">Ходьба</option>
          <option value="nordic_walking">Скандинавская ходьба</option>
        </select>
        
        <select bind:value={filterDate} class="filter-select">
          <option value="all">Все даты</option>
          <option value="week">Последняя неделя</option>
          <option value="month">Последний месяц</option>
          <option value="year">Последний год</option>
        </select>
        
        <select bind:value={filterDuration} class="filter-select">
          <option value="all">Любая продолжительность</option>
          <option value="10-30">10-30 минут</option>
          <option value="30-60">30-60 минут</option>
          <option value="60+">Более 60 минут</option>
        </select>
        
        <button class="filter-button" onclick={applyFilters}>
          Применить
        </button>
      </div>
      
      <!-- Comparison Controls -->
      <div class="comparison-controls">
        {#if !comparisonMode}
          <button class="comparison-button" onclick={startComparison}>
            Сравнить тренировки
          </button>
        {:else}
          <button class="comparison-button active" onclick={cancelComparison}>
            Отмена
          </button>
          {#if selectedWorkouts.length === 2}
            <button class="comparison-button primary" onclick={showComparisonView}>
              Сравнить выбранные
            </button>
          {/if}
        {/if}
      </div>
    </div>
    
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
              onclick={() => comparisonMode ? toggleWorkoutSelection(workout) : showWorkoutDetail(workout)}
              role="button"
              tabindex="0"
              onkeydown={(e) => {
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
  
  .subsection-title {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: white;
    font-weight: 500;
    text-align: center;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .filter-select {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: 120px;
  }
  
  .filter-button {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    border: none;
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .filter-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .comparison-controls {
    display: flex;
    gap: 0.75rem;
  }
  
  .comparison-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
  }
  
  .comparison-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .comparison-button.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
  }
  
  .comparison-button.primary {
    background: linear-gradient(90deg, #34C759, #41B6E6);
  }
  
  .history-list, .detail-view {
    min-height: 300px;
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
  
  .progress-section {
    padding: 1rem;
  }
  
  .progress-charts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .chart-title {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: white;
    font-weight: 500;
    text-align: center;
  }
  
  .chart {
    display: flex;
    align-items: end;
    justify-content: space-around;
    height: 150px;
    width: 100%;
    gap: 0.5rem;
  }
  
  .chart-bar {
    flex: 1;
    min-width: 20px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
  }
  
  .chart-bar:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
  
  .chart-labels {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }
  
  .chart-label {
    flex: 1;
    text-align: center;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    min-width: 20px;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .filter-controls {
      flex-direction: column;
    }
    
    .filter-select {
      min-width: auto;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
  
  /* Responsive design for progress charts */
  @media (max-width: 48rem) { /* 768px */
    .progress-charts {
      grid-template-columns: 1fr;
    }
  }
</style>