<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte'; // Import createEventDispatcher
  import Header from './Header.svelte';
  import WorkoutTimeline from './WorkoutTimeline.svelte'; // Import the new component
  import mapboxgl from 'mapbox-gl';
  import { hideTabBar, showTabBar } from '../lib/tabBarStore.js'; // Import TabBar control functions
  import intensityZoneService from '../lib/intensityZoneService.js'; // Import Intensity Zone Service
  import TrainingTabBar from './TrainingTabBar.svelte'; // Import the new Training TabBar
  import ActiveTrainingTabBar from './ActiveTrainingTabBar.svelte'; // Import the Active Training TabBar

  // Create event dispatcher for communicating with parent components
  const dispatch = createEventDispatcher();

  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';

  // Initialize training data with default values
  let training = {
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
    
    initializeMap();
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

  // Final workout data (to be shown in modal)
  let finalWorkoutData = null;
  
  // Modal state
  let showModal = false;

  // Map variables
  let mapContainer;
  let map;
  let geolocateControl;
  let routeCoordinates = [];
  let routeSourceId = 'route-source';
  let routeLayerId = 'route-layer';

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
    
    // Start geolocation tracking
    if (geolocateControl) {
      // Add a small delay to ensure the trainingStarted flag is properly set
      setTimeout(() => {
        geolocateControl.trigger();
      }, 100);
    }
    
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
    
    // Stop geolocation tracking
    if (geolocateControl) {
      geolocateControl._watchState = 'OFF';
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
    
    // Phase 3: Show modal with results
    showModal = true;
    
    console.log('Тренировка завершена, показываем модальное окно');
  }
  
  // Function to confirm and save workout data
  function confirmAndSaveWorkout() {
    if (!finalWorkoutData) return;
    
    // Close modal
    showModal = false;
    
    // Check if workout duration exceeds 10 minutes (600 seconds)
    const isLongEnough = finalWorkoutData.isLongEnough;
    
    // Save workout to history if it's long enough
    if (isLongEnough) {
      saveWorkoutToHistory();
    }
    
    // Check if this was an assessment training
    const workoutId = getWorkoutId();
    const isAssessment = workoutId && workoutId.startsWith('assessment');
    
    // If this was an assessment training, calculate and save intensity zones
    if (isAssessment) {
      try {
        // For demonstration, we'll use fixed speeds for each segment
        // In a real implementation, these would be calculated from actual training data
        const segmentSpeeds = [8.5, 10.2, 12.8, 14.5, 16.2]; // km/h for each segment
        
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
  
  // Function to cancel workout saving (close modal without saving)
  function cancelWorkout() {
    showModal = false;
    
    // TabBar visibility is now controlled by TrainingTabBar component
    // showTabBar();
    
    // Reset stats
    resetTrainingStats();
    
    console.log('Сохранение тренировки отменено');
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
    
    // Reset route
    routeCoordinates = [];
    if (map && map.getSource(routeSourceId)) {
      map.getSource(routeSourceId).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }
    
    // Clear final workout data
    finalWorkoutData = null;
  }

  // Function to save workout data to history
  function saveWorkoutToHistory() {
    try {
      // Get selected training data
      const savedTraining = localStorage.getItem('selectedTraining');
      let trainingData = null;
      if (savedTraining) {
        trainingData = JSON.parse(savedTraining);
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
      
      // Load existing history
      let history = [];
      const existingHistory = localStorage.getItem('workoutHistory');
      if (existingHistory) {
        history = JSON.parse(existingHistory);
      }
      
      // Add new workout to history
      history.push(workoutEntry);
      
      // Save updated history
      localStorage.setItem('workoutHistory', JSON.stringify(history));
      
      console.log('Тренировка сохранена в истории:', workoutEntry);
    } catch (error) {
      console.error('Ошибка при сохранении тренировки в истории:', error);
      // In a real implementation, you might want to show an error message to the user
    }
  }

  // Export functions for parent component
  // Props using Svelte 5 runes
  const { onBack, onSettings } = $props();

  // Initialize the Mapbox map
  function initializeMap() {
    if (!mapContainer) return;
    
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.5234, 50.4501], // Default to Kyiv coordinates
      zoom: 14
    });

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    });
    map.addControl(nav, 'top-right');

    // Add geolocate control
    geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocateControl, 'top-left');

    // Wait for map to load before adding event listeners
    map.on('load', () => {
      // Set up event listeners for geolocation
      geolocateControl.on('geolocate', (position) => {
        const { longitude, latitude } = position.coords;
        const newCoordinate = [longitude, latitude];
        
        // Add new coordinate to route only if training is active
        if (trainingStarted && !trainingPaused) {
          routeCoordinates.push(newCoordinate);
          
          // Update or create route source
          if (map.getSource(routeSourceId)) {
            map.getSource(routeSourceId).setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            });
          } else {
            // Create route source and layer
            map.addSource(routeSourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates
                }
              }
            });
            
            map.addLayer({
              id: routeLayerId,
              type: 'line',
              source: routeSourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#db3eb1', // Miami Pink
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
          
          // Smoothly move the map to follow the user
          map.easeTo({
            center: newCoordinate,
            zoom: 16,
            duration: 1000 // Smooth transition over 1 second
          });
        }
      });

      // Handle errors in geolocation
      geolocateControl.on('error', (error) => {
        console.error('Geolocation error:', error);
        alert('Не удалось получить ваше местоположение. Пожалуйста, проверьте настройки браузера.');
      });
    });
  }

  // Get the workout ID for timeline display
  function getWorkoutId() {
    // Try to load selected training data from localStorage
    try {
      const savedTraining = localStorage.getItem('selectedTraining');
      if (savedTraining) {
        const trainingData = JSON.parse(savedTraining);
        if (trainingData.workout && trainingData.workout.id) {
          return trainingData.workout.id;
        }
      }
    } catch (e) {
      console.error('Failed to load selected training from localStorage:', e);
    }
    
    // Default to assessment_run if no workout ID found
    return 'assessment_run';
  }
  
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
  
  
</script>

<Header title="Тренировка" showSettingsButton={false} onSettings={onSettings} onBack={onBack} />

<div class="training-container">
  <!-- Workout Info and Timeline Panel for all workouts -->
  <div class="glass-panel workout-info-timeline">
    <div class="workout-header">
      <h2 class="workout-title">{training.name}</h2>
      {#if training.duration > 0}
        <div class="workout-duration">{training.duration} мин</div>
      {:else}
        <div class="workout-duration">Без ограничения по времени</div>
      {/if}
    </div>
    
    <!-- Workout Timeline Visualization for all workouts -->
  </div>
  
  <!-- Map Panel with Controls at Bottom -->
  <div class="glass-panel map-panel">
    <!-- Moved timeline section to this panel as requested -->
    <div class="timeline-section">
      <WorkoutTimeline segments={getWorkoutSegments(getWorkoutId())} currentTime={elapsedTime / 1000} />
    </div>
    
    <!-- Training Stats Grid -->
    <div class="training-stats-grid">
      <div class="stat-item">
        <div class="stat-label">Время</div>
        <div class="stat-value">{trainingStats.time}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Расстояние</div>
        <div class="stat-value">{trainingStats.distance}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Скорость</div>
        <div class="stat-value">{trainingStats.speed}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Ср.Скорость</div>
        <div class="stat-value">{trainingStats.avgSpeed}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Макс.Ск</div>
        <div class="stat-value">{trainingStats.maxSpeed}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Темп</div>
        <div class="stat-value">{trainingStats.pace}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Калл</div>
        <div class="stat-value">{trainingStats.calories}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Шаги</div>
        <div class="stat-value">{trainingStats.steps}</div>
      </div>
    </div>
    
    <div class="map-container" bind:this={mapContainer}></div>
  </div>

  <!-- Training TabBar - show regular tab bar when not training, active tab bar when training -->
  {#if !trainingStarted}
    <TrainingTabBar on:startTraining={handleStartTraining} on:tabChanged={handleTabChange} />
  {:else}
    <ActiveTrainingTabBar on:pauseTraining={handlePauseTraining} on:finishTraining={handleFinishTraining} />
  {/if}

  <!-- Modal Dialog for Workout Results -->
  {#if showModal && finalWorkoutData}
    <div class="modal-overlay" on:click={cancelWorkout}>
      <div class="modal-content" on:click|stopPropagation={() => {}}>
        <h2 class="modal-title">Результаты тренировки</h2>
        
        <!-- Workout Timeline with Average Speeds -->
        <div class="modal-timeline-section">
          <h3 class="section-subtitle">Сегменты тренировки</h3>
          <WorkoutTimeline segments={finalWorkoutData.segments} showAvgSpeeds={true} />
        </div>
        
        <div class="workout-results">
          <div class="result-item">
            <div class="result-label">Время</div>
            <div class="result-value">{finalWorkoutData.time}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Расстояние</div>
            <div class="result-value">{finalWorkoutData.distance}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Средняя скорость</div>
            <div class="result-value">{finalWorkoutData.avgSpeed}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Макс. скорость</div>
            <div class="result-value">{finalWorkoutData.maxSpeed}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Темп</div>
            <div class="result-value">{finalWorkoutData.pace}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Калории</div>
            <div class="result-value">{finalWorkoutData.calories}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Шаги</div>
            <div class="result-value">{finalWorkoutData.steps}</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="modal-button cancel-button" on:click={cancelWorkout}>
            Отмена
          </button>
          <button class="modal-button confirm-button" on:click={confirmAndSaveWorkout}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  {/if }
</div>

<style>
  .training-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header - matching other pages */
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
    z-index: 10;
    overflow: hidden;
  }

  /* Combined Workout Info and Timeline Panel */
  .workout-info-timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3),
      inset 0 0 2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15),
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 10;
    overflow: hidden;
  }

  .workout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .workout-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  }

  .workout-duration {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }

  .timeline-section {
    padding: 0;
  }

  /* Map Panel */
  .map-panel {
    height: 70vh; /* Reduced height as per user preference */
    display: flex;
    flex-direction: column;
  }

  /* Training Stats Grid */
  .training-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 0.75rem;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.15);
  }

  .stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .map-container {
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    overflow: hidden;
    margin-bottom: 1rem; /* Space for buttons */
  }

  /* Control Buttons at Bottom of Map */
  .control-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: auto; /* Push buttons to bottom */
  }

  .control-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 50%; /* Make buttons circular */
    color: rgba(255, 255, 255, 0.9);
    padding: 0; /* Remove padding for circular shape */
    font-size: 1.5rem; /* Increase font size for better symbol visibility */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    width: 60px; /* Fixed width for circular shape */
    height: 60px; /* Fixed height for circular shape */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform-origin: center;
  }

  /* Progress circle around start button */
  .progress-circle {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 70px;
    height: 70px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s ease;
    transform: rotate(-90deg);
  }

  .control-button:active .progress-circle,
  .control-button:hover .progress-circle {
    opacity: 1;
  }

  /* Style for button icons */
  .button-icon {
    width: 38px;
    height: 38px;
    object-fit: contain;
    transition: transform 0.1s ease;
    z-index: 1;
  }

  .control-button:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .control-button:active {
    transform: translateY(0);
  }

  .start-button {
    background: linear-gradient(90deg, #41B6E6, #34C759);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .start-button:hover {
    background: linear-gradient(90deg, #41B6E6, #34C759); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .resume-button {
    background: linear-gradient(90deg, #41B6E6, #34C759);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .resume-button:hover {
    background: linear-gradient(90deg, #41B6E6, #34C759); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .pause-button {
    background: linear-gradient(90deg, #41B6E6, #FF9500);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .pause-button:hover {
    background: linear-gradient(90deg, #41B6E6, #FF9500); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .finish-button {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .finish-button:hover {
    background: linear-gradient(90deg, #41B6E6, #db3eb1); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .exercises-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  
  .exercise-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .exercise-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .exercise-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .exercise-icon img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }

  .exercise-info {
    flex: 1;
  }

  .exercise-name {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .exercise-details {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .exercise-calories {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .exercise-duration {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .exercise-intensity {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  
  .intensity-indicator {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }

  .exercise-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 0.125rem solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .checkbox-container.checked {
    background: #34C759;
    border-color: #34C759;
  }

  .checkbox-container.checked::after {
    content: '✓';
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
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
    align-items: center;
    justify-content: center;
    z-index: 1002; /* Increased to ensure it overlays TrainingTabBar */
  }

  .modal-content {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3),
      inset 0 0 2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15),
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1003; /* Increased to ensure it overlays TrainingTabBar */
    width: 76.5%;
    max-width: 425px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .modal-timeline-section {
    margin-bottom: 1.5rem;
  }
  
  .section-subtitle {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .workout-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .result-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.15);
  }

  .result-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
  }

  .result-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .modal-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.75rem;
    color: white;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    flex: 1;
    max-width: 200px;
  }

  .modal-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .cancel-button {
    background: linear-gradient(90deg, #FF3B30, #FF9500);
  }

  .confirm-button {
    background: linear-gradient(90deg, #34C759, #41B6E6);
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .training-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .glass-panel {
      padding: 1.25rem;
    }

    .training-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .workout-results {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .training-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }

    .workout-title {
      font-size: 1.25rem;
    }

    .workout-duration {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
    }

    .training-stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-item {
      padding: 0.5rem;
    }

    .stat-label {
      font-size: 0.7rem;
    }

    .stat-value {
      font-size: 0.9rem;
    }

    .control-buttons {
      gap: 0.75rem;
    }

    .control-button {
      width: 50px;
      height: 50px;
    }

    .progress-circle {
      width: 60px;
      height: 60px;
    }

    .modal-content {
      padding: 1.5rem;
    }

    .workout-results {
      gap: 0.75rem;
    }

    .result-item {
      padding: 0.75rem;
    }

    .result-label {
      font-size: 0.7rem;
    }

    .result-value {
      font-size: 1rem;
    }

    .modal-actions {
      flex-direction: column;
    }
  }
</style>

