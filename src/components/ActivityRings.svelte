<script>
  import { onMount } from 'svelte';

  // Props for the component
  const { 
    size = 200,
    strokeWidth = 20,
    ringColors = ['#41B6E6', '#db3eb1', '#FFFFFF'], // Miami Vice palette: blue, pink, white
    ringBgColors = ['rgba(65, 182, 230, 0.2)', 'rgba(219, 62, 177, 0.2)', 'rgba(255, 255, 255, 0.2)'],
    testDuration = 5000, // ms for test animation (5 seconds)
    showWhenNoData = false,
    hasData = true,
    progress1: initialProgress1 = 0,
    progress2: initialProgress2 = 0,
    progress3: initialProgress3 = 0,
    steps: initialSteps = 0,
    stepsGoal = 10000 // Default goal of 10,000 steps
  } = $props();

  // Progress values for each ring (0-150 to demonstrate multi-loop)
  let progress1 = $state(initialProgress1);
  let progress2 = $state(initialProgress2);
  let progress3 = $state(initialProgress3);
  
  // Steps data
  let steps = $state(initialSteps);
  
  // Computed values
  let radius1 = $derived(size / 2 - strokeWidth / 2);
  let radius2 = $derived(size / 2 - strokeWidth * 1.5);
  let radius3 = $derived(size / 2 - strokeWidth * 2.5);
  
  let circumference1 = $derived(2 * Math.PI * radius1);
  let circumference2 = $derived(2 * Math.PI * radius2);
  let circumference3 = $derived(2 * Math.PI * radius3);
  
  // For 270 degrees, we use 3/4 of the full circumference
  let arcLength1 = $derived(circumference1 * 0.75);
  let arcLength2 = $derived(circumference2 * 0.75);
  let arcLength3 = $derived(circumference3 * 0.75);
  
  // Calculate stroke dash array for 270° arc
  let strokeDasharray1 = $derived(`${arcLength1} ${circumference1}`);
  let strokeDasharray2 = $derived(`${arcLength2} ${circumference2}`);
  let strokeDasharray3 = $derived(`${arcLength3} ${circumference3}`);
  
  // Check if there's any progress to display
  let hasProgress = $derived(progress1 > 0 || progress2 > 0 || progress3 > 0);
  
  // Should we display the component?
  let shouldDisplay = $derived(hasData && (hasProgress || showWhenNoData));
  
  // Steps progress calculation
  let stepsProgress = $derived(Math.min(100, (steps / stepsGoal) * 100));
  
  // Animation state
  let isAnimating = $state(false);
  let animationFrame = $state();
  let startTime = $state();
  
  // Convert angle from degrees to radians
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Get the color based on progress (for multi-loop effect)
  function getProgressColor(baseColor, progress) {
    // Calculate which loop we're on (0 = first loop, 1 = second loop, etc.)
    const loop = Math.floor(progress / 100);
    
    // If we're on the first loop, return the base color
    if (loop === 0) return baseColor;
    
    // For subsequent loops, darken the color
    // Convert hex to RGB
    let r = parseInt(baseColor.slice(1, 3), 16);
    let g = parseInt(baseColor.slice(3, 5), 16);
    let b = parseInt(baseColor.slice(5, 7), 16);
    
    // Darken based on loop number
    const factor = 0.7 - (loop * 0.2); // Each loop gets darker
    r = Math.max(0, Math.floor(r * factor));
    g = Math.max(0, Math.floor(g * factor));
    b = Math.max(0, Math.floor(b * factor));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Calculate stroke dash offset for first layer (0-100%)
  let firstLayerProgress1 = $derived(Math.min(progress1, 100));
  let firstLayerProgress2 = $derived(Math.min(progress2, 100));
  let firstLayerProgress3 = $derived(Math.min(progress3, 100));
  
  let firstLayerOffset1 = $derived(arcLength1 * (1 - firstLayerProgress1 / 100));
  let firstLayerOffset2 = $derived(arcLength2 * (1 - firstLayerProgress2 / 100));
  let firstLayerOffset3 = $derived(arcLength3 * (1 - firstLayerProgress3 / 100));
  
  // Calculate stroke dash offset for second layer (100-200%)
  let secondLayerProgress1 = $derived(Math.max(0, progress1 - 100));
  let secondLayerProgress2 = $derived(Math.max(0, progress2 - 100));
  let secondLayerProgress3 = $derived(Math.max(0, progress3 - 100));
  
  let secondLayerOffset1 = $derived(arcLength1 * (1 - secondLayerProgress1 / 100));
  let secondLayerOffset2 = $derived(arcLength2 * (1 - secondLayerProgress2 / 100));
  let secondLayerOffset3 = $derived(arcLength3 * (1 - secondLayerProgress3 / 100));
  
  // Get current colors based on progress
  let firstLayerColor1 = $derived(ringColors[0]);
  let firstLayerColor2 = $derived(ringColors[1]);
  let firstLayerColor3 = $derived(ringColors[2]);
  
  let secondLayerColor1 = $derived(getProgressColor(ringColors[0], 100)); // Darker shade for second layer
  let secondLayerColor2 = $derived(getProgressColor(ringColors[1], 100));
  let secondLayerColor3 = $derived(getProgressColor(ringColors[2], 100));
  
  // Pre-calculate the points for the SVG paths (225° to 135°)
  let startAngle225 = $derived(225);
  let endAngle135 = $derived(135);
  
  let startX1 = $derived(size/2 + radius1 * Math.sin(toRadians(startAngle225)));
  let startY1 = $derived(size/2 - radius1 * Math.cos(toRadians(startAngle225)));
  let endX1 = $derived(size/2 + radius1 * Math.sin(toRadians(endAngle135)));
  let endY1 = $derived(size/2 - radius1 * Math.cos(toRadians(endAngle135)));
  
  let startX2 = $derived(size/2 + radius2 * Math.sin(toRadians(startAngle225)));
  let startY2 = $derived(size/2 - radius2 * Math.cos(toRadians(startAngle225)));
  let endX2 = $derived(size/2 + radius2 * Math.sin(toRadians(endAngle135)));
  let endY2 = $derived(size/2 - radius2 * Math.cos(toRadians(endAngle135)));
  
  let startX3 = $derived(size/2 + radius3 * Math.sin(toRadians(startAngle225)));
  let startY3 = $derived(size/2 - radius3 * Math.cos(toRadians(startAngle225)));
  let endX3 = $derived(size/2 + radius3 * Math.sin(toRadians(endAngle135)));
  let endY3 = $derived(size/2 - radius3 * Math.cos(toRadians(endAngle135)));
  
  // Function to animate the rings to 150% over testDuration
  function animateToTestValues() {
    if (!isAnimating) return;
    
    const startProgress1 = progress1;
    const startProgress2 = progress2;
    const startProgress3 = progress3;
    const startSteps = steps;
    
    startTime = performance.now();
    
    function updateProgress(timestamp) {
      if (!isAnimating) return;
      
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / testDuration, 1);
      
      // Ease-out function for smooth animation
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      
      // Animate to 150% for demonstration
      progress1 = startProgress1 + (150 - startProgress1) * easeOut;
      progress2 = startProgress2 + (150 - startProgress2) * easeOut;
      progress3 = startProgress3 + (150 - startProgress3) * easeOut;
      steps = startSteps + (8500 - startSteps) * easeOut; // Animate to 8,500 steps
      
      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    }
    
    animationFrame = requestAnimationFrame(updateProgress);
  }
  
  // Function to animate the rings back to 0
  function animateToZero() {
    const startProgress1 = progress1;
    const startProgress2 = progress2;
    const startProgress3 = progress3;
    const startSteps = steps;
    
    startTime = performance.now();
    
    function updateProgress(timestamp) {
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / (testDuration/2), 1); // Faster reset
      
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      
      progress1 = startProgress1 - startProgress1 * easeOut;
      progress2 = startProgress2 - startProgress2 * easeOut;
      progress3 = startProgress3 - startProgress3 * easeOut;
      steps = startSteps - startSteps * easeOut;
      
      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    }
    
    animationFrame = requestAnimationFrame(updateProgress);
  }
  
  // Start/stop animation
  function toggleAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    
    isAnimating = !isAnimating;
    if (isAnimating) {
      animateToTestValues();
    } else {
      animateToZero();
    }
  }
  
  // Function to set progress values programmatically
  function setProgress(ring, value) {
    const clampedValue = Math.max(0, value); // No upper limit to support multi-loop
    if (ring === 1) progress1 = clampedValue;
    if (ring === 2) progress2 = clampedValue;
    if (ring === 3) progress3 = clampedValue;
  }
  
  // Cleanup on destroy
  onMount(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
</script>

{#if shouldDisplay}
<div class="activity-rings-container">
  <svg 
    class="activity-rings" 
    width={size} 
    height={size} 
    viewBox={`0 0 ${size} ${size}`}
    role="img"
    aria-label="Activity progress visualization"
  >
    <!-- Define gradients for rings -->
    <defs>
      <!-- First ring gradients (Miami Blue) -->
      <linearGradient id="ring-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#41B6E6" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#41B6E6" stop-opacity="0.2" />
      </linearGradient>
      
      <linearGradient id="ring-gradient-1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2d8cb0" />
        <stop offset="100%" stop-color="#2d8cb0" />
      </linearGradient>
      
      <!-- Second ring gradients (Miami Pink) -->
      <linearGradient id="ring-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#db3eb1" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#db3eb1" stop-opacity="0.2" />
      </linearGradient>
      
      <linearGradient id="ring-gradient-2-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a52e85" />
        <stop offset="100%" stop-color="#a52e85" />
      </linearGradient>
      
      <!-- Third ring gradients (White) -->
      <linearGradient id="ring-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.2" />
      </linearGradient>
      
      <linearGradient id="ring-gradient-3-dark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#CCCCCC" />
        <stop offset="100%" stop-color="#CCCCCC" />
      </linearGradient>
      
      <!-- Gradients for glossy effect -->
      <linearGradient id="glossy-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="white" stop-opacity="0.7" />
        <stop offset="30%" stop-color="white" stop-opacity="0.4" />
        <stop offset="70%" stop-color="white" stop-opacity="0.2" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <linearGradient id="glossy-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="white" stop-opacity="0.7" />
        <stop offset="30%" stop-color="white" stop-opacity="0.4" />
        <stop offset="70%" stop-color="white" stop-opacity="0.2" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <linearGradient id="glossy-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="white" stop-opacity="0.7" />
        <stop offset="30%" stop-color="white" stop-opacity="0.4" />
        <stop offset="70%" stop-color="white" stop-opacity="0.2" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <linearGradient id="glossy-gradient-second-1" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="white" stop-opacity="0.5" />
        <stop offset="30%" stop-color="white" stop-opacity="0.3" />
        <stop offset="70%" stop-color="white" stop-opacity="0.1" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <linearGradient id="glossy-gradient-second-2" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="white" stop-opacity="0.5" />
        <stop offset="30%" stop-color="white" stop-opacity="0.3" />
        <stop offset="70%" stop-color="white" stop-opacity="0.1" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <linearGradient id="glossy-gradient-second-3" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="white" stop-opacity="0.5" />
        <stop offset="30%" stop-color="white" stop-opacity="0.3" />
        <stop offset="70%" stop-color="white" stop-opacity="0.1" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </linearGradient>
      
      <!-- Inner shadow gradients for 3D effect -->
      <radialGradient id="inner-shadow-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="60%" stop-color="black" stop-opacity="0.4" />
        <stop offset="80%" stop-color="black" stop-opacity="0.2" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="inner-shadow-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="60%" stop-color="black" stop-opacity="0.4" />
        <stop offset="80%" stop-color="black" stop-opacity="0.2" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="inner-shadow-3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="60%" stop-color="black" stop-opacity="0.4" />
        <stop offset="80%" stop-color="black" stop-opacity="0.2" />
        <stop offset="100%" stop-color="black" stop-opacity="0" />
      </radialGradient>
    </defs>
    
    <!-- Background rings with inner shadow for 3D effect -->
    <path 
      class="ring-bg"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke="url(#ring-gradient-1)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <!-- Inner shadow for first ring -->
    <path 
      class="ring-inner-shadow"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke="url(#inner-shadow-1)"
      stroke-width={strokeWidth + 4}
      stroke-linecap="round"
    />
    
    <path 
      class="ring-bg"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke="url(#ring-gradient-2)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <!-- Inner shadow for second ring -->
    <path 
      class="ring-inner-shadow"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke="url(#inner-shadow-2)"
      stroke-width={strokeWidth + 4}
      stroke-linecap="round"
    />
    
    <path 
      class="ring-bg"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke="url(#ring-gradient-3)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <!-- Inner shadow for third ring -->
    <path 
      class="ring-inner-shadow"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke="url(#inner-shadow-3)"
      stroke-width={strokeWidth + 4}
      stroke-linecap="round"
    />
    
    <!-- First layer progress rings (0-100%) with glossy effect -->
    <path 
      class="progress-ring first-layer"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke="url(#ring-gradient-1)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray1}
      stroke-dashoffset={firstLayerOffset1}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={firstLayerProgress1}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="First activity progress"
    />
    
    <path 
      class="progress-ring first-layer"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke="url(#ring-gradient-2)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray2}
      stroke-dashoffset={firstLayerOffset2}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={firstLayerProgress2}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Second activity progress"
    />
    
    <path 
      class="progress-ring first-layer"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke="url(#ring-gradient-3)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray3}
      stroke-dashoffset={firstLayerOffset3}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={firstLayerProgress3}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Third activity progress"
    />
    
    <!-- Glossy overlay for first layer -->
    <path 
      class="progress-ring glossy-overlay"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke="url(#glossy-gradient-1)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray1}
      stroke-dashoffset={firstLayerOffset1}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    
    <path 
      class="progress-ring glossy-overlay"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke="url(#glossy-gradient-2)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray2}
      stroke-dashoffset={firstLayerOffset2}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    
    <path 
      class="progress-ring glossy-overlay"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke="url(#glossy-gradient-3)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray3}
      stroke-dashoffset={firstLayerOffset3}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    
    <!-- Second layer progress rings (100-200%) - displayed in opposite direction -->
    {#if secondLayerProgress1 > 0}
    <path 
      class="progress-ring second-layer"
      d={`M ${endX1} ${endY1} A ${radius1} ${radius1} 0 1 0 ${startX1} ${startY1}`}
      fill="none"
      stroke="url(#ring-gradient-1-dark)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray1}
      stroke-dashoffset={secondLayerOffset1}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
    {#if secondLayerProgress2 > 0}
    <path 
      class="progress-ring second-layer"
      d={`M ${endX2} ${endY2} A ${radius2} ${radius2} 0 1 0 ${startX2} ${startY2}`}
      fill="none"
      stroke="url(#ring-gradient-2-dark)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray2}
      stroke-dashoffset={secondLayerOffset2}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
    {#if secondLayerProgress3 > 0}
    <path 
      class="progress-ring second-layer"
      d={`M ${endX3} ${endY3} A ${radius3} ${radius3} 0 1 0 ${startX3} ${startY3}`}
      fill="none"
      stroke="url(#ring-gradient-3-dark)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray3}
      stroke-dashoffset={secondLayerOffset3}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
    <!-- Glossy overlay for second layer -->
    {#if secondLayerProgress1 > 0}
    <path 
      class="progress-ring glossy-overlay-second"
      d={`M ${endX1} ${endY1} A ${radius1} ${radius1} 0 1 0 ${startX1} ${startY1}`}
      fill="none"
      stroke="url(#glossy-gradient-second-1)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray1}
      stroke-dashoffset={secondLayerOffset1}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
    {#if secondLayerProgress2 > 0}
    <path 
      class="progress-ring glossy-overlay-second"
      d={`M ${endX2} ${endY2} A ${radius2} ${radius2} 0 1 0 ${startX2} ${startY2}`}
      fill="none"
      stroke="url(#glossy-gradient-second-2)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray2}
      stroke-dashoffset={secondLayerOffset2}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
    {#if secondLayerProgress3 > 0}
    <path 
      class="progress-ring glossy-overlay-second"
      d={`M ${endX3} ${endY3} A ${radius3} ${radius3} 0 1 0 ${startX3} ${startY3}`}
      fill="none"
      stroke="url(#glossy-gradient-second-3)"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray3}
      stroke-dashoffset={secondLayerOffset3}
      style="transition: stroke-dashoffset 100ms linear;"
    />
    {/if}
    
  </svg>
  
  <!-- Steps progress bar -->
  <div class="steps-container">
    <div class="steps-header">
      <span class="steps-label">Шаги за день</span>
      <span class="steps-count">{Math.round(steps).toLocaleString()} / {stepsGoal.toLocaleString()}</span>
    </div>
    <div class="steps-progress-bar">
      <div 
        class="steps-progress-fill" 
        style="width: {stepsProgress}%; background: linear-gradient(90deg, #41B6E6, #db3eb1, #FFFFFF);"
      ></div>
    </div>
  </div>
  
  <button 
    class="test-button" 
    onclick={toggleAnimation}
    aria-pressed={isAnimating}
  >
    {isAnimating ? 'Сбросить активность' : 'Запустить активность'}
  </button>
</div>
{/if}

<style>
  .activity-rings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }
  
  .activity-rings {
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
  }
  
  .progress-ring {
    transform-origin: center;
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.4));
    /* Enhanced 3D effect */
    transform: translateZ(5px);
  }
  
  .ring-bg {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
    transform: translateZ(0px);
  }
  
  .ring-inner-shadow {
    mix-blend-mode: multiply;
    filter: blur(1px);
  }
  
  .first-layer {
    /* First layer is drawn normally from 225° to 135° clockwise */
  }
  
  .second-layer {
    /* Second layer is drawn in opposite direction from 135° to 225° counter-clockwise */
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
    transform: translateZ(8px);
  }
  
  .glossy-overlay, .glossy-overlay-second {
    mix-blend-mode: overlay;
    filter: brightness(1.3) contrast(1.2);
    animation: shimmer 4s infinite linear;
    /* Enhanced elevation effect */
    transform: translateZ(10px);
    filter: 
      brightness(1.3) contrast(1.2) 
      drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
      drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1));
  }
  
  @keyframes shimmer {
    0% {
      filter: 
        brightness(1.3) contrast(1.2) 
        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
        drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))
        hue-rotate(0deg);
    }
    25% {
      filter: 
        brightness(1.5) contrast(1.3) 
        drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4))
        drop-shadow(0 3px 6px rgba(255, 255, 255, 0.15))
        hue-rotate(2deg);
    }
    50% {
      filter: 
        brightness(1.3) contrast(1.2) 
        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
        drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))
        hue-rotate(0deg);
    }
    75% {
      filter: 
        brightness(1.4) contrast(1.25) 
        drop-shadow(0 5px 10px rgba(0, 0, 0, 0.35))
        drop-shadow(0 2.5px 5px rgba(255, 255, 255, 0.12))
        hue-rotate(-2deg);
    }
    100% {
      filter: 
        brightness(1.3) contrast(1.2) 
        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
        drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))
        hue-rotate(0deg);
    }
  }
  
  /* Steps progress bar styles */
  .steps-container {
    width: 100%;
    max-width: 300px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.25),
      inset 0 1px 2px rgba(255, 255, 255, 0.15);
  }
  
  .steps-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .steps-label {
    font-weight: 600;
  }
  
  .steps-count {
    font-weight: 500;
  }
  
  .steps-progress-bar {
    width: 100%;
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .steps-progress-fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
  }
  
  .test-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    min-width: 200px;
  }
  
  .test-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.3);
  }
  
  .test-button:active {
    transform: translateY(0);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .activity-rings {
      width: 150px;
      height: 150px;
    }
    
    .steps-container {
      max-width: 250px;
    }
    
    .test-button {
      padding: 8px 16px;
      font-size: 14px;
      min-width: 160px;
    }
  }
  
  @media (max-width: 480px) {
    .activity-rings {
      width: 120px;
      height: 120px;
    }
    
    .steps-container {
      max-width: 200px;
    }
    
    .test-button {
      padding: 6px 12px;
      font-size: 12px;
      min-width: 140px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .progress-ring, .steps-progress-fill {
      transition: none;
    }
    
    .test-button {
      transition: none;
    }
  }
</style>