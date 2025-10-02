<script>
  import { onMount } from 'svelte';
  import HistoryHeader from './History/HistoryHeader.svelte';
  import ProgressVisualization from './History/ProgressVisualization.svelte';
  import HistoryFilters from './History/HistoryFilters.svelte';
  import WorkoutHistoryList from './History/WorkoutHistoryList.svelte';
  import WorkoutDetailModal from './WorkoutDetailModal.svelte';
  import WorkoutComparison from './History/WorkoutComparison.svelte';
  import DeleteConfirmationModal from './History/DeleteConfirmationModal.svelte';

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
  
  // Delete modal state
  let showDeleteModal = $state(false);
  let workoutToDelete = $state(null);
  
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
  
  // Request workout deletion (shows modal)
  function requestDeleteWorkout(workout) {
    workoutToDelete = workout;
    showDeleteModal = true;
  }
  
  // Confirm workout deletion
  function confirmDeleteWorkout() {
    if (workoutToDelete) {
      try {
        // Filter out the workout to be deleted
        const originalLength = workoutHistory.length;
        workoutHistory = workoutHistory.filter(workout => {
          return workout.id !== workoutToDelete.id;
        });
        
        console.log(`Filtered history: ${originalLength} -> ${workoutHistory.length} items`);
        
        // Save updated history to localStorage
        saveWorkoutHistory();
        
        console.log('Workout deleted successfully');
      } catch (error) {
        console.error('Failed to delete workout:', error);
      } finally {
        // Close modal and reset state
        showDeleteModal = false;
        workoutToDelete = null;
      }
    }
  }
  
  // Cancel workout deletion
  function cancelDeleteWorkout() {
    showDeleteModal = false;
    workoutToDelete = null;
    console.log('Delete operation cancelled by user');
  }
  
  // Apply filters to workout history
  function handleApplyFilters() {
    // This will trigger a re-evaluation of filteredHistory
  }
  
  // Handle filter type change
  function handleFilterTypeChange(event) {
    filterType = event.detail;
  }
  
  // Handle filter date change
  function handleFilterDateChange(event) {
    filterDate = event.detail;
  }
  
  // Handle filter duration change
  function handleFilterDurationChange(event) {
    filterDuration = event.detail;
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
  
  // Get filtered and sorted workout history - MUST be declared after applyFilters function
  let filteredHistory = $derived(applyFilters());
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
    {filterType}
    {filterDate}
    {filterDuration}
    {comparisonMode}
    {selectedWorkouts}
    on:filterTypeChange={handleFilterTypeChange}
    on:filterDateChange={handleFilterDateChange}
    on:filterDurationChange={handleFilterDurationChange}
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
    deleteWorkout={requestDeleteWorkout}
  />
</div>

<WorkoutDetailModal 
  isVisible={detailedView}
  workout={selectedWorkout}
  workouts={workoutHistory}
  on:close={closeDetailView}
/>

<WorkoutComparison 
  {comparisonView}
  {selectedWorkouts}
  {closeComparisonView}
/>

<DeleteConfirmationModal 
  isVisible={showDeleteModal}
  workoutTitle={workoutToDelete ? workoutToDelete.type : ''}
  on:confirm={confirmDeleteWorkout}
  on:cancel={cancelDeleteWorkout}
/>

<style global>
  @import './History/History.css';
</style>