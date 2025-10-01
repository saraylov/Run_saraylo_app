<script>
  import ActivityRings from './ActivityRings.svelte';
  import { onMount } from 'svelte';

  let progress1 = 0;
  let progress2 = 0;
  let progress3 = 0;
  let steps = 0;
  let isAnimating = false;
  let animationFrame;

  function startAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Animate to 150% for demonstration
      progress1 = progress * 150;
      progress2 = progress * 150;
      progress3 = progress * 150;
      steps = progress * 8500; // Animate to 8,500 steps
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        isAnimating = false;
      }
    }
    
    animationFrame = requestAnimationFrame(update);
  }

  function reset() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    progress1 = 0;
    progress2 = 0;
    progress3 = 0;
    steps = 0;
    isAnimating = false;
  }

  onMount(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
</script>

<div class="test-container">
  <h1>Тест компонента активности</h1>
  
  <div class="rings-container">
    <ActivityRings 
      progress1={progress1}
      progress2={progress2}
      progress3={progress3}
      steps={steps}
      hasData={true}
      showWhenNoData={true}
    />
  </div>
  
  <div class="controls">
    <button class="control-button" on:click={startAnimation} disabled={isAnimating}>
      {isAnimating ? 'Анимация запущена...' : 'Запустить анимацию'}
    </button>
    <button class="control-button" on:click={reset}>
      Сбросить
    </button>
  </div>
  
  <div class="progress-info">
    <p>Прогресс 1: {Math.round(progress1)}%</p>
    <p>Прогресс 2: {Math.round(progress2)}%</p>
    <p>Прогресс 3: {Math.round(progress3)}%</p>
    <p>Шаги: {Math.round(steps).toLocaleString()}</p>
  </div>
</div>

<style>
  .test-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1.5rem;
    color: white;
  }
  
  h1 {
    font-size: 1.8rem;
    margin: 0;
  }
  
  .rings-container {
    margin: 1rem 0;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .control-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    min-width: 180px;
  }
  
  .control-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.3);
  }
  
  .control-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .control-button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .progress-info {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    min-width: 200px;
    text-align: center;
  }
  
  .progress-info p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
</style>