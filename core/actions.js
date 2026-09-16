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
