<script>
	import { tabBarVisible } from '../lib/tabBarStore.js';
	
	// Event dispatcher for communicating with parent components
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	// Function to handle central button click - now navigates to exercises
	function onCentralButtonClick() {
		dispatch('tabChanged', { tab: 'exercises' });
	}
	
	// Functions to handle each tab click with specific values
	function onHomeClick() {
		dispatch('tabChanged', { tab: 'home' });
	}
	
	function onProfileClick() {
		dispatch('tabChanged', { tab: 'profile' });
	}
	
	// Function to navigate to health page
	function onHealthClick() {
		dispatch('tabChanged', { tab: 'health' });
	}
	
	// Function to navigate to exercises page
	function onExercisesClick() {
		dispatch('tabChanged', { tab: 'exercises' });
	}
	
	// Function to navigate to Bluetooth devices
	function onDevicesClick() {
		dispatch('tabChanged', { tab: 'bluetooth' });
	}
	
	// Updated function to navigate to profile instead of settings
	function onSettingsClick() {
		dispatch('tabChanged', { tab: 'profile' });
	}
	
	// Function to navigate to hot reload demo - REMOVED
	// function onHotReloadDemoClick() {
	// 	dispatch('tabChanged', { tab: 'hot-reload-demo' });
	// }
</script>

{#if $tabBarVisible}
	<div class="tab-bar">
		<div class="tab-group left">
			<div class="tab-item" on:click={onHomeClick}>
				<div class="tab-icon">
					<!-- Home icon -->
					<img src="/icons/home.png" alt="Home" class="image-icon" />
				</div>
				<span class="tab-label">Статистика</span>
			</div>
			<div class="tab-item" on:click={onHealthClick}>
				<div class="tab-icon">
					<!-- Health icon -->
					<img src="/icons/health.png" alt="Health" class="image-icon health-icon" />
				</div>
				<span class="tab-label">Здоровье</span>
			</div>
		</div>
		
		<!-- Central cutout button - now navigates to exercises -->
		<div class="central-button-container" on:click={onCentralButtonClick}>
			<div class="central-button-cutout"></div>
			<div class="central-button">
				<div class="central-tab-icon">
					<!-- Central icon - independent from other icons -->
					<img src="/icons/central.png" alt="Exercises" class="central-image-icon" />
				</div>
			</div>
		</div>
		
		<div class="tab-group right">
			<!-- Bluetooth devices tab -->
			<div class="tab-item" on:click={onDevicesClick}>
				<div class="tab-icon">
					<!-- Devices icon -->
					<img src="/icons/Smarts.png" alt="Bluetooth Devices" class="image-icon devices-icon" />
				</div>
				<span class="tab-label">Устройства</span>
			</div>
			<!-- Updated tab to navigate to profile instead of settings -->
			<div class="tab-item" on:click={onSettingsClick}>
				<div class="tab-icon">
					<!-- Settings icon repurposed for Profile -->
					<img src="/icons/Profile.png" alt="Profile" class="image-icon profile-icon" />
				</div>
				<span class="tab-label">Профиль</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.tab-bar {
		position: fixed;
		bottom: 2rem; /* Поднять от нижнего края экрана */
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
		z-index: 1000; /* Ensure TabBar is above all content */
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
	
	/* Independent central icon styling - increased to 48x48 pixels */
	.central-tab-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.central-image-icon {
		width: 48px;
		height: 48px;
		object-fit: contain;
	}
	
	/* Central button container - adjusted to accommodate larger icon */
	.central-button-container {
		position: absolute;
		top: -32px; /* Adjusted position for larger button */
		left: 50%;
		transform: translateX(-50%);
		width: 94px; /* Increased size to accommodate 48px icon */
		height: 94px; /* Increased size to accommodate 48px icon */
		z-index: 1001; /* Ensure central button is above TabBar */
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
		width: 84px; /* Increased size to accommodate 48px icon */
		height: 84px; /* Increased size to accommodate 48px icon */
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
	
	/* Adjust spacing for other tab items to accommodate larger central button */
	.tab-group.left {
		margin-right: 47px; /* Half of increased central button width */
	}
	
	.tab-group.right {
		margin-left: 47px; /* Half of increased central button width */
	}
	
	/* Specific icon styling to ensure independence */
	.health-icon, .devices-icon, .profile-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}
</style>