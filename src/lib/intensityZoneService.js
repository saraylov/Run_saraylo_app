/**
 * Intensity Zone Service for handling personal intensity zone calculations and storage
 */

class IntensityZoneService {
  constructor() {
    this.STORAGE_KEY = 'intensity_zones_data';
  }

  /**
   * Calculate personal intensity zones based on assessment training data
   * @param {Array} segmentSpeeds - Array of average speeds for each segment
   * @returns {Object} Calculated intensity zones
   */
  calculateIntensityZones(segmentSpeeds) {
    if (!segmentSpeeds || segmentSpeeds.length !== 5) {
      throw new Error('Invalid segment speeds data. Expected 5 segments.');
    }

    // Find the maximum speed among all segments
    const maxSpeed = Math.max(...segmentSpeeds);

    // Calculate the intensity zones based on percentage ranges from requirements
    const zones = {
      blue: {
        name: 'Голубой',
        color: '#41B6E6',
        speedRange: {
          min: maxSpeed * 0.15,
          max: maxSpeed * 0.24
        },
        averageSpeed: segmentSpeeds[0], // Speed from first segment (blue)
        percentage: '15-24%'
      },
      green: {
        name: 'Салатовый',
        color: '#90EE90',
        speedRange: {
          min: maxSpeed * 0.25,
          max: maxSpeed * 0.44
        },
        averageSpeed: segmentSpeeds[1], // Speed from second segment (green)
        percentage: '25-44%'
      },
      yellow: {
        name: 'Желтый',
        color: '#FFD700',
        speedRange: {
          min: maxSpeed * 0.45,
          max: maxSpeed * 0.69
        },
        averageSpeed: segmentSpeeds[2], // Speed from third segment (yellow)
        percentage: '45-69%'
      },
      orange: {
        name: 'Оранжевый',
        color: '#FFA500',
        speedRange: {
          min: maxSpeed * 0.70,
          max: maxSpeed * 0.89
        },
        averageSpeed: segmentSpeeds[3], // Speed from fourth segment (orange)
        percentage: '70-89%'
      },
      red: {
        name: 'Красный',
        color: '#FF0000',
        speedRange: {
          min: maxSpeed * 0.90,
          max: maxSpeed * 1.00
        },
        averageSpeed: segmentSpeeds[4], // Speed from fifth segment (red)
        percentage: '90-100%'
      }
    };

    // Add metadata
    const result = {
      zones: zones,
      maxSpeed: maxSpeed,
      timestamp: Date.now(),
      version: 1
    };

    return result;
  }

  /**
   * Save intensity zones data to localStorage
   * @param {Object} zonesData - Intensity zones data
   */
  saveZonesData(zonesData) {
    try {
      const dataToStore = {
        zones: zonesData,
        timestamp: Date.now()
      };
      
      // Encrypt the data before storing (basic obfuscation)
      const encryptedData = btoa(JSON.stringify(dataToStore));
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
      return true;
    } catch (error) {
      console.error('Failed to save intensity zones data:', error);
      return false;
    }
  }

  /**
   * Get intensity zones data from localStorage
   * @returns {Object|null} Zones data if exists, null otherwise
   */
  getZonesData() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (!storedData) return null;

      // Decrypt the data
      const decryptedData = JSON.parse(atob(storedData));
      return decryptedData.zones;
    } catch (error) {
      console.error('Failed to get intensity zones data:', error);
      return null;
    }
  }

  /**
   * Clear intensity zones data from localStorage
   */
  clearZonesData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear intensity zones data:', error);
    }
  }

  /**
   * Compare current zones with previous zones for progress tracking
   * @param {Object} currentZones - Current intensity zones
   * @param {Object} previousZones - Previous intensity zones
   * @returns {Object} Comparison results
   */
  compareZones(currentZones, previousZones) {
    if (!currentZones || !previousZones) {
      return null;
    }

    const comparison = {};
    const zoneKeys = ['blue', 'green', 'yellow', 'orange', 'red'];
    
    zoneKeys.forEach(zoneKey => {
      const currentZone = currentZones.zones[zoneKey];
      const previousZone = previousZones.zones[zoneKey];
      
      if (currentZone && previousZone) {
        comparison[zoneKey] = {
          speedChange: currentZone.averageSpeed - previousZone.averageSpeed,
          rangeMinChange: currentZone.speedRange.min - previousZone.speedRange.min,
          rangeMaxChange: currentZone.speedRange.max - previousZone.speedRange.max
        };
      }
    });
    
    return comparison;
  }
}

// Export singleton instance
const intensityZoneService = new IntensityZoneService();
export default intensityZoneService;