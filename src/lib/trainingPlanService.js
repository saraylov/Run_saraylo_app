/**
 * Training Plan Service for creating and managing training plans based on personal speed zones
 */

import personalSpeedZoneService from './personalSpeedZoneService.js';

class TrainingPlanService {
  constructor() {
    this.TRAINING_PLAN_STORAGE_KEY = 'training_plans';
  }

  /**
   * Generate a personalized training plan based on personal speed zones
   * @returns {Object|null} Training plan or null if no speed zones available
   */
  generatePersonalizedTrainingPlan() {
    // Get personal speed zones
    const speedZones = personalSpeedZoneService.getPersonalSpeedZones();
    if (!speedZones || !speedZones.zones) {
      return null;
    }

    // Create training plan based on speed zones
    const trainingPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      zones: {},
      weeklyPlan: this._generateWeeklyPlan(speedZones.zones),
      tips: this._generateTrainingTips()
    };

    // Add zone information to the plan
    Object.entries(speedZones.zones).forEach(([zoneKey, zone]) => {
      trainingPlan.zones[zoneKey] = {
        name: zone.name,
        color: zone.color,
        averageSpeed: zone.averageSpeed,
        minSpeed: zone.minSpeed,
        maxSpeed: zone.maxSpeed,
        effortRange: zone.effortRange,
        percentage: zone.percentage,
        duration: zone.duration
      };
    });

    return trainingPlan;
  }

  /**
   * Generate a weekly training plan based on speed zones
   * @param {Object} zones - Personal speed zones
   * @returns {Array} Weekly training plan
   */
  _generateWeeklyPlan(zones) {
    const weeklyPlan = [];
    
    // Monday - Easy run (Blue zone)
    weeklyPlan.push({
      day: 'Понедельник',
      workout: 'Легкая пробежка',
      zone: 'blue',
      duration: '30-45 минут',
      intensity: 'Легкая',
      description: 'Активное восстановление, длительная легкая пробежка',
      targetSpeed: `${zones.blue.minSpeed.toFixed(1)}-${zones.blue.maxSpeed.toFixed(1)} км/ч`
    });
    
    // Tuesday - Tempo run (Green zone)
    weeklyPlan.push({
      day: 'Вторник',
      workout: 'Темповая пробежка',
      zone: 'green',
      duration: '20-40 минут',
      intensity: 'Умеренная',
      description: 'Пробежка в зоне аэробного порога',
      targetSpeed: `${zones.green.minSpeed.toFixed(1)}-${zones.green.maxSpeed.toFixed(1)} км/ч`
    });
    
    // Wednesday - Recovery (Blue zone)
    weeklyPlan.push({
      day: 'Среда',
      workout: 'Восстановительная тренировка',
      zone: 'blue',
      duration: '20-30 минут',
      intensity: 'Легкая',
      description: 'Легкая пробежка или ходьба для восстановления',
      targetSpeed: `${zones.blue.minSpeed.toFixed(1)}-${zones.blue.maxSpeed.toFixed(1)} км/ч`
    });
    
    // Thursday - Interval training (Yellow/Orange zones)
    weeklyPlan.push({
      day: 'Четверг',
      workout: 'Интервальная тренировка',
      zone: 'yellow/orange',
      duration: '20-30 минут',
      intensity: 'Средневысокая/Высокая',
      description: 'Чередование интервалов в желтой и оранжевой зонах',
      targetSpeed: `${zones.yellow.minSpeed.toFixed(1)}-${zones.orange.maxSpeed.toFixed(1)} км/ч`
    });
    
    // Friday - Rest or easy activity
    weeklyPlan.push({
      day: 'Пятница',
      workout: 'Отдых или легкая активность',
      zone: 'rest',
      duration: 'По желанию',
      intensity: 'Очень легкая',
      description: 'Полный отдых или легкая прогулка',
      targetSpeed: 'Любая комфортная скорость'
    });
    
    // Saturday - Long run (Green/Blue zones)
    weeklyPlan.push({
      day: 'Суббота',
      workout: 'Длительная пробежка',
      zone: 'green/blue',
      duration: '45-90 минут',
      intensity: 'Умеренная/Легкая',
      description: 'Длительная аэробная тренировка',
      targetSpeed: `${zones.blue.minSpeed.toFixed(1)}-${zones.green.maxSpeed.toFixed(1)} км/ч`
    });
    
    // Sunday - Race pace or easy run (Varies)
    weeklyPlan.push({
      day: 'Воскресенье',
      workout: 'Пробежка в темпе соревнования или легкая',
      zone: 'varies',
      duration: '20-60 минут',
      intensity: 'Разная',
      description: 'Тренировка в соревновательном темпе или легкая пробежка',
      targetSpeed: 'Соревновательный темп или комфортная скорость'
    });
    
    return weeklyPlan;
  }

  /**
   * Generate training tips based on speed zones
   * @returns {Array} Training tips
   */
  _generateTrainingTips() {
    return [
      'Начинайте каждую тренировку с 5-10 минут разминки в синей зоне',
      'Заканчивайте тренировку 5-10 минут заминкой в синей или зеленой зоне',
      'Чередуйте разные зоны в течение недели для сбалансированной подготовки',
      'Регулярно проходите оценочные тренировки для обновления зон',
      'Слушайте свое тело - скоростные зоны являются ориентировочными',
      'Увеличивайте нагрузку постепенно, не более 10% в неделю',
      'Включайте силовые тренировки 2-3 раза в неделю для улучшения формы'
    ];
  }

  /**
   * Save training plan to localStorage
   * @param {Object} trainingPlan - Training plan to save
   * @returns {boolean} True if saved successfully, false otherwise
   */
  saveTrainingPlan(trainingPlan) {
    try {
      const plans = this.getTrainingPlans();
      plans.push(trainingPlan);
      
      // Keep only the last 10 training plans
      if (plans.length > 10) {
        plans.shift();
      }
      
      localStorage.setItem(this.TRAINING_PLAN_STORAGE_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Failed to save training plan:', error);
      return false;
    }
  }

  /**
   * Get all training plans from localStorage
   * @returns {Array} Array of training plans
   */
  getTrainingPlans() {
    try {
      const storedPlans = localStorage.getItem(this.TRAINING_PLAN_STORAGE_KEY);
      return storedPlans ? JSON.parse(storedPlans) : [];
    } catch (error) {
      console.error('Failed to get training plans:', error);
      return [];
    }
  }

  /**
   * Get the most recent training plan
   * @returns {Object|null} Most recent training plan or null if none exist
   */
  getMostRecentTrainingPlan() {
    const plans = this.getTrainingPlans();
    if (plans.length === 0) return null;
    
    // Sort by creation date (newest first)
    plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return plans[0];
  }

  /**
   * Clear all training plans from localStorage
   */
  clearTrainingPlans() {
    try {
      localStorage.removeItem(this.TRAINING_PLAN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear training plans:', error);
    }
  }

  /**
   * Get target speed for a specific percentage of personal speed
   * @param {string} zoneName - Zone name (blue, green, yellow, orange, red)
   * @param {number} percentage - Percentage of personal speed (e.g., 90 for 90%)
   * @returns {number|null} Target speed or null if zone not found
   */
  getTargetSpeedForTraining(zoneName, percentage) {
    return personalSpeedZoneService.getTargetSpeedForZone(zoneName, percentage);
  }
}

// Export singleton instance
const trainingPlanService = new TrainingPlanService();
export default trainingPlanService;