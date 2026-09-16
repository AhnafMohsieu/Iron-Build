// core/xp.js — XP granting, level-up detection, sound effects
(function() {
  var _audioCtx = null;

  function playSound(type) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!_audioCtx) _audioCtx = new AC();
      var ctx = _audioCtx;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {}
  }

  function checkLevelUp(oldLv) {
    if (S.lv > oldLv) {
      levelUpToast(S.lv, lvTitle(S.lv));
    }
  }

  function applyXpDelta(delta, opts) {
    var oldLv = S.lv;
    S.xp += delta;
    S.lv = lvFrom(S.xp);
    if (!(opts && opts.skipLevelToast)) checkLevelUp(oldLv);
    return { oldLv: oldLv, newLv: S.lv, leveledUp: S.lv > oldLv };
  }

  function spendXp(amount, opts) {
    var clamped = Math.max(0, S.xp - amount);
    var delta = clamped - S.xp;
    return applyXpDelta(delta, opts);
  }

  function grantDailyXp(amount, key) {
    if (!S.xpDaily) S.xpDaily = {};
    var dk = key + '|' + today();
    if (S.xpDaily[dk]) return false;
    S.xpDaily[dk] = true;
    var oldLv = S.lv;
    S.xp += amount;
    S.lv = lvFrom(S.xp);
    checkLevelUp(oldLv);
    playSound('pop');
    saveState();
    return true;
  }

  function levelUpToast(lv, title) {
    openToastModal(
      '<span class="toast-icon">🔥</span>' +
      '<h3>LEVEL UP</h3>' +
      '<div style="font-size:2.4rem;font-weight:900;color:var(--primary);margin:8px 0">' + lv + '</div>' +
      '<div style="color:var(--text2);font-size:0.9rem">' + escapeHTML(title) + '</div>'
    );
    playSound('chime');
    for (var i = 0; i < 30; i++) {
      var el = document.createElement('span');
      el.className = 'confetti';
      el.textContent = ['🔥','💪','⚡','🏋️','💥','⭐'][i % 6];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = '-20px';
      el.style.setProperty('--fall-dur', (2 + Math.random() * 4) + 's');
      el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(el);
      setTimeout(function(e) { e.remove(); }.bind(null, el), 4000);
    }
  }

  window.applyXpDelta = applyXpDelta;
  window.spendXp = spendXp;
  window.grantDailyXp = grantDailyXp;
  window.levelUpToast = levelUpToast;
  window.playSound = playSound;
})();
