<script>
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';

  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';

  // Exported properties
  export let onBack;
  export let onSettings;

  // Map and tracking state
  let mapContainer;
  let map;
  let marker;
  let routeCoordinates = [];
  let routeLine;
  let watchId;
  let isTracking = false;
  let currentPosition = null;
  let errorMessage = '';
  let showControls = true;

  // Map initialization
  onMount(async () => {
    try {
      initializeMap();
    } catch (error) {
      console.error('Error initializing map:', error);
      errorMessage = 'Failed to initialize map. Please check your connection.';
    }
  });

  // Clean up when component is destroyed
  onDestroy(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    if (map) {
      map.remove();
    }
  });

  // Initialize the Mapbox map
  function initializeMap() {
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.5234, 50.4501], // Default to Kyiv coordinates
      zoom: 14,
      attributionControl: false
    });

    // Add navigation controls
    if (showControls) {
      const nav = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      });
      map.addControl(nav, 'top-right');
    }

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocate, 'top-left');

    // Add map events
    map.on('load', () => {
      // Add route line source and layer
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#db3eb1', // Miami Pink
          'line-width': 4,
          'line-opacity': 0.75
        }
      });

      // Add marker source and layer for current position
      map.addSource('position-marker', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'position-marker',
        type: 'circle',
        source: 'position-marker',
        paint: {
          'circle-radius': 8,
          'circle-color': '#41B6E6', // Miami Blue
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });
    });
  }

  // Start tracking user location
  function startTracking() {
    if (isTracking) return;

    isTracking = true;
    errorMessage = '';

    // Watch position with high accuracy
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPosition = [longitude, latitude];
        
        // Update marker position
        updateMarkerPosition(currentPosition);
        
        // Add to route
        addToRoute(currentPosition);
        
        // Center map on user
        if (map) {
          map.setCenter(currentPosition);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        isTracking = false;
        errorMessage = 'Unable to get your location. Please ensure location services are enabled.';
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  }

  // Stop tracking user location
  function stopTracking() {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    isTracking = false;
  }

  // Update marker position on map
  function updateMarkerPosition(coordinates) {
    if (!map || !map.getSource('position-marker')) return;

    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coordinates
        }
      }]
    };

    map.getSource('position-marker').setData(geojson);
  }

  // Add coordinates to route
  function addToRoute(coordinates) {
    routeCoordinates.push(coordinates);
    
    if (routeCoordinates.length > 1 && map && map.getSource('route')) {
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };
      
      map.getSource('route').setData(geojson);
    }
  }

  // Clear the current route
  function clearRoute() {
    routeCoordinates = [];
    if (map && map.getSource('route')) {
      map.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }
  }

  // Toggle tracking on/off
  function toggleTracking() {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }

  // Reset the map view to current position
  function resetView() {
    if (currentPosition && map) {
      map.setCenter(currentPosition);
      map.setZoom(16);
    }
  }
</script>

<div class="map-container">
  <div class="map-header glass-panel">
    <button class="back-button" on:click={onBack}>
      ← Назад
    </button>
    <h2 class="map-title">Трекинг в реальном времени</h2>
    <button class="settings-button" on:click={onSettings}>
      ⚙️
    </button>
  </div>

  <div class="map-wrapper glass-panel">
    <div class="map-content">
      <div bind:this={mapContainer} class="map-instance"></div>
      
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
      
      <div class="map-overlay">
        <div class="tracking-controls">
          <button 
            class="control-button {isTracking ? 'stop' : 'start'}"
            on:click={toggleTracking}
          >
            {isTracking ? '⏹ Остановить' : '▶ Начать'}
          </button>
          
          <button 
            class="control-button reset"
            on:click={resetView}
          >
            📍 Центрировать
          </button>
          
          <button 
            class="control-button clear"
            on:click={clearRoute}
            disabled={routeCoordinates.length === 0}
          >
            🗑 Очистить
          </button>
        </div>
        
        <div class="stats-panel glass-panel">
          <div class="stat-item">
            <span class="stat-label">Статус:</span>
            <span class="stat-value {isTracking ? 'active' : 'inactive'}">
              {isTracking ? 'Отслеживание' : 'Остановлено'}
            </span>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">Точки:</span>
            <span class="stat-value">{routeCoordinates.length}</span>
          </div>
          
          {#if currentPosition}
            <div class="stat-item">
              <span class="stat-label">Позиция:</span>
              <span class="stat-value">
                {currentPosition[1].toFixed(6)}, {currentPosition[0].toFixed(6)}
              </span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .map-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
  }

  .map-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }

  .back-button, .settings-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
  }

  .map-title {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    color: white;
    text-align: center;
  }

  .map-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 70vh; /* Reduced height as per user preference */
    padding: 0;
    overflow: hidden;
  }

  .map-content {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .map-instance {
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
  }

  .error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    z-index: 10;
    text-align: center;
    max-width: 80%;
  }

  .map-overlay {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 10;
  }

  .tracking-controls {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .control-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    flex: 1;
    min-width: 120px;
  }

  .control-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
  }

  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .control-button.start {
    background: linear-gradient(90deg, #41B6E6, #34C759);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .control-button.stop {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .control-button.reset {
    background: linear-gradient(90deg, #41B6E6, #FF9500);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .control-button.clear {
    background: linear-gradient(90deg, #41B6E6, #FF3B30);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .stats-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.4);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    min-width: 100px;
  }

  .stat-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .stat-value.active {
    color: #34C759;
  }

  .stat-value.inactive {
    color: #FF3B30;
  }

  /* Glass panel effect - consistent with app styling */
  .glass-panel {
    background: rgba(255, 255, 255, 0.12); /* Increased opacity for thicker appearance */
    backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    -webkit-backdrop-filter: blur(15px); /* Increased blur for thicker glass effect */
    border: 0.125rem solid rgba(255, 255, 255, 0.25); /* Thicker border */
    border-radius: 1.5rem; /* Slightly increased radius */
    padding: 1.5rem; /* Increased padding */
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3), /* Enhanced shadow */
      inset 0 0 2rem rgba(255, 255, 255, 0.2), /* Inner glow for thickness */
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15), /* Bottom inner light */
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2); /* Top inner light */
    position: relative;
    z-index: 15;
    overflow: hidden;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .map-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .map-wrapper {
      height: 60vh;
    }

    .tracking-controls {
      flex-direction: column;
    }

    .control-button {
      width: 100%;
    }

    .stats-panel {
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-item {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .map-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }

    .map-header {
      padding: 0.75rem 1rem;
    }

    .map-title {
      font-size: 1.1rem;
    }

    .control-button {
      padding: 0.6rem 0.8rem;
      font-size: 0.8rem;
    }

    .stats-panel {
      padding: 0.75rem;
    }

    .stat-label {
      font-size: 0.7rem;
    }

    .stat-value {
      font-size: 0.9rem;
    }
  }
</style>
</file>