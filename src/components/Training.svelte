<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import TrainingHeader from './Training/TrainingHeader.svelte';
  import TrainingInfoPanel from './Training/TrainingInfoPanel.svelte';
  import TrainingMapPanel from './Training/TrainingMapPanel.svelte';
  import TrainingControls from './Training/TrainingControls.svelte';
  import TrainingTabBarSection from './Training/TrainingTabBarSection.svelte';
  import WorkoutSummary from './Training/WorkoutSummary.svelte';
  import { hideTabBar, showTabBar } from '../lib/tabBarStore.js';
  import intensityZoneService from '../lib/intensityZoneService.js';
  import personalSpeedZoneService from '../lib/personalSpeedZoneService.js';
  import { workoutSelected, resetWorkoutSelection } from '../lib/workoutSelectionStore.js';

  // Create event dispatcher for communicating with parent components
  const dispatch = createEventDispatcher();

  // Initialize training data with default values
  let training = $state({
    id: 1,
    name: "Утренняя тренировка",
    type: "running",
    duration: 30,
    calories: 320,
    intensity: "high",
    icon: "./icons/run.png",
    startTime: "2023-06-15T08:30:00",
    endTime: "2023-06-15T09:00:00",
    completed: false,
    exercises: [
      {
        id: 1,
        name: "Разминка",
        duration: 5,
        calories: 50,
        completed: true
      },
      {
        id: 2,
        name: "Бег на дорожке",
        duration: 20,
        calories: 250,
        completed: false
      },
      {
        id: 3,
        name: "Заминка",
        duration: 5,
        calories: 20,
        completed: false
      }
    ]
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

  // Icon mapping based on category
  const categoryIcons = {
    'running': './icons/run.png',
    'treadmill': './icons/treadmill.png',
    'cycling': './icons/cycling.png',
    'walking': './icons/walking.png',
    'nordic_walking': './icons/walking.png'
  };

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

  // Workout duration mapping based on workout type
  const workoutDurations = {
    'free_run': { duration: 0, calories: 0, intensity: "medium" }, // Free workout - no fixed duration
    'cardio': { duration: 30, calories: 320, intensity: "high" },
    'timed_run': { duration: 45, calories: 450, intensity: "high" },
    'assessment_run': { duration: 20, calories: 200, intensity: "medium" },
    'free_treadmill': { duration: 0, calories: 0, intensity: "medium" }, // Free workout - no fixed duration
    'cardio_treadmill': { duration: 30, calories: 300, intensity: "high" },
    'timed_treadmill': { duration: 45, calories: 420, intensity: "high" },
    'assessment_treadmill': { duration: 20, calories: 180, intensity: "medium" },
    'free_cycling': { duration: 0, calories: 0, intensity: "medium" }, // Free workout - no fixed duration
    'cardio_cycling': { duration: 30, calories: 280, intensity: "high" },
    'timed_cycling': { duration: 45, calories: 400, intensity: "high" },
    'assessment_cycling': { duration: 20, calories: 160, intensity: "medium" },
    'free_walking': { duration: 0, calories: 0, intensity: "low" }, // Free workout - no fixed duration
    'cardio_walking': { duration: 30, calories: 180, intensity: "medium" },
    'timed_walking': { duration: 45, calories: 250, intensity: "medium" },
    'assessment_walking': { duration: 20, calories: 100, intensity: "low" },
    'free_nordic': { duration: 0, calories: 0, intensity: "low" }, // Free workout - no fixed duration
    'cardio_nordic': { duration: 30, calories: 220, intensity: "medium" },
    'timed_nordic': { duration: 45, calories: 320, intensity: "medium" },
    'assessment_nordic': { duration: 20, calories: 140, intensity: "low" }
  };

  // Try to load selected training data from localStorage
  onMount(() => {
    try {
      // First try to get data from the store (passed directly)
      const savedTraining = localStorage.getItem('selectedTraining');
      if (savedTraining) {
        const trainingData = JSON.parse(savedTraining);
        // Update training object with selected data
        if (trainingData.category && trainingData.workout) {
          training.name = `${trainingData.category.name} - ${trainingData.workout.name}`;
          training.type = trainingData.category.id;
          
          // Set icon based on category
          training.icon = categoryIcons[trainingData.category.id] || '/icons/run.png';
          
          // Set duration, calories, and intensity based on workout type
          const workoutInfo = workoutDurations[trainingData.workout.id];
          if (workoutInfo) {
            training.duration = workoutInfo.duration;
            // For free workouts (duration = 0), set calories to 0 as well
            training.calories = workoutInfo.duration === 0 ? 0 : workoutInfo.calories;
            training.intensity = workoutInfo.intensity;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load selected training from localStorage:', e);
    }
  });

  // Training state
  let trainingStarted = $state(false);
  let trainingPaused = $state(false);
  let startTime = $state(null);
  let elapsedTime = $state(0);
  let distance = $state(0);
  let speed = $state(0);
  
  // Timer interval
  let timerInterval = null;

  // Mock real-time training stats
  let trainingStats = $state({
    time: "00:00:00",
    distance: "0.0 km",
    speed: "0.0 km/h",
    avgSpeed: "0.0 km/h",
    maxSpeed: "0.0 km/h",
    pace: "0:00 /km",
    calories: "0 kcal",
    steps: "0"
  });

  // Cumulative values that should only increase
  let totalDistance = $state(0); // in km
  let totalSteps = $state(0); // count
  let totalCalories = $state(0); // count
  let lastUpdateTime = $state(0); // for calculating increments
  
  // Segment tracking
  let currentWorkoutSegments = $state([]);
  let currentSegmentIndex = $state(0);
  let currentSegmentTime = $state(0); // Time spent in current segment (seconds)
  let segmentSpeeds = $state([]); // To store speed data for each segment

  // Final workout data
  let finalWorkoutData = $state(null);
  let showSummaryModal = $state(false);

  // Function to format time
  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Function to get intensity color
  function getIntensityColor(intensity) {
    switch (intensity) {
      case 'low': return '#41B6E6'; // Miami Blue
      case 'medium': return '#FFD700'; // Gold
      case 'high': return '#db3eb1'; // Miami Pink
      default: return '#FFFFFF';
    }
  }

  // Function to toggle exercise completion
  function toggleExerciseCompletion(exerciseId) {
    const exercise = training.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      exercise.completed = !exercise.completed;
    }
  }

  // Function to format elapsed time as HH:MM:SS
  function formatElapsedTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Function to update training stats
  function updateTrainingStats() {
    if (!trainingStarted || trainingPaused) return;
    
    // Update elapsed time
    const currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;
    trainingStats.time = formatElapsedTime(elapsedTime);
    
    // Calculate time delta for this update
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    
    // Update segment tracking
    if (currentWorkoutSegments.length > 0) {
      // Calculate current segment based on elapsed time
      const elapsedMinutes = elapsedTime / (1000 * 60);
      let accumulatedTime = 0;
      let newSegmentIndex = 0;
      
      for (let i = 0; i < currentWorkoutSegments.length; i++) {
        accumulatedTime += currentWorkoutSegments[i].duration;
        if (elapsedMinutes <= accumulatedTime) {
          newSegmentIndex = i;
          break;
        }
      }
      
      // If we've moved to a new segment, update the index
      if (newSegmentIndex !== currentSegmentIndex) {
        currentSegmentIndex = newSegmentIndex;
        currentSegmentTime = 0; // Reset time in new segment
      }
      
      // Update time spent in current segment
      currentSegmentTime += deltaTime / 1000; // Convert to seconds
      
      // Store speed data for current segment (for average calculation)
      if (segmentSpeeds[currentSegmentIndex]) {
        segmentSpeeds[currentSegmentIndex].push(speed);
      }
    }
    
    // Simulate more realistic distance and speed updates
    // In a real app, this would come from GPS or other sensors
    // Simulate varying speed for more realistic training simulation
    const seconds = elapsedTime / 1000;
    const minutes = seconds / 60;
    
    // Simulate varying speed (in km/h) based on a sine wave for more realistic movement
    // Base speed of 10 km/h with variations
    const baseSpeed = 10;
    const speedVariation = 5 * Math.sin(seconds * 0.1); // Varying component
    speed = baseSpeed + speedVariation;
    
    // Ensure speed doesn't go below 0
    if (speed < 0) speed = 0;
    
    // Calculate distance increment based on current speed and time delta
    // Distance = speed (km/h) * time (h)
    if (deltaTime > 0) {
      const distanceIncrement = (speed * (deltaTime / 1000)) / 3600; // Convert ms to hours
      totalDistance += distanceIncrement;
    }
    
    trainingStats.distance = `${totalDistance.toFixed(2)} km`;
    trainingStats.speed = `${speed.toFixed(1)} km/h`;
    
    // Update average speed (total distance / total time)
    const hours = elapsedTime / (1000 * 60 * 60);
    if (hours > 0) {
      trainingStats.avgSpeed = `${(totalDistance / hours).toFixed(1)} km/h`;
    } else {
      trainingStats.avgSpeed = "0.0 km/h";
    }
    
    // Update max speed
    const currentMaxSpeed = parseFloat(trainingStats.maxSpeed);
    if (speed > currentMaxSpeed) {
      trainingStats.maxSpeed = `${speed.toFixed(1)} km/h`;
    }
    
    // Update pace (time per km) - minutes:seconds per kilometer
    if (speed > 0) {
      // Pace = 60 minutes / speed (km/h)
      const paceMinutes = 60 / speed;
      const minutes = Math.floor(paceMinutes);
      const seconds = Math.floor((paceMinutes - minutes) * 60);
      trainingStats.pace = `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
    } else {
      trainingStats.pace = "0:00 /km";
    }
    
    // Update calories incrementally (more realistic calculation based on MET values)
    // MET (Metabolic Equivalent of Task) values for running at different speeds
    let metValue = 0;
    if (speed < 8) {
      metValue = 8.0; // Slow running/jogging
    } else if (speed < 10) {
      metValue = 10.0; // Moderate running
    } else if (speed < 12) {
      metValue = 12.0; // Fast running
    } else {
      metValue = 14.0; // Very fast running
    }
    
    // Calories burned = MET * weight(kg) * time(hours)
    // Assuming an average weight of 70kg for demonstration
    const weight = 70; // kg
    if (deltaTime > 0) {
      // Calculate calories increment based on time delta
      const hoursIncrement = deltaTime / (1000 * 60 * 60); // Convert ms to hours
      const caloriesIncrement = metValue * weight * hoursIncrement;
      totalCalories += caloriesIncrement;
    }
    trainingStats.calories = `${Math.floor(totalCalories)} kcal`;
    
    // Update steps (more realistic calculation)
    // Steps per km varies by person, but average is about 1400-2000 steps per km
    // We'll calculate based on stride length which depends on speed
    let stepsPerKm = 0;
    if (speed < 6) {
      stepsPerKm = 1800; // Walking/slow jogging
    } else if (speed < 10) {
      stepsPerKm = 1600; // Moderate running
    } else if (speed < 14) {
      stepsPerKm = 1500; // Fast running
    } else {
      stepsPerKm = 1400; // Very fast running (longer strides)
    }
    
    // Calculate steps increment based on distance increment
    if (deltaTime > 0) {
      const distanceIncrement = (speed * (deltaTime / 1000)) / 3600; // Convert ms to hours
      const stepsIncrement = Math.floor(distanceIncrement * stepsPerKm);
      totalSteps += stepsIncrement;
    }
    
    trainingStats.steps = `${totalSteps.toLocaleString()}`;
  }

  // Long press variables
  let pressTimer = null;
  let pressProgress = 0;
  let isPressing = false;
  let startButtonElement = null;
  let finishButtonElement = null;

  // Function to handle long press start
  function handlePressStart() {
    if (isPressing) return;
    
    isPressing = true;
    pressProgress = 0;
    
    // Clear any existing timer
    if (pressTimer) {
      clearInterval(pressTimer);
    }
    
    // Start progress tracking
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds
    
    pressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      pressProgress = Math.min(1, elapsed / duration);
      
      // Update button scale based on progress (0% to 50% increase)
      if (startButtonElement) {
        const scale = 1 + (0.5 * pressProgress);
        startButtonElement.style.transform = `scale(${scale})`;
      }
      
      // Check if 2.5 seconds have passed
      if (elapsed >= duration) {
        clearInterval(pressTimer);
        pressTimer = null;
        isPressing = false;
        pressProgress = 1;
        
        // Trigger start training
        startTraining();
      }
    }, 10); // Update every 10ms for smooth animation
  }

  // Function to handle press end/cancel
  function handlePressEnd() {
    if (!isPressing) return;
    
    isPressing = false;
    
    // Clear timer
    if (pressTimer) {
      clearInterval(pressTimer);
      pressTimer = null;
    }
    
    // Reset button scale
    if (startButtonElement) {
      startButtonElement.style.transform = 'scale(1)';
    }
    
    pressProgress = 0;
  }

  // Function to handle long press start for finish button
  function handleFinishPressStart() {
    if (isPressing) return;
    
    isPressing = true;
    pressProgress = 0;
    
    // Clear any existing timer
    if (pressTimer) {
      clearInterval(pressTimer);
    }
    
    // Start progress tracking
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds
    
    pressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      pressProgress = Math.min(1, elapsed / duration);
      
      // Update button scale based on progress (0% to 50% increase)
      if (finishButtonElement) {
        const scale = 1 + (0.5 * pressProgress);
        finishButtonElement.style.transform = `scale(${scale})`;
      }
      
      // Check if 2.5 seconds have passed
      if (elapsed >= duration) {
        clearInterval(pressTimer);
        pressTimer = null;
        isPressing = false;
        pressProgress = 1;
        
        // Trigger finish training
        finishTraining();
      }
    }, 10); // Update every 10ms for smooth animation
  }

  // Function to handle press end/cancel for finish button
  function handleFinishPressEnd() {
    if (!isPressing) return;
    
    isPressing = false;
    
    // Clear timer
    if (pressTimer) {
      clearInterval(pressTimer);
      pressTimer = null;
    }
    
    // Reset button scale
    if (finishButtonElement) {
      finishButtonElement.style.transform = 'scale(1)';
    }
    
    pressProgress = 0;
  }

  // Function to start training
  function startTraining() {
    trainingStarted = true;
    trainingPaused = false;
    startTime = new Date().getTime() - elapsedTime; // Resume from where we left off if paused
    lastUpdateTime = new Date().getTime(); // Initialize last update time
    
    // Initialize segment tracking
    currentWorkoutSegments = getWorkoutSegments(getWorkoutId());
    currentSegmentIndex = 0;
    currentSegmentTime = 0;
    segmentSpeeds = currentWorkoutSegments.map(() => []);
    
    // TabBar visibility is now controlled by TrainingTabBar component
    // hideTabBar();
    
    // Start timer interval
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTrainingStats, 1000);
    
    console.log('Тренировка начата');
  }

  // Function to pause training
  function pauseTraining() {
    trainingPaused = !trainingPaused;
    
    if (trainingPaused) {
      // Pause the timer
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      console.log('Тренировка приостановлена');
    } else {
      // Resume the timer
      startTime = new Date().getTime() - elapsedTime;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTrainingStats, 1000);
      console.log('Тренировка возобновлена');
    }
  }

  // Function to finish training
  function finishTraining() {
    // Phase 1: Immediate stop of all data collection processes
    trainingStarted = false;
    trainingPaused = false;
    
    // Clear the timer immediately
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    // Calculate average speeds for each segment
    const segmentsWithAvgSpeeds = currentWorkoutSegments.map((segment, index) => {
      const speeds = segmentSpeeds[index] || [];
      const avgSpeed = speeds.length > 0 
        ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length 
        : 0;
      
      return {
        ...segment,
        avgSpeed: parseFloat(avgSpeed.toFixed(1)) // km/h
      };
    });
    
    // Phase 2: Prepare final workout data
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const isLongEnough = totalSeconds > 600; // 10 minutes = 600 seconds
    
    // Store final data before any resets
    finalWorkoutData = {
      time: trainingStats.time,
      distance: trainingStats.distance,
      speed: trainingStats.speed,
      avgSpeed: trainingStats.avgSpeed,
      maxSpeed: trainingStats.maxSpeed,
      pace: trainingStats.pace,
      calories: trainingStats.calories,
      steps: trainingStats.steps,
      duration: totalSeconds,
      isLongEnough: isLongEnough,
      segments: segmentsWithAvgSpeeds // Include segments with average speeds
    };
    
    // Phase 3: Show the summary modal instead of immediately saving
    showSummaryModal = true;
    
    console.log('Тренировка завершена и открыто модальное окно');
  }
  
  // Function to confirm and save workout data
  function confirmAndSaveWorkout() {
    if (!finalWorkoutData) return;
    
    // Check if workout duration exceeds 10 minutes (600 seconds)
    const isLongEnough = finalWorkoutData.isLongEnough;
    
    // Save workout to history if it's long enough
    if (isLongEnough) {
      saveWorkoutToHistory();
    }
    
    // Check if this was an assessment training
    const workoutId = getWorkoutId();
    const isAssessment = personalSpeedZoneService.isAssessmentWorkout(workoutId);
    
    // If this was an assessment training, calculate and save personal speed zones
    if (isAssessment) {
      try {
        // Calculate personal speed zones based on actual training data
        const zonesData = personalSpeedZoneService.calculatePersonalSpeedZones(finalWorkoutData.segments);
        
        // Save the calculated personal speed zones
        personalSpeedZoneService.savePersonalSpeedZones(zonesData);
        
        console.log('Персональные скоростные зоны успешно рассчитаны и сохранены:', zonesData);
      } catch (error) {
        console.error('Ошибка при расчете персональных скоростных зон:', error);
      }
    }
    
    // Also calculate and save intensity zones for backward compatibility
    if (isAssessment) {
      try {
        // Extract average speeds for intensity zone calculation
        const segmentSpeeds = finalWorkoutData.segments.map(segment => segment.avgSpeed || 0);
        
        // Calculate intensity zones based on segment speeds
        const zonesData = intensityZoneService.calculateIntensityZones(segmentSpeeds);
        
        // Save the calculated zones
        intensityZoneService.saveZonesData(zonesData);
        
        console.log('Интенсивные зоны успешно рассчитаны и сохранены:', zonesData);
      } catch (error) {
        console.error('Ошибка при расчете интенсивных зон:', error);
      }
    }
    
    // TabBar visibility is now controlled by TrainingTabBar component
    // showTabBar();
    
    // Phase 4: Reset stats after saving
    resetTrainingStats();
    
    console.log('Тренировка сохранена и данные сброшены');
  }
  
  // Function to handle modal close
  function handleModalClose() {
    showSummaryModal = false;
    // Reset stats after closing modal
    resetTrainingStats();
  }
  
  // Function to handle modal save
  function handleModalSave() {
    showSummaryModal = false;
    // Save the workout data
    confirmAndSaveWorkout();
  }
  
  // Function to reset training stats
  function resetTrainingStats() {
    elapsedTime = 0;
    distance = 0;
    speed = 0;
    totalDistance = 0;
    totalSteps = 0;
    totalCalories = 0;
    lastUpdateTime = 0;
    
    // Reset segment tracking
    currentWorkoutSegments = [];
    currentSegmentIndex = 0;
    currentSegmentTime = 0;
    segmentSpeeds = [];
    
    // Reset displayed stats
    trainingStats.time = "00:00:00";
    trainingStats.distance = "0.0 km";
    trainingStats.speed = "0.0 km/h";
    trainingStats.avgSpeed = "0.0 km/h";
    trainingStats.maxSpeed = "0.0 km/h";
    trainingStats.pace = "0:00 /km";
    trainingStats.calories = "0 kcal";
    trainingStats.steps = "0";
    
    // Clear final workout data
    finalWorkoutData = null;
  }

  // Function to save workout data to history
  function saveWorkoutToHistory() {
    try {
      // Get selected training data
      const selectedWorkout = $workoutSelected;
      let trainingData = null;
      if (selectedWorkout) {
        trainingData = selectedWorkout;
      }
      
      // Get workout segments for visualization
      const workoutId = getWorkoutId();
      const segments = getWorkoutSegments(workoutId);
      
      // Create workout history entry
      const workoutEntry = {
        id: Date.now(), // Unique ID based on timestamp
        date: new Date().toISOString(),
        type: trainingData?.category?.id || 'running', // Default to running if no data
        duration: finalWorkoutData.duration, // in seconds
        distance: parseFloat(finalWorkoutData.distance.replace(' km', '')) || 0, // in km (parse correctly)
        avgPace: finalWorkoutData.duration / (parseFloat(finalWorkoutData.distance.replace(' km', '')) || 1), // seconds per km
        avgSpeed: parseFloat(finalWorkoutData.avgSpeed) || 0, // km/h
        maxSpeed: parseFloat(finalWorkoutData.maxSpeed) || 0, // km/h
        calories: parseInt(finalWorkoutData.calories) || 0,
        steps: parseInt(finalWorkoutData.steps.replace(/\s/g, '')) || 0, // Remove spaces from formatted number
        segments: finalWorkoutData.segments // Segments with average speeds
      };
      
      // Validate required fields
      if (!workoutEntry.date || !workoutEntry.type) {
        throw new Error('Missing required workout data');
      }
      
      // Load existing history
      let history = [];
      const existingHistory = localStorage.getItem('workoutHistory');
      if (existingHistory) {
        try {
          history = JSON.parse(existingHistory);
          // Ensure it's an array
          if (!Array.isArray(history)) {
            history = [];
          }
        } catch (parseError) {
          console.error('Error parsing existing workout history:', parseError);
          history = [];
        }
      }
      
      // Add new workout to history
      history.push(workoutEntry);
      
      // Save updated history
      localStorage.setItem('workoutHistory', JSON.stringify(history));
      
      console.log('Тренировка сохранена в истории:', workoutEntry);
    } catch (error) {
      console.error('Ошибка при сохранении тренировки в истории:', error);
      // Show user-friendly error message
      alert('Не удалось сохранить тренировку в историю. Пожалуйста, попробуйте еще раз.');
      // In a real implementation, you might want to show an error message to the user
    }
  }

  // Export functions for parent component
  // Props using Svelte 5 runes
  const { onBack, onSettings } = $props();

  // Get the workout ID for timeline display
  function getWorkoutId() {
    // Try to get data from the store (passed directly)
    const selectedWorkout = $workoutSelected;
    if (selectedWorkout && selectedWorkout.workout && selectedWorkout.workout.id) {
      return selectedWorkout.workout.id;
    }
    
    // Default to assessment_run if no workout ID found
    return 'assessment_run';
  }
  
  // Update training data when workout selection changes
  $effect(() => {
    try {
      const selectedWorkout = $workoutSelected;
      if (selectedWorkout && selectedWorkout.category && selectedWorkout.workout) {
        training.name = `${selectedWorkout.category.name} - ${selectedWorkout.workout.name}`;
        training.type = selectedWorkout.category.id;
        
        // Set icon based on category
        training.icon = categoryIcons[selectedWorkout.category.id] || '/icons/run.png';
        
        // Set duration, calories, and intensity based on workout type
        const workoutInfo = workoutDurations[selectedWorkout.workout.id];
        if (workoutInfo) {
          training.duration = workoutInfo.duration;
          // For free workouts (duration = 0), set calories to 0 as well
          training.calories = workoutInfo.duration === 0 ? 0 : workoutInfo.calories;
          training.intensity = workoutInfo.intensity;
        }
      } else if (selectedWorkout === null) {
        // Reset to default values if no workout is selected
        training = {
          id: 1,
          name: "Утренняя тренировка",
          type: "running",
          duration: 30,
          calories: 320,
          intensity: "high",
          icon: "./icons/run.png",
          startTime: "2023-06-15T08:30:00",
          endTime: "2023-06-15T09:00:00",
          completed: false,
          exercises: [
            {
              id: 1,
              name: "Разминка",
              duration: 5,
              calories: 50,
              completed: true
            },
            {
              id: 2,
              name: "Бег на дорожке",
              duration: 20,
              calories: 250,
              completed: false
            },
            {
              id: 3,
              name: "Заминка",
              duration: 5,
              calories: 20,
              completed: false
            }
          ]
        };
      }
    } catch (error) {
      console.error('Error updating training data:', error);
      // Reset to default values on error
      training = {
        id: 1,
        name: "Утренняя тренировка",
        type: "running",
        duration: 30,
        calories: 320,
        intensity: "high",
        icon: "./icons/run.png",
        startTime: "2023-06-15T08:30:00",
        endTime: "2023-06-15T09:00:00",
        completed: false,
        exercises: [
          {
            id: 1,
            name: "Разминка",
            duration: 5,
            calories: 50,
            completed: true
          },
          {
            id: 2,
            name: "Бег на дорожке",
            duration: 20,
            calories: 250,
            completed: false
          },
          {
            id: 3,
            name: "Заминка",
            duration: 5,
            calories: 20,
            completed: false
          }
        ]
      };
    }
  });

  // Function to handle tab changes from TrainingTabBar
  function handleTabChange(event) {
    const { tab } = event.detail;
    console.log('Tab changed to:', tab);
    
    // Dispatch event to parent component to handle navigation
    dispatch('tabChanged', { tab });
  }
  
  // Function to handle start training from TrainingTabBar
  function handleStartTraining() {
    console.log('Received startTraining event in Training.svelte');
    startTraining();
  }
  
  // Function to handle pause training from ActiveTrainingTabBar
  function handlePauseTraining() {
    pauseTraining();
  }
  
  // Function to handle finish training from ActiveTrainingTabBar
  function handleFinishTraining() {
    finishTraining();
  }
  
  // Reset workout selection when component is destroyed
  onDestroy(() => {
    resetWorkoutSelection();
  });
</script>

<TrainingHeader 
  title="Тренировка" 
  showSettingsButton={false} 
  onSettings={onSettings} 
  onBack={onBack} 
/>

<div class="training-container training-main-container">
  <TrainingInfoPanel 
    {training}
    {getWorkoutSegments}
    {getWorkoutId}
    currentTime={elapsedTime / 1000}
  />
  
  <TrainingMapPanel 
    {trainingStarted}
    {trainingPaused}
    {trainingStats}
  />
  
  <TrainingTabBarSection 
    {trainingStarted}
    {handleStartTraining}
    {handleTabChange}
    {handlePauseTraining}
    {handleFinishTraining}
  />
</div>

<WorkoutSummary 
  {showSummaryModal}
  {finalWorkoutData}
  {handleModalClose}
  {handleModalSave}
/>

<style>
  .training-main-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header - matching other pages */
    z-index: 15;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .training-main-container {
      padding: 1rem 0;
      gap: 1rem;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .training-main-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }
  }
</style>