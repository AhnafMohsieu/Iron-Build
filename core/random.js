// core/random.js — Weighted random selection
(function() {
  function weightedPick(pool) {
    var total = pool.reduce(function(sum, item) { return sum + (item.weight || 1); }, 0);
    var r = Math.random() * total;
    var acc = 0;
    for (var i = 0; i < pool.length; i++) {
      acc += pool[i].weight || 1;
      if (r <= acc) return pool[i];
    }
    return pool[pool.length - 1];
  }
  window.weightedPick = weightedPick;
})();
