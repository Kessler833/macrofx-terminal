// ══ PAIRS PAGE ══
ROUTER.register('pairs', initPairs);

let _pairsChart = null;

function initPairs() {
  const container = document.getElementById('page-pairs');
  const pairs = STATE.config.defaultPairs;
  const signals = STATE.signals.length ? STATE.signals : MACRO.generateSignals();

  let activePair = pairs[0];

  function getSignal(p) { return signals.find(s => s.pair === p); }

  function pairList() {
    return pairs.map(p => {
      const sig = getSignal(p);
      const dirClass = sig ? (sig.direction === 'LONG' ? 'dir-long' : 'dir-short') : 'dir-none';
      const dirText  = sig ? sig.direction : 'NO SIG';
      return `<div class="pair-item ${p === activePair ? 'active' : ''}" data-pair="${p}">
        ${p}<span class="pair-dir-badge ${dirClass}">${dirText}</span></div>`;
    }).join('');
  }

  function renderDetail() {
    const base = activePair.slice(0,3), quote = activePair.slice(3,6);
    const sig = getSignal(activePair);
    const bScores = MACRO.DEMO_SCORES[base]  || {};
    const qScores = MACRO.DEMO_SCORES[quote] || {};
    const facs = MACRO.FACTORS.slice(0, 10);
    const labels = facs.map(f => f.label);
    const bVals  = facs.map(f => bScores[f.id] || 0);
    const qVals  = facs.map(f => qScores[f.id] || 0);

    const detail = container.querySelector('.pairs-detail');
    if (!detail) return;
    detail.innerHTML = `
      <div class="panel-header">📈 ${activePair} — Macro Factor Breakdown
        ${sig ? `<div class="header-actions"><span class="badge ${sig.direction === 'LONG' ? 'badge-bull' : 'badge-bear'}">${sig.direction} ${sig.confidence}%</span></div>` : ''}
      </div>
      <div class="pairs-chart-area">
        <div class="radar-container">
          <canvas id="radar-chart" width="380" height="380"></canvas>
        </div>
      </div>`;

    setTimeout(() => {
      if (_pairsChart) { _pairsChart.destroy(); _pairsChart = null; }
      const ctx = document.getElementById('radar-chart');
      if (!ctx) return;
      _pairsChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            { label: base, data: bVals, borderColor: '#7aa2f7', backgroundColor: 'rgba(122,162,247,0.15)', pointBackgroundColor: '#7aa2f7', borderWidth: 2 },
            { label: quote, data: qVals, borderColor: '#ef5350', backgroundColor: 'rgba(239,83,80,0.1)', pointBackgroundColor: '#ef5350', borderWidth: 2 }
          ]
        },
        options: {
          responsive: false,
          plugins: { legend: { labels: { color: '#6c7086', font: { size: 11, family: 'Inter' } } } },
          scales: { r: {
            min: -2, max: 2,
            ticks: { color: '#3a3a5e', backdropColor: 'transparent', stepSize: 1 },
            grid:  { color: '#1e1e30' },
            pointLabels: { color: '#6c7086', font: { size: 10, family: 'Inter' } },
            angleLines: { color: '#1e1e30' }
          }}
        }
      });
    }, 50);
  }

  function render() {
    container.innerHTML = `
      <div class="pairs-page">
        <div class="pairs-sidebar">
          <div class="panel-header">📈 Pairs</div>
          <div class="pairs-list">${pairList()}</div>
        </div>
        <div class="pairs-detail"></div>
      </div>`;
    renderDetail();
    container.querySelectorAll('.pair-item').forEach(el => {
      el.addEventListener('click', () => {
        activePair = el.dataset.pair;
        container.querySelectorAll('.pair-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
        container.querySelector('.pairs-list').innerHTML = pairList();
        renderDetail();
      });
    });
  }

  render();
}
