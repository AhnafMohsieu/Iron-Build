# Iron Build

A gym and exercise tracking PWA with RPG gamification. Log workouts, level up, complete quests, and track your fitness progress — all with a dark, energy-driven UI.

**Live Demo:** [ahnanfmoshieu.github.io/Iron-Build](https://ahnafmohsieu.github.io/Iron-Build)

## Features

### Workout Tracking
- **Workout Log** — Full workout sessions with sets, reps, and weight tracking
- **Quick Log** — Fast single-exercise logging for casual sessions
- **Exercise Database** — 48 exercises across 8 muscle groups with descriptions and XP values
- **PR History** — Track personal records and see your progression over time

### RPG Gamification
- **XP & Levels** — Earn XP from workouts, level up from Novice Lifter to Iron Titan (100 levels)
- **Quests** — Daily, weekly, monthly, and lifetime challenges with XP rewards
- **Achievements** — 20 milestones to unlock as you progress
- **Streak System** — Track consecutive workout days with streak multipliers
- **Shop** — Spend earned XP on cosmetic rewards and boosts

### Progress & Analytics
- **Calendar View** — Visual heatmap of workout days
- **Body Metrics** — Log weight, body fat, and measurements over time
- **Stats Dashboard** — Total workouts, XP earned, and personal records at a glance
- **Goals** — Set and track active fitness goals

### PWA
- Installable on mobile and desktop
- Works offline with service worker caching
- Mobile-first responsive design

## Tech Stack

- **HTML/CSS/JS** — Vanilla, no frameworks or bundlers
- **IIFE Modules** — Clean encapsulation with `window.*` exports
- **localStorage** — Persistent state with schema versioning
- **Noto Emoji Icons** — 37 PNG icons rendered via `<img>` tags
- **Sora Font** — Consistent typography matching IQ design language

## Getting Started

```bash
# Clone the repo
git clone https://github.com/AhnafMohsieu/Iron-Build.git
cd Iron-Build

# Open in browser
# Just open index.html — no build step needed
```

## Project Structure

```
Iron-Build/
├── index.html              # Entry point, script loading order
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── styles/
│   └── main.css            # Mobile-first CSS (520/768/1024 breakpoints)
├── core/
│   ├── helpers.js          # Utilities (today, escapeHTML, formatNumber)
│   ├── storage.js          # localStorage wrapper with schema versioning
│   ├── state.js            # Global state, level system, XP formulas
│   ├── xp.js               # XP granting, level-up detection, sound effects
│   ├── tabs.js             # Tab navigation (tier1/tier2)
│   ├── render.js           # Static DOM rendering
│   └── actions.js          # Global action handlers
├── data/
│   ├── icons.js            # Noto Emoji icon map + gymIcon() helper
│   ├── levels.js           # 100 level titles
│   ├── exercises.js        # 48 exercises with XP and descriptions
│   ├── tab-groups.js       # Tab/category configuration
│   ├── quests.js           # Quest generation templates
│   ├── warmup-routines.js  # 6 warm-up routines
│   └── achievements.js     # 20 achievements
├── features/
│   ├── workout-log.js      # Workout logging (detailed + quick)
│   ├── goals.js            # Goal setting and tracking
│   ├── body-metrics.js     # Body measurements
│   ├── achievements.js     # Achievement unlocking
│   ├── shop.js             # XP shop
│   ├── calendar.js         # Calendar heatmap
│   ├── profile.js          # Settings
│   ├── analytics.js        # Stats display
│   ├── quests.js           # Quest system
│   └── pr-history.js       # Personal record tracking
├── render/
│   └── dynamic.js          # Panel rendering per tab
├── assets/
│   └── icons/              # 37 Noto Emoji PNGs
└── tests/
    ├── state.test.js       # State + level system tests
    ├── xp.test.js          # XP pipeline tests
    ├── workout.test.js     # Workout logging tests
    └── quests.test.js      # Quest system tests
```

## Tests

```bash
node --test tests/
```

25 tests across 7 suites — helpers, storage, state, levels, XP, workouts, and quests.

## License

MIT
