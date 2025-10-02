// Mock workout data for testing the history system
export const mockWorkoutHistory = [
  {
    id: '1',
    type: 'running',
    date: '2025-09-15T08:30:00',
    duration: 1800, // 30 minutes in seconds
    distance: 5.2,
    avgSpeed: 10.4,
    maxSpeed: 15.2,
    avgPace: 300, // 5:00 min/km in seconds
    maxPace: 240, // 4:00 min/km in seconds
    calories: 320,
    steps: 4200,
    segments: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 6, avgSpeed: 8.5 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 5, avgSpeed: 9.8 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 5, avgSpeed: 11.2 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 3, avgSpeed: 13.5 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 1, avgSpeed: 15.2 }
    ]
  },
  {
    id: '2',
    type: 'cycling',
    date: '2025-09-12T18:15:00',
    duration: 3600, // 60 minutes in seconds
    distance: 22.5,
    avgSpeed: 22.5,
    maxSpeed: 35.0,
    avgPace: 160, // 2:40 min/km in seconds
    maxPace: 103, // 1:43 min/km in seconds
    calories: 580,
    steps: 0, // Cycling doesn't count steps
    segments: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 10, avgSpeed: 18.0 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 15, avgSpeed: 22.0 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 12, avgSpeed: 26.5 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 8, avgSpeed: 30.0 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 5, avgSpeed: 35.0 }
    ]
  },
  {
    id: '3',
    type: 'walking',
    date: '2025-09-10T07:45:00',
    duration: 2700, // 45 minutes in seconds
    distance: 3.8,
    avgSpeed: 5.1,
    maxSpeed: 6.8,
    avgPace: 705, // 11:45 min/km in seconds
    maxPace: 529, // 8:49 min/km in seconds
    calories: 180,
    steps: 5200,
    segments: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 8, avgSpeed: 4.2 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 10, avgSpeed: 5.0 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 9, avgSpeed: 5.8 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 7, avgSpeed: 6.2 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 3, avgSpeed: 6.8 }
    ]
  },
  {
    id: '4',
    type: 'treadmill',
    date: '2025-09-08T19:30:00',
    duration: 2100, // 35 minutes in seconds
    distance: 6.1,
    avgSpeed: 10.5,
    maxSpeed: 14.0,
    avgPace: 285, // 4:45 min/km in seconds
    maxPace: 214, // 3:34 min/km in seconds
    calories: 380,
    steps: 4800,
    segments: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 7, avgSpeed: 8.0 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 6, avgSpeed: 9.5 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 6, avgSpeed: 11.0 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 5, avgSpeed: 12.5 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 2, avgSpeed: 14.0 }
    ]
  },
  {
    id: '5',
    type: 'nordic_walking',
    date: '2025-09-05T16:20:00',
    duration: 3000, // 50 minutes in seconds
    distance: 4.7,
    avgSpeed: 5.6,
    maxSpeed: 7.2,
    avgPace: 642, // 10:42 min/km in seconds
    maxPace: 500, // 8:20 min/km in seconds
    calories: 260,
    steps: 5800,
    segments: [
      { id: 1, name: 'Голубой', color: '#41B6E6', duration: 9, avgSpeed: 4.8 },
      { id: 2, name: 'Салатовый', color: '#90EE90', duration: 11, avgSpeed: 5.4 },
      { id: 3, name: 'Желтый', color: '#FFD700', duration: 10, avgSpeed: 6.0 },
      { id: 4, name: 'Оранжевый', color: '#FFA500', duration: 6, avgSpeed: 6.8 },
      { id: 5, name: 'Красный', color: '#FF0000', duration: 4, avgSpeed: 7.2 }
    ]
  }
];

export default mockWorkoutHistory;