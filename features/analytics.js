// features/analytics.js — Basic stats and analytics
(function() {
  function renderStats(panel) {
    var html = '<div class="section-title">Your Stats</div>';
    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-num">' + S.totalWorkouts + '</div><div class="stat-label">Workouts</div></div>';
    html += '<div class="stat-card"><div class="stat-num" style="color:var(--gold)">' + S.totalPRs + '</div><div class="stat-label">PRs</div></div>';
    html += '<div class="stat-card"><div class="stat-num" style="color:var(--green)">' + S.totalReps + '</div><div class="stat-label">Total Reps</div></div>';
    html += '<div class="stat-card"><div class="stat-num" style="color:var(--primary-light)">' + S.totalSets + '</div><div class="stat-label">Total Sets</div></div>';
    html += '</div>';
    panel.innerHTML = html;
  }

  window.renderStats = renderStats;
})();
