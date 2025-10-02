<script>
  import PersonalSpeedZones from './PersonalSpeedZones.svelte';
  import personalSpeedZoneService from '../lib/personalSpeedZoneService.js';
  
  // Mock data for testing
  const mockSegments = [
    { name: 'Голубой', color: '#41B6E6', avgSpeed: 8.5, duration: 6 },
    { name: 'Салатовый', color: '#90EE90', avgSpeed: 10.2, duration: 5 },
    { name: 'Желтый', color: '#FFD700', avgSpeed: 12.8, duration: 5 },
    { name: 'Оранжевый', color: '#FFA500', avgSpeed: 14.5, duration: 3 },
    { name: 'Красный', color: '#FF0000', avgSpeed: 16.2, duration: 1 }
  ];
  
  // Function to simulate an assessment workout and save speed zones
  function simulateAssessmentWorkout() {
    try {
      // Calculate personal speed zones based on mock data
      const zonesData = personalSpeedZoneService.calculatePersonalSpeedZones(mockSegments);
      
      // Save the calculated personal speed zones
      const success = personalSpeedZoneService.savePersonalSpeedZones(zonesData);
      
      if (success) {
        alert('Тестовая оценочная тренировка успешно завершена! Скоростные зоны сохранены.');
        // Refresh the display
        window.location.reload();
      } else {
        alert('Ошибка при сохранении скоростных зон.');
      }
    } catch (error) {
      console.error('Error simulating assessment workout:', error);
      alert('Ошибка при симуляции оценочной тренировки: ' + error.message);
    }
  }
  
  // Function to clear personal speed zones
  function clearSpeedZones() {
    personalSpeedZoneService.clearPersonalSpeedZones();
    alert('Скоростные зоны очищены.');
    // Refresh the display
    window.location.reload();
  }
</script>

<div class="test-container">
  <h1>Тестирование системы скоростных зон</h1>
  
  <div class="test-controls">
    <button class="test-button" on:click={simulateAssessmentWorkout}>
      Симуляция оценочной тренировки
    </button>
    
    <button class="test-button clear-button" on:click={clearSpeedZones}>
      Очистить скоростные зоны
    </button>
  </div>
  
  <div class="speed-zones-display">
    <PersonalSpeedZones />
  </div>
</div>

<style>
  .test-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }
  
  .test-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .test-button {
    background: linear-gradient(135deg, #98002E, #F9A01B);
    border: none;
    border-radius: 0.5rem;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }
  
  .test-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  }
  
  .clear-button {
    background: linear-gradient(135deg, #ff6b6b, #ffa500);
  }
  
  .speed-zones-display {
    margin-top: 2rem;
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .test-container {
      padding: 1rem;
    }
    
    .test-controls {
      flex-direction: column;
      align-items: center;
    }
    
    .test-button {
      width: 100%;
      max-width: 300px;
    }
  }
</style>