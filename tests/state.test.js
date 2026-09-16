// tests/state.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Minimal localStorage mock for Node
global.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k,v) { this._d[k]=v; }, removeItem(k) { delete this._d[k]; }, length: 0, key(i) { return Object.keys(this._d)[i]; } };
global.window = global;

// Load modules
require('../core/helpers.js');
require('../core/storage.js');

describe('helpers', () => {
  it('today returns YYYY-MM-DD', () => {
    const t = today();
    assert.match(t, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('escapeHTML escapes special chars', () => {
    assert.equal(escapeHTML('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('getTodayKey matches today', () => {
    assert.equal(getTodayKey(), today());
  });
});

describe('Storage', () => {
  it('save and load round-trips', () => {
    Storage.save('test', { xp: 100, lv: 5 });
    const loaded = Storage.load('test');
    assert.deepEqual(loaded, { xp: 100, lv: 5 });
  });

  it('load returns null for missing key', () => {
    assert.equal(Storage.load('nonexistent'), null);
  });

  it('remove deletes the key', () => {
    Storage.save('toDelete', true);
    Storage.remove('toDelete');
    assert.equal(Storage.load('toDelete'), null);
  });
});

// Load levels and state
require('../data/levels.js');
require('../core/state.js');

describe('state', () => {
  it('freshState has all required keys', () => {
    const s = freshState();
    assert.ok(s.log);
    assert.equal(s.xp, 0);
    assert.equal(s.lv, 1);
    assert.equal(s.streak, 0);
    assert.ok(Array.isArray(s.goals));
    assert.ok(typeof s.prs === 'object');
  });

  it('normalizeState fills missing keys', () => {
    const partial = { xp: 500, lv: 1 };
    const normalized = normalizeState(partial);
    assert.equal(normalized.xp, 500);
    assert.ok(normalized.log !== undefined);
    assert.ok(normalized.goals !== undefined);
  });
});

describe('level system', () => {
  it('xpFor(1) = 0', () => { assert.equal(xpFor(1), 0); });

  it('xpFor(2) = floor(100 * 2^1.5) = 282', () => { assert.equal(xpFor(2), 282); });

  it('lvFrom(0) = 1', () => { assert.equal(lvFrom(0), 1); });

  it('lvFrom(282) = 2', () => { assert.equal(lvFrom(282), 2); });

  it('lvTitle(1) = Novice Lifter I', () => { assert.equal(lvTitle(1), 'Novice Lifter I'); });

  it('lvTitle(100) = Iron Titan', () => { assert.equal(lvTitle(100), 'Iron Titan'); });

  it('LEVELS has 100 entries', () => { assert.equal(LEVELS.length, 100); });
});
