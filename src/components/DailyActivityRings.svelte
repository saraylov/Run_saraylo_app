<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Exported props for customization
  export let size = 200;
  export let strokeWidth = 12;
  
  // Activity data with targets
  let activities = [
    {
      id: 'calories',
      name: 'Калории',
      value: 0,
      target: 500,
      color: '#41B6E6', // Miami Blue
      gradientId: 'dailyCaloriesGradient'
    },
    {
      id: 'steps',
      name: 'Шаги',
      value: 0,
      target: 10000,
      color: '#db3eb1', // Miami Pink
      gradientId: 'dailyStepsGradient'
    },
    {
      id: 'sleep',
      name: 'Сон',
      value: 0,
      target: 8,
      color: '#FFFFFF', // White
      gradientId: 'dailySleepGradient'
    }
  ];
  
  // Computed properties
  $: radius = size / 2;
  $: spacing = strokeWidth + 4;
  
  // Calculate ring dimensions
  $: rings = activities.map((activity, index) => {
    const ringRadius = radius - (spacing * index) - strokeWidth / 2;
    return {
      ...activity,
      radius: ringRadius,
      circumference: 2 * Math.PI * ringRadius
    };
  });
  
  // Timer for daily reset
  let resetTimer;
  
  // Function to reset all activity values to zero
  function resetDailyData() {
    activities = activities.map(activity => ({
      ...activity,
      value: 0
    }));
  }
  
  // Function to schedule the next daily reset
  function scheduleNextReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0); // Next midnight
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Clear any existing timer
    if (resetTimer) {
      clearTimeout(resetTimer);
    }
    
    // Set timer for next reset
    resetTimer = setTimeout(() => {
      resetDailyData();
      scheduleNextReset(); // Schedule the next reset
    }, timeUntilMidnight);
  }
  
  // Function to update activity values (simulated data for demonstration)
  function updateActivityValues() {
    // In a real application, this would fetch data from an API or state management system
    activities = activities.map(activity => {
      let newValue = activity.value;
      
      // Simulate gradual increases for demonstration
      if (activity.id === 'calories') {
        newValue = Math.min(activity.target * 1.5, newValue + Math.random() * 5);
      } else if (activity.id === 'steps') {
        newValue = Math.min(activity.target * 1.5, newValue + Math.random() * 20);
      } else if (activity.id === 'sleep') {
        newValue = Math.min(activity.target * 1.5, newValue + Math.random() * 0.1);
      }
      
      return {
        ...activity,
        value: newValue
      };
    });
  }
  
  // Animation frame for real-time updates
  let animationId;
  function animate() {
    updateActivityValues();
    animationId = requestAnimationFrame(animate);
  }
  
  // Lifecycle
  onMount(() => {
    // Schedule the first daily reset
    scheduleNextReset();
    
    // Start animation for demonstration
    setTimeout(() => {
      animate();
    }, 1000);
  });
  
  onDestroy(() => {
    // Clean up timers and animation frames
    if (resetTimer) {
      clearTimeout(resetTimer);
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
  
  // Helper function to calculate stroke dasharray for progress
  function getProgressStroke(ring) {
    const progress = Math.min(1, ring.value / ring.target);
    const progressLength = ring.circumference * progress;
    return `${progressLength} ${ring.circumference}`;
  }
  
  // Helper function to determine if we need a second ring
  function getSecondRingProgress(ring) {
    if (ring.value <= ring.target) return '0 1000'; // No second ring
    const excess = ring.value - ring.target;
    const secondProgress = Math.min(1, excess / ring.target);
    const progressLength = ring.circumference * secondProgress;
    return `${progressLength} ${ring.circumference}`;
  }
  
  // Helper function to get the offset for the second ring
  function getSecondRingOffset(ring) {
    return ring.circumference / 4 - ring.circumference; // Start where first ring ends
  }
</script>

<div class="daily-activity-rings-container">
  <svg 
    class="daily-activity-rings" 
    width={size} 
    height={size} 
    viewBox={`0 0 ${size} ${size}`}
  >
    <!-- Define gradients for rings -->
    <defs>
      {#each rings as ring}
        <linearGradient id={ring.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color={ring.color} stop-opacity="0.8" />
          <stop offset="100%" stop-color={ring.color} stop-opacity="0.4" />
        </linearGradient>
        
        <!-- Darker gradient for second loop -->
        <linearGradient id={`${ring.gradientId}Dark`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color={ring.color} stop-opacity="1" />
          <stop offset="100%" stop-color={ring.color} stop-opacity="0.7" />
        </linearGradient>
      {/each}
    </defs>
    
    <!-- Background rings (inactive state) -->
    {#each rings as ring, index}
      <circle
        class="ring-background"
        cx={radius}
        cy={radius}
        r={ring.radius}
        stroke="rgba(255, 255, 255, 0.2)"
        stroke-width={strokeWidth}
        fill="none"
      />
    {/each}
    
    <!-- Progress rings -->
    {#each rings as ring, index}
      <!-- First progress ring (0-100%) -->
      <circle
        class="ring-progress"
        cx={radius}
        cy={radius}
        r={ring.radius}
        stroke={`url(#${ring.gradientId})`}
        stroke-width={strokeWidth}
        fill="none"
        stroke-linecap="round"
        stroke-dasharray={getProgressStroke(ring)}
        stroke-dashoffset={ring.circumference / 4}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      
      <!-- Second progress ring (100%+) with darker gradient -->
      {#if ring.value > ring.target}
        <circle
          class="ring-progress second"
          cx={radius}
          cy={radius}
          r={ring.radius}
          stroke={`url(#${ring.gradientId}Dark)`}
          stroke-width={strokeWidth}
          fill="none"
          stroke-linecap="round"
          stroke-dasharray={getSecondRingProgress(ring)}
          stroke-dashoffset={getSecondRingOffset(ring)}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      {/if}
    {/each}
  </svg>
  
  <!-- Center text with current values -->
  <div class="center-text">
    <div class="value-text">
      {Math.floor(activities[0].value)}<span class="unit">ккал</span>
    </div>
    <div class="label-text">{activities[0].name}</div>
    
    <div class="secondary-values">
      <div class="value-text small">
        {Math.floor(activities[1].value)} <span class="unit">шагов</span>
      </div>
      <div class="value-text small">
        {activities[2].value.toFixed(1)} <span class="unit">ч</span>
      </div>
    </div>
  </div>
</div>

<style>
  .daily-activity-rings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 1rem;
  }
  
  .daily-activity-rings {
    transform: rotate(180deg);
  }
  
  .ring-background {
    opacity: 0.3;
  }
  
  .ring-progress {
    transition: stroke-dasharray 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: center;
  }
  
  .ring-progress.second {
    animation: pulse 2s infinite;
  }
  
  .center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(180deg);
    text-align: center;
    width: 100%;
  }
  
  .value-text {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.2rem 0;
  }
  
  .value-text.small {
    font-size: 1rem;
    font-weight: normal;
  }
  
  .unit {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-left: 0.2rem;
  }
  
  .label-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    margin: 0.2rem 0;
  }
  
  .secondary-values {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
  
  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
</style>