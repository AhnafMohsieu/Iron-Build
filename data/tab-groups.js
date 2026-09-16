// data/tab-groups.js — Tab group configuration
const TAB_GROUPS = {
  today: [
    { id: 'workout', icon: '🏋️', label: 'Workout Log' },
    { id: 'quick', icon: '⚡', label: 'Quick Log' },
    { id: 'warmup', icon: '🔥', label: 'Warm-up' },
    { id: 'history', icon: '📜', label: 'Past Workouts' }
  ],
  exercises: [
    { id: 'chest', icon: '💪', label: 'Chest' },
    { id: 'back', icon: '🔙', label: 'Back' },
    { id: 'legs', icon: '🦵', label: 'Legs' },
    { id: 'shoulders', icon: '🎯', label: 'Shoulders' },
    { id: 'arms', icon: '💪', label: 'Arms' },
    { id: 'core', icon: '🧱', label: 'Core' },
    { id: 'cardio', icon: '🏃', label: 'Cardio' },
    { id: 'bodyweight', icon: '🤸', label: 'Bodyweight' }
  ],
  goals: [
    { id: 'active', icon: '🎯', label: 'Active Goals' },
    { id: 'prs', icon: '🏆', label: 'PR History' }
  ],
  quests: [
    { id: 'daily', icon: '📅', label: 'Daily' },
    { id: 'weekly', icon: '📆', label: 'Weekly' },
    { id: 'monthly', icon: '🗓️', label: 'Monthly' },
    { id: 'lifetime', icon: '♾️', label: 'Lifetime' }
  ],
  progress: [
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'stats', icon: '📊', label: 'Stats' },
    { id: 'body', icon: '⚖️', label: 'Body Metrics' }
  ],
  rewards: [
    { id: 'achievements', icon: '🏆', label: 'Achievements' },
    { id: 'shop', icon: '🛍️', label: 'Shop' }
  ],
  profile: [
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ]
};

const CAT_ORDER = ['today', 'exercises', 'goals', 'quests', 'progress', 'rewards', 'profile'];
const CAT_META = {
  today:     { icon: '🏋️', label: 'Today' },
  exercises: { icon: '💪', label: 'Exercises' },
  goals:     { icon: '🎯', label: 'Goals' },
  quests:    { icon: '⚔️', label: 'Quests' },
  progress:  { icon: '📊', label: 'Progress' },
  rewards:   { icon: '🏆', label: 'Rewards' },
  profile:   { icon: '👤', label: 'Profile' }
};
