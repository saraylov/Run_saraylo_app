<script>
  // Props using Svelte 5 runes
  const { assessmentResults } = $props();
</script>

<!-- Assessment Results Section -->
<div class="assessment-results-section">
  <h3 class="panel-title">Последние результаты оценочной тренировки</h3>
  {#if assessmentResults && assessmentResults.length > 0}
    <!-- Отображаем только последние результаты -->
    <div class="color-panels-container">
      {#each assessmentResults[0].segments as segment, i}
        <div class="color-panel" style="background-color: {segment.color};" title="{segment.name}: {segment.avgSpeed} км/ч">
          <div class="panel-content">
            <div class="segment-speed">{segment.avgSpeed} км/ч</div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-assessment-message">
      <p>Пройдите оценочную тренировку для отображения результатов</p>
    </div>
  {/if}
</div>

<style>
  .assessment-results-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Panel Titles */
  .panel-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.25rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .color-panels-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .color-panel {
    border-radius: 0.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    color: white;
    font-weight: 600;
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  
  .color-panel:hover {
    transform: scale(1.05);
  }
  
  .panel-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 0.7rem;
  }
  
  .segment-speed {
    font-size: 0.6rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .no-assessment-message {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .color-panels-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 30rem) { /* 480px */
    .color-panels-container {
      grid-template-columns: 1fr;
    }
    
    .color-panel {
      height: 50px;
    }
  }
</style>