<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  
  // Props using Svelte 5 runes
  let { 
    trainingStarted, 
    trainingPaused, 
    trainingStats,
    mapContainer = $bindable(),
    initializeMap
  } = $props();
  
  // Map variables
  let map;
  let geolocateControl;
  let routeCoordinates = [];
  let routeSourceId = 'route-source';
  let routeLayerId = 'route-layer';
  
  // Initialize the Mapbox map after the container is bound
  $effect(() => {
    if (mapContainer) {
      initializeMap();
    }
  });
</script>

<!-- Map Panel with Controls at Bottom -->
<div class="glass-panel map-panel training-map-panel">
  <!-- Training Stats Grid -->
  <div class="training-stats-grid training-stats-container">
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Время</div>
      <div class="stat-value training-stat-value">{trainingStats.time}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Расстояние</div>
      <div class="stat-value training-stat-value">{trainingStats.distance}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Скорость</div>
      <div class="stat-value training-stat-value">{trainingStats.speed}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Ср.Скорость</div>
      <div class="stat-value training-stat-value">{trainingStats.avgSpeed}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Макс.Ск</div>
      <div class="stat-value training-stat-value">{trainingStats.maxSpeed}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Темп</div>
      <div class="stat-value training-stat-value">{trainingStats.pace}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Калл</div>
      <div class="stat-value training-stat-value">{trainingStats.calories}</div>
    </div>
    <div class="stat-item training-stat-item">
      <div class="stat-label training-stat-label">Шаги</div>
      <div class="stat-value training-stat-value">{trainingStats.steps}</div>
    </div>
  </div>
  
  <div class="map-container training-map-container" bind:this={mapContainer}></div>
</div>

<style>
  /* Map Panel */
  .training-map-panel {
    height: 70vh; /* Reduced height as per user preference */
    display: flex;
    flex-direction: column;
    z-index: 16;
  }

  /* Training Stats Grid */
  .training-stats-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
    z-index: 17;
  }

  .training-stat-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 0.75rem;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.15);
    z-index: 17;
  }

  .training-stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.25rem;
    z-index: 18;
  }

  .training-stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: white;
    z-index: 18;
  }

  .training-map-container {
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    overflow: hidden;
    margin-bottom: 1rem; /* Space for buttons */
    z-index: 16;
  }
</style>