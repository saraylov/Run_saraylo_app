<script>
	import { tabBarVisible } from '../lib/tabBarStore.js';
</script>

{#if $tabBarVisible}
	<div class="tab-bar">
		<div class="tab-item">
			<div class="tab-icon">
				<!-- Home icon -->
				<img src="/icons/home.png" alt="Home" class="image-icon" />
			</div>
			<span class="tab-label">Главная</span>
		</div>
		<div class="tab-item">
			<div class="tab-icon">
				<!-- Training icon -->
				<img src="/icons/run.png" alt="Training" class="image-icon" />
			</div>
			<span class="tab-label">Тренировки</span>
		</div>
		<div class="tab-item">
			<div class="tab-icon">
				<!-- Stats icon -->
				<img src="/icons/stats.png" alt="Stats" class="image-icon" />
			</div>
			<span class="tab-label">Статистика</span>
		</div>
		<div class="tab-item">
			<div class="tab-icon">
				<!-- Achievements icon -->
				<img src="/icons/achievements.png" alt="Achievements" class="image-icon" />
			</div>
			<span class="tab-label">Достижения</span>
		</div>
		<div class="tab-item">
			<div class="tab-icon">
				<!-- Settings icon -->
				<img src="/icons/settings.png" alt="Settings" class="image-icon" />
			</div>
			<span class="tab-label">Настройки</span>
		</div>
	</div>
{/if}

<style>
	.tab-bar {
		position: fixed;
		bottom: 1rem; /* Поднять от нижнего края экрана */
		left: 50%; /* Центрировать горизонтально */
		transform: translateX(-50%); /* Сдвинуть влево на половину ширины */
		width: 90%; /* Ширина панели */
		max-width: 31.25rem; /* Максимальная ширина 500px */
		height: 60px;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 1.5rem; /* Закругленные углы */
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 1000;
		box-shadow: 
			0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
			inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
			inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
			inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
		padding: 5px 0;
	}

	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 100%;
		cursor: pointer;
		transition: all 0.2s ease;
		color: rgba(255, 255, 255, 0.7);
	}

	.tab-item:hover {
		color: white;
		transform: translateY(-2px);
	}

	.tab-icon {
		width: 24px;
		height: 24px;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-label {
		font-size: 12px;
		font-weight: 500;
	}
	
	.image-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}
</style>