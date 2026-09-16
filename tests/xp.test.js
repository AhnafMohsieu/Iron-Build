const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k) { return this._d[k]||null; }, setItem(k,v){this._d[k]=v;} };
global.window = global;
global.document = {
  getElementById() {
    return {
      innerHTML: '',
      style: { display: '' },
      classList: { add(){}, remove(){} },
      onclick: null
    };
  },
  createElement() {
    return {
      className: '',
      textContent: '',
      style: { left: '', top: '', setProperty(){}, getPropertyValue(){ return ''; } },
      remove() {}
    };
  },
  body: { appendChild() {} }
};

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');

describe('XP system', () => {
  it('applyXpDelta increases xp and checks level', () => {
    S = freshState();
    const result = applyXpDelta(500);
    assert.equal(S.xp, 500);
    assert.ok(S.lv > 1);
    assert.ok(result.leveledUp);
  });

  it('spendXp decreases xp', () => {
    S = freshState();
    S.xp = 1000;
    S.lv = lvFrom(1000);
    spendXp(300);
    assert.equal(S.xp, 700);
  });

  it('spendXp does not go below 0', () => {
    S = freshState();
    S.xp = 50;
    spendXp(100);
    assert.equal(S.xp, 0);
  });

  it('weightedPick returns item from pool', () => {
    const pool = [{v:1,weight:1},{v:2,weight:1}];
    const result = weightedPick(pool);
    assert.ok(pool.some(p => p.v === result.v));
  });
});
