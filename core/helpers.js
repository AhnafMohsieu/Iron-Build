// core/helpers.js — Shared utilities
(function() {
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function today(d) {
    var d2 = d || new Date();
    return d2.getFullYear() + '-' + (d2.getMonth()+1).toString().padStart(2,'0') + '-' + d2.getDate().toString().padStart(2,'0');
  }

  function getTodayKey() { return today(); }

  function getYesterdayKey() {
    var d = new Date(); d.setDate(d.getDate() - 1); return today(d);
  }

  function getWeekAgoKey() {
    var d = new Date(); d.setDate(d.getDate() - 7); return today(d);
  }

  window.escapeHTML = escapeHTML;
  window.today = today;
  window.getTodayKey = getTodayKey;
  window.getYesterdayKey = getYesterdayKey;
  window.getWeekAgoKey = getWeekAgoKey;
})();
