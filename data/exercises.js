// data/exercises.js — Exercise database
const EXERCISES = [
  // Chest
  { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'chest', type: 'barbell', xp: 50, icon: '🏋️' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscle: 'chest', type: 'dumbbell', xp: 50, icon: '💪' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscle: 'chest', type: 'barbell', xp: 45, icon: '🏋️' },
  { id: 'db_flyes', name: 'Dumbbell Flyes', muscle: 'chest', type: 'dumbbell', xp: 40, icon: '🦋' },
  { id: 'cable_crossover', name: 'Cable Crossover', muscle: 'chest', type: 'machine', xp: 40, icon: '🔗' },
  { id: 'pushups', name: 'Push-ups', muscle: 'chest', type: 'bodyweight', xp: 35, icon: '🤸' },
  { id: 'chest_dips', name: 'Chest Dips', muscle: 'chest', type: 'bodyweight', xp: 40, icon: '🤸' },
  { id: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'chest', type: 'machine', xp: 40, icon: '🏋️' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscle: 'back', type: 'barbell', xp: 60, icon: '🏋️' },
  { id: 'barbell_row', name: 'Barbell Row', muscle: 'back', type: 'barbell', xp: 50, icon: '🏋️' },
  { id: 'pullups', name: 'Pull-ups', muscle: 'back', type: 'bodyweight', xp: 45, icon: '🤸' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'back', type: 'machine', xp: 40, icon: '🔗' },
  { id: 'seated_cable_row', name: 'Seated Cable Row', muscle: 'back', type: 'machine', xp: 40, icon: '🔗' },
  { id: 'db_row', name: 'Dumbbell Row', muscle: 'back', type: 'dumbbell', xp: 45, icon: '💪' },
  { id: 'tbar_row', name: 'T-Bar Row', muscle: 'back', type: 'barbell', xp: 50, icon: '🏋️' },
  { id: 'chinups', name: 'Chin-ups', muscle: 'back', type: 'bodyweight', xp: 45, icon: '🤸' },

  // Legs
  { id: 'squat', name: 'Barbell Squat', muscle: 'legs', type: 'barbell', xp: 60, icon: '🏋️' },
  { id: 'front_squat', name: 'Front Squat', muscle: 'legs', type: 'barbell', xp: 55, icon: '🏋️' },
  { id: 'leg_press', name: 'Leg Press', muscle: 'legs', type: 'machine', xp: 45, icon: '🔗' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'legs', type: 'barbell', xp: 55, icon: '🏋️' },
  { id: 'walking_lunges', name: 'Walking Lunges', muscle: 'legs', type: 'bodyweight', xp: 40, icon: '🤸' },
  { id: 'leg_curl', name: 'Leg Curl', muscle: 'legs', type: 'machine', xp: 35, icon: '🔗' },
  { id: 'leg_extension', name: 'Leg Extension', muscle: 'legs', type: 'machine', xp: 35, icon: '🔗' },
  { id: 'calf_raises', name: 'Calf Raises', muscle: 'legs', type: 'machine', xp: 30, icon: '🔗' },
  { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'legs', type: 'dumbbell', xp: 45, icon: '💪' },
  { id: 'bulgarian_split', name: 'Bulgarian Split Squat', muscle: 'legs', type: 'bodyweight', xp: 45, icon: '🤸' },

  // Shoulders
  { id: 'overhead_press', name: 'Overhead Press', muscle: 'shoulders', type: 'barbell', xp: 50, icon: '🏋️' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪' },
  { id: 'front_raise', name: 'Front Raise', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪' },
  { id: 'face_pulls', name: 'Face Pulls', muscle: 'shoulders', type: 'machine', xp: 35, icon: '🔗' },
  { id: 'arnold_press', name: 'Arnold Press', muscle: 'shoulders', type: 'dumbbell', xp: 45, icon: '💪' },
  { id: 'rear_delt_flyes', name: 'Rear Delt Flyes', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪' },

  // Arms
  { id: 'barbell_curl', name: 'Barbell Curl', muscle: 'arms', type: 'barbell', xp: 40, icon: '🏋️' },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'arms', type: 'machine', xp: 35, icon: '🔗' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'arms', type: 'dumbbell', xp: 35, icon: '💪' },
  { id: 'skull_crushers', name: 'Skull Crushers', muscle: 'arms', type: 'barbell', xp: 40, icon: '🏋️' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'arms', type: 'machine', xp: 35, icon: '🔗' },
  { id: 'overhead_tri_ext', name: 'Overhead Tricep Extension', muscle: 'arms', type: 'dumbbell', xp: 35, icon: '💪' },

  // Core
  { id: 'plank', name: 'Plank', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸' },
  { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'core', type: 'bodyweight', xp: 35, icon: '🤸' },
  { id: 'cable_crunch', name: 'Cable Crunch', muscle: 'core', type: 'machine', xp: 30, icon: '🔗' },
  { id: 'russian_twist', name: 'Russian Twist', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸' },
  { id: 'ab_rollout', name: 'Ab Rollout', muscle: 'core', type: 'bodyweight', xp: 35, icon: '🤸' },
  { id: 'lying_leg_raise', name: 'Lying Leg Raise', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸' },

  // Cardio
  { id: 'running', name: 'Running', muscle: 'cardio', type: 'cardio', xp: 40, icon: '🏃' },
  { id: 'cycling', name: 'Cycling', muscle: 'cardio', type: 'cardio', xp: 35, icon: '🚴' },
  { id: 'jump_rope', name: 'Jump Rope', muscle: 'cardio', type: 'cardio', xp: 35, icon: '🤸' },
  { id: 'rowing', name: 'Rowing', muscle: 'cardio', type: 'cardio', xp: 40, icon: '🚣' }
];

function getExercisesByMuscle(muscle) {
  return EXERCISES.filter(function(e) { return e.muscle === muscle; });
}

function getExerciseById(id) {
  return EXERCISES.find(function(e) { return e.id === id; });
}

window.EXERCISES = EXERCISES;
window.getExercisesByMuscle = getExercisesByMuscle;
window.getExerciseById = getExerciseById;
