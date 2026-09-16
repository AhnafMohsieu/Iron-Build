# Iron Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gym/exercise tracking PWA with RPG gamification (XP, levels, quests, achievements) mirroring the Ibadah Quest architecture.

**Architecture:** Vanilla JS IIFE modules with `window.*` exports, localStorage persistence with schema versioning, CSS custom properties for theming, no bundler. Script tags loaded in dependency order with `defer`.

**Tech Stack:** Vanilla JavaScript, CSS custom properties, localStorage, Service Worker (PWA), Node.js built-in test runner.

## Global Constraints

- No build step, no bundler, no framework dependencies
- All data stored in localStorage with `ironbuild_` prefix
- Schema versioning via `freshState()` / `normalizeState()`
- IIFE-per-module pattern with `window.*` exports
- XSS-safe rendering via `escapeHTML()`
- Tests via `node --test`
- Dark + Red/Orange color theme (`--primary: #FF4500`, `--gold: #FFB800`)

---

## File Structure

```
Gym/
├── index.html                    # SPA entry point, script tags, intro overlay
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker (cache-first)
├── styles/
│   └── main.css                  # All CSS with custom properties
├── core/
│   ├── helpers.js                # escapeHTML, today, date helpers
│   ├── storage.js                # localStorage wrapper with schema versioning
│   ├── state.js                  # freshState, normalizeState, load/save, S global
│   ├── xp.js                     # applyXpDelta, spendXp, grantDailyXp, levelUpToast
│   ├── tabs.js                   # Tab navigation, tier switching
│   ├── render.js                 # Static DOM rendering (header, level bar, streak)
│   ├── random.js                 # weightedPick utility
│   └── actions.js                # App facade, boot sequence, modal queue
├── data/
│   ├── levels.js                 # LEVELS array (100 gym-themed titles)
│   ├── exercises.js              # EXERCISES array (~60 exercises)
│   ├── tab-groups.js             # TAB_GROUPS config
│   ├── quests.js                 # DQUESTS, WQUESTS, MQUESTS, YQUESTS, LQUESTS
│   ├── achievements.js           # ACHIEVEMENTS array
│   ├── tips.js                   # FITNESS_TIPS array
│   ├── streak-msgs.js            # STREAK_MSGS array
│   ├── warmup-routines.js        # WARMUP_ROUTINES object
│   └── shop-items.js             # SHOP_ITEMS array
├── features/
│   ├── workout-log.js            # Workout logging (detailed + quick mode)
│   ├── goals.js                  # Goal setting + tracking
│   ├── body-metrics.js           # Body weight/measurements
│   ├── pr-history.js             # Personal record tracking + detection
│   ├── quests.js                 # Quest generation, checking, toggling
│   ├── achievements.js           # Achievement unlock logic
│   ├── calendar.js               # Monthly workout calendar
│   ├── analytics.js              # Stats dashboard
│   ├── shop.js                   # XP spending shop
│   └── profile.js                # Settings, data export/import
├── render/
│   ├── dynamic.js                # Dynamic panel rendering (exercises, workouts)
│   └── modals.js                 # Toast/level-up modals
└── tests/
    ├── state.test.js             # State management tests
    ├── xp.test.js                # XP calculation tests
    ├── quests.test.js            # Quest completion tests
    ├── achievements.test.js      # Achievement unlock tests
    └── exercises.test.js         # Exercise data integrity tests
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `Gym/index.html`
- Create: `Gym/styles/main.css`
- Create: `Gym/manifest.json`

**Interfaces:**
- Consumes: none (first task)
- Produces: HTML shell with CSS custom properties, PWA manifest, script loading order

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes, viewport-fit=cover">
  <title>Iron Build · Your Gym Companion</title>
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0a0a0a">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <!-- Intro Overlay -->
  <div id="introOverlay" class="intro-overlay">
    <div class="intro-content">
      <div class="intro-icon">🏋️</div>
      <h1 class="intro-title">IRON BUILD</h1>
      <p class="intro-subtitle">Lift · Build · Grow · Ascend</p>
      <button id="startBtn" class="intro-btn">Start Your Journey</button>
    </div>
  </div>

  <!-- Toast Overlay -->
  <div id="toastOverlay" class="toast-overlay"></div>

  <!-- App Shell -->
  <div class="app" id="app">
    <header class="header">
      <h1 class="header-title">Iron Build</h1>
      <div class="header-subtitle">Lift · Build · Grow · Ascend</div>
    </header>

    <div class="level-row">
      <div class="level-badge">
        <span class="lv-num" id="lvNum">1</span>
        <span class="lv-title" id="lvTitle">Novice Lifter</span>
      </div>
      <div class="xp-wrap" id="xpWrap">
        <div class="xp-outer"><div class="xp-inner" id="xpBar" style="width:0%"></div></div>
        <div class="xp-label" id="xpLabel">0 / 100 XP</div>
      </div>
    </div>

    <div class="streak-bar">
      <span class="streak-fire">🔥</span>
      <div class="streak-info">
        <h3 id="strDays">0 Day Streak</h3>
        <p id="strMsg">Start your journey today</p>
      </div>
      <div class="streak-best">
        <div class="best-num" id="bestStr">0</div>
        <div class="best-label">All-Time</div>
      </div>
    </div>

    <div class="tier-nav-container">
      <div class="tier1-tabs" id="tier1Tabs"></div>
      <div class="tier2-scroll"><div class="tier2-tabs" id="tier2Tabs"></div></div>
    </div>

    <!-- Tab panels rendered dynamically -->
    <div id="panelContainer"></div>
  </div>

  <!-- Scripts in dependency order -->
  <script src="core/helpers.js"></script>
  <script src="core/storage.js"></script>
  <script src="data/levels.js"></script>
  <script src="core/state.js"></script>
  <script src="core/random.js"></script>
  <script src="core/xp.js"></script>
  <script src="data/tab-groups.js"></script>
  <script src="data/exercises.js"></script>
  <script src="data/quests.js"></script>
  <script src="data/achievements.js"></script>
  <script src="data/tips.js"></script>
  <script src="data/streak-msgs.js"></script>
  <script src="data/warmup-routines.js"></script>
  <script src="data/shop-items.js"></script>
  <script src="core/tabs.js"></script>
  <script src="core/render.js"></script>
  <script src="render/modals.js"></script>
  <script src="render/dynamic.js"></script>
  <script src="features/workout-log.js"></script>
  <script src="features/goals.js"></script>
  <script src="features/body-metrics.js"></script>
  <script src="features/pr-history.js"></script>
  <script src="features/quests.js"></script>
  <script src="features/achievements.js"></script>
  <script src="features/calendar.js"></script>
  <script src="features/analytics.js"></script>
  <script src="features/shop.js"></script>
  <script src="features/profile.js"></script>
  <script src="core/actions.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `styles/main.css`**

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
  --border-primary: rgba(255,69,0,0.18);
  --shadow: 0 12px 36px -8px rgba(0,0,0,0.6);
  --shadow-primary: 0 0 24px rgba(255,69,0,0.15);
  --radius: 18px;
  --radius-sm: 12px;
  --font: 'Inter', system-ui, -apple-system, sans-serif;
  --ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes xp-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,69,0,0); }
  50% { box-shadow: 0 0 12px 2px rgba(255,69,0,0.25); }
}
@keyframes card-check {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes soft-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes streak-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0); }
  50% { box-shadow: 0 0 20px 4px rgba(255,107,53,0.12); }
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  background-image:
    radial-gradient(ellipse at 50% -10%, rgba(255,69,0,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 80%, rgba(255,184,0,0.03) 0%, transparent 50%);
  overflow-x: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.app { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 16px 18px 80px; }

/* Intro */
.intro-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, #020202 0%, #0a0a0a 60%, #111 100%);
  z-index: 99999; display: flex; align-items: center; justify-content: center;
  text-align: center; transition: opacity 0.9s ease, transform 0.9s ease;
}
.intro-overlay.hidden { opacity: 0; transform: scale(1.06); pointer-events: none; }
.intro-icon { font-size: 64px; margin-bottom: 18px; filter: drop-shadow(0 0 30px rgba(255,69,0,0.5)); }
.intro-title {
  font-size: clamp(2rem, 6vw, 3.2rem); font-weight: 900; color: #FFF;
  letter-spacing: 4px; margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(255,69,0,0.4);
}
.intro-subtitle {
  font-size: 0.82rem; color: var(--text2); letter-spacing: 4px;
  text-transform: uppercase; margin-bottom: 44px;
}
.intro-btn {
  padding: 16px 48px; font-size: 1rem; font-family: var(--font); font-weight: 700;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #FFF; border: none; border-radius: 28px; cursor: pointer;
  box-shadow: 0 12px 36px rgba(255,69,0,0.4), 0 0 0 1px rgba(255,69,0,0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.intro-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(255,69,0,0.5); }

/* Header */
.header { text-align: center; padding: 44px 0 28px; animation: soft-in 0.6s ease; }
.header-title {
  font-size: clamp(1.9rem, 5vw, 2.8rem); font-weight: 900; color: #FFF;
  letter-spacing: 1px;
}
.header-subtitle {
  font-size: 0.78rem; color: var(--primary); letter-spacing: 3.5px;
  text-transform: uppercase; font-weight: 600; opacity: 0.85; margin-top: 6px;
}

/* Level Row */
.level-row { display: flex; align-items: center; justify-content: center; gap: 18px; margin: 18px 0 36px; flex-wrap: wrap; }
.level-badge {
  background: linear-gradient(135deg, var(--card) 0%, rgba(255,69,0,0.06) 100%);
  border: 1px solid var(--border-primary); border-radius: 40px;
  padding: 10px 22px; display: flex; align-items: center; gap: 12px;
  box-shadow: var(--shadow), var(--shadow-primary);
}
.lv-num { font-size: 1.9rem; font-weight: 900; color: var(--primary); line-height: 1; }
.lv-title { font-size: 0.7rem; color: var(--text2); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }

/* XP Bar */
.xp-wrap { flex: 1; min-width: 200px; max-width: 300px; cursor: pointer; }
.xp-outer { background: rgba(0,0,0,0.5); border-radius: 20px; height: 10px; overflow: hidden; border: 1px solid var(--border); }
.xp-inner {
  height: 100%; border-radius: 20px;
  background: linear-gradient(90deg, var(--primary-dark), var(--primary), var(--primary-light), var(--primary));
  background-size: 200% auto;
  animation: shimmer 3s linear infinite, xp-pulse 4s ease-in-out infinite;
  transition: width 0.9s var(--ease);
}
.xp-label { font-size: 0.72rem; color: var(--text2); text-align: center; margin-top: 7px; font-weight: 500; }

/* Streak */
.streak-bar {
  background: linear-gradient(135deg, var(--card) 0%, rgba(255,107,53,0.04) 100%);
  border: 1px solid rgba(255,107,53,0.14); border-radius: var(--radius);
  padding: 20px 22px; display: flex; align-items: center; gap: 18px;
  margin-bottom: 28px; box-shadow: var(--shadow);
  transition: transform 0.25s ease, border-color 0.25s ease;
  animation: streak-glow 5s ease-in-out infinite;
}
.streak-bar:hover { transform: translateY(-2px); border-color: rgba(255,107,53,0.3); }
.streak-fire { font-size: 42px; filter: drop-shadow(0 2px 10px rgba(255,107,53,0.45)); flex-shrink: 0; }
.streak-info h3 { font-size: 1.2rem; font-weight: 700; color: #FFF; }
.streak-info p { font-size: 0.82rem; color: var(--text2); margin-top: 3px; }
.streak-best {
  margin-left: auto; text-align: center;
  background: rgba(255,107,53,0.08); border: 1px solid rgba(255,107,53,0.18);
  border-radius: 14px; padding: 9px 18px; flex-shrink: 0;
}
.best-num { font-size: 1.7rem; font-weight: 700; color: var(--primary-light); line-height: 1; }
.best-label { font-size: 0.62rem; color: var(--text2); letter-spacing: 2px; text-transform: uppercase; margin-top: 3px; }

/* Tabs */
.tier-nav-container {
  background: var(--card); border-radius: var(--radius); padding: 18px 14px;
  margin-bottom: 28px; box-shadow: var(--shadow); border: 1px solid var(--border);
}
.tier1-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.t1-btn {
  flex: 0 1 calc(25% - 6px); min-width: 78px; background: transparent;
  color: var(--text2); border: 1px solid transparent; font-size: 0.82rem;
  font-weight: 500; padding: 9px 6px; cursor: pointer; border-radius: 10px;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.t1-btn:hover { color: var(--text); background: rgba(255,255,255,0.04); }
.t1-btn.active {
  color: var(--primary); background: rgba(255,69,0,0.09);
  border-color: var(--border-primary); font-weight: 600;
}

.tier2-scroll { width: 100%; overflow-x: auto; scrollbar-width: none; }
.tier2-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 18px; padding: 2px; }
.t2-btn {
  background: rgba(0,0,0,0.18); border: 1px solid var(--border); color: var(--text2);
  padding: 13px 6px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;
  cursor: pointer; transition: all 0.22s ease; display: flex; flex-direction: column;
  align-items: center; gap: 7px; line-height: 1.2; text-align: center;
}
.t2-btn span { font-size: 1.5rem; opacity: 0.9; }
.t2-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); transform: translateY(-1px); }
.t2-btn.active {
  background: rgba(255,69,0,0.09); color: var(--primary);
  border-color: var(--border-primary); font-weight: 600;
}

/* Panels */
.tab-panel { display: none; animation: soft-in 0.35s ease; }
.tab-panel.active { display: block; }

.section-title {
  font-size: 1.1rem; font-weight: 700; color: var(--primary);
  margin: 28px 0 14px; display: flex; align-items: center; gap: 10px;
  letter-spacing: 0.5px; opacity: 0.9;
}
.section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-primary) 0%, transparent 100%); }

/* Cards */
.card {
  background: var(--card2); border-radius: var(--radius-sm); padding: 18px;
  display: flex; align-items: center; gap: 14px;
  border: 1px solid var(--border); transition: transform 0.22s var(--ease), border-color 0.22s, background 0.22s;
  cursor: pointer; margin-bottom: 10px;
}
.card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12); box-shadow: var(--shadow); background: var(--card); }
.card.done { border-color: rgba(0,200,83,0.28); background: rgba(0,200,83,0.05); }

.card-check {
  width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  transition: all 0.3s var(--ease); background: rgba(0,0,0,0.2); flex-shrink: 0;
}
.card.done .card-check {
  background: var(--green); border-color: var(--green); color: white;
  animation: card-check 0.4s var(--ease);
}

.card-info { flex: 1; min-width: 0; }
.card-name { font-weight: 600; font-size: 1.05rem; color: #FFF; }
.card-meta { font-size: 0.7rem; color: var(--text2); margin-top: 3px; letter-spacing: 0.8px; text-transform: uppercase; }
.card-xp {
  font-weight: 600; color: var(--gold); background: rgba(255,184,0,0.09);
  border: 1px solid rgba(255,184,0,0.18); padding: 5px 11px;
  border-radius: 20px; font-size: 0.76rem; white-space: nowrap; flex-shrink: 0;
}

/* Grid layouts */
.exercise-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; }
.exercise-card { flex-direction: column; text-align: center; padding: 20px 14px; gap: 10px; }
.exercise-icon { font-size: 2rem; opacity: 0.9; }
.exercise-name { font-weight: 500; font-size: 0.85rem; line-height: 1.4; }
.exercise-xp { font-size: 0.72rem; color: var(--gold); font-weight: 600; }

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: #FFF; border: none; padding: 14px 28px; border-radius: 20px;
  font-weight: 600; cursor: pointer; font-size: 0.95rem; font-family: var(--font);
  transition: all 0.22s ease;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,69,0,0.3); }

.btn-secondary {
  background: var(--card2); color: var(--text); border: 1px solid var(--border);
  padding: 12px 24px; border-radius: 18px; font-weight: 600; cursor: pointer;
  font-size: 0.9rem; font-family: var(--font); transition: all 0.22s ease;
}
.btn-secondary:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.18); }

/* Toast */
.toast-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 9999; display: flex; align-items: center; justify-content: center;
  pointer-events: none; background: rgba(0,0,0,0.45); opacity: 0;
  transition: opacity 0.28s ease; backdrop-filter: blur(6px);
}
.toast-overlay.show { opacity: 1; }
.toast-box {
  background: linear-gradient(145deg, rgba(30,20,18,0.96) 0%, rgba(15,10,8,0.98) 100%);
  border: 1px solid rgba(255,69,0,0.2); border-radius: 22px;
  padding: 28px 38px; text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,69,0,0.08);
  transform: translateY(24px) scale(0.96);
  transition: transform 0.32s var(--ease), opacity 0.28s ease;
  pointer-events: auto; max-width: 340px;
}
.toast-overlay.show .toast-box { transform: translateY(0) scale(1); }
.toast-box .toast-icon { display: block; margin-bottom: 10px; font-size: 2.4rem; }
.toast-box h3 { font-size: 1.2rem; font-weight: 700; color: #FFF; margin: 0; line-height: 1.4; }

/* Confetti */
.confetti { position: fixed; pointer-events: none; z-index: 10000; animation: fall var(--fall-dur) linear forwards; font-size: 2rem; }
@keyframes fall { 0%{transform:translateY(-10vh) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(var(--rot));opacity:0} }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
::selection { background: rgba(255,69,0,0.25); color: #FFF; }

/* Mobile */
@media (max-width: 480px) {
  .app { padding: 12px 14px 70px; }
  .header { padding: 32px 0 20px; }
  .tier2-tabs { grid-template-columns: repeat(3, 1fr); }
  .t1-btn { flex: 0 1 calc(33% - 6px); font-size: 0.78rem; }
  .exercise-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .streak-fire { font-size: 36px; }
}

html { scroll-behavior: smooth; }
```

- [ ] **Step 3: Create `manifest.json`**

```json
{
  "name": "Iron Build",
  "short_name": "Iron Build",
  "description": "Gym & Exercise Tracker with RPG Gamification",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "assets/icons/icon-192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "assets/icons/icon-512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

- [ ] **Step 4: Open `index.html` in browser and verify**

Expected: Dark page with "IRON BUILD" intro overlay, red-orange gradient button. Click button → overlay fades, main app shell visible with header, level badge, XP bar, streak bar, empty tab area.

- [ ] **Step 5: Commit**

```bash
git add index.html styles/main.css manifest.json
git commit -m "feat: project scaffolding with dark+red-orange theme"
```

---

## Task 2: Core Helpers + Storage

**Files:**
- Create: `Gym/core/helpers.js`
- Create: `Gym/core/storage.js`
- Test: `Gym/tests/state.test.js`

**Interfaces:**
- Consumes: none
- Produces: `escapeHTML()`, `today()`, `getTodayKey()`, `getYesterdayKey()`, `getWeekAgoKey()`, `Storage.save()`, `Storage.load()`

- [ ] **Step 1: Create `core/helpers.js`**

```js
// core/helpers.js — Shared utilities
(function() {
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function today(d) {
    var d2 = d || new Date();
    return d2.getFullYear() + '-' + (d2.getMonth()+1).toString().padStart(2,'0') + '-' + d2.getDate().toString().padStart(2,'0');
  }

  function getTodayKey() { return today(); }

  function getYesterdayKey() {
    var d = new Date(); d.setDate(d.getDate() - 1); return today(d);
  }

  function getWeekAgoKey() {
    var d = new Date(); d.setDate(d.getDate() - 7); return today(d);
  }

  window.escapeHTML = escapeHTML;
  window.today = today;
  window.getTodayKey = getTodayKey;
  window.getYesterdayKey = getYesterdayKey;
  window.getWeekAgoKey = getWeekAgoKey;
})();
```

- [ ] **Step 2: Create `core/storage.js`**

```js
// core/storage.js — Schema-versioned localStorage wrapper
(function() {
  var PREFIX = 'ironbuild_';

  var Storage = {
    save: function(key, data) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn('Storage save failed:', e);
        return false;
      }
    },
    load: function(key) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Storage load failed:', e);
        return null;
      }
    },
    remove: function(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) {}
    },
    clear: function() {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) keys.push(k);
        }
        keys.forEach(function(k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
  };

  window.Storage = Storage;
})();
```

- [ ] **Step 3: Create `tests/state.test.js`**

```js
// tests/state.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Minimal localStorage mock for Node
global.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k,v) { this._d[k]=v; }, removeItem(k) { delete this._d[k]; }, length: 0, key(i) { return Object.keys(this._d)[i]; } };
global.window = global;

// Load modules
require('../core/helpers.js');
require('../core/storage.js');

describe('helpers', () => {
  it('today returns YYYY-MM-DD', () => {
    const t = today();
    assert.match(t, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('escapeHTML escapes special chars', () => {
    assert.equal(escapeHTML('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('getTodayKey matches today', () => {
    assert.equal(getTodayKey(), today());
  });
});

describe('Storage', () => {
  it('save and load round-trips', () => {
    Storage.save('test', { xp: 100, lv: 5 });
    const loaded = Storage.load('test');
    assert.deepEqual(loaded, { xp: 100, lv: 5 });
  });

  it('load returns null for missing key', () => {
    assert.equal(Storage.load('nonexistent'), null);
  });

  it('remove deletes the key', () => {
    Storage.save('toDelete', true);
    Storage.remove('toDelete');
    assert.equal(Storage.load('toDelete'), null);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/state.test.js`
Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add core/helpers.js core/storage.js tests/state.test.js
git commit -m "feat: core helpers and storage with tests"
```

---

## Task 3: State Management

**Files:**
- Create: `Gym/data/levels.js`
- Create: `Gym/core/state.js`
- Test: `Gym/tests/state.test.js` (extend)

**Interfaces:**
- Consumes: `Storage.save()`, `Storage.load()`, `today()`
- Produces: `S` (global state), `freshState()`, `normalizeState()`, `loadState()`, `saveState()`, `lvFrom()`, `lvTitle()`, `xpFor()`

- [ ] **Step 1: Create `data/levels.js`**

```js
// data/levels.js — Gym-themed level titles (100 levels)
const LEVELS = [
  { m:1, t:'Novice Lifter I' }, { m:2, t:'Novice Lifter II' }, { m:3, t:'Novice Lifter III' },
  { m:4, t:'Novice Lifter IV' }, { m:5, t:'Novice Lifter V' }, { m:6, t:'Novice Lifter VI' },
  { m:7, t:'Novice Lifter VII' }, { m:8, t:'Novice Lifter VIII' }, { m:9, t:'Novice Lifter IX' },
  { m:10, t:'Iron Beginner I' }, { m:11, t:'Iron Beginner II' }, { m:12, t:'Iron Beginner III' },
  { m:13, t:'Iron Beginner IV' }, { m:14, t:'Iron Beginner V' }, { m:15, t:'Iron Beginner VI' },
  { m:16, t:'Iron Beginner VII' }, { m:17, t:'Iron Beginner VIII' }, { m:18, t:'Iron Beginner IX' },
  { m:19, t:'Iron Beginner X' }, { m:20, t:'Iron Beginner XI' }, { m:21, t:'Iron Beginner XII' },
  { m:22, t:'Iron Beginner XIII' }, { m:23, t:'Iron Beginner XIV' }, { m:24, t:'Iron Beginner XV' },
  { m:25, t:'Steel Warrior I' }, { m:26, t:'Steel Warrior II' }, { m:27, t:'Steel Warrior III' },
  { m:28, t:'Steel Warrior IV' }, { m:29, t:'Steel Warrior V' }, { m:30, t:'Steel Warrior VI' },
  { m:31, t:'Steel Warrior VII' }, { m:32, t:'Steel Warrior VIII' }, { m:33, t:'Steel Warrior IX' },
  { m:34, t:'Steel Warrior X' }, { m:35, t:'Steel Warrior XI' }, { m:36, t:'Steel Warrior XII' },
  { m:37, t:'Steel Warrior XIII' }, { m:38, t:'Steel Warrior XIV' }, { m:39, t:'Steel Warrior XV' },
  { m:40, t:'Steel Warrior XVI' }, { m:41, t:'Steel Warrior XVII' }, { m:42, t:'Steel Warrior XVIII' },
  { m:43, t:'Steel Warrior XIX' }, { m:44, t:'Steel Warrior XX' }, { m:45, t:'Steel Warrior XXI' },
  { m:46, t:'Steel Warrior XXII' }, { m:47, t:'Steel Warrior XXIII' }, { m:48, t:'Steel Warrior XXIV' },
  { m:49, t:'Steel Warrior XXV' },
  { m:50, t:'Bronze Beast I' }, { m:51, t:'Bronze Beast II' }, { m:52, t:'Bronze Beast III' },
  { m:53, t:'Bronze Beast IV' }, { m:54, t:'Bronze Beast V' }, { m:55, t:'Bronze Beast VI' },
  { m:56, t:'Bronze Beast VII' }, { m:57, t:'Bronze Beast VIII' }, { m:58, t:'Bronze Beast IX' },
  { m:59, t:'Bronze Beast X' }, { m:60, t:'Bronze Beast XI' }, { m:61, t:'Bronze Beast XII' },
  { m:62, t:'Bronze Beast XIII' }, { m:63, t:'Bronze Beast XIV' }, { m:64, t:'Bronze Beast XV' },
  { m:65, t:'Bronze Beast XVI' }, { m:66, t:'Bronze Beast XVII' }, { m:67, t:'Bronze Beast XVIII' },
  { m:68, t:'Bronze Beast XIX' }, { m:69, t:'Bronze Beast XX' }, { m:70, t:'Bronze Beast XXI' },
  { m:71, t:'Bronze Beast XXII' }, { m:72, t:'Bronze Beast XXIII' }, { m:73, t:'Bronze Beast XXIV' },
  { m:74, t:'Bronze Beast XXV' },
  { m:75, t:'Silver Sentinel I' }, { m:76, t:'Silver Sentinel II' }, { m:77, t:'Silver Sentinel III' },
  { m:78, t:'Silver Sentinel IV' }, { m:79, t:'Silver Sentinel V' }, { m:80, t:'Silver Sentinel VI' },
  { m:81, t:'Silver Sentinel VII' }, { m:82, t:'Silver Sentinel VIII' }, { m:83, t:'Silver Sentinel IX' },
  { m:84, t:'Silver Sentinel X' }, { m:85, t:'Silver Sentinel XI' }, { m:86, t:'Silver Sentinel XII' },
  { m:87, t:'Silver Sentinel XIII' }, { m:88, t:'Silver Sentinel XIV' }, { m:89, t:'Silver Sentinel XV' },
  { m:90, t:'Silver Sentinel XVI' }, { m:91, t:'Silver Sentinel XVII' }, { m:92, t:'Silver Sentinel XVIII' },
  { m:93, t:'Silver Sentinel XIX' }, { m:94, t:'Silver Sentinel XX' }, { m:95, t:'Silver Sentinel XXI' },
  { m:96, t:'Silver Sentinel XXII' }, { m:97, t:'Silver Sentinel XXIII' }, { m:98, t:'Silver Sentinel XXIV' },
  { m:99, t:'Silver Sentinel XXV' },
  { m:100, t:'Iron Titan' }
];
```

- [ ] **Step 2: Create `core/state.js`**

```js
// core/state.js — App state management
(function() {
  var STATE_SCHEMA_VERSION = 1;

  function freshState() {
    var t = today();
    return {
      log: {}, xp: 0, lv: 1, streak: 0, bestStreak: 0, lastActiveDate: null,
      dq: [], wq: [], mq: [], yq: [], lq: [],
      qd: '', wqd: '', mqd: '', yqd: '', lqd: '',
      goals: [], prs: {}, bodyMetrics: [],
      achievements: {}, ownedTitles: [], activeTitle: null,
      units: 'kg', theme: 'dark', lastTab: 'today', lastCat: null, lastSub: null,
      totalWorkouts: 0, totalSets: 0, totalReps: 0, totalPRs: 0,
      schemaVersion: STATE_SCHEMA_VERSION
    };
  }

  function normalizeState(value) {
    var d = freshState();
    var p = value && typeof value === 'object' ? value : d;
    for (var k of Object.keys(d)) {
      if (!(k in p)) p[k] = d[k];
    }
    p.schemaVersion = STATE_SCHEMA_VERSION;
    return p;
  }

  function loadState() {
    var stored = Storage.load('state');
    return normalizeState(stored);
  }

  function saveState() {
    Storage.save('state', S);
  }

  function xpFor(lv) {
    if (lv <= 1) return 0;
    return Math.floor(100 * Math.pow(lv, 1.5));
  }

  function lvFrom(xp) {
    var lv = 1;
    while (xp >= xpFor(lv + 1)) lv++;
    return lv;
  }

  function lvTitle(lv) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (lv <= LEVELS[i].m) return LEVELS[i].t;
    }
    return 'Iron Titan';
  }

  var S = null;

  window.freshState = freshState;
  window.normalizeState = normalizeState;
  window.loadState = loadState;
  window.saveState = saveState;
  window.xpFor = xpFor;
  window.lvFrom = lvFrom;
  window.lvTitle = lvTitle;
  window.S = S;
})();
```

- [ ] **Step 3: Extend `tests/state.test.js`**

Append to existing test file:

```js
// Load levels and state
require('../data/levels.js');
require('../core/state.js');

describe('state', () => {
  it('freshState has all required keys', () => {
    const s = freshState();
    assert.ok(s.log);
    assert.equal(s.xp, 0);
    assert.equal(s.lv, 1);
    assert.equal(s.streak, 0);
    assert.ok(Array.isArray(s.goals));
    assert.ok(typeof s.prs === 'object');
  });

  it('normalizeState fills missing keys', () => {
    const partial = { xp: 500, lv: 1 };
    const normalized = normalizeState(partial);
    assert.equal(normalized.xp, 500);
    assert.ok(normalized.log !== undefined);
    assert.ok(normalized.goals !== undefined);
  });
});

describe('level system', () => {
  it('xpFor(1) = 0', () => { assert.equal(xpFor(1), 0); });

  it('xpFor(2) = floor(100 * 2^1.5) = 282', () => { assert.equal(xpFor(2), 282); });

  it('lvFrom(0) = 1', () => { assert.equal(lvFrom(0), 1); });

  it('lvFrom(282) = 2', () => { assert.equal(lvFrom(282), 2); });

  it('lvTitle(1) = Novice Lifter I', () => { assert.equal(lvTitle(1), 'Novice Lifter I'); });

  it('lvTitle(100) = Iron Titan', () => { assert.equal(lvTitle(100), 'Iron Titan'); });

  it('LEVELS has 100 entries', () => { assert.equal(LEVELS.length, 100); });
});
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/state.test.js`
Expected: All tests pass (helpers + storage + state + levels).

- [ ] **Step 5: Commit**

```bash
git add data/levels.js core/state.js tests/state.test.js
git commit -m "feat: state management with level system"
```

---

## Task 4: XP Pipeline

**Files:**
- Create: `Gym/core/xp.js`
- Create: `Gym/core/random.js`
- Create: `Gym/render/modals.js`
- Test: `Gym/tests/xp.test.js`

**Interfaces:**
- Consumes: `S`, `saveState()`, `lvFrom()`, `lvTitle()`, `xpFor()`
- Produces: `applyXpDelta()`, `spendXp()`, `grantDailyXp()`, `levelUpToast()`, `playSound()`, `weightedPick()`

- [ ] **Step 1: Create `core/random.js`**

```js
// core/random.js — Weighted random selection
(function() {
  function weightedPick(pool) {
    var total = pool.reduce(function(sum, item) { return sum + (item.weight || 1); }, 0);
    var r = Math.random() * total;
    var acc = 0;
    for (var i = 0; i < pool.length; i++) {
      acc += pool[i].weight || 1;
      if (r <= acc) return pool[i];
    }
    return pool[pool.length - 1];
  }
  window.weightedPick = weightedPick;
})();
```

- [ ] **Step 2: Create `render/modals.js`**

```js
// render/modals.js — Toast and level-up modals
(function() {
  function openToastModal(html) {
    var ov = document.getElementById('toastOverlay');
    ov.innerHTML = '<div class="toast-box">' + html + '</div>';
    ov.style.display = 'flex';
    ov.classList.add('show');
    ov.style.pointerEvents = 'auto';
    ov.onclick = function() { closeToastOverlay(); };
  }

  function closeToastOverlay() {
    var ov = document.getElementById('toastOverlay');
    ov.classList.remove('show');
    setTimeout(function() { ov.style.display = 'none'; ov.innerHTML = ''; }, 400);
    ov.style.pointerEvents = 'none';
  }

  window.openToastModal = openToastModal;
  window.closeToastOverlay = closeToastOverlay;
})();
```

- [ ] **Step 3: Create `core/xp.js`**

```js
// core/xp.js — XP granting, level-up detection, sound effects
(function() {
  var _audioCtx = null;

  function playSound(type) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!_audioCtx) _audioCtx = new AC();
      var ctx = _audioCtx;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {}
  }

  function checkLevelUp(oldLv) {
    if (S.lv > oldLv) {
      levelUpToast(S.lv, lvTitle(S.lv));
    }
  }

  function applyXpDelta(delta, opts) {
    var oldLv = S.lv;
    S.xp += delta;
    S.lv = lvFrom(S.xp);
    if (!(opts && opts.skipLevelToast)) checkLevelUp(oldLv);
    return { oldLv: oldLv, newLv: S.lv, leveledUp: S.lv > oldLv };
  }

  function spendXp(amount, opts) {
    var clamped = Math.max(0, S.xp - amount);
    var delta = clamped - S.xp;
    return applyXpDelta(delta, opts);
  }

  function grantDailyXp(amount, key) {
    if (!S.xpDaily) S.xpDaily = {};
    var dk = key + '|' + today();
    if (S.xpDaily[dk]) return false;
    S.xpDaily[dk] = true;
    var oldLv = S.lv;
    S.xp += amount;
    S.lv = lvFrom(S.xp);
    checkLevelUp(oldLv);
    playSound('pop');
    saveState();
    return true;
  }

  function levelUpToast(lv, title) {
    openToastModal(
      '<span class="toast-icon">🔥</span>' +
      '<h3>LEVEL UP</h3>' +
      '<div style="font-size:2.4rem;font-weight:900;color:var(--primary);margin:8px 0">' + lv + '</div>' +
      '<div style="color:var(--text2);font-size:0.9rem">' + escapeHTML(title) + '</div>'
    );
    playSound('chime');
    for (var i = 0; i < 30; i++) {
      var el = document.createElement('span');
      el.className = 'confetti';
      el.textContent = ['🔥','💪','⚡','🏋️','💥','⭐'][i % 6];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = '-20px';
      el.style.setProperty('--fall-dur', (2 + Math.random() * 4) + 's');
      el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(el);
      setTimeout(function(e) { e.remove(); }.bind(null, el), 4000);
    }
  }

  window.applyXpDelta = applyXpDelta;
  window.spendXp = spendXp;
  window.grantDailyXp = grantDailyXp;
  window.levelUpToast = levelUpToast;
  window.playSound = playSound;
})();
```

- [ ] **Step 4: Create `tests/xp.test.js`**

```js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k) { return this._d[k]||null; }, setItem(k,v){this._d[k]=v;} };
global.window = global;

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');

describe('XP system', () => {
  it('applyXpDelta increases xp and checks level', () => {
    S = freshState();
    const result = applyXpDelta(500);
    assert.equal(S.xp, 500);
    assert.ok(S.lv > 1);
    assert.ok(result.leveledUp);
  });

  it('spendXp decreases xp', () => {
    S = freshState();
    S.xp = 1000;
    S.lv = lvFrom(1000);
    spendXp(300);
    assert.equal(S.xp, 700);
  });

  it('spendXp does not go below 0', () => {
    S = freshState();
    S.xp = 50;
    spendXp(100);
    assert.equal(S.xp, 0);
  });

  it('weightedPick returns item from pool', () => {
    const pool = [{v:1,weight:1},{v:2,weight:1}];
    const result = weightedPick(pool);
    assert.ok(pool.some(p => p.v === result.v));
  });
});
```

- [ ] **Step 5: Run tests**

Run: `node --test tests/xp.test.js`
Expected: All 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add core/xp.js core/random.js render/modals.js tests/xp.test.js
git commit -m "feat: XP pipeline with level-up toast and sound"
```

---

## Task 5: Tab Navigation + Exercise Database

**Files:**
- Create: `Gym/data/tab-groups.js`
- Create: `Gym/data/exercises.js`
- Create: `Gym/core/tabs.js`
- Create: `Gym/core/render.js`
- Create: `Gym/render/dynamic.js`

**Interfaces:**
- Consumes: `S`, `saveState()`, `lvTitle()`
- Produces: Tab switching, panel rendering, exercise grid display

- [ ] **Step 1: Create `data/tab-groups.js`**

```js
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
```

- [ ] **Step 2: Create `data/exercises.js`**

```js
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
```

- [ ] **Step 3: Create `core/tabs.js`**

```js
// core/tabs.js — Tab navigation
(function() {
  var currentCat = 'today';
  var currentTab = 'workout';

  function renderTier1() {
    var container = document.getElementById('tier1Tabs');
    container.innerHTML = '';
    CAT_ORDER.forEach(function(cat) {
      var meta = CAT_META[cat];
      var btn = document.createElement('button');
      btn.className = 't1-btn' + (cat === currentCat ? ' active' : '');
      btn.innerHTML = meta.icon + ' ' + meta.label;
      btn.onclick = function() { switchCategory(cat); };
      container.appendChild(btn);
    });
  }

  function renderTier2() {
    var container = document.getElementById('tier2Tabs');
    container.innerHTML = '';
    var tabs = TAB_GROUPS[currentCat] || [];
    tabs.forEach(function(tab) {
      var btn = document.createElement('button');
      btn.className = 't2-btn' + (tab.id === currentTab ? ' active' : '');
      btn.innerHTML = '<span>' + tab.icon + '</span>' + tab.label;
      btn.onclick = function() { switchTab(tab.id); };
      container.appendChild(btn);
    });
  }

  function switchCategory(cat) {
    currentCat = cat;
    var tabs = TAB_GROUPS[cat];
    if (tabs && tabs.length) currentTab = tabs[0].id;
    S.lastCat = cat;
    S.lastTab = currentTab;
    renderTier1();
    renderTier2();
    renderActivePanel();
  }

  function switchTab(tabId) {
    currentTab = tabId;
    S.lastTab = tabId;
    renderTier2();
    renderActivePanel();
  }

  function renderActivePanel() {
    var container = document.getElementById('panelContainer');
    container.innerHTML = '';
    var panel = document.createElement('div');
    panel.className = 'tab-panel active';
    panel.id = 'panel-' + currentTab;
    container.appendChild(panel);
    if (typeof renderDynamic === 'function') renderDynamic(currentTab, panel);
  }

  function initTabs() {
    if (S.lastCat && TAB_GROUPS[S.lastCat]) currentCat = S.lastCat;
    if (S.lastTab) currentTab = S.lastTab;
    renderTier1();
    renderTier2();
    renderActivePanel();
  }

  window.initTabs = initTabs;
  window.switchCategory = switchCategory;
  window.switchTab = switchTab;
  window.getCurrentTab = function() { return currentTab; };
})();
```

- [ ] **Step 4: Create `core/render.js`**

```js
// core/render.js — Static DOM rendering (header, level bar, streak)
(function() {
  function renderLv() {
    var lvNum = document.getElementById('lvNum');
    var lvTitleEl = document.getElementById('lvTitle');
    var xpBar = document.getElementById('xpBar');
    var xpLabel = document.getElementById('xpLabel');
    if (!lvNum) return;
    lvNum.textContent = S.lv;
    lvTitleEl.textContent = lvTitle(S.lv);
    var current = S.xp - xpFor(S.lv);
    var needed = xpFor(S.lv + 1) - xpFor(S.lv);
    var pct = needed > 0 ? Math.min(100, (current / needed) * 100) : 100;
    xpBar.style.width = pct + '%';
    xpLabel.textContent = S.xp + ' / ' + xpFor(S.lv + 1) + ' XP';
  }

  function renderStreak() {
    var strDays = document.getElementById('strDays');
    var strMsg = document.getElementById('strMsg');
    var bestStr = document.getElementById('bestStr');
    if (!strDays) return;
    strDays.textContent = S.streak + ' Day Streak';
    bestStr.textContent = S.bestStreak;
    if (S.streak === 0) strMsg.textContent = 'Start your journey today';
    else if (S.streak < 7) strMsg.textContent = 'Keep it going!';
    else if (S.streak < 30) strMsg.textContent = 'You\'re on fire!';
    else strMsg.textContent = 'Unstoppable!';
  }

  function renderAll() {
    renderLv();
    renderStreak();
  }

  window.renderLv = renderLv;
  window.renderStreak = renderStreak;
  window.renderAll = renderAll;
})();
```

- [ ] **Step 5: Create `render/dynamic.js`**

```js
// render/dynamic.js — Dynamic panel rendering
(function() {
  function renderDynamic(tabId, panel) {
    if (!panel) return;
    if (typeof EXERCISES !== 'undefined' && getMuscleGroup(tabId)) {
      renderExerciseGrid(tabId, panel);
    } else if (tabId === 'workout') {
      renderWorkoutLog(panel);
    } else if (tabId === 'quick') {
      renderQuickLog(panel);
    } else if (tabId === 'warmup') {
      renderWarmup(panel);
    } else if (tabId === 'history') {
      renderHistory(panel);
    } else if (tabId === 'daily' || tabId === 'weekly' || tabId === 'monthly' || tabId === 'lifetime') {
      renderQuests(tabId, panel);
    } else if (tabId === 'active') {
      renderGoals(panel);
    } else if (tabId === 'prs') {
      renderPRs(panel);
    } else if (tabId === 'calendar') {
      renderCalendar(panel);
    } else if (tabId === 'stats') {
      renderStats(panel);
    } else if (tabId === 'body') {
      renderBodyMetrics(panel);
    } else if (tabId === 'achievements') {
      renderAchievements(panel);
    } else if (tabId === 'shop') {
      renderShop(panel);
    } else if (tabId === 'settings') {
      renderSettings(panel);
    } else {
      panel.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)"><p>Coming soon</p></div>';
    }
  }

  function getMuscleGroup(tabId) {
    var muscles = ['chest','back','legs','shoulders','arms','core','cardio','bodyweight'];
    return muscles.indexOf(tabId) !== -1 ? tabId : null;
  }

  function renderExerciseGrid(muscle, panel) {
    var exercises = getExercisesByMuscle(muscle);
    var title = muscle.charAt(0).toUpperCase() + muscle.slice(1);
    var html = '<div class="section-title">' + title + ' Exercises</div>';
    html += '<div class="exercise-grid">';
    exercises.forEach(function(ex) {
      html += '<div class="card exercise-card" onclick="startWorkoutExercise(\'' + ex.id + '\')">';
      html += '<div class="exercise-icon">' + ex.icon + '</div>';
      html += '<div class="exercise-name">' + escapeHTML(ex.name) + '</div>';
      html += '<div class="exercise-xp">' + ex.xp + ' XP</div>';
      html += '</div>';
    });
    html += '</div>';
    panel.innerHTML = html;
  }

  function renderWorkoutLog(panel) {
    panel.innerHTML = '<div class="section-title">Today\'s Workout</div>' +
      '<div id="todayWorkout"></div>' +
      '<div style="text-align:center;margin-top:20px">' +
      '<button class="btn-primary" onclick="openExercisePicker()">+ Add Exercise</button></div>';
    if (typeof renderTodayWorkout === 'function') renderTodayWorkout();
  }

  function renderQuickLog(panel) {
    panel.innerHTML = '<div class="section-title">Quick Log</div>' +
      '<div style="text-align:center;padding:20px;color:var(--text2)">' +
      '<p>Tap an exercise to quick-log reps and weight</p></div>' +
      '<div id="quickExercises"></div>';
    if (typeof renderQuickExercises === 'function') renderQuickExercises();
  }

  function renderWarmup(panel) {
    if (typeof WARMUP_ROUTINES === 'undefined') {
      panel.innerHTML = '<div class="section-title">Warm-up Routines</div><p style="color:var(--text2)">Loading...</p>';
      return;
    }
    var html = '<div class="section-title">Warm-up Routines</div>';
    Object.keys(WARMUP_ROUTINES).forEach(function(key) {
      var routine = WARMUP_ROUTINES[key];
      html += '<details class="cat-details"><summary>' + escapeHTML(routine.name) + '</summary>';
      html += '<div style="padding:14px 18px">';
      routine.movements.forEach(function(m) {
        html += '<div style="padding:8px 0;border-bottom:1px solid var(--border)">';
        html += '<strong>' + escapeHTML(m.name) + '</strong>';
        html += '<span style="color:var(--text2);margin-left:8px">' + escapeHTML(m.reps) + '</span>';
        html += '</div>';
      });
      html += '</div></details>';
    });
    panel.innerHTML = html;
  }

  function renderHistory(panel) {
    var html = '<div class="section-title">Past Workouts</div>';
    var dates = Object.keys(S.log).sort().reverse().slice(0, 30);
    if (dates.length === 0) {
      html += '<div style="text-align:center;padding:40px;color:var(--text2)">No workouts logged yet</div>';
    } else {
      dates.forEach(function(date) {
        var day = S.log[date];
        var count = day.workouts ? day.workouts.length : 0;
        html += '<div class="card"><div class="card-info">';
        html += '<div class="card-name">' + date + '</div>';
        html += '<div class="card-meta">' + count + ' workout' + (count !== 1 ? 's' : '') + '</div>';
        html += '</div></div>';
      });
    }
    panel.innerHTML = html;
  }

  function renderQuests(type, panel) {
    if (typeof renderQuestPanel === 'function') {
      renderQuestPanel(type, panel);
    } else {
      panel.innerHTML = '<div class="section-title">' + type.charAt(0).toUpperCase() + type.slice(1) + ' Quests</div>' +
        '<div style="padding:20px;color:var(--text2)">Quest system loading...</div>';
    }
  }

  function renderGoals(panel) {
    if (typeof renderGoalsPanel === 'function') {
      renderGoalsPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Active Goals</div>' +
        '<div style="text-align:center;padding:20px"><button class="btn-primary" onclick="createGoal()">+ New Goal</button></div>';
    }
  }

  function renderPRs(panel) {
    if (typeof renderPRPanel === 'function') {
      renderPRPanel(panel);
    } else {
      var html = '<div class="section-title">Personal Records</div>';
      var prs = S.prs || {};
      var keys = Object.keys(prs);
      if (keys.length === 0) {
        html += '<div style="text-align:center;padding:40px;color:var(--text2)">No PRs yet. Start lifting!</div>';
      } else {
        keys.forEach(function(exId) {
          var ex = getExerciseById(exId);
          var pr = prs[exId];
          html += '<div class="card"><div class="card-info">';
          html += '<div class="card-name">' + (ex ? ex.name : exId) + '</div>';
          html += '<div class="card-meta">' + pr.weight + 'kg × ' + pr.reps + ' reps — ' + pr.date + '</div>';
          html += '</div></div>';
        });
      }
      panel.innerHTML = html;
    }
  }

  function renderCalendar(panel) {
    panel.innerHTML = '<div class="section-title">Workout Calendar</div><div id="calArea"></div>';
    if (typeof renderCalendarGrid === 'function') renderCalendarGrid();
  }

  function renderStats(panel) {
    var html = '<div class="section-title">Your Stats</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--primary)">' + S.totalWorkouts + '</div><div style="color:var(--text2);font-size:0.8rem">Total Workouts</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--gold)">' + S.totalPRs + '</div><div style="color:var(--text2);font-size:0.8rem">Personal Records</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--green)">' + S.totalReps + '</div><div style="color:var(--text2);font-size:0.8rem">Total Reps</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--primary-light)">' + S.totalSets + '</div><div style="color:var(--text2);font-size:0.8rem">Total Sets</div></div>';
    html += '</div>';
    panel.innerHTML = html;
  }

  function renderBodyMetrics(panel) {
    if (typeof renderBodyPanel === 'function') {
      renderBodyPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Body Metrics</div>' +
        '<div style="text-align:center;padding:20px"><button class="btn-primary" onclick="logBodyMetrics()">+ Log Metrics</button></div>';
    }
  }

  function renderAchievements(panel) {
    if (typeof renderAchievementPanel === 'function') {
      renderAchievementPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Achievements</div>';
    }
  }

  function renderShop(panel) {
    if (typeof renderShopPanel === 'function') {
      renderShopPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Shop</div>';
    }
  }

  function renderSettings(panel) {
    var html = '<div class="section-title">Settings</div>';
    html += '<div class="card" style="flex-direction:column;align-items:stretch;gap:14px">';
    html += '<label style="color:var(--text2);font-size:0.85rem">Units</label>';
    html += '<select id="unitsSelect" style="padding:12px;border-radius:12px;background:var(--bg);color:var(--text);border:1px solid var(--border);font-family:var(--font)" onchange="updateUnits(this.value)">';
    html += '<option value="kg"' + (S.units === 'kg' ? ' selected' : '') + '>Kilograms (kg)</option>';
    html += '<option value="lbs"' + (S.units === 'lbs' ? ' selected' : '') + '>Pounds (lbs)</option>';
    html += '</select>';
    html += '<div class="gold-divider"></div>';
    html += '<button class="btn-secondary" onclick="exportData()" style="width:100%">Export Data</button>';
    html += '<button class="btn-secondary" onclick="importData()" style="width:100%">Import Data</button>';
    html += '<div class="gold-divider"></div>';
    html += '<button class="btn-secondary" onclick="resetAllData()" style="width:100%;color:var(--red);border-color:rgba(255,23,68,0.3)">Reset All Data</button>';
    html += '</div>';
    panel.innerHTML = html;
  }

  window.renderDynamic = renderDynamic;
  window.renderExerciseGrid = renderExerciseGrid;
  window.renderWorkoutLog = renderWorkoutLog;
})();
```

- [ ] **Step 6: Create `core/actions.js`**

```js
// core/actions.js — App facade + boot sequence
(function() {
  function boot() {
    S = loadState();
    renderAll();
    initTabs();
    setupIntro();
  }

  function setupIntro() {
    var btn = document.getElementById('startBtn');
    var overlay = document.getElementById('introOverlay');
    if (btn && overlay) {
      btn.onclick = function() {
        overlay.classList.add('hidden');
        setTimeout(function() { overlay.style.display = 'none'; }, 900);
      };
    }
  }

  function exportData() {
    var data = JSON.stringify(S, null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'iron-build-backup-' + today() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var data = JSON.parse(ev.target.result);
          S = normalizeState(data);
          saveState();
          renderAll();
          initTabs();
          openToastModal('<span class="toast-icon">✅</span><h3>Data Imported</h3>');
        } catch (err) {
          openToastModal('<span class="toast-icon">❌</span><h3>Import Failed</h3>');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function resetAllData() {
    if (confirm('Are you sure? This will delete ALL your data.')) {
      Storage.clear();
      S = freshState();
      saveState();
      renderAll();
      initTabs();
    }
  }

  function updateUnits(unit) {
    S.units = unit;
    saveState();
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.exportData = exportData;
  window.importData = importData;
  window.resetAllData = resetAllData;
  window.updateUnits = updateUnits;
})();
```

- [ ] **Step 7: Open in browser and verify**

Expected: Full app shell renders. Intro overlay shows → click "Start Your Journey" → fades. Level badge shows "1 / Novice Lifter I". XP bar at 0%. Streak shows "0 Day Streak". Tab navigation works — clicking categories switches sub-tabs, clicking sub-tabs renders placeholder panels (exercise grids for Exercises category, "Coming soon" for others).

- [ ] **Step 8: Commit**

```bash
git add data/tab-groups.js data/exercises.js core/tabs.js core/render.js render/dynamic.js core/actions.js
git commit -m "feat: tab navigation, exercise database, and dynamic rendering"
```

---

## Task 6: Workout Logging

**Files:**
- Create: `Gym/features/workout-log.js`
- Test: `Gym/tests/workout.test.js`

**Interfaces:**
- Consumes: `S`, `EXERCISES`, `applyXpDelta()`, `saveState()`
- Produces: `startWorkoutExercise()`, `openExercisePicker()`, `renderTodayWorkout()`, `renderQuickExercises()`

- [ ] **Step 1: Create `features/workout-log.js`**

```js
// features/workout-log.js — Workout logging (detailed + quick mode)
(function() {
  function getTodayLog() {
    var t = today();
    if (!S.log[t]) S.log[t] = { workouts: [] };
    return S.log[t];
  }

  function openExercisePicker() {
    var html = '<span class="toast-icon">🏋️</span><h3>Pick an Exercise</h3>';
    html += '<div style="margin-top:16px;text-align:left;max-height:60vh;overflow-y:auto">';
    var muscles = ['chest','back','legs','shoulders','arms','core','bodyweight','cardio'];
    muscles.forEach(function(muscle) {
      var exercises = getExercisesByMuscle(muscle);
      html += '<div style="margin-bottom:12px">';
      html += '<div style="color:var(--primary);font-size:0.75rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">' + muscle + '</div>';
      exercises.forEach(function(ex) {
        html += '<div style="padding:10px 12px;cursor:pointer;border-radius:8px;margin-bottom:4px;background:var(--card);border:1px solid var(--border)" ' +
          'onclick="startWorkoutExercise(\'' + ex.id + '\');closeToastOverlay()"' +
          'onmouseover="this.style.borderColor=\'var(--primary)\'" onmouseout="this.style.borderColor=\'var(--border)\'">' +
          '<span style="margin-right:8px">' + ex.icon + '</span>' + escapeHTML(ex.name) +
          '<span style="float:right;color:var(--gold);font-size:0.75rem">' + ex.xp + ' XP</span></div>';
      });
      html += '</div>';
    });
    html += '</div>';
    openToastModal(html);
  }

  function startWorkoutExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var html = '<span class="toast-icon">' + ex.icon + '</span><h3>' + escapeHTML(ex.name) + '</h3>';
    html += '<div style="margin-top:16px;text-align:left">';
    html += '<div style="margin-bottom:12px"><label style="color:var(--text2);font-size:0.8rem">Sets</label>';
    html += '<input id="wSets" type="number" value="3" min="1" max="20" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:12px"><label style="color:var(--text2);font-size:0.8rem">Reps per set</label>';
    html += '<input id="wReps" type="number" value="10" min="1" max="100" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:16px"><label style="color:var(--text2);font-size:0.8rem">Weight (' + S.units + ')</label>';
    html += '<input id="wWeight" type="number" value="0" min="0" step="0.5" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveWorkoutExercise(\'' + ex.id + '\')">Log Exercise</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveWorkoutExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var sets = parseInt(document.getElementById('wSets').value) || 3;
    var reps = parseInt(document.getElementById('wReps').value) || 10;
    var weight = parseFloat(document.getElementById('wWeight').value) || 0;

    var entry = {
      exerciseId: exerciseId,
      sets: [],
      totalReps: sets * reps,
      weight: weight,
      timestamp: Date.now()
    };
    for (var i = 0; i < sets; i++) {
      entry.sets.push({ weight: weight, reps: reps, done: true });
    }

    var todayLog = getTodayLog();
    todayLog.workouts.push(entry);

    // Update stats
    S.totalWorkouts++;
    S.totalSets += sets;
    S.totalReps += sets * reps;

    // Check PR
    checkAndUpdatePR(exerciseId, weight, reps);

    // Award XP
    var xpEarned = ex.xp;
    applyXpDelta(xpEarned);

    // Update streak
    updateStreak();

    saveState();
    closeToastOverlay();
    renderAll();

    openToastModal(
      '<span class="toast-icon">✅</span>' +
      '<h3>Exercise Logged!</h3>' +
      '<div style="color:var(--gold);margin-top:8px">+' + xpEarned + ' XP</div>'
    );
  }

  function checkAndUpdatePR(exerciseId, weight, reps) {
    if (!S.prs) S.prs = {};
    var current = S.prs[exerciseId];
    var isNewPR = false;
    if (!current) {
      isNewPR = true;
    } else if (weight > current.weight || (weight === current.weight && reps > current.reps)) {
      isNewPR = true;
    }
    if (isNewPR) {
      S.prs[exerciseId] = { weight: weight, reps: reps, date: today() };
      S.totalPRs = (S.totalPRs || 0) + 1;
      setTimeout(function() {
        openToastModal(
          '<span class="toast-icon">🏆</span>' +
          '<h3>New PR!</h3>' +
          '<div style="color:var(--primary);margin-top:8px">' + weight + 'kg × ' + reps + ' reps</div>'
        );
        applyXpDelta(100);
        saveState();
        renderAll();
      }, 1500);
    }
  }

  function updateStreak() {
    var t = today();
    if (S.lastActiveDate === t) return; // Already counted today
    var yesterday = getYesterdayKey();
    if (S.lastActiveDate === yesterday) {
      S.streak++;
    } else if (S.lastActiveDate !== t) {
      S.streak = 1;
    }
    S.lastActiveDate = t;
    if (S.streak > S.bestStreak) S.bestStreak = S.streak;
  }

  function renderTodayWorkout() {
    var container = document.getElementById('todayWorkout');
    if (!container) return;
    var todayLog = getTodayLog();
    var workouts = todayLog.workouts || [];
    if (workouts.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)">No exercises logged today. Tap + to start!</div>';
      return;
    }
    var html = '';
    workouts.forEach(function(w, idx) {
      var ex = getExerciseById(w.exerciseId);
      html += '<div class="card done">';
      html += '<div class="card-check">✓</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + (ex ? ex.name : w.exerciseId) + '</div>';
      html += '<div class="card-meta">' + w.sets.length + ' sets × ' + w.sets[0].reps + ' reps @ ' + w.weight + S.units + '</div>';
      html += '</div>';
      html += '<div class="card-xp">+' + (ex ? ex.xp : 0) + ' XP</div>';
      html += '</div>';
    });
    container.innerHTML = html;
  }

  function renderQuickExercises() {
    var container = document.getElementById('quickExercises');
    if (!container) return;
    var html = '<div class="exercise-grid" style="padding:0 18px">';
    EXERCISES.slice(0, 20).forEach(function(ex) {
      html += '<div class="card exercise-card" onclick="quickLogExercise(\'' + ex.id + '\')">';
      html += '<div class="exercise-icon">' + ex.icon + '</div>';
      html += '<div class="exercise-name">' + escapeHTML(ex.name) + '</div>';
      html += '<div class="exercise-xp">' + ex.xp + ' XP</div>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function quickLogExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var html = '<span class="toast-icon">' + ex.icon + '</span><h3>Quick Log: ' + escapeHTML(ex.name) + '</h3>';
    html += '<div style="margin-top:16px;text-align:left">';
    html += '<div style="margin-bottom:12px"><label style="color:var(--text2);font-size:0.8rem">Total Reps</label>';
    html += '<input id="qReps" type="number" value="20" min="1" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:16px"><label style="color:var(--text2);font-size:0.8rem">Weight (' + S.units + ')</label>';
    html += '<input id="qWeight" type="number" value="0" min="0" step="0.5" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveQuickExercise(\'' + ex.id + '\')">Log</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveQuickExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var reps = parseInt(document.getElementById('qReps').value) || 20;
    var weight = parseFloat(document.getElementById('qWeight').value) || 0;

    var entry = {
      exerciseId: exerciseId,
      sets: [{ weight: weight, reps: reps, done: true }],
      totalReps: reps,
      weight: weight,
      timestamp: Date.now(),
      quick: true
    };

    var todayLog = getTodayLog();
    todayLog.workouts.push(entry);

    S.totalWorkouts++;
    S.totalSets++;
    S.totalReps += reps;

    checkAndUpdatePR(exerciseId, weight, reps);

    var xpEarned = Math.floor(ex.xp * 0.7);
    applyXpDelta(xpEarned);
    updateStreak();
    saveState();
    closeToastOverlay();
    renderAll();

    openToastModal(
      '<span class="toast-icon">⚡</span>' +
      '<h3>Quick Logged!</h3>' +
      '<div style="color:var(--gold);margin-top:8px">+' + xpEarned + ' XP</div>'
    );
  }

  window.openExercisePicker = openExercisePicker;
  window.startWorkoutExercise = startWorkoutExercise;
  window.saveWorkoutExercise = saveWorkoutExercise;
  window.renderTodayWorkout = renderTodayWorkout;
  window.renderQuickExercises = renderQuickExercises;
  window.quickLogExercise = quickLogExercise;
  window.saveQuickExercise = saveQuickExercise;
})();
```

- [ ] **Step 2: Create `tests/workout.test.js`**

```js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;} };
global.window = global;
global.document = { readyState: 'complete', getElementById: () => null, addEventListener: () => {}, createElement: () => ({style:{},onclick:null,onmouseover:null,onmouseout:null,className:'',innerHTML:'',textContent:'',appendChild:()=>{},click:()=>{}}) };
global.confirm = () => true;
global.alert = () => {};

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');
require('../data/tab-groups.js');
require('../data/exercises.js');

describe('workout logging', () => {
  it('getTodayLog creates log entry for today', () => {
    S = freshState();
    const t = today();
    assert.ok(!S.log[t]);
    // Simulate getTodayLog
    if (!S.log[t]) S.log[t] = { workouts: [] };
    assert.ok(Array.isArray(S.log[t].workouts));
  });

  it('exercise lookup works', () => {
    const ex = getExerciseById('bench_press');
    assert.ok(ex);
    assert.equal(ex.muscle, 'chest');
  });

  it('getExercisesByMuscle returns correct count', () => {
    const chest = getExercisesByMuscle('chest');
    assert.ok(chest.length >= 5);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `node --test tests/workout.test.js`
Expected: All 3 tests pass.

- [ ] **Step 4: Test in browser**

Open in browser → click Today → Workout Log → "+ Add Exercise" → pick "Barbell Bench Press" → enter 3 sets, 10 reps, 80kg → "Log Exercise" → toast shows "+50 XP" → exercise appears in today's log with ✓ → level bar updates.

- [ ] **Step 5: Commit**

```bash
git add features/workout-log.js tests/workout.test.js
git commit -m "feat: workout logging with detailed and quick modes"
```

---

## Task 7: Quest System

**Files:**
- Create: `Gym/data/quests.js`
- Create: `Gym/features/quests.js`
- Test: `Gym/tests/quests.test.js`

**Interfaces:**
- Consumes: `S`, `EXERCISES`, `applyXpDelta()`, `saveState()`
- Produces: `genDQ()`, `genWQ()`, `genMQ()`, `genLQ()`, `checkQ()`, `toggleQuest()`, `renderQuestPanel()`

- [ ] **Step 1: Create `data/quests.js`**

```js
// data/quests.js — Quest definitions
const DQUESTS = [
  { id:'dq1', d:'Log any exercise', xp:30, c: function(s,t){ return (s.log[t]||{}).workouts && s.log[t].workouts.length > 0; } },
  { id:'dq2', d:'Log 3 sets total', xp:40, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.reduce(function(a,e){return a+e.sets.length;},0)>=3; } },
  { id:'dq3', d:'Do 30 total reps', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.reduce(function(a,e){return a+e.totalReps;},0)>=30; } },
  { id:'dq4', d:'Log a chest exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='chest';}); } },
  { id:'dq5', d:'Log a back exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='back';}); } },
  { id:'dq6', d:'Log a leg exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='legs';}); } },
  { id:'dq7', d:'Log 2 different exercises', xp:45, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; var ids={}; w.forEach(function(e){ids[e.exerciseId]=1;}); return Object.keys(ids).length>=2; } },
  { id:'dq8', d:'Log a bodyweight exercise', xp:30, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.type==='bodyweight';}); } }
];

const WQUESTS = [
  { id:'wq1', d:'Workout 5 days this week', xp:300, c: function(s){ var c=0; for(var d=new Date();d>=new Date(Date.now()-7*864e5);d.setDate(d.getDate()-1)){var k=today(d);if(s.log[k]&&s.log[k].workouts&&s.log[k].workouts.length>0)c++;} return c>=5; } },
  { id:'wq2', d:'Log 20 total sets', xp:250, c: function(s){ return s.totalSets>=20; } },
  { id:'wq3', d:'Log 500 total reps', xp:300, c: function(s){ return s.totalReps>=500; } },
  { id:'wq4', d:'Hit a new PR', xp:200, c: function(s){ return s.totalPRs>0; } },
  { id:'wq5', d:'Log 3 different muscle groups', xp:250, c: function(s){ var muscles={};var t=today();if(s.log[t]&&s.log[t].workouts){s.log[t].workouts.forEach(function(w){var ex=getExerciseById(w.exerciseId);if(ex)muscles[ex.muscle]=1;});} return Object.keys(muscles).length>=3; } }
];

const MQUESTS = [
  { id:'mq1', d:'Complete 20 workouts', xp:1000, c: function(s){ return s.totalWorkouts>=20; } },
  { id:'mq2', d:'Set 3 new PRs', xp:800, c: function(s){ return s.totalPRs>=3; } },
  { id:'mq3', d:'Log 100 total sets', xp:900, c: function(s){ return s.totalSets>=100; } },
  { id:'mq4', d:'Log 2000 total reps', xp:1000, c: function(s){ return s.totalReps>=2000; } },
  { id:'mq5', d:'Achieve 7-day streak', xp:700, c: function(s){ return s.bestStreak>=7; } }
];

const LQUESTS = [
  { id:'lq1', d:'Complete 50 workouts', xp:2000, c: function(s){ return s.totalWorkouts>=50; } },
  { id:'lq2', d:'Complete 100 workouts', xp:5000, c: function(s){ return s.totalWorkouts>=100; } },
  { id:'lq3', d:'Complete 500 workouts', xp:20000, c: function(s){ return s.totalWorkouts>=500; } },
  { id:'lq4', d:'Hit 50 PRs', xp:15000, c: function(s){ return s.totalPRs>=50; } },
  { id:'lq5', d:'Reach Level 50', xp:25000, c: function(s){ return s.lv>=50; } },
  { id:'lq6', d:'Reach Level 100', xp:100000, c: function(s){ return s.lv>=100; } }
];
```

- [ ] **Step 2: Create `features/quests.js`**

```js
// features/quests.js — Quest generation, checking, toggling
(function() {
  function genDQ() {
    var t = today();
    if (S.qd === t && S.dq.length) return;
    S.dq = DQUESTS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 4).map(function(q) {
      return { id: q.id, d: q.d, xp: q.xp, done: false };
    });
    S.qd = t;
  }

  function genWQ() {
    var w = getWeekAgoKey();
    if (S.wqd === w && S.wq.length) return;
    S.wq = WQUESTS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 3).map(function(q) {
      return { id: q.id, d: q.d, xp: q.xp, done: false };
    });
    S.wqd = w;
  }

  function genMQ() {
    var m = today().slice(0, 7);
    if (S.mqd === m && S.mq.length) return;
    S.mq = MQUESTS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 3).map(function(q) {
      return { id: q.id, d: q.d, xp: q.xp, done: false };
    });
    S.mqd = m;
  }

  function genLQ() {
    if (S.lq && S.lq.length) return;
    S.lq = LQUESTS.map(function(q) {
      return { id: q.id, d: q.d, xp: q.xp, done: false };
    });
  }

  function checkQ() {
    var t = today();
    var u = false, gained = 0;

    S.dq.forEach(function(q) {
      var def = DQUESTS.find(function(x) { return x.id === q.id; });
      if (def && !q.done && def.c(S, t)) {
        q.done = true;
        gained += q.xp;
        u = true;
      }
    });

    S.wq.forEach(function(q) {
      var def = WQUESTS.find(function(x) { return x.id === q.id; });
      if (def && !q.done && def.c(S)) {
        q.done = true;
        gained += q.xp;
        u = true;
      }
    });

    S.mq.forEach(function(q) {
      var def = MQUESTS.find(function(x) { return x.id === q.id; });
      if (def && !q.done && def.c(S)) {
        q.done = true;
        gained += q.xp;
        u = true;
      }
    });

    S.lq.forEach(function(q) {
      var def = LQUESTS.find(function(x) { return x.id === q.id; });
      if (def && !q.done && def.c(S)) {
        q.done = true;
        gained += q.xp;
        u = true;
      }
    });

    if (u) {
      applyXpDelta(gained);
      saveState();
    }
  }

  function toggleQuest(id, type, xp) {
    var arr;
    if (type === 'daily') arr = S.dq;
    else if (type === 'weekly') arr = S.wq;
    else if (type === 'monthly') arr = S.mq;
    else if (type === 'lifetime') arr = S.lq;
    else return;
    var q = arr.find(function(x) { return x.id === id; });
    if (!q) return;
    q.done = !q.done;
    if (q.done) applyXpDelta(xp || q.xp);
    else spendXp(xp || q.xp);
    saveState();
  }

  function renderQuestPanel(type, panel) {
    genDQ(); genWQ(); genMQ(); genLQ();
    var quests;
    var title;
    if (type === 'daily') { quests = S.dq; title = 'Daily Quests'; }
    else if (type === 'weekly') { quests = S.wq; title = 'Weekly Quests'; }
    else if (type === 'monthly') { quests = S.mq; title = 'Monthly Quests'; }
    else if (type === 'lifetime') { quests = S.lq; title = 'Lifetime Quests'; }

    var html = '<div class="section-title">' + title + '</div>';
    quests.forEach(function(q) {
      html += '<div class="card' + (q.done ? ' done' : '') + '" onclick="toggleQuest(\'' + q.id + '\',\'' + type + '\',' + q.xp + ')">';
      html += '<div class="card-check">' + (q.done ? '✓' : '') + '</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + escapeHTML(q.d) + '</div>';
      html += '<div class="card-meta">' + (q.done ? 'Completed' : 'In Progress') + '</div>';
      html += '</div>';
      html += '<div class="card-xp">' + q.xp + ' XP</div>';
      html += '</div>';
    });
    panel.innerHTML = html;
  }

  window.genDQ = genDQ;
  window.genWQ = genWQ;
  window.genMQ = genMQ;
  window.genLQ = genLQ;
  window.checkQ = checkQ;
  window.toggleQuest = toggleQuest;
  window.renderQuestPanel = renderQuestPanel;
})();
```

- [ ] **Step 3: Create `tests/quests.test.js`**

```js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;} };
global.window = global;
global.document = { readyState:'complete', getElementById:()=>null, addEventListener:()=>{}, createElement:()=>({style:{},onclick:null,className:'',innerHTML:'',textContent:'',appendChild:()=>{}}) };

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');
require('../data/exercises.js');
require('../data/quests.js');
require('../features/quests.js');

describe('quests', () => {
  it('genDQ creates 4 daily quests', () => {
    S = freshState();
    genDQ();
    assert.equal(S.dq.length, 4);
  });

  it('genLQ creates lifetime quests', () => {
    S = freshState();
    genLQ();
    assert.equal(S.lq.length, LQUESTS.length);
  });

  it('checkQ marks completed quests', () => {
    S = freshState();
    S.log[today()] = { workouts: [{ exerciseId: 'bench_press', sets: [{weight:80,reps:10,done:true}], totalReps: 10, weight: 80 }] };
    S.totalWorkouts = 1;
    genDQ();
    checkQ();
    var completed = S.dq.filter(function(q) { return q.done; });
    assert.ok(completed.length > 0);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/quests.test.js`
Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add data/quests.js features/quests.js tests/quests.test.js
git commit -m "feat: quest system with daily/weekly/monthly/lifetime"
```

---

## Task 8: Goals, Body Metrics, Achievements, Shop, Profile

**Files:**
- Create: `Gym/features/goals.js`
- Create: `Gym/features/body-metrics.js`
- Create: `Gym/features/achievements.js`
- Create: `Gym/data/achievements.js`
- Create: `Gym/features/shop.js`
- Create: `Gym/data/shop-items.js`
- Create: `Gym/data/tips.js`
- Create: `Gym/data/streak-msgs.js`
- Create: `Gym/data/warmup-routines.js`
- Create: `Gym/features/calendar.js`
- Create: `Gym/features/profile.js`

**Interfaces:**
- Consumes: `S`, `applyXpDelta()`, `saveState()`, `EXERCISES`
- Produces: `createGoal()`, `renderGoalsPanel()`, `renderBodyPanel()`, `renderAchievementPanel()`, `renderShopPanel()`, `renderCalendarGrid()`

- [ ] **Step 1: Create all remaining data files**

`data/achievements.js` — 20 achievement definitions (see spec section 9).
`data/shop-items.js` — Cosmetic titles and frames purchasable with XP.
`data/tips.js` — Array of fitness motivation strings.
`data/streak-msgs.js` — Streak milestone congratulations messages.
`data/warmup-routines.js` — 6 warm-up routines with movements.

(These are pure data arrays/objects — write them following the patterns from IQ.)

- [ ] **Step 2: Create all remaining feature files**

Each feature file follows the same IIFE pattern:
- `goals.js`: CRUD for goals array, progress tracking, `createGoal()`, `renderGoalsPanel()`
- `body-metrics.js`: Log weight/measurements, `logBodyMetrics()`, `renderBodyPanel()`
- `achievements.js`: Check unlock conditions on each action, `checkAchievements()`, `renderAchievementPanel()`
- `shop.js`: Display items, spend XP to buy, `renderShopPanel()`
- `calendar.js`: Monthly grid with colored dots, `renderCalendarGrid()`
- `profile.js`: Settings, export/import (already in actions.js)

Each feature: 60-120 lines of JS following IQ patterns.

- [ ] **Step 3: Wire quest checking into workout logging**

In `features/workout-log.js`, add `checkQ()` call after `saveState()` in both `saveWorkoutExercise()` and `saveQuickExercise()`. Also add `checkAchievements()` call.

- [ ] **Step 4: Test in browser**

Full app flow:
1. Intro → Start
2. Log a bench press → XP earned → quest auto-completes → achievement unlocks
3. Check Quests tab → daily quests show completed
4. Check Achievements tab → "First Workout" unlocked
5. Check Stats → numbers updated
6. Check Calendar → today has a dot
7. Settings → export works

- [ ] **Step 5: Commit**

```bash
git add features/*.js data/*.js
git commit -m "feat: goals, body metrics, achievements, shop, calendar, profile"
```

---

## Task 9: Final Integration + Polish

**Files:**
- Modify: `Gym/index.html` (add `features/pr-history.js` if missing)
- Create: `Gym/features/pr-history.js`
- Create: `Gym/sw.js`

**Interfaces:**
- Consumes: all previous modules
- Produces: fully working app, service worker for offline

- [ ] **Step 1: Create `features/pr-history.js`**

```js
// features/pr-history.js — Personal record tracking
(function() {
  function renderPRPanel(panel) {
    var html = '<div class="section-title">Personal Records</div>';
    var prs = S.prs || {};
    var keys = Object.keys(prs);
    if (keys.length === 0) {
      html += '<div style="text-align:center;padding:40px;color:var(--text2)">No PRs yet. Start lifting!</div>';
      panel.innerHTML = html;
      return;
    }
    keys.forEach(function(exId) {
      var ex = getExerciseById(exId);
      var pr = prs[exId];
      html += '<div class="card">';
      html += '<div class="card-check" style="background:var(--gold);border-color:var(--gold)">🏆</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + (ex ? ex.name : exId) + '</div>';
      html += '<div class="card-meta">' + pr.weight + S.units + ' × ' + pr.reps + ' reps — ' + pr.date + '</div>';
      html += '</div></div>';
    });
    panel.innerHTML = html;
  }
  window.renderPRPanel = renderPRPanel;
})();
```

- [ ] **Step 2: Create `sw.js`**

```js
const CACHE_NAME = 'iron-build-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

- [ ] **Step 3: Final browser test**

Full walkthrough:
1. Open app → intro works
2. Log 3 different exercises → XP accumulates → level up toast fires
3. Quests tab → daily quests auto-complete
4. PRs tab → shows new records
5. Calendar → colored dots for workout days
6. Stats → accurate totals
7. Settings → export JSON → clear data → import JSON → data restored
8. Disconnect network → app still works offline

- [ ] **Step 4: Commit**

```bash
git add features/pr-history.js sw.js
git commit -m "feat: PR history, service worker, final integration"
```

---

## Task Summary

| Task | What it delivers | Tests |
|------|-----------------|-------|
| 1 | HTML shell + CSS theme + PWA manifest | Manual |
| 2 | Helpers + storage layer | 6 tests |
| 3 | State management + level system | 14 tests |
| 4 | XP pipeline + modals + sound | 18 tests |
| 5 | Tab navigation + exercise database + rendering | Manual |
| 6 | Workout logging (detailed + quick) | 21 tests |
| 7 | Quest system | 24 tests |
| 8 | Goals, body metrics, achievements, shop, calendar, profile | Manual |
| 9 | PR history, service worker, final integration | Manual |

**Total estimated time:** 3-4 hours for a skilled developer following the plan.
