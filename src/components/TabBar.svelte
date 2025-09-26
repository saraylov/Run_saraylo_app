<script>
	import { tabBarVisible } from '../lib/tabBarStore.js';
	
	// Event dispatcher for communicating with parent components
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	// Function to handle central button click
	function onCentralButtonClick() {
		dispatch('centralButtonClicked');
	}
</script>

{#if $tabBarVisible}
	<div class="tab-bar">
		<div class="tab-group left">
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
		</div>
		
		<!-- Central cutout button -->
		<div class="central-button-container" on:click={onCentralButtonClick}>
			<div class="central-button-cutout"></div>
			<div class="central-button">
				<div class="tab-icon">
					<!-- Central icon -->
					<img src="/icons/central.png" alt="Central" class="image-icon" />
				</div>
			</div>
		</div>
		
		<div class="tab-group right">
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
		justify-content: space-between;
		align-items: center;
		z-index: 1000;
		box-shadow: 
			0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
			inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
			inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
			inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
		padding: 5px 20px;
	}
	
	.tab-group {
		display: flex;
		flex: 1;
		justify-content: space-around;
	}
	
	.tab-group.left {
		margin-right: 35px; /* Half of central button width */
	}
	
	.tab-group.right {
		margin-left: 35px; /* Half of central button width */
	}
	
	/* Adjust tab items to make space for central button */
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
		min-width: 50px;
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
	
	/* Central button container */
	.central-button-container {
		position: absolute;
		top: -25px; /* Position above the TabBar */
		left: 50%;
		transform: translateX(-50%);
		width: 70px;
		height: 70px;
		z-index: 1001;
		cursor: pointer;
	}
	
	/* Cutout effect - creates the illusion of a hole in the TabBar */
	.central-button-cutout {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.2);
		box-shadow: 
			inset 0 0 0 5px rgba(255, 255, 255, 0.1),
			inset 0 0 10px rgba(0, 0, 0, 0.3),
			0 0 0 2px rgba(255, 255, 255, 0.1);
		z-index: 1;
	}
	
	/* Central button - slightly smaller than cutout to create gap */
	.central-button {
		position: absolute;
		top: 5px; /* 5px gap from cutout */
		left: 5px;
		width: 60px; /* 10px smaller than cutout */
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, #41B6E6, #db3eb1);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 
			0 4px 10px rgba(0, 0, 0, 0.3),
			inset 0 2px 2px rgba(255, 255, 255, 0.3);
	}
	
	.central-button:hover {
		transform: translateY(-2px);
		box-shadow: 
			0 6px 15px rgba(0, 0, 0, 0.4),
			inset 0 2px 2px rgba(255, 255, 255, 0.4);
	}
	
	.central-button:active {
		transform: translateY(1px);
		box-shadow: 
			0 2px 5px rgba(0, 0, 0, 0.2),
			inset 0 2px 2px rgba(255, 255, 255, 0.2);
	}
</style>