<script>
  import { onMount } from 'svelte';
  import HistoryHeader from './History/HistoryHeader.svelte';
  import ProgressVisualization from './History/ProgressVisualization.svelte';
  import HistoryFilters from './History/HistoryFilters.svelte';
  import WorkoutHistoryList from './History/WorkoutHistoryList.svelte';
  import WorkoutDetail from './History/WorkoutDetail.svelte';
  import WorkoutComparison from './History/WorkoutComparison.svelte';

  // Export functions for parent component using Svelte 5 runes
  let { onBack, onSettings } = $props();
  
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
  function handleStartComparison() {
    comparisonMode = true;
    selectedWorkouts = [];
  }
  
  // Cancel comparison mode
  function handleCancelComparison() {
    comparisonMode = false;
    comparisonView = false;
    selectedWorkouts = [];
  }
  
  // Show comparison view
  function handleShowComparisonView() {
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
  function handleApplyFilters() {
    // This will trigger a re-evaluation of filteredHistory
  }
  
  // Get filtered and sorted workout history
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

<HistoryHeader 
  title="История тренировок" 
  showBackButton={true} 
  {onBack} 
  {onSettings} 
/>

<div class="history-container">
  <ProgressVisualization 
    {getSpeedProgressData}
    {getDistanceProgressData}
    {getCaloriesProgressData}
  />
  
  <HistoryFilters 
    bind:filterType
    bind:filterDate
    bind:filterDuration
    bind:comparisonMode
    bind:selectedWorkouts
    on:applyFilters={handleApplyFilters}
    on:startComparison={handleStartComparison}
    on:cancelComparison={handleCancelComparison}
    on:showComparisonView={handleShowComparisonView}
  />
  
  <WorkoutHistoryList 
    {workoutHistory}
    {filteredHistory}
    {comparisonMode}
    {selectedWorkouts}
    {toggleWorkoutSelection}
    {showWorkoutDetail}
  />
</div>

<WorkoutDetail 
  {detailedView}
  {selectedWorkout}
  {closeDetailView}
/>

<WorkoutComparison 
  {comparisonView}
  {selectedWorkouts}
  {closeComparisonView}
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
</style>