/**
 * Speed Zone Validation Service for ensuring data integrity and preventing tampering
 */

class SpeedZoneValidationService {
  constructor() {
    this.ASSESSMENT_WORKOUT_TYPES = [
      'assessment_run',
      'assessment_treadmill',
      'assessment_cycling',
      'assessment_walking',
      'assessment_nordic'
    ];
    
    this.REQUIRED_SEGMENT_COUNT = 5;
    
    this.SEGMENT_DURATION_REQUIREMENTS = {
      blue: 6,    // Голубой - 6 минут
      green: 5,   // Салатовый - 5 минут
      yellow: 5,  // Желтый - 5 минут
      orange: 3,  // Оранжевый - 3 минуты
      red: 1      // Красный - 1 минута
    };
  }

  /**
   * Validate that workout data comes from an assessment workout
   * @param {string} workoutId - Workout ID to validate
   * @returns {boolean} True if valid assessment workout, false otherwise
   */
  validateAssessmentWorkout(workoutId) {
    return this.ASSESSMENT_WORKOUT_TYPES.includes(workoutId);
  }

  /**
   * Validate segment data structure and content
   * @param {Array} segments - Array of workout segments
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateSegments(segments) {
    const result = {
      isValid: true,
      errors: []
    };

    // Check if segments exist and are an array
    if (!segments || !Array.isArray(segments)) {
      result.isValid = false;
      result.errors.push('Сегменты должны быть представлены в виде массива');
      return result;
    }

    // Check segment count
    if (segments.length !== this.REQUIRED_SEGMENT_COUNT) {
      result.isValid = false;
      result.errors.push(`Требуется ${this.REQUIRED_SEGMENT_COUNT} сегментов, получено ${segments.length}`);
    }

    // Validate each segment
    segments.forEach((segment, index) => {
      // Check required fields
      if (!segment.hasOwnProperty('name')) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: отсутствует название`);
      }
      
      if (!segment.hasOwnProperty('color')) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: отсутствует цвет`);
      }
      
      if (!segment.hasOwnProperty('avgSpeed')) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: отсутствует средняя скорость`);
      }
      
      if (!segment.hasOwnProperty('duration')) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: отсутствует длительность`);
      }
      
      // Validate data types
      if (segment.avgSpeed && typeof segment.avgSpeed !== 'number') {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: средняя скорость должна быть числом`);
      }
      
      if (segment.duration && typeof segment.duration !== 'number') {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: длительность должна быть числом`);
      }
      
      // Validate positive values
      if (segment.avgSpeed <= 0) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: средняя скорость должна быть положительным числом`);
      }
      
      if (segment.duration <= 0) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: длительность должна быть положительным числом`);
      }
      
      // Validate specific segment durations for assessment workouts
      const expectedDurations = Object.values(this.SEGMENT_DURATION_REQUIREMENTS);
      if (expectedDurations[index] && segment.duration !== expectedDurations[index]) {
        result.isValid = false;
        result.errors.push(`Сегмент ${index + 1}: ожидаемая длительность ${expectedDurations[index]} минут, получено ${segment.duration} минут`);
      }
    });

    return result;
  }

  /**
   * Validate that speed zone data has not been tampered with
   * @param {Object} zonesData - Speed zones data to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateSpeedZonesIntegrity(zonesData) {
    // Check if zones data exists
    if (!zonesData) {
      return false;
    }

    // Check if required fields exist
    if (!zonesData.zones || !zonesData.timestamp || !zonesData.version) {
      return false;
    }

    // Check if zones object has correct structure
    const requiredZones = ['blue', 'green', 'yellow', 'orange', 'red'];
    for (const zoneKey of requiredZones) {
      if (!zonesData.zones[zoneKey]) {
        return false;
      }
      
      const zone = zonesData.zones[zoneKey];
      if (!zone.name || !zone.color || !zone.averageSpeed || !zone.duration) {
        return false;
      }
    }

    // Check if timestamp is reasonable (not in the future)
    const now = Date.now();
    if (zonesData.timestamp > now + 60000) { // Allow 1 minute tolerance
      return false;
    }

    // Check if version is valid
    if (zonesData.version !== 1) {
      return false;
    }

    return true;
  }

  /**
   * Validate that all speed values are within reasonable ranges
   * @param {Object} zonesData - Speed zones data to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateSpeedRanges(zonesData) {
    const result = {
      isValid: true,
      errors: []
    };

    if (!zonesData || !zonesData.zones) {
      result.isValid = false;
      result.errors.push('Некорректные данные зон');
      return result;
    }

    // Validate each zone's speed values
    Object.entries(zonesData.zones).forEach(([zoneKey, zone]) => {
      // Check if average speed is reasonable (between 0.1 and 50 km/h)
      if (zone.averageSpeed < 0.1 || zone.averageSpeed > 50) {
        result.isValid = false;
        result.errors.push(`${zone.name}: средняя скорость (${zone.averageSpeed} км/ч) вне допустимого диапазона (0.1-50 км/ч)`);
      }
      
      // Check if min/max speeds are consistent with average
      if (zone.minSpeed && zone.maxSpeed) {
        if (zone.minSpeed > zone.averageSpeed || zone.maxSpeed < zone.averageSpeed) {
          result.isValid = false;
          result.errors.push(`${zone.name}: диапазон скоростей несовместим со средней скоростью`);
        }
        
        if (zone.minSpeed > zone.maxSpeed) {
          result.isValid = false;
          result.errors.push(`${zone.name}: минимальная скорость больше максимальной`);
        }
      }
    });

    return result;
  }

  /**
   * Perform comprehensive validation of speed zone data
   * @param {Object} zonesData - Speed zones data to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateSpeedZones(zonesData) {
    const result = {
      isValid: true,
      errors: []
    };

    // Validate data integrity
    if (!this.validateSpeedZonesIntegrity(zonesData)) {
      result.isValid = false;
      result.errors.push('Нарушена целостность данных скоростных зон');
    }

    // Validate speed ranges
    const speedValidation = this.validateSpeedRanges(zonesData);
    if (!speedValidation.isValid) {
      result.isValid = false;
      result.errors = result.errors.concat(speedValidation.errors);
    }

    return result;
  }
}

// Export singleton instance
const speedZoneValidationService = new SpeedZoneValidationService();
export default speedZoneValidationService;