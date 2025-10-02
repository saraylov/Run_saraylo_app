<script>
  import { onMount } from 'svelte';
  import trainingPlanService from '../lib/trainingPlanService.js';

  // State
  let trainingPlan = $state(null);
  let isLoading = $state(true);
  let error = $state(null);

  // Load training plan on component mount
  onMount(async () => {
    try {
      isLoading = true;
      trainingPlan = trainingPlanService.getMostRecentTrainingPlan();
      
      // If no existing plan, generate a new one
      if (!trainingPlan) {
        trainingPlan = trainingPlanService.generatePersonalizedTrainingPlan();
        if (trainingPlan) {
          trainingPlanService.saveTrainingPlan(trainingPlan);
        }
      }
    } catch (err) {
      error = 'Failed to load training plan';
      console.error('Error loading training plan:', err);
    } finally {
      isLoading = false;
    }
  });

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

  // Get zone color by name
  function getZoneColor(zoneName) {
    const colors = {
      'blue': '#41B6E6',
      'green': '#90EE90',
      'yellow': '#FFD700',
      'orange': '#FFA500',
      'red': '#FF0000',
      'rest': '#808080'
    };
    return colors[zoneName] || '#FFFFFF';
  }
</script>

<div class="training-plan-container">
  <h2>Персональный план тренировок</h2>
  
  {#if isLoading}
    <div class="loading">Загрузка плана тренировок...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if trainingPlan}
    <div class="plan-header">
      <p class="plan-date">Создан: {formatDate(trainingPlan.createdAt)}</p>
    </div>
    
    <div class="weekly-plan">
      <h3>Недельный план</h3>
      <div class="plan-table">
        <div class="table-header">
          <div class="header-cell">День</div>
          <div class="header-cell">Тренировка</div>
          <div class="header-cell">Зона</div>
          <div class="header-cell">Длительность</div>
          <div class="header-cell">Целевая скорость</div>
        </div>
        
        {#each trainingPlan.weeklyPlan as dayPlan}
          <div class="table-row">
            <div class="cell day-cell">{dayPlan.day}</div>
            <div class="cell workout-cell">
              <div class="workout-name">{dayPlan.workout}</div>
              <div class="workout-description">{dayPlan.description}</div>
            </div>
            <div class="cell zone-cell">
              <span class="zone-indicator" style="background-color: {getZoneColor(dayPlan.zone)};"></span>
              {dayPlan.zone}
            </div>
            <div class="cell duration-cell">{dayPlan.duration}</div>
            <div class="cell speed-cell">{dayPlan.targetSpeed}</div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="training-tips">
      <h3>Советы по тренировкам</h3>
      <ul>
        {#each trainingPlan.tips as tip}
          <li>{tip}</li>
        {/each}
      </ul>
    </div>
  {:else}
    <div class="no-plan">
      <h3>План тренировок недоступен</h3>
      <p>
        Для получения персонального плана тренировок необходимо 
        пройти оценочную тренировку и настроить скоростные зоны.
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
  
  .loading, .error, .no-plan {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .error {
    color: #ff6b6b;
  }
  
  .plan-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .plan-date {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .weekly-plan h3 {
    color: white;
    margin-bottom: 1rem;
  }
  
  .plan-table {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 2rem;
    position: relative;
  }
  
  .plan-table::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #98002E, #F9A01B, #00BFFF, #FF1493);
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .header-cell {
    color: white;
    text-align: center;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .table-row:last-child {
    border-bottom: none;
  }
  
  .cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
  }
  
  .day-cell {
    font-weight: bold;
    color: white;
  }
  
  .workout-cell {
    text-align: left;
  }
  
  .workout-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .workout-description {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .zone-cell {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .zone-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .duration-cell, .speed-cell {
    font-size: 0.9rem;
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
  
  .no-plan h3 {
    color: white;
    margin: 0 0 1rem 0;
  }
  
  .no-plan p {
    margin: 0.5rem 0;
  }
  
  /* Responsive design */
  @media (max-width: 62rem) { /* 992px */
    .table-header, .table-row {
      grid-template-columns: 1fr 2fr 1fr;
    }
    
    .header-cell:nth-child(4),
    .header-cell:nth-child(5),
    .duration-cell,
    .speed-cell {
      display: none;
    }
  }
  
  @media (max-width: 48rem) { /* 768px */
    .training-plan-container {
      padding: 0.75rem;
    }
    
    .table-header, .table-row {
      grid-template-columns: 1fr 2fr;
    }
    
    .header-cell:nth-child(3),
    .zone-cell {
      display: none;
    }
    
    .plan-table {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 30rem) { /* 480px */
    .table-header, .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .header-cell:not(:first-child) {
      display: none;
    }
    
    .table-row {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0.75rem;
    }
    
    .cell {
      flex-direction: row;
      justify-content: space-between;
      text-align: right;
      padding: 0.1rem 0;
    }
    
    .day-cell {
      font-weight: bold;
      justify-content: flex-start;
      text-align: left;
    }
    
    .workout-cell {
      flex-direction: column;
      text-align: left;
    }
  }
  
  /* Ensure proper scrolling */
  .training-plan-container {
    overflow-y: auto;
    max-height: 100vh;
  }
</style>