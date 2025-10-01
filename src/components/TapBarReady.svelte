<script>
  // Event dispatcher for communicating with parent components
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Props using Svelte 5 runes
  let { workoutSelected = null } = $props();
  
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
  
  // Function to handle start training with visual feedback
  let isPressing = $state(false);
  let pressProgress = $state(0);
  let pressTimer = null;
  
  // Function to handle press start for instant activation (no long press)
  function handlePressStart() {
    if (isPressing || !workoutSelected) return;
    
    isPressing = true;
    pressProgress = 0;
    
    // Clear any existing timer
    if (pressTimer) {
      clearTimeout(pressTimer);
    }
    
    // Instant activation - trigger start training immediately
    pressTimer = setTimeout(() => {
      isPressing = false;
      pressProgress = 1;
      dispatch('startTraining');
    }, 100); // Very short delay for instant response
  }
  
  // Function to handle press end/cancel
  function handlePressEnd() {
    if (!isPressing) return;
    
    isPressing = false;
    
    // Clear timer
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    
    pressProgress = 0;
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
	
	<!-- Central cutout button - starts training with instant activation -->
	<div 
    class="central-button-container-ready" 
    class:inactive={!workoutSelected} 
    class:active={!!workoutSelected}
    class:pressing={isPressing}
    on:pointerdown={handlePressStart}
    on:pointerup={handlePressEnd}
    on:pointerleave={handlePressEnd}
    on:touchstart|preventDefault={handlePressStart}
    on:touchend={handlePressEnd}
  >
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
				stroke-dashoffset={283 * (1 - pressProgress)}
				transform="rotate(-90 50 50)"
				style="transition: stroke-dashoffset 0.05s linear;"
			></circle>
		</svg>
		<div class="central-button-cutout-ready"></div>
		<div class="central-button-ready">
			<!-- Replaced icon with "Ready" text -->
			<span class="ready-text">Ready</span>
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