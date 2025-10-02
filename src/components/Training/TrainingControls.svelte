<script>
  // Props using Svelte 5 runes
  const { 
    trainingStarted,
    trainingPaused,
    handlePressStart,
    handlePressEnd,
    handleFinishPressStart,
    handleFinishPressEnd,
    pressProgress
  } = $props();
  
  // Button element references
  let startButtonElement;
  let finishButtonElement;
</script>

<!-- Control Buttons at Bottom of Map -->
<div class="control-buttons training-control-buttons">
  {#if !trainingStarted}
    <!-- Start button with long press functionality -->
    <button 
      class="control-button start-button training-start-button"
      on:mousedown={handlePressStart}
      on:mouseup={handlePressEnd}
      on:touchstart={handlePressStart}
      on:touchend={handlePressEnd}
      on:mouseleave={handlePressEnd}
      bind:this={startButtonElement}
    >
      <svg class="button-icon training-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="white"/>
      </svg>
      {#if pressProgress > 0}
        <svg class="progress-circle training-progress-circle" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            stroke-width="2"
            stroke-dasharray="{pressProgress * 100}, 100"
          />
        </svg>
      {/if}
    </button>
  {:else if trainingPaused}
    <!-- Resume button -->
    <button 
      class="control-button resume-button training-resume-button"
      on:click={handlePressStart}
    >
      <svg class="button-icon training-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="white"/>
      </svg>
    </button>
  {:else}
    <!-- Pause button -->
    <button 
      class="control-button pause-button training-pause-button"
      on:click={handlePressStart}
    >
      <svg class="button-icon training-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="5" width="4" height="14" fill="white"/>
        <rect x="14" y="5" width="4" height="14" fill="white"/>
      </svg>
    </button>
  {/if}
  
  {#if trainingStarted}
    <!-- Finish button with long press functionality -->
    <button 
      class="control-button finish-button training-finish-button"
      on:mousedown={handleFinishPressStart}
      on:mouseup={handleFinishPressEnd}
      on:touchstart={handleFinishPressStart}
      on:touchend={handleFinishPressEnd}
      on:mouseleave={handleFinishPressEnd}
      bind:this={finishButtonElement}
    >
      <svg class="button-icon training-button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
      </svg>
      {#if pressProgress > 0}
        <svg class="progress-circle training-progress-circle" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            stroke-width="2"
            stroke-dasharray="{pressProgress * 100}, 100"
          />
        </svg>
      {/if}
    </button>
  {/if}
</div>

<style>
  /* Control Buttons at Bottom of Map */
  .training-control-buttons {
    gap: 0.75rem;
    z-index: 20;
  }

  .training-start-button,
  .training-resume-button,
  .training-pause-button,
  .training-finish-button {
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
    width: 50px; /* Fixed width for circular shape */
    height: 50px; /* Fixed height for circular shape */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform-origin: center;
    z-index: 20;
  }

  /* Progress circle around start button */
  .training-progress-circle {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 60px;
    height: 60px;
    z-index: 19;
    opacity: 0;
    transition: opacity 0.2s ease;
    transform: rotate(-90deg);
  }

  .training-control-button:active .training-progress-circle,
  .training-control-button:hover .training-progress-circle {
    opacity: 1;
  }

  /* Style for button icons */
  .training-button-icon {
    width: 38px;
    height: 38px;
    object-fit: contain;
    transition: transform 0.1s ease;
    z-index: 21;
  }

  .training-start-button:hover,
  .training-resume-button:hover,
  .training-pause-button:hover,
  .training-finish-button:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .training-start-button:active,
  .training-resume-button:active,
  .training-pause-button:active,
  .training-finish-button:active {
    transform: translateY(0);
  }

  .training-start-button {
    background: linear-gradient(90deg, #41B6E6, #34C759);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-start-button:hover {
    background: linear-gradient(90deg, #41B6E6, #34C759); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-resume-button {
    background: linear-gradient(90deg, #41B6E6, #34C759);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-resume-button:hover {
    background: linear-gradient(90deg, #41B6E6, #34C759); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-pause-button {
    background: linear-gradient(90deg, #41B6E6, #FF9500);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-pause-button:hover {
    background: linear-gradient(90deg, #41B6E6, #FF9500); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-finish-button {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .training-finish-button:hover {
    background: linear-gradient(90deg, #41B6E6, #db3eb1); /* Maintain original gradient */
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }
</style>