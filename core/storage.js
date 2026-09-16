// core/storage.js — Schema-versioned localStorage wrapper
(function() {
  var PREFIX = 'ironbuild_';

  var Storage = {
    save: function(key, data) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.warn('Storage save failed:', e);
        return false;
      }
    },
    load: function(key) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Storage load failed:', e);
        return null;
      }
    },
    remove: function(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) {}
    },
    clear: function() {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) keys.push(k);
        }
        keys.forEach(function(k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
  };

  window.Storage = Storage;
})();
