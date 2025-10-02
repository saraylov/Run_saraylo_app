<script>
  // Props using Svelte 5 runes
  const { categories, selectedCategory, selectCategory } = $props();
</script>

<!-- Category Filter -->
<div class="glass-panel category-filter exercises-category-filter">
  <h2 class="section-title category-filter-title">Выберите категорию тренировки</h2>
  <div class="category-list exercises-category-list">
    {#each categories as category}
      <button 
        class="category-button {selectedCategory === category.id ? 'active' : ''} exercises-category-button"
        on:click={() => selectCategory(category.id)}
      >
        {category.name}
      </button>
    {/each}
  </div>
</div>

<style>
  .exercises-category-filter {
    padding: 1rem;
    z-index: 17;
  }

  .exercises-category-list {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    z-index: 18;
  }

  .exercises-category-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 0.125rem 0.375rem rgba(0, 0, 0, 0.15),
      inset 0 0.03125rem 0.0625rem rgba(255, 255, 255, 0.2);
    z-index: 18;
    position: relative;
  }

  .exercises-category-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
    z-index: 19;
  }

  .exercises-category-button.active {
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    color: white;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0.25rem 0.5rem rgba(0, 0, 0, 0.2),
      inset 0 0.03125rem 0.09375rem rgba(255, 255, 255, 0.3);
    z-index: 19;
  }

  .category-filter-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
    z-index: 18;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .exercises-category-list {
      flex-direction: column;
    }
  }
</style>