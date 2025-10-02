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

<style global>
  @import './ProgressVisualization.css';
</style>
