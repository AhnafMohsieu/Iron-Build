// features/body-metrics.js — Body weight and measurement tracking
(function() {
  function logBodyMetrics() {
    var html = gymIcon('scales', 'gym-icon-lg') + '<h3>Log Body Metrics</h3>';
    html += '<div style="margin-top:14px;text-align:left">';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Weight (' + S.units + ')</label>';
    html += '<input id="bmWeight" type="number" value="70" min="0" step="0.1" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Body Fat % (optional)</label>';
    html += '<input id="bmBF" type="number" value="" min="0" max="60" step="0.1" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:14px"><label style="color:var(--text2);font-size:0.75rem">Notes (optional)</label>';
    html += '<input id="bmNotes" type="text" placeholder="e.g. feeling good" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveBodyMetrics()">Save</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveBodyMetrics() {
    var weight = parseFloat(document.getElementById('bmWeight').value) || 0;
    var bf = document.getElementById('bmBF').value ? parseFloat(document.getElementById('bmBF').value) : null;
    var notes = document.getElementById('bmNotes').value.trim();
    if (!S.bodyMetrics) S.bodyMetrics = [];
    S.bodyMetrics.push({ date: today(), weight: weight, bodyFat: bf, notes: notes, timestamp: Date.now() });
    saveState();
    closeToastOverlay();
    openToastModal('<img class="gym-icon-lg" src="assets/icons/emoji_u2705.png" alt="" role="img" loading="lazy"><h3>Metrics Saved</h3><div style="color:var(--text2);margin-top:4px">' + weight + ' ' + S.units + '</div>');
  }

  function renderBodyPanel(panel) {
    var html = '<div class="section-title">Body Metrics</div>';
    html += '<div style="text-align:center;margin-bottom:16px"><button class="btn-primary" onclick="logBodyMetrics()">+ Log Metrics</button></div>';
    var metrics = S.bodyMetrics || [];
    if (metrics.length === 0) {
      html += '<div style="text-align:center;padding:30px;color:var(--text2)">No metrics logged yet</div>';
    } else {
      metrics.slice().reverse().forEach(function(m) {
        html += '<div class="card"><div class="card-icon">' + gymIcon('scales', 'gym-icon') + '</div>';
        html += '<div class="card-info"><div class="card-name">' + m.weight + ' ' + S.units + '</div>';
        html += '<div class="card-meta">' + m.date + (m.bodyFat ? ' · ' + m.bodyFat + '% BF' : '') + '</div>';
        if (m.notes) html += '<div class="card-desc">' + escapeHTML(m.notes) + '</div>';
        html += '</div></div>';
      });
    }
    panel.innerHTML = html;
  }

  window.logBodyMetrics = logBodyMetrics;
  window.saveBodyMetrics = saveBodyMetrics;
  window.renderBodyPanel = renderBodyPanel;
})();
