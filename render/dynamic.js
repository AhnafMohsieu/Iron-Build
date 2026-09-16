// render/dynamic.js — Dynamic panel rendering
(function() {
  function renderDynamic(tabId, panel) {
    if (!panel) return;
    if (typeof EXERCISES !== 'undefined' && getMuscleGroup(tabId)) {
      renderExerciseGrid(tabId, panel);
    } else if (tabId === 'workout') {
      renderWorkoutLog(panel);
    } else if (tabId === 'quick') {
      renderQuickLog(panel);
    } else if (tabId === 'warmup') {
      renderWarmup(panel);
    } else if (tabId === 'history') {
      renderHistory(panel);
    } else if (tabId === 'daily' || tabId === 'weekly' || tabId === 'monthly' || tabId === 'lifetime') {
      renderQuests(tabId, panel);
    } else if (tabId === 'active') {
      renderGoals(panel);
    } else if (tabId === 'prs') {
      renderPRs(panel);
    } else if (tabId === 'calendar') {
      renderCalendar(panel);
    } else if (tabId === 'stats') {
      renderStats(panel);
    } else if (tabId === 'body') {
      renderBodyMetrics(panel);
    } else if (tabId === 'achievements') {
      renderAchievements(panel);
    } else if (tabId === 'shop') {
      renderShop(panel);
    } else if (tabId === 'settings') {
      renderSettings(panel);
    } else {
      panel.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)"><p>Coming soon</p></div>';
    }
  }

  function getMuscleGroup(tabId) {
    var muscles = ['chest','back','legs','shoulders','arms','core','cardio','bodyweight'];
    return muscles.indexOf(tabId) !== -1 ? tabId : null;
  }

  function renderExerciseGrid(muscle, panel) {
    var exercises = getExercisesByMuscle(muscle);
    var title = muscle.charAt(0).toUpperCase() + muscle.slice(1);
    var html = '<div class="section-title">' + title + ' Exercises</div>';
    html += '<div class="exercise-grid">';
    exercises.forEach(function(ex) {
      html += '<div class="card exercise-card" onclick="startWorkoutExercise(\'' + ex.id + '\')">';
      html += '<div class="exercise-icon">' + gymIcon(ex.icon, 'gym-icon') + '</div>';
      html += '<div class="exercise-name">' + escapeHTML(ex.name) + '</div>';
      if (ex.desc) html += '<div class="exercise-desc">' + escapeHTML(ex.desc) + '</div>';
      html += '<div class="exercise-type">' + ex.type + '</div>';
      html += '<div class="exercise-xp">' + ex.xp + ' XP</div>';
      html += '</div>';
    });
    html += '</div>';
    panel.innerHTML = html;
  }

  function renderWorkoutLog(panel) {
    panel.innerHTML = '<div class="section-title">Today\'s Workout</div>' +
      '<div id="todayWorkout"></div>' +
      '<div style="text-align:center;margin-top:20px">' +
      '<button class="btn-primary" onclick="openExercisePicker()">+ Add Exercise</button></div>';
    if (typeof renderTodayWorkout === 'function') renderTodayWorkout();
  }

  function renderQuickLog(panel) {
    panel.innerHTML = '<div class="section-title">Quick Log</div>' +
      '<div style="text-align:center;padding:20px;color:var(--text2)">' +
      '<p>Tap an exercise to quick-log reps and weight</p></div>' +
      '<div id="quickExercises"></div>';
    if (typeof renderQuickExercises === 'function') renderQuickExercises();
  }

  function renderWarmup(panel) {
    if (typeof WARMUP_ROUTINES === 'undefined') {
      panel.innerHTML = '<div class="section-title">Warm-up Routines</div><p style="color:var(--text2)">Loading...</p>';
      return;
    }
    var html = '<div class="section-title">Warm-up Routines</div>';
    Object.keys(WARMUP_ROUTINES).forEach(function(key) {
      var routine = WARMUP_ROUTINES[key];
      html += '<details class="cat-details"><summary>' + escapeHTML(routine.name) + '</summary>';
      html += '<div style="padding:14px 18px">';
      routine.movements.forEach(function(m) {
        html += '<div style="padding:8px 0;border-bottom:1px solid var(--border)">';
        html += '<strong>' + escapeHTML(m.name) + '</strong>';
        html += '<span style="color:var(--text2);margin-left:8px">' + escapeHTML(m.reps) + '</span>';
        html += '</div>';
      });
      html += '</div></details>';
    });
    panel.innerHTML = html;
  }

  function renderHistory(panel) {
    var html = '<div class="section-title">Past Workouts</div>';
    var dates = Object.keys(S.log).sort().reverse().slice(0, 30);
    if (dates.length === 0) {
      html += '<div style="text-align:center;padding:40px;color:var(--text2)">No workouts logged yet</div>';
    } else {
      dates.forEach(function(date) {
        var day = S.log[date];
        var count = day.workouts ? day.workouts.length : 0;
        html += '<div class="card"><div class="card-info">';
        html += '<div class="card-name">' + date + '</div>';
        html += '<div class="card-meta">' + count + ' workout' + (count !== 1 ? 's' : '') + '</div>';
        html += '</div></div>';
      });
    }
    panel.innerHTML = html;
  }

  function renderQuests(type, panel) {
    if (typeof renderQuestPanel === 'function') {
      renderQuestPanel(type, panel);
    } else {
      panel.innerHTML = '<div class="section-title">' + type.charAt(0).toUpperCase() + type.slice(1) + ' Quests</div>' +
        '<div style="padding:20px;color:var(--text2)">Quest system loading...</div>';
    }
  }

  function renderGoals(panel) {
    if (typeof renderGoalsPanel === 'function') {
      renderGoalsPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Active Goals</div>' +
        '<div style="text-align:center;padding:20px"><button class="btn-primary" onclick="createGoal()">+ New Goal</button></div>';
    }
  }

  function renderPRs(panel) {
    if (typeof renderPRPanel === 'function') {
      renderPRPanel(panel);
    } else {
      var html = '<div class="section-title">Personal Records</div>';
      var prs = S.prs || {};
      var keys = Object.keys(prs);
      if (keys.length === 0) {
        html += '<div style="text-align:center;padding:40px;color:var(--text2)">No PRs yet. Start lifting!</div>';
      } else {
        keys.forEach(function(exId) {
          var ex = getExerciseById(exId);
          var pr = prs[exId];
          html += '<div class="card"><div class="card-info">';
          html += '<div class="card-name">' + (ex ? ex.name : exId) + '</div>';
          html += '<div class="card-meta">' + pr.weight + 'kg × ' + pr.reps + ' reps — ' + pr.date + '</div>';
          html += '</div></div>';
        });
      }
      panel.innerHTML = html;
    }
  }

  function renderCalendar(panel) {
    panel.innerHTML = '<div class="section-title">Workout Calendar</div><div id="calArea"></div>';
    if (typeof renderCalendarGrid === 'function') renderCalendarGrid();
  }

  function renderStats(panel) {
    var html = '<div class="section-title">Your Stats</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--primary)">' + S.totalWorkouts + '</div><div style="color:var(--text2);font-size:0.8rem">Total Workouts</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--gold)">' + S.totalPRs + '</div><div style="color:var(--text2);font-size:0.8rem">Personal Records</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--green)">' + S.totalReps + '</div><div style="color:var(--text2);font-size:0.8rem">Total Reps</div></div>';
    html += '<div class="card" style="flex-direction:column;text-align:center;padding:20px"><div style="font-size:2rem;font-weight:900;color:var(--primary-light)">' + S.totalSets + '</div><div style="color:var(--text2);font-size:0.8rem">Total Sets</div></div>';
    html += '</div>';
    panel.innerHTML = html;
  }

  function renderBodyMetrics(panel) {
    if (typeof renderBodyPanel === 'function') {
      renderBodyPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Body Metrics</div>' +
        '<div style="text-align:center;padding:20px"><button class="btn-primary" onclick="logBodyMetrics()">+ Log Metrics</button></div>';
    }
  }

  function renderAchievements(panel) {
    if (typeof renderAchievementPanel === 'function') {
      renderAchievementPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Achievements</div>';
    }
  }

  function renderShop(panel) {
    if (typeof renderShopPanel === 'function') {
      renderShopPanel(panel);
    } else {
      panel.innerHTML = '<div class="section-title">Shop</div>';
    }
  }

  function renderSettings(panel) {
    var html = '<div class="section-title">Settings</div>';
    html += '<div class="card" style="flex-direction:column;align-items:stretch;gap:14px">';
    html += '<label style="color:var(--text2);font-size:0.85rem">Units</label>';
    html += '<select id="unitsSelect" style="padding:12px;border-radius:12px;background:var(--bg);color:var(--text);border:1px solid var(--border);font-family:var(--font)" onchange="updateUnits(this.value)">';
    html += '<option value="kg"' + (S.units === 'kg' ? ' selected' : '') + '>Kilograms (kg)</option>';
    html += '<option value="lbs"' + (S.units === 'lbs' ? ' selected' : '') + '>Pounds (lbs)</option>';
    html += '</select>';
    html += '<div class="gold-divider"></div>';
    html += '<button class="btn-secondary" onclick="exportData()" style="width:100%">Export Data</button>';
    html += '<button class="btn-secondary" onclick="importData()" style="width:100%">Import Data</button>';
    html += '<div class="gold-divider"></div>';
    html += '<button class="btn-secondary" onclick="resetAllData()" style="width:100%;color:var(--red);border-color:rgba(255,23,68,0.3)">Reset All Data</button>';
    html += '</div>';
    panel.innerHTML = html;
  }

  window.renderDynamic = renderDynamic;
  window.renderExerciseGrid = renderExerciseGrid;
  window.renderWorkoutLog = renderWorkoutLog;
})();
