// ══ CALENDAR PAGE ══
ROUTER.register('calendar', initCalendar);

function initCalendar() {
  const container = document.getElementById('page-calendar');
  const events = API._getStaticCalendar();

  // Group by date
  const grouped = {};
  events.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const days = Object.keys(grouped).sort();
  const dateLabel = d => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  };

  const groups = days.map(day => {
    const evts = grouped[day].map(e => `
      <div class="calendar-event">
        <span class="event-time">${e.time}</span>
        <span class="event-impact impact-${e.impact}"></span>
        <span class="event-currency">${e.currency}</span>
        <span class="event-name">${e.event}</span>
        <span class="event-forecast">F: <strong>${e.forecast || '—'}</strong></span>
        <span class="event-prev">P: ${e.previous || '—'}</span>
      </div>`).join('');
    return `
      <div class="calendar-day-group">
        <div class="calendar-day-label">${dateLabel(day)}</div>
        ${evts}
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="calendar-page">
      <div class="panel-header">📅 Economic Calendar
        <div class="header-actions">
          <span class="badge badge-neut">Next 14 days</span>
        </div>
      </div>
      <div class="calendar-body">${groups}</div>
      <div class="impact-legend">
        <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--red);margin-right:5px"></span>High impact</span>
        <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--orange);margin-right:5px"></span>Medium</span>
        <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--muted);margin-right:5px"></span>Low</span>
      </div>
    </div>`;
}
