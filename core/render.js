// core/render.js — Static DOM rendering (header, level bar, streak, top bar)
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

    // Update top bar
    var tbLevel = document.getElementById('tbLevel');
    var tbTitle = document.getElementById('tbTitle');
    var tbXP = document.getElementById('tbXP');
    if (tbLevel) tbLevel.textContent = 'Lv ' + S.lv;
    if (tbTitle) tbTitle.textContent = lvTitle(S.lv);
    if (tbXP) tbXP.textContent = S.xp + ' XP';
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

    // Update top bar streak
    var tbStreak = document.getElementById('tbStreak');
    if (tbStreak) tbStreak.textContent = '🔥 ' + S.streak;
  }

  function renderAll() {
    renderLv();
    renderStreak();
  }

  window.renderLv = renderLv;
  window.renderStreak = renderStreak;
  window.renderAll = renderAll;
})();
