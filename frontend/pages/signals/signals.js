// ══ SIGNALS PAGE ══
ROUTER.register('signals', initSignals);

function initSignals() {
  const container = document.getElementById('page-signals');
  const signals = MACRO.generateSignals();

  let activeIdx = 0;

  function renderCards() {
    return signals.map((s, i) => `
      <div class="signal-card ${i === activeIdx ? 'active' : ''}" data-idx="${i}">
        <div class="signal-card-header">
          <span class="signal-pair">${s.pair}</span>
          <span class="signal-dir ${s.direction.toLowerCase()}">${s.direction}</span>
        </div>
        <div class="signal-scores">
          <span class="score-pill"><strong>${s.base}</strong> ${s.baseScore > 0 ? '+' : ''}${s.baseScore}</span>
          <span class="score-pill"><strong>${s.quote}</strong> ${s.quoteScore > 0 ? '+' : ''}${s.quoteScore}</span>
          <span class="score-pill" style="margin-left:auto">\u0394 ${s.diff > 0 ? '+' : ''}${s.diff.toFixed(1)}</span>
        </div>
        <div class="signal-meta">
          <span>Conf: ${s.confidence}%</span>
          <span>~${s.holdingDays}d hold</span>
          <span>${s.baseBias} vs ${s.quoteBias}</span>
        </div>
        <div class="confidence-bar"><div class="confidence-fill" style="width:${s.confidence}%"></div></div>
      </div>`).join('');
  }

  function renderDetail(s) {
    const facs = MACRO.FACTORS.filter(f => f.id !== 'news');
    const bScores = STATE.macroData[s.base]  || MACRO.DEMO_SCORES[s.base]  || {};
    const qScores = STATE.macroData[s.quote] || MACRO.DEMO_SCORES[s.quote] || {};

    const bars = facs.map(f => {
      const bv = bScores[f.id] || 0;
      const qv = qScores[f.id] || 0;
      const bPct = (bv + 2) / 4 * 100;
      const qPct = (qv + 2) / 4 * 100;
      const bColor = bv >= 1 ? 'var(--green)' : bv <= -1 ? 'var(--red)' : 'var(--muted)';
      const qColor = qv >= 1 ? 'var(--green)' : qv <= -1 ? 'var(--red)' : 'var(--muted)';
      return `
        <div class="factor-bar-row">
          <span class="factor-bar-label">${f.label}</span>
          <div class="factor-bar-track"><div class="factor-bar-fill" style="width:${bPct}%;background:${bColor}"></div></div>
          <span class="factor-bar-val" style="color:${bColor}">${bv > 0 ? '+' : ''}${bv}</span>
        </div>
        <div class="factor-bar-row">
          <span class="factor-bar-label" style="color:var(--faint)"></span>
          <div class="factor-bar-track"><div class="factor-bar-fill" style="width:${qPct}%;background:${qColor}"></div></div>
          <span class="factor-bar-val" style="color:${qColor}">${qv > 0 ? '+' : ''}${qv}</span>
        </div>`;
    }).join('<hr style="border:none;border-top:1px solid var(--border);margin:4px 0">');

    return `
      <div class="panel-header">⚡ Signal Detail — ${s.pair}
        <div class="header-actions">
          <span class="badge ${s.direction === 'LONG' ? 'badge-bull' : 'badge-bear'}">${s.direction}</span>
        </div>
      </div>
      <div class="signal-detail">
        <div class="detail-block">
          <div class="kpi-grid">
            <div class="kpi-item"><div class="kpi-label">Confidence</div><div class="kpi-value" style="color:var(--accent)">${s.confidence}%</div><div class="kpi-sub">CMSI signal strength</div></div>
            <div class="kpi-item"><div class="kpi-label">Score Diff</div><div class="kpi-value">${s.diff > 0 ? '+' : ''}${s.diff.toFixed(2)}</div><div class="kpi-sub">${s.base} vs ${s.quote}</div></div>
            <div class="kpi-item"><div class="kpi-label">${s.base} Score</div><div class="kpi-value" style="color:${s.baseScore >= 0.5 ? 'var(--green)' : s.baseScore <= -0.5 ? 'var(--red)' : 'var(--muted)'}">${s.baseScore > 0 ? '+' : ''}${s.baseScore}</div><div class="kpi-sub">${s.baseBias}</div></div>
            <div class="kpi-item"><div class="kpi-label">${s.quote} Score</div><div class="kpi-value" style="color:${s.quoteScore >= 0.5 ? 'var(--green)' : s.quoteScore <= -0.5 ? 'var(--red)' : 'var(--muted)'}">${s.quoteScore > 0 ? '+' : ''}${s.quoteScore}</div><div class="kpi-sub">${s.quoteBias}</div></div>
            <div class="kpi-item"><div class="kpi-label">Est. Holding</div><div class="kpi-value">${s.holdingDays}d</div><div class="kpi-sub">Swing duration</div></div>
            <div class="kpi-item"><div class="kpi-label">Strategy</div><div class="kpi-value" style="font-size:11px">CMSI Swing</div><div class="kpi-sub">Macro-driven</div></div>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-title">Factor Breakdown — ${s.base} (top) vs ${s.quote} (bottom)</div>
          ${bars}
        </div>
      </div>`;
  }

  function render() {
    const s = signals[activeIdx];
    container.innerHTML = `
      <div class="signals-page">
        <div class="signals-list">
          <div class="panel-header">⚡ Active Signals <span style="margin-left:auto;font-size:10px;color:var(--faint)">${signals.length} signals</span></div>
          <div class="signals-scroll">${renderCards()}</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
          ${signals.length ? renderDetail(s) : '<div class="loading-placeholder">No signals — configure API keys for live data</div>'}
        </div>
      </div>`;

    container.querySelectorAll('.signal-card').forEach(card => {
      card.addEventListener('click', () => {
        activeIdx = parseInt(card.dataset.idx);
        render();
      });
    });
  }

  render();
}
