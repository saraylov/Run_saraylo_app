<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import WorkoutTimeline from './WorkoutTimeline.svelte'; // Import the new component
  import { navigationContext } from '../lib/viewTransition.js';

  // Exercise categories
  let categories = [
    { id: 'favorites', name: 'Избранные' }, // Moved favorites category to the beginning
    { id: 'running', name: 'Бег' },
    { id: 'treadmill', name: 'Бег на дорожке' },
    { id: 'cycling', name: 'Велосипед' },
    { id: 'walking', name: 'Ходьба' },
    { id: 'nordic_walking', name: 'Скандинавская ходьба' }
  ];

  // Workout programs for each category with duration information
  let workoutPrograms = {
    running: [
      { id: 'free_run', name: 'Свободная тренировка', duration: 'Без ограничения по времени', description: 'Тренировка без ограничения по времени' },
      { id: 'cardio', name: 'Кардио тренировка', duration: '30 мин', description: 'Интенсивная кардио тренировка' },
      { id: 'timed_run', name: 'Тренировка на время', duration: '45 мин', description: 'Тренировка с фиксированным временем' },
      { id: 'assessment_run', name: 'Оценочная тренировка', duration: '20 мин', description: 'Тренировка для оценки текущего уровня' }
    ],
    treadmill: [
      { id: 'free_treadmill', name: 'Свободная тренировка', duration: 'Без ограничения по времени', description: 'Тренировка без ограничения по времени' },
      { id: 'cardio_treadmill', name: 'Кардио тренировка', duration: '30 мин', description: 'Интенсивная кардио тренировка' },
      { id: 'timed_treadmill', name: 'Тренировка на время', duration: '45 мин', description: 'Тренировка с фиксированным временем' },
      { id: 'assessment_treadmill', name: 'Оценочная тренировка', duration: '20 мин', description: 'Тренировка для оценки текущего уровня' }
    ],
    cycling: [
      { id: 'free_cycling', name: 'Свободная тренировка', duration: 'Без ограничения по времени', description: 'Тренировка без ограничения по времени' },
      { id: 'cardio_cycling', name: 'Кардио тренировка', duration: '30 мин', description: 'Интенсивная кардио тренировка' },
      { id: 'timed_cycling', name: 'Тренировка на время', duration: '45 мин', description: 'Тренировка с фиксированным временем' },
      { id: 'assessment_cycling', name: 'Оценочная тренировка', duration: '20 мин', description: 'Тренировка для оценки текущего уровня' }
    ],
    walking: [
      { id: 'free_walking', name: 'Свободная тренировка', duration: 'Без ограничения по времени', description: 'Тренировка без ограничения по времени' },
      { id: 'cardio_walking', name: 'Кардио тренировка', duration: '30 мин', description: 'Интенсивная кардио тренировка' },
      { id: 'timed_walking', name: 'Тренировка на время', duration: '45 мин', description: 'Тренировка с фиксированным временем' },
      { id: 'assessment_walking', name: 'Оценочная тренировка', duration: '20 мин', description: 'Тренировка для оценки текущего уровня' }
    ],
    nordic_walking: [
      { id: 'free_nordic', name: 'Свободная тренировка', duration: 'Без ограничения по времени', description: 'Тренировка без ограничения по времени' },
      { id: 'cardio_nordic', name: 'Кардио тренировка', duration: '30 мин', description: 'Интенсивная кардио тренировка' },
      { id: 'timed_nordic', name: 'Тренировка на время', duration: '45 мин', description: 'Тренировка с фиксированным временем' },
      { id: 'assessment_nordic', name: 'Оценочная тренировка', duration: '20 мин', description: 'Тренировка для оценки текущего уровня' }
    ],
    favorites: [] // Will be populated with favorite workouts
  };

  // Define segment patterns for different workout types
  const workoutSegments = {
    // Assessment workouts - fixed sequence
    assessment_run: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1 }
    ],
    assessment_treadmill: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1 }
    ],
    assessment_cycling: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1 }
    ],
    assessment_walking: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1 }
    ],
    assessment_nordic: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1 }
    ],
    // Example custom workout with flexible sequence
    cardio: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 5 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 10 },
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 2 }
    ],
    cardio_treadmill: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 5 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 10 },
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 2 }
    ],
    timed_run: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 12 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 7 }
    ],
    timed_treadmill: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 12 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 7 }
    ],
    timed_cycling: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 12 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 7 }
    ],
    timed_walking: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 12 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 7 }
    ],
    timed_nordic: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 12 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 7 }
    ],
    // Free workouts - fully blue timeline
    free_run: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
    ],
    free_treadmill: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
    ],
    free_cycling: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
    ],
    free_walking: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
    ],
    free_nordic: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
    ]
  };

  // Selected category and workout
  let selectedCategory = 'favorites'; // Set favorites as default selected category
  let selectedWorkout = null;
  
  // Favorites state
  let favorites = [];

  // Function to select a category
  function selectCategory(categoryId) {
    selectedCategory = categoryId;
    // Reset workout selection when category changes
    selectedWorkout = null;
    
    // If selecting favorites category, populate it with favorite workouts
    if (categoryId === 'favorites') {
      populateFavorites();
    }
  }

  // Function to select a workout
  function selectWorkout(workout) {
    selectedWorkout = workout;
  }

  // Function to get segments for a workout
  function getWorkoutSegments(workoutId) {
    // Check if there are predefined segments for this workout
    if (workoutSegments[workoutId]) {
      return workoutSegments[workoutId];
    }
    
    // For free workouts, return a single blue segment
    if (workoutId && workoutId.includes('free')) {
      return [
        { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10 }
      ];
    }
    
    // For other workouts without predefined segments, return empty array
    return [];
  }

  // Function to start training
  function startTraining() {
    if (!selectedCategory || !selectedWorkout) return;
    
    // Create a training object with selected category and workout
    const trainingData = {
      category: categories.find(c => c.id === selectedCategory),
      workout: selectedWorkout,
      startTime: new Date().toISOString()
    };
    
    // Store the selected training data in localStorage
    try {
      localStorage.setItem('selectedTraining', JSON.stringify(trainingData));
    } catch (e) {
      console.error('Failed to save selected training to localStorage:', e);
    }
    
    // Call the onTraining function passed from the parent with view transition
    if (onTraining) {
      navigationContext.navigate('training', onTraining);
    }
  }

  // Function to toggle favorite status
  function toggleFavorite(workoutId) {
    const index = favorites.indexOf(workoutId);
    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(workoutId);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('favoriteWorkouts', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
    
    // Update favorites category if it's currently selected
    if (selectedCategory === 'favorites') {
      populateFavorites();
    }
    
    // Force re-render by updating the component state
    workoutPrograms = { ...workoutPrograms };
  }

  // Function to check if a workout is favorited
  function isFavorite(workoutId) {
    // Ensure favorites is an array before checking
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    return favorites.includes(workoutId);
  }

  // Function to populate favorites category with favorite workouts
  function populateFavorites() {
    // Clear current favorites
    workoutPrograms.favorites = [];
    
    // Add all favorited workouts from all categories
    if (Array.isArray(favorites)) {
      favorites.forEach(favId => {
        // Search in all categories for the favorited workout
        let found = false;
        for (const [categoryId, workouts] of Object.entries(workoutPrograms)) {
          if (categoryId === 'favorites') continue; // Skip favorites category itself
          
          const workout = workouts.find(w => w.id === favId);
          if (workout) {
            // Add to favorites with category info
            workoutPrograms.favorites.push({
              ...workout,
              originalCategory: categoryId
            });
            found = true;
            break;
          }
        }
        
        // If not found in existing categories, create a minimal workout object
        if (!found) {
          workoutPrograms.favorites.push({
            id: favId,
            name: `Избранная тренировка (${favId})`,
            duration: 'Разное',
            description: 'Тренировка добавлена в избранное'
          });
        }
      });
    }
  }

  // Load favorites from localStorage on component mount
  onMount(() => {
    try {
      const storedFavorites = localStorage.getItem('favoriteWorkouts');
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          favorites = parsed;
        } else {
          favorites = [];
        }
      } else {
        favorites = [];
      }
      
      // Populate favorites category on mount
      populateFavorites();
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e);
      favorites = [];
    }
  });

  // Export functions for parent component
  export let onBack;
  export let onSettings;
  export let onTraining;
</script>

<Header title="Выбор тренировки" showSettingsButton={true} onSettings={onSettings} onBack={onBack} />

<div class="exercises-container">
  <!-- Category Filter -->
  <div class="glass-panel category-filter">
    <h2 class="section-title">Выберите категорию тренировки</h2>
    <div class="category-list">
      {#each categories as category}
        <button 
          class="category-button {selectedCategory === category.id ? 'active' : ''}"
          on:click={() => selectCategory(category.id)}
        >
          {category.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Workout Selection -->
  <div class="glass-panel workout-selection">
    {#if !selectedCategory}
      <div class="placeholder">
        <p>Выберите тренировку</p>
      </div>
    {:else}
      <h2 class="section-title">Выберите программу тренировки</h2>
      <div class="workout-list">
        {#each workoutPrograms[selectedCategory] as workout}
          <div 
            class="workout-item {selectedWorkout?.id === workout.id ? 'active' : ''}"
            on:click={() => selectWorkout(workout)}
          >
            <!-- Favorite star icon -->
            <div class="favorite-icon" on:click|stopPropagation={(e) => toggleFavorite(workout.id)}>
              {#if isFavorite(workout.id)}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              {:else}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              {/if}
            </div>
            
            <div class="workout-header">
              <h3 class="workout-name">{workout.name}</h3>
              <span class="workout-duration">{workout.duration}</span>
            </div>
            <p class="workout-description">{workout.description}</p>
            
            <!-- Workout Timeline Visualization -->
            <div class="workout-timeline-container">
              <WorkoutTimeline 
                segments={getWorkoutSegments(workout.id)} 
                className="workout-preview-timeline"
              />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Start Training Button -->
  <button 
    class="start-training-button {(!selectedCategory || !selectedWorkout) ? 'disabled' : ''}"
    on:click={startTraining}
    disabled={!selectedCategory || !selectedWorkout}
  >
    К тренировке
  </button>
</div>

<style>
  .exercises-container {
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
    z-index: 15; /* Increased z-index to ensure panels are above bubbles */
    overflow: hidden;
  }

  .category-filter {
    padding: 1rem;
  }

  .category-list {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .category-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }

  .category-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .category-button.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .workout-selection {
    min-height: 200px;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.1rem;
  }

  .workout-list {
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
    position: relative;
    padding-right: 3rem; /* Add extra padding for the star icon */
  }

  .workout-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .workout-item.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .workout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .workout-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .workout-duration {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    flex-shrink: 0; /* Prevent duration from shrinking */
  }

  .workout-item.active .workout-duration {
    background: rgba(255, 255, 255, 0.3);
  }

  .workout-description {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .workout-item.active .workout-description {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Favorite icon styling */
  .favorite-icon {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    z-index: 2;
    width: 20px;
    height: 20px;
  }

  /* Workout Timeline Container */
  .workout-timeline-container {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    clear: both; /* Clear any floating elements */
  }

  .workout-preview-timeline {
    margin: 0;
  }

  .start-training-button {
    background: linear-gradient(135deg, #41B6E6, #db3eb1);
    color: white;
    border: none;
    border-radius: 0.75rem;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 100; /* Ensure button is above bubble background */
  }

  .start-training-button:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  }

  .start-training-button:active:not(.disabled) {
    transform: translateY(0);
  }

  .start-training-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .exercises-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .glass-panel {
      padding: 1.25rem;
    }

    .category-list {
      flex-direction: column;
    }

    .workout-item {
      flex-direction: column;
      align-items: flex-start;
      padding-right: 3rem; /* Maintain padding for star icon */
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .exercises-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }

    .section-title {
      font-size: 1.1rem;
    }

    .category-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .start-training-button {
      padding: 0.8rem;
      font-size: 0.9rem;
    }
    
    .workout-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .workout-duration {
      align-self: flex-start;
    }
    
    .workout-item {
      padding-right: 3rem; /* Maintain padding for star icon */
    }
  }
</style>