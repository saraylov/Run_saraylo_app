<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte'; // Import the Header component
  import intensityZoneService from '../lib/intensityZoneService.js'; // Import the Intensity Zone Service

  // Props using Svelte 5 runes
  const { user, onBack, onSettings, onHistory } = $props();

  // Stats data
  let stats = $state({
    daily_average: 8500,
    weekly_total: 59500,
    monthly_total: 255000,
    best_day: 15230
  });
  
  // Recent activity data
  let recentActivity = $state([
    { date: "2023-06-15", steps: 10230, duration: "45 мин" },
    { date: "2023-06-14", steps: 8750, duration: "38 мин" },
    { date: "2023-06-13", steps: 12540, duration: "52 мин" },
    { date: "2023-06-12", steps: 7620, duration: "35 мин" },
    { date: "2023-06-11", steps: 15230, duration: "68 мин" }
  ]);
  
  // Assessment results data
  let assessmentResults = $state([
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
  ]);
  
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
</script>

<Header title="Профиль" showSettingsButton={true} showHistoryButton={true} onSettings={onSettings} onHistory={onHistory} />

<div class="profile-container">
  <!-- Combined User Info, Intensity Zones, and Assessment Results Section -->
  <div class="glass-panel user-info-intensity-assessment-panel">
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
    
    <!-- Assessment Results Section -->
    <div class="assessment-results-section">
      <h3 class="panel-title">Последние результаты оценочной тренировки</h3>
      {#if assessmentResults && assessmentResults.length > 0}
        <!-- Отображаем только последние результаты -->
        <div class="color-panels-container">
          {#each assessmentResults[0].segments as segment, i}
            <div class="color-panel" style="background-color: {segment.color};" title="{segment.name}: {segment.avgSpeed} км/ч">
              <div class="panel-content">
                <div class="segment-speed">{segment.avgSpeed} км/ч</div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-assessment-message">
          <p>Пройдите оценочную тренировку для отображения результатов</p>
        </div>
      {/if}
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
  
  /* Combined User Info, Intensity Zones, and Assessment Results Panel */
  .user-info-intensity-assessment-panel {
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
  
  .assessment-results-section {
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
  
  .segment-speed {
    font-size: 0.6rem;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
  
  .no-assessment-message {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    padding: 1rem;
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
    z-index: 5;
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