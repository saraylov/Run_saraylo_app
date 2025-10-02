<script>
  // Props using Svelte 5 runes
  const { user, daysSinceJoin } = $props();
</script>

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

<style>
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
  
  /* Responsive design */
  @media (max-width: 30rem) { /* 480px */
    .user-avatar {
      width: 80px;
      height: 80px;
    }
    
    .user-name {
      font-size: 1.125rem;
    }
  }
</style>