<script>
  import { formatHistoryDate } from './profileUtils.js';
  
  // Props using Svelte 5 runes
  const { personalSpeedZones } = $props();
</script>

<!-- Personal Speed Zones Section -->
<div class="personal-speed-zones-section">
  <h3 class="panel-title">Мои скоростные зоны</h3>
  {#if personalSpeedZones && personalSpeedZones.zones}
    <div class="color-panels-container">
      {#each Object.entries(personalSpeedZones.zones) as [zoneKey, zone]}
        <div class="color-panel" style="background-color: {zone.color};" title="{zone.name}: {zone.averageSpeed.toFixed(1)} км/ч">
          <div class="panel-content">
            <div class="zone-name">{zone.name}</div>
            <div class="segment-speed">{zone.averageSpeed.toFixed(1)} км/ч</div>
            <div class="effort-range">{zone.effortRange}</div>
            <div class="calibration-date">{formatHistoryDate(personalSpeedZones.calibrationDate)}</div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-zones-message">
      <p>Пройдите оценочную тренировку для калибровки скоростных зон</p>
    </div>
  {/if}
</div>

<style>
  .personal-speed-zones-section {
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
  
  .zone-name {
    font-size: 0.6rem;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .segment-speed {
    font-size: 0.6rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .effort-range {
    font-size: 0.5rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .calibration-date {
    font-size: 0.5rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .no-zones-message {
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