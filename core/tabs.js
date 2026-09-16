// core/tabs.js — Tab navigation
(function() {
  var currentCat = 'today';
  var currentTab = 'workout';

  function renderTier1() {
    var container = document.getElementById('tier1Tabs');
    container.innerHTML = '';
    CAT_ORDER.forEach(function(cat) {
      var meta = CAT_META[cat];
      var btn = document.createElement('button');
      btn.className = 't1-btn' + (cat === currentCat ? ' active' : '');
      btn.innerHTML = meta.icon + ' ' + meta.label;
      btn.onclick = function() { switchCategory(cat); };
      container.appendChild(btn);
    });
  }

  function renderTier2() {
    var container = document.getElementById('tier2Tabs');
    container.innerHTML = '';
    var tabs = TAB_GROUPS[currentCat] || [];
    tabs.forEach(function(tab) {
      var btn = document.createElement('button');
      btn.className = 't2-btn' + (tab.id === currentTab ? ' active' : '');
      btn.innerHTML = '<span>' + tab.icon + '</span>' + tab.label;
      btn.onclick = function() { switchTab(tab.id); };
      container.appendChild(btn);
    });
  }

  function switchCategory(cat) {
    currentCat = cat;
    var tabs = TAB_GROUPS[cat];
    if (tabs && tabs.length) currentTab = tabs[0].id;
    S.lastCat = cat;
    S.lastTab = currentTab;
    renderTier1();
    renderTier2();
    renderActivePanel();
  }

  function switchTab(tabId) {
    currentTab = tabId;
    S.lastTab = tabId;
    renderTier2();
    renderActivePanel();
  }

  function renderActivePanel() {
    var container = document.getElementById('panelContainer');
    container.innerHTML = '';
    var panel = document.createElement('div');
    panel.className = 'tab-panel active';
    panel.id = 'panel-' + currentTab;
    container.appendChild(panel);
    if (typeof renderDynamic === 'function') renderDynamic(currentTab, panel);
  }

  function initTabs() {
    if (S.lastCat && TAB_GROUPS[S.lastCat]) currentCat = S.lastCat;
    if (S.lastTab) currentTab = S.lastTab;
    renderTier1();
    renderTier2();
    renderActivePanel();
  }

  window.initTabs = initTabs;
  window.switchCategory = switchCategory;
  window.switchTab = switchTab;
  window.getCurrentTab = function() { return currentTab; };
})();
