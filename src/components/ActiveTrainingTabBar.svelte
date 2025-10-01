<script>
	// Event dispatcher for communicating with parent components
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	// State to track if training is paused
	let isPaused = false;
	
	// Long press state for finish button
	let pressTimer = null;
	let pressProgress = 0;
	let isPressing = false;
	
	
	// Function to handle pause/resume button click
	function onPauseClick() {
		isPaused = !isPaused;
		dispatch('pauseTraining');
	}
	
	// Function to handle finish button click
	function onFinishClick() {
		dispatch('finishTraining');
	}
	
	// Long press handlers for finish button
	function handleFinishPressStart() {
		if (isPressing) return;
		
		isPressing = true;
		pressProgress = 0;
		
		// Clear any existing timer
		if (pressTimer) {
			clearInterval(pressTimer);
		}
		
		// Start the 2-second timer
		const startTime = Date.now();
		pressTimer = setInterval(() => {
			const elapsed = Date.now() - startTime;
			pressProgress = Math.min(elapsed / 2000, 1); // 2 seconds to complete
			
			if (pressProgress >= 1) {
				clearInterval(pressTimer);
				isPressing = false;
				pressProgress = 0;
				onFinishClick(); // Trigger the finish action
			}
		}, 10);
	}
	
	function handleFinishPressEnd() {
		if (!isPressing) return;
		
		clearInterval(pressTimer);
		isPressing = false;
		pressProgress = 0;
	}
</script>

<!-- Active Training TabBar with Pause/Resume and Finish buttons -->
<div class="tab-bar">
	<div class="tab-group left">
		{#if !isPaused}
			<!-- Pause button -->
			<div class="tab-item pause-item" on:click={onPauseClick}>
				<div class="tab-icon">
					<!-- Pause icon -->
					<img src="./icons/pause.png" alt="Pause" class="image-icon" />
				</div>
				<span class="tab-label">Пауза</span>
			</div>
		{:else}
			<!-- Resume button -->
			<div class="tab-item resume-item" on:click={onPauseClick}>
				<div class="tab-icon">
					<!-- Play icon for resume -->
					<img src="./icons/play.png" alt="Resume" class="image-icon" />
				</div>
				<span class="tab-label">Продолжить</span>
			</div>
		{/if}
	</div>
	
	<div class="tab-group right">
		<div class="tab-item finish-item" 
		     on:mousedown={handleFinishPressStart}
		     on:mouseup={handleFinishPressEnd}
		     on:mouseleave={handleFinishPressEnd}
		     on:touchstart|preventDefault={handleFinishPressStart}
		     on:touchend={handleFinishPressEnd}>
			<!-- Progress bar overlay -->
			<div class="progress-overlay" style="clip-path: inset(0 {100 - pressProgress * 100}% 0 0);"></div>
			
			<div class="tab-icon">
				<!-- Finish icon -->
				<img src="./icons/stop.png" alt="Finish" class="image-icon" />
			</div>
			<span class="tab-label">Завершить</span>
		</div>
	</div>
</div>

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
		margin-right: 47px; /* Half of increased central button width */
	}
	
	.tab-group.right {
		margin-left: 47px; /* Half of increased central button width */
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
		position: relative; /* Needed for progress overlay */
		overflow: hidden; /* Contain the progress overlay */
	}
	
	.tab-item:hover {
		color: white;
		transform: translateY(-2px);
	}
	
	/* Progress overlay for long press visualization */
	.progress-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.2); /* Subtle progress indicator */
		z-index: -1; /* Behind the content */
		transition: clip-path 0.05s linear;
	}
	
	/* Special styling for pause button with more vibrant yellowish glass tint */
	.pause-item {
		background: rgba(249, 160, 27, 0.35); /* Even more vibrant Miami Heat yellow with higher opacity */
		border-radius: 1rem;
		padding: 0 0.5rem;
		margin: 0 0.25rem;
		border: 2px solid rgba(249, 160, 27, 0.7); /* Thicker and more vibrant Miami Heat yellow border */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: 
			0 0.3rem 1.2rem rgba(0, 0, 0, 0.3),
			inset 0 0 1rem rgba(249, 160, 27, 0.6),
			inset 0 -0.125rem 0.25rem rgba(249, 160, 27, 0.4),
			inset 0 0.125rem 0.25rem rgba(249, 160, 27, 0.5);
	}
	
	/* Special styling for resume button with more vibrant greenish glass tint */
	.resume-item {
		background: rgba(52, 199, 89, 0.35); /* Even more vibrant green with higher opacity */
		border-radius: 1rem;
		padding: 0 0.5rem;
		margin: 0 0.25rem;
		border: 2px solid rgba(52, 199, 89, 0.7); /* Thicker and more vibrant green border */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: 
			0 0.3rem 1.2rem rgba(0, 0, 0, 0.3),
			inset 0 0 1rem rgba(52, 199, 89, 0.6),
			inset 0 -0.125rem 0.25rem rgba(52, 199, 89, 0.4),
			inset 0 0.125rem 0.25rem rgba(52, 199, 89, 0.5);
	}
	
	/* Special styling for finish button with more vibrant reddish glass tint */
	.finish-item {
		background: rgba(152, 0, 46, 0.35); /* Even more vibrant Miami Heat red with higher opacity */
		border-radius: 1rem;
		padding: 0 0.5rem;
		margin: 0 0.25rem;
		border: 2px solid rgba(152, 0, 46, 0.7); /* Thicker and more vibrant Miami Heat red border */
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: 
			0 0.3rem 1.2rem rgba(0, 0, 0, 0.3),
			inset 0 0 1rem rgba(152, 0, 46, 0.6),
			inset 0 -0.125rem 0.25rem rgba(152, 0, 46, 0.4),
			inset 0 0.125rem 0.25rem rgba(152, 0, 46, 0.5);
		position: relative;
		overflow: hidden;
	}
	
	.tab-icon {
		width: 24px;
		height: 24px;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1; /* Above the progress overlay */
	}
	
	.tab-label {
		font-size: 12px;
		font-weight: 500;
		z-index: 1; /* Above the progress overlay */
	}
	
	.image-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
		z-index: 1; /* Above the progress overlay */
	}
	
	/* Specific icon styling */
	.image-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}
</style>