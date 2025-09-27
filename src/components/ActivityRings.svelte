<script>
  import { onMount } from 'svelte';

  // Props for the component
  export let size = 200;
  export let strokeWidth = 20;
  export let ringColors = ['#41B6E6', '#db3eb1', '#FFFFFF']; // Base colors for first loop
  export let ringBgColors = ['rgba(65, 182, 230, 0.2)', 'rgba(219, 62, 177, 0.2)', 'rgba(255, 255, 255, 0.2)'];
  export let testDuration = 5000; // ms for test animation (5 seconds)
  export let showWhenNoData = false;
  export let hasData = true;
  
  // Progress values for each ring (0-150 to demonstrate multi-loop)
  export let progress1 = 0;
  export let progress2 = 0;
  export let progress3 = 0;
  
  // Computed values
  $: radius1 = size / 2 - strokeWidth / 2;
  $: radius2 = size / 2 - strokeWidth * 1.5;
  $: radius3 = size / 2 - strokeWidth * 2.5;
  
  $: circumference1 = 2 * Math.PI * radius1;
  $: circumference2 = 2 * Math.PI * radius2;
  $: circumference3 = 2 * Math.PI * radius3;
  
  // For 270 degrees, we use 3/4 of the full circumference
  $: arcLength1 = circumference1 * 0.75;
  $: arcLength2 = circumference2 * 0.75;
  $: arcLength3 = circumference3 * 0.75;
  
  // Calculate stroke dash array for 270° arc
  $: strokeDasharray1 = `${arcLength1} ${circumference1}`;
  $: strokeDasharray2 = `${arcLength2} ${circumference2}`;
  $: strokeDasharray3 = `${arcLength3} ${circumference3}`;
  
  // Check if there's any progress to display
  $: hasProgress = progress1 > 0 || progress2 > 0 || progress3 > 0;
  
  // Should we display the component?
  $: shouldDisplay = hasData && (hasProgress || showWhenNoData);
  
  // Animation state
  let isAnimating = false;
  let animationFrame;
  let startTime;
  
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
  
  // Calculate stroke dash offset based on progress (supporting multi-loop)
  $: strokeDashoffset1 = arcLength1 * (1 - (progress1 % 100) / 100);
  $: strokeDashoffset2 = arcLength2 * (1 - (progress2 % 100) / 100);
  $: strokeDashoffset3 = arcLength3 * (1 - (progress3 % 100) / 100);
  
  // Get current colors based on progress
  $: currentColor1 = getProgressColor(ringColors[0], progress1);
  $: currentColor2 = getProgressColor(ringColors[1], progress2);
  $: currentColor3 = getProgressColor(ringColors[2], progress3);
  
  // Pre-calculate the points for the SVG paths (225° to 135°)
  $: startAngle225 = 225;
  $: endAngle135 = 135;
  
  $: startX1 = size/2 + radius1 * Math.sin(toRadians(startAngle225));
  $: startY1 = size/2 - radius1 * Math.cos(toRadians(startAngle225));
  $: endX1 = size/2 + radius1 * Math.sin(toRadians(endAngle135));
  $: endY1 = size/2 - radius1 * Math.cos(toRadians(endAngle135));
  
  $: startX2 = size/2 + radius2 * Math.sin(toRadians(startAngle225));
  $: startY2 = size/2 - radius2 * Math.cos(toRadians(startAngle225));
  $: endX2 = size/2 + radius2 * Math.sin(toRadians(endAngle135));
  $: endY2 = size/2 - radius2 * Math.cos(toRadians(endAngle135));
  
  $: startX3 = size/2 + radius3 * Math.sin(toRadians(startAngle225));
  $: startY3 = size/2 - radius3 * Math.cos(toRadians(startAngle225));
  $: endX3 = size/2 + radius3 * Math.sin(toRadians(endAngle135));
  $: endY3 = size/2 - radius3 * Math.cos(toRadians(endAngle135));
  
  // Function to animate the rings to 150% over testDuration
  function animateToTestValues() {
    if (!isAnimating) return;
    
    const startProgress1 = progress1;
    const startProgress2 = progress2;
    const startProgress3 = progress3;
    
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
    
    startTime = performance.now();
    
    function updateProgress(timestamp) {
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / (testDuration/2), 1); // Faster reset
      
      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      
      progress1 = startProgress1 - startProgress1 * easeOut;
      progress2 = startProgress2 - startProgress2 * easeOut;
      progress3 = startProgress3 - startProgress3 * easeOut;
      
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
    <!-- Background rings -->
    <path 
      class="ring-bg"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke={ringBgColors[0]}
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <path 
      class="ring-bg"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke={ringBgColors[1]}
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <path 
      class="ring-bg"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke={ringBgColors[2]}
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    
    <!-- Progress rings -->
    <path 
      class="progress-ring"
      d={`M ${startX1} ${startY1} A ${radius1} ${radius1} 0 1 1 ${endX1} ${endY1}`}
      fill="none"
      stroke={currentColor1}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray1}
      stroke-dashoffset={strokeDashoffset1}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={progress1}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="First activity progress"
    />
    
    <path 
      class="progress-ring"
      d={`M ${startX2} ${startY2} A ${radius2} ${radius2} 0 1 1 ${endX2} ${endY2}`}
      fill="none"
      stroke={currentColor2}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray2}
      stroke-dashoffset={strokeDashoffset2}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={progress2}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Second activity progress"
    />
    
    <path 
      class="progress-ring"
      d={`M ${startX3} ${startY3} A ${radius3} ${radius3} 0 1 1 ${endX3} ${endY3}`}
      fill="none"
      stroke={currentColor3}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={strokeDasharray3}
      stroke-dashoffset={strokeDashoffset3}
      style="transition: stroke-dashoffset 100ms linear;"
      role="progressbar"
      aria-valuenow={progress3}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Third activity progress"
    />
  </svg>
  
  <button 
    class="test-button" 
    on:click={toggleAnimation}
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
  }
  
  .progress-ring {
    transform-origin: center;
    /* Remove the rotation transform since we're now calculating the correct start/end points */
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
    
    .test-button {
      padding: 6px 12px;
      font-size: 12px;
      min-width: 140px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .progress-ring {
      transition: none;
    }
    
    .test-button {
      transition: none;
    }
  }
</style>