// features/workout-log.js — Workout logging (detailed + quick mode)
(function() {
  function getTodayLog() {
    var t = today();
    if (!S.log[t]) S.log[t] = { workouts: [] };
    return S.log[t];
  }

  function openExercisePicker() {
    var html = '<img class="gym-icon-lg" src="assets/icons/emoji_u1f3cb.png" alt="" role="img" loading="lazy"><h3>Pick an Exercise</h3>';
    html += '<div style="margin-top:16px;text-align:left;max-height:60vh;overflow-y:auto">';
    var muscles = ['chest','back','legs','shoulders','arms','core','bodyweight','cardio'];
    muscles.forEach(function(muscle) {
      var exercises = getExercisesByMuscle(muscle);
      html += '<div style="margin-bottom:12px">';
      html += '<div style="color:var(--primary);font-size:0.75rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">' + muscle + '</div>';
      exercises.forEach(function(ex) {
        html += '<div style="padding:10px 12px;cursor:pointer;border-radius:8px;margin-bottom:4px;background:var(--card-bg);border:1px solid var(--border)" ' +
          'onclick="startWorkoutExercise(\'' + ex.id + '\');closeToastOverlay()"' +
          'onmouseover="this.style.borderColor=\'var(--primary)\'" onmouseout="this.style.borderColor=\'var(--border)\'">' +
          '<div style="display:flex;align-items:center;gap:8px"><span>' + gymIcon(ex.icon, 'gym-icon-sm') + '</span><span style="font-weight:600">' + escapeHTML(ex.name) + '</span>' +
          '<span style="margin-left:auto;color:var(--gold);font-size:0.72rem">' + ex.xp + ' XP</span></div>' +
          (ex.desc ? '<div style="font-size:0.68rem;color:var(--text2);margin-top:4px;line-height:1.4">' + escapeHTML(ex.desc) + '</div>' : '') +
          '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    openToastModal(html);
  }

  function startWorkoutExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var html = gymIcon(ex.icon, 'gym-icon-lg') + '<h3>' + escapeHTML(ex.name) + '</h3>';
    if (ex.desc) html += '<div style="color:var(--text2);font-size:0.78rem;margin-top:6px;line-height:1.4;text-align:left">' + escapeHTML(ex.desc) + '</div>';
    html += '<div style="margin-top:14px;text-align:left">';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Sets</label>';
    html += '<input id="wSets" type="number" value="3" min="1" max="20" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:10px"><label style="color:var(--text2);font-size:0.75rem">Reps per set</label>';
    html += '<input id="wReps" type="number" value="10" min="1" max="100" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:14px"><label style="color:var(--text2);font-size:0.75rem">Weight (' + S.units + ')</label>';
    html += '<input id="wWeight" type="number" value="0" min="0" step="0.5" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveWorkoutExercise(\'' + ex.id + '\')">Log Exercise</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveWorkoutExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var sets = parseInt(document.getElementById('wSets').value) || 3;
    var reps = parseInt(document.getElementById('wReps').value) || 10;
    var weight = parseFloat(document.getElementById('wWeight').value) || 0;

    var entry = {
      exerciseId: exerciseId,
      sets: [],
      totalReps: sets * reps,
      weight: weight,
      timestamp: Date.now()
    };
    for (var i = 0; i < sets; i++) {
      entry.sets.push({ weight: weight, reps: reps, done: true });
    }

    var todayLog = getTodayLog();
    todayLog.workouts.push(entry);

    S.totalWorkouts++;
    S.totalSets += sets;
    S.totalReps += sets * reps;

    checkAndUpdatePR(exerciseId, weight, reps);

    var xpEarned = ex.xp;
    applyXpDelta(xpEarned);

    updateStreak();

    saveState();
    closeToastOverlay();
    renderAll();

    // Check quests and achievements
    if (typeof checkQ === 'function') checkQ();
    if (typeof checkAchievements === 'function') checkAchievements();

    openToastModal(
      '<img class="gym-icon-lg" src="assets/icons/emoji_u2705.png" alt="" role="img" loading="lazy">' +
      '<h3>Exercise Logged!</h3>' +
      '<div style="color:var(--gold);margin-top:8px">+' + xpEarned + ' XP</div>'
    );
  }

  function checkAndUpdatePR(exerciseId, weight, reps) {
    if (!S.prs) S.prs = {};
    var current = S.prs[exerciseId];
    var isNewPR = false;
    if (!current) {
      isNewPR = true;
    } else if (weight > current.weight || (weight === current.weight && reps > current.reps)) {
      isNewPR = true;
    }
    if (isNewPR) {
      S.prs[exerciseId] = { weight: weight, reps: reps, date: today() };
      S.totalPRs = (S.totalPRs || 0) + 1;
      setTimeout(function() {
        openToastModal(
          '<img class="gym-icon-lg" src="assets/icons/emoji_u1f3c6.png" alt="" role="img" loading="lazy">' +
          '<h3>New PR!</h3>' +
          '<div style="color:var(--primary);margin-top:8px">' + weight + 'kg × ' + reps + ' reps</div>'
        );
        applyXpDelta(100);
        saveState();
        renderAll();
      }, 1500);
    }
  }

  function updateStreak() {
    var t = today();
    if (S.lastActiveDate === t) return;
    var yesterday = getYesterdayKey();
    if (S.lastActiveDate === yesterday) {
      S.streak++;
    } else if (S.lastActiveDate !== t) {
      S.streak = 1;
    }
    S.lastActiveDate = t;
    if (S.streak > S.bestStreak) S.bestStreak = S.streak;
  }

  function renderTodayWorkout() {
    var container = document.getElementById('todayWorkout');
    if (!container) return;
    var todayLog = getTodayLog();
    var workouts = todayLog.workouts || [];
    if (workouts.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)">No exercises logged today. Tap + to start!</div>';
      return;
    }
    var html = '';
    workouts.forEach(function(w, idx) {
      var ex = getExerciseById(w.exerciseId);
      html += '<div class="card done">';
      html += '<div class="card-check">✓</div>';
      html += '<div class="card-info">';
      html += '<div class="card-name">' + (ex ? ex.name : w.exerciseId) + '</div>';
      html += '<div class="card-meta">' + w.sets.length + ' sets × ' + w.sets[0].reps + ' reps @ ' + w.weight + S.units + '</div>';
      html += '</div>';
      html += '<div class="card-xp">+' + (ex ? ex.xp : 0) + ' XP</div>';
      html += '</div>';
    });
    container.innerHTML = html;
  }

  function renderQuickExercises() {
    var container = document.getElementById('quickExercises');
    if (!container) return;
    var html = '<div class="exercise-grid" style="padding:0 18px">';
    EXERCISES.slice(0, 20).forEach(function(ex) {
      html += '<div class="card exercise-card" onclick="quickLogExercise(\'' + ex.id + '\')">';
      html += '<div class="exercise-icon">' + gymIcon(ex.icon, 'gym-icon') + '</div>';
      html += '<div class="exercise-name">' + escapeHTML(ex.name) + '</div>';
      html += '<div class="exercise-xp">' + ex.xp + ' XP</div>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function quickLogExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var html = gymIcon(ex.icon, 'gym-icon-lg') + '<h3>Quick Log: ' + escapeHTML(ex.name) + '</h3>';
    html += '<div style="margin-top:16px;text-align:left">';
    html += '<div style="margin-bottom:12px"><label style="color:var(--text2);font-size:0.8rem">Total Reps</label>';
    html += '<input id="qReps" type="number" value="20" min="1" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<div style="margin-bottom:16px"><label style="color:var(--text2);font-size:0.8rem">Weight (' + S.units + ')</label>';
    html += '<input id="qWeight" type="number" value="0" min="0" step="0.5" style="width:100%;padding:10px;border-radius:10px;background:var(--bg);color:var(--text);border:1px solid var(--border);margin-top:4px;font-family:var(--font)"></div>';
    html += '<button class="btn-primary" style="width:100%" onclick="saveQuickExercise(\'' + ex.id + '\')">Log</button>';
    html += '</div>';
    openToastModal(html);
  }

  function saveQuickExercise(exerciseId) {
    var ex = getExerciseById(exerciseId);
    if (!ex) return;
    var reps = parseInt(document.getElementById('qReps').value) || 20;
    var weight = parseFloat(document.getElementById('qWeight').value) || 0;

    var entry = {
      exerciseId: exerciseId,
      sets: [{ weight: weight, reps: reps, done: true }],
      totalReps: reps,
      weight: weight,
      timestamp: Date.now(),
      quick: true
    };

    var todayLog = getTodayLog();
    todayLog.workouts.push(entry);

    S.totalWorkouts++;
    S.totalSets++;
    S.totalReps += reps;

    checkAndUpdatePR(exerciseId, weight, reps);

    var xpEarned = Math.floor(ex.xp * 0.7);
    applyXpDelta(xpEarned);
    updateStreak();
    saveState();
    closeToastOverlay();
    renderAll();

    if (typeof checkQ === 'function') checkQ();
    if (typeof checkAchievements === 'function') checkAchievements();

    openToastModal(
      '<img class="gym-icon-lg" src="assets/icons/emoji_u26a1.png" alt="" role="img" loading="lazy">' +
      '<h3>Quick Logged!</h3>' +
      '<div style="color:var(--gold);margin-top:8px">+' + xpEarned + ' XP</div>'
    );
  }

  window.openExercisePicker = openExercisePicker;
  window.startWorkoutExercise = startWorkoutExercise;
  window.saveWorkoutExercise = saveWorkoutExercise;
  window.renderTodayWorkout = renderTodayWorkout;
  window.renderQuickExercises = renderQuickExercises;
  window.quickLogExercise = quickLogExercise;
  window.saveQuickExercise = saveQuickExercise;
})();
