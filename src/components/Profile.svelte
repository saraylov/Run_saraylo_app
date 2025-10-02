<script>
  import { onMount } from 'svelte';
  import ProfileHeader from './Profile/ProfileHeader.svelte';
  import UserInfoSection from './Profile/UserInfoSection.svelte';
  import AssessmentResultsSection from './Profile/AssessmentResultsSection.svelte';
  import SettingsButton from './Profile/SettingsButton.svelte';
  import intensityZoneService from '../lib/intensityZoneService.js';
  import personalSpeedZoneService from '../lib/personalSpeedZoneService.js';
  import { formatNumber } from './Profile/profileUtils.js';

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
  
  // Assessment results data with zero values initially
  let assessmentResults = $state([
    {
      id: 1,
      date: "2023-06-10",
      type: "Оценочная тренировка",
      segments: [
        { name: 'Голубой', color: '#41B6E6', avgSpeed: 0, duration: 6 },
        { name: 'Салатовый', color: '#90EE90', avgSpeed: 0, duration: 5 },
        { name: 'Желтый', color: '#FFD700', avgSpeed: 0, duration: 5 },
        { name: 'Оранжевый', color: '#FFA500', avgSpeed: 0, duration: 3 },
        { name: 'Красный', color: '#FF0000', avgSpeed: 0, duration: 1 }
      ]
    },
    {
      id: 2,
      date: "2023-05-28",
      type: "Оценочная тренировка",
      segments: [
        { name: 'Голубой', color: '#41B6E6', avgSpeed: 0, duration: 6 },
        { name: 'Салатовый', color: '#90EE90', avgSpeed: 0, duration: 5 },
        { name: 'Желтый', color: '#FFD700', avgSpeed: 0, duration: 5 },
        { name: 'Оранжевый', color: '#FFA500', avgSpeed: 0, duration: 3 },
        { name: 'Красный', color: '#FF0000', avgSpeed: 0, duration: 1 }
      ]
    }
  ]);
  
  // Function to calculate days since join
  function daysSinceJoin() {
    const joinDate = new Date(user.join_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Load workout history when component mounts
  onMount(() => {
    // Empty function since we removed workout history functionality
  });
</script>

<ProfileHeader 
  title="Профиль" 
  showSettingsButton={true} 
  showHistoryButton={true} 
  {onSettings} 
  {onHistory} 
/>

<div class="profile-container">
  <!-- Combined User Info, Intensity Zones, and Assessment Results Section -->
  <div class="glass-panel user-info-intensity-assessment-panel">
    <UserInfoSection {user} {daysSinceJoin} />
    
    <AssessmentResultsSection {assessmentResults} />
  </div>
  
  <SettingsButton {onSettings} />
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
  
  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .profile-container {
      padding: 1rem 0;
      gap: 1rem;
    }
    
    .glass-panel {
      padding: 1.25rem;
    }
    
    .user-info-intensity-assessment-panel {
      padding: 1.25rem;
    }
  }
  
  @media (max-width: 30rem) { /* 480px */
    .profile-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }
    
    .user-info-intensity-assessment-panel {
      padding: 1rem;
    }
  }
</style>