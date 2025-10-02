# Personal Speed Zone Calibration System

## Overview
This implementation provides a comprehensive system for calibrating personal speed zones through assessment workouts. The system automatically calculates and stores personal speed metrics based on GPS data from assessment workouts, which then become the reference for all future training sessions.

## Components Created

### 1. PersonalSpeedZoneService (`src/lib/personalSpeedZoneService.js`)
Core service for handling personal speed zone calculations, storage, and validation.

**Key Features:**
- Calculates personal speed zones based on assessment workout data
- Secure storage with checksum validation
- Data integrity protection to prevent tampering
- Validation to ensure only assessment workouts can update speed zones
- Methods to retrieve target speeds for training plans

### 2. SpeedZoneValidationService (`src/lib/speedZoneValidation.js`)
Validation service to ensure data integrity and prevent tampering.

**Key Features:**
- Validates assessment workout types
- Validates segment data structure and content
- Ensures data integrity with checksum validation
- Validates speed ranges and values
- Comprehensive validation of speed zone data

### 3. TrainingPlanService (`src/lib/trainingPlanService.js`)
Service for creating and managing training plans based on personal speed zones.

**Key Features:**
- Generates personalized training plans based on speed zones
- Creates weekly training schedules
- Provides training tips and recommendations
- Stores and retrieves training plans
- Integrates with personal speed zone data

### 4. PersonalSpeedZones Component (`src/components/PersonalSpeedZones.svelte`)
UI component for displaying personal speed zones in detail.

**Key Features:**
- Visual display of all five speed zones
- Detailed information for each zone (speed, duration, intensity)
- Calibration date display
- Usage instructions
- Responsive design

### 5. TrainingPlanWithSpeedZones Component (`src/components/TrainingPlanWithSpeedZones.svelte`)
UI component for displaying training plans based on personal speed zones.

**Key Features:**
- Zone-specific training recommendations
- Duration guidelines for each zone
- Detailed training plan with weekly schedule
- Training tips and best practices
- Responsive design

### 6. TrainingPlanDisplay Component (`src/components/TrainingPlanDisplay.svelte`)
Component for displaying a complete weekly training plan.

**Key Features:**
- Tabular display of weekly training schedule
- Color-coded zone indicators
- Detailed workout descriptions
- Target speed ranges
- Training tips section

### 7. Test Components
- SpeedZoneTest.svelte - Test component for verifying functionality
- Integration with existing Training.svelte and Profile.svelte components

## System Workflow

### 1. Assessment Workout Completion
1. User completes an assessment workout with 5 color-coded segments
2. System captures GPS data and calculates average speed for each segment
3. PersonalSpeedZoneService validates the workout data
4. Speed zones are calculated based on actual performance
5. Data is securely stored with checksum validation

### 2. Speed Zone Storage
1. Speed zone data is encrypted and stored in localStorage
2. Checksum is calculated and stored for integrity validation
3. Source validation ensures only assessment workouts can update data
4. Data structure validation prevents tampering

### 3. Training Plan Generation
1. TrainingPlanService retrieves personal speed zones
2. Weekly training plan is generated based on zone data
3. Plan includes specific recommendations for each day
4. Plan is saved for future reference

### 4. Data Usage in Other Workouts
1. Other components can retrieve target speeds for specific zones
2. Training plans reference personal speed zones for target metrics
3. Future workouts can compare performance against personal benchmarks

## Security Features

### Data Integrity
- Checksum validation to detect data corruption
- Source validation to ensure only assessment workouts update zones
- Structure validation to prevent tampering
- Version control for data format compatibility

### Protection Mechanisms
- Only assessment workouts can update personal speed zones
- Manual editing of speed zones is blocked
- Data validation on both save and retrieve operations
- Error handling for corrupted or invalid data

## Integration with Existing System

### Training Component
- Updated to calculate and save personal speed zones after assessment workouts
- Integrated with existing intensity zone calculations for backward compatibility

### Profile Component
- Updated to display personal speed zones
- Shows calibration date and zone details
- Maintains existing functionality while adding new features

## Data Structure

### Personal Speed Zones
```javascript
{
  zones: {
    blue: {
      name: 'Голубой',
      color: '#41B6E6',
      averageSpeed: 8.5, // km/h
      duration: 6, // minutes
      percentage: '15-24%',
      effortRange: 'Легкая',
      minSpeed: 7.65, // 90% of average
      maxSpeed: 9.35  // 110% of average
    },
    // ... other zones (green, yellow, orange, red)
  },
  timestamp: 1678886400000,
  version: 1,
  calibrationDate: '2023-03-15T10:30:00.000Z'
}
```

## Usage Instructions

### For Users
1. Complete an assessment workout to calibrate personal speed zones
2. View personal speed zones in the Profile section
3. Use generated training plans for optimized workouts
4. Re-calibrate periodically to update zones based on improved fitness

### For Developers
1. Use PersonalSpeedZoneService to retrieve target speeds
2. Integrate TrainingPlanService for training plan generation
3. Utilize SpeedZoneValidationService for data validation
4. Extend components as needed for additional features

## Future Enhancements
1. Integration with cloud storage for cross-device synchronization
2. Advanced analytics and progress tracking
3. Social features for sharing achievements
4. AI-powered training plan optimization
5. Integration with wearable devices for additional metrics

## Testing
The system includes test components to verify functionality:
- SpeedZoneTest.svelte for simulating assessment workouts
- Validation tests for data integrity
- UI component tests for display functionality