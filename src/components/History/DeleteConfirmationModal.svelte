<script>
  import { createEventDispatcher } from 'svelte';
  import { getWorkoutTypeName } from './historyUtils.js';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 runes
  let { 
    isVisible = false,
    workoutTitle = '',
    onConfirm = () => {},
    onCancel = () => {}
  } = $props();
  
  // Handle confirm action
  function handleConfirm() {
    onConfirm();
    dispatch('confirm');
  }
  
  // Handle cancel action
  function handleCancel() {
    onCancel();
    dispatch('cancel');
  }
  
  // Get formatted workout title
  function getFormattedWorkoutTitle() {
    if (workoutTitle) {
      return getWorkoutTypeName(workoutTitle);
    }
    return 'тренировка';
  }
</script>

{#if isVisible}
  <div class="modal-overlay" on:click={handleCancel}>
    <div class="modal-content glass-panel" on:click|stopPropagation>
      <h2 class="modal-title">Подтверждение удаления</h2>
      <p class="modal-message">
        Вы уверены, что хотите удалить {getFormattedWorkoutTitle()} из истории?
      </p>
      <div class="modal-actions">
        <button class="modal-button cancel-button" on:click={handleCancel}>
          Отмена
        </button>
        <button class="modal-button confirm-button" on:click={handleConfirm}>
          Удалить
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
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
    overflow: hidden;
    max-width: 90%;
    width: 400px;
    z-index: 1001;
  }
  
  .modal-title {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .modal-message {
    margin: 0 0 1.5rem 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
  }
  
  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .modal-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    max-width: 120px;
  }
  
  .cancel-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    color: white;
  }
  
  .cancel-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .confirm-button {
    background: linear-gradient(90deg, #FF4136, #B33A3A);
    color: white;
  }
  
  .confirm-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>