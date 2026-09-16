// data/warmup-routines.js — Warm-up routines
const WARMUP_ROUTINES = {
  upper: {
    name: 'Upper Body Warm-up',
    movements: [
      { name: 'Arm Circles', reps: '20 forward, 20 backward' },
      { name: 'Band Pull-Aparts', reps: '15 reps' },
      { name: 'Push-up to Downward Dog', reps: '10 reps' },
      { name: 'Shoulder Dislocates (band)', reps: '15 reps' },
      { name: 'Cat-Cow', reps: '10 reps' }
    ]
  },
  lower: {
    name: 'Lower Body Warm-up',
    movements: [
      { name: 'Bodyweight Squats', reps: '15 reps' },
      { name: 'Walking Lunges', reps: '10 each leg' },
      { name: 'Leg Swings (front)', reps: '15 each leg' },
      { name: 'Leg Swings (side)', reps: '15 each leg' },
      { name: 'Glute Bridges', reps: '15 reps' }
    ]
  },
  push: {
    name: 'Push Day Warm-up',
    movements: [
      { name: 'Band Face Pulls', reps: '15 reps' },
      { name: 'Light Bench Press', reps: '10 reps' },
      { name: 'Push-ups', reps: '10 reps' },
      { name: 'Arm Circles', reps: '20 each direction' }
    ]
  },
  pull: {
    name: 'Pull Day Warm-up',
    movements: [
      { name: 'Band Pull-Aparts', reps: '15 reps' },
      { name: 'Dead Hang', reps: '20 seconds' },
      { name: 'Light Lat Pulldown', reps: '12 reps' },
      { name: 'Scapular Pull-ups', reps: '10 reps' }
    ]
  },
  full: {
    name: 'Full Body Warm-up',
    movements: [
      { name: 'Jumping Jacks', reps: '30 seconds' },
      { name: 'Bodyweight Squats', reps: '15 reps' },
      { name: 'Push-ups', reps: '10 reps' },
      { name: 'Hip Circles', reps: '10 each direction' },
      { name: 'Arm Circles', reps: '15 each direction' }
    ]
  },
  core: {
    name: 'Core Warm-up',
    movements: [
      { name: 'Dead Bug', reps: '10 each side' },
      { name: 'Bird Dog', reps: '10 each side' },
      { name: 'Cat-Cow', reps: '10 reps' },
      { name: 'Plank Hold', reps: '30 seconds' }
    ]
  }
};

window.WARMUP_ROUTINES = WARMUP_ROUTINES;
