<script>
  import personalSpeedZoneService from '../lib/personalSpeedZoneService.js';
  import { onMount } from 'svelte';

  // State
  let speedZones = $state(null);
  let isLoading = $state(true);
  let error = $state(null);

  // Load personal speed zones on component mount
  onMount(async () => {
    try {
      isLoading = true;
      speedZones = personalSpeedZoneService.getPersonalSpeedZones();
    } catch (err) {
      error = 'Failed to load personal speed zones';
      console.error('Error loading personal speed zones:', err);
    } finally {
      isLoading = false;
    }
  });

  // Format speed for display
  function formatSpeed(speed) {
    return speed ? speed.toFixed(1) + ' км/ч' : 'N/A';
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Get effort description based on zone
  function getEffortDescription(zoneKey) {
    const descriptions = {
      blue: 'Легкая интенсивность, восстановительная зона',
      green: 'Умеренная интенсивность, аэробная зона',
      yellow: 'Средневысокая интенсивность, переходная зона',
      orange: 'Высокая интенсивность, анаэробная зона',
      red: 'Максимальная интенсивность, зона предела'
    };
    return descriptions[zoneKey] || '';
  }
</script>

<div class="speed-zones-container">
  {#if isLoading}
    <div class="loading">Загрузка скоростных зон...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if speedZones && speedZones.zones}
    <div class="speed-zones-header">
      <h2>Мои персональные скоростные зоны</h2>
      <p class="calibration-info">
        Дата калибровки: {formatDate(speedZones.calibrationDate)}
      </p>
    </div>
    
    <div class="zones-grid">
      {#each Object.entries(speedZones.zones) as [zoneKey, zone]}
        <div class="zone-card" style="border-top: 4px solid {zone.color};">
          <div class="zone-header">
            <div class="zone-color" style="background-color: {zone.color};"></div>
            <h3 class="zone-name">{zone.name}</h3>
          </div>
          
          <div class="zone-details">
            <div class="detail-row">
              <span class="detail-label">Средняя скорость:</span>
              <span class="detail-value">{formatSpeed(zone.averageSpeed)}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Диапазон скоростей:</span>
              <span class="detail-value">
                {formatSpeed(zone.minSpeed)} - {formatSpeed(zone.maxSpeed)}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Процент усилий:</span>
              <span class="detail-value">{zone.percentage}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Интенсивность:</span>
              <span class="detail-value">{zone.effortRange}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Длительность:</span>
              <span class="detail-value">{zone.duration} мин</span>
            </div>
          </div>
          
          <div class="zone-description">
            {getEffortDescription(zoneKey)}
          </div>
        </div>
      {/each}
    </div>
    
    <div class="usage-info">
      <h3>Как использовать скоростные зоны</h3>
      <p>
        Эти зоны были рассчитаны на основе вашей оценочной тренировки и 
        представляют собой персональные показатели интенсивности. Используйте 
        их как ориентиры для планирования будущих тренировок.
      </p>
    </div>
  {:else}
    <div class="no-zones">
      <h3>Персональные скоростные зоны не настроены</h3>
      <p>
        Пройдите оценочную тренировку для автоматической калибровки 
        ваших персональных скоростных зон.
      </p>
    </div>
  {/if}
</div>

<style>
  .speed-zones-container {
    width: 100%;
    padding: 1rem;
  }
  
  .loading, .error, .no-zones {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .error {
    color: #ff6b6b;
  }
  
  .speed-zones-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .speed-zones-header h2 {
    margin: 0 0 0.5rem 0;
    color: white;
    font-size: 1.5rem;
  }
  
  .calibration-info {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .zone-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .zone-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
  }
  
  .zone-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #98002E, #F9A01B, #00BFFF, #FF1493);
  }
  
  .zone-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .zone-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 0.75rem;
  }
  
  .zone-name {
    margin: 0;
    color: white;
    font-size: 1.25rem;
  }
  
  .zone-details {
    margin-bottom: 1rem;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .detail-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .detail-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .detail-value {
    color: white;
    font-weight: 500;
  }
  
  .zone-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    line-height: 1.4;
    font-style: italic;
  }
  
  .usage-info {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .usage-info h3 {
    margin: 0 0 1rem 0;
    color: white;
  }
  
  .usage-info p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }
  
  .no-zones h3 {
    color: white;
    margin: 0 0 1rem 0;
  }
  
  .no-zones p {
    margin: 0;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .zones-grid {
      grid-template-columns: 1fr;
    }
    
    .speed-zones-container {
      padding: 0.75rem;
    }
    
    .zone-card {
      padding: 1rem;
    }
  }
  
  /* Ensure proper scrolling */
  .speed-zones-container {
    overflow-y: auto;
    max-height: 100vh;
  }
</style>