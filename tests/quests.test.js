const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

global.localStorage = { _d: {}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;} };
global.window = global;
global.document = { readyState:'complete', getElementById:()=>null, addEventListener:()=>{}, createElement:()=>({style:{},onclick:null,className:'',innerHTML:'',textContent:'',appendChild:()=>{}}) };

require('../core/helpers.js');
require('../core/storage.js');
require('../data/levels.js');
require('../core/state.js');
require('../core/random.js');
require('../render/modals.js');
require('../core/xp.js');
require('../data/exercises.js');
require('../data/quests.js');
require('../features/quests.js');

describe('quests', () => {
  it('genDQ creates 4 daily quests', () => {
    S = freshState();
    genDQ();
    assert.equal(S.dq.length, 4);
  });

  it('genLQ creates lifetime quests', () => {
    S = freshState();
    genLQ();
    assert.equal(S.lq.length, LQUESTS.length);
  });

  it('checkQ marks completed quests', () => {
    S = freshState();
    S.log[today()] = { workouts: [{ exerciseId: 'bench_press', sets: [{weight:80,reps:10,done:true}], totalReps: 10, weight: 80 }] };
    S.totalWorkouts = 1;
    genDQ();
    checkQ();
    var completed = S.dq.filter(function(q) { return q.done; });
    assert.ok(completed.length > 0);
  });
});
