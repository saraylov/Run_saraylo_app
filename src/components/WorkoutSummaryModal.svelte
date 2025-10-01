<script>
  import { createEventDispatcher } from 'svelte';

  // Create event dispatcher for communicating with parent components
  const dispatch = createEventDispatcher();

  // Props for the modal
  let { 
    isVisible = false, 
    workoutData = null,
    onClose = null,
    onSave = null
  } = $props();

  // Function to close the modal
  function closeModal() {
    if (onClose) onClose();
  }

  // Function to save the workout
  function saveWorkout() {
    if (onSave) onSave();
    closeModal();
  }

  // Function to format time from seconds to HH:MM:SS
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Function to format pace from seconds per km to MM:SS/km
  function formatPace(secondsPerKm) {
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.floor(secondsPerKm % 60);
    return `${mins}:${secs.toString().padStart(2, '0')} /km`;
  }
</script>

{#if isVisible && workoutData}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-container" on:click|stopPropagation>
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h2>Результаты тренировки</h2>
          <button class="close-button" on:click={closeModal}>×</button>
        </div>

        <!-- Workout Summary -->
        <div class="summary-section">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Время</div>
              <div class="summary-value">{workoutData.time}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Расстояние</div>
              <div class="summary-value">{workoutData.distance}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Средняя скорость</div>
              <div class="summary-value">{workoutData.avgSpeed}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Макс. скорость</div>
              <div class="summary-value">{workoutData.maxSpeed}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Калории</div>
              <div class="summary-value">{workoutData.calories}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Шаги</div>
              <div class="summary-value">{workoutData.steps}</div>
            </div>
          </div>
        </div>

        <!-- Segments Visualization -->
        <div class="segments-section">
          <h3>Структура тренировки</h3>
          <div class="segments-container">
            {#each workoutData.segments as segment, i}
              <div 
                class="segment-item" 
                style="background-color: {segment.color}; width: {100 / workoutData.segments.length}%;">
                <div class="segment-info">
                  <div class="segment-name">{segment.name}</div>
                  <div class="segment-duration">{segment.duration} мин</div>
                  {#if segment.avgSpeed}
                    <div class="segment-speed">{segment.avgSpeed} км/ч</div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button class="btn btn-secondary" on:click={closeModal}>Закрыть</button>
          <button class="btn btn-primary" on:click={saveWorkout}>Сохранить</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-out;
  }

  .modal-container {
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: scaleIn 0.3s ease-out;
  }

  .modal-content {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3),
      inset 0 0 2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15),
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2);
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-header h2 {
    margin: 0;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.8rem;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .summary-section {
    margin-bottom: 1.5rem;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .summary-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.15);
  }

  .summary-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.25rem;
  }

  .summary-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .segments-section {
    margin-bottom: 1.5rem;
  }

  .segments-section h3 {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .segments-container {
    display: flex;
    height: 80px;
    border-radius: 0.75rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }

  .segment-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s ease;
  }

  .segment-item:hover {
    transform: scale(1.05);
    z-index: 2;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  .segment-info {
    text-align: center;
    color: white;
    padding: 0.5rem;
    font-size: 0.7rem;
  }

  .segment-name {
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .segment-duration, .segment-speed {
    font-size: 0.6rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.2);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .btn-primary {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(90deg, #3aa0d0, #c537a0);
    transform: translateY(-2px);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @media (max-width: 48rem) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
    
    .modal-actions {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
</style>