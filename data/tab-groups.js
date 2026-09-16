// data/tab-groups.js — Tab group configuration (icon keys resolved via data/icons.js)
var TAB_GROUPS = {
  today: [
    { id: 'workout', icon: 'dumbbell', label: 'Workout Log' },
    { id: 'quick', icon: 'zap', label: 'Quick Log' },
    { id: 'warmup', icon: 'flame', label: 'Warm-up' },
    { id: 'history', icon: 'calendar-check', label: 'Past Workouts' }
  ],
  exercises: [
    { id: 'chest', icon: 'muscle', label: 'Chest' },
    { id: 'back', icon: 'back-arrow', label: 'Back' },
    { id: 'legs', icon: 'leg', label: 'Legs' },
    { id: 'shoulders', icon: 'target', label: 'Shoulders' },
    { id: 'arms', icon: 'bicep', label: 'Arms' },
    { id: 'core', icon: 'bricks', label: 'Core' },
    { id: 'cardio', icon: 'runner', label: 'Cardio' },
    { id: 'bodyweight', icon: 'acrobatic', label: 'Bodyweight' }
  ],
  goals: [
    { id: 'active', icon: 'target', label: 'Active Goals' },
    { id: 'prs', icon: 'trophy', label: 'PR History' }
  ],
  quests: [
    { id: 'daily', icon: 'calendar', label: 'Daily' },
    { id: 'weekly', icon: 'calendar-check', label: 'Weekly' },
    { id: 'monthly', icon: 'calendar-days', label: 'Monthly' },
    { id: 'lifetime', icon: 'infinity', label: 'Lifetime' }
  ],
  progress: [
    { id: 'calendar', icon: 'calendar', label: 'Calendar' },
    { id: 'stats', icon: 'chart', label: 'Stats' },
    { id: 'body', icon: 'scales', label: 'Body Metrics' }
  ],
  rewards: [
    { id: 'achievements', icon: 'medal', label: 'Achievements' },
    { id: 'shop', icon: 'shopping', label: 'Shop' }
  ],
  profile: [
    { id: 'settings', icon: 'gear', label: 'Settings' }
  ]
};

var CAT_ORDER = ['today', 'exercises', 'goals', 'quests', 'progress', 'rewards', 'profile'];
var CAT_META = {
  today:     { icon: 'dumbbell', label: 'Today' },
  exercises: { icon: 'muscle', label: 'Exercises' },
  goals:     { icon: 'target', label: 'Goals' },
  quests:    { icon: 'swords', label: 'Quests' },
  progress:  { icon: 'chart', label: 'Progress' },
  rewards:   { icon: 'trophy', label: 'Rewards' },
  profile:   { icon: 'user', label: 'Profile' }
};
