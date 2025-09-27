<script>
  import ConcentricActivityRings from './ConcentricActivityRings.svelte';
  
  // Export props for customization
  export let title = 'Активность';
  export let size = 200;
</script>

<div class="concentric-activity-panel glass-panel">
  <h2 class="panel-title">{title}</h2>
  <ConcentricActivityRings {size} />
  
  <div class="legend">
    <div class="legend-item">
      <div class="legend-color" style="background-color: #41B6E6;"></div>
      <span class="legend-label">Калории</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #db3eb1;"></div>
      <span class="legend-label">Шаги</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #FFFFFF;"></div>
      <span class="legend-label">Сон</span>
    </div>
  </div>
</div>

<style>
  .concentric-activity-panel {
    margin: 1rem 0;
    text-align: center;
    padding: 1.5rem;
  }
  
  .panel-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .legend {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .legend-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
  
  /* Glass panel effect - matching existing design */
  .glass-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(0.625rem);
    -webkit-backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem;
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
    position: relative;
    z-index: 15;
  }
</style>