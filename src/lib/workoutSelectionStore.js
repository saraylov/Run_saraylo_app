import { writable } from 'svelte/store';

// Create a writable store for workout selection state
export const workoutSelected = writable(false);

// Function to set workout selection state
export function setWorkoutSelected(selected) {
	workoutSelected.set(selected);
}

// Function to reset workout selection state
export function resetWorkoutSelection() {
	workoutSelected.set(false);
}