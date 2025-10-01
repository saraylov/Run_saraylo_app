import { writable } from 'svelte/store';

// Create a writable store for workout selection state
// Changed from boolean to object to store full workout data
export const workoutSelected = writable(null);

// Function to set workout selection state with full workout data
export function setWorkoutSelected(workoutData) {
	workoutSelected.set(workoutData);
}

// Function to reset workout selection state
export function resetWorkoutSelection() {
	workoutSelected.set(null);
}