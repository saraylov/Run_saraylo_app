<script>
  import { onMount } from 'svelte';

  // Define the 5 segment types with their specific colors and durations
  const { segments = [], totalDuration = 0, className = '', currentTime = 0, showAvgSpeeds = false } = $props();

  // Define the standard assessment segments
  const assessmentSegments = [
    { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6, description: 'Начало тренировки' },
    { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5, description: 'Умеренная интенсивность' },
    { id: 3, name: 'Желтый', color: '#FFD700', duration: 5, description: 'Повышение интенсивности' },
    { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3, description: 'Высокая интенсивность' },
    { id: 5, name: 'Красный', color: '#FF0000', duration: 1, description: 'Максимальная интенсивность' }
  ];

  // Function to check if segments are the standard assessment sequence
  function isAssessmentSequence(segments) {
    if (!segments || segments.length !== 5) return false;
    
    // Check if segments match the assessment pattern
    for (let i = 0; i < 5; i++) {
      if (segments[i].id !== assessmentSegments[i].id || 
          segments[i].color !== assessmentSegments[i].color ||
          segments[i].duration !== assessmentSegments[i].duration) {
        return false;
      }
    }
    return true;
  }

  // Function to add visual separation for repeated segments
  function processSegments(inputSegments) {
    if (!inputSegments || inputSegments.length === 0) return [];
    
    const processed = [];
    let previousColor = null;
    
    for (let i = 0; i < inputSegments.length; i++) {
      const segment = { ...inputSegments[i] };
      
      // Add visual separation for consecutive segments of the same color
      if (previousColor && previousColor === segment.color) {
        // Add a small gap indicator
        processed.push({
          id: `gap-${i}`,
          isGap: true,
          color: 'transparent',
          duration: 0.2 // Small gap
        });
      }
      
      processed.push(segment);
      previousColor = segment.color;
    }
    
    return processed;
  }

  // Calculate total duration
  function calculateTotalDuration(segments) {
    return segments.reduce((sum, segment) => sum + (segment.duration || 0), 0);
  }

  // Process segments on mount
  let processedSegments = $state([]);
  let displayTotalDuration = $state(0);
  
  onMount(() => {
    processedSegments = processSegments(segments);
    displayTotalDuration = totalDuration || calculateTotalDuration(segments);
  });

  // Re-process when segments change
  $effect(() => {
    processedSegments = processSegments(segments);
    displayTotalDuration = totalDuration || calculateTotalDuration(segments);
  });

  // Calculate the position of the marker based on current time
  let markerPosition = $state(0);
  $effect(() => {
    if (currentTime > 0 && displayTotalDuration > 0) {
      // Calculate the percentage of time elapsed
      markerPosition = Math.min(100, (currentTime / (displayTotalDuration * 60)) * 100);
    } else {
      markerPosition = 0;
    }
  });
</script>

<div class={`workout-timeline training-workout-timeline ${className}`}>
  <div class="timeline-container training-timeline-container">
    {#if processedSegments.length > 0}
      <div class="timeline-bar training-timeline-bar">
        {#each processedSegments as segment, i}
          {#if segment.isGap}
            <div 
              class="segment-gap training-segment-gap"
              style={`flex: ${segment.duration};`}
            ></div>
          {:else}
            <div 
              class="segment training-segment"
              style={`flex: ${segment.duration}; background-color: ${segment.color};`}
              title={`${segment.name}: ${segment.duration} мин${segment.avgSpeed ? ` (Ср. скорость: ${segment.avgSpeed} км/ч)` : ''}`}
            >
              {#if showAvgSpeeds && segment.avgSpeed}
                <div class="segment-avg-speed training-segment-avg-speed">
                  {segment.avgSpeed} км/ч
                </div>
              {/if}
            </div>
          {/if}
        {/each}
        <!-- Add the timeline marker -->
        {#if currentTime > 0 && markerPosition > 0}
          <div class="timeline-marker training-timeline-marker" style={`left: ${markerPosition}%`}></div>
        {/if}
      </div>
      
      <div class="timeline-info training-timeline-info">
        <span class="duration-start training-duration-start">0:00</span>
        <span class="duration-end training-duration-end">{displayTotalDuration} мин</span>
      </div>
    {:else}
      <div class="no-segments training-no-segments">Нет данных о сегментах тренировки</div>
    {/if}
  </div>
</div>

<style>
  .training-workout-timeline {
    width: 100%;
    margin: 1rem 0;
    position: relative;
    z-index: 15;
  }

  .training-timeline-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 16;
  }

  .training-timeline-bar {
    display: flex;
    height: 30px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 16;
  }

  .training-segment {
    height: 100%;
    min-width: 5px;
    transition: opacity 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 17;
  }

  .training-segment:hover {
    opacity: 0.8;
  }

  .training-segment-avg-speed {
    font-size: 0.6rem;
    color: white;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
    font-weight: bold;
    z-index: 18;
  }

  .training-segment-gap {
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1) 2px,
      transparent 2px,
      transparent 4px
    );
    z-index: 17;
  }

  /* Timeline marker styles */
  .training-timeline-marker {
    position: absolute;
    top: -5px;
    width: 2px; /* Reduced from 4px to 2px (2 times thinner) */
    height: 40px;
    background: white;
    border-radius: 1px; /* Adjusted border radius for thinner marker */
    transform: translateX(-50%);
    z-index: 20;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    transition: left 0.5s ease;
  }

  .training-timeline-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    padding: 0 0.25rem;
    z-index: 17;
  }

  .training-no-segments {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    padding: 1rem;
    z-index: 17;
  }

  /* Responsive design */
  @media (max-width: 48rem) {
    .training-timeline-bar {
      height: 25px;
    }
    
    .training-segment-avg-speed {
      font-size: 0.5rem;
    }
  }

  @media (max-width: 30rem) {
    .training-timeline-bar {
      height: 20px;
    }
    
    .training-timeline-info {
      font-size: 0.7rem;
    }
    
    .training-timeline-marker {
      width: 1px; /* Reduced from 3px to 1px for smaller screens */
      height: 30px;
      top: -3px;
    }
    
    .training-segment-avg-speed {
      font-size: 0.4rem;
    }
  }
</style>