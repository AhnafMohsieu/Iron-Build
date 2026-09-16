// features/profile.js — Settings and profile display
(function() {
  function renderSettings(panel) {
    var html = '<div class="section-title">Settings</div>';
    html += '<div class="settings-group">';
    html += '<div class="settings-label">Units</div>';
    html += '<select class="settings-select" onchange="updateUnits(this.value)">';
    html += '<option value="kg"' + (S.units === 'kg' ? ' selected' : '') + '>Kilograms (kg)</option>';
    html += '<option value="lbs"' + (S.units === 'lbs' ? ' selected' : '') + '>Pounds (lbs)</option>';
    html += '</select></div>';
    html += '<div class="settings-group">';
    html += '<button class="btn-secondary" onclick="exportData()" style="width:100%;margin-bottom:8px">Export Data</button>';
    html += '<button class="btn-secondary" onclick="importData()" style="width:100%">Import Data</button>';
    html += '</div>';
    html += '<div class="settings-group">';
    html += '<button class="btn-secondary" onclick="resetAllData()" style="width:100%;color:var(--red);border-color:rgba(255,23,68,0.3)">Reset All Data</button>';
    html += '</div>';
    panel.innerHTML = html;
  }

  window.renderSettings = renderSettings;
})();
