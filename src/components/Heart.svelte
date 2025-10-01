<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  // Mock health data
  let healthData = {
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenSaturation: 98,
    temperature: 36.6,
    steps: 8542,
    calories: 420,
    sleep: { hours: 7.5, quality: 'Good' }
  };

  // Health metrics history (mock data)
  let heartRateHistory = [
    { time: '08:00', value: 65 },
    { time: '12:00', value: 78 },
    { time: '16:00', value: 72 },
    { time: '20:00', value: 68 }
  ];

  // Function to simulate updating health data
  function updateHealthData() {
    // In a real app, this would fetch data from a health API or device
    healthData.heartRate = 65 + Math.floor(Math.random() * 20);
    healthData.bloodPressure.systolic = 115 + Math.floor(Math.random() * 15);
    healthData.bloodPressure.diastolic = 75 + Math.floor(Math.random() * 10);
    healthData.oxygenSaturation = 95 + Math.floor(Math.random() * 4);
    healthData.temperature = 36.2 + (Math.random() * 0.8);
    healthData.steps = 8000 + Math.floor(Math.random() * 1000);
    healthData.calories = 400 + Math.floor(Math.random() * 100);
  }

  // Props using Svelte 5 runes
  const { onBack, onSettings } = $props();

  // Update health data periodically
  onMount(() => {
    const interval = setInterval(updateHealthData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  });
</script>

<Header title="Здоровье" showSettingsButton={true} onSettings={onSettings} onBack={onBack} />

<div class="health-container">
  <!-- Heart Rate Card -->
  <div class="glass-panel">
    <div class="health-card">
      <div class="card-header">
        <h2 class="card-title">Пульс</h2>
        <div class="heart-icon">❤️</div>
      </div>
      <div class="card-content">
        <div class="heart-rate-display">
          <span class="heart-rate-value">{healthData.heartRate}</span>
          <span class="heart-rate-unit">уд/мин</span>
        </div>
        <div class="heart-rate-status">
          {#if healthData.heartRate < 60}
            <span class="status-indicator low">Ниже нормы</span>
          {:else if healthData.heartRate > 100}
            <span class="status-indicator high">Выше нормы</span>
          {:else}
            <span class="status-indicator normal">Норма</span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Health Metrics Grid -->
  <div class="glass-panel">
    <h2 class="section-title">Показатели здоровья</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">🩸</div>
        <div class="metric-name">Артериальное давление</div>
        <div class="metric-value">{healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}</div>
        <div class="metric-unit">мм рт. ст.</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">💨</div>
        <div class="metric-name">Насыщение крови кислородом</div>
        <div class="metric-value">{healthData.oxygenSaturation}%</div>
        <div class="metric-unit">SpO₂</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">🌡️</div>
        <div class="metric-name">Температура тела</div>
        <div class="metric-value">{healthData.temperature.toFixed(1)}°C</div>
        <div class="metric-unit">Цельсий</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">👟</div>
        <div class="metric-name">Шаги</div>
        <div class="metric-value">{healthData.steps.toLocaleString()}</div>
        <div class="metric-unit">шагов</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">🔥</div>
        <div class="metric-name">Калории</div>
        <div class="metric-value">{healthData.calories}</div>
        <div class="metric-unit">ккал</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">😴</div>
        <div class="metric-name">Сон</div>
        <div class="metric-value">{healthData.sleep.hours} ч</div>
        <div class="metric-unit">{healthData.sleep.quality}</div>
      </div>
    </div>
  </div>

  <!-- Heart Rate Chart -->
  <div class="glass-panel">
    <h2 class="section-title">Динамика пульса</h2>
    <div class="chart-container">
      <div class="chart">
        {#each heartRateHistory as point, i}
          <div class="chart-bar" style="height: {point.value / 120 * 100}%;"></div>
        {/each}
      </div>
      <div class="chart-labels">
        {#each heartRateHistory as point}
          <div class="chart-label">{point.time}</div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Health Tips -->
  <div class="glass-panel">
    <h2 class="section-title">Советы по здоровью</h2>
    <div class="tips-container">
      <div class="tip-card">
        <div class="tip-icon">💧</div>
        <div class="tip-content">
          <h3 class="tip-title">Пейте воду</h3>
          <p class="tip-description">Выпивайте не менее 2 литров воды в день для поддержания водного баланса.</p>
        </div>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">🥗</div>
        <div class="tip-content">
          <h3 class="tip-title">Сбалансированное питание</h3>
          <p class="tip-description">Включайте в рацион овощи, фрукты и белки для поддержания здоровья.</p>
        </div>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">🚶</div>
        <div class="tip-content">
          <h3 class="tip-title">Физическая активность</h3>
          <p class="tip-description">Старайтесь делать не менее 10 000 шагов в день.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .health-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
  }

  /* Glass panel effect - enhanced thicker glass appearance */
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

  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  /* Health Card Styles */
  .health-card {
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .card-title {
    margin: 0;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
  }

  .heart-icon {
    font-size: 2rem;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .heart-rate-display {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .heart-rate-value {
    font-size: 3rem;
    font-weight: 700;
    color: #41B6E6; /* Miami Blue */
  }

  .heart-rate-unit {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .heart-rate-status {
    margin-top: 0.5rem;
  }

  .status-indicator {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .status-indicator.normal {
    background: rgba(65, 182, 230, 0.2); /* Miami Blue */
    color: #41B6E6;
    border: 1px solid rgba(65, 182, 230, 0.5);
  }

  .status-indicator.low {
    background: rgba(219, 62, 177, 0.2); /* Miami Pink */
    color: #db3eb1;
    border: 1px solid rgba(219, 62, 177, 0.5);
  }

  .status-indicator.high {
    background: rgba(255, 0, 0, 0.2);
    color: #ff0000;
    border: 1px solid rgba(255, 0, 0, 0.5);
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    transition: all 0.3s ease;
  }

  .metric-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .metric-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .metric-name {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
  }

  .metric-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.25rem;
  }

  .metric-unit {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  /* Chart Styles */
  .chart-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .chart {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 150px;
    padding: 1rem 0;
  }

  .chart-bar {
    width: 30px;
    background: linear-gradient(to top, #41B6E6, #db3eb1);
    border-radius: 5px 5px 0 0;
    position: relative;
    min-height: 5px;
  }

  .chart-labels {
    display: flex;
    justify-content: space-around;
  }

  .chart-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    width: 30px;
  }

  /* Tips Styles */
  .tips-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tip-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    transition: all 0.3s ease;
  }

  .tip-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .tip-icon {
    font-size: 1.5rem;
  }

  .tip-content {
    flex: 1;
  }

  .tip-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: white;
    font-weight: 600;
  }

  .tip-description {
    margin: 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .health-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .glass-panel {
      padding: 1.25rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .heart-rate-value {
      font-size: 2.5rem;
    }

    .tip-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .health-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }

    .section-title {
      font-size: 1.1rem;
    }

    .card-title {
      font-size: 1.2rem;
    }

    .heart-rate-value {
      font-size: 2rem;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .chart-bar {
      width: 20px;
    }

    .chart-label {
      width: 20px;
      font-size: 0.7rem;
    }
  }
</style>