// features/shop.js — XP shop for cosmetic items
(function() {
  function renderShopPanel(panel) {
    var html = '<div class="section-title">Shop</div>';
    html += '<div style="text-align:center;color:var(--text2);font-size:0.8rem;margin-bottom:12px">Your XP: <span style="color:var(--gold);font-weight:700">' + S.xp + '</span></div>';
    SHOP_ITEMS.forEach(function(item) {
      var owned = S.ownedTitles && S.ownedTitles.indexOf(item.id) !== -1;
      var canAfford = S.xp >= item.cost;
      html += '<div class="card' + (owned ? ' done' : '') + '">';
      html += '<div class="card-icon">' + (item.type === 'title' ? '🏷️' : item.type === 'frame' ? item.value : '⚡') + '</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + escapeHTML(item.name) + '</div>';
      html += '<div class="card-meta">' + item.type + '</div>';
      html += '</div>';
      if (owned) {
        html += '<div class="card-xp" style="background:rgba(0,200,83,0.08);border-color:rgba(0,200,83,0.15);color:var(--green)">Owned</div>';
      } else {
        html += '<button class="btn-primary" style="padding:6px 14px;font-size:0.75rem;border-radius:16px' + (canAfford ? '' : ';opacity:0.4;pointer-events:none') + '" onclick="buyItem(\'' + item.id + '\')">' + item.cost + ' XP</button>';
      }
      html += '</div>';
    });
    panel.innerHTML = html;
  }

  function buyItem(itemId) {
    var item = SHOP_ITEMS.find(function(i) { return i.id === itemId; });
    if (!item || S.xp < item.cost) return;
    spendXp(item.cost);
    if (!S.ownedTitles) S.ownedTitles = [];
    S.ownedTitles.push(item.id);
    saveState();
    renderAll();
    openToastModal('<span class="toast-icon">🛍️</span><h3>Purchased!</h3><div style="color:var(--primary);margin-top:4px">' + item.name + '</div>');
  }

  window.renderShopPanel = renderShopPanel;
  window.buyItem = buyItem;
})();
