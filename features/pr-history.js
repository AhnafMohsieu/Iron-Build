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
      html += '<div class="card-icon" style="background:rgba(255,184,0,0.1);border-color:rgba(255,184,0,0.2)">' + gymIcon('trophy', 'gym-icon') + '</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + (ex ? ex.name : exId) + '</div>';
      html += '<div class="card-meta">' + pr.weight + S.units + ' × ' + pr.reps + ' reps — ' + pr.date + '</div>';
      html += '</div></div>';
    });
    panel.innerHTML = html;
  }
  window.renderPRPanel = renderPRPanel;
})();
