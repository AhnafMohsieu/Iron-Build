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
    return 100 * (lv - 1);
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
