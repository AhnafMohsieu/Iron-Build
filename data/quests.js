// data/quests.js — Quest definitions
const DQUESTS = [
  { id:'dq1', d:'Log any exercise', xp:30, c: function(s,t){ return (s.log[t]||{}).workouts && s.log[t].workouts.length > 0; } },
  { id:'dq2', d:'Log 3 sets total', xp:40, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.reduce(function(a,e){return a+e.sets.length;},0)>=3; } },
  { id:'dq3', d:'Do 30 total reps', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.reduce(function(a,e){return a+e.totalReps;},0)>=30; } },
  { id:'dq4', d:'Log a chest exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='chest';}); } },
  { id:'dq5', d:'Log a back exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='back';}); } },
  { id:'dq6', d:'Log a leg exercise', xp:35, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.muscle==='legs';}); } },
  { id:'dq7', d:'Log 2 different exercises', xp:45, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; var ids={}; w.forEach(function(e){ids[e.exerciseId]=1;}); return Object.keys(ids).length>=2; } },
  { id:'dq8', d:'Log a bodyweight exercise', xp:30, c: function(s,t){ var w=(s.log[t]||{}).workouts||[]; return w.some(function(e){var ex=getExerciseById(e.exerciseId);return ex&&ex.type==='bodyweight';}); } }
];

const WQUESTS = [
  { id:'wq1', d:'Workout 5 days this week', xp:300, c: function(s){ var c=0; for(var d=new Date();d>=new Date(Date.now()-7*864e5);d.setDate(d.getDate()-1)){var k=today(d);if(s.log[k]&&s.log[k].workouts&&s.log[k].workouts.length>0)c++;} return c>=5; } },
  { id:'wq2', d:'Log 20 total sets', xp:250, c: function(s){ return s.totalSets>=20; } },
  { id:'wq3', d:'Log 500 total reps', xp:300, c: function(s){ return s.totalReps>=500; } },
  { id:'wq4', d:'Hit a new PR', xp:200, c: function(s){ return s.totalPRs>0; } },
  { id:'wq5', d:'Log 3 different muscle groups', xp:250, c: function(s){ var muscles={};var t=today();if(s.log[t]&&s.log[t].workouts){s.log[t].workouts.forEach(function(w){var ex=getExerciseById(w.exerciseId);if(ex)muscles[ex.muscle]=1;});} return Object.keys(muscles).length>=3; } }
];

const MQUESTS = [
  { id:'mq1', d:'Complete 20 workouts', xp:1000, c: function(s){ return s.totalWorkouts>=20; } },
  { id:'mq2', d:'Set 3 new PRs', xp:800, c: function(s){ return s.totalPRs>=3; } },
  { id:'mq3', d:'Log 100 total sets', xp:900, c: function(s){ return s.totalSets>=100; } },
  { id:'mq4', d:'Log 2000 total reps', xp:1000, c: function(s){ return s.totalReps>=2000; } },
  { id:'mq5', d:'Achieve 7-day streak', xp:700, c: function(s){ return s.bestStreak>=7; } }
];

const LQUESTS = [
  { id:'lq1', d:'Complete 50 workouts', xp:2000, c: function(s){ return s.totalWorkouts>=50; } },
  { id:'lq2', d:'Complete 100 workouts', xp:5000, c: function(s){ return s.totalWorkouts>=100; } },
  { id:'lq3', d:'Complete 500 workouts', xp:20000, c: function(s){ return s.totalWorkouts>=500; } },
  { id:'lq4', d:'Hit 50 PRs', xp:15000, c: function(s){ return s.totalPRs>=50; } },
  { id:'lq5', d:'Reach Level 50', xp:25000, c: function(s){ return s.lv>=50; } },
  { id:'lq6', d:'Reach Level 100', xp:100000, c: function(s){ return s.lv>=100; } }
];

window.DQUESTS = DQUESTS;
window.WQUESTS = WQUESTS;
window.MQUESTS = MQUESTS;
window.LQUESTS = LQUESTS;
