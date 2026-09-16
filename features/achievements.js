// features/achievements.js — Achievement checking and display
(function() {
  function checkAchievements() {
    if (!S.achievements) S.achievements = {};
    var newUnlock = false;
    ACHIEVEMENTS.forEach(function(a) {
      if (!S.achievements[a.id] && a.check(S)) {
        S.achievements[a.id] = { unlocked: true, date: today() };
        newUnlock = true;
        applyXpDelta(a.xp);
        setTimeout(function() {
          openToastModal(
            '<span class="toast-icon">' + a.icon + '</span>' +
            '<h3>Achievement Unlocked!</h3>' +
            '<div style="color:var(--primary);font-weight:600;margin-top:6px">' + a.name + '</div>' +
            '<div style="color:var(--text2);font-size:0.8rem;margin-top:2px">' + a.desc + '</div>' +
            '<div style="color:var(--gold);margin-top:6px">+' + a.xp + ' XP</div>'
          );
          playSound('chime');
        }, 2000);
      }
    });
    if (newUnlock) saveState();
  }

  function renderAchievementPanel(panel) {
    var html = '<div class="section-title">Achievements</div>';
    var unlocked = 0;
    ACHIEVEMENTS.forEach(function(a) {
      var isUnlocked = S.achievements && S.achievements[a.id];
      if (isUnlocked) unlocked++;
      html += '<div class="card' + (isUnlocked ? ' done' : '') + '">';
      html += '<div class="card-icon">' + (isUnlocked ? a.icon : gymIcon('lock', 'gym-icon')) + '</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + a.name + '</div>';
      html += '<div class="card-desc">' + a.desc + '</div>';
      html += '<div class="card-meta">' + (isUnlocked ? 'Unlocked ' + S.achievements[a.id].date : 'Locked') + '</div>';
      html += '</div>';
      html += '<div class="card-xp">' + a.xp + ' XP</div>';
      html += '</div>';
    });
    html = '<div style="text-align:center;color:var(--text2);font-size:0.8rem;margin-bottom:12px">' + unlocked + ' / ' + ACHIEVEMENTS.length + ' Unlocked</div>' + html;
    panel.innerHTML = html;
  }

  window.checkAchievements = checkAchievements;
  window.renderAchievementPanel = renderAchievementPanel;
})();
