<script>
  import { onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  
  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1Ijoia29tbXVuMTV0IiwiYSI6ImNtZmk1ZzlsNTBoejAybHF3ejR6bjEwZ3oifQ.GHO6tJYDnc03P7fxUshk8A';

  // Props using Svelte 5 runes
  let { 
    trainingStarted, 
    trainingPaused, 
    trainingStats,
    mapContainer = $bindable()
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
  
  // Initialize the Mapbox map
  function initializeMap() {
    if (!mapContainer) return;
    
    // If map already exists, remove it first
    if (map) {
      map.remove();
    }
    
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.5234, 50.4501], // Default to Kyiv coordinates
      zoom: 14
    });

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    });
    map.addControl(nav, 'top-right');

    // Add geolocate control
    geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocateControl, 'top-left');

    // Wait for map to load before adding event listeners
    map.on('load', () => {
      // Set up event listeners for geolocation
      geolocateControl.on('geolocate', (position) => {
        const { longitude, latitude } = position.coords;
        const newCoordinate = [longitude, latitude];
        
        // Add new coordinate to route only if training is active
        if (trainingStarted && !trainingPaused) {
          routeCoordinates.push(newCoordinate);
          
          // Update or create route source
          if (map.getSource(routeSourceId)) {
            map.getSource(routeSourceId).setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates
              }
            });
          } else {
            // Create route source and layer
            map.addSource(routeSourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates
                }
              }
            });
            
            map.addLayer({
              id: routeLayerId,
              type: 'line',
              source: routeSourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#db3eb1', // Miami Pink
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
          
          // Smoothly move the map to follow the user
          map.easeTo({
            center: newCoordinate,
            zoom: 16,
            duration: 1000 // Smooth transition over 1 second
          });
        }
      });

      // Handle errors in geolocation
      geolocateControl.on('error', (error) => {
        console.error('Geolocation error:', error);
        alert('Не удалось получить ваше местоположение. Пожалуйста, проверьте настройки браузера.');
      });
    });
  }
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