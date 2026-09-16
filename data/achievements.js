// data/achievements.js — Achievement definitions
const ACHIEVEMENTS = [
  { id:'first_workout', name:'First Steps', desc:'Log your first workout', icon:'🏋️', xp:50, check: function(s){ return s.totalWorkouts >= 1; } },
  { id:'five_workouts', name:'Getting Serious', desc:'Log 5 workouts', icon:'💪', xp:100, check: function(s){ return s.totalWorkouts >= 5; } },
  { id:'twenty_workouts', name:'Iron Will', desc:'Log 20 workouts', icon:'🔥', xp:250, check: function(s){ return s.totalWorkouts >= 20; } },
  { id:'fifty_workouts', name:'Gym Warrior', desc:'Log 50 workouts', icon:'⚔️', xp:500, check: function(s){ return s.totalWorkouts >= 50; } },
  { id:'hundred_workouts', name:'Iron Legend', desc:'Log 100 workouts', icon:'🏆', xp:1000, check: function(s){ return s.totalWorkouts >= 100; } },
  { id:'first_pr', name:'New Record', desc:'Set your first PR', icon:'🎯', xp:75, check: function(s){ return s.totalPRs >= 1; } },
  { id:'five_prs', name:'Record Breaker', desc:'Set 5 PRs', icon:'🏅', xp:200, check: function(s){ return s.totalPRs >= 5; } },
  { id:'twenty_prs', name:'PR Machine', desc:'Set 20 PRs', icon:'🥇', xp:500, check: function(s){ return s.totalPRs >= 20; } },
  { id:'streak_3', name:'Consistent', desc:'3-day streak', icon:'🔥', xp:50, check: function(s){ return s.bestStreak >= 3; } },
  { id:'streak_7', name:'Unstoppable', desc:'7-day streak', icon:'🔥', xp:150, check: function(s){ return s.bestStreak >= 7; } },
  { id:'streak_30', name:'Iron Discipline', desc:'30-day streak', icon:'🔥', xp:500, check: function(s){ return s.bestStreak >= 30; } },
  { id:'level_5', name:'Rising Star', desc:'Reach level 5', icon:'⭐', xp:50, check: function(s){ return s.lv >= 5; } },
  { id:'level_10', name:'Iron Beginner', desc:'Reach level 10', icon:'⭐', xp:100, check: function(s){ return s.lv >= 10; } },
  { id:'level_25', name:'Steel Warrior', desc:'Reach level 25', icon:'⭐', xp:300, check: function(s){ return s.lv >= 25; } },
  { id:'level_50', name:'Bronze Beast', desc:'Reach level 50', icon:'⭐', xp:750, check: function(s){ return s.lv >= 50; } },
  { id:'level_100', name:'Iron Titan', desc:'Reach level 100', icon:'👑', xp:5000, check: function(s){ return s.lv >= 100; } },
  { id:'total_1000_reps', name:'Repper', desc:'Log 1000 total reps', icon:'💪', xp:200, check: function(s){ return s.totalReps >= 1000; } },
  { id:'total_5000_reps', name:'Rep Master', desc:'Log 5000 total reps', icon:'💪', xp:500, check: function(s){ return s.totalReps >= 5000; } },
  { id:'total_100_sets', name:'Set Collector', desc:'Log 100 total sets', icon:'📊', xp:300, check: function(s){ return s.totalSets >= 100; } },
  { id:'all_muscles', name:'Full Body', desc:'Work all muscle groups', icon:'🎯', xp:400, check: function(s){
    var muscles = {};
    Object.keys(s.log).forEach(function(d){
      (s.log[d].workouts||[]).forEach(function(w){
        var ex = getExerciseById(w.exerciseId);
        if(ex) muscles[ex.muscle] = 1;
      });
    });
    return Object.keys(muscles).length >= 8;
  }}
];

window.ACHIEVEMENTS = ACHIEVEMENTS;
