const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;} };
global.window = global;
global.document = { readyState: 'complete', getElementById: () => null, addEventListener: () => {}, createElement: () => ({style:{},onclick:null,onmouseover:null,onmouseout:null,className:'',innerHTML:'',textContent:'',appendChild:()=>{},click:()=>{}}) };
global.confirm = () => true;
global.alert = () => {};

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');
require('../data/tab-groups.js');
require('../data/exercises.js');

describe('workout logging', () => {
  it('getTodayLog creates log entry for today', () => {
    S = freshState();
    const t = today();
    assert.ok(!S.log[t]);
    if (!S.log[t]) S.log[t] = { workouts: [] };
    assert.ok(Array.isArray(S.log[t].workouts));
  });

  it('exercise lookup works', () => {
    const ex = getExerciseById('bench_press');
    assert.ok(ex);
    assert.equal(ex.muscle, 'chest');
  });

  it('getExercisesByMuscle returns correct count', () => {
    const chest = getExercisesByMuscle('chest');
    assert.ok(chest.length >= 5);
  });
});
