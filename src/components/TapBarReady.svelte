<script>
  // Event dispatcher for communicating with parent components
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 runes
  let { workoutSelected = false } = $props();
  
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
  
  // Function to navigate to Bluetooth devices
  function onDevicesClick() {
    dispatch('tabChanged', { tab: 'bluetooth' });
  }
  
  // Updated function to navigate to profile instead of settings
  function onSettingsClick() {
    dispatch('tabChanged', { tab: 'profile' });
  }
</script>

<!-- TapBarReady - visual copy of TrainingTabBar -->
<div class="tab-bar-ready">
	<div class="tab-group-ready left">
		<div class="tab-item-ready" on:click={onHomeClick}>
			<div class="tab-icon-ready">
				<!-- Home icon -->
				<img src="/icons/home.png" alt="Home" class="image-icon-ready" />
			</div>
			<span class="tab-label-ready">Статистика</span>
		</div>
		<div class="tab-item-ready" on:click={onHealthClick}>
			<div class="tab-icon-ready">
				<!-- Health icon -->
				<img src="/icons/health.png" alt="Health" class="image-icon-ready health-icon-ready" />
			</div>
			<span class="tab-label-ready">Здоровье</span>
		</div>
	</div>
	
	<!-- Central cutout button - starts training with 2-second press visualization -->
	<div class="central-button-container-ready" class:inactive={!workoutSelected} class:active={workoutSelected}>
		<!-- Progress circle around central button -->
		<svg class="central-progress-circle-ready" viewBox="0 0 100 100">
			<circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="5"></circle>
			<circle 
				cx="50" 
				cy="50" 
				r="45" 
				fill="none" 
				stroke="#34C759" 
				stroke-width="5" 
				stroke-dasharray="283" 
				stroke-dashoffset="283" 
				transform="rotate(-90 50 50)"
				style="transition: stroke-dashoffset 0.05s linear;"
			></circle>
		</svg>
		<div class="central-button-cutout-ready"></div>
		<div class="central-button-ready">
			<div class="central-tab-icon-ready">
				<!-- Central icon - play icon for starting training -->
				<img src="/icons/play.png" alt="Start Training" class="central-image-icon-ready" />
			</div>
		</div>
	</div>
	
	<div class="tab-group-ready right">
		<!-- Bluetooth devices tab -->
		<div class="tab-item-ready" on:click={onDevicesClick}>
			<div class="tab-icon-ready">
				<!-- Devices icon -->
				<img src="/icons/Smarts.png" alt="Bluetooth Devices" class="image-icon-ready devices-icon-ready" />
			</div>
			<span class="tab-label-ready">Устройства</span>
		</div>
		<!-- Updated tab to navigate to profile instead of settings -->
		<div class="tab-item-ready" on:click={onSettingsClick}>
			<div class="tab-icon-ready">
				<!-- Settings icon repurposed for Profile -->
				<img src="/icons/Profile.png" alt="Profile" class="image-icon-ready profile-icon-ready" />
			</div>
			<span class="tab-label-ready">Профиль</span>
		</div>
	</div>
</div>

<style>
  @import '../styles/tapbarready.css';
</style>