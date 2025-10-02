<script>
  import { formatDate, formatDuration, formatDistance, getWorkoutTypeName } from '../lib/workoutUtils.js';

  // Props
  let { workout, onclick } = $props();
</script>

<div class="workout-card" onclick={onclick} role="button" tabindex="0">
  <div class="workout-header">
    <h3 class="workout-title">{getWorkoutTypeName(workout.type)}</h3>
    <span class="workout-date">{formatDate(workout.date)}</span>
  </div>
  
  <div class="workout-details">
    <div class="detail-item">
      <span class="detail-label">Время</span>
      <span class="detail-value">{formatDuration(workout.duration)}</span>
    </div>
    
    <div class="detail-item">
      <span class="detail-label">Расстояние</span>
      <span class="detail-value">{formatDistance(workout.distance)}</span>
    </div>
    
    <div class="detail-item">
      <span class="detail-label">Тип</span>
      <span class="detail-value">{getWorkoutTypeName(workout.type)}</span>
    </div>
  </div>
  
  <div class="workout-icon">
    {#if workout.type === 'running' || workout.type === 'treadmill'}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.82 18.5C13.82 19.8807 12.7007 21 11.32 21C9.93928 21 8.82 19.8807 8.82 18.5C8.82 17.1193 9.93928 16 11.32 16C12.7007 16 13.82 17.1193 13.82 18.5Z" stroke="white" stroke-width="1.5"/>
        <path d="M17.32 9C17.32 10.3807 16.2007 11.5 14.82 11.5C13.4393 11.5 12.32 10.3807 12.32 9C12.32 7.61929 13.4393 6.5 14.82 6.5C16.2007 6.5 17.32 7.61929 17.32 9Z" stroke="white" stroke-width="1.5"/>
        <path d="M6.82001 13C6.82001 14.3807 5.70072 15.5 4.32001 15.5C2.9393 15.5 1.82001 14.3807 1.82001 13C1.82001 11.6193 2.9393 10.5 4.32001 10.5C5.70072 10.5 6.82001 11.6193 6.82001 13Z" stroke="white" stroke-width="1.5"/>
        <path d="M15.32 16.5L19.32 12.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M15.32 7.5L19.32 11.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8.82001 16L4.82001 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8.82001 10L4.82001 14" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    {:else if workout.type === 'cycling'}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 20C6.65685 20 8 18.6569 8 17C8 15.3431 6.65685 14 5 14C3.34315 14 2 15.3431 2 17C2 18.6569 3.34315 20 5 20Z" stroke="white" stroke-width="1.5"/>
        <path d="M19 20C20.6569 20 22 18.6569 22 17C22 15.3431 20.6569 14 19 14C17.3431 14 16 15.3431 16 17C16 18.6569 17.3431 20 19 20Z" stroke="white" stroke-width="1.5"/>
        <path d="M12 19V16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8 17H16" stroke="white" stroke-width="1.5"/>
        <path d="M12 16L8 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 12L12 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 8H8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8 8V5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 12V5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    {:else if workout.type === 'walking' || workout.type === 'nordic_walking'}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5C13.1046 5 14 4.10457 14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3C10 4.10457 10.8954 5 12 5Z" stroke="white" stroke-width="1.5"/>
        <path d="M12 5V12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 12L8 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 12L16 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8 16L12 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 16L12 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8 16V20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M16 16V20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    {:else}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5"/>
        <path d="M12 8V12L15 15" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    {/if}
  </div>
</div>

<style>
  .workout-card {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .workout-card:hover {
    background: linear-gradient(135deg, #98002E, #F9A01B);
    transform: translateY(-2px);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }
  
  .workout-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.25rem;
    background: linear-gradient(90deg, #98002E, #F9A01B, #00BFFF, #FF1493);
  }

  .workout-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    align-items: center;
  }

  .workout-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .workout-date {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
  }

  .workout-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
  }

  .detail-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.1rem;
  }

  .detail-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: white;
  }

  .workout-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    width: fit-content;
    align-self: center;
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .workout-details {
      grid-template-columns: 1fr;
    }
    
    .workout-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
    
    .workout-date {
      align-self: flex-end;
    }
  }
</style>