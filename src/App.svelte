<script>
  import { onMount } from 'svelte';
  
  // State variables
  let isRunning = false;
  let startTime = 0;
  let elapsedTime = 0;
  let distance = 0; // in kilometers
  let pace = 0; // min/km
  let intervalId;
  
  // Training history
  let trainings = [];
  
  // Bubble animation
  let bubbles = [];
  let bubbleIdCounter = 0;
  
  // Load trainings from localStorage on mount
  onMount(() => {
    const savedTrainings = localStorage.getItem('trainings');
    if (savedTrainings) {
      trainings = JSON.parse(savedTrainings);
    }
    
    // Start bubble animation
    animateBubbles();
    
    // Start creating bubbles sequentially
    createBubbleSequentially();
  });
  
  // Create bubbles one by one at intervals
  function createBubbleSequentially() {
    // Create a single bubble
    const newBubble = {
      id: bubbleIdCounter++,
      x: Math.random() * 100,
      y: 110 + Math.random() * 20, // Start below the screen
      size: 45 + Math.random() * 105, // Increased size: 3 times larger (45-150px)
      speed: (20 / 5) / 6, // Slow down by 6 times (20 units in 30 seconds)
      color: getRandomColor(), // Random color
      rotation: Math.random() * 360, // Random initial rotation
      rotationSpeed: (-2 + Math.random() * 4) / 6, // Slow down rotation by 6 times
      // Zigzag movement properties
      initialX: Math.random() * 100,
      amplitude: 0.5 + Math.random() * 1.5, // Horizontal movement amplitude
      frequency: 0.02 + Math.random() * 0.03, // Zigzag frequency
      phase: Math.random() * Math.PI * 2 // Random starting phase
    };
    
    // Add the new bubble to the array
    bubbles = [...bubbles, newBubble];
    
    // Limit the number of bubbles to prevent performance issues
    if (bubbles.length > 30) {
      bubbles = bubbles.slice(1); // Remove the oldest bubble
    }
    
    // Schedule the next bubble creation
    setTimeout(createBubbleSequentially, 1000); // Create a new bubble every second
  }
  
  // Get random color from Miami Vice palette
  function getRandomColor() {
    const colors = [
      '#41B6E6', // Miami Blue
      '#db3eb1', // Miami Pink
      '#FFFFFF'  // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Animate bubbles
  function animateBubbles() {
    bubbles = bubbles.map(bubble => {
      // Calculate zigzag movement
      let newY = bubble.y - bubble.speed * 0.1;
      let newX = bubble.initialX + Math.sin(newY * bubble.frequency + bubble.phase) * bubble.amplitude;
      let newRotation = bubble.rotation + bubble.rotationSpeed;
      
      // Reset bubble when it goes off screen
      if (newY < -20) {
        // Instead of resetting, we'll remove it and let the sequential creation add new ones
        return null;
      }
      return { 
        ...bubble, 
        x: newX,
        y: newY,
        rotation: newRotation
      };
    }).filter(bubble => bubble !== null); // Remove bubbles that are off-screen
    
    requestAnimationFrame(animateBubbles);
  }
  
  // Format time as MM:SS
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Start or stop the timer
  function toggleTimer() {
    if (isRunning) {
      // Stop the timer
      clearInterval(intervalId);
      
      // Save the training
      const training = {
        id: Date.now(),
        duration: elapsedTime,
        distance: distance,
        pace: pace,
        date: new Date().toLocaleDateString()
      };
      
      trainings = [training, ...trainings];
      localStorage.setItem('trainings', JSON.stringify(trainings));
    } else {
      // Start the timer
      startTime = Date.now() - elapsedTime;
      intervalId = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        // Simulate distance increase (1 km per 5 minutes)
        distance = parseFloat(((elapsedTime / 1000 / 60) / 5).toFixed(2));
        // Calculate pace (min/km)
        if (distance > 0) {
          pace = parseFloat(((elapsedTime / 1000 / 60) / distance).toFixed(2));
        }
      }, 100);
    }
    
    isRunning = !isRunning;
  }
  
  // Reset the current activity
  function resetActivity() {
    clearInterval(intervalId);
    isRunning = false;
    elapsedTime = 0;
    distance = 0;
    pace = 0;
  }
</script>

<main>
  <!-- Bubbles background -->
  <div class="bubbles-container">
    {#each bubbles as bubble (bubble.id)}
      <div 
        class="bubble" 
        style="left: {bubble.x}%; top: {bubble.y}%; width: {bubble.size}px; height: {bubble.size}px; color: {bubble.color}; transform: rotate({bubble.rotation}deg);"
      >
        S
      </div>
    {/each}
  </div>
  
  <!-- Header -->
  <header class="glass-panel header">
    <h1>Vice Run</h1>
  </header>
  
  <!-- Current Activity Panel -->
  <section class="glass-panel activity-panel">
    <div class="metrics">
      <div class="metric">
        <div class="metric-value">{formatTime(elapsedTime)}</div>
        <div class="metric-label">Время</div>
      </div>
      <div class="metric">
        <div class="metric-value">{distance.toFixed(2)} <span class="unit">км</span></div>
        <div class="metric-label">Дистанция</div>
      </div>
      <div class="metric">
        <div class="metric-value">{pace.toFixed(2)} <span class="unit">мин/км</span></div>
        <div class="metric-label">Темп</div>
      </div>
    </div>
    
    <!-- Control Button -->
    <button class="control-button glass-button" class:active={isRunning} on:click={toggleTimer}>
      {isRunning ? 'Стоп' : 'Старт'}
    </button>
    
    <!-- Reset Button -->
    <button class="reset-button" on:click={resetActivity}>Сброс</button>
  </section>
  
  <!-- Training History -->
  <section class="glass-panel history-panel">
    <h2>История тренировок</h2>
    {#if trainings.length > 0}
      <ul class="training-list">
        {#each trainings as training (training.id)}
          <li class="training-item">
            <div class="training-date">{training.date}</div>
            <div class="training-metrics">
              <span class="metric-small">{formatTime(training.duration)}</span>
              <span class="metric-small">{training.distance.toFixed(2)} км</span>
              <span class="metric-small">{training.pace.toFixed(2)} мин/км</span>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="no-trainings">Нет завершенных тренировок</p>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #000000 0%, #41B6E6 50%, #db3eb1 100%);
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    color: #FFFFFF;
    overflow-x: hidden;
    position: relative;
  }
  
  :global(#app) {
    max-width: 100%;
    margin: 0 auto;
    padding: 0;
    position: relative;
    z-index: 20;
  }
  
  /* Bubbles background */
  .bubbles-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }
  
  .bubble {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: calc(1em + 2vw); /* Increased font size for better visibility */
    opacity: 0.7;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
    z-index: -1; /* Ensure bubbles are behind all other elements */
  }
  
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    z-index: 10;
  }
  
  /* Glass panel effect - adjusted transparency */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 15;
  }
  
  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  /* Header */
  .header {
    text-align: center;
    padding: 15px;
  }
  
  .header h1 {
    margin: 0;
    font-size: 2rem;
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* Activity Panel */
  .activity-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }
  
  .metrics {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  
  .metric {
    text-align: center;
  }
  
  .metric-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .unit {
    font-size: 1rem;
  }
  
  .metric-label {
    font-size: 1rem;
    opacity: 0.8;
  }
  
  /* Control Button */
  .control-button {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: white;
    background: linear-gradient(135deg, #41B6E6, #db3eb1);
    box-shadow: 0 4px 20px rgba(65, 182, 230, 0.4);
    transition: all 0.3s ease;
  }
  
  .control-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 25px rgba(65, 182, 230, 0.6);
  }
  
  .control-button:active {
    transform: scale(0.95);
  }
  
  /* Reset Button */
  .reset-button {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
  }
  
  .reset-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* History Panel */
  .history-panel h2 {
    margin-top: 0;
    text-align: center;
    background: linear-gradient(90deg, #41B6E6, #db3eb1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .training-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .training-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .training-item:last-child {
    border-bottom: none;
  }
  
  .training-date {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .training-metrics {
    display: flex;
    gap: 15px;
  }
  
  .metric-small {
    font-size: 0.9rem;
    min-width: 80px;
    text-align: center;
  }
  
  .no-trainings {
    text-align: center;
    opacity: 0.7;
    padding: 20px;
  }
  
  /* Responsive design */
  @media (max-width: 600px) {
    main {
      padding: 10px;
    }
    
    .metrics {
      flex-direction: column;
      gap: 15px;
    }
    
    .metric-value {
      font-size: 2rem;
    }
    
    .control-button {
      width: 100px;
      height: 100px;
    }
  }
</style>