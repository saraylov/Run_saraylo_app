<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte'; // Import the Header component
  import intensityZoneService from '../lib/intensityZoneService.js'; // Import the Intensity Zone Service

  // User data - this would typically come from a store or API
  export let user = {
    id: 123456789,
    first_name: "Тестовый",
    last_name: "Пользователь",
    username: "testuser",
    avatar: "/images/default-avatar.png", // Default avatar
    join_date: "2023-01-15",
    total_steps: 125430,
    achievements: 15,
    level: 7
  };
  
  // Stats data
  let stats = {
    daily_average: 8500,
    weekly_total: 59500,
    monthly_total: 255000,
    best_day: 15230
  };
  
  // Recent activity data
  let recentActivity = [
    { date: "2023-06-15", steps: 10230, duration: "45 мин" },
    { date: "2023-06-14", steps: 8750, duration: "38 мин" },
    { date: "2023-06-13", steps: 12540, duration: "52 мин" },
    { date: "2023-06-12", steps: 7620, duration: "35 мин" },
    { date: "2023-06-11", steps: 15230, duration: "68 мин" }
  ];
  
  // Intensity zones data
  let intensityZones = null;
  let previousZones = null;
  
  // Assessment results data
  let assessmentResults = [
    {
      id: 1,
      date: "2023-06-10",
      type: "Оценочная тренировка",
      segments: [
        { name: 'Голубой', color: '#41B6E6', avgSpeed: 8.5, duration: 6 },
        { name: 'Салатовый', color: '#90EE90', avgSpeed: 10.2, duration: 5 },
        { name: 'Желтый', color: '#FFD700', avgSpeed: 12.8, duration: 5 },
        { name: 'Оранжевый', color: '#FFA500', avgSpeed: 14.5, duration: 3 },
        { name: 'Красный', color: '#FF0000', avgSpeed: 16.2, duration: 1 }
      ]
    },
    {
      id: 2,
      date: "2023-05-28",
      type: "Оценочная тренировка",
      segments: [
        { name: 'Голубой', color: '#41B6E6', avgSpeed: 7.8, duration: 6 },
        { name: 'Салатовый', color: '#90EE90', avgSpeed: 9.5, duration: 5 },
        { name: 'Желтый', color: '#FFD700', avgSpeed: 11.2, duration: 5 },
        { name: 'Оранжевый', color: '#FFA500', avgSpeed: 13.8, duration: 3 },
        { name: 'Красный', color: '#FF0000', avgSpeed: 15.1, duration: 1 }
      ]
    }
  ];
  
  // Function to format numbers with thousands separators
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  
  // Function to calculate days since join
  function daysSinceJoin() {
    const joinDate = new Date(user.join_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Function to go back to home
  export let onBack;
  
  // Function to handle settings navigation
  export let onSettings;
  
  // Function to handle history navigation
  export let onHistory;
  
  // Load intensity zones data on component mount
  onMount(() => {
    loadIntensityZones();
  });
  
  // Function to load intensity zones data
  function loadIntensityZones() {
    try {
      const zonesData = intensityZoneService.getZonesData();
      if (zonesData) {
        // For demonstration, we'll create a mock previous zones object
        // In a real implementation, you would load actual previous data
        previousZones = {
          zones: {
            blue: { averageSpeed: 7.8 },
            green: { averageSpeed: 9.5 },
            yellow: { averageSpeed: 11.2 },
            orange: { averageSpeed: 13.8 },
            red: { averageSpeed: 15.1 }
          }
        };
        
        intensityZones = zonesData;
      }
    } catch (error) {
      console.error('Failed to load intensity zones:', error);
    }
  }
</script>

<Header title="Профиль" showSettingsButton={true} showHistoryButton={true} onSettings={onSettings} onHistory={onHistory} />

<div class="profile-container">
  <!-- Combined User Info and Intensity Zones Section -->
  <div class="glass-panel user-info-intensity-panel">
    <!-- User Info Section -->
    <div class="user-info-section">
      <div class="user-avatar">
        <img src={user.avatar} alt="Аватар пользователя" />
      </div>
      <div class="user-details">
        <h2 class="user-name">{user.first_name} {user.last_name}</h2>
        <p class="username">@{user.username}</p>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{user.level}</span>
            <span class="stat-label">Уровень</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{user.achievements}</span>
            <span class="stat-label">Достижения</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{daysSinceJoin()}</span>
            <span class="stat-label">Дней</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Intensity Zones Section -->
    <div class="intensity-zones-section">
      <h3 class="panel-title">Мои зоны интенсивности</h3>
      {#if intensityZones}
        <div class="zones-container">
          {#each Object.entries(intensityZones.zones) as [key, zone]}
            <div class="zone-card" style="background-color: {zone.color};">
              <div class="zone-header">
                <span class="zone-name">{zone.name}</span>
                <span class="zone-percentage">{zone.percentage}</span>
              </div>
              <div class="zone-details">
                <div class="zone-speed-range">
                  {zone.speedRange.min.toFixed(1)} - {zone.speedRange.max.toFixed(1)} км/ч
                </div>
                <div class="zone-average-speed">
                  Средняя скорость: {zone.averageSpeed.toFixed(1)} км/ч
                </div>
                {#if previousZones && previousZones.zones[key]}
                  <div class="zone-comparison">
                    {#if zone.averageSpeed > previousZones.zones[key].averageSpeed}
                      <span class="improvement">↑ +{(zone.averageSpeed - previousZones.zones[key].averageSpeed).toFixed(1)} км/ч</span>
                    {:else if zone.averageSpeed < previousZones.zones[key].averageSpeed}
                      <span class="decline">↓ {(previousZones.zones[key].averageSpeed - zone.averageSpeed).toFixed(1)} км/ч</span>
                    {:else}
                      <span class="no-change">Без изменений</span>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-zones-message">
          <p>Пройдите оценочную тренировку для калибровки зон интенсивности</p>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Assessment Results Section -->
  <div class="glass-panel assessment-results-panel">
    <h3 class="panel-title">Результаты оценочных тренировок</h3>
    <div class="assessment-results-container">
      {#each assessmentResults as result, index}
        <div class="assessment-result-card">
          <div class="assessment-header">
            <span class="assessment-date">{result.date}</span>
            <span class="assessment-type">{result.type}</span>
          </div>
          <div class="color-panels-container">
            {#each result.segments as segment, i}
              <div class="color-panel" style="background-color: {segment.color};" title="{segment.name}: {segment.avgSpeed} км/ч">
                <div class="panel-content">
                  <div class="segment-name">{segment.name}</div>
                  <div class="segment-speed">{segment.avgSpeed} км/ч</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Settings Button -->
  <button class="settings-button" on:click={onSettings}>
    Настройки аккаунта
  </button>
</div>

<style>
  .profile-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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
  
  /* Combined User Info and Intensity Zones Panel */
  .user-info-intensity-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    z-index: 15;
    overflow: hidden;
  }
  
  .user-info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 1.5rem;
    border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.2);
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1rem;
    border: 0.125rem solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  }
  
  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
  }
  
  .username {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 300px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #41B6E6; /* Miami Blue */
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .intensity-zones-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Panel Titles */
  .panel-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.25rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }
  
  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .stat-card-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #db3eb1; /* Miami Pink */
    margin-bottom: 0.25rem;
  }
  
  .stat-card-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  /* Activity Panel */
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  /* Intensity Zones Panel */
  .intensity-zones-panel {
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
    z-index: 15;
    overflow: hidden;
  }
  
  .zones-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
  }
  
  .zone-card {
    border-radius: 0.75rem;
    padding: 0.75rem;
    text-align: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .zone-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .zone-name {
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .zone-percentage {
    font-size: 0.75rem;
    opacity: 0.9;
  }
  
  .zone-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.75rem;
  }
  
  .zone-speed-range {
    font-weight: 600;
  }
  
  .zone-average-speed {
    font-size: 0.7rem;
    opacity: 0.9;
  }
  
  .zone-comparison {
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }
  
  .improvement {
    color: #34C759; /* Green for improvement */
  }
  
  .decline {
    color: #FF3B30; /* Red for decline */
  }
  
  .no-change {
    color: #FFD700; /* Yellow for no change */
  }
  
  .no-zones-message {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem;
  }
  
  /* Assessment Results Panel */
  .assessment-results-panel {
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
    z-index: 15;
    overflow: hidden;
  }
  
  .assessment-results-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .assessment-result-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .assessment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .assessment-date {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .assessment-type {
    font-size: 0.875rem;
    font-weight: 600;
    color: #41B6E6; /* Miami Blue */
  }
  
  .color-panels-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .color-panel {
    border-radius: 0.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    color: white;
    font-weight: 600;
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  
  .color-panel:hover {
    transform: scale(1.05);
  }
  
  .panel-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 0.7rem;
  }
  
  .segment-name {
    font-size: 0.65rem;
    margin-bottom: 0.2rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .segment-speed {
    font-size: 0.6rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  }
  
  .activity-date {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    flex: 1;
  }
  
  .activity-steps {
    font-size: 1rem;
    font-weight: 500;
    color: white;
    flex: 2;
    text-align: center;
  }
  
  .activity-duration {
    font-size: 0.875rem;
    color: #41B6E6; /* Miami Blue */
    flex: 1;
    text-align: right;
  }
  
  /* Settings Button */
  .settings-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.75rem;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 
      0 0.25rem 0.75rem rgba(0, 0, 0, 0.15),
      inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 0.5rem;
    position: relative;
    z-index: 5; /* Positioned above bubbles (z-index: 1) but below glass panels (z-index: 15) */
  }
  
  .settings-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-0.125rem);
    box-shadow: 
      0 0.5rem 1rem rgba(0, 0, 0, 0.2),
      inset 0 0.0625rem 0.1875rem rgba(255, 255, 255, 0.3);
  }
  
  /* History Button */
  .history-button {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.25);
    border-radius: 0.75rem;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    box-shadow: 
      0 0.25rem 0.75rem rgba(0, 0, 0, 0.15),
      inset 0 0.0625rem 0.125rem rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    width: 100%;
    margin-top: 0.5rem;
    position: relative;
    z-index: 5; /* Positioned above bubbles (z-index: 1) but below glass panels (z-index: 15) */
  }
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .profile-container {
      padding: 1rem 0;
      gap: 1rem;
    }
    
    .glass-panel {
      padding: 1.25rem;
    }
    
    .user-info-intensity-panel {
      padding: 1.25rem;
    }
    
    .user-name {
      font-size: 1.25rem;
    }
    
    .stats-grid {
      gap: 0.75rem;
    }
    
    .stat-card {
      padding: 0.75rem;
    }
    
    .stat-card-value {
      font-size: 1.125rem;
    }
    
    .zones-container {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .color-panels-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 30rem) { /* 480px */
    .profile-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
    }
    
    .user-name {
      font-size: 1.125rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .activity-item {
      padding: 0.5rem;
    }
    
    .activity-steps {
      font-size: 0.875rem;
    }
    
    .user-info-intensity-panel {
      padding: 1rem;
    }
    
    .zones-container {
      grid-template-columns: 1fr;
    }
    
    .zone-card {
      padding: 0.5rem;
    }
    
    .color-panels-container {
      grid-template-columns: 1fr;
    }
    
    .color-panel {
      height: 50px;
    }
  }
</style>