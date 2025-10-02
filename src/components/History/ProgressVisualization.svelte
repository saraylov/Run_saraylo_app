<script>
  // Props using Svelte 5 runes
  const { getSpeedProgressData, getDistanceProgressData, getCaloriesProgressData } = $props();
</script>

<!-- Progress Visualization Section -->
<div class="glass-panel progress-section">
  <h2 class="section-title">Прогресс со временем</h2>
  
  <!-- Progress Charts -->
  <div class="progress-charts">
    <div class="chart-container">
      <h3 class="chart-title">Средняя скорость</h3>
      <div class="chart">
        {#each getSpeedProgressData() as data, i}
          <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
        {/each}
      </div>
      <div class="chart-labels">
        {#each getSpeedProgressData() as data, i}
          <div class="chart-label">{data.label}</div>
        {/each}
      </div>
    </div>
    
    <div class="chart-container">
      <h3 class="chart-title">Расстояние</h3>
      <div class="chart">
        {#each getDistanceProgressData() as data, i}
          <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
        {/each}
      </div>
      <div class="chart-labels">
        {#each getDistanceProgressData() as data, i}
          <div class="chart-label">{data.label}</div>
        {/each}
      </div>
    </div>
    
    <div class="chart-container">
      <h3 class="chart-title">Калории</h3>
      <div class="chart">
        {#each getCaloriesProgressData() as data, i}
          <div class="chart-bar" style="height: {data.height}%; background-color: {data.color};"></div>
        {/each}
      </div>
      <div class="chart-labels">
        {#each getCaloriesProgressData() as data, i}
          <div class="chart-label">{data.label}</div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .progress-section {
    padding: 1rem;
  }
  
  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .progress-charts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .chart-title {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: white;
    font-weight: 500;
    text-align: center;
  }
  
  .chart {
    display: flex;
    align-items: end;
    justify-content: space-around;
    height: 150px;
    width: 100%;
    gap: 0.5rem;
  }
  
  .chart-bar {
    flex: 1;
    min-width: 20px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
  }
  
  .chart-bar:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
  
  .chart-labels {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }
  
  .chart-label {
    flex: 1;
    text-align: center;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    min-width: 20px;
  }
  
  /* Responsive design for progress charts */
  @media (max-width: 48rem) { /* 768px */
    .progress-charts {
      grid-template-columns: 1fr;
    }
  }
</style>