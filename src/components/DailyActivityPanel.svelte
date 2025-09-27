<script>
  import DailyActivityRings from './DailyActivityRings.svelte';
  
  // Export props for customization
  export let title = 'Ежедневная активность';
  export let size = 200;
</script>

<div class="daily-activity-panel glass-panel">
  <h2 class="panel-title">{title}</h2>
  <DailyActivityRings {size} />
  
  <div class="info-text">
    <p>Данные обновляются в реальном времени</p>
    <p>Сброс происходит автоматически в 00:00</p>
  </div>
</div>

<style>
  .daily-activity-panel {
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
  
  .info-text {
    margin-top: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .info-text p {
    margin: 0.3rem 0;
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