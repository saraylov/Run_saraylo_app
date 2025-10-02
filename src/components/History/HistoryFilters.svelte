<script>
  import { createEventDispatcher } from 'svelte';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 runes - corrected syntax
  let { 
    filterType = 'all',
    filterDate = 'all',
    filterDuration = 'all',
    comparisonMode = false,
    selectedWorkouts = []
  } = $props();
  
  // Functions to handle changes and dispatch events
  function handleFilterTypeChange(event) {
    dispatch('filterTypeChange', event.target.value);
  }
  
  function handleFilterDateChange(event) {
    dispatch('filterDateChange', event.target.value);
  }
  
  function handleFilterDurationChange(event) {
    dispatch('filterDurationChange', event.target.value);
  }
  
  function handleApplyFilters() {
    dispatch('applyFilters');
  }
  
  function handleStartComparison() {
    dispatch('startComparison');
  }
  
  function handleCancelComparison() {
    dispatch('cancelComparison');
  }
  
  function handleShowComparisonView() {
    dispatch('showComparisonView');
  }
</script>

<!-- Filter Section -->
<div class="glass-panel filter-section">
  <h2 class="section-title">Фильтры</h2>
  <div class="filter-controls">
    <select value={filterType} on:change={handleFilterTypeChange} class="filter-select">
      <option value="all">Все типы</option>
      <option value="running">Бег</option>
      <option value="treadmill">Бег на дорожке</option>
      <option value="cycling">Велосипед</option>
      <option value="walking">Ходьба</option>
      <option value="nordic_walking">Скандинавская ходьба</option>
    </select>
    
    <select value={filterDate} on:change={handleFilterDateChange} class="filter-select">
      <option value="all">Все даты</option>
      <option value="week">Последняя неделя</option>
      <option value="month">Последний месяц</option>
      <option value="year">Последний год</option>
    </select>
    
    <select value={filterDuration} on:change={handleFilterDurationChange} class="filter-select">
      <option value="all">Любая продолжительность</option>
      <option value="10-30">10-30 минут</option>
      <option value="30-60">30-60 минут</option>
      <option value="60+">Более 60 минут</option>
    </select>
    
    <button class="filter-button" on:click={handleApplyFilters}>
      Применить
    </button>
  </div>
  
  <!-- Comparison Controls -->
  <div class="comparison-controls">
    {#if !comparisonMode}
      <button class="comparison-button" on:click={handleStartComparison}>
        Сравнить тренировки
      </button>
    {:else}
      <button class="comparison-button active" on:click={handleCancelComparison}>
        Отмена
      </button>
      {#if selectedWorkouts.length === 2}
        <button class="comparison-button primary" on:click={handleShowComparisonView}>
          Сравнить выбранные
        </button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .filter-section {
    padding: 1rem;
  }
  
  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .filter-select {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: 120px;
  }
  
  .filter-button {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    border: none;
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .filter-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .comparison-controls {
    display: flex;
    gap: 0.75rem;
  }
  
  .comparison-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
  }
  
  .comparison-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .comparison-button.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
  }
  
  .comparison-button.primary {
    background: linear-gradient(90deg, #34C759, #41B6E6);
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .filter-controls {
      flex-direction: column;
    }
    
    .filter-select {
      min-width: auto;
    }
  }
</style>