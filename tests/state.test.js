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
