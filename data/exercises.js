// data/exercises.js — Exercise database with descriptions
const EXERCISES = [
  // Chest
  { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'chest', type: 'barbell', xp: 50, icon: '🏋️',
    desc: 'Lie on bench, grip bar shoulder-width. Lower to chest, press up. Targets pectorals, triceps, front delts.' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press', muscle: 'chest', type: 'dumbbell', xp: 50, icon: '💪',
    desc: 'Set bench to 30-45°. Press dumbbells up from shoulder level. Emphasizes upper chest.' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscle: 'chest', type: 'barbell', xp: 45, icon: '🏋️',
    desc: 'Lie on decline bench. Lower bar to lower chest, press up. Targets lower pectorals.' },
  { id: 'db_flyes', name: 'Dumbbell Flyes', muscle: 'chest', type: 'dumbbell', xp: 40, icon: '🦋',
    desc: 'Lie on bench, arms wide with slight bend. Bring dumbbells together in arc. Stretches chest.' },
  { id: 'cable_crossover', name: 'Cable Crossover', muscle: 'chest', type: 'machine', xp: 40, icon: '🔗',
    desc: 'Stand between cable stations. Pull handles together in front. Squeeze chest at peak.' },
  { id: 'pushups', name: 'Push-ups', muscle: 'chest', type: 'bodyweight', xp: 35, icon: '🤸',
    desc: 'Hands shoulder-width, body straight. Lower chest to floor, push back up. Classic compound move.' },
  { id: 'chest_dips', name: 'Chest Dips', muscle: 'chest', type: 'bodyweight', xp: 40, icon: '🤸',
    desc: 'Lean forward on parallel bars. Lower body by bending arms, push up. Hits lower chest and triceps.' },
  { id: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'chest', type: 'machine', xp: 40, icon: '🏋️',
    desc: 'Sit upright, push handles forward from chest. Great for beginners, controlled movement.' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscle: 'back', type: 'barbell', xp: 60, icon: '🏋️',
    desc: 'Stand over bar, hinge at hips, grip bar. Drive through heels, stand tall. Full body compound lift.' },
  { id: 'barbell_row', name: 'Barbell Row', muscle: 'back', type: 'barbell', xp: 50, icon: '🏋️',
    desc: 'Hinge forward, grip bar. Pull bar to lower chest, squeeze shoulder blades. Builds back thickness.' },
  { id: 'pullups', name: 'Pull-ups', muscle: 'back', type: 'bodyweight', xp: 45, icon: '🤸',
    desc: 'Hang from bar, pull chin over bar. Targets lats, biceps, rear delts. Key back builder.' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'back', type: 'machine', xp: 40, icon: '🔗',
    desc: 'Sit at machine, pull bar to upper chest. Simulates pull-up motion. Great for lat development.' },
  { id: 'seated_cable_row', name: 'Seated Cable Row', muscle: 'back', type: 'machine', xp: 40, icon: '🔗',
    desc: 'Sit upright, pull handle to torso. Squeeze back at peak. Builds mid-back and lats.' },
  { id: 'db_row', name: 'Dumbbell Row', muscle: 'back', type: 'dumbbell', xp: 45, icon: '💪',
    desc: 'One hand on bench, row dumbbell to hip. Keep core tight. Unilateral back builder.' },
  { id: 'tbar_row', name: 'T-Bar Row', muscle: 'back', type: 'barbell', xp: 50, icon: '🏋️',
    desc: 'Straddle bar, hinge forward. Pull weight to chest. Heavy compound back movement.' },
  { id: 'chinups', name: 'Chin-ups', muscle: 'back', type: 'bodyweight', xp: 45, icon: '🤸',
    desc: 'Grip bar underhand, pull chin over bar. More bicep emphasis than pull-ups.' },

  // Legs
  { id: 'squat', name: 'Barbell Squat', muscle: 'legs', type: 'barbell', xp: 60, icon: '🏋️',
    desc: 'Bar on upper back, feet shoulder-width. Squat down to parallel, stand up. King of leg exercises.' },
  { id: 'front_squat', name: 'Front Squat', muscle: 'legs', type: 'barbell', xp: 55, icon: '🏋️',
    desc: 'Bar on front delts, elbows up. Squat down, keep torso upright. Emphasizes quads and core.' },
  { id: 'leg_press', name: 'Leg Press', muscle: 'legs', type: 'machine', xp: 45, icon: '🔗',
    desc: 'Sit in machine, push platform away. Control the weight down. Safe heavy leg builder.' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'legs', type: 'barbell', xp: 55, icon: '🏋️',
    desc: 'Hold bar at hips, hinge forward with slight knee bend. Feel stretch in hamstrings, drive hips forward.' },
  { id: 'walking_lunges', name: 'Walking Lunges', muscle: 'legs', type: 'bodyweight', xp: 40, icon: '🤸',
    desc: 'Step forward into lunge, alternate legs. Great for quads, glutes, and balance.' },
  { id: 'leg_curl', name: 'Leg Curl', muscle: 'legs', type: 'machine', xp: 35, icon: '🔗',
    desc: 'Lie face down, curl weight toward glutes. Isolates hamstrings.' },
  { id: 'leg_extension', name: 'Leg Extension', muscle: 'legs', type: 'machine', xp: 35, icon: '🔗',
    desc: 'Sit in machine, extend legs straight. Isolates quadriceps.' },
  { id: 'calf_raises', name: 'Calf Raises', muscle: 'legs', type: 'machine', xp: 30, icon: '🔗',
    desc: 'Stand on platform, rise onto toes, lower slowly. Targets gastrocnemius and soleus.' },
  { id: 'goblet_squat', name: 'Goblet Squat', muscle: 'legs', type: 'dumbbell', xp: 45, icon: '💪',
    desc: 'Hold dumbbell at chest, squat deep. Perfect form trainer, great for quads and core.' },
  { id: 'bulgarian_split', name: 'Bulgarian Split Squat', muscle: 'legs', type: 'bodyweight', xp: 45, icon: '🤸',
    desc: 'Rear foot on bench, lunge down. Unilateral leg builder for quads and glutes.' },

  // Shoulders
  { id: 'overhead_press', name: 'Overhead Press', muscle: 'shoulders', type: 'barbell', xp: 50, icon: '🏋️',
    desc: 'Press bar from shoulders overhead. Keep core tight. Builds shoulder mass and strength.' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪',
    desc: 'Stand, raise dumbbells to sides until parallel with floor. Isolates lateral delts.' },
  { id: 'front_raise', name: 'Front Raise', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪',
    desc: 'Raise dumbbells in front to shoulder height. Targets anterior deltoids.' },
  { id: 'face_pulls', name: 'Face Pulls', muscle: 'shoulders', type: 'machine', xp: 35, icon: '🔗',
    desc: 'Pull rope to face, elbows high. Great for rear delts and shoulder health.' },
  { id: 'arnold_press', name: 'Arnold Press', muscle: 'shoulders', type: 'dumbbell', xp: 45, icon: '💪',
    desc: 'Start with palms facing you, rotate and press overhead. Hits all three delt heads.' },
  { id: 'rear_delt_flyes', name: 'Rear Delt Flyes', muscle: 'shoulders', type: 'dumbbell', xp: 35, icon: '💪',
    desc: 'Bend forward, raise dumbbells to sides. Targets rear deltoids and upper back.' },

  // Arms
  { id: 'barbell_curl', name: 'Barbell Curl', muscle: 'arms', type: 'barbell', xp: 40, icon: '🏋️',
    desc: 'Stand, curl bar from thighs to chest. Keep elbows pinned. Classic bicep builder.' },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'arms', type: 'machine', xp: 35, icon: '🔗',
    desc: 'Push cable bar down to thighs. Keep elbows at sides. Isolates triceps.' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'arms', type: 'dumbbell', xp: 35, icon: '💪',
    desc: 'Curl dumbbells with palms facing each other. Targets brachialis and forearms.' },
  { id: 'skull_crushers', name: 'Skull Crushers', muscle: 'arms', type: 'barbell', xp: 40, icon: '🏋️',
    desc: 'Lie on bench, lower bar to forehead. Extend arms back up. Tricep mass builder.' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'arms', type: 'machine', xp: 35, icon: '🔗',
    desc: 'Arms on preacher pad, curl weight up. Eliminates cheating, pure bicep isolation.' },
  { id: 'overhead_tri_ext', name: 'Overhead Tricep Extension', muscle: 'arms', type: 'dumbbell', xp: 35, icon: '💪',
    desc: 'Hold dumbbell overhead, lower behind head. Stretches long head of triceps.' },

  // Core
  { id: 'plank', name: 'Plank', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸',
    desc: 'Hold straight body position on forearms. Keep core tight, don\'t let hips sag. Builds stability.' },
  { id: 'hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'core', type: 'bodyweight', xp: 35, icon: '🤸',
    desc: 'Hang from bar, raise legs to 90°. Targets lower abs and hip flexors.' },
  { id: 'cable_crunch', name: 'Cable Crunch', muscle: 'core', type: 'machine', xp: 30, icon: '🔗',
    desc: 'Kneel, crunch down pulling cable. Focus on contracting abs, not pulling with arms.' },
  { id: 'russian_twist', name: 'Russian Twist', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸',
    desc: 'Sit, lean back, twist torso side to side. Targets obliques.' },
  { id: 'ab_rollout', name: 'Ab Rollout', muscle: 'core', type: 'bodyweight', xp: 35, icon: '🤸',
    desc: 'Kneel, roll wheel forward, pull back. Intense core contraction throughout.' },
  { id: 'lying_leg_raise', name: 'Lying Leg Raise', muscle: 'core', type: 'bodyweight', xp: 25, icon: '🤸',
    desc: 'Lie flat, raise legs to 90°, lower slowly. Targets lower abdominals.' },

  // Cardio
  { id: 'running', name: 'Running', muscle: 'cardio', type: 'cardio', xp: 40, icon: '🏃',
    desc: 'Steady-state or interval running. Builds endurance, burns calories, strengthens heart.' },
  { id: 'cycling', name: 'Cycling', muscle: 'cardio', type: 'cardio', xp: 35, icon: '🚴',
    desc: 'Stationary or outdoor cycling. Low-impact cardio, great for leg endurance.' },
  { id: 'jump_rope', name: 'Jump Rope', muscle: 'cardio', type: 'cardio', xp: 35, icon: '🤸',
    desc: 'Skip rope continuously. Excellent conditioning, improves coordination and footwork.' },
  { id: 'rowing', name: 'Rowing', muscle: 'cardio', type: 'cardio', xp: 40, icon: '🚣',
    desc: 'Use rowing machine with full body motion. Great cardio + back engagement.' }
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
