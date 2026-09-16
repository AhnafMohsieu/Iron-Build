# Iron Build — Design Spec

**Gym & Exercise Tracker with RPG Gamification**

## 1. Overview

Iron Build is a single-page PWA for tracking gym workouts, bodyweight exercises, goals, and personal records. It uses RPG-style gamification (XP, levels, streaks, quests, achievements) to motivate consistent training. Architecture mirrors the Ibadah Quest (IQ) project — vanilla JS IIFE modules, localStorage persistence, no bundler.

## 2. Architecture

| Layer | Technology |
|-------|-----------|
| UI | Vanilla JavaScript + CSS custom properties |
| Storage | localStorage with schema versioning |
| PWA | Service Worker + Web App Manifest |
| Fonts | System fonts (Inter-like stack) |
| Testing | Node.js built-in test runner |

**Module Pattern**: IIFE per file with `window.*` exports. Script tags loaded in dependency order with `defer`.

**Key Abstractions** (inherited from IQ):
- `applyXpDelta(delta, opts?)` / `spendXp(amount, opts?)` — single source of truth for XP mutations
- `openToastModal(html)` / `closeToastOverlay()` — shared modal lifecycle
- `appAction(name)` — fail-loud facade for feature calls
- `getTodayKey()` / `getYesterdayKey()` / `getWeekAgoKey()` — consistent local-date keys
- `escapeHTML(str)` — XSS-safe rendering
- `weightedPick(pool)` — weighted random selection

## 3. Project Structure

```
Gym/
├── index.html              # Single-page app entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── core/                   # Core modules
│   ├── state.js            # freshState, normalizeState, load/save
│   ├── xp.js               # XP pipeline (applyXpDelta, spendXp)
│   ├── quests.js           # Quest generation + checking
│   ├── achievements.js     # Achievement unlock logic
│   ├── actions.js          # App facade + boot
│   ├── helpers.js          # Shared utilities
│   ├── storage.js          # Schema-versioned localStorage
│   ├── tabs.js             # Tab navigation
│   ├── render.js           # Static DOM rendering
│   └── random.js           # Weighted random selection
├── data/                   # Static data
│   ├── exercises.js        # Exercise database (~60 exercises)
│   ├── levels.js           # Level titles (100 levels)
│   ├── quests.js           # Quest definitions (daily/weekly/monthly/yearly/lifetime)
│   ├── achievements.js     # Achievement definitions
│   ├── tab-groups.js       # Tab group configuration
│   ├── tips.js             # Fitness tips/motivation
│   └── streak-msgs.js      # Streak milestone messages
├── features/               # Feature modules
│   ├── workout-log.js      # Workout logging (detailed + quick mode)
│   ├── goals.js            # Goal setting + tracking
│   ├── body-metrics.js     # Body weight/measurements tracking
│   ├── pr-history.js       # Personal record tracking
│   ├── calendar.js         # Workout calendar view
│   ├── analytics.js        # Stats dashboard
│   ├── shop.js             # XP spending shop
│   └── profile.js          # User profile + settings
├── render/                 # DOM rendering
│   ├── dynamic.js          # Dynamic content rendering
│   └── modals.js           # Modal/toast rendering
├── styles/
│   └── main.css            # All CSS with custom properties
├── assets/
│   └── icons/              # App icons (SVG)
└── tests/                  # Test files
```

## 4. Gamification System

### 4.1 XP Sources

| Action | XP | Notes |
|--------|-----|-------|
| Log a workout | 50 | Any exercise, once per day per exercise |
| Complete all sets | 30 | Bonus for finishing a full workout |
| Hit a new PR | 100 | Weight or reps personal record |
| Log body metrics | 15 | Weight, body fat, measurements |
| Daily quest complete | 30-70 | Varies by quest difficulty |
| Weekly quest complete | 200-400 | Varies by quest difficulty |
| Monthly quest complete | 800-1500 | Varies by quest difficulty |
| Streak day | 20 | Per day of active streak |

### 4.2 Level Formula

Same as IQ: `xpFor(lv) = floor(100 * lv^1.5)`

Level 1 = 0 XP, Level 10 = 3,162 XP, Level 50 = 35,355 XP, Level 100 = 100,000 XP.

### 4.3 Level Titles (100 levels)

```
1-9:    Novice Lifter
10-24:  Iron Beginner
25-49:  Steel Warrior
50-74:  Bronze Beast
75-99:  Silver Sentinel
100:    Iron Titan
```

Titles refine every 10 levels within each tier (e.g., "Novice Lifter I" → "Novice Lifter IX").

### 4.4 Streaks

- Increments when at least 1 workout is logged that day
- Resets to 0 if a day is missed
- Best streak tracked separately
- Streak milestones: 7, 30, 100, 365 days → bonus XP + achievement unlock

### 4.5 Quests

**Daily Quests** (pick 4 per day):
- "Complete 3 sets of any exercise"
- "Log a chest exercise"
- "Log a back exercise"
- "Do 50 total reps"
- "Log a bodyweight exercise"
- "Workout before noon"
- "Log core/abs work"
- "Hit 100 total reps"

**Weekly Quests** (pick 5 per week):
- "Workout 5 days this week"
- "Add weight to any lift"
- "Log 20 total sets"
- "Do a cardio session"
- "Hit a new PR"
- "Complete all daily quests 5x"
- "Log 500 total reps"

**Monthly Quests** (pick 7 per month):
- "Complete 20 workouts"
- "Set 3 new PRs"
- "Workout every week"
- "Log 100 total sets"
- "Hit 2000 total reps"
- "Log body metrics 4x"
- "Complete all weekly quests"

**Lifetime Quests** (always visible):
- "Complete 50 workouts" → 2,000 XP
- "Complete 100 workouts" → 5,000 XP
- "Complete 500 workouts" → 20,000 XP
- "Complete 1000 workouts" → 50,000 XP
- "Hit 50 PRs" → 15,000 XP
- "Reach Level 50" → 25,000 XP
- "Reach Level 100" → 100,000 XP

## 5. Data Model

### 5.1 State Object

```js
{
  // Workout log: { "2026-09-16": { workouts: [...], totalSets: 0, totalReps: 0 } }
  log: {},

  // Gamification
  xp: 0,
  lv: 1,
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,

  // Quests
  dq: [], wq: [], mq: [], yq: [], lq: [],
  qd: '', wqd: '', mqd: '', yqd: '', lqd: '',

  // Goals & PRs
  goals: [],  // [{ id, name, target, current, unit, exerciseId, createdAt, completedAt }]
  prs: {},    // { "bench_press": { weight: 100, reps: 1, date: "2026-09-16" } }

  // Body metrics
  bodyMetrics: [],  // [{ date, weight, bodyFat, chest, waist, arms, thighs }]

  // Achievements
  achievements: {},  // { "first_workout": { unlocked: true, date: "..." } }

  // Titles & cosmetics
  ownedTitles: [],
  activeTitle: null,

  // Settings
  units: 'kg',  // 'kg' or 'lbs'
  theme: 'dark',
  lastTab: 'today',
  lastCat: null,
  lastSub: null,

  // Tracking
  totalWorkouts: 0,
  totalSets: 0,
  totalReps: 0,
  totalPRs: 0,

  // Schema
  schemaVersion: 1
}
```

### 5.2 Exercise Database

~60 exercises across 7 muscle groups + cardio:

**Chest** (8): Barbell Bench Press, Incline DB Press, Decline Bench Press, DB Flyes, Cable Crossover, Push-ups, Dips (chest), Chest Press Machine

**Back** (8): Deadlift, Barbell Row, Pull-ups, Lat Pulldown, Seated Cable Row, DB Row, T-Bar Row, Chin-ups

**Legs** (10): Barbell Squat, Front Squat, Leg Press, Romanian Deadlift, Walking Lunges, Leg Curl, Leg Extension, Calf Raises, Goblet Squat, Bulgarian Split Squat

**Shoulders** (6): Overhead Press, Lateral Raise, Front Raise, Face Pulls, Arnold Press, Rear Delt Flyes

**Arms** (6): Barbell Curl, Tricep Pushdown, Hammer Curl, Skull Crushers, Preacher Curl, Overhead Tricep Extension

**Core** (6): Plank, Hanging Leg Raise, Cable Crunch, Russian Twist, Ab Rollout, Lying Leg Raise

**Bodyweight** (6): Push-ups, Pull-ups, Dips, Squats, Lunges, Plank (duplicated from above as bodyweight category)

**Cardio** (4): Running, Cycling, Jump Rope, Rowing

Each exercise has: `{ id, name, muscle, type (barbell/dumbbell/bodyweight/machine/cardio), xp }`

### 5.3 Workout Log Entry

```js
{
  id: "w_2026-09_16_1",
  date: "2026-09-16",
  type: "detailed",  // or "quick"
  exercises: [
    {
      exerciseId: "bench_press",
      sets: [
        { weight: 80, reps: 10, done: true },
        { weight: 85, reps: 8, done: true },
        { weight: 90, reps: 6, done: true }
      ]
    }
  ],
  duration: 45,  // minutes
  notes: "",
  xpEarned: 110
}
```

**Quick log entry:**
```js
{
  id: "w_2026-09_16_2",
  date: "2026-09-16",
  type: "quick",
  exercises: [
    { exerciseId: "pushups", sets: 1, reps: 50, weight: 0 }
  ],
  duration: 15,
  xpEarned: 35
}
```

## 6. Visual Theme

### 6.1 Color Palette

```css
:root {
  --bg: #0a0a0a;
  --bg-accent: #111111;
  --card: #1a1a1a;
  --card2: #222222;
  --primary: #FF4500;
  --primary-light: #FF6B35;
  --primary-dark: #CC3700;
  --gold: #FFB800;
  --green: #00C853;
  --red: #FF1744;
  --text: #F5F5F5;
  --text2: #888888;
  --border: rgba(255,255,255,0.08);
  --shadow: 0 12px 36px -8px rgba(0,0,0,0.6);
  --radius: 18px;
  --radius-sm: 12px;
}
```

### 6.2 UI Elements

- **Level Badge**: Circular, red-orange gradient border, glow effect
- **XP Bar**: Red-orange shimmer animation (same as IQ gold but recolored)
- **Streak Bar**: Fire emoji with orange glow, best streak counter
- **Exercise Cards**: Dark cards, red accent on hover, green checkmark when completed
- **Confetti**: Red, orange, gold particles on level-up
- **Intro Screen**: "IRON BUILD" metallic text, "Lift · Build · Grow · Ascend" tagline, red-orange gradient CTA button

### 6.3 Animations

Reuse IQ's animation system:
- `shimmer` — XP bar glow
- `xp-pulse` — XP bar pulse
- `card-check` — Exercise completion bounce
- `soft-in` — Panel fade-in
- `confetti fall` — Level-up celebration

## 7. Warm-up Routines

Pre-built warm-up routines displayed in the Warm-up tab:

- **Upper Body**: Arm circles, band pull-aparts, shoulder dislocates, push-up walkouts
- **Lower Body**: Leg swings, hip circles, bodyweight squats, walking lunges
- **Full Body**: Jumping jacks, inchworms, world's greatest stretch, cat-cow
- **Push Day**: Band pull-aparts, dumbbell external rotation, incline push-ups
- **Pull Day**: Dead hangs, band pull-aparts, scapular pull-ups, cat-cow
- **Leg Day**: Bodyweight squats, leg swings, hip circles, glute bridges

Each routine shows a list of movements with reps/duration. No XP for warm-ups (they're guidance, not tracked). Displayed as info cards.

## 8. Features

### 7.1 Workout Logging
- **Detailed mode**: Pick exercise → add sets (weight + reps) → save workout
- **Quick mode**: Pick exercise → enter total reps + weight → save
- XP awarded per exercise logged
- Bonus XP for completing all planned sets
- PR detection: compare against stored max weight/reps

### 7.2 Goal Setting
- Create custom goals: "Bench 100kg", "Do 20 pull-ups", "Workout 4x/week"
- Track current progress vs target
- Mark goals as completed → earn achievement
- Goals can be exercise-specific or general

### 7.3 Body Metrics
- Log weight, body fat %, measurements (chest, waist, arms, thighs)
- View trends over time
- XP for logging metrics

### 7.4 PR History
- Auto-detect personal records when logging workouts
- Store best weight, best reps, best estimated 1RM per exercise
- PR celebration toast + XP reward

### 7.5 Calendar View
- Monthly calendar showing workout days (colored dots)
- Tap a day to see that day's workouts
- Streak visualization

### 7.6 Analytics
- Total workouts, sets, reps, PRs
- Weekly/monthly comparison charts
- Muscle group distribution pie chart
- XP earned over time

### 7.7 Shop
- Spend XP on cosmetic titles, profile frames
- Same pattern as IQ shop

### 7.8 Profile
- Set display name
- Choose active title
- Units (kg/lbs)
- Data export/import
- Theme toggle (dark/darker)

## 8. Tab Groups

```js
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
    { id: 'prs', icon: '🏆', label: 'PR History' },
    { id: 'milestones', icon: '📍', label: 'Milestones' }
  ],
  quests: [
    { id: 'daily', icon: '📅', label: 'Daily' },
    { id: 'weekly', icon: '📆', label: 'Weekly' },
    { id: 'monthly', icon: '🗓️', label: 'Monthly' },
    { id: 'yearly', icon: '📅', label: 'Yearly' },
    { id: 'lifetime', icon: '♾️', label: 'Lifetime' }
  ],
  progress: [
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'stats', icon: '📊', label: 'Stats' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'body', icon: '⚖️', label: 'Body Metrics' }
  ],
  rewards: [
    { id: 'achievements', icon: '🏆', label: 'Achievements' },
    { id: 'shop', icon: '🛍️', label: 'Shop' },
    { id: 'titles', icon: '👑', label: 'Titles' }
  ],
  profile: [
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'data', icon: '💾', label: 'Data' }
  ]
};
```

## 9. Achievements

| Achievement | Condition | XP |
|-------------|-----------|-----|
| First Workout | Log first workout | 100 |
| Week Warrior | 7-day streak | 500 |
| Month Master | 30-day streak | 2,000 |
| Iron Year | 365-day streak | 10,000 |
| Century Club | 100 workouts | 3,000 |
| Half Millennium | 500 workouts | 15,000 |
| Thousand Reps | 1000 total reps | 1,000 |
| Ten Thousand | 10,000 total reps | 5,000 |
| PR Hunter | 10 PRs | 2,000 |
| PR Legend | 50 PRs | 10,000 |
| Goal Getter | Complete 5 goals | 2,000 |
| Goal Master | Complete 20 goals | 8,000 |
| Consistent | Workout 4x in one week | 500 |
| Perfectionist | Complete all daily quests in a day | 300 |
| Body Aware | Log body metrics 10 times | 1,000 |
| Early Bird | Log a workout before 7am | 200 |
| Night Owl | Log a workout after 10pm | 200 |
| Bench Press 100kg | Bench 100kg | 1,000 |
| Squat 100kg | Squat 100kg | 1,000 |
| Deadlift 100kg | Deadlift 100kg | 1,000 |

## 10. Testing

- Unit tests for XP calculations, level formulas, quest completion logic
- State migration tests
- Exercise data integrity tests
- Same test runner as IQ: `node --test`

## 11. PWA

- Service worker with cache-first strategy
- Web app manifest with icons
- Offline support (all data in localStorage)
- Installable on mobile and desktop
