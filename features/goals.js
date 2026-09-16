// features/goals.js — Goal CRUD and tracking
(function() {
  function createGoal() {
    var html = '<span class="toast-icon">🎯</span><h3>New Goal</h3>';
    html += '<div style="margin-top:14px;text-align:left">';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Goal Name</label>';
    html += '<input id="goalName" type="text" placeholder="e.g. Bench Press 100kg" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Target Value</label>';
    html += '<input id="goalTarget" type="number" value="100" min="1" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:14px"><label style="color:var(--text2);font-size:0.75rem">Unit</label>';
    html += '<select id="goalUnit" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);font-family:var(--font)">';
    html += '<option value="kg">kg</option><option value="reps">reps</option><option value="workouts">workouts</option></select></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveGoal()">Create Goal</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveGoal() {
    var name = document.getElementById('goalName').value.trim();
    var target = parseFloat(document.getElementById('goalTarget').value) || 100;
    var unit = document.getElementById('goalUnit').value;
    if (!name) return;
    S.goals.push({ id: 'g' + Date.now(), name: name, target: target, unit: unit, current: 0, created: today(), done: false });
    saveState();
    closeToastOverlay();
    renderAll();
    openToastModal('<span class="toast-icon">✅</span><h3>Goal Created!</h3>');
  }

  function renderGoalsPanel(panel) {
    var html = '<div class="section-title">Active Goals</div>';
    html += '<div style="text-align:center;margin-bottom:16px"><button class="btn-primary" onclick="createGoal()">+ New Goal</button></div>';
    var goals = S.goals || [];
    if (goals.length === 0) {
      html += '<div style="text-align:center;padding:30px;color:var(--text2)">No goals yet. Create one to start tracking!</div>';
    } else {
      goals.forEach(function(g) {
        var pct = g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0;
        html += '<div class="card' + (g.done ? ' done' : '') + '">';
        html += '<div class="card-icon">' + (g.done ? '✅' : '🎯') + '</div>';
        html += '<div class="card-info">';
        html += '<div class="card-name">' + escapeHTML(g.name) + '</div>';
        html += '<div class="card-meta">' + g.current + ' / ' + g.target + ' ' + g.unit + '</div>';
        html += '<div style="background:rgba(255,255,255,0.06);border-radius:4px;height:6px;margin-top:6px;overflow:hidden">';
        html += '<div style="height:100%;width:' + pct + '%;background:var(--primary);border-radius:4px;transition:width 0.3s"></div></div>';
        html += '</div></div>';
      });
    }
    panel.innerHTML = html;
  }

  window.createGoal = createGoal;
  window.saveGoal = saveGoal;
  window.renderGoalsPanel = renderGoalsPanel;
})();
