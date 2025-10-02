<script>
  import { onMount } from 'svelte';
  import ExercisesHeader from './Exercises/ExercisesHeader.svelte';
  import CategoryFilter from './Exercises/CategoryFilter.svelte';
  import WorkoutSelection from './Exercises/WorkoutSelection.svelte';
  import { navigationContext } from '../lib/viewTransition.js';
  import { setWorkoutSelected } from '../lib/workoutSelectionStore.js';

  // Props using Svelte 5 runes
  const { onBack, onSettings, onTraining } = $props();

  // Exercise categories
  let categories = $state([
    { id: 'favorites', name: 'Избранные' }, // Moved favorites category to the beginning
    { id: 'running', name: 'Бег' },
    { id: 'treadmill', name: 'Бег на дорожке' },
    { id: 'cycling', name: 'Велосипед' },
    { id: 'walking', name: 'Ходьба' },
    { id: 'nordic_walking', name: 'Скандинавская ходьба' }
  ]);

  // Workout programs for each category with duration information
  let workoutPrograms = $state({
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
  });

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
  let selectedCategory = $state('favorites'); // Set favorites as default selected category
  let selectedWorkout = $state(null);
  
  // Favorites state
  let favorites = $state([]);

  // Function to select a category
  function selectCategory(categoryId) {
    selectedCategory = categoryId;
    // Reset workout selection when category changes
    selectedWorkout = null;
    // Update workout selection state
    setWorkoutSelected(false);
    
    // If selecting favorites category, populate it with favorite workouts
    if (categoryId === 'favorites') {
      populateFavorites();
    }
  }

  // Function to select a workout
  function selectWorkout(workout) {
    try {
      selectedWorkout = workout;
      // Update workout selection state with full workout data
      const category = categories.find(c => c.id === selectedCategory);
      if (category && workout) {
        setWorkoutSelected({
          category: category,
          workout: workout
        });
      } else {
        console.warn('Invalid category or workout selection');
        setWorkoutSelected(null);
      }
    } catch (error) {
      console.error('Error selecting workout:', error);
      setWorkoutSelected(null);
    }
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
</script>

<ExercisesHeader 
  title="Выбор тренировки" 
  showSettingsButton={true} 
  {onSettings} 
  {onBack} 
  class="exercises-header"
/>

<div class="exercises-container exercises-main-container">
  <CategoryFilter 
    {categories}
    {selectedCategory}
    {selectCategory}
    class="exercises-category-filter"
  />
  
  <WorkoutSelection 
    {selectedCategory}
    {workoutPrograms}
    {selectedWorkout}
    {selectWorkout}
    {toggleFavorite}
    {isFavorite}
    {getWorkoutSegments}
    class="exercises-workout-selection"
  />
</div>

<style>
  .exercises-main-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
    z-index: 16;
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

  .exercises-header {
    z-index: 20;
  }

  .exercises-category-filter {
    z-index: 17;
  }

  .exercises-workout-selection {
    z-index: 16;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .exercises-main-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .glass-panel {
      padding: 1.25rem;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .exercises-main-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }
  }
</style>