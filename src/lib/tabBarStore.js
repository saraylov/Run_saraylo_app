import { writable } from 'svelte/store';

// Create a writable store for TabBar visibility
export const tabBarVisible = writable(false);

// Function to show the TabBar
export function showTabBar() {
	tabBarVisible.set(true);
}

// Function to hide the TabBar
export function hideTabBar() {
	tabBarVisible.set(false);
}

// Function to toggle TabBar visibility
export function toggleTabBar() {
	tabBarVisible.update(visible => !visible);
}