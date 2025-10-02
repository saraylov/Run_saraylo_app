# Workout History Components

## Overview
This package contains components for displaying workout history with detailed modal views.

## Components

### WorkoutCard.svelte
A component that displays a single workout in a compact card format.

**Props:**
- `workout` (object): The workout data to display
- `onclick` (function): Function to call when the card is clicked

**Usage:**
```svelte
<WorkoutCard 
  workout={workoutData} 
  onclick={() => handleWorkoutClick(workoutData)} 
/>
```

### WorkoutDetailModal.svelte
A modal component that displays detailed information about a workout.

**Props:**
- `workout` (object): The workout data to display
- `isVisible` (boolean): Whether the modal is visible
- `workouts` (array): Array of all workouts for navigation

**Events:**
- `close`: Emitted when the modal should be closed
- `navigate`: Emitted when navigating to a different workout

**Usage:**
```svelte
<WorkoutDetailModal 
  workout={selectedWorkout} 
  isVisible={showModal} 
  workouts={allWorkouts}
  on:close={handleClose}
  on:navigate={handleNavigate}
/>
```

### HistoryPage.svelte
A complete page component that displays workout history and handles modal interactions.

**Props:**
- `onBack` (function): Function to call when the back button is clicked
- `onSettings` (function): Function to call when the settings button is clicked

**Usage:**
```svelte
<HistoryPage onBack={handleBack} onSettings={handleSettings} />
```

## Data Structure
The components expect workout data in the following format:

```javascript
{
  id: '1',
  type: 'running',
  date: '2025-09-15T08:30:00',
  duration: 1800, // seconds
  distance: 5.2, // kilometers
  avgSpeed: 10.4, // km/h
  maxSpeed: 15.2, // km/h
  avgPace: 300, // seconds per km
  maxPace: 240, // seconds per km
  calories: 320,
  steps: 4200,
  segments: [
    { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6, avgSpeed: 8.5 },
    // ... more segments
  ]
}
```

## Styling
All components use the Miami Heat color scheme:
- #98002E (Red)
- #F9A01B (Yellow)
- #00BFFF (Blue)
- #FF1493 (Pink)

Components are fully responsive and will adapt to different screen sizes.