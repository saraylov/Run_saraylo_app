<script>
  import personalSpeedZoneService from '../lib/personalSpeedZoneService.js';
  import { onMount } from 'svelte';

  // State
  let targetSpeeds = $state(null);
  let isLoading = $state(true);
  let error = $state(null);

  // Load target speeds on component mount
  onMount(async () => {
    try {
      isLoading = true;
      targetSpeeds = personalSpeedZoneService.getAllTargetSpeeds();
    } catch (err) {
      error = 'Failed to load target speeds';
      console.error('Error loading target speeds:', err);
    } finally {
      isLoading = false;
    }
  });

  // Format speed for display
  function formatSpeed(speed) {
    return speed ? speed.toFixed(1) + ' км/ч' : 'N/A';
  }

  // Get training recommendation based on zone
  function getTrainingRecommendation(zoneKey) {
    const recommendations = {
      blue: 'Активное восстановление, длительные легкие пробежки',
      green: 'Основная аэробная тренировка, темповые пробежки',
      yellow: 'Пробежки в зоне порога, интервальные тренировки',
      orange: 'Военно-тактические тренировки, короткие интенсивные интервалы',
      red: 'Спринты, максимальные усилия на короткие дистанции'
    };
    return recommendations[zoneKey] || '';
  }

  // Get duration recommendation based on zone
  function getDurationRecommendation(zoneKey) {
    const durations = {
      blue: '30-90 минут',
      green: '20-60 минут',
      yellow: '15-45 минут',
      orange: '10-30 минут',
      red: '5-15 минут'
    };
    return durations[zoneKey] || '';
  }
</script>

<div class="training-plan-container">
  <h2>План тренировок с учетом персональных скоростных зон</h2>
  
  {#if isLoading}
    <div class="loading">Загрузка плана тренировок...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if targetSpeeds}
    <div class="training-plan-info">
      <p>
        Этот план тренировок основан на ваших персональных скоростных зонах. 
        Используйте рекомендуемые скорости и длительности для достижения 
        максимального эффекта от тренировок.
      </p>
    </div>
    
    <div class="zones-grid">
      {#each Object.entries(targetSpeeds) as [zoneKey, zone]}
        <div class="zone-card" style="border-left: 6px solid {zone.color};">
          <div class="zone-header">
            <div class="zone-color" style="background-color: {zone.color};"></div>
            <h3 class="zone-name">{zone.name}</h3>
          </div>
          
          <div class="zone-details">
            <div class="detail-row">
              <span class="detail-label">Целевая скорость:</span>
              <span class="detail-value">{formatSpeed(zone.averageSpeed)}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Диапазон скоростей:</span>
              <span class="detail-value">
                {formatSpeed(zone.minSpeed)} - {formatSpeed(zone.maxSpeed)}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Интенсивность:</span>
              <span class="detail-value">{zone.effortRange}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Рекомендуемая длительность:</span>
              <span class="detail-value">{getDurationRecommendation(zoneKey)}</span>
            </div>
          </div>
          
          <div class="zone-recommendation">
            <h4>Рекомендации по тренировке:</h4>
            <p>{getTrainingRecommendation(zoneKey)}</p>
          </div>
        </div>
      {/each}
    </div>
    
    <div class="training-tips">
      <h3>Советы по тренировкам</h3>
      <ul>
        <li>Начинайте каждую тренировку с 5-10 минут разминки в синей зоне</li>
        <li>Заканчивайте тренировку 5-10 минут заминкой в синей или зеленой зоне</li>
        <li>Чередуйте разные зоны в течение недели для сбалансированной подготовки</li>
        <li>Регулярно проходите оценочные тренировки для обновления зон</li>
      </ul>
    </div>
  {:else}
    <div class="no-zones">
      <h3>План тренировок недоступен</h3>
      <p>
        Для получения персонального плана тренировок необходимо 
        пройти оценочную тренировку и настроить скоростные зоны.
      </p>
      <p>
        После калибровки вы сможете использовать этот план для 
        оптимизации ваших тренировок.
      </p>
    </div>
  {/if}
</div>

<style>
  .training-plan-container {
    width: 100%;
    padding: 1rem;
  }
  
  .training-plan-container h2 {
    text-align: center;
    color: white;
    margin-bottom: 1.5rem;
  }
  
  .loading, .error, .no-zones {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .error {
    color: #ff6b6b;
  }
  
  .training-plan-info {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .training-plan-info p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }
  
  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  
  .zone-recommendation {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  .zone-recommendation h4 {
    margin: 0 0 0.5rem 0;
    color: white;
    font-size: 1rem;
  }
  
  .zone-recommendation p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .training-tips {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .training-tips h3 {
    margin: 0 0 1rem 0;
    color: white;
  }
  
  .training-tips ul {
    margin: 0;
    padding-left: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .training-tips li {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .no-zones h3 {
    color: white;
    margin: 0 0 1rem 0;
  }
  
  .no-zones p {
    margin: 0.5rem 0;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .zones-grid {
      grid-template-columns: 1fr;
    }
    
    .training-plan-container {
      padding: 0.75rem;
    }
    
    .zone-card {
      padding: 1rem;
    }
  }
  
  /* Ensure proper scrolling */
  .training-plan-container {
    overflow-y: auto;
    max-height: 100vh;
  }
</style>