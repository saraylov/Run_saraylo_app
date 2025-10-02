/**
 * Personal Speed Zone Service for handling personal speed zone calculations, storage, and validation
 */

import speedZoneValidationService from './speedZoneValidation.js';

class PersonalSpeedZoneService {
  constructor() {
    this.STORAGE_KEY = 'personal_speed_zones';
    this.ASSESSMENT_WORKOUT_TYPES = [
      'assessment_run',
      'assessment_treadmill',
      'assessment_cycling',
      'assessment_walking',
      'assessment_nordic'
    ];
  }

  /**
   * Calculate personal speed zones based on assessment training data
   * @param {Array} workoutSegments - Array of segments with average speeds from assessment workout
   * @returns {Object} Calculated personal speed zones
   */
  calculatePersonalSpeedZones(workoutSegments) {
    // Validate segment data
    const validation = speedZoneValidationService.validateSegments(workoutSegments);
    if (!validation.isValid) {
      throw new Error('Invalid segment data: ' + validation.errors.join(', '));
    }

    // Extract average speeds for each segment in order
    const segmentSpeeds = workoutSegments.map(segment => segment.avgSpeed || 0);

    // Create personal speed zones based on the five segments
    const zones = {
      blue: {
        name: 'Голубой',
        color: '#41B6E6',
        averageSpeed: segmentSpeeds[0], // Speed from first segment (blue)
        duration: workoutSegments[0].duration,
        percentage: '15-24%',
        effortRange: 'Легкая',
        minSpeed: segmentSpeeds[0] * 0.9,
        maxSpeed: segmentSpeeds[0] * 1.1
      },
      green: {
        name: 'Салатовый',
        color: '#90EE90',
        averageSpeed: segmentSpeeds[1], // Speed from second segment (green)
        duration: workoutSegments[1].duration,
        percentage: '25-44%',
        effortRange: 'Умеренная',
        minSpeed: segmentSpeeds[1] * 0.9,
        maxSpeed: segmentSpeeds[1] * 1.1
      },
      yellow: {
        name: 'Желтый',
        color: '#FFD700',
        averageSpeed: segmentSpeeds[2], // Speed from third segment (yellow)
        duration: workoutSegments[2].duration,
        percentage: '45-69%',
        effortRange: 'Средневысокая',
        minSpeed: segmentSpeeds[2] * 0.9,
        maxSpeed: segmentSpeeds[2] * 1.1
      },
      orange: {
        name: 'Оранжевый',
        color: '#FFA500',
        averageSpeed: segmentSpeeds[3], // Speed from fourth segment (orange)
        duration: workoutSegments[3].duration,
        percentage: '70-89%',
        effortRange: 'Высокая',
        minSpeed: segmentSpeeds[3] * 0.9,
        maxSpeed: segmentSpeeds[3] * 1.1
      },
      red: {
        name: 'Красный',
        color: '#FF0000',
        averageSpeed: segmentSpeeds[4], // Speed from fifth segment (red)
        duration: workoutSegments[4].duration,
        percentage: '90-100%',
        effortRange: 'Максимальная',
        minSpeed: segmentSpeeds[4] * 0.9,
        maxSpeed: segmentSpeeds[4] * 1.1
      }
    };

    // Add metadata
    const result = {
      zones: zones,
      timestamp: Date.now(),
      version: 1,
      calibrationDate: new Date().toISOString()
    };

    return result;
  }

  /**
   * Save personal speed zones data to localStorage with enhanced security
   * @param {Object} zonesData - Personal speed zones data
   * @returns {boolean} True if saved successfully, false otherwise
   */
  savePersonalSpeedZones(zonesData) {
    try {
      // Validate the zones data before saving
      const validation = speedZoneValidationService.validateSpeedZones(zonesData);
      if (!validation.isValid) {
        console.error('Invalid speed zones data:', validation.errors);
        return false;
      }
      
      // Add a checksum to detect tampering
      const checksum = this._calculateChecksum(zonesData);
      
      const dataToStore = {
        zones: zonesData,
        timestamp: Date.now(),
        checksum: checksum,
        source: 'assessment_workout', // Mark as coming from assessment workout
        version: 1
      };
      
      // Encrypt the data before storing (basic obfuscation)
      const encryptedData = btoa(JSON.stringify(dataToStore));
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
      return true;
    } catch (error) {
      console.error('Failed to save personal speed zones data:', error);
      return false;
    }
  }

  /**
   * Get personal speed zones data from localStorage with validation
   * @returns {Object|null} Zones data if exists and valid, null otherwise
   */
  getPersonalSpeedZones() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (!storedData) return null;

      // Decrypt the data
      const decryptedData = JSON.parse(atob(storedData));
      
      // Validate checksum to ensure data integrity
      const expectedChecksum = this._calculateChecksum(decryptedData.zones);
      if (decryptedData.checksum !== expectedChecksum) {
        console.warn('Personal speed zones data checksum mismatch. Data may be corrupted.');
        return null;
      }
      
      // Validate that data came from assessment workout
      if (decryptedData.source !== 'assessment_workout') {
        console.warn('Personal speed zones data source invalid. Data may be tampered.');
        return null;
      }
      
      // Validate data structure and content
      const validation = speedZoneValidationService.validateSpeedZones(decryptedData.zones);
      if (!validation.isValid) {
        console.warn('Personal speed zones data validation failed:', validation.errors);
        return null;
      }
      
      return decryptedData.zones;
    } catch (error) {
      console.error('Failed to get personal speed zones data:', error);
      return null;
    }
  }

  /**
   * Clear personal speed zones data from localStorage
   */
  clearPersonalSpeedZones() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear personal speed zones data:', error);
    }
  }

  /**
   * Check if a workout type is an assessment workout
   * @param {string} workoutId - Workout ID to check
   * @returns {boolean} True if it's an assessment workout, false otherwise
   */
  isAssessmentWorkout(workoutId) {
    return this.ASSESSMENT_WORKOUT_TYPES.includes(workoutId);
  }

  /**
   * Calculate checksum for data integrity validation
   * @param {Object} data - Data to calculate checksum for
   * @returns {string} Checksum
   */
  _calculateChecksum(data) {
    // Simple checksum calculation - in a real app, you might want to use a more robust method
    const jsonString = JSON.stringify(data);
    let checksum = 0;
    for (let i = 0; i < jsonString.length; i++) {
      checksum = ((checksum << 5) - checksum) + jsonString.charCodeAt(i);
      checksum |= 0; // Convert to 32bit integer
    }
    return checksum.toString();
  }

  /**
   * Get target speed for a specific zone as percentage of personal speed
   * @param {string} zoneName - Zone name (blue, green, yellow, orange, red)
   * @param {number} percentage - Percentage of personal speed (e.g., 90 for 90%)
   * @returns {number|null} Target speed or null if zone not found
   */
  getTargetSpeedForZone(zoneName, percentage) {
    const zonesData = this.getPersonalSpeedZones();
    if (!zonesData || !zonesData.zones || !zonesData.zones[zoneName]) {
      return null;
    }
    
    const zone = zonesData.zones[zoneName];
    return zone.averageSpeed * (percentage / 100);
  }

  /**
   * Get all target speeds for training plan reference
   * @returns {Object|null} Object with target speeds for each zone or null if not available
   */
  getAllTargetSpeeds() {
    const zonesData = this.getPersonalSpeedZones();
    if (!zonesData || !zonesData.zones) {
      return null;
    }
    
    const targetSpeeds = {};
    Object.keys(zonesData.zones).forEach(zoneKey => {
      const zone = zonesData.zones[zoneKey];
      targetSpeeds[zoneKey] = {
        name: zone.name,
        color: zone.color,
        averageSpeed: zone.averageSpeed,
        effortRange: zone.effortRange,
        percentage: zone.percentage,
        minSpeed: zone.minSpeed,
        maxSpeed: zone.maxSpeed
      };
    });
    
    return targetSpeeds;
  }
}

// Export singleton instance
const personalSpeedZoneService = new PersonalSpeedZoneService();
export default personalSpeedZoneService;