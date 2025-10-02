// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' в ' + date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format duration for display
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} мин ${secs} сек`;
}

// Format pace for display
export function formatPace(paceInSeconds) {
  const mins = Math.floor(paceInSeconds / 60);
  const secs = Math.floor(paceInSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')} /км`;
}

// Format speed for display
export function formatSpeed(speed) {
  return speed.toFixed(1) + ' км/ч';
}

// Format calories for display
export function formatCalories(calories) {
  // Handle both number and string inputs
  let caloriesValue = calories;
  if (typeof calories === 'string') {
    caloriesValue = parseInt(calories.replace(' kcal', '')) || 0;
  }
  return caloriesValue.toLocaleString() + ' ккал';
}

// Format steps for display
export function formatSteps(steps) {
  // Handle both number and string inputs
  let stepsValue = steps;
  if (typeof steps === 'string') {
    stepsValue = parseInt(steps.replace(/\s/g, '')) || 0;
  }
  return stepsValue.toLocaleString() + ' шагов';
}

// Format distance for display
export function formatDistance(distance) {
  // Handle both number and string inputs
  let distanceValue = distance;
  if (typeof distance === 'string') {
    distanceValue = parseFloat(distance.replace(' km', '')) || 0;
  }
  return distanceValue.toFixed(2) + ' км';
}

// Get workout type name
export function getWorkoutTypeName(type) {
  const typeMap = {
    'running': 'Бег',
    'treadmill': 'Бег на дорожке',
    'cycling': 'Велосипед',
    'walking': 'Ходьба',
    'nordic_walking': 'Скандинавская ходьба'
  };
  return typeMap[type] || type;
}