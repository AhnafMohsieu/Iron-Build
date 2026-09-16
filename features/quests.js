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
