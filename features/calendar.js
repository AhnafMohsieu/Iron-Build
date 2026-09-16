// features/calendar.js — Workout calendar with colored dots
(function() {
  function renderCalendar(panel) {
    panel.innerHTML = '<div class="section-title">Workout Calendar</div><div id="calArea"></div>';
    renderCalendarGrid();
  }

  function renderCalendarGrid() {
    var area = document.getElementById('calArea');
    if (!area) return;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var html = '<div style="text-align:center;font-weight:700;font-size:1rem;margin-bottom:12px;color:var(--text)">' + monthNames[month] + ' ' + year + '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">';
    var days = ['S','M','T','W','T','F','S'];
    days.forEach(function(d) { html += '<div style="font-size:0.65rem;color:var(--text2);font-weight:600;padding:4px">' + d + '</div>'; });

    for (var i = 0; i < firstDay; i++) html += '<div></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      var hasWorkout = S.log[dateStr] && S.log[dateStr].workouts && S.log[dateStr].workouts.length > 0;
      var isToday = d === now.getDate();
      var bg = hasWorkout ? 'var(--primary)' : 'transparent';
      var color = hasWorkout ? '#fff' : (isToday ? 'var(--primary)' : 'var(--text2)');
      var border = isToday ? '2px solid var(--primary)' : '1px solid transparent';
      html += '<div style="width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:0.78rem;font-weight:' + (isToday ? '700' : '400') + ';background:' + bg + ';color:' + color + ';border:' + border + '">' + d + '</div>';
    }
    html += '</div>';
    area.innerHTML = html;
  }

  window.renderCalendar = renderCalendar;
  window.renderCalendarGrid = renderCalendarGrid;
})();
