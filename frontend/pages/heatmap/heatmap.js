// ══ HEATMAP PAGE ══
ROUTER.register('heatmap', initHeatmap);

function initHeatmap() {
  const container = document.getElementById('page-heatmap');

  const currencies = MACRO.CURRENCIES;
  const factors = MACRO.FACTORS;

  // Build header cols
  let headerCols = `<th>SYMBOL</th><th>BIAS</th><th>SCORE</th>`;
  for (const f of factors) {
    headerCols += `<th title="${f.desc}">${f.label}</th>`;
  }

  // Build rows
  let rows = '';
  for (const cur of currencies) {
    const scores = STATE.macroData[cur] || MACRO.DEMO_SCORES[cur] || {};
    const composite = MACRO.computeScore(cur);
    const bias = MACRO.getBias(composite);
    const biasClass = bias === 'Bullish' ? 'tag-bullish' : bias === 'Bearish' ? 'tag-bearish' : 'tag-neutral';
    const badgeClass = bias === 'Bullish' ? 'badge-bull' : bias === 'Bearish' ? 'badge-bear' : 'badge-neut';
    const scoreBg = MACRO.getScoreBg(composite);
    const scoreColor = composite >= 0.5 ? 'var(--green)' : composite <= -0.5 ? 'var(--red)' : 'var(--muted)';

    let cells = '';
    for (const f of factors) {
      const val = (scores[f.id] !== undefined) ? scores[f.id] : null;
      const bg = val !== null ? MACRO.getCellBg(val) : 'transparent';
      const color = val !== null ? MACRO.getFactorColor(val) : 'var(--faint)';
      const display = val !== null ? (val > 0 ? '+' + val : val) : '—';
      cells += `<td><div class="hm-cell" style="background:${bg};color:${color}">${display}</div></td>`;
    }

    rows += `
      <tr data-bias="${bias.toLowerCase()}">
        <td class="hm-symbol">${cur}</td>
        <td class="hm-bias"><span class="badge ${badgeClass}">${bias}</span></td>
        <td><span class="hm-score" style="color:${scoreColor};background:${scoreBg};padding:3px 8px;border-radius:4px">${composite > 0 ? '+' : ''}${composite}</span></td>
        ${cells}
      </tr>`;
  }

  container.innerHTML = `
    <div class="heatmap-page">
      <div class="heatmap-toolbar">
        <span class="toolbar-title">🌡️ Currency Strength Heatmap</span>
        <div class="sep"></div>
        <div class="bias-filter">
          <button class="bias-btn active-all" data-filter="all">All Biases</button>
          <button class="bias-btn" data-filter="bullish">Bullish</button>
          <button class="bias-btn" data-filter="bearish">Bearish</button>
          <button class="bias-btn" data-filter="neutral">Neutral</button>
        </div>
        <button class="btn btn-ghost" id="hm-refresh" style="margin-left:8px;padding:4px 10px;font-size:10px">🔄 Refresh</button>
        <span class="update-time" id="hm-update-time">Updated: just now</span>
      </div>
      <div class="heatmap-body">
        <table class="heatmap-table">
          <thead><tr>${headerCols}</tr></thead>
          <tbody id="heatmap-tbody">${rows}</tbody>
        </table>
      </div>
      <div class="factor-legend">
        <span><span class="legend-dot" style="background:rgba(166,227,161,0.6)"></span>Bullish factor (+1/+2)</span>
        <span><span class="legend-dot" style="background:rgba(239,83,80,0.6)"></span>Bearish factor (-1/-2)</span>
        <span><span class="legend-dot" style="background:rgba(108,112,134,0.2)"></span>Neutral (0)</span>
        <span style="margin-left:auto;color:var(--faint)">Hover column headers for factor descriptions</span>
      </div>
    </div>`;

  // Filter buttons
  container.querySelectorAll('.bias-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.bias-btn').forEach(b => b.className = 'bias-btn');
      const filter = btn.dataset.filter;
      const cls = filter === 'all' ? 'active-all' : filter === 'bullish' ? 'active-bull' : filter === 'bearish' ? 'active-bear' : 'active-neut';
      btn.classList.add(cls);
      container.querySelectorAll('#heatmap-tbody tr').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.bias === filter) ? '' : 'none';
      });
    });
  });

  // Refresh
  document.getElementById('hm-refresh').addEventListener('click', () => {
    document.getElementById('hm-update-time').textContent = 'Updated: ' + new Date().toLocaleTimeString();
  });

  // Tooltip on th
  container.querySelectorAll('.heatmap-table th[title]').forEach(th => {
    th.style.cursor = 'help';
  });
}
