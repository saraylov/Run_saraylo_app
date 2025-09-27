<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Exported props for customization
  export let size = 200;
  export let strokeWidth = 12;
  export let animationDuration = 800;
  
  // Activity data with targets
  let activities = [
    {
      id: 'calories',
      name: 'Калории',
      value: 450,
      target: 500,
      baseColor: '#41B6E6', // Miami Blue
      gradientId: 'caloriesGradient'
    },
    {
      id: 'steps',
      name: 'Шаги',
      value: 8500,
      target: 10000,
      baseColor: '#db3eb1', // Miami Pink
      gradientId: 'stepsGradient'
    },
    {
      id: 'sleep',
      name: 'Сон',
      value: 7.2,
      target: 8,
      baseColor: '#FFFFFF', // White
      gradientId: 'sleepGradient'
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
  
  // Update activity values (simulated data)
  function updateActivityValues() {
    // In a real app, this would come from an API or local storage
    activities = activities.map(activity => {
      let newValue = activity.value;
      
      // Simulate gradual increases
      if (activity.id === 'calories') {
        newValue = Math.min(activity.target * 2.5, newValue + Math.random() * 3);
      } else if (activity.id === 'steps') {
        newValue = Math.min(activity.target * 2.5, newValue + Math.random() * 15);
      } else if (activity.id === 'sleep') {
        newValue = Math.min(activity.target * 2.5, newValue + Math.random() * 0.08);
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
    // Start animation immediately
    animate();
  });
  
  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
  
  // Helper function to calculate stroke dasharray for progress
  function getProgressStroke(ring, level) {
    const progress = Math.min(1, Math.max(0, (ring.value - (ring.target * level)) / ring.target));
    const progressLength = ring.circumference * progress;
    return `${progressLength} ${ring.circumference}`;
  }
  
  // Helper function to get color based on level
  function getColorForLevel(baseColor, level) {
    // Convert hex to RGB
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    // Darken color based on level
    function darkenColor(color, factor) {
      const rgb = hexToRgb(color);
      if (!rgb) return color;
      
      const r = Math.max(0, Math.floor(rgb.r * (1 - factor)));
      const g = Math.max(0, Math.floor(rgb.g * (1 - factor)));
      const b = Math.max(0, Math.floor(rgb.b * (1 - factor)));
      
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Return darker color for higher levels
    switch (level) {
      case 0: return baseColor; // 0-100%
      case 1: return darkenColor(baseColor, 0.2); // 100-200%
      case 2: return darkenColor(baseColor, 0.4); // 200-300%
      default: return darkenColor(baseColor, 0.6); // 300%+
    }
  }
  
  // Helper function to determine how many levels of progress we have
  function getProgressLevels(ring) {
    return Math.floor(ring.value / ring.target);
  }
</script>

<div class="concentric-rings-container">
  <svg 
    class="concentric-rings" 
    width={size} 
    height={size} 
    viewBox={`0 0 ${size} ${size}`}
  >
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
    
    <!-- Progress rings with multi-level visualization -->
    {#each rings as ring, index}
      {#each Array(getProgressLevels(ring) + 1).fill().map((_, i) => i) as level}
        {#if ring.value > ring.target * level}
          <circle
            class="ring-progress"
            cx={radius}
            cy={radius}
            r={ring.radius}
            stroke={getColorForLevel(ring.baseColor, level)}
            stroke-width={strokeWidth}
            fill="none"
            stroke-linecap="round"
            stroke-dasharray={getProgressStroke(ring, level)}
            stroke-dashoffset={ring.circumference / 4 - (ring.circumference * level)}
            transform={`rotate(-90 ${radius} ${radius})`}
            style="transition: stroke-dasharray {animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1);"
          />
        {/if}
      {/each}
    {/each}
  </svg>
</div>

<style>
  .concentric-rings-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 1rem;
  }
  
  .concentric-rings {
    transform: rotate(180deg);
  }
  
  .ring-background {
    opacity: 0.3;
  }
  
  .ring-progress {
    transform-origin: center;
  }
  
  /* Add pulse animation for the current progress level */
  .ring-progress:last-child {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }
</style>